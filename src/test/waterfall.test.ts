import { describe, it, expect } from "vitest";
import {
  calculateWaterfall,
  calculateBreakeven,
  formatCompactCurrency,
  formatCurrency,
  formatMultiple,
  getOffTopRate,
  WaterfallInputs,
  GuildState,
  CapitalSelections,
  CAM_PCT,
  SAG_PCT,
} from "@/lib/waterfall";

// ===== Test Fixtures =====

const baseInputs: WaterfallInputs = {
  revenue: 2500000,
  budget: 1000000,
  credits: 0,
  debt: 500000,
  seniorDebtRate: 10,
  mezzanineDebt: 0,
  mezzanineRate: 18,
  equity: 500000,
  premium: 20,
  salesFee: 10,
  salesExp: 75000,
  deferments: 0,
};

const noGuilds: GuildState = { sag: false, wga: false, dga: false };
const allGuilds: GuildState = { sag: true, wga: true, dga: true };

const allSelections: CapitalSelections = {
  taxCredits: true,
  seniorDebt: true,
  gapLoan: true,
  equity: true,
  deferments: false,
};

// ===== calculateWaterfall =====

describe("calculateWaterfall", () => {
  it("calculates a profitable deal correctly", () => {
    const result = calculateWaterfall(baseInputs, noGuilds);

    // Off-the-top: CAM 1% ($25K) + Sales 10% ($250K) + Marketing ($75K) = $350K
    expect(result.cam).toBe(25000);
    expect(result.salesFee).toBe(250000);
    expect(result.marketing).toBe(75000);
    expect(result.guilds).toBe(0);
    expect(result.offTopTotal).toBe(350000);

    // Debt: $500K * 1.10 = $550K
    expect(result.seniorDebtHurdle).toBe(550000);
    expect(result.mezzDebtHurdle).toBe(0);
    expect(result.debtTotal).toBe(550000);

    // Equity: $500K * 1.20 = $600K
    expect(result.equityHurdle).toBe(600000);

    // Total hurdle: $350K + $550K + $600K = $1.5M
    expect(result.totalHurdle).toBe(1500000);

    // Profit pool: $2.5M - $1.5M = $1M
    expect(result.profitPool).toBe(1000000);

    // 50/50 split
    expect(result.producer).toBe(500000);

    // Investor: $600K recoup + $500K profit share = $1.1M
    expect(result.investor).toBe(1100000);

    // Multiple: $1.1M / $500K = 2.2x
    expect(result.multiple).toBeCloseTo(2.2);

    // Recoupment (capped at 100%)
    expect(result.recoupPct).toBe(100);
  });

  it("handles guilds correctly", () => {
    const result = calculateWaterfall(baseInputs, allGuilds);

    // Guilds: (4.5% + 1.2% + 1.2%) * $2.5M = $172,500
    const expectedGuilds = 2500000 * (SAG_PCT + 0.012 + 0.012);
    expect(result.guilds).toBeCloseTo(expectedGuilds);
    expect(result.offTopTotal).toBe(result.cam + result.salesFee + result.marketing + result.guilds);
  });

  it("handles an underwater deal (revenue < hurdle)", () => {
    const underwaterInputs = { ...baseInputs, revenue: 500000 };
    const result = calculateWaterfall(underwaterInputs, noGuilds);

    expect(result.profitPool).toBe(0);
    expect(result.producer).toBe(0);

    // Only off-the-top gets partially paid from $500K
    // Off-top = CAM($5K) + Sales($50K) + Marketing($75K) = $130K
    expect(result.offTopTotal).toBe(130000);

    // Investor gets whatever's left after off-top and debt, capped at equity hurdle
    // Remaining after off-top: $500K - $130K = $370K
    // Debt hurdle: $550K, but only $370K available
    // So investor gets $0 (debt takes priority and isn't fully paid)
    expect(result.investor).toBe(0);
    expect(result.multiple).toBe(0);
  });

  it("handles tax credits reducing total hurdle", () => {
    const withCredits = { ...baseInputs, credits: 200000 };
    const result = calculateWaterfall(withCredits, noGuilds);

    // Total hurdle should be reduced by $200K
    expect(result.totalHurdle).toBe(1300000); // 1.5M - 200K
    expect(result.profitPool).toBe(1200000); // 2.5M - 1.3M
    expect(result.credits).toBe(200000);

    // Ledger should contain tax credits as negative amount
    const creditItem = result.ledger.find(i => i.name === "Tax Credits");
    expect(creditItem).toBeDefined();
    expect(creditItem!.amount).toBe(-200000);
  });

  it("handles deferments correctly", () => {
    const withDeferments = { ...baseInputs, deferments: 100000 };
    const result = calculateWaterfall(withDeferments, noGuilds);

    expect(result.deferments).toBe(100000);
    expect(result.totalHurdle).toBe(1600000); // 1.5M + 100K
    expect(result.profitPool).toBe(900000); // 2.5M - 1.6M

    const defermentItem = result.ledger.find(i => i.name === "Deferments");
    expect(defermentItem).toBeDefined();
    expect(defermentItem!.amount).toBe(100000);
  });

  it("handles mezzanine debt", () => {
    const withMezz = { ...baseInputs, mezzanineDebt: 200000, mezzanineRate: 18 };
    const result = calculateWaterfall(withMezz, noGuilds);

    // Mezz: $200K * 1.18 = $236K
    expect(result.mezzDebtHurdle).toBeCloseTo(236000);
    expect(result.debtTotal).toBeCloseTo(786000); // 550K + 236K
  });

  it("handles zero revenue gracefully", () => {
    const zeroRevenue = { ...baseInputs, revenue: 0 };
    const result = calculateWaterfall(zeroRevenue, noGuilds);

    expect(result.profitPool).toBe(0);
    expect(result.offTopTotal).toBe(75000); // Only marketing (fixed cost)
    expect(result.cam).toBe(0);
    expect(result.salesFee).toBe(0);
    expect(result.investor).toBe(0);
    expect(result.multiple).toBe(0);
  });

  it("handles zero equity (no multiple)", () => {
    const noEquity = { ...baseInputs, equity: 0 };
    const result = calculateWaterfall(noEquity, noGuilds);

    expect(result.equityHurdle).toBe(0);
    expect(result.multiple).toBe(0);
  });

  it("guards against negative inputs", () => {
    const negativeInputs: WaterfallInputs = {
      revenue: -100,
      budget: -100,
      credits: -100,
      debt: -100,
      seniorDebtRate: -100,
      mezzanineDebt: -100,
      mezzanineRate: -100,
      equity: -100,
      premium: -100,
      salesFee: -100,
      salesExp: -100,
      deferments: -100,
    };
    const result = calculateWaterfall(negativeInputs, noGuilds);

    // All values should be clamped to 0
    expect(result.cam).toBe(0);
    expect(result.salesFee).toBe(0);
    expect(result.profitPool).toBe(0);
    expect(result.offTopTotal).toBe(0);
  });

  it("returns consistent phase totals that match ledger", () => {
    const result = calculateWaterfall(baseInputs, allGuilds);

    // offTopTotal should equal sum of off-top components
    expect(result.offTopTotal).toBeCloseTo(
      result.cam + result.guilds + result.salesFee + result.marketing
    );

    // debtTotal should equal sum of debt hurdles
    expect(result.debtTotal).toBeCloseTo(
      result.seniorDebtHurdle + result.mezzDebtHurdle
    );
  });
});

// ===== calculateBreakeven =====

describe("calculateBreakeven", () => {
  it("calculates breakeven for a standard deal", () => {
    const breakeven = calculateBreakeven(baseInputs, noGuilds, allSelections);

    // Off-top rate: 10% sales + 1% CAM = 11%
    // Fixed costs: $550K debt + $600K equity + $75K marketing = $1,225,000
    // Breakeven = $1,225,000 / (1 - 0.11) = $1,376,404.49
    expect(breakeven).toBeCloseTo(1376404.49, 0);
  });

  it("returns lower breakeven when tax credits are selected", () => {
    const inputsWithCredits = { ...baseInputs, credits: 200000 };
    const withCredits = calculateBreakeven(inputsWithCredits, noGuilds, allSelections);
    const withoutCredits = calculateBreakeven(inputsWithCredits, noGuilds, {
      ...allSelections,
      taxCredits: false,
    });

    expect(withCredits).toBeLessThan(withoutCredits);
  });

  it("returns Infinity when off-top rate >= 100%", () => {
    const crazyFees = { ...baseInputs, salesFee: 100 };
    // SAG + WGA + DGA + CAM + 100% sales = way over 100%
    const breakeven = calculateBreakeven(crazyFees, allGuilds, allSelections);
    expect(breakeven).toBe(Infinity);
  });

  it("respects capital source selections", () => {
    const noDebt = calculateBreakeven(baseInputs, noGuilds, {
      ...allSelections,
      seniorDebt: false,
    });
    const withDebt = calculateBreakeven(baseInputs, noGuilds, allSelections);

    expect(noDebt).toBeLessThan(withDebt);
  });
});

// ===== getOffTopRate =====

describe("getOffTopRate", () => {
  it("returns correct rate with no guilds", () => {
    const rate = getOffTopRate(baseInputs, noGuilds);
    // 10% sales + 1% CAM = 11%
    expect(rate).toBeCloseTo(11);
  });

  it("includes guild rates", () => {
    const rate = getOffTopRate(baseInputs, allGuilds);
    // 10% sales + 1% CAM + 4.5% SAG + 1.2% WGA + 1.2% DGA = 17.9%
    expect(rate).toBeCloseTo(17.9);
  });
});

// ===== formatCompactCurrency =====

describe("formatCompactCurrency", () => {
  it("formats millions", () => {
    expect(formatCompactCurrency(2500000)).toBe("$2.5M");
    expect(formatCompactCurrency(1000000)).toBe("$1.0M");
  });

  it("formats thousands", () => {
    expect(formatCompactCurrency(75000)).toBe("$75K");
    expect(formatCompactCurrency(500000)).toBe("$500K");
  });

  it("formats small numbers via Intl", () => {
    expect(formatCompactCurrency(500)).toBe("$500");
    expect(formatCompactCurrency(0)).toBe("$0");
  });

  it("handles negative numbers correctly", () => {
    expect(formatCompactCurrency(-200000)).toBe("-$200K");
    expect(formatCompactCurrency(-1500000)).toBe("-$1.5M");
  });

  it("handles NaN and Infinity", () => {
    expect(formatCompactCurrency(NaN)).toBe("$0");
    expect(formatCompactCurrency(Infinity)).toBe("$0");
    expect(formatCompactCurrency(-Infinity)).toBe("$0");
  });
});

// ===== formatMultiple =====

describe("formatMultiple", () => {
  it("formats normal values", () => {
    expect(formatMultiple(2.2)).toBe("2.20x");
    expect(formatMultiple(1.0)).toBe("1.00x");
  });

  it("handles edge cases", () => {
    expect(formatMultiple(0)).toBe("0.00x");
    expect(formatMultiple(NaN)).toBe("0.00x");
  });
});

// ===== Shared Constants =====

describe("shared constants", () => {
  it("exports correct guild and CAM rates", () => {
    expect(CAM_PCT).toBe(0.01);
    expect(SAG_PCT).toBe(0.045);
  });
});
