import { PremiumInput } from "@/components/ui/premium-input";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { Info, Megaphone } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface MarketingStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const MarketingStep = ({ inputs, onUpdateInput }: MarketingStepProps) => {
  const [showHelp, setShowHelp] = useState(false);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  const isCompleted = inputs.salesExp > 0;

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
            <Megaphone className="w-7 h-7 text-gold" />
          </div>
        </div>

        <p className="text-white/40 text-xs mb-2 uppercase tracking-widest">Another hand in the pot</p>
        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2">
          Marketing & <span className="text-gold">Delivery</span>
        </h2>
        <p className="text-white/50 text-sm max-w-xs mx-auto">
          Festivals. Markets. Posters. Deliverables. It adds up fast.
        </p>
      </div>

      {/* The Card with matte styling */}
      <div className="matte-section overflow-hidden">
        {/* Section header */}
        <div className="matte-section-header px-5 py-3 flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
            Marketing Cap
          </span>
          {isCompleted && (
            <span className="text-xs text-gold font-mono">
              ENTERED
            </span>
          )}
        </div>

        {/* Input area */}
        <div className="p-5">
          <PremiumInput
            type="text"
            inputMode="numeric"
            value={formatValue(inputs.salesExp)}
            onChange={(e) => onUpdateInput('salesExp', parseValue(e.target.value))}
            placeholder="75,000"
            showCurrency
            label="Expense Cap"
            example="$75,000"
            actionHint="Maximum marketing spend capped at this amount"
            isCompleted={isCompleted}
            isNext={!isCompleted}
          />
        </div>

        {/* Impact Display */}
        {inputs.salesExp > 0 && (
          <div className="border-t border-[#1A1A1A] bg-[#0A0A0A]/50">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/40">Deducted before profit:</span>
                <span className="font-mono text-xl text-red-400 font-semibold">
                  -{formatCompactCurrency(inputs.salesExp)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Typical Range Helper */}
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between py-3 border-t border-[#1A1A1A]">
            <span className="text-xs text-white/30">Typical range</span>
            <span className="text-xs font-mono text-white/50">$50K - $150K</span>
          </div>
        </div>
      </div>

      {/* Inline Helper */}
      <div className="mt-6">
        <Collapsible open={showHelp} onOpenChange={setShowHelp}>
          <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 text-sm text-gold/70 hover:text-gold transition-colors py-3">
            <Info className="w-4 h-4" />
            <span>What counts as marketing expenses?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="glass-card-gold p-5 animate-reveal-up">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gold/70 block mb-1">Festival fees</span>
                  <span className="text-white/60">Sundance, SXSW, Toronto</span>
                </div>
                <div>
                  <span className="text-gold/70 block mb-1">Market attendance</span>
                  <span className="text-white/60">AFM, Cannes, Berlin</span>
                </div>
                <div>
                  <span className="text-gold/70 block mb-1">Deliverables</span>
                  <span className="text-white/60">DCP, HDR, M&E</span>
                </div>
                <div>
                  <span className="text-gold/70 block mb-1">Promo materials</span>
                  <span className="text-white/60">Posters, trailers</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default MarketingStep;
