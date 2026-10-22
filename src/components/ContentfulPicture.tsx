import { useMemo } from "react";
import {
  buildImageUrl,
  buildSrcSet,
  FULL_IMAGE_WIDTHS,
  JPEG_QUALITY,
  THUMBNAIL_IMAGE_WIDTHS,
} from "@/lib/contentful";
export type ContentfulPicturePreset = "thumbnail" | "full";

interface ContentfulPictureProps {
  src: string;
  alt: string;
  sizes: string;
  width: number;
  height: number;
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
    return {
      avifSrcSet: buildSrcSet(src, { fm: "avif", widths }),
      webpSrcSet: buildSrcSet(src, { fm: "webp", widths }),
      jpgSrcSet: buildSrcSet(src, { fm: "jpg", q: JPEG_QUALITY, widths }),
      fallbackSrc:
        buildImageUrl(src, {
          fm: "jpg",
          q: JPEG_QUALITY,
          w: fallbackWidth,
        }) ?? src,
    };
  }, [src, preset]);

  const priorityProps = fetchPriority
    ? { fetchPriority }
    : {};

  if (!sources.avifSrcSet || !sources.webpSrcSet || !sources.jpgSrcSet) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loading}
        decoding={decoding}
        onLoad={onLoad}
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
        srcSet={sources.jpgSrcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loading}
        decoding={decoding}
        onLoad={onLoad}
        {...priorityProps}
      />
    </picture>
  );
}
