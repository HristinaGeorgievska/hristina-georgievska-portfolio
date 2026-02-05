import { useState } from "react";
import Lightbox from "./Lightbox";
import AnimatedGalleryItem from "./AnimatedGalleryItem";

// Import all gallery images
import portrait1 from "@/assets/gallery/portrait-1.jpg";
import portrait2 from "@/assets/gallery/portrait-2.jpg";
import portrait3 from "@/assets/gallery/portrait-3.jpg";
import portrait4 from "@/assets/gallery/portrait-4.jpg";
import portrait5 from "@/assets/gallery/portrait-5.jpg";
import landscape1 from "@/assets/gallery/landscape-1.jpg";
import landscape2 from "@/assets/gallery/landscape-2.jpg";

export interface GalleryImage {
  src: string;
  alt: string;
  client?: string;
  name?: string;
  photographer?: string;
}

const fashionImages: GalleryImage[] = [
  { src: portrait1, alt: "High fashion editorial look", client: "Vogue Italia", name: "Milano Dreams", photographer: "Anna Lee" },
  { src: landscape1, alt: "Runway inspired styling", client: "Fashion Week", name: "Runway Ready", photographer: "Michael Chen" },
  { src: portrait2, alt: "Elegant fashion editorial with red dress", client: "Harper's Bazaar", name: "Red Passion", photographer: "Sophie Martin" },
  { src: portrait4, alt: "Bold editorial statement", client: "Elle Magazine", name: "Bold Statement", photographer: "David Park" },
  { src: landscape2, alt: "Avant-garde fashion shoot", client: "W Magazine", name: "Avant-Garde", photographer: "Emma Wilson" },
  { src: portrait3, alt: "Couture fashion styling", client: "L'Officiel", name: "Couture Dreams", photographer: "James Liu" },
  { src: portrait5, alt: "Evening fashion editorial", client: "Glamour", name: "Evening Luxe", photographer: "Sarah Kim" },
];

interface MasonryGalleryProps {
  images?: GalleryImage[];
}

const MasonryGallery = ({ images = fashionImages }: MasonryGalleryProps) => {
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
