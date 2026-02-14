/* ═══════════════════════════════════════════════════════════════════
   INTAKE FORM TYPES — Finance Plan Builder
   ═══════════════════════════════════════════════════════════════════ */

export interface EquityInvestor {
  label: string;
  amount: number | null;
  priority: string;
  preferred_return_pct: number;
  profit_participation_pct: number;
  is_default: boolean;
}

export interface DebtTranche {
  label: string;
  principal: number | null;
  interest_rate_pct: number;
  security_type: string;
  priority: string;
  is_default: boolean;
}

export interface SoftMoney {
  label: string;
  type: string;
  amount: number | null;
  is_default: boolean;
}

export interface Deferment {
  role: string;
  amount: number | null;
  triggers_at: string;
  is_default: boolean;
}

export interface IntakeFormData {
  // Step 1: Project Identity
  project_title: string;
  production_company: string;
  genre: string;
  logline: string;

  // Step 2: Budget
  total_budget: number | null;

  // Step 3: Capital Stack
  equity_investors: EquityInvestor[];
  has_debt: boolean;
  debt_tranches: DebtTranche[];
  soft_money: SoftMoney[];
  has_deferments: boolean;
  deferments: Deferment[];

  // Step 4: Deal Structure
  distribution_model: string;
  sa_domestic_commission_pct: number;
  sa_international_commission_pct: number;
  sa_expense_cap: number;
  sa_domestic_commission_is_default: boolean;
  sa_international_commission_is_default: boolean;
  sa_expense_cap_is_default: boolean;
  dp_target_platform: string;
  dp_deal_type: string;
  cam_fee_pct: number;
  cam_fee_is_default: boolean;
  distribution_fee_domestic_pct: number;
  distribution_fee_international_pct: number;
  distribution_fee_domestic_is_default: boolean;
  distribution_fee_international_is_default: boolean;

  // Step 5: Scenarios
  scenario_conservative: number | null;
  scenario_target: number | null;
  scenario_optimistic: number | null;
}

export const INITIAL_FORM_DATA: IntakeFormData = {
  project_title: "",
  production_company: "",
  genre: "",
  logline: "",
  total_budget: null,
  equity_investors: [
    {
      label: "Equity Investor 1",
      amount: null,
      priority: "first_position",
      preferred_return_pct: 120,
      profit_participation_pct: 50,
      is_default: true,
    },
  ],
  has_debt: false,
  debt_tranches: [
    {
      label: "Senior Debt",
      principal: null,
      interest_rate_pct: 10,
      security_type: "",
      priority: "first_position",
      is_default: true,
    },
  ],
  soft_money: [
    {
      label: "State/Country Tax Credit",
      type: "",
      amount: null,
      is_default: true,
    },
  ],
  has_deferments: false,
  deferments: [
    {
      role: "",
      amount: null,
      triggers_at: "after_equity_recoupment",
      is_default: true,
    },
  ],
  distribution_model: "",
  sa_domestic_commission_pct: 12.5,
  sa_international_commission_pct: 22.5,
  sa_expense_cap: 75000,
  sa_domestic_commission_is_default: true,
  sa_international_commission_is_default: true,
  sa_expense_cap_is_default: true,
  dp_target_platform: "",
  dp_deal_type: "",
  cam_fee_pct: 0.75,
  cam_fee_is_default: true,
  distribution_fee_domestic_pct: 25,
  distribution_fee_international_pct: 35,
  distribution_fee_domestic_is_default: true,
  distribution_fee_international_is_default: true,
  scenario_conservative: null,
  scenario_target: null,
  scenario_optimistic: null,
};

export const GENRE_OPTIONS = [
  "Action / Thriller",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi / Fantasy",
  "Romance",
  "Documentary",
  "Animation",
  "Crime / Mystery",
  "Family / Kids",
  "Other",
];

export const PRIORITY_OPTIONS = [
  { value: "first_position", label: "First Position" },
  { value: "second_position", label: "Second Position" },
  { value: "pari_passu", label: "Pari Passu" },
];

export const SECURITY_TYPE_OPTIONS = [
  { value: "tax_credits", label: "Secured by Tax Credits" },
  { value: "presales", label: "Secured by Presales/MGs" },
  { value: "completion_bond", label: "Secured by Completion Bond" },
  { value: "gap_mezzanine", label: "Gap/Mezzanine (Unsold Territories)" },
  { value: "unsecured", label: "Unsecured" },
];

export const SOFT_MONEY_TYPE_OPTIONS = [
  { value: "tax_credit_refundable", label: "Tax Credit (Refundable)" },
  { value: "tax_credit_transferable", label: "Tax Credit (Transferable)" },
  { value: "tax_rebate", label: "Tax Rebate" },
  { value: "grant", label: "Grant (Non-Recoupable)" },
  { value: "presale", label: "Presale / Minimum Guarantee" },
];

export const DEFERMENT_ROLE_OPTIONS = [
  { value: "producer_fee", label: "Producer Fee" },
  { value: "director_fee", label: "Director Fee" },
  { value: "lead_actors", label: "Lead Actor(s)" },
  { value: "writer", label: "Writer" },
  { value: "key_crew", label: "Key Crew" },
  { value: "other", label: "Other" },
];

export const DEFERMENT_TRIGGER_OPTIONS = [
  { value: "after_equity_recoupment", label: "After Equity Recoupment" },
  { value: "after_debt_equity_recoupment", label: "After Debt + Equity Recoupment" },
  { value: "first_day_pp", label: "First Day of Principal Photography" },
  { value: "from_net_profits", label: "From Net Profits" },
];

export const PLATFORM_OPTIONS = [
  { value: "netflix", label: "Netflix" },
  { value: "amazon", label: "Amazon/MGM" },
  { value: "apple", label: "Apple TV+" },
  { value: "hulu", label: "Hulu" },
  { value: "tubi", label: "Tubi/Fox" },
  { value: "lionsgate", label: "Lionsgate" },
  { value: "a24_neon", label: "A24/Neon" },
  { value: "other", label: "Other" },
];

export const DEAL_TYPE_OPTIONS = [
  {
    value: "cost_plus",
    label: "Cost-Plus",
    description: "The platform pays your full budget plus a premium (typically 10-20%). You get guaranteed return but zero upside. All rights transfer to the buyer. This is the Netflix Original model.",
  },
  {
    value: "acquisition",
    label: "Acquisition / All-Rights",
    description: "The platform buys the finished film at market value. Price is negotiated based on comparable acquisitions in your genre/budget range. You finance independently, sell after completion.",
  },
  {
    value: "negative_pickup",
    label: "Negative Pickup",
    description: "The platform commits to buy the film before production, contingent on delivery requirements. Functions like a presale that covers a significant portion of budget. Reduces investor risk substantially.",
  },
];

export const STEP_LABELS = [
  "Project",
  "Budget",
  "Capital Stack",
  "Deal Structure",
  "Scenarios",
  "Review",
];
