'use client'

import { useState } from "react";
import { 
  ShoppingBag, 
  Heart, 
  Gift, 
  GraduationCap, 
  BookOpen, 
  Calendar 
} from 'lucide-react';

const categories = [
  { id: 'all', name: 'Semua', icon: ShoppingBag },
  { id: 'wisuda', name: 'Wisuda', icon: GraduationCap },
  { id: 'guru', name: 'Guru', icon: BookOpen },
  { id: 'ultah', name: 'Ultah', icon: Gift },
  { id: 'nikah', name: 'Nikahan', icon: Heart },
  { id: 'aniv', name: 'Anniv', icon: Calendar },
];

export default function CategoryGrid() {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="flex flex-col items-center">
      <h3 className="font-serif text-xl text-gray-800 mb-6 md:mb-8 text-center">
        Telusuri Kategori
      </h3>

      {/* Mobile: Horizontal Scroll, Desktop: Centered Flex */}
      <div className="w-full flex gap-4 overflow-x-auto pb-4 md:pb-0 md:overflow-visible justify-start md:justify-center scrollbar-hide px-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex flex-col items-center gap-3 min-w-[80px] group transition-all duration-300 p-2 rounded-xl hover:bg-white hover:shadow-sm ${
              activeCategory === cat.id ? 'opacity-100 scale-105' : 'opacity-60 hover:opacity-100'
            }`}
          >
            <div
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all ${
                activeCategory === cat.id
                  ? 'bg-pink-400 text-white shadow-lg shadow-pink-200'
                  : 'bg-white border border-pink-100 text-gray-400 group-hover:bg-pink-50'
              }`}
            >
              <cat.icon size={24} strokeWidth={1.5} />
            </div>
            <span
              className={`text-xs md:text-sm font-medium ${
                activeCategory === cat.id ? 'text-pink-600' : 'text-gray-500'
              }`}
            >
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
