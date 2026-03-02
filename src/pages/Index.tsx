import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import { useInView } from "@/hooks/useInView";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import WaterfallCascade from "@/components/WaterfallCascade";

/* ═══════════════════════════════════════════════════════════════════
   CARD — rounded box floating on void-black.
   Barely-there bg + hairline border = the card IS the shape.
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
    className={className}
    style={{
      background: "rgba(255,255,255,0.025)",
      border: accent
        ? "1px solid rgba(212,175,55,0.10)"
        : "1px solid rgba(255,255,255,0.04)",
      borderRadius: "14px",
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

  const { ref: valueRef, inView: valueVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: closerRef, inView: closerVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });

  const anim = (i: number, visible: boolean) =>
    prefersReducedMotion
      ? {}
      : {
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 600ms ease-out, transform 600ms ease-out",
          transitionDelay: `${i * 120}ms`,
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
          {/* Outer container — wide on desktop for stagger room */}
          <div className="w-full max-w-3xl px-4 md:px-8 flex flex-col gap-4 md:gap-5 py-6 md:py-10">

            {/* ════════════════════════════════════════════════════════
                HERO — full-width card, editorial scale
                ════════════════════════════════════════════════════════ */}
            <Card className="px-8 py-24 md:px-16 md:py-32 text-center">
              <p
                className="font-mono text-[10px] uppercase tracking-[0.35em] mb-10"
                style={{ color: "rgba(255,255,255,0.22)" }}
              >
                Film Finance Simulator
              </p>

              {/* Thin gold rule — editorial accent */}
              <div
                className="w-12 h-[1px] mx-auto mb-10"
                style={{ background: "rgba(212,175,55,0.30)" }}
              />

              <h1 className="font-bebas text-[clamp(3.2rem,12vw,5.5rem)] leading-[0.90] tracking-[0.02em] text-white mb-8 mx-auto max-w-lg">
                SEE WHERE EVERY DOLLAR GOES
              </h1>

              <p
                className="text-[15px] md:text-[16px] leading-[1.9] mx-auto max-w-sm mb-14"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Model your waterfall. Know every fee, split, and&nbsp;return
                — before your investor asks.
              </p>

              <button
                onClick={handleStartClick}
                className={`h-[52px] px-12 btn-cta-primary mx-auto${ctaGlow ? " animate-cta-glow-pulse" : ""}`}
              >
                BUILD YOUR WATERFALL
              </button>
            </Card>

            {/* ════════════════════════════════════════════════════════
                STATS — narrow card, centered, staggered smaller
                ════════════════════════════════════════════════════════ */}
            <Card
              className="px-10 py-6 self-center"
              style={{ background: "transparent", border: "none", borderRadius: "14px" }}
            >
              <div className="flex justify-center gap-12 md:gap-16">
                {([
                  { value: "5", label: "Deduction tiers" },
                  { value: "50/50", label: "Profit split" },
                  { value: "PDF", label: "Export ready" },
                ]).map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-mono text-[14px] font-medium text-gold tabular-nums">
                      {stat.value}
                    </p>
                    <p
                      className="font-mono text-[9px] uppercase tracking-[0.22em] mt-1"
                      style={{ color: "rgba(255,255,255,0.16)" }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* ════════════════════════════════════════════════════════
                WATERFALL — full-width card, the product centerpiece
                ════════════════════════════════════════════════════════ */}
            <Card accent className="px-8 py-14 md:px-14 md:py-18">
              <p
                className="font-mono text-[10px] uppercase tracking-[0.35em] mb-12"
                style={{ color: "rgba(212,175,55,0.40)" }}
              >
                Example Waterfall
              </p>
              <WaterfallCascade />
            </Card>

            {/* ════════════════════════════════════════════════════════
                EDUCATION — offset right on desktop, narrower card
                staggered for editorial asymmetry
                ════════════════════════════════════════════════════════ */}
            <Card className="px-8 py-14 md:px-12 md:py-18 md:max-w-xl md:self-end">
              <p
                className="font-mono text-[10px] uppercase tracking-[0.35em] mb-10"
                style={{ color: "rgba(255,255,255,0.18)" }}
              >
                Why This Matters
              </p>

              <h2 className="font-bebas text-[clamp(1.8rem,7vw,2.6rem)] leading-[0.94] tracking-[0.02em] text-white mb-8">
                KNOW YOUR DEAL<br />BEFORE YOU SIGN&nbsp;IT
              </h2>

              <div className="space-y-5">
                <p
                  className="text-[15px] leading-[1.85]"
                  style={{ color: "rgba(255,255,255,0.38)" }}
                >
                  Every film deal has a pecking order — distributors, sales agents,
                  lenders, and investors all get paid before you do.
                  That's called a <span className="text-gold font-medium">waterfall</span>.
                </p>
                <p
                  className="text-[15px] leading-[1.85]"
                  style={{ color: "rgba(255,255,255,0.38)" }}
                >
                  This tool lets you model yours before you sign anything.
                  Premium unlocks extended scenarios, financial modeling,
                  and PDF exports.
                </p>
              </div>

              <a
                href="/resources?tab=waterfall"
                className="inline-block mt-10 font-mono text-[12px] tracking-[0.08em] text-gold-cta hover:opacity-70 transition-opacity"
              >
                What's a waterfall? {"\u2192"}
              </a>
            </Card>

            {/* ════════════════════════════════════════════════════════
                WITH / WITHOUT — two cards, staggered heights + offsets
                ════════════════════════════════════════════════════════ */}
            <div ref={valueRef} className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5">
              {/* WITH — 3 cols, taller, offset up */}
              <Card accent className="px-8 py-14 md:px-10 md:py-16 md:col-span-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold mb-10">
                  With your waterfall
                </p>
                <ul className="space-y-8">
                  {([
                    { title: "Returns mapped", desc: "Every investor sees exactly what they get back — and when." },
                    { title: "Nothing hidden", desc: "Fees, splits, and repayment order — all visible before you commit." },
                    { title: "Your margins, confirmed", desc: "Run the numbers on your backend points before you shoot a frame." },
                  ]).map((item, i) => (
                    <li key={item.title} style={anim(i, valueVisible)}>
                      <p className="text-[14px] font-medium text-white leading-snug mb-2">{item.title}</p>
                      <p className="text-[13px] leading-[1.8]" style={{ color: "rgba(255,255,255,0.35)" }}>{item.desc}</p>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* WITHOUT — 2 cols, shorter, recessive */}
              <Card
                className="px-8 py-14 md:px-8 md:py-14 md:col-span-2 md:mt-10"
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.03)",
                  borderRadius: "14px",
                }}
              >
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.35em] mb-10"
                  style={{ color: "rgba(255,255,255,0.12)" }}
                >
                  Without one
                </p>
                <ul className="space-y-8">
                  {([
                    { title: "The question you can't answer", desc: "'How do I get my money back?'" },
                    { title: "Surprises after signatures", desc: "Fees you didn't model surface after close." },
                    { title: "First-deal math", desc: "Backend points worth nothing after forgotten commissions." },
                  ]).map((item, i) => (
                    <li key={item.title} style={anim(3 + i, valueVisible)}>
                      <p className="text-[13px] font-medium leading-snug mb-2" style={{ color: "rgba(255,255,255,0.30)" }}>{item.title}</p>
                      <p className="text-[12px] leading-[1.75]" style={{ color: "rgba(255,255,255,0.16)" }}>{item.desc}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* ════════════════════════════════════════════════════════
                PULL QUOTE — narrow, offset left, editorial
                ════════════════════════════════════════════════════════ */}
            <div className="md:max-w-sm md:self-start py-8 md:py-12 px-2 md:px-4">
              {/* Thin gold rule */}
              <div
                className="w-8 h-[1px] mb-6"
                style={{ background: "rgba(212,175,55,0.25)" }}
              />
              <p
                className="font-mono text-[12px] md:text-[13px] leading-[1.9] tracking-[0.01em] italic"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                "Institutional-grade tools shouldn't cost institutional-grade&nbsp;fees."
              </p>
            </div>

            {/* ════════════════════════════════════════════════════════
                CLOSER — full-width card, centered, the conversion moment
                ════════════════════════════════════════════════════════ */}
            <Card accent className="px-8 py-20 md:px-16 md:py-28 text-center">
              <div
                ref={closerRef}
                style={{
                  opacity: prefersReducedMotion || closerVisible ? 1 : 0,
                  transform: prefersReducedMotion || closerVisible ? "translateY(0)" : "translateY(10px)",
                  transition: prefersReducedMotion ? "none" : "opacity 800ms ease-out, transform 800ms ease-out",
                }}
              >
                <div
                  className="w-10 h-[1px] mx-auto mb-10"
                  style={{ background: "rgba(212,175,55,0.25)" }}
                />

                <h2 className="font-bebas text-[clamp(2rem,8vw,3.2rem)] leading-[0.93] tracking-[0.02em] text-white mb-12 mx-auto max-w-md">
                  YOUR INVESTORS WILL ASK HOW THE MONEY FLOWS&nbsp;BACK.
                </h2>

                <button
                  onClick={handleStartClick}
                  className="h-[52px] px-12 btn-cta-primary mx-auto"
                >
                  BUILD YOUR WATERFALL
                </button>
              </div>
            </Card>

            {/* ════════════════════════════════════════════════════════
                FOOTER — whisper quiet
                ════════════════════════════════════════════════════════ */}
            <footer className="py-10 text-center">
              <p
                className="text-[10px] leading-[1.9] tracking-[0.04em] mx-auto max-w-sm"
                style={{ color: "rgba(255,255,255,0.12)" }}
              >
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
