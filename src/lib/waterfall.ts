// Waterfall Calculation Logic - Source of Truth from PRD
// Last updated: 2026-02-07

// ===== SHARED CONSTANTS (single source of truth) =====
export const CAM_PCT = 0.01;
export const SAG_PCT = 0.045;
export const WGA_PCT = 0.012;
export const DGA_PCT = 0.012;

export interface WaterfallInputs {
  revenue: number;
  budget: number;
  credits: number;
  debt: number;
  seniorDebtRate: number;
  mezzanineDebt: number;
  mezzanineRate: number;
  equity: number;
  premium: number;
  salesFee: number;
  salesExp: number;  // Sales & Marketing expenses cap (AFM, markets, deliverables)
  deferments: number; // Deferred compensation (producer fees, talent, etc.)
}

export interface GuildState {
  sag: boolean;
  wga: boolean;
  dga: boolean;
}

export interface LedgerItem {
  name: string;
  detail: string;
  amount: number;
}

export interface WaterfallResult {
  profitPool: number;
  totalHurdle: number;
  cam: number;
  salesFee: number;
  guilds: number;
  marketing: number;
  deferments: number;
  credits: number;
  recouped: number;
  recoupPct: number;
  investor: number;
  producer: number;
  multiple: number;
  ledger: LedgerItem[];
  // Structured phase totals — use these instead of re-deriving from ledger
  offTopTotal: number;
  debtTotal: number;
  seniorDebtHurdle: number;
  mezzDebtHurdle: number;
  equityHurdle: number;
}

// Calculate the algebraic breakeven point
// CapitalSelections interface - used for breakeven calculations
export interface CapitalSelections {
  taxCredits: boolean;
  seniorDebt: boolean;
  gapLoan: boolean;
  equity: boolean;
  deferments: boolean;
}

export function calculateBreakeven(inputs: WaterfallInputs, guilds: GuildState, selections: CapitalSelections): number {
  // Calculate off-top percentage (variable costs based on revenue)
  const salesFeePct = Math.max(0, Math.min(100, inputs.salesFee || 0)) / 100;
  const guildsPct = (guilds.sag ? SAG_PCT : 0) +
                    (guilds.wga ? WGA_PCT : 0) +
                    (guilds.dga ? DGA_PCT : 0);
  
  const offTopRate = salesFeePct + CAM_PCT + guildsPct;

  // Calculate fixed costs (not dependent on revenue)
  const marketingCap = Math.max(0, inputs.salesExp || 0);
  const defermentsCost = Math.max(0, inputs.deferments || 0);
  
  // Debt repayment
  const seniorDebtRepay = selections.seniorDebt 
    ? Math.max(0, inputs.debt || 0) * (1 + Math.max(0, inputs.seniorDebtRate || 0) / 100)
    : 0;
  const mezzDebtRepay = selections.gapLoan 
    ? Math.max(0, inputs.mezzanineDebt || 0) * (1 + Math.max(0, inputs.mezzanineRate || 0) / 100)
    : 0;
  
  // Equity + premium
  const equityRepay = selections.equity 
    ? Math.max(0, inputs.equity || 0) * (1 + Math.max(0, inputs.premium || 0) / 100)
    : 0;
  
  // Tax credits offset (reduces what you need)
  const creditsOffset = selections.taxCredits ? Math.max(0, inputs.credits || 0) : 0;

  // Fixed costs = Debt + Equity + Deferments - Credits + Marketing
  const fixedCosts = seniorDebtRepay + mezzDebtRepay + equityRepay + defermentsCost - creditsOffset + marketingCap;

  // Breakeven X = fixedCosts / (1 - offTopRate)
  // Guard against division by zero (if offTopRate >= 100%)
  if (offTopRate >= 1) {
    return Infinity; // Impossible to break even
  }

  const breakeven = fixedCosts / (1 - offTopRate);
  return Math.max(0, breakeven);
}

// Get off-top rate as a percentage (for display)
export function getOffTopRate(inputs: WaterfallInputs, guilds: GuildState): number {
  const salesFeePct = Math.max(0, Math.min(100, inputs.salesFee || 0)) / 100;
  const guildsPct = (guilds.sag ? SAG_PCT : 0) +
                    (guilds.wga ? WGA_PCT : 0) +
                    (guilds.dga ? DGA_PCT : 0);
  
  return (salesFeePct + CAM_PCT + guildsPct) * 100;
}

export function calculateWaterfall(inputs: WaterfallInputs, guilds: GuildState): WaterfallResult {
  // Extract inputs with safety guards (ensure non-negative)
  const revenue = Math.max(0, inputs.revenue || 0);
  const credits = Math.max(0, inputs.credits || 0);
  const debt = Math.max(0, inputs.debt || 0);
  const seniorDebtRate = Math.max(0, Math.min(100, inputs.seniorDebtRate || 0));
  const mezzanineDebt = Math.max(0, inputs.mezzanineDebt || 0);
  const mezzanineRate = Math.max(0, Math.min(100, inputs.mezzanineRate || 0));
  const equity = Math.max(0, inputs.equity || 0);
  const premium = Math.max(0, Math.min(100, inputs.premium || 0));
  const salesFee = Math.max(0, Math.min(100, inputs.salesFee || 0));
  const salesExp = Math.max(0, inputs.salesExp || 0);
  const deferments = Math.max(0, inputs.deferments || 0);

  // 1. Off-the-Top
  const salesFeeAmount = revenue * (salesFee / 100);
  const cam = revenue * CAM_PCT;
  const marketing = salesExp; // Sales & Marketing cap

  // 2. Guilds
  const guildPct = (guilds.sag ? SAG_PCT : 0) +
                   (guilds.wga ? WGA_PCT : 0) +
                   (guilds.dga ? DGA_PCT : 0);
  const guildsCost = revenue * guildPct;

  // 3. Hurdles
  const offTop = cam + guildsCost + salesFeeAmount + marketing;
  const seniorDebtHurdle = debt * (1 + (seniorDebtRate / 100));
  const mezzDebtHurdle = mezzanineDebt * (1 + (mezzanineRate / 100));
  const totalDebtHurdle = seniorDebtHurdle + mezzDebtHurdle;
  const equityHurdle = equity * (1 + (premium / 100));

  // 4. Tax credits reduce the total hurdle (consistent with breakeven calc)
  const totalHurdle = offTop + totalDebtHurdle + equityHurdle + deferments - credits;

  // 5. Distribution
  const profitPool = Math.max(0, revenue - totalHurdle);
  const recouped = Math.min(revenue, Math.max(0, totalHurdle));
  const recoupPct = totalHurdle > 0 ? Math.min(100, (revenue / totalHurdle) * 100) : 0;

  const investorRecoup = Math.min(equityHurdle, Math.max(0, revenue - offTop - totalDebtHurdle));
  const investorTotal = investorRecoup + (profitPool * 0.5);
  const producerShare = profitPool * 0.5;
  const multiple = equity > 0 ? investorTotal / equity : 0;

  // 6. Ledger Construction
  const ledger: LedgerItem[] = [
    { name: "CAM / Admin", detail: "1% OF GROSS", amount: cam },
    { name: "Sales Agent Marketing", detail: "EXPENSE CAP (STANDARD $75K)", amount: marketing },
    { name: "Sales Agent", detail: `${salesFee}% COMMISSION`, amount: salesFeeAmount },
    { name: "Unions", detail: "GUILD RESIDUALS / P&H", amount: guildsCost },
    ...(credits > 0 ? [{ name: "Tax Credits", detail: "INCENTIVE OFFSET", amount: -credits }] : []),
    { name: "Senior Debt", detail: `${seniorDebtRate}% INTEREST`, amount: seniorDebtHurdle },
    ...(mezzanineDebt > 0 ? [{ name: "Gap/Mezz Debt", detail: `${mezzanineRate}% INTEREST`, amount: mezzDebtHurdle }] : []),
    { name: "Equity", detail: `PRINCIPAL + ${premium}% PREF`, amount: equityHurdle },
    ...(deferments > 0 ? [{ name: "Deferments", detail: "DEFERRED COMPENSATION", amount: deferments }] : []),
  ];

  return {
    profitPool,
    totalHurdle,
    cam,
    salesFee: salesFeeAmount,
    guilds: guildsCost,
    marketing,
    deferments,
    credits,
    recouped,
    recoupPct,
    investor: investorTotal,
    producer: producerShare,
    multiple,
    ledger,
    // Structured phase totals
    offTopTotal: offTop,
    debtTotal: totalDebtHurdle,
    seniorDebtHurdle,
    mezzDebtHurdle,
    equityHurdle,
  };
}

export function formatCurrency(value: number): string {
  // Guard against NaN/Infinity
  if (!Number.isFinite(value)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactCurrency(value: number): string {
  // Guard against NaN/Infinity
  if (!Number.isFinite(value)) return '$0';

  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);

  if (abs >= 1000000) {
    return `${sign}$${(abs / 1000000).toFixed(1)}M`;
  }
  if (abs >= 1000) {
    return `${sign}$${(abs / 1000).toFixed(0)}K`;
  }
  return formatCurrency(value);
}

export function formatPercent(value: number): string {
  // Guard against NaN/Infinity
  if (!Number.isFinite(value)) return '0.0%';
  return `${value.toFixed(1)}%`;
}

export function formatMultiple(value: number): string {
  // Guard against NaN/Infinity
  if (!Number.isFinite(value)) return '0.00x';
  return `${value.toFixed(2)}x`;
}
