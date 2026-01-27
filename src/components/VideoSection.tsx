const VideoSection = () => {
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-2xl md:text-3xl tracking-wider text-foreground mb-8">
          Video Work
        </h2>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          Behind-the-scenes and editorial video content coming soon.
        </p>
        
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
