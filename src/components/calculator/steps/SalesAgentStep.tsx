import { PercentStepper } from "@/components/ui/percent-stepper";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { Info, Briefcase } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SalesAgentStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const SalesAgentStep = ({ inputs, onUpdateInput }: SalesAgentStepProps) => {
  const [showHelp, setShowHelp] = useState(false);

  // Calculate impact based on a hypothetical 1.2x deal
  const hypotheticalRevenue = inputs.budget * 1.2;
  const salesFeeAmount = hypotheticalRevenue * (inputs.salesFee / 100);
  const totalSalesCost = salesFeeAmount + inputs.salesExp;

  return (
    <div className="step-enter">
      {/* Step Header with icon */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
              filter: 'blur(15px)',
              transform: 'scale(2)',
            }}
          />
          <div className="relative w-14 h-14 border border-gold/30 bg-gold/5 flex items-center justify-center">
            <Briefcase className="w-7 h-7 text-gold" />
          </div>
        </div>

        <p className="text-white/40 text-xs mb-2 uppercase tracking-widest">After the CAM fee...</p>
        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2">
          The Sales Agent <span className="text-gold">takes their cut</span>
        </h2>
        <p className="text-white/50 text-sm max-w-xs mx-auto">
          They found your buyer. Now they take their cut off the top.
        </p>
      </div>

      {/* The Card with matte styling */}
      <div className="matte-section overflow-hidden">
        {/* Section header */}
        <div className="matte-section-header px-5 py-3">
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
            Sales Agent Terms
          </span>
        </div>

        {/* Rate Stepper */}
        <div className="p-5 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 flex items-center justify-center text-xs font-mono font-bold bg-gold text-black">
              1
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-gold/80 font-semibold">
              Commission Rate
            </span>
          </div>

          <PercentStepper
            value={inputs.salesFee}
            onChange={(value) => onUpdateInput('salesFee', value)}
            min={0}
            max={30}
            step={5}
            standardValue={15}
            standardLabel="industry average"
            isCompleted={true}
          />
        </div>

        {/* Sales Expense Display */}
        <div className="p-5 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-6 flex items-center justify-center text-xs font-mono font-bold bg-gold text-black">
              2
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-gold/80 font-semibold">
              Sales Expenses (CAP)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">Market fees, deliverables, travel</p>
              <p className="text-xs text-white/30 mt-1">Capped at this amount</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-2xl text-white font-semibold">
                {formatCompactCurrency(inputs.salesExp)}
              </span>
            </div>
          </div>
        </div>

        {/* Impact Calculation */}
        {inputs.budget > 0 && (
          <div className="bg-[#0A0A0A]/50">
            <div className="p-5">
              <p className="text-xs text-white/30 uppercase tracking-wider mb-3">
                Impact on a typical 1.2x deal
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Commission ({inputs.salesFee}%)</span>
                  <span className="font-mono text-red-400">-{formatCompactCurrency(salesFeeAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Expenses cap</span>
                  <span className="font-mono text-red-400">-{formatCompactCurrency(inputs.salesExp)}</span>
                </div>
                <div className="premium-divider-gold" />
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-white/50 font-semibold">Total Off-Top</span>
                  <span className="font-mono text-xl text-red-400 font-semibold">
                    -{formatCompactCurrency(totalSalesCost)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Typical Range Helper */}
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between py-3 border-t border-[#1A1A1A]">
            <span className="text-xs text-white/30">Typical commission range</span>
            <span className="text-xs font-mono text-white/50">10-20%</span>
          </div>
        </div>
      </div>

      {/* Inline Helper */}
      <div className="mt-6">
        <Collapsible open={showHelp} onOpenChange={setShowHelp}>
          <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 text-sm text-gold/70 hover:text-gold transition-colors py-3">
            <Info className="w-4 h-4" />
            <span>What do sales agents actually do?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="glass-card-gold p-5 animate-reveal-up">
              <p className="text-sm text-white/70 mb-3 leading-relaxed">
                Sales agents represent your film at markets (AFM, Cannes, Berlin) and negotiate with
                <span className="text-gold font-semibold"> distributors worldwide</span>.
              </p>
              <div className="premium-divider mb-3" />
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-white/30 block mb-1">Domestic rate</span>
                  <span className="text-white/60">10-15%</span>
                </div>
                <div>
                  <span className="text-white/30 block mb-1">International</span>
                  <span className="text-white/60">15-25%</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default SalesAgentStep;
