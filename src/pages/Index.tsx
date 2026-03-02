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
          {/* Gamma-style card stack — narrow, centered, tight gaps */}
          <div className="w-full max-w-xl px-4 md:px-6 flex flex-col gap-3 py-6">

            {/* ════════════════════════════════════════════════════════
                1. HERO CARD — gold radial glow, gold headline, tight
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
              <p
                className="font-mono text-[10px] uppercase tracking-[0.25em] mb-6"
                style={{ color: "rgba(212,175,55,0.40)" }}
              >
                Film Finance Simulator
              </p>

              <h1 className="font-bebas text-[clamp(3rem,10vw,4.5rem)] leading-[0.93] tracking-[0.02em] text-gold mb-4">
                SEE WHERE EVERY DOLLAR GOES
              </h1>

              <p className="text-[15px] leading-[1.7] text-ink-body tracking-[0.02em] mx-auto max-w-sm mb-8">
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
                3. EDUCATION CARD — what is a waterfall
                ════════════════════════════════════════════════════════ */}
            <Card className="px-6 py-8 md:px-8 md:py-10">
              <p
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold mb-5"
                style={{ opacity: 0.60 }}
              >
                Why This Matters
              </p>

              <h2 className="font-bebas text-[clamp(1.8rem,7vw,2.4rem)] leading-[0.96] tracking-[0.02em] text-white mb-5">
                KNOW YOUR DEAL BEFORE YOU SIGN&nbsp;IT
              </h2>

              <div className="space-y-4">
                <p className="text-[15px] leading-[1.75] text-ink-body">
                  Every film deal has a pecking order — distributors, sales agents,
                  lenders, and investors all get paid before you do.
                  That's called a <span className="text-gold font-medium">waterfall</span>.
                </p>
                <p className="text-[15px] leading-[1.75] text-ink-body">
                  This tool lets you model yours before you sign anything.
                  Premium unlocks extended scenarios, financial modeling,
                  and PDF exports.
                </p>
              </div>

              <a
                href="/resources?tab=waterfall"
                className="inline-block mt-6 font-mono text-[12px] tracking-[0.06em] text-gold-cta hover:opacity-70 transition-opacity"
              >
                What's a waterfall? {"\u2192"}
              </a>
            </Card>

            {/* ════════════════════════════════════════════════════════
                4. WITH CARD — gold border, gold tint, checkmarks
                ════════════════════════════════════════════════════════ */}
            <div ref={valueRef} className="flex flex-col gap-3">
              <p className="text-[14px] text-ink-secondary italic leading-relaxed tracking-[0.01em] text-center px-2">
                My first project premiered at Tribeca and landed on Netflix — and I still had to guess at the math.
              </p>

              <Card
                accent
                className="px-5 py-6 md:px-6 md:py-8"
              >
                <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-gold mb-6">
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
                        <p className="text-[15px] font-semibold text-ink leading-snug">{item.title}</p>
                        <p className="text-[13px] text-ink-body leading-snug mt-1">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* 5. WITHOUT CARD — dimmed, ghosted, no gold */}
              <Card
                className="px-5 py-6 md:px-6 md:py-8"
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <h2
                  className="font-mono text-[13px] tracking-[0.14em] uppercase mb-6"
                  style={{ color: "rgba(255,255,255,0.30)" }}
                >
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
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <span className="text-[16px] font-bold leading-none" aria-hidden="true" style={{ color: "rgba(255,255,255,0.25)" }}>{"\u2717"}</span>
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold leading-snug" style={{ color: "rgba(255,255,255,0.50)" }}>{item.title}</p>
                        <p className="text-[13px] leading-snug mt-1" style={{ color: "rgba(255,255,255,0.30)" }}>{item.desc}</p>
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
                <h2 className="font-bebas text-[clamp(2rem,8vw,2.6rem)] leading-[1.05] tracking-[0.04em] text-gold mb-6">
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
                7. FOOTER — no card, just whisper text
                ════════════════════════════════════════════════════════ */}
            <footer className="py-6 px-4 text-center">
              <p className="text-ink-ghost text-[12px] tracking-wide leading-relaxed mx-auto max-w-sm">
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
