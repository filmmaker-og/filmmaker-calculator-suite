import { WaterfallResult, WaterfallInputs, GuildState, calculateWaterfall } from "@/lib/waterfall";
import type { ProjectDetails } from "@/pages/Calculator";
import { Lock, Play, X } from "lucide-react";
import StandardStepLayout from "../StandardStepLayout";
import { useEffect, useState } from "react";
import { useHaptics } from "@/hooks/use-haptics";
import WaterfallDeck from "../WaterfallDeck";

interface WaterfallTabProps {
  result: WaterfallResult;
  inputs: WaterfallInputs;
  project: ProjectDetails;
  guilds: GuildState;
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

const DEMO_GUILDS: GuildState = { sag: false, wga: false, dga: false };

const WaterfallTab = ({ result: initialResult, inputs: initialInputs, project, guilds, onExport }: WaterfallTabProps) => {
  const haptics = useHaptics();
  // State for Demo Mode (if real inputs are empty)
  const isEmpty = initialInputs.budget === 0 || initialInputs.revenue === 0;
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Use Demo data if active, otherwise real data
  const activeInputs = isDemoMode ? DEMO_INPUTS : initialInputs;
  const activeGuilds = isDemoMode ? DEMO_GUILDS : guilds;
  // Recalculate result if in demo mode, otherwise use passed result
  const activeResult = isDemoMode
    ? calculateWaterfall(DEMO_INPUTS, DEMO_GUILDS)
    : initialResult;

  const isLocked = isEmpty && !isDemoMode;

  // Animation states
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);

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

  // LOCKED STATE — stays in StandardStepLayout
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
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.20)", boxShadow: "0 16px 40px rgba(0,0,0,0.4)" }}
          >
            <Lock className="w-8 h-8" style={{ color: "rgba(255,255,255,0.55)" }} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bebas tracking-wide" style={{ color: "#fff" }}>
              Protocol Locked
            </h3>
            <p className="text-sm max-w-[280px] mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
              You haven't entered any data yet. Complete the Budget & Deal tabs first.
            </p>
          </div>

          {/* DEMO BUTTON */}
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

  // NON-LOCKED STATE — break out of StandardStepLayout
  return (
    <div style={{ paddingBottom: "96px" }}>
      {/* EYEBROW — rendered independently */}
      <div style={{ padding: "0 0 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.40)" }} />
          <span
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#D4AF37",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ opacity: 0.70 }}>04</span> · WATERFALL
          </span>
          <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.40)" }} />
        </div>
      </div>

      {/* CALCULATING STATE */}
      {isCalculating && (
        <div
          style={{
            height: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            background: "#0A0A0A",
            border: "1px solid rgba(212,175,55,0.20)",
            borderRadius: "12px",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              className="animate-spin"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "4px solid rgba(212,175,55,0.20)",
                borderTopColor: "#D4AF37",
              }}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              className="animate-pulse"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "24px",
                letterSpacing: "0.2em",
                color: "#D4AF37",
                margin: "0 0 4px",
              }}
            >
              CALCULATING PAYOFF...
            </p>
            <p
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: "14px",
                color: "rgba(255,255,255,0.55)",
                margin: 0,
              }}
            >
              Processing payment waterfall
            </p>
          </div>
        </div>
      )}

      {/* RESULT STATE — deck at full width */}
      {!isCalculating && showResult && (
        <div className="animate-reveal-up">
          {/* Demo banner */}
          {isDemoMode && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px",
                marginBottom: "12px",
                borderRadius: "8px",
                border: "1px solid rgba(212,175,55,0.20)",
                background: "rgba(212,175,55,0.04)",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#D4AF37",
                }}
              >
                Demo Mode
              </span>
              <button
                onClick={() => setIsDemoMode(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                <X size={12} />
                <span>Exit</span>
              </button>
            </div>
          )}

          {/* THE DECK — breakout wrapper escapes s.main 20px padding */}
          <div style={{ margin: "0 -20px" }}>
            <WaterfallDeck
              result={activeResult}
              inputs={activeInputs}
              project={project}
              guilds={activeGuilds}
              onExport={isDemoMode ? undefined : onExport}
            />
          </div>

          {/* Wiki link — below pagination */}
          <a
            href="/resources?tab=waterfall"
            style={{
              display: "block",
              padding: "16px",
              textAlign: "center",
              fontSize: "11px",
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            Return to Documentation
          </a>
        </div>
      )}
    </div>
  );
};

export default WaterfallTab;
