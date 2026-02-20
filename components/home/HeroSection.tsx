import Link from "next/link";
import { Heart } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-br from-pink-200 to-rose-100 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-sm flex flex-col md:flex-row items-center md:justify-between gap-6">
      <div className="relative z-10 max-w-lg text-center md:text-left">
        <span className="inline-block bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-pink-600 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
          New Collection 2026
        </span>
        <h2 className="font-serif text-3xl md:text-5xl text-gray-800 leading-tight mb-4">
          Bunga Abadi <br />
          <span className="italic font-light text-pink-600">Penuh Makna.</span>
        </h2>
        <p className="text-gray-600 mb-6 text-sm md:text-base max-w-sm mx-auto md:mx-0">
          Temukan hadiah spesial yang tak akan pernah layu untuk momen terbaikmu.
        </p>
        <Link
          href="/katalog"
          className="inline-block bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-200 transition-all transform hover:-translate-y-1"
        >
          Lihat Katalog
        </Link>
      </div>

      {/* Decorative Element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      <div className="relative md:w-1/3 flex justify-center">
        <Heart
          className="text-pink-400 opacity-60 md:scale-150 animate-pulse-slow"
          size={180}
          fill="currentColor"
        />
      </div>
    </div>
  );
}
