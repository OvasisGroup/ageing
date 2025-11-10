import Hero from "@/components/hero";
import ServicesSection from "@/components/services-section";
import AboutSection from "@/components/about-section";
import CategoriesSection from "@/components/categories-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ServicesSection />
      <AboutSection />
      <CategoriesSection />
    </main>
  );
}
