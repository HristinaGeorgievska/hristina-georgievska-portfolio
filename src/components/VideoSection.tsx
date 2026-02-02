const VideoSection = () => {
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
};

export default VideoSection;
