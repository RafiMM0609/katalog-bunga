'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Heart, Star, Loader2, ChevronRight, Tag } from 'lucide-react';
import type { Product, PaginatedResponse } from '@/lib/types';

interface ProductSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = ['Mawar', 'Buket', 'Wisuda', 'Flanel', 'Kado'];

export default function ProductSearchModal({ isOpen, onClose }: ProductSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
      setHasSearched(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/produk?q=${encodeURIComponent(query.trim())}&per_page=8`);
        if (res.ok) {
          const data: PaginatedResponse<Product> = await res.json();
          setResults(data.data || []);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error('Search fetch error:', err);
        setResults([]);
      } finally {
        setLoading(false);
        setHasSearched(true);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectProduct = (productId: number) => {
    onClose();
    router.push(`/produk/${productId}`);
  };

  const handleQuickTagClick = (tag: string) => {
    setQuery(tag);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 md:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-100 flex flex-col max-h-[80vh]"
          >
            {/* Top Search Bar */}
            <div className="p-4 md:p-5 border-b border-gray-100 flex items-center gap-3 bg-gradient-to-r from-pink-50/50 to-white">
              <Search className="text-pink-500 shrink-0" size={22} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari produk bunga, buket, giftbox..."
                className="w-full text-base md:text-lg text-gray-800 placeholder-gray-400 bg-transparent outline-none font-medium"
              />
              {loading && <Loader2 className="animate-spin text-pink-400 shrink-0" size={20} />}
              {query && !loading && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
                  aria-label="Hapus kata kunci"
                >
                  <X size={18} />
                </button>
              )}
              <button
                onClick={onClose}
                className="px-2.5 py-1 text-xs font-semibold text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors shrink-0"
              >
                ESC
              </button>
            </div>

            {/* Content Area */}
            <div className="overflow-y-auto p-4 md:p-6 space-y-4">
              {/* Default state when empty */}
              {!query.trim() && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                    <Tag size={12} className="text-pink-400" /> Pencarian Populer
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleQuickTagClick(tag)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-100 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading indicator text */}
              {loading && results.length === 0 && (
                <div className="py-8 text-center text-gray-400 text-sm">
                  Mencari &quot;{query}&quot;...
                </div>
              )}

              {/* Empty results */}
              {hasSearched && !loading && results.length === 0 && (
                <div className="py-12 text-center space-y-2">
                  <p className="text-gray-500 font-medium text-base">Tidak ada produk ditemukan</p>
                  <p className="text-xs text-gray-400">Coba gunakan kata kunci lain seperti &quot;Mawar&quot; atau &quot;Buket&quot;</p>
                </div>
              )}

              {/* Results list */}
              {results.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Hasil Pencarian ({results.length})
                  </p>
                  <div className="divide-y divide-gray-100">
                    {results.map((product) => {
                      const categoryName = product.category
                        ? typeof product.category === 'string'
                          ? product.category
                          : product.category.name
                        : '';

                      return (
                        <div
                          key={product.id}
                          onClick={() => handleSelectProduct(product.id)}
                          className="group flex items-center justify-between p-3 rounded-2xl hover:bg-pink-50/60 cursor-pointer transition-all duration-200"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            {/* Product Thumbnail */}
                            <div className={`w-14 h-14 rounded-xl ${product.bg_color === 'bg-white' ? 'bg-pink-50' : product.bg_color} relative overflow-hidden shrink-0 flex items-center justify-center border border-pink-100/50`}>
                              {product.image_url ? (
                                <Image
                                  src={product.image_url}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  sizes="56px"
                                  unoptimized
                                />
                              ) : (
                                <Heart className={`${product.icon_color} opacity-60`} size={24} fill="currentColor" />
                              )}
                            </div>

                            {/* Info */}
                            <div className="min-w-0">
                              <h4 className="font-serif text-sm md:text-base font-semibold text-gray-800 group-hover:text-pink-600 transition-colors truncate">
                                {product.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                                {categoryName && (
                                  <span className="font-medium text-pink-600 bg-pink-100/80 px-1.5 py-0.5 rounded text-[10px]">
                                    {categoryName}
                                  </span>
                                )}
                                <div className="flex items-center gap-0.5 text-yellow-500">
                                  <Star size={10} fill="currentColor" />
                                  <span className="font-bold text-[11px]">{product.rating}</span>
                                </div>
                                <span className="text-gray-300">•</span>
                                <span className="text-[11px]">{product.sold_count}+ terjual</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity pl-2 shrink-0">
                            <span className="text-xs font-semibold hidden sm:inline">Detail</span>
                            <ChevronRight size={18} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50/80 border-t border-gray-100 text-center text-xs text-gray-400 flex justify-between items-center px-6">
              <span>Gunakan kata kunci untuk pencarian lebih spesifik</span>
              <span className="hidden sm:inline">Klik produk untuk lihat detail</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
