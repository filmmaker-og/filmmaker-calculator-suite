import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import { useInView } from "@/hooks/useInView";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import WaterfallCascade from "@/components/WaterfallCascade";
/* ═══════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES — design-system compliant, token-based
   ═══════════════════════════════════════════════════════════════════ */
/** Gold gradient divider — fades from transparent edges to gold center */
const Divider = () => (
  <div
    className="h-[1px] w-full"
    style={{
      background:
        "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.25) 50%, transparent 100%)",
    }}
  />
);
const Index = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [pendingDestination, setPendingDestination] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState(false);
  const [ctaGlow, setCtaGlow] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setHasSession(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setHasSession(true);
    });
    return () => subscription.unsubscribe();
  }, []);
  const gatedNavigate = useCallback((destination: string) => {
    if (!hasSession) {
      setPendingDestination(destination);
      setShowLeadCapture(true);
    } else {
      navigate(destination);
    }
  }, [hasSession, navigate]);
  const handleStartClick = () => {
    haptics.medium();
    gatedNavigate("/calculator?tab=budget");
  };
  const prefersReducedMotion = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    if (prefersReducedMotion) return;
    const timeout = setTimeout(() => setCtaGlow(true), 3500);
    return () => clearTimeout(timeout);
  }, [prefersReducedMotion]);
  /* ── Scroll-reveal refs ── */
  const { ref: caseRef, inView: caseVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const { ref: priceRef, inView: priceVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const { ref: closerRef, inView: closerVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });
  /* ── Evidence panel data — the two strongest ── */
  const evidencePanels = [
    {
      label: "NEGOTIATING BLIND",
      body: "Sales agents take 15-25% off the top. CAM fees eat another 1-2% of gross. The distributor takes their fee before your investors see anything. If you don't know these numbers going in, you're not negotiating.",
      punchline: "You're guessing.",
    },
    {
      label: "THE MEETING YOU'RE NOT READY FOR",
      body: "You walk into an investor meeting. They ask where their money sits in the recoupment stack. If you can't answer that in 30 seconds with actual numbers, the meeting is over.",
      punchline: "They just won't tell you it's over.",
    },
  ];
  return (
    <>
      <LeadCaptureModal
        isOpen={showLeadCapture}
        onClose={() => setShowLeadCapture(false)}
        onSuccess={() => {
          setHasSession(true);
          setShowLeadCapture(false);
          navigate(pendingDestination || "/calculator?tab=budget");
        }}
      />
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-black grain-overlay">
        <main
          aria-label="Film Finance Simulator"
          className="flex-1 flex flex-col items-center"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="w-full max-w-xl px-5 md:px-8 flex flex-col gap-5 py-6">
            {/* ════════════════════════════════════════════════════════
                1. HERO — primary conversion card (rounded-2xl)
                ════════════════════════════════════════════════════════ */}
            <div
              className="rounded-2xl px-6 py-10 md:px-8 md:py-14 text-center overflow-hidden"
              style={{
                background: "radial-gradient(ellipse at center top, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 40%, transparent 100%)",
                border: "1px solid rgba(212,175,55,0.25)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 0 40px rgba(212,175,55,0.03)",
              }}
            >
              <p className="font-mono text-[14px] uppercase tracking-[0.20em] mb-6 text-gold-full">
                Film Finance Simulator
              </p>
              <h1 className="font-bebas text-[clamp(3.2rem,11vw,4.8rem)] leading-[0.96] tracking-[0.06em] text-white mb-4">
                SEE WHERE EVERY DOLLAR GOES
              </h1>
              <p className="text-[16px] md:text-[18px] leading-[1.7] text-white-primary tracking-[0.02em] mx-auto max-w-sm mb-8" style={{ textWrap: "balance" as never }}>
                Model your waterfall. Know every fee, split, and&nbsp;return
                — before your investor asks.
              </p>
              <div className="w-full max-w-[280px] mx-auto">
                <button
                  onClick={handleStartClick}
                  className={`w-full h-14 rounded-sm btn-cta-primary font-bold${ctaGlow ? " animate-cta-glow-pulse" : ""}`}
                >
                  BUILD YOUR WATERFALL
                </button>
              </div>
            </div>
            <Divider />
            {/* ════════════════════════════════════════════════════════
                2. WATERFALL CASCADE — interactive proof-of-concept
                   (rounded-xl data card treatment)
                ════════════════════════════════════════════════════════ */}
            <div
              className="rounded-xl px-5 py-6 md:px-6 md:py-8 overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(212,175,55,0.15)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <p className="max-w-2xl mx-auto text-center text-white-body text-[16px] leading-relaxed mb-8">
                The waterfall dictates who gets paid first, who gets paid last, and how much is left by the time it reaches you.
              </p>
              <WaterfallCascade />
            </div>
            <Divider />
            {/* ════════════════════════════════════════════════════════
                3. THE CASE — merged education + evidence
                   Wide card → 2-up evidence grid below
                ════════════════════════════════════════════════════════ */}
            <div ref={caseRef} className="flex flex-col gap-4">
              {/* Education card — the "why" */}
              <div
                className="rounded-xl px-6 py-8 md:px-8 md:py-10 overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(212,175,55,0.15)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                  opacity: prefersReducedMotion || caseVisible ? 1 : 0,
                  transform: prefersReducedMotion || caseVisible ? "translateY(0)" : "translateY(20px)",
                  transition: prefersReducedMotion ? "none" : "opacity 700ms ease-out, transform 700ms ease-out",
                }}
              >
                <p className="font-mono text-[14px] uppercase tracking-[0.20em] text-gold-full mb-5">
                  Why This Matters
                </p>
                <h2 className="font-bebas text-[28px] md:text-[40px] leading-[1.05] tracking-[0.06em] text-white mb-5">
                  KNOW YOUR DEAL BEFORE YOU SIGN&nbsp;IT
                </h2>
                <p className="text-[16px] leading-relaxed text-white-body">
                  Every film deal has a pecking order — distributors, sales agents,
                  lenders, and investors all get paid before you do.
                  That's called a <span className="text-gold-full font-medium">waterfall</span>.
                  This tool lets you map every fee, split, and repayment tier so you
                  walk into those conversations already knowing the math.
                </p>
                <a
                  href="/resources?tab=waterfall"
                  className="inline-block mt-6 font-mono text-[14px] tracking-[0.06em] text-gold-cta hover:opacity-70 transition-opacity"
                >
                  What's a waterfall? {"\u2192"}
                </a>
              </div>
              {/* Evidence panels — 2-up grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evidencePanels.map((panel, i) => (
                  <div
                    key={panel.label}
                    className="rounded-xl p-5 md:p-6 overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(212,175,55,0.15)",
                      opacity: prefersReducedMotion || caseVisible ? 1 : 0,
                      transform: prefersReducedMotion || caseVisible ? "translateY(0)" : "translateY(20px)",
                      transition: prefersReducedMotion ? "none" : "opacity 700ms ease-out, transform 700ms ease-out",
                      transitionDelay: prefersReducedMotion ? "0ms" : `${(i + 1) * 200}ms`,
                    }}
                  >
                    <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-gold-full mb-4">
                      {panel.label}
                    </p>
                    <p className="text-[14px] md:text-[16px] leading-relaxed text-white-body mb-4">
                      {panel.body}
                    </p>
                    <div
                      className="h-[1px] w-full mb-4"
                      style={{
                        background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.25) 50%, transparent 100%)",
                      }}
                    />
                    <p className="text-[14px] md:text-[16px] leading-relaxed text-white font-semibold">
                      {panel.punchline}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <Divider />
            {/* ════════════════════════════════════════════════════════
                4. WHAT THIS COSTS — compact, centered
                ════════════════════════════════════════════════════════ */}
            <div
              ref={priceRef}
              className="rounded-xl px-6 py-8 md:px-8 md:py-10 text-center overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(212,175,55,0.15)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                opacity: prefersReducedMotion || priceVisible ? 1 : 0,
                transform: prefersReducedMotion || priceVisible ? "translateY(0)" : "translateY(20px)",
                transition: prefersReducedMotion ? "none" : "opacity 700ms ease-out, transform 700ms ease-out",
              }}
            >
              <p className="font-mono text-[14px] uppercase tracking-[0.20em] text-gold-full mb-4">
                What This Costs
              </p>
              <p className="font-bebas text-[40px] leading-[1.05] tracking-[0.06em] text-white mb-4">
                FREE
              </p>
              <p className="max-w-md mx-auto text-[14px] md:text-[16px] leading-relaxed text-white-body mb-6">
                An entertainment attorney bills $500–$850/hr to walk you through
                waterfall mechanics. This gives you the financial x-ray for free.
              </p>
              <div className="w-full max-w-[280px] mx-auto">
                <button
                  onClick={handleStartClick}
                  className="w-full h-14 rounded-sm btn-cta-primary font-bold"
                >
                  BUILD YOUR WATERFALL
                </button>
              </div>
            </div>
            <Divider />
            {/* ════════════════════════════════════════════════════════
                5. CLOSER CTA — emotional trigger + final conversion
                   (rounded-2xl feature/CTA treatment)
                ════════════════════════════════════════════════════════ */}
            <div
              ref={closerRef}
              className="rounded-2xl px-6 py-10 md:px-8 md:py-14 text-center overflow-hidden"
              style={{
                border: "1px solid rgba(212,175,55,0.25)",
                background: "radial-gradient(ellipse at center 70%, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 60%, transparent 100%)",
                boxShadow: "0 0 60px rgba(212,175,55,0.03), inset 0 1px 0 rgba(255,255,255,0.06)",
                opacity: prefersReducedMotion || closerVisible ? 1 : 0,
                transform: prefersReducedMotion || closerVisible ? "translateY(0)" : "translateY(20px)",
                transition: prefersReducedMotion ? "none" : "opacity 700ms ease-out, transform 700ms ease-out",
              }}
            >
              <h2 className="font-bebas text-[28px] md:text-[40px] leading-[1.05] tracking-[0.06em] text-white mb-6">
                YOUR INVESTORS WILL{"\u00A0"}ASK HOW THE MONEY FLOWS BACK.
              </h2>
              <div className="w-full max-w-[280px] mx-auto">
                <button
                  onClick={handleStartClick}
                  className="w-full h-14 rounded-sm btn-cta-primary font-bold animate-cta-glow-pulse"
                >
                  BUILD YOUR WATERFALL
                </button>
              </div>
            </div>
            {/* ════════════════════════════════════════════════════════
                6. FOOTER — disclaimer
                ════════════════════════════════════════════════════════ */}
            <footer className="pt-4 pb-6 px-4 text-center">
              <Divider />
              <p className="text-white-tertiary text-[12px] tracking-wide leading-relaxed mx-auto max-w-sm mt-4">
                For educational and informational purposes only. Not legal, tax,
                or investment advice. Consult a qualified entertainment attorney
                before making financing decisions.
              </p>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
};
export default Index;
