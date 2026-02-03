import { PremiumInput } from "@/components/ui/premium-input";
import { WaterfallInputs, GuildState, formatCompactCurrency, calculateBreakeven } from "@/lib/waterfall";
import { CapitalSelections } from "./CapitalSelectStep";
import { Info, Target, TrendingUp, DollarSign } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { StandardStepIcon } from "../StandardStepIcon";
import { StandardSectionHeader } from "../StandardSectionHeader";

interface AcquisitionStepProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  selections: CapitalSelections;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const AcquisitionStep = ({ inputs, guilds, selections, onUpdateInput }: AcquisitionStepProps) => {
  const [showHelp, setShowHelp] = useState(false);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  // Use the algebraic breakeven calculation
  const breakeven = calculateBreakeven(inputs, guilds, selections);

  // Calculate cushion
  const cushion = inputs.revenue - breakeven;
  const isAboveBreakeven = cushion > 0;
  const percentAbove = breakeven > 0 ? ((inputs.revenue - breakeven) / breakeven) * 100 : 0;

  const isCompleted = inputs.revenue > 0;

  return (
    <div className="min-h-[60vh] flex flex-col justify-center">
      {/* Hero Header - STANDARDIZED */}
      <div className="text-center mb-8">
        {/* STANDARDIZED ICON (no custom size) */}
        <StandardStepIcon icon={Target} label="The moment of truth" />

        {/* STANDARDIZED HEADER SIZE (text-3xl) */}
        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2 leading-tight">
          What's the streamer
          <br />
          <span className="text-gold">offering you?</span>
        </h2>

        <p className="text-white/50 text-sm max-w-xs mx-auto">
          Enter the total acquisition price to see if it covers your break-even.
        </p>
      </div>

      {/* Breakeven context - Simplified */}
      <div className="mb-6 glass-card-gold p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-gold" />
            <div>
              <span className="text-xs uppercase tracking-wider text-gold/70 block">Your breakeven</span>
              <span className="font-mono text-lg text-gold font-semibold">
                {Number.isFinite(breakeven) ? formatCompactCurrency(breakeven) : 'Calculating...'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-white/30 block">Minimum to recoup</span>
            <span className="text-xs text-white/50">all costs + returns</span>
          </div>
        </div>
      </div>

      {/* THE INPUT - STANDARDIZED */}
      <div className="matte-section">
        {/* STANDARDIZED SECTION HEADER (no gradient, no pulsing dot) */}
        <StandardSectionHeader 
          icon={DollarSign}
          label="The Offer"
          isCompleted={isCompleted}
        />

        {/* Input area */}
        <div className="p-5">
          <PremiumInput
            type="text"
            inputMode="numeric"
            value={formatValue(inputs.revenue)}
            onChange={(e) => onUpdateInput('revenue', parseValue(e.target.value))}
            placeholder="3,500,000"
            showCurrency
            label="Acquisition Price"
            example="$3,500,000"
            actionHint="Enter the total offer amount"
            isCompleted={isCompleted}
            isNext={!isCompleted}
          />
        </div>

        {/* SIMPLIFIED status indicator (no animations, single color) */}
        {inputs.revenue > 0 && Number.isFinite(breakeven) && (
          <div className="border-t border-[#1A1A1A] px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/40 mb-1">
                  {isAboveBreakeven ? 'Above breakeven' : 'Below breakeven'}
                </p>
                <p className="text-sm font-mono text-gold">
                  {isAboveBreakeven
                    ? `+${formatCompactCurrency(Math.abs(cushion))} cushion`
                    : `${formatCompactCurrency(Math.abs(cushion))} shortfall`}
                </p>
              </div>
              {isAboveBreakeven && percentAbove > 0 && (
                <span className="text-2xl text-gold/70">
                  +{percentAbove.toFixed(0)}%
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick reference - STANDARDIZED */}
      <div className="mt-6 py-4 px-5 bg-[#0A0A0A] border border-[#1A1A1A]">
        <p className="text-xs text-white/40 text-center mb-3">Typical acquisition ranges</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <span className="text-xs text-white/50 font-mono block">100-110%</span>
            <span className="text-[10px] text-white/30">baseline</span>
          </div>
          <div className="border-x border-[#1A1A1A] px-2">
            <span className="text-xs text-gold/70 font-mono block">115-130%</span>
            <span className="text-[10px] text-gold/50">strong</span>
          </div>
          <div>
            <span className="text-xs text-gold/90 font-mono block">130%+</span>
            <span className="text-[10px] text-gold/60">exceptional</span>
          </div>
        </div>
      </div>

      {/* Inline Helper */}
      <div className="mt-4">
        <Collapsible open={showHelp} onOpenChange={setShowHelp}>
          <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 text-sm text-gold/70 hover:text-gold transition-colors py-3">
            <Info className="w-4 h-4" />
            <span>What's a typical acquisition price?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="glass-card-gold p-5 animate-reveal-up">
              <p className="text-sm text-white/70 mb-3 leading-relaxed">
                In streamer buyouts (Netflix, Amazon, Apple), the acquisition is typically
                expressed as a <span className="text-gold font-semibold">multiple of budget</span>.
              </p>
              <div className="premium-divider mb-3" />
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/40">Budget x 1.0-1.1</span>
                  <span className="text-white/60">Baseline deal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gold/70">Budget x 1.15-1.3</span>
                  <span className="text-gold/60">Strong deal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gold/90">Budget x 1.3+</span>
                  <span className="text-gold/70">Bidding war</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default AcquisitionStep;
