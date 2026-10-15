import { useState } from "react";
import { Link } from "react-router-dom";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import type { PhotoCollection } from "@/lib/contentful";
import { buildSrcSet } from "@/lib/contentful";

interface AnimatedGalleryItemProps {
  item: PhotoCollection;
  index: number;
}

const AnimatedGalleryItem = ({ item, index }: AnimatedGalleryItemProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
  });

  return (
    <div
      ref={ref}
      className={`mb-4 break-inside-avoid group relative overflow-hidden rounded-xl shadow-md transition-all duration-500 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6"
      }`}
      // Cap the stagger so the last card never waits more than ~600 ms
      style={{ transitionDelay: `${Math.min(index, 8) * 75}ms` }}
    >
      <Link to={`/collection/${item.slug}`} className="block">
        {/* Skeleton loading state */}
        {!isLoaded && (
          <Skeleton className="w-full aspect-[3/4] absolute inset-0 z-10" />
        )}

        {/* Cover Image */}
        <img
          src={item.coverUrl}
          srcSet={buildSrcSet(item.coverUrl)}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={`${item.title || "Portfolio"} - ${item.client || "Gallery"} Makeup and Hair by Hristina Georgievska`}
          className={`w-full h-auto object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-90 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />

        {/* Hover overlay with collection info */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="text-white flex flex-col justify-end gap-1">
            {item.client && (
              <p className="text-xs font-semibold uppercase tracking-widest opacity-90">
                {item.client}
              </p>
            )}

            {item.title && <p className="text-2xl font-bold">{item.title}</p>}

            {item.photographer && (
              <p className="text-xs font-medium opacity-70">
                Photo: {item.photographer}
              </p>
            )}

            <p className="text-xs font-medium uppercase tracking-wider mt-2 opacity-60">
              View Collection →
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AnimatedGalleryItem;
