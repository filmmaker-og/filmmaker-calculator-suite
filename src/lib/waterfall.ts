// Waterfall Calculation Logic - Source of Truth from PRD

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
  salesExp: number;
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
  recouped: number;
  recoupPct: number;
  investor: number;
  producer: number;
  multiple: number;
  ledger: LedgerItem[];
}

export function calculateWaterfall(inputs: WaterfallInputs, guilds: GuildState): WaterfallResult {
  // Constants
  const CAM_PCT = 0.01;
  const SAG_PCT = 0.045;
  const WGA_PCT = 0.012;
  const DGA_PCT = 0.012;

  // Extract inputs with safety guards (ensure non-negative)
  const revenue = Math.max(0, inputs.revenue || 0);
  const debt = Math.max(0, inputs.debt || 0);
  const seniorDebtRate = Math.max(0, Math.min(100, inputs.seniorDebtRate || 0));
  const mezzanineDebt = Math.max(0, inputs.mezzanineDebt || 0);
  const mezzanineRate = Math.max(0, Math.min(100, inputs.mezzanineRate || 0));
  const equity = Math.max(0, inputs.equity || 0);
  const premium = Math.max(0, Math.min(100, inputs.premium || 0));
  const salesFee = Math.max(0, Math.min(100, inputs.salesFee || 0));
  const salesExp = Math.max(0, inputs.salesExp || 0);

  // 1. Off-the-Top
  const salesFeeAmount = revenue * (salesFee / 100);
  const cam = revenue * CAM_PCT;
  const marketing = salesExp;

  // 2. Guilds
  const guildPct = (guilds.sag ? SAG_PCT : 0) +
                   (guilds.wga ? WGA_PCT : 0) +
                   (guilds.dga ? DGA_PCT : 0);
  const guildsCost = revenue * guildPct;

  // 3. Hurdles - Now using actual user-input rates
  const offTop = cam + guildsCost + salesFeeAmount + marketing;
  const seniorDebtHurdle = debt * (1 + (seniorDebtRate / 100));
  const mezzDebtHurdle = mezzanineDebt * (1 + (mezzanineRate / 100));
  const totalDebtHurdle = seniorDebtHurdle + mezzDebtHurdle;
  const equityHurdle = equity * (1 + (premium / 100));
  const totalHurdle = offTop + totalDebtHurdle + equityHurdle;

  // 4. Distribution
  const profitPool = Math.max(0, revenue - totalHurdle);
  const recouped = Math.min(revenue, totalHurdle);
  const recoupPct = totalHurdle > 0 ? Math.min(100, (revenue / totalHurdle) * 100) : 0;

  const investorRecoup = Math.min(equityHurdle, Math.max(0, revenue - offTop - totalDebtHurdle));
  const investorTotal = investorRecoup + (profitPool * 0.5);
  const producerShare = profitPool * 0.5;
  const multiple = equity > 0 ? investorTotal / equity : 0;

  // 5. Ledger Construction
  const ledger: LedgerItem[] = [
    { name: "CAM / Admin", detail: "1% OF GROSS", amount: cam },
    { name: "Marketing / Delivery", detail: "FIXED ASSUMPTION", amount: marketing },
    { name: "Sales Agent", detail: `${salesFee}% COMMISSION`, amount: salesFeeAmount },
    { name: "Unions", detail: "GUILD RESIDUALS / P&H", amount: guildsCost },
    { name: "Senior Debt", detail: `${seniorDebtRate}% INTEREST`, amount: seniorDebtHurdle },
    ...(mezzanineDebt > 0 ? [{ name: "Gap/Mezz Debt", detail: `${mezzanineRate}% INTEREST`, amount: mezzDebtHurdle }] : []),
    { name: "Equity", detail: `PRINCIPAL + ${premium}% PREF`, amount: equityHurdle }
  ];

  return {
    profitPool,
    totalHurdle,
    cam,
    salesFee: salesFeeAmount,
    guilds: guildsCost,
    marketing,
    recouped,
    recoupPct,
    investor: investorTotal,
    producer: producerShare,
    multiple,
    ledger
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

  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
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
