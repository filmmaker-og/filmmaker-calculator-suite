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
  const [isCalculating, setIsCalculating] = useState(false);
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
          <div
            className="p-4 rounded-full"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.15)", boxShadow: "0 16px 40px rgba(0,0,0,0.4)" }}
          >
            <Lock className="w-8 h-8" style={{ color: "rgba(255,255,255,0.40)" }} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bebas tracking-wide" style={{ color: "#fff" }}>
              Protocol Locked
            </h3>
            <p className="text-sm max-w-[280px] mx-auto" style={{ color: "rgba(255,255,255,0.40)" }}>
              You haven't entered any data yet. Complete the Budget & Deal tabs first.
            </p>
          </div>

          {/* DEMO BUTTON - Inline gold pattern */}
          <button
            onClick={handleRunDemo}
            className="flex items-center gap-2 px-6 py-3 transition-all active:scale-[0.98]"
            style={{
              background: "rgba(212,175,55,0.08)",
              border: "1px solid rgba(212,175,55,0.25)",
              color: "#D4AF37",
              borderRadius: "6px",
            }}
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
          <div
            className="h-[400px] flex flex-col items-center justify-center space-y-6 animate-pulse-subtle"
            style={{ background: "#0A0A0A", border: "1px solid rgba(212,175,55,0.15)", borderRadius: "12px" }}
          >
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full animate-spin"
                style={{ border: "4px solid rgba(212,175,55,0.20)", borderTopColor: "#D4AF37" }}
              />
            </div>
            <div className="text-center space-y-1">
              <p className="font-bebas text-2xl tracking-widest animate-pulse" style={{ color: "#D4AF37" }}>
                CALCULATING PAYOFF...
              </p>
              <p className="text-sm font-mono" style={{ color: "rgba(255,255,255,0.40)" }}>
                Processing payment waterfall
              </p>
            </div>
          </div>
        )}

        {/* RESULT STATE */}
        {!isCalculating && showResult && (
          <div className="animate-reveal-up space-y-6">

            {/* Demo mode exit banner */}
            {isDemoMode && (
              <div
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ border: "1px solid rgba(212,175,55,0.15)", background: "rgba(212,175,55,0.04)" }}
              >
                <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "#D4AF37" }}>Demo Mode</span>
                <button
                  onClick={() => setIsDemoMode(false)}
                  className="flex items-center gap-1 text-xs transition-colors"
                  style={{ color: "rgba(255,255,255,0.40)" }}
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
                  className="p-5 rounded-lg space-y-4"
                  style={{ border: `1px solid ${verdict.color}33`, backgroundColor: verdict.bgColor }}
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
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.40)" }}>{verdict.description}</p>
                  <div
                    className="grid grid-cols-2 gap-4 pt-2"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div>
                      <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.40)" }}>Investor Total</p>
                      <p className="font-mono text-sm" style={{ color: "#fff" }}>{formatCompactCurrency(activeResult.investor)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.40)" }}>Producer Share</p>
                      <p className="font-mono text-sm" style={{ color: "#fff" }}>{formatCompactCurrency(activeResult.producer)}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ═══ EXPORT CTA — The bridge to the store ═══ */}
            {!isDemoMode && (
              <div
                className="rounded-lg p-5 space-y-4"
                style={{ border: "1px solid rgba(212,175,55,0.15)", background: "rgba(212,175,55,0.04)" }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" style={{ color: "#D4AF37" }} />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: "#D4AF37" }}>
                    Ready to Share?
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
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
            <Collapsible
              open={showDisclaimer}
              onOpenChange={setShowDisclaimer}
              className="rounded-lg overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)" }}
            >
               <CollapsibleTrigger className="flex items-center justify-between w-full p-4 transition-colors">
                  <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.40)" }}>
                     <AlertTriangle className="w-4 h-4" />
                     <span className="text-xs font-semibold uppercase tracking-widest">Legal Disclaimer</span>
                  </div>
                  {showDisclaimer
                    ? <ChevronUp className="w-4 h-4" style={{ color: "rgba(255,255,255,0.40)" }} />
                    : <ChevronDown className="w-4 h-4" style={{ color: "rgba(255,255,255,0.40)" }} />
                  }
               </CollapsibleTrigger>
               <CollapsibleContent
                 className="p-4 pt-0 text-xs space-y-2"
                 style={{ color: "rgba(255,255,255,0.40)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
               >
                  <p className="mt-4">This calculator is for educational purposes only.
                  Consult a qualified entertainment attorney before making any financing decisions.</p>
               </CollapsibleContent>
            </Collapsible>

            {/* Back to Wiki — text link pattern */}
            <Link
              to="/waterfall-info"
              className="block p-4 text-center text-[11px] tracking-wider transition-colors"
              style={{ color: "rgba(255,255,255,0.40)" }}
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
