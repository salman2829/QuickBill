-- QuickBill POS - Supabase PostgreSQL Full Schema & PostgREST Cache Refresh

-- =========================================================================
-- ⚡ 1. MIGRATION UPGRADE ALTERS (Safe for pre-existing tables - MUST RUN FIRST) ⚡
-- =========================================================================
DO $$
BEGIN
  -- Add user_email column to products table if not exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products') THEN
    ALTER TABLE public.products ADD COLUMN IF NOT EXISTS user_email TEXT DEFAULT 'cashier@quickbill.com';
  END IF;

  -- Add user_email column to sales table if not exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sales') THEN
    ALTER TABLE public.sales ADD COLUMN IF NOT EXISTS user_email TEXT DEFAULT 'cashier@quickbill.com';
  END IF;
END $$;

-- Drop old global uniqueness constraints on products (safe if constraints exist or not)
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_sku_key;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_barcode_key;

-- Apply composite user constraints to products (ensures isolation per email)
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_user_barcode_unique;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_user_sku_unique;

-- =========================================================================
-- ⚡ 2. CREATE TABLES (Will run if tables do not exist)
-- =========================================================================

-- Ensure Users Table exists
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Cashier',
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'cashier',
  phone TEXT DEFAULT '',
  face_id TEXT DEFAULT NULL,
  is_otp_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure missing columns are added if users table pre-existed
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS name TEXT DEFAULT 'Cashier';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'cashier';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS face_id TEXT DEFAULT NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_otp_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Create Products Table (isolated per shop/user email)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT NOT NULL,
  barcode TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  cost_price NUMERIC(10, 2) DEFAULT 0.00,
  stock_quantity INT NOT NULL DEFAULT 0,
  min_stock_threshold INT DEFAULT 5,
  unit TEXT DEFAULT 'pcs',
  image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=400&q=80',
  user_email TEXT DEFAULT 'cashier@quickbill.com',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_email, barcode),
  UNIQUE (user_email, sku)
);

-- Create Sales / Invoices Table (isolated per shop/user email)
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no TEXT UNIQUE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  tax NUMERIC(10, 2) DEFAULT 0.00,
  discount NUMERIC(10, 2) DEFAULT 0.00,
  grand_total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  payment_method TEXT DEFAULT 'cash',
  customer JSONB DEFAULT '{"name": "Walk-in Customer", "phone": ""}'::jsonb,
  cashier_name TEXT DEFAULT 'Cashier',
  cashier_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  user_email TEXT DEFAULT 'cashier@quickbill.com',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index barcode and user_email for high-speed POS scanning lookup
CREATE INDEX IF NOT EXISTS idx_products_barcode ON public.products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_user_email ON public.products(user_email);
CREATE INDEX IF NOT EXISTS idx_sales_user_email ON public.sales(user_email);

-- Apply composite constraints to products in case the table already existed and we skipped the definition above
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_user_barcode_unique') THEN
    ALTER TABLE public.products ADD CONSTRAINT products_user_barcode_unique UNIQUE (user_email, barcode);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_user_sku_unique') THEN
    ALTER TABLE public.products ADD CONSTRAINT products_user_sku_unique UNIQUE (user_email, sku);
  END IF;
END $$;

-- Seed Default Initial Products for Demo Cashier
INSERT INTO public.products (sku, barcode, name, category, price, cost_price, stock_quantity, min_stock_threshold, unit, image_url, user_email)
VALUES
  ('SKU-1001', '8901030384102', 'Organic Fresh Milk 1L', 'Dairy', 65.00, 50.00, 24, 5, 'pcs', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80', 'cashier@quickbill.com'),
  ('SKU-1002', '8901030384119', 'Whole Wheat Bread 400g', 'Bakery', 45.00, 32.00, 15, 5, 'pcs', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80', 'cashier@quickbill.com'),
  ('SKU-1003', '8901030384126', 'Basmati Rice 5kg', 'Grains', 450.00, 380.00, 8, 3, 'bag', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80', 'cashier@quickbill.com'),
  ('SKU-1004', '8901030384133', 'Dark Roast Coffee 250g', 'Beverages', 320.00, 240.00, 3, 5, 'pcs', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80', 'cashier@quickbill.com'),
  ('SKU-1005', '8901030384140', 'Extra Virgin Olive Oil 500ml', 'Oils', 580.00, 460.00, 12, 4, 'pcs', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80', 'cashier@quickbill.com')
ON CONFLICT (user_email, barcode) DO NOTHING;

-- Grant public read/write permissions for API access
GRANT ALL ON TABLE public.users TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.sales TO anon, authenticated, service_role;

-- Disable Row Level Security (RLS) so that the Express backend can manage read/write access
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales DISABLE ROW LEVEL SECURITY;

-- ⚡ RELOAD SUPABASE POSTGREST SCHEMA CACHE ⚡
NOTIFY pgrst, 'reload schema';
