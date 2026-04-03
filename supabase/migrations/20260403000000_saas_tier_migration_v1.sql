-- ============================================================
-- SaaS TIER MIGRATION — filmmaker.og
-- Step 1 of many. Run AFTER reviewing with Miles.
-- ============================================================
-- This migration adds subscription support to the existing schema.
-- No existing data is deleted. No downtime.
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. PROFILES — add SaaS tier fields
-- ─────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS tier TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS founding_member BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS max_deals INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS has_whitelabel BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS branding_settings JSONB DEFAULT '{"company_name": "", "logo_url": "", "primary_color": "#D4AF37"}';

-- Tier values: 'free' | 'founding' | 'standard' | 'power'
COMMENT ON COLUMN public.profiles.tier IS 'SaaS subscription tier: free, founding, standard, power';
COMMENT ON COLUMN public.profiles.founding_member IS 'True if user locked in during 90-day launch window';
COMMENT ON COLUMN public.profiles.max_deals IS 'Max saved deals allowed: 0 (free), 1 (founding), 2 (standard), 10 (power)';
COMMENT ON COLUMN public.profiles.has_whitelabel IS 'True if user can white-label exports (standard+)';

-- ─────────────────────────────────────────────
-- 2. SUBSCRIPTIONS — new table for recurring billing
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('founding', 'standard', 'power')),
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_price_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'unpaid')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can do everything (webhooks write here)
CREATE POLICY "Service role manages subscriptions"
  ON public.subscriptions FOR ALL
  USING (auth.role() = 'service_role');

-- Trigger: updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─────────────────────────────────────────────
-- 3. DEALS — replaces/supercedes saved_calculations
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Untitled Deal',
  inputs JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deals_user_id ON public.deals(user_id);
CREATE INDEX IF NOT EXISTS idx_deals_default ON public.deals(user_id, is_default) WHERE is_default = true;

ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- Users can do everything with their own deals
CREATE POLICY "Users manage own deals"
  ON public.deals FOR ALL
  USING (auth.uid() = user_id);

CREATE TRIGGER update_deals_updated_at
    BEFORE UPDATE ON public.deals
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─────────────────────────────────────────────
-- 4. SHAREABLE_LINKS — investor read-only links
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shareable_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  label TEXT DEFAULT 'Investor Link',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_shareable_links_token ON public.shareable_links(token);
CREATE INDEX IF NOT EXISTS idx_shareable_links_user_id ON public.shareable_links(user_id);

ALTER TABLE public.shareable_links ENABLE ROW LEVEL SECURITY;

-- Users manage their own links
CREATE POLICY "Users manage own links"
  ON public.shareable_links FOR ALL
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 5. USER_BRANDING — white label settings
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_branding (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  primary_color TEXT DEFAULT '#D4AF37',
  secondary_color TEXT DEFAULT '#0C0C0E',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_branding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own branding"
  ON public.user_branding FOR ALL
  USING (auth.uid() = user_id);

CREATE TRIGGER update_user_branding_updated_at
    BEFORE UPDATE ON public.user_branding
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─────────────────────────────────────────────
-- 6. DEACTIVATED: saved_calculations
-- Keep table for backward compat during transition.
-- New deals go to 'deals' table. This stays as-is.
-- ─────────────────────────────────────────────

-- ============================================================
-- ROLLBACK (if needed before migration 2):
--   DROP TABLE IF EXISTS public.subscriptions;
--   DROP TABLE IF EXISTS public.deals;
--   DROP TABLE IF EXISTS public.shareable_links;
--   DROP TABLE IF EXISTS public.user_branding;
--   ALTER TABLE public.profiles DROP COLUMN IF EXISTS tier;
--   ALTER TABLE public.profiles DROP COLUMN IF EXISTS founding_member;
--   ALTER TABLE public.profiles DROP COLUMN IF EXISTS max_deals;
--   ALTER TABLE public.profiles DROP COLUMN IF EXISTS has_whitelabel;
--   ALTER TABLE public.profiles DROP COLUMN IF EXISTS branding_settings;
-- ============================================================