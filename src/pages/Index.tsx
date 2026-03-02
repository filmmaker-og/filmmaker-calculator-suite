import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import { useInView } from "@/hooks/useInView";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import WaterfallCascade from "@/components/WaterfallCascade";

/* ═══════════════════════════════════════════════════════════════════
   CARD — Gamma-style slide unit dressed in filmmaker.og gold.
   Gold-tinted bg + visible gold border on void-black = pops.
   ═══════════════════════════════════════════════════════════════════ */
const Card = ({
  children,
  className = "",
  accent = false,
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
  style?: React.CSSProperties;
}) => (
  <div
    className={`rounded-xl overflow-hidden ${className}`}
    style={{
      background: "rgba(212,175,55,0.02)",
      border: accent
        ? "1px solid rgba(212,175,55,0.25)"
        : "1px solid rgba(212,175,55,0.15)",
      boxShadow: accent ? "inset 0 1px 0 rgba(212,175,55,0.06)" : "none",
      ...style,
    }}
  >
    {children}
  </div>
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

  const { ref: valueRef, inView: valueVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const { ref: closerRef, inView: closerVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });

  const withItems = [
    { title: "Returns Mapped", desc: "Every investor sees exactly what they get back — and when." },
    { title: "Nothing Hidden", desc: "Fees, splits, and repayment order — all visible before you commit." },
    { title: "Your Margins, Confirmed", desc: "Run the numbers on your backend points before you shoot a frame." },
  ];

  const withoutItems = [
    { title: "The Question You Can't Answer", desc: "'How do I get my money back?' — and you're improvising." },
    { title: "Surprises After Signatures", desc: "Fees and splits you didn't model surface after the deal closes." },
    { title: "First-Deal Math", desc: "Backend points worth nothing after the sales agent commission you forgot." },
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
          {/* Gamma-style card stack — narrow, centered, breathing gaps */}
          <div className="w-full max-w-xl px-5 md:px-8 flex flex-col gap-4 py-6">

            {/* ════════════════════════════════════════════════════════
                1. HERO CARD — gold radial glow, gold headline
                ════════════════════════════════════════════════════════ */}
            <Card
              accent
              className="px-6 py-10 md:px-8 md:py-14 text-center"
              style={{
                background: "radial-gradient(ellipse at center top, rgba(212,175,55,0.04) 0%, rgba(212,175,55,0.02) 40%, rgba(212,175,55,0.01) 100%)",
                border: "1px solid rgba(212,175,55,0.25)",
                boxShadow: "inset 0 1px 0 rgba(212,175,55,0.06)",
              }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.20em] mb-6 text-gold-text">
                Film Finance Simulator
              </p>

              <h1 className="font-bebas text-[clamp(3rem,10vw,4.5rem)] leading-[0.96] tracking-[0.02em] text-gold mb-4">
                SEE WHERE EVERY DOLLAR GOES
              </h1>

              <p className="text-[16px] leading-[1.7] text-ink-body tracking-[0.02em] mx-auto max-w-sm mb-8">
                Model your waterfall. Know every fee, split, and&nbsp;return
                — before your investor asks.
              </p>

              <div className="w-full max-w-[300px] mx-auto">
                <button
                  onClick={handleStartClick}
                  className={`w-full h-[52px] btn-cta-primary${ctaGlow ? " animate-cta-glow-pulse" : ""}`}
                >
                  BUILD YOUR WATERFALL
                </button>
              </div>
            </Card>

            {/* ════════════════════════════════════════════════════════
                2. WATERFALL CARD — gold-bordered ledger, the showcase
                ════════════════════════════════════════════════════════ */}
            <Card accent className="px-5 py-6 md:px-6 md:py-8">
              <WaterfallCascade />
            </Card>

            {/* ════════════════════════════════════════════════════════
                3A. EDUCATION CARD — why this matters
                ════════════════════════════════════════════════════════ */}
            <Card className="px-6 py-8 md:px-8 md:py-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.20em] text-gold-text mb-5">
                Why This Matters
              </p>

              <h2 className="font-bebas text-[clamp(2rem,7vw,2.6rem)] leading-[1.05] tracking-[0.02em] text-white mb-5">
                KNOW YOUR DEAL BEFORE YOU SIGN&nbsp;IT
              </h2>

              <p className="text-[16px] leading-[1.7] text-ink-body">
                Every film deal has a pecking order — distributors, sales agents,
                lenders, and investors all get paid before you do.
                That's called a <span className="text-gold font-medium">waterfall</span>.
              </p>

              <a
                href="/resources?tab=waterfall"
                className="inline-block mt-6 font-mono text-[11px] tracking-[0.06em] text-gold-cta hover:opacity-70 transition-opacity"
              >
                What's a waterfall? {"\u2192"}
              </a>
            </Card>

            {/* ════════════════════════════════════════════════════════
                3B. TOOL CARD — what you get
                ════════════════════════════════════════════════════════ */}
            <Card className="px-6 py-8 md:px-8 md:py-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.20em] text-gold-text mb-5">
                What You Get
              </p>

              <h2 className="font-bebas text-[clamp(2rem,7vw,2.6rem)] leading-[1.05] tracking-[0.02em] text-white mb-5">
                MODEL YOURS BEFORE YOU SIGN&nbsp;ANYTHING
              </h2>

              <p className="text-[16px] leading-[1.7] text-ink-body">
                This tool lets you build your own waterfall — map every fee,
                split, and repayment tier. Premium unlocks extended scenarios,
                financial modeling, and PDF&nbsp;exports.
              </p>
            </Card>

            {/* ════════════════════════════════════════════════════════
                4. WITH CARD — gold border, gold tint, checkmarks
                ════════════════════════════════════════════════════════ */}
            <div ref={valueRef} className="flex flex-col gap-4">
              <Card
                accent
                className="px-5 py-6 md:px-6 md:py-8"
              >
                <h2 className="font-mono text-[11px] tracking-[0.14em] uppercase text-gold-text mb-6">
                  With your waterfall
                </h2>
                <ul className="flex flex-col gap-5" aria-label="Benefits of using a waterfall">
                  {withItems.map((item, i) => (
                    <li
                      key={item.title}
                      className="flex items-start gap-4"
                      style={{
                        opacity: prefersReducedMotion || valueVisible ? 1 : 0,
                        transform: prefersReducedMotion || valueVisible ? "translateY(0)" : "translateY(12px)",
                        transition: prefersReducedMotion ? "none" : "opacity 500ms ease-out, transform 500ms ease-out",
                        transitionDelay: prefersReducedMotion ? "0ms" : `${i * 80}ms`,
                      }}
                    >
                      <div
                        className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5"
                        style={{
                          background: "linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)",
                        }}
                      >
                        <span className="text-black text-[18px] font-bold leading-none" aria-hidden="true">{"\u2713"}</span>
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-ink leading-snug">{item.title}</p>
                        <p className="text-[14px] text-ink-body leading-snug mt-1">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* 5. WITHOUT CARD — red danger treatment, readable */}
              <Card
                className="px-5 py-6 md:px-6 md:py-8"
                style={{
                  background: "rgba(220,60,60,0.03)",
                  border: "1px solid rgba(220,60,60,0.20)",
                }}
              >
                <h2 className="font-mono text-[11px] tracking-[0.14em] uppercase mb-6 text-danger">
                  Without a waterfall
                </h2>
                <ul className="flex flex-col gap-5" aria-label="Risks without a waterfall">
                  {withoutItems.map((item, i) => (
                    <li
                      key={item.title}
                      className="flex items-start gap-4"
                      style={{
                        opacity: prefersReducedMotion || valueVisible ? 1 : 0,
                        transform: prefersReducedMotion || valueVisible ? "translateY(0)" : "translateY(12px)",
                        transition: prefersReducedMotion ? "none" : "opacity 500ms ease-out, transform 500ms ease-out",
                        transitionDelay: prefersReducedMotion ? "0ms" : `${(withItems.length + i + 1) * 80}ms`,
                      }}
                    >
                      <div
                        className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5"
                        style={{
                          background: "rgba(220,60,60,0.10)",
                          border: "1px solid rgba(220,60,60,0.20)",
                        }}
                      >
                        <span className="text-[16px] font-bold leading-none text-danger" aria-hidden="true">{"\u2717"}</span>
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold leading-snug text-ink-body">{item.title}</p>
                        <p className="text-[14px] leading-snug mt-1 text-ink-muted">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* ════════════════════════════════════════════════════════
                6. CLOSER CTA CARD — gold border thick, radial glow
                ════════════════════════════════════════════════════════ */}
            <Card
              accent
              className="px-6 py-10 md:px-8 md:py-14 text-center"
              style={{
                border: "2px solid rgba(212,175,55,0.40)",
                background: "radial-gradient(ellipse at center 70%, rgba(212,175,55,0.04) 0%, rgba(212,175,55,0.02) 60%, transparent 100%)",
                boxShadow: "inset 0 1px 0 rgba(212,175,55,0.06)",
              }}
            >
              <div
                ref={closerRef}
                style={{
                  opacity: prefersReducedMotion || closerVisible ? 1 : 0,
                  transform: prefersReducedMotion || closerVisible ? "translateY(0)" : "translateY(12px)",
                  transition: prefersReducedMotion ? "none" : "opacity 700ms ease-out, transform 700ms ease-out",
                }}
              >
                <h2 className="font-bebas text-[clamp(2rem,8vw,2.6rem)] leading-[1.05] tracking-[0.02em] text-gold mb-6">
                  YOUR INVESTORS WILL{"\u00A0"}ASK HOW THE MONEY FLOWS BACK.
                </h2>
                <div className="w-full max-w-[300px] mx-auto">
                  <button
                    onClick={handleStartClick}
                    className="w-full h-[52px] btn-cta-primary animate-cta-glow-pulse"
                  >
                    BUILD YOUR WATERFALL
                  </button>
                </div>
              </div>
            </Card>

            {/* ════════════════════════════════════════════════════════
                7. FOOTER — visible disclaimer with top rule
                ════════════════════════════════════════════════════════ */}
            <footer className="pt-4 pb-6 px-4 text-center">
              <div
                className="mx-auto max-w-[200px] mb-4 h-[1px]"
                style={{ background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.12) 50%, transparent 100%)" }}
              />
              <p className="text-ink-secondary text-[11px] tracking-wide leading-relaxed mx-auto max-w-sm">
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
