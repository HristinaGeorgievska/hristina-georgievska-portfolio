import { useState } from "react";
import Lightbox from "./Lightbox";

import portrait1 from "@/assets/gallery/portrait-1.jpg";
import portrait2 from "@/assets/gallery/portrait-2.jpg";
import portrait5 from "@/assets/gallery/portrait-5.jpg";

const commercialImages = [
  { src: portrait2, alt: "Harper's Bazaar Editorial" },
  { src: portrait1, alt: "Vogue Beauty Campaign" },
  { src: portrait5, alt: "L'Oréal Paris Commercial" },
];

const CommercialSection = () => {
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
      prev === 0 ? commercialImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === commercialImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      <div className="max-w-5xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-4 px-4 py-8">
        {commercialImages.map((image, index) => (
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
        imageUrl={commercialImages[currentImageIndex]?.src || ""}
        onClose={closeLightbox}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
    </>
  );
};

export default CommercialSection;
