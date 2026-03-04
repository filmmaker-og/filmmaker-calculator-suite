import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import { useInView } from "@/hooks/useInView";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import WaterfallCascade from "@/components/WaterfallCascade";
/*
  PAGE STACK — 8 sections:
    1. HERO         — warm arrival, primary CTA
    2. WATERFALL    — interactive proof
    3. THE REALITY  — 2x2 cost comparison: what knowledge actually costs
    4. WITH/WITHOUT — timeline cards, continuous gold/red line + numbered circles
    5. ARSENAL      — what you get, institutional tools section
    6. QUOTE        — Miles' line, gold border on black
    7. CLOSER       — attorney line + single CTA
    8. FOOTER
  FREE SECTION: deliberately removed.
    The waterfall demo + Reality cells already prove value.
    Attorney line moves into Closer as final pre-CTA anchor.
    Standalone FREE section oversells — signals insecurity.
  BACKGROUND RULES:
    All sections: #000 + gold border (0.20–0.30)
    No gold fills anywhere — causes brownish cast on phones
    Gold = border strokes + text only
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
  /* ── Scroll refs ── */
  const { ref: waterfallRef, inView: waterfallVisible } = useInView<HTMLDivElement>({ threshold: 0.1  });
  const { ref: whyRef,       inView: whyVisible       } = useInView<HTMLDivElement>({ threshold: 0.1  });
  const { ref: realityRef,   inView: realityVisible   } = useInView<HTMLDivElement>({ threshold: 0.1  });
  const { ref: withRef,      inView: withVisible      } = useInView<HTMLDivElement>({ threshold: 0.1  });
  const { ref: arsenalRef,   inView: arsenalVisible   } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: quoteRef,     inView: quoteVisible     } = useInView<HTMLDivElement>({ threshold: 0.3  });
  const { ref: closerRef,    inView: closerVisible    } = useInView<HTMLDivElement>({ threshold: 0.2  });
  /* ── Data ── */
  // Reality cells: stat / bold white label / cold one-liner
  const realityCells = [
    { stat: "$800/hr",   label: "Entertainment Attorney", cold: "If they'll take the meeting."           },
    { stat: "$5K+",      label: "Producing Consultant",   cold: "If you can afford one."                 },
    { stat: "$200K",     label: "Film School",            cold: "Four years you don't have."             },
    { stat: "Your Time", label: "Trial & Error",          cold: "Your investors won't get a second one." },
  ];
  // With / Without items
  const withItems = [
    {
      title: "Returns Mapped",
      body:  "Every investor sees exactly what they get back — and when.",
    },
    {
      title: "Nothing Hidden",
      body:  "Fees, splits, and repayment order visible before you commit.",
    },
    {
      title: "Your Margins, Confirmed",
      body:  "Run the numbers on your backend points before you shoot a frame.",
    },
  ];
  const withoutItems = [
    {
      title: "The Question You Can't Answer",
      body:  "'How do I get my money back?' — and you're improvising.",
    },
    {
      title: "Surprises After Signatures",
      body:  "Fees and splits you didn't model surface after the deal closes.",
    },
    {
      title: "Dead Backend Points",
      body:  "Sales agent commission you forgot makes them worthless.",
    },
  ];
  /* ── Shared style helpers ── */
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
            {/* ═══════════════════════════════════════════
                1. HERO
                ═══════════════════════════════════════════ */}
            <div
              className="px-6 py-10 md:px-8 md:py-12 lg:py-14 text-center overflow-hidden"
              style={{
                borderRadius: "8px",
                background:   "radial-gradient(ellipse at center top, rgba(212,175,55,0.14) 0%, rgba(212,175,55,0.07) 45%, transparent 100%)",
                border:       "1px solid rgba(212,175,55,0.40)",
                boxShadow:    "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 60px rgba(212,175,55,0.06)",
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
            {/* ═══════════════════════════════════════════
                2. WATERFALL
                ═══════════════════════════════════════════ */}
            <div
              ref={waterfallRef}
              className="px-5 py-7 md:px-6 md:py-9 overflow-hidden"
              style={{
                ...contentCard({
                  background: "radial-gradient(ellipse at top center, rgba(212,175,55,0.06) 0%, transparent 55%)",
                  border:     "1px solid rgba(212,175,55,0.22)",
                }),
                ...reveal(waterfallVisible),
              }}
            >
              <WaterfallCascade />
            </div>
            {/* ═══════════════════════════════════════════
                3. WHY THIS MATTERS
                4-point compact section. Answers "why do I need
                to understand the waterfall?" before the reality
                cells prove the cost of not knowing.
                ═══════════════════════════════════════════ */}
            {(() => {
              const whyPoints = [
                {
                  num:   "01",
                  title: "INVESTORS WILL ASK",
                  body:  "\"How do I get my money back?\" is the first real question in every serious capital conversation. You need an answer before that meeting.",
                },
                {
                  num:   "02",
                  title: "FEES COME OFF THE TOP",
                  body:  "Sales agent commission, CAM fees, and distribution expenses hit before investor recoupment. Most first-time producers don't model these.",
                },
                {
                  num:   "03",
                  title: "YOU CAN'T NEGOTIATE BLIND",
                  body:  "If you don't know your recoupment order, you can't evaluate a distribution offer. You're signing something you don't understand.",
                },
                {
                  num:   "04",
                  title: "BACKEND POINTS NEED CONTEXT",
                  body:  "A 30% backend in a bad waterfall returns nothing. Know the math before you commit to the deal.",
                },
              ];
              return (
                <div
                  ref={whyRef}
                  className="px-6 py-8 md:px-8 md:py-10 overflow-hidden"
                  style={{ ...contentCard(), ...reveal(whyVisible) }}
                >
                  <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-gold-full mb-2">
                    Why This Matters
                  </p>
                  <h3 className="font-bebas text-[clamp(1.8rem,5vw,2.6rem)] leading-[0.96] tracking-[0.06em] text-white mb-7">
                    FOUR REASONS TO KNOW YOUR WATERFALL
                  </h3>
                  <div className="flex flex-col gap-3">
                    {whyPoints.map((pt, i) => (
                      <div
                        key={pt.num}
                        className="flex gap-4 items-start px-4 py-5"
                        style={{
                          ...reveal(whyVisible, 80 + i * 90),
                          borderRadius: "6px",
                          background:   "#0d0d0d",
                          border:       "1px solid rgba(212,175,55,0.18)",
                        }}
                      >
                        {/* Number accent */}
                        <p
                          className="font-mono font-bold leading-none flex-shrink-0"
                          style={{
                            fontSize:    "clamp(1.4rem,4vw,1.8rem)",
                            color:         "rgba(212,175,55,0.60)",
                            marginTop:     "2px",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {pt.num}
                        </p>
                        <div>
                          <p className="font-mono text-[12px] font-bold text-white uppercase tracking-[0.10em] mb-1.5">
                            {pt.title}
                          </p>
                          <p className="text-[14px] leading-relaxed text-ink-body">
                            {pt.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            {/* ═══════════════════════════════════════════
                4. THE REALITY
                2x2 numbered cells.
                Anatomy per cell:
                  — Circle number badge: centered on top border
                  — Large gold stat
                  — Bold white label ALL CAPS
                  — Cold one-liner in ink-secondary
                ═══════════════════════════════════════════ */}
            <div
              ref={realityRef}
              className="px-6 py-8 md:px-8 md:py-10 overflow-hidden"
              style={{ ...contentCard(), ...reveal(realityVisible) }}
            >
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-gold-full mb-2">
                The Cost
              </p>
              <h3 className="font-bebas text-[clamp(2rem,6vw,3rem)] leading-[0.96] tracking-[0.06em] text-white mb-3">
                THE REALITY
              </h3>
              <p className="text-[15px] leading-relaxed text-ink-body mb-8">
                The waterfall either costs you now — or costs you everything later.
              </p>
              {/* pt-5 gives the absolute-positioned number badge room to bleed above each cell */}
              <div className="grid grid-cols-2 gap-4 pt-5">
                {realityCells.map((cell, i) => (
                  <div
                    key={cell.label}
                    className="relative px-4 pt-8 pb-5"
                    style={{
                      borderRadius: "6px",
                      background:   "#111111",
                      border:       "1px solid rgba(212,175,55,0.15)",
                      ...reveal(realityVisible, i * 90),
                    }}
                  >
                    {/* Circle number badge — sits on top border, centered */}
                    <div
                      className="absolute left-1/2 font-mono text-[11px] font-bold text-black flex items-center justify-center"
                      style={{
                        top:             "-14px",
                        transform:       "translateX(-50%)",
                        width:           "28px",
                        height:          "28px",
                        borderRadius:    "50%",
                        background:      "#D4AF37",
                        border:          "2px solid #000",
                        lineHeight:      "1",
                      }}
                    >
                      {i + 1}
                    </div>
                    {/* Stat — gold, large, the number */}
                    <p className="font-mono text-[22px] md:text-[26px] font-bold text-gold-full tabular-nums leading-none mb-2">
                      {cell.stat}
                    </p>
                    {/* Label — bold white, all caps */}
                    <p className="text-[11px] font-bold text-white uppercase tracking-[0.08em] mb-3 leading-snug">
                      {cell.label}
                    </p>
                    {/* Cold one-liner — small, muted, gut-punch */}
                    <p className="text-[14px] leading-relaxed text-ink-secondary italic">
                      {cell.cold}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* ═══════════════════════════════════════════
                5. WITH / WITHOUT
                Two full-width stacked cards, same alignment.
                WITHOUT no longer offset — alignment parity enforced.
                Label parity: "With Your Waterfall" / "Without Your Waterfall".
                Vertical gold/red line connects badges down the left side.
                ═══════════════════════════════════════════ */}
            <div ref={withRef} className="flex flex-col gap-3">
              {/* WITH YOUR WATERFALL */}
              <div
                className="px-6 py-7 overflow-hidden"
                style={{
                  ...contentCard({ border: "1px solid rgba(212,175,55,0.20)" }),
                  ...reveal(withVisible),
                }}
              >
                <p className="font-bebas text-[clamp(1.4rem,5vw,2rem)] leading-none tracking-[0.06em] text-gold-full mb-5">
                  With Your Waterfall
                </p>
                <div className="flex flex-col gap-0">
                  {withItems.map((item, i) => (
                    <div
                      key={item.title}
                      className="flex gap-4 items-start"
                      style={reveal(withVisible, 100 + i * 100)}
                    >
                      {/* Badge + connecting line */}
                      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 32 }}>
                        <div
                          className="flex items-center justify-center text-black font-bold text-[14px] flex-shrink-0"
                          style={{
                            width:        "32px",
                            height:       "32px",
                            borderRadius: "6px",
                            background:   "#D4AF37",
                          }}
                        >
                          ✓
                        </div>
                        {i < withItems.length - 1 && (
                          <div
                            style={{
                              width:      "2px",
                              flex:       1,
                              minHeight:  "28px",
                              background: "rgba(212,175,55,0.35)",
                            }}
                          />
                        )}
                      </div>
                      <div style={{ paddingBottom: i < withItems.length - 1 ? "20px" : "0" }}>
                        <p className="text-[16px] font-semibold text-white leading-snug mb-1">
                          {item.title}
                        </p>
                        <p className="text-[14px] leading-relaxed text-ink-body">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* WITHOUT YOUR WATERFALL — same alignment, red border treatment */}
              <div
                className="px-6 py-7 overflow-hidden"
                style={{
                  borderRadius: "8px",
                  background:   "#000000",
                  border:       "1px solid rgba(220,60,60,0.25)",
                  boxShadow:    "inset 0 1px 0 rgba(255,255,255,0.04)",
                  ...reveal(withVisible, 200),
                }}
              >
                <p
                  className="font-bebas text-[clamp(1.4rem,5vw,2rem)] leading-none tracking-[0.06em] mb-5"
                  style={{ color: "rgba(220,80,80,0.9)" }}
                >
                  Without Your Waterfall
                </p>
                <div className="flex flex-col gap-0">
                  {withoutItems.map((item, i) => (
                    <div
                      key={item.title}
                      className="flex gap-4 items-start"
                      style={reveal(withVisible, 300 + i * 100)}
                    >
                      {/* Badge + connecting line */}
                      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 32 }}>
                        <div
                          className="flex-shrink-0 flex items-center justify-center font-bold text-[14px]"
                          style={{
                            width:        "32px",
                            height:       "32px",
                            borderRadius: "6px",
                            background:   "rgba(180,40,40,0.25)",
                            border:       "1px solid rgba(220,60,60,0.40)",
                            color:        "rgba(220,80,80,1)",
                          }}
                        >
                          ✕
                        </div>
                        {i < withoutItems.length - 1 && (
                          <div
                            style={{
                              width:      "2px",
                              flex:       1,
                              minHeight:  "28px",
                              background: "rgba(220,60,60,0.30)",
                            }}
                          />
                        )}
                      </div>
                      <div style={{ paddingBottom: i < withoutItems.length - 1 ? "20px" : "0" }}>
                        <p className="text-[16px] font-semibold text-white leading-snug mb-1">
                          {item.title}
                        </p>
                        <p className="text-[14px] leading-relaxed text-ink-body">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* ═══════════════════════════════════════════
                6. ARSENAL
                Header block: THE ARSENAL + tagline.
                Two equal sub-boxes below within the same card:
                  Box 1 — FREE: The Waterfall Calculator
                  Box 2 — PREMIUM: Deal Packages
                ═══════════════════════════════════════════ */}
            <div
              ref={arsenalRef}
              className="overflow-hidden"
              style={{
                borderRadius: "8px",
                background:   "#000000",
                border:       "1px solid rgba(212,175,55,0.22)",
                ...reveal(arsenalVisible),
              }}
            >
              {/* Header block */}
              <div
                className="px-6 py-8 md:px-8 md:py-10 text-center"
                style={{ borderBottom: "1px solid rgba(212,175,55,0.15)" }}
              >
                <p
                  className="font-mono text-[12px] uppercase tracking-[0.18em] text-gold-full mb-4"
                  style={{ display: "inline-block", borderBottom: "1px solid rgba(212,175,55,0.40)", paddingBottom: "6px" }}
                >
                  What You Get
                </p>
                <h3 className="font-bebas text-[clamp(2.6rem,8vw,4rem)] leading-[0.92] tracking-[0.06em] text-gold-full mt-4 mb-4">
                  THE ARSENAL
                </h3>
                <p className="max-w-sm mx-auto text-[15px] leading-relaxed text-ink-body">
                  Institutional-grade deal tools. Built for independent producers
                  who can't afford to learn the hard way.
                </p>
              </div>
              {/* Two sub-boxes */}
              <div className="flex flex-col md:grid md:grid-cols-2 gap-3 p-4">
                {/* Box 1 — FREE */}
                <div
                  className="px-5 py-6"
                  style={{
                    borderRadius: "6px",
                    background:   "#0d0d0d",
                    border:       "1px solid rgba(212,175,55,0.18)",
                  }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-full mb-3">
                    Free
                  </p>
                  <p className="font-bebas text-[clamp(1.4rem,4vw,1.8rem)] leading-none tracking-[0.06em] text-white mb-3">
                    THE WATERFALL CALCULATOR
                  </p>
                  <p className="text-[14px] leading-relaxed text-ink-body">
                    Model your recoupment waterfall, run deal scenarios, and understand
                    how the money flows — before you walk into the meeting.
                  </p>
                </div>
                {/* Box 2 — PREMIUM */}
                <div
                  className="px-5 py-6"
                  style={{
                    borderRadius: "6px",
                    background:   "#0d0d0d",
                    border:       "1px solid rgba(212,175,55,0.18)",
                  }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-full mb-3">
                    Premium
                  </p>
                  <p className="font-bebas text-[clamp(1.4rem,4vw,1.8rem)] leading-none tracking-[0.06em] text-white mb-3">
                    DEAL PACKAGES
                  </p>
                  <p className="text-[14px] leading-relaxed text-ink-body">
                    Full SPV structures, cap table models, and distribution
                    templates. Institutional-grade, producer-ready.
                  </p>
                </div>
              </div>
            </div>
            {/* ═══════════════════════════════════════════
                7. QUOTE CALLOUT
                #000 bg + gold border — pure black rule enforced.
                Previous implementation had background: "#D4AF37"
                which violated the pure-black rule and read as
                a coupon/warning label. Fixed: black bg, gold border,
                gold text. Same authority register as rest of page.
                ═══════════════════════════════════════════ */}
            <div
              ref={quoteRef}
              className="px-7 py-8 md:px-8 md:py-10 overflow-hidden"
              style={{
                borderRadius: "8px",
                background:   "#000000",
                border:       "1px solid rgba(212,175,55,0.55)",
                boxShadow:    "inset 0 1px 0 rgba(212,175,55,0.08)",
                ...reveal(quoteVisible),
              }}
            >
              <div className="flex gap-4 items-start">
                <span
                  className="flex-shrink-0 font-bebas text-[52px] text-gold-full leading-none"
                  style={{ marginTop: "-10px", opacity: 0.35 }}
                >
                  "
                </span>
                <p className="text-[16px] md:text-[18px] font-semibold text-white leading-relaxed">
                  The creative vision is only half the battle. The other half is proving
                  you can execute that vision responsibly and deliver a return.
                </p>
              </div>
            </div>
            {/* ═══════════════════════════════════════════
                8. CLOSER
                Attorney line removed — waterfall demo + Reality
                cells already proved value. Keeping it here
                oversells and dilutes the CTA.
                ═══════════════════════════════════════════ */}
            <div
              ref={closerRef}
              data-section="closer"
              className="px-6 py-12 md:px-8 md:py-16 text-center overflow-hidden"
              style={{
                borderRadius: "8px",
                border:       "1px solid rgba(212,175,55,0.30)",
                background:   "#000000",
                ...reveal(closerVisible),
              }}
            >
              <h2 className="font-bebas text-[32px] md:text-[44px] leading-[1.05] tracking-[0.06em] text-white mb-5">
                YOUR INVESTORS WILL{" "}ASK HOW THE MONEY FLOWS BACK.
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
