import { createClient, type EntryFieldTypes } from "contentful";

// Types for Contentful content models
export type GalleryCategory = "fashion" | "beauty" | "advertising";

// --- Photo Collection ---

interface PhotoCollectionSkeleton {
  contentTypeId: "photoCollection";
  fields: {
    title: EntryFieldTypes.Text;
    slug: EntryFieldTypes.Text;
    coverImage: EntryFieldTypes.AssetLink;
    photos: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
    category: EntryFieldTypes.Text;
    client: EntryFieldTypes.Text;
    photographer: EntryFieldTypes.Text;
    description: EntryFieldTypes.Text;
    order: EntryFieldTypes.Integer;
  };
}

/** Frontend-facing type for a photo collection */
export interface PhotoCollection {
  id: string;
  title: string;
  slug: string;
  coverUrl: string;
  /** Only populated when fetching a single collection (detail page). */
  photos?: string[];
  category: GalleryCategory;
  client?: string;
  photographer?: string;
  description?: string;
}

/**
 * Generate a srcset string for a Contentful image URL.
 * Strips any existing `w=` parameter and emits 400w, 800w, 1200w, 1920w variants.
 */
export function buildSrcSet(url?: string): string | undefined {
  if (!url || typeof url !== "string" || !url.includes("ctfassets.net")) {
    return undefined;
  }
  const base = url.replace(/([?&])w=\d+(&|$)/, (_m, pre, post) =>
    post ? pre : ""
  );
  const sep = base.includes("?") ? "&" : "?";
  return [400, 800, 1200, 1920]
    .map((w) => `${base}${sep}w=${w} ${w}w`)
    .join(", ");
}

// --- Video ---

interface VideoSkeleton {
  contentTypeId: "video";
  fields: {
    title: EntryFieldTypes.Text;
    embedUrl: EntryFieldTypes.Text;
    videoFile: EntryFieldTypes.AssetLink;
    thumbnail: EntryFieldTypes.AssetLink;
    description: EntryFieldTypes.Text;
    order: EntryFieldTypes.Integer;
  };
}

export interface Video {
  id: string;
  title: string;
  /** Parsed embed URL for YouTube/Vimeo iframes */
  embedUrl?: string;
  /** Direct video file URL from Contentful asset upload */
  videoFileUrl?: string;
  thumbnailUrl?: string;
  description?: string;
}

// Create Contentful client
const client = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID || "",
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || "",
});

/**
 * Parse YouTube/Vimeo URL into embeddable iframe URL
 */
export function parseEmbedUrl(url: string): string | undefined {
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (youtubeMatch) {
    return `https://www.youtube-nocookie.com/embed/${youtubeMatch[1]}`;
  }

  const vimeoMatch = url.match(
    /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/
  );
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return undefined;
}

/**
 * Extract asset URL from a resolved Contentful asset
 */
function getAssetUrl(asset: unknown, width: number = 800): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const a = asset as any;
  if (!a?.fields?.file?.url) return undefined;
  const url = a.fields.file.url as string;
  let finalUrl = url.startsWith("//") ? `https:${url}` : url;

  const contentType = a.fields.file.contentType;
  const isImage = contentType?.startsWith("image/") && contentType !== "image/svg+xml";
  if (isImage || finalUrl.match(/\.(jpg|jpeg|png|webp|avif)$/i)) {
    finalUrl += `?fm=webp&q=80&w=${width}`;
  }

  return finalUrl;
}

/**
 * Extract multiple asset URLs from resolved Contentful assets array
 */
function getAssetUrls(assets: unknown, width: number = 1920): string[] {
  if (!assets || !Array.isArray(assets)) return [];
  return assets
    .map((asset) => getAssetUrl(asset, width))
    .filter((url): url is string => !!url);
}

/**
 * Fetch photo collections by category
 */
/**
 * Fields we actually need for the gallery overview.
 * `fields.photos` is intentionally excluded to avoid fetching ~500 asset
 * URLs on every category page load — photos are only fetched in
 * `getCollectionBySlug` when the user opens a specific collection.
 */
const COLLECTION_LIST_SELECT = [
  "sys.id",
  "fields.title",
  "fields.slug",
  "fields.coverImage",
  "fields.category",
  "fields.client",
  "fields.photographer",
  "fields.description",
  "fields.order",
] as const;

export async function getCollections(
  category: GalleryCategory
): Promise<PhotoCollection[]> {
  const response = await client.getEntries<PhotoCollectionSkeleton>({
    content_type: "photoCollection",
    "fields.category": category,
    order: ["fields.order" as const],
    // include:1 resolves only the coverImage asset link (one level deep).
    // We don't need include:2 since photos are excluded via select.
    include: 1,
    // Guard against the 100-entry default — up to 200 collections per category.
    limit: 200,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select: COLLECTION_LIST_SELECT as any,
  });

  return response.items
    .map((entry) => {
      const fields = entry.fields;
      const coverUrl = getAssetUrl(fields.coverImage);

      if (!coverUrl) return null;

      const result: PhotoCollection = {
        id: entry.sys.id,
        title: String(fields.title ?? ""),
        slug: String(fields.slug ?? ""),
        coverUrl,
        // photos intentionally omitted — fetched only on the detail page
        category: String(fields.category ?? "fashion") as GalleryCategory,
        client: fields.client ? String(fields.client) : undefined,
        photographer: fields.photographer
          ? String(fields.photographer)
          : undefined,
        description: fields.description
          ? String(fields.description)
          : undefined,
      };
      return result;
    })
    .filter((item): item is PhotoCollection => item !== null);
}

/**
 * Fetch a single photo collection by slug
 */
export async function getCollectionBySlug(
  slug: string
): Promise<PhotoCollection | null> {
  const response = await client.getEntries<PhotoCollectionSkeleton>({
    content_type: "photoCollection",
    "fields.slug": slug,
    limit: 1,
    include: 2,
  });

  if (response.items.length === 0) return null;

  const entry = response.items[0];
  const fields = entry.fields;
  const coverUrl = getAssetUrl(fields.coverImage);

  if (!coverUrl) return null;

  return {
    id: entry.sys.id,
    title: String(fields.title ?? ""),
    slug: String(fields.slug ?? ""),
    coverUrl,
    photos: getAssetUrls(fields.photos),
    category: String(fields.category ?? "fashion") as GalleryCategory,
    client: fields.client ? String(fields.client) : undefined,
    photographer: fields.photographer
      ? String(fields.photographer)
      : undefined,
    description: fields.description ? String(fields.description) : undefined,
  };
}

/**
 * Fetch all videos
 */
export async function getVideos(): Promise<Video[]> {
  const response = await client.getEntries<VideoSkeleton>({
    content_type: "video",
    order: ["fields.order" as const],
    include: 2,
  });

  return response.items.map((entry) => {
    const fields = entry.fields;
    const rawEmbed = fields.embedUrl ? String(fields.embedUrl) : "";
    const videoFileUrl = getAssetUrl(fields.videoFile);

    return {
      id: entry.sys.id,
      title: String(fields.title ?? ""),
      embedUrl: rawEmbed ? parseEmbedUrl(rawEmbed) : undefined,
      videoFileUrl,
      thumbnailUrl: getAssetUrl(fields.thumbnail),
      description: fields.description
        ? String(fields.description)
        : undefined,
    };
  });
}
