import { PremiumInput } from "@/components/ui/premium-input";
import { PercentStepper } from "@/components/ui/percent-stepper";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { Info, Users, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface EquityStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const EquityStep = ({ inputs, onUpdateInput }: EquityStepProps) => {
  const [showHelp, setShowHelp] = useState(false);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  // Calculate total repayment (principal + premium)
  const totalRepayment = inputs.equity * (1 + inputs.premium / 100);
  const interestAmount = inputs.equity * (inputs.premium / 100);

  // Calculate typical ranges based on budget
  const typicalMin = inputs.budget > 0 ? Math.round(inputs.budget * 0.3) : 500000;
  const typicalMax = inputs.budget > 0 ? Math.round(inputs.budget * 0.6) : 2000000;

  const isAmountCompleted = inputs.equity > 0;

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
            <Users className="w-7 h-7 text-gold" />
          </div>
        </div>

        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2">
          Equity Investment
        </h2>
        <p className="text-white/50 text-sm max-w-xs mx-auto">
          The cash that goes in last—and gets paid back first (after debt).
        </p>
      </div>

      {/* Instructions banner */}
      <div className="mb-6 py-3 px-4 bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center gap-3">
        <span className="text-xs text-white/40 tracking-wide">Complete both fields below</span>
        <ArrowRight className="w-3 h-3 text-gold/50" />
      </div>

      {/* The Input Card with matte styling */}
      <div className="matte-section overflow-hidden">
        {/* Section header */}
        <div className="matte-section-header px-5 py-3">
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
            Investment Details
          </span>
        </div>

        {/* Input 1: Principal Amount */}
        <div className="p-5 border-b border-[#1A1A1A]">
          <PremiumInput
            type="text"
            inputMode="numeric"
            value={formatValue(inputs.equity)}
            onChange={(e) => onUpdateInput('equity', parseValue(e.target.value))}
            placeholder="1,000,000"
            showCurrency
            label="Net Equity"
            stepNumber={1}
            example="$1,000,000"
            actionHint="How much equity are investors putting in?"
            isCompleted={isAmountCompleted}
            isNext={!isAmountCompleted}
          />
        </div>

        {/* Input 2: Preferred Return */}
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 flex items-center justify-center text-xs font-mono font-bold bg-gold text-black">
              2
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-gold/80 font-semibold">
              Preferred Return
            </span>
          </div>

          <PercentStepper
            value={inputs.premium}
            onChange={(value) => onUpdateInput('premium', value)}
            min={10}
            max={40}
            step={5}
            standardValue={20}
            standardLabel="industry standard"
            isCompleted={true}
          />
        </div>

        {/* Calculation Result */}
        {inputs.equity > 0 && (
          <div className="border-t border-[#1A1A1A] bg-[#0A0A0A]/50">
            <div className="p-5">
              {/* Visual calculation */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Principal</span>
                  <span className="font-mono text-white/60">{formatCompactCurrency(inputs.equity)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">+ Preferred ({inputs.premium}%)</span>
                  <span className="font-mono text-white/60">{formatCompactCurrency(interestAmount)}</span>
                </div>
                <div className="premium-divider-gold" />
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-gold/70 font-semibold">Investor Hurdle</span>
                  <span className="font-mono text-xl text-gold font-semibold">{formatCompactCurrency(totalRepayment)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Typical Range Helper */}
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between py-3 border-t border-[#1A1A1A]">
            <span className="text-xs text-white/30">Typical equity range</span>
            <span className="text-xs font-mono text-white/50">
              {inputs.budget > 0
                ? `${formatCompactCurrency(typicalMin)} - ${formatCompactCurrency(typicalMax)}`
                : '30-60% of budget'
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
            <span>What's a preferred return?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="glass-card-gold p-5 animate-reveal-up">
              <p className="text-sm text-white/70 mb-3 leading-relaxed">
                The preferred return (or "pref") is the hurdle rate investors must receive
                <span className="text-gold font-semibold"> before profits split</span>.
              </p>
              <div className="premium-divider mb-3" />
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-white/30 block mb-1">Standard pref</span>
                  <span className="text-white/60">15-20%</span>
                </div>
                <div>
                  <span className="text-white/30 block mb-1">Higher risk</span>
                  <span className="text-white/60">25-35%</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default EquityStep;
