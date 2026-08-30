# Kagitacraft - Full Stack E-Commerce Flower Catalog

Kagitacraft adalah aplikasi katalog bunga & e-commerce berbasis **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, dan **Supabase**.

## 🚀 Fitur Utama

- **Catalog & Product Display**: Tampilan produk interaktif dengan kategori & filter.
- **Route Interception & Detail Modal**: Membuka detail produk dalam modal tanpa me-reload halaman, serta mendukung akses URL langsung (SEO friendly).
- **Admin Dashboard (`/admincu`)**: Dashboard manajemen produk, kategori, warna kertas, dan pesanan berbasis autentikasi JWT terproteksi.
- **WhatsApp Direct Order**: Integrasi pesan langsung ke WhatsApp admin.
- **SEO Optimized**: Metadata dinamis, sitemap, dan robots.txt terkonfigurasi.

## 🛠️ Stack Teknologi

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database / Backend**: Supabase (`@supabase/supabase-js`)
- **Icons**: Lucide React
- **Validation**: Zod + React Hook Form

## 📁 Struktur Project

```
kagitacraft/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── @modal/                   # Parallel route untuk modal produk
│   ├── admincu/                  # Dashboard Admin (/admincu)
│   ├── katalog/                  # Halaman Katalog
│   ├── produk/[id]/              # Halaman Detail Produk
│   ├── tentang-kami/             # Halaman Tentang Kami
│   └── api/                      # Next.js API Routes (v1 & auth)
├── components/
│   ├── admin/                    # Komponen khusus dashboard admin
│   ├── audio/                    # Engine & kontrol musik latar
│   ├── home/                     # Komponen halaman utama
│   ├── layout/                   # Header, Navigation, Footer
│   ├── modals/                   # Modal detail produk
│   └── ui/                       # Reusable UI (ProductCard, ColorPicker, Rating)
├── context/                      # Audio Context state
├── lib/                          # Utility & helper functions
│   ├── auth.ts                   # Utility autentikasi admin & JWT
│   ├── supabase.ts               # Client Supabase
│   ├── types.ts                  # TypeScript Types
│   └── utils.ts                  # Helper WhatsApp & formatters
├── supabase/                     # Schema SQL Supabase
└── public/                       # Assets gambar & audio
```

## ⚡ Panduan Memulai (Quick Start)

### 1. Install Dependencies

```bash
npm install
```

### 2. Konfigurasi Environment Variables

Buat file `.env.local` di root proyek (bisa salin dari `.env.local.example`):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Admin Credentials & Security
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-bcrypt-hashed-password
ADMIN_SECRET_KEY=your-jwt-secret-key

# Public Config
NEXT_PUBLIC_ADMIN_PATH=/admincu
NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER=6281234567890
```

### 3. Jalankan Server Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🔒 Halaman Admin

Akses dashboard admin di `http://localhost:3000/admincu`.  
Untuk informasi lebih mendalam mengenai arsitektur keamanan, API endpoints, dan alur manajemen admin, lihat **[ADMIN_README.md](ADMIN_README.md)**.

---

## 🧪 Script yang Tersedia

```bash
npm run dev        # Menjalankan server dev Next.js
npm run build      # Melakukan build produksi
npm run start      # Menjalankan server produksi
npm run type-check # Mengecek ketaatan tipe TypeScript
```

## 📝 Lisensi

© 2026 Kagitacraft. All rights reserved.
