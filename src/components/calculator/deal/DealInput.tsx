import { useState, useRef, useEffect } from "react";
import { Handshake, ArrowRight, Check, Target, TrendingUp, TrendingDown } from "lucide-react";
import { WaterfallInputs, GuildState, CapitalSelections, formatCompactCurrency, calculateBreakeven } from "@/lib/waterfall";
import { cn } from "@/lib/utils";
import { useMobileKeyboardScroll } from "@/hooks/use-mobile-keyboard";

interface DealInputProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  selections: CapitalSelections;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onBack?: () => void;
  onNext: () => void;
}

/**
 * DealInput - Acquisition price input screen
 * 
 * Step 1 of Deal Tab: Collect acquisition/revenue projection
 * with breakeven context and status indicator.
 */
const DealInput = ({ inputs, guilds, selections, onUpdateInput, onNext }: DealInputProps) => {\n  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Mobile keyboard scroll handling
  const { ref: mobileRef, scrollIntoView } = useMobileKeyboardScroll<HTMLDivElement>();

  // Auto-focus on mount
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
      if (inputs.revenue > 0) {
        setTimeout(() => onNext(), 100);
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Scroll input into view on mobile when keyboard opens
    scrollIntoView();
  };

  // Calculate breakeven
  const breakeven = calculateBreakeven(inputs, guilds, selections);
  const hasRevenue = inputs.revenue > 0;
  const cushion = inputs.revenue - breakeven;
  const isAboveBreakeven = cushion > 0;
  const percentAbove = breakeven > 0 ? ((inputs.revenue - breakeven) / breakeven) * 100 : 0;

  // Quick scenario buttons based on budget
  const budget = inputs.budget || 1000000;
  const scenarios = [
    { label: '100%', multiplier: 1.0, desc: 'At budget' },
    { label: '115%', multiplier: 1.15, desc: 'Solid' },
    { label: '130%', multiplier: 1.3, desc: 'Strong' },
    { label: '150%', multiplier: 1.5, desc: 'Exceptional' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Header */}
      <div className="text-center mb-6 pt-4">
        <div className="relative inline-block mb-4">
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
              filter: 'blur(15px)',
              transform: 'scale(2)',
            }}
          />
          <div 
            className="relative w-14 h-14 border border-gold/30 bg-gold/5 flex items-center justify-center"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <Handshake className="w-7 h-7 text-gold" />
          </div>
        </div>

        <h2 className="font-bebas text-3xl tracking-[0.08em] text-text-primary mb-1">
          Acquisition Price
        </h2>
        <p className="text-text-dim text-xs max-w-xs mx-auto">
          What the distributor pays for your film
        </p>
      </div>

      {/* Breakeven Context Card */}
      {Number.isFinite(breakeven) && breakeven > 0 && (
        <div
          className="relative p-4 border border-gold/20 bg-gold-subtle flex items-center justify-between overflow-hidden"
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          {/* Subtle gold accent bar */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{
              background: 'linear-gradient(180deg, #D4AF37 0%, rgba(212,175,55,0.3) 100%)',
              boxShadow: '0 0 8px rgba(212,175,55,0.2)',
            }}
          />
          <div className="flex items-center gap-3 pl-2">
            <Target className="w-5 h-5 text-gold" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-text-dim block">Your Breakeven</span>
              <span
                className="font-mono text-lg font-bold text-text-primary"
                style={{ textShadow: '0 0 8px rgba(255,255,255,0.1)' }}
              >
                {formatCompactCurrency(breakeven)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-text-dim block">Minimum to recoup</span>
            <span className="text-xs text-text-dim">all costs + returns</span>
          </div>
        </div>
      )}

      {/* Main Input Card */}
      <div ref={mobileRef} className="matte-section overflow-hidden">
        {/* Section header */}
        <div className="matte-section-header px-5 py-3 flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-text-dim font-bold">
            Acquisition Amount
          </span>
          {hasRevenue && (
            <span className="text-xs text-gold font-mono flex items-center gap-1">
              <Check className="w-3 h-3" />
            </span>
          )}
        </div>

        {/* Revenue Input */}
        <div className="p-5">
          <div
            className={cn(
              "flex items-center transition-all relative",
              "bg-bg-surface border",
              isFocused
                ? "border-border-active shadow-focus"
                : hasRevenue
                  ? "border-gold/50"
                  : "border-border-default"
            )}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <span className="pl-4 pr-2 font-mono text-xl text-text-dim">$</span>

            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={formatValue(inputs.revenue)}
              onChange={(e) => onUpdateInput('revenue', parseValue(e.target.value))}
              onFocus={handleFocus}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="3,500,000"
              className="flex-1 bg-transparent py-4 pr-4 outline-none font-mono text-[22px] text-text-primary text-right placeholder:text-text-dim tabular-nums"
            />
          </div>

          <p className="mt-2 text-xs text-text-dim text-center">
            Enter an acquisition price to see your position
          </p>
        </div>

        {/* Status Indicator */}
        {hasRevenue && Number.isFinite(breakeven) && (
          <div
            className={cn(
              "relative mx-5 mb-5 p-4 border flex items-center justify-between overflow-hidden",
              isAboveBreakeven
                ? "border-gold/50 bg-gold/[0.08]"
                : "border-gold/30 bg-gold/[0.04]"
            )}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            {/* Radial gold glow behind percentage */}
            {isAboveBreakeven && (
              <div
                className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at right center, rgba(212,175,55,0.15) 0%, transparent 70%)' }}
              />
            )}
            <div className="relative flex items-center gap-3">
              {isAboveBreakeven ? (
                <TrendingUp className="w-5 h-5 text-gold" />
              ) : (
                <TrendingDown className="w-5 h-5 text-text-dim" />
              )}
              <div>
                <p className={cn(
                  "text-xs font-bold uppercase tracking-wider mb-0.5",
                  isAboveBreakeven ? "text-gold" : "text-text-dim"
                )}>
                  {isAboveBreakeven ? 'Above Breakeven' : 'Below Breakeven'}
                </p>
                <p
                  className={cn(
                    "text-sm font-mono font-bold",
                    isAboveBreakeven ? "text-text-primary" : "text-text-mid"
                  )}
                  style={isAboveBreakeven ? { textShadow: '0 0 8px rgba(255,255,255,0.15)' } : undefined}
                >
                  {isAboveBreakeven
                    ? `+${formatCompactCurrency(Math.abs(cushion))} cushion`
                    : `${formatCompactCurrency(Math.abs(cushion))} shortfall`}
                </p>
              </div>
            </div>
            {isAboveBreakeven && percentAbove > 0 && (
              <span
                className="relative text-2xl font-mono font-bold text-gold"
                style={{ textShadow: '0 0 16px rgba(212,175,55,0.5)' }}
              >
                +{percentAbove.toFixed(0)}%
              </span>
            )}
          </div>
        )}

        {/* Quick Scenarios */}
        <div className="px-5 pb-5">
          <div
            className="p-4 border border-gold/20 bg-gold/[0.03]"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            <p className="text-xs text-text-dim mb-3 uppercase tracking-wide font-medium text-center">
              Quick scenarios (% of budget)
            </p>
            <div className="grid grid-cols-4 gap-2">
              {scenarios.map((s) => {
                const value = Math.round(budget * s.multiplier);
                const isSelected = inputs.revenue === value;
                return (
                  <button
                    key={s.label}
                    onClick={() => onUpdateInput('revenue', value)}
                    className={cn(
                      "text-center p-2 rounded transition-colors border",
                      isSelected
                        ? "bg-gold/20 border-gold"
                        : "bg-bg-void border-border-subtle hover:border-gold/50"
                    )}
                  >
                    <span className={cn(
                      "font-mono text-sm block",
                      isSelected ? "text-gold" : "text-text-mid"
                    )}>
                      {s.label}
                    </span>
                    <span className="text-[9px] text-text-dim">{s.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button — CTA Gold for clickable */}
      {hasRevenue && (
        <button
          onClick={onNext}
          className={cn(
            "w-full py-4 flex items-center justify-center gap-3",
            "bg-gold-cta-subtle border border-gold-cta-muted text-gold-cta",
            "hover:bg-gold-cta-subtle hover:border-gold-cta transition-all",
            "active:scale-[0.98]"
          )}
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          <span className="text-sm font-bold uppercase tracking-wider">See the Waterfall</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default DealInput;
