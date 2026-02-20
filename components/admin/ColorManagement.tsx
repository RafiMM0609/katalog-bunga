'use client'

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";

interface PaperColor {
  id: number;
  name: string;
  hex_code: string;
}

export default function ColorManagement() {
  const [colors, setColors] = useState<PaperColor[]>([]);
  const [newColor, setNewColor] = useState({ name: '', hex_code: '#000000' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using existing paper colors from initial data
    setColors([
      { id: 1, name: 'Pink Pastel', hex_code: '#FBCFE8' },
      { id: 2, name: 'Cream', hex_code: '#FDE68A' },
      { id: 3, name: 'Silver', hex_code: '#E5E7EB' },
      { id: 4, name: 'Putih', hex_code: '#FFFFFF' },
      { id: 5, name: 'Hitam', hex_code: '#1F2937' },
      { id: 6, name: 'Lilac', hex_code: '#E9D5FF' },
    ]);
    setLoading(false);
  }, []);

  const addColor = () => {
    if (!newColor.name.trim()) {
      toast.error('Nama warna tidak boleh kosong');
      return;
    }

    const newId = colors.length > 0 ? Math.max(...colors.map(c => c.id)) + 1 : 1;
    setColors([...colors, { ...newColor, id: newId }]);
    setNewColor({ name: '', hex_code: '#000000' });
    toast.success('Warna berhasil ditambahkan');
  };

  const deleteColor = (id: number) => {
    setColors(colors.filter(c => c.id !== id));
    toast.success('Warna berhasil dihapus');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="font-serif text-xl font-bold text-gray-800 mb-4">
        Atur Warna Kertas
      </h2>

      {/* Add Form */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <input
          type="color"
          value={newColor.hex_code}
          onChange={(e) => setNewColor({ ...newColor, hex_code: e.target.value })}
          className="w-12 h-12 rounded-lg cursor-pointer border border-gray-200"
        />
        <input
          type="text"
          value={newColor.name}
          onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && addColor()}
          placeholder="Nama Warna (misal: Navy Blue)"
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
        />
        <button
          onClick={addColor}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-pink-600 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Tambah
        </button>
      </div>

      {/* Grid */}
      {colors.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>Belum ada warna</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {colors.map((col) => (
            <div
              key={col.id}
              className="p-3 border border-gray-100 rounded-xl flex items-center justify-between group hover:bg-pink-50/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg border-2 border-gray-200 shadow-sm flex-shrink-0"
                  style={{ backgroundColor: col.hex_code }}
                ></div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-gray-700 truncate">
                    {col.name}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase">
                    {col.hex_code}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteColor(col.id)}
                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
