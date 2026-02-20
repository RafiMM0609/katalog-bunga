"use client"

import { useState } from "react";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductGrid from "@/components/home/ProductGrid";

export default function HomeClientWrapper() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  return (
    <div className="space-y-10">
      <CategoryGrid activeCategory={activeCategory} onChange={setActiveCategory} />
      <ProductGrid filterCategory={activeCategory} />
    </div>
  );
}
