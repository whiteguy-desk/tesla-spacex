-- Supabase Database Schema Migration
-- Tesla / SpaceX investment and Vehicle Commerce Platform

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  gender TEXT,
  date_of_birth TEXT,
  country TEXT,
  currency TEXT DEFAULT 'USD',
  phone TEXT,
  total_balance NUMERIC(15, 2) DEFAULT 0.00,
  total_profit NUMERIC(15, 2) DEFAULT 0.00,
  total_invested NUMERIC(15, 2) DEFAULT 0.00,
  active_plan_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT DEFAULT 'Electric Vehicle',
  description TEXT,
  full_price NUMERIC(15, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  part_payment_amount NUMERIC(15, 2) DEFAULT 5000.00,
  image_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  top_speed TEXT,
  acceleration TEXT,
  range TEXT,
  drivetrain TEXT,
  seating TEXT,
  features TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}'::jsonb,
  availability TEXT DEFAULT 'In Stock',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'Open',
  target_amount NUMERIC(15, 2),
  display_metric TEXT,
  image_url TEXT,
  gallery TEXT[] DEFAULT '{}',
  location TEXT,
  sector TEXT,
  investment_info TEXT,
  features TEXT[] DEFAULT '{}',
  timeline TEXT,
  risk_disclosure TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MEMBERSHIP TIERS TABLE
CREATE TABLE IF NOT EXISTS public.membership_tiers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(15, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  description TEXT,
  benefits TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  upgrade_info TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AI PLANS TABLE
CREATE TABLE IF NOT EXISTS public.ai_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  min_amount NUMERIC(15, 2) NOT NULL,
  max_amount NUMERIC(15, 2),
  expected_return_range TEXT,
  cycle_duration TEXT,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INVESTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id TEXT REFERENCES public.projects(id) ON DELETE SET NULL,
  project_name TEXT,
  amount NUMERIC(15, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDERS TABLE
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. DEPOSITS TABLE
CREATE TABLE IF NOT EXISTS public.deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(15, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  reference_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. WITHDRAWALS TABLE
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(15, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  reference_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'completed',
  reference TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. USER SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES public.membership_tiers(id),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Public read policies for catalog tables
CREATE POLICY "Public read vehicles" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read membership_tiers" ON public.membership_tiers FOR SELECT USING (true);
CREATE POLICY "Public read ai_plans" ON public.ai_plans FOR SELECT USING (true);

-- User profiles policies
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Private user data policies (investments, orders, deposits, withdrawals, transactions, user_subscriptions)
CREATE POLICY "Users can read own investments" ON public.investments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own investments" ON public.investments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own deposits" ON public.deposits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own deposits" ON public.deposits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own withdrawals" ON public.withdrawals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own withdrawals" ON public.withdrawals FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own subscriptions" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON public.user_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Profile trigger on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- SEED SAMPLE DEVELOPMENT DATA
-- ==========================================

-- Seed Vehicles
INSERT INTO public.vehicles (id, name, slug, type, description, full_price, currency, part_payment_amount, image_url, top_speed, acceleration, range, drivetrain, seating, features, specifications, availability)
VALUES
  ('model-3', 'Model 3', 'model-3', 'Electric Sedan', 'Experience the Future of electric mobility with high efficiency and instant torque.', 39999.00, 'USD', 5000.00, 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1772912143/shop_products/vjembb6zp8ymaabtyvtf.avif', '145 mph', '4.2s 0-60 mph', '272 miles', 'Rear-Wheel Drive', '5 Seats', ARRAY['Autopilot', 'Glass Roof', '15" Touchscreen', 'Premium Audio'], '{"battery": "Standard Range", "warranty": "8 years / 100,000 miles"}'::jsonb, 'In Stock'),
  ('model-y', 'Model Y', 'model-y', 'Electric Crossover', 'Versatile and spacious electric crossover engineered for max utility and safety.', 44999.00, 'USD', 5000.00, 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1772912441/shop_products/mrmi8lgluhgy3czb1bcd.avif', '135 mph', '4.8s 0-60 mph', '310 miles', 'Dual Motor AWD', '5 Seats', ARRAY['Dual Motor AWD', 'Heated Seats', 'Power Liftgate', 'Autopilot'], '{"battery": "Long Range", "cargo": "76 cu ft"}'::jsonb, 'In Stock'),
  ('cybertruck', 'Cybertruck', 'cybertruck', 'Electric Utility Vehicle', 'Stainless-steel exoskeleton designed for ultimate durability and performance.', 49999.00, 'USD', 5000.00, 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1772912774/shop_products/fg6egsdynvtmhmnoftfo.avif', '112 mph', '4.1s 0-60 mph', '340 miles', 'Dual Motor AWD', '5 Seats', ARRAY['Ultra-Hard Exoskeleton', 'Armor Glass', '11,000 lbs Towing', 'Vault Bed'], '{"payload": "2,500 lbs", "ground_clearance": "17 in"}'::jsonb, 'In Stock'),
  ('model-s', 'Model S', 'model-s', 'Electric Luxury Sedan', 'Unmatched range, terrifying acceleration, and refined interior luxury.', 49999.00, 'USD', 5000.00, 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1772907569/shop_products/aq36923m5clq2s9eb1kn.jpg', '130 mph', '3.1s 0-60 mph', '405 miles', 'Dual Motor AWD', '5 Seats', ARRAY['Yoke Steering Option', 'Tri-Zone Climate', '22-Speaker Audio', 'Full Self-Driving Capability'], '{"power": "670 hp", "charging": "250 kW Supercharging"}'::jsonb, 'In Stock'),
  ('model-x', 'Model X', 'model-x', 'Electric Luxury SUV', 'Falcon Wing doors, spacious seating for seven, and class-leading SUV safety.', 49999.00, 'USD', 5000.00, 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1772912600/shop_products/artqw7clgs2xkivyktel.avif', '130 mph', '3.8s 0-60 mph', '348 miles', 'Dual Motor AWD', '7 Seats', ARRAY['Falcon Wing Doors', 'HEPA Air Filtration', 'Panoramic Windshield', 'Tow Package'], '{"towing": "5,000 lbs", "seats": "7 Seats Option"}'::jsonb, 'In Stock')
ON CONFLICT (id) DO UPDATE SET
  full_price = EXCLUDED.full_price,
  part_payment_amount = EXCLUDED.part_payment_amount,
  image_url = EXCLUDED.image_url;

-- Seed Projects (Sample / Mock Investment Opportunities)
INSERT INTO public.projects (id, name, slug, description, category, status, target_amount, display_metric, image_url, location, sector, investment_info, features, timeline, risk_disclosure)
VALUES
  ('doge-reserve-fund', 'Dogecoin Reserve Fund', 'doge-reserve-fund', 'Sample Project: Ride the world''s most iconic meme coin with institutional-grade capital allocation.', 'Dogecoin', 'Open', 50000000.00, '40%–120% Yield', 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248208/projects/doge-reserve.jpg', 'Global', 'Crypto Capital', 'Sample Development Data — Min entry $1,000.', ARRAY['Institutional Storage', 'Dynamic Rebalancing', 'Liquidity Management'], 'Q1 2025 - Q4 2025', 'Cryptocurrency and token investments carry market risk and high volatility. Sample data for preview purposes.'),
  ('xai-colossus-ii-gpu-cluster', 'xAI Colossus II — 1M GPU Cluster', 'xai-colossus-ii-gpu-cluster', 'Sample Project: Back the next-generation compute infrastructure powering frontier AI research.', 'xAI', 'Open', 300000000.00, '28%–90% Yield', 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248181/projects/xai-colossus.jpg', 'Memphis, TN', 'AI Infrastructure', 'Sample Development Data — Min entry $10,000.', ARRAY['1,000,000 GPU Capacity', 'Direct Compute Yield', 'Liquid Allocation'], 'Q2 2025 - Q4 2026', 'AI infrastructure investments subject to market demand and technology development. Sample data.'),
  ('tesla-gigafactory-mexico', 'Gigafactory Mexico — Phase 1', 'tesla-gigafactory-mexico', 'Sample Project: Fund manufacturing capacity expansion for next-gen affordable electric platforms.', 'Tesla', 'Open', 120000000.00, '32%–95% Yield', 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248179/projects/tesla-gigafactory-mexico.jpg', 'Nuevo León, Mexico', 'Manufacturing', 'Sample Development Data — Min entry $2,500.', ARRAY['Next-Gen Platform', 'Sustainable Energy Hub', 'Automated Production'], 'Q1 2025 - Q2 2026', 'Industrial production investments carry operational and regulatory risks. Sample preview data.'),
  ('spacex-space-city-fund', 'SpaceX Space City Infrastructure Fund', 'spacex-space-city-fund', 'Sample Project: Infrastructure development supporting orbital launch facilities and Starbase expansion.', 'SpaceX', 'Open', 200000000.00, '35%–110% Yield', 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248200/projects/spacex-space-city.jpg', 'Boca Chica, TX', 'Aerospace', 'Sample Development Data — Min entry $5,000.', ARRAY['Starbase Expansion', 'Starlink Production', 'Orbital Launch Complex'], 'Q1 2025 - Q4 2027', 'Aerospace infrastructure involves long horizons and execution complexity. Sample preview data.'),
  ('neuralink-bci-series', 'Neuralink BCI Human Trials Series', 'neuralink-bci-series', 'Sample Project: Support commercial clinical trial deployment for high-bandwidth neural interfaces.', 'Neuralink', 'Open', 80000000.00, '25%–85% Yield', 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248190/projects/neuralink-bci.jpg', 'Fremont, CA', 'Neurotechnology', 'Sample Development Data — Min entry $3,000.', ARRAY['Surgical Robotics', 'Clinical Expansion', 'FDA Trial Scaling'], 'Q2 2025 - Q4 2026', 'Biotech and medical technology subject to regulatory approval schedules. Sample preview data.'),
  ('boring-loop-network', 'Boring Company Vegas Loop Network Expansion', 'boring-loop-network', 'Sample Project: Expand underground zero-emission transit tunnel networks in major metropolitan areas.', 'The Boring Company', 'Open', 95000000.00, '30%–88% Yield', 'https://res.cloudinary.com/do2jdvxzh/image/upload/v1776248185/projects/boring-loop.jpg', 'Las Vegas, NV', 'Tunneling Transit', 'Sample Development Data — Min entry $2,000.', ARRAY['68-Station Network', 'Prufrock III Tunneling', 'Zero-Emission Transit'], 'Q1 2025 - Q3 2026', 'Transit infrastructure subject to municipal permitting and construction timelines. Sample preview data.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  target_amount = EXCLUDED.target_amount,
  display_metric = EXCLUDED.display_metric,
  image_url = EXCLUDED.image_url;

-- Seed Membership Tiers
INSERT INTO public.membership_tiers (id, name, price, currency, description, benefits, features, display_order, active, upgrade_info)
VALUES
  ('silver', 'Silver', 2000.00, 'USD', 'Entry tier membership for emerging private equity and vehicle investors.', ARRAY['Priority Support (48h)', 'Member-only Market Insights', 'Early Access to New Projects'], ARRAY['$2,000 Entry Level', 'Standard Yield Analytics', 'Email Portfolio Digest'], 1, true, 'Deposit $2,000 or maintain active investments to unlock Silver privileges.'),
  ('gold', 'Gold', 5000.00, 'USD', 'Elevated membership tier for active capital allocators with dedicated management.', ARRAY['24/7 Priority Support Line', 'Dedicated Account Manager', 'Reduced Transaction Fees', 'Private Webcast Invitations'], ARRAY['$5,000 Entry Level', 'Real-Time Portfolio Telemetry', 'Priority Vehicle Delivery Allocation'], 2, true, 'Deposit $5,000 or upgrade to unlock Gold privileges.'),
  ('platinum', 'Platinum', 10000.00, 'USD', 'Institutional-grade tier offering bespoke portfolio structuring and zero management fees.', ARRAY['1-on-1 Strategy Sessions with Analysts', 'Direct Co-Investment Allocation', 'Zero Strategy Management Fees', 'Exclusive Quarterly Briefings'], ARRAY['$10,000 Entry Level', 'VIP Direct Contact Line', 'Bespoke AI Execution Parameters'], 3, true, 'Deposit $10,000 to achieve Platinum VIP status.')
ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  benefits = EXCLUDED.benefits;

-- Seed AI Plans
INSERT INTO public.ai_plans (id, name, min_amount, max_amount, expected_return_range, cycle_duration, description, features, active)
VALUES
  ('starter-ai', 'Starter AI', 1000.00, 10000.00, '200%–350%', '24 Hours', 'Designed for new investors seeking structured exposure with automated risk controls.', ARRAY['Automated trade execution', 'Risk-adjusted capital deployment', 'Portfolio rebalancing', 'Monthly performance reporting'], true),
  ('growth-ai', 'Growth AI', 10000.00, 100000.00, '350%–550%', '3 Days', 'Enhanced AI signal modeling focused on high-growth technology sectors.', ARRAY['High-frequency signal detection', 'Sector rotation strategy', 'Volatility hedging logic', 'Weekly analytics dashboard'], true),
  ('elite-ai', 'Elite AI', 100000.00, NULL, '+700%', '5 Days', 'Multi-layered AI execution across diversified innovation assets with downside protection.', ARRAY['Cross-sector AI allocation engine', 'Downside risk containment protocol', 'Real-time capital rebalancing', 'Dedicated strategy oversight'], true)
ON CONFLICT (id) DO UPDATE SET
  min_amount = EXCLUDED.min_amount,
  expected_return_range = EXCLUDED.expected_return_range;
