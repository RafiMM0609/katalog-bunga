# Admin Dashboard - Kagitacraft

## Akses Admin

**URL:** `http://localhost:3000/admincu`

**Kredensial Login:**
- Username: `admin`
- Password: `admin123`

## Fitur Admin Dashboard

### 1. **Manajemen Produk**
- ✅ Tambah produk baru
- ✅ Edit produk existing
- ✅ Hapus produk
- ✅ Upload gambar produk (max 5MB)
- ✅ Set rating & jumlah terjual
- ✅ Kelola tags & kategori
- ✅ Toggle status aktif/non-aktif

### 2. **Manajemen Kategori**
- ✅ Tambah kategori baru
- ✅ Hapus kategori
- ✅ Reorder kategori (naik/turun)
- ✅ Auto-generate slug dari nama

### 3. **Manajemen Warna Kertas**
- ✅ Tambah warna baru
- ✅ Hapus warna
- ✅ Color picker untuk pilih hex code
- ✅ Preview warna real-time

## Struktur File Admin

```
app/
├── admincu/
│   ├── layout.tsx          # Layout khusus admin dengan session check
│   ├── page.tsx            # Dashboard utama dengan tabs
│   └── login/
│       └── page.tsx        # Halaman login admin
├── api/
│   ├── auth/
│   │   ├── login/
│   │   │   └── route.ts    # POST /api/auth/login
│   │   └── logout/
│   │       └── route.ts    # POST /api/auth/logout
│   ├── upload/
│   │   └── route.ts        # POST /api/upload (image upload)
│   └── v1/
│       └── admin/
│           └── kategori/
│               ├── route.ts        # POST /api/v1/admin/kategori
│               └── [id]/
│                   └── route.ts    # DELETE /api/v1/admin/kategori/:id

components/admin/
├── AdminHeader.tsx          # Header dengan tombol logout
├── LogoutButton.tsx         # Client component untuk logout
├── TabNavigator.tsx         # Tab switcher UI
├── ProductManagement.tsx    # CRUD produk
├── ProductForm.tsx          # Form tambah/edit produk
├── CategoryManagement.tsx   # CRUD kategori dengan reorder
├── ColorManagement.tsx      # CRUD warna kertas
└── ConfirmDialog.tsx        # Modal konfirmasi delete

lib/
├── auth.ts                  # Utilities JWT & session management
└── validations/
    └── admin.ts            # Zod schemas untuk form validation

middleware.ts               # Route protection untuk /admincu
.env.local                 # Environment variables (credentials)
```

## Autentikasi & Keamanan

### JWT-Based Authentication
- Password di-hash menggunakan bcrypt (cost factor 10)
- Token JWT disimpan di httpOnly cookie (tidak bisa diakses JavaScript)
- Expiry token: 24 jam
- Secret key disimpan di `.env.local`

### Route Protection
- Middleware Next.js memproteksi semua route `/admincu/*`
- Kecuali `/admincu/login` (public)
- Redirect otomatis ke login jika tidak authenticated
- Server component di layout melakukan double-check session

### API Protection
API routes admin menggunakan `requireAdmin()` helper:
```typescript
import { requireAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  await requireAdmin(); // Throws error jika tidak authenticated
  // ... logic lainnya
}
```

## Flow Autentikasi

```
1. User akses /admincu
   ↓
2. Middleware cek cookie admin_token
   ↓
3a. Jika TIDAK ADA → Redirect ke /admincu/login
3b. Jika ADA → Verify JWT token
   ↓
4a. Jika INVALID → Redirect ke /admincu/login
4b. Jika VALID → Add header x-admin-user & allow access
   ↓
5. Layout server component cek session lagi
   ↓
6. Render dashboard
```

## Upload Gambar

### Flow Upload
1. User pilih file di ProductForm
2. Preview langsung ditampilkan (FileReader)
3. Saat submit form:
   - Upload file ke `/api/upload` (multipart/form-data)
   - Sharp resize gambar (max 800x1000px)
   - Convert ke JPEG quality 85%
   - Simpan ke `/public/uploads/`
   - Return URL `/uploads/filename.jpg`
4. URL disimpan di database field `image_url`

### Validasi
- ✅ Max size: 5MB
- ✅ Format: image/* (JPEG, PNG, WebP, dll)
- ✅ Auto resize dengan Sharp
- ✅ Admin-only (require authentication)

### Directory Structure
```
public/
└── uploads/
    ├── .gitkeep              # Git tracking empty dir
    ├── product-1234567.jpg   # Uploaded files
    └── product-1234568.jpg
```

## Form Validation

Menggunakan **Zod + React Hook Form**:

### ProductFormSchema
```typescript
- name: string (3-255 chars)
- category_id: string (required)
- description: string (min 10 chars)
- bg_color: string (default 'bg-white')
- tags: string (optional)
- rating: number (0-5, default 5.0)
- sold_count: number (min 0, default 0)
- is_active: boolean (default true)
- image_url: string (optional)
```

### CategoryFormSchema
```typescript
- name: string (2-100 chars)
- slug: string (lowercase, hyphen only, regex: ^[a-z0-9-]+$)
- icon_name: string (optional)
- description: string (optional)
```

### PaperColorFormSchema
```typescript
- name: string (3-100 chars)
- hex_code: string (regex: ^#[0-9A-Fa-f]{6}$)
```

### LoginFormSchema
```typescript
- username: string (min 3 chars)
- password: string (min 6 chars)
```

## Environment Variables

File: `.env.local`

```env
# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=$2a$10$... # bcrypt hash of "admin123"

# JWT Secret (GANTI di production!)
ADMIN_SECRET_KEY=kagitacraft-secret-key-change-in-production-2026

# Public Config
NEXT_PUBLIC_ADMIN_PATH=/admincu
NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER=6281234567890

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/kagitacraft
```

## Dependencies Admin

Package yang ditambahkan:

```json
{
  "react-hot-toast": "^2.4.1",      // Toast notifications
  "zod": "^3.22.4",                 // Schema validation
  "react-hook-form": "^7.49.3",     // Form management
  "@hookform/resolvers": "^3.3.4",  // Zod resolver
  "sharp": "^0.33.2",               // Image processing
  "bcryptjs": "^2.4.3",             // Password hashing
  "jose": "^5.2.0",                 // JWT operations
  "@types/bcryptjs": "^2.4.6"       // TypeScript types
}
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login admin
  - Body: `{ username, password }`
  - Response: Set httpOnly cookie `admin_token`
  
- `POST /api/auth/logout` - Logout admin
  - Response: Clear cookie `admin_token`

### Upload
- `POST /api/upload` - Upload gambar (admin only)
  - Body: FormData dengan field `file`
  - Response: `{ success: true, url: '/uploads/...', filename: '...' }`

### Admin Kategori
- `POST /api/v1/admin/kategori` - Create kategori (admin only)
  - Body: `{ name, slug?, icon_name?, description? }`
  
- `DELETE /api/v1/admin/kategori/:id` - Delete kategori (admin only)

## UI Design

Tema warna: **Pink/Rose** (sesuai desain.jsx)

```
Primary: #db2777 (pink-600)
Hover: #be185d (pink-700)
Light: #fce7f3 (pink-100)
```

### Components Style
- **Cards:** Rounded-2xl dengan shadow
- **Buttons:** Rounded-xl, pink gradient hover
- **Forms:** Focus ring pink, border pink on focus
- **Tabs:** Border bottom pink saat active
- **Modals:** Fixed overlay dengan backdrop blur

## Testing Admin Flow

1. **Login Test:**
   ```
   1. Buka http://localhost:3000/admincu
   2. Akan redirect ke /admincu/login
   3. Login dengan admin/admin123
   4. Harus redirect ke dashboard
   ```

2. **Product Management Test:**
   ```
   1. Klik tab "Produk"
   2. Klik "Tambah Produk"
   3. Isi form + upload gambar
   4. Klik "Simpan"
   5. Produk muncul di list
   6. Klik Edit, ubah data
   7. Klik Delete, confirm
   ```

3. **Category Management Test:**
   ```
   1. Klik tab "Kategori"
   2. Tambah kategori baru
   3. Reorder dengan tombol ↑↓
   4. Delete kategori
   ```

4. **Color Management Test:**
   ```
   1. Klik tab "Warna Kertas"
   2. Klik color input, pilih warna
   3. Input nama warna
   4. Klik "Tambah"
   5. Preview warna di grid
   6. Delete warna
   ```

5. **Logout Test:**
   ```
   1. Klik tombol "Logout" di header
   2. Harus redirect ke homepage
   3. Coba akses /admincu lagi
   4. Harus redirect ke login
   ```

## Troubleshooting

### Error: "Unauthorized"
- Pastikan sudah login
- Check cookie `admin_token` di DevTools
- Coba logout dan login ulang

### Upload gambar gagal
- Check max file size (5MB)
- Pastikan format image valid
- Check permission folder `/public/uploads/`
- Lihat error di console browser/server

### Build error: Sharp
```bash
# Reinstall sharp
npm uninstall sharp
npm install sharp
```

### Session hilang setelah refresh
- Check `.env.local` file ada dan loaded
- Restart dev server
- Clear browser cookies

## Production Checklist

Sebelum deploy ke production:

- [ ] Ganti `ADMIN_PASSWORD` dengan hash password baru
- [ ] Ganti `ADMIN_SECRET_KEY` dengan random string 32+ chars
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS (required untuk httpOnly cookies)
- [ ] Setup proper file storage (S3, Cloudinary, dll)
- [ ] Add rate limiting untuk login endpoint
- [ ] Setup backup database regular
- [ ] Monitor error logs
- [ ] Add admin activity logging

## Next Steps

Fitur yang bisa ditambahkan:

1. **Multiple Admin Users**
   - Database table `admins`
   - Role-based access control (RBAC)
   - Admin user management UI

2. **Advanced Product Features**
   - Multiple images per product
   - Image gallery/carousel
   - Bulk product import (CSV/Excel)
   - Product variants (size, color)

3. **Order Management**
   - View orders di dashboard
   - Update order status
   - Filter & search orders
   - Export orders to CSV

4. **Analytics Dashboard**
   - Total products/categories/orders
   - Revenue charts
   - Best selling products
   - Customer demographics

5. **Settings Page**
   - WhatsApp number config
   - Site settings (title, description)
   - SEO meta tags
   - Maintenance mode

---

**Dibuat dengan ❤️ untuk Kagitacraft**  
Admin Dashboard v1.0
