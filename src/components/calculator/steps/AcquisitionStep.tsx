import { WaterfallInputs, GuildState, formatCompactCurrency, calculateBreakeven } from "@/lib/waterfall";
import { CapitalSelections } from "./CapitalSelectStep";
import { useState } from "react";

interface AcquisitionStepProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  selections: CapitalSelections;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const AcquisitionStep = ({ inputs, guilds, selections, onUpdateInput }: AcquisitionStepProps) => {
  const [isFocused, setIsFocused] = useState(false);

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
      {/* Hero question - minimal */}
      <div className="text-center mb-8">
        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2">
          What's the offer?
        </h2>
        <p className="text-white/40 text-sm">
          Enter the acquisition price to see your position
        </p>
      </div>

      {/* Breakeven context */}
      <div className="mb-4 p-4 bg-black border border-[#1A1A1A] flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-white/40 block">Your breakeven</span>
          <span className="font-mono text-lg text-white">
            {Number.isFinite(breakeven) ? formatCompactCurrency(breakeven) : '—'}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-white/30 block">Minimum to recoup</span>
          <span className="text-xs text-white/40">all costs + returns</span>
        </div>
      </div>

      {/* Acquisition Input Card */}
      <div className="bg-black border border-[#1A1A1A]">
        <div className="p-4 border-b border-[#1A1A1A]">
          <span className="text-xs uppercase tracking-wider text-white/40">Acquisition Price</span>
        </div>

        <div className="p-5">
          <div
            className={`flex items-center bg-black border transition-colors ${
              isFocused ? 'border-white/40' : 'border-[#2A2A2A]'
            }`}
          >
            <span className="pl-4 pr-2 font-mono text-xl text-white/40">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={formatValue(inputs.revenue)}
              onChange={(e) => onUpdateInput('revenue', parseValue(e.target.value))}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="3,500,000"
              className="flex-1 bg-transparent py-4 pr-4 outline-none font-mono text-xl text-white text-right placeholder:text-white/20 tabular-nums"
            />
          </div>
        </div>

        {/* Status indicator */}
        {inputs.revenue > 0 && Number.isFinite(breakeven) && (
          <div className="border-t border-[#1A1A1A] p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-white/40 mb-1">
                {isAboveBreakeven ? 'Above breakeven' : 'Below breakeven'}
              </p>
              <p className="text-sm font-mono text-white">
                {isAboveBreakeven
                  ? `+${formatCompactCurrency(Math.abs(cushion))} cushion`
                  : `${formatCompactCurrency(Math.abs(cushion))} shortfall`}
              </p>
            </div>
            {isAboveBreakeven && percentAbove > 0 && (
              <span className="text-xl font-mono text-white/60">
                +{percentAbove.toFixed(0)}%
              </span>
            )}
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div className="mt-4 p-4 bg-black border border-[#1A1A1A]">
        <p className="text-xs text-white/30 text-center mb-3">Typical acquisition ranges</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <span className="text-xs text-white/50 font-mono block">100-110%</span>
            <span className="text-[10px] text-white/30">baseline</span>
          </div>
          <div className="border-x border-[#1A1A1A] px-2">
            <span className="text-xs text-white/60 font-mono block">115-130%</span>
            <span className="text-[10px] text-white/40">strong</span>
          </div>
          <div>
            <span className="text-xs text-white/70 font-mono block">130%+</span>
            <span className="text-[10px] text-white/50">exceptional</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcquisitionStep;
