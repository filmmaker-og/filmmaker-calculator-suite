import { PremiumInput } from "@/components/ui/premium-input";
import { StepContainer } from "@/components/ui/step-container";
import { WaterfallInputs } from "@/lib/waterfall";
import { Info, Film, DollarSign } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface BudgetStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const BudgetStep = ({ inputs, onUpdateInput }: BudgetStepProps) => {
  const [showHelp, setShowHelp] = useState(false);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  const isCompleted = inputs.budget > 0;

  return (
    <div className="min-h-[60vh] flex flex-col justify-center">
      {/* Hero question - Big and bold */}
      <div className="text-center mb-8">
        {/* Icon with glow */}
        <div className="relative inline-block mb-6">
          <div
            className="absolute inset-0 animate-pulse-slow"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
              filter: 'blur(20px)',
              transform: 'scale(2)',
            }}
          />
          <div className="relative w-16 h-16 border border-gold/30 bg-gold/5 flex items-center justify-center">
            <Film className="w-8 h-8 text-gold" />
          </div>
        </div>

        <h2 className="font-bebas text-4xl tracking-[0.08em] text-white mb-4 leading-tight">
          What did it cost
          <br />
          <span className="text-gold">to make your film?</span>
        </h2>

        <p className="text-white/50 text-sm max-w-xs mx-auto leading-relaxed">
          All-in production cost. Development through delivery.
          The whole thing.
        </p>
      </div>

      {/* The premium input card */}
      <div className="matte-section">
        {/* Section header */}
        <div className="matte-section-header px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign className="w-4 h-4 text-gold/60" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
              Production Budget
            </span>
          </div>
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
            value={formatValue(inputs.budget)}
            onChange={(e) => onUpdateInput('budget', parseValue(e.target.value))}
            placeholder="2,000,000"
            showCurrency
            label="Negative Cost"
            example="$2,000,000"
            actionHint="Enter your film's total budget"
            isCompleted={isCompleted}
            isNext={!isCompleted}
          />
        </div>

        {/* Quick reference */}
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between py-3 border-t border-[#1A1A1A]">
            <span className="text-xs text-white/30">Typical indie range</span>
            <span className="text-xs font-mono text-white/50">$500K - $10M</span>
          </div>
        </div>
      </div>

      {/* Inline Helper - Collapsed by default */}
      <div className="mt-6">
        <Collapsible open={showHelp} onOpenChange={setShowHelp}>
          <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 text-sm text-gold/70 hover:text-gold transition-colors py-3">
            <Info className="w-4 h-4" />
            <span>What's "Negative Cost"?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="glass-card-gold p-5 animate-reveal-up">
              <p className="text-sm text-white/70 mb-3 leading-relaxed">
                <span className="text-gold font-semibold">Negative Cost</span> is the total capital
                required to produce the master and deliver to distributors.
              </p>
              <div className="premium-divider mb-3" />
              <div className="space-y-2 text-xs text-white/40">
                <p className="flex items-start gap-2">
                  <span className="text-gold">+</span>
                  <span>Above-the-Line (talent, director, writer)</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gold">+</span>
                  <span>Below-the-Line (crew, equipment, locations)</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gold">+</span>
                  <span>Post-production & deliverables</span>
                </p>
                <p className="flex items-start gap-2 text-white/30">
                  <span className="text-white/20">−</span>
                  <span>Excludes: marketing, sales fees, financing costs</span>
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default BudgetStep;
