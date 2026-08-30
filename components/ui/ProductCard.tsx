"use client"

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Star, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const tagsArray = product.tags ? product.tags.split(',').map(t => t.trim()).slice(0, 3) : [];
  const categoryName = product.category
    ? typeof product.category === 'string'
      ? product.category
      : product.category.name
    : '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      transition={{
        duration: 0.4,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
    >
      <Link href={`/produk/${product.id}`}>
        <div className="group cursor-pointer bg-white rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-xl hover:shadow-pink-100/50 transition-all duration-300 border border-transparent hover:border-pink-100 h-full flex flex-col relative">
          {/* Image Area */}
          <div
            className={`aspect-[4/5] ${
              product.bg_color === 'bg-white' ? 'bg-gray-50' : product.bg_color
            } rounded-xl flex items-center justify-center relative overflow-hidden transition-all`}
          >
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
                unoptimized
              />
            ) : (
              <Heart
                className={`${product.icon_color} opacity-60 group-hover:scale-110 transition-transform duration-700`}
                size={60}
                strokeWidth={1}
                fill="currentColor"
              />
            )}

            {/* Floating Tags */}
            <div className="absolute top-2 left-2 flex flex-row flex-wrap gap-1 max-w-[90%]">
              {tagsArray.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-white/90 backdrop-blur-sm px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-[9px] md:text-[10px] font-semibold text-pink-600 shadow-sm border border-pink-50 whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Quick Add to Cart Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
              }}
              title="Tambah ke Keranjang"
              className="absolute bottom-2.5 right-2.5 p-2.5 bg-white/90 hover:bg-pink-600 text-gray-700 hover:text-white rounded-full shadow-md backdrop-blur-sm transition-all duration-300 transform hover:scale-110 active:scale-95 z-10"
            >
              <ShoppingBag size={15} />
            </button>
          </div>

          {/* Info Area */}
          <div className="mt-4 flex-grow flex flex-col">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {categoryName}
              </span>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-0.5 text-[10px] text-yellow-500">
                <Star size={10} fill="currentColor" /> {product.rating}
              </div>
            </div>
            <h4 className="font-serif text-base md:text-lg text-gray-800 leading-tight mb-2 group-hover:text-pink-600 transition-colors line-clamp-2 min-h-[2.5em]">
              {product.name}
            </h4>

            <div className="flex items-center justify-between gap-x-2 pt-2 border-t border-gray-50 mt-auto">
              <span className="text-xs text-center font-bold text-pink-500 bg-pink-50 px-2 py-1 rounded-md group-hover:bg-pink-500 group-hover:text-white transition-colors">
                Tanya Admin
              </span>
              <div className="text-xs text-gray-400">{product.sold_count}+ terjual</div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
