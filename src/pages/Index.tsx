import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import { useInView } from "@/hooks/useInView";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { Instagram } from "lucide-react";
import { colors } from "@/lib/design-system";
/*
  PAGE STACK — v12 Producer's Cut:
    PILL NAV        — fixed floating, logo + hamburger
    § 1. HERO         — Bebas hierarchy, primary CTA
    § 2. HOW IT WORKS — 5-step vertical stepper
    § 3. WATERFALL    — acquisition callout, tier table, flow diagram
    § 4. WHY THIS MATTERS — 4 badge cards
    § 5. ARSENAL      — 3 tier cards (core/snapshot/package)
    § 6. REALITY      — blockquote + WITH/WITHOUT grid
    § 7. CLOSER       — final CTA card
    FOOTER

  CTA: All go through auth check → LeadCaptureModal if no session.
*/

const Index = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();

  const [showLeadCapture, setShowLeadCapture] = useState(false);


  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // Magic link callback landed here instead of /calculator —
        // catch it and forward. Only fires on fresh sign-in, not
        // on TOKEN_REFRESHED or returning visitors.
        if (event === 'SIGNED_IN') {
          navigate('/calculator');
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const gatedNavigate = useCallback(async (destination: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      navigate(destination);
    } else {
      setShowLeadCapture(true);
    }
  }, [navigate]);

  const handleCTA = async () => {
    haptics.medium();
    await gatedNavigate("/calculator");
  };

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const reveal = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity: prefersReducedMotion || visible ? 1 : 0,
    transform: prefersReducedMotion || visible ? "translateY(0)" : "translateY(30px)",
    transition: prefersReducedMotion
      ? "none"
      : "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
    transitionDelay: prefersReducedMotion || delay === 0 ? "0ms" : `${delay * 100}ms`,
  });

  /* ── Scroll refs ── */
  const { ref: heroRef, inView: heroVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: howRef, inView: howVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  // Waterfall — three independent pieces
  const { ref: waterfallHeaderRef, inView: waterfallHeaderVisible } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const { ref: waterfallCalloutRef, inView: waterfallCalloutVisible } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const { ref: waterfallTableRef, inView: waterfallTableVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: waterfallFlowRef, inView: waterfallFlowVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });

  const { ref: whyRef, inView: whyVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });

  // Arsenal — three independent cards
  const { ref: arsenalHeaderRef, inView: arsenalHeaderVisible } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const { ref: arsenalCoreRef, inView: arsenalCoreVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const { ref: arsenalSnapshotRef, inView: arsenalSnapshotVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const { ref: arsenalPackageRef, inView: arsenalPackageVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });

  // Reality — blockquote and grid separately
  const { ref: realityQuoteRef, inView: realityQuoteVisible } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const { ref: realityGridRef, inView: realityGridVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: closerRef, inView: closerVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const { ref: footerRef, inView: footerVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });


  /* ── Data ── */
  const waterfallTiers = [
    { num: "01", name: "CAM Fee", amt: "$30,000" },
    { num: "02", name: "Agent Commission", amt: "$300,000" },
    { num: "03", name: "Agent Expenses", amt: "$50,000" },
    { num: "04", name: "E&O / Delivery", amt: "$18,000" },
    { num: "05", name: "Senior Debt", amt: "$1,200,000" },
    { num: "06", name: "Mezzanine Debt", amt: "$300,000" },
    { num: "07", name: "Equity", amt: "$450,000" },
    { num: "08", name: "Deferments", amt: "$52,000" },
  ];

  const badgeCards = [
    { num: "1", title: "Don't Sell The Same Dollar Twice", body: "Track exactly where the money goes so you never over-promise equity and accidentally collapse your own backend." },
    { num: "2", title: "Know What You're Giving Away", body: "Every sales fee, CAMA, and deferment eats into the profit before you see a dime. See the reality before you sign." },
    { num: "3", title: "Explain The Deal Clearly", body: "Walk into the pitch with institutional-grade math. Answer recoupment questions with absolute confidence and look professional." },
    { num: "4", title: "Protect Early Investors", body: "Keep your earliest, riskiest backers from getting blindsided by senior debt and off-the-top distribution deductions." },
  ];

  const withItems = [
    "Model every fee",
    "Show exact returns",
    "Know your leverage",
    "Know break-even first",
  ];
  const withoutItems = [
    "Guessing at the table",
    "Overpromising returns",
    "Giving away leverage",
    "Backend gone at signing",
  ];

  const steps = [
    {
      title: "Enter Your Budget",
      body: "Total budget, cash basis after deferments and tax credits, investor equity.",
      icon: <svg viewBox="0 0 24 24" fill="#fff" width="22" height="22"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>,
    },
    {
      title: "Build Your Capital Stack",
      body: "Equity, debt, tax credits, deferments. Structure your financing the way real deals close.",
      icon: <svg viewBox="0 0 24 24" fill="#fff" width="22" height="22"><path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z"/></svg>,
    },
    {
      title: "Set Your Deal Terms",
      body: "Fees, guild rates, distribution costs. Every line between revenue and profit.",
      icon: <svg viewBox="0 0 24 24" fill="#fff" width="22" height="22"><rect x="3" y="4" width="18" height="3" rx="1"/><rect x="5" y="9" width="14" height="3" rx="1"/><rect x="7" y="14" width="10" height="3" rx="1"/><rect x="9" y="19" width="6" height="3" rx="1"/></svg>,
    },
    {
      title: "See the Full Waterfall",
      body: "Every tier with accurate rates — off-the-tops through net backend profit. Adjust and stress-test until you know what you can't give up.",
      icon: <svg viewBox="0 0 24 24" fill="#fff" width="22" height="22"><path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-1 14l-3.5-3.5 1.41-1.41L11 13.17l5.09-5.09 1.41 1.41L11 16z"/></svg>,
    },
    {
      title: "Export & Share",
      body: "Download a formatted PDF. Share directly with investors, financiers, and co-producers.",
      icon: <svg viewBox="0 0 24 24" fill="#fff" width="22" height="22"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>,
    },
  ];

  /* ── Eyebrow ruled component ── */
  const EyebrowRuled = ({ text }: { text: string }) => (
    <div style={styles.eyebrowRuled}>
      <div style={styles.eyebrowLine} />
      <span style={styles.eyebrowLabel}>{text}</span>
      <div style={styles.eyebrowLine} />
    </div>
  );

  return (
    <>
      <LeadCaptureModal
        isOpen={showLeadCapture}
        onClose={() => setShowLeadCapture(false)}
      />

      {/* ── Keyframe injection ── */}
      <style>{`
        @keyframes lp-shimmer {
          0% { left: -100%; }
          30% { left: 200%; }
          100% { left: 200%; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#000", paddingTop: "0px", maxWidth: "430px", margin: "0 auto" }}>

        {/* ═══ § 1 HERO ═══ */}
        <section ref={heroRef} style={styles.hero}>
          <div style={styles.heroGlow} />
          <div style={{ ...styles.heroInner, ...reveal(heroVisible) }}>
            <h1 style={styles.heroH1}>
              Model Your
              <span style={styles.heroMid}>Recoupment</span>
              <em style={styles.heroEm}>Waterfall</em>
            </h1>
            <p style={styles.heroSub}>Your Deal Structure Begins Here.</p>
            <div style={{ margin: "8px 0 0" }}>
              <button onClick={handleCTA} style={styles.ctaBtn} onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }} onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
                <span style={{ position: "relative", zIndex: 1 }}>RUN MY WATERFALL</span>
                <div style={styles.ctaShimmer} />
              </button>
            </div>
          </div>
        </section>

        <div style={{ height: "3px", background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.50) 20%, rgba(212,175,55,0.40) 50%, rgba(120,60,180,0.50) 80%, transparent 100%)", boxShadow: "0 0 16px rgba(120,60,180,0.15)", margin: "0 24px" }} />

        {/* ═══ § 2 HOW IT WORKS ═══ */}
        <section ref={howRef} style={styles.howSection}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "200px", background: "radial-gradient(ellipse 100% 70% at 50% 0%, rgba(120,60,180,0.20) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ ...styles.howHeader, ...reveal(howVisible) }}>
            <EyebrowRuled text="The Process" />
            <h2 style={styles.howH2}>Build in <span style={{ color: "#D4AF37" }}>Minutes</span></h2>
            <p style={styles.sectionSub}>Four steps. Five minutes. One waterfall.</p>
          </div>
          <div style={styles.stepsContainer}>
            <div style={styles.topLineGoldHalf} />
            {steps.map((step, i) => (
              <div key={step.title} style={{ ...styles.step, ...reveal(howVisible, i) }}>
                <div style={styles.stepNumCol}>
                  {i < steps.length - 1 && <div style={styles.stepLine} />}
                  <div style={styles.stepNumBadge}>
                    {step.icon}
                  </div>
                </div>
                <div style={styles.stepContent}>
                  <p style={styles.stepTitle}>{step.title}</p>
                  <p style={styles.stepBody}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: "3px", background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.50) 20%, rgba(212,175,55,0.40) 50%, rgba(120,60,180,0.50) 80%, transparent 100%)", boxShadow: "0 0 16px rgba(120,60,180,0.15)", margin: "0 24px" }} />

        {/* ═══ § 3 WATERFALL ═══ */}
        <section style={styles.waterfallSection}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "200px", background: "radial-gradient(ellipse 100% 70% at 50% 0%, rgba(120,60,180,0.20) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
          <div ref={waterfallHeaderRef} style={{ ...styles.waterfallHeader, ...reveal(waterfallHeaderVisible) }}>
            <EyebrowRuled text="How the money flows" />
            <h2 style={styles.waterfallH2}>The Recoupment<br /><span style={{ color: "#D4AF37" }}>Waterfall</span></h2>
          </div>

          <p style={{ ...styles.waterfallExplainer, ...reveal(waterfallHeaderVisible) }}>
            A recoupment waterfall maps who gets paid, in what order & how much before you see a dollar of profit.
          </p>

          {/* Acquisition callout */}
          <div ref={waterfallCalloutRef} style={{ ...styles.acquisitionCallout, ...reveal(waterfallCalloutVisible) }}>
            <div style={styles.topLineGoldHalf} />
            <p style={styles.acqLabel}>Streamer Acquisition Price</p>
            <p style={styles.acqSub}>Tier 2 Action Thriller — Example</p>
            <p style={styles.acqAmount}>$3,000,000</p>
          </div>

          {/* Waterfall tiers */}
          <div ref={waterfallTableRef} style={{ ...styles.waterfallTiersBox, ...reveal(waterfallTableVisible) }}>
            <div style={styles.topLineGold} />
            {waterfallTiers.map((tier, i) => {
              const isGroupBoundary = i === 3 || i === 5;
              const isLastRow = i === waterfallTiers.length - 1;
              const borderBottom = isLastRow
                ? "none"
                : isGroupBoundary
                  ? "2px solid rgba(212,175,55,0.20)"
                  : "1px solid rgba(255,255,255,0.06)";
              return (
                <div key={tier.num} style={{ ...styles.tierRow, borderBottom }}>
                  <div style={styles.tierNum}>{tier.num}</div>
                  <div style={styles.tierName}>{tier.name}</div>
                  <div style={styles.tierAmt}>
                    <span style={styles.tierMinus}>-</span>{tier.amt}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Flow diagram */}
          <div ref={waterfallFlowRef} style={{ ...styles.flowDiagram, ...reveal(waterfallFlowVisible) }}>
            <div style={styles.netBackend}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent, ${colors.greenAccent}, transparent)`, boxShadow: "0 0 12px rgba(60,179,113,0.3)" }} />
              <p style={styles.netLabel}>Net Backend Profit</p>
              <p style={styles.netAmount}>$600,000</p>
            </div>
            <div style={styles.pipeNetwork}>
              <div style={styles.pipeVertical} />
              <div style={styles.pipeFork}>
                <div style={styles.pipeLeft} />
                <div style={styles.pipeRight} />
              </div>
            </div>
            <div style={styles.buckets}>
              {[
                { label: "Investor", amount: "$300,000", pct: "50% of backend" },
                { label: "Producer", amount: "$300,000", pct: "50% of backend" },
              ].map((b) => (
                <div key={b.label} style={styles.bucket}>
                  <p style={styles.bucketLabel}>{b.label}</p>
                  <p style={styles.bucketAmount}>{b.amount}</p>
                  <p style={styles.bucketPct}>{b.pct}</p>
                </div>
              ))}
            </div>
          </div>
          <p style={{ ...styles.waterfallNote, ...reveal(waterfallFlowVisible) }}>Model only — your numbers will differ</p>
        </section>

        <div style={{ height: "3px", background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.50) 20%, rgba(212,175,55,0.40) 50%, rgba(120,60,180,0.50) 80%, transparent 100%)", boxShadow: "0 0 16px rgba(120,60,180,0.15)", margin: "0 24px" }} />

        {/* ═══ § 4 WHY THIS MATTERS ═══ */}
        <section ref={whyRef} style={styles.whySection}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "200px", background: "radial-gradient(ellipse 100% 70% at 50% 0%, rgba(120,60,180,0.20) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ ...styles.whyHeader, ...reveal(whyVisible) }}>
            <EyebrowRuled text="Why This Matters" />
            <h2 style={styles.whyH2}><span style={{ color: "#D4AF37" }}>(4) Four</span> Reasons<br />You Can't Skip This</h2>
            <p style={styles.sectionSub}>The math behind every deal you'll make.</p>
          </div>

          <div style={{ ...styles.badgeGridWrapper, ...reveal(whyVisible, 1) }}>
            <div style={styles.topLineGold} />
            <div style={styles.badgeGrid}>
              {badgeCards.map((card, i) => {
                const warmth = 0.15 + (i * 0.04);
                return (
                <div key={card.num} style={{ ...styles.badgeCard, background: `radial-gradient(circle at 45px 57px, rgba(120,60,180,${warmth}) 0%, rgba(6,6,6,0.92) 65%)`, ...reveal(whyVisible, i + 2) }}>
                  <div style={styles.badgeNum}>{card.num}</div>
                  <p style={styles.badgeTitle}>{card.title}</p>
                  <p style={styles.badgeBody}>{card.body}</p>
                </div>
                );
              })}
            </div>
          </div>
        </section>

        <div style={{ height: "3px", background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.50) 20%, rgba(212,175,55,0.40) 50%, rgba(120,60,180,0.50) 80%, transparent 100%)", boxShadow: "0 0 16px rgba(120,60,180,0.15)", margin: "0 24px" }} />

        {/* ═══ § 5 ARSENAL ═══ */}
        <section style={styles.arsenalSection}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "200px", background: "radial-gradient(ellipse 100% 70% at 50% 0%, rgba(120,60,180,0.20) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
          <div ref={arsenalHeaderRef} style={{ ...styles.arsenalHeader, ...reveal(arsenalHeaderVisible) }}>
            <EyebrowRuled text="What you get" />
            <h2 style={styles.arsenalH2}>The <span style={{ color: "#D4AF37" }}>Arsenal</span></h2>
            <p style={styles.arsenalSub}>Start with the math. Upgrade when you need the documents.</p>
          </div>

          <div style={styles.arsenalCards}>
            {/* ── Card 1: The Snapshot (Free) — GREEN ── */}
            <div ref={arsenalCoreRef} style={{ ...styles.tierCardFree, ...reveal(arsenalCoreVisible) }}>
              {/* Gradient border */}
              <div style={{ position: "absolute", inset: 0, borderRadius: "12px", padding: "1px", pointerEvents: "none", background: "linear-gradient(180deg, rgba(60,179,113,0.50) 0%, rgba(60,179,113,0.20) 50%, rgba(60,179,113,0.35) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
              {/* Top line */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(60,179,113,0.50), transparent)", zIndex: 1 }} />
              <div style={styles.tierHeaderFree}>
                <div style={{ marginBottom: "12px" }}>
                  <span style={styles.tierBadgeFree}>Free Access</span>
                </div>
                <p style={styles.tierTitleCard}>The Snapshot</p>
                <p style={styles.tierSubFree}>Your waterfall. Modeled, visualized, shareable.</p>
              </div>
              {/* Value statement */}
              <div style={styles.valueStatementFree}>
                <p style={styles.valueTextFree}>Your Numbers. No Credit Card.</p>
              </div>
              {/* Features */}
              <div style={styles.tierFeatures}>
                {[
                  { name: "11-Tier Recoupment Logic" },
                  { name: "Profit & Break-Even Scenarios" },
                  { name: "Web Sharing & PDF Export" },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "24px", color: "#3CB371", flexShrink: 0, marginTop: "1px", textShadow: "0 0 8px rgba(60,179,113,0.6), 0 0 20px rgba(60,179,113,0.3)" }}>✓</span>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", fontWeight: 500, color: "#fff", lineHeight: 1.3 }}>{f.name}</p>
                  </div>
                ))}
              </div>
              <div style={styles.tierAction}>
                <button onClick={handleCTA} style={styles.btnFree} onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }} onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>START MODELING</button>
              </div>
            </div>

            {/* ── Card 2: The Full Analysis — GOLD ── */}
            <div ref={arsenalSnapshotRef} style={{ ...styles.tierCardAnalysis, ...reveal(arsenalSnapshotVisible) }}>
              {/* Gradient border */}
              <div style={{ position: "absolute", inset: 0, borderRadius: "12px", padding: "1px", pointerEvents: "none", background: "linear-gradient(180deg, rgba(212,175,55,0.55) 0%, rgba(212,175,55,0.20) 50%, rgba(212,175,55,0.40) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
              {/* Top line */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)", zIndex: 1 }} />
              <div style={styles.tierHeaderAlt}>
                <div style={{ marginBottom: "12px" }}>
                  <span style={styles.trendingBadge}>Essential</span>
                </div>
                <p style={styles.tierTitleCard}>THE FULL ANALYSIS</p>
                <p style={styles.tierSubGold}>Your numbers documented & stress-tested.</p>
              </div>
              {/* Value statement */}
              <div style={styles.valueStatementGold}>
                <p style={styles.valueTextGold}>One Document. Every Answer.</p>
              </div>
              {/* Features */}
              <div style={styles.tierFeatures}>
                {[
                  { name: "Unified Financial Presentation", desc: "One PDF with everything an investor needs." },
                  { name: "Budget, Stack, Waterfall & Scenarios", desc: "All four pillars in a single document." },
                  { name: "Sensitivity Analysis", desc: "Multiple scenarios stress-tested." },
                  { name: "White-Labeled to Your Project", desc: "Your company, your title, your brand." },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "24px", color: "#D4AF37", flexShrink: 0, marginTop: "1px", textShadow: "0 0 8px rgba(212,175,55,0.6), 0 0 20px rgba(212,175,55,0.3)" }}>✓</span>
                    <div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", fontWeight: 500, color: "#fff", lineHeight: 1.3, marginBottom: "3px" }}>{f.name}</p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: "rgba(255,255,255,0.65)", lineHeight: 1.45 }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={styles.tierAction}>
                <button onClick={() => gatedNavigate("/store/the-full-analysis")} style={styles.btnGold} onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }} onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>GET THE FULL ANALYSIS</button>
                <a href="/store/the-full-analysis" onClick={(e) => { e.preventDefault(); gatedNavigate("/store/the-full-analysis"); }} style={styles.detailsLink} onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,1)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}>See full details →</a>
              </div>
            </div>

            {/* ── Card 3: The Producer's Package — PURPLE-GOLD ── */}
            <div ref={arsenalPackageRef} style={{ ...styles.tierCardPackage, ...reveal(arsenalPackageVisible) }}>
              {/* Gradient border */}
              <div style={{ position: "absolute", inset: 0, borderRadius: "12px", padding: "1px", pointerEvents: "none", background: "linear-gradient(180deg, rgb(110,50,170) 0%, rgba(120,60,180,0.5) 30%, rgba(212,175,55,0.4) 70%, #D4AF37 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
              {/* Top line */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, transparent, rgb(110,50,170), #D4AF37, transparent)", zIndex: 1 }} />
              <div style={{ ...styles.tierHeaderAlt, background: "radial-gradient(ellipse at 50% 100%, rgba(120,60,180,0.06) 0%, transparent 70%)" }}>
                <div style={{ marginBottom: "12px" }}>
                  <span style={styles.badgePurple}>Turnkey</span>
                </div>
                <p style={styles.tierTitleCard}>THE PRODUCER'S PACKAGE</p>
                <p style={styles.tierSubGold}>The full treatment, delivered in 3-5 days.</p>
              </div>
              {/* Value statement */}
              <div style={styles.valueStatementPurple}>
                <p style={styles.valueTextPurple}>Custom-Built. Investor-Ready.</p>
              </div>
              {/* Features */}
              <div style={styles.tierFeatures}>
                {[
                  { name: "Custom Lookbook", desc: "Tone, cast, genre, visual identity." },
                  { name: "Pitch Deck with Speaker Notes" },
                  { name: "Enhanced Financial Presentation" },
                  { name: "10 Comparable Acquisitions" },
                  { name: "Individual Investor Profiles" },
                  { name: "Everything White-Labeled" },
                  { name: "Revision Round Included" },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "24px", color: "rgb(160,100,255)", flexShrink: 0, marginTop: "1px", textShadow: "0 0 8px rgba(140,80,240,0.6), 0 0 20px rgba(140,80,240,0.3)" }}>✓</span>
                    <div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", fontWeight: 500, color: "#fff", lineHeight: 1.3, marginBottom: f.desc ? "3px" : "0" }}>{f.name}</p>
                      {f.desc && <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: "rgba(255,255,255,0.65)", lineHeight: 1.45 }}>{f.desc}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <div style={styles.tierAction}>
                <button onClick={() => gatedNavigate("/store/the-producers-package")} style={styles.btnPurpleOutline} onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }} onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>GET THE PRODUCER'S PACKAGE</button>
                <a href="/store/the-producers-package" onClick={(e) => { e.preventDefault(); gatedNavigate("/store/the-producers-package"); }} style={styles.detailsLink} onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,1)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}>See full details →</a>
              </div>
            </div>
          </div>
        </section>

        <div style={{ height: "3px", background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.50) 20%, rgba(212,175,55,0.40) 50%, rgba(120,60,180,0.50) 80%, transparent 100%)", boxShadow: "0 0 16px rgba(120,60,180,0.15)", margin: "0 24px" }} />

        {/* ═══ § 6 REALITY ═══ */}
        <section style={styles.realitySection}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "200px", background: "radial-gradient(ellipse 100% 70% at 50% 0%, rgba(120,60,180,0.20) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: "-20px", left: "-20px", right: "-20px", bottom: "-20px", background: "radial-gradient(ellipse 100% 80% at 20% 50%, rgba(120,60,180,0.12) 0%, transparent 60%)", pointerEvents: "none", zIndex: 0 }} />
            <blockquote ref={realityQuoteRef} style={{ ...styles.blockquote, position: "relative", zIndex: 1, ...reveal(realityQuoteVisible) }}>
            The waterfall either costs you now — or costs you everything <span style={{ color: "#D4AF37" }}>later</span>.
          </blockquote>
          </div>

          <div ref={realityGridRef} style={{ ...styles.checkGrid, ...reveal(realityGridVisible) }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: "50%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(60,179,113,0.5), transparent)", zIndex: 1 }} />
            <div style={{ position: "absolute", top: 0, left: "50%", right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(220,38,38,0.4), transparent)", zIndex: 1 }} />
            {/* Header */}
            <div style={styles.checkHeader}>
              <div style={styles.checkHeaderWith}><span style={styles.checkHeaderWithText}>WITH</span></div>
              <div style={styles.checkHeaderWithout}><span style={styles.checkHeaderWithoutText}>WITHOUT</span></div>
            </div>
            {/* Rows */}
            {withItems.map((withItem, i) => (
              <div key={i} style={{ ...styles.checkRow, borderBottom: i < withItems.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div style={styles.checkCellLeft}>
                  <span style={styles.checkIconYes}>✓</span>
                  <span style={styles.checkTextYes}>{withItem}</span>
                </div>
                <div style={styles.checkCellRight}>
                  <span style={styles.checkIconNo}>✗</span>
                  <span style={styles.checkTextNo}>{withoutItems[i]}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: "3px", background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.50) 20%, rgba(212,175,55,0.40) 50%, rgba(120,60,180,0.50) 80%, transparent 100%)", boxShadow: "0 0 16px rgba(120,60,180,0.15)", margin: "0 24px" }} />

        {/* ═══ § 7 CLOSER ═══ */}
        <section ref={closerRef} style={styles.closerSection}>
          <div style={styles.closerGlowBottom} />
          <div style={{ ...styles.closerCard, ...reveal(closerVisible) }}>
            <div style={styles.topLineGoldBright} />
            <h2 style={styles.closerH2}>Your Investors<br /><span style={{ color: "#D4AF37", display: "block", textShadow: "0 0 40px rgba(212,175,55,0.6), 0 0 80px rgba(212,175,55,0.25)" }}>Will Ask.</span></h2>
            <p style={styles.closerBody}>Stop guessing. Model your waterfall before the pitch.</p>
            <button onClick={handleCTA} style={styles.ctaBtn} onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }} onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
              <span style={{ position: "relative", zIndex: 1 }}>RUN MY WATERFALL</span>
              <div style={styles.ctaShimmer} />
            </button>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer ref={footerRef} style={{ ...styles.footer, opacity: prefersReducedMotion || footerVisible ? 1 : 0, transition: prefersReducedMotion ? "none" : "opacity 0.8s ease-out" }}>
          <div style={styles.footerLinks}>
            <a href="https://www.instagram.com/filmmaker.og" target="_blank" rel="noopener noreferrer" style={styles.footerIcon} aria-label="Instagram" onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.50)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.15)"; }}>
              <Instagram size={18} />
            </a>
            <a href="https://www.tiktok.com/@filmmaker.og" target="_blank" rel="noopener noreferrer" style={styles.footerIcon} aria-label="TikTok" onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.50)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.15)"; }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.2 8.2 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.14z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/filmmaker.og" target="_blank" rel="noopener noreferrer" style={styles.footerIcon} aria-label="Facebook" onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.50)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.15)"; }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
          <div style={styles.footerNav}>
            <span onClick={() => gatedNavigate("/store")} style={styles.footerNavLink} onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.35)"; }}>Shop</span>
          </div>
          <p style={styles.footerText}>
            Filmmaker.og provides financial modeling tools for educational purposes. This is not legal or financial advice. Consult qualified counsel before executing any investment structure.
          </p>
        </footer>
      </div>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════
   STYLES — matches HTML v12 exactly
   ══════════════════════════════════════════════════════════════════ */
const styles: Record<string, React.CSSProperties> = {
  /* ── Eyebrow ── */
  eyebrowRuled: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "14px",
  },
  eyebrowLine: {
    flex: 1, height: "1px", background: "rgba(212,175,55,0.40)", boxShadow: "0 0 8px rgba(212,175,55,0.15)",
  },
  eyebrowLabel: {
    fontFamily: "'Roboto Mono', monospace", fontSize: "17px",
    letterSpacing: "0.18em", textTransform: "uppercase", color: "#D4AF37",
    whiteSpace: "nowrap",
  },

  /* ── CTA Button ── */
  ctaBtn: {
    position: "relative", overflow: "hidden",
    fontFamily: "'Roboto Mono', monospace", fontWeight: 600,
    textTransform: "uppercase", color: "#fff",
    background: "linear-gradient(135deg, rgb(75,30,130) 0%, rgb(110,50,170) 100%)", padding: "22px 0",
    letterSpacing: "0.12em", fontSize: "18px",
    borderRadius: "8px", border: "none", cursor: "pointer",
    display: "block", width: "100%", textAlign: "center",
    boxShadow:
      "0 0 0 1px rgba(212,175,55,0.25), " +
      "0 0 24px rgba(120,60,180,0.40), " +
      "0 0 60px rgba(120,60,180,0.20), " +
      "0 0 100px rgba(212,175,55,0.10)",
  },
  ctaShimmer: {
    position: "absolute", top: 0, left: "-100%", width: "55%", height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
    transform: "skewX(-20deg)",
    animation: "lp-shimmer 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite",
  },

  /* ── § 1 HERO ── */
  hero: {
    position: "relative", textAlign: "center",
    padding: "24px 24px 12px",
    margin: "0 24px",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.65) 100%), url('/hero-bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center 30%",
  },
  heroGlow: {
    position: "absolute", top: 0, left: 0, right: 0, height: "65%", pointerEvents: "none",
    background: "radial-gradient(ellipse 70% 55% at 50% 15%, rgba(212,175,55,0.30) 0%, transparent 70%)",
  },
  heroInner: { position: "relative", zIndex: 1 },
  heroH1: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "4.2rem", color: "#fff",
    textAlign: "center", marginBottom: "4px", lineHeight: 0.86, letterSpacing: "0.01em",
    textShadow: "0 2px 20px rgba(0,0,0,0.95), 0 4px 40px rgba(0,0,0,0.5)",
  },
  heroEm: { fontStyle: "normal", color: "#D4AF37", display: "block", textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.5), 0 0 80px rgba(212,175,55,0.25)" },
  heroMid: { display: "block", color: "#fff", fontStyle: "normal", textShadow: "0 2px 16px rgba(0,0,0,0.9)" },
  heroSub: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", textAlign: "center",
    marginBottom: "16px", lineHeight: 1.1, color: "#fff",
    marginTop: "8px", textShadow: "0 2px 12px rgba(0,0,0,0.9)",
  },

  /* ── § 2 HOW IT WORKS ── */
  howSection: { position: "relative", background: "#000", padding: "48px 0 0" },
  howHeader: { textAlign: "center", padding: "16px 24px 24px", background: "radial-gradient(ellipse 80% 50% at 50% 60%, rgba(120,60,180,0.18) 0%, transparent 70%)" },
  howH2: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.2rem", color: "#fff", lineHeight: 0.95 },
  stepsContainer: { position: "relative", display: "flex", flexDirection: "column", gap: "1px", background: "rgba(120,60,180,0.10)", borderRadius: "12px", overflow: "hidden", margin: "0 24px", border: "1px solid rgba(120,60,180,0.25)", boxShadow: "0 16px 40px rgba(0,0,0,0.5), 0 0 20px rgba(120,60,180,0.15)" },
  step: {
    display: "grid", gridTemplateColumns: "52px 1fr", background: "rgba(6,6,6,0.92)",
  },
  stepNumCol: {
    position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "center",
    background: "radial-gradient(circle at 50% 28px, rgba(120,60,180,0.28) 0%, rgba(6,6,6,0.92) 80%)",
    paddingTop: "22px",
  },
  stepLine: {
    position: "absolute", top: "53px", bottom: "-23px", left: "50%", transform: "translateX(-50%)", width: "1px",
    background: "linear-gradient(180deg, rgba(120,60,180,0.6) 0%, rgba(120,60,180,0.1) 100%)", zIndex: 0,
  },
  stepNumBadge: {
    position: "relative", zIndex: 1, width: "48px", height: "48px", borderRadius: "50%",
    background: "linear-gradient(135deg, rgb(75,30,130) 0%, rgb(110,50,170) 100%)", display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 20px rgba(120,60,180,0.50), 0 0 40px rgba(120,60,180,0.25)",
  },
  stepContent: { padding: "26px 24px 26px 24px" },
  stepTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#fff", lineHeight: 1, marginBottom: "5px" },
  stepBody: { fontFamily: "'Inter', sans-serif", fontSize: "19px", color: "rgba(255,255,255,0.88)", lineHeight: 1.55 },

  /* ── § 3 WATERFALL ── */
  waterfallSection: { position: "relative", background: "#000", padding: "48px 0 0" },
  waterfallHeader: { textAlign: "center", padding: "0 24px 24px" },
  waterfallH2: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.2rem", color: "#fff", lineHeight: 0.95 },
  waterfallExplainer: {
    fontFamily: "'Inter', sans-serif", fontSize: "19px", color: "rgba(255,255,255,0.88)",
    lineHeight: 1.55, textAlign: "center", padding: "0 24px", marginBottom: "24px",
    maxWidth: "380px", marginLeft: "auto", marginRight: "auto",
  },
  acquisitionCallout: {
    position: "relative", overflow: "hidden", textAlign: "center", margin: "0 24px 10px",
    background: "radial-gradient(circle at 50% 70%, rgba(212,175,55,0.20) 0%, rgba(6,6,6,0.92) 75%), radial-gradient(circle at 50% 50%, rgba(120,60,180,0.10) 0%, transparent 60%)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: "12px", padding: "24px 20px",
    boxShadow: "0 0 24px rgba(212,175,55,0.10), 0 0 20px rgba(120,60,180,0.15)",
  },
  acqLabel: { fontFamily: "'Roboto Mono', monospace", fontSize: "16px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#D4AF37", marginBottom: "4px" },
  acqSub: { fontFamily: "'Roboto Mono', monospace", fontSize: "17px", color: colors.textSecondary, marginBottom: "8px" },
  acqAmount: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.2rem", color: "#D4AF37", lineHeight: 1, letterSpacing: "0.02em", textShadow: "0 0 30px rgba(212,175,55,0.4), 0 0 60px rgba(212,175,55,0.15)" },

  waterfallTiersBox: {
    position: "relative", overflow: "hidden", margin: "0 24px",
    border: "1px solid rgba(212,175,55,0.25)", borderRadius: "12px", background: "rgba(6,6,6,0.92)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 24px rgba(212,175,55,0.10), 0 0 20px rgba(120,60,180,0.15)",
  },
  tierRow: {
    position: "relative", display: "grid", gridTemplateColumns: "auto 1fr auto",
    gap: "16px", padding: "16px 20px", alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.06)", cursor: "default",
    borderLeft: "2px solid rgba(220,38,38,0.15)",
  },
  tierNum: {
    fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: "rgb(180,140,255)",
    background: "rgba(120,60,180,0.18)", border: "1px solid rgba(120,60,180,0.35)",
    width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: "6px", fontWeight: 600,
    boxShadow: "0 0 16px rgba(120,60,180,0.3), 0 0 32px rgba(120,60,180,0.25)",
  },
  tierName: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "#fff", lineHeight: 1.3, textTransform: "uppercase", letterSpacing: "0.02em" },
  tierAmt: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "rgba(220,38,38,0.85)", textAlign: "right", whiteSpace: "nowrap", letterSpacing: "0.02em" },
  tierMinus: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "rgba(220,38,38,0.70)", marginRight: "4px", fontWeight: 400 },

  /* Flow diagram */
  flowDiagram: { margin: "16px 24px 0" },
  netBackend: {
    position: "relative", textAlign: "center", background: "rgba(6,6,6,0.92)", border: "1px solid rgba(60,179,113,0.35)",
    borderRadius: "12px", padding: "24px 20px", zIndex: 2, boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 30px rgba(60,179,113,0.15), 0 0 20px rgba(120,60,180,0.12)",
  },
  netLabel: { fontFamily: "'Roboto Mono', monospace", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: colors.textPrimary, marginBottom: "8px" },
  netAmount: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.2rem", color: "#3CB371", lineHeight: 0.9, letterSpacing: "0.02em", textShadow: "0 0 24px rgba(60,179,113,0.35)" },
  pipeNetwork: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: "-1px", position: "relative", zIndex: 1 },
  pipeVertical: { width: "2px", height: "18px", background: "rgba(60,179,113,0.50)", boxShadow: "0 0 8px rgba(120,60,180,0.10)" },
  pipeFork: { display: "flex", width: "calc(50% + 10px)" },
  pipeLeft: { flex: 1, height: "18px", borderTop: "2px solid rgba(60,179,113,0.50)", borderLeft: "2px solid rgba(60,179,113,0.50)", borderRadius: "6px 0 0 0" },
  pipeRight: { flex: 1, height: "18px", borderTop: "2px solid rgba(60,179,113,0.50)", borderRight: "2px solid rgba(60,179,113,0.50)", borderRadius: "0 6px 0 0" },
  buckets: { display: "flex", gap: "10px", marginTop: "-1px" },
  bucket: {
    flex: 1, textAlign: "center", background: "rgba(6,6,6,0.92)", border: "1px solid rgba(60,179,113,0.25)",
    borderTop: "2px solid #3CB371", borderRadius: "0 0 10px 10px", padding: "16px 12px",
  },
  bucketLabel: { fontFamily: "'Roboto Mono', monospace", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: colors.textPrimary, marginBottom: "8px" },
  bucketAmount: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#3CB371", lineHeight: 1, textShadow: "0 0 20px rgba(60,179,113,0.30)" },
  bucketPct: { fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.85)", marginTop: "5px" },
  waterfallNote: { fontFamily: "'Roboto Mono', monospace", fontSize: "11px", textTransform: "uppercase", textAlign: "center", color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em", padding: "16px 24px 0" },

  /* ── § 4 WHY THIS MATTERS ── */
  whySection: { position: "relative", background: "#000", textAlign: "center", padding: "48px 0 0" },
  whyHeader: { padding: "20px 24px 24px" },
  whyH2: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.2rem", color: "#fff", textAlign: "center", lineHeight: 0.95 },
  badgeGridWrapper: {
    margin: "0 24px", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(120,60,180,0.25)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 24px rgba(212,175,55,0.10), 0 0 20px rgba(120,60,180,0.15)", position: "relative",
  },
  badgeGrid: { display: "grid", gridTemplateColumns: "1fr", gap: "1px", background: "rgba(120,60,180,0.15)" },
  badgeCard: { background: "radial-gradient(circle at 45px 57px, rgba(120,60,180,0.15) 0%, rgba(6,6,6,0.92) 65%)", padding: "36px 24px", textAlign: "left" },
  badgeNum: {
    width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg, rgb(75,30,130) 0%, rgb(110,50,170) 100%)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.7rem",
    marginBottom: "16px", paddingTop: "2px", boxShadow: "0 0 24px rgba(120,60,180,0.55), 0 0 48px rgba(120,60,180,0.25)",
  },
  badgeTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#fff", marginBottom: "8px", lineHeight: 1.05, letterSpacing: "0.02em" },
  badgeBody: { fontFamily: "'Inter', sans-serif", fontSize: "19px", color: "rgba(255,255,255,0.85)", lineHeight: 1.55 },

  /* ── § 5 ARSENAL ── */
  arsenalSection: { position: "relative", background: "#000", textAlign: "center", padding: "48px 0 0" },
  arsenalHeader: { padding: "0 24px 24px" },
  arsenalH2: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.2rem", color: "#fff", lineHeight: 0.95 },
  arsenalSub: { fontFamily: "'Inter', sans-serif", fontSize: "18px", marginTop: "10px", color: "rgba(255,255,255,0.88)", lineHeight: 1.6 },
  sectionSub: { fontFamily: "'Inter', sans-serif", fontSize: "18px", marginTop: "10px", color: "rgba(255,255,255,0.85)", lineHeight: 1.5 },
  arsenalCards: { display: "flex", flexDirection: "column", gap: "28px", margin: "0 24px" },

  /* Card containers */
  tierCardFree: {
    position: "relative", borderRadius: "12px", overflow: "hidden", textAlign: "left",
    border: "none",
    background: "radial-gradient(ellipse at 50% 0%, rgba(60,179,113,0.07) 0%, rgba(6,6,6,0.92) 70%)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.5), 0 0 40px rgba(60,179,113,0.06), 0 0 20px rgba(120,60,180,0.15)",
  },
  tierCardAnalysis: {
    position: "relative", borderRadius: "12px", overflow: "hidden", textAlign: "left",
    border: "none",
    background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.08) 0%, rgba(6,6,6,0.92) 70%)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 30px rgba(120,60,180,0.15)",
  },
  tierCardPackage: {
    position: "relative", borderRadius: "12px", overflow: "hidden", textAlign: "left",
    border: "none",
    background: "radial-gradient(ellipse at 50% 0%, rgba(120,60,180,0.08) 0%, rgba(212,175,55,0.06) 30%, rgba(6,6,6,0.92) 70%)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.8), 0 0 60px rgba(120,60,180,0.15), 0 0 120px rgba(120,60,180,0.12)",
  },

  /* Headers */
  tierHeaderFree: {
    padding: "28px 24px 20px", borderBottom: "1px solid rgba(60,179,113,0.12)",
  },
  tierHeaderAlt: {
    padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  tierTitleCard: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.6rem", color: "#fff", lineHeight: 1, letterSpacing: "0.04em", marginBottom: "8px" },
  tierSubFree: { fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "rgba(255,255,255,0.72)", marginTop: "6px" },
  tierSubGold: { fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "rgba(212,175,55,0.80)", lineHeight: 1.4 },

  /* Badges */
  tierBadgeFree: {
    fontFamily: "'Roboto Mono', monospace", fontSize: "11px", textTransform: "uppercase",
    padding: "6px 12px", borderRadius: "4px", letterSpacing: "0.15em",
    background: "rgba(60,179,113,0.08)", color: "#3CB371", border: "1px solid rgba(60,179,113,0.30)",
    whiteSpace: "nowrap", flexShrink: 0,
  },
  trendingBadge: {
    display: "inline-block", fontFamily: "'Roboto Mono', monospace", fontSize: "11px", textTransform: "uppercase",
    letterSpacing: "0.15em", color: "#D4AF37", background: "rgba(212,175,55,0.08)",
    border: "1px solid rgba(212,175,55,0.35)",
    padding: "6px 12px", borderRadius: "4px", fontWeight: 600, whiteSpace: "nowrap",
  },
  badgePurple: {
    display: "inline-block", fontFamily: "'Roboto Mono', monospace", fontSize: "11px", textTransform: "uppercase",
    letterSpacing: "0.15em", color: "rgb(180,140,255)", background: "rgba(120,60,180,0.10)",
    border: "1px solid rgba(120,60,180,0.35)",
    padding: "6px 12px", borderRadius: "4px", fontWeight: 600, whiteSpace: "nowrap",
  },

  /* Value statements */
  valueStatementFree: {
    padding: "20px 24px", textAlign: "center",
    background: "rgba(60,179,113,0.04)",
    borderTop: "1px solid rgba(60,179,113,0.15)", borderBottom: "1px solid rgba(60,179,113,0.15)",
  },
  valueTextFree: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#3CB371", lineHeight: 1,
    letterSpacing: "0.02em", textShadow: "0 0 20px rgba(60,179,113,0.15)",
  },
  valueStatementGold: {
    padding: "20px 24px", textAlign: "center",
    background: "rgba(212,175,55,0.04)",
    borderTop: "1px solid rgba(212,175,55,0.15)", borderBottom: "1px solid rgba(212,175,55,0.15)",
  },
  valueTextGold: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#D4AF37", lineHeight: 1,
    letterSpacing: "0.02em", textShadow: "0 0 20px rgba(212,175,55,0.15)",
  },
  valueStatementPurple: {
    padding: "20px 24px", textAlign: "center",
    background: "rgba(120,60,180,0.06)",
    borderTop: "1px solid rgba(120,60,180,0.15)", borderBottom: "1px solid rgba(120,60,180,0.15)",
  },
  valueTextPurple: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "rgb(200,170,255)", lineHeight: 1,
    letterSpacing: "0.02em", textShadow: "0 0 20px rgba(120,60,180,0.20)",
  },

  /* Features list */
  tierFeatures: { padding: "24px", display: "flex", flexDirection: "column", gap: "16px" },

  /* Actions */
  tierAction: { padding: "0 24px 36px" },
  btnFree: {
    display: "block", width: "100%", textAlign: "center",
    fontFamily: "'Roboto Mono', monospace", fontSize: "16px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.10em",
    color: "#3CB371", background: "rgba(60,179,113,0.05)", border: "1px solid rgba(60,179,113,0.25)",
    padding: "18px", borderRadius: "6px", cursor: "pointer",
  },
  btnGold: {
    display: "block", width: "100%", textAlign: "center",
    fontFamily: "'Roboto Mono', monospace", fontSize: "16px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.10em",
    color: "#D4AF37", background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.30)",
    padding: "18px", borderRadius: "6px", cursor: "pointer",
  },
  btnPackage: {
    position: "relative", overflow: "hidden", display: "block", width: "100%", textAlign: "center",
    fontFamily: "'Roboto Mono', monospace", fontSize: "18px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em",
    color: "#fff", background: "linear-gradient(135deg, rgb(75,30,130) 0%, rgb(110,50,170) 100%)", border: "none", padding: "18px", borderRadius: "6px", cursor: "pointer",
    boxShadow: "0 0 24px rgba(120,60,180,0.35), 0 0 60px rgba(212,175,55,0.10)",
  },
  btnPurpleOutline: {
    display: "block", width: "100%", textAlign: "center",
    fontFamily: "'Roboto Mono', monospace", fontSize: "16px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.10em",
    color: "rgb(180,140,255)", background: "rgba(120,60,180,0.05)", border: "1px solid rgba(120,60,180,0.30)",
    padding: "18px", borderRadius: "6px", cursor: "pointer",
  },
  detailsLink: { display: "block", textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.85)", textDecoration: "none", marginTop: "16px", cursor: "pointer", padding: "8px 0" },

  /* ── Top line helpers ── */
  topLineGold: {
    position: "absolute", top: 0, left: 0, right: 0, height: "2px",
    background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.40) 20%, rgba(212,175,55,0.50) 50%, rgba(120,60,180,0.40) 80%, transparent 100%)",
  },
  topLineGoldHalf: {
    position: "absolute", top: 0, left: 0, right: 0, height: "2px",
    background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.30) 20%, rgba(212,175,55,0.35) 50%, rgba(120,60,180,0.30) 80%, transparent 100%)",
  },
  topLineGoldThick: {
    position: "absolute", top: 0, left: 0, right: 0, height: "2px",
    background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
  },
  topLineGoldBright: {
    position: "absolute", top: 0, left: 0, right: 0, height: "2px",
    background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.50) 20%, rgba(212,175,55,0.60) 50%, rgba(120,60,180,0.50) 80%, transparent 100%)",
  },

  /* ── § 6 REALITY ── */
  realitySection: { position: "relative", background: "#000", textAlign: "left", padding: "40px 24px 32px" },
  blockquote: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.4rem", lineHeight: 0.95, color: "#fff",
    borderLeft: "3px solid #D4AF37", paddingLeft: "20px", marginBottom: "24px",
    boxShadow: "-4px 0 24px rgba(212,175,55,0.25), -8px 0 40px rgba(120,60,180,0.15)",
  },
  checkGrid: {
    position: "relative", border: "1px solid rgba(120,60,180,0.30)", borderRadius: "12px", overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(120,60,180,0.15)",
  },
  checkHeader: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(255,255,255,0.06)",
    borderBottom: "1px solid rgba(212,175,55,0.15)",
  },
  checkHeaderWith: { background: "rgba(60,179,113,0.07)", padding: "14px 16px" },
  checkHeaderWithout: { background: "rgba(6,6,6,0.92)", padding: "14px 16px", borderLeft: "1px solid rgba(255,255,255,0.06)" },
  checkHeaderWithText: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.7rem", color: "#3CB371", letterSpacing: "0.04em" },
  checkHeaderWithoutText: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.7rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" },
  checkRow: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(255,255,255,0.06)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  checkCellLeft: {
    background: "rgba(60,179,113,0.06)", display: "grid", gridTemplateColumns: "22px 1fr", gap: "10px",
    padding: "14px 16px", alignItems: "flex-start",
  },
  checkCellRight: {
    background: "rgba(6,6,6,0.92)", display: "grid", gridTemplateColumns: "22px 1fr", gap: "10px",
    padding: "14px 16px", alignItems: "flex-start", borderLeft: "1px solid rgba(255,255,255,0.06)",
  },
  checkIconYes: { fontFamily: "'Roboto Mono', monospace", fontSize: "24px", paddingTop: "2px", color: "#3CB371", textShadow: "0 0 8px rgba(60,179,113,0.6), 0 0 20px rgba(60,179,113,0.3)" },
  checkIconNo: { fontFamily: "'Roboto Mono', monospace", fontSize: "24px", paddingTop: "2px", color: "rgba(220,38,38,0.85)", textShadow: "0 0 8px rgba(220,38,38,0.6), 0 0 20px rgba(220,38,38,0.3)" },
  checkTextYes: { fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: 1.4, color: "rgba(255,255,255,0.85)" },
  checkTextNo: { fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: 1.4, color: "rgba(255,255,255,0.72)" },

  /* ── § 7 CLOSER ── */
  closerSection: {
    position: "relative", overflow: "hidden", textAlign: "center",
    padding: "32px 0 80px", borderTop: "none",
    margin: "0 24px 0",
    borderRadius: "12px",
    backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.60) 100%), url('/closer-bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center 30%",
  },
  closerGlowBottom: {
    position: "absolute", bottom: 0, left: 0, right: 0, height: "80%", pointerEvents: "none",
    background: "radial-gradient(ellipse 90% 60% at 50% 100%, rgba(120,60,180,0.18) 0%, rgba(120,60,180,0.08) 40%, transparent 65%)",
  },
  closerCard: {
    position: "relative", zIndex: 1, border: "1px solid rgba(212,175,55,0.65)", borderRadius: "12px",
    padding: "24px 24px 36px", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", margin: "0",
    boxShadow: "0 16px 40px rgba(0,0,0,0.8), 0 0 60px rgba(120,60,180,0.15), 0 0 80px rgba(120,60,180,0.15)",
  },
  closerH2: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.4rem", color: "#fff", textAlign: "center",
    lineHeight: 0.95, margin: "4px 0 14px", textShadow: "0 2px 16px rgba(0,0,0,0.9)",
  },
  closerBody: {
    fontFamily: "'Inter', sans-serif", fontSize: "19px", color: "rgba(255,255,255,0.85)",
    lineHeight: 1.5, margin: "0 auto 24px", textShadow: "0 2px 8px rgba(0,0,0,0.8)",
  },

  /* ── FOOTER ── */
  footer: { background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 24px 40px" },
  footerLinks: { display: "flex", justifyContent: "center", gap: "20px", marginBottom: "16px" },
  footerIcon: { color: "rgba(212,175,55,0.50)", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "8px", border: "1px solid rgba(212,175,55,0.15)", transition: "color 0.2s ease, border-color 0.2s ease" },
  footerNav: { display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "16px" },
  footerNavLink: { fontFamily: "'Roboto Mono', monospace", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(212,175,55,0.35)", cursor: "pointer", transition: "color 0.2s ease" } as React.CSSProperties,
  footerDot: { color: "rgba(212,175,55,0.20)", fontSize: "12px" },
  footerText: { fontFamily: "'Inter', sans-serif", fontSize: "14px", textAlign: "center", color: "rgba(255,255,255,0.48)", lineHeight: 1.55 },
};

export default Index;
