import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCollection } from "@/hooks/use-contentful";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import Lightbox from "@/components/Lightbox";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/Footer";

/** Animated photo item within the collection detail grid */
const PhotoItem = ({
  src,
  index,
  onClick,
}: {
  src: string;
  index: number;
  onClick: () => void;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
  });

  return (
    <div
      ref={ref}
      className={`mb-4 break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl shadow-md transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 75}ms` }}
      onClick={onClick}
    >
      {!isLoaded && (
        <Skeleton className="w-full aspect-[3/4] absolute inset-0 z-10" />
      )}
      <img
        src={src}
        alt={`Photo ${index + 1}`}
        className={`w-full h-auto object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-90 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

const CollectionDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: collection, isLoading, isError } = useCollection(slug || "");

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goToPrevious = () => {
    if (!collection) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? collection.photos.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    if (!collection) return;
    setCurrentImageIndex((prev) =>
      prev === collection.photos.length - 1 ? 0 : prev + 1
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

      {/* Photos grid */}
      <div className="max-w-5xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-4 px-4 pb-16">
        {collection.photos.map((photoUrl, index) => (
          <PhotoItem
            key={index}
            src={photoUrl}
            index={index}
            onClick={() => openLightbox(index)}
          />
        ))}
      </div>

      <Footer />
      <ScrollToTop />

      {/* Lightbox for viewing individual photos */}
      <Lightbox
        isOpen={lightboxOpen}
        imageUrl={collection.photos[currentImageIndex] || ""}
        imageDetails={{
          client: collection.client,
          name: collection.title,
          photographer: collection.photographer,
        }}
        currentIndex={currentImageIndex}
        totalImages={collection.photos.length}
        onClose={closeLightbox}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
    </div>
  );
};

export default CollectionDetail;
