import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import { useInView } from "@/hooks/useInView";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import WaterfallCascade from "@/components/WaterfallCascade";
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
  const { ref: waterfallRef, inView: waterfallVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });
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
          <div className="w-full max-w-xl px-5 md:px-8 flex flex-col gap-8 py-6">
            {/* ════════════════════════════════════════════════════════
                1. HERO — primary conversion card
                ════════════════════════════════════════════════════════ */}
            <div
              className="px-6 py-10 md:px-8 md:py-14 text-center overflow-hidden"
              style={{
                borderRadius: "8px",
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
              <p className="text-[16px] md:text-[18px] leading-[1.7] text-ink-body tracking-[0.02em] mx-auto max-w-sm mb-8" style={{ textWrap: "balance" as never }}>
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
            {/* ════════════════════════════════════════════════════════
                2. WATERFALL CASCADE — interactive proof-of-concept
                ════════════════════════════════════════════════════════ */}
            <div
              ref={waterfallRef}
              className="px-5 py-6 md:px-6 md:py-8 overflow-hidden"
              style={{
                borderRadius: "8px",
                background: "#111111",
                border: "1px solid rgba(212,175,55,0.15)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                opacity: prefersReducedMotion || waterfallVisible ? 1 : 0,
                transform: prefersReducedMotion || waterfallVisible ? "translateY(0)" : "translateY(20px)",
                transition: prefersReducedMotion ? "none" : "opacity 700ms ease-out, transform 700ms ease-out",
              }}
            >
              <p className="max-w-2xl mx-auto text-center text-ink-body text-[16px] leading-relaxed mb-8">
                The waterfall dictates who gets paid first, who gets paid last, and how much is left by the time it reaches you.
              </p>
              <WaterfallCascade />
            </div>
            {/* ════════════════════════════════════════════════════════
                3. THE CASE — merged education + evidence
                   Wide card → 2-up evidence grid below
                ════════════════════════════════════════════════════════ */}
            <div ref={caseRef} className="flex flex-col gap-4">
              {/* Education card — the "why" */}
              <div
                className="px-6 py-8 md:px-8 md:py-10 overflow-hidden"
                style={{
                  borderRadius: "8px",
                  background: "rgba(212,175,55,0.03)",
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
                <h2 className="font-bebas text-[28px] md:text-[36px] leading-[1.05] tracking-[0.06em] text-white mb-5">
                  KNOW YOUR DEAL BEFORE YOU SIGN&nbsp;IT
                </h2>
                <p className="text-[16px] leading-relaxed text-ink-body">
                  Every film deal has a pecking order — distributors, sales agents,
                  lenders, and investors all get paid before you do.
                  That's called a <span className="text-gold-full font-medium">waterfall</span>.
                  This tool lets you map every fee, split, and repayment tier so you
                  walk into those conversations already knowing the math.
                </p>
              </div>
              {/* Evidence panels — 2-up grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evidencePanels.map((panel, i) => (
                  <div
                    key={panel.label}
                    className="p-5 md:p-6 overflow-hidden"
                    style={{
                      borderRadius: "8px",
                      background: "#111111",
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
                    <p className="text-[14px] md:text-[16px] leading-relaxed text-ink-body mb-4">
                      {panel.body}
                    </p>
                    <p className="font-mono text-[14px] uppercase tracking-[0.12em] text-white font-medium">
                      {panel.punchline}
                    </p>
                  </div>
                ))}
              </div>
              {/* Evidence sub-cards — compact stat pair, always 2-up */}
              <div
                className="grid grid-cols-2 gap-2"
                style={{
                  opacity: prefersReducedMotion || caseVisible ? 1 : 0,
                  transform: prefersReducedMotion || caseVisible ? "translateY(0)" : "translateY(12px)",
                  transition: prefersReducedMotion ? "none" : "opacity 500ms ease-out, transform 500ms ease-out",
                  transitionDelay: prefersReducedMotion ? "0ms" : "400ms",
                }}
              >
                {[
                  { number: "15–25%", label: "Sales agent off-the-top" },
                  { number: "EVERY HAND", label: "In the pot before you" },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="px-3.5 py-3.5 text-center"
                    style={{
                      borderRadius: "8px",
                      background: "#111111",
                      border: "1px solid rgba(212,175,55,0.15)",
                    }}
                  >
                    <p className="font-mono text-[18px] md:text-[20px] font-bold text-gold-full mb-1">
                      {card.number}
                    </p>
                    <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-body">
                      {card.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* ════════════════════════════════════════════════════════
                4. WHAT THIS COSTS — compact, centered
                ════════════════════════════════════════════════════════ */}
            <div
              ref={priceRef}
              className="px-6 py-8 md:px-8 md:py-10 text-center overflow-hidden"
              style={{
                borderRadius: "8px",
                background: "#111111",
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
              <p className="max-w-md mx-auto text-[14px] md:text-[16px] leading-relaxed text-ink-body mb-6">
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
            {/* Resolution sub-cards — feature pair, always 2-up */}
            <div
              className="grid grid-cols-2 gap-2"
              style={{
                opacity: prefersReducedMotion || priceVisible ? 1 : 0,
                transform: prefersReducedMotion || priceVisible ? "translateY(0)" : "translateY(12px)",
                transition: prefersReducedMotion ? "none" : "opacity 500ms ease-out, transform 500ms ease-out",
                transitionDelay: prefersReducedMotion ? "0ms" : "200ms",
              }}
            >
              {[
                { number: "EVERY TIER", label: "Off-tops through net profits" },
                { number: "BREAKEVEN", label: "Know your number" },
              ].map((card) => (
                <div
                  key={card.label}
                  className="px-3.5 py-3.5 text-center"
                  style={{
                    borderRadius: "8px",
                    background: "#111111",
                    border: "1px solid rgba(212,175,55,0.15)",
                  }}
                >
                  <p className="font-mono text-[18px] md:text-[20px] font-bold text-gold-full mb-1">
                    {card.number}
                  </p>
                  <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-body">
                    {card.label}
                  </p>
                </div>
              ))}
            </div>
            {/* ════════════════════════════════════════════════════════
                5. CLOSER CTA — emotional trigger + final conversion
                ════════════════════════════════════════════════════════ */}
            <div
              ref={closerRef}
              data-section="closer"
              className="px-6 py-10 md:px-8 md:py-14 text-center overflow-hidden"
              style={{
                borderRadius: "8px",
                border: "1px solid rgba(212,175,55,0.25)",
                background: "radial-gradient(ellipse at center 70%, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 60%, transparent 100%)",
                boxShadow: "0 0 60px rgba(212,175,55,0.03), inset 0 1px 0 rgba(255,255,255,0.06)",
                opacity: prefersReducedMotion || closerVisible ? 1 : 0,
                transform: prefersReducedMotion || closerVisible ? "translateY(0)" : "translateY(20px)",
                transition: prefersReducedMotion ? "none" : "opacity 700ms ease-out, transform 700ms ease-out",
              }}
            >
              <h2 className="font-bebas text-[32px] md:text-[44px] leading-[1.05] tracking-[0.06em] text-white mb-6">
                YOUR INVESTORS WILL{"\u00A0"}ASK HOW THE MONEY FLOWS BACK.
              </h2>
              <div className="w-full max-w-[280px] mx-auto">
                <button
                  onClick={handleStartClick}
                  className={`w-full h-14 rounded-sm btn-cta-primary font-bold${closerVisible ? " animate-cta-glow-pulse" : ""}`}
                >
                  BUILD YOUR WATERFALL
                </button>
              </div>
            </div>
            {/* ════════════════════════════════════════════════════════
                6. FOOTER — disclaimer
                ════════════════════════════════════════════════════════ */}
            <footer className="pt-4 pb-6 px-4 text-center">
              <p className="text-ink-body text-[12px] tracking-[0.02em] leading-relaxed mx-auto max-w-sm">
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
