import { useState } from "react";
import { Play, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useVideos } from "@/hooks/use-contentful";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

/** Renders either an iframe (embed) or a native <video> (uploaded file) */
const VideoPlayer = ({
  video,
}: {
  video: {
    embedUrl?: string;
    videoFileUrl?: string;
    title: string;
  };
}) => {
  if (video.videoFileUrl) {
    return (
      <video
        src={video.videoFileUrl}
        title={video.title}
        className="w-full h-full object-cover"
        controls
        playsInline
        preload="metadata"
      />
    );
  }

  if (video.embedUrl) {
    return (
      <iframe
        src={video.embedUrl}
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
      <p className="text-muted-foreground text-sm tracking-wider">
        No video source
      </p>
    </div>
  );
};

/** Animated card wrapper with intersection-observer reveal */
const AnimatedVideoCard = ({
  video,
  index,
}: {
  video: {
    id: string;
    title: string;
    embedUrl?: string;
    videoFileUrl?: string;
    thumbnailUrl?: string;
    description?: string;
  };
  index: number;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
  });

  const hasThumbnail = !!video.thumbnailUrl;
  const showThumbnail = hasThumbnail && !isPlaying;

  return (
    <div
      ref={ref}
      className={`group transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="aspect-video bg-secondary rounded-xl overflow-hidden shadow-md relative">
        {/* Thumbnail overlay — click to play */}
        {showThumbnail && (
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 z-10 cursor-pointer group/thumb"
            aria-label={`Play ${video.title}`}
          >
            {!thumbLoaded && (
              <Skeleton className="absolute inset-0 z-20 rounded-xl" />
            )}
            <img
              src={video.thumbnailUrl!}
              alt={video.title}
              className={`w-full h-full object-cover transition-all duration-700 group-hover/thumb:scale-105 group-hover/thumb:brightness-90 ${
                thumbLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              onLoad={() => setThumbLoaded(true)}
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/thumb:scale-110">
                <Play size={28} className="text-foreground ml-1" fill="currentColor" />
              </div>
            </div>
            {/* Gradient overlay for text legibility */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
          </button>
        )}

        {/* Actual video (iframe or native video) */}
        {(!hasThumbnail || isPlaying) && (
          <VideoPlayer video={video} />
        )}

        {/* Close button to return to thumbnail */}
        {isPlaying && hasThumbnail && (
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            aria-label="Close video"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Video info */}
      {(video.title || video.description) && (
        <div className="mt-3 px-1">
          {video.title && (
            <h3 className="font-semibold text-foreground">{video.title}</h3>
          )}
          {video.description && (
            <div className="text-sm text-muted-foreground mt-1 prose prose-sm prose-neutral max-w-none
              [&_p]:text-muted-foreground [&_p]:mb-1 [&_p]:leading-relaxed
              [&_strong]:text-foreground [&_strong]:font-semibold
              [&_em]:italic
              [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:opacity-80
              [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-1
              [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:mb-1
              [&_li]:mb-0.5
              [&_h1]:text-base [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mb-1
              [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mb-1
              [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mb-1
            ">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                  a: ({ children, href, ...props }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                      {children}
                    </a>
                  ),
                }}
              >
                {video.description}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const VideoSection = () => {
  const { data: videos = [], isLoading, isError } = useVideos();

  // Loading skeleton
  if (isLoading) {
    return (
      <section id="video-section" className="py-16 px-4 md:px-8">
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

  // Error state
  if (isError) {
    return (
      <section id="video-section" className="py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-muted-foreground">
            Failed to load videos. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  // Empty state
  if (videos.length === 0) {
    return (
      <section id="video-section" className="py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="aspect-video bg-secondary rounded-xl flex items-center justify-center"
              >
                <p className="text-muted-foreground text-sm tracking-wider">
                  Video {item} Coming Soon
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="video-section" className="py-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video, index) => (
            <AnimatedVideoCard key={video.id} video={video} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
