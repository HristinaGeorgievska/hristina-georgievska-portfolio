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

const FASHION_HERO_FALLBACK: PhotoCollection = {
  id: "fashion-1-hero",
  title: "Fashion 1",
  slug: "fashion-1",
  coverUrl:
    "https://images.ctfassets.net/4end2ob9xfig/17yFjuk2vRRscyr3W1Pm5G/44ca249575ea74ada41b01bea0f1bc52/00000830-PHOTO-2026-02-17-12-54-42.jpg",
  category: "fashion",
};

const MobileSectionHeading = ({ category }: { category: string }) => (
  <h2 className="md:hidden font-serif text-2xl uppercase tracking-widest text-foreground text-center pt-6 pb-2">
    {categoryLabel[category] ?? category}
  </h2>
);

const MasonryGallery = ({ category = "fashion" }: MasonryGalleryProps) => {
  const { data: collections = [], isLoading, isError } = useCollections(category);

  // Loading skeleton — render Fashion hero immediately without waiting for Contentful fetch
  if (isLoading) {
    return (
      <section>
        <MobileSectionHeading category={category} />
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-8">
          {category === "fashion" ? (
            <AnimatedGalleryItem item={FASHION_HERO_FALLBACK} index={0} />
          ) : (
            <div className="w-full aspect-[3/4] rounded-xl bg-muted/30" />
          )}
          {[...Array(5)].map((_, i) => (
            <div key={i + 1} className="w-full aspect-[3/4] rounded-xl bg-muted/30" />
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
