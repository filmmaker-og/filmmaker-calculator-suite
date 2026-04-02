-- ═══════════════════════════════════════════════════════════════════
-- FIX: Tighten RLS on purchases and exports tables
--
-- Problem: INSERT on purchases allows anyone to create records with
-- user_id IS NULL, enabling fake purchase creation that could bypass
-- access controls for paid features.
--
-- Solution: Only allow INSERT via service role (Stripe webhook).
-- Authenticated users can only view their own purchases.
-- Updates only allowed by service role (webhook status changes).
-- ═══════════════════════════════════════════════════════════════════

-- ── PURCHASES TABLE ──────────────────────────────────────────────

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own purchases" ON public.purchases;
DROP POLICY IF EXISTS "Users can create own purchases" ON public.purchases;
DROP POLICY IF EXISTS "Users can update own pending purchases" ON public.purchases;

-- SELECT: authenticated users see only their own
CREATE POLICY "Users view own purchases"
  ON public.purchases FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND auth.uid() = user_id
  );

-- Service role can also view (for admin/webhook lookups)
CREATE POLICY "Service role view purchases"
  ON public.purchases FOR SELECT
  USING (public.is_service_role());

-- INSERT: ONLY service role (i.e., Stripe webhook)
-- This prevents anyone from creating fake purchase records
CREATE POLICY "Service role inserts purchases"
  ON public.purchases FOR INSERT
  WITH CHECK (public.is_service_role());

-- UPDATE: ONLY service role (webhook updates status)
CREATE POLICY "Service role updates purchases"
  ON public.purchases FOR UPDATE
  USING (public.is_service_role());

-- DELETE: ONLY service role
CREATE POLICY "Service role deletes purchases"
  ON public.purchases FOR DELETE
  USING (public.is_service_role());

-- ── EXPORTS TABLE ────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can view own exports" ON public.exports;
DROP POLICY IF EXISTS "Users can create own exports" ON public.exports;

-- SELECT: authenticated users see only their own
CREATE POLICY "Users view own exports"
  ON public.exports FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND auth.uid() = user_id
  );

-- Service role can also view
CREATE POLICY "Service role view exports"
  ON public.exports FOR SELECT
  USING (public.is_service_role());

-- INSERT: authenticated users creating their own exports + service role
CREATE POLICY "Users create own exports"
  ON public.exports FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND auth.uid() = user_id
  );

CREATE POLICY "Service role inserts exports"
  ON public.exports FOR INSERT
  WITH CHECK (public.is_service_role());

-- UPDATE/DELETE: service role only
CREATE POLICY "Service role manages exports"
  ON public.exports FOR ALL
  USING (public.is_service_role());
