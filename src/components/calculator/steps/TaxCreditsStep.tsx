import { PremiumInput } from "@/components/ui/premium-input";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { Info, Receipt } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TaxCreditsStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const TaxCreditsStep = ({ inputs, onUpdateInput }: TaxCreditsStepProps) => {
  const [showHelp, setShowHelp] = useState(false);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  // Calculate typical ranges based on budget (20-30% of budget is typical)
  const typicalMin = inputs.budget > 0 ? Math.round(inputs.budget * 0.2) : 400000;
  const typicalMax = inputs.budget > 0 ? Math.round(inputs.budget * 0.35) : 1000000;

  const isCompleted = inputs.credits > 0;

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
            <Receipt className="w-7 h-7 text-gold" />
          </div>
        </div>

        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2">
          Tax Credits & <span className="text-gold">Incentives</span>
        </h2>
        <p className="text-white/50 text-sm max-w-xs mx-auto">
          Government money that reduces your investor burden.
        </p>
      </div>

      {/* The Input Card with matte styling */}
      <div className="matte-section overflow-hidden">
        {/* Section header */}
        <div className="matte-section-header px-5 py-3 flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
            Tax Credit Value
          </span>
          {isCompleted && (
            <span className="text-xs text-emerald-400 font-mono">
              ENTERED
            </span>
          )}
        </div>

        {/* Input area */}
        <div className="p-5">
          <PremiumInput
            type="text"
            inputMode="numeric"
            value={formatValue(inputs.credits)}
            onChange={(e) => onUpdateInput('credits', parseValue(e.target.value))}
            placeholder="400,000"
            showCurrency
            label="Credit Amount"
            example="$400,000"
            actionHint="Enter the value of your tax credits"
            isCompleted={isCompleted}
            isNext={!isCompleted}
          />
        </div>

        {/* Context & Impact */}
        <div className="border-t border-[#1A1A1A] bg-[#0A0A0A]/50">
          <div className="p-5">
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold text-lg">+</span>
              <p className="text-sm text-white/60 leading-relaxed">
                This amount offsets your capital requirements,
                <span className="text-emerald-400 font-medium"> reducing what investors need to recoup</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Typical Range Helper */}
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between py-3 border-t border-[#1A1A1A]">
            <span className="text-xs text-white/30">Typical credit range</span>
            <span className="text-xs font-mono text-white/50">
              {inputs.budget > 0
                ? `${formatCompactCurrency(typicalMin)} - ${formatCompactCurrency(typicalMax)}`
                : '20-35% of budget'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Inline Helper */}
      <div className="mt-6">
        <Collapsible open={showHelp} onOpenChange={setShowHelp}>
          <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 text-sm text-gold/70 hover:text-gold transition-colors py-3">
            <Info className="w-4 h-4" />
            <span>What are typical tax credit rates?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="glass-card-gold p-5 animate-reveal-up">
              <p className="text-sm text-white/70 mb-3 leading-relaxed">
                Government incentives vary by location:
              </p>
              <div className="premium-divider mb-3" />
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gold/70 block mb-1">UK</span>
                  <span className="text-white/60">25% qualifying spend</span>
                </div>
                <div>
                  <span className="text-gold/70 block mb-1">Georgia</span>
                  <span className="text-white/60">20-30% transferable</span>
                </div>
                <div>
                  <span className="text-gold/70 block mb-1">New Mexico</span>
                  <span className="text-white/60">25-35% refundable</span>
                </div>
                <div>
                  <span className="text-gold/70 block mb-1">Ireland</span>
                  <span className="text-white/60">32% on eligible</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default TaxCreditsStep;
