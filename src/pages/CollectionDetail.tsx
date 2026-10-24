import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import { useCollection } from "@/hooks/use-contentful";
import { buildLqipUrl } from "@/lib/contentful";
import { ContentfulPicture } from "@/components/ContentfulPicture";
import { Skeleton } from "@/components/ui/skeleton";
import Lightbox from "@/components/Lightbox";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const PAGE_SIZE = 20;
const THUMBNAIL_SIZES = "(max-width: 768px) calc(100vw - 32px), (max-width: 1024px) 50vw, calc(33vw - 32px)";

interface MediaPhoto {
  type: "photo";
  url: string;
  width?: number;
  height?: number;
  contentType?: string;
}

interface MediaVideo {
  type: "video";
  url: string;
}

type MediaItem = MediaPhoto | MediaVideo;

/** Video item within the collection detail grid */
const VideoItem = ({
  src,
  altText,
  onClick,
}: {
  src: string;
  index: number;
  altText: string;
  onClick: () => void;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Append #t=0.001 to force browser to decode the first video frame as poster
  const videoSource = src.includes("#t=") ? src : `${src}#t=0.001`;

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Ignore autoplay rejection if blocked
      });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="cursor-pointer group relative overflow-hidden rounded-xl shadow-md bg-neutral-900"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`Play video: ${altText}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-950 flex items-center justify-center">
        {!isLoaded && (
          <Skeleton className="w-full h-full absolute inset-0 z-10" />
        )}
        <video
          ref={videoRef}
          src={videoSource}
          preload="metadata"
          muted
          loop
          playsInline
          onLoadedMetadata={() => setIsLoaded(true)}
          onLoadedData={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-90 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-black/80 shadow-lg">
            <Play size={24} className="fill-white translate-x-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

/** Photo item within the collection detail grid */
const PhotoItem = ({
  src,
  index,
  altText,
  contentType,
  onClick,
}: {
  src: string;
  index: number;
  altText: string;
  contentType?: string;
  onClick: () => void;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isAboveTheFold = index < 6;
  const isEager = index < 3;
  const isPriority = index === 0;
  const lqipUrl = buildLqipUrl(src);

  return (
    <div
      className="cursor-pointer group relative overflow-hidden rounded-xl shadow-md"
      onClick={onClick}
    >
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
          src={src}
          contentType={contentType}
          preset="thumbnail"
          sizes={THUMBNAIL_SIZES}
          alt={altText}
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

  // Combine photos and optional video (appended at the end)
  const mediaItems = useMemo<MediaItem[]>(() => {
    const list: MediaItem[] = (collection?.photos ?? []).map((photo) => ({
      type: "photo",
      url: photo.url,
      width: photo.width,
      height: photo.height,
      contentType: photo.contentType,
    }));
    if (collection?.videoUrl) {
      list.push({
        type: "video",
        url: collection.videoUrl,
      });
    }
    return list;
  }, [collection?.photos, collection?.videoUrl]);

  // Infinite scroll: number of media items currently rendered
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleMedia = mediaItems.slice(0, visibleCount);
  const hasMore = visibleCount < mediaItems.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, mediaItems.length));
  }, [mediaItems.length]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goToPrevious = () => {
    if (!collection) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? mediaItems.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    if (!collection) return;
    setCurrentImageIndex((prev) =>
      prev === mediaItems.length - 1 ? 0 : prev + 1
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full aspect-[3/4] rounded-xl bg-muted/30" />
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
        <link rel="canonical" href={`https://www.hristinageorgievska.com/collection/${slug}`} />
        <meta property="og:url" content={`https://www.hristinageorgievska.com/collection/${slug}`} />
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

      {/* Media grid (photos + optional trailing video) — renders in batches via infinite scroll */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pb-16">
        {visibleMedia.map((item, index) => {
          const isVideo = item.type === "video";
          const altText = isVideo
            ? `${collection.title || "Portfolio"} - ${collection.client || "Gallery"} Makeup and Hair Video Reel`
            : `${collection.title || "Portfolio"} - ${collection.client || "Gallery"} Makeup and Hair by Hristina Georgievska - Photo ${index + 1}`;

          if (isVideo) {
            return (
              <VideoItem
                key={`video-${item.url}-${index}`}
                src={item.url}
                index={index}
                altText={altText}
                onClick={() => openLightbox(index)}
              />
            );
          }

          return (
            <PhotoItem
              key={item.url + index}
              src={item.url}
              contentType={item.contentType}
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

      {/* Lightbox for viewing individual photos/video */}
      <Lightbox
        isOpen={lightboxOpen}
        imageUrl={mediaItems[currentImageIndex]?.url ?? ""}
        isVideo={mediaItems[currentImageIndex]?.type === "video"}
        imageWidth={mediaItems[currentImageIndex]?.type === "photo" ? (mediaItems[currentImageIndex] as MediaPhoto).width : undefined}
        imageHeight={mediaItems[currentImageIndex]?.type === "photo" ? (mediaItems[currentImageIndex] as MediaPhoto).height : undefined}
        contentType={mediaItems[currentImageIndex]?.type === "photo" ? (mediaItems[currentImageIndex] as MediaPhoto).contentType : undefined}
        imageDetails={{
          client: collection.client,
          name: collection.title,
          photographer: collection.photographer,
        }}
        currentIndex={currentImageIndex}
        totalImages={mediaItems.length}
        onClose={closeLightbox}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
    </div>
  );
};

export default CollectionDetail;
