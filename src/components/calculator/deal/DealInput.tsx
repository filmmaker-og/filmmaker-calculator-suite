import { useState, useRef, useEffect } from "react";
import { Handshake, ArrowRight, Target, TrendingUp, TrendingDown, Briefcase } from "lucide-react";
import { WaterfallInputs, GuildState, formatCompactCurrency, calculateBreakeven } from "@/lib/waterfall";
import { CapitalSelections } from "../steps/CapitalSelectStep";
import { cn } from "@/lib/utils";
import { useMobileKeyboardScroll } from "@/hooks/use-mobile-keyboard";
import { PercentStepper } from "@/components/ui/percent-stepper";
import { useHaptics } from "@/hooks/use-haptics";

interface DealInputProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  selections: CapitalSelections;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onNext: () => void;
}

/**
 * DealInput - Acquisition price input screen
 * 
 * Step 1 of Deal Tab: Collect acquisition/revenue projection
 * with breakeven context and status indicator.
 */
const DealInput = ({ inputs, guilds, selections, onUpdateInput, onNext }: DealInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [marketingFocused, setMarketingFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const haptics = useHaptics();
  
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
            <Handshake className="w-7 h-7 text-gold" />
          </div>
        </div>

        <h2 className="font-bebas text-2xl tracking-[0.08em] text-white mb-1">
          Deal Terms
        </h2>
        <p className="text-white/40 text-xs max-w-xs mx-auto">
          Acquisition price and sales agent fees
        </p>
      </div>

      {/* Breakeven Context Card */}
      {Number.isFinite(breakeven) && breakeven > 0 && (
        <div
          className="p-4 border border-border-default bg-bg-surface flex items-center justify-between"
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-gold/60" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-text-dim block">Your Breakeven</span>
              <span className="font-mono text-lg text-text-primary">
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
        <div className="matte-section-header px-5 py-3">
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
            Acquisition Amount
          </span>
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
              "mx-5 mb-5 p-4 border flex items-center justify-between",
              isAboveBreakeven
                ? "border-status-success bg-[rgba(0,255,100,0.08)]"
                : "border-status-danger bg-[rgba(255,82,82,0.08)]"
            )}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <div className="flex items-center gap-3">
              {isAboveBreakeven ? (
                <TrendingUp className="w-5 h-5 text-status-success" />
              ) : (
                <TrendingDown className="w-5 h-5 text-status-danger" />
              )}
              <div>
                <p className={cn(
                  "text-xs font-bold uppercase tracking-wider mb-0.5",
                  isAboveBreakeven ? "text-status-success" : "text-status-danger"
                )}>
                  {isAboveBreakeven ? 'Above Breakeven' : 'Below Breakeven'}
                </p>
                <p className="text-sm font-mono text-text-primary">
                  {isAboveBreakeven
                    ? `+${formatCompactCurrency(Math.abs(cushion))} cushion`
                    : `${formatCompactCurrency(Math.abs(cushion))} shortfall`}
                </p>
              </div>
            </div>
            {isAboveBreakeven && percentAbove > 0 && (
              <span className="text-2xl font-mono text-status-success">
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
                        : "bg-bg-void border-white/10 hover:border-gold/50"
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

      {/* Sales Agent Fees */}
      <div className="matte-section overflow-hidden">
        {/* Section header */}
        <div className="matte-section-header px-5 py-3 flex items-center gap-3">
          <Briefcase className="w-4 h-4 text-gold/60" />
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
            Sales Agent Fees
          </span>
        </div>

        {/* Commission Rate Stepper */}
        <div className="p-5 border-b border-[#1A1A1A]">
          <p className="text-xs uppercase tracking-widest text-gold/70 font-semibold mb-3">
            Commission Rate
          </p>
          <PercentStepper
            value={inputs.salesFee}
            onChange={(value) => {
              haptics.light();
              onUpdateInput('salesFee', value);
            }}
            min={0}
            max={30}
            step={5}
            standardValue={15}
            standardLabel="industry average"
            isCompleted={true}
          />
        </div>

        {/* Marketing / Distribution Fee — Toggleable */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-widest text-gold/70 font-semibold">
              Marketing & Distribution Fee
            </p>
            {/* Toggle */}
            <button
              onClick={() => {
                haptics.light();
                if (inputs.salesExp > 0) {
                  onUpdateInput('salesExp', 0);
                } else {
                  onUpdateInput('salesExp', 75000);
                }
              }}
              className={cn(
                "relative w-10 h-5 rounded-full transition-colors",
                inputs.salesExp > 0
                  ? "bg-gold/40"
                  : "bg-white/10"
              )}
            >
              <div
                className={cn(
                  "absolute top-0.5 w-4 h-4 rounded-full transition-all",
                  inputs.salesExp > 0
                    ? "left-5 bg-gold"
                    : "left-0.5 bg-white/40"
                )}
              />
            </button>
          </div>

          {inputs.salesExp > 0 ? (
            <div>
              <div
                className={cn(
                  "flex items-center transition-all",
                  "bg-bg-surface border",
                  marketingFocused ? "border-border-active" : "border-border-default"
                )}
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <span className="pl-4 pr-2 font-mono text-lg text-text-dim">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={inputs.salesExp > 0 ? inputs.salesExp.toLocaleString() : ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                    onUpdateInput('salesExp', val);
                  }}
                  onFocus={() => setMarketingFocused(true)}
                  onBlur={() => setMarketingFocused(false)}
                  placeholder="75,000"
                  className="flex-1 bg-transparent py-3 pr-4 outline-none font-mono text-lg text-text-primary text-right placeholder:text-text-dim tabular-nums"
                />
              </div>
              <p className="mt-2 text-xs text-text-dim leading-relaxed">
                Hardcapped recoupable fee for festival markets, screeners, buyer presentations.
                Comes off the top — separate from delivery costs.
              </p>
            </div>
          ) : (
            <p className="text-xs text-text-dim leading-relaxed">
              No marketing/distribution fee. Toggle on to add a hardcapped sales agent expense
              (industry standard: $75K).
            </p>
          )}
        </div>
      </div>

      {/* Continue Button */}
      {hasRevenue && (
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
          <span className="text-sm font-black uppercase tracking-wider">See the Waterfall</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default DealInput;
