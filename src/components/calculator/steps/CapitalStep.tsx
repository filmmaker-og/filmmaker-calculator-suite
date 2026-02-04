import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { Minus, Plus } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

interface CapitalStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const CapitalStep = ({ inputs, onUpdateInput }: CapitalStepProps) => {
  const haptics = useHaptics();

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  const adjustRate = (field: 'seniorDebtRate' | 'mezzanineRate' | 'premium', delta: number, min: number, max: number) => {
    haptics.light();
    const current = inputs[field] || 0;
    const newValue = Math.min(max, Math.max(min, current + delta));
    onUpdateInput(field, newValue);
  };

  const totalCapital = inputs.credits + inputs.debt + inputs.mezzanineDebt + inputs.equity;
  const gapPercent = inputs.budget > 0 ? (totalCapital / inputs.budget) * 100 : 0;

  return (
    <div className="min-h-[60vh] flex flex-col justify-center">
      {/* Header - minimal */}
      <div className="text-center mb-8">
        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2">
          Capital Structure
        </h2>
        <p className="text-white/40 text-sm">
          Enter all sources. Leave blank if not used.
        </p>
      </div>

      {/* TAX CREDITS */}
      <div className="bg-black border border-[#1A1A1A] mb-3">
        <div className="p-4 flex items-center justify-between border-b border-[#1A1A1A]">
          <span className="text-xs uppercase tracking-wider text-white/40">Tax Credits</span>
          {inputs.credits > 0 && <span className="text-xs text-white/50">✓</span>}
        </div>
        <div className="p-4">
          <div className="flex items-center bg-black border border-[#2A2A2A]">
            <span className="pl-4 pr-2 font-mono text-white/40">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={formatValue(inputs.credits)}
              onChange={(e) => onUpdateInput('credits', parseValue(e.target.value))}
              placeholder="0"
              className="flex-1 bg-transparent py-3 pr-4 outline-none font-mono text-white text-right placeholder:text-white/20 tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* SENIOR DEBT */}
      <div className="bg-black border border-[#1A1A1A] mb-3">
        <div className="p-4 flex items-center justify-between border-b border-[#1A1A1A]">
          <span className="text-xs uppercase tracking-wider text-white/40">Senior Debt</span>
          {inputs.debt > 0 && <span className="text-xs text-white/50">✓</span>}
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center bg-black border border-[#2A2A2A]">
            <span className="pl-4 pr-2 font-mono text-white/40">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={formatValue(inputs.debt)}
              onChange={(e) => onUpdateInput('debt', parseValue(e.target.value))}
              placeholder="0"
              className="flex-1 bg-transparent py-3 pr-4 outline-none font-mono text-white text-right placeholder:text-white/20 tabular-nums"
            />
          </div>
          {inputs.debt > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Interest</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustRate('seniorDebtRate', -1, 0, 20)}
                  className="w-8 h-8 flex items-center justify-center border border-[#2A2A2A] text-white/40 hover:text-white transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono text-sm text-white w-12 text-center">{inputs.seniorDebtRate}%</span>
                <button
                  onClick={() => adjustRate('seniorDebtRate', 1, 0, 20)}
                  className="w-8 h-8 flex items-center justify-center border border-[#2A2A2A] text-white/40 hover:text-white transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GAP/MEZZ DEBT */}
      <div className="bg-black border border-[#1A1A1A] mb-3">
        <div className="p-4 flex items-center justify-between border-b border-[#1A1A1A]">
          <span className="text-xs uppercase tracking-wider text-white/40">Gap / Mezz Debt</span>
          {inputs.mezzanineDebt > 0 && <span className="text-xs text-white/50">✓</span>}
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center bg-black border border-[#2A2A2A]">
            <span className="pl-4 pr-2 font-mono text-white/40">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={formatValue(inputs.mezzanineDebt)}
              onChange={(e) => onUpdateInput('mezzanineDebt', parseValue(e.target.value))}
              placeholder="0"
              className="flex-1 bg-transparent py-3 pr-4 outline-none font-mono text-white text-right placeholder:text-white/20 tabular-nums"
            />
          </div>
          {inputs.mezzanineDebt > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Interest</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustRate('mezzanineRate', -1, 0, 30)}
                  className="w-8 h-8 flex items-center justify-center border border-[#2A2A2A] text-white/40 hover:text-white transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono text-sm text-white w-12 text-center">{inputs.mezzanineRate}%</span>
                <button
                  onClick={() => adjustRate('mezzanineRate', 1, 0, 30)}
                  className="w-8 h-8 flex items-center justify-center border border-[#2A2A2A] text-white/40 hover:text-white transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EQUITY */}
      <div className="bg-black border border-[#1A1A1A] mb-3">
        <div className="p-4 flex items-center justify-between border-b border-[#1A1A1A]">
          <span className="text-xs uppercase tracking-wider text-white/40">Equity</span>
          {inputs.equity > 0 && <span className="text-xs text-white/50">✓</span>}
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center bg-black border border-[#2A2A2A]">
            <span className="pl-4 pr-2 font-mono text-white/40">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={formatValue(inputs.equity)}
              onChange={(e) => onUpdateInput('equity', parseValue(e.target.value))}
              placeholder="0"
              className="flex-1 bg-transparent py-3 pr-4 outline-none font-mono text-white text-right placeholder:text-white/20 tabular-nums"
            />
          </div>
          {inputs.equity > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Premium</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustRate('premium', -5, 0, 50)}
                  className="w-8 h-8 flex items-center justify-center border border-[#2A2A2A] text-white/40 hover:text-white transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono text-sm text-white w-12 text-center">{inputs.premium}%</span>
                <button
                  onClick={() => adjustRate('premium', 5, 0, 50)}
                  className="w-8 h-8 flex items-center justify-center border border-[#2A2A2A] text-white/40 hover:text-white transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary - only if capital entered */}
      {totalCapital > 0 && inputs.budget > 0 && (
        <div className="mt-4 bg-black border border-[#1A1A1A] p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/40">Total Capital</span>
            <span className="font-mono text-lg text-white">{formatCompactCurrency(totalCapital)}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-white/30">Budget Coverage</span>
            <span className="font-mono text-sm text-white/50">{gapPercent.toFixed(0)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CapitalStep;
