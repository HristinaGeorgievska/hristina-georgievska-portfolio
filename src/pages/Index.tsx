import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import MasonryGallery from "@/components/MasonryGallery";
import BeautyGallery from "@/components/BeautyGallery";
import VideoSection from "@/components/VideoSection";
import CommercialSection from "@/components/CommercialSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [activeSection, setActiveSection] = useState("fashion");

  const renderSection = () => {
    switch (activeSection) {
      case "fashion":
        return <MasonryGallery />;
      case "beauty":
        return <BeautyGallery />;
      case "commercial":
        return <CommercialSection />;
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
    </div>
  );
};

export default Index;
