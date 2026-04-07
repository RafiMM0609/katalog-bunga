"use client"

import { useState } from "react";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductGrid from "@/components/home/ProductGrid";

export default function KatalogPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  return (
        <div className="animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl text-gray-800 mb-3">Katalog Lengkap</h1>
        <p className="text-gray-500">Jelajahi semua koleksi bunga kami</p>
      </div>
    <div className="space-y-10">
      <CategoryGrid activeCategory={activeCategory} onChange={setActiveCategory} />
      <ProductGrid filterCategory={activeCategory} />
    </div>
    </div>
  );
}