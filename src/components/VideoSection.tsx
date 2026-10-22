import { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useVideos } from "@/hooks/use-contentful";
import { Skeleton } from "@/components/ui/skeleton";
import { buildLqipUrl } from "@/lib/contentful";
import { ContentfulPicture } from "@/components/ContentfulPicture";

const VIDEO_THUMB_SIZES = "(max-width: 768px) 100vw, 50vw";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface VideoItem {
  id: string;
  title: string;
  embedUrl?: string;
  videoFileUrl?: string;
  thumbnailUrl?: string;
  description?: string;
}

// ---------------------------------------------------------------------------
// VideoPlayer — iframe or native <video> (autoplay when opened in modal)
// ---------------------------------------------------------------------------
const VideoPlayer = ({
  video,
}: {
  video: Pick<VideoItem, "embedUrl" | "videoFileUrl" | "title">;
}) => {
  if (video.videoFileUrl) {
    return (
      <video
        src={video.videoFileUrl}
        title={video.title}
        className="w-full h-full object-cover"
        controls
        autoPlay
        playsInline
        preload="metadata"
      />
    );
  }

  if (video.embedUrl) {
    const autoplayUrl = video.embedUrl.includes("?")
      ? `${video.embedUrl}&autoplay=1`
      : `${video.embedUrl}?autoplay=1`;

    return (
      <iframe
        src={autoplayUrl}
        title={video.title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-secondary">
      <p className="text-muted-foreground text-sm tracking-wider">No video source</p>
    </div>
  );
};

// ---------------------------------------------------------------------------
// VideoModal — mirrors Lightbox.tsx structure exactly, with prev/next
// ---------------------------------------------------------------------------
const VideoModal = ({
  video,
  currentIndex,
  totalVideos,
  onClose,
  onPrevious,
  onNext,
}: {
  video: VideoItem;
  currentIndex: number;
  totalVideos: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrevious();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrevious, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-background/80 hover:text-background transition-colors z-10"
        aria-label="Close video"
      >
        <X size={28} />
      </button>

      {/* Previous button — hidden on mobile, same as Lightbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrevious(); }}
        className="hidden md:block absolute left-8 p-2 text-background/80 hover:text-background transition-colors z-10"
        aria-label="Previous video"
      >
        <ChevronLeft size={40} />
      </button>

      {/* Video container */}
      <div
        className="flex flex-col items-center max-w-[90vw] w-full max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full aspect-video rounded-lg overflow-hidden shadow-2xl">
          <VideoPlayer video={video} />
        </div>

        {/* Title + description — mirrors Lightbox detail block */}
        <div className="mt-4 text-center text-background animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-xl md:text-2xl font-bold mb-1">{video.title}</h3>
          {video.description && (
            <div className="text-sm opacity-60 prose prose-sm max-w-xl mx-auto [&_p]:text-background/60">
              <ReactMarkdown skipHtml>{video.description}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Counter */}
        <div className="mt-3 text-center text-background/60 text-sm font-medium tracking-wide">
          {currentIndex + 1} / {totalVideos}
        </div>
      </div>

      {/* Next button — hidden on mobile, same as Lightbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="hidden md:block absolute right-8 p-2 text-background/80 hover:text-background transition-colors z-10"
        aria-label="Next video"
      >
        <ChevronRight size={40} />
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------------
// VideoCard — lightweight poster with reserved aspect ratio & immediate render
// ---------------------------------------------------------------------------
const VideoCard = ({
  video,
  index,
  onPlay,
}: {
  video: VideoItem;
  index: number;
  onPlay: (index: number) => void;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isPriority = index === 0;
  const lqipUrl = buildLqipUrl(video.thumbnailUrl);

  return (
    <div className="group relative overflow-hidden rounded-xl shadow-md bg-neutral-200 dark:bg-neutral-800 aspect-video">
      <button
        className="block w-full h-full text-left relative"
        onClick={() => onPlay(index)}
        aria-label={`Play ${video.title}`}
      >
        {video.thumbnailUrl ? (
          <>
            {/* LQIP blurred placeholder */}
            {lqipUrl && !isLoaded && (
              <img
                src={lqipUrl}
                alt=""
                aria-hidden="true"
                width={20}
                height={11}
                className="absolute inset-0 w-full h-full object-cover filter blur-md scale-105 pointer-events-none"
                decoding="async"
              />
            )}

            <ContentfulPicture
              src={video.thumbnailUrl}
              preset="thumbnail"
              sizes={VIDEO_THUMB_SIZES}
              alt={video.title}
              width={800}
              height={450}
              pictureClassName="absolute inset-0 h-full w-full"
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-90 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading={isPriority ? "eager" : "lazy"}
              fetchPriority={isPriority ? "high" : undefined}
              onLoad={() => setIsLoaded(true)}
            />
          </>
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <p className="text-muted-foreground text-sm tracking-wider">Coming Soon</p>
          </div>
        )}

        {/* Title overlay — always visible */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 z-10">
          <div className="text-white flex flex-col justify-end gap-1">
            <p className="text-2xl font-bold">{video.title}</p>
            <p className="text-xs font-medium uppercase tracking-wider mt-2 opacity-60 transition-opacity duration-300 group-hover:opacity-100">
              Watch →
            </p>
          </div>
        </div>
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------------
// VideoSection — main export
// ---------------------------------------------------------------------------
const VideoSection = () => {
  const { data: videos = [], isLoading, isError } = useVideos();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <section id="video-section" className="pt-8 pb-16 px-4 md:py-16 md:px-8">
        <h2 className="md:hidden font-serif text-2xl uppercase tracking-widest text-foreground text-center pb-6">Video</h2>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-video rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section id="video-section" className="pt-8 pb-16 px-4 md:py-16 md:px-8">
        <h2 className="md:hidden font-serif text-2xl uppercase tracking-widest text-foreground text-center pb-6">Video</h2>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-muted-foreground">
            Failed to load videos. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const isEmpty = videos.length === 0;
  const displayVideos: VideoItem[] = isEmpty
    ? [1, 2, 3, 4].map((n) => ({
        id: String(n),
        title: `Video ${n}`,
        thumbnailUrl: undefined,
        embedUrl: undefined,
        videoFileUrl: undefined,
      }))
    : videos;

  const handlePrevious = () =>
    setActiveIndex((i) => (i !== null ? (i - 1 + displayVideos.length) % displayVideos.length : null));

  const handleNext = () =>
    setActiveIndex((i) => (i !== null ? (i + 1) % displayVideos.length : null));

  return (
    <>
      {activeIndex !== null && (
        <VideoModal
          video={displayVideos[activeIndex]}
          currentIndex={activeIndex}
          totalVideos={displayVideos.length}
          onClose={() => setActiveIndex(null)}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}

      <section id="video-section" className="pt-8 pb-16 px-4 md:py-16 md:px-8">
        <h2 className="md:hidden font-serif text-2xl uppercase tracking-widest text-foreground text-center pb-6">Video</h2>
        <h2 className="sr-only">Video Portfolio</h2>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayVideos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                index={index}
                onPlay={isEmpty ? () => {} : setActiveIndex}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default VideoSection;
