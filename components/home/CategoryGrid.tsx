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

  function setActive(catSlug: string) {
    if (onChange) onChange(catSlug);
    if (typeof activeCategoryProp === "undefined") setLocalActive(catSlug);
  }

  return (
    <div className="flex flex-col items-center">
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
  );
}
