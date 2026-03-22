import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import { useInView } from "@/hooks/useInView";
import LeadCaptureModal from "@/components/LeadCaptureModal";

import { Instagram } from "lucide-react";
import { colors } from "@/lib/design-system";
/*
  PAGE STACK — v14 Waterfall Rebuild:
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
        if (event === 'SIGNED_IN' && window.location.hash.includes('access_token')) {
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
  // waterfallTableRef and waterfallFlowRef removed in v14 (card-based rebuild)

  const { ref: whyRef, inView: whyVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });

  // Arsenal — snapshot only
  const { ref: arsenalHeaderRef, inView: arsenalHeaderVisible } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const { ref: arsenalCoreRef, inView: arsenalCoreVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });

  // Reality — blockquote and grid separately
  const { ref: realityQuoteRef, inView: realityQuoteVisible } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const { ref: realityGridRef, inView: realityGridVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { ref: profitCardRef, inView: profitCardVisible } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const { ref: closerRef, inView: closerVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const { ref: footerRef, inView: footerVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });


  /* ── Waterfall Data — v16 ── */
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
  const PRODUCTION_BUDGET = 2_500_000;
  const TAX_CREDIT = 500_000;
  const TOTAL_ACQUISITION = 3_000_000;
  const TOTAL_DEDUCTED = 2_582_000;
  const NET_PROFIT = 418_000;
  const SPLIT = 209_000;

  const waterfallSectionRef = useRef<HTMLElement | null>(null);

  // Profit celebration state
  const [profitCelebrated, setProfitCelebrated] = useState(false);
  const [profitCountUp, setProfitCountUp] = useState(0);
  const [profitGlowIntensity, setProfitGlowIntensity] = useState(0.18);
  const profitAnimRef = useRef<number>(0);


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
      body: "Every tier with accurate rates, off-the-tops through net backend profit. Adjust and stress-test until you know what you can't give up.",
      icon: <svg viewBox="0 0 24 24" fill="#fff" width="22" height="22"><path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-1 14l-3.5-3.5 1.41-1.41L11 13.17l5.09-5.09 1.41 1.41L11 16z"/></svg>,
    },
    {
      title: "Export & Share",
      body: "Download a formatted PDF. Share directly with investors, financiers, and co-producers.",
      icon: <svg viewBox="0 0 24 24" fill="#fff" width="22" height="22"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>,
    },
  ];

  useEffect(() => {
    if (profitCardVisible && !profitCelebrated) {
      setProfitCelebrated(true);
      haptics.success();
      setProfitGlowIntensity(0.28);
      setTimeout(() => setProfitGlowIntensity(0.18), 600);
      const duration = 600;
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

  /* ── Eyebrow ruled component ── */
  const EyebrowRuled = ({ text }: { text: string }) => (
    <div style={styles.eyebrowRuled}>
      <div style={styles.eyebrowLine} />
      <span style={styles.eyebrowLabel}>{text}</span>
      <div style={styles.eyebrowLine} />
    </div>
  );

  /* ── Waterfall helper components ── */
  const WaterfallGroupLabel = ({ text, color }: { text: string; color: 'gold' | 'red' | 'green' | 'neutral' }) => {
    const textColor = color === 'gold' ? '#D4AF37' : color === 'red' ? 'rgba(220,38,38,0.85)' : color === 'green' ? '#3CB371' : 'rgba(255,255,255,0.88)';
    return (
      <div style={{ textAlign: "center", margin: "12px 0 6px" }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: textColor, letterSpacing: "0.04em" }}>{text}</span>
      </div>
    );
  };

  const WaterfallConnector = ({ color }: { color: 'gold' | 'gold-to-red' | 'red' | 'red-strong' | 'red-to-green' | 'green' }) => {
    const colorMap: Record<string, string> = {
      gold: "rgba(212,175,55,0.55)",
      'gold-to-red': "rgba(220,38,38,0.50)",
      red: "rgba(220,38,38,0.50)",
      'red-strong': "rgba(220,38,38,0.60)",
      'red-to-green': "rgba(60,179,113,0.55)",
      green: "rgba(60,179,113,0.55)",
    };
    const lineColor: Record<string, string> = {
      gold: "rgba(212,175,55,0.55)",
      'gold-to-red': "linear-gradient(180deg, rgba(212,175,55,0.55), rgba(220,38,38,0.50))",
      red: "rgba(220,38,38,0.50)",
      'red-strong': "rgba(220,38,38,0.60)",
      'red-to-green': "linear-gradient(180deg, rgba(220,38,38,0.50), rgba(60,179,113,0.55))",
      green: "rgba(60,179,113,0.55)",
    };
    const shadowMap: Record<string, string> = {
      gold: "0 0 8px rgba(212,175,55,0.30)",
      'gold-to-red': "0 0 8px rgba(220,38,38,0.20)",
      red: "0 0 8px rgba(220,38,38,0.20)",
      'red-strong': "0 0 10px rgba(220,38,38,0.25)",
      'red-to-green': "0 0 8px rgba(60,179,113,0.20)",
      green: "0 0 8px rgba(60,179,113,0.25)",
    };
    const arrowColor = colorMap[color];
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 24px" }}>
        <div style={{
          width: "2px",
          height: "20px",
          background: lineColor[color],
          boxShadow: shadowMap[color],
          borderRadius: "1px",
        }} />
        <div style={{
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: `6px solid ${arrowColor}`,
          marginTop: "-1px",
        }} />
      </div>
    );
  };

  const wfCardStyle = (mode: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "relative", overflow: "hidden", borderRadius: "12px",
      background: "radial-gradient(circle at 50% 40px, rgba(220,38,38,0.15) 0%, transparent 60%), rgba(6,6,6,0.92)",
      border: "1px solid rgba(220,38,38,0.25)",
      boxShadow: "0 12px 32px rgba(0,0,0,0.5), 0 0 16px rgba(220,38,38,0.10)",
    };
    if (mode === 'pair') {
      return { ...base, padding: "10px 8px" };
    }
    return { ...base, padding: "12px 16px" };
  };

  const wfBadge = (): React.CSSProperties => ({
    width: "30px", height: "30px", borderRadius: "50%",
    background: "linear-gradient(135deg, rgb(75,30,130) 0%, rgb(110,50,170) 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.95rem", color: "#fff",
    marginBottom: "5px",
    marginLeft: "auto",
    marginRight: "auto",
    boxShadow: "0 0 16px rgba(120,60,180,0.50), 0 0 32px rgba(120,60,180,0.25)",
    position: "relative", zIndex: 1,
  });

  const wfBadgeGlow = (): React.CSSProperties => ({
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    background: "radial-gradient(circle at 50% 28px, rgba(220,38,38,0.15) 0%, transparent 60%)",
    pointerEvents: "none",
  });

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

      <div style={{ minHeight: "100vh", background: "#000", paddingTop: "32px", maxWidth: "430px", margin: "0 auto" }}>

        {/* ═══ § 1 HERO ═══ */}
        <section ref={heroRef} style={styles.hero}>
          <div style={styles.heroGlow} />
          <div style={{ ...styles.heroInner, ...reveal(heroVisible) }}>
            <h1 style={styles.heroH1}>
              Model Your
              <span style={styles.heroMid}>Recoupment</span>
              <em style={styles.heroEm}>Waterfall</em>
            </h1>
            {/* subtitle killed — h1 + CTA is sufficient, subtitle was redundant with button copy */}
            <div style={{ margin: "8px 0 0" }}>
              <button onClick={handleCTA} style={styles.ctaBtn} aria-label="Run my waterfall" onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }} onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
                <span style={{ position: "relative", zIndex: 1 }}>RUN MY WATERFALL</span>
                <div style={styles.ctaShimmer} />
              </button>
              <p style={styles.ctaReassurance}>No Credit Card · Instant Results</p>
            </div>
          </div>
        </section>

        <div style={{ height: "3px", background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.50) 20%, rgba(212,175,55,0.40) 50%, rgba(120,60,180,0.50) 80%, transparent 100%)", boxShadow: "0 0 8px rgba(120,60,180,0.35), 0 0 20px rgba(120,60,180,0.20)", margin: "0 24px" }} />

        {/* ═══ § 2 HOW IT WORKS ═══ */}
        <section ref={howRef} style={styles.howSection}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "200px", background: "radial-gradient(ellipse 100% 70% at 50% 0%, rgba(120,60,180,0.20) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ ...styles.howHeader, ...reveal(howVisible) }}>
            <EyebrowRuled text="The Process" />
            <h2 style={styles.howH2}>Build in <span style={{ color: "#D4AF37" }}>Minutes</span></h2>
            <p style={styles.sectionSub}>Five steps. Five minutes. One waterfall.</p>
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

        <div style={{ height: "3px", background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.50) 20%, rgba(212,175,55,0.40) 50%, rgba(120,60,180,0.50) 80%, transparent 100%)", boxShadow: "0 0 8px rgba(120,60,180,0.35), 0 0 20px rgba(120,60,180,0.20)", margin: "0 24px" }} />

        {/* ═══ § 3 WATERFALL — v14 Card-Based Rebuild ═══ */}
        <section ref={(el) => { waterfallSectionRef.current = el; }} style={styles.waterfallSection}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "200px", background: "radial-gradient(ellipse 100% 70% at 50% 0%, rgba(120,60,180,0.20) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

          {/* Header */}
          <div ref={waterfallHeaderRef} style={{ ...styles.waterfallHeader, ...reveal(waterfallHeaderVisible) }}>
            <EyebrowRuled text="How the money flows" />
            <h2 style={styles.waterfallH2}>The Recoupment<br /><span style={{ color: "#D4AF37" }}>Waterfall</span></h2>
          </div>

          <p style={{ ...styles.waterfallExplainer, ...reveal(waterfallHeaderVisible) }}>
            A recoupment waterfall maps who gets paid, in what order & how much before you see a dollar of profit.
          </p>

          {/* ── Context Block: "The Project" — pair layout ── */}
          <div style={{ margin: "0 24px 0", ...reveal(waterfallHeaderVisible, 1) }}>
            <WaterfallGroupLabel text="The Project" color="neutral" />
            <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
              {/* Production Budget */}
              <div style={{
                flex: 1, position: "relative", overflow: "hidden", borderRadius: "12px",
                padding: "10px 8px", textAlign: "center",
                border: "1px solid rgba(212,175,55,0.30)",
                background: "radial-gradient(circle at 50% 24px, rgba(212,175,55,0.15) 0%, transparent 55%), rgba(6,6,6,0.92)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 12px rgba(212,175,55,0.08)",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.45), transparent)", zIndex: 1 }} />
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: "rgba(255,255,255,0.70)", marginBottom: "4px" }}>Production Budget</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: "#D4AF37", textShadow: "0 0 16px rgba(212,175,55,0.20)" }}>${PRODUCTION_BUDGET.toLocaleString()}</div>
              </div>
              {/* Tax Credit */}
              <div style={{
                flex: 1, position: "relative", overflow: "hidden", borderRadius: "12px",
                padding: "10px 8px", textAlign: "center",
                border: "1px solid rgba(212,175,55,0.30)",
                background: "radial-gradient(circle at 50% 24px, rgba(60,179,113,0.10) 0%, transparent 55%), rgba(6,6,6,0.92)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 12px rgba(212,175,55,0.08)",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(60,179,113,0.40), transparent)", zIndex: 1 }} />
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: "rgba(255,255,255,0.70)", marginBottom: "4px" }}>Tax Credit (20%)</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", color: "#3CB371", textShadow: "0 0 16px rgba(60,179,113,0.25)" }}>+${TAX_CREDIT.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Connector gold → gold */}
          <WaterfallConnector color="gold" />

          {/* ── Acquisition Offer ── */}
          <div style={{ margin: "0 24px 0", ...reveal(waterfallCalloutVisible) }}>
            <WaterfallGroupLabel text="Streamer Acquisition Offer" color="neutral" />
            <div ref={waterfallCalloutRef} style={{
              position: "relative", overflow: "hidden", textAlign: "center",
              background: "radial-gradient(circle at 50% 70%, rgba(212,175,55,0.20) 0%, rgba(6,6,6,0.92) 75%)",
              border: "1px solid rgba(212,175,55,0.25)", borderRadius: "12px", padding: "18px 16px",
              boxShadow: "0 0 24px rgba(212,175,55,0.10), 0 0 20px rgba(120,60,180,0.15)",
            }}>
              <div style={styles.topLineGoldHalf} />
              <p style={styles.acqAmount}>${TOTAL_ACQUISITION.toLocaleString()}</p>
            </div>
          </div>

          {/* Connector gold → red */}
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
                  <div style={{ margin: "0 24px" }}>
                    <WaterfallGroupLabel text={group.label} color="neutral" />
                    {isPair ? (
                      <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
                        <div
                          key={groupCards[0].tier}
                          ref={(el) => { cardObserverRefs.current[groupCards[0].ci] = el; }}
                          style={{
                            flex: 1,
                            ...wfCardStyle('pair'),
                            ...cardReveal(enteredCards.has(groupCards[0].ci), 0),
                          }}
                        >
                          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(220,38,38,0.35), transparent)", zIndex: 1 }} />
                          <div style={wfBadgeGlow()} />
                          <div style={wfBadge()}>{groupCards[0].tier}</div>
                          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", color: "#fff", textTransform: "uppercase", marginBottom: "3px", textAlign: "center" }}>{groupCards[0].name}</div>
                          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", color: "rgba(220,38,38,0.88)", textAlign: "center", textShadow: "0 0 16px rgba(220,38,38,0.20)" }}>–${groupCards[0].amount.toLocaleString()}</div>
                        </div>
                        <div
                          key={groupCards[1].tier}
                          ref={(el) => { cardObserverRefs.current[groupCards[1].ci] = el; }}
                          style={{
                            flex: 1,
                            ...wfCardStyle('pair'),
                            ...cardReveal(enteredCards.has(groupCards[1].ci), 100),
                          }}
                        >
                          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(220,38,38,0.35), transparent)", zIndex: 1 }} />
                          <div style={wfBadgeGlow()} />
                          <div style={wfBadge()}>{groupCards[1].tier}</div>
                          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", color: "#fff", textTransform: "uppercase", marginBottom: "3px", textAlign: "center" }}>{groupCards[1].name}</div>
                          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", color: "rgba(220,38,38,0.88)", textAlign: "center", textShadow: "0 0 16px rgba(220,38,38,0.20)" }}>–${groupCards[1].amount.toLocaleString()}</div>
                        </div>
                      </div>
                    ) : (
                      groupCards.map((tier) => (
                        <div
                          key={tier.tier}
                          ref={(el) => { cardObserverRefs.current[tier.ci] = el; }}
                          style={{
                            ...wfCardStyle(tier.mode),
                            ...cardReveal(enteredCards.has(tier.ci)),
                            marginBottom: groupCards.indexOf(tier) < groupCards.length - 1 ? "10px" : "0",
                          }}
                        >
                          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(220,38,38,0.35), transparent)", zIndex: 1 }} />
                          <div style={wfBadgeGlow()} />
                          <div style={wfBadge()}>{tier.tier}</div>
                          <div style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: "1.3rem",
                            color: "#fff", textTransform: "uppercase", marginBottom: "3px",
                            textAlign: "center",
                          }}>{tier.name}</div>
                          <div style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: "1.6rem",
                            color: "rgba(220,38,38,0.88)",
                            textAlign: "center",
                            textShadow: "0 0 16px rgba(220,38,38,0.20)",
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

          {/* Connector red → red (stronger) */}
          <WaterfallConnector color="red-strong" />

          {/* ── Total Off The Top ── */}
          <div style={{ margin: "0 24px" }}>
            <WaterfallGroupLabel text="Total Off The Top" color="neutral" />
            <div style={{
              position: "relative", overflow: "hidden", borderRadius: "12px", padding: "20px 16px", textAlign: "center",
              border: "1px solid rgba(220,38,38,0.25)",
              background: "radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.15) 0%, rgba(6,6,6,0.92) 70%)",
              boxShadow: "0 12px 32px rgba(0,0,0,0.5), 0 0 20px rgba(220,38,38,0.08)",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(220,38,38,0.30), transparent)" }} />
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.4rem", color: "rgba(220,38,38,0.85)" }}>–${TOTAL_DEDUCTED.toLocaleString()}</div>
              {/* Summary bar */}
              <div style={{ marginTop: "12px", height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden", display: "flex" }}>
                <div style={{ height: "100%", width: `${((TOTAL_ACQUISITION - TOTAL_DEDUCTED) / TOTAL_ACQUISITION) * 100}%`, background: "rgba(60,179,113,0.50)", borderRadius: "4px 0 0 4px" }} />
                <div style={{ height: "100%", flex: 1, background: "rgba(220,38,38,0.50)", borderRadius: "0 4px 4px 0" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: "rgba(60,179,113,0.50)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Remaining</span>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", color: "rgba(220,38,38,0.50)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Deducted</span>
              </div>
            </div>
          </div>

          {/* Connector red → green transition */}
          <WaterfallConnector color="red-to-green" />

          {/* ── Net Backend Profit ── */}
          <div style={{ margin: "0 24px" }}>
            <WaterfallGroupLabel text="Net Backend Profit" color="neutral" />
            <div
              ref={profitCardRef}
              style={{
                position: "relative", overflow: "hidden", borderRadius: "12px", padding: "20px 16px", textAlign: "center",
                border: "1px solid rgba(60,179,113,0.50)",
                background: `radial-gradient(ellipse at 50% 0%, rgba(60,179,113,${profitGlowIntensity}) 0%, rgba(6,6,6,0.92) 70%)`,
                boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 30px rgba(60,179,113,0.15)",
                transition: "background 500ms ease",
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #3CB371, transparent)", boxShadow: "0 0 12px rgba(60,179,113,0.30)" }} />
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", color: "#3CB371", lineHeight: 1, textShadow: "0 0 24px rgba(60,179,113,0.35)" }}>
                ${profitCountUp.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Connector green → green */}
          <WaterfallConnector color="green" />

          {/* ── Profit Split ── */}
          <div style={{ margin: "0 24px" }}>
            <WaterfallGroupLabel text="Profit Split" color="neutral" />
            <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
              <div style={{
                flex: 1, textAlign: "center", borderRadius: "12px", padding: "16px 12px",
                border: "1px solid rgba(60,179,113,0.50)",
                background: "radial-gradient(ellipse at 50% 0%, rgba(60,179,113,0.15) 0%, rgba(6,6,6,0.92) 70%)",
                position: "relative", overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4), 0 0 16px rgba(60,179,113,0.10)",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #3CB371, transparent)" }} />
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", color: "rgba(255,255,255,0.88)", marginBottom: "6px" }}>Investor</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#3CB371", textShadow: "0 0 16px rgba(60,179,113,0.25)" }}>${SPLIT.toLocaleString()}</div>
              </div>
              <div style={{
                flex: 1, textAlign: "center", borderRadius: "12px", padding: "16px 12px",
                border: "1px solid rgba(60,179,113,0.50)",
                background: "radial-gradient(ellipse at 50% 0%, rgba(60,179,113,0.15) 0%, rgba(6,6,6,0.92) 70%)",
                position: "relative", overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4), 0 0 16px rgba(60,179,113,0.10)",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #3CB371, transparent)" }} />
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", color: "rgba(255,255,255,0.88)", marginBottom: "6px" }}>Producer</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#3CB371", textShadow: "0 0 16px rgba(60,179,113,0.25)" }}>${SPLIT.toLocaleString()}</div>
              </div>
            </div>
          </div>

        </section>

        <div style={{ height: "3px", background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.50) 20%, rgba(212,175,55,0.40) 50%, rgba(120,60,180,0.50) 80%, transparent 100%)", boxShadow: "0 0 8px rgba(120,60,180,0.35), 0 0 20px rgba(120,60,180,0.20)", margin: "0 24px" }} />

        {/* ═══ § 4 WHY THIS MATTERS ═══ */}
        <section ref={whyRef} style={styles.whySection}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "220px", background: "radial-gradient(ellipse 120% 80% at 50% 0%, rgba(120,60,180,0.22) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
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

        <div style={{ height: "3px", background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.50) 20%, rgba(212,175,55,0.40) 50%, rgba(120,60,180,0.50) 80%, transparent 100%)", boxShadow: "0 0 8px rgba(120,60,180,0.35), 0 0 20px rgba(120,60,180,0.20)", margin: "0 24px" }} />

        {/* ═══ § 5 ARSENAL ═══ */}
        <section style={styles.arsenalSection}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "240px", background: "radial-gradient(ellipse 100% 70% at 50% 0%, rgba(120,60,180,0.25) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
          <div ref={arsenalHeaderRef} style={{ ...styles.arsenalHeader, ...reveal(arsenalHeaderVisible) }}>
            <EyebrowRuled text="What you get" />
            <h2 style={styles.arsenalH2}>The <span style={{ color: "#D4AF37" }}>Snapshot</span></h2>
            <p style={styles.arsenalSub}>
              <span style={{ display: "block" }}>Your complete deal structure.</span>
              <span style={{ display: "block" }}>Modeled for free.</span>
            </p>
          </div>

          <div style={styles.arsenalCards}>
            {/* ── Card 1: The Snapshot (Free) — GOLD ── */}
            <div ref={arsenalCoreRef} style={{ ...styles.tierCardFree, ...reveal(arsenalCoreVisible) }}>
              {/* Gradient border */}
              <div style={{ position: "absolute", inset: 0, borderRadius: "12px", padding: "1px", pointerEvents: "none", background: "linear-gradient(180deg, rgba(212,175,55,0.55) 0%, rgba(212,175,55,0.20) 50%, rgba(212,175,55,0.40) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
              {/* Top line */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.50), transparent)", boxShadow: "0 0 12px rgba(212,175,55,0.25)", zIndex: 1 }} />
              {/* Value statement */}
              <div style={styles.valueStatementFree}>
                <p style={styles.valueTextFree}>Your Numbers. No Credit Card.</p>
              </div>
              {/* Features — 3 groups */}
              <div style={{ ...styles.tierFeatures, textAlign: "center" }}>
                {/* Group: Model */}
                <div style={{ display: "inline-block", textAlign: "left", marginBottom: "8px" }}>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "#D4AF37", letterSpacing: "0.06em", marginBottom: "12px" }}>Model</p>
                  {["11-Tier Recoupment Waterfall", "Capital Stack Breakdown", "Investor / Producer Profit Split"].map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: i < 2 ? "12px" : "0" }}>
                      <span style={{ fontSize: "20px", color: "#3CB371", flexShrink: 0, marginTop: "1px", textShadow: "0 0 10px rgba(60,179,113,0.60), 0 0 20px rgba(60,179,113,0.25)" }}>✓</span>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", fontWeight: 500, color: "rgba(255,255,255,0.90)", lineHeight: 1.3 }}>{f}</p>
                    </div>
                  ))}
                </div>
                {/* Separator */}
                <div style={{ height: "1px", background: "rgba(212,175,55,0.20)", margin: "0 32px 0" }} />
                {/* Group: Analyze */}
                <div style={{ display: "inline-block", textAlign: "left", marginBottom: "8px" }}>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "#D4AF37", letterSpacing: "0.06em", marginBottom: "12px" }}>Analyze</p>
                  {["Break-Even Scenario Analysis", "Sensitivity on Key Variables", "Off-the-Top Fee Mapping"].map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: i < 2 ? "12px" : "0" }}>
                      <span style={{ fontSize: "20px", color: "#3CB371", flexShrink: 0, marginTop: "1px", textShadow: "0 0 10px rgba(60,179,113,0.60), 0 0 20px rgba(60,179,113,0.25)" }}>✓</span>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", fontWeight: 500, color: "rgba(255,255,255,0.90)", lineHeight: 1.3 }}>{f}</p>
                    </div>
                  ))}
                </div>
                {/* Separator */}
                <div style={{ height: "1px", background: "rgba(212,175,55,0.20)", margin: "0 32px 0" }} />
                {/* Group: Share */}
                <div style={{ display: "inline-block", textAlign: "left" }}>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "#D4AF37", letterSpacing: "0.06em", marginBottom: "12px" }}>Share</p>
                  {["Formatted PDF Export", "Shareable Web Link", "White-Labeled to Your Project"].map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: i < 2 ? "12px" : "0" }}>
                      <span style={{ fontSize: "20px", color: "#3CB371", flexShrink: 0, marginTop: "1px", textShadow: "0 0 10px rgba(60,179,113,0.60), 0 0 20px rgba(60,179,113,0.25)" }}>✓</span>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", fontWeight: 500, color: "rgba(255,255,255,0.90)", lineHeight: 1.3 }}>{f}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={styles.tierAction}>
                <button onClick={handleCTA} style={styles.btnFree} aria-label="Run my waterfall" onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }} onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>RUN MY WATERFALL</button>
              </div>
            </div>
          </div>
        </section>

        <div style={{ height: "3px", background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.50) 20%, rgba(212,175,55,0.40) 50%, rgba(120,60,180,0.50) 80%, transparent 100%)", boxShadow: "0 0 8px rgba(120,60,180,0.35), 0 0 20px rgba(120,60,180,0.20)", margin: "0 24px" }} />

        {/* ═══ § 6 REALITY ═══ */}
        <section style={styles.realitySection}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "180px", background: "radial-gradient(ellipse 100% 70% at 50% 0%, rgba(120,60,180,0.20) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "240px", background: "radial-gradient(ellipse 80% 100% at 30% 100%, rgba(120,60,180,0.18) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
          <div
            ref={realityQuoteRef}
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "12px",
              border: "1px solid rgba(212,175,55,0.25)",
              padding: "28px 24px",
              textAlign: "center",
              background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.15) 0%, rgba(6,6,6,0.92) 65%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 12px 32px rgba(0,0,0,0.6), 0 0 24px rgba(212,175,55,0.08), 0 0 20px rgba(120,60,180,0.10)",
              marginBottom: "24px",
              ...reveal(realityQuoteVisible),
            }}
          >
            {/* Topline */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.40), transparent)" }} />
            {/* Purple atmospheric from bottom */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "100%", background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(120,60,180,0.18) 0%, transparent 60%)", pointerEvents: "none" }} />
            <p style={{
              position: "relative",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "2.2rem",
              color: "#fff",
              lineHeight: 1,
              letterSpacing: "0.02em",
            }}>
              The waterfall either costs you now — or costs you everything{" "}
              <span style={{ color: "#D4AF37", textShadow: "0 0 20px rgba(212,175,55,0.30)" }}>later.</span>
            </p>
          </div>

          <div ref={realityGridRef} style={{ ...styles.checkGrid, ...reveal(realityGridVisible) }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: "50%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(60,179,113,0.60), transparent)", zIndex: 1 }} />
            <div style={{ position: "absolute", top: 0, left: "50%", right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(220,38,38,0.50), transparent)", zIndex: 1 }} />
            {/* Header */}
            <div style={styles.checkHeader}>
              <div style={styles.checkHeaderWith}><span style={styles.checkHeaderWithText}>WITH</span></div>
              <div style={styles.checkHeaderWithout}><span style={styles.checkHeaderWithoutText}>WITHOUT</span></div>
            </div>
            {/* Rows */}
            {withItems.map((withItem, i) => (
              <div key={i} style={{ ...styles.checkRow, borderBottom: i < withItems.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
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

        <div style={{ height: "3px", background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.50) 20%, rgba(212,175,55,0.40) 50%, rgba(120,60,180,0.50) 80%, transparent 100%)", boxShadow: "0 0 8px rgba(120,60,180,0.35), 0 0 20px rgba(120,60,180,0.20)", margin: "0 24px" }} />

        {/* ═══ § 7 CLOSER ═══ */}
        <section ref={closerRef} style={{ ...styles.closerSection, ...reveal(closerVisible) }}>
          <div style={styles.closerGlowOverlay} />
          <h2 style={styles.closerH2}>Your Investors<br /><span style={{ color: "#D4AF37", display: "block", textShadow: "0 0 40px rgba(212,175,55,0.60), 0 0 80px rgba(212,175,55,0.25)" }}>Will Ask.</span></h2>
          <p style={styles.closerBody}>Stop guessing your backend. Walk into every pitch knowing exactly where the money goes.</p>
          <button onClick={handleCTA} style={styles.ctaBtn} aria-label="Run my waterfall" onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }} onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
            <span style={{ position: "relative", zIndex: 1 }}>RUN MY WATERFALL</span>
            <div style={styles.ctaShimmer} />
          </button>
          <p style={styles.ctaReassurance}>No Credit Card · Instant Results</p>
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
            <span onClick={() => gatedNavigate("/calculator")} style={styles.footerNavLink} onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.50)"; }}>Calculator</span>
            <span style={{ color: "rgba(212,175,55,0.25)", fontSize: "14px" }}>·</span>
            <span onClick={() => gatedNavigate("/store")} style={styles.footerNavLink} onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.50)"; }}>Shop</span>
            <span style={{ color: "rgba(212,175,55,0.25)", fontSize: "14px" }}>·</span>
            <span onClick={() => navigate("/resources")} style={styles.footerNavLink} onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.60)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,175,55,0.50)"; }}>Resources</span>
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
   STYLES — v14.2 — card-based waterfall
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
    fontFamily: "'Roboto Mono', monospace", fontSize: "16px",
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
  ctaReassurance: {
    fontFamily: "'Roboto Mono', monospace", fontSize: "13px",
    color: "rgba(212,175,55,0.65)", letterSpacing: "0.12em",
    textTransform: "uppercase", textAlign: "center", marginTop: "14px",
  },

  /* ── § 1 HERO ── */
  hero: {
    position: "relative", textAlign: "center",
    padding: "24px 24px 16px",
    margin: "0 24px",
    borderRadius: "12px",
    overflow: "hidden",
    background: "rgba(6,6,6,0.92)",
    backdropFilter: "blur(40px)",
    WebkitBackdropFilter: "blur(40px)",
    border: "1px solid rgba(212,175,55,0.12)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 24px rgba(212,175,55,0.10), 0 0 20px rgba(120,60,180,0.15)",
  },
  heroGlow: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse 80% 50% at 50% 10%, rgba(212,175,55,0.22) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 50% 50%, rgba(120,60,180,0.22) 0%, transparent 60%), radial-gradient(ellipse 100% 70% at 50% 100%, rgba(120,60,180,0.20) 0%, transparent 60%)",
  },
  heroInner: { position: "relative", zIndex: 1 },
  heroH1: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "4.2rem", color: "#fff",
    textAlign: "center", marginBottom: "4px", lineHeight: 0.86, letterSpacing: "0.01em",
    textShadow: "0 2px 20px rgba(0,0,0,0.95), 0 4px 40px rgba(0,0,0,0.5)",
  },
  heroEm: { fontStyle: "normal", color: "#D4AF37", display: "block", textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.50), 0 0 80px rgba(212,175,55,0.25)" },
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
    display: "grid", gridTemplateColumns: "56px 1fr", background: "rgba(6,6,6,0.92)",
  },
  stepNumCol: {
    position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "center",
    background: "radial-gradient(circle at 50% 28px, rgba(120,60,180,0.28) 0%, rgba(6,6,6,0.92) 80%)",
    paddingTop: "22px",
  },
  stepLine: {
    position: "absolute", top: "57px", bottom: "-23px", left: "50%", transform: "translateX(-50%)", width: "1px",
    background: "linear-gradient(180deg, rgba(120,60,180,0.60) 0%, rgba(120,60,180,0.10) 100%)", zIndex: 0,
  },
  stepNumBadge: {
    position: "relative", zIndex: 1, width: "48px", height: "48px", borderRadius: "50%",
    background: "linear-gradient(135deg, rgb(75,30,130) 0%, rgb(110,50,170) 100%)", display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 20px rgba(120,60,180,0.50), 0 0 40px rgba(120,60,180,0.25)",
  },
  stepContent: { padding: "26px 24px 26px 24px" },
  stepTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#fff", lineHeight: 1, marginBottom: "5px" },
  stepBody: { fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "rgba(255,255,255,0.88)", lineHeight: 1.55 },

  /* ── § 3 WATERFALL ── */
  waterfallSection: { position: "relative", background: "#000", padding: "32px 0 0" },
  waterfallHeader: { textAlign: "center", padding: "0 24px 24px" },
  waterfallH2: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.2rem", color: "#fff", lineHeight: 0.95 },
  waterfallExplainer: {
    fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "rgba(255,255,255,0.88)",
    lineHeight: 1.55, textAlign: "center", padding: "0 24px", marginBottom: "24px",
    maxWidth: "380px", marginLeft: "auto", marginRight: "auto",
  },
  acqAmount: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.2rem", color: "#D4AF37", lineHeight: 1, letterSpacing: "0.02em", textShadow: "0 0 30px rgba(212,175,55,0.40), 0 0 60px rgba(212,175,55,0.15)" },


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
    display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem",
    marginBottom: "16px", paddingTop: "2px", boxShadow: "0 0 24px rgba(120,60,180,0.55), 0 0 48px rgba(120,60,180,0.25)",
  },
  badgeTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#fff", marginBottom: "8px", lineHeight: 1.05, letterSpacing: "0.02em" },
  badgeBody: { fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "rgba(255,255,255,0.88)", lineHeight: 1.55 },

  /* ── § 5 ARSENAL ── */
  arsenalSection: { position: "relative", background: "#000", textAlign: "center", padding: "48px 0 0" },
  arsenalHeader: { padding: "0 24px 24px" },
  arsenalH2: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.2rem", color: "#fff", lineHeight: 0.95 },
  arsenalSub: { fontFamily: "'Inter', sans-serif", fontSize: "18px", marginTop: "10px", color: "rgba(255,255,255,0.88)", lineHeight: 1.5 },
  sectionSub: { fontFamily: "'Inter', sans-serif", fontSize: "18px", marginTop: "10px", color: "rgba(255,255,255,0.88)", lineHeight: 1.5 },
  arsenalCards: { display: "flex", flexDirection: "column", gap: "28px", margin: "0 24px" },

  /* Card containers */
  tierCardFree: {
    position: "relative", borderRadius: "12px", overflow: "hidden", textAlign: "center",
    border: "none",
    background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.16) 0%, rgba(6,6,6,0.92) 70%)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.5), 0 0 40px rgba(212,175,55,0.16), 0 0 20px rgba(120,60,180,0.18)",
  },

  /* Headers */
  /* Value statements */
  valueStatementFree: {
    padding: "24px 24px", textAlign: "center",
    background: "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(212,175,55,0.14) 0%, rgba(6,6,6,0.92) 80%)",
    borderBottom: "1px solid rgba(212,175,55,0.15)",
  },
  valueTextFree: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#D4AF37", lineHeight: 1,
    letterSpacing: "0.02em", textShadow: "0 0 20px rgba(212,175,55,0.25)",
  },

  /* Features list */
  tierFeatures: { padding: "24px", display: "flex", flexDirection: "column", gap: "12px" },

  /* Actions */
  tierAction: { padding: "0 24px 36px" },
  btnFree: {
    display: "block", width: "100%", textAlign: "center",
    fontFamily: "'Roboto Mono', monospace", fontSize: "18px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em",
    color: "#fff",
    background: "linear-gradient(135deg, rgb(75,30,130), rgb(110,50,170))",
    border: "none", padding: "20px", borderRadius: "8px", cursor: "pointer",
    boxShadow: "0 0 0 1px rgba(212,175,55,0.25), 0 0 24px rgba(120,60,180,0.40), 0 0 60px rgba(120,60,180,0.20)",
  },

  /* ── Top line helpers ── */
  topLineGold: {
    position: "absolute", top: 0, left: 0, right: 0, height: "2px",
    background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.40) 20%, rgba(212,175,55,0.50) 50%, rgba(120,60,180,0.40) 80%, transparent 100%)",
  },
  topLineGoldHalf: {
    position: "absolute", top: 0, left: 0, right: 0, height: "2px",
    background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.30) 20%, rgba(212,175,55,0.35) 50%, rgba(120,60,180,0.30) 80%, transparent 100%)",
  },

  /* ── § 6 REALITY ── */
  realitySection: { position: "relative", background: "#000", textAlign: "left", padding: "48px 24px 24px" },
  checkGrid: {
    position: "relative", border: "1px solid rgba(120,60,180,0.30)", borderRadius: "12px", overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(120,60,180,0.15)",
  },
  checkHeader: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(255,255,255,0.08)",
    borderBottom: "1px solid rgba(212,175,55,0.15)",
  },
  checkHeaderWith: { background: "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(60,179,113,0.20) 0%, rgba(6,6,6,0.92) 70%)", padding: "14px 16px", borderBottom: "1px solid rgba(60,179,113,0.20)" },
  checkHeaderWithout: { background: "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(220,38,38,0.10) 0%, rgba(6,6,6,0.92) 70%)", padding: "14px 16px", borderLeft: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(220,38,38,0.12)" },
  checkHeaderWithText: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: "#3CB371", letterSpacing: "0.04em" },
  checkHeaderWithoutText: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: "rgba(220,38,38,0.70)", letterSpacing: "0.04em" },
  checkRow: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(255,255,255,0.08)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  checkCellLeft: {
    background: "radial-gradient(circle at 16px 50%, rgba(60,179,113,0.12) 0%, transparent 50%)", display: "grid", gridTemplateColumns: "22px 1fr", gap: "10px",
    padding: "14px 16px", alignItems: "flex-start",
  },
  checkCellRight: {
    background: "radial-gradient(circle at 16px 50%, rgba(220,38,38,0.08) 0%, transparent 50%)", display: "grid", gridTemplateColumns: "22px 1fr", gap: "10px",
    padding: "14px 16px", alignItems: "flex-start", borderLeft: "1px solid rgba(255,255,255,0.08)",
  },
  checkIconYes: { fontFamily: "'Roboto Mono', monospace", fontSize: "24px", paddingTop: "2px", color: "#3CB371", textShadow: "0 0 8px rgba(60,179,113,0.60), 0 0 20px rgba(60,179,113,0.30)" },
  checkIconNo: { fontFamily: "'Roboto Mono', monospace", fontSize: "24px", paddingTop: "2px", color: "rgba(220,38,38,0.85)", textShadow: "0 0 8px rgba(220,38,38,0.60), 0 0 20px rgba(220,38,38,0.30)" },
  checkTextYes: { fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: 1.4, color: "rgba(255,255,255,0.88)" },
  checkTextNo: { fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: 1.4, color: "rgba(255,255,255,0.70)" },

  /* ── § 7 CLOSER ── */
  closerSection: {
    position: "relative", overflow: "hidden", textAlign: "center",
    padding: "32px 24px 40px",
    margin: "0 24px 28px",
    borderRadius: "12px",
    background: "rgba(6,6,6,0.92)",
    backdropFilter: "blur(40px)",
    WebkitBackdropFilter: "blur(40px)",
    border: "1px solid rgba(212,175,55,0.55)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.8), 0 0 60px rgba(120,60,180,0.15)",
  },
  closerGlowOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,175,55,0.18) 0%, transparent 60%), radial-gradient(ellipse 90% 60% at 50% 100%, rgba(120,60,180,0.22) 0%, transparent 65%)",
  },
  closerH2: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.4rem", color: "#fff", textAlign: "center",
    lineHeight: 0.95, margin: "4px 0 14px", textShadow: "0 2px 16px rgba(0,0,0,0.9)",
  },
  closerBody: {
    fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "rgba(255,255,255,0.88)",
    lineHeight: 1.55, margin: "0 auto 24px", textShadow: "0 2px 8px rgba(0,0,0,0.8)",
  },

  /* ── FOOTER ── */
  footer: { background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.12)", padding: "32px 24px 40px" },
  footerLinks: { display: "flex", justifyContent: "center", gap: "20px", marginBottom: "16px" },
  footerIcon: { color: "rgba(212,175,55,0.50)", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", padding: "4px", borderRadius: "8px", border: "1px solid rgba(212,175,55,0.15)", transition: "color 0.2s ease, border-color 0.2s ease", boxSizing: "content-box" },
  footerNav: { display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "16px" },
  footerNavLink: { fontFamily: "'Roboto Mono', monospace", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(212,175,55,0.50)", cursor: "pointer", transition: "color 0.2s ease" } as React.CSSProperties,
  footerDot: { color: "rgba(212,175,55,0.20)", fontSize: "11px" },
  footerText: { fontFamily: "'Inter', sans-serif", fontSize: "14px", textAlign: "center", color: "rgba(255,255,255,0.48)", lineHeight: 1.55 },
};

export default Index;
