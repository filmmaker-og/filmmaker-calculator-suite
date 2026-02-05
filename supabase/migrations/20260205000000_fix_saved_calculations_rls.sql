-- Fix RLS policies for saved_calculations to prevent anonymous access
-- This migration closes a security hole where anonymous users could read saved calculations

-- Drop the old permissive policy
DROP POLICY IF EXISTS "Individual Access" ON public.saved_calculations;

-- Create explicit policies for each operation that require authentication

-- SELECT: Only authenticated users can read their own calculations
CREATE POLICY "Authenticated users can view own calculations"
ON public.saved_calculations
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND
  auth.uid() = user_id
);

-- INSERT: Only authenticated users can insert their own calculations
CREATE POLICY "Authenticated users can insert own calculations"
ON public.saved_calculations
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  auth.uid() = user_id
);

-- UPDATE: Only authenticated users can update their own calculations
CREATE POLICY "Authenticated users can update own calculations"
ON public.saved_calculations
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND
  auth.uid() = user_id
);

-- DELETE: Only authenticated users can delete their own calculations
CREATE POLICY "Authenticated users can delete own calculations"
ON public.saved_calculations
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND
  auth.uid() = user_id
);

-- Add a comment explaining the security requirements
COMMENT ON TABLE public.saved_calculations IS
  'Stores user calculation inputs. RLS ensures only authenticated users can access their own data. Anonymous access is explicitly blocked.';
