import MasonryGallery, { GalleryImage } from "./MasonryGallery";

// Import beauty-specific images
import portrait6 from "@/assets/gallery/portrait-6.jpg";
import portrait7 from "@/assets/gallery/portrait-7.jpg";
import portrait1 from "@/assets/gallery/portrait-1.jpg";
import portrait3 from "@/assets/gallery/portrait-3.jpg";
import portrait5 from "@/assets/gallery/portrait-5.jpg";
import landscape3 from "@/assets/gallery/landscape-3.jpg";

const beautyImages: GalleryImage[] = [
  { src: portrait6, alt: "Colorful eyeshadow close-up", client: "Beauty Trends", name: "Eye Candy", photographer: "Lisa Park" },
  { src: portrait7, alt: "Luxury beauty editorial", client: "Allure Magazine", name: "Pure Luxury", photographer: "Chris Lee" },
  { src: portrait1, alt: "Beauty portrait with smoky eyes", client: "Elle Beauty", name: "Smoky Elegance", photographer: "Anna Lee" },
  { src: landscape3, alt: "Natural glowing skin beauty shot", client: "Skin Care Co", name: "Natural Glow", photographer: "Marc Johnson" },
  { src: portrait3, alt: "Bridal makeup editorial", client: "Bridal Magazine", name: "Wedding Dreams", photographer: "James Liu" },
  { src: portrait5, alt: "Evening makeup with metallic eyeshadow", client: "Evening Luxe", name: "Metallic Night", photographer: "Sarah Kim" },
];

const BeautyGallery = () => {
  return <MasonryGallery images={beautyImages} />;
};

export default BeautyGallery;
