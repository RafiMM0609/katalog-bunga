"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Heart,
  Gift,
  GraduationCap,
  BookOpen,
  Calendar,
  Tag,
} from "lucide-react";
import type { Category } from "@/lib/types";

// --- Scroll-driven background flower animation ---
// All position / size / appearance values are centralised here for easy tuning.
const STEMMED_FLOWER_FRAMES = [
  "/animate-stemmed-flower/Animasi_Bunga_Terkumpul_Menjadi_Satu_001.jpg",
  "/animate-stemmed-flower/Animasi_Bunga_Terkumpul_Menjadi_Satu_002.jpg",
  "/animate-stemmed-flower/Animasi_Bunga_Terkumpul_Menjadi_Satu_003.jpg",
  "/animate-stemmed-flower/Animasi_Bunga_Terkumpul_Menjadi_Satu_004.jpg",
];

const FLOWER_BG_CONFIG = {
  /** Total scroll distance (px) that maps to the full animation cycle */
  scrollRange: 400,
  /** Rendered size (px) */
  width: 160,
  height: 160,
  /** Clockwise rotation in degrees */
  rotation: -10,
};

const ICON_MAP: Record<string, React.ElementType> = {
  ShoppingBag,
  Heart,
  Gift,
  GraduationCap,
  BookOpen,
  Calendar,
  Tag,
};

const ALL_CATEGORY = { id: "all", name: "Semua", slug: "all", icon_name: "ShoppingBag" };

type Props = {
  activeCategory?: string;
  onChange?: (catSlug: string) => void;
};

export default function CategoryGrid({ activeCategory: activeCategoryProp, onChange }: Props) {
  const [localActive, setLocalActive] = useState("all");
  const [categories, setCategories] = useState<typeof ALL_CATEGORY[]>([ALL_CATEGORY]);
  const [flowerFrame, setFlowerFrame] = useState(0);

  useEffect(() => {
    fetch('/api/v1/kategori')
      .then((res) => res.ok ? res.json() : [])
      .then((data: Category[]) => {
        setCategories([
          ALL_CATEGORY,
          ...data.map((c) => ({ id: c.slug, name: c.name, slug: c.slug, icon_name: c.icon_name || 'Tag' })),
        ]);
      })
      .catch(() => {/* keep default "Semua" */});
  }, []);

  // Sync animation frame with scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / FLOWER_BG_CONFIG.scrollRange, 1);
      const frame = Math.round(progress * (STEMMED_FLOWER_FRAMES.length - 1));
      setFlowerFrame((prev) => (prev !== frame ? frame : prev));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // set initial frame
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeCategory = typeof activeCategoryProp !== "undefined" ? activeCategoryProp : localActive;

  function setActive(catSlug: string) {
    if (onChange) onChange(catSlug);
    if (typeof activeCategoryProp === "undefined") setLocalActive(catSlug);
  }

  return (
    <div className="relative overflow-visible px-4 py-2">
      {/* Flower decoration – sits in front of the visible border below (z-index higher) */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{
          top: "-36px",
          right: "-16px",
          width: FLOWER_BG_CONFIG.width,
          height: FLOWER_BG_CONFIG.height,
          zIndex: 20,
          transform: `rotate(${FLOWER_BG_CONFIG.rotation}deg)`,
          transition: "opacity 0.2s ease",
        }}
      >
        <Image
          src={STEMMED_FLOWER_FRAMES[flowerFrame]}
          alt=""
          width={FLOWER_BG_CONFIG.width}
          height={FLOWER_BG_CONFIG.height}
          className="object-cover rounded-full w-full h-full"
          draggable={false}
        />
      </div>

      {/* Inner visible bordered container – contains the actual category content */}
      <div className="relative flex flex-col items-center border-2 border-pink-200 rounded-2xl bg-white/60 px-6 pt-6 pb-5 shadow-sm" style={{ zIndex: 1 }}>
        <h3 className="font-serif text-xl text-gray-800 mb-6 md:mb-8 text-center">Telusuri Kategori</h3>

        <div className="w-full flex gap-4 overflow-x-auto pb-4 md:pb-0 md:overflow-visible justify-start md:justify-center scrollbar-hide px-2">
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.icon_name] || Tag;
            return (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`flex flex-col items-center gap-3 min-w-[80px] group transition-all duration-300 p-2 rounded-xl ${
                  activeCategory === cat.id ? "opacity-100 scale-105" : "opacity-60 hover:opacity-100"
                }`}
              >
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 neumorphic-circle transition-all ${
                    activeCategory === cat.id
                      ? "neumorphic-active text-white bg-rose-500"
                      : "bg-white border border-pink-100 text-gray-400 group-hover:bg-pink-50"
                  }`}
                >
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <span className={`text-xs md:text-sm font-medium ${activeCategory === cat.id ? "text-pink-600" : "text-gray-500"}`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
