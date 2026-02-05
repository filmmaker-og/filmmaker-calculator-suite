import { WaterfallInputs } from "@/lib/waterfall";
import { CircleDollarSign, Calculator, Minus, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useHaptics } from "@/hooks/use-haptics";
import StandardStepLayout from "../StandardStepLayout";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface BudgetStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const BudgetStep = ({ inputs, onUpdateInput }: BudgetStepProps) => {
  const haptics = useHaptics();
  const [isFocused, setIsFocused] = useState(false);
  const [showFeeDetails, setShowFeeDetails] = useState(false);
  
  // Track raw input value while focused to prevent cursor jumping
  const [rawBudgetValue, setRawBudgetValue] = useState('');

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  const formatCompact = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const hasBudget = inputs.budget > 0;

  // Calculate off-the-top total for display
  const offTopTotal = inputs.budget > 0
    ? (inputs.budget * 0.01) + (inputs.budget * (inputs.salesFee / 100)) + inputs.salesExp
    : 0;

  // Handle budget input focus
  const handleBudgetFocus = () => {
    setIsFocused(true);
    // Show raw number without commas when focused
    setRawBudgetValue(inputs.budget > 0 ? inputs.budget.toString() : '');
  };

  // Handle budget input blur
  const handleBudgetBlur = () => {
    setIsFocused(false);
    setRawBudgetValue('');
  };

  // Handle budget input change
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setRawBudgetValue(raw);
    onUpdateInput('budget', parseInt(raw) || 0);
  };

  // Display value: raw while focused, formatted when blurred
  const displayBudgetValue = isFocused ? rawBudgetValue : formatValue(inputs.budget);

  return (
    <StandardStepLayout
      icon={CircleDollarSign}
      title="What's Your"
      titleHighlight="Budget?"
      subtitle="Total production cost, development through delivery"
      sectionLabel="Negative Cost"
      sectionIcon={Calculator}
      isCompleted={false}
      quickReference={
        hasBudget ? (
          <div className="mt-4">
            <button
              onClick={() => {
                haptics.light();
                setShowFeeDetails(!showFeeDetails);
              }}
              className="w-full bg-black border border-[#1A1A1A] p-4 flex items-center justify-between hover:border-[#2A2A2A] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-white/40">Off-the-top fees</span>
                <span className="text-xs text-white/20 hidden sm:inline">
                  1% CAM + {inputs.salesFee}% Sales + {formatCompact(inputs.salesExp)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-white/60">{formatCompact(offTopTotal)}</span>
                {showFeeDetails ? (
                  <ChevronUp className="w-4 h-4 text-white/30" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-white/30" />
                )}
              </div>
            </button>

            {/* Expanded fee details */}
            {showFeeDetails && (
              <div className="border border-t-0 border-[#1A1A1A] bg-black">
                {/* Sales Agent Fee */}
                <div className="p-4 border-b border-[#1A1A1A]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-white/60">Sales Agent</span>
                    <span className="text-xs text-white/30">10-25% typical</span>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => {
                        haptics.light();
                        if (inputs.salesFee > 0) onUpdateInput('salesFee', inputs.salesFee - 5);
                      }}
                      disabled={inputs.salesFee <= 0}
                      className="w-10 h-10 flex items-center justify-center border border-[#2A2A2A] text-white/40 hover:text-white hover:border-white/30 transition-colors disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-2xl text-white min-w-[60px] text-center tabular-nums">
                      {inputs.salesFee}%
                    </span>
                    <button
                      onClick={() => {
                        haptics.light();
                        if (inputs.salesFee < 30) onUpdateInput('salesFee', inputs.salesFee + 5);
                      }}
                      disabled={inputs.salesFee >= 30}
                      className="w-10 h-10 flex items-center justify-center border border-[#2A2A2A] text-white/40 hover:text-white hover:border-white/30 transition-colors disabled:opacity-30"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Marketing Cap */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-white/60">Marketing & Delivery</span>
                    <span className="text-xs text-white/30">$75K typical</span>
                  </div>
                  <div className="flex items-center bg-black border border-[#2A2A2A]">
                    <span className="pl-4 pr-2 font-mono text-white/40">$</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formatValue(inputs.salesExp)}
                      onChange={(e) => onUpdateInput('salesExp', parseValue(e.target.value))}
                      placeholder="75,000"
                      className="flex-1 bg-transparent py-3 pr-4 outline-none font-mono text-white text-right placeholder:text-white/20 tabular-nums"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null
      }
    >
      {/* Quick Tip */}
      <p className="text-xs text-white/40 mb-3">
        Include all costs through final delivery
      </p>

      {/* Main Budget Input */}
      <div
        className={`flex items-center bg-black border transition-colors ${
          isFocused ? 'border-white/40' : 'border-[#2A2A2A]'
        }`}
      >
        <span className="pl-4 pr-2 font-mono text-xl text-white/40">$</span>
        <input
          type="text"
          inputMode="numeric"
          value={displayBudgetValue}
          onChange={handleBudgetChange}
          onFocus={handleBudgetFocus}
          onBlur={handleBudgetBlur}
          placeholder="2,000,000"
          className="flex-1 bg-transparent py-4 pr-4 outline-none font-mono text-xl text-white text-right placeholder:text-white/20 tabular-nums"
        />
      </div>
    </StandardStepLayout>
  );
};

export default BudgetStep;
