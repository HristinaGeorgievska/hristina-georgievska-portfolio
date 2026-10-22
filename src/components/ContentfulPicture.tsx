import { useMemo } from "react";
import {
  buildImageUrl,
  buildSrcSet,
  FULL_IMAGE_WIDTHS,
  getFallbackImageFormat,
  JPEG_QUALITY,
  THUMBNAIL_IMAGE_WIDTHS,
} from "@/lib/contentful";

export type ContentfulPicturePreset = "thumbnail" | "full";

interface ContentfulPictureProps {
  src: string;
  alt: string;
  sizes: string;
  width?: number;
  height?: number;
  contentType?: string;
  preset?: ContentfulPicturePreset;
  className?: string;
  pictureClassName?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  decoding?: "async" | "sync" | "auto";
  onLoad?: () => void;
}

const PRESET_WIDTHS = {
  thumbnail: THUMBNAIL_IMAGE_WIDTHS,
  full: FULL_IMAGE_WIDTHS,
} as const;

const PRESET_FALLBACK_WIDTH = {
  thumbnail: 1024,
  full: 1600,
} as const;

export function ContentfulPicture({
  src,
  alt,
  sizes,
  width,
  height,
  contentType,
  preset = "thumbnail",
  className,
  pictureClassName,
  loading = "lazy",
  fetchPriority,
  decoding = "async",
  onLoad,
}: ContentfulPictureProps) {
  const sources = useMemo(() => {
    const widths = PRESET_WIDTHS[preset];
    const fallbackWidth = PRESET_FALLBACK_WIDTH[preset];
    const fallbackFm = getFallbackImageFormat(src, contentType);
    const fallbackQuality = JPEG_QUALITY;
    return {
      avifSrcSet: buildSrcSet(src, { fm: "avif", widths }),
      webpSrcSet: buildSrcSet(src, { fm: "webp", widths }),
      fallbackSrcSet: buildSrcSet(src, {
        fm: fallbackFm,
        q: fallbackQuality,
        widths,
      }),
      fallbackSrc:
        buildImageUrl(src, {
          fm: fallbackFm,
          q: fallbackQuality,
          w: fallbackWidth,
        }) ?? src,
    };
  }, [src, preset, contentType]);

  const priorityProps = fetchPriority ? { fetchPriority } : {};
  const dimensionProps =
    width !== undefined && height !== undefined ? { width, height } : {};

  if (!sources.avifSrcSet || !sources.webpSrcSet || !sources.fallbackSrcSet) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        onLoad={onLoad}
        {...dimensionProps}
        {...priorityProps}
      />
    );
  }

  return (
    <picture className={pictureClassName}>
      <source type="image/avif" srcSet={sources.avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={sources.webpSrcSet} sizes={sizes} />
      <img
        src={sources.fallbackSrc}
        srcSet={sources.fallbackSrcSet}
        sizes={sizes}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        onLoad={onLoad}
        {...dimensionProps}
        {...priorityProps}
      />
    </picture>
  );
}
