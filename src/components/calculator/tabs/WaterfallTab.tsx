import { WaterfallResult, WaterfallInputs, formatCurrency, formatCompactCurrency, formatPercent } from "@/lib/waterfall";
import { ArrowRight, Lock, BookOpen, Ticket, Coins, RefreshCw, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import StandardStepLayout from "../StandardStepLayout";
import { useEffect, useState, useRef } from "react";
import { useHaptics } from "@/hooks/use-haptics";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface WaterfallTabProps {
  result: WaterfallResult;
  inputs: WaterfallInputs;
}

const WaterfallTab = ({ result, inputs }: WaterfallTabProps) => {
  const haptics = useHaptics();
  const location = useLocation();
  const isLocked = inputs.budget === 0 || inputs.revenue === 0;
  
  // Animation states
  const [isCalculating, setIsCalculating] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  
  // Ref to track if we've already done the initial reveal to prevent loops
  const hasRevealedRef = useRef(false);

  // Effect: Reset animation when location changes (navigating back from Wiki) OR when lock state changes
  useEffect(() => {
    if (isLocked) {
      setShowResult(false);
      setIsCalculating(true);
      hasRevealedRef.current = false;
      return;
    }

    // If we're coming back to this tab, or inputs unlocked it, trigger the sequence
    setIsCalculating(true);
    setShowResult(false);

    const timer1 = setTimeout(() => {
      setIsCalculating(false);
      haptics.success(); // Tactile feedback on reveal
      setShowResult(true);
      hasRevealedRef.current = true;
    }, 1200); // Slightly faster 1.2s suspense

    return () => clearTimeout(timer1);
  }, [location.pathname, isLocked, haptics, inputs.revenue, inputs.budget]); 
  // Added inputs dependencies so if user changes numbers, it re-runs the "protocol" visual

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

  // Calculate metrics
  const producerNetPercent = result.producer > 0 && inputs.revenue > 0
    ? (result.producer / inputs.revenue) * 100 
    : 0;
    
  // If revenue < totalHurdle, we have a shortfall
  const shortfall = Math.max(0, result.totalHurdle - inputs.revenue);
  const isUnderwater = shortfall > 0;

  // Cost of Capital Calculations
  const seniorInterest = (inputs.debt || 0) * ((inputs.seniorDebtRate || 0) / 100);
  const mezzInterest = (inputs.mezzanineDebt || 0) * ((inputs.mezzanineRate || 0) / 100);
  const equityPremium = (inputs.equity || 0) * ((inputs.premium || 0) / 100);
  const totalCostOfCapital = seniorInterest + mezzInterest + equityPremium;

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
                Calculating recoupment waterfall
              </p>
            </div>
          </div>
        )}

        {/* RESULT STATE */}
        {!isCalculating && (
          <div className={cn("space-y-8", showResult ? "animate-reveal-up" : "opacity-0")}>
            
            {/* --- 1. THE GOLDEN TICKET (OR RED ALERT) --- */}
            <div className={cn(
              "relative overflow-hidden rounded-lg border shadow-lg group transition-all duration-500",
              isUnderwater 
                ? "border-red-500/50 shadow-red-500/10" 
                : "border-gold shadow-[0_0_40px_rgba(212,175,55,0.15)]"
            )}>
              {/* Background FX - Toned down gold usage here too per "sparing" rule */}
              <div className="absolute inset-0 bg-gradient-to-br from-bg-elevated via-bg-card to-black" />
              <div className={cn(
                "absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-10", // Reduced opacity
                isUnderwater ? "bg-red-500" : "bg-gold"
              )} />
              
              {/* Content */}
              <div className="relative z-10 p-6 md:p-8 flex flex-col items-center text-center space-y-4">
                
                {/* Header Label */}
                <div className={cn(
                  "flex items-center gap-2 mb-2",
                  isUnderwater ? "text-red-400" : "text-gold/70"
                )}>
                  {isUnderwater ? <AlertTriangle className="w-4 h-4" /> : <Ticket className="w-4 h-4" />}\n                  <span className="text-xs font-bold uppercase tracking-[0.2em]">
                    {isUnderwater ? "Recoupment Shortfall" : "Producer Net Profit"}
                  </span>
                </div>

                {/* THE NUMBER */}
                <div className="scale-125 md:scale-150 transform transition-transform duration-700 ease-out">
                  <span className={cn(
                    "font-mono text-4xl md:text-5xl font-bold tabular-nums tracking-tighter",
                    isUnderwater 
                      ? "text-red-500 drop-shadow-sm" 
                      : "text-transparent bg-clip-text bg-gradient-to-b from-white via-gold to-gold-muted drop-shadow-lg"
                  )}>
                    {isUnderwater ? `-${formatCompactCurrency(shortfall)}` : formatCompactCurrency(result.producer)}
                  </span>
                </div>

                {/* Status Badge */}
                <div className={cn(
                  "inline-flex items-center px-3 py-1 rounded-full border",
                  isUnderwater 
                    ? "bg-red-500/10 border-red-500/30 text-red-400" 
                    : "bg-gold/10 border-gold/30 text-gold-bright"
                )}>
                  <span className="text-sm font-mono font-bold">
                    {isUnderwater 
                      ? "Investors Not Whole" 
                      : `${producerNetPercent.toFixed(1)}% of Gross`}
                  </span>
                </div>

                {/* Divider */}
                <div className={cn(
                  "w-full h-px my-2",
                  isUnderwater 
                    ? "bg-gradient-to-r from-transparent via-red-500/30 to-transparent" 
                    : "bg-gradient-to-r from-transparent via-gold/30 to-transparent"
                )} />

                {/* Secondary Metrics Grid */}
                <div className="grid grid-cols-2 gap-8 w-full pt-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-text-dim">Gross Revenue</span>
                    <span className="font-mono text-lg text-text-primary">{formatCompactCurrency(inputs.revenue)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] uppercase tracking-wider text-text-dim">Recoupment</span>
                     <span className={cn(
                       "font-mono text-lg", 
                       result.recoupPct >= 100 ? "text-green-400" : "text-red-400"
                     )}>
                        {result.recoupPct.toFixed(0)}%
                     </span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- 2. DETAILED LEDGER (New) --- */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-text-dim uppercase tracking-widest pl-1">
                Distribution Ledger
              </h3>
              <div className="bg-bg-card border border-border-default rounded-lg overflow-hidden divide-y divide-border-subtle">
                {/* Header */}
                <div className="grid grid-cols-[1fr_auto] gap-4 p-3 bg-bg-elevated text-[10px] font-bold text-text-dim uppercase tracking-wider">
                  <div>Item</div>
                  <div className="text-right">Deduction</div>
                </div>
                
                {/* Ledger Items */}
                {result.ledger.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[1fr_auto] gap-4 p-3 hover:bg-white/5 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-text-primary">{item.name}</span>
                      <span className="text-[10px] text-text-dim">{item.detail}</span>
                    </div>
                    <div className="text-right font-mono text-sm text-text-mid">
                      {formatCurrency(item.amount)}
                    </div>
                  </div>
                ))}
                
                {/* Total Deductions Footer */}
                <div className="grid grid-cols-[1fr_auto] gap-4 p-3 bg-bg-elevated border-t border-border-default">
                  <span className="text-xs font-bold text-text-primary uppercase">Total Deductions</span>
                  <span className="text-xs font-bold font-mono text-white">
                    {formatCurrency(result.totalHurdle)}
                  </span>
                </div>
              </div>
            </div>

            {/* --- 3. COST OF CAPITAL TABLE (New) --- */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                 <h3 className="text-xs font-bold text-text-dim uppercase tracking-widest">
                  Cost of Capital
                </h3>
                <span className="text-[10px] text-red-400 font-mono">
                  -{formatCurrency(totalCostOfCapital)}
                </span>
              </div>
             
              <div className="bg-bg-card border border-border-default rounded-lg overflow-hidden p-4 space-y-4">
                 <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-text-dim uppercase border-b border-border-subtle pb-2">
                    <div>Source</div>\n                    <div className="text-right">Principal</div>
                    <div className="text-right">Cost (Int/Pref)</div>
                 </div>
                 
                 {/* Senior */}
                 <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-text-primary">Senior Debt</span>
                    <span className="text-right font-mono text-text-mid">{formatCompactCurrency(inputs.debt)}</span>
                    <span className="text-right font-mono text-red-400">{formatCompactCurrency(seniorInterest)}</span>
                 </div>
                 
                 {/* Mezzanine */}
                 {inputs.mezzanineDebt > 0 && (
                   <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-text-primary">Gap Loan</span>
                      <span className="text-right font-mono text-text-mid">{formatCompactCurrency(inputs.mezzanineDebt)}</span>\n                      <span className="text-right font-mono text-red-400">{formatCompactCurrency(mezzInterest)}</span>
                   </div>
                 )}
                 
                 {/* Equity */}
                 <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-text-primary">Equity</span>
                    <span className="text-right font-mono text-text-mid">{formatCompactCurrency(inputs.equity)}</span>
                    <span className="text-right font-mono text-red-400">{formatCompactCurrency(equityPremium)}</span>
                 </div>
              </div>
              <p className="text-[10px] text-text-dim px-1">
                * Cost represents interest and premiums paid *before* net profits.
              </p>
            </div>

            {/* --- 4. DISCLAIMER (New) --- */}
            <Collapsible open={showDisclaimer} onOpenChange={setShowDisclaimer} className="border border-border-subtle rounded-lg bg-bg-surface overflow-hidden">
               <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-bg-elevated transition-colors">
                  <div className="flex items-center gap-2 text-text-dim">
                     <AlertTriangle className="w-4 h-4" />
                     <span className="text-xs font-bold uppercase tracking-widest">Legal Disclaimer & Assumptions</span>\n                  </div>
                  {showDisclaimer ? <ChevronUp className="w-4 h-4 text-text-dim" /> : <ChevronDown className="w-4 h-4 text-text-dim" />}
               </CollapsibleTrigger>
               <CollapsibleContent className="p-4 pt-0 text-xs text-text-dim space-y-2 border-t border-border-subtle bg-bg-void/50">
                  <p className="mt-4">This calculator is for educational and estimation purposes only.</p>
                  <ul className="list-disc pl-4 space-y-1">
                     <li><strong>Territory Splits:</strong> This model assumes a single "Worldwide" deal. In reality, rights are often sold territory-by-territory.</li>
                     <li><strong>Cross-Collateralization:</strong> We assume "Single Picture Accounting." If your deal is cross-collateralized, your profits may be zeroed out by other films' losses.</li>
                     <li><strong>Tax Credits:</strong> We treat tax credits as a source of funds (reducing the gap), not as revenue.</li>
                     <li><strong>Interest Accrual:</strong> Interest is estimated as a flat fee. In reality, it accrues daily and compounds.</li>\n                  </ul>
                  <p className="font-bold text-red-400 mt-2">Consult a qualified entertainment attorney before signing any financing or distribution agreement.</p>
               </CollapsibleContent>\n            </Collapsible>

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
                      How The Math Works
                    </span>
                    <span className="text-xs text-text-dim group-hover:text-text-mid transition-colors">
                      Deep dive into the protocol logic
                    </span>\n                  </div>
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
