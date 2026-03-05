import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import { useInView } from "@/hooks/useInView";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import MobileMenu from "@/components/MobileMenu";
/*
  PAGE STACK — v9c reorder:
    1. PILL NAV     — fixed floating, logo + hamburger
    2. HERO         — Bebas hierarchy, primary CTA
    3. WHY THIS MATTERS — 2×2 badge grid
    4. HOW IT WORKS — 5-step vertical stack
    5. WATERFALL    — static ledger + flow diagram
    6. REALITY      — blockquote + with/without check grid
    7. ARSENAL      — unified block, free/premium divider
    8. CLOSER       — final CTA
    9. FOOTER

  BACKGROUND: Pure black everywhere. Zero grids.
  CTA: All go through auth check → LeadCaptureModal if no session.
  WaterfallCascade REMOVED — replaced by static ledger visualization.
*/

const Index = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();

  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [pendingDestination, setPendingDestination] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleCTA = () => {
    haptics.medium();
    gatedNavigate("/calculator");
  };

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const reveal = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity: prefersReducedMotion || visible ? 1 : 0,
    transform: prefersReducedMotion || visible ? "translateY(0)" : "translateY(16px)",
    transition: prefersReducedMotion ? "none" : "opacity 600ms ease-out, transform 600ms ease-out",
    transitionDelay: prefersReducedMotion || delay === 0 ? "0ms" : `${delay}ms`,
  });

  /* ── Scroll refs ── */
  const { ref: heroRef, inView: heroVisible } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { ref: waterfallRef, inView: waterfallVisible } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { ref: whyRef, inView: whyVisible } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { ref: realityRef, inView: realityVisible } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { ref: stepsRef, inView: stepsVisible } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { ref: arsenalRef, inView: arsenalVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: closerRef, inView: closerVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const { ref: footerRef, inView: footerVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });

  /* ── Data ── */
  const waterfallTiers = [
    { num: "01", name: "CAM Fee",                amt: "— $30,000"    },
    { num: "02", name: "Sales Agent Fee (10%)",  amt: "— $300,000"   },
    { num: "03", name: "Sales Agent Expenses",   amt: "— $50,000"    },
    { num: "04", name: "E&O / Delivery",         amt: "— $18,000"    },
    { num: "05", name: "Senior Debt Recoupment", amt: "— $1,200,000" },
    { num: "06", name: "Mezzanine Debt",         amt: "— $300,000"   },
    { num: "07", name: "Equity Recoupment",      amt: "— $450,000"   },
    { num: "08", name: "Deferments",             amt: "— $52,000"    },
  ];

  const badgeCards = [
    { num: "1", title: "Investors Will Ask", body: "Serious money demands the model before wiring." },
    { num: "2", title: "Fees Come Off The Top", body: "All deducted before a dollar hits recoupment." },
    { num: "3", title: "Can't Negotiate Blind", body: "You can't push back on what you don't understand." },
    { num: "4", title: "Backend Needs Context", body: "The waterfall makes participation real." },
  ];

  const withItems = [
    "Model fees before they hit you",
    "Show investors exact recoupment",
    "Know what's negotiable",
    "Know break-even before you raise",
  ];
  const withoutItems = [
    "Guessing when investors ask",
    "Overpromising returns",
    "Leaving leverage on the table",
    "Backend killed after signing",
  ];

  const steps = [
    { n: "1", title: "Enter Your Budget", body: "Total budget, cash basis after deferments and tax credits, investor equity." },
    { n: "2", title: "Choose Your Scenario", body: "Streamer acquisition or traditional distribution. Guild rates adjust automatically." },
    { n: "3", title: "See the Full Waterfall", body: "Every tier with accurate rates — off-the-tops through net backend profit." },
    { n: "4", title: "Stress-Test Your Deal", body: "Adjust price, negotiate fee caps. Run it until you know what you can't give up." },
    { n: "5", title: "Export & Share", body: "Download a formatted PDF. Share directly with investors, financiers, and co-producers." },
  ];

  const freeArsenal = [
    { num: "01.", name: "11-Tier Recoupment Model", sub: "Off-the-tops through net backend profit" },
    { num: "02.", name: "Streamer + Theatrical Scenarios", sub: "Acquisition and distribution logic modeled" },
    { num: "03.", name: "Accurate Guild Rates", sub: "SAG-AFTRA, WGA, DGA residuals built in" },
    { num: "04.", name: "Tax Credit Handling", sub: "Soft money outside the waterfall, correctly" },
  ];
  const premArsenal = [
    { num: "05.", name: "SPV Structure Templates", sub: "Operating agreement frameworks built for film finance" },
    { num: "06.", name: "Capital Stack Architecture", sub: "Layer equity, soft money, and gap financing correctly" },
    { num: "07.", name: "Streamer Acquisition Comps", sub: "Market rate intelligence by genre and cast tier" },
  ];

  /* ── CTA button component ── */
  const CTAButton = () => (
    <button
      onClick={handleCTA}
      className="font-['Roboto_Mono'] font-semibold uppercase text-black"
      style={{
        background: "#F9E076",
        padding: "17px 48px",
        letterSpacing: "0.18em",
        fontSize: "13px",
        borderRadius: "8px",
        boxShadow:
          "0 0 0 1px rgba(249,224,118,0.40), 0 0 28px rgba(249,224,118,0.40), 0 0 64px rgba(249,224,118,0.18)",
        display: "inline-block",
      }}
    >
      RUN MY WATERFALL
    </button>
  );

  /* ── Eyebrow ruled component ── */
  const EyebrowRuled = ({ text }: { text: string }) => (
    <div className="flex items-center gap-3 mb-[14px]">
      <div className="flex-1 h-px" style={{ background: "rgba(212,175,55,0.40)" }} />
      <span className="font-['Roboto_Mono'] text-[13px] tracking-[0.2em] uppercase text-[#D4AF37] whitespace-nowrap">
        {text}
      </span>
      <div className="flex-1 h-px" style={{ background: "rgba(212,175,55,0.40)" }} />
    </div>
  );

  return (
    <>
      <MobileMenu isOpen={menuOpen} onOpenChange={setMenuOpen} />
      <LeadCaptureModal
        isOpen={showLeadCapture}
        onClose={() => setShowLeadCapture(false)}
        onSuccess={() => {
          setHasSession(true);
          setShowLeadCapture(false);
          navigate(pendingDestination || "/calculator");
        }}
      />

      <div className="min-h-screen bg-black" style={{ paddingTop: "80px" }}>

        {/* ═══════════════════════════════════════════
            PILL NAV — fixed floating
            ═══════════════════════════════════════════ */}
        <nav
          className="fixed z-50 flex items-center justify-between"
          style={{
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - 32px)",
            maxWidth: "390px",
            background: "rgba(6,6,6,0.96)",
            border: "1px solid rgba(212,175,55,0.38)",
            borderRadius: "999px",
            padding: "10px 10px 10px 24px",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 2px 24px rgba(0,0,0,0.8)",
          }}
        >
          <span className="font-['Bebas_Neue'] text-[1.4rem] tracking-[0.08em]">
            <span className="text-[#D4AF37]">filmmaker.</span>
            <span className="text-white">og</span>
          </span>
          <button
            onClick={() => { haptics.light(); setMenuOpen(true); }}
            className="w-10 h-10 rounded-full flex flex-col items-center justify-center gap-1 cursor-pointer"
            style={{
              background: "rgba(212,175,55,0.06)",
              border: "1px solid rgba(212,175,55,0.20)",
            }}
            aria-label="Menu"
          >
            <span className="block h-px w-[16px]" style={{ background: "#D4AF37" }} />
            <span className="block h-px w-[16px]" style={{ background: "#D4AF37" }} />
            <span className="block h-px w-[10px]" style={{ background: "#D4AF37" }} />
          </button>
        </nav>

        {/* ═══════════════════════════════════════════
            § 1 HERO
            ═══════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative overflow-hidden text-center"
          style={{ background: "#000", padding: "48px 24px 60px" }}
        >
          {/* Radial warmth — top only */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: "45%",
              background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.065) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-[1]" style={reveal(heroVisible)}>
            <h1
              className="font-['Bebas_Neue'] text-[5.5rem] text-white text-center mb-1"
              style={{ lineHeight: 0.86, letterSpacing: "0.01em" }}
            >
              Model Your
              <em className="not-italic text-[#D4AF37] block">Waterfall</em>
            </h1>
            <p
              className="font-['Bebas_Neue'] text-[1.9rem] text-center mb-[28px]"
              style={{ lineHeight: 1.1, color: "rgba(255,255,255,0.65)", marginTop: "8px" }}
            >
              Your Recoupment Structure Starts Here.
            </p>
            <div className="flex justify-center">
              <CTAButton />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            § 3 WHY THIS MATTERS
            ═══════════════════════════════════════════ */}
        <section
          ref={whyRef}
          className="bg-black text-center"
          style={{ padding: "52px 0 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            style={{
              padding: "20px 20px 28px",
              borderBottom: "1px solid rgba(212,175,55,0.20)",
              background: "linear-gradient(180deg, rgba(212,175,55,0.04) 0%, transparent 100%)",
            }}
          >
            <EyebrowRuled text="Why This Matters" />
            <h2 className="font-['Bebas_Neue'] text-[3rem] text-white text-center" style={{ lineHeight: 0.95 }}>
              <span style={{ color: "#D4AF37" }}>4</span> Reasons<br />You Can't Skip This
            </h2>
          </div>

          {/* 2×2 badge grid */}
          <div
            className="grid grid-cols-2 text-left"
            style={{ gap: "1px", background: "rgba(212,175,55,0.18)" }}
          >
            {badgeCards.map((card, i) => (
              <div
                key={card.num}
                className="bg-black"
                style={{
                  ...reveal(whyVisible, i * 80),
                  padding: "28px 20px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderTop: i >= 2 ? "1px solid rgba(212,175,55,0.09)" : "none",
                }}
              >
                <div
                  className="flex items-center justify-center font-['Bebas_Neue'] text-[1.2rem] text-black mb-[14px]"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#D4AF37",
                  }}
                >
                  {card.num}
                </div>
                <p className="font-['Bebas_Neue'] text-[1.25rem] text-white mb-2" style={{ lineHeight: 1 }}>
                  {card.title}
                </p>
                <p className="font-['Inter'] text-[13px]" style={{ lineHeight: 1.55, color: "rgba(255,255,255,0.58)" }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            § 4 HOW IT WORKS
            ═══════════════════════════════════════════ */}
        <section
          ref={stepsRef}
          className="bg-black"
          style={{ padding: "52px 0 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="text-center" style={{ padding: "16px 20px 28px" }}>
            <EyebrowRuled text="How it works" />
            <h2 className="font-['Bebas_Neue'] text-[3rem] text-white text-center" style={{ lineHeight: 0.95 }}>
              Build in <span style={{ color: "#D4AF37" }}>Minutes</span>
            </h2>
          </div>

          <div className="flex flex-col text-left" style={{ gap: "1px", background: "rgba(255,255,255,0.06)" }}>
            {steps.map((step, i) => (
              <div
                key={step.n}
                className="grid bg-black"
                style={{
                  ...reveal(stepsVisible, i * 80),
                  gridTemplateColumns: "52px 1fr",
                }}
              >
                {/* Number column */}
                <div
                  className="relative flex items-start justify-center"
                  style={{
                    background: "#0a0a0a",
                    borderRight: "1px solid rgba(212,175,55,0.20)",
                    paddingTop: "18px",
                  }}
                >
                  {/* Vertical connector line — runs full height of column */}
                  <div
                    className="absolute"
                    style={{
                      top: 0,
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "1px",
                      background: "rgba(212,175,55,0.20)",
                      zIndex: 0,
                    }}
                  />
                  {/* Number badge — sits on top of line with background break */}
                  <div
                    className="relative z-[1] flex items-center justify-center"
                    style={{
                      background: "#0a0a0a",
                      paddingTop: "2px",
                      paddingBottom: "2px",
                    }}
                  >
                    <span className="font-['Bebas_Neue'] text-[1.4rem] text-[#D4AF37]">{step.n}</span>
                  </div>
                  {/* Chevron arrow */}
                  <div
                    className="absolute"
                    style={{
                      right: "-10px",
                      top: "24px",
                      width: 0,
                      height: 0,
                      borderTop: "11px solid transparent",
                      borderBottom: "11px solid transparent",
                      borderLeft: "10px solid #0a0a0a",
                      zIndex: 2,
                    }}
                  />
                </div>
                {/* Content */}
                <div style={{ padding: "22px 18px 22px 24px" }}>
                  <p className="font-['Bebas_Neue'] text-[1.45rem] text-white mb-[5px]" style={{ lineHeight: 1 }}>
                    {step.title}
                  </p>
                  <p className="font-['Inter'] text-[13px]" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.55 }}>
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            § 5 WATERFALL
            ═══════════════════════════════════════════ */}
        <section
          ref={waterfallRef}
          className="bg-black"
          style={{ padding: "36px 0 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="text-center" style={{ padding: "0 20px 24px" }}>
            <EyebrowRuled text="How the money flows" />
            <h2 className="font-['Bebas_Neue'] text-[3rem] text-white text-center" style={{ lineHeight: 0.95 }}>
              The Recoupment<br /><span style={{ color: "#D4AF37" }}>Waterfall</span>
            </h2>
          </div>

          {/* Acquisition callout */}
          <div
            className="relative overflow-hidden text-center"
            style={{
              ...reveal(waterfallVisible),
              margin: "0 20px 10px",
              background: "#0a0a0a",
              border: "1px solid rgba(212,175,55,0.20)",
              borderRadius: "12px",
              padding: "18px 16px",
            }}
          >
            {/* Gold top-line gradient */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.50), transparent)" }}
            />
            <p className="font-['Roboto_Mono'] text-[11px] uppercase tracking-[0.14em] text-[#D4AF37] mb-1">
              Streamer Acquisition Price
            </p>
            <p className="font-['Roboto_Mono'] text-[11px] tracking-[0.06em] mb-2" style={{ color: "rgba(255,255,255,0.28)" }}>
              Tier 2 Action Thriller — Example
            </p>
            <p className="font-['Bebas_Neue'] text-[2.4rem] text-[#D4AF37]" style={{ lineHeight: 1, letterSpacing: "0.02em" }}>
              $3,000,000
            </p>
          </div>

          {/* Waterfall tiers */}
          <div
            className="overflow-hidden"
            style={{
              ...reveal(waterfallVisible, 100),
              margin: "0 20px 0",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "12px",
            }}
          >
            {waterfallTiers.map((tier, i) => (
              <div
                key={tier.num}
                className="grid items-center"
                style={{
                  gridTemplateColumns: "28px 1fr auto",
                  gap: "12px",
                  padding: "15px 16px",
                  borderBottom: i < waterfallTiers.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                <span className="font-['Roboto_Mono'] text-[12px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {tier.num}
                </span>
                <span className="font-['Roboto_Mono'] text-[15px]" style={{ color: "rgba(255,255,255,0.75)" }}>
                  {tier.name}
                </span>
                <span className="font-['Roboto_Mono'] text-[15px] text-right whitespace-nowrap" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {tier.amt}
                </span>
              </div>
            ))}
          </div>

          {/* Flow diagram */}
          <div style={{ ...reveal(waterfallVisible, 200), margin: "16px 20px 0" }}>
            {/* Tank master */}
            <div
              className="relative text-center"
              style={{
                background: "#000",
                border: "1px solid rgba(212,175,55,0.35)",
                borderRadius: "12px",
                padding: "24px 20px",
                zIndex: 2,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
                  borderRadius: "12px 12px 0 0",
                }}
              />
              <p className="font-['Roboto_Mono'] text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: "rgba(255,255,255,0.70)" }}>
                Net Backend Profit
              </p>
              <p className="font-['Bebas_Neue'] text-[3.2rem] text-[#D4AF37]" style={{ lineHeight: 0.9, letterSpacing: "0.02em" }}>
                $600,000
              </p>
            </div>

            {/* Pipe network */}
            <div className="flex flex-col items-center" style={{ marginTop: "-1px", position: "relative", zIndex: 1 }}>
              <div className="w-[2px] h-[18px]" style={{ background: "rgba(212,175,55,0.50)" }} />
              <div className="flex" style={{ width: "calc(50% + 10px)" }}>
                <div
                  className="flex-1"
                  style={{
                    height: "18px",
                    borderTop: "2px solid rgba(212,175,55,0.50)",
                    borderLeft: "2px solid rgba(212,175,55,0.50)",
                    borderRadius: "6px 0 0 0",
                  }}
                />
                <div
                  className="flex-1"
                  style={{
                    height: "18px",
                    borderTop: "2px solid rgba(212,175,55,0.50)",
                    borderRight: "2px solid rgba(212,175,55,0.50)",
                    borderRadius: "0 6px 0 0",
                  }}
                />
              </div>
            </div>

            {/* Buckets */}
            <div className="flex gap-[10px]" style={{ marginTop: "-1px" }}>
              {[
                { label: "Investor", amount: "$300,000", pct: "50% of backend" },
                { label: "Producer", amount: "$300,000", pct: "50% of backend" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex-1 text-center"
                  style={{
                    background: "#0a0a0a",
                    border: "1px solid rgba(212,175,55,0.20)",
                    borderTop: "2px solid #D4AF37",
                    borderRadius: "0 0 10px 10px",
                    padding: "16px 12px",
                  }}
                >
                  <p className="font-['Roboto_Mono'] text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: "rgba(255,255,255,0.70)" }}>
                    {b.label}
                  </p>
                  <p className="font-['Bebas_Neue'] text-[2rem] text-[#D4AF37]" style={{ lineHeight: 1 }}>
                    {b.amount}
                  </p>
                  <p className="font-['Roboto_Mono'] text-[11px] mt-[5px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                    {b.pct}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <p
            className="font-['Roboto_Mono'] text-[11px] uppercase text-center"
            style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em", padding: "12px 20px 52px" }}
          >
            Model only — your numbers will differ
          </p>
        </section>

        {/* ═══════════════════════════════════════════
            § 6 REALITY (WITH / WITHOUT)
            ═══════════════════════════════════════════ */}
        <section
          ref={realityRef}
          className="bg-black text-left"
          style={{ padding: "52px 20px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Blockquote */}
          <blockquote
            className="font-['Bebas_Neue'] text-[2.4rem] mb-6"
            style={{
              ...reveal(realityVisible),
              lineHeight: 0.95,
              color: "rgba(255,255,255,0.92)",
              borderLeft: "3px solid #D4AF37",
              paddingLeft: "20px",
            }}
          >
            The waterfall either costs you now — or costs you everything <span style={{ color: "#D4AF37" }}>later</span>.
          </blockquote>

          {/* Check grid */}
          <div
            className="grid grid-cols-2 overflow-hidden"
            style={{
              ...reveal(realityVisible, 100),
              gap: "1px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "8px",
            }}
          >
            {/* WITH column */}
            <div className="bg-black">
              <div className="px-[16px] py-[11px]" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="font-['Bebas_Neue'] text-[1.5rem] text-[#D4AF37]" style={{ letterSpacing: "0.04em" }}>
                  WITH
                </span>
              </div>
              {withItems.map((item, i) => (
                <div
                  key={i}
                  className="grid items-start"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "22px 1fr",
                    gap: "10px",
                    padding: "14px 16px",
                    borderBottom: i < withItems.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    fontSize: "15px",
                    lineHeight: 1.4,
                  }}
                >
                  <span className="font-['Roboto_Mono'] text-[22px] flex-shrink-0 text-[#D4AF37]" style={{ paddingTop: "2px" }}>✓</span>
                  <span style={{ color: "rgba(255,255,255,0.58)" }}>{item}</span>
                </div>
              ))}
            </div>

            {/* WITHOUT column */}
            <div className="bg-black" style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="px-[16px] py-[11px]" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="font-['Bebas_Neue'] text-[1.5rem]" style={{ letterSpacing: "0.04em", color: "rgba(255,255,255,0.55)" }}>
                  WITHOUT
                </span>
              </div>
              {withoutItems.map((item, i) => (
                <div
                  key={i}
                  className="grid items-start"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "22px 1fr",
                    gap: "10px",
                    padding: "14px 16px",
                    borderBottom: i < withoutItems.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    fontSize: "15px",
                    lineHeight: 1.4,
                  }}
                >
                  <span className="font-['Roboto_Mono'] text-[22px] flex-shrink-0" style={{ color: "rgba(255,80,80,0.85)", paddingTop: "2px" }}>✗</span>
                  <span style={{ color: "rgba(255,255,255,0.55)" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            § 7 THE ARSENAL
            ═══════════════════════════════════════════ */}
        <section
          ref={arsenalRef}
          className="bg-black text-center"
          style={{ padding: "52px 0 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div style={{ padding: "0 20px 24px" }}>
            <EyebrowRuled text="What you get" />
            <h2 className="font-['Bebas_Neue'] text-[3rem] text-white text-center" style={{ lineHeight: 0.95 }}>
              The Arsenal
            </h2>
            <p className="font-['Inter'] text-[13px] mt-[10px]" style={{ color: "rgba(255,255,255,0.70)", lineHeight: 1.6 }}>
              The math is free. The execution strategy is premium.
            </p>
          </div>

          {/* Unified arsenal block */}
          <div
            className="relative overflow-hidden text-left"
            style={{
              ...reveal(arsenalVisible),
              margin: "0 20px",
              border: "1px solid rgba(212,175,55,0.50)",
              borderRadius: "12px",
              background: "#000",
              boxShadow: "0 8px 32px rgba(212,175,55,0.10)",
            }}
          >
            {/* Gold top line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }}
            />

            {/* Block header */}
            <div
              className="flex items-end justify-between"
              style={{
                padding: "16px 18px",
                borderBottom: "1px solid rgba(212,175,55,0.20)",
                background: "linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.02) 100%)",
              }}
            >
              <div>
                <p className="font-['Roboto_Mono'] text-[11px] uppercase tracking-[0.16em] text-[#D4AF37] mb-1">
                  Executive Playbook
                </p>
                <p className="font-['Bebas_Neue'] text-[1.6rem] text-white" style={{ lineHeight: 1 }}>
                  Full Access
                </p>
              </div>
              <span
                className="font-['Roboto_Mono'] text-[10px] uppercase self-center"
                style={{
                  letterSpacing: "0.1em",
                  color: "rgba(212,175,55,0.65)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  padding: "5px 14px",
                  borderRadius: "20px",
                }}
              >
                Free to start
              </span>
            </div>

            {/* FREE ITEMS (01–04) — same treatment as premium */}
            {freeArsenal.map((item) => (
              <div
                key={item.num}
                className="grid items-start"
                style={{
                  gridTemplateColumns: "28px 1fr",
                  gap: "12px",
                  padding: "14px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <span className="font-['Roboto_Mono'] text-[10px] text-right pt-[2px] text-[#D4AF37]">
                  {item.num}
                </span>
                <div>
                  <p className="font-['Inter'] text-[15px] font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
                    {item.name}
                  </p>
                </div>
              </div>
            ))}

            {/* DIVIDER — the upgrade moment */}
            <div
              className="relative flex items-center"
              style={{
                borderTop: "1px solid rgba(212,175,55,0.20)",
                borderBottom: "1px solid rgba(212,175,55,0.20)",
                background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.07), transparent)",
                padding: "10px 18px",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.50), transparent)" }}
              />
              <span className="font-['Roboto_Mono'] text-[11px] uppercase tracking-[0.18em] text-[#D4AF37]">
                Premium adds
              </span>
              <span
                className="ml-auto font-['Roboto_Mono'] text-[10px] uppercase text-black"
                style={{
                  letterSpacing: "0.1em",
                  background: "#D4AF37",
                  padding: "5px 14px",
                  borderRadius: "3px",
                }}
              >
                Upgrade
              </span>
            </div>

            {/* PREMIUM ITEMS (05–07) — same treatment as free */}
            {premArsenal.map((item, i) => (
              <div
                key={item.num}
                className="grid items-start"
                style={{
                  gridTemplateColumns: "28px 1fr",
                  gap: "12px",
                  padding: "18px 20px",
                  borderBottom: i < premArsenal.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                <span className="font-['Roboto_Mono'] text-[10px] text-right pt-[2px] text-[#D4AF37]">
                  {item.num}
                </span>
                <div>
                  <p className="font-['Inter'] text-[15px] font-medium mb-[3px]" style={{ color: "rgba(255,255,255,0.85)" }}>
                    {item.name}
                  </p>
                  <p className="font-['Inter'] text-[13px]" style={{ lineHeight: 1.4, color: "rgba(255,255,255,0.55)" }}>
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            § 8 CLOSER
            ═══════════════════════════════════════════ */}
        <section
          ref={closerRef}
          data-section="closer"
          className="relative overflow-hidden text-center"
          style={{
            padding: "64px 24px 72px",
            borderTop: "1px solid rgba(212,175,55,0.20)",
            background: "#000",
          }}
        >
          {/* Radial glow from bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: "65%",
              background: "radial-gradient(ellipse 100% 70% at 50% 100%, rgba(212,175,55,0.08) 0%, transparent 65%)",
            }}
          />
          <div
            style={{
              ...reveal(closerVisible),
              border: "1px solid rgba(212,175,55,0.42)",
              borderRadius: "16px",
              padding: "40px 28px",
              background: "rgba(212,175,55,0.06)",
              maxWidth: "360px",
              margin: "0 auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Gold top-line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.65), transparent)" }}
            />
            <p
              className="font-['Roboto_Mono'] text-[13px] uppercase text-center mb-[10px]"
              style={{ letterSpacing: "0.18em", color: "rgba(212,175,55,0.90)" }}
            >
              Ready to run the numbers
            </p>
            <h2
              className="font-['Bebas_Neue'] text-[4.5rem] text-white text-center"
              style={{ lineHeight: 0.9, margin: "12px 0 20px" }}
            >
              The Room<br />
              <span className="text-[#D4AF37] block">Will Ask.</span>
            </h2>
            <p
              className="font-['Inter'] text-[14px] mx-auto mb-7"
              style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.65, maxWidth: "280px" }}
            >
              Stop guessing your backend. Build the model and walk into every pitch knowing exactly where the money goes.
            </p>
            <CTAButton />
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════ */}
        <footer
          ref={footerRef}
          style={{
            background: "#0a0a0a",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "24px 20px",
          }}
        >
          <div style={reveal(footerVisible)}>
            <p className="font-['Inter'] text-[11px] text-center" style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}>
              filmmaker.og provides financial modeling tools for educational purposes. This is not legal or financial advice. Consult qualified counsel before executing any investment structure.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
