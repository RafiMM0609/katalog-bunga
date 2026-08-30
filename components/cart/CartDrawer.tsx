'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  User,
  ArrowRight,
  Heart,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/lib/config';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, clearCart, totalItems } =
    useCart();

  const [customerName, setCustomerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || items.length === 0) return;

    setSubmitting(true);

    // Open a blank tab immediately so popup blocker won't block WhatsApp
    const waWindow = window.open('', '_blank');

    // Send order logs fire-and-forget to database
    items.forEach((item) => {
      fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          product_id: item.product.id,
          selected_paper_color: item.paperColor !== '-' ? item.paperColor : null,
          notes: `Quantity: ${item.quantity}`,
        }),
      }).catch(() => {});
    });

    // Format multi-product WhatsApp message
    const formattedItems = items
      .map((item, idx) => {
        const colorText = item.paperColor && item.paperColor !== '-' ? `\n   - Warna Kertas: ${item.paperColor}` : '';
        const imgText = item.product.image_url ? `\n   - Foto: ${item.product.image_url}` : '';
        return `${idx + 1}. *${item.product.name}* (${item.quantity}x)${colorText}${imgText}`;
      })
      .join('\n\n');

    const whatsappNumber = siteConfig.whatsappNumber;
    const message = `Halo Admin Kagitacraft, saya *${customerName.trim()}* ingin memesan *${totalItems}* produk berikut:\n\n${formattedItems}\n\nBoleh tolong info harga & ketersediaannya kak? Terima kasih!`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    if (waWindow) {
      waWindow.location.href = whatsappUrl;
    } else {
      window.open(whatsappUrl, '_blank');
    }

    setSubmitting(false);
    closeCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Slide-over Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#FFF8F8] z-50 shadow-2xl flex flex-col border-l border-pink-100"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 bg-white border-b border-pink-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-pink-100 text-pink-600 rounded-xl">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-gray-800 flex items-center gap-2">
                    Keranjang Belanja
                    {totalItems > 0 && (
                      <span className="text-xs font-sans font-bold bg-pink-500 text-white px-2 py-0.5 rounded-full">
                        {totalItems}
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-gray-400">Pilih & atur bunga buket idamanmu</p>
                </div>
              </div>

              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-pink-50 text-gray-400 hover:text-pink-600 transition-colors"
                aria-label="Tutup keranjang"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body - Items List or Empty State */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 my-auto">
                  <div className="w-24 h-24 bg-pink-100/70 rounded-full flex items-center justify-center text-pink-400 mb-4 animate-bounce-slow">
                    <ShoppingBag size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">
                    Keranjang Masih Kosong
                  </h3>
                  <p className="text-sm text-gray-500 max-w-xs mb-6 font-light leading-relaxed">
                    Belum ada bunga abadi pilihanmu. Temukan hadiah paling berkesan di katalog kami.
                  </p>
                  <Link
                    href="/katalog"
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-full shadow-lg shadow-pink-200 transition-all hover:scale-105"
                  >
                    <span>Jelajahi Katalog</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.key}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white p-3.5 sm:p-4 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition-shadow flex gap-3.5 items-center relative group"
                  >
                    {/* Item Image */}
                    <div
                      className={`w-20 h-24 rounded-xl flex-shrink-0 relative overflow-hidden flex items-center justify-center ${
                        item.product.bg_color === 'bg-white' ? 'bg-pink-50' : item.product.bg_color || 'bg-pink-50'
                      }`}
                    >
                      {item.product.image_url ? (
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                          unoptimized
                        />
                      ) : (
                        <Heart
                          className={`${item.product.icon_color || 'text-pink-400'} opacity-60`}
                          size={32}
                          fill="currentColor"
                        />
                      )}
                    </div>

                    {/* Item Content */}
                    <div className="flex-1 min-w-0 pr-6">
                      <h4 className="font-serif text-sm sm:text-base font-bold text-gray-800 truncate mb-1">
                        {item.product.name}
                      </h4>

                      {item.paperColor && item.paperColor !== '-' && (
                        <div className="inline-flex items-center gap-1 bg-pink-50 border border-pink-100 text-pink-600 px-2 py-0.5 rounded-md text-[11px] font-medium mb-2">
                          <Sparkles size={10} />
                          <span>Kertas: {item.paperColor}</span>
                        </div>
                      )}

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50/50 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.key, -1)}
                            className="w-6 h-6 rounded-md bg-white hover:bg-pink-50 text-gray-600 hover:text-pink-600 flex items-center justify-center transition-colors shadow-2xs"
                            aria-label="Kurangi kuantitas"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.key, 1)}
                            className="w-6 h-6 rounded-md bg-white hover:bg-pink-50 text-gray-600 hover:text-pink-600 flex items-center justify-center transition-colors shadow-2xs"
                            aria-label="Tambah kuantitas"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Trash / Delete button */}
                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="absolute top-3.5 right-3.5 text-gray-300 hover:text-red-500 transition-colors p-1"
                      title="Hapus dari keranjang"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Drawer Footer (Actions & WhatsApp Form) */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 bg-white border-t border-pink-100 space-y-3.5 shadow-lg">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Total Produk: <strong>{totalItems} item</strong></span>
                  {showConfirmClear ? (
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-bold">Yakin hapus?</span>
                      <button
                        onClick={() => {
                          clearCart();
                          setShowConfirmClear(false);
                        }}
                        className="text-red-600 font-bold underline hover:text-red-800"
                      >
                        Ya
                      </button>
                      <button
                        onClick={() => setShowConfirmClear(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowConfirmClear(true)}
                      className="text-gray-400 hover:text-red-500 transition-colors underline"
                    >
                      Kosongkan Keranjang
                    </button>
                  )}
                </div>

                {/* Checkout Form */}
                <form onSubmit={handleCheckout} className="space-y-3">
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Masukkan Nama Anda *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-pink-50/50 border border-pink-100 rounded-xl text-sm focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !customerName.trim()}
                    className="w-full bg-gray-900 hover:bg-pink-600 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-pink-100 hover:shadow-pink-200 transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-sm">
                      {submitting ? 'Memproses...' : `Pesan via WhatsApp (${totalItems} item)`}
                    </span>
                  </button>
                </form>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
