import { useState, useRef, useEffect } from "react";
import { DollarSign, ArrowRight, X } from "lucide-react";
import { WaterfallInputs } from "@/lib/waterfall";
import { cn } from "@/lib/utils";

interface BudgetInputProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onBack?: () => void;
  onNext: () => void;
}

const BudgetInput = ({ inputs, onUpdateInput, onBack, onNext }: BudgetInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
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
    <div className="space-y-6 animate-fade-in">
      {/* Hero Header */}
      <div className="text-center pt-2">
        <div className="relative inline-block mb-4">
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.12) 0%, transparent 70%)',
              filter: 'blur(15px)',
              transform: 'scale(2)',
            }}
          />
          <div
            className="relative w-14 h-14 border border-gold/25 bg-gold/5 flex items-center justify-center"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <DollarSign className="w-7 h-7 text-gold" />
          </div>
        </div>

        <h2 className="font-bebas text-2xl tracking-[0.08em] text-white mb-1">
          Production Budget
        </h2>
        <p className="text-white/40 text-xs max-w-xs mx-auto">
          Your total negative cost — the foundation of every deal
        </p>
      </div>

      {/* Main Input Card */}
      <div className="matte-section overflow-hidden">
        {/* Section header */}
        <div className="matte-section-header px-5 py-3">
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
            Total Budget
          </span>
        </div>

        {/* Budget Input */}
        <div className="p-5 pb-4">
          <div
            className={cn(
              "flex items-center transition-all relative",
              "bg-bg-surface border",
              isFocused
                ? "border-border-active shadow-focus"
                : isCompleted
                  ? "border-gold/40"
                  : "border-border-default"
            )}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <span className="pl-4 pr-2 font-mono text-xl text-text-dim">$</span>

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
              className="flex-1 bg-transparent py-4 outline-none font-mono text-[22px] text-text-primary text-right placeholder:text-text-dim placeholder:text-base tabular-nums pr-2"
            />

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
        </div>

        {/* Quick Amounts — integrated directly */}
        <div className="px-5 pb-5">
          <p className="text-[10px] text-text-dim mb-2.5 uppercase tracking-widest font-medium text-center">
            Quick amounts
          </p>
          <div className="flex gap-2 justify-center">
            {quickAmounts.map((qa) => (
              <button
                key={qa.value}
                onClick={() => handleQuickAmount(qa.value)}
                className={cn(
                  "font-mono text-xs px-3 py-2 transition-all border",
                  inputs.budget === qa.value
                    ? "bg-gold/15 border-gold/60 text-gold"
                    : "bg-transparent border-white/8 text-text-mid hover:border-gold/30 hover:text-text-primary"
                )}
                style={{ borderRadius: 'var(--radius-sm, 8px)' }}
              >
                {qa.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      {isCompleted && (
        <button
          onClick={onNext}
          className={cn(
            "w-full py-4 flex items-center justify-center gap-3",
            "border border-gold/40 text-black font-bold",
            "hover:brightness-110 transition-all",
            "active:scale-[0.98]"
          )}
          style={{
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #FFD700 0%, #E6C200 100%)',
            boxShadow: '0 4px 16px rgba(255, 215, 0, 0.2)',
          }}
        >
          <span className="text-sm font-black uppercase tracking-wider">Continue to Capital Stack</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default BudgetInput;
