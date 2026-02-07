import { useState, useRef, useEffect } from "react";
import { Check, Target, TrendingUp, TrendingDown, Info, Percent, DollarSign } from "lucide-react";
import { WaterfallInputs, GuildState, CapitalSelections, formatCompactCurrency, calculateBreakeven } from "@/lib/waterfall";
import { cn } from "@/lib/utils";
import { useMobileKeyboardScroll } from "@/hooks/use-mobile-keyboard";
import StandardStepLayout from "../StandardStepLayout";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";

interface DealInputProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  selections: CapitalSelections;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onBack?: () => void;
  onNext: () => void;
}

/**
 * DealInput - Acquisition price & Waterfall Levers
 * 
 * Step 1 of Deal Tab: Collect acquisition/revenue projection AND the key deductions
 * (Sales Fees, Marketing) that determine the actual "Net Revenue" available.
 */
const DealInput = ({ inputs, guilds, selections, onUpdateInput, onNext }: DealInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Mobile keyboard scroll handling
  const { ref: mobileRef, scrollIntoView } = useMobileKeyboardScroll<HTMLDivElement>();

  // Auto-focus on mount
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
      // Only proceed if we have meaningful revenue
      if (inputs.revenue > 0) {
        // Optional: onNext() here if we want auto-advance, but with multiple inputs usually better to let user click Continue
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    scrollIntoView();
  };

  // Calculate breakeven
  const breakeven = calculateBreakeven(inputs, guilds, selections);
  const hasRevenue = inputs.revenue > 0;
  const cushion = inputs.revenue - breakeven;
  const isAboveBreakeven = cushion > 0;
  const percentAbove = breakeven > 0 ? ((inputs.revenue - breakeven) / breakeven) * 100 : 0;

  return (
    <StandardStepLayout
      chapter="03"
      title="The Market"
      subtitle="Acquisition Price & Distribution Fees"
      isComplete={hasRevenue}
      onNext={onNext}
      nextLabel="See the Waterfall"
    >
      <div className="space-y-8" ref={mobileRef}>
        
        {/* 1. ACQUISITION AMOUNT (Top Level) */}
        <div className="space-y-2">
           <div className="bg-bg-elevated border border-border-default rounded-lg p-5 transition-all focus-within:border-gold/50 focus-within:shadow-focus focus-within:bg-bg-surface">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-text-dim font-bold">
                  Gross Acquisition Price
                </span>
                 <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Info className="w-3.5 h-3.5 text-text-dim/50 hover:text-gold cursor-pointer transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[200px] bg-bg-card border-gold/30 text-xs">
                      <p>The total amount the distributor pays for the film.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex items-center relative">
              <span className="font-mono text-xl text-text-dim mr-2">$</span>
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={formatValue(inputs.revenue)}
                onChange={(e) => onUpdateInput('revenue', parseValue(e.target.value))}
                onFocus={handleFocus}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="0"
                className="flex-1 bg-transparent outline-none font-mono text-[22px] text-text-primary text-right placeholder:text-text-dim placeholder:text-base tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* 2. THE "FIRES" (Deductions) */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 mb-2">
             <h3 className="text-sm font-bold uppercase tracking-widest text-gold">Distribution "Fires"</h3>
             <div className="h-px flex-1 bg-border-subtle" />
           </div>

           {/* Sales Fee Slider */}
           <div className="bg-bg-surface border border-border-subtle rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                 <span className="text-xs uppercase tracking-wide text-text-dim font-bold flex items-center gap-2">
                   Sales Agent Fee <Percent className="w-3 h-3 text-text-dim/50" />
                 </span>
                 <span className="font-mono text-sm font-bold text-gold">
                   {inputs.salesFee}%
                 </span>
              </div>
              <Slider
                value={[inputs.salesFee]}
                min={0}
                max={35}
                step={1}
                onValueChange={(vals) => onUpdateInput('salesFee', vals[0])}
                className="my-2"
              />
              <div className="flex justify-between text-[9px] text-text-dim uppercase tracking-wider mt-1">
                <span>Direct (0%)</span>
                <span>Standard (10-15%)</span>
                <span>Aggressive (25%+)</span>
              </div>
           </div>

           {/* Marketing Expenses */}
           <div className="bg-bg-surface border border-border-subtle rounded-lg p-4 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                 <span className="text-xs uppercase tracking-wide text-text-dim font-bold flex items-center gap-2">
                   Marketing & Delivery <DollarSign className="w-3 h-3 text-text-dim/50" />
                 </span>
                 <span className="text-[10px] text-text-dim/70">Deductible Expenses</span>
              </div>
              <div className="w-32">
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatValue(inputs.marketingExpenses)}
                  onChange={(e) => onUpdateInput('marketingExpenses', parseValue(e.target.value))}
                  placeholder="0"
                  className="w-full bg-bg-elevated border border-border-subtle rounded px-3 py-2 font-mono text-sm text-right text-text-primary focus:border-gold/50 focus:outline-none"
                />
              </div>
           </div>
        </div>

        {/* Breakeven Status - Repositioned to bottom for context after inputs */}
        {hasRevenue && Number.isFinite(breakeven) && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-text-dim mb-2">
              <span>Estimated Outcome</span>
            </div>
            <div
              className={cn(
                "relative p-4 border flex items-center justify-between overflow-hidden",
                isAboveBreakeven
                  ? "border-green-500/30 bg-green-500/5" // Use Green for "In the Money" to be distinct from Gold
                  : "border-red-500/30 bg-red-500/5"
              )}
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <div className="relative flex items-center gap-3">
                {isAboveBreakeven ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
                <div>
                  <p className={cn(
                    "text-xs font-bold uppercase tracking-wider mb-0.5",
                    isAboveBreakeven ? "text-green-500" : "text-red-500"
                  )}>
                    {isAboveBreakeven ? 'Profitable' : 'Shortfall'}
                  </p>
                  <p className="text-sm font-mono font-bold text-text-primary">
                    {isAboveBreakeven
                      ? `+${formatCompactCurrency(Math.abs(cushion))}`
                      : `-${formatCompactCurrency(Math.abs(cushion))}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </StandardStepLayout>
  );
};

export default DealInput;
