import { WaterfallInputs, GuildState } from "@/lib/waterfall";
import { useState, useRef } from "react";
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
  const [isFocused, setIsFocused] = useState(false);
  const budgetInputRef = useRef<HTMLInputElement>(null);

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

  // Handle Enter key to blur input (confirms entry)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      budgetInputRef.current?.blur();
    }
  };

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
        <div>
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
              onFocus={handleFocus}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="750,000"
              className="flex-1 bg-transparent py-4 pr-4 outline-none font-mono text-[22px] text-text-primary text-right placeholder:text-text-dim placeholder:text-base tabular-nums"
            />
          </div>
          <p className="mt-2 text-xs text-text-dim">
            Total production cost, development through delivery
          </p>
        </div>
      </ChapterCard>
    </div>
  );
};

export default BudgetTab;
