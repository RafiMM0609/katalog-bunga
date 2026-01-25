import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductGrid from "@/components/home/ProductGrid";

export default async function HomePage() {
  return (
    <div className="space-y-10 animate-fade-in">
      <HeroSection />
      <CategoryGrid />
      <ProductGrid />
    </div>
  );
}
