-- ═══════════════════════════════════════════════════════════════════
-- INTAKE SUBMISSIONS — Finance Plan Builder guided form data
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE public.intake_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_id UUID REFERENCES public.purchases(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  tier TEXT NOT NULL, -- 'the-blueprint' or 'the-pitch-package'
  includes_working_model BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft', -- 'draft', 'submitted', 'processing', 'delivered'

  -- Step 1: Project Identity
  project_title TEXT,
  production_company TEXT,
  genre TEXT,
  logline TEXT,

  -- Step 2: Budget
  total_budget NUMERIC,
  budget_currency TEXT DEFAULT 'USD',

  -- Step 3: Capital Stack (stored as JSONB arrays for flexibility)
  equity_investors JSONB DEFAULT '[]',
  -- Each investor: { label, amount, priority, preferred_return_pct, profit_participation_pct, is_default }
  debt_tranches JSONB DEFAULT '[]',
  -- Each tranche: { label, principal, interest_rate_pct, security_type, priority, is_default }
  soft_money JSONB DEFAULT '[]',
  -- Each source: { label, type, amount, is_default }
  -- type: 'tax_credit', 'grant', 'rebate', 'presale'
  deferments JSONB DEFAULT '[]',
  -- Each deferment: { role, amount, triggers_at, is_default }

  -- Step 4: Deal Structure
  distribution_model TEXT, -- 'sales_agent' or 'direct_platform'
  -- Sales Agent fields (conditional: only if distribution_model = 'sales_agent')
  sa_domestic_commission_pct NUMERIC DEFAULT 12.5,
  sa_international_commission_pct NUMERIC DEFAULT 22.5,
  sa_expense_cap NUMERIC DEFAULT 75000,
  sa_domestic_commission_is_default BOOLEAN DEFAULT true,
  sa_international_commission_is_default BOOLEAN DEFAULT true,
  sa_expense_cap_is_default BOOLEAN DEFAULT true,
  -- Direct Platform fields (conditional: only if distribution_model = 'direct_platform')
  dp_target_platform TEXT, -- 'netflix', 'amazon', 'hulu', 'tubi', 'other'
  dp_deal_type TEXT, -- 'cost_plus', 'acquisition', 'negative_pickup'
  -- Common fields
  cam_fee_pct NUMERIC DEFAULT 0.75,
  cam_fee_is_default BOOLEAN DEFAULT true,
  distribution_fee_domestic_pct NUMERIC DEFAULT 25,
  distribution_fee_international_pct NUMERIC DEFAULT 35,
  distribution_fee_domestic_is_default BOOLEAN DEFAULT true,
  distribution_fee_international_is_default BOOLEAN DEFAULT true,

  -- Step 5: Scenarios
  scenario_conservative NUMERIC,
  scenario_target NUMERIC,
  scenario_optimistic NUMERIC,

  -- Meta
  current_step INTEGER DEFAULT 1,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_intake_purchase_id ON public.intake_submissions(purchase_id);
CREATE INDEX idx_intake_user_id ON public.intake_submissions(user_id);
CREATE INDEX idx_intake_email ON public.intake_submissions(email);
CREATE INDEX idx_intake_status ON public.intake_submissions(status);

-- RLS
ALTER TABLE public.intake_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own submissions"
  ON public.intake_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create submissions"
  ON public.intake_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own submissions"
  ON public.intake_submissions FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can do anything (for webhooks and admin)
CREATE POLICY "Service role full access"
  ON public.intake_submissions FOR ALL
  USING (public.is_service_role());

-- Updated_at trigger (reuse existing function)
CREATE TRIGGER update_intake_submissions_updated_at
  BEFORE UPDATE ON public.intake_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Notification hook point: log when status changes to 'submitted'
-- (v1: operator monitors Supabase dashboard; v2: trigger sends email)
CREATE OR REPLACE FUNCTION public.notify_intake_submitted()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'submitted' AND (OLD.status IS NULL OR OLD.status != 'submitted') THEN
    RAISE LOG 'Intake submission submitted: id=%, project=%, email=%',
      NEW.id, NEW.project_title, NEW.email;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER intake_submission_notify
  AFTER UPDATE ON public.intake_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_intake_submitted();
