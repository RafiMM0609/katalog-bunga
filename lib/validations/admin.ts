import { z } from 'zod';

export const ProductFormSchema = z.object({
  name: z.string()
    .min(3, 'Nama produk minimal 3 karakter')
    .max(255, 'Nama produk maksimal 255 karakter'),
  category_id: z.string()
    .min(1, 'Kategori harus dipilih'),
  description: z.string()
    .min(10, 'Deskripsi minimal 10 karakter')
    .max(1000, 'Deskripsi maksimal 1000 karakter'),
  bg_color: z.string()
    .default('bg-white'),
  tags: z.string()
    .optional()
    .default(''),
  rating: z.number()
    .min(0, 'Rating minimal 0')
    .max(5, 'Rating maksimal 5')
    .default(5.0),
  sold_count: z.number()
    .min(0, 'Jumlah terjual tidak boleh negatif')
    .default(0),
  is_active: z.boolean()
    .default(true),
});

export const CategoryFormSchema = z.object({
  name: z.string()
    .min(2, 'Nama kategori minimal 2 karakter')
    .max(50, 'Nama kategori maksimal 50 karakter'),
  slug: z.string()
    .min(2, 'Slug minimal 2 karakter')
    .max(50, 'Slug maksimal 50 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan dash')
    .optional()
    .transform(val => val || ''),
  icon_name: z.string()
    .optional()
    .default('Gift'),
  description: z.string()
    .optional(),
});

export const PaperColorFormSchema = z.object({
  name: z.string()
    .min(2, 'Nama warna minimal 2 karakter')
    .max(50, 'Nama warna maksimal 50 karakter'),
  hex_code: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Kode hex tidak valid (contoh: #FBCFE8)'),
});

export const LoginFormSchema = z.object({
  username: z.string()
    .min(3, 'Username minimal 3 karakter'),
  password: z.string()
    .min(6, 'Password minimal 6 karakter'),
});

export type ProductFormData = z.infer<typeof ProductFormSchema>;
export type CategoryFormData = z.infer<typeof CategoryFormSchema>;
export type PaperColorFormData = z.infer<typeof PaperColorFormSchema>;
export type LoginFormData = z.infer<typeof LoginFormSchema>;
