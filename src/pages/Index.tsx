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

          <section id="hero" className="relative pt-8 pb-6">
            <div className="relative px-6 max-w-md mx-auto">

              <div className="text-center mb-8 px-2">
                <h1 className="font-bebas text-[clamp(3rem,10vw,4.2rem)] leading-[0.95] tracking-[0.02em] text-gold mb-2.5">
                  SEE WHERE EVERY DOLLAR <span className="text-white">GOES</span>
                </h1>
                <p className="text-white/60 text-[15px] leading-[1.7] tracking-[0.04em] font-medium">
                  Know every fee, split, and return — before your investor asks.
                </p>
              </div>

              <div className="mb-6 text-center px-2">
                <div className="w-full max-w-[300px] mx-auto">
                  <button
                    onClick={handleStartClick}
                    className="w-full h-[52px] btn-cta-primary"
                  >
                    BUILD YOUR WATERFALL
                  </button>
                </div>
              </div>

              <div
                className="rounded-2xl pt-4 pb-5"
                style={{
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <WaterfallCascade />
              </div>

            </div>
          </section>

          <section id="value" className="relative pt-16 pb-10 md:pt-20 md:pb-12 px-6">
            <div
              ref={valueRef}
              className="relative max-w-md mx-auto flex flex-col gap-5"
            >
              {/* WITH card */}
              <div
                className="bg-black rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(212,175,55,0.25)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
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
                          <p className="text-[15px] font-semibold text-white leading-snug">{item.title}</p>
                          <p className="text-[13px] text-white/65 leading-snug mt-1">{item.desc}</p>
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
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
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
                    Without it
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
                          <p className="text-[15px] font-semibold leading-snug text-white">{item.title}</p>
                          <p className="text-[13px] leading-snug mt-1 text-white/65">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </section>

          <section id="final-cta" className="py-16 md:py-20 px-6">
            <div className="max-w-md mx-auto">
              <div
                ref={bridgeRef}
                className="rounded-2xl px-6 py-10 md:py-14 text-center"
                style={{
                  border: "2px solid rgba(212,175,55,0.40)",
                  background: "radial-gradient(ellipse at center 70%, rgba(212,175,55,0.04) 0%, rgba(255,255,255,0.02) 60%, transparent 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                  opacity: prefersReducedMotion || bridgeVisible ? 1 : 0,
                  transform: prefersReducedMotion || bridgeVisible ? "translateY(0)" : "translateY(16px)",
                  transition: prefersReducedMotion ? "none" : "opacity 700ms ease-out, transform 700ms ease-out",
                }}
              >
                <p className="text-[15px] text-white/55 italic leading-relaxed tracking-[0.01em] mb-6">
                  My first project premiered at Tribeca and landed on Netflix — and I still had to guess at the math. These are the tools I built so you don't have to.
                </p>
                <h2 className="font-bebas text-[32px] leading-[1.1] tracking-[0.06em] text-gold mb-6">
                  YOUR INVESTORS WILL{"\u00A0"}ASK HOW THE MONEY FLOWS <span className="text-white">BACK.</span>
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
            <p className="text-white/30 text-[12px] tracking-wide leading-relaxed text-center">
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
