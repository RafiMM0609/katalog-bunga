"use client"

import { useState } from "react";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductGrid from "@/components/home/ProductGrid";
import type { Category, Product, PaginatedResponse } from "@/lib/types";

type Props = {
  initialCategories?: Category[];
  initialProducts?: PaginatedResponse<Product>;
};

export default function HomeClientWrapper({ initialCategories, initialProducts }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  return (
    <div id="catalog-section" className="space-y-10">
      <CategoryGrid
        activeCategory={activeCategory}
        onChange={setActiveCategory}
        initialCategories={initialCategories}
      />
      <ProductGrid
        filterCategory={activeCategory}
        initialProducts={initialProducts}
      />
    </div>
  );
}
