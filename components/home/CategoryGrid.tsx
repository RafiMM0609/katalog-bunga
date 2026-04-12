"use client"

import { useState, useEffect } from "react";
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

const FLOWER_FRAMES = [
  "/animate-stemmed-flower/Animasi_Bunga_Terkumpul_Menjadi_Satu_001.jpg",
  "/animate-stemmed-flower/Animasi_Bunga_Terkumpul_Menjadi_Satu_002.jpg",
  "/animate-stemmed-flower/Animasi_Bunga_Terkumpul_Menjadi_Satu_003.jpg",
  "/animate-stemmed-flower/Animasi_Bunga_Terkumpul_Menjadi_Satu_004.jpg",
];

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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const activeCategory = typeof activeCategoryProp !== "undefined" ? activeCategoryProp : localActive;

  const frameIndex = Math.floor(scrollY / 80) % FLOWER_FRAMES.length;
  const parallaxOffset = -(scrollY * 0.3);

  function setActive(catSlug: string) {
    if (onChange) onChange(catSlug);
    if (typeof activeCategoryProp === "undefined") setLocalActive(catSlug);
  }

  return (
    <div className="flex flex-col items-center relative overflow-hidden rounded-2xl py-8 px-4">
      {/* Animated flower background */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{ transform: `translateY(${parallaxOffset}px)`, willChange: "transform" }}
        aria-hidden="true"
      >
        {FLOWER_FRAMES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover object-bottom transition-opacity duration-300 ${i === frameIndex ? "opacity-40" : "opacity-0"}`}
          />
        ))}
      </div>
      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/60 pointer-events-none" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
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
