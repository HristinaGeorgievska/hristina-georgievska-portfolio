import { useState } from "react";
import Lightbox from "./Lightbox";
import AnimatedGalleryItem from "./AnimatedGalleryItem";
import { Skeleton } from "@/components/ui/skeleton";
import { useGalleryImages } from "@/hooks/use-contentful";
import type { GalleryCategory } from "@/lib/contentful";

export interface GalleryImage {
  src: string;
  alt: string;
  client?: string;
  name?: string;
  photographer?: string;
}

interface MasonryGalleryProps {
  category?: GalleryCategory;
}

const MasonryGallery = ({ category = "fashion" }: MasonryGalleryProps) => {
  const { data: images = [], isLoading, isError } = useGalleryImages(category);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-4 px-4 py-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="mb-4 break-inside-avoid">
            <Skeleton className="w-full aspect-[3/4] rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  // Error or empty state
  if (isError || images.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <p className="text-center text-muted-foreground">
          {isError
            ? "Failed to load gallery. Please try again later."
            : "No images available in this gallery yet."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-4 px-4 py-8">
        {images.map((item, index) => (
          <AnimatedGalleryItem
            key={index}
            item={item}
            index={index}
            onClick={() => openLightbox(index)}
          />
        ))}
      </div>

      <Lightbox
        isOpen={lightboxOpen}
        imageUrl={images[currentImageIndex]?.src || ""}
        imageDetails={{
          client: images[currentImageIndex]?.client,
          name: images[currentImageIndex]?.name,
          photographer: images[currentImageIndex]?.photographer,
        }}
        currentIndex={currentImageIndex}
        totalImages={images.length}
        onClose={closeLightbox}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
    </>
  );
};

export default MasonryGallery;
