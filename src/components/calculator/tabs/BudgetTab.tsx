import { WaterfallInputs, GuildState } from "@/lib/waterfall";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import ChapterCard from "../ChapterCard";
import GlossaryTrigger, { GLOSSARY } from "../GlossaryTrigger";
import { Sparkles, X } from "lucide-react";

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

  // Auto-focus on mount if empty
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

  const handleFocus = () => {
    setIsFocused(true);
    setTimeout(() => {
      budgetInputRef.current?.select();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      budgetInputRef.current?.blur();
      if (inputs.budget > 0 && onAdvance) {
        setTimeout(() => onAdvance(), 100);
      }
    }
  };

  const handleClear = () => {
    onUpdateInput('budget', 0);
    setTimeout(() => {
      budgetInputRef.current?.focus();
    }, 0);
  };

  const isCompleted = inputs.budget > 0;

  return (
    <div className="space-y-6 pb-8">
      {/* Onboarding Card - Shows only when budget is empty */}
      {!isCompleted && (
        <div
          className="p-5 border border-gold/30 bg-gold/[0.03] animate-fade-in"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <div className="flex items-start gap-3 mb-3">
            <Sparkles className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <h3 className="text-base font-bold text-gold">
              This is where your journey begins.
            </h3>
          </div>
          <p className="text-sm text-text-primary leading-relaxed">
            The first step is understanding your budget. All you have to do here is enter your <span className="text-white font-medium">total negative cost</span>—that's your full production budget from development through final delivery—then hit Next.
          </p>
        </div>
      )}

      <ChapterCard
        chapter="01"
        title="BUDGET"
        isActive={true}
        glossaryTrigger={<GlossaryTrigger {...GLOSSARY.negativeCost} />}
      >
        {/* Input Section */}
        <div>
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-text-primary uppercase tracking-wide">Production Budget</span>
              <span className="text-xs text-text-dim italic">aka "Negative Cost"</span>
            </div>
          </div>

          <div
            className={cn(
              "flex items-center rounded-md transition-all relative",
              "bg-bg-surface border",
              isFocused
                ? "border-border-active shadow-focus"
                : isCompleted
                  ? "border-gold/50"
                  : "border-border-default"
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
              className="flex-1 bg-transparent py-4 outline-none font-mono text-[22px] text-text-primary text-right placeholder:text-text-dim placeholder:text-base tabular-nums pr-2"
            />

            {/* Clear button - shows when there's a value */}
            {isCompleted && (
              <button
                onClick={handleClear}
                className="mr-3 p-1.5 text-text-dim hover:text-white hover:bg-white/10 rounded transition-colors"
                aria-label="Clear budget"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className="mt-2 text-sm text-text-dim">
            Enter your full production budget and hit Next
          </p>
        </div>

        {/* Quick Amounts - ALWAYS visible */}
        <div
          className="mt-6 p-4 border border-gold/20 bg-gold/[0.03]"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <p className="text-xs text-text-dim mb-3 uppercase tracking-wide font-medium">Quick amounts:</p>
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={() => onUpdateInput('budget', 250000)} 
              className={cn(
                "font-mono text-xs px-3 py-2 rounded transition-colors border",
                inputs.budget === 250000 
                  ? "bg-gold/20 border-gold text-gold" 
                  : "bg-bg-void border-white/10 text-text-mid hover:border-gold/50"
              )}
            >
              $250k
            </button>
            <button 
              onClick={() => onUpdateInput('budget', 750000)} 
              className={cn(
                "font-mono text-xs px-3 py-2 rounded transition-colors border",
                inputs.budget === 750000 
                  ? "bg-gold/20 border-gold text-gold" 
                  : "bg-bg-void border-white/10 text-text-mid hover:border-gold/50"
              )}
            >
              $750k
            </button>
            <button 
              onClick={() => onUpdateInput('budget', 1500000)} 
              className={cn(
                "font-mono text-xs px-3 py-2 rounded transition-colors border",
                inputs.budget === 1500000 
                  ? "bg-gold/20 border-gold text-gold" 
                  : "bg-bg-void border-white/10 text-text-mid hover:border-gold/50"
              )}
            >
              $1.5M
            </button>
            <button 
              onClick={() => onUpdateInput('budget', 2500000)} 
              className={cn(
                "font-mono text-xs px-3 py-2 rounded transition-colors border",
                inputs.budget === 2500000 
                  ? "bg-gold/20 border-gold text-gold" 
                  : "bg-bg-void border-white/10 text-text-mid hover:border-gold/50"
              )}
            >
              $2.5M
            </button>
            <button 
              onClick={() => onUpdateInput('budget', 5000000)} 
              className={cn(
                "font-mono text-xs px-3 py-2 rounded transition-colors border",
                inputs.budget === 5000000 
                  ? "bg-gold/20 border-gold text-gold" 
                  : "bg-bg-void border-white/10 text-text-mid hover:border-gold/50"
              )}
            >
              $5M
            </button>
          </div>
        </div>

        {/* Quick Tip - Shows only when empty */}
        {!isCompleted && (
          <div
            className="mt-6 p-4 border border-white/10 bg-white/[0.02]"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            <h3 className="text-xs font-bold text-text-mid mb-2 uppercase tracking-wide flex items-center gap-2">
              👉 Quick Tip
            </h3>
            <p className="text-sm text-text-dim leading-relaxed">
              This is your "negative cost." It's the total amount of money it takes to get the film "in the can" and finished—from development through final delivery.
            </p>
          </div>
        )}
      </ChapterCard>
    </div>
  );
};

export default BudgetTab;
