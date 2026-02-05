import { WaterfallInputs, GuildState } from "@/lib/waterfall";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import ChapterCard from "../ChapterCard";
import GlossaryTrigger, { GLOSSARY } from "../GlossaryTrigger";
import { Sparkles, X, DollarSign, FileText, Lightbulb, Info } from "lucide-react";

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
      {/* Wiki-Style Onboarding Guide - Shows only when budget is empty */}
      {!isCompleted && (
        <div className="space-y-4 animate-fade-in">
          {/* Header */}
          <div className="flex items-center space-x-2 text-gold/80 text-xs font-mono uppercase tracking-widest">
            <FileText className="w-3 h-3" />
            <span>Step 1 of 4 / Budget</span>
          </div>

          {/* Main Guide Card */}
          <div
            className="bg-bg-surface border border-border-default p-5 space-y-5"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            {/* Section 1: What This Is */}
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-gold/10" style={{ borderRadius: 'var(--radius-md)' }}>
                <DollarSign className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">What is the "Negative Cost"?</h3>
                <p className="text-xs text-text-dim leading-relaxed">
                  The negative cost is your <span className="text-white font-medium">total production budget</span>—every dollar it takes to get your film from development through final delivery. It's called "negative" because it's the cost to create the negative (the original print). This number is the foundation of every financial projection.
                </p>
              </div>
            </div>

            {/* Section 2: What's Included */}
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-gold/10" style={{ borderRadius: 'var(--radius-md)' }}>
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">What's typically included</h3>
                <p className="text-xs text-text-dim leading-relaxed">
                  Development, pre-production, principal photography, post-production, music licensing, deliverables, insurance, legal, and contingency. <span className="text-white font-medium">It does NOT include marketing or distribution costs</span>—those come later.
                </p>
              </div>
            </div>

            {/* Section 3: Why It Matters */}
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-gold/10" style={{ borderRadius: 'var(--radius-md)' }}>
                <Lightbulb className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Why investors care</h3>
                <p className="text-xs text-text-dim leading-relaxed">
                  Your budget determines your <span className="text-white font-medium">breakeven point</span>—the minimum sale price needed to pay everyone back. A lower budget means a lower bar to clear. Investors want to know you can make a sellable film at a price the market will pay.
                </p>
              </div>
            </div>
          </div>

          {/* Pro Tip Callout */}
          <div className="bg-blue-900/10 border-l-4 border-blue-500/50 p-4 flex items-start space-x-3" style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-200/80 leading-relaxed">
              <span className="font-bold text-blue-200">Pro Tip:</span> If you don't have a locked budget yet, use a realistic estimate. You can always adjust—the goal here is to understand how the math works at different budget levels.
            </div>
          </div>
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
      </ChapterCard>
    </div>
  );
};

export default BudgetTab;
