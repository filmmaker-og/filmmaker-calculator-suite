import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import { useInView } from "@/hooks/useInView";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import WaterfallCascade from "@/components/WaterfallCascade";
/*
  PAGE STACK — 8 sections:
    1. HERO          — warm arrival, primary CTA
    2. WATERFALL     — interactive proof
    3. THE REALITY   — 2x2 numbered cells: stat / bold label / cold one-liner
    4. WITH/WITHOUT  — staggered cards, ✓ gold / ✗ red badges
    5. FREE          — price reveal, attorney anchor
    6. QUOTE         — gold callout box, Miles' line
    7. CLOSER        — emotional close, single CTA
  REALITY CELL ANATOMY (ref: Image 2 + Image 3):
    Circle number badge — centered on top border, half in/half out
    Large gold stat — the number is the statement
    Bold white label — ALL CAPS, what the number represents
    Cold one-liner — ink-secondary, small, gut-punch
  WITH/WITHOUT STAGGER:
    Both cards full-width, stacked vertically.
    WITHOUT card offset 16px right — creates visual ladder on mobile.
    Gold ✓ badge / Red ✗ badge — left-aligned icon before each item.
  QUOTE CALLOUT:
    Gold background #D4AF37, black text.
    Miles' line verbatim. No eyebrow. No headline. Just the quote.
    Single use — maximum impact by being the only gold-bg element.
  BACKGROUND RULES:
    Warm (Hero, Closer): radial gold-ghost + gold-strong border (0.25)
    Content sections:    #000 + gold border (0.12)
    Sub-elements:        #111 + gold border (0.15)
    Quote callout:       #D4AF37 bg + black text (only instance of gold bg)
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
  const { ref: priceRef,     inView: priceVisible     } = useInView<HTMLDivElement>({ threshold: 0.2  });
  const { ref: quoteRef,     inView: quoteVisible     } = useInView<HTMLDivElement>({ threshold: 0.3  });
  const { ref: closerRef,    inView: closerVisible    } = useInView<HTMLDivElement>({ threshold: 0.2  });
  /* ── Data ── */
  // Reality cells: stat / bold white label / cold one-liner
  const realityCells = [
    {
      num:   "1",
      stat:  "15–25%",
      label: "Sales Agent Cut",
      cold:  "Before your investors see a dollar.",
    },
    {
      num:   "2",
      stat:  "$850/hr",
      label: "Entertainment Attorney",
      cold:  "If they'll take the meeting.",
    },
    {
      num:   "3",
      stat:  "30 Sec",
      label: "The Investor Test",
      cold:  "Before the room decides.",
    },
    {
      num:   "4",
      stat:  "$0",
      label: "Equity Position",
      cold:  "You're last. Every time.",
    },
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
                    key={cell.num}
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
                      {cell.num}
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
                5. FREE
                Pure #000, no gradient.
                Attorney anchor creates reciprocity.
                No CTA — belongs only in the Closer.
                ═══════════════════════════════════════════ */}
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
                Warmest card. One headline. One sentence.
                One CTA. Nothing else.
                ═══════════════════════════════════════════ */}
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
