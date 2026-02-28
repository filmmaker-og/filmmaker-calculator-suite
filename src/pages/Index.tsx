import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import WaterfallCascade from "@/components/WaterfallCascade";
import filmmakerFIcon from "@/assets/filmmaker-f-icon.png";
import { cn } from "@/lib/utils";

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

  const valueRef = useRef<HTMLDivElement>(null);
  const [valueVisible, setValueVisible] = useState(false);
  const credRef = useRef<HTMLDivElement>(null);
  const [credVisible, setCredVisible] = useState(false);
  const bridgeRef = useRef<HTMLDivElement>(null);
  const [bridgeVisible, setBridgeVisible] = useState(false);

  useEffect(() => {
    const sections = [
      { el: valueRef.current, setter: setValueVisible },
      { el: credRef.current, setter: setCredVisible },
      { el: bridgeRef.current, setter: setBridgeVisible },
    ];
    const observers: IntersectionObserver[] = [];
    sections.forEach(({ el, setter }) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setter(true);
            obs.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  const withItems = [
    { title: "Revenue Mapped", desc: "Revenue divided automatically across every stakeholder" },
    { title: "Investor-Ready PDF", desc: "Share a polished waterfall document with one click" },
    { title: "Full Clarity", desc: "See exactly who gets paid and when in the cascade" },
    { title: "Real Numbers", desc: "Know your margins before you shoot a single frame" },
  ];
  const withoutItems = [
    { title: "Guesswork Deals", desc: "Structured on hope, not data" },
    { title: "No Framework", desc: "No shared language for investor conversations" },
    { title: "Ambiguity", desc: "Money flow is unclear to everyone involved" },
    { title: "Trial & Error", desc: "Years of expensive lessons learned the hard way" },
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

          <section id="hero" className="relative pt-14 pb-6">
            <div className="relative px-4 max-w-md mx-auto">

              <div className="text-center mb-5">
                <img
                  src={filmmakerFIcon}
                  alt="filmmaker.og"
                  className="w-14 h-14 mx-auto object-contain"
                />
              </div>

              <div className="text-center mb-8 px-2">
                <h1 className="font-bebas text-[clamp(3rem,10vw,4.2rem)] leading-[0.95] tracking-[0.02em] text-gold mb-2.5">
                  SEE WHERE EVERY DOLLAR <span className="text-white">GOES</span>
                </h1>
                <p className="text-white/60 text-[15px] leading-[1.7] tracking-[0.04em] font-medium">
                  Democratizing the business of film.
                </p>
              </div>

              <div
                className="rounded-2xl px-2 pt-4 pb-5"
                style={{
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <WaterfallCascade />
              </div>

              <div className="mt-9 text-center px-2">
                <div className="w-full max-w-[300px] mx-auto">
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

          <section id="value" className="relative py-14 md:py-20 px-6">
            <div
              ref={valueRef}
              className="relative max-w-md mx-auto"
            >
              <div className="border border-white/[0.08] bg-black overflow-hidden rounded-xl">

                <div className="px-5 pt-6 pb-5">
                  <p className="font-mono text-[14px] tracking-[0.12em] uppercase text-gold mb-5 px-1">
                    With your waterfall
                  </p>
                  <div className="flex flex-col gap-3">
                    {withItems.map((item, i) => (
                      <div
                        key={item.title}
                        className="flex items-start gap-4 rounded-lg px-4 py-4"
                        style={{
                          background: "rgba(212,175,55,0.04)",
                          border: "1px solid rgba(212,175,55,0.08)",
                          opacity: valueVisible ? 1 : 0,
                          transform: valueVisible ? "translateY(0)" : "translateY(12px)",
                          transition: "opacity 500ms ease-out, transform 500ms ease-out",
                          transitionDelay: `${i * 120}ms`,
                        }}
                      >
                        <div
                          className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center mt-0.5"
                          style={{
                            background: "linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)",
                          }}
                        >
                          <span className="text-black text-[16px] font-bold leading-none">{"\u2713"}</span>
                        </div>
                        <div>
                          <p className="text-[15px] font-semibold text-white leading-snug">{item.title}</p>
                          <p className="text-[13px] text-ink-secondary leading-snug mt-1">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="mx-6 h-[1px]"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.30), transparent)",
                    opacity: valueVisible ? 1 : 0,
                    transition: "opacity 500ms ease-out",
                    transitionDelay: `${withItems.length * 120}ms`,
                  }}
                />

                <div className="px-5 pt-6 pb-6" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <p
                    className="font-mono text-[14px] tracking-[0.12em] uppercase text-ink-secondary mb-5 px-1"
                    style={{
                      opacity: valueVisible ? 1 : 0,
                      transition: "opacity 500ms ease-out",
                      transitionDelay: `${withItems.length * 120 + 80}ms`,
                    }}
                  >
                    Without it
                  </p>
                  <div className="flex flex-col gap-3">
                    {withoutItems.map((item, i) => (
                      <div
                        key={item.title}
                        className="flex items-start gap-4 rounded-lg px-4 py-4"
                        style={{
                          background: "rgba(180,60,60,0.06)",
                          border: "1px solid rgba(180,60,60,0.12)",
                          opacity: valueVisible ? 1 : 0,
                          transform: valueVisible ? "translateY(0)" : "translateY(12px)",
                          transition: "opacity 500ms ease-out, transform 500ms ease-out",
                          transitionDelay: `${(withItems.length + i + 1) * 120}ms`,
                        }}
                      >
                        <div
                          className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center mt-0.5"
                          style={{
                            background: "rgba(180,60,60,0.15)",
                            border: "1px solid rgba(180,60,60,0.20)",
                          }}
                        >
                          <span className="text-[14px] font-bold leading-none" style={{ color: "rgba(220,100,100,0.70)" }}>{"\u2717"}</span>
                        </div>
                        <div>
                          <p className="text-[15px] font-semibold leading-snug" style={{ color: "rgba(255,200,200,0.60)" }}>{item.title}</p>
                          <p className="text-[13px] leading-snug mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </section>

          <section className="px-6 pb-2">
            <div className="max-w-md mx-auto">
              <div
                ref={credRef}
                className="rounded-2xl px-8 py-10 text-center"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  opacity: credVisible ? 1 : 0,
                  transform: credVisible ? "translateY(0)" : "translateY(16px)",
                  transition: "opacity 700ms ease-out, transform 700ms ease-out",
                }}
              >
                <p className="text-[15px] text-white/60 leading-relaxed tracking-wide">
                  Built by a second-generation producer whose debut premiered at Tribeca and landed on Netflix.
                </p>
              </div>
            </div>
          </section>

          <section id="final-cta" className="py-14 md:py-20 px-6">
            <div className="max-w-md mx-auto">
              <div
                ref={bridgeRef}
                className="rounded-2xl px-8 py-10 md:py-14 text-center"
                style={{
                  border: "2px solid rgba(212,175,55,0.40)",
                  background: "rgba(255,255,255,0.02)",
                  opacity: bridgeVisible ? 1 : 0,
                  transform: bridgeVisible ? "translateY(0)" : "translateY(16px)",
                  transition: "opacity 700ms ease-out, transform 700ms ease-out",
                }}
              >
                <h2 className="font-bebas text-[40px] leading-[1.1] tracking-[0.08em] text-gold mb-6">
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
            <p className="text-ink-ghost text-[12px] tracking-wide leading-relaxed text-center">
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
