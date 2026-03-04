import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import { useInView } from "@/hooks/useInView";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import WaterfallCascade from "@/components/WaterfallCascade";
/*
  PAGE STACK (7 sections):
    1. HERO              — warm arrival, primary CTA
    2. WATERFALL         — interactive proof, intro text inside component
    3. THE REALITY       — 2x2 stat grid, one sentence per cell
    4. PRODUCERS         — 3 numbered sub-blocks, diagnosis section
    5. WHAT IT MODELS    — 2x3 grid showing calculator scope, solution proof
    6. WHAT THIS COSTS   — FREE reveal, attorney anchor, standalone
    7. CLOSER            — pure emotional close, single CTA
  BACKGROUND RULES:
    Warm cards (Hero, Closer): radial-gradient gold-ghost + gold-strong border (0.25)
    Content sections (2–6):    #000000 + gold border 0.12
    Internal sub-elements:     #111111 + gold border 0.15
  #111 NEVER appears at section level — only inside sections.
  Every section is identifiable by gold border on pure black, not by fill color.
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
  /* ── Scroll-reveal refs ── */
  const { ref: waterfallRef, inView: waterfallVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: realityRef,   inView: realityVisible   } = useInView<HTMLDivElement>({ threshold: 0.1  });
  const { ref: wrongRef,     inView: wrongVisible     } = useInView<HTMLDivElement>({ threshold: 0.1  });
  const { ref: modelsRef,    inView: modelsVisible    } = useInView<HTMLDivElement>({ threshold: 0.1  });
  const { ref: priceRef,     inView: priceVisible     } = useInView<HTMLDivElement>({ threshold: 0.2  });
  const { ref: closerRef,    inView: closerVisible    } = useInView<HTMLDivElement>({ threshold: 0.2  });
  /* ── Section data ── */
  const realityQuadrants = [
    {
      stat:  "15–25%",
      label: "Off The Top",
      body:  "Sales agents take their commission before your investors see a single dollar.",
    },
    {
      stat:  "$850/hr",
      label: "Legal Reality",
      body:  "That's what an entertainment attorney bills to walk you through this math.",
    },
    {
      stat:  "30 Sec",
      label: "The Investor Test",
      body:  "How long you have to explain your recoupment stack before a room goes cold.",
    },
    {
      stat:  "$0",
      label: "Equity Position",
      body:  "Equity investors sit last. Every tier above them gets paid first — every time.",
    },
  ];
  const producerMistakes = [
    {
      number:    "01",
      label:     "The Waterfall Assumption",
      statement: "They package the deal before modeling who gets paid.",
      body:      "Most producers promise investor returns based on revenue projections — without mapping the recoupment order. By the time the money moves, the waterfall they agreed to makes those returns mathematically impossible.",
    },
    {
      number:    "02",
      label:     "The Promise Problem",
      statement: "They over-commit because they've never run the math.",
      body:      "A 50% ROI sounds reasonable until you model the sales agent commission, distributor fee, senior debt, and equity recoupment sitting above it. The promise was made before anyone built the waterfall.",
    },
    {
      number:    "03",
      label:     "The Hidden Cost Stack",
      statement: "They don't account for every cost in the stack.",
      body:      "CAM fees, E&O insurance, delivery costs, guild residuals — these come off the top before the waterfall even starts. Miss them in the budget and the shortfall shows up after the money is gone.",
    },
  ];
  const modelsCells = [
    { label: "Off-the-Top Fees",     desc: "CAM, E&O, delivery, guild residuals"      },
    { label: "Sales Agent Take",      desc: "Commission rate, gross vs. adjusted gross" },
    { label: "Senior Debt",           desc: "Principal + interest repayment order"      },
    { label: "Mezzanine & Equity",    desc: "Recoupment position and rate"              },
    { label: "Net Profit Split",      desc: "Producer / investor distribution tiers"    },
    { label: "Breakeven Point",       desc: "Minimum revenue to clear the stack"        },
  ];
  /* ── Shared style helpers ── */
  const contentCard = (extraStyle?: React.CSSProperties): React.CSSProperties => ({
    borderRadius: "8px",
    background:   "#000000",
    border:       "1px solid rgba(212,175,55,0.12)",
    boxShadow:    "inset 0 1px 0 rgba(255,255,255,0.06)",
    ...extraStyle,
  });
  const subCell: React.CSSProperties = {
    borderRadius: "6px",
    background:   "#111111",
    border:       "1px solid rgba(212,175,55,0.15)",
  };
  const scrollReveal = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity:         prefersReducedMotion || visible ? 1 : 0,
    transform:       prefersReducedMotion || visible ? "translateY(0)" : "translateY(20px)",
    transition:      prefersReducedMotion ? "none" : "opacity 700ms ease-out, transform 700ms ease-out",
    transitionDelay: prefersReducedMotion ? "0ms" : `${delay}ms`,
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
            {/* ════════════════════════════════════════════════════════
                1. HERO — warm arrival card
                   Radial gold-ghost bg + gold-strong border.
                   Untouched from previous version.
                ════════════════════════════════════════════════════════ */}
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
              <h1 className="font-bebas text-[clamp(3.2rem,9vw,5.2rem)] leading-[0.96] tracking-[0.06em] text-white mb-4">
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
            {/* ════════════════════════════════════════════════════════
                2. WATERFALL — interactive proof-of-concept
                   No outer card wrapper — component sits on page black.
                   Intro text moved inside WaterfallCascade component.
                   Section wrapper handles scroll reveal only.
                ════════════════════════════════════════════════════════ */}
            <div
              ref={waterfallRef}
              className="overflow-hidden"
              style={scrollReveal(waterfallVisible)}
            >
              <WaterfallCascade />
            </div>
            {/* ════════════════════════════════════════════════════════
                3. THE REALITY — 2x2 stat grid
                   Outer: #000 + gold-subtle border (0.12).
                   Cells: #111 sub-elements, one sentence per cell.
                   Framing sentence above the grid sets context.
                ════════════════════════════════════════════════════════ */}
            <div
              ref={realityRef}
              className="px-6 py-8 md:px-8 md:py-10 overflow-hidden"
              style={{ ...contentCard(), ...scrollReveal(realityVisible) }}
            >
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-gold-full mb-3">
                The Reality
              </p>
              <p className="text-[16px] leading-relaxed text-ink-body mb-7" style={{ maxWidth: "520px" }}>
                Most producers walk into distribution meetings without knowing these numbers.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {realityQuadrants.map((q, i) => (
                  <div
                    key={q.label}
                    className="px-4 py-5"
                    style={{
                      ...subCell,
                      ...scrollReveal(realityVisible, i * 80),
                    }}
                  >
                    <p className="font-mono text-[22px] md:text-[26px] font-bold text-gold-full mb-1 tabular-nums leading-none">
                      {q.stat}
                    </p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-secondary mb-3">
                      {q.label}
                    </p>
                    <p className="text-[14px] leading-relaxed text-ink-body">
                      {q.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* ════════════════════════════════════════════════════════
                4. WHAT PRODUCERS GET WRONG — diagnosis section
                   Outer: #000 + gold-subtle border (0.12).
                   3 numbered sub-blocks, text-only (no sub-cards).
                   Dividers: rgba white 0.08 between blocks.
                   Structure per block: number + gold label → bold statement → body.
                ════════════════════════════════════════════════════════ */}
            <div
              ref={wrongRef}
              className="px-6 py-8 md:px-8 md:py-10 overflow-hidden"
              style={{ ...contentCard(), ...scrollReveal(wrongVisible) }}
            >
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-gold-full mb-3">
                What Producers Get Wrong
              </p>
              <h2 className="font-bebas text-[26px] md:text-[32px] leading-[1.05] tracking-[0.06em] text-white mb-7">
                THE MATH MOST PRODUCERS NEVER RUN
              </h2>
              {producerMistakes.map((m, i) => (
                <div key={m.number}>
                  {i > 0 && (
                    <div
                      className="my-6"
                      style={{ height: "1px", background: "rgba(255,255,255,0.08)" }}
                    />
                  )}
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-mono text-[12px] text-ink-secondary tracking-[0.14em]">
                      {m.number}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-full">
                      {m.label}
                    </span>
                  </div>
                  <p className="text-[16px] md:text-[17px] font-semibold text-white leading-snug mb-2">
                    {m.statement}
                  </p>
                  <p className="text-[14px] md:text-[16px] leading-relaxed text-ink-body">
                    {m.body}
                  </p>
                </div>
              ))}
            </div>
            {/* ════════════════════════════════════════════════════════
                5. WHAT IT MODELS — solution proof
                   Bridges the problem (sections 3–4) to the CTA (sections 6–7).
                   Shows the calculator's scope before asking them to use it.
                   Outer: #000 + gold-subtle border (0.12).
                   2x3 grid of sub-cells: label + one-line description.
                   Tight, scannable, institutional — not a feature list.
                ════════════════════════════════════════════════════════ */}
            <div
              ref={modelsRef}
              className="px-6 py-8 md:px-8 md:py-10 overflow-hidden"
              style={{ ...contentCard(), ...scrollReveal(modelsVisible) }}
            >
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-gold-full mb-3">
                What It Models
              </p>
              <h2 className="font-bebas text-[26px] md:text-[32px] leading-[1.05] tracking-[0.06em] text-white mb-2">
                EVERY TIER. EVERY FEE. EVERY SPLIT.
              </h2>
              <p className="text-[16px] leading-relaxed text-ink-body mb-7" style={{ maxWidth: "520px" }}>
                The calculator maps the full recoupment stack — from gross revenue to net profit position.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {modelsCells.map((cell, i) => (
                  <div
                    key={cell.label}
                    className="px-4 py-4"
                    style={{
                      ...subCell,
                      ...scrollReveal(modelsVisible, i * 60),
                    }}
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-full mb-2">
                      {cell.label}
                    </p>
                    <p className="text-[14px] leading-relaxed text-ink-body">
                      {cell.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* ════════════════════════════════════════════════════════
                6. WHAT THIS COSTS — FREE reveal, standalone
                   #000 background so FREE lands as a reveal on true black.
                   Attorney anchor creates reciprocity before the ask.
                   No sub-cards — they were feature bullets in disguise.
                   No CTA here — that belongs only in the closer.
                ════════════════════════════════════════════════════════ */}
            <div
              ref={priceRef}
              className="px-6 py-10 md:px-8 md:py-12 text-center overflow-hidden"
              style={{ ...contentCard(), ...scrollReveal(priceVisible) }}
            >
              <p className="font-mono text-[14px] uppercase tracking-[0.20em] text-gold-full mb-4">
                What This Costs
              </p>
              <p className="font-bebas text-[64px] md:text-[80px] leading-[1.0] tracking-[0.06em] text-white mb-4">
                FREE
              </p>
              <p className="max-w-md mx-auto text-[16px] leading-relaxed text-ink-body">
                An entertainment attorney bills $500–$850/hr to walk you through
                waterfall mechanics. This gives you the financial x-ray for free.
              </p>
            </div>
            {/* ════════════════════════════════════════════════════════
                7. CLOSER — pure emotional close
                   Warmest card: radial gold-ghost bg + gold-strong border (0.25).
                   One headline. One support sentence. One CTA.
                   No price info — that's handled above.
                   CTA copy: "RUN YOUR DEAL FREE" — matches earned emotional context.
                ════════════════════════════════════════════════════════ */}
            <div
              ref={closerRef}
              data-section="closer"
              className="px-6 py-10 md:px-8 md:py-14 text-center overflow-hidden"
              style={{
                borderRadius: "8px",
                border:       "1px solid rgba(212,175,55,0.25)",
                background:   "radial-gradient(ellipse at center 70%, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 60%, transparent 100%)",
                boxShadow:    "0 0 60px rgba(212,175,55,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
                ...scrollReveal(closerVisible),
              }}
            >
              <h2 className="font-bebas text-[32px] md:text-[44px] leading-[1.05] tracking-[0.06em] text-white mb-4">
                YOUR INVESTORS WILL{"\u00A0"}ASK HOW THE MONEY FLOWS BACK.
              </h2>
              <p className="max-w-sm mx-auto text-[16px] leading-relaxed text-ink-body mb-7">
                Most producers walk in with projections and no waterfall.
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
            {/* ════════════════════════════════════════════════════════
                FOOTER — disclaimer
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
