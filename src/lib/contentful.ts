import { createClient, Entry, Asset, EntrySkeletonType } from "contentful";

// Types for Contentful content models
export type GalleryCategory = "fashion" | "beauty" | "commercial";

interface GalleryImageFields {
  title: string;
  image: Asset;
  alt: string;
  client?: string;
  name?: string;
  photographer?: string;
  category: GalleryCategory;
  order?: number;
}

interface VideoFields {
  title: string;
  embedUrl: string;
  thumbnail?: Asset;
  description?: string;
  order?: number;
}

// Entry skeleton types for Contentful SDK
interface GalleryImageSkeleton extends EntrySkeletonType {
  contentTypeId: "galleryImage";
  fields: GalleryImageFields;
}

interface VideoSkeleton extends EntrySkeletonType {
  contentTypeId: "video";
  fields: VideoFields;
}

// Frontend-facing types (matching existing GalleryImage interface)
export interface GalleryImage {
  src: string;
  alt: string;
  client?: string;
  name?: string;
  photographer?: string;
}

export interface Video {
  id: string;
  title: string;
  embedUrl: string;
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
export function parseEmbedUrl(url: string): string {
  // YouTube patterns
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (youtubeMatch) {
    return `https://www.youtube-nocookie.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo patterns
  const vimeoMatch = url.match(
    /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/
  );
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Return as-is if already an embed URL or unknown format
  return url;
}

/**
 * Extract asset URL from Contentful Asset
 */
function getAssetUrl(asset: Asset | undefined): string | undefined {
  if (!asset?.fields?.file?.url) return undefined;
  const url = asset.fields.file.url as string;
  return url.startsWith("//") ? `https:${url}` : url;
}

/**
 * Fetch gallery images by category
 */
export async function getGalleryImages(
  category: GalleryCategory
): Promise<GalleryImage[]> {
  const response = await client.getEntries<GalleryImageSkeleton>({
    content_type: "galleryImage",
    "fields.category": category,
    order: ["fields.order"],
    include: 2, // Include linked assets
  });

  return response.items
    .map((entry: Entry<GalleryImageSkeleton>) => {
      const fields = entry.fields;
      const imageUrl = getAssetUrl(fields.image as Asset);

      if (!imageUrl) return null;

      return {
        src: imageUrl,
        alt: (fields.alt as string) || (fields.title as string) || "",
        client: fields.client as string | undefined,
        name: fields.name as string | undefined,
        photographer: fields.photographer as string | undefined,
      };
    })
    .filter((item): item is GalleryImage => item !== null);
}

/**
 * Fetch all videos
 */
export async function getVideos(): Promise<Video[]> {
  const response = await client.getEntries<VideoSkeleton>({
    content_type: "video",
    order: ["fields.order"],
    include: 2,
  });

  return response.items.map((entry: Entry<VideoSkeleton>) => {
    const fields = entry.fields;
    return {
      id: entry.sys.id,
      title: fields.title as string,
      embedUrl: parseEmbedUrl(fields.embedUrl as string),
      thumbnailUrl: getAssetUrl(fields.thumbnail as Asset | undefined),
      description: fields.description as string | undefined,
    };
  });
}
