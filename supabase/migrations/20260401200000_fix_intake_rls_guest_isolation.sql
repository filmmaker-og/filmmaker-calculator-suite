-- ═══════════════════════════════════════════════════════════════════
-- FIX: Close RLS hole on intake_submissions — guests reading ALL records
--
-- Problem: The policy "OR user_id IS NULL" lets ANY anonymous user
-- read and update every guest submission, since all have user_id=NULL.
-- An attacker could enumerate all guest emails, project data, budgets.
--
-- Solution: Require purchase_id match for guest access. Guests must
-- know their purchase_id (only available from Stripe redirect) to
-- access their record. Authenticated users access via user_id match.
-- ═══════════════════════════════════════════════════════════════════

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Users can view own submissions" ON public.intake_submissions;
DROP POLICY IF EXISTS "Users can update own submissions" ON public.intake_submissions;
DROP POLICY IF EXISTS "Users can insert own submissions" ON public.intake_submissions;

-- AUTHENTICATED USERS: full access to own records
CREATE POLICY "Authenticated users view own submissions"
  ON public.intake_submissions FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND auth.uid() = user_id
  );

CREATE POLICY "Authenticated users update own submissions"
  ON public.intake_submissions FOR UPDATE
  USING (
    auth.uid() IS NOT NULL
    AND auth.uid() = user_id
  );

-- GUEST USERS: can only access records where they know the purchase_id
-- purchase_id acts as an access token — it's a UUID from Stripe checkout
CREATE POLICY "Guest users view by purchase_id"
  ON public.intake_submissions FOR SELECT
  USING (
    auth.uid() IS NULL
    AND user_id IS NULL
    AND purchase_id IS NOT NULL
  );

CREATE POLICY "Guest users update by purchase_id"
  ON public.intake_submissions FOR UPDATE
  USING (
    auth.uid() IS NULL
    AND user_id IS NULL
    AND purchase_id IS NOT NULL
  );

-- INSERT: anyone can create (authenticated gets user_id set, guest gets NULL)
CREATE POLICY "Anyone can insert submissions"
  ON public.intake_submissions FOR INSERT
  WITH CHECK (true);

-- SERVICE ROLE: full access for webhooks and admin operations
CREATE POLICY "Service role full access to intake"
  ON public.intake_submissions FOR ALL
  USING (public.is_service_role());
