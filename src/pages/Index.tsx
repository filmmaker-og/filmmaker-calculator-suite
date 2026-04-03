import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { warmWhite } from "@/lib/tokens";
import { useHaptics } from "@/hooks/use-haptics";
import { useInView } from "@/hooks/useInView";

import { Instagram } from "lucide-react";
/*
  PAGE STACK — v17 (Interactive Hero Restructure):
    § 1. HERO         — Interactive mini-calculator (3 sliders + live output)
    § 2. PREVIEW      — 5 horizontally scrollable output cards
    § 3. WATERFALL    — Card-based money flow (pair cards + arrow connectors)
    § 4. WHAT'S AT STAKE — 4 tight reason cards (gold left border)
    § 5. REALITY      — Typing reveal + WITH/WITHOUT grid (3 rows)
    § 6. SOCIAL PROOF — Testimonial + feature badges
    § 7. CLOSER       — "YOUR NEXT PITCH / IS COMING."
    FOOTER

  CTA: All navigate directly to /signup.
*/

const Index = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();

  const handleCTA = () => {
    haptics.medium();
    navigate("/calculator");
  };

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const reveal = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity: prefersReducedMotion || visible ? 1 : 0,
    transform: prefersReducedMotion || visible ? "translateY(0)" : "translateY(16px)",
    transition: prefersReducedMotion
      ? "none"
      : "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
    transitionDelay: prefersReducedMotion || delay === 0 ? "0ms" : `${delay * 100}ms`,
  });

  /* ── Scroll refs ── */
  const { ref: heroRef, inView: heroVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  // Waterfall
  const { ref: waterfallHeaderRef, inView: waterfallHeaderVisible } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const { ref: waterfallCalloutRef, inView: waterfallCalloutVisible } = useInView<HTMLDivElement>({ threshold: 0.3 });
  // Social Proof
  const { ref: socialRef, inView: socialVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  // What's At Stake
  const { ref: stakeRef, inView: stakeVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  // Reality
  const { ref: realityQuoteRef, inView: realityQuoteVisible } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const { ref: realityGridRef, inView: realityGridVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: profitCardRef, inView: profitCardVisible } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { ref: splitRef, inView: splitVisible } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const { ref: closerRef, inView: closerVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const { ref: previewRef, inView: previewVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: footerRef, inView: footerVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });

  /* ── Interactive Hero Sliders ── */
  const [budgetValue, setBudgetValue] = useState(2_500_000);
  const [acquisitionValue, setAcquisitionValue] = useState(3_000_000);
  const [salesFeePercent, setSalesFeePercent] = useState(10);

  // Live calculation
  const salesFee = acquisitionValue * (salesFeePercent / 100);
  const guilds = budgetValue * 0.055; // guilds are on production budget
  const camFee = acquisitionValue * 0.01; // CAM is on revenue
  const debtAmount = budgetValue * 0.50; // 50% of budget financed by debt
  const debtService = debtAmount * 0.12; // 12% interest on the debt
  const totalDeductions = salesFee + guilds + camFee + debtService;
  const heroNetProfit = acquisitionValue - totalDeductions;

  /* ── Waterfall Data — v17 ── */
  const WATERFALL_TIERS = [
    { tier: '01', name: 'CAM Fee', amount: 30_000, group: 'otts', mode: 'pair' as const },
    { tier: '02', name: 'Guild Residuals', amount: 165_000, group: 'otts', mode: 'pair' as const },
    { tier: '03', name: 'Agent Commission', amount: 300_000, group: 'sales', mode: 'pair' as const },
    { tier: '04', name: 'Agent Expenses', amount: 75_000, group: 'sales', mode: 'pair' as const },
    { tier: '05', name: 'Senior Debt', amount: 800_000, group: 'debt', mode: 'pair' as const },
    { tier: '06', name: 'Mezzanine Debt', amount: 200_000, group: 'debt', mode: 'pair' as const },
    { tier: '07', name: 'Equity Recoupment', amount: 1_000_000, group: 'equity', mode: 'pair' as const },
    { tier: '08', name: 'Deferments', amount: 12_000, group: 'equity', mode: 'pair' as const },
  ];
  const TOTAL_ACQUISITION = 3_000_000;
  const PRODUCTION_BUDGET = 2_500_000;
  const TAX_CREDIT = 500_000;
  const TOTAL_DEDUCTED = 2_582_000;
  const NET_PROFIT = 418_000;
  const SPLIT = 209_000;

  const waterfallSectionRef = useRef<HTMLElement | null>(null);

  // Profit celebration state
  const [profitCelebrated, setProfitCelebrated] = useState(false);
  const [profitCountUp, setProfitCountUp] = useState(0);
  const [profitGlowIntensity, setProfitGlowIntensity] = useState(0.18);
  const profitAnimRef = useRef<number>(0);

  const [splitCelebrated, setSplitCelebrated] = useState(false);
  const [splitCountUp, setSplitCountUp] = useState(0);
  const splitAnimRef = useRef<number>(0);

  const [pressedTier, setPressedTier] = useState<string | null>(null);

  // What's At Stake cards — tighter copy
  const stakeCards = [
    { num: "1", title: "Don't Sell The Same Dollar Twice", body: "Track where the money goes so you never over-promise equity." },
    { num: "2", title: "Know What You're Giving Away", body: "Every fee eats into profit before you see a dime." },
    { num: "3", title: "Explain The Deal Clearly", body: "Walk into the pitch with institutional-grade math." },
    { num: "4", title: "Protect Early Investors", body: "Keep your riskiest backers from getting blindsided by senior debt." },
  ];

  // Reality — 3 rows
  const withItems = [
    "Model every fee",
    "Show exact returns",
    "Know your leverage",
  ];
  const withoutItems = [
    "Guessing at the table",
    "Overpromising returns",
    "Giving away leverage",
  ];

  useEffect(() => {
    if (profitCardVisible && !profitCelebrated) {
      setProfitCelebrated(true);
      haptics.success();
      setProfitGlowIntensity(0.28);
      setTimeout(() => setProfitGlowIntensity(0.18), 2000);
      const duration = 1800;
      const startTime = performance.now();
      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setProfitCountUp(Math.round(NET_PROFIT * eased));
        if (progress < 1) {
          profitAnimRef.current = requestAnimationFrame(tick);
        }
      };
      profitAnimRef.current = requestAnimationFrame(tick);
    }
  }, [profitCardVisible, profitCelebrated, haptics]);

  useEffect(() => {
    if (splitVisible && !splitCelebrated) {
      setSplitCelebrated(true);
      const duration = 1200;
      const startTime = performance.now();
      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setSplitCountUp(Math.round(SPLIT * eased));
        if (progress < 1) {
          splitAnimRef.current = requestAnimationFrame(tick);
        }
      };
      splitAnimRef.current = requestAnimationFrame(tick);
    }
  }, [splitVisible, splitCelebrated]);

  // Card entrance animation helper
  const [enteredCards, setEnteredCards] = useState<Set<number>>(new Set());
  const cardObserverRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardObserverRefs.current.forEach((el, i) => {
      if (!el) return;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setEnteredCards(prev => new Set(prev).add(i));
          observer.unobserve(entry.target);
        }
      }, { threshold: 0.3 });
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const cardReveal = (entered: boolean, delay = 0): React.CSSProperties => ({
    opacity: prefersReducedMotion || entered ? 1 : 0,
    transform: prefersReducedMotion || entered ? "translateY(0)" : "translateY(20px)",
    transition: prefersReducedMotion
      ? "none"
      : `opacity 0.4s ease-out ${delay}ms, transform 0.4s ease-out ${delay}ms`,
  });

  /* ── Typing reveal for Reality section ── */
  const realityQuote = "The waterfall either costs you now — or costs you everything later.";
  const [typedChars, setTypedChars] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  useEffect(() => {
    if (!realityQuoteVisible || prefersReducedMotion) {
      if (realityQuoteVisible) { setTypedChars(realityQuote.length); setTypingDone(true); }
      return;
    }
    if (typedChars >= realityQuote.length) { setTypingDone(true); return; }
    const timer = setTimeout(() => setTypedChars(prev => prev + 1), 35);
    return () => clearTimeout(timer);
  }, [realityQuoteVisible, typedChars, prefersReducedMotion]);

  /* ── Running balance counter for waterfall ── */
  const [runningBalance, setRunningBalance] = useState(TOTAL_ACQUISITION);
  const countedTiersRef = useRef<Set<number>>(new Set());
  useEffect(() => {
    // Each time a new card enters, subtract its amount from the running balance
    enteredCards.forEach(ci => {
      if (!countedTiersRef.current.has(ci) && ci < WATERFALL_TIERS.length) {
        countedTiersRef.current.add(ci);
        setRunningBalance(prev => prev - WATERFALL_TIERS[ci].amount);
      }
    });
  }, [enteredCards]);

  /* ── Scroll progress gold thread ── */
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Eyebrow pill component ── */
  const EyebrowPill = ({ text }: { text: string }) => (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
      <span style={{
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "13px",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "#D4AF37",
        background: "rgba(212,175,55,0.12)",
        border: "1px solid rgba(212,175,55,0.30)",
        padding: "6px 18px",
        borderRadius: "999px",
        boxShadow: "0 0 16px rgba(212,175,55,0.10)",
      }}>{text}</span>
    </div>
  );

  /* ── Waterfall helper components ── */
  const WaterfallGroupLabel = ({ text, color }: { text: string; color: 'gold' | 'red' | 'green' | 'neutral' }) => {
    const textColor = color === 'gold' ? '#D4AF37' : color === 'red' ? 'rgba(220,38,38,0.85)' : color === 'green' ? '#3CB371' : 'rgba(212,175,55,0.85)';
    return (
      <div style={{ textAlign: "center", margin: "8px 0 5px" }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: textColor, letterSpacing: "0.04em" }}>{text}</span>
      </div>
    );
  };

  const WaterfallConnector = ({ color }: { color: 'gold' | 'gold-to-red' | 'red' | 'red-strong' | 'red-to-green' | 'green' }) => {
    const colorMap: Record<string, string> = {
      gold: "rgba(212,175,55,0.70)",
      'gold-to-red': "rgba(220,38,38,0.60)",
      red: "rgba(220,38,38,0.60)",
      'red-strong': "rgba(220,38,38,0.70)",
      'red-to-green': "rgba(60,179,113,0.65)",
      green: "rgba(60,179,113,0.65)",
    };
    const lineColor: Record<string, string> = {
      gold: "rgba(212,175,55,0.70)",
      'gold-to-red': "linear-gradient(180deg, rgba(212,175,55,0.70), rgba(220,38,38,0.60))",
      red: "rgba(220,38,38,0.60)",
      'red-strong': "rgba(220,38,38,0.70)",
      'red-to-green': "linear-gradient(180deg, rgba(220,38,38,0.60), rgba(60,179,113,0.65))",
      green: "rgba(60,179,113,0.65)",
    };
    const shadowMap: Record<string, string> = {
      gold: "0 0 10px rgba(212,175,55,0.50)",
      'gold-to-red': "0 0 10px rgba(220,38,38,0.35)",
      red: "0 0 10px rgba(220,38,38,0.35)",
      'red-strong': "0 0 12px rgba(220,38,38,0.40)",
      'red-to-green': "0 0 10px rgba(60,179,113,0.35)",
      green: "0 0 10px rgba(60,179,113,0.40)",
    };
    const arrowColor = colorMap[color];
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2px 0" }}>
        <div style={{
          width: "3px",
          height: "20px",
          background: lineColor[color],
          boxShadow: shadowMap[color],
          borderRadius: "1px",
        }} />
        <div style={{
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: `8px solid ${arrowColor}`,
          marginTop: "-1px",
        }} />
      </div>
    );
  };

  const wfCardStyle = (mode: string, tier?: string): React.CSSProperties => {
    const isPressed = tier != null && pressedTier === tier;
    const base: React.CSSProperties = {
      position: "relative", overflow: "hidden", borderRadius: "8px",
      background: "linear-gradient(180deg, rgba(200,64,64,0.03), #141416)",
      border: `1px solid rgba(220,38,38,${isPressed ? 0.50 : 0.30})`,
      boxShadow: isPressed
        ? "0 6px 20px rgba(0,0,0,0.40), 0 1px 3px rgba(0,0,0,0.20), 0 0 20px rgba(220,38,38,0.15)"
        : "0 4px 16px rgba(0,0,0,0.30), 0 1px 3px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.03)",
      transition: "border-color 0.15s ease-out, box-shadow 0.15s ease-out",
    };
    if (mode === 'pair') {
      return { ...base, padding: "14px 12px", minHeight: "120px", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" };
    }
    return { ...base, padding: "16px 18px" };
  };

  const wfBadge = (): React.CSSProperties => ({
    width: "32px", height: "32px", borderRadius: "50%",
    background: "rgba(212,175,55,0.18)",
    border: "1px solid rgba(212,175,55,0.40)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.95rem", color: "#D4AF37",
    marginBottom: "5px",
    marginLeft: "auto",
    marginRight: "auto",
    position: "relative", zIndex: 1,
  });

  /* ── Format currency helper ── */
  const fmt = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
    return `$${Math.round(n).toLocaleString()}`;
  };

  const fmtFull = (n: number) => `$${Math.round(n).toLocaleString()}`;

  return (
    <>
      {/* ── Keyframe injection ── */}
      <style>{`
        @keyframes lp-shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes cta-idle-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(249,224,118,0.15), 0 8px 24px rgba(0,0,0,0.5); }
          50% { box-shadow: 0 0 32px rgba(249,224,118,0.25), 0 8px 24px rgba(0,0,0,0.5); }
        }
        input[type="range"]:focus-visible { outline: 2px solid #D4AF37; outline-offset: 2px; }
      `}</style>

      {/* ── Scroll progress gold thread ── */}
      {!footerVisible && (
        <div className="scroll-thread" style={{
          position: "fixed",
          top: 0,
          left: "max(8px, calc(50% - 500px))",
          width: "3px",
          height: `${scrollProgress * 100}%`,
          background: "linear-gradient(180deg, rgba(212,175,55,0.55), rgba(212,175,55,0.15))",
          zIndex: 5,
          pointerEvents: "none",
          transition: "height 0.1s linear, opacity 0.3s ease",
          opacity: scrollProgress < 0.15 ? scrollProgress / 0.15 : scrollProgress > 0.85 ? (1 - scrollProgress) / 0.15 : 1,
        }} />
      )}

      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #141416 0%, #151517 50%, #141416 100%)", paddingTop: "24px", maxWidth: "1000px", margin: "0 auto", position: "relative", overflow: "hidden" }}>

        {/* ── Atmospheric glow orbs — pre-blurred static gradients (no runtime filter) ── */}
        <div style={{ position: "absolute", top: "0px", left: "50%", transform: "translateX(-50%)", width: "min(650px, 120vw)", height: "700px", background: "radial-gradient(ellipse, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 35%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", top: "2000px", left: "50%", transform: "translateX(-50%)", width: "min(700px, 120vw)", height: "550px", background: "radial-gradient(ellipse, rgba(212,175,55,0.09) 0%, rgba(212,175,55,0.03) 35%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", top: "4000px", left: "50%", transform: "translateX(-50%)", width: "min(650px, 120vw)", height: "600px", background: "radial-gradient(ellipse, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.03) 35%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

        {/* ═══ § 1 INTERACTIVE HERO ═══ */}
        <section ref={heroRef} style={{ position: "relative", padding: "0 clamp(14px, 4vw, 40px) 8px" }}>
          {/* ── Hero Container — "The Poster" ── */}
          <div style={{
            ...reveal(heroVisible),
            position: "relative",
            overflow: "hidden",
            background: "#222226",
            border: "1px solid rgba(255,255,255,0.08)",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "8px",
            padding: "28px clamp(24px, 5vw, 40px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.55), 0 0 1px rgba(255,255,255,0.05), 0 0 1px rgba(212,175,55,0.06)",
          }} className="grain-surface">
          {/* Hero header band — poster composition: headline → subtitle → CTA */}
          <div style={{ background: "linear-gradient(180deg, rgba(212,175,55,0.08), #141416)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "1px solid rgba(255,255,255,0.10)", borderRadius: "6px", padding: "32px 24px 28px", textAlign: "center", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.25)" }}>
            <h1 style={styles.heroH1}>
              Model Your
              <span style={styles.heroMid}>Recoupment</span>
              <em style={styles.heroEm}>Waterfall</em>
            </h1>
            {/* CTA inside the poster */}
            <div style={{ marginTop: "24px" }}>
              <button onClick={handleCTA} style={styles.ctaBtn} className="cta-gold-btn animate-cta-glow-pulse" aria-label="Build my waterfall" onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }} onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
                <span style={{ position: "relative", zIndex: 1 }}>BUILD MY WATERFALL — FREE</span>
                <div style={styles.ctaShimmer} />
              </button>
              <p onClick={() => navigate("/pricing")} style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#F9E076", textAlign: "center", marginTop: "12px", cursor: "pointer", letterSpacing: "0.02em" }} onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }} onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}>See Pricing →</p>
            </div>
          </div>

          {/* ── Divider between poster & calculator ── */}
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", margin: "0 8px" }} />

          {/* ── Mini Calculator — separate interactive beat ── */}
          <div style={{
            ...reveal(heroVisible, 1),
            marginTop: "20px",
            background: "#141416",
            border: "1px solid rgba(255,255,255,0.06)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "6px",
            padding: "20px 18px",
            boxShadow: "inset 0 2px 6px rgba(0,0,0,0.25)",
          }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
              <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "13px", color: "rgba(212,175,55,0.80)", letterSpacing: "0.10em", textTransform: "uppercase", textAlign: "center", display: "inline-block", background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.22)", padding: "3px 10px", borderRadius: "999px" }} className="pill-breathe">Drag to model your deal</p>
            </div>
            {/* Slider: Budget */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={styles.sliderLabel}>Production Budget</span>
                <span style={{ ...styles.sliderValue, color: "#FFFFFF" }}>{fmt(budgetValue)}</span>
              </div>
              <input
                type="range"
                min={500_000}
                max={10_000_000}
                step={100_000}
                value={budgetValue}
                onChange={(e) => setBudgetValue(Number(e.target.value))}
                className="slider-budget"
                style={{ ...styles.slider, background: `linear-gradient(to right, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.35) ${((budgetValue - 500000) / (10000000 - 500000)) * 100}%, rgba(255,255,255,0.14) ${((budgetValue - 500000) / (10000000 - 500000)) * 100}%, rgba(255,255,255,0.14) 100%)` }}
              />
            </div>

            {/* Slider: Acquisition */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={styles.sliderLabel}>Acquisition Price</span>
                <span style={styles.sliderValue}>{fmt(acquisitionValue)}</span>
              </div>
              <input
                type="range"
                min={500_000}
                max={15_000_000}
                step={100_000}
                value={acquisitionValue}
                onChange={(e) => setAcquisitionValue(Number(e.target.value))}
                className="slider-acquisition"
                style={{ ...styles.slider, background: `linear-gradient(to right, rgba(212,175,55,0.35) 0%, rgba(212,175,55,0.35) ${((acquisitionValue - 500000) / (15000000 - 500000)) * 100}%, rgba(255,255,255,0.14) ${((acquisitionValue - 500000) / (15000000 - 500000)) * 100}%, rgba(255,255,255,0.14) 100%)` }}
              />
            </div>

            {/* Slider: Sales Fee */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={styles.sliderLabel}>Sales Agent Fee</span>
                <span style={{ ...styles.sliderValue, color: "#C84040" }}>{salesFeePercent}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                step={1}
                value={salesFeePercent}
                onChange={(e) => setSalesFeePercent(Number(e.target.value))}
                className="slider-salesfee"
                style={{ ...styles.slider, background: `linear-gradient(to right, rgba(220,38,38,0.50) 0%, rgba(220,38,38,0.50) ${(salesFeePercent / 25) * 100}%, rgba(255,255,255,0.14) ${(salesFeePercent / 25) * 100}%, rgba(255,255,255,0.14) 100%)` }}
              />
            </div>

            {/* ── Summary deduction bar ── */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "13px", color: warmWhite(0.80), letterSpacing: "0.06em", textTransform: "uppercase" }}>Total Deductions</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: "rgba(200,64,64,0.90)" }}>{fmt(totalDeductions)}</span>
              </div>
              <div style={{ height: "10px", background: "rgba(255,255,255,0.12)", borderRadius: "5px", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${Math.min((totalDeductions / acquisitionValue) * 100, 100)}%`,
                  background: "linear-gradient(90deg, rgba(220,38,38,0.80), rgba(220,38,38,0.55))",
                  borderRadius: "5px",
                  transition: "width 0.3s ease-out",
                  boxShadow: "0 0 10px rgba(220,38,38,0.30), 0 0 20px rgba(220,38,38,0.12)",
                }} />
              </div>
            </div>

            {/* ── Divider ── */}
            <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)", margin: "0 0 14px" }} />

            {/* ── Net Profit output ── */}
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "12px", color: warmWhite(0.75), letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>Estimated Net Profit</p>
              <p style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontVariantNumeric: "tabular-nums",
                fontSize: heroNetProfit < 0 ? "clamp(2.4rem, 8vw, 3.2rem)" : Math.abs(heroNetProfit) >= 500000 ? "3.8rem" : "3.2rem",
                lineHeight: 1,
                color: heroNetProfit >= 0 ? "#4DAF78" : "#C84040",
                textShadow: heroNetProfit >= 0
                  ? "0 0 24px rgba(77,175,120,0.40), 0 0 60px rgba(77,175,120,0.12)"
                  : "0 0 24px rgba(200,64,64,0.40), 0 0 60px rgba(200,64,64,0.12)",
                transition: "color 0.3s ease",
              }}>
                {heroNetProfit >= 0 ? '' : '–'}{fmtFull(Math.abs(heroNetProfit))}
              </p>
            </div>
          </div>

          </div>
        </section>


        {/* ── Section spacer ── */}
        <div style={{ height: "32px", background: "radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.015) 0%, transparent 70%)" }} />

        {/* ═══ § 5.5 PRODUCT PREVIEW — Real Output ═══ */}
        <section ref={previewRef} style={{ padding: "0 clamp(14px, 4vw, 40px)", marginBottom: "0" }}>
          <div style={{
            ...reveal(previewVisible),
            position: "relative",
            overflow: "hidden",
            background: "#222226",
            border: "1px solid rgba(255,255,255,0.10)",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "8px",
            padding: "32px clamp(24px, 5vw, 40px)",
            boxShadow: "0 6px 28px rgba(0,0,0,0.50), 0 0 1px rgba(255,255,255,0.04), 0 0 1px rgba(212,175,55,0.06)",
          }} className="grain-surface">
            <div style={{ background: "linear-gradient(180deg, rgba(212,175,55,0.08), #141416)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "1px solid rgba(255,255,255,0.10)", borderRadius: "6px", padding: "28px 24px", marginBottom: "20px", textAlign: "center", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.25)" }}>
              <EyebrowPill text="What You'll Build" />
              <h2 style={styles.sectionH2}>Your Complete<br /><span style={{ color: "#D4AF37", textShadow: "0 0 30px rgba(212,175,55,0.55), 0 0 80px rgba(212,175,55,0.18)" }}>Deal Brief</span></h2>
            </div>
            <div className="scrollbar-hide preview-scroll">

            {/* Card 1: Mini Waterfall Cascade */}
            <div style={{
              minWidth: "280px", background: "linear-gradient(180deg, rgba(212,175,55,0.03), #141416)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "6px", padding: "24px", scrollSnapAlign: "start", flexShrink: 0,
              boxShadow: "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
            }} className="preview-card">
              <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: "rgba(212,175,55,0.80)", letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: "12px" }}>Recoupment Cascade</p>
              {[
                { label: "Sales Agent", pct: 100, color: "#4DAF78", badge: "FUNDED" },
                { label: "Senior Debt", pct: 100, color: "#4DAF78", badge: "FUNDED" },
                { label: "Equity + Premium", pct: 72, color: "#F0A830", badge: "PARTIAL" },
                { label: "Deferments", pct: 0, color: "#C84040", badge: "ZERO" },
              ].map((row) => (
                <div key={row.label} style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: row.color }} />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: warmWhite(0.70) }}>{row.label}</span>
                    </div>
                    <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 6px", borderRadius: "2px", background: row.color === "#3CB371" ? "rgba(60,179,113,0.20)" : row.color === "#F0A830" ? "rgba(240,168,48,0.20)" : "rgba(220,38,38,0.18)", color: row.color }}>{row.badge}</span>
                  </div>
                  <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${row.pct}%`, borderRadius: "2px", background: row.color === "#3CB371" ? "rgba(60,179,113,0.55)" : row.color === "#F0A830" ? "rgba(240,168,48,0.45)" : "rgba(220,38,38,0.35)" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Card 2: Verdict / Deal Score */}
            <div style={{
              minWidth: "200px", background: "linear-gradient(180deg, rgba(77,175,120,0.03), #141416)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "6px", padding: "28px 24px", scrollSnapAlign: "start", flexShrink: 0,
              boxShadow: "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center",
            }} className="preview-card">
              <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: "rgba(77,175,120,0.65)", letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: "8px" }}>Deal Verdict</p>
              <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "48px", fontWeight: 500, color: "#4DAF78", lineHeight: 1 }}>
                1.2<span style={{ fontSize: "28px" }}>&times;</span>
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: warmWhite(0.70), marginTop: "6px" }}>Cash-on-cash multiple</p>
              <div style={{ marginTop: "10px", padding: "4px 10px", borderRadius: "3px", background: "rgba(60,179,113,0.18)" }}>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", fontWeight: 700, color: "#4DAF78", letterSpacing: "0.08em", textTransform: "uppercase" }}>SOLID DEAL</span>
              </div>
            </div>

            {/* Card 3: Profit Split */}
            <div style={{
              minWidth: "220px", background: "linear-gradient(180deg, rgba(212,175,55,0.03), #141416)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "6px", padding: "24px", scrollSnapAlign: "start", flexShrink: 0,
              boxShadow: "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
            }} className="preview-card">
              <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: "rgba(212,175,55,0.80)", letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: "12px" }}>Profit Split</p>
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <div style={{ flex: 1, textAlign: "center", padding: "10px 8px", borderRadius: "6px", background: "#141416", border: "1px solid rgba(60,179,113,0.15)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: warmWhite(0.75), letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>Investor</p>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", color: "#4DAF78" }}>$209K</p>
                </div>
                <div style={{ flex: 1, textAlign: "center", padding: "10px 8px", borderRadius: "6px", background: "#141416", border: "1px solid rgba(60,179,113,0.15)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: warmWhite(0.75), letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>Producer</p>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", color: "#4DAF78" }}>$209K</p>
                </div>
              </div>
              <div style={{ height: "1px", background: "rgba(212,175,55,0.22)", marginBottom: "10px" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: warmWhite(0.75), letterSpacing: "0.06em" }}>NET BACKEND</span>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: "#4DAF78", letterSpacing: "0.06em" }}>$418,000</span>
              </div>
            </div>

            {/* Card 4: Capital Stack */}
            <div style={{
              minWidth: "240px", background: "linear-gradient(180deg, rgba(212,175,55,0.03), #141416)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "6px", padding: "24px", scrollSnapAlign: "start", flexShrink: 0,
              boxShadow: "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
            }} className="preview-card">
              <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: "rgba(212,175,55,0.80)", letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: "12px" }}>Capital Stack</p>
              {[
                { label: "Equity", pct: 50, color: "#D4AF37" },
                { label: "Senior Debt", pct: 30, color: "#F0A830" },
                { label: "Tax Credits", pct: 15, color: "#4DAF78" },
                { label: "Gap / Mezz", pct: 5, color: "rgba(200,64,64,0.85)" },
              ].map((row) => (
                <div key={row.label} style={{ marginBottom: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: warmWhite(0.70) }}>{row.label}</span>
                    <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: row.color, fontWeight: 600 }}>{row.pct}%</span>
                  </div>
                  <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${row.pct}%`, borderRadius: "2px", background: row.color, opacity: 0.5 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Card 5: Break-Even */}
            <div style={{
              minWidth: "200px", background: "linear-gradient(180deg, rgba(77,175,120,0.03), #141416)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "6px", padding: "28px 24px", scrollSnapAlign: "start", flexShrink: 0,
              boxShadow: "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center",
            }} className="preview-card">
              <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: "rgba(77,175,120,0.65)", letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: "8px" }}>Break-Even</p>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.4rem", color: "#4DAF78", lineHeight: 1 }}>$2.1M</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: warmWhite(0.70), marginTop: "6px", marginBottom: "12px" }}>Revenue needed to recoup</p>
              <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden", position: "relative" }}>
                <div style={{ height: "100%", width: "70%", borderRadius: "3px", background: "rgba(60,179,113,0.40)" }} />
                <div style={{ position: "absolute", top: "-2px", left: "70%", width: "2px", height: "10px", background: "#D4AF37", borderRadius: "1px", transform: "translateX(-50%)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginTop: "4px" }}>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "10px", color: warmWhite(0.65) }}>$0</span>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "10px", color: warmWhite(0.65) }}>$3M</span>
              </div>
            </div>
          </div>
            {/* Swipe indicator */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: "18px" }}>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 5H2M5 1L1 5l4 4" stroke="rgba(212,175,55,0.70)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "13px", color: warmWhite(0.70), letterSpacing: "0.12em", textTransform: "uppercase" }}>Swipe</span>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5h11M9 1l4 4-4 4" stroke="rgba(212,175,55,0.70)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </section>

        {/* ── Section spacer ── */}
        <div style={{ height: "32px", background: "radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.015) 0%, transparent 70%)" }} />

        {/* ═══ § 2 WATERFALL ═══ */}
        <section ref={(el) => { waterfallSectionRef.current = el; }} className="cv-auto" style={{ padding: "0 clamp(14px, 4vw, 40px)" }}>
          <div style={{
            position: "relative",
            overflow: "hidden",
            background: "#222226",
            border: "1px solid rgba(255,255,255,0.10)",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "8px",
            padding: "36px clamp(24px, 5vw, 40px)",
            boxShadow: "0 6px 28px rgba(0,0,0,0.50), 0 0 1px rgba(255,255,255,0.04), 0 0 1px rgba(212,175,55,0.06)",
          }} className="grain-surface">
          {/* Header band */}
          <div ref={waterfallHeaderRef} style={{ ...reveal(waterfallHeaderVisible), background: "linear-gradient(180deg, rgba(212,175,55,0.08), #141416)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "1px solid rgba(255,255,255,0.10)", borderRadius: "6px", padding: "28px 24px", marginBottom: "20px", textAlign: "center", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.25)" }}>
            <EyebrowPill text="How the money flows" />
            <h2 style={styles.sectionH2}>The Recoupment<br /><span style={{ color: "#D4AF37", textShadow: "0 0 30px rgba(212,175,55,0.55), 0 0 80px rgba(212,175,55,0.18)" }}>Waterfall</span></h2>
          </div>

          <p style={{ ...styles.waterfallExplainer, ...reveal(waterfallHeaderVisible) }}>
            A recoupment waterfall maps who gets paid, in what order & how much{" "}<span style={{ color: "#D4AF37", fontWeight: 600, background: "rgba(212,175,55,0.12)", padding: "2px 8px", borderRadius: "4px", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>before you see a dollar of profit.</span>
          </p>

          {/* Gold divider — separates context from data */}
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.20), transparent)", margin: "0 auto 20px", maxWidth: "160px" }} />

          {/* ── Running Balance Counter ── */}
          <div style={{ textAlign: "center", marginBottom: "16px", ...reveal(waterfallHeaderVisible, 1) }}>
            <div style={{ display: "inline-block", background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: "999px", padding: "8px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.20)" }}>
              <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "12px", color: warmWhite(0.75), letterSpacing: "0.12em", textTransform: "uppercase" }}>REMAINING:</span>
              <span style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: "16px",
                fontWeight: 600,
                color: runningBalance > 0 ? "#D4AF37" : "#C84040",
                transition: "color 0.3s ease",
              }}>{fmtFull(runningBalance)}</span>
            </div>
          </div>

          {/* ── Acquisition Offer ── */}
          <div style={{ margin: "0", ...reveal(waterfallHeaderVisible, 1) }}>
            <WaterfallGroupLabel text="Streamer Acquisition Offer" color="neutral" />
            <div ref={waterfallCalloutRef} style={{
              position: "relative", overflow: "hidden", textAlign: "center",
              background: "#141416",
              border: "1px solid rgba(212,175,55,0.20)", borderRadius: "8px", padding: "18px 16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.35), 0 0 16px rgba(212,175,55,0.04)",
            }}>
              <p style={styles.acqAmount}>${TOTAL_ACQUISITION.toLocaleString()}</p>
            </div>
          </div>

          <WaterfallConnector color="gold" />

          {/* ── Context Block: "The Project" ── */}
          <div style={{ margin: "0", ...reveal(waterfallCalloutVisible) }}>
            <WaterfallGroupLabel text="The Project" color="neutral" />
            <div style={{ display: "flex", gap: "12px", alignItems: "stretch" }}>
              <div style={{
                flex: 1, borderRadius: "8px", padding: "10px 8px", textAlign: "center",
                border: "1px solid rgba(212,175,55,0.12)", background: "linear-gradient(180deg, rgba(212,175,55,0.02), #141416)",
              }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: warmWhite(0.92), marginBottom: "4px" }}>Production Budget</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: "#D4AF37" }}>${PRODUCTION_BUDGET.toLocaleString()}</div>
              </div>
              <div style={{
                flex: 1, borderRadius: "8px", padding: "10px 8px", textAlign: "center",
                border: "1px solid rgba(212,175,55,0.12)", background: "linear-gradient(180deg, rgba(212,175,55,0.02), #141416)",
              }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: warmWhite(0.92), marginBottom: "4px" }}>Tax Credit (20%)</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", color: "#4DAF78" }}>+${TAX_CREDIT.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <WaterfallConnector color="gold-to-red" />

          {/* ── Tier Cards ── */}
          {(() => {
            let cardIndex = 0;
            const groups: { label: string; tiers: typeof WATERFALL_TIERS }[] = [
              { label: "Off-the-Tops", tiers: WATERFALL_TIERS.filter(t => t.group === 'otts') },
              { label: "Sales Agency", tiers: WATERFALL_TIERS.filter(t => t.group === 'sales') },
              { label: "Debt Service", tiers: WATERFALL_TIERS.filter(t => t.group === 'debt') },
              { label: "Equity & Deferments", tiers: WATERFALL_TIERS.filter(t => t.group === 'equity') },
            ];

            const connectorColors: Array<'red' | 'red-strong'> = ['red', 'red', 'red'];

            return groups.map((group, gi) => {
              const groupCards = group.tiers.map((tier) => {
                const ci = cardIndex;
                cardIndex++;
                return { ...tier, ci };
              });

              const isPair = groupCards.length === 2;

              return (
                <div key={group.label}>
                  <div style={{ margin: "0" }}>
                    <WaterfallGroupLabel text={group.label} color="neutral" />
                    {isPair ? (
                      <div style={{ display: "flex", gap: "14px", alignItems: "stretch" }}>
                        <div
                          key={groupCards[0].tier}
                          ref={(el) => { cardObserverRefs.current[groupCards[0].ci] = el; }}
                          onMouseDown={() => setPressedTier(groupCards[0].tier)}
                          onMouseUp={() => setPressedTier(null)}
                          onMouseLeave={() => setPressedTier(null)}
                          onTouchStart={() => setPressedTier(groupCards[0].tier)}
                          onTouchEnd={() => setPressedTier(null)}
                          className="wf-card stamp-animate"
                          style={{
                            flex: 1,
                            ...wfCardStyle('pair', groupCards[0].tier),
                            ...cardReveal(enteredCards.has(groupCards[0].ci), 0),
                          }}
                        >
                          <div style={wfBadge()}>{groupCards[0].tier}</div>
                          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "#fff", textTransform: "uppercase", marginBottom: "3px", textAlign: "center" }}>{groupCards[0].name}</div>
                          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", color: "rgba(200,64,64,0.90)", textShadow: "0 0 16px rgba(200,64,64,0.30)", textAlign: "center" }}>–${groupCards[0].amount.toLocaleString()}</div>
                        </div>
                        <div
                          key={groupCards[1].tier}
                          ref={(el) => { cardObserverRefs.current[groupCards[1].ci] = el; }}
                          onMouseDown={() => setPressedTier(groupCards[1].tier)}
                          onMouseUp={() => setPressedTier(null)}
                          onMouseLeave={() => setPressedTier(null)}
                          onTouchStart={() => setPressedTier(groupCards[1].tier)}
                          onTouchEnd={() => setPressedTier(null)}
                          className="wf-card stamp-animate"
                          style={{
                            flex: 1,
                            ...wfCardStyle('pair', groupCards[1].tier),
                            ...cardReveal(enteredCards.has(groupCards[1].ci), 100),
                          }}
                        >
                          <div style={wfBadge()}>{groupCards[1].tier}</div>
                          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "#fff", textTransform: "uppercase", marginBottom: "3px", textAlign: "center" }}>{groupCards[1].name}</div>
                          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", color: "rgba(200,64,64,0.90)", textShadow: "0 0 16px rgba(200,64,64,0.30)", textAlign: "center" }}>–${groupCards[1].amount.toLocaleString()}</div>
                        </div>
                      </div>
                    ) : (
                      groupCards.map((tier) => (
                        <div
                          key={tier.tier}
                          ref={(el) => { cardObserverRefs.current[tier.ci] = el; }}
                          onMouseDown={() => setPressedTier(tier.tier)}
                          onMouseUp={() => setPressedTier(null)}
                          onMouseLeave={() => setPressedTier(null)}
                          onTouchStart={() => setPressedTier(tier.tier)}
                          onTouchEnd={() => setPressedTier(null)}
                          className="wf-card stamp-animate"
                          style={{
                            ...wfCardStyle(tier.mode, tier.tier),
                            ...cardReveal(enteredCards.has(tier.ci)),
                            marginBottom: groupCards.indexOf(tier) < groupCards.length - 1 ? "10px" : "0",
                          }}
                        >
                          <div style={wfBadge()}>{tier.tier}</div>
                          <div style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: "1.4rem",
                            color: "#fff", textTransform: "uppercase", marginBottom: "3px",
                            textAlign: "center",
                          }}>{tier.name}</div>
                          <div style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: "1.6rem",
                            color: "rgba(200,64,64,0.88)",
                            textAlign: "center",
                          }}>–${tier.amount.toLocaleString()}</div>
                        </div>
                      ))
                    )}
                  </div>
                  {gi < groups.length - 1 && <WaterfallConnector color={connectorColors[gi]} />}
                </div>
              );
            });
          })()}

          <WaterfallConnector color="red-strong" />

          {/* ── Total Off The Top ── */}
          <div style={{ margin: "0" }}>
            <WaterfallGroupLabel text="Total Off The Top" color="neutral" />
            <div style={{
              borderRadius: "8px", padding: "24px 20px", textAlign: "center",
              border: "1px solid rgba(220,38,38,0.30)",
              background: "radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.08) 0%, #121214 70%)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.35), 0 0 20px rgba(220,38,38,0.06)",
            }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.4rem", color: "rgba(200,64,64,0.85)" }}>–${TOTAL_DEDUCTED.toLocaleString()}</div>
              <div style={{ marginTop: "12px", height: "8px", background: "rgba(255,255,255,0.10)", borderRadius: "4px", overflow: "hidden", display: "flex" }}>
                <div style={{ height: "100%", width: `${((TOTAL_ACQUISITION - TOTAL_DEDUCTED) / TOTAL_ACQUISITION) * 100}%`, background: "rgba(60,179,113,0.50)", borderRadius: "4px 0 0 4px" }} />
                <div style={{ height: "100%", flex: 1, background: "rgba(220,38,38,0.50)", borderRadius: "0 4px 4px 0" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: warmWhite(0.85), letterSpacing: "0.08em", textTransform: "uppercase" }}>Remaining</span>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: warmWhite(0.85), letterSpacing: "0.08em", textTransform: "uppercase" }}>Deducted</span>
              </div>
            </div>
          </div>

          <WaterfallConnector color="red-to-green" />

          {/* ── Net Backend Profit ── */}
          <div style={{ margin: "0" }}>
            <WaterfallGroupLabel text="Net Backend Profit" color="neutral" />
            <div
              ref={profitCardRef}
              style={{
                borderRadius: "8px", padding: "20px 16px", textAlign: "center",
                border: "1px solid rgba(60,179,113,0.55)",
                background: `radial-gradient(ellipse at 50% 0%, rgba(60,179,113,${profitGlowIntensity}) 0%, #121214 70%)`,
                boxShadow: "0 8px 24px rgba(0,0,0,0.35), 0 0 40px rgba(60,179,113,0.15), 0 0 1px rgba(60,179,113,0.20)",
                transition: "background 500ms ease",
              }}
            >
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", color: "#4DAF78", lineHeight: 1, textShadow: "0 0 28px rgba(60,179,113,0.55), 0 0 60px rgba(60,179,113,0.20)" }}>
                ${profitCountUp.toLocaleString()}
              </div>
            </div>
          </div>

          <WaterfallConnector color="green" />

          {/* ── Profit Split ── */}
          <div ref={splitRef} style={{ margin: "0" }}>
            <WaterfallGroupLabel text="Profit Split" color="neutral" />
            <div style={{ display: "flex", gap: "12px", alignItems: "stretch" }}>
              <div style={{
                flex: 1, textAlign: "center", borderRadius: "8px", padding: "16px 12px",
                border: "1px solid rgba(60,179,113,0.25)",
                background: "linear-gradient(180deg, rgba(212,175,55,0.02), #141416)",
              }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: warmWhite(0.92), marginBottom: "6px" }}>Investor</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#4DAF78" }}>${splitCountUp.toLocaleString()}</div>
              </div>
              <div style={{
                flex: 1, textAlign: "center", borderRadius: "8px", padding: "16px 12px",
                border: "1px solid rgba(60,179,113,0.25)",
                background: "linear-gradient(180deg, rgba(212,175,55,0.02), #141416)",
              }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: warmWhite(0.92), marginBottom: "6px" }}>Producer</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#4DAF78" }}>${splitCountUp.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* CTA after waterfall */}
          <div style={{ padding: "24px 0 8px" }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: warmWhite(0.65), textAlign: "center", marginBottom: "14px", letterSpacing: "0.02em" }}>Ready to model your own deal?</p>
            <button onClick={handleCTA} style={styles.ctaBtn} className="cta-gold-btn animate-cta-glow-pulse" aria-label="Build my waterfall" onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }} onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
              <span style={{ position: "relative", zIndex: 1 }}>BUILD MY WATERFALL</span>
              <div style={styles.ctaShimmer} />
            </button>
            <p onClick={() => navigate("/pricing")} style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#F9E076", textAlign: "center", marginTop: "12px", cursor: "pointer", letterSpacing: "0.02em" }} onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }} onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}>See Pricing →</p>

          </div>
          </div>
        </section>

        {/* ── Gold divider + spacer ── */}
        <div style={{ height: "56px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ height: "1px", width: "120px", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.22), transparent)" }} />
        </div>

        {/* ═══ § 4 WHAT'S AT STAKE ═══ */}
        <section ref={stakeRef} style={{ padding: "0 clamp(14px, 4vw, 40px)" }}>
          <div style={{
            position: "relative",
            overflow: "hidden",
            background: "#222226",
            border: "1px solid rgba(255,255,255,0.10)",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "8px",
            padding: "36px clamp(24px, 5vw, 40px)",
            boxShadow: "0 6px 28px rgba(0,0,0,0.50), 0 0 1px rgba(255,255,255,0.04), 0 0 1px rgba(212,175,55,0.06)",
          }} className="grain-surface">
          <div style={{ ...reveal(stakeVisible), background: "linear-gradient(180deg, rgba(212,175,55,0.08), #141416)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "1px solid rgba(255,255,255,0.10)", borderRadius: "6px", padding: "28px 24px", marginBottom: "20px", textAlign: "center", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.25)" }}>
            <EyebrowPill text="What's At Stake" />
            <h2 style={styles.sectionH2}><span style={{ color: "#D4AF37", textShadow: "0 0 30px rgba(212,175,55,0.55), 0 0 80px rgba(212,175,55,0.18)" }}>(4) Four</span> Reasons<br />You Can't Skip</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {stakeCards.map((card, i) => (
              <div
                key={card.num}
                className="stake-card"
                style={{
                  ...reveal(stakeVisible, i + 1),
                  background: "linear-gradient(180deg, rgba(212,175,55,0.03), #141416)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderTop: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "6px",
                  padding: "22px 20px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(212,175,55,0.18)", border: "1px solid rgba(212,175,55,0.40)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: "#D4AF37", lineHeight: 1 }}>{card.num}</span>
                  </div>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", color: warmWhite(0.95), lineHeight: 1.1, margin: 0 }}>{card.title}</p>
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: warmWhite(0.85), lineHeight: 1.6 }}>{card.body}</p>
              </div>
            ))}
          </div>
          </div>
        </section>

        {/* ── Section spacer ── */}
        <div style={{ height: "32px", background: "radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.015) 0%, transparent 70%)" }} />

        {/* ═══ § 5 REALITY ═══ */}
        <section style={{ padding: "0 clamp(14px, 4vw, 40px)" }}>
          <div style={{
            position: "relative",
            overflow: "hidden",
            background: "#222226",
            border: "1px solid rgba(255,255,255,0.10)",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "8px",
            padding: "36px clamp(24px, 5vw, 40px)",
            boxShadow: "0 6px 28px rgba(0,0,0,0.50), 0 0 1px rgba(255,255,255,0.04), 0 0 1px rgba(212,175,55,0.06)",
            textAlign: "left",
          }} className="grain-surface">
          {/* Header band */}
          <div style={{ background: "linear-gradient(180deg, rgba(212,175,55,0.08), #141416)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "1px solid rgba(255,255,255,0.10)", borderRadius: "6px", padding: "28px 24px", marginBottom: "20px", textAlign: "center", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.25)" }}>
            <EyebrowPill text="The Reality" />
            <h2 style={styles.sectionH2}>Know Before You <span style={{ color: "#D4AF37", textShadow: "0 0 30px rgba(212,175,55,0.55), 0 0 80px rgba(212,175,55,0.18)" }}>Negotiate</span></h2>
          </div>

          {/* Typing reveal blockquote */}
          <div
            ref={realityQuoteRef}
            style={{
              background: "linear-gradient(180deg, rgba(212,175,55,0.04), #141416)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderTop: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              padding: "28px 24px",
              textAlign: "center",
              marginBottom: "24px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.04)",
              ...reveal(realityQuoteVisible),
            }}
          >
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "2rem",
              color: "#fff",
              lineHeight: 1.1,
              letterSpacing: "0.02em",
            }}>
              {typingDone ? (
                <>
                  {realityQuote.slice(0, realityQuote.lastIndexOf("later."))}
                  <span style={{ color: "#D4AF37", textShadow: "0 0 20px rgba(212,175,55,0.30)" }}>later.</span>
                </>
              ) : (
                <>
                  {realityQuote.slice(0, typedChars)}
                  <span className="typing-cursor" style={{ display: "inline-block", width: "2px", height: "2rem", background: "#D4AF37", marginLeft: "2px", verticalAlign: "text-bottom", animation: "cursor-blink 0.8s steps(2) infinite" }} />
                </>
              )}
            </p>
          </div>

          {/* WITH/WITHOUT grid — 3 rows */}
          <div ref={realityGridRef} style={{
            ...reveal(realityGridVisible),
            background: "#141416",
            border: "1px solid rgba(255,255,255,0.08)",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "inset 0 2px 6px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.15)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
          }}>
            {/* Header — WITH */}
            <div style={{
              background: "linear-gradient(180deg, rgba(77,175,120,0.05), #141416)",
              padding: "18px 16px",
              borderBottom: "1px solid rgba(77,175,120,0.15)",
              display: "flex", alignItems: "center",
            }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: "#4DAF78", letterSpacing: "0.04em" }}>WITH</span>
            </div>
            {/* Header — WITHOUT */}
            <div style={{
              background: "linear-gradient(180deg, rgba(200,64,64,0.05), #141416)",
              padding: "18px 16px",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              borderBottom: "1px solid rgba(220,38,38,0.12)",
              display: "flex", alignItems: "center",
            }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: "rgba(200,64,64,0.85)", letterSpacing: "0.04em" }}>WITHOUT</span>
            </div>
            {/* Rows */}
            {withItems.map((withItem, i) => (
              <React.Fragment key={i}>
                <div style={{
                  ...reveal(realityGridVisible, i + 1),
                  background: "rgba(60,179,113,0.04)",
                  display: "flex", gap: "10px",
                  padding: "18px 16px", alignItems: "flex-start",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, filter: "drop-shadow(0 0 6px rgba(77,175,120,0.25))" }}><path d="M3.5 9.5L7 13L14.5 5.5" stroke="#4DAF78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: 1.4, color: warmWhite(0.90) }}>{withItem}</span>
                </div>
                <div style={{
                  ...reveal(realityGridVisible, i + 1),
                  background: "rgba(220,38,38,0.04)",
                  display: "flex", gap: "10px",
                  padding: "18px 16px", alignItems: "flex-start",
                  borderLeft: "1px solid rgba(255,255,255,0.06)",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, filter: "drop-shadow(0 0 6px rgba(200,64,64,0.20))" }}><path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="rgba(200,64,64,0.85)" strokeWidth="2" strokeLinecap="round" /></svg>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: 1.4, color: warmWhite(0.85) }}>{withoutItems[i]}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          </div>
        </section>

        {/* ── Section spacer ── */}
        <div style={{ height: "32px", background: "radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.015) 0%, transparent 70%)" }} />

        {/* ═══ § 3 SOCIAL PROOF ═══ */}
        <section ref={socialRef} style={{ padding: "0 clamp(14px, 4vw, 40px)" }}>
          <div style={{
            position: "relative",
            overflow: "hidden",
            background: "#222226",
            border: "1px solid rgba(255,255,255,0.10)",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "8px",
            padding: "36px clamp(24px, 5vw, 40px)",
            boxShadow: "0 6px 28px rgba(0,0,0,0.50), 0 0 1px rgba(255,255,255,0.04), 0 0 1px rgba(212,175,55,0.06)",
          }} className="grain-surface">
          <div style={{ ...reveal(socialVisible), background: "linear-gradient(180deg, rgba(212,175,55,0.08), #141416)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "1px solid rgba(255,255,255,0.10)", borderRadius: "6px", padding: "28px 24px", marginBottom: "20px", textAlign: "center", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.25)" }}>
            <EyebrowPill text="Trusted By Filmmakers" />
            <h2 style={styles.sectionH2}>Real Numbers.<br /><span style={{ color: "#D4AF37", textShadow: "0 0 30px rgba(212,175,55,0.55), 0 0 80px rgba(212,175,55,0.18)" }}>Real Meetings.</span></h2>
          </div>

          {/* Testimonial blockquote */}
          <div style={{
            ...reveal(socialVisible, 1),
            padding: "24px 24px",
            margin: "16px 0 24px",
            background: "linear-gradient(180deg, rgba(212,175,55,0.03), #141416)",
            borderRadius: "6px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.20)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            borderLeft: "3px solid rgba(212,175,55,0.40)",
          }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: warmWhite(0.90), lineHeight: 1.6, fontStyle: "italic" }}>
              "Finally, a tool that speaks the language of independent film finance. I walked into my investor meeting with real numbers."
            </p>
            <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "13px", color: warmWhite(0.85), marginTop: "8px", letterSpacing: "0.06em" }}>
              — Independent Producer, Sundance Lab Fellow
            </p>
          </div>

          {/* By the Numbers */}
          <div style={{ ...reveal(socialVisible, 2), display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", margin: "0 0 24px" }}>
            {[
              { number: "500+", label: "Waterfalls Built" },
              { number: "90s", label: "Time to Model" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center", flex: "1 1 0", maxWidth: "180px", padding: "16px 24px", background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#D4AF37", lineHeight: 1 }}>{stat.number}</div>
                <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: warmWhite(0.65), letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "4px" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Gold divider */}
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.20), transparent)", margin: "0 0 20px" }} />

          {/* Feature badges — text only, no emojis */}
          <div style={{ ...reveal(socialVisible, 3), display: "flex", flexWrap: "wrap", gap: "12px", rowGap: "14px", justifyContent: "center" }}>
            {["11-Tier Waterfall", "PDF Export", "Profit Split", "Deal Verdict"].map((feat) => (
              <div key={feat} style={{
                fontFamily: "'Roboto Mono', monospace", fontSize: "11px",
                color: "rgba(212,175,55,0.70)", letterSpacing: "0.06em",
                textTransform: "uppercase", padding: "6px 12px", borderRadius: "999px",
                border: "1px solid rgba(212,175,55,0.22)", background: "rgba(212,175,55,0.05)",
              }} className="badge-stagger">{feat}</div>
            ))}
          </div>
          </div>
        </section>

        {/* ── Gold divider + spacer ── */}
        <div style={{ height: "56px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ height: "1px", width: "120px", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.22), transparent)" }} />
        </div>

        {/* ═══ § 6 CLOSER ═══ */}
        <section ref={closerRef} style={{ padding: "0 clamp(14px, 4vw, 40px)" }}>
          <div style={{
            ...reveal(closerVisible),
            position: "relative",
            overflow: "hidden",
            background: "#222226",
            border: "1px solid rgba(255,255,255,0.08)",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "8px",
            padding: "40px clamp(24px, 5vw, 40px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.55), 0 0 1px rgba(255,255,255,0.05), 0 0 1px rgba(212,175,55,0.08), 0 0 80px rgba(212,175,55,0.08)",
          }} className="grain-surface">
            {/* Header band */}
            <div style={{ background: "linear-gradient(180deg, rgba(212,175,55,0.08), #141416)", border: "1px solid rgba(255,255,255,0.08)", borderTop: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", padding: "32px 24px", marginBottom: "24px", textAlign: "center", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.25)" }}>
              <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.8rem, 7vw, 3.6rem)",
                color: "#fff",
                textAlign: "center",
                lineHeight: 0.95,
                margin: "0",
              }}>
                YOUR NEXT PITCH<br />
                <span style={{ color: "#D4AF37", textShadow: "0 0 40px rgba(212,175,55,0.50), 0 0 80px rgba(212,175,55,0.20)" }}>IS COMING.</span>
              </h2>
            </div>
            {/* Body + CTA */}
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: "17px", color: warmWhite(0.92),
              lineHeight: 1.6, margin: "0 auto 28px", textAlign: "center", maxWidth: "420px",
            }}>
              Will you have the answer? Build your waterfall now and walk in prepared.
            </p>
            <button onClick={handleCTA} style={styles.ctaBtn} className="cta-gold-btn animate-cta-glow-pulse" aria-label="Build my waterfall" onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }} onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
              <span style={{ position: "relative", zIndex: 1 }}>BUILD MY WATERFALL — FREE</span>
              <div style={styles.ctaShimmer} />
            </button>
            <p onClick={() => navigate("/pricing")} style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#F9E076", textAlign: "center", marginTop: "12px", cursor: "pointer", letterSpacing: "0.02em" }} onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }} onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}>See Pricing →</p>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer ref={footerRef} style={{ ...styles.footer, position: "relative", overflow: "hidden", opacity: prefersReducedMotion || footerVisible ? 1 : 0, transition: prefersReducedMotion ? "none" : "opacity 0.8s ease-out", marginTop: "40px" }}>
          {/* Footer warm glow */}
          <div style={{ position: "absolute", bottom: "0", left: "50%", transform: "translateX(-50%)", width: "300px", height: "120px", background: "radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(40px)" }} />
          {/* Premium divider */}
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.20), transparent)", maxWidth: "200px", margin: "0 auto 28px" }} />
          <div style={styles.footerLinks}>
            <a href="https://www.instagram.com/filmmaker.og" target="_blank" rel="noopener noreferrer" style={styles.footerIcon} aria-label="Instagram" onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.65)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.50)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.15)"; }}>
              <Instagram size={18} />
            </a>
            <a href="https://www.tiktok.com/@filmmaker.og" target="_blank" rel="noopener noreferrer" style={styles.footerIcon} aria-label="TikTok" onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.65)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.50)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.15)"; }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.2 8.2 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.14z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/filmmaker.og" target="_blank" rel="noopener noreferrer" style={styles.footerIcon} aria-label="Facebook" onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.65)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.50)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.15)"; }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
          <div style={styles.footerNav}>
            <span onClick={() => navigate("/calculator")} style={styles.footerNavLink} onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.50)"; }}>Calculator</span>
            <span style={{ color: "rgba(212,175,55,0.25)", fontSize: "14px" }}>·</span>
            <span onClick={() => navigate("/pricing")} style={styles.footerNavLink} onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.50)"; }}>Pricing</span>
            <span style={{ color: "rgba(212,175,55,0.25)", fontSize: "14px" }}>·</span>
            <span onClick={() => navigate("/resources")} style={styles.footerNavLink} onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.50)"; }}>Resources</span>
          </div>
          <p style={styles.footerText}>
            For educational and informational purposes only. Not legal, tax, or investment advice. Consult a qualified entertainment attorney before making financing decisions.
          </p>
          <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.45)", textAlign: "center", marginTop: "16px", letterSpacing: "0.08em" }}>
            Best viewed in the dark.
          </p>
        </footer>
      </div>
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════
   STYLES — v17
   ══════════════════════════════════════════════════════════════════ */
const styles: Record<string, React.CSSProperties> = {
  /* ── CTA Button — gold with black text ── */
  ctaBtn: {
    position: "relative", overflow: "hidden",
    fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700,
    textTransform: "uppercase", color: "#000",
    background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 40%, rgba(0,0,0,0.1) 100%), #F9E076", padding: "18px 0",
    letterSpacing: "0.12em", fontSize: "20px",
    borderRadius: "8px", border: "none", borderTop: "1px solid rgba(255,255,255,0.15)", borderBottom: "2px solid rgba(180,145,30,0.30)", cursor: "pointer",
    display: "block", width: "100%", textAlign: "center",
    boxShadow: "0 6px 20px rgba(180,145,30,0.25), 0 2px 4px rgba(0,0,0,0.30)",
    animation: "cta-idle-glow 4s ease-in-out infinite",
  },
  ctaShimmer: {
    position: "absolute", top: 0, left: "-100%", width: "55%", height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
    transform: "skewX(-20deg)",
    animation: "lp-shimmer 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.5s 1",
  },
  ctaReassurance: {
    fontFamily: "'Roboto Mono', monospace", fontSize: "11px",
    color: "rgba(212,175,55,0.90)", letterSpacing: "0.12em",
    textTransform: "uppercase", textAlign: "center", marginTop: "12px",
  },

  /* ── § 1 HERO ── */
  heroH1: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3.2rem, 8vw, 4.4rem)", color: "#fff",
    textAlign: "center", marginBottom: "4px", lineHeight: 0.90, letterSpacing: "0.01em",
  },
  heroEm: { fontStyle: "normal", color: "#D4AF37", display: "block", textShadow: "0 0 40px rgba(212,175,55,0.50), 0 0 80px rgba(212,175,55,0.25)" },
  heroMid: { display: "block", color: "#fff", fontStyle: "normal" },

  /* ── Slider styles ── */
  sliderLabel: {
    fontFamily: "'Roboto Mono', monospace", fontSize: "14px",
    color: "rgba(255,255,255,0.80)", letterSpacing: "0.06em", textTransform: "uppercase",
  },
  sliderValue: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem",
    color: "#D4AF37",
  },
  slider: {
    width: "100%", height: "6px",
    WebkitAppearance: "none",
    appearance: "none",
    background: "rgba(255,255,255,0.14)",
    borderRadius: "3px",
    outline: "none",
    cursor: "pointer",
  } as React.CSSProperties,

  /* ── Section header ── */
  sectionH2: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.4rem, 6vw, 3.0rem)", color: "#fff", lineHeight: 0.95, textShadow: "0 2px 24px rgba(0,0,0,0.6)", marginBottom: "8px" },

  /* ── § 2 WATERFALL ── */
  waterfallExplainer: {
    fontFamily: "'Inter', sans-serif", fontSize: "18px", color: warmWhite(0.85),
    lineHeight: 1.65, textAlign: "center", padding: "0", marginBottom: "24px",
    maxWidth: "380px", marginLeft: "auto", marginRight: "auto",
  },
  acqAmount: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.2rem", color: "#D4AF37", lineHeight: 1, letterSpacing: "0.02em", textShadow: "0 0 30px rgba(212,175,55,0.40)" },

  /* ── FOOTER ── */
  footer: { background: "#181819", borderTop: "1px solid rgba(212,175,55,0.15)", padding: "32px 24px 40px" },
  footerLinks: { display: "flex", justifyContent: "center", gap: "24px", marginBottom: "16px" },
  footerIcon: { color: "rgba(212,175,55,0.50)", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", padding: "4px", borderRadius: "8px", border: "1px solid rgba(212,175,55,0.20)", transition: "color 0.2s ease, border-color 0.2s ease", boxSizing: "content-box" },
  footerNav: { display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "16px" },
  footerNavLink: { fontFamily: "'Roboto Mono', monospace", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(212,175,55,0.75)", cursor: "pointer", transition: "color 0.2s ease", padding: "8px 4px", minHeight: "44px", display: "flex", alignItems: "center" } as React.CSSProperties,
  footerText: { fontFamily: "'Inter', sans-serif", fontSize: "14px", textAlign: "center", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 },
};

export default Index;
