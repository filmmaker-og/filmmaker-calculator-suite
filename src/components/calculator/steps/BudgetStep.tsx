import { WaterfallInputs } from "@/lib/waterfall";
import { useState } from "react";

interface BudgetStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const BudgetStep = ({ inputs, onUpdateInput }: BudgetStepProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  return (
    <div className="min-h-[60vh] flex flex-col justify-center">
      {/* Hero question */}
      <div className="text-center mb-8">
        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2">
          What's your budget?
        </h2>
        <p className="text-white/40 text-sm">
          Total negative cost
        </p>
      </div>

      {/* Budget Input */}
      <div className="bg-black border border-[#1A1A1A] p-5">
        <div
          className={`flex items-center bg-black border transition-colors ${
            isFocused ? 'border-white/40' : 'border-[#2A2A2A]'
          }`}
        >
          <span className="pl-4 pr-2 font-mono text-xl text-white/40">$</span>
          <input
            type="text"
            inputMode="numeric"
            value={formatValue(inputs.budget)}
            onChange={(e) => onUpdateInput('budget', parseValue(e.target.value))}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="2,500,000"
            autoFocus
            className="flex-1 bg-transparent py-4 pr-4 outline-none font-mono text-xl text-white text-right placeholder:text-white/20 tabular-nums"
          />
        </div>
      </div>

      {/* Helper text */}
      <p className="mt-4 text-center text-xs text-white/30">
        Development through delivery, before financing costs
      </p>
    </div>
  );
};

export default BudgetStep;
