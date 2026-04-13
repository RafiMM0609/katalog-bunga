'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Star, MessageSquare, Phone, User, FileText, X } from 'lucide-react';
import ColorPicker from '@/components/ui/ColorPicker';
import RatingStars from '@/components/ui/RatingStars';
import { siteConfig } from '@/lib/config';
import type { PaperColor } from '@/lib/types';

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
  image_url?: string;
}

interface ProductDetailServerProps {
  product: Product;
}

export default function ProductDetailServer({ product }: ProductDetailServerProps) {
  const [paperColor, setPaperColor] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [paperColors, setPaperColors] = useState<{ name: string; hex: string }[]>([]);

  // Order form state
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/v1/paper-colors')
      .then((res) => res.ok ? res.json() : [])
      .then((data: PaperColor[]) => {
        if (data.length > 0) {
          const mapped = data.map((c) => ({ name: c.name, hex: c.hex_code }));
          setPaperColors(mapped);
          setPaperColor(mapped[0].name);
        }
      })
      .catch(() => {});
  }, []);

  const handleRatingChange = async (rating: number) => {
    setUserRating(rating);
    setRatingSubmitted(false);
    try {
      await fetch(`/api/v1/produk/${product.id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });
      setRatingSubmitted(true);
    } catch {
      // non-blocking
    }
  };

  const handleOrderSubmit = async () => {
    if (!customerName.trim() || !customerPhone.trim()) return;

    // Open a blank tab immediately while still in the user-gesture context so
    // Safari's popup blocker does not block the eventual WhatsApp redirect.
    const waWindow = window.open('', '_blank');

    setSubmitting(true);
    try {
      await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          product_id: product.id,
          selected_paper_color: paperColor || null,
          customer_rating: userRating || null,
          notes: notes.trim() || null,
        }),
      });
    } catch {
      // non-blocking: still open WhatsApp even if order recording fails
    } finally {
      setSubmitting(false);
    }

    const whatsappNumber = siteConfig.whatsappNumber;
    const message = `Halo Admin Kagitacraft, saya *${customerName.trim()}* tertarik dengan produk *${product.name}*.\n\nDetail Pilihan:\n- Warna Kertas: ${paperColor || '-'}\n- No HP: ${customerPhone.trim()}\n${notes.trim() ? `- Catatan: ${notes.trim()}\n` : ''}\nBoleh tolong infonya kak? Terima kasih.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    if (waWindow) {
      waWindow.location.href = whatsappUrl;
    } else {
      window.open(whatsappUrl, '_blank');
    }
    setShowOrderForm(false);
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="bg-white md:rounded-3xl shadow-xl shadow-pink-100/50 overflow-hidden border border-pink-50 flex flex-col md:flex-row">
        {/* LEFT: IMAGE SECTION */}
        <div
          className={`w-full md:w-1/2 min-h-[350px] md:min-h-[500px] ${
            product.bg_color === 'bg-white' ? 'bg-pink-50' : product.bg_color
          } flex items-center justify-center relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-white/10"></div>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <Heart
              className={`${product.icon_color} opacity-60 animate-pulse-slow`}
              size={180}
              fill="currentColor"
            />
          )}

          {/* Decorative Blobs */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
        </div>

        {/* RIGHT: INFO SECTION */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-[#FFF8F8]">
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
          {paperColors.length > 0 && (
            <div className="mb-8">
              <ColorPicker
                colors={paperColors}
                selectedColor={paperColor}
                onColorChange={setPaperColor}
              />
            </div>
          )}

          {/* Rating Interaction */}
          <div className="mb-8 pt-6 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 text-center md:text-left">
              Berikan Penilaian
            </h3>
            <div className="flex justify-center md:justify-start">
              <RatingStars rating={userRating} onRatingChange={handleRatingChange} />
            </div>
            {ratingSubmitted && (
              <p className="text-xs text-green-500 mt-2 font-medium animate-pulse text-center md:text-left">
                Terima kasih atas penilaian Anda!
              </p>
            )}
          </div>

          {/* Order Form (inline) */}
          {showOrderForm ? (
            <div className="border border-pink-200 rounded-xl p-4 mb-4 bg-white space-y-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-gray-700">Data Pemesan</p>
                <button onClick={() => setShowOrderForm(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nama Anda *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
                />
              </div>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="No. HP / WhatsApp *"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
                />
              </div>
              <div className="relative">
                <FileText size={16} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  rows={2}
                  placeholder="Catatan (opsional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none resize-none"
                />
              </div>
              <button
                onClick={handleOrderSubmit}
                disabled={submitting || !customerName.trim() || !customerPhone.trim()}
                className="w-full bg-gray-800 text-white font-medium py-3 rounded-xl shadow-lg hover:bg-pink-600 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle size={20} />
                <span>{submitting ? 'Memproses...' : 'Lanjut ke WhatsApp'}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowOrderForm(true)}
              className="w-full bg-gray-800 text-white font-medium py-4 rounded-xl shadow-xl shadow-gray-200 hover:bg-pink-600 hover:shadow-pink-200 transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-1"
            >
              <MessageCircle size={20} />
              <span>Cek Harga & Pesan via WhatsApp</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
