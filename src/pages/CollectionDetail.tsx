import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCollection } from "@/hooks/use-contentful";
import { buildSrcSet, buildLqipUrl } from "@/lib/contentful";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import Lightbox from "@/components/Lightbox";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const PAGE_SIZE = 20;

/** Animated photo item within the collection detail grid */
const PhotoItem = ({
  src,
  index,
  altText,
  onClick,
}: {
  src: string;
  index: number;
  altText: string;
  onClick: () => void;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isAboveTheFold = index < 4;
  const isLcp = index < 2;

  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
  });

  const showContent = isAboveTheFold || isVisible;
  const lqipUrl = buildLqipUrl(src);

  return (
    <div
      ref={isAboveTheFold ? undefined : ref}
      className={`mb-4 break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl shadow-md transition-all duration-500 ease-out ${
        showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      // Stagger per-batch so each new batch animates within 1.5 s
      style={{
        transitionDelay: isAboveTheFold ? "0ms" : `${(index % PAGE_SIZE) * 75}ms`,
      }}
      onClick={onClick}
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-200 dark:bg-neutral-800">
        {/* LQIP blurred background placeholder */}
        {lqipUrl && !isLoaded && (
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
        <img
          src={src}
          srcSet={buildSrcSet(src)}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={altText}
          width={800}
          height={1067}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-90 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading={isAboveTheFold ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={isLcp ? "high" : undefined}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </div>
  );
};

/** Invisible sentinel that triggers loading the next batch when scrolled into view */
const LoadMoreSentinel = ({ onVisible }: { onVisible: () => void }) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onVisible();
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  return <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />;
};

const CollectionDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: collection, isLoading, isError } = useCollection(slug || "");

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Infinite scroll: number of photos currently rendered
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const photos = collection?.photos ?? [];
  const visiblePhotos = photos.slice(0, visibleCount);
  const hasMore = visibleCount < photos.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, photos.length));
  }, [photos.length]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goToPrevious = () => {
    if (!collection) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? photos.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    if (!collection) return;
    setCurrentImageIndex((prev) =>
      prev === photos.length - 1 ? 0 : prev + 1
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-32 mb-8" />
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="mb-4 break-inside-avoid">
                <Skeleton className="w-full aspect-[3/4] rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error / not found
  if (isError || !collection) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground mb-6">
            {isError
              ? "Failed to load collection. Please try again later."
              : "Collection not found."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{collection.title} | Makeup &amp; Hair by Hristina Georgievska</title>
        <meta
          name="description"
          content={collection.description || `View the ${collection.title} gallery. Makeup and hair styling by Prague-based artist Hristina Georgievska.`}
        />
        <link rel="canonical" href={`https://hristinageorgievska.com/collection/${slug}`} />
      </Helmet>
      <Header />

      {/* Breadcrumb / back navigation */}
      <div className="max-w-5xl mx-auto px-4 pt-4 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm tracking-wider text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back
        </button>
      </div>

      {/* Collection header */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        {collection.client && (
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            {collection.client}
          </p>
        )}
        <h1 className="font-serif text-2xl md:text-3xl tracking-wider text-foreground">
          {collection.title}
        </h1>
        {collection.photographer && (
          <p className="text-sm text-muted-foreground mt-1">
            Photo: {collection.photographer}
          </p>
        )}
        {collection.description && (
          <p className="text-muted-foreground mt-3 leading-relaxed max-w-2xl">
            {collection.description}
          </p>
        )}
      </div>

      {/* Photos grid — renders in batches via infinite scroll */}
      <div className="max-w-5xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-4 px-4 pb-16">
        {visiblePhotos.map((photoUrl, index) => {
          const altText = `${collection.title || "Portfolio"} - ${collection.client || "Gallery"} Makeup and Hair by Hristina Georgievska - Photo ${index + 1}`;
          return (
            <PhotoItem
              key={photoUrl + index}
              src={photoUrl}
              index={index}
              altText={altText}
              onClick={() => openLightbox(index)}
            />
          );
        })}
      </div>

      {/* Auto-load sentinel — fires when user scrolls near the bottom */}
      {hasMore && <LoadMoreSentinel onVisible={loadMore} />}

      <Footer />
      <ScrollToTop />

      {/* Lightbox for viewing individual photos */}
      <Lightbox
        isOpen={lightboxOpen}
        imageUrl={photos[currentImageIndex] || ""}
        imageDetails={{
          client: collection.client,
          name: collection.title,
          photographer: collection.photographer,
        }}
        currentIndex={currentImageIndex}
        totalImages={photos.length}
        onClose={closeLightbox}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
    </div>
  );
};

export default CollectionDetail;
