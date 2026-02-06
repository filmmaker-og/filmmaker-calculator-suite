import { WaterfallResult, WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { ArrowRight, Lock, BookOpen, Ticket, Coins, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import StandardStepLayout from "../StandardStepLayout";
import { useEffect, useState } from "react";
import { useHaptics } from "@/hooks/use-haptics";

interface WaterfallTabProps {
  result: WaterfallResult;
  inputs: WaterfallInputs;
}

const WaterfallTab = ({ result, inputs }: WaterfallTabProps) => {
  const haptics = useHaptics();
  const isLocked = inputs.budget === 0 || inputs.revenue === 0;
  
  // Animation states
  const [isCalculating, setIsCalculating] = useState(true);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!isLocked) {
      // Reset animation on mount
      setIsCalculating(true);
      setShowResult(false);

      // Sequence: Calculating -> Show
      const timer1 = setTimeout(() => {
        setIsCalculating(false);
        haptics.success(); // Tactile feedback on reveal
        setShowResult(true);
      }, 1500); // 1.5s suspense

      return () => clearTimeout(timer1);
    }
  }, [isLocked, haptics]);

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center h-[50vh]">
        <div className="p-4 rounded-full bg-bg-surface border border-border-default">
          <Lock className="w-8 h-8 text-text-dim" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bebas tracking-wide text-text-primary">
            Waterfall Protocol Locked
          </h3>
          <p className="text-sm text-text-dim max-w-[280px]">
            Please complete the <span className="text-gold">Budget</span> and <span className="text-gold">Deal</span> sections to generate your simulation.
          </p>
        </div>
      </div>
    );
  }

  // Calculate percentages
  const producerNetPercent = result.producer > 0 && inputs.revenue > 0
    ? (result.producer / inputs.revenue) * 100 
    : 0;
    
  const investorRecoupPercent = inputs.equity > 0 
    ? (Math.min(result.investorTotal, inputs.equity * 1.2) / (inputs.equity * 1.2)) * 100
    : 100;

  return (
    <StandardStepLayout
      chapter="04"
      title="WATERFALL"
      subtitle="Final position and net distribution"
      className="pb-24"
    >
      <div className="space-y-6">
        
        {/* CALCULATING STATE */}
        {isCalculating && (
          <div className="h-[280px] bg-bg-card border border-border-default rounded-lg flex flex-col items-center justify-center space-y-6 animate-pulse-subtle">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Coins className="w-6 h-6 text-gold/50" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="font-bebas text-xl tracking-widest text-gold animate-pulse">
                RUNNING PROTOCOL...
              </p>
              <p className="text-xs text-text-dim font-mono">
                Calculating recouponment waterfall
              </p>
            </div>
          </div>
        )}

        {/* RESULT STATE - THE "CHECK" REVEAL */}
        {!isCalculating && (
          <div className={cn("space-y-6", showResult ? "animate-reveal-up" : "opacity-0")}>
            
            {/* The "Golden Ticket" Result Card */}
            <div className="relative overflow-hidden rounded-lg border border-gold shadow-[0_0_40px_rgba(212,175,55,0.15)] group">
              {/* Background FX */}
              <div className="absolute inset-0 bg-gradient-to-br from-bg-elevated via-bg-card to-black" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              {/* Content */}
              <div className="relative z-10 p-6 md:p-8 flex flex-col items-center text-center space-y-4">
                
                {/* Header Label */}
                <div className="flex items-center gap-2 text-gold/70 mb-2">
                  <Ticket className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">Producer Net Profit</span>
                </div>

                {/* THE NUMBER */}
                <div className="scale-125 md:scale-150 transform transition-transform duration-700 ease-out">
                  <span className="font-mono text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-gold to-gold-muted drop-shadow-lg tabular-nums tracking-tighter">
                    {formatCompactCurrency(result.producer)}
                  </span>
                </div>

                {/* Percentage Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gold/10 border border-gold/30">
                  <span className="text-sm font-mono text-gold-bright font-bold">
                    {producerNetPercent.toFixed(1)}% of Gross
                  </span>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent my-2" />

                {/* Secondary Metrics Grid */}
                <div className="grid grid-cols-2 gap-8 w-full pt-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-text-dim">Gross Revenue</span>
                    <span className="font-mono text-lg text-text-primary">{formatCompactCurrency(inputs.revenue)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] uppercase tracking-wider text-text-dim">Investor ROI</span>
                     <span className={cn("font-mono text-lg", investorRecoupPercent >= 100 ? "text-green-400" : "text-red-400")}>
                        {investorRecoupPercent >= 120 ? "120% (CAPPED)" : `${investorRecoupPercent.toFixed(0)}%`}
                     </span>
                  </div>
                </div>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] animate-shimmer-slow pointer-events-none" />
            </div>

            {/* Action Link to Full Breakdown */}
            <Link 
              to="/waterfall-info"
              className="flex items-center justify-between p-5 bg-bg-elevated border border-gold/30 hover:border-gold rounded-lg transition-all group shadow-lg hover:shadow-gold/10 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-4 relative z-10">
                  <div className="p-2 bg-gold/10 rounded-md border border-gold/20 text-gold group-hover:text-gold-bright transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-white group-hover:text-gold transition-colors">
                      View Full Protocol Breakdown
                    </span>
                    <span className="text-xs text-text-dim group-hover:text-text-mid transition-colors">
                      See exactly how this number was calculated
                    </span>
                  </div>
              </div>
              
              <div className="relative z-10 p-1 rounded-full border border-transparent group-hover:border-gold/30 transition-colors">
                <ArrowRight className="w-5 h-5 text-text-dim group-hover:text-gold transition-colors" />
              </div>
            </Link>
          </div>
        )}
      </div>
    </StandardStepLayout>
  );
};

export default WaterfallTab;
