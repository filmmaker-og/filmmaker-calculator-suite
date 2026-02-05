import { WaterfallInputs, GuildState, formatCompactCurrency, calculateBreakeven } from "@/lib/waterfall";
import { CapitalSelections } from "../steps/CapitalSelectStep";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import ChapterCard from "../ChapterCard";
import GlossaryTrigger, { GLOSSARY } from "../GlossaryTrigger";
import { DollarSign, FileText, Target, TrendingUp, Handshake, Info } from "lucide-react";

interface DealTabProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  selections: CapitalSelections;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onAdvance?: () => void;
}

const DealTab = ({ inputs, guilds, selections, onUpdateInput, onAdvance }: DealTabProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const revenueInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount if revenue not entered
  useEffect(() => {
    if (inputs.revenue === 0) {
      revenueInputRef.current?.focus();
    }
  }, []);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  // Handle Enter key to advance
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      revenueInputRef.current?.blur();
      if (inputs.revenue > 0 && onAdvance) {
        setTimeout(() => onAdvance(), 100);
      }
    }
  };

  // Use the algebraic breakeven calculation
  const breakeven = calculateBreakeven(inputs, guilds, selections);

  // Calculate cushion
  const cushion = inputs.revenue - breakeven;
  const isAboveBreakeven = cushion > 0;
  const percentAbove = breakeven > 0 ? ((inputs.revenue - breakeven) / breakeven) * 100 : 0;
  const hasRevenue = inputs.revenue > 0;

  return (
    <div className="space-y-6 pb-8">
      {/* Wiki-Style Onboarding Guide - Shows only when revenue not entered */}
      {!hasRevenue && (
        <div className="space-y-4 animate-fade-in">
          {/* Header */}
          <div className="flex items-center space-x-2 text-gold/80 text-xs font-mono uppercase tracking-widest">
            <FileText className="w-3 h-3" />
            <span>Step 3 of 4 / Deal Modeling</span>
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
                <h3 className="text-sm font-bold text-white mb-1">What is the "Acquisition Price"?</h3>
                <p className="text-xs text-text-dim leading-relaxed">
                  When a streamer or distributor buys your film, they pay an <span className="text-white font-medium">acquisition price</span>—a flat fee for distribution rights. This is the number that determines whether your investors get paid, and whether you see any backend.
                </p>
              </div>
            </div>

            {/* Section 2: What's Your Breakeven */}
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-gold/10" style={{ borderRadius: 'var(--radius-md)' }}>
                <Target className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Understanding breakeven</h3>
                <p className="text-xs text-text-dim leading-relaxed">
                  Your <span className="text-white font-medium">breakeven</span> is the minimum sale price needed to pay back all costs: sales fees, guild residuals, marketing expenses, debt service, and investor returns. We've already calculated this based on your capital stack. The question is: will the market pay enough?
                </p>
              </div>
            </div>

            {/* Section 3: The Distributor's Perspective */}
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-gold/10" style={{ borderRadius: 'var(--radius-md)' }}>
                <TrendingUp className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">How distributors think</h3>
                <p className="text-xs text-text-dim leading-relaxed">
                  Distributors buy films they believe will generate more than they pay. They're assessing <span className="text-white font-medium">genre, cast, festival buzz, and comparable titles</span>. A $1.5M acquisition for a $1M film is great for you—but only if the distributor believes they'll make $3M+ in revenue.
                </p>
              </div>
            </div>

            {/* Section 4: What You'll Do */}
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-gold/10" style={{ borderRadius: 'var(--radius-md)' }}>
                <Handshake className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Test different scenarios</h3>
                <p className="text-xs text-text-dim leading-relaxed">
                  Enter an acquisition price to see if it clears your breakeven. Try different numbers to understand your negotiating position. <span className="text-white font-medium">What's the minimum you can accept? What's your dream scenario?</span>
                </p>
              </div>
            </div>
          </div>

          {/* Pro Tip Callout */}
          <div className="bg-blue-900/10 border-l-4 border-blue-500/50 p-4 flex items-start space-x-3" style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-200/80 leading-relaxed">
              <span className="font-bold text-blue-200">Pro Tip:</span> Most indie deals close between 100-130% of budget. Exceptional films with festival buzz or star power can command more. If your breakeven requires 150%+ of budget, you may need to restructure your capital stack.
            </div>
          </div>
        </div>
      )}

      <ChapterCard
        chapter="03"
        title="DEAL"
        isActive={true}
        glossaryTrigger={
          <GlossaryTrigger {...GLOSSARY.acquisition} />
        }
      >
        {/* Breakeven context */}
        <div
          className="mb-6 p-4 border border-border-default bg-bg-surface flex items-center justify-between"
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-text-dim">Your breakeven</span>
              <GlossaryTrigger {...GLOSSARY.breakeven} />
            </div>
            <span className="font-mono text-xl text-text-primary">
              {Number.isFinite(breakeven) ? formatCompactCurrency(breakeven) : '—'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-text-dim block">Minimum to recoup</span>
            <span className="text-xs text-text-dim">all costs + returns</span>
          </div>
        </div>

        {/* Acquisition Input */}
        <div className="mb-6">
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-text-primary uppercase tracking-wide">Acquisition Price</span>
              <span className="text-xs text-text-dim italic">what the distributor pays</span>
            </div>
          </div>
          <div
            className={cn(
              "flex items-center transition-all",
              "bg-bg-surface border",
              isFocused ? "border-border-active shadow-focus" : hasRevenue ? "border-gold/50" : "border-border-default"
            )}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <span className="pl-4 pr-2 font-mono text-xl text-text-dim">$</span>
            <input
              ref={revenueInputRef}
              type="text"
              inputMode="numeric"
              value={formatValue(inputs.revenue)}
              onChange={(e) => onUpdateInput('revenue', parseValue(e.target.value))}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="3,500,000"
              className="flex-1 bg-transparent py-4 pr-4 outline-none font-mono text-[22px] text-text-primary text-right placeholder:text-text-dim tabular-nums"
            />
          </div>
          <p className="mt-2 text-xs text-text-dim">
            {hasRevenue
              ? "Press Enter or click Next to see the waterfall."
              : "Enter an acquisition price to see your position"}
          </p>
        </div>

        {/* Status indicator */}
        {hasRevenue && Number.isFinite(breakeven) && (
          <div
            className={cn(
              "p-4 border flex items-center justify-between mb-6",
              isAboveBreakeven
                ? "border-status-success bg-[rgba(0,255,100,0.08)]"
                : "border-status-danger bg-[rgba(255,82,82,0.08)]"
            )}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <div>
              <p className={cn(
                "text-xs font-bold uppercase tracking-wider mb-1",
                isAboveBreakeven ? "text-status-success" : "text-status-danger"
              )}>
                {isAboveBreakeven ? 'Above breakeven' : 'Below breakeven'}
              </p>
              <p className="text-lg font-mono text-text-primary">
                {isAboveBreakeven
                  ? `+${formatCompactCurrency(Math.abs(cushion))} cushion`
                  : `${formatCompactCurrency(Math.abs(cushion))} shortfall`}
              </p>
            </div>
            {isAboveBreakeven && percentAbove > 0 && (
              <span className="text-2xl font-mono text-status-success">
                +{percentAbove.toFixed(0)}%
              </span>
            )}
          </div>
        )}

        {/* Quick reference */}
        <div
          className="p-4 border border-border-default bg-bg-surface"
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          <p className="text-xs text-text-dim text-center mb-4 font-bold uppercase tracking-wider">
            Typical acquisition ranges
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 border border-border-subtle" style={{ borderRadius: 'var(--radius-md)' }}>
              <span className="text-sm text-text-mid font-mono block">100-110%</span>
              <span className="text-[10px] text-text-dim">baseline</span>
            </div>
            <div className="p-3 border border-gold/30 bg-gold/5" style={{ borderRadius: 'var(--radius-md)' }}>
              <span className="text-sm text-gold font-mono block">115-130%</span>
              <span className="text-[10px] text-text-dim">strong</span>
            </div>
            <div className="p-3 border border-border-subtle" style={{ borderRadius: 'var(--radius-md)' }}>
              <span className="text-sm text-text-mid font-mono block">130%+</span>
              <span className="text-[10px] text-text-dim">exceptional</span>
            </div>
          </div>
        </div>
      </ChapterCard>
    </div>
  );
};

export default DealTab;
