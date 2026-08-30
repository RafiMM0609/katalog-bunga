'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Search } from "lucide-react";
import Navigation from "./Navigation";
import MusicToggleButton from "@/components/audio/MusicToggleButton";
import ProductSearchModal from "@/components/ui/ProductSearchModal";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { openCart, totalItems } = useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <nav className="fixed w-full z-50 top-0 left-0 bg-[#FFF0F5]/80 backdrop-blur-md border-b border-pink-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left: Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                aria-label="Kagitacraft."
                className="cursor-pointer tracking-wide hover:text-pink-700 transition-colors text-pink-900"
              >
                <span aria-hidden className="logo-anim" />
                <span className="text-pink-400">.</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <Navigation />

            {/* Right: Icons & Actions */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Search Trigger Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Cari produk"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white text-gray-500 hover:text-pink-600 border border-pink-100 shadow-sm transition-all duration-200 group text-xs md:text-sm"
              >
                <Search size={18} className="group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline text-gray-400 font-medium group-hover:text-pink-600 transition-colors">
                  Cari produk...
                </span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 bg-gray-100 rounded border border-gray-200">
                  Ctrl K
                </kbd>
              </button>

              <button
                onClick={openCart}
                aria-label="Buka keranjang"
                className="relative cursor-pointer p-2 rounded-full hover:bg-white/80 transition-colors group"
              >
                <ShoppingBag size={22} className="text-gray-600 group-hover:text-pink-600 transition-colors" />
                {totalItems > 0 ? (
                  <span className="absolute -top-0.5 -right-0.5 bg-pink-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm animate-pulse-slow">
                    {totalItems}
                  </span>
                ) : (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
                )}
              </button>
              <MusicToggleButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Global Product Search Modal */}
      <ProductSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

