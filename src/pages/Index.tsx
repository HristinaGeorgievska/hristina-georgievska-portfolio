import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import MasonryGallery from "@/components/MasonryGallery";
import BeautyGallery from "@/components/BeautyGallery";
import VideoSection from "@/components/VideoSection";
import AdvertisingSection from "@/components/AdvertisingSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const VALID_SECTIONS = ["fashion", "beauty", "advertising", "video", "contact"] as const;
type SectionType = (typeof VALID_SECTIONS)[number];

interface SectionMeta {
  title: string;
  description: string;
  path: string;
}

const SECTION_METADATA: Record<SectionType, SectionMeta> = {
  fashion: {
    title: "Hristina Georgievska | Make-up Artist & Hair Stylist (Prague)",
    description:
      "Professional make-up artist and hair stylist with 20+ years of experience in fashion, editorial, and commercial productions. Based in Prague.",
    path: "/",
  },
  beauty: {
    title: "Beauty | Hristina Georgievska | Make-up Artist & Hair Stylist",
    description:
      "Explore beauty and editorial makeup by Prague-based artist Hristina Georgievska. Clean skin, bold artistry, and precision hair styling.",
    path: "/beauty",
  },
  advertising: {
    title: "Advertising | Hristina Georgievska | Make-up Artist & Hair Stylist",
    description:
      "Commercial and advertising makeup and hair styling portfolio by Prague-based artist Hristina Georgievska.",
    path: "/advertising",
  },
  video: {
    title: "Video | Hristina Georgievska | Make-up Artist & Hair Stylist",
    description:
      "Commercial, music, and fashion video productions featuring makeup and hair styling by Prague-based artist Hristina Georgievska.",
    path: "/video",
  },
  contact: {
    title: "Contact | Hristina Georgievska | Make-up Artist & Hair Stylist",
    description:
      "Get in touch with Prague-based make-up artist and hair stylist Hristina Georgievska for fashion, editorial, and commercial bookings.",
    path: "/contact",
  },
};

const Index = () => {
  const location = useLocation();
  const segment = location.pathname.replace(/^\//, "").toLowerCase();
  const activeSection: SectionType = (VALID_SECTIONS as readonly string[]).includes(segment)
    ? (segment as SectionType)
    : "fashion";

  const meta = SECTION_METADATA[activeSection];
  const canonicalUrl = `https://www.hristinageorgievska.com${meta.path === "/" ? "" : meta.path}`;

  const renderSection = () => {
    switch (activeSection) {
      case "fashion":
        return <MasonryGallery />;
      case "beauty":
        return <BeautyGallery />;
      case "advertising":
        return <AdvertisingSection />;
      case "video":
        return <VideoSection />;
      case "contact":
        return <ContactSection />;
      default:
        return <MasonryGallery />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
      </Helmet>
      <Header />
      <Navigation activeSection={activeSection} />
      <main className="min-h-[75vh]">{renderSection()}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
