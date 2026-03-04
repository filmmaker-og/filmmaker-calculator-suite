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
            {/* ═══════════════════════════════════════════
                2. WATERFALL
                ═══════════════════════════════════════════ */}
            <div
              ref={waterfallRef}
              className="px-5 py-7 md:px-6 md:py-9 overflow-hidden"
              style={{ ...contentCard(), ...reveal(waterfallVisible) }}
            >
              <WaterfallCascade />
            </div>
            {/* ═══════════════════════════════════════════
                3. THE REALITY
                2x2 numbered cells.
                Anatomy per cell (ref Image 2 + Image 3):
                  — Circle number badge: centered on top border
                  — Large gold stat
                  — Bold white label ALL CAPS
                  — Cold one-liner in ink-secondary
                Grid has pt-6 to give badge room to bleed out.
                ═══════════════════════════════════════════ */}
            <div
              ref={realityRef}
              className="px-6 py-8 md:px-8 md:py-10 overflow-hidden"
              style={{ ...contentCard(), ...reveal(realityVisible) }}
            >
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-gold-full mb-3">
                The Reality
              </p>
              <p className="text-[16px] leading-relaxed text-ink-body mb-8">
                Most producers walk into distribution meetings without knowing these numbers.
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
                4. WITH / WITHOUT
                Two full-width stacked cards.
                WITHOUT offset 16px right — visual ladder stagger.
                ✓ gold badge / ✗ red badge per item.
                Each item: bold white title + body copy.
                ═══════════════════════════════════════════ */}
            <div ref={withRef} className="flex flex-col gap-3">
              {/* WITH YOUR WATERFALL */}
              <div
                className="px-6 py-7 overflow-hidden"
                style={{
                  ...contentCard({
                    border: "1px solid rgba(212,175,55,0.20)",
                  }),
                  ...reveal(withVisible),
                }}
              >
                <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-gold-full mb-5">
                  With Your Waterfall
                </p>
                <div className="flex flex-col gap-5">
                  {withItems.map((item, i) => (
                    <div
                      key={item.title}
                      className="flex gap-4 items-start"
                      style={reveal(withVisible, 100 + i * 100)}
                    >
                      {/* Gold check badge */}
                      <div
                        className="flex-shrink-0 flex items-center justify-center text-black font-bold text-[14px]"
                        style={{
                          width:        "32px",
                          height:       "32px",
                          borderRadius: "6px",
                          background:   "#D4AF37",
                          marginTop:    "2px",
                        }}
                      >
                        ✓
                      </div>
                      <div>
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
              {/* WITHOUT A WATERFALL — offset 16px right for stagger */}
              <div
                className="px-6 py-7 overflow-hidden"
                style={{
                  marginLeft:   "16px",
                  borderRadius: "8px",
                  background:   "#000000",
                  border:       "1px solid rgba(220,60,60,0.25)",
                  boxShadow:    "inset 0 1px 0 rgba(255,255,255,0.04)",
                  ...reveal(withVisible, 200),
                }}
              >
                <p className="font-mono text-[12px] uppercase tracking-[0.16em] mb-5"
                  style={{ color: "rgba(220,80,80,0.9)" }}>
                  Without A Waterfall
                </p>
                <div className="flex flex-col gap-5">
                  {withoutItems.map((item, i) => (
                    <div
                      key={item.title}
                      className="flex gap-4 items-start"
                      style={reveal(withVisible, 300 + i * 100)}
                    >
                      {/* Red X badge */}
                      <div
                        className="flex-shrink-0 flex items-center justify-center font-bold text-[14px]"
                        style={{
                          width:        "32px",
                          height:       "32px",
                          borderRadius: "6px",
                          background:   "rgba(180,40,40,0.25)",
                          border:       "1px solid rgba(220,60,60,0.40)",
                          color:        "rgba(220,80,80,1)",
                          marginTop:    "2px",
                        }}
                      >
                        ✕
                      </div>
                      <div>
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
                5. ARSENAL
                What you get. Institutional tools section.
                Two-part card: headline block + inner sub-block
                with left gold bar accent (ref: Image 3 from session).
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
              {/* Top block — WHAT YOU GET */}
              <div
                className="px-6 py-8 md:px-8 md:py-10 text-center"
                style={{ borderBottom: "1px solid rgba(212,175,55,0.15)" }}
              >
                <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-gold-full mb-3"
                  style={{ borderBottom: "2px solid rgba(212,175,55,0.45)", display: "inline-block", paddingBottom: "6px" }}
                >
                  What You Get
                </p>
                <h3 className="font-bebas text-[clamp(2.4rem,7vw,3.6rem)] leading-[0.96] tracking-[0.06em] text-gold-full mt-4 mb-4">
                  THE ARSENAL
                </h3>
                <p className="max-w-sm mx-auto text-[16px] leading-relaxed text-ink-body">
                  Institutional-grade deal tools. Built for independent producers
                  who can't afford to learn the hard way.
                </p>
              </div>
              {/* Bottom block — INSIDE THE ARSENAL */}
              <div
                className="relative px-6 py-8 md:px-8 md:py-10"
                style={{
                  borderLeft: "3px solid rgba(212,175,55,0.70)",
                }}
              >
                <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-gold-full mb-4">
                  Inside The Arsenal
                </p>
                <h4 className="font-bebas text-[clamp(1.8rem,5vw,2.4rem)] leading-[1.0] tracking-[0.06em] mb-4">
                  <span className="text-gold-full">NO</span>
                  <span className="text-white"> GUESSWORK.</span>
                </h4>
                <p className="text-[16px] leading-relaxed text-ink-body">
                  Whether you're modeling your first deal or walking into a meeting
                  with real capital, there's a tier built for you.
                </p>
              </div>
            </div>
            {/* ═══════════════════════════════════════════
                6. QUOTE CALLOUT
                Gold background #D4AF37, black text.
                Miles' line verbatim — no edits.
                Only gold-bg element on the page.
                No eyebrow, no headline — just the quote.
                Scroll reveal on visibility.
                ═══════════════════════════════════════════ */}
            <div
              ref={quoteRef}
              className="px-7 py-8 md:px-8 md:py-10 overflow-hidden"
              style={{
                borderRadius: "8px",
                background:   "#D4AF37",
                ...reveal(quoteVisible),
              }}
            >
              <div className="flex gap-4 items-start">
                {/* Quote mark accent */}
                <span
                  className="flex-shrink-0 font-bebas text-[48px] text-black leading-none"
                  style={{ marginTop: "-8px", opacity: 0.25 }}
                >
                  "
                </span>
                <p className="text-[16px] md:text-[18px] font-semibold text-black leading-relaxed">
                  The creative vision is only half the battle. The other half is proving
                  you can execute that vision responsibly and deliver a return.
                </p>
              </div>
            </div>
            {/* ═══════════════════════════════════════════
                7. CLOSER
                Attorney line is the final price anchor —
                lands right before the CTA where it matters.
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
              <p className="max-w-xs mx-auto text-[16px] leading-relaxed text-ink-body mb-3">
                Run the math before the meeting.
              </p>
              <p className="max-w-xs mx-auto text-[14px] leading-relaxed text-ink-secondary mb-8">
                An entertainment attorney bills $850/hr for this. Yours is free.
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
