'use client'

import { useState, useEffect } from "react";
import { ShoppingBag, Phone, User, Calendar, Package } from "lucide-react";
import toast from "react-hot-toast";
import type { Order } from "@/lib/types";

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/v1/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        toast.error('Gagal memuat pesanan');
      }
    } catch {
      toast.error('Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-gray-800">Daftar Pesanan</h2>
        <span className="text-sm text-gray-400">{orders.length} pesanan</span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
          <p>Belum ada pesanan masuk</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {orders.map((order) => (
            <div key={order.id} className="p-4 md:p-5 hover:bg-pink-50/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                {/* Status badge */}
                <span
                  className={`self-start text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                    STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {order.status}
                </span>

                <div className="flex-1 min-w-0 space-y-1">
                  {/* Product name */}
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-pink-400 flex-shrink-0" />
                    <span className="font-bold text-gray-800 text-sm truncate">
                      {order.product?.name || `Produk #${order.product_id}`}
                    </span>
                    {order.selected_paper_color && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {order.selected_paper_color}
                      </span>
                    )}
                  </div>

                  {/* Customer info */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {order.customer_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={12} />
                      <a
                        href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        {order.customer_phone}
                      </a>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(order.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <p className="text-xs text-gray-400 italic mt-1">"{order.notes}"</p>
                  )}
                </div>

                {/* Rating */}
                {order.customer_rating != null && order.customer_rating > 0 && (
                  <span className="self-start text-xs bg-yellow-50 text-yellow-600 font-bold px-2 py-1 rounded-lg">
                    ⭐ {order.customer_rating}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
