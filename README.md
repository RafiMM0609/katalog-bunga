# Kagitacraft - Quick Start Guide

## 🚀 Installation

### 1. Install Dependencies

```bash
# Install Node.js dependencies
npm install
```

### 2. Setup Python Environment (Optional - for SQLAlchemy)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install Python dependencies
pip install -r python\requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.local` and update the values:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/kagitacraft_db
# Local development only. In production prefer relative `/api` paths or set a production API URL.
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_WHATSAPP_ADMIN_NUMBER=6281234567890
ADMIN_SECRET_KEY=your-secret-key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
kagitacraft/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (Server Component)
│   ├── page.tsx                 # Home page (Server Component)
│   ├── @modal/                  # Parallel route for modal
│   │   ├── default.tsx
│   │   └── (.)produk/[id]/     # Route interceptor
│   ├── produk/[id]/            # Product detail (full page)
│   └── api/v1/                 # API routes
│       ├── produk/             # Products API
│       ├── kategori/           # Categories API
│       └── orders/             # Orders API
├── components/
│   ├── home/                   # Home page components
│   ├── layout/                 # Layout components
│   ├── modals/                 # Modal components
│   ├── product/                # Product components
│   └── ui/                     # Reusable UI components
├── lib/
│   ├── sqlalchemy/             # Database models
│   ├── types.ts                # TypeScript types
│   └── utils.ts                # Utility functions
└── public/                     # Static assets
```

## 🎯 Key Features Implemented

### ✅ Phase 1-4 Complete

- [x] Next.js 15 with App Router
- [x] TypeScript configuration
- [x] Tailwind CSS with custom theme
- [x] Server Components (SEO-optimized)
- [x] Route Interceptor for modal product detail
- [x] Responsive design (mobile-first)
- [x] SQLAlchemy database models
- [x] RESTful API routes
- [x] Component library (ProductCard, ColorPicker, RatingStars)

### 🎨 Design System

All styling from `desain.jsx` has been migrated:
- Primary background: `#FFF0F5`
- Pink accent colors
- Font: Inter (sans) + Serif for headings
- Responsive breakpoints: mobile → tablet → desktop

### 🔀 Route Interceptor Pattern

**How it works:**

1. **Click product from home** → Opens modal overlay (route interceptor)
   - File: `app/@modal/(.)produk/[id]/page.tsx`

2. **Direct URL or refresh** → Opens full page
   - File: `app/produk/[id]/page.tsx`

3. **Back button from modal** → Returns to home (smooth navigation)

### 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/produk` | List all products |
| GET | `/api/v1/produk?category=wisuda` | Filter by category |
| GET | `/api/v1/produk/[id]` | Get single product |
| GET | `/api/v1/kategori` | List categories |
| POST | `/api/v1/orders` | Create order |

## 🧪 Testing

### Test Homepage
```bash
npm run dev
# Visit: http://localhost:3000
```

### Test Modal Interceptor
1. Go to homepage
2. Click any product card
3. Modal should open with product details
4. Click browser back button → modal closes
5. Direct visit: `http://localhost:3000/produk/1` → Full page

### Test API
```bash
# Local development: API endpoints available at http://localhost:3000
# Use relative paths when calling from the app (e.g. `/api/v1/produk`).
# Products
curl http://localhost:3000/api/v1/produk

# Single Product
curl http://localhost:3000/api/v1/produk/1

# Categories
curl http://localhost:3000/api/v1/kategori
```

## 🔧 Next Steps (Manual)

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup (Optional)
If using real database instead of mock data:
```bash
# Initialize database tables
python -c "from lib.sqlalchemy.database import init_db; init_db()"
```

### 3. Run Development Server
```bash
npm run dev
```

## 📦 Build for Production

```bash
# Build
npm run build

# Start production server
npm start
```

## 🌐 Deployment (Vercel Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## 📚 Documentation

See [development-guide.md](development-guide.md) for complete implementation details.

## 🐛 Troubleshooting

### Module not found errors
```bash
npm install
```

### TypeScript errors
```bash
npm run type-check
```

### Port already in use
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 🎉 What's Working

- ✅ Home page with hero, categories, and product grid
- ✅ Product card with hover effects
- ✅ Modal interceptor for product details
- ✅ Full page fallback for direct URLs
- ✅ WhatsApp integration
- ✅ Color picker component
- ✅ Rating stars component
- ✅ Responsive design
- ✅ SEO optimization with metadata
- ✅ API routes with mock data

## 📝 License

© 2026 Kagitacraft. All rights reserved.
