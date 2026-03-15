import type { ProjectDetails } from "@/pages/Calculator";
import {
  WaterfallResult,
  WaterfallInputs,
  GuildState,
  CapitalSelections,
  formatCompactCurrency,
  formatMultiple,
  formatFullCurrency,
  calculateBreakeven,
  computeTierPayments,
  getWaterfallState,
  CAM_PCT,
  SAG_PCT,
  WGA_PCT,
  DGA_PCT,
} from "@/lib/waterfall";
import type { TierPayment, WaterfallState } from "@/lib/waterfall-types";
import { waterfallBadgeStates } from "@/lib/design-system";
import { INDUSTRY_CONTEXT } from "@/lib/industry-context";
import {
  getTLDR,
  getStackInterpretation,
  getCapitalStackIntro,
  getWaterfallInterpretation,
  getReturnParagraph,
  getSensitivityInterpretation,
} from "@/lib/waterfall-copy";
import { useRef, useEffect } from "react";
import { Lock, Download, ArrowRight } from "lucide-react";
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

// ─── Section Break ───────────────────────────────────────────────

const SectionBreak = () => (
  <div style={{
    display: "flex", alignItems: "center", gap: "12px",
    padding: "28px 24px", position: "relative", zIndex: 1,
  }}>
    {/* Glow behind the divider */}
    <div style={{
      position: "absolute",
      left: "15%",
      right: "15%",
      top: "50%",
      transform: "translateY(-50%)",
      height: "80px",
      background: "radial-gradient(ellipse at center, rgba(212,175,55,0.04), transparent 70%)",
      pointerEvents: "none",
    }} />
    <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.12)" }} />
    <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(212,175,55,0.40)" }} />
    <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.12)" }} />
  </div>
);

// ─── Watermark ───────────────────────────────────────────────────

const Watermark = () => (
  <div style={{
    textAlign: "center",
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "11px",
    letterSpacing: "0.18em",
    color: "rgba(212,175,55,0.25)",
    padding: "32px 24px 24px",
  }}>
    ———— FILMMAKER.OG ————
  </div>
);

// ─── Locked Teaser ──────────────────────────────────────────────

const LockedTeaser = ({ title, body }: { title: string; body: string }) => (
  <div style={{
    ...ucardBase,
    border: "1px solid rgba(212,175,55,0.18)",
    background: "rgba(212,175,55,0.025)",
    borderLeft: "3px solid rgba(212,175,55,0.30)",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
      <Lock style={{ width: "14px", height: "14px", color: "rgba(212,175,55,0.40)" }} />
      <span style={{
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "9px",
        letterSpacing: "0.12em",
        textTransform: "uppercase" as const,
        color: "rgba(212,175,55,0.55)",
      }}>
        {title}
      </span>
    </div>
    <p style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: "13px",
      color: "rgba(255,255,255,0.45)",
      lineHeight: 1.5,
      margin: "0 0 8px",
    }}>
      {body}
    </p>
    <span style={{
      display: "inline-block",
      padding: "3px 12px",
      borderRadius: "999px",
      border: "1px solid rgba(212,175,55,0.15)",
      background: "rgba(212,175,55,0.04)",
      fontFamily: "'Roboto Mono', monospace",
      fontSize: "8px",
      letterSpacing: "0.1em",
      color: "rgba(212,175,55,0.50)",
    }}>
      Available in the Snapshot
    </span>
  </div>
);

// ─── Shared Styles ───────────────────────────────────────────────

const s = {
  sectionLabel: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "rgba(212,175,55,0.55)",
    margin: 0,
  } as React.CSSProperties,
  sectionTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "28px",
    letterSpacing: "0.06em",
    color: "rgba(255,255,255,0.95)",
    margin: "8px 0 0",
    textAlign: "center" as const,
  } as React.CSSProperties,
  bodyText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px",
    lineHeight: 1.65,
    color: "rgba(255,255,255,0.75)",
    margin: 0,
  } as React.CSSProperties,
  monoLabel: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "11px",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.40)",
  } as React.CSSProperties,
  monoValue: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "15px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.82)",
    fontVariantNumeric: "tabular-nums" as const,
  } as React.CSSProperties,
  goldDivider: {
    height: "1px",
    background: "rgba(212,175,55,0.12)",
    width: "100%",
  } as React.CSSProperties,
  section: {
    padding: "0 24px",
    position: "relative" as const,
    zIndex: 1,
  } as React.CSSProperties,
};

// ─── Unified Card System ─────────────────────────────────────────

const ucardBase: React.CSSProperties = {
  border: "1px solid rgba(212,175,55,0.12)",
  borderRadius: "10px",
  padding: "18px 20px",
  margin: "14px 0",
  background: "rgba(212,175,55,0.015)",
  position: "relative",
  overflow: "hidden",
};

// ─── I. Cover Section ────────────────────────────────────────────

const CoverSection = ({
  project, inputs, result, waterfallState, tiers, breakEven, badge, copyNumbers, sourceNames, guilds,
}: {
  project: ProjectDetails;
  inputs: WaterfallInputs;
  result: WaterfallResult;
  waterfallState: WaterfallState;
  tiers: TierPayment[];
  breakEven: number;
  badge: typeof waterfallBadgeStates.fully_recouped;
  copyNumbers: Parameters<typeof getTLDR>[1];
  sourceNames: string[];
  guilds: GuildState;
}) => {
  const genre = project.genre === "Other" ? project.customGenre : project.genre;
  const hasTitle = project.title.trim().length > 0;
  const hasGenre = genre.trim().length > 0;
  const hasStatus = project.status.trim().length > 0;
  const hasLogline = project.logline.trim().length > 0;

  // Team/package grid fields
  const packageFields: { label: string; value: string }[] = [];
  if (project.producers.trim()) packageFields.push({ label: "PRODUCER(S)", value: project.producers });
  if (project.director.trim()) packageFields.push({ label: "DIRECTOR", value: project.director });
  if (project.writers.trim()) packageFields.push({ label: "WRITER(S)", value: project.writers });
  if (project.cast.trim()) packageFields.push({ label: "CAST", value: project.cast });
  if (project.company.trim()) packageFields.push({ label: "COMPANY", value: project.company });
  if (project.location.trim()) packageFields.push({ label: "LOCATION", value: project.location });

  // Assumptions chips
  const assumptions: { label: string; value: string }[] = [
    { label: "CAM", value: "1%" },
  ];
  if (inputs.salesFee > 0) assumptions.push({ label: "SALES AGENT", value: `${inputs.salesFee}%` });
  if (inputs.salesExp > 0) assumptions.push({ label: "MARKETING CAP", value: formatCompactCurrency(inputs.salesExp) });
  if (guilds.sag) assumptions.push({ label: "SAG-AFTRA", value: `${(SAG_PCT * 100).toFixed(1)}%` });
  if (guilds.wga) assumptions.push({ label: "WGA", value: `${(WGA_PCT * 100).toFixed(1)}%` });
  if (guilds.dga) assumptions.push({ label: "DGA", value: `${(DGA_PCT * 100).toFixed(1)}%` });
  if (inputs.premium > 0) assumptions.push({ label: "EQUITY PREMIUM", value: `${inputs.premium}%` });
  if (inputs.credits > 0) assumptions.push({ label: "TAX CREDITS", value: formatCompactCurrency(inputs.credits) });

  const tldr = getTLDR(waterfallState, copyNumbers, sourceNames);

  return (
    <div style={s.section}>
      {/* Block 1: Document header */}
      <div style={{ textAlign: "center", padding: "40px 0 24px" }}>
        <p style={{ ...s.sectionLabel, color: "rgba(212,175,55,0.55)" }}>
          RECOUPMENT WATERFALL ANALYSIS
        </p>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "11px",
          color: "rgba(255,255,255,0.35)",
          margin: "8px 0 0",
        }}>
          {`Prepared by filmmaker.og · ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
        </p>

        {/* Gold divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "16px auto", maxWidth: "200px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.25)" }} />
          <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(212,175,55,0.40)" }} />
          <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.25)" }} />
        </div>
      </div>

      {/* Block 2: Title */}
      {hasTitle && (
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "36px",
            letterSpacing: "0.08em",
            color: "#FFFFFF",
            margin: "0 0 4px",
          }}>
            {project.title.toUpperCase()}
          </h1>

          {/* Genre + Status */}
          {(hasGenre || hasStatus) && (
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              color: "rgba(255,255,255,0.55)",
              margin: 0,
            }}>
              {[hasGenre ? genre : null, hasStatus ? project.status : null].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      )}

      {/* Block 3: Logline — labeled, conditional */}
      {hasLogline && (
        <div style={{ padding: "14px 0" }}>
          <p style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: "rgba(212,175,55,0.45)",
            marginBottom: "4px",
          }}>
            LOGLINE
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.55)",
            fontStyle: "italic",
            margin: 0,
          }}>
            {project.logline}
          </p>
        </div>
      )}

      {/* Block 4: Team / Package grid */}
      {packageFields.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
          marginBottom: "24px",
        }}>
          {packageFields.map((field) => (
            <div key={field.label}>
              <p style={{ ...s.monoLabel, fontSize: "9px", margin: "0 0 4px" }}>{field.label}</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.75)", margin: 0 }}>
                {field.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Block 5: Assumptions — two-tone chips */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ ...s.monoLabel, fontSize: "9px", margin: "0 0 8px" }}>MODEL ASSUMPTIONS</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {assumptions.map((a) => (
            <span key={a.label} style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 10px",
              borderRadius: "4px",
              border: "1px solid rgba(212,175,55,0.15)",
              background: "rgba(212,175,55,0.03)",
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "10px",
            }}>
              <span style={{ color: "rgba(212,175,55,0.45)" }}>{a.label}</span>
              <span style={{ color: "rgba(255,255,255,0.70)" }}>{a.value}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Block 6: Verdict badge */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "8px 20px",
          borderRadius: "999px",
          background: badge.bgColor,
          border: `1px solid ${badge.borderColor}`,
        }}>
          <span style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.15em",
            color: badge.color,
          }}>
            {badge.label}
          </span>
        </div>
      </div>

      {/* Block 7: KPI row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1px",
        background: "rgba(212,175,55,0.08)",
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "24px",
      }}>
        {[
          { label: "BUDGET", value: formatCompactCurrency(inputs.budget) },
          { label: "REVENUE", value: formatCompactCurrency(inputs.revenue) },
          { label: "MULTIPLE", value: formatMultiple(result.multiple), color: result.multiple >= 1.0 ? "#3CB371" : result.multiple >= 0.5 ? "#F0A830" : "#DC2626" },
          { label: "BREAK-EVEN", value: formatCompactCurrency(breakEven) },
        ].map((kpi) => (
          <div key={kpi.label} style={{
            background: "#0A0A0A",
            padding: "14px 8px",
            textAlign: "center",
          }}>
            <p style={{ ...s.monoLabel, fontSize: "9px", margin: "0 0 4px" }}>{kpi.label}</p>
            <p style={{ ...s.monoValue, fontSize: "26px", fontWeight: 700, margin: 0, ...('color' in kpi && kpi.color ? { color: kpi.color } : {}) }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Block 8: TLDR */}
      <div style={{
        padding: "16px",
        background: "rgba(212,175,55,0.03)",
        borderRadius: "8px",
        border: "1px solid rgba(212,175,55,0.08)",
        marginBottom: "24px",
      }}>
        <p style={{ ...s.bodyText, fontSize: "13px", color: "rgba(255,255,255,0.60)" }}>
          {tldr}
        </p>
      </div>

      {/* Block 9: Disclaimer */}
      <div style={{
        padding: "12px 0",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "10px",
          color: "rgba(255,255,255,0.25)",
          lineHeight: 1.6,
          margin: 0,
        }}>
          This analysis is a financial modeling tool for educational purposes only. It does not constitute financial, legal, or investment advice.
          All projections are based on user-provided inputs and industry-standard assumptions. Actual results may vary significantly.
        </p>
      </div>
    </div>
  );
};

// ─── II. Executive Summary Section ───────────────────────────────

const ExecutiveSummarySection = ({
  inputs, result, breakEven,
}: {
  inputs: WaterfallInputs;
  result: WaterfallResult;
  breakEven: number;
}) => {
  const netDistributable = inputs.revenue - result.offTopTotal;
  const revenueRatio = inputs.budget > 0 ? (inputs.revenue / inputs.budget).toFixed(1) : "0.0";
  const offTopPct = inputs.revenue > 0 ? ((result.offTopTotal / inputs.revenue) * 100).toFixed(0) : "0";
  const netPct = inputs.revenue > 0 ? ((netDistributable / inputs.revenue) * 100).toFixed(0) : "0";

  // Bar chart data
  const maxVal = Math.max(inputs.revenue, 1);
  const barData = [
    { label: "Revenue", value: inputs.revenue, color: "rgba(255,255,255,0.35)" },
    { label: "Off-Tops", value: result.offTopTotal, color: "rgba(220,38,38,0.30)" },
    { label: "Net Dist.", value: Math.max(0, netDistributable), color: "rgba(255,255,255,0.20)" },
    { label: "Repayments", value: result.totalHurdle, color: "rgba(220,38,38,0.22)" },
    ...(result.profitPool > 0 ? [{ label: "Profit", value: result.profitPool, color: "#3CB371" }] : []),
  ];

  const chartHeight = 160;
  const barWidth = 40;
  const gap = 16;
  const chartWidth = barData.length * (barWidth + gap) - gap + 60;

  return (
    <div style={s.section}>
      <h2 style={s.sectionTitle}>The Deal at a Glance</h2>

      <p style={{ ...s.bodyText, margin: "16px 0 24px" }}>
        Your production is structured at a {formatCompactCurrency(inputs.budget)} negative cost — the total amount required to produce the finished film. At the modeled acquisition price of {formatCompactCurrency(inputs.revenue)}, the film is valued at {revenueRatio}x its production cost.
      </p>

      {/* Bar chart */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "20px 12px 12px",
        marginBottom: "16px",
        overflowX: "auto",
      }}>
        <svg width={chartWidth} height={chartHeight + 40} viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}>
          {barData.map((bar, i) => {
            const barH = maxVal > 0 ? (bar.value / maxVal) * chartHeight : 0;
            const x = 30 + i * (barWidth + gap);
            const y = chartHeight - barH;
            return (
              <g key={bar.label}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barH, 2)}
                  fill={bar.color}
                  rx={3}
                />
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 14}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.40)"
                  fontSize="9"
                  fontFamily="'Roboto Mono', monospace"
                >
                  {bar.label}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fill={bar.color}
                  fontSize="10"
                  fontFamily="'Roboto Mono', monospace"
                >
                  {formatCompactCurrency(bar.value)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Chart interpretation */}
      <p style={{ ...s.bodyText, fontSize: "13px", color: "rgba(255,255,255,0.50)" }}>
        Off-top deductions consume {offTopPct}% of gross revenue, leaving {netPct}% as net distributable for capital repayment and profit.
      </p>
    </div>
  );
};

// ─── III. Capital Stack Section ──────────────────────────────────

const SourceCard = ({
  label, amount, budget, rate, position, explanation, color,
}: {
  label: string;
  amount: number;
  budget: number;
  rate: number;
  position: string;
  explanation: string;
  color: string;
}) => {
  const share = budget > 0 ? ((amount / budget) * 100).toFixed(0) : "0";
  const contractualReturn = amount * (1 + rate / 100);

  return (
    <div style={{
      ...ucardBase,
      borderLeft: "3px solid rgba(212,175,55,0.40)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: color }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600, color: "#FFFFFF" }}>
              {label}
            </span>
          </div>
          <p style={{ ...s.monoLabel, fontSize: "10px", margin: 0 }}>{position}</p>
        </div>
        <span style={{ ...s.monoValue, fontSize: "16px" }}>{formatCompactCurrency(amount)}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", marginBottom: "12px" }}>
        <div>
          <p style={{ ...s.monoLabel, fontSize: "9px", margin: "0 0 2px" }}>SHARE OF STACK</p>
          <p style={{ ...s.monoValue, fontSize: "15px", margin: 0, opacity: 0.82 }}>{share}%</p>
        </div>
        <div>
          <p style={{ ...s.monoLabel, fontSize: "9px", margin: "0 0 2px" }}>CONTRACTUAL RETURN</p>
          <p style={{ ...s.monoValue, fontSize: "15px", margin: 0, opacity: 0.82 }}>{formatCompactCurrency(contractualReturn)}</p>
        </div>
      </div>

      <div style={s.goldDivider} />

      <p style={{ ...s.bodyText, fontSize: "12px", color: "rgba(255,255,255,0.45)", marginTop: "12px" }}>
        {explanation}
      </p>
    </div>
  );
};

const CapitalStackSection = ({
  inputs, result,
}: {
  inputs: WaterfallInputs;
  result: WaterfallResult;
}) => {
  const sources: {
    label: string;
    amount: number;
    rate: number;
    position: string;
    explanation: string;
    color: string;
  }[] = [];

  if (inputs.debt > 0) {
    sources.push({
      label: "Senior Debt",
      amount: inputs.debt,
      rate: inputs.seniorDebtRate,
      position: "PRIORITY 1 — FIRST REPAID",
      explanation: `Senior debt of ${formatCompactCurrency(inputs.debt)} at ${inputs.seniorDebtRate}% interest is repaid first from net distributable revenue. This is the safest position in the capital stack — lenders recover before any equity participant.`,
      color: "#D4AF37",
    });
  }

  if (inputs.mezzanineDebt > 0) {
    sources.push({
      label: "Gap / Mezzanine",
      amount: inputs.mezzanineDebt,
      rate: inputs.mezzanineRate,
      position: "PRIORITY 2 — AFTER SENIOR DEBT",
      explanation: `Mezzanine financing of ${formatCompactCurrency(inputs.mezzanineDebt)} at ${inputs.mezzanineRate}% sits behind senior debt. Higher risk position compensated by higher interest rate.`,
      color: "rgba(212,175,55,0.70)",
    });
  }

  if (inputs.equity > 0) {
    sources.push({
      label: "Equity",
      amount: inputs.equity,
      rate: inputs.premium,
      position: sources.length > 0 ? `PRIORITY ${sources.length + 1} — AFTER DEBT` : "PRIORITY 1 — FIRST REPAID",
      explanation: `Equity investment of ${formatCompactCurrency(inputs.equity)} with a ${inputs.premium}% preferred return. Equity investors bear the most risk — they are repaid only after all debt obligations are satisfied.`,
      color: "rgba(212,175,55,0.45)",
    });
  }

  if (inputs.deferments > 0) {
    sources.push({
      label: "Deferments",
      amount: inputs.deferments,
      rate: 0,
      position: `PRIORITY ${sources.length + 1} — LAST REPAID`,
      explanation: `Deferred compensation of ${formatCompactCurrency(inputs.deferments)} is repaid last before profit participation. These are contractual obligations deferred to improve cash flow during production.`,
      color: "rgba(255,255,255,0.20)",
    });
  }

  if (inputs.credits > 0) {
    sources.push({
      label: "Tax Credits",
      amount: inputs.credits,
      rate: 0,
      position: "OFFSET — REDUCES TOTAL HURDLE",
      explanation: `Tax credits of ${formatCompactCurrency(inputs.credits)} offset the total repayment obligation. These reduce the amount of revenue needed to achieve full recoupment.`,
      color: "rgba(212,175,55,0.30)",
    });
  }

  const sourceCount = sources.filter((src) => src.label !== "Tax Credits").length;
  const intro = getCapitalStackIntro(sourceCount, inputs.budget);
  const interpretation = getStackInterpretation(inputs);

  // Tax credit upsell computation
  const showTaxCreditUpsell = inputs.credits === 0 && inputs.budget > 0;
  let taxCreditDelta = 0;
  if (showTaxCreditUpsell) {
    const estimatedCredit = Math.round(inputs.budget * 0.25);
    taxCreditDelta = estimatedCredit;
  }

  // Deferment upsell computation
  const showDefermentUpsell = inputs.deferments === 0 && inputs.budget > 0;
  const defermentEstimate = Math.round(inputs.budget * 0.08);

  return (
    <div style={s.section}>
      <h2 style={s.sectionTitle}>Where the Money Comes From</h2>

      <p style={{ ...s.bodyText, margin: "16px 0 20px" }}>{intro}</p>

      {/* Proportional bar */}
      {sources.length > 0 ? (
        <>
          <div style={{
            display: "flex",
            borderRadius: "6px",
            overflow: "hidden",
            height: "28px",
            marginBottom: "8px",
            border: "1px solid rgba(212,175,55,0.12)",
          }}>
            {sources.filter((src) => src.label !== "Tax Credits").map((src) => (
              <div
                key={src.label}
                style={{
                  flex: src.amount,
                  background: src.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "2px",
                }}
              >
                {src.amount / inputs.budget > 0.15 && (
                  <span style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "9px",
                    color: "#000",
                    fontWeight: 600,
                  }}>
                    {((src.amount / inputs.budget) * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
            {sources.filter((src) => src.label !== "Tax Credits").map((src) => (
              <div key={src.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: src.color }} />
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.50)" }}>
                  {src.label}
                </span>
              </div>
            ))}
          </div>

          {/* Source cards */}
          {sources.map((src) => (
            <SourceCard
              key={src.label}
              label={src.label}
              amount={src.amount}
              budget={inputs.budget}
              rate={src.rate}
              position={src.position}
              explanation={src.explanation}
              color={src.color}
            />
          ))}

          {/* Tax credit contextual upsell */}
          {showTaxCreditUpsell && (
            <div style={{
              ...ucardBase,
              borderLeft: "3px solid rgba(212,175,55,0.30)",
            }}>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                color: "rgba(255,255,255,0.58)",
                lineHeight: 1.6,
                margin: "0 0 8px",
              }}>
                You haven't applied tax credits to this structure. In many states — Louisiana,
                Georgia, New Mexico — qualified production spending generates transferable
                credits that reduce your cost basis without adding a repayment tier.
              </p>
              <p style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: "15px",
                color: "#3CB371",
                fontWeight: 600,
                margin: "0 0 12px",
              }}>
                A 25% credit would lower your break-even by ~{formatCompactCurrency(taxCreditDelta)}
              </p>
              <div style={{
                padding: "12px",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.015)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <Lock style={{ width: "14px", height: "14px", color: "rgba(212,175,55,0.40)" }} />
                  <span style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "9px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: "rgba(212,175,55,0.55)",
                  }}>
                    Tax Credit Impact Modeling
                  </span>
                </div>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.40)",
                  margin: "0 0 8px",
                  lineHeight: 1.5,
                }}>
                  See which incentive programs apply and model the exact impact on your waterfall.
                </p>
                <span style={{
                  display: "inline-block",
                  padding: "3px 12px",
                  borderRadius: "999px",
                  border: "1px solid rgba(212,175,55,0.15)",
                  background: "rgba(212,175,55,0.04)",
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: "8px",
                  letterSpacing: "0.1em",
                  color: "rgba(212,175,55,0.50)",
                }}>
                  Available in the Snapshot
                </span>
              </div>
            </div>
          )}

          {/* Deferment contextual upsell */}
          {showDefermentUpsell && (
            <div style={{
              ...ucardBase,
              borderLeft: "3px solid rgba(212,175,55,0.30)",
            }}>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                color: "rgba(255,255,255,0.58)",
                lineHeight: 1.6,
                margin: "0 0 8px",
              }}>
                You haven't modeled any deferred compensation. Deferring producer fees, director fees, or above-the-line talent costs reduces your cash basis — the amount your investors need to recoup before reaching profit.
              </p>
              <p style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: "15px",
                color: "#3CB371",
                fontWeight: 600,
                margin: "0 0 12px",
              }}>
                Even {formatCompactCurrency(defermentEstimate)} in deferments would lower your break-even by ~{formatCompactCurrency(defermentEstimate)}
              </p>
              <div style={{
                padding: "12px",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.015)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <Lock style={{ width: "14px", height: "14px", color: "rgba(212,175,55,0.40)" }} />
                  <span style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "9px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: "rgba(212,175,55,0.55)",
                  }}>
                    Deferment Structure Optimization
                  </span>
                </div>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.40)",
                  margin: "0 0 8px",
                  lineHeight: 1.5,
                }}>
                  Model the optimal deferment structure for your deal.
                </p>
                <span style={{
                  display: "inline-block",
                  padding: "3px 12px",
                  borderRadius: "999px",
                  border: "1px solid rgba(212,175,55,0.15)",
                  background: "rgba(212,175,55,0.04)",
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: "8px",
                  letterSpacing: "0.1em",
                  color: "rgba(212,175,55,0.50)",
                }}>
                  Available in the Snapshot
                </span>
              </div>
            </div>
          )}

          {/* Stack interpretation */}
          <div style={{
            ...ucardBase,
            borderLeft: "3px solid rgba(212,175,55,0.40)",
          }}>
            <p style={{ ...s.bodyText, fontSize: "13px", color: "rgba(255,255,255,0.58)" }}>
              {interpretation}
            </p>
          </div>

          {/* Stack Vulnerability teaser */}
          <LockedTeaser
            title="Stack Vulnerability Assessment"
            body="How exposed is this structure if the sale comes in 30% below target?"
          />
        </>
      ) : (
        <div style={{
          padding: "32px 16px",
          textAlign: "center",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <p style={{ ...s.bodyText, color: "rgba(255,255,255,0.40)" }}>
            No financing sources entered.
          </p>
        </div>
      )}
    </div>
  );
};

// ─── IV. Revenue & Deductions Section ────────────────────────────

const RevenueDeductionsSection = ({
  inputs, result, guilds, genre,
}: {
  inputs: WaterfallInputs;
  result: WaterfallResult;
  guilds: GuildState;
  genre: string;
}) => {
  const netDistributable = inputs.revenue - result.offTopTotal;
  const netPct = inputs.revenue > 0 ? ((netDistributable / inputs.revenue) * 100) : 0;

  // Build deduction rows
  const deductions: { label: string; detail: string; amount: number; industry?: string }[] = [];

  deductions.push({
    label: "Collection Account Management",
    detail: `${(CAM_PCT * 100).toFixed(0)}% of gross`,
    amount: result.cam,
    industry: INDUSTRY_CONTEXT.camDescription,
  });

  if (result.salesFee > 0) {
    deductions.push({
      label: "Sales Agent Commission",
      detail: `${inputs.salesFee}% of gross`,
      amount: result.salesFee,
      industry: INDUSTRY_CONTEXT.salesAgentDescription,
    });
  }

  if (result.marketing > 0) {
    deductions.push({
      label: "Sales & Marketing Expenses",
      detail: "Expense cap",
      amount: result.marketing,
      industry: INDUSTRY_CONTEXT.marketingCapDescription,
    });
  }

  if (result.guilds > 0) {
    const guildParts: string[] = [];
    if (guilds.sag) guildParts.push(`SAG-AFTRA ${INDUSTRY_CONTEXT.guildRates.sag.rate}`);
    if (guilds.wga) guildParts.push(`WGA ${INDUSTRY_CONTEXT.guildRates.wga.rate}`);
    if (guilds.dga) guildParts.push(`DGA ${INDUSTRY_CONTEXT.guildRates.dga.rate}`);

    deductions.push({
      label: "Guild Residuals & P&H",
      detail: guildParts.join(" + "),
      amount: result.guilds,
    });
  }

  return (
    <div style={s.section}>
      <h2 style={s.sectionTitle}>What Happens Before the Waterfall</h2>

      <p style={{ ...s.bodyText, margin: "16px 0 20px" }}>
        Your acquisition price — the amount a buyer pays for the finished film — doesn't go straight to investors. Before any capital provider is repaid, the {formatCompactCurrency(inputs.revenue)} passes through standard industry deductions called off-the-tops. Here's what comes off before the waterfall opens.
      </p>

      {/* Acquisition price */}
      <div style={{ textAlign: "center", margin: "20px 0 24px" }}>
        <p style={{ ...s.monoLabel, fontSize: "10px", margin: "0 0 4px" }}>ACQUISITION PRICE</p>
        <p style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "48px",
          fontWeight: 700,
          color: "#D4AF37",
          margin: 0,
          fontVariantNumeric: "tabular-nums",
        }}>
          {formatFullCurrency(inputs.revenue)}
        </p>
      </div>

      {/* Deduction rows */}
      <div style={{ marginBottom: "20px" }}>
        {deductions.map((d, i) => (
          <div key={d.label} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            borderBottom: i < deductions.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
          }}>
            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.78)", margin: "0 0 2px" }}>
                {d.label}
              </p>
              <p style={{ ...s.monoLabel, fontSize: "10px", margin: 0 }}>{d.detail}</p>
            </div>
            <span style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "14px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.55)",
              fontVariantNumeric: "tabular-nums",
            }}>
              −{formatFullCurrency(d.amount)}
            </span>
          </div>
        ))}
      </div>

      {/* Gross-to-net bar */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{
          height: "8px",
          borderRadius: "4px",
          background: "rgba(220,38,38,0.10)",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${Math.max(0, Math.min(100, netPct))}%`,
            background: "linear-gradient(90deg, #3CB371, rgba(60,179,113,0.60))",
            borderRadius: "4px",
            transition: "width 0.5s ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
          <span style={{ ...s.monoLabel, fontSize: "10px", color: "rgba(220,38,38,0.45)" }}>DEDUCTED: {(100 - netPct).toFixed(0)}%</span>
          <span style={{ ...s.monoLabel, fontSize: "10px", color: "rgba(60,179,113,0.55)" }}>RETAINED: {netPct.toFixed(0)}%</span>
        </div>
      </div>

      {/* Net distributable total */}
      <div style={{
        ...ucardBase,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderLeft: "3px solid rgba(212,175,55,0.40)",
      }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600, color: "#FFFFFF" }}>
          Net Distributable
        </span>
        <span style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "18px",
          fontWeight: 600,
          color: netDistributable > result.totalHurdle ? "#3CB371" : "rgba(255,255,255,0.85)",
          fontVariantNumeric: "tabular-nums",
        }}>
          {formatFullCurrency(Math.max(0, netDistributable))}
        </span>
      </div>

      {/* Bridge sentence */}
      <p style={{ ...s.bodyText, fontSize: "13px", color: "rgba(255,255,255,0.45)", marginTop: "12px" }}>
        After {deductions.length} off-top deduction{deductions.length !== 1 ? "s" : ""} totaling {formatCompactCurrency(result.offTopTotal)},{" "}
        {netPct.toFixed(0)}% of gross revenue is available for capital repayment.
      </p>

      {/* Deduction Benchmarking teaser */}
      <LockedTeaser
        title="Deduction Benchmarking"
        body={`How do your off-the-tops compare to industry benchmarks for ${genre.toLowerCase()}s at the ${formatCompactCurrency(inputs.budget)} level?`}
      />
    </div>
  );
};

// ─── V. Waterfall Cascade Section ────────────────────────────────

const CascadeBlock = ({
  tier, widthPct, netDistributable,
}: {
  tier: TierPayment;
  widthPct: number;
  netDistributable: number;
}) => {
  const isFunded = tier.status === "funded";
  const isPartial = tier.status === "partial";
  const isNarrow = widthPct < 45;

  const bgColor = isFunded
    ? "rgba(212,175,55,0.15)"
    : isPartial
    ? "rgba(212,175,55,0.08)"
    : "rgba(220,38,38,0.04)";

  const borderBase = isFunded
    ? "1px solid rgba(212,175,55,0.30)"
    : isPartial
    ? "1px solid rgba(212,175,55,0.15)"
    : "1px solid rgba(220,38,38,0.10)";

  const borderLeftAccent = isFunded
    ? "3px solid rgba(60,179,113,0.50)"
    : isPartial
    ? "3px solid rgba(240,168,48,0.40)"
    : "3px solid rgba(220,38,38,0.25)";

  const textColor = isFunded
    ? "#D4AF37"
    : isPartial
    ? "rgba(212,175,55,0.70)"
    : "rgba(220,38,38,0.35)";

  return (
    <div style={{
      width: `${Math.max(widthPct, 40)}%`,
      minHeight: isNarrow ? "60px" : "48px",
      background: bgColor,
      borderRadius: "6px",
      border: borderBase,
      borderLeft: borderLeftAccent,
      padding: "8px 12px",
      display: "flex",
      flexDirection: isNarrow ? "column" : "row",
      alignItems: isNarrow ? "flex-start" : "center",
      justifyContent: isNarrow ? "center" : "space-between",
      gap: isNarrow ? "2px" : "8px",
    }}>
      <span style={{
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "10px",
        letterSpacing: "0.1em",
        color: textColor,
        fontWeight: 600,
        textTransform: "uppercase" as const,
        whiteSpace: "nowrap",
      }}>
        {tier.label}
      </span>
      <span style={{
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "12px",
        color: textColor,
        fontVariantNumeric: "tabular-nums",
        fontWeight: 500,
      }}>
        {formatCompactCurrency(tier.paid)}
      </span>
    </div>
  );
};

const TierRow = ({ tier }: { tier: TierPayment }) => {
  const statusColor = tier.status === "funded"
    ? "#3CB371"
    : tier.status === "partial"
    ? "#F0A830"
    : "rgba(220,38,38,0.40)";

  const statusLabel = tier.status === "funded" ? "FUNDED" : tier.status === "partial" ? "PARTIAL" : "UNFUNDED";

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "28px 1fr auto auto",
      gap: "12px",
      alignItems: "center",
      padding: "10px 0",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
    }}>
      <span style={{ ...s.monoLabel, fontSize: "11px", color: "rgba(255,255,255,0.30)", textAlign: "center" }}>
        {tier.phase}
      </span>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.78)" }}>
        {tier.label}
      </span>
      <span style={{ ...s.monoValue, fontSize: "13px", textAlign: "right" }}>
        {formatCompactCurrency(tier.paid)}<span style={{ color: "rgba(255,255,255,0.30)" }}> / {formatCompactCurrency(tier.amount)}</span>
      </span>
      <span style={{
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "9px",
        fontWeight: 600,
        letterSpacing: "0.1em",
        color: statusColor,
        textAlign: "center",
        minWidth: "60px",
        padding: "3px 8px",
        borderRadius: "999px",
        background: tier.status === "funded"
          ? "rgba(60,179,113,0.06)"
          : tier.status === "partial"
          ? "rgba(240,168,48,0.06)"
          : "rgba(220,38,38,0.06)",
        border: tier.status === "funded"
          ? "1px solid rgba(60,179,113,0.25)"
          : tier.status === "partial"
          ? "1px solid rgba(240,168,48,0.25)"
          : "1px solid rgba(220,38,38,0.15)",
      }}>
        {statusLabel}
      </span>
    </div>
  );
};

const WaterfallCascadeSection = ({
  tiers, result, inputs, waterfallState,
}: {
  tiers: TierPayment[];
  result: WaterfallResult;
  inputs: WaterfallInputs;
  waterfallState: WaterfallState;
}) => {
  const netDistributable = Math.max(0, inputs.revenue - result.offTopTotal);
  const interpretation = getWaterfallInterpretation(waterfallState, tiers, result.profitPool);

  // Compute cascade widths
  let remainingBalance = netDistributable;
  const cascadeData = tiers.map((tier) => {
    const widthPct = netDistributable > 0
      ? (remainingBalance / netDistributable) * 100
      : 100;
    remainingBalance = Math.max(0, remainingBalance - tier.paid);
    return { tier, widthPct };
  });

  return (
    <div style={s.section}>
      <h2 style={s.sectionTitle}>Who Gets Paid, In What Order</h2>

      <p style={{ ...s.bodyText, margin: "16px 0 20px" }}>
        This is your recoupment waterfall — the contractual order that determines who gets paid and when. The {formatCompactCurrency(netDistributable)} in net distributable revenue flows from the top tier down. Each tier takes its full allocation before the next gets anything.
      </p>

      {/* Cascade blocks */}
      {tiers.length > 0 && netDistributable > 0 ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "24px" }}>
            {/* Net distributable starting bar */}
            <div style={{
              width: "100%",
              height: "32px",
              background: "rgba(212,175,55,0.08)",
              borderRadius: "6px",
              border: "1px solid rgba(212,175,55,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 12px",
            }}>
              <span style={{ ...s.monoLabel, fontSize: "10px", color: "rgba(212,175,55,0.55)" }}>
                NET DISTRIBUTABLE
              </span>
              <span style={{ ...s.monoValue, fontSize: "12px", color: netDistributable > result.totalHurdle ? "#3CB371" : "rgba(255,255,255,0.85)" }}>
                {formatCompactCurrency(netDistributable)}
              </span>
            </div>

            {cascadeData.map(({ tier, widthPct }) => (
              <CascadeBlock
                key={tier.phase}
                tier={tier}
                widthPct={widthPct}
                netDistributable={netDistributable}
              />
            ))}

            {/* Profit pool bar (if any) */}
            {result.profitPool > 0 && (
              <div style={{
                width: `${Math.max(netDistributable > 0 ? (remainingBalance / netDistributable) * 100 : 0, 40)}%`,
                height: "32px",
                background: "rgba(60,179,113,0.10)",
                borderRadius: "6px",
                border: "1px solid rgba(60,179,113,0.25)",
                borderLeft: "3px solid rgba(60,179,113,0.50)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 12px",
              }}>
                <span style={{ ...s.monoLabel, fontSize: "10px", color: "rgba(60,179,113,0.55)" }}>
                  PROFIT POOL
                </span>
                <span style={{ ...s.monoValue, fontSize: "12px", color: "#3CB371" }}>
                  {formatCompactCurrency(result.profitPool)}
                </span>
              </div>
            )}
          </div>

          {/* Tier breakdown rows */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.06)",
            padding: "4px 12px",
            marginBottom: "16px",
          }}>
            {tiers.map((tier) => (
              <TierRow key={tier.phase} tier={tier} />
            ))}
          </div>

          {/* Interpretation */}
          <div style={{
            ...ucardBase,
            borderLeft: "3px solid rgba(212,175,55,0.40)",
          }}>
            <p style={{ ...s.bodyText, fontSize: "13px", color: "rgba(255,255,255,0.58)" }}>
              {interpretation}
            </p>
          </div>

          {/* Stress-Test Cascade teaser */}
          <LockedTeaser
            title="Stress-Test Cascade"
            body="See exactly which tier breaks first if revenue drops 30% — and how much your investors lose."
          />
        </>
      ) : (
        <div style={{
          padding: "32px 16px",
          textAlign: "center",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <p style={{ ...s.bodyText, color: "rgba(255,255,255,0.40)" }}>
            {inputs.revenue === 0
              ? "Enter an acquisition price to see the payment waterfall."
              : "No capital tiers to display."
            }
          </p>
        </div>
      )}
    </div>
  );
};

// ─── VI. Return Profile Section ──────────────────────────────────

const ReturnProfileSection = ({
  result, inputs, waterfallState, breakEven, copyNumbers, onNavigateTab, genre,
}: {
  result: WaterfallResult;
  inputs: WaterfallInputs;
  waterfallState: WaterfallState;
  breakEven: number;
  copyNumbers: Parameters<typeof getReturnParagraph>[1];
  onNavigateTab?: (tab: string) => void;
  genre: string;
}) => {
  const badge = waterfallBadgeStates[waterfallState];
  const interpretation = getReturnParagraph(waterfallState, copyNumbers);
  const recoupPct = Math.min(100, result.recoupPct);

  return (
    <div style={s.section}>
      <h2 style={s.sectionTitle}>The Bottom Line</h2>

      <p style={{ ...s.bodyText, margin: "16px 0 20px" }}>
        Everything above flows into one question: does this deal work? The return multiple — the ratio of what investors get back to what they put in — is the single number that answers it. Here's where your {formatCompactCurrency(inputs.revenue)} acquisition price lands.
      </p>

      {/* Multiple + Badge */}
      <div style={{ textAlign: "center", margin: "20px 0 24px" }}>
        <p style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "72px",
          fontWeight: 700,
          color: result.multiple >= 1.0 ? "#3CB371" : result.multiple >= 0.5 ? "#F0A830" : "#DC2626",
          margin: "0 0 8px",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}>
          {formatMultiple(result.multiple)}
        </p>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "6px 16px",
          borderRadius: "999px",
          background: badge.bgColor,
          border: `1px solid ${badge.borderColor}`,
        }}>
          <span style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.15em",
            color: badge.color,
          }}>
            {badge.label}
          </span>
        </div>
      </div>

      {/* Investor / Producer split */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1px",
        background: "rgba(212,175,55,0.08)",
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "20px",
      }}>
        <div style={{ background: "#0A0A0A", padding: "16px", textAlign: "center" }}>
          <p style={{ ...s.monoLabel, fontSize: "9px", margin: "0 0 4px" }}>INVESTOR TOTAL</p>
          <p style={{ ...s.monoValue, fontSize: "18px", margin: 0, color: "#D4AF37" }}>
            {formatCompactCurrency(result.investor)}
          </p>
        </div>
        <div style={{ background: "#0A0A0A", padding: "16px", textAlign: "center" }}>
          <p style={{ ...s.monoLabel, fontSize: "9px", margin: "0 0 4px" }}>PRODUCER POOL</p>
          <p style={{ ...s.monoValue, fontSize: "18px", margin: 0 }}>
            {formatCompactCurrency(result.producer)}
          </p>
        </div>
      </div>

      {/* Recoupment bar */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ ...s.monoLabel, fontSize: "10px" }}>RECOUPMENT</span>
          <span style={{ ...s.monoValue, fontSize: "12px", color: recoupPct >= 100 ? "#3CB371" : recoupPct >= 70 ? "rgba(60,179,113,0.70)" : recoupPct >= 40 ? "#F0A830" : "rgba(220,38,38,0.60)" }}>{recoupPct.toFixed(0)}%</span>
        </div>
        <div style={{
          height: "8px",
          borderRadius: "4px",
          background: "rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${recoupPct}%`,
            background: recoupPct >= 100
              ? "#3CB371"
              : recoupPct >= 70
              ? "rgba(60,179,113,0.70)"
              : recoupPct >= 40
              ? "#F0A830"
              : "rgba(220,38,38,0.60)",
            borderRadius: "4px",
            transition: "width 0.5s ease",
          }} />
        </div>
      </div>

      {/* Break-even */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        background: "rgba(255,255,255,0.02)",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.06)",
        marginBottom: "16px",
      }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>
          Break-Even Sale Price
        </span>
        <span style={{ ...s.monoValue, fontSize: "15px" }}>
          {formatFullCurrency(breakEven)}
        </span>
      </div>

      {/* Return interpretation */}
      <div style={{
        ...ucardBase,
        borderLeft: "3px solid rgba(212,175,55,0.40)",
        marginBottom: "16px",
      }}>
        <p style={{ ...s.bodyText, fontSize: "13px", color: "rgba(255,255,255,0.58)" }}>
          {interpretation}
        </p>
      </div>

      {/* Comparable Returns teaser */}
      <LockedTeaser
        title="Market Comparison"
        body={`How does ${formatMultiple(result.multiple)} compare to similar ${genre.toLowerCase()} deals at the ${formatCompactCurrency(inputs.budget)} level?`}
      />

      {/* Adjust deal link */}
      {onNavigateTab && (
        <button
          onClick={() => onNavigateTab("deal")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            color: "#D4AF37",
          }}
        >
          Adjust your deal <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
};

// ─── Conclusion Section ──────────────────────────────────────────

const ConclusionSection = ({
  inputs, result, waterfallState, tiers, breakEven,
}: {
  inputs: WaterfallInputs;
  result: WaterfallResult;
  waterfallState: WaterfallState;
  tiers: TierPayment[];
  breakEven: number;
}) => {
  const netDistributable = Math.max(0, inputs.revenue - result.offTopTotal);
  const fundedCount = tiers.filter(t => t.status === "funded").length;
  const marginPct = inputs.revenue > 0
    ? (((inputs.revenue - breakEven) / inputs.revenue) * 100).toFixed(0)
    : "0";

  // Build conclusion paragraph based on waterfall state
  let conclusion = "";
  if (waterfallState === "fully_recouped") {
    conclusion = `Your ${formatCompactCurrency(inputs.budget)} production is structured to return ${formatMultiple(result.multiple)} to investors at a ${formatCompactCurrency(inputs.revenue)} acquisition price. All ${fundedCount} capital tiers clear, the profit pool is ${formatCompactCurrency(result.profitPool)}, and the break-even threshold is ${formatCompactCurrency(breakEven)}. The deal has headroom — your acquisition target is ${marginPct}% above break-even.`;
  } else if (waterfallState === "partially_recouped") {
    conclusion = `Your ${formatCompactCurrency(inputs.budget)} production returns ${formatMultiple(result.multiple)} at a ${formatCompactCurrency(inputs.revenue)} acquisition price. Debt obligations are satisfied, but equity investors recover only a portion of their principal. The break-even for full recoupment is ${formatCompactCurrency(breakEven)} — ${marginPct}% above your current target. The deal structure protects lenders but leaves equity exposed.`;
  } else if (waterfallState === "equity_exposed") {
    conclusion = `At a ${formatCompactCurrency(inputs.revenue)} acquisition price, your ${formatCompactCurrency(inputs.budget)} production does not generate enough distributable revenue to reach the equity tier. Debt obligations clear, but equity investors receive nothing. The structure needs either a higher sale price, a lower budget, or a restructured capital stack.`;
  } else {
    conclusion = `At a ${formatCompactCurrency(inputs.revenue)} acquisition price, your ${formatCompactCurrency(inputs.budget)} production cannot cover its senior debt obligations. This structure is not financeable at current assumptions. The break-even sale is ${formatCompactCurrency(breakEven)}.`;
  }

  return (
    <div style={{ position: "relative", zIndex: 1, padding: "0 24px" }}>
      <h2 style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "28px",
        letterSpacing: "0.08em",
        color: "rgba(255,255,255,0.95)",
        textAlign: "center",
        marginBottom: "16px",
      }}>
        Your Deal, Summarized
      </h2>

      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "15px",
        lineHeight: 1.7,
        color: "rgba(255,255,255,0.75)",
        marginBottom: "20px",
      }}>
        {conclusion}
      </p>

      <div style={{
        ...ucardBase,
        borderLeft: "3px solid rgba(212,175,55,0.30)",
      }}>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px",
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.6,
          margin: 0,
        }}>
          This analysis covers your base case. The full Snapshot adds what happens
          when the base case breaks — sensitivity modeling across five acquisition
          scenarios, full risk flag detail with mitigation guidance, margin of safety
          calculations, and a white-label export for investor presentations.
        </p>
      </div>
    </div>
  );
};

// ─── VII. Sensitivity Section (Locked Teaser) ────────────────────

const SensitivitySection = ({
  inputs,
}: {
  inputs: WaterfallInputs;
}) => (
  <div style={s.section}>
    <h2 style={s.sectionTitle}>What If the Sale Comes In Different?</h2>

    <p style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: "14px",
      lineHeight: 1.65,
      color: "rgba(255,255,255,0.70)",
      margin: "16px 0 0",
    }}>
      No acquisition price is guaranteed. The question isn't whether your film sells for exactly {formatCompactCurrency(inputs.revenue)} — it's whether the deal still works if the number comes in lower.
    </p>

    <div style={{
      marginTop: "16px",
      padding: "32px 24px",
      background: "rgba(255,255,255,0.02)",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.08)",
      textAlign: "center",
    }}>
      <div style={{
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: "rgba(212,175,55,0.06)",
        border: "1px solid rgba(212,175,55,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 16px",
      }}>
        <Lock style={{ width: "22px", height: "22px", color: "rgba(212,175,55,0.50)" }} />
      </div>

      <p style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "20px",
        letterSpacing: "0.06em",
        color: "#FFFFFF",
        margin: "0 0 8px",
      }}>
        SENSITIVITY ANALYSIS
      </p>

      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "13px",
        color: "rgba(255,255,255,0.50)",
        lineHeight: 1.6,
        maxWidth: "320px",
        margin: "0 auto 20px",
      }}>
        See how your deal performs across bear, base, and bull scenarios. Understand which tiers break at lower revenue and where your margin of safety sits.
      </p>

      <div style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 14px",
        borderRadius: "999px",
        background: "rgba(212,175,55,0.06)",
        border: "1px solid rgba(212,175,55,0.12)",
      }}>
        <span style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "10px",
          letterSpacing: "0.1em",
          color: "rgba(212,175,55,0.60)",
          fontWeight: 500,
        }}>
          INCLUDED IN THE SNAPSHOT
        </span>
      </div>
    </div>
  </div>
);

// ─── VIII. Risk Flags Section (Teaser) ───────────────────────────

const RiskFlagsSection = ({
  inputs, result, guilds, breakEven,
}: {
  inputs: WaterfallInputs;
  result: WaterfallResult;
  guilds: GuildState;
  breakEven: number;
}) => {
  // Compute flag counts by category
  const structural: boolean[] = [
    inputs.salesExp === 0 && inputs.salesFee > 0,
    (inputs.debt + inputs.mezzanineDebt) / (inputs.budget || 1) > 0.40,
    inputs.premium > 25,
    inputs.equity === 0 && inputs.budget > 0,
    inputs.credits > 0,
  ];

  const commercial: boolean[] = [
    inputs.revenue > 0 && (inputs.revenue - breakEven) / inputs.revenue < 0.15,
    inputs.revenue === 0,
    inputs.revenue < inputs.budget && inputs.revenue > 0,
  ];

  const legal: boolean[] = [
    guilds.sag || guilds.wga || guilds.dga,
    true, // General legal flag — always fires
  ];

  const structuralCount = structural.filter(Boolean).length;
  const commercialCount = commercial.filter(Boolean).length;
  const legalCount = legal.filter(Boolean).length;
  const totalCount = structuralCount + commercialCount + legalCount;

  const categories: { label: string; count: number; color: string }[] = [];
  if (structuralCount > 0) categories.push({ label: "STRUCTURAL", count: structuralCount, color: "#F0A830" });
  if (commercialCount > 0) categories.push({ label: "COMMERCIAL", count: commercialCount, color: "#E67830" });
  if (legalCount > 0) categories.push({ label: "LEGAL", count: legalCount, color: "rgba(212,175,55,0.70)" });

  return (
    <div style={s.section}>
      <h2 style={s.sectionTitle}>What to Watch For</h2>

      <p style={{ ...s.bodyText, margin: "16px 0 0" }}>
        Every deal has structural risks. These flags are generated from your model inputs — not generic warnings.
      </p>

      <div style={{
        marginTop: "16px",
        padding: "32px 24px",
        background: "rgba(255,255,255,0.02)",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.08)",
        textAlign: "center",
      }}>
        {/* Big number */}
        <p style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "48px",
          fontWeight: 700,
          color: totalCount > 5 ? "#DC2626" : totalCount > 3 ? "#E67830" : "#F0A830",
          margin: "0 0 4px",
          lineHeight: 1,
        }}>
          {totalCount}
        </p>
        <p style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "12px",
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.50)",
          margin: "0 0 20px",
          textTransform: "uppercase",
        }}>
          Risk Flags Detected
        </p>

        {/* Category badges */}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
          {categories.map((cat) => (
            <span key={cat.label} style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.1em",
              color: cat.color,
              fontWeight: 500,
            }}>
              {cat.label}: {cat.count}
            </span>
          ))}
        </div>

        {/* Locked pill */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "6px 14px",
          borderRadius: "999px",
          background: "rgba(212,175,55,0.06)",
          border: "1px solid rgba(212,175,55,0.12)",
        }}>
          <span style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.1em",
            color: "rgba(212,175,55,0.60)",
            fontWeight: 500,
          }}>
            FULL DETAIL IN THE SNAPSHOT
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── IX. Next Steps + CTA Section ────────────────────────────────

const NextStepsSection = ({
  onExport, onNavigateTab,
}: {
  onExport?: () => void;
  onNavigateTab?: (tab: string) => void;
}) => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "01",
      title: "Review With Counsel",
      description: "Take the modeled stack and waterfall terms to entertainment counsel — particularly repayment priority, equity premium, and guild obligations.",
    },
    {
      number: "02",
      title: "Validate Your Price",
      description: "Check the acquisition price against current market comparables for your genre and budget range. The model is only as good as the revenue assumption.",
    },
    {
      number: "03",
      title: "Lead With Downside",
      description: "Use the bear case in investor conversations. Transparency about risk builds more trust than optimistic projections.",
    },
  ];

  return (
    <div style={s.section}>
      <h2 style={s.sectionTitle}>Next Steps</h2>

      {/* Steps */}
      <div style={{ margin: "16px 0 24px" }}>
        {steps.map((step, i) => (
          <div key={step.number} style={{
            display: "flex",
            gap: "12px",
            padding: "12px 0",
            borderBottom: i < steps.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
          }}>
            <span style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "12px",
              fontWeight: 600,
              color: "#D4AF37",
              minWidth: "24px",
            }}>
              {step.number}
            </span>
            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600, color: "#FFFFFF", margin: "0 0 2px" }}>
                {step.title}
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.5 }}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Resource Vault link */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "13px",
        color: "rgba(212,175,55,0.40)",
        textAlign: "center",
        padding: "12px 0",
      }}>
        Have questions about your analysis?{" "}
        <span
          onClick={() => navigate("/resources")}
          style={{ color: "rgba(212,175,55,0.55)", cursor: "pointer" }}
        >
          Visit our Resource Vault
        </span>
      </p>

      {/* Persistence note */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "12px",
        color: "rgba(255,255,255,0.35)",
        margin: "0 0 24px",
        lineHeight: 1.5,
      }}>
        This analysis is generated in real-time from your inputs. Export or screenshot to save your results.
      </p>

      {/* Dual CTA */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
        {/* Free button — gold outline */}
        <button
          onClick={() => onExport?.()}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "16px 24px",
            background: "transparent",
            border: "1px solid rgba(212,175,55,0.30)",
            borderRadius: "8px",
            color: "#D4AF37",
            cursor: "pointer",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "16px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <Download size={16} />
          EXPORT YOUR ANALYSIS
        </button>

        {/* Bridge text */}
        <p style={{
          textAlign: "center",
          fontFamily: "'Inter', sans-serif",
          fontSize: "12px",
          color: "rgba(255,255,255,0.40)",
          margin: 0,
          lineHeight: 1.5,
        }}>
          Remove branding and unlock sensitivity analysis, risk flags, and margin of safety.
        </p>

        {/* Paid button — gold filled */}
        <button
          onClick={() => navigate("/store/snapshot")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "16px 24px",
            background: "#F9E076",
            border: "none",
            borderRadius: "8px",
            color: "#000000",
            cursor: "pointer",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "16px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          GET THE FULL SNAPSHOT
        </button>
      </div>

      {/* Secondary link */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <a
          href="/store"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            color: "rgba(212,175,55,0.60)",
            textDecoration: "none",
          }}
        >
          See all packages →
        </a>
      </div>

      {/* Legal disclaimer */}
      <div style={{
        padding: "16px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "10px",
          color: "rgba(255,255,255,0.25)",
          lineHeight: 1.6,
          margin: 0,
        }}>
          This analysis is a financial modeling tool for educational purposes only. It does not constitute financial, legal, or investment advice.
          All projections are based on user-provided inputs and industry-standard assumptions. Actual results may vary significantly.
          Consult qualified professionals before making investment decisions. filmmaker.og is not a registered investment advisor.
        </p>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────

const WaterfallBrief = ({
  result,
  inputs,
  project,
  guilds,
  selections,
  onExport,
  onNavigateTab,
}: WaterfallBriefProps) => {
  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (documentRef.current) {
      documentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Derive selections from inputs if not provided
  const effectiveSelections: CapitalSelections = selections ?? {
    taxCredits: inputs.credits > 0,
    seniorDebt: inputs.debt > 0,
    gapLoan: inputs.mezzanineDebt > 0,
    equity: inputs.equity > 0,
    deferments: inputs.deferments > 0,
  };

  // Core computations
  const breakEven = calculateBreakeven(inputs, guilds, effectiveSelections);
  const tiers = computeTierPayments(result, inputs);
  const waterfallState = getWaterfallState(tiers, result.profitPool);
  const badge = waterfallBadgeStates[waterfallState];

  // Conditional checks
  const hasRevenue = inputs.revenue > 0;
  const hasBudget = inputs.budget > 0;
  const hasAnySources = inputs.debt > 0 || inputs.mezzanineDebt > 0 || inputs.equity > 0 || inputs.deferments > 0;

  // Source names for TLDR
  const sourceNames: string[] = [];
  if (inputs.debt > 0) sourceNames.push("senior debt");
  if (inputs.mezzanineDebt > 0) sourceNames.push("mezzanine financing");
  if (inputs.equity > 0) sourceNames.push("equity");
  if (inputs.deferments > 0) sourceNames.push("deferments");
  if (inputs.credits > 0) sourceNames.push("tax credits");
  if (sourceNames.length === 0) sourceNames.push("unspecified sources");

  // Genre
  const genre = project.genre === "Other" ? project.customGenre : project.genre;

  // Copy numbers for TLDR and return paragraph
  const netDistributable = Math.max(0, inputs.revenue - result.offTopTotal);
  const offTopPct = inputs.revenue > 0 ? (result.offTopTotal / inputs.revenue) * 100 : 0;
  const copyNumbers = {
    title: project.title.trim() || "This project",
    genre: genre.trim() || "film",
    budget: inputs.budget,
    revenue: inputs.revenue,
    equity: inputs.equity,
    multiple: result.multiple,
    producerPool: result.producer,
    investorReturn: result.investor,
    breakEven,
    netDistributable,
    offTopPct,
    profitPool: result.profitPool,
  };

  return (
    <div ref={documentRef} style={{
      margin: "0 -4px",
      background: "#0A0A0A",
      border: "1px solid rgba(212,175,55,0.25)",
      borderRadius: "14px",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Top glow */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "200px",
        background: "radial-gradient(ellipse at top, rgba(212,175,55,0.06), transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      {/* Topline */}
      <div style={{
        position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.50), transparent)",
        zIndex: 1,
      }} />

      {/* I. Cover */}
      <CoverSection
        project={project}
        inputs={inputs}
        result={result}
        waterfallState={waterfallState}
        tiers={tiers}
        breakEven={breakEven}
        badge={badge}
        copyNumbers={copyNumbers}
        sourceNames={sourceNames}
        guilds={guilds}
      />

      <SectionBreak />

      {/* II. Executive Summary */}
      <ExecutiveSummarySection
        inputs={inputs}
        result={result}
        breakEven={breakEven}
      />

      <SectionBreak />

      {/* III. Capital Stack */}
      <CapitalStackSection
        inputs={inputs}
        result={result}
      />

      <SectionBreak />

      {/* IV. Revenue & Deductions */}
      <RevenueDeductionsSection
        inputs={inputs}
        result={result}
        guilds={guilds}
        genre={genre.trim() || "film"}
      />

      <SectionBreak />

      {/* V. Waterfall Cascade */}
      {hasRevenue && (
        <>
          <WaterfallCascadeSection
            tiers={tiers}
            result={result}
            inputs={inputs}
            waterfallState={waterfallState}
          />
          <SectionBreak />
        </>
      )}

      {/* VI. Return Profile */}
      <ReturnProfileSection
        result={result}
        inputs={inputs}
        waterfallState={waterfallState}
        breakEven={breakEven}
        copyNumbers={copyNumbers}
        onNavigateTab={onNavigateTab}
        genre={genre.trim() || "film"}
      />

      {/* Conclusion */}
      <SectionBreak />
      <ConclusionSection
        inputs={inputs}
        result={result}
        waterfallState={waterfallState}
        tiers={tiers}
        breakEven={breakEven}
      />

      <SectionBreak />

      {/* VII. Sensitivity (Locked) */}
      <SensitivitySection inputs={inputs} />

      <SectionBreak />

      {/* VIII. Risk Flags (Teaser) */}
      <RiskFlagsSection
        inputs={inputs}
        result={result}
        guilds={guilds}
        breakEven={breakEven}
      />

      <SectionBreak />

      {/* IX. Next Steps + CTA */}
      <NextStepsSection
        onExport={onExport}
        onNavigateTab={onNavigateTab}
      />

      {/* Watermark */}
      <Watermark />
    </div>
  );
};

export default WaterfallBrief;
