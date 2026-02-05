import { WaterfallInputs, GuildState } from "@/lib/waterfall";
import { Minus, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef } from "react";
import { useHaptics } from "@/hooks/use-haptics";
import { cn } from "@/lib/utils";
import ChapterCard from "../ChapterCard";
import GlossaryTrigger, { GLOSSARY } from "../GlossaryTrigger";

interface BudgetTabProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onToggleGuild: (guild: keyof GuildState) => void;
}

const BudgetTab = ({ inputs, onUpdateInput }: BudgetTabProps) => {
  const haptics = useHaptics();
  const [isFocused, setIsFocused] = useState(false);
  const [showFeeDetails, setShowFeeDetails] = useState(false);
  const budgetInputRef = useRef<HTMLInputElement>(null);
  const salesExpInputRef = useRef<HTMLInputElement>(null);

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

  // Auto-select all text on focus for easy overwriting
  const handleFocus = (ref: React.RefObject<HTMLInputElement>) => {
    setIsFocused(true);
    // Small delay to ensure the input is focused before selecting
    setTimeout(() => {
      ref.current?.select();
    }, 0);
  };

  // Calculate off-the-top total for display
  const offTopTotal = inputs.budget > 0
    ? (inputs.budget * 0.01) + (inputs.budget * (inputs.salesFee / 100)) + inputs.salesExp
    : 0;

  return (
    <div className="space-y-4 pb-8">
      {/* Production Budget Section */}
      <ChapterCard
        chapter="01"
        title="BUDGET"
        isActive={true}
        glossaryTrigger={
          <GlossaryTrigger {...GLOSSARY.negativeCost} />
        }
      >
        {/* Budget Input */}
        <div className="mb-6">
          <div className="field-label">
            <span>Negative Cost</span>
          </div>
          <div
            className={cn(
              "flex items-center rounded-md transition-all",
              "bg-bg-surface border",
              isFocused ? "border-border-active shadow-focus" : "border-border-default"
            )}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <span className="pl-4 pr-2 font-mono text-xl text-text-dim">$</span>
            <input
              ref={budgetInputRef}
              type="text"
              inputMode="numeric"
              value={formatValue(inputs.budget)}
              onChange={(e) => onUpdateInput('budget', parseValue(e.target.value))}
              onFocus={() => handleFocus(budgetInputRef)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter your budget"
              className="flex-1 bg-transparent py-4 pr-4 outline-none font-mono text-[22px] text-text-primary text-right placeholder:text-text-dim placeholder:text-base tabular-nums"
            />
          </div>
          <p className="mt-2 text-xs text-text-dim">
            Total production cost, development through delivery
          </p>
        </div>

        {/* Off-the-Top Summary - only show when budget is entered */}
        {inputs.budget > 0 && (
          <div
            className="border border-border-default overflow-hidden"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <button
              onClick={() => {
                haptics.light();
                setShowFeeDetails(!showFeeDetails);
              }}
              className="w-full p-4 flex items-center justify-between bg-bg-surface hover:bg-bg-elevated transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-text-dim">Off-the-top fees</span>
                <GlossaryTrigger
                  term="Off-the-top"
                  title="OFF-THE-TOP FEES"
                  description="Fees deducted from gross revenue before anyone else gets paid. These come first in the waterfall."
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-text-mid">{formatCompact(offTopTotal)}</span>
                {showFeeDetails ? (
                  <ChevronUp className="w-4 h-4 text-text-dim" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-text-dim" />
                )}
              </div>
            </button>

            {/* Expanded fee details */}
            {showFeeDetails && (
              <div className="border-t border-border-subtle bg-bg-card">
                {/* CAM Fee - Fixed */}
                <div className="p-4 border-b border-border-subtle flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-text-mid">CAM Fee</span>
                    <GlossaryTrigger {...GLOSSARY.camFee} />
                  </div>
                  <span className="font-mono text-sm text-text-dim">1% fixed</span>
                </div>

                {/* Sales Agent Fee */}
                <div className="p-4 border-b border-border-subtle">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text-mid">Sales Agent</span>
                      <GlossaryTrigger {...GLOSSARY.salesAgent} />
                    </div>
                    <span className="text-xs text-text-dim">10-25% typical</span>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => {
                        haptics.light();
                        if (inputs.salesFee > 0) onUpdateInput('salesFee', inputs.salesFee - 5);
                      }}
                      disabled={inputs.salesFee <= 0}
                      className="w-10 h-10 flex items-center justify-center border border-border-default rounded-md text-text-dim hover:text-text-primary hover:border-text-dim transition-colors disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-2xl text-text-primary min-w-[60px] text-center tabular-nums">
                      {inputs.salesFee}%
                    </span>
                    <button
                      onClick={() => {
                        haptics.light();
                        if (inputs.salesFee < 30) onUpdateInput('salesFee', inputs.salesFee + 5);
                      }}
                      disabled={inputs.salesFee >= 30}
                      className="w-10 h-10 flex items-center justify-center border border-border-default rounded-md text-text-dim hover:text-text-primary hover:border-text-dim transition-colors disabled:opacity-30"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Marketing Cap */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-text-mid">Marketing & Delivery</span>
                    <span className="text-xs text-text-dim">$75K typical</span>
                  </div>
                  <div
                    className="flex items-center bg-bg-surface border border-border-default"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  >
                    <span className="pl-4 pr-2 font-mono text-text-dim">$</span>
                    <input
                      ref={salesExpInputRef}
                      type="text"
                      inputMode="numeric"
                      value={formatValue(inputs.salesExp)}
                      onChange={(e) => onUpdateInput('salesExp', parseValue(e.target.value))}
                      onFocus={() => handleFocus(salesExpInputRef)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="75,000"
                      className="flex-1 bg-transparent py-3 pr-4 outline-none font-mono text-text-primary text-right placeholder:text-text-dim tabular-nums"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ChapterCard>
    </div>
  );
};

export default BudgetTab;
