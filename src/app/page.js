import CatalogPreview from "./components/catalog/Catalog";
import Contacts from "./components/contacts/Contacts";
import Footer from "./components/footer/Footer";
import GalleryGrid from "./components/gallery/Gallery";
import HeroCarousel from "./components/header/Header";
import InteriorShowcase from "./components/interior/Interior";
import Navbar from "./components/navbar/Navbar";
import WhyUs from "./components/why/WhyUs";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroCarousel />
      <CatalogPreview />
      <WhyUs />
      <InteriorShowcase />
      <GalleryGrid />
      <Contacts />
      <Footer />
    </div>
  );
};