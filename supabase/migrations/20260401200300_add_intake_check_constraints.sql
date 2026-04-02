-- ═══════════════════════════════════════════════════════════════════
-- FIX: Add CHECK constraints to intake_submissions for data integrity
--
-- Prevents invalid data from being stored even if client-side
-- validation is bypassed.
-- ═══════════════════════════════════════════════════════════════════

-- Budget and revenue must be non-negative when provided
ALTER TABLE public.intake_submissions
  ADD CONSTRAINT intake_total_budget_non_negative
  CHECK (total_budget IS NULL OR total_budget >= 0);

-- Scenario values must follow logical ordering when all provided
ALTER TABLE public.intake_submissions
  ADD CONSTRAINT intake_scenario_ordering
  CHECK (
    scenario_conservative IS NULL
    OR scenario_target IS NULL
    OR scenario_optimistic IS NULL
    OR (scenario_conservative <= scenario_target AND scenario_target <= scenario_optimistic)
  );

-- Commission and fee percentages must be reasonable (0-100%)
ALTER TABLE public.intake_submissions
  ADD CONSTRAINT intake_sa_domestic_commission_range
  CHECK (sa_domestic_commission_pct IS NULL OR (sa_domestic_commission_pct >= 0 AND sa_domestic_commission_pct <= 100));

ALTER TABLE public.intake_submissions
  ADD CONSTRAINT intake_sa_international_commission_range
  CHECK (sa_international_commission_pct IS NULL OR (sa_international_commission_pct >= 0 AND sa_international_commission_pct <= 100));

ALTER TABLE public.intake_submissions
  ADD CONSTRAINT intake_distribution_fee_domestic_range
  CHECK (distribution_fee_domestic_pct IS NULL OR (distribution_fee_domestic_pct >= 0 AND distribution_fee_domestic_pct <= 100));

ALTER TABLE public.intake_submissions
  ADD CONSTRAINT intake_distribution_fee_intl_range
  CHECK (distribution_fee_international_pct IS NULL OR (distribution_fee_international_pct >= 0 AND distribution_fee_international_pct <= 100));

ALTER TABLE public.intake_submissions
  ADD CONSTRAINT intake_cam_fee_range
  CHECK (cam_fee_pct IS NULL OR (cam_fee_pct >= 0 AND cam_fee_pct <= 100));

-- Tier must be a valid value
ALTER TABLE public.intake_submissions
  ADD CONSTRAINT intake_tier_valid
  CHECK (tier IN ('the-blueprint', 'the-pitch-package'));

-- Status must be a valid value
ALTER TABLE public.intake_submissions
  ADD CONSTRAINT intake_status_valid
  CHECK (status IN ('draft', 'submitted', 'processing', 'delivered'));

-- Distribution model must be valid
ALTER TABLE public.intake_submissions
  ADD CONSTRAINT intake_distribution_model_valid
  CHECK (distribution_model IS NULL OR distribution_model IN ('sales_agent', 'direct_platform'));

-- Expense cap must be non-negative
ALTER TABLE public.intake_submissions
  ADD CONSTRAINT intake_expense_cap_non_negative
  CHECK (sa_expense_cap IS NULL OR sa_expense_cap >= 0);
