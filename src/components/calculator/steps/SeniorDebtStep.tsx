import { PremiumInput } from "@/components/ui/premium-input";
import { PercentStepper } from "@/components/ui/percent-stepper";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { Info, Landmark, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SeniorDebtStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const SeniorDebtStep = ({ inputs, onUpdateInput }: SeniorDebtStepProps) => {
  const [showHelp, setShowHelp] = useState(false);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  // Calculate total repayment
  const totalRepayment = inputs.debt * (1 + inputs.seniorDebtRate / 100);
  const interestAmount = inputs.debt * (inputs.seniorDebtRate / 100);

  const isAmountCompleted = inputs.debt > 0;

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
            <Landmark className="w-7 h-7 text-gold" />
          </div>
        </div>

        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2">
          Senior Debt
        </h2>
        <p className="text-white/50 text-sm max-w-xs mx-auto">
          First-position loan. Gets paid back before anyone else.
        </p>
      </div>

      {/* Instructions banner */}
      <div className="mb-6 py-3 px-4 bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center gap-3">
        <span className="text-xs text-white/40 tracking-wide">Complete both fields below</span>
        <ArrowRight className="w-3 h-3 text-gold/50" />
      </div>

      {/* The Input Card with numbered fields */}
      <div className="matte-section overflow-hidden">
        {/* Section header */}
        <div className="matte-section-header px-5 py-3">
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
            Loan Details
          </span>
        </div>

        {/* Input 1: Principal Amount */}
        <div className="p-5 border-b border-[#1A1A1A]">
          <PremiumInput
            type="text"
            inputMode="numeric"
            value={formatValue(inputs.debt)}
            onChange={(e) => onUpdateInput('debt', parseValue(e.target.value))}
            placeholder="600,000"
            showCurrency
            label="Principal Amount"
            stepNumber={1}
            example="$600,000"
            actionHint="How much are you borrowing?"
            isCompleted={isAmountCompleted}
            isNext={!isAmountCompleted}
          />
        </div>

        {/* Input 2: Interest Rate */}
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 flex items-center justify-center text-xs font-mono font-bold bg-gold text-black">
              2
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-gold/80 font-semibold">
              Interest + Fees
            </span>
          </div>

          <PercentStepper
            value={inputs.seniorDebtRate}
            onChange={(value) => onUpdateInput('seniorDebtRate', value)}
            min={5}
            max={20}
            step={1}
            standardValue={10}
            standardLabel="typical bank rate"
            isCompleted={true}
          />
        </div>

        {/* Calculation Result */}
        {inputs.debt > 0 && (
          <div className="border-t border-[#1A1A1A] bg-[#0A0A0A]/50">
            <div className="p-5">
              {/* Visual calculation */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Principal</span>
                  <span className="font-mono text-white/60">{formatCompactCurrency(inputs.debt)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">+ Interest ({inputs.seniorDebtRate}%)</span>
                  <span className="font-mono text-white/60">{formatCompactCurrency(interestAmount)}</span>
                </div>
                <div className="premium-divider-gold" />
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-gold/70 font-semibold">Total Repayment</span>
                  <span className="font-mono text-xl text-gold font-semibold">{formatCompactCurrency(totalRepayment)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Typical Range Helper */}
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between py-3 border-t border-[#1A1A1A]">
            <span className="text-xs text-white/30">Typical senior debt range</span>
            <span className="text-xs font-mono text-white/50">
              {inputs.budget > 0
                ? `${formatCompactCurrency(Math.round(inputs.budget * 0.2))} - ${formatCompactCurrency(Math.round(inputs.budget * 0.4))}`
                : '20-40% of budget'
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
            <span>What is senior debt?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="glass-card-gold p-5 animate-reveal-up mx-2">
              <p className="text-sm text-white/70 mb-3 leading-relaxed">
                Senior debt is secured against pre-sales or tax credit receivables.
                It's the <span className="text-gold font-semibold">safest position</span> in the capital stack.
              </p>
              <div className="premium-divider mb-3" />
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-white/30 block mb-1">Typical lenders</span>
                  <span className="text-white/60">Banks, film funds</span>
                </div>
                <div>
                  <span className="text-white/30 block mb-1">Rate range</span>
                  <span className="text-white/60">8-12%</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default SeniorDebtStep;
