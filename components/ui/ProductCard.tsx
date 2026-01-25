import Link from "next/link";
import { Heart, Star } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  rating: number;
  sold_count: number;
  bg_color: string;
  icon_color: string;
  description: string;
  tags: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const tagsArray = product.tags ? product.tags.split(',').map(t => t.trim()) : [];

  return (
    <Link href={`/produk/${product.id}`}>
      <div className="group cursor-pointer bg-white rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-xl hover:shadow-pink-100/50 hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-pink-100">
        {/* Image Area */}
        <div
          className={`aspect-[4/5] ${
            product.bg_color === 'bg-white' ? 'bg-gray-50' : product.bg_color
          } rounded-xl flex items-center justify-center relative overflow-hidden transition-all`}
        >
          <Heart
            className={`${product.icon_color} opacity-60 group-hover:scale-110 transition-transform duration-700`}
            size={60}
            strokeWidth={1}
            fill="currentColor"
          />

          {/* Floating Tags */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {tagsArray.map((tag, idx) => (
              <span
                key={idx}
                className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-semibold text-pink-600 shadow-sm border border-pink-50"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Info Area */}
        <div className="mt-4">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {product.category}
            </span>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-0.5 text-[10px] text-yellow-500">
              <Star size={10} fill="currentColor" /> {product.rating}
            </div>
          </div>
          <h4 className="font-serif text-base md:text-lg text-gray-800 leading-tight mb-2 group-hover:text-pink-600 transition-colors line-clamp-2 min-h-[2.5em]">
            {product.name}
          </h4>

          <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
            <span className="text-xs font-bold text-pink-500 bg-pink-50 px-2 py-1 rounded-md group-hover:bg-pink-500 group-hover:text-white transition-colors">
              Tanya Admin
            </span>
            <div className="text-xs text-gray-400">{product.sold_count}+ terjual</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
