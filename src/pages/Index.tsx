import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import MasonryGallery from "@/components/MasonryGallery";
import BeautyGallery from "@/components/BeautyGallery";
import VideoSection from "@/components/VideoSection";
import AdvertisingSection from "@/components/AdvertisingSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const Index = () => {
  const [activeSection, setActiveSection] = useState("fashion");

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
      <Header />
      <Navigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main>{renderSection()}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
