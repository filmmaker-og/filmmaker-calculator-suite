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
    { title: "Returns Mapped", desc: "Every investor sees exactly what they get back — and when" },
    { title: "Nothing Hidden", desc: "Fees, splits, and repayment — all visible before you commit" },
    { title: "Real Math, No Guessing", desc: "Know your margins before you shoot a single frame" },
  ];
  const withoutItems = [
    { title: "The Question You Can't Answer", desc: "'How do I get my money back?' — and you're improvising" },
    { title: "Surprises After Signatures", desc: "Fees and splits you didn't account for surface after the deal closes" },
    { title: "First-Deal Math", desc: "Your backend points were worth nothing after the sales agent commission you forgot to model" },
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

          <section id="hero" className="relative pt-12 pb-6" style={{ background: "radial-gradient(ellipse at center top, rgba(212,175,55,0.04) 0%, transparent 60%)" }}>
            <div className="relative px-8 max-w-md mx-auto">

              <div className="text-center mb-8">
                <h1 className="font-bebas text-[clamp(3rem,10vw,4.2rem)] leading-[0.95] tracking-[0.02em] text-gold mb-4">
                  SEE WHERE EVERY DOLLAR <span className="text-ink">GOES</span>
                </h1>
                <p className="text-ink-body text-[16px] leading-[1.7] tracking-[0.04em] font-medium">
                  Know every fee, split, and return — before your investor asks.
                </p>
              </div>

              <div className="mb-6 text-center">
                <div className="w-full max-w-[300px] mx-auto">
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

          {/* What This Is — education + mission */}
          <section id="what-this-is" className="relative pt-12 pb-10 md:pt-16 md:pb-12 px-6">
            <div className="max-w-md mx-auto flex flex-col gap-5">

              {/* Card 1 — The problem */}
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  border: "1px solid rgba(212,175,55,0.25)",
                  background: "rgba(212,175,55,0.02)",
                  boxShadow: "inset 0 1px 0 rgba(212,175,55,0.06)",
                }}
              >
                <div className="px-6 pt-7 pb-7 flex flex-col gap-5">
                  <h2 className="font-bebas text-[clamp(1.6rem,6vw,2rem)] leading-[1.1] tracking-[0.04em] text-gold">
                    KNOW YOUR DEAL BEFORE YOU SIGN&nbsp;IT
                  </h2>

                  <p className="text-[16px] text-ink-body leading-[1.75] tracking-[0.01em]">
                    Every film deal has a pecking order&nbsp;— distributors, agents, lenders, and investors all get paid before you&nbsp;do.
                  </p>

                  <p className="text-[16px] text-ink-body leading-[1.75] tracking-[0.01em]">
                    That's called a <span className="text-gold font-semibold">waterfall</span>. This tool lets you model yours before you sign&nbsp;anything.
                  </p>

                  <a
                    href="/resources?tab=waterfall"
                    className="inline-flex items-center gap-2 text-gold/70 hover:text-gold transition-colors text-[14px] font-medium"
                  >
                    <span
                      className="inline-flex items-center justify-center w-[20px] h-[20px] rounded-full text-[12px] font-bold leading-none"
                      style={{ border: "1px solid rgba(212,175,55,0.40)", color: "rgba(212,175,55,0.70)" }}
                      aria-hidden="true"
                    >
                      i
                    </span>
                    What's a waterfall?
                  </a>
                </div>
              </div>

              {/* Card 2 — The tool + mission */}
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  border: "1px solid rgba(212,175,55,0.25)",
                  background: "rgba(212,175,55,0.02)",
                  boxShadow: "inset 0 1px 0 rgba(212,175,55,0.06)",
                }}
              >
                <div className="px-6 pt-7 pb-7 flex flex-col gap-5">
                  <p className="text-[16px] text-ink-body leading-[1.75] tracking-[0.01em]">
                    Run it as many times as you want. Premium unlocks extended scenarios, financial modeling, and PDF&nbsp;exports.
                  </p>

                  <p className="text-[15px] text-gold/60 italic tracking-[0.02em]">
                    We're democratizing the business of film.
                  </p>
                </div>
              </div>

            </div>
          </section>

          <section id="value" className="relative pb-10 md:pb-12 px-6">
            <div
              ref={valueRef}
              className="relative max-w-md mx-auto flex flex-col gap-5"
            >
              {/* WITH card */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(212,175,55,0.25)", background: "rgba(212,175,55,0.02)", boxShadow: "inset 0 1px 0 rgba(212,175,55,0.06)" }}
              >
                <div className="px-5 pt-6 pb-6">
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
                </div>
              </div>

              {/* WITHOUT card */}
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  border: "1px solid rgba(180,60,60,0.28)",
                  background: "rgba(180,60,60,0.07)",
                }}
              >
                <div className="px-5 pt-6 pb-6">
                  <h2
                    className="font-mono text-[13px] tracking-[0.14em] uppercase mb-6"
                    style={{
                      color: "rgba(220,120,120,0.70)",
                      opacity: prefersReducedMotion || valueVisible ? 1 : 0,
                      transition: prefersReducedMotion ? "none" : "opacity 500ms ease-out",
                      transitionDelay: prefersReducedMotion ? "0ms" : `${withItems.length * 80 + 60}ms`,
                    }}
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
                            background: "rgba(180,60,60,0.20)",
                            border: "1px solid rgba(180,60,60,0.30)",
                          }}
                        >
                          <span className="text-[16px] font-bold leading-none" aria-hidden="true" style={{ color: "rgba(220,100,100,0.90)" }}>{"\u2717"}</span>
                        </div>
                        <div>
                          <p className="text-[15px] font-semibold leading-snug text-ink">{item.title}</p>
                          <p className="text-[13px] leading-snug mt-1 text-ink-secondary">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </section>

          <section id="final-cta" className="py-12 md:py-16 px-6">
            <div className="max-w-md mx-auto">
              <div
                ref={bridgeRef}
                className="rounded-2xl px-6 py-10 md:py-14 text-center"
                style={{
                  border: "2px solid rgba(212,175,55,0.40)",
                  background: "radial-gradient(ellipse at center 70%, rgba(212,175,55,0.04) 0%, rgba(212,175,55,0.02) 60%, transparent 100%)",
                  boxShadow: "inset 0 1px 0 rgba(212,175,55,0.06)",
                  opacity: prefersReducedMotion || bridgeVisible ? 1 : 0,
                  transform: prefersReducedMotion || bridgeVisible ? "translateY(0)" : "translateY(16px)",
                  transition: prefersReducedMotion ? "none" : "opacity 700ms ease-out, transform 700ms ease-out",
                }}
              >
                <h2 className="font-bebas text-[clamp(2rem,8vw,2.6rem)] leading-[1.1] tracking-[0.06em] text-gold mb-6">
                  YOUR INVESTORS WILL{"\u00A0"}ASK HOW THE MONEY FLOWS <span className="text-ink">BACK.</span>
                </h2>
                <button
                  onClick={handleStartClick}
                  className="w-full max-w-[300px] h-[52px] btn-cta-primary mx-auto"
                >
                  BUILD YOUR WATERFALL
                </button>
              </div>
            </div>
          </section>

          <footer className="py-8 px-6 max-w-md mx-auto">
            <p className="text-ink-ghost text-[13px] tracking-wide leading-relaxed text-center">
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
