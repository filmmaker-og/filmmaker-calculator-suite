import { WaterfallResult, WaterfallInputs, formatCurrency, formatCompactCurrency, calculateWaterfall } from "@/lib/waterfall";
import { ArrowRight, Lock, BookOpen, AlertTriangle, ChevronDown, ChevronUp, Play } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import StandardStepLayout from "../StandardStepLayout";
import { useEffect, useState, useRef } from "react";
import { useHaptics } from "@/hooks/use-haptics";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import WaterfallVisual from "../WaterfallVisual"; // IMPORTED THE MISSING COMPONENT

interface WaterfallTabProps {
  result: WaterfallResult;
  inputs: WaterfallInputs;
}

// Demo inputs for when the user lands from Wiki with no data
const DEMO_INPUTS: WaterfallInputs = {
  revenue: 2500000,
  budget: 1000000,
  credits: 0,
  debt: 500000,
  seniorDebtRate: 10,
  mezzanineDebt: 0,
  mezzanineRate: 0,
  equity: 500000,
  premium: 20,
  salesFee: 10,
  salesExp: 50000,
  deferments: 0,
};

const WaterfallTab = ({ result: initialResult, inputs: initialInputs }: WaterfallTabProps) => {
  const haptics = useHaptics();
  const location = useLocation();
  
  // State for Demo Mode (if real inputs are empty)
  const isEmpty = initialInputs.budget === 0 || initialInputs.revenue === 0;
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Use Demo data if active, otherwise real data
  const activeInputs = isDemoMode ? DEMO_INPUTS : initialInputs;
  // Recalculate result if in demo mode, otherwise use passed result
  const activeResult = isDemoMode 
    ? calculateWaterfall(DEMO_INPUTS, { sag: false, wga: false, dga: false }) 
    : initialResult;

  const isLocked = isEmpty && !isDemoMode;

  // Animation states
  const [isCalculating, setIsCalculating] = useState(false); // Start false to prevent flash
  const [showResult, setShowResult] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  
  const hasRevealedRef = useRef(false);

  // Trigger Animation on Load or Demo Toggle
  useEffect(() => {
    if (isLocked) {
      setShowResult(false);
      return;
    }

    // Start Sequence
    setIsCalculating(true);
    setShowResult(false);

    const timer = setTimeout(() => {
      setIsCalculating(false);
      haptics.success();
      setShowResult(true);
      hasRevealedRef.current = true;
    }, 1200);

    return () => clearTimeout(timer);
  }, [isLocked, isDemoMode, haptics]);

  // Handler for "Run Demo" button on Locked Screen
  const handleRunDemo = () => {
    setIsDemoMode(true);
  };

  if (isLocked) {
    return (
      <StandardStepLayout
        chapter="04"
        title="WATERFALL"
        subtitle="Final position and net distribution"
        className="pb-24"
      >
        <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center h-[50vh] animate-fade-in">
          <div className="p-4 rounded-full bg-bg-surface border border-border-default shadow-lg">
            <Lock className="w-8 h-8 text-text-dim" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bebas tracking-wide text-text-primary">
              Protocol Locked
            </h3>
            <p className="text-sm text-text-dim max-w-[280px] mx-auto">
              You haven't entered any data yet. Complete the Budget & Deal tabs first.
            </p>
          </div>
          
          {/* DEMO BUTTON - The fix for "Nothing happens" */}
          <button
            onClick={handleRunDemo}
            className="flex items-center gap-2 px-6 py-3 bg-gold text-black font-bold rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 transition-transform animate-pulse-subtle"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>RUN DEMO SIMULATION</span>
          </button>
        </div>
      </StandardStepLayout>
    );
  }

  // Derived metrics for visuals
  const offTheTop = activeResult.ledger.find(i => i.name === "Sales Fees")?.amount || 0; 
  // Simplified mapping for the Visual Component
  // Note: WaterfallVisual expects specific buckets. We aggregate result.ledger to match.
  // This is a simplification; for production, we might want exact matching.
  
  const debtService = activeResult.ledger
    .filter(i => i.name.includes("Debt") || i.name.includes("Loan") || i.name.includes("Interest"))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const equityReturn = activeResult.ledger
    .filter(i => i.name.includes("Equity"))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const deferments = activeResult.ledger
    .filter(i => i.name.includes("Deferment"))
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <StandardStepLayout
      chapter="04"
      title="WATERFALL"
      subtitle={isDemoMode ? "DEMO MODE SIMULATION" : "Final position and net distribution"}
      className="pb-24"
    >
      <div className="space-y-6">
        
        {/* CALCULATING STATE */}
        {isCalculating && (
          <div className="h-[400px] bg-bg-card border border-border-default rounded-lg flex flex-col items-center justify-center space-y-6 animate-pulse-subtle">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-bebas text-2xl tracking-widest text-gold animate-pulse">
                CALCULATING PAYOFF...
              </p>
              <p className="text-sm text-text-dim font-mono">
                Processing payment waterfall
              </p>
            </div>
          </div>
        )}

        {/* RESULT STATE - NOW USING WATERFALL VISUAL */}
        {!isCalculating && showResult && (
          <div className="animate-reveal-up space-y-6">
            
            {/* THE NEW VISUAL COMPONENT */}
            <WaterfallVisual 
              revenue={activeInputs.revenue}
              offTheTop={activeInputs.salesFee * activeInputs.revenue / 100 + activeInputs.salesExp} // approx
              debtService={debtService}
              equityPremium={equityReturn}
              deferments={deferments}
              profitPool={activeResult.producer + activeResult.investor}
            />

            {/* Disclaimer */}
            <Collapsible open={showDisclaimer} onOpenChange={setShowDisclaimer} className="border border-border-subtle rounded-lg bg-bg-surface overflow-hidden">
               <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-bg-elevated transition-colors">
                  <div className="flex items-center gap-2 text-text-dim">
                     <AlertTriangle className="w-4 h-4" />
                     <span className="text-xs font-bold uppercase tracking-widest">Legal Disclaimer</span>
                  </div>
                  {showDisclaimer ? <ChevronUp className="w-4 h-4 text-text-dim" /> : <ChevronDown className="w-4 h-4 text-text-dim" />}
               </CollapsibleTrigger>
               <CollapsibleContent className="p-4 pt-0 text-xs text-text-dim space-y-2 border-t border-border-subtle bg-bg-void/50">
                  <p className="mt-4">This calculator is for educational purposes only.</p>
                  <p className="font-bold text-red-400 mt-2">Consult a qualified entertainment attorney.</p>
               </CollapsibleContent>
            </Collapsible>

            {/* Back to Wiki */}
            <Link 
              to="/waterfall-info"
              className="block p-4 text-center text-xs text-gold/70 hover:text-gold hover:underline"
            >
              Return to Wiki Documentation
            </Link>
          </div>
        )}
      </div>
    </StandardStepLayout>
  );
};

export default WaterfallTab;
