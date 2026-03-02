import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import { useInView } from "@/hooks/useInView";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import WaterfallCascade from "@/components/WaterfallCascade";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

/* ═══════════════════════════════════════════════════════════════════
   CARD — sharp-edged unit, token-based gold on void-black.
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
    className={`rounded-none overflow-hidden ${className}`}
    style={{
      background: "rgba(255,255,255,0.06)",
      border: accent
        ? "1px solid rgba(212,175,55,0.35)"
        : "1px solid rgba(212,175,55,0.35)",
      boxShadow: accent ? "inset 0 1px 0 rgba(212,175,55,0.08)" : "none",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   DIVIDER — gradient gold line between sections.
   ═══════════════════════════════════════════════════════════════════ */
const Divider = () => (
  <div
    className="h-[1px] w-full"
    style={{
      background:
        "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.35) 50%, transparent 100%)",
    }}
  />
);

/* ═══════════════════════════════════════════════════════════════════
   EVIDENCE PANEL — gold label → body → divider → punchline
   ═══════════════════════════════════════════════════════════════════ */
const EvidencePanel = ({
  label,
  body,
  punchline,
  loud,
  style = {},
}: {
  label: string;
  body: string;
  punchline: string;
  loud: boolean;
  style?: React.CSSProperties;
}) => (
  <div
    className="rounded-none p-5 md:p-6"
    style={{
      background: "rgba(255,255,255,0.06)",
      border: loud
        ? "1px solid rgba(212,175,55,0.35)"
        : "1px solid rgba(212,175,55,0.35)",
      ...style,
    }}
  >
    <p className="font-mono text-sm uppercase tracking-[0.14em] text-gold-full mb-4">
      {label}
    </p>
    <p className="text-sm md:text-base leading-relaxed text-white-body mb-4">
      {body}
    </p>
    <div
      className="h-[1px] w-full mb-4"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.35) 50%, transparent 100%)",
      }}
    />
    <p
      className={`text-sm md:text-base leading-relaxed ${
        loud ? "text-white font-semibold" : "text-white-primary"
      }`}
    >
      {punchline}
    </p>
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
  const { ref: evidenceRef, inView: evidenceVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const { ref: interstitialRef, inView: interstitialVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });

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

  const evidencePanels = [
    {
      label: "THE REAL RISK",
      body: "The risk isn't that your film flops. The risk is that your film performs and you still don't see a dollar — because you signed a deal without understanding the math underneath it.",
      punchline: "Performance doesn't guarantee profit. Structure does.",
      loud: false,
    },
    {
      label: "NEGOTIATING BLIND",
      body: "Sales agents take 15-25% off the top. CAM fees eat another 1-2% of gross. The distributor takes their fee before your investors see anything. If you don't know these numbers going in, you're not negotiating.",
      punchline: "You're guessing.",
      loud: true,
    },
    {
      label: 'THE "MY FILM IS DIFFERENT" PROBLEM',
      body: "Every filmmaker believes their project will outperform the market. The waterfall doesn't care. Plug in real commissions, real distribution fees, real numbers — and the model shows what has to be true for your project to work.",
      punchline: "Better to find that out now than after you've spent someone else's money.",
      loud: false,
    },
    {
      label: "THE MEETING YOU'RE NOT READY FOR",
      body: "You walk into an investor meeting. They ask where their money sits in the recoupment stack. If you can't answer that in 30 seconds with actual numbers, the meeting is over.",
      punchline: "They just won't tell you it's over.",
      loud: true,
    },
  ];

  const faqItems = [
    {
      q: "What is a waterfall in film finance?",
      a: "A waterfall is the contractual order in which revenue from a film is distributed. It dictates who gets paid first — typically distributors and sales agents — and how much is left for investors and producers after all fees and recoupment tiers are satisfied.",
    },
    {
      q: "Who needs this tool?",
      a: "Independent producers, filmmakers seeking financing, entertainment attorneys reviewing deal structures, and investors evaluating film projects. Anyone who needs to understand where the money goes before signing a deal.",
    },
    {
      q: "Do I really need a calculator for this?",
      a: "You don't — if you already have an entertainment attorney on retainer, a completion bond company modeling your cash flow, and a sales agent who'll show you the real commission structure before you sign. Most producers don't have any of those. This is the starting point.",
    },
    {
      q: "Why should I run scenarios before I shoot?",
      a: "Your budget is a bet. The waterfall tells you what that bet needs to pay off. A $2.5M film that needs to earn $6M to break even is a fundamentally different proposition than one that breaks even at $3.2M. Running conservative and optimistic scenarios before you're contractually bound is the difference between informed risk and blind faith.",
    },
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
          <div className="w-full max-w-xl px-5 md:px-8 flex flex-col gap-4 py-6">

            {/* ════════════════════════════════════════════════════════
                1. HERO CARD
                ════════════════════════════════════════════════════════ */}
            <Card
              accent
              className="px-6 py-10 md:px-8 md:py-14 text-center"
              style={{
                background: "radial-gradient(ellipse at center top, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.04) 40%, rgba(212,175,55,0.02) 100%)",
                border: "1px solid rgba(212,175,55,0.35)",
                boxShadow: "inset 0 1px 0 rgba(212,175,55,0.08)",
              }}
            >
              <p className="font-mono text-sm uppercase tracking-[0.20em] mb-6 text-gold-full">
                Film Finance Simulator
              </p>

              <h1 className="font-bebas text-4xl md:text-5xl lg:text-6xl leading-[0.96] tracking-tight text-white mb-4">
                SEE WHERE EVERY DOLLAR GOES
              </h1>

              <p className="text-base md:text-lg leading-[1.7] text-white-primary tracking-[0.02em] mx-auto max-w-sm mb-8" style={{ textWrap: "balance" as never }}>
                Model your waterfall. Know every fee, split, and&nbsp;return
                — before your investor asks.
              </p>

              <div className="w-full max-w-[300px] mx-auto">
                <button
                  onClick={handleStartClick}
                  className={`w-full px-8 py-4 rounded-sm btn-cta-primary font-bold${ctaGlow ? " animate-cta-glow-pulse" : ""}`}
                >
                  BUILD YOUR WATERFALL
                </button>
              </div>
            </Card>

            <Divider />

            {/* ════════════════════════════════════════════════════════
                2. WATERFALL CARD
                ════════════════════════════════════════════════════════ */}
            <Card accent className="px-5 py-6 md:px-6 md:py-8">
              <p className="max-w-2xl mx-auto text-center text-white-body text-sm md:text-base leading-relaxed mb-8">
                The waterfall dictates who gets paid first, who gets paid last, and how much is left by the time it reaches you.
              </p>
              <WaterfallCascade />
            </Card>

            <Divider />

            {/* ════════════════════════════════════════════════════════
                INTERSTITIAL — between waterfall and education
                ════════════════════════════════════════════════════════ */}
            <div
              ref={interstitialRef}
              className="py-12 px-6"
              style={{
                opacity: prefersReducedMotion || interstitialVisible ? 1 : 0,
                transform: prefersReducedMotion || interstitialVisible ? "translateY(0)" : "translateY(16px)",
                transition: prefersReducedMotion ? "none" : "opacity 500ms ease-out, transform 500ms ease-out",
              }}
            >
              <p className="text-center text-white font-semibold text-base md:text-lg tracking-wide max-w-xl mx-auto">
                Run the numbers before you sign. Not after.
              </p>
            </div>

            <Divider />

            {/* ════════════════════════════════════════════════════════
                3A. EDUCATION CARD — why this matters
                ════════════════════════════════════════════════════════ */}
            <Card className="px-6 py-8 md:px-8 md:py-10">
              <p className="font-mono text-sm uppercase tracking-[0.20em] text-gold-full mb-5">
                Why This Matters
              </p>

              <h2 className="font-bebas text-2xl md:text-3xl leading-[1.05] tracking-wide text-white mb-5">
                KNOW YOUR DEAL BEFORE YOU SIGN&nbsp;IT
              </h2>

              <p className="text-sm md:text-base leading-relaxed text-white-body">
                Every film deal has a pecking order — distributors, sales agents,
                lenders, and investors all get paid before you do.
                That's called a <span className="text-gold-full font-medium">waterfall</span>.
              </p>

              <a
                href="/resources?tab=waterfall"
                className="inline-block mt-6 font-mono text-sm tracking-[0.06em] text-gold-cta hover:opacity-70 transition-opacity"
              >
                What's a waterfall? {"\u2192"}
              </a>
            </Card>

            {/* ════════════════════════════════════════════════════════
                3B. TOOL CARD — what you get
                ════════════════════════════════════════════════════════ */}
            <Card className="px-6 py-8 md:px-8 md:py-10">
              <p className="font-mono text-sm uppercase tracking-[0.20em] text-gold-full mb-5">
                What You Get
              </p>

              <h2 className="font-bebas text-2xl md:text-3xl leading-[1.05] tracking-wide text-white mb-5">
                MODEL YOURS BEFORE YOU SIGN&nbsp;ANYTHING
              </h2>

              <p className="text-sm md:text-base leading-relaxed text-white-body">
                This tool lets you build your own waterfall — map every fee,
                split, and repayment tier. Premium unlocks extended scenarios,
                financial modeling, and PDF&nbsp;exports.
              </p>
            </Card>

            <Divider />

            {/* ════════════════════════════════════════════════════════
                4. EVIDENCE PANELS — 2x2 grid
                ════════════════════════════════════════════════════════ */}
            <div ref={evidenceRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evidencePanels.map((panel, i) => (
                <EvidencePanel
                  key={panel.label}
                  {...panel}
                  style={{
                    opacity: prefersReducedMotion || evidenceVisible ? 1 : 0,
                    transform: prefersReducedMotion || evidenceVisible ? "translateY(0)" : "translateY(16px)",
                    transition: prefersReducedMotion ? "none" : "opacity 500ms ease-out, transform 500ms ease-out",
                    transitionDelay: prefersReducedMotion ? "0ms" : `${i * 150}ms`,
                  }}
                />
              ))}
            </div>

            <Divider />

            {/* ════════════════════════════════════════════════════════
                5. WITH / WITHOUT WATERFALL
                ════════════════════════════════════════════════════════ */}
            <div ref={valueRef} className="flex flex-col gap-4">
              <Card
                className="px-5 py-6 md:px-6 md:py-8"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(212,175,55,0.35)",
                }}
              >
                <h2 className="font-mono text-sm tracking-[0.14em] uppercase text-white-primary mb-6">
                  With your waterfall
                </h2>
                <ul className="flex flex-col gap-5" aria-label="Benefits of using a waterfall">
                  {withItems.map((item, i) => (
                    <li
                      key={item.title}
                      className="flex items-start gap-4"
                      style={{
                        opacity: prefersReducedMotion || valueVisible ? 1 : 0,
                        transform: prefersReducedMotion || valueVisible ? "translateY(0)" : "translateY(16px)",
                        transition: prefersReducedMotion ? "none" : "opacity 500ms ease-out, transform 500ms ease-out",
                        transitionDelay: prefersReducedMotion ? "0ms" : `${i * 150}ms`,
                      }}
                    >
                      <div
                        className="flex-shrink-0 w-9 h-9 rounded-none flex items-center justify-center mt-0.5"
                        style={{
                          background: "linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)",
                        }}
                      >
                        <span className="text-black text-[18px] font-bold leading-none" aria-hidden="true">{"\u2713"}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white-primary leading-snug">{item.title}</p>
                        <p className="text-sm text-white-body leading-relaxed mt-1">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card
                className="px-5 py-6 md:px-6 md:py-8"
                style={{
                  background: "rgba(220,60,60,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <h2 className="font-mono text-sm tracking-[0.14em] uppercase mb-6 text-white-primary">
                  Without a waterfall
                </h2>
                <ul className="flex flex-col gap-5" aria-label="Risks without a waterfall">
                  {withoutItems.map((item, i) => (
                    <li
                      key={item.title}
                      className="flex items-start gap-4"
                      style={{
                        opacity: prefersReducedMotion || valueVisible ? 1 : 0,
                        transform: prefersReducedMotion || valueVisible ? "translateY(0)" : "translateY(16px)",
                        transition: prefersReducedMotion ? "none" : "opacity 500ms ease-out, transform 500ms ease-out",
                        transitionDelay: prefersReducedMotion ? "0ms" : `${(withItems.length + i + 1) * 150}ms`,
                      }}
                    >
                      <div
                        className="flex-shrink-0 w-9 h-9 rounded-none flex items-center justify-center mt-0.5"
                        style={{
                          background: "rgba(220,60,60,0.10)",
                          border: "1px solid rgba(220,60,60,0.20)",
                        }}
                      >
                        <span className="text-[16px] font-bold leading-none text-danger" aria-hidden="true">{"\u2717"}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold leading-snug text-white-primary">{item.title}</p>
                        <p className="text-sm leading-relaxed mt-1 text-white-body">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <Divider />

            {/* ════════════════════════════════════════════════════════
                6. COST SECTION — free tool framing
                ════════════════════════════════════════════════════════ */}
            <Card className="px-6 py-8 md:px-8 md:py-10 text-center">
              <p className="font-mono text-sm uppercase tracking-[0.20em] text-gold-full mb-5">
                What This Costs
              </p>

              <h2 className="font-bebas text-2xl md:text-3xl leading-[1.05] tracking-wide text-white mb-4">
                FREE
              </h2>

              <p className="max-w-2xl mx-auto text-center text-white-body text-sm leading-relaxed mt-6 mb-6">
                An entertainment attorney bills $500–$850/hr to walk you through waterfall mechanics. A sales agent will explain the structure — the one that benefits them. This gives you the financial x-ray for free, so you walk into those conversations already knowing the math.
              </p>

              <div className="w-full max-w-[300px] mx-auto mt-4">
                <button
                  onClick={handleStartClick}
                  className="w-full px-8 py-4 rounded-sm btn-cta-primary font-bold"
                >
                  BUILD YOUR WATERFALL
                </button>
              </div>
            </Card>

            <Divider />

            {/* ════════════════════════════════════════════════════════
                7. FAQ ACCORDION
                ════════════════════════════════════════════════════════ */}
            <Card className="px-6 py-8 md:px-8 md:py-10">
              <p className="font-mono text-sm uppercase tracking-[0.20em] text-gold-full mb-5">
                FAQ
              </p>

              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-b border-white-surface">
                    <AccordionTrigger className="text-white-primary text-sm md:text-base font-medium hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-white-body text-sm leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>

            <Divider />

            {/* ════════════════════════════════════════════════════════
                8. CLOSER CTA CARD
                ════════════════════════════════════════════════════════ */}
            <Card
              accent
              className="px-6 py-10 md:px-8 md:py-14 text-center"
              style={{
                border: "2px solid rgba(212,175,55,0.35)",
                background: "radial-gradient(ellipse at center 70%, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.04) 60%, transparent 100%)",
                boxShadow: "inset 0 1px 0 rgba(212,175,55,0.08)",
              }}
            >
              <div
                ref={closerRef}
                style={{
                  opacity: prefersReducedMotion || closerVisible ? 1 : 0,
                  transform: prefersReducedMotion || closerVisible ? "translateY(0)" : "translateY(16px)",
                  transition: prefersReducedMotion ? "none" : "opacity 500ms ease-out, transform 500ms ease-out",
                }}
              >
                <h2 className="font-bebas text-lg md:text-xl leading-[1.05] tracking-[0.02em] text-white mb-6">
                  YOUR INVESTORS WILL{"\u00A0"}ASK HOW THE MONEY FLOWS BACK.
                </h2>
                <div className="w-full max-w-[300px] mx-auto">
                  <button
                    onClick={handleStartClick}
                    className="w-full px-8 py-4 rounded-sm btn-cta-primary font-bold animate-cta-glow-pulse"
                  >
                    BUILD YOUR WATERFALL
                  </button>
                </div>
              </div>
            </Card>

            {/* ════════════════════════════════════════════════════════
                9. FOOTER
                ════════════════════════════════════════════════════════ */}
            <footer className="pt-4 pb-6 px-4 text-center">
              <Divider />
              <p className="text-white-tertiary text-sm tracking-wide leading-relaxed mx-auto max-w-sm mt-4">
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
