'use client'

import { useState } from 'react';
import { X, Heart, MessageCircle, Star, MessageSquare } from 'lucide-react';
import ColorPicker from '@/components/ui/ColorPicker';
import RatingStars from '@/components/ui/RatingStars';

interface Product {
  id: number;
  name: string;
  category?: any;
  rating: number;
  sold_count: number;
  bg_color: string;
  icon_color: string;
  description: string;
  tags?: string;
}

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const [paperColor, setPaperColor] = useState('Pink Pastel');
  const [userRating, setUserRating] = useState(0);

  const handleOrder = () => {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER || '6281234567890';
    const message = `Halo Admin Kagitacraft, saya tertarik dengan produk *${product.name}*.\n\nDetail Pilihan:\n- Warna Kertas: ${paperColor}\n\nBoleh tolong info harga dan ongkirnya? Terima kasih.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-4 right-4 float-right z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X size={24} className="text-gray-600" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* LEFT: IMAGE SECTION */}
          <div
            className={`w-full md:w-1/2 min-h-[350px] md:min-h-[500px] ${
              product.bg_color === 'bg-white' ? 'bg-pink-50' : product.bg_color
            } flex items-center justify-center relative overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none`}
          >
            <div className="absolute inset-0 bg-white/10"></div>
            <Heart
              className={`${product.icon_color} opacity-60 animate-pulse-slow`}
              size={180}
              fill="currentColor"
            />

            {/* Decorative Blobs */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
          </div>

          {/* RIGHT: INFO SECTION */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-[#FFF8F8] rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none">
            {/* Breadcrumb / Meta */}
            <div className="flex items-center gap-2 mb-4">
              {product.category && (
                <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">
                  {product.category.name || product.category}
                </span>
              )}
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={12} fill="currentColor" />
                <span className="text-xs font-bold">{product.rating}</span>
              </div>
              <span className="text-xs text-gray-400">• {product.sold_count} terjual</span>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl text-gray-800 mb-6 leading-tight">
              {product.name}
            </h1>

            {/* Info Box */}
            <div className="bg-white border border-pink-100 rounded-xl p-4 flex items-start gap-4 mb-8 shadow-sm">
              <div className="bg-pink-50 p-2 rounded-full text-pink-500">
                <MessageSquare size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700">Harga Spesial (By Request)</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Harga menyesuaikan dengan kustomisasi. Hubungi kami untuk penawaran terbaik.
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Keterangan Produk
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Customization */}
            <div className="mb-8">
              <ColorPicker
                selectedColor={paperColor}
                onColorChange={setPaperColor}
              />
            </div>

            {/* Rating Interaction */}
            <div className="mb-8 pt-6 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 text-center md:text-left">
                Berikan Penilaian
              </h3>
              <div className="flex justify-center md:justify-start">
                <RatingStars rating={userRating} onRatingChange={setUserRating} />
              </div>
              {userRating > 0 && (
                <p className="text-xs text-green-500 mt-2 font-medium animate-pulse text-center md:text-left">
                  Terima kasih atas penilaian Anda!
                </p>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={handleOrder}
              className="w-full bg-gray-800 text-white font-medium py-4 rounded-xl shadow-xl shadow-gray-200 hover:bg-pink-600 hover:shadow-pink-200 transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-1"
            >
              <MessageCircle size={20} />
              <span>Cek Harga & Pesan via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
