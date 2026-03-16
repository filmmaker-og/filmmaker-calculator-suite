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
  onExport?: () => void;
  onNavigateTab?: (tab: string) => void;
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
  <div style={{
    height: "1px",
    background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.30) 30%, rgba(212,175,55,0.50) 50%, rgba(212,175,55,0.30) 70%, transparent 100%)",
  }} />
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
  const cashBasisDelta = inputs.revenue > 0 ? inputs.revenue - result.offTopTotal - cashBasis : 0;
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
    }}>
      {/* 1a. Badge */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "24px",
      }}>
        <div style={{ width: "24px", height: "1px", background: G.subtle }} />
        <span style={{ ...FONT.label, color: G.standard }}>Waterfall Brief</span>
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
            <div key={f.role} style={{ background: "#000", padding: "12px 14px" }}>
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
        <div style={{ flex: 1, background: "#000", padding: "14px" }}>
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
        <div style={{ flex: 1, background: "#000", padding: "14px" }}>
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
        <div style={{ flex: 1, background: "#000", padding: "14px" }}>
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
        <div style={{ flex: 1, background: "#000", padding: "14px" }}>
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

// ─── SECTION 2: REALITY CHECK 1 ─────────────────────────────────

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
  if (result.marketing > 0) erosionItems.push({ label: "Agent Expense Cap", amount: result.marketing, colorOpacity: 0.50 });
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
      <div style={{ ...FONT.label, color: G.standard, marginBottom: "24px" }}>The Analysis</div>

      {/* 2b. Headline */}
      <div style={{ ...FONT.display, color: W.primary, marginBottom: "32px" }}>
        WHERE YOUR MONEY{"\n"}ACTUALLY GOES
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
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 20px",
        background: "rgba(60,179,113,0.06)",
        border: "1px solid rgba(60,179,113,0.20)",
        borderRadius: "4px",
        margin: "28px 0",
      }}>
        <span style={{ fontSize: "14px", color: W.tertiary }}>Net to Investors</span>
        <span style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "22px",
          fontWeight: 500,
          color: SEM.green,
        }}>
          {formatCompactCurrency(netDistributable)}
        </span>
      </div>

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
    {/* 3a. Section Label */}
    <div style={{ ...FONT.label, color: G.subtle, marginBottom: "24px" }}>Premium Analysis</div>

    {/* 3b. Headline */}
    <div style={{ ...FONT.title, color: W.tertiary, marginBottom: "24px" }}>SENSITIVITY ANALYSIS</div>

    {/* 3c. Locked Card */}
    <div style={{
      position: "relative",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "4px",
      overflow: "hidden",
    }}>
      {/* Blurred content */}
      <div style={{
        padding: "20px",
        filter: "blur(6px)",
        opacity: 0.35,
        userSelect: "none",
        pointerEvents: "none",
      }}>
        {/* Fake bars */}
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", height: "80px", marginBottom: "12px" }}>
          <div style={{ flex: 1, height: "80%", borderRadius: "3px 3px 0 0", background: "rgba(60,179,113,0.30)" }} />
          <div style={{ flex: 1, height: "65%", borderRadius: "3px 3px 0 0", background: "rgba(60,179,113,0.25)" }} />
          <div style={{ flex: 1, height: "40%", borderRadius: "3px 3px 0 0", background: "rgba(240,168,48,0.25)" }} />
          <div style={{ flex: 1, height: "25%", borderRadius: "3px 3px 0 0", background: "rgba(224,82,82,0.25)" }} />
          <div style={{ flex: 1, height: "15%", borderRadius: "3px 3px 0 0", background: "rgba(224,82,82,0.30)" }} />
        </div>
        {/* Fake labels */}
        <div style={{ display: "flex", gap: "8px" }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ flex: 1, height: "8px", background: "rgba(255,255,255,0.15)", borderRadius: "2px" }} />
          ))}
        </div>
        {/* Fake text */}
        <div style={{ marginTop: "16px" }}>
          <div style={{ height: "10px", width: "80%", background: "rgba(255,255,255,0.15)", borderRadius: "2px", marginBottom: "8px" }} />
          <div style={{ height: "10px", width: "65%", background: "rgba(255,255,255,0.10)", borderRadius: "2px", marginBottom: "8px" }} />
          <div style={{ height: "10px", width: "90%", background: "rgba(255,255,255,0.12)", borderRadius: "2px" }} />
        </div>
      </div>
      {/* Overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.50)",
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: `2px solid ${G.subtle}`,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "12px",
        }}>
          <svg viewBox="0 0 24 24" style={{ width: "18px", height: "18px", fill: G.standard }}>
            <path d="M18 10h-1V7c0-2.76-2.24-5-5-5S7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-9H9V7c0-1.66 1.34-3 3-3s3 1.34 3 3v3z" />
          </svg>
        </div>
        <span style={{
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase" as const,
          color: G.standard,
        }}>
          Included in Snapshot
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
      <div style={{ ...FONT.label, color: G.standard, marginBottom: "24px" }}>Risk Analysis</div>

      {/* 4b */}
      <div style={{ ...FONT.title, color: W.secondary, marginBottom: "24px" }}>WHAT BREAKS THIS DEAL</div>

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
  if (result.marketing > 0) rows.push({ label: "Agent Expenses", rate: "capped", amount: result.marketing });
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
      <div style={{ ...FONT.label, color: G.standard, marginBottom: "24px" }}>Full Breakdown</div>

      {/* 5b */}
      <div style={{ ...FONT.display, color: W.primary, marginBottom: "8px" }}>GROSS TO NET</div>

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
      <div style={{ ...FONT.label, color: G.standard, marginBottom: "24px" }}>Recoupment Cascade</div>

      {/* 6b */}
      <div style={{ ...FONT.display, color: W.primary, marginBottom: "8px" }}>WHO GETS PAID</div>

      {/* 6c */}
      <div style={{ fontSize: "14px", color: W.quaternary, marginBottom: "28px" }}>
        Net distributable: {formatFullCurrency(netDistributable)} flowing through the waterfall
      </div>

      {/* 6d. Cascade Bars */}
      <div style={{ margin: "24px 0" }}>
        {cascadeTiers.map((tier) => {
          const fillPct = netDistributable > 0 ? (tier.paid / netDistributable) * 100 : 0;
          const isFunded = tier.status === "funded";
          const isPartial = tier.status === "partial";
          const fillColor = isFunded
            ? "rgba(60,179,113,0.40)"
            : isPartial
            ? "rgba(212,175,55,0.40)"
            : "transparent";
          const badgeClass = isFunded ? "funded" : isPartial ? "partial" : "zero";
          const badgeStyle: React.CSSProperties = isFunded
            ? { background: "rgba(60,179,113,0.20)", color: SEM.green }
            : isPartial
            ? { background: "rgba(240,168,48,0.20)", color: SEM.amber }
            : { background: "rgba(224,82,82,0.15)", color: "rgba(224,82,82,0.70)" };
          const badgeText = isFunded ? "FUNDED" : isPartial ? "PARTIAL" : "ZERO";

          // If fill is narrow (<120px equivalent), badge goes outside
          // At 430px max, track is ~306px (430-24-24-100-12 gap). 120/306 ≈ 39%
          const fillIsNarrow = fillPct < 39;

          return (
            <div key={tier.label} style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}>
              <div style={{
                width: "100px",
                flexShrink: 0,
                fontSize: "12px",
                color: W.tertiary,
                textAlign: "right",
              }}>
                {tier.label === "Equity + Premium" && inputs.premium > 0
                  ? `Equity (${100 + inputs.premium}%)`
                  : tier.label === "Deferments"
                  ? "Deferred Fees"
                  : tier.label}
              </div>
              <div style={{
                flex: 1,
                height: "24px",
                background: "rgba(255,255,255,0.04)",
                borderRadius: "4px",
                position: "relative",
                overflow: "visible",
              }}>
                {fillPct > 0 && (
                  <div style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: `${Math.min(100, fillPct)}%`,
                    borderRadius: "4px",
                    background: fillColor,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "8px",
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "11px",
                    fontWeight: 500,
                    color: W.secondary,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}>
                    {!fillIsNarrow && formatCompactCurrency(tier.paid)}
                  </div>
                )}
                {/* Badge */}
                {fillIsNarrow ? (
                  <div style={{
                    position: "absolute",
                    left: `calc(${Math.min(100, fillPct)}% + 8px)`,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.10em",
                    textTransform: "uppercase" as const,
                    padding: "2px 6px",
                    borderRadius: "2px",
                    whiteSpace: "nowrap",
                    ...badgeStyle,
                  }}>
                    {fillIsNarrow && fillPct > 0 && (
                      <span style={{ marginRight: "4px", fontFamily: "'Roboto Mono', monospace" }}>
                        {formatCompactCurrency(tier.paid)}
                      </span>
                    )}
                    {badgeText}
                  </div>
                ) : (
                  <div style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.10em",
                    textTransform: "uppercase" as const,
                    padding: "2px 6px",
                    borderRadius: "2px",
                    ...badgeStyle,
                  }}>
                    {badgeText}
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
                  Every tier above the line is fully funded. The backend pool — split 50/50 between
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

// ─── SECTION 7: LOCKED TEASER — INVESTOR MEMO ───────────────────

const LockedInvestorMemoSection = () => (
  <section style={{ padding: "48px 24px 48px" }}>
    <div style={{ ...FONT.label, color: G.subtle, marginBottom: "24px" }}>Premium Analysis</div>
    <div style={{ ...FONT.title, color: W.tertiary, marginBottom: "24px" }}>INVESTOR MEMO</div>
    <div style={{
      position: "relative",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "4px",
      overflow: "hidden",
    }}>
      {/* Blurred content */}
      <div style={{
        padding: "20px",
        filter: "blur(6px)",
        opacity: 0.35,
        userSelect: "none",
        pointerEvents: "none",
      }}>
        {[100, 85, 92].map((w, i) => (
          <div key={i} style={{
            height: "10px",
            width: `${w}%`,
            background: `rgba(255,255,255,${i === 0 ? 0.15 : i === 1 ? 0.12 : 0.10})`,
            borderRadius: "2px",
            marginBottom: "8px",
          }} />
        ))}
        <div style={{ height: "16px" }} />
        {[75, 88, 60].map((w, i) => (
          <div key={i + 3} style={{
            height: "10px",
            width: `${w}%`,
            background: `rgba(255,255,255,${i === 0 ? 0.12 : i === 1 ? 0.10 : 0.08})`,
            borderRadius: "2px",
            marginBottom: i < 2 ? "8px" : "0",
          }} />
        ))}
      </div>
      {/* Overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.50)",
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: `2px solid ${G.subtle}`,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "12px",
        }}>
          <svg viewBox="0 0 24 24" style={{ width: "18px", height: "18px", fill: G.standard }}>
            <path d="M18 10h-1V7c0-2.76-2.24-5-5-5S7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-9H9V7c0-1.66 1.34-3 3-3s3 1.34 3 3v3z" />
          </svg>
        </div>
        <span style={{
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase" as const,
          color: G.standard,
        }}>
          Included in Package
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
      padding: "48px 24px 64px",
      textAlign: "center",
      borderTop: "1px solid rgba(212,175,55,0.15)",
    }}>
      {/* 8a */}
      <div style={{ ...FONT.title, color: W.primary, marginBottom: "12px" }}>
        YOUR INVESTORS WILL ASK.
      </div>

      {/* 8b */}
      <div style={{
        fontSize: "14px",
        color: W.tertiary,
        lineHeight: 1.5,
        maxWidth: "320px",
        margin: "0 auto 28px",
      }}>
        This brief answers what they need to know. The Snapshot gives them everything else.
      </div>

      {/* 8c. Primary CTA */}
      <div style={{ marginBottom: "16px" }}>
        <span
          onClick={() => navigate("/store")}
          style={{
            display: "inline-block",
            padding: "14px 32px",
            background: "rgba(212,175,55,0.12)",
            border: `1px solid ${G.subtle}`,
            borderRadius: "8px",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "18px",
            letterSpacing: "0.15em",
            color: G.emphasis,
            cursor: "pointer",
            textDecoration: "none",
            boxShadow: "0 0 20px rgba(212,175,55,0.08), 0 0 40px rgba(212,175,55,0.04)",
          }}
        >
          GET THE SNAPSHOT
        </span>
      </div>

      {/* 8d. Secondary */}
      <div>
        <span
          onClick={() => window.print()}
          style={{
            display: "inline-block",
            padding: "10px 24px",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.06em",
            color: W.tertiary,
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Print This Brief
        </span>
      </div>

      {/* 8e. Footer */}
      <div style={{ marginTop: "32px", ...FONT.fine, color: W.ghost }}>
        filmmaker.og &middot; Waterfall Intelligence
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

  // Conditional: RC1 is "substantive" if budget + revenue + at least one deduction
  const hasDeductions = result.offTopTotal > 0;
  const rc1Substantive = inputs.budget > 0 && inputs.revenue > 0 && hasDeductions;

  return (
    <div style={{
      background: "#000",
      maxWidth: "430px",
      margin: "0 auto",
    }}>
      {/* SECTION 1: Cover */}
      <CoverSection
        project={project}
        inputs={inputs}
        result={result}
        guilds={guilds}
      />

      <GoldGlowBreak />

      {/* SECTION 2: Reality Check 1 */}
      <RealityCheck1Section
        inputs={inputs}
        result={result}
        guilds={guilds}
        project={project}
      />

      <GoldGlowBreak />

      {/* SECTION 3: Locked Sensitivity (position 3 if RC1 substantive) */}
      {rc1Substantive && (
        <>
          <LockedSensitivitySection />
          <GoldGlowBreak />
        </>
      )}

      {/* SECTION 4: Reality Check 2 */}
      <RealityCheck2Section
        inputs={inputs}
        result={result}
        guilds={guilds}
        project={project}
      />

      <GoldGlowBreak />

      {/* SECTION 3 fallback: Locked Sensitivity (between 4 and 5 if RC1 thin) */}
      {!rc1Substantive && (
        <>
          <LockedSensitivitySection />
          <GoldGlowBreak />
        </>
      )}

      {/* SECTION 5: Deductions */}
      <DeductionsSection
        inputs={inputs}
        result={result}
        guilds={guilds}
      />

      <GoldGlowBreak />

      {/* SECTION 6: Cascade */}
      <CascadeSection
        tiers={tiers}
        result={result}
        inputs={inputs}
      />

      <GoldGlowBreak />

      {/* SECTION 7: Locked Investor Memo */}
      <LockedInvestorMemoSection />

      <GoldGlowBreak />

      {/* SECTION 8: CTA */}
      <CTASection />
    </div>
  );
};

export default WaterfallBrief;
