import Link from "next/link";
import { ShoppingBag, Search, Menu } from "lucide-react";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-[#FFF0F5]/80 backdrop-blur-md border-b border-pink-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 -ml-2 text-gray-500">
              <Menu size={22} />
            </button>
            <Link 
              href="/" 
              className="font-serif text-2xl font-bold text-pink-900 tracking-wide cursor-pointer hover:text-pink-700 transition-colors"
            >
              Kagitacraft<span className="text-pink-400">.</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <Navigation />

          {/* Right: Icons */}
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-pink-600 transition-colors md:hidden">
              <Search size={22} />
            </button>
            <div className="relative cursor-pointer group">
              <ShoppingBag size={22} className="text-gray-500 group-hover:text-pink-600 transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
