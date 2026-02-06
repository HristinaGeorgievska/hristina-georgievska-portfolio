import { useState } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";

interface GalleryImage {
  src: string;
  alt: string;
  client?: string;
  name?: string;
  photographer?: string;
}

interface AnimatedGalleryItemProps {
  item: GalleryImage;
  index: number;
  onClick: () => void;
}

const AnimatedGalleryItem = ({ item, index, onClick }: AnimatedGalleryItemProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
  });

  return (
    <div
      ref={ref}
      className={`mb-4 break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl shadow-md transition-all duration-500 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 75}ms` }}
      onClick={onClick}
    >
      {/* Skeleton loading state */}
      {!isLoaded && (
        <Skeleton className="w-full aspect-[3/4] absolute inset-0 z-10" />
      )}

      {/* Image */}
      <img
        src={item.src}
        alt={item.name || item.client || "Portfolio ukázka - Master Your Face"}
        className={`w-full h-auto object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-90 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
      />

      {/* Hover text overlay - only shown if there's content */}
      {(item.client || item.name || item.photographer) && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="text-white flex flex-col justify-end gap-1">
            {item.client && (
              <p className="text-xs font-semibold uppercase tracking-widest opacity-90">
                {item.client}
              </p>
            )}

            {item.name && <p className="text-2xl font-bold">{item.name}</p>}

            {item.photographer && (
              <p className="text-xs font-medium opacity-70">Foto: {item.photographer}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedGalleryItem;
