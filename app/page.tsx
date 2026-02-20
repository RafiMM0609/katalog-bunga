import HeroSection from "@/components/home/HeroSection";
import HomeClientWrapper from "@/components/home/HomeClientWrapper";

export default async function HomePage() {
  return (
    <div className="space-y-10 animate-fade-in">
      <HeroSection />
      <HomeClientWrapper />
    </div>
  );
}
