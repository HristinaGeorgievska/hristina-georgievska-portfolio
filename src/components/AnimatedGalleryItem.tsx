import { useState } from "react";
import { Link } from "react-router-dom";
import type { PhotoCollection } from "@/lib/contentful";
import { buildLqipUrl } from "@/lib/contentful";
import { ContentfulPicture } from "@/components/ContentfulPicture";

const THUMBNAIL_SIZES = "(max-width: 768px) calc(100vw - 32px), (max-width: 1024px) 50vw, calc(33vw - 32px)";

interface AnimatedGalleryItemProps {
  item: PhotoCollection;
  index: number;
}

const AnimatedGalleryItem = ({ item, index }: AnimatedGalleryItemProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isAboveTheFold = index < 6;
  const isEager = index < 3;
  const isPriority = index === 0;
  const lqipUrl = buildLqipUrl(item.coverUrl);

  return (
    <div className="group relative overflow-hidden rounded-xl shadow-md">
      <Link to={`/collection/${item.slug}`} className="block">
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-200 dark:bg-neutral-800">
          {/* Below-the-fold LQIP blurred background placeholder */}
          {!isAboveTheFold && lqipUrl && !isLoaded && (
            <img
              src={lqipUrl}
              alt=""
              aria-hidden="true"
              width={20}
              height={27}
              className="absolute inset-0 w-full h-full object-cover filter blur-md scale-105 pointer-events-none"
              decoding="async"
            />
          )}

          <ContentfulPicture
            src={item.coverUrl}
            preset="thumbnail"
            sizes={THUMBNAIL_SIZES}
            alt={`${item.title || "Portfolio"} - ${item.client || "Gallery"} Makeup and Hair by Hristina Georgievska`}
            width={800}
            height={1067}
            pictureClassName="absolute inset-0 h-full w-full"
            className={`absolute inset-0 h-full w-full object-cover group-hover:scale-105 group-hover:brightness-90 ${
              isAboveTheFold
                ? "opacity-100 transition-transform duration-500"
                : `transition-all duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`
            }`}
            loading={isEager ? "eager" : "lazy"}
            fetchPriority={isPriority ? "high" : undefined}
            onLoad={isAboveTheFold ? undefined : () => setIsLoaded(true)}
          />

          {/* Hover overlay with collection info */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
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
        </div>
      </Link>
    </div>
  );
};

export default AnimatedGalleryItem;
