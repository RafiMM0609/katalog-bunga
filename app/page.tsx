import HeroSection from "@/components/home/HeroSection";
import HomeClientWrapper from "@/components/home/HomeClientWrapper";
import { getCategories, getProducts } from "@/lib/data";

export default async function HomePage() {
  const [initialCategories, initialProducts] = await Promise.all([
    getCategories(),
    getProducts('all', 1, 12),
  ]);

  return (
    <div className="space-y-10">
      <HeroSection />
      <HomeClientWrapper
        initialCategories={initialCategories}
        initialProducts={initialProducts}
      />
    </div>
  );
}
