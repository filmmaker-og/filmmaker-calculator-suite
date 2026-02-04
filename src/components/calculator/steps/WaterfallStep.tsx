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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import WaterfallVisual from "@/components/calculator/WaterfallVisual";
import DisclaimerFooter from "@/components/calculator/DisclaimerFooter";

interface WaterfallStepProps {
  result: WaterfallResult;
  inputs: WaterfallInputs;
}

const WaterfallStep = ({ result, inputs }: WaterfallStepProps) => {
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
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2">
          The Waterfall
        </h2>
        <p className="text-white/40 text-sm">
          How your revenue flows through each tier
        </p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="p-3 bg-black border border-[#1A1A1A] text-center">
          <p className="text-[9px] uppercase tracking-wider text-white/40 mb-1">
            Profit Pool
          </p>
          <p className={cn(
            "font-mono text-base font-medium",
            isProfitable ? "text-white" : "text-white/50"
          )}>
            {formatCompactCurrency(result.profitPool)}
          </p>
        </div>
        <div className="p-3 bg-black border border-[#1A1A1A] text-center">
          <p className="text-[9px] uppercase tracking-wider text-white/40 mb-1">
            Breakeven
          </p>
          <p className="font-mono text-base text-white">
            {formatCompactCurrency(result.totalHurdle)}
          </p>
        </div>
        <div className="p-3 bg-black border border-[#1A1A1A] text-center">
          <p className="text-[9px] uppercase tracking-wider text-white/40 mb-1">
            Multiple
          </p>
          <p className={cn(
            "font-mono text-base font-medium",
            result.multiple >= 1.2 ? "text-white" : "text-white/50"
          )}>
            {formatMultiple(result.multiple)}
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      {isUnderperforming && (
        <div className="mb-6 p-4 flex items-start gap-3 bg-white/5 border border-white/10">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-white/60">!</div>
          <div>
            <p className="text-sm text-white font-medium">
              Multiple is {formatMultiple(result.multiple)}
            </p>
            <p className="text-xs text-white/50">
              Institutional investors typically expect 1.2x minimum.
            </p>
          </div>
        </div>
      )}

      {/* Waterfall Visualization */}
      <div className="bg-black border border-[#1A1A1A] mb-4">
        <button
          onClick={() => setShowWaterfall(!showWaterfall)}
          className="w-full p-4 flex items-center justify-between"
        >
          <span className="text-xs uppercase tracking-wider text-white/40">
            Revenue Flow
          </span>
          {showWaterfall ? (
            <ChevronUp className="w-4 h-4 text-white/30" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/30" />
          )}
        </button>

        {showWaterfall && (
          <div className="px-4 pb-4">
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
      <div className="bg-black border border-[#1A1A1A] mb-6">
        <button
          onClick={() => setShowLedger(!showLedger)}
          className="w-full p-4 flex items-center justify-between"
        >
          <span className="text-xs uppercase tracking-wider text-white/40">
            Detailed Breakdown
          </span>
          {showLedger ? (
            <ChevronUp className="w-4 h-4 text-white/30" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/30" />
          )}
        </button>

        {showLedger && (
          <div className="divide-y divide-[#1A1A1A]">
            {result.ledger.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3"
              >
                <div>
                  <p className="text-sm text-white">{item.name}</p>
                  <p className="text-[10px] text-white/40 uppercase">
                    {item.detail}
                  </p>
                </div>
                <p className="font-mono text-sm text-white/70">
                  {formatCompactCurrency(item.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* What you modeled */}
      <div className="bg-black border border-[#1A1A1A] p-5 mb-6">
        <p className="text-[9px] uppercase tracking-wider text-white/40 mb-4 text-center">
          What you just modeled
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Revenue Tiers", value: "4 phases" },
            { label: "Fee Structures", value: "CAM + Sales + Guilds" },
            { label: "Capital Stack", value: `${(inputs.debt > 0 ? 1 : 0) + (inputs.mezzanineDebt > 0 ? 1 : 0) + (inputs.equity > 0 ? 1 : 0)} tranches` },
            { label: "Return Calc", value: "Pref + 50/50 split" },
          ].map((item) => (
            <div key={item.label} className="text-center p-3 border border-[#1A1A1A]">
              <p className="text-[9px] text-white/40 uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-xs text-white font-medium">{item.value}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-white/30 text-center mt-4 leading-relaxed">
          This is how agencies and studios model deals.
        </p>
      </div>

      {/* Primary CTA - Gold allowed here */}
      <div className="mb-6">
        <div className="bg-black border border-[#1A1A1A] p-6 text-center">
          <Lock className="w-6 h-6 text-white/40 mx-auto mb-3" />
          <h3 className="font-bebas text-xl tracking-[0.1em] text-white mb-2">
            YOU HAVE THE NUMBERS
          </h3>
          <p className="text-sm text-white/50 leading-relaxed max-w-xs mx-auto mb-5">
            But can you walk investors through a 4-tier waterfall with preferred returns?
          </p>

          <Button
            onClick={() => setShowRestrictedModal(true)}
            className="w-full h-14 text-base font-black tracking-[0.15em] rounded-none bg-gold text-black hover:brightness-110 transition-all active:scale-[0.98]"
          >
            GET THE INVESTOR DECK
          </Button>

          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="text-[9px] text-white/30 uppercase tracking-wider">Templates</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="text-[9px] text-white/30 uppercase tracking-wider">Models</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="text-[9px] text-white/30 uppercase tracking-wider">Strategy</span>
          </div>
        </div>
      </div>

      {/* Secondary CTAs */}
      <div className="space-y-3 mb-6">
        <a
          href="https://filmmaker.og/store"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 bg-black border border-[#1A1A1A] hover:border-white/20 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#2A2A2A] flex items-center justify-center">
                <FileText className="w-5 h-5 text-white/40" />
              </div>
              <div>
                <span className="text-sm text-white font-medium block">Full Excel Model</span>
                <span className="text-[10px] text-white/40">Editable financials</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-white/30" />
          </div>
        </a>

        <a
          href="mailto:thefilmmaker.og@gmail.com?subject=Deal%20Review%20Request&body=I%20just%20modeled%20a%20deal%20and%20would%20like%20professional%20review."
          className="block p-4 bg-black border border-[#1A1A1A] hover:border-white/20 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#2A2A2A] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white/40" />
              </div>
              <div>
                <span className="text-sm text-white font-medium block">1-on-1 Deal Review</span>
                <span className="text-[10px] text-white/40">Expert consultation</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-white/30" />
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

export default WaterfallStep;
