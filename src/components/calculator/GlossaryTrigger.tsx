import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface GlossaryTerm {
  term: string;
  title: string;
  description: string;
  details?: React.ReactNode;
}

export const GLOSSARY: Record<string, GlossaryTerm> = {
  negativeCost: {
    term: "Negative Cost",
    title: "NEGATIVE COST",
    description: "The actual cost to produce the finished film, excluding marketing and sales fees.",
    details: (
      <p>Includes all development, production, and post-production expenses. This is the number you need to raise or finance.</p>
    ),
  },
  capitalStack: {
    term: "Capital Stack",
    title: "CAPITAL STACK",
    description: "The combination of different funding sources used to finance your budget.",
    details: (
      <p>Typically includes tax credits, pre-sales (senior debt), gap loans, and equity investment.</p>
    ),
  },
  seniorDebt: {
    term: "Senior Debt",
    title: "SENIOR DEBT",
    description: "First-position loans secured by reliable collateral like tax credits or pre-sale contracts.",
    details: (
      <p>Lowest risk capital with the lowest interest rates (typically 5-10% + SOFR). Paid back first.</p>
    ),
  },
  mezzanineDebt: {
    term: "Mezzanine Debt",
    title: "MEZZANINE / GAP",
    description: "High-interest loans that bridge the gap between senior debt and equity.",
    details: (
      <p>Higher risk than senior debt. Secured against unsold territories. Costs more (15-20% interest + fees).</p>
    ),
  },
  equity: {
    term: "Equity",
    title: "EQUITY",
    description: "Cash investment in exchange for ownership and backend profits.",
    details: (
      <p>Highest risk, highest reward. Investors get their principal back + a premium (20%) + 50% of net profits.</p>
    ),
  },
  waterfall: {
    term: "Waterfall",
    title: "THE WATERFALL",
    description: "The strict priority order in which revenue flows from the box office to stakeholders.",
    details: (
      <p>Money trickles down: Theaters → Distributor → Sales Agent → Lenders → Investors → Producers. <a href="/waterfall-info" style={{ color: "#D4AF37", textDecoration: "none" }}>See full breakdown</a>.</p>
    ),
  },
  cam: {
    term: "CAM",
    title: "CAM CHARGES",
    description: "Collection Account Management fees. A third party that receives revenue and splits it.",
    details: (
      <p>Essential for transparency. The CAM ensures everyone gets paid their correct share automatically.</p>
    ),
  },
};

const triggerStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  border: "1px solid rgba(212,175,55,0.25)",
  background: "transparent",
  cursor: "pointer",
  transition: "border-color 0.2s, background 0.2s",
  padding: 0,
  flexShrink: 0,
};

const triggerHoverStyle: React.CSSProperties = {
  ...triggerStyle,
  borderColor: "rgba(212,175,55,0.50)",
  background: "rgba(212,175,55,0.06)",
};

const GlossaryTrigger = ({
  term,
  title,
  description,
  details,
}: GlossaryTerm & { className?: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <button
            style={isHovered ? triggerHoverStyle : triggerStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(!isOpen);
            }}
          >
            {/* Lucide Info icon — circle + vertical line + dot */}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(212,175,55,0.50)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" as const, borderWidth: 0 }}>
              Info about {term}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-[300px] p-4 shadow-xl z-50"
          style={{ background: "#1A1A1C", border: "1px solid rgba(212,175,55,0.20)" }}
          sideOffset={5}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px", letterSpacing: "0.05em", color: "#D4AF37" }}>
              {title}
            </h4>
            <p style={{ fontSize: "14px", color: "rgba(250,248,244,0.90)", lineHeight: "1.5", fontFamily: "'Inter', sans-serif" }}>
              {description}
            </p>
            {details && (
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.50)", lineHeight: "1.5", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.10)", fontFamily: "'Inter', sans-serif" }}>
                {details}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default GlossaryTrigger;
