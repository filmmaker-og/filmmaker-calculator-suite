import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface GlossaryTriggerProps {
  term: string;
  title: string;
  description: string;
  details?: ReactNode;
  size?: "sm" | "md";
  className?: string;
}

const GlossaryTrigger = ({
  term,
  title,
  description,
  details,
  size = "sm",
  className,
}: GlossaryTriggerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "glossary-trigger",
          size === "md" && "glossary-trigger-lg",
          className
        )}
        aria-label={`Learn about ${term}`}
      >
        i
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="bg-bg-card border-border-default rounded-xl max-w-sm w-[calc(100vw-2rem)] font-sans"
          style={{ borderRadius: 'var(--radius-xl)' }}
        >
          <DialogHeader>
            <DialogTitle className="font-bebas text-xl tracking-wider text-text-primary">
              {title}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="font-sans text-text-mid text-sm leading-relaxed">
            {description}
          </DialogDescription>
          {details && (
            <div className="mt-4 space-y-3 text-sm text-text-mid font-sans">
              {details}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlossaryTrigger;

// Pre-defined glossary terms for easy reuse
export const GLOSSARY = {
  negativeCost: {
    term: "Negative Cost",
    title: "NEGATIVE COST",
    description: "The total amount spent to produce a finished master copy of your film.",
    details: (
      <>
        <p><span className="text-text-primary">Includes:</span> Talent, crew, equipment, locations, post-production, deliverables</p>
        <p><span className="text-text-primary">Excludes:</span> Marketing, sales fees, financing costs, distribution</p>
      </>
    ),
  },
  camFee: {
    term: "CAM Fee",
    title: "CAM FEE",
    description: "Collection Account Management fee — typically 1% of revenue, paid to the bank or entity managing the collection account.",
    details: (
      <p>This fee comes off-the-top before any other participants are paid. It covers the cost of administering the waterfall.</p>
    ),
  },
  salesAgent: {
    term: "Sales Agent Fee",
    title: "SALES AGENT FEE",
    description: "Commission paid to the sales agent for negotiating and closing distribution deals. Typically 10-25% of revenue.",
    details: (
      <>
        <p><span className="text-text-primary">Lower (10-15%):</span> Established producers, pre-sold territories</p>
        <p><span className="text-text-primary">Higher (20-25%):</span> New filmmakers, difficult genres, festival-dependent</p>
      </>
    ),
  },
  guildResiduals: {
    term: "Guild Residuals",
    title: "GUILD RESIDUALS",
    description: "Payments owed to union members (SAG-AFTRA, WGA, DGA) based on revenue from secondary markets.",
    details: (
      <>
        <p><span className="text-text-primary">SAG-AFTRA:</span> ~4.5% of revenue for actors</p>
        <p><span className="text-text-primary">WGA:</span> ~1.2% of revenue for writers</p>
        <p><span className="text-text-primary">DGA:</span> ~1.2% of revenue for directors</p>
        <p className="text-text-dim mt-2">Non-union productions avoid these costs but may limit talent access.</p>
      </>
    ),
  },
  capitalStack: {
    term: "Capital Stack",
    title: "CAPITAL STACK",
    description: "The layered structure of all financing sources for your film, ordered by repayment priority.",
    details: (
      <>
        <p><span className="text-text-primary">Senior Debt:</span> Paid first, lowest risk, lowest return</p>
        <p><span className="text-text-primary">Mezzanine/Gap:</span> Paid second, medium risk, medium return</p>
        <p><span className="text-text-primary">Equity:</span> Paid last, highest risk, highest potential return</p>
      </>
    ),
  },
  seniorDebt: {
    term: "Senior Debt",
    title: "SENIOR DEBT",
    description: "Loans secured against pre-sales, tax credits, or minimum guarantees. First to be repaid from revenue.",
    details: (
      <p>Banks and specialty lenders provide senior debt at relatively low interest rates (8-15%) because repayment is backed by contractual commitments.</p>
    ),
  },
  mezzanineDebt: {
    term: "Mezzanine/Gap Debt",
    title: "MEZZANINE / GAP DEBT",
    description: "Financing that bridges the gap between senior debt and equity. Higher risk than senior debt, paid after senior but before equity.",
    details: (
      <p>Gap lenders typically charge 15-25% interest and may require additional security or a piece of the backend.</p>
    ),
  },
  equity: {
    term: "Equity",
    title: "EQUITY INVESTMENT",
    description: "Money invested in exchange for ownership. Last to be repaid but participates in profits.",
    details: (
      <>
        <p><span className="text-text-primary">Premium:</span> Additional return paid to equity before profit split (typically 10-25%)</p>
        <p><span className="text-text-primary">Backend:</span> After recoupment, equity typically shares 50/50 in profits with producers</p>
      </>
    ),
  },
  acquisition: {
    term: "Acquisition",
    title: "ACQUISITION PRICE",
    description: "The amount a distributor or streamer pays to acquire rights to your film.",
    details: (
      <>
        <p><span className="text-text-primary">MG (Minimum Guarantee):</span> Upfront payment, often structured as an advance against royalties</p>
        <p><span className="text-text-primary">Buyout:</span> One-time payment for all rights, no backend participation</p>
      </>
    ),
  },
  breakeven: {
    term: "Breakeven",
    title: "BREAKEVEN POINT",
    description: "The minimum revenue needed to repay all financing obligations.",
    details: (
      <p>When the acquisition price exceeds breakeven, there's a "cushion" — money available for profit participation.</p>
    ),
  },
  waterfall: {
    term: "Waterfall",
    title: "THE WATERFALL",
    description: "The contractual order in which revenue flows to different participants: fees first, then debt, then equity, then profit splits.",
    details: (
      <>
        <p><span className="text-text-primary">Tier 1:</span> Off-the-top fees (CAM, sales, guilds, marketing)</p>
        <p><span className="text-text-primary">Tier 2:</span> Senior debt repayment + interest</p>
        <p><span className="text-text-primary">Tier 3:</span> Mezzanine debt repayment + interest</p>
        <p><span className="text-text-primary">Tier 4:</span> Equity recoupment + premium</p>
        <p><span className="text-text-primary">Tier 5:</span> Profit pool (typically 50/50 producer/investor)</p>
      </>
    ),
  },
  profitPool: {
    term: "Profit Pool",
    title: "PROFIT POOL",
    description: "Money remaining after all financing obligations are repaid. Typically split 50/50 between producers and investors.",
    details: (
      <p>The profit pool is what makes film investment attractive — if the film performs well, this can be multiples of the original investment.</p>
    ),
  },
  investorMultiple: {
    term: "Investor Multiple",
    title: "INVESTOR MULTIPLE",
    description: "Total return to investors divided by their original investment. A 1.5x multiple means investors get back 1.5 times their money.",
    details: (
      <>
        <p><span className="text-text-primary">&lt; 1.0x:</span> Loss — investors don't recoup</p>
        <p><span className="text-text-primary">1.0x - 1.2x:</span> Marginal return</p>
        <p><span className="text-text-primary">1.2x - 1.5x:</span> Solid return</p>
        <p><span className="text-text-primary">&gt; 1.5x:</span> Strong return</p>
      </>
    ),
  },
} as const;
