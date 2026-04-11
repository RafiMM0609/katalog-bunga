-- =============================================================
-- Kagitacraft – Supabase Schema
-- Run this SQL in the Supabase SQL Editor to set up the database.
-- =============================================================

-- ========================
-- TABLE: categories
-- ========================
CREATE TABLE IF NOT EXISTS categories (
  id          BIGSERIAL PRIMARY KEY,
  name        VARCHAR(50)  NOT NULL UNIQUE,
  slug        VARCHAR(50)  NOT NULL UNIQUE,
  icon_name   VARCHAR(50),
  description TEXT,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ========================
-- TABLE: products
-- ========================
CREATE TABLE IF NOT EXISTS products (
  id          BIGSERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  category_id BIGINT       NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  description TEXT         NOT NULL,
  rating      NUMERIC(3,1) NOT NULL DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  sold_count  INTEGER      NOT NULL DEFAULT 0 CHECK (sold_count >= 0),
  bg_color    VARCHAR(50)  NOT NULL DEFAULT 'bg-white',
  icon_color  VARCHAR(50)  NOT NULL DEFAULT 'text-pink-300',
  tags        VARCHAR(255),          -- comma-separated
  image_url   TEXT,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active   ON products(is_active);

-- ========================
-- TABLE: paper_colors
-- ========================
CREATE TABLE IF NOT EXISTS paper_colors (
  id         BIGSERIAL PRIMARY KEY,
  name       VARCHAR(50) NOT NULL,
  hex_code   CHAR(7)     NOT NULL CHECK (hex_code ~ '^#[0-9A-Fa-f]{6}$'),
  product_id BIGINT      REFERENCES products(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_paper_colors_product_id ON paper_colors(product_id);

-- ========================
-- TABLE: product_ratings
-- ========================
CREATE TABLE IF NOT EXISTS product_ratings (
  id         BIGSERIAL PRIMARY KEY,
  product_id BIGINT      NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rating     SMALLINT    NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_ratings_product_id ON product_ratings(product_id);

-- ========================
-- TABLE: orders
-- ========================
CREATE TABLE IF NOT EXISTS orders (
  id                   BIGSERIAL PRIMARY KEY,
  customer_name        VARCHAR(255) NOT NULL,
  customer_phone       VARCHAR(20)  NOT NULL,
  customer_email       VARCHAR(255),
  product_id           BIGINT       NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  selected_paper_color VARCHAR(50),
  customer_rating      SMALLINT     CHECK (customer_rating >= 1 AND customer_rating <= 5),
  notes                TEXT,
  status               VARCHAR(50)  NOT NULL DEFAULT 'pending',
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status      ON orders(status);

-- ========================
-- AUTO-UPDATE updated_at
-- ========================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ========================
-- ROW LEVEL SECURITY
-- ========================
ALTER TABLE categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_ratings ENABLE ROW LEVEL SECURITY;

-- Public read access for categories, products, paper_colors
CREATE POLICY "Public read categories"   ON categories   FOR SELECT USING (true);
CREATE POLICY "Public read products"     ON products     FOR SELECT USING (is_active = true);
CREATE POLICY "Public read paper_colors" ON paper_colors FOR SELECT USING (true);

-- Service role has full access (used by server-side API routes)
CREATE POLICY "Service role full access categories"   ON categories   USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role full access products"     ON products     USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role full access paper_colors" ON paper_colors USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role full access orders"       ON orders       USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role full access product_ratings" ON product_ratings USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Public can insert orders (customers placing orders)
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Public can insert product ratings
CREATE POLICY "Public insert product_ratings" ON product_ratings FOR INSERT WITH CHECK (true);

-- ========================
-- STORAGE BUCKET
-- ========================
-- Run in Supabase Storage UI or via API:
-- Bucket name: product-images
-- Public: true
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Service role upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'service_role');

CREATE POLICY "Service role delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.role() = 'service_role');

-- ========================
-- SEED DATA
-- ========================
INSERT INTO categories (name, slug, icon_name, description) VALUES
  ('Wisuda',  'wisuda', 'GraduationCap', 'Buket untuk wisuda'),
  ('Guru',    'guru',   'BookOpen',      'Hadiah untuk guru'),
  ('Ultah',   'ultah',  'Gift',          'Kado ulang tahun'),
  ('Nikahan', 'nikah',  'Heart',         'Buket pernikahan'),
  ('Anniv',   'aniv',   'Calendar',      'Anniversary'),
  ('Kado',    'kado',   'ShoppingBag',   'Kado spesial')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO paper_colors (name, hex_code) VALUES
  ('Pink Pastel', '#FBCFE8'),
  ('Cream',       '#FDE68A'),
  ('Silver',      '#E5E7EB'),
  ('Putih',       '#FFFFFF'),
  ('Hitam',       '#1F2937'),
  ('Lilac',       '#E9D5FF')
ON CONFLICT DO NOTHING;
