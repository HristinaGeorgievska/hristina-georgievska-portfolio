import { useQuery } from "@tanstack/react-query";
import {
  getGalleryImages,
  getVideos,
  GalleryCategory,
  GalleryImage,
  Video,
} from "@/lib/contentful";

const STALE_TIME = 5 * 60 * 1000; // 5 minutes cache

/**
 * Fetch gallery images by category from Contentful
 */
export function useGalleryImages(category: GalleryCategory) {
  return useQuery<GalleryImage[], Error>({
    queryKey: ["galleryImages", category],
    queryFn: () => getGalleryImages(category),
    staleTime: STALE_TIME,
    retry: 2,
  });
}

/**
 * Fetch all videos from Contentful
 */
export function useVideos() {
  return useQuery<Video[], Error>({
    queryKey: ["videos"],
    queryFn: getVideos,
    staleTime: STALE_TIME,
    retry: 2,
  });
}
