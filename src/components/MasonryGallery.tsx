import AnimatedGalleryItem from "./AnimatedGalleryItem";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollections } from "@/hooks/use-contentful";
import type { GalleryCategory } from "@/lib/contentful";

interface MasonryGalleryProps {
  category?: GalleryCategory;
}

const categoryLabel: Record<string, string> = {
  fashion: "Fashion",
  beauty: "Beauty",
  advertising: "Advertising",
};

const MobileSectionHeading = ({ category }: { category: string }) => (
  <h2 className="md:hidden font-serif text-2xl uppercase tracking-widest text-foreground text-center pt-6 pb-2">
    {categoryLabel[category] ?? category}
  </h2>
);

const MasonryGallery = ({ category = "fashion" }: MasonryGalleryProps) => {
  const { data: collections = [], isLoading, isError } = useCollections(category);

  // Loading skeleton
  if (isLoading) {
    return (
      <section>
        <MobileSectionHeading category={category} />
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-full aspect-[3/4] rounded-xl bg-muted/30" />
          ))}
        </div>
      </section>
    );
  }

  // Error or empty state
  if (isError || collections.length === 0) {
    return (
      <section>
        <MobileSectionHeading category={category} />
        <div className="max-w-5xl mx-auto px-4 py-16">
          <p className="text-center text-muted-foreground">
            {isError
              ? "Failed to load gallery. Please try again later."
              : "No collections available in this gallery yet."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <MobileSectionHeading category={category} />
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-8">
        {collections.map((collection, index) => (
          <AnimatedGalleryItem
            key={collection.id}
            item={collection}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default MasonryGallery;
