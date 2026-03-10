import { useRef } from "react";
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
        <div
          className="p-5"
          style={{
            background: "#0A0A0A",
            border: "1px solid rgba(212,175,55,0.15)",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: "rgba(255,255,255,0.40)" }}>
                Gross Acquisition Price
              </span>
               <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 cursor-pointer transition-colors" style={{ color: "rgba(255,255,255,0.20)" }} />
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="max-w-[200px] text-xs"
                    style={{ background: "#0A0A0A", border: "1px solid rgba(212,175,55,0.15)" }}
                  >
                    <p>The total amount the distributor pays for the film.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex items-center relative">
            <span className="font-mono mr-2" style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.40)" }}>$</span>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={formatValue(inputs.revenue)}
              onChange={(e) => onUpdateInput('revenue', parseValue(e.target.value))}
              onFocus={scrollIntoView}
              placeholder="2,000,000"
              className="flex-1 bg-transparent outline-none font-mono text-right tabular-nums"
              style={{ fontSize: "1.8rem", color: "#fff" }}
            />
          </div>
          <p className="text-[10px] mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.40)" }}>
            What would a streamer or buyer pay for your film? Typical indie range: $500K–$5M.
            Not sure? Start with 2× your budget as a baseline.
          </p>
        </div>

        {/* 2. THE "FIRES" (Deductions Inputs) */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 mb-2">
             <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.40)" }}>Distribution Expenses</h3>
             <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.06)" }} />
           </div>

           {/* Sales Fee Slider */}
           <div
             className="p-4"
             style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px" }}
           >
              <div className="flex items-center justify-between mb-4">
                 <span className="text-xs uppercase tracking-wide font-semibold flex items-center gap-2" style={{ color: "rgba(255,255,255,0.40)" }}>
                   Sales Agent Fee <Percent className="w-3 h-3" style={{ color: "rgba(255,255,255,0.20)" }} />
                 </span>
                 <span className="font-mono text-sm font-medium" style={{ color: "#fff" }}>
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
              <div className="flex justify-between text-[9px] uppercase tracking-wider mt-1" style={{ color: "rgba(255,255,255,0.40)" }}>
                <span>Direct (0%)</span>
                <span>Standard (15%)</span>
                <span>Aggressive (25%+)</span>
              </div>
           </div>

           {/* Marketing Expenses */}
           <div
             className="p-4 flex items-center justify-between"
             style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px" }}
           >
              <div className="flex flex-col gap-1">
                 <span className="text-xs uppercase tracking-wide font-semibold flex items-center gap-2" style={{ color: "rgba(255,255,255,0.40)" }}>
                   Sales Agent Marketing <DollarSign className="w-3 h-3" style={{ color: "rgba(255,255,255,0.20)" }} />
                 </span>
                 <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.28)" }}>Expense Cap (Standard $75k)</span>
              </div>
              <div className="w-32">
                {/* FIX: Bind to salesExp, NOT marketingExpenses */}
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatValue(inputs.salesExp)}
                  onChange={(e) => onUpdateInput('salesExp', parseValue(e.target.value))}
                  placeholder="0"
                  className="w-full font-mono text-base text-right"
                  style={{
                    background: "#0A0A0A",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    color: "#fff",
                    outline: "none",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,55,0.35)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.06)"; }}
                />
              </div>
           </div>
        </div>

        {/* 3. LIVE ASSUMPTIONS BLOCK (New) */}
        {hasRevenue && (
          <div className="space-y-3 pt-2">
             <div className="flex items-center gap-2">
               <Calculator className="w-3 h-3" style={{ color: "#D4AF37" }} />
               <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#D4AF37" }}>Live Assumptions</span>
             </div>

             <div
               className="overflow-hidden"
               style={{ background: "#0A0A0A", border: "1px solid rgba(212,175,55,0.15)", borderRadius: "12px" }}
             >
                {/* CAM (1%) */}
                <div className="flex items-center justify-between p-3 text-xs" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                   <span style={{ color: "rgba(255,255,255,0.40)" }}>CAM (1%)</span>
                   <span className="font-mono" style={{ color: "rgba(255,255,255,0.70)" }}>{formatCompactCurrency(camFee)}</span>
                </div>

                {/* Sales Fee */}
                <div className="flex items-center justify-between p-3 text-xs" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                   <span style={{ color: "rgba(255,255,255,0.40)" }}>Sales Fee ({inputs.salesFee}%)</span>
                   <span className="font-mono" style={{ color: "rgba(255,255,255,0.70)" }}>{formatCompactCurrency(salesAgentFee)}</span>
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between p-3 text-xs" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                   <span style={{ color: "rgba(255,255,255,0.40)" }}>Sales Agent Marketing</span>
                   {/* FIX: Use salesExp here too */}
                   <span className="font-mono" style={{ color: "rgba(255,255,255,0.70)" }}>{formatCompactCurrency(inputs.salesExp)}</span>
                </div>

                {/* Guilds */}
                <div className="flex items-center justify-between p-3 text-xs" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                   <span style={{ color: "rgba(255,255,255,0.40)" }}>Guilds (Est.)</span>
                   <span className="font-mono" style={{ color: "rgba(255,255,255,0.70)" }}>{formatCompactCurrency(guildFee)}</span>
                </div>

                {/* Net to Waterfall */}
                <div className="flex items-center justify-between p-3" style={{ background: "#0A0A0A", borderTop: "1px solid rgba(212,175,55,0.15)" }}>
                   <span className="text-xs font-semibold uppercase" style={{ color: "#fff" }}>Net to Waterfall</span>
                   <span className="font-mono text-sm font-medium" style={{ color: "#D4AF37" }}>{formatCompactCurrency(netRevenue)}</span>
                </div>
             </div>
          </div>
        )}

      </div>
    </StandardStepLayout>
  );
};

export default DealInput;
