import { useState } from "react";
import Lightbox from "./Lightbox";

import portrait1 from "@/assets/gallery/portrait-1.jpg";
import portrait2 from "@/assets/gallery/portrait-2.jpg";
import portrait5 from "@/assets/gallery/portrait-5.jpg";

const commercialImages = [
  { src: portrait2, alt: "Harper's Bazaar Editorial", client: "Harper's Bazaar", name: "Summer Glow", photographer: "Photo by James Chen" },
  { src: portrait1, alt: "Vogue Beauty Campaign", client: "Vogue Beauty", name: "Midnight Luxe", photographer: "Photo by Sarah Kim" },
  { src: portrait5, alt: "L'Oréal Paris Commercial", client: "L'Oréal Paris", name: "Radiant Skin", photographer: "Photo by Marc Dubois" },
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
                className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-90"
                loading="lazy"
              />
              {/* Bottom overlay with gradient */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-xs font-semibold uppercase tracking-widest text-background opacity-90">
                  {image.client}
                </p>
                <p className="text-2xl font-bold text-background">
                  {image.name}
                </p>
                <p className="text-xs font-medium text-background opacity-70">
                  {image.photographer}
                </p>
              </div>
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
