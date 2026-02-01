import { PremiumInput } from "@/components/ui/premium-input";
import { WaterfallInputs, GuildState, formatCompactCurrency, calculateBreakeven } from "@/lib/waterfall";
import { CapitalSelections } from "./CapitalSelectStep";
import { Info, TrendingUp, TrendingDown, Zap, Target } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AcquisitionStepProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  selections: CapitalSelections;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const AcquisitionStep = ({ inputs, guilds, selections, onUpdateInput }: AcquisitionStepProps) => {
  const [showHelp, setShowHelp] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const prevRevenue = useRef(inputs.revenue);

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

  // Animate cushion value when revenue changes
  useEffect(() => {
    if (prevRevenue.current !== inputs.revenue) {
      const start = displayValue;
      const end = Math.abs(cushion);
      const duration = 500;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
        const current = start + (end - start) * eased;
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
      prevRevenue.current = inputs.revenue;
    }
  }, [inputs.revenue, cushion, displayValue]);

  const isCompleted = inputs.revenue > 0;

  return (
    <div className="step-enter">
      {/* Hero Header - This is THE moment */}
      <div className="text-center mb-8">
        {/* Prominent icon with strong glow */}
        <div className="relative inline-block mb-6">
          <div
            className="absolute inset-0 animate-pulse-slow"
            style={{
              background: 'radial-gradient(circle, rgba(249, 224, 118, 0.3) 0%, rgba(212, 175, 55, 0.1) 50%, transparent 70%)',
              filter: 'blur(25px)',
              transform: 'scale(3)',
            }}
          />
          <div className="relative w-20 h-20 border-2 border-gold/50 bg-gold/10 flex items-center justify-center">
            <Target className="w-10 h-10 text-gold" />
          </div>
        </div>

        <h2 className="font-bebas text-4xl tracking-[0.08em] text-white mb-3 leading-tight">
          What's the streamer
          <br />
          <span className="text-gold">offering you?</span>
        </h2>

        <p className="text-white/50 text-sm max-w-xs mx-auto">
          This is the moment of truth. Enter the total acquisition price.
        </p>
      </div>

      {/* Breakeven context - Always visible */}
      <div className="mb-6 glass-card-gold p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-gold" />
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

      {/* THE HERO INPUT */}
      <div className="matte-section overflow-hidden">
        {/* Section header with emphasis */}
        <div className="matte-section-header px-5 py-4 flex items-center justify-between bg-gradient-to-r from-[#0A0A0A] to-[#0D0B08]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            <span className="text-xs uppercase tracking-[0.2em] text-gold/80 font-semibold">
              The Offer
            </span>
          </div>
          {isCompleted && (
            <span className="text-xs text-emerald-400 font-mono">
              ENTERED
            </span>
          )}
        </div>

        {/* Input area with hero treatment */}
        <div className="p-6">
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
            isHero={true}
          />
        </div>

        {/* Live status indicator */}
        {inputs.revenue > 0 && Number.isFinite(breakeven) && (
          <div className="border-t border-[#1A1A1A]">
            <div
              className={`p-5 transition-all duration-500 ${
                isAboveBreakeven
                  ? 'bg-gradient-to-r from-emerald-500/10 to-transparent'
                  : 'bg-gradient-to-r from-red-500/10 to-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Status icon */}
                <div
                  className={`w-12 h-12 flex items-center justify-center border-2 ${
                    isAboveBreakeven
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : 'border-red-500/50 bg-red-500/10'
                  }`}
                >
                  {isAboveBreakeven ? (
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-400" />
                  )}
                </div>

                {/* Status text */}
                <div className="flex-1">
                  <p
                    className={`text-sm font-bold tracking-wide ${
                      isAboveBreakeven ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {isAboveBreakeven ? 'ABOVE BREAKEVEN' : 'BELOW BREAKEVEN'}
                  </p>
                  <p className="text-sm text-white/60 font-mono">
                    {isAboveBreakeven
                      ? `+${formatCompactCurrency(displayValue)} cushion`
                      : `${formatCompactCurrency(displayValue)} shortfall`}
                    {isAboveBreakeven && percentAbove > 0 && (
                      <span className="text-emerald-400/70 ml-2">
                        (+{percentAbove.toFixed(0)}%)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Progress bar visualization */}
              <div className="mt-4 h-2 bg-[#1A1A1A] overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${
                    isAboveBreakeven
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                      : 'bg-gradient-to-r from-red-600 to-red-400'
                  }`}
                  style={{
                    width: `${Math.min(100, (inputs.revenue / breakeven) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-white/30">
                <span>$0</span>
                <span className="text-gold/50">Breakeven</span>
                <span>{formatCompactCurrency(breakeven * 1.5)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
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
            <span className="text-xs text-emerald-400/70 font-mono block">130%+</span>
            <span className="text-[10px] text-emerald-400/50">exceptional</span>
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
                  <span className="text-emerald-400/70">Budget x 1.3+</span>
                  <span className="text-emerald-400/60">Bidding war</span>
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
