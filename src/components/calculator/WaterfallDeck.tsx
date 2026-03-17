import type { ProjectDetails } from "@/pages/Calculator";
import {
  WaterfallResult,
  WaterfallInputs,
  GuildState,
  CapitalSelections,
  formatCompactCurrency,
  formatFullCurrency,
  computeTierPayments,
  calculateWaterfall,
  CAM_PCT,
} from "@/lib/waterfall";
import type { TierPayment } from "@/lib/waterfall-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Types ───────────────────────────────────────────────────────

interface WaterfallBriefProps {
  result: WaterfallResult;
  inputs: WaterfallInputs;
  project: ProjectDetails;
  guilds: GuildState;
  selections?: CapitalSelections;
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
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: 1.75,
  } as React.CSSProperties,
  label: {
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.20em",
    textTransform: "uppercase" as const,
  } as React.CSSProperties,
  fine: {
    fontSize: "10px",
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
  red: "#E05252",
  amber: "#F0A830",
  gold: "#D4AF37",
};

// ─── Shared Elements ─────────────────────────────────────────────

const GoldGlowBreak = () => (
  <div style={{ padding: "24px 24px" }}>
    <div style={{
      height: "1px",
      background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.15) 15%, rgba(212,175,55,0.45) 50%, rgba(212,175,55,0.15) 85%, transparent 100%)",
    }} />
  </div>
);

const SoftBreak = () => (
  <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />
);

const GoldSeparator = () => (
  <div style={{ width: "40px", height: "1px", background: G.floor, margin: "28px 0" }} />
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
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);

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

  const hasTeam = teamFields.length > 0;
  const hasLogline = project.logline.trim().length > 0;

  // Assumptions text
  const assumptionParts: string[] = [];
  if (inputs.credits > 0 && project.location.trim()) {
    const creditPct = inputs.budget > 0 ? Math.round((inputs.credits / inputs.budget) * 100) : 0;
    assumptionParts.push(`${project.location} ${creditPct}% credit`);
  }
  assumptionParts.push("Acquisition model");
  if (inputs.deferments > 0) {
    assumptionParts.push(`${formatCompactCurrency(inputs.deferments)} deferred fees`);
  }
  if (inputs.salesFee > 0) {
    assumptionParts.push(`${inputs.salesFee}% sales agent`);
  }
  if (inputs.salesExp > 0) {
    assumptionParts.push(`${formatCompactCurrency(inputs.salesExp)} expense cap`);
  }
  const guildParts: string[] = [];
  if (guilds.sag) guildParts.push("SAG-AFTRA");
  if (guilds.wga) guildParts.push("WGA");
  if (guilds.dga) guildParts.push("DGA");
  if (guildParts.length > 0) assumptionParts.push(guildParts.join(", "));

  // Verdict text
  const netToInvestors = Math.max(0, inputs.revenue - result.offTopTotal);
  const verdictContext = netToInvestors > cashBasis
    ? `Market value exceeds cash basis by ${formatCompactCurrency(netToInvestors - cashBasis)}.`
    : `Net distributable falls short of cash basis by ${formatCompactCurrency(cashBasis - netToInvestors)}.`;

  return (
    <section style={{
      minHeight: "100dvh",
      padding: "40px 24px 32px",
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
        <span style={{ ...FONT.label, color: G.standard }}>Waterfall Snapshot</span>
      </div>

      {/* 1b. Title */}
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "56px",
        letterSpacing: "0.06em",
        lineHeight: 0.95,
        color: W.primary,
        marginBottom: "10px",
      }}>
        {(project.title.trim() || "UNTITLED PROJECT").toUpperCase()}
      </div>

      {/* 1c. Logline */}
      {hasLogline && (
        <div style={{
          fontSize: "15px",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
          color: W.tertiary,
          fontStyle: "italic",
          maxWidth: "360px",
          lineHeight: 1.5,
          marginBottom: "28px",
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
          marginBottom: "28px",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "4px",
          overflow: "hidden",
          background: "rgba(255,255,255,0.06)",
        }}>
          {teamFields.map((f) => (
            <div key={f.role} style={{ background: "#0A0A0A", padding: "12px 14px" }}>
              <div style={{
                ...FONT.fine,
                color: W.quaternary,
                marginBottom: "3px",
              }}>
                {f.role.toUpperCase()}
              </div>
              <div style={{
                fontSize: "14px",
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
            fontSize: "22px",
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
            fontSize: "22px",
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
            fontSize: "22px",
            fontWeight: 500,
            letterSpacing: "0.06em",
            color: W.primary,
          }}>
            {formatCompactCurrency(inputs.revenue)}
          </div>
        </div>
        <div style={{ flex: 1, background: "#0A0A0A", padding: "14px", borderLeft: `2px solid ${returnColor === SEM.green ? "rgba(60,179,113,0.25)" : returnColor === SEM.amber ? "rgba(240,168,48,0.25)" : "rgba(224,82,82,0.35)"}` }}>
          <div style={{ ...FONT.fine, color: W.quaternary, marginBottom: "4px" }}>INVESTOR RETURN</div>
          <div style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "22px",
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
          fontSize: "40px",
          fontWeight: 500,
          lineHeight: 1,
          color: multipleColor,
        }}>
          {multiple.toFixed(1)}&times;
        </div>
        <div style={{ fontSize: "14px", lineHeight: 1.4, color: W.tertiary }}>
          <strong style={{ color: W.secondary, fontWeight: 600 }}>Cash-on-cash multiple.</strong>
          <br />
          {verdictContext}
        </div>
      </div>

      {/* 1g. Assumptions (collapsible) */}
      <div style={{
        marginTop: "20px",
        padding: "12px 14px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "4px",
      }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={() => setAssumptionsOpen(!assumptionsOpen)}
        >
          <span style={{ ...FONT.fine, color: W.ghost }}>ASSUMPTIONS</span>
          <span style={{ color: W.ghost }}>{assumptionsOpen ? "\u25BE" : "\u25B8"}</span>
        </div>
        {assumptionsOpen && (
          <div style={{
            fontSize: "13px",
            color: W.quaternary,
            lineHeight: 1.5,
            marginTop: "8px",
          }}>
            {assumptionParts.join(" \u00B7 ")}
          </div>
        )}
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
  if (capitalParts.length > 0) p1Parts.push(capitalParts.join(", ") + ".");
  if (inputs.credits > 0) {
    p1Parts.push(`${formatCompactCurrency(inputs.credits)} in tax credits reduce the investor's cash exposure.`);
  }
  if (inputs.deferments > 0) {
    p1Parts.push(`${formatCompactCurrency(inputs.deferments)} in deferred fees are subordinate to all capital tiers.`);
  }
  if (inputs.credits === 0 && inputs.deferments === 0) {
    p1Parts.push("No tax credits or deferrals reduce the investor's exposure.");
  }

  // Paragraph 2 — Off-the-top erosion
  const offTopPct = inputs.revenue > 0 ? Math.round((offTopTotal / inputs.revenue) * 100) : 0;
  let p2 = `Off-the-top deductions total ${formatCompactCurrency(offTopTotal)} — roughly ${offTopPct}% of gross receipts.`;
  if (inputs.salesFee > 0) p2 += ` The sales agent's ${inputs.salesFee}% commission accounts for ${formatCompactCurrency(salesFeeAmount)}.`;
  if (inputs.salesExp > 0) p2 += ` The expense cap is ${formatCompactCurrency(inputs.salesExp)}.`;
  if (inputs.salesExp > 100000) {
    p2 += " That expense cap warrants scrutiny.";
  } else if (inputs.salesExp > 0) {
    p2 += " Reasonable for a film this size.";
  }

  // Paragraph 3 — Waterfall flow-through
  let p3 = `After deductions, ${formatCompactCurrency(netDistributable)} enters the waterfall. `;
  const fundedTiers = tiers.filter(t => t.status === "funded");
  const partialTier = tiers.find(t => t.status === "partial");
  if (fundedTiers.length === tiers.length) {
    p3 += `All ${tiers.length} capital tiers are fully funded.`;
    if (backendPool > 0) {
      p3 += ` A surplus of ${formatCompactCurrency(backendPool)} flows into the backend pool.`;
    }
  } else if (partialTier) {
    p3 += `Revenue exhausts during the ${partialTier.label} tier — investors recover ${Math.round((partialTier.paid / partialTier.amount) * 100)}% of that obligation. Downstream tiers are unfunded.`;
  } else {
    p3 += "Revenue does not fully fund any capital tier at this acquisition price.";
  }

  // Paragraph 4 — Margin analysis
  const floorPrice = inputs.revenue * 0.875;
  const distressedPrice = inputs.revenue * 0.46875;
  const floorScenario = computeScenarioReturn(inputs, guilds, floorPrice);
  const distressedScenario = computeScenarioReturn(inputs, guilds, distressedPrice);
  let p4 = `At the modeled price, investors see a ${multiple.toFixed(1)}x cash-on-cash multiple. `;
  if (floorScenario.returnPct >= 100) {
    p4 += `Even at the ${formatCompactCurrency(floorPrice)} floor — a 12.5% haircut — investors recoup principal and earn a modest return. `;
  } else {
    p4 += `At the ${formatCompactCurrency(floorPrice)} floor — a 12.5% haircut — investors lose ${Math.round(100 - floorScenario.returnPct)}% of principal. `;
  }
  if (distressedScenario.returnPct < 100) {
    p4 += `In a distressed scenario at ${formatCompactCurrency(distressedPrice)}, recovery drops to ${Math.round(distressedScenario.returnPct)}%.`;
  }

  // Paragraph 5 — Structural risk
  const risks: string[] = [];
  if (inputs.credits === 0) risks.push("Without tax credits, the cash basis has no cushion.");
  if (inputs.credits > 0 && inputs.budget > 0) {
    const creditConc = Math.round((inputs.credits / inputs.budget) * 100);
    if (creditConc > 25) risks.push(`${creditConc}% of financing depends on ${project.location.trim() || "your state"}'s incentive program.`);
  }
  if (inputs.deferments === 0) risks.push("No deferred fees to reduce cash exposure.");
  if (inputs.salesFee > 15) risks.push(`The agent's ${inputs.salesFee}% take is above market.`);
  if (inputs.salesExp > 100000) risks.push("The expense cap warrants negotiation.");
  if (floorScenario.returnPct < 100) risks.push("The margin between profit and loss is thin.");
  const p5 = risks.length > 0 ? risks.slice(0, 2).join(" ") : "No outsized structural risks at this configuration.";

  // Paragraph 6 — Verdict
  let characterization: string;
  let verdict: string;
  if (multiple >= 1.5) {
    characterization = "a clean deal";
    verdict = "this model works";
  } else if (multiple >= 1.0) {
    characterization = "a tight deal";
    verdict = "this model holds if assumptions survive";
  } else if (multiple >= 0.7) {
    characterization = "an aggressive deal";
    verdict = "this model needs restructuring";
  } else {
    characterization = "a deal that needs work";
    verdict = "this model needs restructuring";
  }
  const p6 = `For what it is — ${characterization} — ${verdict}.`;

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
    borderColor = "rgba(224,82,82,0.40)";
  } else {
    verdictText = "REVENUE DOES NOT FULLY FUND ANY TIER.";
    borderColor = "rgba(224,82,82,0.40)";
  }

  return (
    <section style={{ padding: "48px 24px 56px" }}>
      {/* Provenance mark */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "28px",
      }}>
        <div style={{
          width: "10px",
          height: "10px",
          border: "1.5px solid rgba(212,175,55,0.45)",
          borderRadius: "50%",
          boxShadow: "0 0 8px rgba(212,175,55,0.15)",
        }} />
        <span style={{
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase" as const,
          color: "rgba(212,175,55,0.50)",
        }}>Generated by filmmaker.og</span>
        <div style={{
          flex: 1,
          height: "1px",
          background: "linear-gradient(90deg, rgba(212,175,55,0.20), transparent)",
        }} />
      </div>

      {/* Label */}
      <div style={{ ...FONT.label, color: G.standard, marginBottom: "24px" }}>Deal Summary</div>

      {/* Headline */}
      <div style={{ ...FONT.display, color: W.primary, marginBottom: "32px" }}>THE DEAL</div>

      {/* Prose */}
      <div style={{ ...FONT.body, color: W.secondary }}>
        <p style={{ marginBottom: "20px" }}>{p1Parts.join(" ")}</p>
        <p style={{ marginBottom: "20px" }}>{p2}</p>
        <p style={{ marginBottom: "20px" }}>{p3}</p>
      </div>

      {/* Pull-quote */}
      <div style={{
        borderLeft: `3px solid ${borderColor}`,
        paddingLeft: "20px",
        margin: "32px 0",
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "22px",
          letterSpacing: "0.06em",
          lineHeight: 1.2,
          color: W.primary,
        }}>
          {verdictText}
        </div>
      </div>

      {/* More prose */}
      <div style={{ ...FONT.body, color: W.secondary }}>
        <p style={{ marginBottom: "20px" }}>{p4}</p>
        <p style={{ marginBottom: "20px" }}>{p5}</p>
        <p style={{ marginBottom: "0" }}>{p6}</p>
      </div>
    </section>
  );
};

// ─── SECTION 3: REALITY CHECK 1 ─────────────────────────────────

const RealityCheck1Section = ({
  inputs, result, guilds, project,
}: {
  inputs: WaterfallInputs;
  result: WaterfallResult;
  guilds: GuildState;
  project: ProjectDetails;
}) => {
  const cashBasis = computeCashBasis(inputs);
  const cashBasisPct = inputs.budget > 0 ? (cashBasis / inputs.budget) * 100 : 100;
  const netDistributable = Math.max(0, inputs.revenue - result.offTopTotal);
  const investorReturnPct = computeInvestorReturnPct(result, inputs);

  // Erosion items
  const erosionItems: { label: string; amount: number; colorOpacity: number }[] = [];
  if (result.cam > 0) erosionItems.push({ label: "CAM Fee", amount: result.cam, colorOpacity: 0.20 });
  if (result.salesFee > 0) erosionItems.push({ label: "Sales Agent Commission", amount: result.salesFee, colorOpacity: 0.35 });
  if (result.marketing > 0) erosionItems.push({ label: "Sales Agent Expenses", amount: result.marketing, colorOpacity: 0.50 });
  if (result.guilds > 0) erosionItems.push({ label: "Guild Reserves", amount: result.guilds, colorOpacity: 0.65 });

  const erosionTotal = erosionItems.reduce((sum, item) => sum + item.amount, 0);

  // Thesis prose
  const location = project.location.trim();
  const creditPct = inputs.budget > 0 ? Math.round((inputs.credits / inputs.budget) * 100) : 0;
  const hasCreditAndDeferral = inputs.credits > 0 && inputs.deferments > 0;
  const hasCreditOnly = inputs.credits > 0 && inputs.deferments === 0;
  const hasDeferralOnly = inputs.credits === 0 && inputs.deferments > 0;

  let thesisProse: React.ReactNode;
  if (hasCreditAndDeferral) {
    thesisProse = (
      <p style={{ marginBottom: "20px" }}>
        Your film budgets at <Num>{formatCompactCurrency(inputs.budget)}</Num> but the number that matters
        is <Num>{formatCompactCurrency(cashBasis)}</Num> — your cash basis
        after {location || "your state"}&rsquo;s <Num>{creditPct}%</Num> transferable credit
        and <Num>{formatCompactCurrency(inputs.deferments)}</Num> in deferred fees.
        That gap is the entire financial thesis. Every dollar between what you spend in cash and what the
        market pays for the finished asset is where investor profit lives.
      </p>
    );
  } else if (hasCreditOnly) {
    thesisProse = (
      <p style={{ marginBottom: "20px" }}>
        Your film budgets at <Num>{formatCompactCurrency(inputs.budget)}</Num> but the number that matters
        is <Num>{formatCompactCurrency(cashBasis)}</Num> — your cash basis
        after {location || "your state"}&rsquo;s <Num>{creditPct}%</Num> transferable credit.
        That gap is the entire financial thesis. Every dollar between what you spend in cash and what the
        market pays for the finished asset is where investor profit lives.
      </p>
    );
  } else if (hasDeferralOnly) {
    thesisProse = (
      <p style={{ marginBottom: "20px" }}>
        Your film budgets at <Num>{formatCompactCurrency(inputs.budget)}</Num> but the number that matters
        is <Num>{formatCompactCurrency(cashBasis)}</Num> — your cash basis
        after <Num>{formatCompactCurrency(inputs.deferments)}</Num> in deferred fees.
        Deferments reduce your immediate cash obligation without adding a repayment tier ahead of investors.
      </p>
    );
  } else {
    thesisProse = (
      <p style={{ marginBottom: "20px" }}>
        Your film budgets at <Num>{formatCompactCurrency(inputs.budget)}</Num> — that is also your full
        cash basis with no credits or deferrals applied. Every dollar of that budget must be recouped from
        market revenue before anyone sees profit.
      </p>
    );
  }

  // Erosion prose
  const biggestErosion = erosionItems.length > 0
    ? erosionItems.reduce((max, item) => item.amount > max.amount ? item : max, erosionItems[0])
    : null;
  const expenseCap = inputs.salesExp;
  const expenseAssessment = expenseCap > 100000 ? "a red flag" : "reasonable";

  // Net result
  const netColor = investorReturnPct >= 100 ? SEM.green : investorReturnPct >= 80 ? SEM.amber : SEM.red;

  return (
    <section style={{ padding: "48px 24px 56px" }}>
      {/* 2a. Section Label */}
      <div style={{ ...FONT.label, color: G.standard, marginBottom: "24px" }}>The Erosion</div>

      {/* 2b. Headline */}
      <div style={{ ...FONT.display, color: W.primary, marginBottom: "32px" }}>
        THE EROSION
      </div>

      {/* 2c. Cash Basis Card */}
      <div style={{
        padding: "20px",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "4px",
        marginBottom: "32px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <span style={{ fontSize: "13px", fontWeight: 500, color: W.tertiary }}>Production Budget</span>
          <span style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "22px",
            fontWeight: 500,
            color: W.primary,
          }}>
            {formatCompactCurrency(inputs.budget)}
          </span>
        </div>
        {/* Bar track */}
        <div style={{
          height: "6px",
          background: "rgba(255,255,255,0.06)",
          borderRadius: "3px",
          margin: "8px 0 14px",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: "100%",
            borderRadius: "3px",
            background: "rgba(255,255,255,0.12)",
          }} />
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${Math.min(100, cashBasisPct)}%`,
            borderRadius: "3px",
            background: G.standard,
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "13px", fontWeight: 500, color: W.tertiary }}>Cash Basis</span>
          <span style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "22px",
            fontWeight: 500,
            color: G.emphasis,
          }}>
            {formatCompactCurrency(cashBasis)}
          </span>
        </div>
        {/* Legend */}
        <div style={{ display: "flex", gap: "16px", marginTop: "2px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", ...FONT.label, fontSize: "11px", color: W.quaternary, letterSpacing: "0.10em" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
            Budget
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", ...FONT.label, fontSize: "11px", color: W.quaternary, letterSpacing: "0.10em" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: G.standard }} />
            After Credits + Deferrals
          </div>
        </div>
      </div>

      {/* 2d. Thesis Prose */}
      <div style={{ ...FONT.body, color: W.secondary }}>
        {thesisProse}
      </div>

      {/* 2e. Separator */}
      <GoldSeparator />

      {/* 2f. Erosion Card */}
      {erosionTotal > 0 && (
        <div style={{
          padding: "20px",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "4px",
        }}>
          <div style={{
            ...FONT.label,
            fontSize: "11px",
            letterSpacing: "0.15em",
            color: W.quaternary,
            marginBottom: "14px",
          }}>
            OFF-THE-TOP EROSION
          </div>
          {/* Hero row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px" }}>
            <span style={{ fontSize: "14px", color: W.tertiary }}>Gone before recoupment</span>
            <span style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "28px",
              fontWeight: 500,
              color: "rgba(224,82,82,0.85)",
            }}>
              &minus;{formatCompactCurrency(erosionTotal)}
            </span>
          </div>
          {/* Stacked bar */}
          <div style={{
            height: "28px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: "4px",
            display: "flex",
            overflow: "hidden",
            marginBottom: "16px",
          }}>
            {erosionItems.map((item) => {
              const widthPct = erosionTotal > 0 ? (item.amount / erosionTotal) * 100 : 0;
              const widthPx = widthPct; // approximate
              return (
                <div
                  key={item.label}
                  style={{
                    width: `${widthPct}%`,
                    height: "100%",
                    background: `rgba(224,82,82,${item.colorOpacity})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "10px",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.70)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {/* Only label segments > ~40px wide. At 430px max, 40px ≈ 9.3% */}
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
                  <span style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "2px",
                    flexShrink: 0,
                    background: `rgba(224,82,82,${item.colorOpacity})`,
                  }} />
                  {item.label}
                </span>
                <span style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: W.secondary,
                }}>
                  {formatCompactCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2g. Erosion Prose */}
      {biggestErosion && (
        <div style={{ ...FONT.body, color: W.secondary, marginTop: "20px" }}>
          <p style={{ marginBottom: "20px" }}>
            The first <Num>{formatCompactCurrency(erosionTotal)}</Num> of
            your <Num>{formatCompactCurrency(inputs.revenue)}</Num> never reaches the production entity.
            {biggestErosion.label === "Sales Agent Commission" && inputs.salesFee > 0 && (
              <> Your sales agent&rsquo;s <Num>{inputs.salesFee}%</Num> commission is the biggest line
              item. At this budget level, the agent is the right call. Where producers get burned
              isn&rsquo;t the rate — it&rsquo;s the expense cap. <Num>{formatCompactCurrency(expenseCap)}</Num> is {expenseAssessment}
              {expenseCap > 100000 ? " for a film this size." : "."}</>
            )}
          </p>
        </div>
      )}

      {/* 2h. Net Strip */}
      {(() => {
        const netBg = netColor === SEM.green
          ? "rgba(60,179,113,0.06)"
          : netColor === SEM.amber
          ? "rgba(240,168,48,0.06)"
          : "rgba(224,82,82,0.06)";
        const netBorder = netColor === SEM.green
          ? "rgba(60,179,113,0.20)"
          : netColor === SEM.amber
          ? "rgba(240,168,48,0.20)"
          : "rgba(224,82,82,0.20)";
        return (
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 20px",
            background: netBg,
            border: `1px solid ${netBorder}`,
            borderRadius: "4px",
            margin: "28px 0",
          }}>
            <span style={{ fontSize: "14px", color: W.tertiary }}>Net to Investors</span>
            <span style={{ ...FONT.data, fontSize: "22px", color: netColor }}>
              {formatCompactCurrency(netDistributable)}
            </span>
          </div>
        );
      })()}

      {/* 2i. Result Prose */}
      <div style={{ ...FONT.body, color: W.secondary }}>
        <p>
          <Num>{formatCompactCurrency(netDistributable)}</Num> in net receipts
          against <Num>{formatCompactCurrency(cashBasis)}</Num> in investor principal.{" "}
          <span style={{
            color: investorReturnPct >= 100 ? SEM.green : investorReturnPct >= 80 ? SEM.amber : SEM.red,
            fontWeight: 500,
          }}>
            Investors recoup at {Math.round(investorReturnPct)}% — a {result.multiple.toFixed(1)}&times; cash-on-cash multiple.
          </span>
          {inputs.budget > 0 && inputs.budget <= 5000000 && (
            <> Strong for a sub-<Num>{formatCompactCurrency(Math.ceil(inputs.budget / 1000000) * 1000000)}</Num> production.</>
          )}
        </p>
      </div>
    </section>
  );
};

// ─── SECTION 3: LOCKED TEASER — SENSITIVITY ──────────────────────

const LockedSensitivitySection = () => (
  <section style={{ padding: "48px 24px 48px" }}>
    {/* Label — content-descriptive, not "Premium Analysis" */}
    <div style={{ ...FONT.label, color: G.floor, marginBottom: "24px" }}>Scenario Modeling</div>

    {/* Headline — reads like the next section */}
    <div style={{ ...FONT.title, color: W.quaternary, marginBottom: "24px" }}>
      WHAT IF YOUR PRICE MOVES
    </div>

    {/* Locked card */}
    <div style={{
      position: "relative",
      border: "1px solid rgba(212,175,55,0.10)",
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
          <div style={{ flex: 1, height: "25%", borderRadius: "3px 3px 0 0", background: "rgba(224,82,82,0.25)" }} />
          <div style={{ flex: 1, height: "15%", borderRadius: "3px 3px 0 0", background: "rgba(224,82,82,0.35)" }} />
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
        background: "radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, rgba(0,0,0,0.50) 70%)",
      }}>
        <div style={{
          width: "44px", height: "44px",
          border: `1.5px solid ${G.subtle}`,
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "14px",
          boxShadow: "0 0 16px rgba(212,175,55,0.12)",
        }}>
          <svg viewBox="0 0 24 24" style={{ width: "18px", height: "18px", fill: G.standard }}>
            <path d="M18 10h-1V7c0-2.76-2.24-5-5-5S7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-9H9V7c0-1.66 1.34-3 3-3s3 1.34 3 3v3z" />
          </svg>
        </div>
        <span style={{
          fontSize: "12px", fontWeight: 600,
          letterSpacing: "0.15em", textTransform: "uppercase" as const,
          color: G.standard,
        }}>
          Included in Full Analysis
        </span>
      </div>
    </div>
  </section>
);

// ─── SECTION 4: REALITY CHECK 2 ─────────────────────────────────

const RealityCheck2Section = ({
  inputs, result, guilds, project,
}: {
  inputs: WaterfallInputs;
  result: WaterfallResult;
  guilds: GuildState;
  project: ProjectDetails;
}) => {
  // Count load-bearing assumptions
  const assumptions: string[] = [];
  if (inputs.revenue > 0) assumptions.push("market valuation");
  if (inputs.deferments > 0) assumptions.push("deferments");
  if (inputs.credits > 0) assumptions.push("tax credit");
  if (inputs.salesFee > 0) assumptions.push("agent terms");
  if (inputs.equity > 0) assumptions.push("equity premium");
  const assumptionCount = assumptions.length;

  const location = project.location.trim();
  const creditPct = inputs.budget > 0 ? Math.round((inputs.credits / inputs.budget) * 100) : 0;
  const creditConcentration = inputs.budget > 0 ? (inputs.credits / inputs.budget) * 100 : 0;

  // Scenario table
  const modeledPrice = inputs.revenue;
  const floorPrice = modeledPrice * 0.875;
  const weakPrice = modeledPrice * 0.6875;
  const distressedPrice = modeledPrice * 0.46875;

  const scenarios = [
    { price: modeledPrice, label: formatCompactCurrency(modeledPrice), sub: "modeled", haircut: "0%" },
    { price: floorPrice, label: formatCompactCurrency(floorPrice), sub: "floor", haircut: "12.5%" },
    { price: weakPrice, label: formatCompactCurrency(weakPrice), sub: "weak comps", haircut: "31.25%" },
    { price: distressedPrice, label: formatCompactCurrency(distressedPrice), sub: "distressed", haircut: "53%" },
  ].map((s) => {
    const { returnPct, multiple } = computeScenarioReturn(inputs, guilds, s.price);
    const color = returnPct > 100 ? SEM.green : returnPct > 50 ? SEM.amber : SEM.red;
    return { ...s, returnPct, multiple, color };
  });

  // Cash basis and margin
  const cashBasis = computeCashBasis(inputs);
  const marginOfSafety = inputs.revenue - cashBasis;
  const floorReturn = scenarios[1];

  return (
    <section style={{ padding: "48px 24px 56px" }}>
      {/* 4a */}
      <div style={{ ...FONT.label, color: G.standard, marginBottom: "24px" }}>The Risk</div>

      {/* 4b */}
      <div style={{ ...FONT.display, color: W.primary, marginBottom: "24px" }}>THE RISK</div>

      {/* 4c. Opening Prose */}
      <div style={{ ...FONT.body, color: W.secondary, marginBottom: "24px" }}>
        <p>
          This model holds if {assumptionCount} assumption{assumptionCount !== 1 ? "s" : ""} survive
          production{assumptions.length > 0 ? `: your ${assumptions.slice(0, 2).join(" and your ")}` : ""}.
          Both are real — and both can collapse.
        </p>
      </div>

      {/* 4d. Concentration Gauge */}
      {inputs.credits > 0 && (
        <div style={{
          margin: "24px 0",
          padding: "20px",
          border: "1px solid rgba(224,82,82,0.15)",
          borderRadius: "4px",
          background: "rgba(224,82,82,0.03)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
            <span style={{
              ...FONT.label,
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: "rgba(224,82,82,0.70)",
            }}>
              TAX CREDIT CONCENTRATION
            </span>
            <span style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "28px",
              fontWeight: 500,
              color: "rgba(224,82,82,0.85)",
            }}>
              {Math.round(creditConcentration)}%
            </span>
          </div>
          <div style={{
            height: "8px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "4px",
            overflow: "hidden",
            marginBottom: "10px",
          }}>
            <div style={{
              height: "100%",
              width: `${Math.min(100, creditConcentration)}%`,
              background: "linear-gradient(90deg, rgba(224,82,82,0.50), rgba(224,82,82,0.80))",
              borderRadius: "4px",
            }} />
          </div>
          <div style={{ fontSize: "13px", color: W.tertiary, lineHeight: 1.5 }}>
            of your financing depends on {location || "your state"}&rsquo;s incentive program.
          </div>
        </div>
      )}

      {/* 4e. Tax Credit Prose */}
      {inputs.credits > 0 && (
        <div style={{ ...FONT.body, color: W.secondary }}>
          <p style={{ marginBottom: "20px" }}>
            {location || "Your state"}&rsquo;s <Num>{creditPct}%</Num> credit
            converts <Num>{formatCompactCurrency(inputs.credits)}</Num> in qualified spend into
            transferable credits. Remove it and your cash basis jumps
            to <Num>{formatCompactCurrency(inputs.budget - inputs.deferments)}</Num>,
            compressing the margin that makes this deal work.
          </p>
        </div>
      )}

      {/* 4f. Separator */}
      <GoldSeparator />

      {/* 4g. Scenario Table */}
      {inputs.revenue > 0 && (
        <div style={{
          margin: "24px 0",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "4px",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "12px 20px",
            background: "rgba(255,255,255,0.04)",
            ...FONT.label,
            fontSize: "11px",
            letterSpacing: "0.15em",
            color: W.quaternary,
          }}>
            IF YOUR ACQUISITION PRICE DROPS
          </div>
          {/* Col labels */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px", padding: "10px 20px 0" }}>
            <span style={{ ...FONT.fine, fontSize: "10px", letterSpacing: "0.10em", color: W.ghost, textAlign: "right", minWidth: "56px" }}>RETURN</span>
            <span style={{ ...FONT.fine, fontSize: "10px", letterSpacing: "0.10em", color: W.ghost, textAlign: "right", minWidth: "56px" }}>MULTIPLE</span>
          </div>
          {/* Rows */}
          <div style={{ padding: "0 20px" }}>
            {scenarios.map((s, i) => (
              <div key={s.sub} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: i < scenarios.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                borderLeft: i === 0 ? "3px solid rgba(212,175,55,0.40)" : "none",
                paddingLeft: i === 0 ? "17px" : "0",
              }}>
                <div>
                  <span style={{ fontSize: "14px", color: W.tertiary }}>{s.label} </span>
                  <span style={{ color: W.ghost, fontSize: "11px" }}>{s.sub}</span>
                </div>
                <div style={{ display: "flex", gap: "20px" }}>
                  <span style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "15px",
                    fontWeight: 500,
                    textAlign: "right",
                    minWidth: "56px",
                    color: s.color,
                  }}>
                    {Math.round(s.returnPct)}%
                  </span>
                  <span style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "15px",
                    fontWeight: 500,
                    textAlign: "right",
                    minWidth: "56px",
                    color: s.color,
                  }}>
                    {s.multiple.toFixed(1)}&times;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4h. Valuation Prose */}
      <div style={{ ...FONT.body, color: W.secondary, marginTop: "20px" }}>
        <p style={{ marginBottom: "20px" }}>
          Your <Num>{formatCompactCurrency(inputs.revenue)}</Num> valuation is pegged to comparable
          titles in the current acquisition market. Drop to
          the <Num>{formatCompactCurrency(distressedPrice)}</Num>–<Num>{formatCompactCurrency(weakPrice)}</Num> bracket
          and your investors go from <span style={{ color: SEM.green, fontWeight: 500 }}>profit</span> to{" "}
          <span style={{ color: SEM.red, fontWeight: 500 }}>principal loss</span>.
        </p>
      </div>

      {/* 4i. Separator */}
      <GoldSeparator />

      {/* 4j. Deferment Prose */}
      {inputs.deferments > 0 && (
        <div style={{ ...FONT.body, color: W.secondary }}>
          <p style={{ marginBottom: "20px" }}>
            &ldquo;Deferred&rdquo; means different things to different lawyers.{" "}
            <Num>{formatCompactCurrency(inputs.deferments)}</Num> in producer fees pushed past
            first-day-of-principal doesn&rsquo;t save your investors anything if the production entity pays
            them from first revenues. If those fees accelerate on delivery rather than on recoupment,
            they&rsquo;re debt by another name and your cash basis is fiction.
          </p>
        </div>
      )}

      {/* 4k. Margin of Safety */}
      {marginOfSafety > 0 && (
        <div style={{
          background: "rgba(60,179,113,0.06)",
          borderLeft: "3px solid rgba(60,179,113,0.50)",
          padding: "16px 20px",
          borderRadius: "0 4px 4px 0",
          marginTop: "24px",
        }}>
          <div style={{
            ...FONT.label,
            fontSize: "11px",
            letterSpacing: "0.15em",
            color: "rgba(60,179,113,0.70)",
            marginBottom: "6px",
          }}>
            MARGIN OF SAFETY
          </div>
          <div style={{ fontSize: "14px", color: W.secondary, lineHeight: 1.6 }}>
            Cash basis of {formatCompactCurrency(cashBasis)} against
            a {formatCompactCurrency(inputs.revenue)} ceiling
            gives you {formatCompactCurrency(marginOfSafety)} of room.
            {floorReturn && floorReturn.returnPct >= 100 && (
              <> Even at the {formatCompactCurrency(floorPrice)} floor, investors recoup principal plus a modest return.</>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

// ─── SECTION 5: FULL VISUAL — DEDUCTIONS ─────────────────────────

const DeductionsSection = ({
  inputs, result, guilds,
}: {
  inputs: WaterfallInputs;
  result: WaterfallResult;
  guilds: GuildState;
}) => {
  const netDistributable = Math.max(0, inputs.revenue - result.offTopTotal);
  const netPct = inputs.revenue > 0 ? (netDistributable / inputs.revenue) * 100 : 0;

  // Build ledger rows
  const rows: { label: string; rate: string; amount: number; isGross?: boolean; isTotal?: boolean }[] = [];
  rows.push({ label: "Gross Receipts", rate: "", amount: inputs.revenue, isGross: true });
  if (result.cam > 0) rows.push({ label: "CAM Fee", rate: `${(CAM_PCT * 100).toFixed(1)}%`, amount: result.cam });
  if (result.salesFee > 0) rows.push({ label: "Sales Commission", rate: `blended ${inputs.salesFee}%`, amount: result.salesFee });
  if (result.marketing > 0) rows.push({ label: "Sales Agent Expenses", rate: "capped", amount: result.marketing });
  if (result.guilds > 0) {
    const parts: string[] = [];
    if (guilds.sag) parts.push("SAG");
    if (guilds.wga) parts.push("WGA");
    if (guilds.dga) parts.push("DGA");
    rows.push({ label: "Guild Reserves", rate: parts.join("+"), amount: result.guilds });
  }

  return (
    <section style={{ padding: "48px 24px 56px" }}>
      {/* 5a */}
      <div style={{ ...FONT.label, color: G.standard, marginBottom: "24px" }}>The Deductions</div>

      {/* 5b */}
      <div style={{ ...FONT.display, color: W.primary, marginBottom: "8px" }}>THE DEDUCTIONS</div>

      {/* 5c */}
      <div style={{ fontSize: "14px", color: W.quaternary, marginBottom: "28px" }}>
        Every deduction between acquisition price and investor payout
      </div>

      {/* 5d. Ledger */}
      <div style={{
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "4px",
        overflow: "hidden",
        marginBottom: "24px",
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "rgba(255,255,255,0.04)",
          ...FONT.fine,
          fontSize: "10px",
          letterSpacing: "0.15em",
          color: W.ghost,
        }}>
          <span>DEDUCTION</span>
          <span>AMOUNT</span>
        </div>
        {/* Rows */}
        {rows.map((row) => (
          <div key={row.label} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 16px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ fontSize: "14px", color: W.tertiary }}>
              {row.label}
              {row.rate && (
                <span style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: "13px",
                  color: W.quaternary,
                  marginLeft: "6px",
                }}>
                  {row.rate}
                </span>
              )}
            </div>
            <span style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "15px",
              fontWeight: 500,
              color: row.isGross ? W.primary : "rgba(224,82,82,0.75)",
            }}>
              {row.isGross ? formatFullCurrency(row.amount) : `\u2212${formatFullCurrency(row.amount)}`}
            </span>
          </div>
        ))}
        {/* Total */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 16px",
          borderTop: "2px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.03)",
        }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: W.secondary }}>Net Distributable</span>
          <span style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "18px",
            fontWeight: 500,
            color: SEM.green,
          }}>
            {formatFullCurrency(netDistributable)}
          </span>
        </div>
      </div>

      {/* 5e. Gross-to-Net Bar */}
      <div style={{ margin: "24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ ...FONT.label, fontSize: "11px", color: W.quaternary, letterSpacing: "0.10em" }}>GROSS</span>
          <span style={{ ...FONT.label, fontSize: "11px", color: W.quaternary, letterSpacing: "0.10em" }}>NET</span>
        </div>
        <div style={{
          height: "12px",
          background: "rgba(255,255,255,0.06)",
          borderRadius: "6px",
          overflow: "hidden",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: "100%",
            borderRadius: "6px",
            background: "rgba(255,255,255,0.08)",
          }} />
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${Math.min(100, netPct)}%`,
            borderRadius: "6px",
            background: "rgba(60,179,113,0.40)",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
          <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "14px", fontWeight: 500, color: W.quaternary }}>
            {formatCompactCurrency(inputs.revenue)}
          </span>
          <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "14px", fontWeight: 500, color: SEM.green }}>
            {formatCompactCurrency(netDistributable)}
          </span>
        </div>
      </div>
    </section>
  );
};

// ─── SECTION 6: FULL VISUAL — CASCADE ────────────────────────────

const CascadeSection = ({
  tiers, result, inputs,
}: {
  tiers: TierPayment[];
  result: WaterfallResult;
  inputs: WaterfallInputs;
}) => {
  const netDistributable = Math.max(0, inputs.revenue - result.offTopTotal);

  // Build cascade data: Senior Debt → Equity → Deferred → Backend
  // Use tiers from computeTierPayments + add backend
  const backendPool = result.profitPool;

  const cascadeTiers = [
    ...tiers,
    ...(backendPool > 0 ? [{
      phase: tiers.length + 1,
      label: "Backend Pool",
      amount: backendPool,
      paid: backendPool,
      status: "partial" as const,
    }] : []),
  ];

  return (
    <section style={{ padding: "48px 24px 56px" }}>
      {/* 6a */}
      <div style={{ ...FONT.label, color: G.standard, marginBottom: "24px" }}>The Cascade</div>

      {/* 6b */}
      <div style={{ ...FONT.display, color: W.primary, marginBottom: "8px" }}>THE CASCADE</div>

      {/* 6c */}
      <div style={{ fontSize: "14px", color: W.quaternary, marginBottom: "28px" }}>
        Net distributable: {formatFullCurrency(netDistributable)} flowing through the waterfall
      </div>

      {/* 6d. Cascade Tier Cards */}
      <div style={{
        margin: "24px 0",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        position: "relative",
        paddingLeft: "16px",
      }}>
        {/* Vertical connecting line — only render if 2+ tiers */}
        {cascadeTiers.length >= 2 && (
          <div style={{
            position: "absolute",
            left: "3px",
            top: "24px",
            bottom: "24px",
            width: "2px",
            background: "linear-gradient(180deg, rgba(212,175,55,0.30), rgba(212,175,55,0.15))",
            borderRadius: "1px",
          }} />
        )}

        {cascadeTiers.map((tier) => {
          const fillPct = netDistributable > 0 ? (tier.paid / netDistributable) * 100 : 0;
          const isFunded = tier.status === "funded";
          const isPartial = tier.status === "partial";
          const isBackend = tier.label === "Backend Pool";

          // Color scheme
          const borderColor = isFunded
            ? "rgba(60,179,113,0.15)"
            : isPartial || isBackend
            ? "rgba(212,175,55,0.15)"
            : "rgba(224,82,82,0.10)";
          const bgColor = isFunded
            ? "rgba(60,179,113,0.03)"
            : isPartial || isBackend
            ? "rgba(212,175,55,0.03)"
            : "rgba(224,82,82,0.02)";
          const dotColor = isFunded
            ? "#3CB371"
            : isPartial || isBackend
            ? "rgba(212,175,55,0.70)"
            : "rgba(224,82,82,0.50)";
          const dotBorder = isFunded
            ? "rgba(60,179,113,0.70)"
            : isPartial || isBackend
            ? "rgba(212,175,55,0.70)"
            : "rgba(224,82,82,0.50)";
          const dotGlow = isFunded ? "0 0 6px rgba(60,179,113,0.30)" : "none";
          const barGradient = isFunded
            ? "linear-gradient(90deg, rgba(60,179,113,0.25), rgba(60,179,113,0.45))"
            : isPartial || isBackend
            ? "linear-gradient(90deg, rgba(212,175,55,0.20), rgba(212,175,55,0.40))"
            : "linear-gradient(90deg, rgba(224,82,82,0.15), rgba(224,82,82,0.30))";
          const valueColor = isFunded ? SEM.green : isPartial || isBackend ? G.emphasis : SEM.red;

          const badgeStyle: React.CSSProperties = isFunded
            ? { background: "rgba(60,179,113,0.15)", color: SEM.green }
            : isPartial
            ? { background: "rgba(240,168,48,0.20)", color: SEM.amber }
            : isBackend
            ? { background: "rgba(212,175,55,0.12)", color: G.emphasis }
            : { background: "rgba(224,82,82,0.15)", color: "rgba(224,82,82,0.70)" };
          const badgeText = isFunded ? "FUNDED" : isPartial ? "PARTIAL" : isBackend ? "SURPLUS" : "ZERO";

          // Display label
          const displayLabel = tier.label === "Equity + Premium" && inputs.premium > 0
            ? `Equity (${100 + inputs.premium}%)`
            : tier.label === "Deferments"
            ? "Deferred Fees"
            : tier.label;

          return (
            <div key={tier.label} style={{ position: "relative" }}>
              {/* Node dot on connecting line */}
              {cascadeTiers.length >= 2 && (
                <div style={{
                  position: "absolute",
                  left: "-16px",
                  top: "20px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: dotColor,
                  border: `1.5px solid ${dotBorder}`,
                  boxShadow: dotGlow,
                }} />
              )}

              {/* Tier card */}
              <div style={{
                padding: "16px",
                border: `1px solid ${borderColor}`,
                borderRadius: "6px",
                background: bgColor,
              }}>
                {/* Row 1: label + badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "6px", height: "6px", borderRadius: "50%",
                      background: dotColor, boxShadow: dotGlow,
                    }} />
                    <span style={{ fontSize: "13px", fontWeight: 500, color: W.secondary }}>
                      {displayLabel}
                    </span>
                  </div>
                  <span style={{
                    fontSize: "9px", fontWeight: 700, letterSpacing: "0.10em",
                    textTransform: "uppercase" as const, padding: "3px 8px", borderRadius: "3px",
                    ...badgeStyle,
                  }}>{badgeText}</span>
                </div>

                {/* Row 2: fill bar */}
                <div style={{ height: "8px", background: "rgba(255,255,255,0.04)", borderRadius: "4px", overflow: "hidden", marginBottom: "8px" }}>
                  {fillPct > 0 && (
                    <div style={{
                      height: "100%",
                      width: `${Math.min(100, fillPct)}%`,
                      borderRadius: "4px",
                      background: barGradient,
                    }} />
                  )}
                </div>

                {/* Row 3: amounts */}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ ...FONT.data, fontSize: "13px", color: W.tertiary }}>
                    {formatCompactCurrency(tier.paid)}{tier.amount > 0 ? ` / ${formatCompactCurrency(tier.amount)}` : ""}
                  </span>
                  <span style={{ ...FONT.data, fontSize: "13px", color: valueColor }}>
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
          <span style={{ ...FONT.fine, color: W.ghost }}>
            {tiers.every(t => t.status === "funded") ? "ALL TIERS FUNDED" : "PARTIAL FUNDING"}
          </span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(255,255,255,0.08), transparent)" }} />
        </div>
      </div>

      {/* 6e. Cascade Prose */}
      <div style={{ ...FONT.body, color: W.secondary }}>
        <p>
          {(() => {
            const fundedTiers = tiers.filter((t) => t.status === "funded");
            const allFunded = fundedTiers.length === tiers.length;
            if (allFunded && backendPool > 0) {
              const investorBackend = Math.round(backendPool * 0.5);
              const producerBackend = Math.round(backendPool * 0.5);
              return (
                <>
                  Every tier above the line is fully funded. The backend pool — split per the operating agreement between
                  investors and producers — gets what&rsquo;s left: <Num>{formatCompactCurrency(backendPool)}</Num>.
                  Your equity partners collect <Num>{formatCompactCurrency(investorBackend)}</Num> on top of
                  their recoupment. Your creative team splits the other half.
                </>
              );
            }
            if (allFunded) {
              return <>All capital tiers are fully funded at the base case acquisition price. No backend surplus remains.</>;
            }
            const partialTier = tiers.find((t) => t.status === "partial");
            if (partialTier) {
              return (
                <>
                  Revenue exhausts during the {partialTier.label} tier — investors
                  recover {Math.round((partialTier.paid / partialTier.amount) * 100)}% of that
                  obligation. Downstream tiers are unfunded.
                </>
              );
            }
            return <>Revenue does not fully fund any capital tier at this acquisition price.</>;
          })()}
        </p>
      </div>
    </section>
  );
};

// ─── SECTION 5b: CAPITAL STACK ───────────────────────────────────

const CapitalStackSection = ({
  inputs, selections,
}: {
  inputs: WaterfallInputs;
  selections?: CapitalSelections;
}) => {
  const sources: { label: string; amount: number; detail: string; pctOfBudget: string; color: string }[] = [];

  if (inputs.debt > 0) sources.push({
    label: "Senior Debt",
    amount: inputs.debt,
    detail: `First position · ${inputs.seniorDebtRate}% interest`,
    pctOfBudget: `${Math.round((inputs.debt / inputs.budget) * 100)}% of budget`,
    color: "rgba(255,255,255,0.15)",
  });
  if (inputs.mezzanineDebt > 0) sources.push({
    label: "Mezzanine / Gap",
    amount: inputs.mezzanineDebt,
    detail: `Second position · ${inputs.mezzanineRate}% interest`,
    pctOfBudget: `${Math.round((inputs.mezzanineDebt / inputs.budget) * 100)}% of budget`,
    color: "rgba(240,168,48,0.30)",
  });
  if (inputs.equity > 0) sources.push({
    label: "Equity",
    amount: inputs.equity,
    detail: `${inputs.premium > 0 ? `${inputs.premium}% preferred return` : "Pari passu"}`,
    pctOfBudget: `${Math.round((inputs.equity / inputs.budget) * 100)}% of budget`,
    color: "rgba(212,175,55,0.40)",
  });
  if (inputs.credits > 0) sources.push({
    label: "Tax Credits",
    amount: inputs.credits,
    detail: "Non-dilutive",
    pctOfBudget: `${Math.round((inputs.credits / inputs.budget) * 100)}% of budget`,
    color: "rgba(60,179,113,0.30)",
  });
  if (inputs.deferments > 0) sources.push({
    label: "Deferrals",
    amount: inputs.deferments,
    detail: "Subordinate to all capital",
    pctOfBudget: `${Math.round((inputs.deferments / inputs.budget) * 100)}% of budget`,
    color: "rgba(255,255,255,0.10)",
  });

  if (sources.length === 0) return null;

  // Prose
  const debtTotal = inputs.debt + inputs.mezzanineDebt;
  const equityTotal = inputs.equity;
  const deRatio = equityTotal > 0 ? (debtTotal / equityTotal).toFixed(1) : "N/A";
  const complexity = sources.length <= 2 ? "clean structure" : sources.length === 3 ? "standard structure" : "layered structure";

  let prose = `${sources.length} capital source${sources.length > 1 ? "s" : ""} — a ${complexity}.`;
  if (debtTotal > 0 && equityTotal > 0) {
    prose += ` Debt-to-equity ratio of ${deRatio}:1.`;
  }
  if (inputs.debt > 0) {
    prose += " Senior debt holds first position in the recoupment waterfall.";
  }
  if (inputs.mezzanineDebt > 0) {
    prose += " Mezzanine sits behind senior debt but ahead of equity.";
  }

  return (
    <section style={{ padding: "48px 24px 56px" }}>
      {/* Label */}
      <div style={{ ...FONT.label, color: G.standard, marginBottom: "24px" }}>The Capital Stack</div>

      {/* Headline */}
      <div style={{ ...FONT.display, color: W.primary, marginBottom: "8px" }}>THE CAPITAL STACK</div>

      {/* Subtitle */}
      <div style={{ fontSize: "14px", color: W.quaternary, marginBottom: "28px" }}>
        Your financing structure and what each source costs
      </div>

      {/* Stack blocks */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        background: "rgba(255,255,255,0.06)",
        borderRadius: "4px",
        overflow: "hidden",
      }}>
        {sources.map((s) => (
          <div key={s.label} style={{ background: "#0A0A0A", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: s.color }} />
                <span style={{ fontSize: "14px", fontWeight: 500, color: W.secondary }}>{s.label}</span>
              </div>
              <span style={{ ...FONT.data, fontSize: "18px", color: W.primary }}>{formatCompactCurrency(s.amount)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: "20px" }}>
              <span style={{ fontSize: "12px", color: W.quaternary }}>{s.detail}</span>
              <span style={{ ...FONT.data, fontSize: "12px", color: W.quaternary }}>{s.pctOfBudget}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Stacked bar */}
      <div style={{ height: "24px", borderRadius: "4px", display: "flex", overflow: "hidden", margin: "24px 0" }}>
        {sources.map((s) => {
          const widthPct = inputs.budget > 0 ? (s.amount / inputs.budget) * 100 : 0;
          return (
            <div key={s.label} style={{
              width: `${widthPct}%`,
              height: "100%",
              background: s.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {widthPct > 15 && (
                <span style={{ ...FONT.data, fontSize: "10px", color: W.secondary, letterSpacing: "0.08em" }}>
                  {s.label.split(" ")[0].toUpperCase()}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Prose */}
      <div style={{ ...FONT.body, color: W.secondary }}>
        <p>{prose}</p>
      </div>
    </section>
  );
};

// ─── SECTION 8: LOCKED COMPARABLE (Gate 2) ──────────────────────

const LockedComparableSection = () => (
  <section style={{ padding: "36px 24px" }}>
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "20px",
      border: "1px solid rgba(212,175,55,0.15)",
      borderRadius: "4px",
      background: "rgba(212,175,55,0.02)",
    }}>
      <div style={{
        width: "36px", height: "36px", flexShrink: 0,
        border: "1.5px solid rgba(212,175,55,0.35)", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 12px rgba(212,175,55,0.08)",
      }}>
        <svg viewBox="0 0 24 24" style={{ width: "14px", height: "14px", fill: G.subtle }}>
          <path d="M18 10h-1V7c0-2.76-2.24-5-5-5S7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-9H9V7c0-1.66 1.34-3 3-3s3 1.34 3 3v3z" />
        </svg>
      </div>
      <div>
        <div style={{ fontSize: "13px", fontWeight: 600, color: W.secondary, marginBottom: "3px" }}>
          Comparable Acquisition Analysis
        </div>
        <div style={{ fontSize: "12px", color: W.quaternary, lineHeight: 1.4 }}>
          Real deals in your genre and budget range. Defend your valuation with data.
        </div>
        <div style={{
          ...FONT.label,
          fontSize: "11px",
          letterSpacing: "0.12em",
          color: G.floor,
          marginTop: "6px",
        }}>
          Included in Comp Report
        </div>
      </div>
    </div>
  </section>
);

// ─── SECTION 7: LOCKED TEASER — INVESTOR MEMO ───────────────────

const LockedInvestorMemoSection = () => (
  <section style={{ padding: "48px 24px 48px", background: "rgba(212,175,55,0.015)" }}>
    {/* Label */}
    <div style={{ ...FONT.label, color: G.subtle, marginBottom: "24px" }}>Investor Documents</div>

    {/* Headline */}
    <div style={{ ...FONT.title, color: W.tertiary, marginBottom: "24px" }}>THE INVESTOR MEMO</div>

    {/* Locked card */}
    <div style={{
      position: "relative",
      border: "1px solid rgba(212,175,55,0.20)",
      borderRadius: "4px",
      overflow: "hidden",
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
        background: "radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, rgba(0,0,0,0.50) 70%)",
      }}>
        <div style={{
          width: "44px", height: "44px",
          border: `1.5px solid ${G.subtle}`,
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "14px",
          boxShadow: "0 0 16px rgba(212,175,55,0.12)",
        }}>
          <svg viewBox="0 0 24 24" style={{ width: "18px", height: "18px", fill: G.standard }}>
            <path d="M18 10h-1V7c0-2.76-2.24-5-5-5S7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-9H9V7c0-1.66 1.34-3 3-3s3 1.34 3 3v3z" />
          </svg>
        </div>
        <span style={{
          fontSize: "12px", fontWeight: 600,
          letterSpacing: "0.15em", textTransform: "uppercase" as const,
          color: G.standard,
        }}>
          Included in Producer&rsquo;s Package
        </span>
      </div>
    </div>
  </section>
);

// ─── SECTION 8: CTA ──────────────────────────────────────────────

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section style={{
      padding: "56px 24px 72px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Radial gold ambient glow */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center 40%, rgba(212,175,55,0.06) 0%, rgba(212,175,55,0.02) 40%, transparent 70%)",
        animation: "pulseGlow 4s ease-in-out infinite",
      }} />

      {/* Warm top border — stronger than section dividers */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.25) 20%, rgba(212,175,55,0.50) 50%, rgba(212,175,55,0.25) 80%, transparent 100%)",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Headline */}
        <div style={{ ...FONT.title, color: W.primary, marginBottom: "14px" }}>
          YOUR INVESTORS WILL ASK.
        </div>

        {/* Subtext */}
        <div style={{
          fontSize: "15px",
          color: W.tertiary,
          lineHeight: 1.6,
          maxWidth: "340px",
          margin: "0 auto 36px",
        }}>
          Your numbers are modeled. Now make them investor-ready.
        </div>

        {/* Primary CTA — revenue conversion */}
        <div style={{ marginBottom: "16px" }}>
          <span
            // TODO: Route through gatedNavigate() to capture anonymous leads before store navigation
            onClick={() => navigate("/store")}
            style={{
              display: "inline-block",
              padding: "16px 36px",
              background: "rgba(212,175,55,0.12)",
              border: "1px solid rgba(212,175,55,0.35)",
              borderRadius: "8px",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "20px",
              letterSpacing: "0.15em",
              color: "rgba(212,175,55,0.80)",
              cursor: "pointer",
              textDecoration: "none",
              animation: "ctaGlow 3s ease-in-out infinite",
            }}
          >
            GET THE FULL ANALYSIS
          </span>
        </div>

        {/* Secondary CTA — lead capture via PDF export */}
        <div style={{ marginBottom: "12px" }}>
          <span
            // TODO: Implement PDF export with lead capture modal (email + name)
            onClick={() => {}}
            style={{
              display: "inline-block",
              padding: "10px 24px",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.06em",
              color: W.tertiary,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Export This PDF
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
          <div style={{
            width: "8px", height: "8px",
            border: "1.5px solid rgba(212,175,55,0.35)",
            borderRadius: "50%",
          }} />
          <span style={{
            fontSize: "10px", fontWeight: 600,
            letterSpacing: "0.15em", textTransform: "uppercase" as const,
            color: W.ghost,
          }}>filmmaker.og &middot; Waterfall Snapshot</span>
          <div style={{ flex: 1, maxWidth: "60px", height: "1px", background: "linear-gradient(90deg, rgba(212,175,55,0.20), transparent)" }} />
        </div>
      </div>
    </section>
  );
};

// ─── Main Component ──────────────────────────────────────────────

const WaterfallBrief = ({
  result,
  inputs,
  project,
  guilds,
  selections,
}: WaterfallBriefProps) => {
  // Derive selections from inputs if not provided
  const effectiveSelections: CapitalSelections = selections ?? {
    taxCredits: inputs.credits > 0,
    seniorDebt: inputs.debt > 0,
    gapLoan: inputs.mezzanineDebt > 0,
    equity: inputs.equity > 0,
    deferments: inputs.deferments > 0,
  };

  // Core computations
  const tiers = computeTierPayments(result, inputs);

  return (
    <div style={{
      background: "#0A0A0A",
      maxWidth: "430px",
      margin: "0 auto",
    }}>
      {/* ═══ ACT 1 — THE DEAL ═══ */}

      {/* 1. Cover */}
      <CoverSection
        project={project}
        inputs={inputs}
        result={result}
        guilds={guilds}
      />

      <GoldGlowBreak />

      {/* 2. Deal (Investment Thesis) */}
      <DealSection
        inputs={inputs}
        result={result}
        guilds={guilds}
        project={project}
      />

      <GoldGlowBreak />

      {/* 3. Locked Sensitivity (Gate 1 — always position 3) */}
      <LockedSensitivitySection />

      <GoldGlowBreak />

      {/* ═══ ACT 2 — THE MATH ═══ */}

      {/* 4. The Erosion (Reality Check 1) */}
      <RealityCheck1Section
        inputs={inputs}
        result={result}
        guilds={guilds}
        project={project}
      />

      <GoldGlowBreak />

      {/* 5. The Capital Stack */}
      <CapitalStackSection
        inputs={inputs}
        selections={effectiveSelections}
      />

      <GoldGlowBreak />

      {/* 6. The Deductions */}
      <DeductionsSection
        inputs={inputs}
        result={result}
        guilds={guilds}
      />

      <GoldGlowBreak />

      {/* 7. The Cascade */}
      <CascadeSection
        tiers={tiers}
        result={result}
        inputs={inputs}
      />

      <GoldGlowBreak />

      {/* 8. Locked Comparable (Gate 2) */}
      <LockedComparableSection />

      <GoldGlowBreak />

      {/* ═══ ACT 3 — THE CLOSE ═══ */}

      {/* 9. The Risk (Reality Check 2) */}
      <RealityCheck2Section
        inputs={inputs}
        result={result}
        guilds={guilds}
        project={project}
      />

      <GoldGlowBreak />

      {/* 10. Locked Investor Memo */}
      <LockedInvestorMemoSection />

      <GoldGlowBreak />

      {/* 11. CTA */}
      <CTASection />
    </div>
  );
};

export default WaterfallBrief;
