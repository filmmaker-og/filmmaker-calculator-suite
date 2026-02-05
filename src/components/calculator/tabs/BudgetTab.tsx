import { WaterfallInputs, GuildState } from "@/lib/waterfall";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import ChapterCard from "../ChapterCard";
import GlossaryTrigger, { GLOSSARY } from "../GlossaryTrigger";

interface BudgetTabProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onToggleGuild: (guild: keyof GuildState) => void;
  onAdvance?: () => void;
}

const BudgetTab = ({ inputs, onUpdateInput, onAdvance }: BudgetTabProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const budgetInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    if (inputs.budget === 0) {
      budgetInputRef.current?.focus();
    }
  }, []);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  // Auto-select all text on focus for easy overwriting
  const handleFocus = () => {
    setIsFocused(true);
    setTimeout(() => {
      budgetInputRef.current?.select();
    }, 0);
  };

  // Handle Enter key to blur input and advance
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      budgetInputRef.current?.blur();
      // Advance to next section if budget is entered
      if (inputs.budget > 0 && onAdvance) {
        setTimeout(() => onAdvance(), 100);
      }
    }
  };

  const isCompleted = inputs.budget > 0;

  return (
    <div className="space-y-4 pb-8">
      {/* Clear instruction box for first-time users */}
      {!isCompleted && (
        <div
          className="p-5 border border-gold/40 bg-gold/5"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <h3 className="text-base font-bold text-gold mb-3 uppercase tracking-wide">
            👉 Start Here
          </h3>
          <p className="text-sm text-text-primary leading-relaxed mb-3">
            Enter your film's total production budget below.
          </p>
          <p className="text-sm text-text-mid mb-2">
            This is called your <span className="text-gold font-semibold">"negative cost"</span> in the industry.
          </p>
          <div className="mt-4 pt-3 border-t border-gold/20">
            <p className="text-xs text-text-dim mb-1">
              Example amounts:
            </p>
            <div className="flex gap-3 flex-wrap">
              <span className="font-mono text-xs text-text-mid bg-bg-surface px-2 py-1 rounded">$250,000</span>
              <span className="font-mono text-xs text-text-mid bg-bg-surface px-2 py-1 rounded">$750,000</span>
              <span className="font-mono text-xs text-text-mid bg-bg-surface px-2 py-1 rounded">$2,500,000</span>
            </div>
          </div>
        </div>
      )}

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
        <div>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-text-primary uppercase tracking-wide">Production Budget</span>
                <span className="text-xs text-text-dim italic">aka "Negative Cost"</span>
              </div>
              {isCompleted && (
                <button
                  onClick={() => {
                    onUpdateInput('budget', 0);
                    setTimeout(() => budgetInputRef.current?.focus(), 100);
                  }}
                  className="text-xs text-text-dim hover:text-gold transition-colors px-2 py-1 border border-border-default rounded"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          <div
            className={cn(
              "flex items-center rounded-md transition-all",
              "bg-bg-surface border",
              isFocused ? "border-border-active shadow-focus" : isCompleted ? "border-gold-muted" : "border-border-default"
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
              onFocus={handleFocus}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="750,000"
              className="flex-1 bg-transparent py-4 outline-none font-mono text-[22px] text-text-primary text-right placeholder:text-text-dim placeholder:text-base tabular-nums"
            />
            {isCompleted && (
              <span className="pl-3 pr-4 text-xl flex items-center">✅</span>
            )}
          </div>
          <p className="mt-2 text-sm text-text-dim">
            Enter your full production budget and hit Next
          </p>
        </div>
      </ChapterCard>
    </div>
  );
};

export default BudgetTab;
