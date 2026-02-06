import { useVideos } from "@/hooks/use-contentful";
import { Skeleton } from "@/components/ui/skeleton";

const VideoSection = () => {
  const { data: videos = [], isLoading, isError } = useVideos();

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
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
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
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
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
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
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="group">
              <div className="aspect-video bg-secondary rounded-xl overflow-hidden shadow-md">
                <iframe
                  src={video.embedUrl}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              {(video.title || video.description) && (
                <div className="mt-3 px-1">
                  {video.title && (
                    <h3 className="font-semibold text-foreground">
                      {video.title}
                    </h3>
                  )}
                  {video.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
