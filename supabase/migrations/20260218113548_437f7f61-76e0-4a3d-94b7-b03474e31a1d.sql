
CREATE TABLE public.intake_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_id uuid NOT NULL,
  user_id uuid,
  email text NOT NULL,
  tier text NOT NULL DEFAULT 'the-blueprint',
  includes_working_model boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft',
  current_step integer NOT NULL DEFAULT 1,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),

  -- Step 1: Project basics
  project_title text,
  production_company text,
  genre text,
  logline text,

  -- Step 2: Budget & capital
  total_budget numeric,
  equity_investors jsonb,
  debt_tranches jsonb,
  soft_money jsonb,
  deferments jsonb,

  -- Step 3: Distribution
  distribution_model text,
  sa_domestic_commission_pct numeric,
  sa_international_commission_pct numeric,
  sa_expense_cap numeric,
  sa_domestic_commission_is_default boolean,
  sa_international_commission_is_default boolean,
  sa_expense_cap_is_default boolean,
  dp_target_platform text,
  dp_deal_type text,
  cam_fee_pct numeric,
  cam_fee_is_default boolean,
  distribution_fee_domestic_pct numeric,
  distribution_fee_international_pct numeric,
  distribution_fee_domestic_is_default boolean,
  distribution_fee_international_is_default boolean,

  -- Step 4: Revenue scenarios
  scenario_conservative numeric,
  scenario_target numeric,
  scenario_optimistic numeric
);

ALTER TABLE public.intake_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own submissions"
  ON public.intake_submissions FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own submissions"
  ON public.intake_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own submissions"
  ON public.intake_submissions FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE TRIGGER update_intake_submissions_updated_at
  BEFORE UPDATE ON public.intake_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
