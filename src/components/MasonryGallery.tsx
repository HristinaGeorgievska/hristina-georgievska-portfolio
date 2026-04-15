import AnimatedGalleryItem from "./AnimatedGalleryItem";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollections } from "@/hooks/use-contentful";
import type { GalleryCategory } from "@/lib/contentful";

interface MasonryGalleryProps {
  category?: GalleryCategory;
}

const MasonryGallery = ({ category = "fashion" }: MasonryGalleryProps) => {
  const { data: collections = [], isLoading, isError } = useCollections(category);

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
  if (isError || collections.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <p className="text-center text-muted-foreground">
          {isError
            ? "Failed to load gallery. Please try again later."
            : "No collections available in this gallery yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-4 px-4 py-8">
      {collections.map((collection, index) => (
        <AnimatedGalleryItem
          key={collection.id}
          item={collection}
          index={index}
        />
      ))}
    </div>
  );
};

export default MasonryGallery;
