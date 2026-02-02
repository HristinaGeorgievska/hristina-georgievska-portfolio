const VideoSection = () => {
  return (
    <section className="py-24 px-4 md:px-8 min-h-[60vh] flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        {/* Decorative line */}
        <div className="w-16 h-px bg-foreground/20 mx-auto mb-12" />
        
        {/* Artist branding */}
        <h2 className="text-xs tracking-[0.4em] text-muted-foreground mb-4">
          HRISTINA GEORGIEVSKA
        </h2>
        
        {/* Coming soon message */}
        <p className="text-3xl md:text-4xl font-light tracking-wide text-foreground mb-4">
          Coming Soon
        </p>
        
        <p className="text-sm tracking-wider text-muted-foreground mb-12">
          Video content in production
        </p>
        
        {/* Decorative line */}
        <div className="w-16 h-px bg-foreground/20 mx-auto" />
      </div>
    </section>
  );
};

export default VideoSection;
