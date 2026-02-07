-- Drop overly permissive policies
DROP POLICY IF EXISTS "Allow creating purchases" ON public.purchases;
DROP POLICY IF EXISTS "Allow updating purchases" ON public.purchases;

-- Create a security definer function for webhook operations
CREATE OR REPLACE FUNCTION public.is_service_role()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT current_setting('role', true) = 'service_role'
$$;

-- Users can insert their own purchases (for checkout initiation)
CREATE POLICY "Users can create own purchases"
  ON public.purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Only allow updates to pending purchases by the same user or service role
CREATE POLICY "Users can update own pending purchases"
  ON public.purchases FOR UPDATE
  USING (
    (auth.uid() = user_id AND status = 'pending')
  );