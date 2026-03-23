import type { ProjectDetails } from "@/pages/Calculator";
import {
  WaterfallResult,
  WaterfallInputs,
  GuildState,
  formatCompactCurrency,
  formatFullCurrency,
  computeTierPayments,
  calculateWaterfall,
  CAM_PCT,
} from "@/lib/waterfall";
import type { TierPayment } from "@/lib/waterfall-types";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { useHaptics } from "@/hooks/use-haptics";
import { serializeSnapshot } from "@/lib/serialize-snapshot";

// ─── Types ───────────────────────────────────────────────────────

interface WaterfallBriefProps {
  result: WaterfallResult;
  inputs: WaterfallInputs;
  project: ProjectDetails;
  guilds: GuildState;
}

// ─── Locked Type System ──────────────────────────────────────────

const FONT = {
  heroPlus: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "72px",
    letterSpacing: "0.06em",
    lineHeight: 0.95,
  } as React.CSSProperties,
  hero: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "48px",
    letterSpacing: "0.06em",
    lineHeight: 1.0,
  } as React.CSSProperties,
  display: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "36px",
    letterSpacing: "0.10em",
    lineHeight: 1.05,
  } as React.CSSProperties,
  title: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "28px",
    letterSpacing: "0.10em",
    lineHeight: 1.1,
  } as React.CSSProperties,
  summary: {
    fontSize: "22px",
    fontWeight: 500,
    lineHeight: 1.3,
  } as React.CSSProperties,
  data: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "15px",
    fontWeight: 500,
    letterSpacing: "0.06em",
  } as React.CSSProperties,
  body: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "17px",
    fontWeight: 400,
    lineHeight: 1.75,
  } as React.CSSProperties,
  label: {
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.20em",
    textTransform: "uppercase" as const,
  } as React.CSSProperties,
  fine: {
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
  } as React.CSSProperties,
};

// White opacity tiers
const W = {
  primary: "rgba(255,255,255,0.92)",
  secondary: "rgba(255,255,255,0.75)",
  tertiary: "rgba(255,255,255,0.55)",
  quaternary: "rgba(255,255,255,0.40)",
  ghost: "rgba(255,255,255,0.25)",
};

// Gold opacity tiers
const G = {
  emphasis: "rgba(212,175,55,0.70)",
  standard: "rgba(212,175,55,0.55)",
  subtle: "rgba(212,175,55,0.40)",
  floor: "rgba(212,175,55,0.30)",
};

// Semantic colors
const SEM = {
  green: "#3CB371",
  red: "#DC2626",
  amber: "#F0A830",
  gold: "#D4AF37",
};

// ─── Shared Elements ─────────────────────────────────────────────

const GoldGlowBreak = () => (
  <div style={{ padding: "10px 24px" }}>
    <div style={{
      height: "1px",
      background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.15) 15%, rgba(212,175,55,0.45) 50%, rgba(212,175,55,0.15) 85%, transparent 100%)",
    }} />
  </div>
);

/** Inline mono number span for prose */
const Num = ({ children, color }: { children: React.ReactNode; color?: string }) => (
  <span style={{
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "15px",
    fontWeight: 500,
    color: color || W.primary,
  }}>
    {children}
  </span>
);

// ─── Helper: format investor return % ────────────────────────────

function computeInvestorReturnPct(result: WaterfallResult, inputs: WaterfallInputs): number {
  if (inputs.equity <= 0) return 0;
  return (result.investor / inputs.equity) * 100;
}

function getReturnColor(pct: number): string {
  if (pct > 100) return SEM.green;
  if (pct >= 80) return SEM.amber;
  return SEM.red;
}

function computeCashBasis(inputs: WaterfallInputs): number {
  return Math.max(0, inputs.budget - inputs.credits - inputs.deferments);
}

// ─── Helper: scenario waterfall at different prices ──────────────

function computeScenarioReturn(
  inputs: WaterfallInputs,
  guilds: GuildState,
  price: number,
): { returnPct: number; multiple: number } {
  const scenarioInputs = { ...inputs, revenue: price };
  const scenarioResult = calculateWaterfall(scenarioInputs, guilds);
  const returnPct = inputs.equity > 0 ? (scenarioResult.investor / inputs.equity) * 100 : 0;
  const multiple = scenarioResult.multiple;
  return { returnPct, multiple };
}

// ─── SECTION 1: COVER ────────────────────────────────────────────

const CoverSection = ({
  project, inputs, result, guilds,
}: {
  project: ProjectDetails;
  inputs: WaterfallInputs;
  result: WaterfallResult;
  guilds: GuildState;
}) => {
  const [dealInsight, setDealInsight] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      const cacheKey = `deal-insight-${JSON.stringify({
        budget: inputs.budget,
        credits: inputs.credits,
        deferments: inputs.deferments,
        acquisitionPrice: inputs.revenue,
      })}`;

      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setDealInsight(cached);
        return;
      }

      setInsightLoading(true);
      try {
        const resp = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/deal-insight`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              dealData: {
                projectName: project?.title,
                genre: project?.genre,
                budget: inputs.budget,
                cashBasis: computeCashBasis(inputs),
                taxCredits: inputs.credits,
                deferments: inputs.deferments,
                acquisitionPrice: inputs.revenue,
                totalDeductions: result?.offTopTotal,
                erosionPct:
                  inputs.revenue > 0
                    ? Math.round((result.offTopTotal / inputs.revenue) * 100)
                    : 0,
                investorReturnPct: computeInvestorReturnPct(result, inputs),
                investorReturnMultiple: result?.multiple,
                netDistributable: Math.max(0, inputs.revenue - result.offTopTotal),
                profitSplit: inputs.profitSplit,
              },
            }),
          },
        );
        const data = await resp.json();
        if (data.insight) {
          setDealInsight(data.insight);
          localStorage.setItem(cacheKey, data.insight);
        }
      } catch {
        // Silently fail — the output works without this
      } finally {
        setInsightLoading(false);
      }
    };

    if (result) fetchInsight();
  }, [result, inputs, project]);

  const cashBasis = computeCashBasis(inputs);
  const investorReturnPct = computeInvestorReturnPct(result, inputs);
  const returnColor = getReturnColor(investorReturnPct);
  const multiple = result.multiple;
  const multipleColor = returnColor;

  // Team grid
  const teamFields: { role: string; name: string }[] = [];
  if (project.director.trim()) teamFields.push({ role: "Director", name: project.director });
  if (project.writers.trim()) teamFields.push({ role: "Writer", name: project.writers });
  if (project.producers.trim()) teamFields.push({ role: "Producer", name: project.producers });
  if (project.cast.trim()) teamFields.push({ role: "Lead Cast", name: project.cast });
  if (project.company.trim()) teamFields.push({ role: "Production Co.", name: project.company });

  const hasTeam = teamFields.length > 0;
  const hasLogline = project.logline.trim().length > 0;

  // Verdict text
  const netToInvestors = Math.max(0, inputs.revenue - result.offTopTotal);
  const offTopCoverPct = inputs.revenue > 0 ? Math.round((result.offTopTotal / inputs.revenue) * 100) : 0;
  const creditCoverPct = inputs.budget > 0 ? Math.round((inputs.credits / inputs.budget) * 100) : 0;
  let verdictContext: string;
  if (netToInvestors > cashBasis) {
    verdictContext = `Market value exceeds cash basis by ${formatCompactCurrency(netToInvestors - cashBasis)}.`;
    if (inputs.credits > 0) {
      verdictContext += ` Your capital stack covers the budget with room to absorb execution risk, and ${creditCoverPct}% in tax credits keeps the investor's cash exposure at ${formatCompactCurrency(cashBasis)}.`;
    } else {
      verdictContext += ` Your capital stack covers the budget with margin to absorb a negotiation haircut.`;
    }
    verdictContext += ` Off-the-top deductions consume ${offTopCoverPct}% before recoupment.`;
  } else {
    verdictContext = `Net distributable falls short of cash basis by ${formatCompactCurrency(cashBasis - netToInvestors)}. At this acquisition price, investors are not made whole before the waterfall runs dry. The structure below shows where the money stops.`;
  }

  return (
    <section style={{
      minHeight: "85dvh",
      padding: "40px 24px 28px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Left accent line */}
      <div style={{
        position: "absolute",
        left: 0,
        top: "10%",
        bottom: "10%",
        width: "2px",
        background: "linear-gradient(180deg, transparent 0%, rgba(212,175,55,0.15) 20%, rgba(212,175,55,0.25) 50%, rgba(212,175,55,0.15) 80%, transparent 100%)",
      }} />

      {/* 1a. Badge */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "24px",
      }}>
        <div style={{ width: "24px", height: "1px", background: G.subtle }} />
        <span style={{ ...FONT.label, color: G.emphasis }}>Waterfall Snapshot</span>
      </div>

      {/* 1b. Title */}
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "48px",
        letterSpacing: "0.06em",
        lineHeight: 1.0,
        color: W.primary,
        marginBottom: "10px",
      }}>
        {(project.title.trim() || "UNTITLED PROJECT").toUpperCase()}
      </div>

      {/* 1c. Logline */}
      {hasLogline && (
        <div style={{
          fontSize: "16px",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
          color: W.tertiary,
          fontStyle: "italic",
          maxWidth: "360px",
          lineHeight: 1.5,
          marginBottom: "20px",
        }}>
          {project.logline}
        </div>
      )}

      {/* 1d. Team Grid */}
      {hasTeam && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2px",
          marginBottom: "20px",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "4px",
          overflow: "hidden",
          background: "rgba(255,255,255,0.06)",
        }}>
          {teamFields.map((f) => (
            <div key={f.role} style={{ background: "#0A0A0A", padding: "12px 14px" }}>
              <div style={{
                ...FONT.fine,
                color: W.tertiary,
                marginBottom: "3px",
              }}>
                {f.role.toUpperCase()}
              </div>
              <div style={{
                fontSize: "16px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                color: W.secondary,
              }}>
                {f.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 1e. KPI Rows */}
      <div style={{
        display: "flex",
        gap: "2px",
        marginBottom: "2px",
        background: "rgba(255,255,255,0.06)",
        borderRadius: "4px",
        overflow: "hidden",
      }}>
        <div style={{ flex: 1, background: "#0A0A0A", padding: "14px" }}>
          <div style={{ ...FONT.fine, color: W.quaternary, marginBottom: "4px" }}>BUDGET</div>
          <div style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "26px",
            fontWeight: 500,
            letterSpacing: "0.06em",
            color: W.primary,
          }}>
            {formatCompactCurrency(inputs.budget)}
          </div>
        </div>
        <div style={{ flex: 1, background: "#0A0A0A", padding: "14px", borderLeft: "2px solid rgba(212,175,55,0.25)" }}>
          <div style={{ ...FONT.fine, color: W.quaternary, marginBottom: "4px" }}>CASH BASIS</div>
          <div style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "26px",
            fontWeight: 500,
            letterSpacing: "0.06em",
            color: G.emphasis,
          }}>
            {formatCompactCurrency(cashBasis)}
          </div>
        </div>
      </div>
      <div style={{
        display: "flex",
        gap: "2px",
        marginBottom: "24px",
        background: "rgba(255,255,255,0.06)",
        borderRadius: "4px",
        overflow: "hidden",
      }}>
        <div style={{ flex: 1, background: "#0A0A0A", padding: "14px" }}>
          <div style={{ ...FONT.fine, color: W.quaternary, marginBottom: "4px" }}>MARKET VALUE</div>
          <div style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "26px",
            fontWeight: 500,
            letterSpacing: "0.06em",
            color: W.primary,
          }}>
            {formatCompactCurrency(inputs.revenue)}
          </div>
        </div>
        <div style={{ flex: 1, background: "#0A0A0A", padding: "14px", borderLeft: `2px solid ${returnColor === SEM.green ? "rgba(60,179,113,0.25)" : returnColor === SEM.amber ? "rgba(240,168,48,0.25)" : "rgba(220,38,38,0.35)"}` }}>
          <div style={{ ...FONT.fine, color: W.quaternary, marginBottom: "4px" }}>INVESTOR RETURN</div>
          <div style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "26px",
            fontWeight: 500,
            letterSpacing: "0.06em",
            color: returnColor,
          }}>
            {Math.round(investorReturnPct)}%
          </div>
        </div>
      </div>

      {/* 1f. Verdict Strip */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        borderTop: `1px solid rgba(212,175,55,0.15)`,
        paddingTop: "16px",
      }}>
        <div style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "52px",
          fontWeight: 500,
          lineHeight: 1,
          color: multipleColor,
        }}>
          {multiple.toFixed(1)}&times;
        </div>
        <div style={{ fontSize: "16px", lineHeight: 1.5, color: W.tertiary }}>
          <strong style={{ color: W.secondary, fontWeight: 600 }}>Cash-on-cash multiple.</strong>
          <br />
          {verdictContext}
        </div>
      </div>

      {/* 1f-b. AI Deal Insight */}
      {dealInsight && (
        <div style={{
          margin: "16px 0",
          padding: "12px 16px",
          borderLeft: "2px solid rgba(212,175,55,0.30)",
          fontFamily: "'Inter', sans-serif",
          fontSize: "17px",
          fontStyle: "italic",
          color: "rgba(255,255,255,0.88)",
          lineHeight: 1.55,
        }}>
          {dealInsight}
        </div>
      )}
      {insightLoading && (
        <div style={{
          margin: "16px 0",
          padding: "12px 16px",
          fontFamily: "'Inter', sans-serif",
          fontSize: "15px",
          color: "rgba(255,255,255,0.40)",
          fontStyle: "italic",
        }}>
          Analyzing your deal...
        </div>
      )}

      {/* 1g. Assumptions — always-visible grid */}
      <div style={{
        marginTop: "20px",
        padding: "14px 16px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "4px",
      }}>
        <div style={{
          ...FONT.fine,
          color: W.quaternary,
          marginBottom: "10px",
        }}>ASSUMPTIONS</div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "6px 12px",
          alignItems: "baseline",
        }}>
          {inputs.credits > 0 && project.location.trim() && (
            <>
              <span style={{ fontSize: "16px", color: W.tertiary }}>Location</span>
              <span style={{ ...FONT.data, fontSize: "15px", color: W.secondary }}>
                {project.location}
              </span>
              <span style={{ fontSize: "16px", color: W.tertiary }}>Tax Credit</span>
              <span style={{ ...FONT.data, fontSize: "15px", color: W.secondary }}>
                {inputs.budget > 0 ? Math.round((inputs.credits / inputs.budget) * 100) : 0}%
              </span>
            </>
          )}
          <span style={{ fontSize: "14px", color: W.tertiary }}>Model</span>
          <span style={{ ...FONT.data, fontSize: "15px", color: W.secondary }}>Acquisition</span>
          {inputs.deferments > 0 && (
            <>
              <span style={{ fontSize: "16px", color: W.tertiary }}>Deferrals</span>
              <span style={{ ...FONT.data, fontSize: "15px", color: W.secondary }}>
                {formatCompactCurrency(inputs.deferments)}
              </span>
            </>
          )}
          {inputs.salesFee > 0 && (
            <>
              <span style={{ fontSize: "16px", color: W.tertiary }}>Sales Agent</span>
              <span style={{ ...FONT.data, fontSize: "15px", color: W.secondary }}>
                {inputs.salesFee}%
              </span>
            </>
          )}
          {inputs.salesExp > 0 && (
            <>
              <span style={{ fontSize: "16px", color: W.tertiary }}>Expense Cap</span>
              <span style={{ ...FONT.data, fontSize: "15px", color: W.secondary }}>
                {formatCompactCurrency(inputs.salesExp)}
              </span>
            </>
          )}
          {(guilds.sag || guilds.wga || guilds.dga) && (
            <>
              <span style={{ fontSize: "16px", color: W.tertiary }}>Guilds</span>
              <span style={{ ...FONT.data, fontSize: "15px", color: W.secondary }}>
                {[guilds.sag && "SAG-AFTRA", guilds.wga && "WGA", guilds.dga && "DGA"].filter(Boolean).join(", ")}
              </span>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

// ─── SECTION 2: DEAL (Investment Thesis) ────────────────────────

const DealSection = ({
  inputs, result, guilds, project,
}: {
  inputs: WaterfallInputs;
  result: WaterfallResult;
  guilds: GuildState;
  project: ProjectDetails;
}) => {
  const cashBasis = computeCashBasis(inputs);
  const offTopTotal = result.offTopTotal;
  const netDistributable = Math.max(0, inputs.revenue - offTopTotal);
  const tiers = computeTierPayments(result, inputs);
  const backendPool = result.profitPool;
  const salesFeeAmount = result.salesFee;
  const multiple = result.multiple;

  // Paragraph 1 — Capital structure
  const p1Parts: string[] = [];
  p1Parts.push(`This is a ${formatCompactCurrency(inputs.budget)} production modeled for acquisition at ${formatCompactCurrency(inputs.revenue)}.`);
  const capitalParts: string[] = [];
  if (inputs.debt > 0) capitalParts.push(`${formatCompactCurrency(inputs.debt)} in senior debt at ${inputs.seniorDebtRate}%`);
  if (inputs.mezzanineDebt > 0) capitalParts.push(`${formatCompactCurrency(inputs.mezzanineDebt)} in mezzanine debt at ${inputs.mezzanineRate}%`);
  if (inputs.equity > 0) capitalParts.push(`${formatCompactCurrency(inputs.equity)} in equity with a ${inputs.premium}% preferred return`);
  if (capitalParts.length > 0) p1Parts.push("The capital stack: " + capitalParts.join(", ") + ".");
  if (inputs.credits > 0 || inputs.deferments > 0) {
    const softParts: string[] = [];
    if (inputs.credits > 0) softParts.push(`tax credits (${formatCompactCurrency(inputs.credits)})`);
    if (inputs.deferments > 0) softParts.push(`deferred fees (${formatCompactCurrency(inputs.deferments)})`);
    p1Parts.push(`${softParts.join(" and ")} bring the investor's cash exposure down to ${formatCompactCurrency(cashBasis)}, which is the number your deal actually has to beat.`);
  }
  if (inputs.credits === 0 && inputs.deferments === 0) {
    p1Parts.push(`No tax credits or deferrals reduce the investor's exposure. Cash basis equals ${formatCompactCurrency(cashBasis)}.`);
  }

  // Paragraph 2 — Off-the-top erosion
  const offTopPct = inputs.revenue > 0 ? Math.round((offTopTotal / inputs.revenue) * 100) : 0;
  let p2 = `Off-the-top deductions total ${formatCompactCurrency(offTopTotal)}, roughly ${offTopPct}% of gross receipts.`;
  if (inputs.salesFee > 0) p2 += ` The sales agent's ${inputs.salesFee}% commission is the largest single cut at ${formatCompactCurrency(salesFeeAmount)}.`;
  if (inputs.salesExp > 0) p2 += ` Expense cap sits at ${formatCompactCurrency(inputs.salesExp)}`;
  if (inputs.salesExp > 100000) {
    p2 += " (worth scrutinizing at that level).";
  } else if (inputs.salesExp > 0) {
    p2 += " (in line for a film this size).";
  }
  if (offTopPct <= 20) {
    p2 += " Most independent deals lose 15\u201325% off the top; yours is on the low end.";
  } else if (offTopPct <= 30) {
    p2 += " That erosion rate is within normal range, but every point above 20% compresses your margin.";
  } else {
    p2 += ` That erosion rate is heavy. At ${offTopPct}%, more than a quarter of your gross is gone before recoupment starts.`;
  }

  // Paragraph 3 — Waterfall flow-through
  let p3 = `After deductions, ${formatCompactCurrency(netDistributable)} flows into the waterfall`;
  const fundedTiers = tiers.filter(t => t.status === "funded");
  const partialTier = tiers.find(t => t.status === "partial");
  if (fundedTiers.length === tiers.length) {
    p3 += ` and funds all ${tiers.length} capital tiers in full.`;
    if (backendPool > 0) {
      p3 += ` The remaining ${formatCompactCurrency(backendPool)} enters the backend pool, split per the operating agreement.`;
    }
  } else if (partialTier) {
    p3 += `. Revenue runs out at the ${partialTier.label} tier: investors recover ${Math.round((partialTier.paid / partialTier.amount) * 100)}% of that obligation, and everything downstream goes unfunded.`;
  } else {
    p3 += `. At this acquisition price, revenue does not fully fund any capital tier. The structure needs work before this is presentable.`;
  }

  // Paragraph 4 — Verdict (3 sentences: verdict, specifics, forward look)
  let p4: string;
  if (multiple >= 1.5) {
    p4 = "At these terms, this is a clean deal. The margin between cash basis and market value gives your investors room to absorb a negotiation haircut without losing principal. The scenario analysis below shows exactly how much room.";
  } else if (multiple >= 1.0) {
    p4 = "This is a tight deal, and tight deals can work if the assumptions hold. Your margin between cash basis and acquisition price leaves limited room for negotiation concessions. The scenario table below shows where the math starts to compress.";
  } else if (multiple >= 0.7) {
    p4 = "This deal is aggressive. The gap between cash basis and market value is narrow enough that a single negotiation concession could push investors below full recoupment. Before presenting this structure, look at the scenario table below and decide how much risk you are asking them to carry.";
  } else {
    p4 = "The math does not support this structure at the current acquisition price. Investors are looking at a loss on paper before the film even sells. The move is to restructure: lower the cash basis with more soft money, renegotiate the capital stack, or find a higher-confidence sale price. Then run the numbers again.";
  }

  // Pull-quote logic
  const allFunded = tiers.every(t => t.status === "funded");
  const pullPartialTier = tiers.find(t => t.status === "partial");
  let verdictText: string;
  let borderColor: string;
  if (allFunded && backendPool > 0) {
    verdictText = `EVERY CAPITAL TIER IS FUNDED. THE SURPLUS IS ${formatCompactCurrency(backendPool)}.`;
    borderColor = "rgba(60,179,113,0.40)";
  } else if (allFunded) {
    verdictText = "EVERY CAPITAL TIER IS FUNDED. NO BACKEND SURPLUS.";
    borderColor = "rgba(212,175,55,0.40)";
  } else if (pullPartialTier) {
    verdictText = `REVENUE EXHAUSTS AT ${pullPartialTier.label.toUpperCase()}. DOWNSTREAM TIERS ARE UNFUNDED.`;
    borderColor = "rgba(220,38,38,0.40)";
  } else {
    verdictText = "REVENUE DOES NOT FULLY FUND ANY TIER.";
    borderColor = "rgba(220,38,38,0.40)";
  }

  return (
    <section style={{ padding: "32px 24px 28px", position: "relative", overflow: "hidden" }}>
      {/* Gold top canopy */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "180px", background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      {/* Purple bottom canopy */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "120px", background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(120,60,180,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />
      {/* Provenance mark */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "12px",
      }}>
        <span style={{
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase" as const,
          color: G.emphasis,
        }}>Generated by filmmaker.og</span>
        <div style={{
          flex: 1,
          height: "1px",
          background: "linear-gradient(90deg, rgba(212,175,55,0.20), transparent)",
        }} />
      </div>

      {/* Label */}
      <div style={{ ...FONT.label, color: G.emphasis, marginBottom: "8px" }}>Deal Summary</div>

      {/* Headline */}
      <div style={{ ...FONT.display, color: W.primary, marginBottom: "16px" }}>THE DEAL</div>

      {/* Prose */}
      <div style={{ ...FONT.body, color: W.primary }}>
        <p style={{ marginBottom: "20px" }}>{p1Parts.join(" ")}</p>
        <p style={{ marginBottom: "20px" }}>{p2}</p>
        <p style={{ marginBottom: "20px" }}>{p3}</p>
      </div>

      {/* Pull-quote */}
      <div style={{
        borderLeft: `3px solid ${borderColor}`,
        paddingLeft: "20px",
        margin: "24px 0",
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "26px",
          letterSpacing: "0.06em",
          lineHeight: 1.2,
          color: W.primary,
        }}>
          {verdictText}
        </div>
      </div>

      {/* Verdict */}
      <div style={{ ...FONT.body, color: W.primary }}>
        <p style={{ marginBottom: "0" }}>{p4}</p>
      </div>
    </section>
  );
};

// ─── VISUAL CLUSTER 1: THE NUMBERS ──────────────────────────────

const VisualCluster1 = ({
  inputs, result, guilds, project,
}: {
  inputs: WaterfallInputs;
  result: WaterfallResult;
  guilds: GuildState;
  project: ProjectDetails;
}) => {
  const erosionItems: { label: string; amount: number; colorOpacity: number }[] = [];
  if (result.cam > 0) erosionItems.push({ label: "CAM Fee", amount: result.cam, colorOpacity: 0.20 });
  if (result.salesFee > 0) erosionItems.push({ label: "Sales Agent Commission", amount: result.salesFee, colorOpacity: 0.35 });
  if (result.marketing > 0) erosionItems.push({ label: "Sales Agent Expenses", amount: result.marketing, colorOpacity: 0.50 });
  if (result.guilds > 0) erosionItems.push({ label: "Guild Reserves", amount: result.guilds, colorOpacity: 0.65 });
  const erosionTotal = erosionItems.reduce((sum, item) => sum + item.amount, 0);

  const netDistributable = Math.max(0, inputs.revenue - result.offTopTotal);
  const investorReturnPct = computeInvestorReturnPct(result, inputs);
  const netColor = investorReturnPct >= 100 ? SEM.green : investorReturnPct >= 80 ? SEM.amber : SEM.red;
  const netBg = netColor === SEM.green ? "rgba(60,179,113,0.06)" : netColor === SEM.amber ? "rgba(240,168,48,0.06)" : "rgba(220,38,38,0.06)";
  const netBorder = netColor === SEM.green ? "rgba(60,179,113,0.20)" : netColor === SEM.amber ? "rgba(240,168,48,0.20)" : "rgba(220,38,38,0.20)";

  // Capital stack sources
  const sources: { label: string; amount: number; detail: string; pctOfBudget: string; color: string }[] = [];
  if (inputs.debt > 0) sources.push({ label: "Senior Debt", amount: inputs.debt, detail: `First position · ${inputs.seniorDebtRate}% interest`, pctOfBudget: `${Math.round((inputs.debt / inputs.budget) * 100)}% of budget`, color: "rgba(255,255,255,0.15)" });
  if (inputs.mezzanineDebt > 0) sources.push({ label: "Mezzanine / Gap", amount: inputs.mezzanineDebt, detail: `Second position · ${inputs.mezzanineRate}% interest`, pctOfBudget: `${Math.round((inputs.mezzanineDebt / inputs.budget) * 100)}% of budget`, color: "rgba(240,168,48,0.30)" });
  if (inputs.equity > 0) sources.push({ label: "Equity", amount: inputs.equity, detail: `${inputs.premium > 0 ? `${inputs.premium}% preferred return` : "Pari passu"}`, pctOfBudget: `${Math.round((inputs.equity / inputs.budget) * 100)}% of budget`, color: "rgba(212,175,55,0.40)" });
  if (inputs.credits > 0) sources.push({ label: "Tax Credits", amount: inputs.credits, detail: "Non-dilutive", pctOfBudget: `${Math.round((inputs.credits / inputs.budget) * 100)}% of budget`, color: "rgba(60,179,113,0.30)" });
  if (inputs.deferments > 0) sources.push({ label: "Deferrals", amount: inputs.deferments, detail: "Subordinate to all capital", pctOfBudget: `${Math.round((inputs.deferments / inputs.budget) * 100)}% of budget`, color: "rgba(255,255,255,0.10)" });

  // Scenario data
  const modeledPrice = inputs.revenue;
  const scenarios = [
    { price: modeledPrice, sub: "modeled", haircut: "0%" },
    { price: modeledPrice * 0.85, sub: "\u221215%", haircut: "15%" },
    { price: modeledPrice * 0.70, sub: "\u221230%", haircut: "30%" },
    { price: modeledPrice * 0.50, sub: "\u221250%", haircut: "50%" },
  ].map((s) => {
    const { returnPct, multiple } = computeScenarioReturn(inputs, guilds, s.price);
    const color = returnPct > 100 ? SEM.green : returnPct > 50 ? SEM.amber : SEM.red;
    return { ...s, label: formatCompactCurrency(s.price), returnPct, multiple, color };
  });

  return (
    <section style={{ padding: "28px 24px 28px", position: "relative", overflow: "hidden" }}>
      {/* Gold top canopy */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "140px", background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* ── EROSION VISUAL ── */}
      {erosionTotal > 0 && (
        <>
          <div style={{ ...FONT.fine, color: W.tertiary, marginBottom: "12px" }}>OFF-THE-TOP EROSION</div>
          <div style={{
            padding: "20px",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "4px",
            marginBottom: "20px",
          }}>
            {/* Hero row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
              <span style={{ fontSize: "16px", color: W.tertiary }}>Gone before recoupment</span>
              <span style={{ ...FONT.data, fontSize: "28px", color: SEM.red }}>
                &minus;{formatCompactCurrency(erosionTotal)}
              </span>
            </div>
            {/* Stacked bar */}
            <div style={{ height: "28px", background: "rgba(255,255,255,0.04)", borderRadius: "4px", display: "flex", overflow: "hidden", marginBottom: "16px" }}>
              {erosionItems.map((item) => {
                const widthPct = erosionTotal > 0 ? (item.amount / erosionTotal) * 100 : 0;
                return (
                  <div key={item.label} style={{
                    width: `${widthPct}%`, height: "100%",
                    background: `rgba(220,38,38,${item.colorOpacity})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    ...FONT.data, fontSize: "11px", color: "rgba(255,255,255,0.70)", letterSpacing: "0.06em",
                  }}>
                    {widthPct > 10 ? item.label.split(" ")[0] : ""}
                  </div>
                );
              })}
            </div>
            {/* Item list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {erosionItems.map((item) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: W.tertiary, display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "2px", flexShrink: 0, background: `rgba(220,38,38,${item.colorOpacity})` }} />
                    {item.label}
                  </span>
                  <span style={{ ...FONT.data, fontSize: "15px", color: W.secondary }}>
                    {formatCompactCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Net strip */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 20px", background: netBg, border: `1px solid ${netBorder}`,
        borderRadius: "4px", marginBottom: "28px",
      }}>
        <span style={{ fontSize: "16px", color: W.tertiary }}>Net to Investors</span>
        <span style={{ ...FONT.data, fontSize: "26px", color: netColor }}>
          {formatCompactCurrency(netDistributable)}
        </span>
      </div>

      {/* ── CAPITAL STACK VISUAL ── */}
      {sources.length > 0 && (
        <>
          <div style={{ ...FONT.fine, color: W.tertiary, marginBottom: "12px" }}>CAPITAL STRUCTURE</div>
          <div style={{
            display: "flex", flexDirection: "column", gap: "2px",
            marginBottom: "16px", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "4px", overflow: "hidden", background: "rgba(255,255,255,0.06)",
          }}>
            {sources.map((s) => (
              <div key={s.label} style={{ background: "#0A0A0A", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: s.color }} />
                    <span style={{ fontSize: "16px", fontWeight: 500, color: W.secondary }}>{s.label}</span>
                  </div>
                  <span style={{ ...FONT.data, fontSize: "18px", color: W.primary }}>{formatCompactCurrency(s.amount)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: "20px" }}>
                  <span style={{ fontSize: "16px", color: W.tertiary }}>{s.detail}</span>
                  <span style={{ ...FONT.data, fontSize: "15px", color: W.secondary }}>{s.pctOfBudget}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Stacked bar */}
          <div style={{ height: "24px", borderRadius: "4px", display: "flex", overflow: "hidden", marginBottom: "28px" }}>
            {sources.map((s) => {
              const widthPct = inputs.budget > 0 ? (s.amount / inputs.budget) * 100 : 0;
              return (
                <div key={s.label} style={{
                  width: `${widthPct}%`, height: "100%", background: s.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {widthPct > 15 && (
                    <span style={{ ...FONT.data, fontSize: "11px", color: W.secondary, letterSpacing: "0.08em" }}>
                      {s.label.split(" ")[0].toUpperCase()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── SCENARIO TABLE VISUAL ── */}
      {inputs.revenue > 0 && (
        <>
          <div style={{ ...FONT.fine, color: W.tertiary, marginBottom: "12px" }}>SCENARIO STRESS TEST</div>
          <div style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "4px", overflow: "hidden", marginBottom: "20px",
          }}>
            <div style={{
              padding: "12px 20px", background: "rgba(255,255,255,0.04)",
              ...FONT.fine, color: W.quaternary,
            }}>IF YOUR ACQUISITION PRICE DROPS</div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px", padding: "10px 20px 0" }}>
              <span style={{ ...FONT.fine, fontSize: "11px", letterSpacing: "0.10em", color: W.quaternary, textAlign: "right", minWidth: "56px" }}>RETURN</span>
              <span style={{ ...FONT.fine, fontSize: "11px", letterSpacing: "0.10em", color: W.quaternary, textAlign: "right", minWidth: "56px" }}>MULTIPLE</span>
            </div>
            <div style={{ padding: "0 20px" }}>
              {scenarios.map((s, i) => (
                <div key={s.sub} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 0",
                  borderBottom: i < scenarios.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  borderLeft: i === 0 ? "3px solid rgba(212,175,55,0.40)" : "none",
                  paddingLeft: i === 0 ? "17px" : "0",
                }}>
                  <div>
                    <span style={{ fontSize: "16px", color: W.tertiary }}>{s.label} </span>
                    <span style={{ color: W.quaternary, fontSize: "11px" }}>{s.sub}</span>
                  </div>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <span style={{ ...FONT.data, fontSize: "15px", textAlign: "right", minWidth: "56px", color: s.color }}>
                      {Math.round(s.returnPct)}%
                    </span>
                    <span style={{ ...FONT.data, fontSize: "15px", textAlign: "right", minWidth: "56px", color: s.color }}>
                      {s.multiple.toFixed(1)}&times;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── GATE 1: Sensitivity ── */}
      <LockedSensitivitySection />
    </section>
  );
};

// ─── SECTION 3: LOCKED TEASER — SENSITIVITY ──────────────────────

const LockedSensitivitySection = () => (
  <section style={{ padding: "0px 0px 0px" }}>
    {/* Label — content-descriptive, not "Premium Analysis" */}
    <div style={{ ...FONT.label, color: G.emphasis, marginBottom: "8px" }}>Scenario Modeling</div>

    {/* Headline — reads like the next section */}
    <div style={{ ...FONT.title, color: W.primary, marginBottom: "12px" }}>
      WHAT IF YOUR PRICE MOVES
    </div>

    {/* Locked card */}
    <div style={{
      position: "relative",
      border: "1px solid rgba(212,175,55,0.15)",
      borderRadius: "4px",
      overflow: "hidden",
    }}>
      {/* Blurred content — reduced blur, higher opacity */}
      <div style={{
        padding: "20px",
        filter: "blur(3px)",
        opacity: 0.55,
        userSelect: "none",
        pointerEvents: "none",
      }}>
        {/* Fake scenario header */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
          <div style={{ height: "8px", width: "80px", background: "rgba(212,175,55,0.20)", borderRadius: "2px" }} />
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ height: "8px", width: "40px", background: "rgba(255,255,255,0.12)", borderRadius: "2px" }} />
            <div style={{ height: "8px", width: "40px", background: "rgba(255,255,255,0.12)", borderRadius: "2px" }} />
          </div>
        </div>
        {/* Fake bars */}
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", height: "80px", marginBottom: "12px" }}>
          <div style={{ flex: 1, height: "80%", borderRadius: "3px 3px 0 0", background: "rgba(60,179,113,0.35)" }} />
          <div style={{ flex: 1, height: "65%", borderRadius: "3px 3px 0 0", background: "rgba(60,179,113,0.28)" }} />
          <div style={{ flex: 1, height: "40%", borderRadius: "3px 3px 0 0", background: "rgba(240,168,48,0.28)" }} />
          <div style={{ flex: 1, height: "25%", borderRadius: "3px 3px 0 0", background: "rgba(220,38,38,0.25)" }} />
          <div style={{ flex: 1, height: "15%", borderRadius: "3px 3px 0 0", background: "rgba(220,38,38,0.35)" }} />
        </div>
        {/* Fake labels */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.12)", borderRadius: "2px" }} />
          ))}
        </div>
        {/* Fake prose */}
        <div style={{ height: "10px", width: "85%", background: "rgba(255,255,255,0.12)", borderRadius: "2px", marginBottom: "8px" }} />
        <div style={{ height: "10px", width: "70%", background: "rgba(255,255,255,0.08)", borderRadius: "2px", marginBottom: "8px" }} />
        <div style={{ height: "10px", width: "92%", background: "rgba(255,255,255,0.10)", borderRadius: "2px" }} />
      </div>

      {/* Overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at center, rgba(212,175,55,0.05) 0%, rgba(0,0,0,0.55) 70%)",
      }}>
        <div style={{
          width: "44px", height: "44px",
          border: "1.5px solid rgba(212,175,55,0.45)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "16px",
          boxShadow: "0 0 16px rgba(212,175,55,0.15)",
        }}>
          <svg viewBox="0 0 24 24" style={{ width: "18px", height: "18px", fill: G.standard }}>
            <path d="M18 10h-1V7c0-2.76-2.24-5-5-5S7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-9H9V7c0-1.66 1.34-3 3-3s3 1.34 3 3v3z" />
          </svg>
        </div>
        <span style={{
          fontSize: "12px", fontWeight: 600,
          letterSpacing: "0.15em", textTransform: "uppercase" as const,
          color: G.emphasis,
        }}>
          Included in Full Analysis
        </span>
      </div>
    </div>
  </section>
);

// ─── LIGHTER TEXT: THE INTERPRETATION ────────────────────────────

const InterpretationSection = ({
  inputs, result, guilds, project,
}: {
  inputs: WaterfallInputs;
  result: WaterfallResult;
  guilds: GuildState;
  project: ProjectDetails;
}) => {
  const cashBasis = computeCashBasis(inputs);
  const investorReturnPct = computeInvestorReturnPct(result, inputs);
  const netDistributable = Math.max(0, inputs.revenue - result.offTopTotal);
  const marginOfSafety = inputs.revenue - cashBasis;
  const erosionTotal = result.offTopTotal;
  const erosionPct = inputs.revenue > 0 ? Math.round((erosionTotal / inputs.revenue) * 100) : 0;
  const location = project.location.trim();
  const creditPct = inputs.budget > 0 ? Math.round((inputs.credits / inputs.budget) * 100) : 0;
  const creditConcentration = inputs.budget > 0 ? (inputs.credits / inputs.budget) * 100 : 0;

  return (
    <section style={{ padding: "32px 24px 28px", position: "relative", overflow: "hidden" }}>
      {/* Gold top canopy */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "140px", background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      {/* Purple bottom canopy */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "100px", background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(120,60,180,0.04) 0%, transparent 60%)", pointerEvents: "none" }} />
      {/* Full headline treatment — this is a text block */}
      <div style={{ ...FONT.label, color: G.emphasis, marginBottom: "8px" }}>What The Numbers Say</div>
      <div style={{ ...FONT.display, color: W.primary, marginBottom: "16px" }}>THE INTERPRETATION</div>

      <div style={{ ...FONT.body, color: W.primary }}>
        {/* Paragraph 1: Erosion + net distributable interpretation */}
        <p style={{ marginBottom: "20px" }}>
          Off-the-top deductions consume <Num>{formatCompactCurrency(erosionTotal)}</Num>. That
          is <Num>{erosionPct}%</Num> of
          your <Num>{formatCompactCurrency(inputs.revenue)}</Num> acquisition price, gone before a dollar reaches the
          production entity. What survives: <Num>{formatCompactCurrency(netDistributable)}</Num> in net
          distributable revenue against <Num>{formatCompactCurrency(cashBasis)}</Num> in investor principal.
          {investorReturnPct >= 100 && (
            <> At the base case, investors recoup in full and earn a <Num>{Math.round(investorReturnPct)}%</Num> return.</>
          )}
          {investorReturnPct >= 80 && investorReturnPct < 100 && (
            <> At the base case, investors recover <Num>{Math.round(investorReturnPct)}%</Num> of principal. Close, but not whole.</>
          )}
          {investorReturnPct < 80 && (
            <> At the base case, investors recover only <Num>{Math.round(investorReturnPct)}%</Num> of principal. The gap is structural.</>
          )}
        </p>

        {/* Paragraph 2: Risk concentration */}
        <p style={{ marginBottom: "20px" }}>
          {inputs.credits > 0 && (
            <>{location || "Your state"}&rsquo;s <Num>{creditPct}%</Num> credit accounts
            for <Num>{Math.round(creditConcentration)}%</Num> of your financing.
            Remove it and your cash basis jumps
            to <Num>{formatCompactCurrency(inputs.budget - inputs.deferments)}</Num> (which
            is why tax credit insurance exists, and why most institutional investors require it). </>
          )}
          {inputs.deferments > 0 && (
            <>The <Num>{formatCompactCurrency(inputs.deferments)}</Num> in deferred fees reduces your cash exposure
            on paper, but that only holds if those fees accelerate on recoupment, not on delivery.
            Check the language in your talent agreements. </>
          )}
          {marginOfSafety > 0 ? (
            <>The margin between cash basis and market value
            is <Num>{formatCompactCurrency(marginOfSafety)}</Num>. That is where this deal lives or dies.</>
          ) : (
            <>There is no margin between cash basis and market value. Every dollar of the budget must be recouped from a sale that hasn&rsquo;t happened yet.</>
          )}
        </p>

        {/* Paragraph 3: Scenario interpretation */}
        {inputs.revenue > 0 && (
          <p>
            The scenario table shows what happens when the market moves against you. A <Num>15%</Num> haircut
            from your modeled price is a normal negotiation concession. A <Num>30%</Num> haircut
            is a weak market or a buyer with leverage. Beyond that, you are in distress territory.
            {investorReturnPct >= 100 ? (
              <> At this capital structure, your deal absorbs the negotiation haircut and still funds investors. The question is how deep into weak-market territory you can go before the math breaks.</>
            ) : (
              <> At this capital structure, even the base case is tight. A negotiation concession pushes investors further underwater. The question is not whether the deal works at your modeled price. It is whether the modeled price is real.</>
            )}
          </p>
        )}
      </div>
    </section>
  );
};

// ─── VISUAL CLUSTER 2: THE WATERFALL ────────────────────────────

const VisualCluster2 = ({
  tiers, result, inputs, guilds,
}: {
  tiers: TierPayment[];
  result: WaterfallResult;
  inputs: WaterfallInputs;
  guilds: GuildState;
}) => {
  const netDistributable = Math.max(0, inputs.revenue - result.offTopTotal);
  const backendPool = result.profitPool;

  // Deductions ledger rows
  const rows: { label: string; rate: string; amount: number; isGross?: boolean }[] = [];
  rows.push({ label: "Gross Receipts", rate: "", amount: inputs.revenue, isGross: true });
  if (result.cam > 0) rows.push({ label: "CAM Fee", rate: `${(CAM_PCT * 100).toFixed(1)}%`, amount: result.cam });
  if (result.salesFee > 0) rows.push({ label: "Sales Commission", rate: `${inputs.salesFee}%`, amount: result.salesFee });
  if (result.marketing > 0) rows.push({ label: "Sales Agent Expenses", rate: "capped", amount: result.marketing });
  if (result.guilds > 0) {
    const parts: string[] = [];
    if (guilds.sag) parts.push("SAG-AFTRA");
    if (guilds.wga) parts.push("WGA");
    if (guilds.dga) parts.push("DGA");
    rows.push({ label: "Guild Reserves", rate: parts.join("+"), amount: result.guilds });
  }

  // Cascade data
  const cascadeTiers = [
    ...tiers,
    ...(backendPool > 0 ? [{ phase: tiers.length + 1, label: "Backend Pool", amount: backendPool, paid: backendPool, status: "partial" as const }] : []),
  ];

  return (
    <section style={{ padding: "28px 24px 28px", position: "relative", overflow: "hidden" }}>
      {/* Gold top canopy */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "140px", background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* ── DEDUCTIONS LEDGER ── */}
      <div style={{ ...FONT.fine, color: W.tertiary, marginBottom: "12px" }}>GROSS TO NET</div>
      <div style={{
        border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px",
        overflow: "hidden", marginBottom: "28px",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", padding: "12px 16px",
          background: "rgba(255,255,255,0.04)", ...FONT.fine, color: W.quaternary,
        }}>
          <span>DEDUCTION</span><span>AMOUNT</span>
        </div>
        {/* Rows */}
        {rows.map((row) => (
          <div key={row.label} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ fontSize: "16px", color: W.tertiary }}>
              {row.label}
              {row.rate && (
                <span style={{ ...FONT.data, fontSize: "15px", color: W.secondary, marginLeft: "6px" }}>
                  {row.rate}
                </span>
              )}
            </div>
            <span style={{ ...FONT.data, fontSize: "15px", color: row.isGross ? W.primary : "rgba(220,38,38,0.75)" }}>
              {row.isGross ? formatFullCurrency(row.amount) : `\u2212${formatFullCurrency(row.amount)}`}
            </span>
          </div>
        ))}
        {/* Total */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 16px", borderTop: "2px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.03)",
        }}>
          <span style={{ fontSize: "16px", fontWeight: 600, color: W.secondary }}>Net Distributable</span>
          <span style={{ ...FONT.data, fontSize: "22px", color: SEM.green }}>
            {formatFullCurrency(netDistributable)}
          </span>
        </div>
      </div>

      {/* ── CASCADE TIER CARDS ── */}
      <div style={{ ...FONT.fine, color: W.tertiary, marginBottom: "12px" }}>RECOUPMENT CASCADE</div>
      <div style={{
        display: "flex", flexDirection: "column", gap: "16px",
        position: "relative", paddingLeft: "16px", marginBottom: "20px",
      }}>
        {/* Vertical connecting line */}
        {cascadeTiers.length >= 2 && (
          <div style={{
            position: "absolute", left: "3px", top: "24px", bottom: "24px",
            width: "2px",
            background: "linear-gradient(180deg, rgba(212,175,55,0.30), rgba(212,175,55,0.15))",
            borderRadius: "1px",
          }} />
        )}

        {/* Tier cards */}
        {cascadeTiers.map((tier) => {
          const fillPct = netDistributable > 0 ? (tier.paid / netDistributable) * 100 : 0;
          const isFunded = tier.status === "funded";
          const isPartial = tier.status === "partial";
          const isBackend = tier.label === "Backend Pool";

          const borderColor = isFunded ? "rgba(60,179,113,0.15)" : isPartial || isBackend ? "rgba(212,175,55,0.15)" : "rgba(220,38,38,0.10)";
          const bgColor = isFunded ? "rgba(60,179,113,0.03)" : isPartial || isBackend ? "rgba(212,175,55,0.03)" : "rgba(220,38,38,0.02)";
          const dotColor = isFunded ? "#3CB371" : isPartial || isBackend ? "rgba(212,175,55,0.70)" : "rgba(220,38,38,0.50)";
          const dotBorder = isFunded ? "rgba(60,179,113,0.70)" : isPartial || isBackend ? "rgba(212,175,55,0.70)" : "rgba(220,38,38,0.50)";
          const dotGlow = isFunded ? "0 0 6px rgba(60,179,113,0.30)" : "none";
          const barGradient = isFunded ? "linear-gradient(90deg, rgba(60,179,113,0.25), rgba(60,179,113,0.45))" : isPartial || isBackend ? "linear-gradient(90deg, rgba(212,175,55,0.20), rgba(212,175,55,0.40))" : "linear-gradient(90deg, rgba(220,38,38,0.15), rgba(220,38,38,0.30))";
          const valueColor = isFunded ? SEM.green : isPartial || isBackend ? G.emphasis : SEM.red;
          const badgeStyle: React.CSSProperties = isFunded ? { background: "rgba(60,179,113,0.15)", color: SEM.green } : isPartial ? { background: "rgba(240,168,48,0.20)", color: SEM.amber } : isBackend ? { background: "rgba(212,175,55,0.12)", color: G.emphasis } : { background: "rgba(220,38,38,0.15)", color: "rgba(220,38,38,0.70)" };
          const badgeText = isFunded ? "FUNDED" : isPartial ? "PARTIAL" : isBackend ? "SURPLUS" : "ZERO";
          const displayLabel = tier.label === "Equity + Premium" && inputs.premium > 0 ? `Equity (${100 + inputs.premium}%)` : tier.label === "Deferments" ? "Deferred Fees" : tier.label;

          return (
            <div key={tier.label} style={{ position: "relative" }}>
              {cascadeTiers.length >= 2 && (
                <div style={{
                  position: "absolute", left: "-16px", top: "20px",
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: dotColor, border: `1.5px solid ${dotBorder}`, boxShadow: dotGlow,
                }} />
              )}
              <div style={{ padding: "16px", border: `1px solid ${borderColor}`, borderRadius: "6px", background: bgColor }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: dotColor, boxShadow: dotGlow }} />
                    <span style={{ fontSize: "13px", fontWeight: 500, color: W.secondary }}>{displayLabel}</span>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, padding: "3px 8px", borderRadius: "3px", ...badgeStyle }}>{badgeText}</span>
                </div>
                <div style={{ height: "8px", background: "rgba(255,255,255,0.04)", borderRadius: "4px", overflow: "hidden", marginBottom: "8px" }}>
                  {fillPct > 0 && <div style={{ height: "100%", width: `${Math.min(100, fillPct)}%`, borderRadius: "4px", background: barGradient }} />}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ ...FONT.data, fontSize: "15px", color: W.secondary }}>
                    {formatCompactCurrency(tier.paid)}{tier.amount > 0 ? ` / ${formatCompactCurrency(tier.amount)}` : ""}
                  </span>
                  <span style={{ ...FONT.data, fontSize: "14px", color: valueColor }}>
                    {isBackend ? "Split per OA" : tier.amount > 0 ? `${Math.round((tier.paid / tier.amount) * 100)}%` : "0%"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Summary line */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "8px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08))" }} />
          <span style={{ ...FONT.fine, color: W.quaternary }}>
            {tiers.every(t => t.status === "funded") ? "ALL TIERS FUNDED" : "PARTIAL FUNDING"}
          </span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(255,255,255,0.08), transparent)" }} />
        </div>
      </div>

      {/* ── GATE 2: Comps ── */}
      <LockedComparableSection />
    </section>
  );
};

// ─── LOCKED COMPARABLE (Gate 2) ─────────────────────────────────

const LockedComparableSection = () => (
  <section style={{ padding: "20px 0px 0px" }}>
    {/* Label — content-descriptive */}
    <div style={{ ...FONT.label, color: G.emphasis, marginBottom: "8px" }}>Market Comparables</div>

    {/* Headline — reads like the next section */}
    <div style={{ ...FONT.title, color: W.primary, marginBottom: "12px" }}>
      WHAT DID SIMILAR FILMS SELL FOR
    </div>

    {/* Locked card with blurred content */}
    <div style={{
      position: "relative",
      border: "1px solid rgba(212,175,55,0.22)",
      borderRadius: "4px",
      overflow: "hidden",
    }}>
      {/* Blurred content — fake comp table */}
      <div style={{
        padding: "20px",
        filter: "blur(3px)",
        opacity: 0.55,
        userSelect: "none",
        pointerEvents: "none",
      }}>
        {/* Fake comp table header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingBottom: "10px", marginBottom: "12px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ height: "8px", width: "60px", background: "rgba(212,175,55,0.20)", borderRadius: "2px" }} />
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ height: "8px", width: "50px", background: "rgba(255,255,255,0.12)", borderRadius: "2px" }} />
            <div style={{ height: "8px", width: "50px", background: "rgba(255,255,255,0.12)", borderRadius: "2px" }} />
          </div>
        </div>

        {/* Fake comp rows */}
        {[
          { w1: "100px", w2: "70px", color: "rgba(60,179,113,0.25)" },
          { w1: "120px", w2: "80px", color: "rgba(60,179,113,0.20)" },
          { w1: "90px", w2: "65px", color: "rgba(240,168,48,0.22)" },
        ].map((row, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}>
            <div>
              <div style={{ height: "10px", width: row.w1, background: "rgba(255,255,255,0.14)", borderRadius: "2px", marginBottom: "4px" }} />
              <div style={{ height: "6px", width: row.w2, background: "rgba(255,255,255,0.08)", borderRadius: "2px" }} />
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ height: "10px", width: "50px", background: row.color, borderRadius: "2px" }} />
              <div style={{ height: "10px", width: "40px", background: "rgba(255,255,255,0.10)", borderRadius: "2px" }} />
            </div>
          </div>
        ))}

        {/* Fake valuation range bar */}
        <div style={{ marginTop: "16px", marginBottom: "12px" }}>
          <div style={{ height: "6px", width: "50px", background: "rgba(212,175,55,0.18)", borderRadius: "2px", marginBottom: "8px" }} />
          <div style={{ height: "20px", borderRadius: "4px", display: "flex", overflow: "hidden" }}>
            <div style={{ width: "25%", height: "100%", background: "rgba(220,38,38,0.20)" }} />
            <div style={{ width: "35%", height: "100%", background: "rgba(240,168,48,0.22)" }} />
            <div style={{ width: "25%", height: "100%", background: "rgba(60,179,113,0.25)" }} />
            <div style={{ width: "15%", height: "100%", background: "rgba(60,179,113,0.15)" }} />
          </div>
        </div>

        {/* Fake prose */}
        <div style={{ height: "8px", width: "90%", background: "rgba(255,255,255,0.10)", borderRadius: "2px", marginBottom: "6px" }} />
        <div style={{ height: "8px", width: "75%", background: "rgba(255,255,255,0.07)", borderRadius: "2px", marginBottom: "6px" }} />
        <div style={{ height: "8px", width: "82%", background: "rgba(255,255,255,0.09)", borderRadius: "2px" }} />
      </div>

      {/* Overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at center, rgba(120,60,180,0.04) 0%, rgba(212,175,55,0.05) 30%, rgba(0,0,0,0.55) 70%)",
      }}>
        <div style={{
          width: "44px", height: "44px",
          border: "1.5px solid rgba(212,175,55,0.55)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "16px",
          boxShadow: "0 0 20px rgba(212,175,55,0.18), 0 0 40px rgba(120,60,180,0.08)",
        }}>
          <svg viewBox="0 0 24 24" style={{ width: "18px", height: "18px", fill: G.standard }}>
            <path d="M18 10h-1V7c0-2.76-2.24-5-5-5S7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-9H9V7c0-1.66 1.34-3 3-3s3 1.34 3 3v3z" />
          </svg>
        </div>
        <span style={{
          fontSize: "12px", fontWeight: 600,
          letterSpacing: "0.15em", textTransform: "uppercase" as const,
          color: G.emphasis,
        }}>
          Included in Comp Report
        </span>
      </div>
    </div>
  </section>
);

// ─── SECTION 7: LOCKED TEASER — INVESTOR MEMO ───────────────────

const LockedInvestorMemoSection = () => (
  <section style={{ padding: "20px 0px 0px" }}>
    {/* Label */}
    <div style={{ ...FONT.label, color: G.emphasis, marginBottom: "8px" }}>Investor Documents</div>

    {/* Headline */}
    <div style={{ ...FONT.title, color: W.primary, marginBottom: "12px" }}>THE INVESTOR MEMO</div>

    {/* Locked card */}
    <div style={{
      position: "relative",
      border: "1px solid rgba(212,175,55,0.30)",
      borderRadius: "4px",
      overflow: "hidden",
      boxShadow: "0 0 30px rgba(212,175,55,0.08), 0 0 60px rgba(120,60,180,0.06)",
    }}>
      {/* Fake document behind blur — designed to look like a real financial document */}
      <div style={{
        padding: "24px 20px",
        filter: "blur(3px)",
        opacity: 0.55,
        userSelect: "none",
        pointerEvents: "none",
      }}>
        {/* Fake document header with gold rule */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid rgba(212,175,55,0.20)",
          paddingBottom: "12px", marginBottom: "16px",
        }}>
          <div>
            <div style={{ height: "12px", width: "120px", background: "rgba(212,175,55,0.25)", borderRadius: "2px", marginBottom: "4px" }} />
            <div style={{ height: "8px", width: "80px", background: "rgba(255,255,255,0.10)", borderRadius: "2px" }} />
          </div>
          <div style={{ width: "32px", height: "32px", border: "1.5px solid rgba(212,175,55,0.25)", borderRadius: "50%" }} />
        </div>

        {/* Fake KPI row — 3 boxes */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <div style={{ flex: 1, padding: "10px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "3px" }}>
            <div style={{ height: "6px", width: "40px", background: "rgba(255,255,255,0.10)", borderRadius: "2px", marginBottom: "6px" }} />
            <div style={{ height: "14px", width: "60px", background: "rgba(60,179,113,0.20)", borderRadius: "2px" }} />
          </div>
          <div style={{ flex: 1, padding: "10px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "3px" }}>
            <div style={{ height: "6px", width: "40px", background: "rgba(255,255,255,0.10)", borderRadius: "2px", marginBottom: "6px" }} />
            <div style={{ height: "14px", width: "60px", background: "rgba(212,175,55,0.20)", borderRadius: "2px" }} />
          </div>
          <div style={{ flex: 1, padding: "10px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "3px" }}>
            <div style={{ height: "6px", width: "40px", background: "rgba(255,255,255,0.10)", borderRadius: "2px", marginBottom: "6px" }} />
            <div style={{ height: "14px", width: "60px", background: "rgba(255,255,255,0.15)", borderRadius: "2px" }} />
          </div>
        </div>

        {/* Fake prose paragraph 1 */}
        <div style={{ marginBottom: "14px" }}>
          <div style={{ height: "8px", width: "100%", background: "rgba(255,255,255,0.10)", borderRadius: "2px", marginBottom: "6px" }} />
          <div style={{ height: "8px", width: "92%", background: "rgba(255,255,255,0.08)", borderRadius: "2px", marginBottom: "6px" }} />
          <div style={{ height: "8px", width: "85%", background: "rgba(255,255,255,0.09)", borderRadius: "2px", marginBottom: "6px" }} />
          <div style={{ height: "8px", width: "78%", background: "rgba(255,255,255,0.07)", borderRadius: "2px" }} />
        </div>

        {/* Fake mini data table */}
        <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden", marginBottom: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "rgba(255,255,255,0.03)" }}>
            <div style={{ height: "6px", width: "60px", background: "rgba(255,255,255,0.10)", borderRadius: "2px" }} />
            <div style={{ height: "6px", width: "40px", background: "rgba(255,255,255,0.10)", borderRadius: "2px" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px" }}>
            <div style={{ height: "6px", width: "70px", background: "rgba(255,255,255,0.07)", borderRadius: "2px" }} />
            <div style={{ height: "6px", width: "50px", background: "rgba(60,179,113,0.15)", borderRadius: "2px" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ height: "6px", width: "55px", background: "rgba(255,255,255,0.07)", borderRadius: "2px" }} />
            <div style={{ height: "6px", width: "50px", background: "rgba(60,179,113,0.15)", borderRadius: "2px" }} />
          </div>
        </div>

        {/* Fake prose paragraph 2 */}
        <div>
          <div style={{ height: "8px", width: "95%", background: "rgba(255,255,255,0.09)", borderRadius: "2px", marginBottom: "6px" }} />
          <div style={{ height: "8px", width: "80%", background: "rgba(255,255,255,0.07)", borderRadius: "2px", marginBottom: "6px" }} />
          <div style={{ height: "8px", width: "65%", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }} />
        </div>
      </div>

      {/* Overlay — warmest gate */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at center, rgba(120,60,180,0.06) 0%, rgba(212,175,55,0.06) 30%, rgba(0,0,0,0.50) 70%)",
      }}>
        <div style={{
          width: "44px", height: "44px",
          border: "1.5px solid rgba(212,175,55,0.70)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "16px",
          boxShadow: "0 0 24px rgba(212,175,55,0.25), 0 0 48px rgba(120,60,180,0.12)",
        }}>
          <svg viewBox="0 0 24 24" style={{ width: "18px", height: "18px", fill: G.standard }}>
            <path d="M18 10h-1V7c0-2.76-2.24-5-5-5S7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-9H9V7c0-1.66 1.34-3 3-3s3 1.34 3 3v3z" />
          </svg>
        </div>
        <span style={{
          fontSize: "12px", fontWeight: 600,
          letterSpacing: "0.15em", textTransform: "uppercase" as const,
          color: G.emphasis,
        }}>
          Included in Producer&rsquo;s Package
        </span>
      </div>
    </div>
  </section>
);

// ─── DENSE TEXT: THE CONCLUSION ──────────────────────────────────

const ConclusionSection = ({
  inputs, result, guilds, project,
}: {
  inputs: WaterfallInputs;
  result: WaterfallResult;
  guilds: GuildState;
  project: ProjectDetails;
}) => {
  const multiple = result.multiple;
  const investorReturnPct = inputs.equity > 0 ? (result.investor / inputs.equity) * 100 : 0;
  const cashBasis = computeCashBasis(inputs);
  const netDistributable = Math.max(0, inputs.revenue - result.offTopTotal);
  const tiers = computeTierPayments(result, inputs);
  const allFunded = tiers.every(t => t.status === "funded");
  const backendPool = result.profitPool;

  // Verdict pull-quote
  let verdictText: string;
  let borderColor: string;
  if (multiple >= 1.5) {
    verdictText = "THE MATH WORKS. THE PRESENTATION IS WHAT CLOSES IT.";
    borderColor = "rgba(60,179,113,0.40)";
  } else if (multiple >= 1.0) {
    verdictText = "HONEST MARGINS IN A ROOM FULL OF INFLATED PROJECTIONS. THAT IS YOUR EDGE.";
    borderColor = "rgba(212,175,55,0.40)";
  } else if (multiple >= 0.7) {
    verdictText = "TIGHT STRUCTURE. THE DEAL LIVES OR DIES ON EXECUTION.";
    borderColor = "rgba(240,168,48,0.40)";
  } else {
    verdictText = "YOU FOUND THE GAP BEFORE YOUR INVESTORS DID. THAT IS THE POINT OF MODELING.";
    borderColor = "rgba(220,38,38,0.40)";
  }

  return (
    <section style={{ padding: "32px 24px 28px", position: "relative", overflow: "hidden" }}>
      {/* Gold top canopy — warmer (approaching CTA) */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "200px", background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />
      {/* Purple bottom canopy */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "140px", background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(120,60,180,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />
      {/* Full headline treatment */}
      <div style={{ ...FONT.label, color: G.emphasis, marginBottom: "8px" }}>Where You Stand</div>
      <div style={{ ...FONT.display, color: W.primary, marginBottom: "16px" }}>THE CONCLUSION</div>

      <div style={{ ...FONT.body, color: W.primary }}>
        {/* Paragraph 1: Consequence-first verdict */}
        <p style={{ marginBottom: "20px" }}>
          {allFunded && backendPool > 0 && (
            <>Every capital tier is funded, with <Num>{formatCompactCurrency(backendPool)}</Num> flowing into the backend pool. That puts this deal in the minority of independent structures that can present to investors with math that works at multiple price points.</>
          )}
          {allFunded && backendPool === 0 && (
            <>Every capital tier is funded, but there is no backend surplus. The deal works, but there is zero cushion. Every dollar of the acquisition price is spoken for.</>
          )}
          {!allFunded && (
            <>Not all capital tiers are funded at this acquisition price. The waterfall ran dry before reaching full recoupment. That is a structural problem, not a pricing problem.</>
          )}
        </p>

        {/* Paragraph 2: Modeling vs presenting */}
        <p style={{ marginBottom: "20px" }}>
          The numbers work on screen. The question is whether they work in the room. An investor
          is not reading your waterfall on a phone. They are reading a document you hand them across
          a table, and that document needs sensitivity analysis they can underwrite, comparable
          transactions that justify your valuation, and formatting that looks like it was prepared
          by someone who has done this before.
        </p>
      </div>

      {/* Pull-quote — verdict */}
      <div style={{
        borderLeft: `3px solid ${borderColor}`,
        paddingLeft: "20px",
        margin: "24px 0",
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "26px",
          letterSpacing: "0.06em",
          lineHeight: 1.2,
          color: W.primary,
        }}>
          {verdictText}
        </div>
      </div>

      {/* Gate 3 — embedded as visual evidence of what's missing */}
      <LockedInvestorMemoSection />

      {/* Post-gate close */}
      <div style={{ ...FONT.body, color: W.primary, marginTop: "24px" }}>
        <p>
          {multiple >= 1.0 ? (
            <>The model is the foundation. Without the presentation layer, you are asking investors to underwrite a spreadsheet, and that is not how deals close.</>
          ) : (
            <>You have identified where the deal breaks. Restructure the stack, find soft money that changes the cash basis, or renegotiate terms. Then run it again. The model is free. Use it until the math works.</>
          )}
        </p>
      </div>
    </section>
  );
};

// ─── SECTION 8: CTA ──────────────────────────────────────────────

const CTASection = ({ result, inputs, project, guilds }: {
  result: WaterfallResult;
  inputs: WaterfallInputs;
  project: ProjectDetails;
  guilds: GuildState;
}) => {
  const navigate = useNavigate();
  const haptics = useHaptics();
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [pendingExport, setPendingExport] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExportPdf = useCallback(async (email?: string) => {
    setExporting(true);
    try {
      // 1. Serialize calculator state
      const payload = serializeSnapshot(result, inputs, project, guilds);

      // 2. Determine user email
      let userEmail = email;
      if (!userEmail) {
        const { data: { session } } = await supabase.auth.getSession();
        userEmail = session?.user?.email;
      }

      if (!userEmail) {
        setExporting(false);
        return;
      }

      // 3. Save snapshot to Supabase
      const { data: snapshot, error: dbError } = await supabase
        .from('waterfall_snapshots')
        .insert({
          user_email: userEmail,
          project_name: project.title || 'Untitled Project',
          snapshot_data: payload,
          product_tier: 'snapshot',
        })
        .select('id')
        .single();

      if (dbError || !snapshot) {
        console.error('Snapshot save error:', dbError);
        haptics.error();
        setExporting(false);
        return;
      }

      // 4. Trigger PDF download
      const pdfUrl = `/api/generate-pdf?id=${snapshot.id}`;
      const response = await fetch(pdfUrl);

      if (!response.ok) {
        throw new Error('PDF generation failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(project.title || 'Waterfall_Snapshot').replace(/[^a-zA-Z0-9_-]/g, '_')}_Snapshot.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      haptics.success();
    } catch (err) {
      console.error('Export error:', err);
      haptics.error();
    } finally {
      setExporting(false);
      setPendingExport(false);
    }
  }, [result, inputs, project, guilds, haptics]);

  const gatedNavigate = useCallback(async (destination: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      navigate(destination);
    } else {
      setShowLeadCapture(true);
    }
  }, [navigate]);

  return (
    <>
      <LeadCaptureModal
        isOpen={showLeadCapture}
        onClose={() => {
          setShowLeadCapture(false);
          if (!pendingExport) setPendingExport(false);
        }}
        onEmailSubmitted={(email) => {
          if (pendingExport) {
            setShowLeadCapture(false);
            handleExportPdf(email);
          }
        }}
      />
      <section style={{
        padding: "36px 24px 48px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Dual gold + purple ambient glow */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 80% 50% at 50% 20%, rgba(120,60,180,0.10) 0%, transparent 55%), radial-gradient(ellipse at center 40%, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 40%, transparent 70%)",
        }} />

        {/* Warm top border */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.25) 20%, rgba(212,175,55,0.50) 50%, rgba(212,175,55,0.25) 80%, transparent 100%)",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Headline — gold gradient text */}
          <div style={{
            ...FONT.title,
            marginBottom: "28px",
            background: "linear-gradient(135deg, #D4AF37, #F9E076)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            YOUR INVESTORS WILL ASK.
          </div>

          {/* Section label */}
          <div style={{
            ...FONT.label,
            color: G.emphasis,
            textAlign: "left",
            paddingLeft: "24px",
            marginBottom: "14px",
          }}>What the Full Analysis gives you</div>

          {/* 6 benefit bullets — left-aligned */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "0 24px",
            margin: "0 auto 32px",
            textAlign: "left",
          }}>
            {[
              "Show investors your deal holds when the market drops 30%",
              "Five scenario stress tests with return and multiple at each price point",
              "Full waterfall, capital stack, and budget in one PDF",
              "Formatted for due diligence, not just display",
              "White-labeled with your project name and production company",
              "Ready to hand across the table or attach to an email",
            ].map((item) => (
              <div key={item} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ color: "#3CB371", fontSize: "14px", marginTop: "2px", flexShrink: 0, width: "14px", textAlign: "center" }}>✓</span>
                <span style={{ fontSize: "14px", color: W.secondary, lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Primary CTA — purple gradient + shimmer, gated */}
          <div style={{ marginBottom: "16px" }}>
            <span
              onClick={(e) => { haptics.medium(e); gatedNavigate("/store/the-full-analysis"); }}
              style={{
                display: "inline-block",
                padding: "16px 36px",
                background: "linear-gradient(135deg, rgb(75,30,130), rgb(110,50,170))",
                border: "none",
                borderRadius: "8px",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "20px",
                letterSpacing: "0.15em",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "none",
                boxShadow: "0 0 20px rgba(120,60,180,0.35), 0 0 60px rgba(120,60,180,0.15)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              GET THE FULL ANALYSIS
            </span>
          </div>

          {/* Free snapshot — export PDF */}
          <div style={{ marginTop: "12px" }}>
            <span
              onClick={async (e) => {
                haptics.light(e);
                if (exporting) return;
                // Check if user is authenticated
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user?.email) {
                  // Already authed — export directly
                  handleExportPdf(session.user.email);
                } else {
                  // Need email first — open lead capture
                  setPendingExport(true);
                  setShowLeadCapture(true);
                }
              }}
              style={{
                display: "inline-block",
                padding: "12px 28px",
                border: `1px solid ${exporting ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                letterSpacing: "0.04em",
                color: exporting ? '#D4AF37' : W.tertiary,
                cursor: exporting ? 'wait' : 'pointer',
                textDecoration: "none",
                transition: "border-color 0.2s, color 0.2s",
                opacity: exporting ? 0.7 : 1,
              }}
            >
              {exporting ? 'Generating PDF...' : 'Export Free Snapshot'}
            </span>
          </div>

          {/* Footer provenance mark */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginTop: "40px",
          }}>
            <div style={{ flex: 1, maxWidth: "60px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.20))" }} />
            <span style={{
              fontSize: "11px", fontWeight: 600,
              letterSpacing: "0.15em", textTransform: "uppercase" as const,
              color: W.quaternary,
            }}>filmmaker.og · Waterfall Snapshot</span>
            <div style={{ flex: 1, maxWidth: "60px", height: "1px", background: "linear-gradient(90deg, rgba(212,175,55,0.20), transparent)" }} />
          </div>
        </div>
      </section>
    </>
  );
};

// ─── Main Component ──────────────────────────────────────────────

const WaterfallBrief = ({
  result,
  inputs,
  project,
  guilds,
}: WaterfallBriefProps) => {
  // Core computations
  const tiers = computeTierPayments(result, inputs);

  return (
    <div style={{
      background: "#0A0A0A",
      maxWidth: "430px",
      margin: "0 auto",
    }}>
      {/* ═══ 1. TITLE PAGE ═══ */}
      <CoverSection
        project={project}
        inputs={inputs}
        result={result}
        guilds={guilds}
      />

      <GoldGlowBreak />

      {/* ═══ 2. DENSE TEXT: THE DEAL ═══ */}
      <DealSection
        inputs={inputs}
        result={result}
        guilds={guilds}
        project={project}
      />

      <GoldGlowBreak />

      {/* ═══ 3. VISUAL CLUSTER 1: THE NUMBERS ═══ */}
      <VisualCluster1
        inputs={inputs}
        result={result}
        guilds={guilds}
        project={project}
      />

      <GoldGlowBreak />

      {/* ═══ 4. LIGHTER TEXT: THE INTERPRETATION ═══ */}
      <InterpretationSection
        inputs={inputs}
        result={result}
        guilds={guilds}
        project={project}
      />

      <GoldGlowBreak />

      {/* ═══ 5. VISUAL CLUSTER 2: THE WATERFALL ═══ */}
      <VisualCluster2
        tiers={tiers}
        result={result}
        inputs={inputs}
        guilds={guilds}
      />

      <GoldGlowBreak />

      {/* ═══ 6. DENSE TEXT: THE CONCLUSION ═══ */}
      <ConclusionSection
        inputs={inputs}
        result={result}
        guilds={guilds}
        project={project}
      />

      <GoldGlowBreak />

      {/* ═══ 7. CTA ═══ */}
      <CTASection result={result} inputs={inputs} project={project} guilds={guilds} />
    </div>
  );
};

export default WaterfallBrief;
