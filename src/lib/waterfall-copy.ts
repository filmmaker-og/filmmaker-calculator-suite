import type { WaterfallState, TierPayment } from "./waterfall-types";
import type { WaterfallInputs, WaterfallResult } from "./waterfall";
import { formatCompactCurrency } from "./waterfall";

interface CopyNumbers {
  title: string;
  genre: string;
  budget: number;
  revenue: number;
  equity: number;
  multiple: number;
  producerPool: number;
  investorReturn: number;
  breakEven: number;
  netDistributable: number;
  offTopPct: number;
  profitPool: number;
}

export function getTLDR(state: WaterfallState, n: CopyNumbers, sourceNames: string[]): string {
  const recoupStatus =
    state === "fully_recouped" ? "full" :
    state === "partially_recouped" ? "partial" :
    state === "equity_exposed" ? "no equity" : "no";

  let text = `${n.title} is a ${formatCompactCurrency(n.budget)} ${n.genre.toLowerCase()} structured for ${recoupStatus} investor recoupment at an acquisition price of ${formatCompactCurrency(n.revenue)}.`;
  text += ` At current assumptions, investors receive ${n.multiple.toFixed(1)}x on ${formatCompactCurrency(n.equity)} invested and the producer pool totals ${formatCompactCurrency(n.producerPool)}.`;
  text += ` The capital stack combines ${sourceNames.join(", ")}, and ${state === "fully_recouped" ? "all" : state === "underwater" ? "not all" : "some"} repayment tiers are fully funded under the base case.`;

  // Conditional 4th sentence for tight margin
  if (n.revenue > 0 && n.breakEven > 0) {
    const margin = (n.revenue - n.breakEven) / n.revenue;
    if (margin < 0.20 && margin >= 0) {
      text += ` The deal requires a minimum sale of ${formatCompactCurrency(n.breakEven)} to achieve full recoupment, leaving ${Math.round(margin * 100)}% margin at the current target.`;
    } else if (margin < 0) {
      text += ` The current acquisition target is below break-even — investors lose money at this sale price.`;
    }
  }

  return text;
}

export function getStackInterpretation(inputs: WaterfallInputs): string {
  const debtTotal = (inputs.debt || 0) + (inputs.mezzanineDebt || 0);
  const debtPct = inputs.budget > 0 ? debtTotal / inputs.budget : 0;
  const equityPct = inputs.budget > 0 ? (inputs.equity || 0) / inputs.budget : 0;
  const sourceCount = [inputs.debt, inputs.mezzanineDebt, inputs.equity, inputs.deferments].filter((v) => v > 0).length;

  let text = "";
  if (debtPct > 0.40) {
    text = `This stack is debt-heavy — senior and mezzanine obligations create ${formatCompactCurrency(debtTotal)} in contractual repayment pressure before equity participants see a return.`;
  } else if (equityPct > 0.60) {
    text = "This stack is equity-concentrated, which simplifies the repayment waterfall but places maximum risk on a single capital class.";
  } else if (sourceCount >= 3) {
    text = `This stack layers ${sourceCount} capital sources with descending priority, distributing repayment pressure across multiple tiers.`;
  } else {
    text = `This stack uses ${sourceCount} capital source${sourceCount > 1 ? "s" : ""} to finance the production.`;
  }

  if (inputs.credits > 0) {
    text += ` Tax credits reduce the effective cash requirement by ${formatCompactCurrency(inputs.credits)}, improving the probability of recoupment at moderate sale levels.`;
  }

  return text;
}

export function getCapitalStackIntro(sourceCount: number, budget: number): string {
  if (sourceCount <= 2) {
    return `Your production is financed through ${sourceCount === 1 ? "a single capital source" : "two capital sources"}, creating a ${sourceCount === 1 ? "straightforward" : "two-tier"} repayment structure.`;
  }
  return `Your ${formatCompactCurrency(budget)} production is financed through ${sourceCount} capital sources, each with a different priority position in the repayment waterfall.`;
}

export function getWaterfallInterpretation(
  state: WaterfallState,
  tiers: TierPayment[],
  profitPool: number
): string {
  const tierSummary = tiers
    .filter((t) => t.status === "funded")
    .map((t) => `${t.label} recovers ${formatCompactCurrency(t.paid)}`)
    .join(", ");

  switch (state) {
    case "fully_recouped": {
      let text = `All capital tiers are fully funded at the base case acquisition price. ${tierSummary}. The remaining ${formatCompactCurrency(profitPool)} flows into the profit pool.`;
      if (profitPool > 0 && tiers.length > 0) {
        const totalOwed = tiers.reduce((sum, t) => sum + t.amount, 0);
        if (profitPool < totalOwed * 0.05) {
          text += " The profit pool is modest at this revenue level — the deal works for investors but leaves limited producer upside.";
        }
      }
      return text;
    }
    case "partially_recouped": {
      const eqTier = tiers.find((t) => t.label.includes("Equity"));
      const pct = eqTier && eqTier.amount > 0 ? Math.round((eqTier.paid / eqTier.amount) * 100) : 0;
      return `Senior debt${tiers.some((t) => t.label.includes("Mezzanine") && t.status === "funded") ? " and mezzanine" : ""} obligations are fully satisfied. Revenue exhausts during the equity tier — investors recover ${pct}% of their principal plus premium. Deferments and producer profit participation are unfunded.`;
    }
    case "equity_exposed":
      return "All debt obligations are satisfied, but revenue exhausts before reaching the equity tier. Equity investors receive nothing at this sale level. The deal structure protects lenders but leaves equity fully exposed.";
    case "underwater":
      return "Revenue does not cover senior debt obligations. This structure is not financeable at the current acquisition assumption without reducing the budget, restructuring the capital stack, or increasing the target sale price.";
  }
}

export function getReturnParagraph(
  state: WaterfallState,
  n: CopyNumbers
): string {
  const delivers = state === "fully_recouped" ? "delivers full" : "does not deliver full";
  const impaired =
    state === "underwater" ? "all participants" :
    state === "equity_exposed" ? "equity investors" :
    state === "partially_recouped" ? "equity and downstream participants" : "none";

  let text = `At current assumptions, this deal ${delivers} investor recoupment.`;
  if (n.breakEven > 0 && n.revenue > 0) {
    text += ` The key threshold is ${formatCompactCurrency(n.breakEven)} — at or above that sale price, all modeled capital tiers clear.`;
    if (state !== "fully_recouped") {
      text += ` Below that level, ${impaired} are impaired first.`;
    }
  }
  return text;
}

export function getSensitivityInterpretation(
  baseState: WaterfallState,
  bearState: WaterfallState,
  bullState: WaterfallState
): string {
  if (bearState === "fully_recouped") {
    return "This structure remains whole even in the bear case. Investors recover principal at 70% of the target sale price.";
  }
  if (bearState === "partially_recouped" && baseState === "fully_recouped") {
    return "The bear case leaves equity partially impaired, but senior debt is protected across all scenarios.";
  }
  if (baseState !== "fully_recouped" && bullState === "fully_recouped") {
    return "This deal only achieves full recoupment in the bull case, which makes it speculative at the current budget level.";
  }
  if (baseState === "underwater") {
    return "The deal is underwater at the base case. Even the bull scenario may not fully protect investors at this budget level.";
  }
  return "Review the scenario table to understand how revenue changes affect each capital tier.";
}
