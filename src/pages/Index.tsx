import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import { useInView } from "@/hooks/useInView";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import WaterfallCascade from "@/components/WaterfallCascade";
/*
  PAGE STACK — 7 sections:
    1. HERO          — warm arrival, primary CTA
    2. WATERFALL     — interactive proof (brownish cast fixed in component)
    3. THE REALITY   — 2x2 numbered cells, no badges, pure black
    4. WITH/WITHOUT  — vertical timeline format, continuous line + numbered circles
    5. FREE          — price reveal, attorney anchor
    6. QUOTE         — gold border, black bg, gold text (NOT gold bg)
    7. CLOSER        — single CTA
  PURE BLACK RULE (enforced):
    - background: #000000 on ALL section cards
    - background: transparent where no border needed
    - NO rgba(212,175,55,x) fills anywhere — causes brownish cast on phones
    - NO #111111 anywhere
    - Gold appears ONLY as: border strokes, text color, circle fill on timeline nodes
    - White appears ONLY as: body text, amounts
    - Section separation: gold border 0.20–0.25 only
  EYEBROW TREATMENT:
    - Gold text + bottom gold underline accent (4px wide, 2px height, gold 0.60)
    - Sits above section headline, provides visual anchor without fill color
  WITH/WITHOUT TIMELINE:
    - Vertical continuous line left side (gold for WITH, red for WITHOUT)
    - Numbered circles on line (1, 2, 3) — filled gold/red, black number
    - Items hang to the right of the line
    - Two separate cards stacked, WITHOUT offset 16px right
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
  const { ref: waterfallRef, inView: waterfallVisible } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { ref: realityRef,   inView: realityVisible   } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { ref: withRef,      inView: withVisible      } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { ref: priceRef,     inView: priceVisible     } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const { ref: quoteRef,     inView: quoteVisible     } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const { ref: closerRef,    inView: closerVisible    } = useInView<HTMLDivElement>({ threshold: 0.2 });
  /* ── Data ── */
  const realityCells = [
    { num: "1", stat: "15–25%",  label: "Sales Agent Cut",         cold: "Before your investors see a dollar." },
    { num: "2", stat: "$850/hr", label: "Entertainment Attorney",  cold: "If they'll take the meeting."        },
    { num: "3", stat: "30 Sec",  label: "The Investor Test",       cold: "Before the room decides."            },
    { num: "4", stat: "$0",      label: "Equity Position",         cold: "You're last. Every time."            },
  ];
  const withItems = [
    { title: "Returns Mapped",         body: "Every investor sees exactly what they get back — and when."          },
    { title: "Nothing Hidden",         body: "Fees, splits, and repayment order visible before you commit."        },
    { title: "Your Margins, Confirmed",body: "Run the numbers on your backend points before you shoot a frame."   },
  ];
  const withoutItems = [
    { title: "The Question You Can't Answer", body: "'How do I get my money back?' — and you're improvising."              },
    { title: "Surprises After Signatures",    body: "Fees and splits you didn't model surface after the deal closes."       },
    { title: "Dead Backend Points",           body: "Sales agent commission you forgot makes them worthless."               },
  ];
  /* ── Shared helpers ── */
  const reveal = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity:         prefersReducedMotion || visible ? 1 : 0,
    transform:       prefersReducedMotion || visible ? "translateY(0)" : "translateY(20px)",
    transition:      prefersReducedMotion ? "none" : "opacity 700ms ease-out, transform 700ms ease-out",
    transitionDelay: prefersReducedMotion || delay === 0 ? "0ms" : `${delay}ms`,
  });
  /* Eyebrow — gold text with short underline accent */
  const Eyebrow = ({ children }: { children: React.ReactNode }) => (
    <div className="mb-4">
      <span
        className="font-mono text-[12px] uppercase tracking-[0.16em] text-gold-full pb-1.5"
        style={{ borderBottom: "2px solid rgba(212,175,55,0.50)" }}
      >
        {children}
      </span>
    </div>
  );
  /* Timeline card — used for both WITH and WITHOUT */
  const TimelineCard = ({
    eyebrow,
    items,
    accent,       // gold or red
    offset = 0,
    visible,
    revealDelay = 0,
  }: {
    eyebrow: string;
    items: { title: string; body: string }[];
    accent: "gold" | "red";
    offset?: number;
    visible: boolean;
    revealDelay?: number;
  }) => {
    const lineColor   = accent === "gold" ? "rgba(212,175,55,0.70)" : "rgba(200,60,60,0.70)";
    const circleBg    = accent === "gold" ? "#D4AF37"               : "rgba(180,40,40,1)";
    const circleText  = accent === "gold" ? "#000"                  : "#fff";
    const eyebrowColor= accent === "gold" ? "rgba(212,175,55,1)"    : "rgba(210,70,70,1)";
    const borderColor = accent === "gold" ? "rgba(212,175,55,0.22)" : "rgba(200,60,60,0.22)";
    return (
      <div
        className="px-6 py-7 overflow-hidden"
        style={{
          marginLeft:   `${offset}px`,
          borderRadius: "8px",
          background:   "#000000",
          border:       `1px solid ${borderColor}`,
          ...reveal(visible, revealDelay),
        }}
      >
        {/* Eyebrow */}
        <div className="mb-5">
          <span
            className="font-mono text-[12px] uppercase tracking-[0.16em] pb-1.5"
            style={{
              color:        eyebrowColor,
              borderBottom: `2px solid ${accent === "gold" ? "rgba(212,175,55,0.50)" : "rgba(200,60,60,0.40)"}`,
            }}
          >
            {eyebrow}
          </span>
        </div>
        {/* Timeline */}
        <div className="relative">
          {/* Continuous vertical line */}
          <div
            className="absolute"
            style={{
              left:       "13px",
              top:        "14px",
              bottom:     "14px",
              width:      "2px",
              background: lineColor,
            }}
          />
          <div className="flex flex-col gap-7">
            {items.map((item, i) => (
              <div
                key={item.title}
                className="flex gap-5 items-start"
                style={reveal(visible, revealDelay + 100 + i * 120)}
              >
                {/* Numbered circle — sits on the line */}
                <div
                  className="relative flex-shrink-0 flex items-center justify-center font-mono text-[11px] font-bold z-10"
                  style={{
                    width:        "28px",
                    height:       "28px",
                    borderRadius: "50%",
                    background:   circleBg,
                    color:        circleText,
                    border:       "2px solid #000",
                    marginTop:    "0px",
                  }}
                >
                  {i + 1}
                </div>
                {/* Content */}
                <div className="pt-0.5">
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
    );
  };
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
          <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl px-5 md:px-8 flex flex-col gap-8 py-6">
            {/* ══════════════════════════════
                1. HERO
                ══════════════════════════════ */}
            <div
              className="px-6 py-10 md:px-8 md:py-14 text-center overflow-hidden"
              style={{
                borderRadius: "8px",
                background:   "#000000",
                border:       "1px solid rgba(212,175,55,0.30)",
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
            {/* ══════════════════════════════
                2. WATERFALL
                ══════════════════════════════ */}
            <div
              ref={waterfallRef}
              className="px-5 py-7 md:px-6 md:py-9 overflow-hidden"
              style={{
                borderRadius: "8px",
                background:   "#000000",
                border:       "1px solid rgba(212,175,55,0.20)",
                ...reveal(waterfallVisible),
              }}
            >
              <WaterfallCascade />
            </div>
            {/* ══════════════════════════════
                3. THE REALITY
                2x2 grid — no badge circles,
                no italic copy, no fills.
                Stat / bold label / cold line.
                Pure black cells, gold borders.
                ══════════════════════════════ */}
            <div
              ref={realityRef}
              className="px-6 py-8 md:px-8 md:py-10 overflow-hidden"
              style={{
                borderRadius: "8px",
                background:   "#000000",
                border:       "1px solid rgba(212,175,55,0.20)",
                ...reveal(realityVisible),
              }}
            >
              <Eyebrow>The Reality</Eyebrow>
              <p className="text-[16px] leading-relaxed text-ink-body mb-8">
                Most producers walk into distribution meetings without knowing these numbers.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {realityCells.map((cell, i) => (
                  <div
                    key={cell.num}
                    className="px-4 py-5"
                    style={{
                      borderRadius: "6px",
                      background:   "#000000",
                      border:       "1px solid rgba(212,175,55,0.18)",
                      ...reveal(realityVisible, i * 90),
                    }}
                  >
                    {/* Large gold stat */}
                    <p className="font-mono text-[22px] md:text-[26px] font-bold text-gold-full tabular-nums leading-none mb-2">
                      {cell.stat}
                    </p>
                    {/* Bold white label */}
                    <p className="text-[11px] font-bold text-white uppercase tracking-[0.08em] mb-2 leading-snug">
                      {cell.label}
                    </p>
                    {/* Cold one-liner */}
                    <p className="text-[14px] leading-relaxed text-ink-secondary">
                      {cell.cold}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* ══════════════════════════════
                4. WITH / WITHOUT
                Vertical timeline, continuous
                gold/red line, numbered circles.
                WITHOUT offset 16px right.
                ══════════════════════════════ */}
            <div ref={withRef} className="flex flex-col gap-3">
              <TimelineCard
                eyebrow="With Your Waterfall"
                items={withItems}
                accent="gold"
                offset={0}
                visible={withVisible}
                revealDelay={0}
              />
              <TimelineCard
                eyebrow="Without A Waterfall"
                items={withoutItems}
                accent="red"
                offset={16}
                visible={withVisible}
                revealDelay={200}
              />
            </div>
            {/* ══════════════════════════════
                5. FREE
                Pure black, gold border 0.25.
                No gradient — clean reveal.
                ══════════════════════════════ */}
            <div
              ref={priceRef}
              className="px-6 py-10 md:px-8 md:py-12 text-center overflow-hidden"
              style={{
                borderRadius: "8px",
                background:   "#000000",
                border:       "1px solid rgba(212,175,55,0.25)",
                ...reveal(priceVisible),
              }}
            >
              <Eyebrow>What This Costs</Eyebrow>
              <p className="font-bebas text-[72px] md:text-[88px] leading-[1.0] tracking-[0.06em] text-white mb-5">
                FREE
              </p>
              <p className="max-w-sm mx-auto text-[16px] leading-relaxed text-ink-body">
                An entertainment attorney bills $500–$850/hr to walk you through
                waterfall mechanics. This gives you the financial x-ray for free.
              </p>
            </div>
            {/* ══════════════════════════════
                6. QUOTE
                Pure black bg. Full gold border.
                Gold text. NOT a gold background.
                The gold-bg version read as a
                coupon/warning label — wrong register.
                ══════════════════════════════ */}
            <div
              ref={quoteRef}
              className="px-7 py-8 md:px-8 md:py-10 overflow-hidden"
              style={{
                borderRadius: "8px",
                background:   "#000000",
                border:       "1px solid rgba(212,175,55,0.60)",
                ...reveal(quoteVisible),
              }}
            >
              <div className="flex gap-4 items-start">
                <span
                  className="flex-shrink-0 font-bebas text-[48px] text-gold-full leading-none"
                  style={{ marginTop: "-8px", opacity: 0.40 }}
                >
                  "
                </span>
                <p className="text-[16px] md:text-[18px] font-semibold text-gold-full leading-relaxed">
                  The creative vision is only half the battle. The other half is proving
                  you can execute that vision responsibly and deliver a return.
                </p>
              </div>
            </div>
            {/* ══════════════════════════════
                7. CLOSER
                Strongest gold border on page.
                One headline. One sentence. One CTA.
                ══════════════════════════════ */}
            <div
              ref={closerRef}
              data-section="closer"
              className="px-6 py-12 md:px-8 md:py-16 text-center overflow-hidden"
              style={{
                borderRadius: "8px",
                background:   "#000000",
                border:       "1px solid rgba(212,175,55,0.35)",
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
            <footer className="pt-2 pb-8 px-4 text-center">
              <div
                className="pt-6"
                style={{ borderTop: "1px solid rgba(212,175,55,0.12)" }}
              >
                <p className="text-ink-body text-[12px] tracking-[0.02em] leading-relaxed mx-auto max-w-sm">
                  For educational and informational purposes only. Not legal, tax,
                  or investment advice. Consult a qualified entertainment attorney
                  before making financing decisions.
                </p>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
};
export default Index;
