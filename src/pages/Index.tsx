import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import { useInView } from "@/hooks/useInView";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import WaterfallCascade from "@/components/WaterfallCascade";

/* ═══════════════════════════════════════════════════════════════════
   CARD — reusable slide-style content unit (Gamma-style)
   bg alternation creates separation; borders are optional + subtle.
   ═══════════════════════════════════════════════════════════════════ */
const Card = ({
  children,
  bg = "#111111",
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  bg?: string;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={className}
    style={{
      background: bg,
      borderRadius: "8px",
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
          transform: visible ? "translateY(0)" : "translateY(8px)",
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
          {/* Container — all cards stack inside this */}
          <div className="w-full max-w-2xl px-4 md:px-6 flex flex-col gap-2 py-4">

            {/* ════════════════════════════════════════════════════════
                HERO CARD — tall, centered, confident
                ════════════════════════════════════════════════════════ */}
            <Card bg="#111111" className="px-8 py-20 md:px-14 md:py-28 text-center">
              <p
                className="font-mono text-[11px] uppercase tracking-[0.25em] mb-8"
                style={{ color: "rgba(255,255,255,0.30)" }}
              >
                Film Finance Simulator
              </p>

              <h1 className="font-bebas text-[clamp(3rem,11vw,5rem)] leading-[0.93] tracking-[0.015em] text-white mb-6 mx-auto max-w-md">
                SEE WHERE EVERY DOLLAR GOES
              </h1>

              <p
                className="text-[16px] md:text-[17px] leading-[1.75] mx-auto max-w-sm mb-12"
                style={{ color: "rgba(255,255,255,0.45)" }}
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
                STATS STRIP — three data points, institutional feel
                ════════════════════════════════════════════════════════ */}
            <Card bg="transparent" className="px-8 py-5 md:px-14">
              <div className="flex justify-center gap-10 md:gap-16">
                {([
                  { value: "5", label: "Deduction tiers" },
                  { value: "50/50", label: "Profit split" },
                  { value: "PDF", label: "Export ready" },
                ]).map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-mono text-[15px] font-medium text-gold tabular-nums">
                      {stat.value}
                    </p>
                    <p
                      className="font-mono text-[10px] uppercase tracking-[0.18em] mt-1"
                      style={{ color: "rgba(255,255,255,0.20)" }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* ════════════════════════════════════════════════════════
                WATERFALL CARD — the product showcase, ledger feel
                ════════════════════════════════════════════════════════ */}
            <Card bg="#111111" className="px-8 py-12 md:px-14 md:py-16">
              <p
                className="font-mono text-[11px] uppercase tracking-[0.25em] mb-10"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                Example Waterfall
              </p>
              <WaterfallCascade />
            </Card>

            {/* ════════════════════════════════════════════════════════
                EDUCATION CARD — what is this tool
                ════════════════════════════════════════════════════════ */}
            <Card bg="#0A0A0A" className="px-8 py-14 md:px-14 md:py-20">
              <div className="max-w-lg">
                <h2 className="font-bebas text-[clamp(1.8rem,7vw,2.8rem)] leading-[0.96] tracking-[0.02em] text-white mb-8">
                  KNOW YOUR DEAL BEFORE YOU SIGN&nbsp;IT
                </h2>

                <div className="space-y-5">
                  <p
                    className="text-[16px] leading-[1.8]"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    Every film deal has a pecking order — distributors, sales agents,
                    lenders, and investors all get paid before you do.
                    That's called a <span className="text-gold font-medium">waterfall</span>.
                  </p>
                  <p
                    className="text-[16px] leading-[1.8]"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    This tool lets you model yours before you sign anything.
                    Run it as many times as you want. Premium unlocks extended
                    scenarios, financial modeling, and PDF exports.
                  </p>
                </div>

                <a
                  href="/resources?tab=waterfall"
                  className="inline-block mt-8 font-mono text-[13px] tracking-[0.06em] text-gold-cta hover:opacity-70 transition-opacity"
                >
                  What's a waterfall? {"\u2192"}
                </a>
              </div>
            </Card>

            {/* ════════════════════════════════════════════════════════
                VALUE PROP — With / Without, two cards side-by-side on md+
                ════════════════════════════════════════════════════════ */}
            <div ref={valueRef} className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* WITH — confident, present */}
              <Card bg="#111111" className="px-8 py-12 md:px-10 md:py-14">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold mb-8">
                  With your waterfall
                </p>
                <ul className="space-y-7">
                  {([
                    { title: "Returns mapped", desc: "Every investor sees exactly what they get back — and when." },
                    { title: "Nothing hidden", desc: "Fees, splits, and repayment order — all visible before you commit." },
                    { title: "Your margins, confirmed", desc: "Run the numbers on your backend points before you shoot a frame." },
                  ]).map((item, i) => (
                    <li key={item.title} style={anim(i, valueVisible)}>
                      <p className="text-[15px] font-medium text-white leading-snug mb-1.5">{item.title}</p>
                      <p className="text-[14px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.40)" }}>{item.desc}</p>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* WITHOUT — recessive, dimmed */}
              <Card bg="#080808" className="px-8 py-12 md:px-10 md:py-14">
                <p
                  className="font-mono text-[11px] uppercase tracking-[0.25em] mb-8"
                  style={{ color: "rgba(255,255,255,0.15)" }}
                >
                  Without one
                </p>
                <ul className="space-y-7">
                  {([
                    { title: "The question you can't answer", desc: "'How do I get my money back?' — and you're improvising." },
                    { title: "Surprises after signatures", desc: "Fees and splits you didn't model surface after the deal closes." },
                    { title: "First-deal math", desc: "Your backend points were worth nothing after the sales agent commission you forgot to model." },
                  ]).map((item, i) => (
                    <li key={item.title} style={anim(3 + i, valueVisible)}>
                      <p className="text-[14px] font-medium leading-snug mb-1.5" style={{ color: "rgba(255,255,255,0.40)" }}>{item.title}</p>
                      <p className="text-[13px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.22)" }}>{item.desc}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* ════════════════════════════════════════════════════════
                PULL QUOTE — one line, maximum confidence
                ════════════════════════════════════════════════════════ */}
            <Card bg="transparent" className="px-8 py-10 md:px-14 md:py-14 text-center">
              <p
                className="font-mono text-[13px] md:text-[14px] leading-[1.8] tracking-[0.02em] italic mx-auto max-w-md"
                style={{ color: "rgba(255,255,255,0.30)" }}
              >
                "Institutional-grade tools shouldn't cost institutional-grade&nbsp;fees."
              </p>
            </Card>

            {/* ════════════════════════════════════════════════════════
                CLOSER CTA — the conversion moment
                ════════════════════════════════════════════════════════ */}
            <Card
              bg="#111111"
              className="px-8 py-16 md:px-14 md:py-24 text-center"
              style={{
                borderTop: "1px solid rgba(212,175,55,0.08)",
              }}
            >
              <div
                ref={closerRef}
                style={{
                  opacity: prefersReducedMotion || closerVisible ? 1 : 0,
                  transform: prefersReducedMotion || closerVisible ? "translateY(0)" : "translateY(12px)",
                  transition: prefersReducedMotion ? "none" : "opacity 800ms ease-out, transform 800ms ease-out",
                }}
              >
                <h2 className="font-bebas text-[clamp(2rem,8vw,3rem)] leading-[0.95] tracking-[0.02em] text-white mb-10 mx-auto max-w-md">
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
                FOOTER
                ════════════════════════════════════════════════════════ */}
            <footer className="px-8 py-8 md:px-14 text-center">
              <p
                className="text-[11px] leading-[1.8] tracking-wide mx-auto max-w-md"
                style={{ color: "rgba(255,255,255,0.15)" }}
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
