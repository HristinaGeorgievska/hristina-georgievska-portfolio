import { useQuery } from "@tanstack/react-query";
import {
  getCollections,
  getCollectionBySlug,
  getVideos,
  GalleryCategory,
  PhotoCollection,
  Video,
} from "@/lib/contentful";

// Collections update periodically — keep fresh data for 15 minutes,
// and hold the in-memory cache for 24 hours across route navigations.
const STALE_TIME = 15 * 60 * 1000; // 15 minutes
const GC_TIME = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetch photo collections by category from Contentful
 */
export function useCollections(category: GalleryCategory) {
  return useQuery<PhotoCollection[], Error>({
    queryKey: ["collections", category],
    queryFn: () => getCollections(category),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
  });
}

/**
 * Fetch a single photo collection by slug from Contentful
 */
export function useCollection(slug: string) {
  return useQuery<PhotoCollection | null, Error>({
    queryKey: ["collection", slug],
    queryFn: () => getCollectionBySlug(slug),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
    enabled: !!slug,
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
    gcTime: GC_TIME,
    retry: 2,
  });
}
