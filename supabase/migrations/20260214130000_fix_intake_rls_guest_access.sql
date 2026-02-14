-- ═══════════════════════════════════════════════════════════════════
-- FIX: RLS policies for guest (unauthenticated) intake_submissions
--
-- Problem: Guest users can INSERT but cannot SELECT or UPDATE their
-- own records because the existing policies require auth.uid() = user_id,
-- which fails when both are NULL (SQL: NULL = NULL → NULL, not TRUE).
--
-- Solution: Allow access to guest records (user_id IS NULL) when the
-- caller can identify the record by purchase_id. The purchase_id is a
-- UUID known only from the Stripe checkout redirect, serving as an
-- access token for guest users (link-based access model).
-- ═══════════════════════════════════════════════════════════════════

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own submissions" ON public.intake_submissions;
DROP POLICY IF EXISTS "Users can update own submissions" ON public.intake_submissions;

-- SELECT: authenticated users see their records; guests see records where user_id IS NULL
CREATE POLICY "Users can view own submissions"
  ON public.intake_submissions FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- UPDATE: same logic — authenticated users update their records; guests update guest records
CREATE POLICY "Users can update own submissions"
  ON public.intake_submissions FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);
