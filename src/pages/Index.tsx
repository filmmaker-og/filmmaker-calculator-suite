import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import { useInView } from "@/hooks/useInView";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import WaterfallCascade from "@/components/WaterfallCascade";
/*
  PAGE STACK — 5 sections, one job each:
    1. HERO        — warm arrival, primary CTA
    2. WATERFALL   — interactive proof, outer card restored for mobile
    3. THE REALITY — 2x2 grid, stat + label only, no body copy in cells
    4. FREE        — price reveal, attorney anchor, no CTA (pure #000)
    5. CLOSER      — emotional close, single CTA (warmest card)
  WHAT WAS CUT (deliberately):
    - What Producers Get Wrong — longest section, furthest from conversion
    - What It Models — feature list, waterfall demo already proves scope
  BACKGROUND RULES:
    Warm (Hero, Closer):    radial gold-ghost + gold-strong border (0.25)
    Content (Waterfall–FREE): #000 + gold border (0.12)
    Sub-elements (cells):   #111 + gold border (0.15)
*/
const Index = () => {
  const navigate  = useNavigate();
  const haptics   = useHaptics();
  const [showLeadCapture,    setShowLeadCapture   ] = useState(false);
  const [pendingDestination, setPendingDestination] = useState<string | null>(null);
  const [hasSession,         setHasSession        ] = useState(false);
  const [ctaGlow,            setCtaGlow           ] = useState(false);
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
    const timeout = setTimeout(() => setCtaGlow(true), 2000);
    return () => clearTimeout(timeout);
  }, [prefersReducedMotion]);
  const { ref: waterfallRef, inView: waterfallVisible } = useInView<HTMLDivElement>({ threshold: 0.1  });
  const { ref: realityRef,   inView: realityVisible   } = useInView<HTMLDivElement>({ threshold: 0.1  });
  const { ref: priceRef,     inView: priceVisible     } = useInView<HTMLDivElement>({ threshold: 0.2  });
  const { ref: closerRef,    inView: closerVisible    } = useInView<HTMLDivElement>({ threshold: 0.2  });
  /* Reality grid — stat + label only, no body copy in cells.
     The numbers speak. Framing sentence lives above the grid. */
  const realityQuadrants = [
    { stat: "15–25%", label: "Off The Top"       },
    { stat: "$850/hr", label: "Legal Reality"    },
    { stat: "30 Sec",  label: "Investor Test"    },
    { stat: "$0",      label: "Equity Position"  },
  ];
  /* Shared style helpers — eliminates repeated inline style blocks */
  const contentCard = (extra?: React.CSSProperties): React.CSSProperties => ({
    borderRadius: "8px",
    background:   "#000000",
    border:       "1px solid rgba(212,175,55,0.12)",
    boxShadow:    "inset 0 1px 0 rgba(255,255,255,0.06)",
    ...extra,
  });
  const reveal = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity:         prefersReducedMotion || visible ? 1 : 0,
    transform:       prefersReducedMotion || visible ? "translateY(0)" : "translateY(20px)",
    transition:      prefersReducedMotion ? "none" : "opacity 700ms ease-out, transform 700ms ease-out",
    transitionDelay: prefersReducedMotion || delay === 0 ? "0ms" : `${delay}ms`,
  });
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
          <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl px-5 md:px-8 flex flex-col gap-8 lg:gap-20 py-6">
            {/* ═══════════════════════════════════════
                1. HERO
                Warm arrival. Radial gold-ghost bg.
                Primary CTA with 2s glow delay.
                ═══════════════════════════════════════ */}
            <div
              className="px-6 py-10 md:px-8 md:py-12 lg:py-14 text-center overflow-hidden"
              style={{
                borderRadius: "8px",
                background:   "radial-gradient(ellipse at center top, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 40%, transparent 100%)",
                border:       "1px solid rgba(212,175,55,0.25)",
                boxShadow:    "inset 0 1px 0 rgba(255,255,255,0.06), 0 0 40px rgba(212,175,55,0.03)",
              }}
            >
              <p className="font-mono text-[14px] uppercase tracking-[0.20em] mb-6 text-gold-full">
                Film Finance Simulator
              </p>
              <h1 className="font-bebas text-[clamp(3.2rem,9vw,5.2rem)] leading-[0.96] tracking-[0.06em] text-white mb-6">
                SEE WHERE EVERY DOLLAR GOES
              </h1>
              <div className="w-full max-w-[280px] lg:max-w-[320px] mx-auto">
                <button
                  onClick={handleStartClick}
                  className={`w-full h-14 rounded-sm btn-cta-primary font-bold${ctaGlow ? " animate-cta-glow-pulse" : ""}`}
                >
                  BUILD YOUR WATERFALL
                </button>
              </div>
            </div>
            {/* ═══════════════════════════════════════
                2. WATERFALL
                Outer card restored (#000 + gold border).
                Intro text lives inside WaterfallCascade.
                Card gives the component a visual container
                on mobile — prevents orphaned floating text.
                ═══════════════════════════════════════ */}
            <div
              ref={waterfallRef}
              className="px-5 py-7 md:px-6 md:py-9 overflow-hidden"
              style={{ ...contentCard(), ...reveal(waterfallVisible) }}
            >
              <WaterfallCascade />
            </div>
            {/* ═══════════════════════════════════════
                3. THE REALITY
                2x2 grid — stat + label only.
                No body copy inside cells: the number
                is the statement. One framing sentence
                above the grid sets context.
                Cells: #111 sub-elements, no text wrap issues.
                ═══════════════════════════════════════ */}
            <div
              ref={realityRef}
              className="px-6 py-8 md:px-8 md:py-10 overflow-hidden"
              style={{ ...contentCard(), ...reveal(realityVisible) }}
            >
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-gold-full mb-3">
                The Reality
              </p>
              <p className="text-[16px] leading-relaxed text-ink-body mb-7">
                Most producers walk into distribution meetings without knowing these numbers.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {realityQuadrants.map((q, i) => (
                  <div
                    key={q.label}
                    className="px-4 py-5"
                    style={{
                      borderRadius:    "6px",
                      background:      "#111111",
                      border:          "1px solid rgba(212,175,55,0.15)",
                      ...reveal(realityVisible, i * 80),
                    }}
                  >
                    <p className="font-mono text-[24px] md:text-[28px] font-bold text-gold-full tabular-nums leading-none mb-2">
                      {q.stat}
                    </p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-secondary">
                      {q.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* ═══════════════════════════════════════
                4. FREE
                Pure #000 so FREE lands as a reveal.
                Attorney anchor creates reciprocity.
                No CTA — that belongs only in the closer.
                No warm gradient — this is neutral by design,
                which makes the closer feel warmer by contrast.
                ═══════════════════════════════════════ */}
            <div
              ref={priceRef}
              className="px-6 py-10 md:px-8 md:py-12 text-center overflow-hidden"
              style={{ ...contentCard(), ...reveal(priceVisible) }}
            >
              <p className="font-mono text-[14px] uppercase tracking-[0.20em] text-gold-full mb-4">
                What This Costs
              </p>
              <p className="font-bebas text-[72px] md:text-[88px] leading-[1.0] tracking-[0.06em] text-white mb-5">
                FREE
              </p>
              <p className="max-w-sm mx-auto text-[16px] leading-relaxed text-ink-body">
                An entertainment attorney bills $500–$850/hr to walk you through
                waterfall mechanics. This gives you the financial x-ray for free.
              </p>
            </div>
            {/* ═══════════════════════════════════════
                5. CLOSER
                Warmest card. One headline. One sentence.
                One CTA. Nothing else.
                CTA copy: "RUN YOUR DEAL FREE" — earned
                by the scroll, different from hero CTA.
                Glow triggers on scroll visibility.
                ═══════════════════════════════════════ */}
            <div
              ref={closerRef}
              data-section="closer"
              className="px-6 py-12 md:px-8 md:py-16 text-center overflow-hidden"
              style={{
                borderRadius: "8px",
                border:       "1px solid rgba(212,175,55,0.25)",
                background:   "radial-gradient(ellipse at center 70%, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 60%, transparent 100%)",
                boxShadow:    "0 0 60px rgba(212,175,55,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
                ...reveal(closerVisible),
              }}
            >
              <h2 className="font-bebas text-[32px] md:text-[44px] leading-[1.05] tracking-[0.06em] text-white mb-5">
                YOUR INVESTORS WILL{"\u00A0"}ASK HOW THE MONEY FLOWS BACK.
              </h2>
              <p className="max-w-xs mx-auto text-[16px] leading-relaxed text-ink-body mb-8">
                Run the math before the meeting.
              </p>
              <div className="w-full max-w-[280px] mx-auto">
                <button
                  onClick={handleStartClick}
                  className={`w-full h-14 rounded-sm btn-cta-primary font-bold${closerVisible ? " animate-cta-glow-pulse" : ""}`}
                >
                  RUN YOUR DEAL FREE
                </button>
              </div>
            </div>
            {/* FOOTER */}
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
