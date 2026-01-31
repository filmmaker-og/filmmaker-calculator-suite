import { WaterfallInputs, GuildState, formatCompactCurrency, calculateBreakeven } from "@/lib/waterfall";
import { CapitalSelections } from "./CapitalSelectStep";
import { useEffect, useState } from "react";

interface BreakevenStepProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  selections: CapitalSelections;
}

const BreakevenStep = ({ inputs, guilds, selections }: BreakevenStepProps) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [displayBreakeven, setDisplayBreakeven] = useState(0);

  // Use the algebraic breakeven calculation
  const breakeven = calculateBreakeven(inputs, guilds, selections);

  // Calculate individual components for display
  const offTopRate = (inputs.salesFee / 100) + 0.01 + 
    (guilds.sag ? 0.045 : 0) + (guilds.wga ? 0.012 : 0) + (guilds.dga ? 0.012 : 0);
  const offTopPct = (offTopRate * 100).toFixed(1);

  const seniorDebtRepay = selections.seniorDebt ? inputs.debt * (1 + inputs.seniorDebtRate / 100) : 0;
  const mezzDebtRepay = selections.gapLoan ? inputs.mezzanineDebt * (1 + inputs.mezzanineRate / 100) : 0;
  const totalDebtRepay = seniorDebtRepay + mezzDebtRepay;
  const equityRepay = selections.equity ? inputs.equity * (1 + inputs.premium / 100) : 0;
  const creditsOffset = selections.taxCredits ? inputs.credits : 0;
  const marketingCap = inputs.salesExp || 0;

  const lines = [
    { label: `Off-the-top (${offTopPct}% of revenue)`, amount: null, isRate: true, show: offTopRate > 0 },
    { label: 'Marketing cap', amount: marketingCap, show: marketingCap > 0 },
    { label: 'Debt repayment', amount: totalDebtRepay, show: totalDebtRepay > 0 },
    { label: 'Equity + premium', amount: equityRepay, show: equityRepay > 0 },
    { label: 'Tax credits (offset)', amount: -creditsOffset, show: creditsOffset > 0, isOffset: true },
  ].filter(l => l.show);

  // Animate lines appearing
  useEffect(() => {
    setVisibleLines(0);
    const timer = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= lines.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(timer);
  }, [lines.length]);

  // Animate breakeven counting up
  useEffect(() => {
    if (visibleLines >= lines.length && Number.isFinite(breakeven)) {
      const duration = 800;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayBreakeven(breakeven * eased);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      setTimeout(() => requestAnimationFrame(animate), 400);
    }
  }, [visibleLines, lines.length, breakeven]);

  return (
    <div className="step-enter min-h-[60vh] flex flex-col justify-center">
      {/* The Header */}
      <div className="text-center mb-8">
        <h2 className="font-bebas text-2xl tracking-[0.1em] text-foreground mb-2">
          Let's add it up.
        </h2>
      </div>

      {/* The Ledger - Animated */}
      <div className="bg-card border border-border p-6 space-y-4">
        {lines.map((line, index) => (
          <div
            key={line.label}
            className={`flex items-center justify-between py-3 border-b border-border/50 last:border-0 transition-all duration-300 ${
              index < visibleLines ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <span className="text-foreground text-sm">{line.label}</span>
            <span className={`font-mono text-lg ${line.isOffset ? 'text-emerald-400' : line.isRate ? 'text-muted-foreground italic' : 'text-foreground'}`}>
              {line.isRate ? '(variable)' : line.isOffset ? `+${formatCompactCurrency(Math.abs(line.amount!))}` : formatCompactCurrency(line.amount!)}
            </span>
          </div>
        ))}

        {/* Divider */}
        <div 
          className={`h-px bg-gold my-4 transition-all duration-500 ${
            visibleLines >= lines.length ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
          style={{ transitionDelay: `${lines.length * 100 + 200}ms`, transformOrigin: 'left' }}
        />

        {/* Breakeven Total - Animated Count */}
        <div 
          className={`text-center py-4 transition-all duration-500 ${
            visibleLines >= lines.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${lines.length * 100 + 400}ms` }}
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Your Breakeven Point
          </p>
          <p 
            className="font-bebas text-5xl sm:text-6xl text-gold"
            style={{
              textShadow: '0 0 40px rgba(212, 175, 55, 0.3)',
            }}
          >
            {Number.isFinite(breakeven) ? formatCompactCurrency(displayBreakeven) : '∞'}
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div 
        className={`mt-6 text-center transition-all duration-500 ${
          visibleLines >= lines.length ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: `${lines.length * 100 + 600}ms` }}
      >
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
          You need to sell for at least <span className="text-gold font-semibold">{Number.isFinite(breakeven) ? formatCompactCurrency(breakeven) : '∞'}</span> just to break even.
        </p>
        <p className="text-muted-foreground/60 text-xs mt-2">
          Anything less = investors don't get fully repaid.
        </p>
      </div>
    </div>
  );
};

export default BreakevenStep;
