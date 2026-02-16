import { WaterfallResult, WaterfallInputs, calculateWaterfall, formatCompactCurrency, formatMultiple } from "@/lib/waterfall";
import { getVerdictStatus } from "@/lib/design-system";
import { Lock, AlertTriangle, ChevronDown, ChevronUp, Play, X, FileSpreadsheet, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import StandardStepLayout from "../StandardStepLayout";
import { useEffect, useState } from "react";
import { useHaptics } from "@/hooks/use-haptics";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import WaterfallVisual from "../WaterfallVisual";

interface WaterfallTabProps {
  result: WaterfallResult;
  inputs: WaterfallInputs;
  onExport?: () => void;
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

const WaterfallTab = ({ result: initialResult, inputs: initialInputs, onExport }: WaterfallTabProps) => {
  const haptics = useHaptics();
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
    }, 1200);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocked, isDemoMode]);

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
          
          {/* DEMO BUTTON - Primary CTA pattern */}
          <button
            onClick={handleRunDemo}
            className="flex items-center gap-2 px-6 py-3 bg-gold-cta-subtle border border-gold-cta-muted text-gold-cta rounded-md shadow-button hover:border-gold-cta transition-all active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span className="text-sm font-semibold uppercase tracking-wider">Run Demo Simulation</span>
          </button>
        </div>
      </StandardStepLayout>
    );
  }

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

        {/* RESULT STATE - Uses engine's pre-computed phase totals (single source of truth) */}
        {!isCalculating && showResult && (
          <div className="animate-reveal-up space-y-6">

            {/* Demo mode exit banner */}
            {isDemoMode && (
              <div className="flex items-center justify-between p-3 border border-border-default bg-gold/[0.04] rounded-lg">
                <span className="text-xs text-gold uppercase tracking-wider font-semibold">Demo Mode</span>
                <button
                  onClick={() => setIsDemoMode(false)}
                  className="flex items-center gap-1 text-xs text-text-dim hover:text-text-primary transition-colors"
                >
                  <X className="w-3 h-3" />
                  <span>Exit</span>
                </button>
              </div>
            )}

            <WaterfallVisual
              revenue={activeInputs.revenue}
              offTheTop={activeResult.offTopTotal}
              debtService={activeResult.debtTotal}
              equityPremium={activeResult.equityHurdle}
              deferments={activeResult.deferments}
              profitPool={activeResult.profitPool}
            />

            {/* Verdict + Investor Summary */}
            {(() => {
              const verdict = getVerdictStatus(activeResult.multiple, activeResult.profitPool > 0);
              return (
                <div
                  className="p-5 border rounded-lg space-y-4"
                  style={{ borderColor: verdict.color + '33', backgroundColor: verdict.bgColor }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: verdict.color }}
                    >
                      {verdict.label}
                    </span>
                    <span className="font-mono text-lg font-medium" style={{ color: verdict.color }}>
                      {formatMultiple(activeResult.multiple)}
                    </span>
                  </div>
                  <p className="text-xs text-text-dim leading-relaxed">{verdict.description}</p>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border-subtle">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-text-dim mb-1">Investor Total</p>
                      <p className="font-mono text-sm text-text-primary">{formatCompactCurrency(activeResult.investor)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-text-dim mb-1">Producer Share</p>
                      <p className="font-mono text-sm text-text-primary">{formatCompactCurrency(activeResult.producer)}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ═══ EXPORT CTA — The bridge to the store ═══ */}
            {!isDemoMode && (
              <div className="border border-border-default bg-gold/[0.04] rounded-lg p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">
                    Ready to Share?
                  </span>
                </div>
                <p className="text-sm text-text-mid leading-relaxed">
                  Turn these numbers into a professional investor package.
                  Beautifully designed. Presentation-grade. Starting at $197.
                </p>
                <button
                  onClick={onExport}
                  className="btn-cta-primary w-full h-14"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  EXPORT YOUR FINANCIAL SNAPSHOT
                </button>
              </div>
            )}

            {/* Disclaimer */}
            <Collapsible open={showDisclaimer} onOpenChange={setShowDisclaimer} className="border border-border-subtle rounded-lg bg-bg-surface overflow-hidden">
               <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-bg-elevated transition-colors">
                  <div className="flex items-center gap-2 text-text-dim">
                     <AlertTriangle className="w-4 h-4" />
                     <span className="text-xs font-semibold uppercase tracking-widest">Legal Disclaimer</span>
                  </div>
                  {showDisclaimer ? <ChevronUp className="w-4 h-4 text-text-dim" /> : <ChevronDown className="w-4 h-4 text-text-dim" />}
               </CollapsibleTrigger>
               <CollapsibleContent className="p-4 pt-0 text-xs text-text-dim space-y-2 border-t border-border-subtle bg-bg-void/50">
                  <p className="mt-4">This calculator is for educational purposes only.
                  Consult a qualified entertainment attorney before making any financing decisions.</p>
               </CollapsibleContent>
            </Collapsible>

            {/* Back to Wiki — text link pattern */}
            <Link
              to="/waterfall-info"
              className="block p-4 text-center text-[11px] tracking-wider text-text-dim hover:text-text-mid transition-colors"
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
