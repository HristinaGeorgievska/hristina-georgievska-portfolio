import { useState } from "react";
import Lightbox from "./Lightbox";
import AnimatedGalleryItem from "./AnimatedGalleryItem";

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
  client?: string;
  name?: string;
  photographer?: string;
}

const galleryImages: GalleryImage[] = [
  { src: portrait1, alt: "Beauty portrait with smoky eyes", client: "Elle Magazine", name: "Smoky Elegance", photographer: "Anna Lee" },
  { src: landscape1, alt: "Artistic avant-garde makeup", client: "Artistic Vision", name: "Avant-Garde", photographer: "Michael Chen" },
  { src: portrait2, alt: "Elegant fashion editorial with red dress", client: "Fashion Weekly", name: "Red Passion", photographer: "Sophie Martin" },
  { src: portrait4, alt: "Bold creative colorful makeup", client: "Creative Arts", name: "Color Burst", photographer: "David Park" },
  { src: landscape2, alt: "Natural glowing skin beauty shot", client: "Skin Care Co", name: "Natural Glow", photographer: "Emma Wilson" },
  { src: portrait3, alt: "Bridal makeup editorial", client: "Bridal Magazine", name: "Wedding Dreams", photographer: "James Liu" },
  { src: portrait6, alt: "Colorful eyeshadow close-up", client: "Beauty Trends", name: "Eye Candy", photographer: "Lisa Park" },
  { src: landscape3, alt: "High fashion editorial", client: "High Fashion", name: "Runway Ready", photographer: "Marc Johnson" },
  { src: portrait5, alt: "Evening makeup with metallic eyeshadow", client: "Evening Luxe", name: "Metallic Night", photographer: "Sarah Kim" },
  { src: portrait7, alt: "Luxury beauty editorial", client: "Luxury Living", name: "Pure Luxury", photographer: "Chris Lee" },
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
        {galleryImages.map((item, index) => (
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
        imageUrl={galleryImages[currentImageIndex]?.src || ""}
        onClose={closeLightbox}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
    </>
  );
};

export default MasonryGallery;
