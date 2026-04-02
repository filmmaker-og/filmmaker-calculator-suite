-- ═══════════════════════════════════════════════════════════════════
-- FIX: Add missing RLS policies for leads, waterfall_snapshots, og_bot_leads
--
-- These tables were missing RLS policies, meaning their access was
-- controlled only by default Supabase settings (which may allow
-- unrestricted anonymous access).
-- ═══════════════════════════════════════════════════════════════════

-- ── LEADS TABLE ───────────────────────────────────────────────────
-- Used by LeadCaptureModal for email capture
-- Strategy: Anyone can INSERT (lead gen), but only service role can read/update

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop any existing overly permissive policies
DROP POLICY IF EXISTS "Enable insert for all users" ON public.leads;
DROP POLICY IF EXISTS "Enable read for all users" ON public.leads;

CREATE POLICY "Anyone can insert leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

-- Block anonymous reads and updates — service role only
CREATE POLICY "Service role full access to leads"
  ON public.leads FOR ALL
  USING (public.is_service_role());


-- ── WATERFALL SNAPSHOTS TABLE ────────────────────────────────────
-- Used for PDF generation — stores user calculation snapshots
-- Strategy: Users can only access their own (by email match)
-- Service role can access all (for PDF generation)

ALTER TABLE public.waterfall_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read for all users" ON public.waterfall_snapshots;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.waterfall_snapshots;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.waterfall_snapshots;

-- Users can view their own snapshots (matched by email)
CREATE POLICY "Users view own snapshots"
  ON public.waterfall_snapshots FOR SELECT
  USING (auth.jwt() ->> 'email' = user_email);

-- Users can create their own snapshots
CREATE POLICY "Users create own snapshots"
  ON public.waterfall_snapshots FOR INSERT
  WITH CHECK (auth.jwt() ->> 'email' = user_email);

-- Users can delete their own snapshots
CREATE POLICY "Users delete own snapshots"
  ON public.waterfall_snapshots FOR DELETE
  USING (auth.jwt() ->> 'email' = user_email);

-- Service role can access all snapshots (for PDF generation, admin)
CREATE POLICY "Service role full access to snapshots"
  ON public.waterfall_snapshots FOR ALL
  USING (public.is_service_role());


-- ── OG BOT LEADS TABLE ───────────────────────────────────────────
-- Used by ask-the-og edge function for session memory and lead capture
-- Strategy: Service role only (the edge function handles all access)

-- Create the table if it doesn't exist (idempotent)
CREATE TABLE IF NOT EXISTS public.og_bot_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  first_question TEXT,
  source TEXT DEFAULT 'og_bot',
  conversation_history JSONB DEFAULT '[]',
  last_conversation_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.og_bot_leads ENABLE ROW LEVEL SECURITY;

-- Service role only — the edge function uses service_role key
CREATE POLICY "Service role full access to og_bot_leads"
  ON public.og_bot_leads FOR ALL
  USING (public.is_service_role());

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_og_bot_leads_email ON public.og_bot_leads(email);
CREATE INDEX IF NOT EXISTS idx_og_bot_leads_last_conversation ON public.og_bot_leads(last_conversation_at);
