'use client'

import { useState, useEffect } from "react";
import { Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "./ConfirmDialog";

interface Category {
  id: number | string;
  name: string;
  slug: string;
  icon_name?: string;
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/v1/kategori');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      toast.error('Gagal memuat kategori');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCatName.trim()) {
      toast.error('Nama kategori tidak boleh kosong');
      return;
    }

    try {
      const slug = newCatName.toLowerCase().replace(/\s+/g, '-');
      const res = await fetch('/api/v1/kategori', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCatName,
          slug,
          icon_name: 'Gift',
        }),
      });

      if (res.ok) {
        toast.success('Kategori berhasil ditambahkan');
        setNewCatName('');
        fetchCategories();
      } else {
        toast.error('Gagal menambahkan kategori');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    }
  };

  const deleteCategory = async (id: number | string) => {
    try {
      const res = await fetch(`/api/v1/kategori/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Kategori berhasil dihapus');
        fetchCategories();
      } else {
        toast.error('Gagal menghapus kategori');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newCats = [...categories];
    if (direction === 'up' && index > 0) {
      [newCats[index], newCats[index - 1]] = [newCats[index - 1], newCats[index]];
    } else if (direction === 'down' && index < newCats.length - 1) {
      [newCats[index], newCats[index + 1]] = [newCats[index + 1], newCats[index]];
    }
    setCategories(newCats);
    toast.success('Urutan kategori diubah');
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="font-serif text-xl font-bold text-gray-800 mb-4">
          Atur Kategori
        </h2>

        {/* Add Form */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            placeholder="Nama Kategori Baru"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
          />
          <button
            onClick={addCategory}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-pink-600 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Tambah
          </button>
        </div>

        {/* List */}
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>Belum ada kategori</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-pink-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-xs font-bold text-pink-600">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-gray-700">{cat.name}</span>
                  <span className="text-[10px] text-gray-400 bg-white px-2 py-0.5 rounded border">
                    ID: {cat.slug || cat.id}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveCategory(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <MoveUp size={16} />
                  </button>
                  <button
                    onClick={() => moveCategory(idx, 'down')}
                    disabled={idx === categories.length - 1}
                    className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <MoveDown size={16} />
                  </button>
                  <div className="w-px h-4 bg-gray-300 mx-2"></div>
                  <button
                    onClick={() => setDeleteConfirm(cat.id)}
                    className="p-1 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmDialog
          title="Hapus Kategori"
          message="Apakah Anda yakin ingin menghapus kategori ini? Produk dengan kategori ini mungkin terpengaruh."
          onConfirm={() => deleteCategory(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </>
  );
}
