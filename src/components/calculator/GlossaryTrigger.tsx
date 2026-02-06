import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import React from "react";

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
      <p>Money trickles down: Theaters → Distributor → Sales Agent → Lenders → Investors → Producers. <a href="/waterfall-info" className="text-gold hover:underline">See full breakdown</a>.</p>
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

const GlossaryTrigger = ({ 
  term, 
  title, 
  description, 
  details,
  className 
}: GlossaryTerm & { className?: string }) => {
  // Mobile-friendly tooltip interaction
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <button
            className={cn(
              "inline-flex items-center justify-center p-1 rounded-full text-gold/50 hover:text-gold hover:bg-gold/10 transition-colors",
              className
            )}
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(!isOpen);
            }}
          >
            <Info className="w-3.5 h-3.5" />
            <span className="sr-only">Info about {term}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-[300px] bg-bg-card border border-gold/20 p-4 shadow-xl z-50"
          sideOffset={5}
        >
          <div className="space-y-2">
            <h4 className="font-bebas text-lg tracking-wide text-gold">
              {title}
            </h4>
            <p className="text-sm text-white/90 leading-relaxed font-sans">
              {description}
            </p>
            {details && (
              <div className="text-xs text-white/50 leading-relaxed pt-2 border-t border-white/10 font-sans">
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
