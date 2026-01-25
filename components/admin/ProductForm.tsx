'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Save, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { ProductFormSchema, type ProductFormData } from "@/lib/validations/admin";

interface Product {
  id: number;
  name: string;
  category?: any;
  category_id?: number;
  description: string;
  rating: number;
  sold_count: number;
  bg_color: string;
  tags?: string;
  is_active: boolean;
}

interface ProductFormProps {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: product
      ? {
          name: product.name,
          category_id: product.category_id?.toString() || product.category?.id?.toString() || '',
          description: product.description,
          bg_color: product.bg_color,
          tags: Array.isArray(product.tags) ? product.tags.join(', ') : product.tags || '',
          rating: product.rating,
          sold_count: product.sold_count,
          is_active: product.is_active,
        }
      : {
          rating: 5.0,
          sold_count: 0,
          bg_color: 'bg-white',
          is_active: true,
        },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/v1/kategori');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (!product && data.length > 0) {
          setValue('category_id', data[0].id.toString());
        }
      }
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload gagal');
      }

      const data = await res.json();
      return data.url;
    } catch (error) {
      toast.error('Gagal upload gambar');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      // Upload image first if there's a new one
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          setIsSubmitting(false);
          return;
        }
      }

      const url = product
        ? `/api/v1/produk/${product.id}`
        : '/api/v1/produk';
      const method = product ? 'PUT' : 'POST';

      const payload = {
        ...data,
        category_id: parseInt(data.category_id),
        tags: Array.isArray(data.tags) ? data.tags.join(',') : data.tags,
        ...(imageUrl && { image_url: imageUrl }),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(product ? 'Produk berhasil diupdate' : 'Produk berhasil ditambahkan');
        onSuccess();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Gagal menyimpan produk');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
          <h2 className="font-serif text-xl text-gray-800 font-bold">
            {product ? 'Edit Produk' : 'Tambah Produk'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Image Upload */}
          <div>
            {imagePreview && (
              <div className="mb-4 relative rounded-xl overflow-hidden border-2 border-gray-200">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-pink-400 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload size={32} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Upload Foto Produk</span>
                <span className="text-xs text-gray-400">JPG, PNG, WebP (Max 5MB)</span>
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Nama Produk *
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
              placeholder="Nama produk..."
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Category & BG Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Kategori *
              </label>
              <select
                {...register('category_id')}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:border-pink-500 outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-red-500 text-xs mt-1">{errors.category_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Warna Background
              </label>
              <select
                {...register('bg_color')}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:border-pink-500 outline-none"
              >
                <option value="bg-white">Putih</option>
                <option value="bg-pink-50">Pink Soft</option>
                <option value="bg-blue-50">Blue Soft</option>
                <option value="bg-purple-50">Purple Soft</option>
                <option value="bg-orange-50">Orange Soft</option>
                <option value="bg-rose-50">Rose Soft</option>
                <option value="bg-amber-50">Amber Soft</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Deskripsi *
            </label>
            <textarea
              rows={3}
              {...register('description')}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
              placeholder="Deskripsi produk..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Tags (pisahkan dengan koma)
            </label>
            <input
              type="text"
              {...register('tags')}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-pink-500 outline-none"
              placeholder="Best Seller, Promo, New..."
            />
          </div>

          {/* Rating & Sold */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Rating (0-5)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                {...register('rating', { valueAsNumber: true })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-pink-500 outline-none"
              />
              {errors.rating && (
                <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Jumlah Terjual
              </label>
              <input
                type="number"
                min="0"
                {...register('sold_count', { valueAsNumber: true })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-pink-500 outline-none"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Produk aktif (tampil di katalog)
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className="flex-1 bg-pink-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-pink-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                'Uploading...'
              ) : isSubmitting ? (
                'Menyimpan...'
              ) : (
                <>
                  <Save size={20} />
                  Simpan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
