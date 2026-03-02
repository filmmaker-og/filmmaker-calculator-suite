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

  const { ref: valueRef, inView: valueVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const { ref: bridgeRef, inView: bridgeVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });

  const withItems = [
    { title: "Returns Mapped", desc: "Every investor sees exactly what they get back — and when." },
    { title: "Nothing Hidden", desc: "Fees, splits, and repayment order — all visible before you commit." },
    { title: "Your Margins, Confirmed", desc: "Run the numbers on your backend points before you shoot a single frame. No more guessing at what's left after the waterfall." },
  ];
  const withoutItems = [
    { title: "The Question You Can't Answer", desc: "'How do I get my money back?' — and you're improvising." },
    { title: "Surprises After Signatures", desc: "Fees and splits you didn't model surface after the deal closes." },
    { title: "First-Deal Math", desc: "Your backend points were worth nothing after the sales agent commission you forgot to model." },
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
        <main aria-label="Film Finance Simulator" className="flex-1 flex flex-col" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>

          {/* ═══ HERO — HEAVY ═══ */}
          <section
            id="hero"
            className="relative py-20 md:py-28"
            style={{ background: "radial-gradient(ellipse at center top, rgba(212,175,55,0.03) 0%, transparent 60%)" }}
          >
            <div className="relative px-8 max-w-md mx-auto md:max-w-2xl">

              <div className="mb-10">
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-ink-secondary mb-4">
                  FILM FINANCE SIMULATOR
                </p>
                <h1 className="font-bebas text-[clamp(3rem,10vw,4.5rem)] leading-[0.95] tracking-[0.02em] text-ink mb-5">
                  SEE WHERE EVERY DOLLAR GOES
                </h1>
                <p className="text-ink-body text-[16px] leading-[1.7] tracking-[0.01em] max-w-sm">
                  Know every fee, split, and return — before your investor asks.
                </p>
              </div>

              <div className="mb-10">
                <div className="w-full max-w-[300px]">
                  <button
                    onClick={handleStartClick}
                    className={`w-full h-[52px] btn-cta-primary${ctaGlow ? " animate-cta-glow-pulse" : ""}`}
                  >
                    BUILD YOUR WATERFALL
                  </button>
                </div>
              </div>

              <div className="-mx-2">
                <WaterfallCascade />
              </div>

            </div>
          </section>

          {/* ═══ STATS DIVIDER — LIGHT ═══ */}
          <section
            className="py-6 md:py-8"
            style={{
              background: "#111111",
              borderTop: "1px solid rgba(255,255,255,0.15)",
              borderBottom: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div className="max-w-md mx-auto md:max-w-2xl px-8 flex justify-between">
              <div>
                <p className="font-mono text-[14px] text-gold tabular-nums">5</p>
                <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-ink-secondary">Deduction tiers</p>
              </div>
              <div>
                <p className="font-mono text-[14px] text-gold tabular-nums">50/50</p>
                <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-ink-secondary">Profit split</p>
              </div>
              <div>
                <p className="font-mono text-[14px] text-gold tabular-nums">PDF</p>
                <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-ink-secondary">Export ready</p>
              </div>
            </div>
          </section>

          {/* ═══ EDUCATION — MEDIUM ═══ */}
          <section id="what-this-is" className="relative py-20 md:py-28 px-8">
            <div className="max-w-md mx-auto md:max-w-2xl flex flex-col gap-8">

              {/* Card 1 — The problem */}
              <div
                style={{
                  border: "1px solid rgba(212,175,55,0.15)",
                  background: "#111111",
                  borderRadius: "6px",
                }}
              >
                <div className="px-8 py-10 md:px-10 md:py-12 flex flex-col gap-5">
                  <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-ink-secondary">
                    THE TOOL
                  </p>
                  <h2 className="font-bebas text-[clamp(1.6rem,6vw,2.2rem)] leading-[1.1] tracking-[0.04em] text-ink">
                    KNOW YOUR DEAL BEFORE YOU SIGN&nbsp;IT
                  </h2>

                  <p className="text-[16px] text-ink-body leading-[1.7]">
                    Every film deal has a pecking order&nbsp;— distributors, agents, lenders, and investors all get paid before you&nbsp;do.
                  </p>

                  <p className="text-[16px] text-ink-body leading-[1.7]">
                    That's called a <span className="text-gold font-semibold">waterfall</span>. This tool lets you model yours before you sign&nbsp;anything.
                  </p>

                  <a
                    href="/resources?tab=waterfall"
                    className="inline-flex items-center gap-2 text-gold-cta hover:opacity-80 transition-opacity text-[14px] font-medium"
                  >
                    <span
                      className="inline-flex items-center justify-center w-[20px] h-[20px] text-[12px] font-bold leading-none"
                      style={{ border: "1px solid rgba(212,175,55,0.25)", borderRadius: "4px", color: "rgba(255,255,255,0.70)" }}
                      aria-hidden="true"
                    >
                      i
                    </span>
                    What's a waterfall?
                  </a>
                </div>
              </div>

              {/* Card 2 — Mission */}
              <div
                style={{
                  border: "1px solid rgba(212,175,55,0.15)",
                  background: "#111111",
                  borderRadius: "6px",
                }}
              >
                <div className="px-8 py-10 md:px-10 md:py-12 flex flex-col gap-5">
                  <p className="text-[16px] text-ink-body leading-[1.7]">
                    Run it as many times as you want. Premium unlocks extended scenarios, financial modeling, and PDF&nbsp;exports.
                  </p>

                  <p className="text-[14px] text-ink-secondary italic tracking-[0.02em]">
                    Institutional-grade tools shouldn't cost institutional-grade fees.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* ═══ LIGHT DIVIDER ═══ */}
          <div
            className="h-[1px] max-w-md mx-auto md:max-w-2xl w-full"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)" }}
          />

          {/* ═══ VALUE PROP — MEDIUM ═══ */}
          <section id="value" className="relative py-20 md:py-28 px-8">
            <div
              ref={valueRef}
              className="relative max-w-md mx-auto md:max-w-2xl flex flex-col gap-8"
            >
              {/* WITH card */}
              <div
                style={{
                  border: "1px solid rgba(212,175,55,0.15)",
                  background: "#111111",
                  borderRadius: "6px",
                }}
              >
                <div className="px-8 py-10 md:px-10 md:py-12">
                  <h2 className="font-mono text-[13px] tracking-[0.14em] uppercase text-gold mb-8">
                    With your waterfall
                  </h2>
                  <ul className="flex flex-col gap-6" aria-label="Benefits of using a waterfall">
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
                        <span
                          className="flex-shrink-0 text-gold text-[16px] font-bold leading-none mt-1"
                          aria-hidden="true"
                        >
                          {"\u2713"}
                        </span>
                        <div>
                          <p className="text-[15px] font-semibold text-ink leading-snug">{item.title}</p>
                          <p className="text-[13px] text-ink-body leading-relaxed mt-1">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* WITHOUT card — gold system only, no red */}
              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "#000000",
                  borderRadius: "6px",
                }}
              >
                <div className="px-8 py-10 md:px-10 md:py-12">
                  <h2
                    className="font-mono text-[13px] tracking-[0.14em] uppercase mb-8"
                    style={{
                      color: "rgba(255,255,255,0.40)",
                      opacity: prefersReducedMotion || valueVisible ? 1 : 0,
                      transition: prefersReducedMotion ? "none" : "opacity 500ms ease-out",
                      transitionDelay: prefersReducedMotion ? "0ms" : `${withItems.length * 80 + 60}ms`,
                    }}
                  >
                    Without a waterfall
                  </h2>
                  <ul className="flex flex-col gap-6" aria-label="Risks without a waterfall">
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
                        <span
                          className="flex-shrink-0 text-[16px] font-bold leading-none mt-1"
                          style={{ color: "rgba(255,255,255,0.40)" }}
                          aria-hidden="true"
                        >
                          {"\u2717"}
                        </span>
                        <div>
                          <p className="text-[15px] font-semibold leading-snug text-ink">{item.title}</p>
                          <p className="text-[13px] leading-relaxed mt-1 text-ink-secondary">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </section>

          {/* ═══ FINAL CTA — HEAVY ═══ */}
          <section id="final-cta" className="py-20 md:py-28 px-8" style={{ background: "#111111" }}>
            <div className="max-w-md mx-auto md:max-w-lg">
              <div
                ref={bridgeRef}
                className="px-8 py-12 md:px-10 md:py-16"
                style={{
                  border: "1px solid rgba(212,175,55,0.15)",
                  background: "radial-gradient(ellipse at center 70%, rgba(212,175,55,0.03) 0%, transparent 100%)",
                  borderRadius: "6px",
                  opacity: prefersReducedMotion || bridgeVisible ? 1 : 0,
                  transform: prefersReducedMotion || bridgeVisible ? "translateY(0)" : "translateY(16px)",
                  transition: prefersReducedMotion ? "none" : "opacity 700ms ease-out, transform 700ms ease-out",
                }}
              >
                <h2 className="font-bebas text-[clamp(2rem,8vw,2.6rem)] leading-[1.1] tracking-[0.06em] text-ink mb-8">
                  YOUR INVESTORS WILL{"\u00A0"}ASK HOW THE MONEY FLOWS BACK.
                </h2>
                <div className="max-w-[300px]">
                  <button
                    onClick={handleStartClick}
                    className="w-full h-[52px] btn-cta-primary"
                  >
                    BUILD YOUR WATERFALL
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ FOOTER — LIGHT ═══ */}
          <footer className="py-12 md:py-16 px-8 max-w-md mx-auto md:max-w-2xl">
            <p className="text-ink-secondary text-[13px] tracking-wide leading-relaxed">
              For educational and informational purposes only. Not legal, tax, or investment advice.
              Consult a qualified entertainment attorney before making financing decisions.
            </p>
          </footer>

        </main>
      </div>
    </>
  );
};

export default Index;
