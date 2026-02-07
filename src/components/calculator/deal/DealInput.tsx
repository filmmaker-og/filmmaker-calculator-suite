import { useRef, useEffect } from "react";
import { Info, Percent, DollarSign, Calculator } from "lucide-react";
import { WaterfallInputs, GuildState, CapitalSelections, formatCompactCurrency, CAM_PCT, SAG_PCT, WGA_PCT, DGA_PCT } from "@/lib/waterfall";
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
 * Step 1 of Deal Tab: Collect acquisition/revenue projection AND the key deductions.
 * NOW INCLUDES: "Live Assumptions" block to mirror the Netlify app.
 */
const DealInput = ({ inputs, guilds, selections, onUpdateInput, onNext }: DealInputProps) => {
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

  const hasRevenue = inputs.revenue > 0;

  // --- LIVE ASSUMPTIONS CALCULATIONS ---
  // Uses shared constants from waterfall.ts (single source of truth)
  const camFee = inputs.revenue * CAM_PCT;
  const salesAgentFee = inputs.revenue * (inputs.salesFee / 100);
  const guildRate = (guilds.sag ? SAG_PCT : 0) + (guilds.wga ? WGA_PCT : 0) + (guilds.dga ? DGA_PCT : 0);
  const guildFee = inputs.revenue * guildRate;

  // FIX: Use salesExp (the cap) instead of marketingExpenses
  const totalOffTop = camFee + salesAgentFee + inputs.salesExp + guildFee;
  const netRevenue = Math.max(0, inputs.revenue - totalOffTop);

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
              onFocus={scrollIntoView}
              placeholder="0"
              className="flex-1 bg-transparent outline-none font-mono text-[22px] text-text-primary text-right placeholder:text-text-dim placeholder:text-base tabular-nums"
            />
          </div>
        </div>

        {/* 2. THE "FIRES" (Deductions Inputs) */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 mb-2">
             <h3 className="text-sm font-bold uppercase tracking-widest text-text-dim">Distribution Expenses</h3>
             <div className="h-px flex-1 bg-border-subtle" />
           </div>

           {/* Sales Fee Slider */}
           <div className="bg-bg-surface border border-border-subtle rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                 <span className="text-xs uppercase tracking-wide text-text-dim font-bold flex items-center gap-2">
                   Sales Agent Fee <Percent className="w-3 h-3 text-text-dim/50" />
                 </span>
                 <span className="font-mono text-sm font-bold text-text-primary">
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
                <span>Standard (15%)</span>
                <span>Aggressive (25%+)</span>
              </div>
           </div>

           {/* Marketing Expenses */}
           <div className="bg-bg-surface border border-border-subtle rounded-lg p-4 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                 <span className="text-xs uppercase tracking-wide text-text-dim font-bold flex items-center gap-2">
                   Sales Agent Marketing <DollarSign className="w-3 h-3 text-text-dim/50" />
                 </span>
                 <span className="text-[10px] text-text-dim/70">Expense Cap (Standard $75k)</span>
              </div>
              <div className="w-32">
                {/* FIX: Bind to salesExp, NOT marketingExpenses */}
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatValue(inputs.salesExp)}
                  onChange={(e) => onUpdateInput('salesExp', parseValue(e.target.value))}
                  placeholder="0"
                  className="w-full bg-bg-elevated border border-border-subtle rounded px-3 py-2 font-mono text-sm text-right text-text-primary focus:border-gold/50 focus:outline-none"
                />
              </div>
           </div>
        </div>

        {/* 3. LIVE ASSUMPTIONS BLOCK (New) */}
        {/* This mirrors the Netlify logic */}
        {hasRevenue && (
          <div className="space-y-3 pt-2">
             <div className="flex items-center gap-2">
               <Calculator className="w-3 h-3 text-gold" />
               <span className="text-xs font-bold uppercase tracking-widest text-gold">Live Assumptions</span>
             </div>
             
             <div className="bg-bg-card border border-border-default rounded-lg overflow-hidden divide-y divide-border-subtle">
                {/* CAM (1%) */}
                <div className="flex items-center justify-between p-3 text-xs">
                   <span className="text-text-dim">CAM (1%)</span>
                   <span className="font-mono text-text-mid">{formatCompactCurrency(camFee)}</span>
                </div>
                
                {/* Sales Fee */}
                <div className="flex items-center justify-between p-3 text-xs">
                   <span className="text-text-dim">Sales Fee ({inputs.salesFee}%)</span>
                   <span className="font-mono text-text-mid">{formatCompactCurrency(salesAgentFee)}</span>
                </div>
                
                {/* Marketing */}
                <div className="flex items-center justify-between p-3 text-xs">
                   <span className="text-text-dim">Sales Agent Marketing</span>
                   {/* FIX: Use salesExp here too */}
                   <span className="font-mono text-text-mid">{formatCompactCurrency(inputs.salesExp)}</span>
                </div>
                
                {/* Guilds */}
                <div className="flex items-center justify-between p-3 text-xs">
                   <span className="text-text-dim">Guilds (Est.)</span>
                   <span className="font-mono text-text-mid">{formatCompactCurrency(guildFee)}</span>
                </div>

                {/* Net to Waterfall */}
                <div className="flex items-center justify-between p-3 bg-bg-elevated border-t border-border-default">
                   <span className="text-xs font-bold text-white uppercase">Net to Waterfall</span>
                   <span className="font-mono text-sm font-bold text-gold">{formatCompactCurrency(netRevenue)}</span>
                </div>
             </div>
          </div>
        )}

      </div>
    </StandardStepLayout>
  );
};

export default DealInput;
