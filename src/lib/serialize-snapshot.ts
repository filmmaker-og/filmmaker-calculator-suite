// src/lib/serialize-snapshot.ts
// Serializes calculator state into a JSON payload for Supabase storage + PDF generation

import type { WaterfallResult, WaterfallInputs, GuildState } from "@/lib/waterfall";
import type { ProjectDetails } from "@/pages/Calculator";
import { computeTierPayments } from "@/lib/waterfall";

export interface SnapshotPayload {
  project: {
    title: string;
    genre: string;
    logline: string;
    cast: string;
    director: string;
    producers: string;
    writers: string;
    company: string;
    location: string;
    status: string;
  };
  inputs: {
    revenue: number;
    budget: number;
    credits: number;
    equity: number;
    debt: number;
    seniorDebtRate: number;
    mezzanineDebt: number;
    mezzanineRate: number;
    premium: number;
    salesFee: number;
    salesExp: number;
    deferments: number;
    profitSplit: number;
  };
  guilds: {
    sag: boolean;
    wga: boolean;
    dga: boolean;
  };
  result: {
    profitPool: number;
    totalHurdle: number;
    cam: number;
    salesFee: number;
    guilds: number;
    marketing: number;
    deferments: number;
    credits: number;
    creditsApplied: number;
    recouped: number;
    recoupPct: number;
    investor: number;
    producer: number;
    multiple: number;
    offTopTotal: number;
    debtTotal: number;
    seniorDebtHurdle: number;
    mezzDebtHurdle: number;
    equityHurdle: number;
    profitSplit: number;
  };
  tiers: Array<{
    name: string;
    rate: string;
    amount: number;
    remaining: number;
  }>;
  computed: {
    erosionPct: number;
    cashBasis: number;
    investorROI: number;
    breakEvenRevenue: number;
  };
  generatedAt: string;
}

export function serializeSnapshot(
  result: WaterfallResult,
  inputs: WaterfallInputs,
  project: ProjectDetails,
  guilds: GuildState,
): SnapshotPayload {
  const tiers = computeTierPayments(result, inputs);

  // Compute derived values
  const erosionPct =
    inputs.revenue > 0
      ? (result.offTopTotal / inputs.revenue) * 100
      : 0;

  const cashBasis = inputs.budget - inputs.credits - inputs.deferments;

  const investorROI =
    inputs.equity > 0
      ? ((result.investor - inputs.equity) / inputs.equity) * 100
      : 0;

  // Break-even: revenue where investor recoups 100%
  const breakEvenRevenue =
    result.recoupPct > 0
      ? inputs.revenue / (result.recoupPct / 100)
      : inputs.revenue * 2;

  return {
    project: {
      title: project.title || "Untitled Project",
      genre: project.customGenre || project.genre || "Not specified",
      logline: project.logline || "",
      cast: project.cast || "",
      director: project.director || "",
      producers: project.producers || "",
      writers: project.writers || "",
      company: project.company || "",
      location: project.location || "",
      status: project.status || "Development",
    },
    inputs: { ...inputs },
    guilds: { ...guilds },
    result: {
      profitPool: result.profitPool,
      totalHurdle: result.totalHurdle,
      cam: result.cam,
      salesFee: result.salesFee,
      guilds: result.guilds,
      marketing: result.marketing,
      deferments: result.deferments,
      credits: result.credits,
      creditsApplied: result.creditsApplied,
      recouped: result.recouped,
      recoupPct: result.recoupPct,
      investor: result.investor,
      producer: result.producer,
      multiple: result.multiple,
      offTopTotal: result.offTopTotal,
      debtTotal: result.debtTotal,
      seniorDebtHurdle: result.seniorDebtHurdle,
      mezzDebtHurdle: result.mezzDebtHurdle,
      equityHurdle: result.equityHurdle,
      profitSplit: result.profitSplit,
    },
    tiers: tiers.map((t) => ({
      name: t.label,
      rate: `Phase ${t.phase} — ${t.status}`,
      amount: t.amount,
      remaining: t.amount - t.paid,
    })),
    computed: {
      erosionPct: Math.round(erosionPct * 10) / 10,
      cashBasis,
      investorROI: Math.round(investorROI * 10) / 10,
      breakEvenRevenue: Math.round(breakEvenRevenue),
    },
    generatedAt: new Date().toISOString(),
  };
}
