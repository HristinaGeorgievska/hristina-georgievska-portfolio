import { useState } from "react";
import Lightbox from "./Lightbox";

// Import all gallery images
import portrait1 from "@/assets/gallery/portrait-1.jpg";
import portrait2 from "@/assets/gallery/portrait-2.jpg";
import portrait3 from "@/assets/gallery/portrait-3.jpg";
import portrait4 from "@/assets/gallery/portrait-4.jpg";
import portrait5 from "@/assets/gallery/portrait-5.jpg";
import portrait6 from "@/assets/gallery/portrait-6.jpg";
import portrait7 from "@/assets/gallery/portrait-7.jpg";
import landscape1 from "@/assets/gallery/landscape-1.jpg";
import landscape2 from "@/assets/gallery/landscape-2.jpg";
import landscape3 from "@/assets/gallery/landscape-3.jpg";

interface GalleryImage {
  src: string;
  alt: string;
  span?: "tall" | "wide" | "normal";
}

const galleryImages: GalleryImage[] = [
  { src: portrait1, alt: "Beauty portrait with smoky eyes", span: "tall" },
  { src: landscape1, alt: "Artistic avant-garde makeup", span: "normal" },
  { src: portrait2, alt: "Elegant fashion editorial with red dress", span: "tall" },
  { src: portrait4, alt: "Bold creative colorful makeup", span: "normal" },
  { src: landscape2, alt: "Natural glowing skin beauty shot", span: "normal" },
  { src: portrait3, alt: "Bridal makeup editorial", span: "tall" },
  { src: portrait6, alt: "Colorful eyeshadow close-up", span: "normal" },
  { src: landscape3, alt: "High fashion editorial", span: "normal" },
  { src: portrait5, alt: "Evening makeup with metallic eyeshadow", span: "tall" },
  { src: portrait7, alt: "Luxury beauty editorial", span: "tall" },
];

const MasonryGallery = () => {
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
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      <div className="max-w-5xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-4 px-4 py-8">
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className="mb-4 break-inside-avoid cursor-pointer group"
            onClick={() => openLightbox(index)}
          >
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-500" />
            </div>
          </div>
        ))}
      </div>

      <Lightbox
        isOpen={lightboxOpen}
        imageUrl={galleryImages[currentImageIndex]?.src || ""}
        onClose={closeLightbox}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
    </>
  );
};

export default MasonryGallery;
