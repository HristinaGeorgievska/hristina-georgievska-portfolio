import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface AboutSectionProps {
  photoSrc?: string;
}

const DEFAULT_PORTRAIT = "/images/hristina-portrait.jpg";

const WORK_PREVIEWS = [
  {
    title: "Fashion",
    path: "/fashion",
    image: "/images/work-fashion.jpg",
  },
  {
    title: "Beauty",
    path: "/beauty",
    image: "/images/work-beauty.jpg",
  },
  {
    title: "Video",
    path: "/video",
    image: "/images/work-video.jpg",
  },
];

const EDITORIAL_CREDITS = [
  "Vogue CS",
  "Harper's Bazaar",
  "Elle Czech",
  "Marie Claire",
  "InStyle",
  "Dolce Vita",
  "Esquire",
];

const AboutSection = ({ photoSrc = DEFAULT_PORTRAIT }: AboutSectionProps) => {
  return (
    <section className="pt-4 pb-16 px-4 md:py-12 md:px-8">
      {/* Mobile-only section title */}
      <h2 className="md:hidden font-serif text-2xl tracking-widest text-foreground text-center pb-8">
        ABOUT
      </h2>

      <div className="max-w-5xl mx-auto">
        {/* Main 2-column Editorial Split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
          {/* Portrait Column (5 cols on desktop) */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden bg-muted/20 shadow-sm border border-border/40">
              <img
                src={photoSrc}
                alt="Hristina Georgievska — Hair & Makeup Artist"
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                fetchPriority="high"
                decoding="async"
                width={800}
                height={1200}
              />
            </div>
          </div>

          {/* Editorial Bio Column (7 cols on desktop) */}
          <div className="md:col-span-7 flex flex-col justify-center text-left">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium mb-3">
              Prague · Hair & Makeup Artist
            </p>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-tight text-foreground mb-6">
              Creating character, texture, and light across fashion and film for over 28 years.
            </h1>

            <p className="text-sm md:text-base text-foreground/80 leading-relaxed font-normal">
              With nearly three decades of dedicated experience, Hristina Georgievska is one of
              Central Europe&apos;s most sought-after hair and makeup artists, renowned for her
              refined editorial aesthetic and mastery of light, skin, and sculptural hair design.
            </p>

            {/* Editorial Features / Clients */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 font-medium">
                Selected Editorial & Commercial Features
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {EDITORIAL_CREDITS.map((credit) => (
                  <span
                    key={credit}
                    className="text-xs uppercase tracking-[0.1em] text-foreground font-medium"
                  >
                    {credit}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Actions / Navigation */}
            <div className="mt-8 flex flex-wrap items-center gap-8">
              <Link
                to="/fashion"
                className="group relative inline-flex items-center gap-2 py-1 text-xs uppercase tracking-[0.15em] font-medium text-foreground transition-all duration-300"
              >
                <span>View Fashion Portfolio</span>
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute bottom-0 left-0 right-[0.15em] h-[1px] bg-foreground scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </Link>
              <Link
                to="/contact"
                className="group relative inline-flex items-center gap-2 py-1 text-xs uppercase tracking-[0.15em] font-medium text-foreground transition-all duration-300"
              >
                <span>Get in Touch</span>
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute bottom-0 left-0 right-[0.15em] h-[1px] bg-foreground scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Strip of Work: Row of 3 Thumbnails linking to Fashion, Beauty, Video */}
        <div className="mt-10 md:mt-12 pt-8 border-t border-border/40">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
              Explore Portfolios
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {WORK_PREVIEWS.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="group block relative overflow-hidden rounded-2xl border border-border/40 bg-muted/20 shadow-sm transition-all duration-500 hover:shadow-md"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={`${item.title} portfolio`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                  />
                </div>
                <div className="p-4 flex items-center justify-between bg-card/60 backdrop-blur-xs">
                  <h3 className="text-sm uppercase tracking-[0.1em] font-medium text-foreground group-hover:text-foreground transition-colors">
                    {item.title}
                  </h3>
                  <div className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center text-foreground transition-all duration-300 group-hover:bg-foreground group-hover:text-background group-hover:border-foreground">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
