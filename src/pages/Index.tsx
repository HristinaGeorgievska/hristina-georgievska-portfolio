import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import MasonryGallery from "@/components/MasonryGallery";
import BeautyGallery from "@/components/BeautyGallery";
import VideoSection from "@/components/VideoSection";
import AdvertisingSection from "@/components/AdvertisingSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const VALID_SECTIONS = ["about", "fashion", "beauty", "advertising", "video", "contact"] as const;
type SectionType = (typeof VALID_SECTIONS)[number];

const Index = () => {
  const location = useLocation();
  const segment = location.pathname.replace(/^\//, "").toLowerCase();
  const activeSection: SectionType = (VALID_SECTIONS as readonly string[]).includes(segment)
    ? (segment as SectionType)
    : "about";

  const renderSection = () => {
    switch (activeSection) {
      case "about":
        return <AboutSection />;
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
        return <AboutSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation activeSection={activeSection} />
      <main className="min-h-[75vh]">{renderSection()}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
