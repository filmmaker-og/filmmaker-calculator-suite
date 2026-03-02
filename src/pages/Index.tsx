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

  const { ref: valueRef, inView: valueVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: closerRef, inView: closerVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });

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

          {/* ════════════════════════════════════════════════════════
              HERO — Big type, CTA, nothing else
              ════════════════════════════════════════════════════════ */}
          <section className="relative pt-16 pb-24 md:pt-24 md:pb-36">
            <div className="px-8 max-w-lg mx-auto md:max-w-xl">
              <p
                className="font-mono text-[11px] uppercase tracking-[0.25em] mb-6"
                style={{ color: "rgba(255,255,255,0.30)" }}
              >
                Film Finance Simulator
              </p>
              <h1 className="font-bebas text-[clamp(3.2rem,12vw,5.5rem)] leading-[0.92] tracking-[0.01em] text-white mb-8">
                SEE WHERE<br />
                EVERY DOLLAR<br />
                GOES
              </h1>
              <p
                className="text-[17px] leading-[1.75] max-w-sm mb-12"
                style={{ color: "rgba(255,255,255,0.50)" }}
              >
                Model your waterfall. Know every fee, split, and&nbsp;return
                — before your investor asks.
              </p>
              <button
                onClick={handleStartClick}
                className={`h-[52px] px-10 btn-cta-primary${ctaGlow ? " animate-cta-glow-pulse" : ""}`}
              >
                BUILD YOUR WATERFALL
              </button>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════
              THE WATERFALL — full bleed, no card wrapper
              Thin gold rule separates it from hero
              ════════════════════════════════════════════════════════ */}
          <div
            className="w-full h-[1px]"
            style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.12) 30%, rgba(212,175,55,0.12) 70%, transparent)" }}
          />

          <section className="py-20 md:py-28">
            <div className="px-8 max-w-lg mx-auto md:max-w-xl">
              <p
                className="font-mono text-[11px] uppercase tracking-[0.25em] mb-10"
                style={{ color: "rgba(255,255,255,0.30)" }}
              >
                Example Waterfall
              </p>
              <WaterfallCascade />
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════
              WHAT THIS IS — editorial text, no cards
              ════════════════════════════════════════════════════════ */}
          <section className="py-24 md:py-36">
            <div className="px-8 max-w-lg mx-auto md:max-w-xl">
              <h2 className="font-bebas text-[clamp(2rem,8vw,3.2rem)] leading-[0.95] tracking-[0.02em] text-white mb-8">
                KNOW YOUR DEAL<br />
                BEFORE YOU SIGN&nbsp;IT
              </h2>

              <div className="space-y-6">
                <p
                  className="text-[17px] leading-[1.8]"
                  style={{ color: "rgba(255,255,255,0.50)" }}
                >
                  Every film deal has a pecking order — distributors, sales agents,
                  lenders, and investors all get paid before you do.
                  That's called a <span className="text-gold">waterfall</span>.
                </p>
                <p
                  className="text-[17px] leading-[1.8]"
                  style={{ color: "rgba(255,255,255,0.50)" }}
                >
                  This tool lets you model yours before you sign anything.
                  Run it as many times as you want. Premium unlocks extended
                  scenarios, financial modeling, and PDF exports.
                </p>
              </div>

              <a
                href="/resources?tab=waterfall"
                className="inline-block mt-8 font-mono text-[13px] tracking-[0.08em] text-gold-cta hover:opacity-70 transition-opacity"
              >
                What's a waterfall? {"\u2192"}
              </a>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════
              WITH / WITHOUT — two text columns, no boxes
              Left-aligned, separated by a single gold rule
              ════════════════════════════════════════════════════════ */}
          <div
            className="w-full h-[1px]"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)" }}
          />

          <section className="py-24 md:py-36">
            <div
              ref={valueRef}
              className="px-8 max-w-lg mx-auto md:max-w-xl"
            >
              {/* WITH */}
              <div className="mb-20">
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold mb-8"
                >
                  With your waterfall
                </p>
                <ul className="space-y-8">
                  {([
                    { title: "Returns mapped", desc: "Every investor sees exactly what they get back — and when." },
                    { title: "Nothing hidden", desc: "Fees, splits, and repayment order — all visible before you commit." },
                    { title: "Your margins, confirmed", desc: "Run the numbers on your backend points before you shoot a single frame." },
                  ]).map((item, i) => (
                    <li
                      key={item.title}
                      style={{
                        opacity: prefersReducedMotion || valueVisible ? 1 : 0,
                        transform: prefersReducedMotion || valueVisible ? "translateY(0)" : "translateY(8px)",
                        transition: prefersReducedMotion ? "none" : "opacity 600ms ease-out, transform 600ms ease-out",
                        transitionDelay: prefersReducedMotion ? "0ms" : `${i * 120}ms`,
                      }}
                    >
                      <p className="text-[15px] font-medium text-white leading-snug mb-1">{item.title}</p>
                      <p className="text-[15px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.40)" }}>{item.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Thin separator */}
              <div
                className="h-[1px] w-16 mb-20"
                style={{ background: "rgba(255,255,255,0.10)" }}
              />

              {/* WITHOUT */}
              <div>
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.25em] mb-8"
                  style={{ color: "rgba(255,255,255,0.20)" }}
                >
                  Without one
                </p>
                <ul className="space-y-8">
                  {([
                    { title: "The question you can't answer", desc: "'How do I get my money back?' — and you're improvising." },
                    { title: "Surprises after signatures", desc: "Fees and splits you didn't model surface after the deal closes." },
                    { title: "First-deal math", desc: "Your backend points were worth nothing after the sales agent commission you forgot to model." },
                  ]).map((item, i) => (
                    <li
                      key={item.title}
                      style={{
                        opacity: prefersReducedMotion || valueVisible ? 1 : 0,
                        transform: prefersReducedMotion || valueVisible ? "translateY(0)" : "translateY(8px)",
                        transition: prefersReducedMotion ? "none" : "opacity 600ms ease-out, transform 600ms ease-out",
                        transitionDelay: prefersReducedMotion ? "0ms" : `${(3 + i) * 120 + 200}ms`,
                      }}
                    >
                      <p className="text-[15px] font-medium leading-snug mb-1" style={{ color: "rgba(255,255,255,0.50)" }}>{item.title}</p>
                      <p className="text-[15px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.25)" }}>{item.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════
              CLOSER — one line + CTA, maximum breathing room
              ════════════════════════════════════════════════════════ */}
          <section className="py-28 md:py-40">
            <div
              ref={closerRef}
              className="px-8 max-w-lg mx-auto md:max-w-xl"
              style={{
                opacity: prefersReducedMotion || closerVisible ? 1 : 0,
                transform: prefersReducedMotion || closerVisible ? "translateY(0)" : "translateY(12px)",
                transition: prefersReducedMotion ? "none" : "opacity 800ms ease-out, transform 800ms ease-out",
              }}
            >
              <h2 className="font-bebas text-[clamp(2rem,8vw,3rem)] leading-[0.95] tracking-[0.02em] text-white mb-10">
                YOUR INVESTORS WILL ASK<br />
                HOW THE MONEY FLOWS&nbsp;BACK.
              </h2>
              <button
                onClick={handleStartClick}
                className="h-[52px] px-10 btn-cta-primary"
              >
                BUILD YOUR WATERFALL
              </button>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════════
              FOOTER
              ════════════════════════════════════════════════════════ */}
          <footer className="pb-16 pt-8 px-8 max-w-lg mx-auto md:max-w-xl">
            <div
              className="h-[1px] w-full mb-8"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
            <p
              className="text-[12px] leading-[1.8] tracking-wide"
              style={{ color: "rgba(255,255,255,0.20)" }}
            >
              For educational and informational purposes only. Not legal, tax,
              or investment advice. Consult a qualified entertainment attorney
              before making financing decisions.
            </p>
          </footer>

        </main>
      </div>
    </>
  );
};

export default Index;
