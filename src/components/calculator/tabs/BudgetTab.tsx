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
          className="p-4 border border-gold/30 bg-gold/5"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <h3 className="text-sm font-bold text-gold mb-2 uppercase tracking-wider">
            👉 Start Here
          </h3>
          <p className="text-sm text-text-primary leading-relaxed">
            Enter your film's total production budget in the field below.
            This is your "negative cost" — the full amount needed to produce the film.
          </p>
          <p className="text-xs text-text-dim mt-2">
            Example: For a $750,000 indie film, enter <span className="font-mono text-text-mid">750000</span> or <span className="font-mono text-text-mid">750,000</span>
          </p>
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
          <div className="field-label flex items-center gap-2">
            <span>Production Budget <span className="text-text-dim text-xs">(Negative Cost)</span></span>
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
              className="flex-1 bg-transparent py-4 pr-4 outline-none font-mono text-[22px] text-text-primary text-right placeholder:text-text-dim placeholder:text-base tabular-nums"
            />
            {isCompleted && (
              <span className="pr-4 text-gold text-lg">✓</span>
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
