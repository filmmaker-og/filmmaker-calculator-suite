import { useState, useRef, useEffect } from "react";
import { Check, X, Info } from "lucide-react";
import { WaterfallInputs } from "@/lib/waterfall";
import { cn } from "@/lib/utils";
import StandardStepLayout from "../StandardStepLayout";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BudgetInputProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onBack?: () => void;
  onNext: () => void;
}

/**
 * BudgetInput - Budget data collection screen
 * 
 * Step 1 of Budget Tab: Collect the production budget
 * with quick amount buttons and validation.
 */
const BudgetInput = ({ inputs, onUpdateInput, onNext }: BudgetInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // REMOVED: Auto-focus on mount caused keyboard to pop up immediately.
  // useEffect(() => {
  //   setTimeout(() => {
  //     inputRef.current?.focus();
  //   }, 100);
  // }, []);

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
      inputRef.current?.select();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
      if (inputs.budget > 0) {
        setTimeout(() => onNext(), 100);
      }
    }
  };

  const handleClear = () => {
    onUpdateInput('budget', 0);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleQuickAmount = (amount: number) => {
    onUpdateInput('budget', amount);
  };

  const isCompleted = inputs.budget > 0;

  const quickAmounts = [
    { value: 250000, label: '$250K' },
    { value: 750000, label: '$750K' },
    { value: 1500000, label: '$1.5M' },
    { value: 2500000, label: '$2.5M' },
    { value: 5000000, label: '$5M' },
  ];

  return (
    <StandardStepLayout
      chapter="01"
      title="Production Budget"
      subtitle="Enter your total negative cost"
      isComplete={isCompleted}
      onNext={onNext}
      nextLabel="Continue to Capital Stack"
    >
      <div className="space-y-6">
        {/* Input Card - Inner Matte Look */}
        <div className="bg-bg-elevated border border-border-default rounded-lg p-5 transition-all focus-within:border-gold/50 focus-within:shadow-focus focus-within:bg-bg-surface">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-text-dim font-semibold">
                Total Budget (Negative Cost)
              </span>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-text-dim/50 hover:text-gold cursor-pointer transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[200px] bg-bg-card border-border-subtle text-xs">
                    <p>The total production spend before any revenue. Also called your "negative cost."</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {isCompleted && (
              <span className="text-xs text-gold font-mono flex items-center gap-1">
                <Check className="w-3 h-3" />
              </span>
            )}
          </div>

          <div className="flex items-center relative">
            <span className="font-mono text-xl text-text-dim mr-2">$</span>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={formatValue(inputs.budget)}
              onChange={(e) => onUpdateInput('budget', parseValue(e.target.value))}
              onFocus={handleFocus}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="750,000"
              className="flex-1 bg-transparent outline-none font-mono text-[22px] text-text-primary text-right placeholder:text-text-dim placeholder:text-base tabular-nums"
            />
            {/* Clear button */}
            {isCompleted && (
              <button
                onClick={handleClear}
                className="absolute right-0 top-1/2 -translate-y-1/2 ml-2 p-1 text-text-dim hover:text-text-primary hover:bg-white/10 rounded transition-colors"
                style={{ right: '-32px' }}
                aria-label="Clear budget"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Contextual hint */}
        <p className="text-center text-xs text-text-dim leading-relaxed px-2">
          Your all-in production budget — total spend before distribution revenue.
        </p>

        {/* Quick Amounts */}
        <div className="p-4 border border-border-subtle bg-bg-surface rounded-lg">
          <p className="text-xs text-text-dim mb-3 uppercase tracking-wide font-semibold text-center">
            Quick amounts
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            {quickAmounts.map((qa) => (
              <button
                key={qa.value}
                onClick={() => handleQuickAmount(qa.value)}
                className={cn(
                  "font-mono text-xs px-3 py-2 rounded transition-colors border",
                  inputs.budget === qa.value
                    ? "bg-gold/15 border-gold text-gold"
                    : "bg-bg-elevated border-border-subtle text-text-mid hover:border-text-dim"
                )}
              >
                {qa.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </StandardStepLayout>
  );
};

export default BudgetInput;
