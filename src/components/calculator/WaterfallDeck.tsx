import type { ProjectDetails } from "@/pages/Calculator";
import {
  WaterfallResult,
  WaterfallInputs,
  GuildState,
  formatCompactCurrency,
  formatMultiple,
} from "@/lib/waterfall";
import { getVerdictStatus } from "@/lib/design-system";
import { useEffect, useRef, useState } from "react";
import { useHaptics } from "@/hooks/use-haptics";
import {
  FileSpreadsheet,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────

interface WaterfallDeckProps {
  result: WaterfallResult;
  inputs: WaterfallInputs;
  project: ProjectDetails;
  guilds: GuildState;
  onExport?: () => void;
  onNavigateTab?: (tab: string) => void;
}

interface TierData {
  phase: number;
  label: string;
  amount: number;
  paid: number;
}

type CardTemperature = "warm" | "feature" | "data" | "neutral";

// ─── Reduced motion check ────────────────────────────────────────

const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

// ─── Shared Card Wrapper ─────────────────────────────────────────

const DeckCard = ({
  children,
  temperature = "data",
  glow,
  breathe = false,
}: {
  children: React.ReactNode;
  temperature?: CardTemperature;
  glow?: string;
  breathe?: boolean;
}) => {
  const borderOpacity = { warm: 0.35, feature: 0.25, data: 0.20, neutral: 0.15 }[temperature];
  const hasTopline = temperature === "warm" || temperature === "feature";

  return (
    <div
      style={{
        background: "#0A0A0A",
        border: `1px solid rgba(212,175,55,${borderOpacity})`,
        borderRadius: "12px",
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column" as const,
        position: "relative" as const,
        overflow: "hidden",
        minHeight: "calc(100vh - 62px - 48px - 40px)",
        justifyContent: "center",
        ...(breathe && !prefersReducedMotion() ? { animation: "deckBreathe 3s ease-in-out infinite" } : {}),
      }}
    >
      {/* Topline for warm/feature cards */}
      {hasTopline && (
        <div style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: "1px",
          background: `linear-gradient(90deg, transparent, rgba(212,175,55,${temperature === "warm" ? 0.60 : 0.40}), transparent)`,
        }} />
      )}

      {/* State-dependent radial glow */}
      {glow && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: glow,
          pointerEvents: "none",
        }} />
      )}

      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" as const, justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
};

// ─── Divider ─────────────────────────────────────────────────────

const Divider = () => (
  <div
    style={{ height: "1px", background: "rgba(212,175,55,0.08)", width: "100%" }}
  />
);

// ─── Watermark ───────────────────────────────────────────────────

const Watermark = () => (
  <div
    style={{
      textAlign: "center",
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: "11px",
      letterSpacing: "0.18em",
      color: "rgba(212,175,55,0.25)",
      marginTop: "auto",
      paddingTop: "32px",
    }}
  >
    ———— FILMMAKER.OG ————
  </div>
);

// ─── Shared Styles ───────────────────────────────────────────────

const styles = {
  sectionLabel: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.55)",
    margin: 0,
  } as React.CSSProperties,
  eyebrow: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "12px",
    letterSpacing: "0.2em",
    color: "rgba(212,175,55,0.55)",
    textAlign: "center" as const,
    margin: 0,
  } as React.CSSProperties,
};

// ─── Legend Dot (for capital bar) ────────────────────────────────

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: color, border: "1px solid rgba(212,175,55,0.15)" }} />
    <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>
      {label}
    </span>
  </div>
);

// ─── Card 1: THE PROJECT ─────────────────────────────────────────

const ProjectCard = ({ project }: { project: ProjectDetails }) => {
  const genre = project.genre === "Other" ? project.customGenre : project.genre;
  const hasGenre = genre.trim().length > 0;
  const hasStatus = project.status.trim().length > 0;
  const hasLogline = project.logline.trim().length > 0;

  // Team grid: collect non-empty fields
  const teamFields: { label: string; value: string }[] = [];
  if (project.producers.trim()) teamFields.push({ label: "PRODUCER(S)", value: project.producers });
  if (project.director.trim()) teamFields.push({ label: "DIRECTOR", value: project.director });
  if (project.writers.trim()) teamFields.push({ label: "WRITER(S)", value: project.writers });
  if (project.cast.trim()) teamFields.push({ label: "CAST", value: project.cast });

  const hasCompany = project.company.trim().length > 0;
  const hasLocation = project.location.trim().length > 0;

  return (
    <DeckCard temperature="neutral">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "16px",
        }}
      >
        {/* Eyebrow */}
        <p style={styles.eyebrow}>RECOUPMENT WATERFALL ANALYSIS</p>

        {/* Decorative gold divider with center dot */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "60%",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.40)" }} />
          <div
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#D4AF37",
            }}
          />
          <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.40)" }} />
        </div>

        {/* Project title as hero */}
        <h3
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "40px",
            color: "#fff",
            margin: 0,
            letterSpacing: "0.06em",
          }}
        >
          {project.title}
        </h3>

        {/* Logline */}
        {hasLogline && (
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "16px",
              color: "rgba(255,255,255,0.70)",
              margin: 0,
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const,
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {project.logline}
          </p>
        )}

        {/* Genre pill */}
        {hasGenre && (
          <div
            style={{
              display: "inline-flex",
              padding: "6px 18px",
              borderRadius: "999px",
              border: "1px solid rgba(212,175,55,0.30)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              letterSpacing: "0.06em",
              color: "#D4AF37",
            }}
          >
            {genre}
          </div>
        )}

        {/* Status badge */}
        {hasStatus && (
          <p
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "14px",
              color: "rgba(255,255,255,0.55)",
              margin: 0,
            }}
          >
            Status: {project.status}
          </p>
        )}

        {/* Gold divider */}
        {teamFields.length > 0 && (
          <div style={{ width: "100%", padding: "4px 0" }}>
            <Divider />
          </div>
        )}

        {/* Team grid — two-column layout */}
        {teamFields.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: teamFields.length === 1 ? "1fr" : "1fr 1fr",
              gap: "16px 20px",
              width: "100%",
              textAlign: "left",
            }}
          >
            {teamFields.map((field) => (
              <div key={field.label}>
                <p
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "11px",
                    letterSpacing: "0.12em",
                    color: "rgba(212,175,55,0.40)",
                    textTransform: "uppercase" as const,
                    margin: "0 0 2px",
                  }}
                >
                  {field.label}
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.70)",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Production company */}
        {hasCompany && (
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              color: "rgba(255,255,255,0.55)",
              margin: 0,
              width: "100%",
              textAlign: "left",
            }}
          >
            {project.company}
          </p>
        )}

        {/* Location */}
        {hasLocation && (
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              color: "rgba(255,255,255,0.40)",
              margin: 0,
              width: "100%",
              textAlign: "left",
            }}
          >
            {project.location}
          </p>
        )}
      </div>

      <Watermark />
    </DeckCard>
  );
};

// ─── Card 2: THE NUMBERS — Budget & Capital Stack ────────────────

const BudgetCard = ({
  inputs,
  guilds,
}: {
  inputs: WaterfallInputs;
  guilds: GuildState;
}) => {
  const activeGuilds: string[] = [];
  if (guilds.sag) activeGuilds.push("SAG-AFTRA");
  if (guilds.wga) activeGuilds.push("WGA");
  if (guilds.dga) activeGuilds.push("DGA");

  const hasCapitalSources = inputs.debt > 0 || inputs.mezzanineDebt > 0 || inputs.equity > 0 || inputs.deferments > 0;

  return (
    <DeckCard temperature="data">
      {/* Section: Total Negative Cost */}
      <p style={styles.sectionLabel}>TOTAL NEGATIVE COST</p>
      <p
        style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "56px",
          color: "#fff",
          textAlign: "center",
          margin: "8px 0 28px",
        }}
      >
        {formatCompactCurrency(inputs.budget)}
      </p>

      <Divider />

      {/* Proportional capital bar */}
      {hasCapitalSources && (
        <div style={{ margin: "24px 0" }}>
          <div style={{
            display: "flex",
            width: "100%",
            height: "32px",
            borderRadius: "6px",
            overflow: "hidden",
            border: "1px solid rgba(212,175,55,0.15)",
          }}>
            {inputs.debt > 0 && (
              <div style={{
                flex: inputs.debt / inputs.budget,
                background: "rgba(212,175,55,0.50)",
                minWidth: "2px",
              }} />
            )}
            {inputs.mezzanineDebt > 0 && (
              <div style={{
                flex: inputs.mezzanineDebt / inputs.budget,
                background: "rgba(212,175,55,0.35)",
                minWidth: "2px",
              }} />
            )}
            {inputs.equity > 0 && (
              <div style={{
                flex: inputs.equity / inputs.budget,
                background: "rgba(212,175,55,0.20)",
                minWidth: "2px",
              }} />
            )}
            {inputs.deferments > 0 && (
              <div style={{
                flex: inputs.deferments / inputs.budget,
                background: "rgba(255,255,255,0.08)",
                minWidth: "2px",
              }} />
            )}
          </div>
          {/* Legend row */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "10px",
          }}>
            {inputs.debt > 0 && (
              <LegendDot color="rgba(212,175,55,0.50)" label="Debt" />
            )}
            {inputs.mezzanineDebt > 0 && (
              <LegendDot color="rgba(212,175,55,0.35)" label="Mezz" />
            )}
            {inputs.equity > 0 && (
              <LegendDot color="rgba(212,175,55,0.20)" label="Equity" />
            )}
            {inputs.deferments > 0 && (
              <LegendDot color="rgba(255,255,255,0.08)" label="Deferments" />
            )}
          </div>
        </div>
      )}

      {/* Section: Capital Structure */}
      <p style={{ ...styles.sectionLabel, color: "#D4AF37", marginTop: hasCapitalSources ? "4px" : "28px" }}>
        CAPITAL STRUCTURE
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
        {inputs.debt > 0 && (
          <>
            <CapitalRow label="Senior Debt" value={formatCompactCurrency(inputs.debt)} />
            <CapitalSubRow label="Interest" value={`${inputs.seniorDebtRate}%`} />
          </>
        )}
        {inputs.mezzanineDebt > 0 && (
          <>
            <CapitalRow label="Mezzanine" value={formatCompactCurrency(inputs.mezzanineDebt)} />
            <CapitalSubRow label="Interest" value={`${inputs.mezzanineRate}%`} />
          </>
        )}
        {inputs.equity > 0 && (
          <>
            <CapitalRow label="Equity" value={formatCompactCurrency(inputs.equity)} />
            <CapitalSubRow label="Premium" value={`${inputs.premium}%`} />
          </>
        )}
        {inputs.deferments > 0 && (
          <CapitalRow label="Deferments" value={formatCompactCurrency(inputs.deferments)} />
        )}
        {inputs.credits > 0 && (
          <CapitalRow
            label="Tax Credits"
            value={`-${formatCompactCurrency(inputs.credits)}`}
            valueColor="#D4AF37"
          />
        )}
      </div>

      {activeGuilds.length > 0 && (
        <>
          <div style={{ marginTop: "28px" }}>
            <Divider />
          </div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              color: "rgba(255,255,255,0.55)",
              marginTop: "16px",
            }}
          >
            Guilds: {activeGuilds.join(", ")}
          </p>
        </>
      )}

      <Watermark />
    </DeckCard>
  );
};

const CapitalRow = ({
  label,
  value,
  valueColor = "#fff",
}: {
  label: string;
  value: string;
  valueColor?: string;
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <span
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "16px",
        color: "rgba(255,255,255,0.70)",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "16px",
        color: valueColor,
      }}
    >
      {value}
    </span>
  </div>
);

const CapitalSubRow = ({ label, value }: { label: string; value: string }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: "16px",
    }}
  >
    <span
      style={{
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "14px",
        color: "rgba(255,255,255,0.55)",
      }}
    >
      {"\u251C\u2500"} {label}
    </span>
    <span
      style={{
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "14px",
        color: "rgba(255,255,255,0.55)",
      }}
    >
      {value}
    </span>
  </div>
);

// ─── Card 3: THE REVENUE — Off-The-Tops ─────────────────────────

const RevenueCard = ({
  inputs,
  result,
  guilds,
}: {
  inputs: WaterfallInputs;
  result: WaterfallResult;
  guilds: GuildState;
}) => {
  const netDistributable = inputs.revenue - result.offTopTotal;
  const hasGuilds = guilds.sag || guilds.wga || guilds.dga;
  const netPct = inputs.revenue > 0 ? ((inputs.revenue - result.offTopTotal) / inputs.revenue) * 100 : 100;
  const deductedPct = inputs.revenue > 0 ? (result.offTopTotal / inputs.revenue) * 100 : 0;

  return (
    <DeckCard temperature="data">
      <p style={styles.sectionLabel}>GROSS REVENUE</p>
      <p
        style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "56px",
          color: "#fff",
          textAlign: "center",
          margin: "8px 0 28px",
        }}
      >
        {formatCompactCurrency(inputs.revenue)}
      </p>

      <Divider />

      <p style={{ ...styles.sectionLabel, color: "#D4AF37", marginTop: "28px" }}>
        OFF-THE-TOP DEDUCTIONS
      </p>

      {/* Deduction cascade — visual step-down */}
      <div style={{ margin: "20px 0" }}>
        <div style={{
          width: "100%",
          height: "20px",
          borderRadius: "4px",
          background: "rgba(255,255,255,0.10)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            width: `${netPct}%`,
            height: "100%",
            borderRadius: "4px 0 0 4px",
            background: "rgba(212,175,55,0.30)",
          }} />
        </div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "8px",
        }}>
          <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: "rgba(212,175,55,0.55)" }}>
            Net: {netPct.toFixed(0)}%
          </span>
          <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.40)" }}>
            Deducted: {deductedPct.toFixed(0)}%
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {result.cam > 0 && (
          <DeductionRow label="CAM Fee (1%)" value={formatCompactCurrency(result.cam)} />
        )}
        {result.salesFee > 0 && (
          <DeductionRow
            label={`Sales Agent (${inputs.salesFee}%)`}
            value={formatCompactCurrency(result.salesFee)}
          />
        )}
        {result.marketing > 0 && (
          <DeductionRow label="Marketing Cap" value={formatCompactCurrency(result.marketing)} />
        )}
        {hasGuilds && result.guilds > 0 && (
          <DeductionRow label="Guild Residuals" value={formatCompactCurrency(result.guilds)} />
        )}
      </div>

      <div style={{ marginTop: "28px" }}>
        <Divider />
      </div>

      <p style={{ ...styles.sectionLabel, color: "#D4AF37", marginTop: "28px" }}>
        NET DISTRIBUTABLE
      </p>
      <p
        style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "32px",
          color: "#D4AF37",
          textAlign: "center",
          margin: "8px 0 4px",
        }}
      >
        {formatCompactCurrency(netDistributable)}
      </p>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "14px",
          color: "rgba(255,255,255,0.55)",
          textAlign: "center",
        }}
      >
        This flows into the waterfall
      </p>

      <Watermark />
    </DeckCard>
  );
};

const DeductionRow = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "16px",
        color: "rgba(255,255,255,0.70)",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "16px",
        color: "rgba(255,255,255,0.70)",
      }}
    >
      -{value}
    </span>
  </div>
);

// ─── Card 4: THE WATERFALL — Consolidated ────────────────────────

const CompactRevenueHeader = ({
  revenue,
  cam,
  netDistributable,
}: {
  revenue: number;
  cam: number;
  netDistributable: number;
}) => (
  <div style={{ marginBottom: "20px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "14px", color: "rgba(255,255,255,0.70)" }}>
        GROSS REVENUE
      </span>
      <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "14px", color: "#fff" }}>
        {formatCompactCurrency(revenue)}
      </span>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
      <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "14px", color: "rgba(255,255,255,0.70)" }}>
        CAM (1%)
      </span>
      <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "14px", color: "rgba(255,255,255,0.70)" }}>
        -{formatCompactCurrency(cam)}
      </span>
    </div>
    <div style={{ margin: "10px 0" }}>
      <Divider />
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "14px", color: "#D4AF37" }}>
        NET DISTRIBUTABLE
      </span>
      <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "14px", color: "#D4AF37" }}>
        {formatCompactCurrency(netDistributable)}
      </span>
    </div>
    <div style={{ margin: "14px 0" }}>
      <Divider />
    </div>
  </div>
);

const TierRow = ({ tier }: { tier: TierData }) => {
  const pct = tier.amount > 0 ? Math.min(100, (tier.paid / tier.amount) * 100) : 0;
  const isFullyRecouped = pct >= 100;
  const isUnfunded = tier.paid === 0 && tier.amount > 0;
  const reducedMotion = prefersReducedMotion();

  return (
    <div style={{ padding: "14px 0" }}>
      {/* Phase + Label */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "12px", letterSpacing: "0.1em", color: "rgba(212,175,55,0.55)" }}>
          PHASE {tier.phase}
        </span>
        <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>·</span>
        <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "14px", letterSpacing: "0.06em", color: "#fff" }}>
          {tier.label.toUpperCase()}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            flex: 1,
            height: "14px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              borderRadius: "999px",
              background: "#D4AF37",
              transition: reducedMotion ? "none" : "width 0.5s ease",
            }}
          />
        </div>
        <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "14px", color: isFullyRecouped ? "#D4AF37" : "rgba(255,255,255,0.55)", minWidth: "32px", textAlign: "right" }}>
          {pct.toFixed(0)}%
        </span>
      </div>

      {/* Amounts — two-column layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "4px 16px",
        marginTop: "8px",
      }}>
        <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "14px", color: isFullyRecouped ? "#D4AF37" : "rgba(255,255,255,0.55)" }}>
          Owed: {formatCompactCurrency(tier.amount)}
        </span>
        <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "14px", color: isFullyRecouped ? "#D4AF37" : "rgba(255,255,255,0.55)", textAlign: "right" }}>
          Paid: {formatCompactCurrency(tier.paid)}
        </span>
      </div>

      {/* Status badge */}
      <div style={{ marginTop: "8px" }}>
        {isFullyRecouped ? (
          <span
            style={{
              display: "inline-block",
              padding: "2px 10px",
              borderRadius: "999px",
              border: "1px solid rgba(212,175,55,0.30)",
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.12em",
              color: "#D4AF37",
            }}
          >
            FULLY RECOUPED
          </span>
        ) : (
          <span
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.12em",
              color: isUnfunded ? "rgba(255,255,255,0.40)" : "rgba(255,255,255,0.55)",
            }}
          >
            {isUnfunded ? "UNFUNDED" : `${pct.toFixed(0)}% RECOUPED`}
          </span>
        )}
      </div>
    </div>
  );
};

const WaterfallCard = ({
  tiers,
  showCompactRevenue,
  inputs,
  result,
}: {
  tiers: TierData[];
  showCompactRevenue: boolean;
  inputs: WaterfallInputs;
  result: WaterfallResult;
}) => {
  const netDistributable = inputs.revenue - result.offTopTotal;

  return (
    <DeckCard temperature="data">
      <p style={styles.sectionLabel}>RECOUPMENT CASCADE</p>
      <div style={{ marginTop: "20px" }}>
        {showCompactRevenue && (
          <CompactRevenueHeader
            revenue={inputs.revenue}
            cam={result.cam}
            netDistributable={netDistributable}
          />
        )}

        {tiers.map((tier, i) => (
          <div key={tier.label}>
            <TierRow tier={tier} />
            {i < tiers.length - 1 && (
              <div style={{ padding: "4px 0" }}>
                <Divider />
              </div>
            )}
          </div>
        ))}
      </div>

      <Watermark />
    </DeckCard>
  );
};

// ─── Card 5: THE VERDICT ─────────────────────────────────────────

const VerdictCard = ({
  result,
  inputs,
  onNavigateTab,
}: {
  result: WaterfallResult;
  inputs: WaterfallInputs;
  onNavigateTab?: (tab: string) => void;
}) => {
  const verdict = getVerdictStatus(result.multiple, result.profitPool > 0);
  const recoupPct = Math.min(100, result.recoupPct);
  const reducedMotion = prefersReducedMotion();

  // State-dependent glow
  let glow: string | undefined;
  if (result.multiple > 1.0 && result.profitPool > 0) {
    glow = "radial-gradient(ellipse at top, rgba(212,175,55,0.06), transparent 60%)";
  } else if (result.multiple < 1.0 || result.profitPool <= 0) {
    glow = "radial-gradient(ellipse at top, rgba(220,38,38,0.04), transparent 60%)";
  }

  return (
    <DeckCard temperature="warm" glow={glow} breathe>
      {/* Verdict badge */}
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            display: "inline-block",
            padding: "6px 18px",
            borderRadius: "999px",
            background: `${verdict.color}20`,
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
            color: verdict.color,
          }}
        >
          {verdict.label}
        </span>
      </div>

      {/* Hero multiple */}
      <p
        style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "64px",
          fontWeight: 500,
          color: verdict.color,
          textAlign: "center",
          margin: "16px 0 8px",
        }}
      >
        {formatMultiple(result.multiple)}
      </p>

      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "16px",
          color: "rgba(255,255,255,0.55)",
          textAlign: "center",
          margin: "0 0 28px",
        }}
      >
        {verdict.description}
      </p>

      <Divider />

      {/* Investor / Producer breakdown */}
      <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <p style={styles.sectionLabel}>INVESTOR RETURN</p>
          <p
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "32px",
              color: "#fff",
              margin: "4px 0 0",
            }}
          >
            {formatCompactCurrency(result.investor)}
          </p>
          {inputs.equity > 0 && (
            <p
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: "14px",
                color: "rgba(255,255,255,0.55)",
                margin: "2px 0 0",
              }}
            >
              on {formatCompactCurrency(inputs.equity)} invested
            </p>
          )}
        </div>
        <div>
          <p style={styles.sectionLabel}>PRODUCER SHARE</p>
          <p
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "32px",
              color: "#fff",
              margin: "4px 0 0",
            }}
          >
            {formatCompactCurrency(result.producer)}
          </p>
        </div>
      </div>

      <div style={{ marginTop: "28px" }}>
        <Divider />
      </div>

      {/* Recoupment bar */}
      <div style={{ marginTop: "28px" }}>
        <p style={styles.sectionLabel}>RECOUPMENT</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "14px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${recoupPct}%`,
                height: "100%",
                borderRadius: "999px",
                background: "#D4AF37",
                transition: reducedMotion ? "none" : "width 0.5s ease",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "14px",
              color: "rgba(255,255,255,0.55)",
              minWidth: "36px",
              textAlign: "right",
            }}
          >
            {recoupPct.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Edit escape hatch */}
      {onNavigateTab && (
        <>
          <div style={{ marginTop: "28px" }}>
            <Divider />
          </div>
          <button
            onClick={() => onNavigateTab("deal")}
            style={{
              display: "block",
              width: "100%",
              marginTop: "16px",
              padding: "8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              color: "rgba(212,175,55,0.60)",
              textAlign: "center",
            }}
          >
            Adjust your deal →
          </button>
        </>
      )}

      <Watermark />
    </DeckCard>
  );
};

// ─── Card 6: NEXT STEPS — Export CTA ─────────────────────────────

const ExportCard = ({ onExport }: { onExport: () => void }) => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <DeckCard temperature="feature">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "20px",
        }}
      >
        <h3
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "28px",
            letterSpacing: "0.12em",
            color: "#D4AF37",
            margin: 0,
          }}
        >
          READY TO SHARE?
        </h3>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "16px",
            color: "rgba(255,255,255,0.70)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Turn this analysis into a branded investor package — designed for the
          boardroom, not the back office.
        </p>

        {/* CTA Button */}
        <button
          onClick={onExport}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            padding: "20px 24px",
            background: "#F9E076",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "16px",
            letterSpacing: "0.12em",
            cursor: "pointer",
          }}
          onMouseDown={(e) => ((e.currentTarget.style.transform = "scale(0.98)"))}
          onMouseUp={(e) => ((e.currentTarget.style.transform = "scale(1)"))}
          onTouchStart={(e) => ((e.currentTarget.style.transform = "scale(0.98)"))}
          onTouchEnd={(e) => ((e.currentTarget.style.transform = "scale(1)"))}
        >
          <FileSpreadsheet size={16} />
          EXPORT YOUR FINANCIAL SNAPSHOT
        </button>
      </div>

      {/* Collapsible disclaimer */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setShowDisclaimer(!showDisclaimer)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px 0",
            color: "rgba(255,255,255,0.55)",
            width: "100%",
          }}
        >
          <AlertTriangle size={14} />
          <span
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
            }}
          >
            Legal Disclaimer
          </span>
          <span style={{ marginLeft: "auto" }}>
            {showDisclaimer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </button>
        <div
          style={{
            maxHeight: showDisclaimer ? "200px" : "0px",
            overflow: "hidden",
            transition: "max-height 0.3s ease",
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.6,
              padding: "8px 0",
              margin: 0,
            }}
          >
            This calculator is for educational purposes only. Consult a qualified
            entertainment attorney before making any financing decisions.
          </p>
        </div>
      </div>

      <Watermark />
    </DeckCard>
  );
};

// ─── Main Deck Component ─────────────────────────────────────────

const WaterfallDeck = ({ result, inputs, project, guilds, onExport, onNavigateTab }: WaterfallDeckProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevIndex = useRef(0);
  const haptics = useHaptics();
  const [hasInteracted, setHasInteracted] = useState(false);

  // ── Build tier data ─────────────────────────────────────────

  let remaining = inputs.revenue - result.offTopTotal;
  const tierData: TierData[] = [];
  let phaseNum = 1;

  if (result.seniorDebtHurdle > 0) {
    const paid = Math.min(result.seniorDebtHurdle, Math.max(0, remaining));
    remaining -= paid;
    tierData.push({ phase: phaseNum++, label: "Senior Debt", amount: result.seniorDebtHurdle, paid });
  }

  if (result.mezzDebtHurdle > 0) {
    const paid = Math.min(result.mezzDebtHurdle, Math.max(0, remaining));
    remaining -= paid;
    tierData.push({ phase: phaseNum++, label: "Gap / Mezzanine", amount: result.mezzDebtHurdle, paid });
  }

  if (result.equityHurdle > 0) {
    const paid = Math.min(result.equityHurdle, Math.max(0, remaining));
    remaining -= paid;
    tierData.push({ phase: phaseNum++, label: "Equity + Premium", amount: result.equityHurdle, paid });
  }

  if (inputs.deferments > 0) {
    const paid = Math.min(inputs.deferments, Math.max(0, remaining));
    remaining -= paid;
    tierData.push({ phase: phaseNum++, label: "Deferments", amount: inputs.deferments, paid });
  }

  // ── Determine if revenue card should render ─────────────────
  // Skip revenue card if the only off-the-top is CAM (i.e., no sales fee, marketing, or guild residuals)
  const hasMeaningfulOffTops = result.salesFee > 0 || result.marketing > 0 || result.guilds > 0;
  const showRevenueCard = hasMeaningfulOffTops;

  // ── Build cards array ───────────────────────────────────────

  const hasTitle = project.title.trim().length > 0;

  const cards: React.ReactNode[] = [];

  // Card 1: Project (conditional)
  if (hasTitle) {
    cards.push(<ProjectCard key="project" project={project} />);
  }

  // Card 2: Budget (always)
  cards.push(<BudgetCard key="budget" inputs={inputs} guilds={guilds} />);

  // Card 3: Revenue (conditional)
  if (showRevenueCard) {
    cards.push(<RevenueCard key="revenue" inputs={inputs} result={result} guilds={guilds} />);
  }

  // Card 4: Consolidated Waterfall (always)
  cards.push(
    <WaterfallCard
      key="waterfall"
      tiers={tierData}
      showCompactRevenue={!showRevenueCard}
      inputs={inputs}
      result={result}
    />
  );

  // Card 5: Verdict (always)
  cards.push(
    <VerdictCard
      key="verdict"
      result={result}
      inputs={inputs}
      onNavigateTab={onNavigateTab}
    />
  );

  // Card 6: Export CTA (only when onExport is defined)
  if (onExport) {
    cards.push(<ExportCard key="export" onExport={onExport} />);
  }

  // ── Stop breathing after first interaction ──────────────────

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleInteraction = () => setHasInteracted(true);
    container.addEventListener("scroll", handleInteraction, { once: true });
    return () => container.removeEventListener("scroll", handleInteraction);
  }, []);

  // ── IntersectionObserver for current card tracking ──────────

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(index)) setCurrentIndex(index);
          }
        });
      },
      { root: container, threshold: 0.5 }
    );

    container.querySelectorAll("[data-index]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [cards.length]);

  // ── Haptic feedback on card change ──────────────────────────

  useEffect(() => {
    if (currentIndex !== prevIndex.current) {
      haptics.light();
      prevIndex.current = currentIndex;
    }
  }, [currentIndex, haptics]);

  return (
    <div>
      {/* Styles */}
      <style>{`
        [data-deck-scroll]::-webkit-scrollbar { display: none; }
        @keyframes deckBreathe {
          0%, 100% { border-color: rgba(212,175,55,0.35); }
          50% { border-color: rgba(212,175,55,0.45); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes deckBreathe {
            0%, 100% { border-color: rgba(212,175,55,0.35); }
          }
        }
      `}</style>

      {/* Scroll-snap container */}
      <div
        ref={scrollRef}
        data-deck-scroll
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          gap: "12px",
          padding: "0 20px",
          width: "100%",
        }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            data-index={i}
            style={{
              flex: "0 0 calc(100% - 24px)",
              scrollSnapAlign: "center",
            }}
          >
            {card}
          </div>
        ))}
      </div>

      {/* Tappable dot pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "6px",
          padding: "16px 0",
        }}
      >
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const container = scrollRef.current;
              if (!container) return;
              const target = container.querySelector(`[data-index="${i}"]`);
              if (target) target.scrollIntoView({ behavior: "smooth", inline: "center" });
            }}
            aria-label={`Go to card ${i + 1}`}
            style={{
              width: i === currentIndex ? "20px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background: i === currentIndex ? "#D4AF37" : "rgba(255,255,255,0.25)",
              transition: "all 0.3s ease",
              border: "none",
              padding: 0,
              cursor: "pointer",
              boxSizing: "content-box",
              paddingBlock: "12px",
              marginBlock: "-12px",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WaterfallDeck;
