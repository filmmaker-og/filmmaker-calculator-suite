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
  Sparkles,
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
}

interface TierData {
  phase: number;
  label: string;
  amount: number;
  paid: number;
}

// ─── Shared Card Wrapper ─────────────────────────────────────────

const DeckCard = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      background: "#0A0A0A",
      border: "1px solid rgba(212,175,55,0.15)",
      borderRadius: "12px",
      padding: "28px 24px",
      display: "flex",
      flexDirection: "column" as const,
      position: "relative" as const,
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

// ─── Divider ─────────────────────────────────────────────────────

const Divider = () => (
  <div
    style={{ height: "1px", background: "rgba(255,255,255,0.06)", width: "100%" }}
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
      color: "rgba(255,255,255,0.15)",
      marginTop: "auto",
      paddingTop: "24px",
    }}
  >
    ———— FILMMAKER.OG ————
  </div>
);

// ─── Card 1: Cover ───────────────────────────────────────────────

const CoverCard = ({ project }: { project: ProjectDetails }) => {
  const hasTitle = project.title.trim().length > 0;
  const hasCompany = project.company.trim().length > 0;
  const genre = project.genre === "Other" ? project.customGenre : project.genre;
  const hasGenre = genre.trim().length > 0;
  const hasStatus = project.status.trim().length > 0;

  return (
    <DeckCard>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: "16px",
          minHeight: "280px",
        }}
      >
        {/* Header */}
        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "22px",
            letterSpacing: "0.18em",
            color: "#D4AF37",
            margin: 0,
          }}
        >
          RECOUPMENT WATERFALL ANALYSIS
        </h2>

        {/* Decorative divider with center dot */}
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

        {/* Project details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {hasTitle && (
            <h3
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "28px",
                color: "#fff",
                margin: 0,
                letterSpacing: "0.06em",
              }}
            >
              {project.title}
            </h3>
          )}

          {hasCompany && (
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                color: "rgba(255,255,255,0.40)",
                margin: 0,
              }}
            >
              {project.company}
            </p>
          )}
        </div>

        {hasGenre && (
          <div
            style={{
              display: "inline-flex",
              padding: "4px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(212,175,55,0.30)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.06em",
              color: "#D4AF37",
            }}
          >
            {genre}
          </div>
        )}

        {hasStatus && (
          <p
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "11px",
              color: "rgba(255,255,255,0.40)",
              margin: 0,
            }}
          >
            Status: {project.status}
          </p>
        )}
      </div>

      <Watermark />
    </DeckCard>
  );
};

// ─── Card 2: Budget & Capital Stack ──────────────────────────────

const BudgetCard = ({
  inputs,
  guilds,
  result,
}: {
  inputs: WaterfallInputs;
  guilds: GuildState;
  result: WaterfallResult;
}) => {
  const activeGuilds: string[] = [];
  if (guilds.sag) activeGuilds.push("SAG-AFTRA");
  if (guilds.wga) activeGuilds.push("WGA");
  if (guilds.dga) activeGuilds.push("DGA");

  return (
    <DeckCard>
      {/* Section: Total Negative Cost */}
      <p style={styles.sectionLabel}>TOTAL NEGATIVE COST</p>
      <p
        style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "32px",
          color: "#fff",
          textAlign: "center",
          margin: "8px 0 20px",
        }}
      >
        {formatCompactCurrency(inputs.budget)}
      </p>

      <Divider />

      {/* Section: Capital Structure */}
      <p style={{ ...styles.sectionLabel, color: "#D4AF37", marginTop: "20px" }}>
        CAPITAL STRUCTURE
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
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
          <div style={{ marginTop: "20px" }}>
            <Divider />
          </div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              color: "rgba(255,255,255,0.40)",
              marginTop: "12px",
            }}
          >
            Guilds: {activeGuilds.join(", ")}
          </p>
        </>
      )}
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
        fontSize: "13px",
        color: "rgba(255,255,255,0.70)",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "13px",
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
        fontSize: "11px",
        color: "rgba(255,255,255,0.40)",
      }}
    >
      {"\u251C\u2500"} {label}
    </span>
    <span
      style={{
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "11px",
        color: "rgba(255,255,255,0.40)",
      }}
    >
      {value}
    </span>
  </div>
);

// ─── Card 3: Revenue & Off-The-Tops ─────────────────────────────

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

  return (
    <DeckCard>
      <p style={styles.sectionLabel}>GROSS REVENUE</p>
      <p
        style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "32px",
          color: "#fff",
          textAlign: "center",
          margin: "8px 0 20px",
        }}
      >
        {formatCompactCurrency(inputs.revenue)}
      </p>

      <Divider />

      <p style={{ ...styles.sectionLabel, color: "#D4AF37", marginTop: "20px" }}>
        OFF-THE-TOP DEDUCTIONS
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
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

      <div style={{ marginTop: "20px" }}>
        <Divider />
      </div>

      <p style={{ ...styles.sectionLabel, color: "#D4AF37", marginTop: "20px" }}>
        NET DISTRIBUTABLE
      </p>
      <p
        style={{
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "24px",
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
          fontSize: "11px",
          color: "rgba(255,255,255,0.40)",
          textAlign: "center",
        }}
      >
        This flows into the waterfall
      </p>
    </DeckCard>
  );
};

const DeductionRow = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "13px",
        color: "rgba(255,255,255,0.70)",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "13px",
        color: "rgba(255,255,255,0.70)",
      }}
    >
      -{value}
    </span>
  </div>
);

// ─── Cards 4–N: Waterfall Tier Cards ─────────────────────────────

const TierCard = ({ tier }: { tier: TierData }) => {
  const pct = tier.amount > 0 ? Math.min(100, (tier.paid / tier.amount) * 100) : 0;
  const remaining = tier.amount - tier.paid;
  const isFullyRecouped = pct >= 100;
  const isUnfunded = tier.paid === 0;

  return (
    <DeckCard>
      <p style={styles.sectionLabel}>PHASE {tier.phase}</p>
      <h3
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "22px",
          letterSpacing: "0.12em",
          color: "#fff",
          margin: "4px 0 16px",
        }}
      >
        {tier.label}
      </h3>

      <Divider />

      {/* Progress bar */}
      <div style={{ margin: "20px 0" }}>
        <div
          style={{
            width: "100%",
            height: "8px",
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
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          <span
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "12px",
              color: isFullyRecouped ? "#D4AF37" : "rgba(255,255,255,0.40)",
            }}
          >
            {formatCompactCurrency(tier.paid)} of {formatCompactCurrency(tier.amount)}
          </span>
          <span
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "12px",
              color: isFullyRecouped ? "#D4AF37" : "rgba(255,255,255,0.40)",
            }}
          >
            {pct.toFixed(0)}%
          </span>
        </div>
      </div>

      <Divider />

      {/* Amount details */}
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <p style={styles.sectionLabel}>AMOUNT OWED</p>
          <p style={{ ...styles.heroSmall, color: "#fff" }}>
            {formatCompactCurrency(tier.amount)}
          </p>
        </div>
        <div>
          <p style={styles.sectionLabel}>AMOUNT PAID</p>
          <p
            style={{
              ...styles.heroSmall,
              color: isFullyRecouped ? "#D4AF37" : "#fff",
            }}
          >
            {formatCompactCurrency(tier.paid)}
          </p>
        </div>
        <div>
          <p style={styles.sectionLabel}>REMAINING</p>
          <p
            style={{
              ...styles.heroSmall,
              color: remaining === 0 ? "#D4AF37" : "#fff",
            }}
          >
            {formatCompactCurrency(remaining)}
          </p>
        </div>
      </div>

      {/* Status badge */}
      <div style={{ marginTop: "20px" }}>
        {isFullyRecouped ? (
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "999px",
              border: "1px solid rgba(212,175,55,0.30)",
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "10px",
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
              fontSize: "10px",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.40)",
            }}
          >
            {isUnfunded ? "UNFUNDED" : `${pct.toFixed(0)}% RECOUPED`}
          </span>
        )}
      </div>
    </DeckCard>
  );
};

// ─── Card N+1: Verdict ───────────────────────────────────────────

const VerdictCard = ({
  result,
  inputs,
}: {
  result: WaterfallResult;
  inputs: WaterfallInputs;
}) => {
  const verdict = getVerdictStatus(result.multiple, result.profitPool > 0);
  const recoupPct = Math.min(100, result.recoupPct);

  return (
    <DeckCard>
      {/* Verdict badge */}
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            display: "inline-block",
            padding: "4px 14px",
            borderRadius: "999px",
            background: `${verdict.color}20`,
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "10px",
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
          fontSize: "48px",
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
          fontSize: "13px",
          color: "rgba(255,255,255,0.40)",
          textAlign: "center",
          margin: "0 0 20px",
        }}
      >
        {verdict.description}
      </p>

      <Divider />

      {/* Investor / Producer breakdown */}
      <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <p style={styles.sectionLabel}>INVESTOR RETURN</p>
          <p
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "20px",
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
                fontSize: "11px",
                color: "rgba(255,255,255,0.40)",
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
              fontSize: "20px",
              color: "#fff",
              margin: "4px 0 0",
            }}
          >
            {formatCompactCurrency(result.producer)}
          </p>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Divider />
      </div>

      {/* Recoupment bar */}
      <div style={{ marginTop: "20px" }}>
        <p style={styles.sectionLabel}>RECOUPMENT</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "8px",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "8px",
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
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "12px",
              color: "rgba(255,255,255,0.40)",
              minWidth: "36px",
              textAlign: "right",
            }}
          >
            {recoupPct.toFixed(0)}%
          </span>
        </div>
      </div>
    </DeckCard>
  );
};

// ─── Card N+2: Export CTA ────────────────────────────────────────

const ExportCard = ({ onExport }: { onExport?: () => void }) => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <DeckCard>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "16px",
          minHeight: "240px",
          justifyContent: "center",
        }}
      >
        <h3
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "22px",
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
            fontSize: "14px",
            color: "rgba(255,255,255,0.70)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Turn these numbers into a professional investor package. Beautifully
          designed. Presentation-grade.
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
            padding: "16px 24px",
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
      <div style={{ marginTop: "16px" }}>
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
            color: "rgba(255,255,255,0.40)",
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
              color: "rgba(255,255,255,0.40)",
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

// ─── Shared Styles ───────────────────────────────────────────────

const styles = {
  sectionLabel: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "10px",
    fontWeight: 500,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.40)",
    margin: 0,
  } as React.CSSProperties,
  heroSmall: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "24px",
    margin: "4px 0 0",
  } as React.CSSProperties,
};

// ─── Main Deck Component ─────────────────────────────────────────

const WaterfallDeck = ({ result, inputs, project, guilds, onExport }: WaterfallDeckProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevIndex = useRef(0);
  const haptics = useHaptics();

  // ── Build tier cards ──────────────────────────────────────────

  let remaining = inputs.revenue - result.offTopTotal;
  const tierCards: TierData[] = [];
  let phaseNum = 1;

  if (result.seniorDebtHurdle > 0) {
    const paid = Math.min(result.seniorDebtHurdle, Math.max(0, remaining));
    remaining -= paid;
    tierCards.push({ phase: phaseNum++, label: "Senior Debt", amount: result.seniorDebtHurdle, paid });
  }

  if (result.mezzDebtHurdle > 0) {
    const paid = Math.min(result.mezzDebtHurdle, Math.max(0, remaining));
    remaining -= paid;
    tierCards.push({ phase: phaseNum++, label: "Gap / Mezzanine", amount: result.mezzDebtHurdle, paid });
  }

  if (result.equityHurdle > 0) {
    const paid = Math.min(result.equityHurdle, Math.max(0, remaining));
    remaining -= paid;
    tierCards.push({ phase: phaseNum++, label: "Equity + Premium", amount: result.equityHurdle, paid });
  }

  if (inputs.deferments > 0) {
    const paid = Math.min(inputs.deferments, Math.max(0, remaining));
    remaining -= paid;
    tierCards.push({ phase: phaseNum++, label: "Deferments", amount: inputs.deferments, paid });
  }

  // ── Build cards array ─────────────────────────────────────────

  const cards: React.ReactNode[] = [
    <CoverCard key="cover" project={project} />,
    <BudgetCard key="budget" inputs={inputs} guilds={guilds} result={result} />,
    <RevenueCard key="revenue" inputs={inputs} result={result} guilds={guilds} />,
    ...tierCards.map((tier) => <TierCard key={tier.label} tier={tier} />),
    <VerdictCard key="verdict" result={result} inputs={inputs} />,
    ...(onExport ? [<ExportCard key="export" onExport={onExport} />] : []),
  ];

  // ── IntersectionObserver for current card tracking ────────────

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

  // ── Haptic feedback on card change ────────────────────────────

  useEffect(() => {
    if (currentIndex !== prevIndex.current) {
      haptics.light();
      prevIndex.current = currentIndex;
    }
  }, [currentIndex, haptics]);

  return (
    <div>
      {/* Scrollbar-hide style */}
      <style>{`[data-deck-scroll]::-webkit-scrollbar { display: none; }`}</style>

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
        }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            data-index={i}
            style={{
              flex: "0 0 calc(100% - 12px)",
              scrollSnapAlign: "center",
            }}
          >
            {card}
          </div>
        ))}
      </div>

      {/* Dot pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "6px",
          padding: "16px 0",
        }}
      >
        {cards.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === currentIndex ? "20px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background:
                i === currentIndex ? "#D4AF37" : "rgba(255,255,255,0.15)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WaterfallDeck;
