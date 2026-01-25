'use client'

import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import ProductForm from "./ProductForm";
import ConfirmDialog from "./ConfirmDialog";

interface Product {
  id: number;
  name: string;
  category: any;
  description: string;
  rating: number;
  sold_count: number;
  bg_color: string;
  icon_color: string;
  tags?: string;
  is_active: boolean;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/v1/produk');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.data || []);
      }
    } catch (error) {
      toast.error('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/v1/produk/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Produk berhasil dihapus');
        fetchProducts();
      } else {
        toast.error('Gagal menghapus produk');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-xl font-bold text-gray-800">
            Daftar Produk
          </h2>
          <button
            onClick={handleAdd}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-pink-700 transition-colors"
          >
            <Plus size={16} />
            Tambah Produk
          </button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>Belum ada produk</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-pink-50/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon size={20} />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-sm">{product.name}</h4>
                  <span className="text-xs text-gray-500 capitalize">
                    {product.category?.name || product.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                    ⭐ {product.rating}
                  </span>
                  <span className="text-xs text-gray-400">
                    {product.sold_count} terjual
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmDialog
          title="Hapus Produk"
          message="Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan."
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </>
  );
}
