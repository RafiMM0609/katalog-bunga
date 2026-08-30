"use client"

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import type { Product, PaginatedResponse } from "@/lib/types";

type Props = {
  filterCategory?: string;
  initialProducts?: PaginatedResponse<Product>;
};

export default function ProductGrid({ filterCategory, initialProducts }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts?.data ?? []);
  const [total, setTotal] = useState(initialProducts?.total ?? 0);
  const [page, setPage] = useState(initialProducts?.page ?? 1);
  const [totalPages, setTotalPages] = useState(initialProducts?.total_pages ?? 1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(!initialProducts);
  const isInitialMount = useRef(true);

  const fetchProducts = useCallback(async (cat: string, pg: number, query: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pg), per_page: '12' });
      if (cat && cat !== 'all') params.set('category', cat);
      if (query.trim()) params.set('q', query.trim());

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
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (initialProducts && !searchQuery) {
        return;
      }
    }

    setPage(1);
    const timer = setTimeout(() => {
      fetchProducts(filterCategory || 'all', 1, searchQuery);
    }, 250);

    return () => clearTimeout(timer);
  }, [filterCategory, searchQuery, fetchProducts, initialProducts]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchProducts(filterCategory || 'all', newPage, searchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-serif text-2xl text-gray-800">Katalog Pilihan</h3>
          <p className="text-xs text-gray-400 mt-1">
            {loading ? 'Memuat...' : `Menampilkan ${products.length} dari ${total} produk`}
            {searchQuery && <span className="font-semibold text-pink-600"> (Kata kunci: &quot;{searchQuery}&quot;)</span>}
          </p>
        </motion.div>

        {/* Inline Search Input */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama produk..."
            className="w-full pl-9 pr-8 py-2 rounded-xl text-xs md:text-sm bg-white border border-pink-100 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none shadow-sm transition-all text-gray-700"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl aspect-[4/5] animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-gray-400 space-y-2"
        >
          <p className="text-lg font-medium text-gray-600">
            {searchQuery ? `Tidak ada produk dengan kata kunci "${searchQuery}"` : 'Belum ada produk di kategori ini'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-pink-600 font-semibold hover:underline"
            >
              Hapus pencarian
            </button>
          )}
        </motion.div>
      ) : (
        <>
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>

          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-2 mt-10"
            >
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
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

