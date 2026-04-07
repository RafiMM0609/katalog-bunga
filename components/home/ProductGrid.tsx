"use client"

import { useState, useEffect, useCallback } from "react";
import ProductCard from "@/components/ui/ProductCard";
import type { Product, PaginatedResponse } from "@/lib/types";

type Props = {
  filterCategory?: string;
};

export default function ProductGrid({ filterCategory }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async (cat: string, pg: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pg), per_page: '12' });
      if (cat && cat !== 'all') params.set('category', cat);

      const res = await fetch(`/api/v1/produk?${params}`);
      if (res.ok) {
        const data: PaginatedResponse<Product> = await res.json();
        setProducts(data.data ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.total_pages ?? 1);
      }
    } catch {
      // keep empty state on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchProducts(filterCategory || 'all', 1);
  }, [filterCategory, fetchProducts]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchProducts(filterCategory || 'all', newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-6 px-2">
        <div>
          <h3 className="font-serif text-2xl text-gray-800">Katalog Pilihan</h3>
          <p className="text-xs text-gray-400 mt-1">
            {loading ? 'Memuat...' : `Menampilkan ${products.length} dari ${total} produk`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl aspect-[4/5] animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Belum ada produk di kategori ini</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-pink-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Sebelumnya
              </button>
              <span className="px-4 py-2 text-sm text-gray-500">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-pink-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
