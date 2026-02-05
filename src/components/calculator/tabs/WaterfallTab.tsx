import { useState } from "react";
import {
  WaterfallResult,
  WaterfallInputs,
  formatCompactCurrency,
  formatMultiple,
} from "@/lib/waterfall";
import {
  Lock,
  ChevronDown,
  ChevronUp,
  FileText,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import RestrictedAccessModal from "@/components/RestrictedAccessModal";
import { cn } from "@/lib/utils";
import WaterfallVisual from "@/components/calculator/WaterfallVisual";
import DisclaimerFooter from "@/components/calculator/DisclaimerFooter";
import ChapterCard from "../ChapterCard";
import GlossaryTrigger, { GLOSSARY } from "../GlossaryTrigger";

interface WaterfallTabProps {
  result: WaterfallResult;
  inputs: WaterfallInputs;
}

const WaterfallTab = ({ result, inputs }: WaterfallTabProps) => {
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);
  const [showWaterfall, setShowWaterfall] = useState(true);
  const [showLedger, setShowLedger] = useState(false);

  const isProfitable = result.profitPool > 0;
  const isUnderperforming = result.multiple < 1.2 && inputs.equity > 0;

  // Calculate waterfall tier amounts
  const firstMoneyOut =
    result.cam + result.salesFee + result.guilds + result.marketing;
  const seniorDebt =
    result.ledger.find((l) => l.name === "Senior Debt")?.amount || 0;
  const mezzDebt =
    result.ledger.find((l) => l.name === "Gap/Mezz Debt")?.amount || 0;
  const debtService = seniorDebt + mezzDebt;
  const equityPrem = result.ledger.find((l) => l.name === "Equity")?.amount || 0;

  return (
    <div className="pb-8">
      <ChapterCard
        chapter="04"
        title="WATERFALL"
        isActive={true}
        glossaryTrigger={
          <GlossaryTrigger {...GLOSSARY.waterfall} />
        }
      >
        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div
            className="p-3 bg-bg-surface border border-border-default text-center"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <p className="text-[9px] font-bold uppercase tracking-wider text-text-dim">
                Profit Pool
              </p>
              <GlossaryTrigger {...GLOSSARY.profitPool} size="sm" />
            </div>
            <p className={cn(
              "font-mono text-base font-medium",
              isProfitable ? "text-status-success" : "text-text-dim"
            )}>
              {formatCompactCurrency(result.profitPool)}
            </p>
          </div>
          <div
            className="p-3 bg-bg-surface border border-border-default text-center"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <p className="text-[9px] font-bold uppercase tracking-wider text-text-dim mb-1">
              Breakeven
            </p>
            <p className="font-mono text-base text-text-primary">
              {formatCompactCurrency(result.totalHurdle)}
            </p>
          </div>
          <div
            className="p-3 bg-bg-surface border border-border-default text-center"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <p className="text-[9px] font-bold uppercase tracking-wider text-text-dim">
                Multiple
              </p>
              <GlossaryTrigger {...GLOSSARY.investorMultiple} size="sm" />
            </div>
            <p className={cn(
              "font-mono text-base font-medium",
              result.multiple >= 1.2 ? "text-gold" : "text-text-dim"
            )}>
              {formatMultiple(result.multiple)}
            </p>
          </div>
        </div>

        {/* Warning Banner */}
        {isUnderperforming && (
          <div
            className="mb-6 p-4 flex items-start gap-3 border border-status-warning bg-[rgba(255,215,0,0.08)]"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-status-warning font-bold">!</div>
            <div>
              <p className="text-sm text-text-primary font-medium">
                Multiple is {formatMultiple(result.multiple)}
              </p>
              <p className="text-xs text-text-dim">
                Institutional investors typically expect 1.2x minimum.
              </p>
            </div>
          </div>
        )}

        {/* Waterfall Visualization */}
        <div
          className="border border-border-default overflow-hidden mb-4"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <button
            onClick={() => setShowWaterfall(!showWaterfall)}
            className="w-full p-4 flex items-center justify-between bg-bg-surface hover:bg-bg-elevated transition-colors"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-text-dim">
              Revenue Flow
            </span>
            {showWaterfall ? (
              <ChevronUp className="w-4 h-4 text-text-dim" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-dim" />
            )}
          </button>

          {showWaterfall && (
            <div className="px-4 pb-4 bg-bg-card">
              <WaterfallVisual
                revenue={inputs.revenue}
                offTheTop={firstMoneyOut}
                debtService={debtService}
                equityPremium={equityPrem}
                profitPool={result.profitPool}
              />
            </div>
          )}
        </div>

        {/* Detailed Ledger */}
        <div
          className="border border-border-default overflow-hidden mb-6"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <button
            onClick={() => setShowLedger(!showLedger)}
            className="w-full p-4 flex items-center justify-between bg-bg-surface hover:bg-bg-elevated transition-colors"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-text-dim">
              Detailed Breakdown
            </span>
            {showLedger ? (
              <ChevronUp className="w-4 h-4 text-text-dim" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-dim" />
            )}
          </button>

          {showLedger && (
            <div className="divide-y divide-border-subtle bg-bg-card">
              {result.ledger.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="text-sm text-text-primary">{item.name}</p>
                    <p className="text-[10px] text-text-dim uppercase">
                      {item.detail}
                    </p>
                  </div>
                  <p className="font-mono text-sm text-text-mid">
                    {formatCompactCurrency(item.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* What you modeled */}
        <div
          className="p-5 border border-border-default bg-bg-surface mb-6"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider text-text-dim mb-4 text-center">
            What you just modeled
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Revenue Tiers", value: "4 phases" },
              { label: "Fee Structures", value: "CAM + Sales + Guilds" },
              { label: "Capital Stack", value: `${(inputs.debt > 0 ? 1 : 0) + (inputs.mezzanineDebt > 0 ? 1 : 0) + (inputs.equity > 0 ? 1 : 0)} tranches` },
              { label: "Return Calc", value: "Pref + 50/50 split" },
            ].map((item) => (
              <div
                key={item.label}
                className="text-center p-3 border border-border-subtle"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <p className="text-[9px] text-text-dim font-bold uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-xs text-text-primary font-medium">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-text-dim text-center mt-4 leading-relaxed">
            This is how agencies and studios model deals.
          </p>
        </div>
      </ChapterCard>

      {/* Primary CTA - Gold allowed here */}
      <div className="mb-6">
        <div
          className="p-6 text-center border border-gold-muted bg-gold-subtle"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <Lock className="w-6 h-6 text-gold mx-auto mb-3" />
          <h3 className="font-bebas text-xl tracking-[0.1em] text-text-primary mb-2">
            YOU HAVE THE NUMBERS
          </h3>
          <p className="text-sm text-text-mid leading-relaxed max-w-xs mx-auto mb-5">
            But can you walk investors through a 4-tier waterfall with preferred returns?
          </p>

          <button
            onClick={() => setShowRestrictedModal(true)}
            className="btn-primary"
          >
            GET THE INVESTOR DECK
          </button>

          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="text-[9px] text-text-dim font-bold uppercase tracking-wider">Templates</span>
            <span className="w-1 h-1 bg-text-dim rounded-full" />
            <span className="text-[9px] text-text-dim font-bold uppercase tracking-wider">Models</span>
            <span className="w-1 h-1 bg-text-dim rounded-full" />
            <span className="text-[9px] text-text-dim font-bold uppercase tracking-wider">Strategy</span>
          </div>
        </div>
      </div>

      {/* Secondary CTAs */}
      <div className="space-y-3 mb-6">
        <a
          href="https://filmmaker.og/store"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 border border-border-default bg-bg-card hover:border-text-dim transition-colors"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 border border-border-default flex items-center justify-center"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <FileText className="w-5 h-5 text-text-dim" />
              </div>
              <div>
                <span className="text-sm text-text-primary font-medium block">Full Excel Model</span>
                <span className="text-[10px] text-text-dim">Editable financials</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-text-dim" />
          </div>
        </a>

        <a
          href="mailto:thefilmmaker.og@gmail.com?subject=Deal%20Review%20Request&body=I%20just%20modeled%20a%20deal%20and%20would%20like%20professional%20review."
          className="block p-4 border border-border-default bg-bg-card hover:border-text-dim transition-colors"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 border border-border-default flex items-center justify-center"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <TrendingUp className="w-5 h-5 text-text-dim" />
              </div>
              <div>
                <span className="text-sm text-text-primary font-medium block">1-on-1 Deal Review</span>
                <span className="text-[10px] text-text-dim">Expert consultation</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-text-dim" />
          </div>
        </a>
      </div>

      <DisclaimerFooter />

      <RestrictedAccessModal
        isOpen={showRestrictedModal}
        onClose={() => setShowRestrictedModal(false)}
      />
    </div>
  );
};

export default WaterfallTab;
