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
  photos?: ContentfulImage[];
  category: GalleryCategory;
  client?: string;
  photographer?: string;
  description?: string;
}

export interface ContentfulImage {
  url: string;
  width?: number;
  height?: number;
  contentType?: string;
}

export type ContentfulImageFormat = "avif" | "webp" | "jpg" | "png";
export type ContentfulFallbackFormat = "jpg" | "png";

export interface ContentfulImageParams {
  fm: ContentfulImageFormat;
  q?: number;
  w?: number;
}

/** Default Images API quality (75–80). JPEG uses the top of the range. */
export const IMAGE_QUALITY = 75;
export const JPEG_QUALITY = 80;

export const CONTENTFUL_IMAGE_WIDTHS = [640, 1024, 1600, 2400] as const;
export const THUMBNAIL_IMAGE_WIDTHS = [400, 640, 1024, 1600] as const;
export const FULL_IMAGE_WIDTHS = [1024, 1600, 2400] as const;

function parseContentfulAssetUrl(url: string): URL | undefined {
  try {
    const absolute = url.startsWith("//") ? `https:${url}` : url;
    const parsed = new URL(absolute);
    if (!parsed.hostname.endsWith("ctfassets.net")) {
      return undefined;
    }
    return parsed;
  } catch {
    return undefined;
  }
}

/**
 * Build a Contentful Images API URL from a raw asset URL.
 * Sets `fm` (avif/webp/jpg), `q` (75–80), and optional `w`.
 */
export function buildImageUrl(
  url: string | undefined,
  params: ContentfulImageParams
): string | undefined {
  if (!url || typeof url !== "string") return undefined;
  const parsed = parseContentfulAssetUrl(url);
  if (!parsed) return undefined;

  if (parsed.hostname === "assets.ctfassets.net") {
    parsed.hostname = "images.ctfassets.net";
  }

  const quality =
    params.q ?? (params.fm === "jpg" || params.fm === "png" ? JPEG_QUALITY : IMAGE_QUALITY);

  const transformed = new URL(parsed.pathname, parsed.origin);
  transformed.searchParams.set("fm", params.fm);
  transformed.searchParams.set("q", String(quality));
  if (params.w !== undefined) {
    transformed.searchParams.set("w", String(params.w));
  }
  return transformed.toString();
}

/**
 * Generate a srcset string for a Contentful image URL in a single format.
 */
export function buildSrcSet(
  url: string | undefined,
  options: {
    fm: ContentfulImageFormat;
    q?: number;
    widths?: readonly number[];
  }
): string | undefined {
  const widths = options.widths ?? CONTENTFUL_IMAGE_WIDTHS;
  const entries = widths.map((width) => {
    const built = buildImageUrl(url, {
      fm: options.fm,
      q: options.q,
      w: width,
    });
    return built ? `${built} ${width}w` : undefined;
  });
  if (entries.some((entry) => !entry)) return undefined;
  return entries.join(", ");
}

/**
 * Generate a tiny blurred placeholder (LQIP) URL for a Contentful image URL.
 */
export function buildLqipUrl(url?: string): string | undefined {
  return buildImageUrl(url, { fm: "webp", q: 20, w: 20 });
}

/** JPG fallback flattens alpha; keep PNG assets as PNG. */
export function getFallbackImageFormat(
  url: string | undefined,
  contentType?: string
): ContentfulFallbackFormat {
  if (contentType === "image/png") return "png";
  if (!url) return "jpg";
  const parsed = parseContentfulAssetUrl(url);
  const path = (parsed?.pathname ?? url).split("?")[0].toLowerCase();
  return path.endsWith(".png") ? "png" : "jpg";
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
    director?: EntryFieldTypes.Text;
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
  director?: string;
}

// Create Contentful client lazily to avoid throwing during import when env vars are missing
let cachedClient: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (cachedClient) return cachedClient;

  const space = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
  const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;

  if (!space || !accessToken) {
    console.warn(
      "Contentful configuration missing: VITE_CONTENTFUL_SPACE_ID and VITE_CONTENTFUL_ACCESS_TOKEN are required to fetch CMS content."
    );
    return null;
  }

  cachedClient = createClient({
    space,
    accessToken,
  });

  return cachedClient;
}

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

interface ContentfulAssetFile {
  url?: string;
  contentType?: string;
  details?: {
    image?: {
      width?: number;
      height?: number;
    };
  };
}

interface ContentfulAsset {
  fields?: {
    file?: ContentfulAssetFile;
  };
}

/**
 * Extract a protocol-normalized image from a resolved Contentful asset,
 * including intrinsic dimensions when Contentful provides them.
 */
function getAssetImage(asset: unknown): ContentfulImage | undefined {
  if (!asset || typeof asset !== "object") return undefined;
  const file = (asset as ContentfulAsset).fields?.file;
  if (!file?.url || typeof file.url !== "string") return undefined;
  const width = file.details?.image?.width;
  const height = file.details?.image?.height;
  return {
    url: file.url.startsWith("//") ? `https:${file.url}` : file.url,
    width: typeof width === "number" ? width : undefined,
    height: typeof height === "number" ? height : undefined,
    contentType:
      typeof file.contentType === "string" ? file.contentType : undefined,
  };
}

function getAssetUrl(asset: unknown): string | undefined {
  return getAssetImage(asset)?.url;
}

function getAssetImages(assets: unknown): ContentfulImage[] {
  if (!assets || !Array.isArray(assets)) return [];
  return assets
    .map((asset) => getAssetImage(asset))
    .filter((image): image is ContentfulImage => !!image);
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
  const client = getClient();
  if (!client) return [];

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
  const client = getClient();
  if (!client) return null;

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
    photos: getAssetImages(fields.photos),
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
  const client = getClient();
  if (!client) return [];

  const response = await client.getEntries<VideoSkeleton>({
    content_type: "video",
    order: ["fields.order" as const],
    include: 2,
  });

  return response.items.map((entry) => {
    const fields = entry.fields as typeof entry.fields & { Director?: unknown };
    const rawEmbed = fields.embedUrl ? String(fields.embedUrl) : "";
    const videoFileUrl = getAssetUrl(fields.videoFile);
    const rawDirector = fields.director ?? fields.Director;

    return {
      id: entry.sys.id,
      title: String(fields.title ?? ""),
      embedUrl: rawEmbed ? parseEmbedUrl(rawEmbed) : undefined,
      videoFileUrl,
      thumbnailUrl: getAssetUrl(fields.thumbnail),
      description: fields.description
        ? String(fields.description)
        : undefined,
      director: rawDirector ? String(rawDirector) : undefined,
    };
  });
}
