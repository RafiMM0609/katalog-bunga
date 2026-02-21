# Kagitacraft - Full Stack Development Guide

**Tanggal**: Januari 2026  
**Stack**: Next.js 15+ (Frontend & Backend), SQLAlchemy (Database), Windows Development  
**Desain Referensi**: desain.jsx (React Flower Catalog App)

---

## 📋 Executive Summary

Implementasi aplikasi e-commerce **Kagitacraft** dengan arsitektur:
- **Frontend**: Next.js App Router dengan Server Components dominan (SEO-first)
- **Backend**: Next.js API Routes + Route Interceptor untuk modal
- **Database**: SQLAlchemy dengan PostgreSQL/MySQL
- **Design System**: Migrasi dari desain.jsx ke Tailwind CSS di Next.js

---

## 🏗️ Arsitektur Sistem

```
kagitacraft-app/
├── app/                          # Next.js App Router (Frontend + Backend)
│   ├── (public)/                 # Public pages layout
│   │   ├── layout.tsx            # Root layout server component
│   │   ├── page.tsx              # Home page (server component)
│   │   ├── katalog/
│   │   │   └── page.tsx          # Katalog listing (server component)
│   │   └── tentang-kami/
│   │       └── page.tsx          # About page
│   ├── @modal/                   # Parallel routes untuk modal
│   │   ├── produk/
│   │   │   └── [id]/
│   │   │       ├── @modal/       # Interceptor untuk modal detail
│   │   │       │   └── page.tsx  # Modal detail produk
│   │   │       └── page.tsx      # Full page produk detail
│   │   └── default.tsx
│   ├── api/                      # Backend API Routes
│   │   ├── v1/
│   │   │   ├── produk/
│   │   │   │   ├── route.ts      # GET /api/v1/produk, POST
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts  # GET/PUT/DELETE /api/v1/produk/[id]
│   │   │   ├── kategori/
│   │   │   │   └── route.ts
│   │   │   └── orders/
│   │   │       └── route.ts
│   │   └── auth/
│   │       └── route.ts          # Authentication endpoints
│   └── admin/                    # Admin dashboard (protected)
│       └── layout.tsx
├── lib/                          # Utilities & helpers
│   ├── db.ts                     # Database connection
│   ├── sqlalchemy/               # SQLAlchemy models
│   │   ├── models.py            # Product, Category, Order models
│   │   ├── schemas.py           # Pydantic schemas for validation
│   │   └── __init__.py
│   ├── hooks/
│   │   ├── useCategories.ts
│   │   ├── useProducts.ts
│   │   └── useCart.ts
│   └── utils.ts
├── components/                   # React Components
│   ├── ui/                       # Reusable UI components
│   │   ├── CategoryPill.tsx
│   │   ├── ProductCard.tsx
│   │   ├── PriceBox.tsx
│   │   └── ColorPicker.tsx
│   ├── layout/
│   │   ├── Header.tsx            # Server component
│   │   ├── Footer.tsx            # Server component
│   │   └── Navigation.tsx        # Client component for interactivity
│   └── modals/
│       └── ProductDetailModal.tsx # Client component
├── public/
│   ├── images/
│   └── icons/
├── styles/
│   └── globals.css               # Tailwind configuration
├── .env.local                    # Environment variables
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── python/                       # SQLAlchemy backend (optional monorepo approach)
    ├── models.py
    ├── database.py
    ├── schemas.py
    └── requirements.txt
```

---

## 📱 Design System Migration

### Warna & Styling dari desain.jsx

| Elemen | Warna | Tailwind Class |
|--------|-------|----------------|
| Primary Background | #FFF0F5 | `bg-[#FFF0F5]` |
| Primary Accent | Pink-600 | `text-pink-600` |
| Secondary | Pink-400 | `text-pink-400` |
| Header BG | #FFF0F5 + blur | `bg-[#FFF0F5]/80 backdrop-blur-md` |
| Detail BG | #FFF8F8 | `bg-[#FFF8F8]` |

### Component Mapping

| desain.jsx | Next.js Component | Type | Lokasi |
|-----------|-------------------|------|--------|
| Hero Section | `HeroSection.tsx` | Server | `components/home/` |
| Categories | `CategoryGrid.tsx` | Server (+ Client interaction) | `components/home/` |
| Product Grid | `ProductGrid.tsx` | Server (pagination server-side) | `components/home/` |
| Product Card | `ProductCard.tsx` | Server | `components/ui/` |
| Detail View | `ProductDetailModal.tsx` | Client (modal interceptor) | `components/modals/` |
| Header | `Header.tsx` | Server + `Navigation.tsx` Client | `components/layout/` |
| Footer | `Footer.tsx` | Server | `components/layout/` |

---

## 🗄️ Database Schema (SQLAlchemy)

### Models

```python
# lib/sqlalchemy/models.py

from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)  # "Wisuda", "Guru", etc.
    slug = Column(String(50), unique=True, nullable=False)  # "wisuda", "guru"
    icon_name = Column(String(50))  # lucide-react icon name
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)  # "Rosie Pink Elegance"
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    description = Column(Text, nullable=False)
    rating = Column(Float, default=5.0)
    sold_count = Column(Integer, default=0)
    bg_color = Column(String(50))  # "bg-white", "bg-pink-50"
    icon_color = Column(String(50))  # "text-pink-300"
    tags = Column(String(255))  # Comma-separated: "Best Seller,Promo"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PaperColor(Base):
    __tablename__ = "paper_colors"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)  # "Pink Pastel", "Cream"
    hex_code = Column(String(7), nullable=False)  # "#FBCFE8"
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)  # Null = global

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True)
    customer_name = Column(String(255), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    customer_email = Column(String(255))
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    selected_paper_color = Column(String(50))
    customer_rating = Column(Integer)  # 1-5
    notes = Column(Text)
    status = Column(String(50), default="pending")  # pending, confirmed, shipped, completed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

---

## 🔌 API Endpoints

### Base URL: `/api/v1`

#### Products
```
GET    /api/v1/produk                    # List all products (paginated)
GET    /api/v1/produk?category=wisuda   # Filter by category
GET    /api/v1/produk/[id]              # Get single product detail
POST   /api/v1/produk                   # Create (admin only)
PUT    /api/v1/produk/[id]              # Update (admin only)
DELETE /api/v1/produk/[id]              # Delete (admin only)
```

#### Categories
```
GET    /api/v1/kategori                 # List all categories
GET    /api/v1/kategori/[slug]          # Get category detail
```

#### Orders
```
POST   /api/v1/orders                   # Create new order
GET    /api/v1/orders/[id]              # Get order status
GET    /api/v1/orders                   # List user orders (auth required)
```

#### Analytics
```
GET    /api/v1/stats/products           # Product statistics
GET    /api/v1/stats/categories         # Category statistics
```

---

## 🎯 Implementation Phases

### **Phase 1: Foundation Setup** (Week 1)

#### Tasks
- [ ] Initialize Next.js project dengan TypeScript
- [ ] Setup Tailwind CSS dengan custom theme
- [ ] Database setup (PostgreSQL/MySQL + SQLAlchemy)
- [ ] Environment variables configuration
- [ ] Basic folder structure dan layout

#### Deliverables
- [ ] Working Next.js project di localhost
- [ ] Database connected
- [ ] `app/layout.tsx` dengan Tailwind styling

---

### **Phase 2: Frontend - Home & Product List** (Week 2)

#### Tasks
- [ ] Server Component: `app/(public)/page.tsx` (home)
- [ ] Component: `HeroSection.tsx` (mimic desain.jsx)
- [ ] Component: `CategoryGrid.tsx` (server component + client interaction)
- [ ] Component: `ProductGrid.tsx` (server-side pagination)
- [ ] Component: `ProductCard.tsx` (reusable)
- [ ] Client component: `Navigation.tsx` (client-side interactions)

#### SEO Implementation
- [ ] Metadata API untuk dynamic titles & descriptions
- [ ] Structured data (JSON-LD) untuk products
- [ ] Sitemap generation

#### Deliverables
- [ ] Home page dengan design system dari desain.jsx
- [ ] Responsive layout (mobile-first)
- [ ] SEO-optimized

---

### **Phase 3: Database & API** (Week 3)

#### Tasks
- [ ] Setup SQLAlchemy models
- [ ] Create API routes: `/api/v1/produk`, `/api/v1/kategori`
- [ ] Database seeding (8 products dari desain.jsx)
- [ ] Error handling & validation
- [ ] API documentation (OpenAPI/Swagger)

#### Deliverables
- [ ] Working API endpoints
- [ ] Database populated
- [ ] API documentation

---

### **Phase 4: Dynamic Pages & Route Interceptor** (Week 4)

#### Tasks
- [ ] Setup parallel routes (@modal folder structure)
- [ ] Route interceptor: `(.)produk/[id]/@modal/page.tsx` untuk modal
- [ ] Client Component: `ProductDetailModal.tsx`
- [ ] Full page fallback: `app/produk/[id]/page.tsx`
- [ ] Implement SEO untuk detail pages

#### Route Interceptor Pattern
```typescript
// app/(public)/(@modal)/produk/[id]/@modal/page.tsx (INTERCEPTED - opens as modal)
// app/(public)/produk/[id]/page.tsx (FALLBACK - opens as full page)

// When navigating from home:
// - Click -> opens modal via interceptor
// - Direct URL access -> opens full page
// - Refresh on modal -> shows full page
```

#### Deliverables
- [ ] Working modal interceptor
- [ ] Product detail page (server component)
- [ ] Proper SEO handling

---

### **Phase 5: Integration & Order System** (Week 5)

#### Tasks
- [ ] WhatsApp order integration
- [ ] Order API endpoint
- [ ] Client component: `ColorPicker.tsx` (paper colors)
- [ ] Client component: `RatingStars.tsx`
- [ ] Form validation & submission

#### Deliverables
- [ ] Complete product detail flow
- [ ] Order creation working

---

### **Phase 6: Admin Dashboard** (Week 6)

#### Tasks
- [ ] Admin layout (`app/admin/layout.tsx`)
- [ ] Protected routes (middleware)
- [ ] Admin pages:
  - [ ] Product management (CRUD)
  - [ ] Order management
  - [ ] Category management
  - [ ] Analytics dashboard
- [ ] Simple authentication

#### Deliverables
- [ ] Admin CRUD operations
- [ ] Basic dashboard

---

### **Phase 7: Testing & Optimization** (Week 7)

#### Tasks
- [ ] Performance optimization
  - [ ] Image optimization
  - [ ] Code splitting
  - [ ] Caching strategy
- [ ] SEO final audit
- [ ] Unit tests (key components)
- [ ] E2E tests (critical flows)

#### Deliverables
- [ ] Optimized build
- [ ] Test coverage

---

### **Phase 8: Deployment** (Week 8)

#### Tasks
- [ ] Deploy to Vercel (Next.js optimal)
- [ ] Database migration scripts
- [ ] Environment setup (production)
- [ ] Monitoring & logging
- [ ] Documentation

#### Deliverables
- [ ] Live application
- [ ] Documentation complete

---

## 🖥️ Windows Development Setup

### Prerequisites
```bash
# Check versions
node --version        # v18+
npm --version        # v9+
python --version     # v3.8+
```

### Initial Setup
```bash
# Create Next.js project
npx create-next-app@latest kagitacraft --typescript --tailwind

# Navigate to project
cd kagitacraft

# Install additional dependencies
npm install lucide-react next-router-states

# Setup Python environment (optional, if SQLAlchemy separate)
python -m venv venv
.\venv\Scripts\activate
pip install sqlalchemy psycopg2-binary pydantic
```

### Development Commands

```bash
# Development server
npm run dev              # Runs on http://localhost:3000

# Build
npm run build

# Production preview
npm start

# Database migrations (if using Alembic)
alembic upgrade head
alembic downgrade -1
```

### Environment Variables (`.env.local`)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/kagitacraft_db
# or MySQL: mysql://user:password@localhost:3306/kagitacraft_db

# API
# Local development only. Use relative `/api` paths in production or set a production API URL.
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1

# WhatsApp
WHATSAPP_ADMIN_NUMBER=6281234567890

# Optional: Admin Auth
ADMIN_SECRET_KEY=your-secret-key-here
```

---

## 🎭 Route Interceptor Deep Dive

### File Structure
```
app/
├── (public)/
│   ├── layout.tsx                           # Main layout
│   ├── page.tsx                             # Home
│   ├── default.tsx                          # Default for modal slot
│   └── (.)produk/[id]/                      # Interceptor level 1
│       ├── @modal/                          # Modal slot
│       │   └── page.tsx                     # MODAL VIEW
│       └── page.tsx                         # FALLBACK FULL PAGE
```

### How It Works

**Scenario 1: User navigates from home**
```
Click "Product" Card → Next.js intercepts → Router shows modal overlay
File rendered: (.)produk/[id]/@modal/page.tsx
```

**Scenario 2: User direct access via URL or refresh**
```
# (local development example)
http://localhost:3000/produk/123
→ URL doesn't match interceptor pattern
→ Next.js renders full page
File rendered: produk/[id]/page.tsx
```

**Scenario 3: User opens modal, then clicks back**
```
Modal is dismissed → Component state handles removal
```

### Implementation Code

```typescript
// app/(public)/@modal/default.tsx
export default function Default() {
  return null; // No modal by default
}

// app/(public)/(.)produk/[id]/@modal/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import ProductDetailModal from '@/components/modals/ProductDetailModal'

export default function InterceptedProductModal({ params }: { params: { id: string } }) {
  const router = useRouter()
  
  return (
    <ProductDetailModal 
      productId={params.id} 
      onClose={() => router.back()}
    />
  )
}

// app/(public)/produk/[id]/page.tsx (Server Component)
import { notFound } from 'next/navigation'

async function getProduct(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/produk/${id}`)
  if (!res.ok) notFound()
  return res.json()
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id)
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.id)
  return <ProductDetailServer product={product} />
}
```

---

## 🚀 Server vs Client Component Strategy

### SEO-First: Dominan Server Components

| Fitur | Component Type | Alasan |
|-------|----------------|--------|
| Home page | Server | Meta tags, dynamic data fetching |
| Katalog listing | Server | Pagination server-side, SEO |
| Product detail | Server | Meta tags per product, canonical URLs |
| Category list | Server | Static rendering, CDN cache |
| Header/Footer | Server | Layout stability, meta context |
| Navigation menu | Client | Interactivity (toggle, hover) |
| Product card hover | Mixed | Server layout + Client interaction |
| Modal | Client | Interactive overlay |
| Color picker | Client | State management |
| Rating stars | Client | Click handlers |
| Cart operations | Client | Real-time state updates |

### Data Fetching Pattern

```typescript
// ✅ Server Component - Direct DB Access (Recommended)
async function ProductList() {
  const products = await db.product.findMany() // Direct query
  return <ProductGrid products={products} />
}

// ❌ Client Component - API Call (Only when needed)
'use client'
const [products, setProducts] = useState([])
useEffect(() => {
  fetch('/api/v1/produk').then(...)
}, [])
```

---

## 📊 SEO Checklist

- [ ] **Metadata API** per page
- [ ] **Canonical URLs** untuk duplicate content
- [ ] **Structured Data** (JSON-LD)
  - [ ] Product schema
  - [ ] Organization schema
  - [ ] BreadcrumbList schema
- [ ] **Robots.txt** & **Sitemap.xml**
- [ ] **Open Graph** tags
- [ ] **Dynamic routes** dengan proper URL structure
- [ ] **Image optimization** (Next.js Image component)
- [ ] **Mobile responsiveness**
- [ ] **Page speed** optimization

### Metadata Configuration Example

```typescript
// app/metadata.ts
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kagitacraft - Bunga Abadi Penuh Makna',
  description: 'Temukan hadiah spesial yang tak akan pernah layu untuk momen terbaikmu.',
  keywords: ['bunga', 'hadiah', 'wisuda', 'pernikahan'],
  openGraph: {
    title: 'Kagitacraft',
    description: '...',
    url: 'https://kagitacraft.com',
    siteName: 'Kagitacraft',
    images: [{ url: '/og-image.png' }],
    type: 'website',
  },
}
```

---

## 🔒 Security Considerations

- [ ] **API Authentication** (JWT or session-based)
- [ ] **CSRF Protection** untuk form submissions
- [ ] **Rate limiting** di API routes
- [ ] **SQL Injection** prevention (SQLAlchemy parameterized queries)
- [ ] **XSS Protection** (Next.js built-in)
- [ ] **Environment variables** tidak exposed di frontend
- [ ] **HTTPS** di production
- [ ] **Database** password hashing (bcrypt)

---

## 📦 Dependencies

### package.json
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^latest",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0"
  }
}
```

### Python Dependencies (requirements.txt)
```
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
pydantic==2.5.0
python-dotenv==1.0.0
```

---

## 📚 File Generation Checklist

### Phase 1
- [ ] `next.config.ts`
- [ ] `tailwind.config.ts`
- [ ] `tsconfig.json`
- [ ] `app/layout.tsx`
- [ ] `app/globals.css`
- [ ] `.env.local`

### Phase 2
- [ ] `app/(public)/page.tsx`
- [ ] `components/home/HeroSection.tsx`
- [ ] `components/home/CategoryGrid.tsx`
- [ ] `components/home/ProductGrid.tsx`
- [ ] `components/ui/ProductCard.tsx`
- [ ] `components/layout/Header.tsx`
- [ ] `components/layout/Navigation.tsx`
- [ ] `components/layout/Footer.tsx`

### Phase 3
- [ ] `lib/sqlalchemy/models.py`
- [ ] `lib/sqlalchemy/schemas.py`
- [ ] `lib/db.ts`
- [ ] `app/api/v1/produk/route.ts`
- [ ] `app/api/v1/kategori/route.ts`

### Phase 4
- [ ] `app/(public)/@modal/default.tsx`
- [ ] `app/(public)/(.)produk/[id]/@modal/page.tsx`
- [ ] `app/(public)/produk/[id]/page.tsx`
- [ ] `components/modals/ProductDetailModal.tsx`

### Phase 5
- [ ] `components/ui/ColorPicker.tsx`
- [ ] `components/ui/RatingStars.tsx`
- [ ] `app/api/v1/orders/route.ts`

### Phase 6+
- [ ] `app/admin/layout.tsx`
- [ ] Admin CRUD pages
- [ ] Authentication middleware

---

## 🧪 Testing Strategy

### Unit Tests (Jest)
- [ ] Utility functions
- [ ] Component rendering
- [ ] Form validation

### Integration Tests (Playwright)
- [ ] User flow: Browse → View Detail → Order
- [ ] Category filtering
- [ ] Modal opening/closing

### E2E Tests
- [ ] Complete order flow
- [ ] Admin CRUD operations

---

## 📖 Documentation

- [ ] API documentation (Swagger/OpenAPI)
- [ ] Component Storybook (optional)
- [ ] Database schema diagram
- [ ] Deployment guide
- [ ] Contributing guidelines

---

## 🎨 Design System Reference

Semua styling dari `desain.jsx` sudah kami identifikasi dalam **Design System Migration** section di atas. Gunakan Tailwind classes yang sesuai saat implementasi setiap component.

---

## ⏰ Timeline Summary

| Phase | Fokus | Durasi |
|-------|-------|--------|
| 1 | Setup & Foundation | 1 minggu |
| 2 | Home & Product List (SEO) | 1 minggu |
| 3 | Database & API | 1 minggu |
| 4 | Route Interceptor & Modal | 1 minggu |
| 5 | Order Integration | 1 minggu |
| 6 | Admin Dashboard | 1 minggu |
| 7 | Testing & Optimization | 1 minggu |
| 8 | Deployment | 1 minggu |
| **TOTAL** | Full Production-Ready App | **8 minggu** |

---

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router Advanced](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Parallel Routes & Intercepting Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Last Updated**: Januari 25, 2026  
**Maintained by**: Kagitacraft Development Team
