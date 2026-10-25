import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Helmet>
        <title>Page Not Found | Hristina Georgievska</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="description"
          content="The page you are looking for does not exist. Explore the makeup and hair portfolio by Prague-based artist Hristina Georgievska."
        />
      </Helmet>

      <div>
        <Header asH1={false} />
        <Navigation activeSection="" />

        <main className="max-w-xl mx-auto px-4 pt-16 pb-24 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-3">
            Error 404
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-wider text-foreground mb-4">
            Page Not Found
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-8 font-light">
            The page you are looking for has been moved, renamed, or does not exist.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-medium text-foreground border border-foreground/30 hover:border-foreground transition-all duration-300 rounded-sm group active:scale-[0.98]"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              Return to Portfolio
            </Link>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
