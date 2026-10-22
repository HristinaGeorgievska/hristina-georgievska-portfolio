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
  director?: string;
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-white/80 hover:text-white transition-colors z-10"
        aria-label="Close video"
      >
        <X size={28} />
      </button>

      {/* Previous button — hidden on mobile, same as Lightbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrevious(); }}
        className="hidden md:block absolute left-8 p-2 text-white/80 hover:text-white transition-colors z-10"
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
        <div className="mt-4 text-center text-white animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-xl md:text-2xl font-bold mb-1 text-white">{video.title}</h3>
          {video.director && (
            <p className="text-sm opacity-70 mb-2">
              {/^dir(ector)?:/i.test(video.director) ? video.director : `Director: ${video.director}`}
            </p>
          )}
          {video.description && (
            <div className="text-sm opacity-60 prose prose-sm max-w-xl mx-auto [&_p]:text-white/60">
              <ReactMarkdown skipHtml>{video.description}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Counter */}
        <div className="mt-4 text-center text-white/70 text-sm font-medium tracking-wide">
          {currentIndex + 1} / {totalVideos}
        </div>
      </div>

      {/* Next button — hidden on mobile, same as Lightbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="hidden md:block absolute right-8 p-2 text-white/80 hover:text-white transition-colors z-10"
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPlay(index);
    }
  };

  return (
    <button
      type="button"
      onClick={() => onPlay(index)}
      onKeyDown={handleKeyDown}
      aria-label={`Play ${video.title}`}
      className="group flex flex-col w-full text-left rounded-xl cursor-pointer outline-none focus:outline-none focus-visible:outline-none"
    >
      {/* Flat thumbnail with corner radius matching Fashion */}
      <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800">
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
              className={`absolute inset-0 h-full w-full object-cover scale-100 brightness-100 transition-all duration-500 ease-out [@media(hover:hover)]:group-hover:scale-105 [@media(hover:hover)]:group-hover:brightness-90 motion-reduce:group-hover:!transform-none motion-reduce:!transform-none ${
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
      </div>

      {/* Caption — 10px below image, 4px between title and director */}
      <div className="mt-[10px] w-full">
        <p className="font-sans text-[17px] font-normal leading-snug text-foreground [text-wrap:balance] text-balance">
          <span className="relative inline-block pb-0.5">
            {video.title}<span className="absolute bottom-0 left-0 right-[0.1em] h-[1px] bg-foreground transition-all duration-300 ease-out origin-left scale-x-0 opacity-0 [@media(hover:hover)]:group-hover:scale-x-100 [@media(hover:hover)]:group-hover:opacity-100 group-focus-visible:scale-x-100 group-focus-visible:opacity-100" />
          </span>
        </p>
        {video.director && (
          <p className="text-sm text-muted-foreground mt-[4px] font-normal">
            {/^dir(ector)?:/i.test(video.director) ? video.director : `Director: ${video.director}`}
          </p>
        )}
      </div>
    </button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-[44px]">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col">
                <Skeleton className="aspect-video rounded-xl" />
                <div className="mt-[10px] space-y-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
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
    ? [
        {
          id: "1",
          title: "Vogue Czechoslovakia",
          director: "Branislav Šimončík",
          thumbnailUrl: undefined,
          embedUrl: undefined,
          videoFileUrl: undefined,
        },
        {
          id: "2",
          title: "Elle Beauty Special",
          director: "Matúš Tóth",
          thumbnailUrl: undefined,
          embedUrl: undefined,
          videoFileUrl: undefined,
        },
        {
          id: "3",
          title: "Harper's Bazaar Editorial",
          director: "Lukáš Dvořák",
          thumbnailUrl: undefined,
          embedUrl: undefined,
          videoFileUrl: undefined,
        },
        {
          id: "4",
          title: "Mercedes-Benz Campaign",
          director: "Petr Kurečka",
          thumbnailUrl: undefined,
          embedUrl: undefined,
          videoFileUrl: undefined,
        },
      ]
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-[44px]">
            {displayVideos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                index={index}
                onPlay={setActiveIndex}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default VideoSection;
