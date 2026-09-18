-- Supabase Migration: Payment Requests Overhaul
-- Standardizing domain tables for requests, default statuses, and RLS security.

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DEPOSITS TABLE
CREATE TABLE IF NOT EXISTS public.deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(15, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  reference_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure payment_method and notes columns exist if table previously existed
ALTER TABLE public.deposits ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.deposits ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. WITHDRAWALS TABLE
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(15, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  asset_name TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  reference_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS asset_name TEXT;
ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS notes TEXT;

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE SET NULL,
  vehicle_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  full_price NUMERIC(15, 2) NOT NULL,
  part_payment_amount NUMERIC(15, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  contact_status TEXT DEFAULT 'awaiting_contact',
  customer_name TEXT,
  customer_email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes TEXT;

-- 4. INVESTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id TEXT REFERENCES public.projects(id) ON DELETE SET NULL,
  project_name TEXT,
  amount NUMERIC(15, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS notes TEXT;

-- 5. USER SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES public.membership_tiers(id),
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS notes TEXT;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Users can read own deposits" ON public.deposits;
DROP POLICY IF EXISTS "Users can insert own deposits" ON public.deposits;

DROP POLICY IF EXISTS "Users can read own withdrawals" ON public.withdrawals;
DROP POLICY IF EXISTS "Users can insert own withdrawals" ON public.withdrawals;

DROP POLICY IF EXISTS "Users can read own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;

DROP POLICY IF EXISTS "Users can read own investments" ON public.investments;
DROP POLICY IF EXISTS "Users can insert own investments" ON public.investments;

DROP POLICY IF EXISTS "Users can read own subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.user_subscriptions;

-- Deposits
CREATE POLICY "Users can read own deposits" ON public.deposits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own deposits" ON public.deposits FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Withdrawals
CREATE POLICY "Users can read own withdrawals" ON public.withdrawals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own withdrawals" ON public.withdrawals FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Orders
CREATE POLICY "Users can read own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Investments
CREATE POLICY "Users can read own investments" ON public.investments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own investments" ON public.investments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Subscriptions
CREATE POLICY "Users can read own subscriptions" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON public.user_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
