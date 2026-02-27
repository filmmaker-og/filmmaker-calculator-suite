import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { cn } from "@/lib/utils";
/* ═══════════════════════════════════════════════════════════════════
   WATERFALL TIERS — proportional bars ($3M cascade)
   ═══════════════════════════════════════════════════════════════════ */
const waterfallTiers = [
  { name: "Acquisition Price", amount: "$3,000,000",    pct: 100.0, barColor: "rgba(212,175,55,0.90)",  isFinal: false },
  { name: "CAM Fees",          amount: "\u2212$22,500",      pct: 99.3,  barColor: "rgba(212,175,55,0.75)",  isFinal: false },
  { name: "Sales Agent",       amount: "\u2212$450,000",     pct: 84.3,  barColor: "rgba(212,175,55,0.65)",  isFinal: false },
  { name: "Senior Debt",       amount: "\u2212$440,000",     pct: 69.6,  barColor: "rgba(212,175,55,0.55)",  isFinal: false },
  { name: "Mezzanine",         amount: "\u2212$230,000",     pct: 61.9,  barColor: "rgba(212,175,55,0.45)",  isFinal: false },
  { name: "Equity Recoupment", amount: "\u2212$1,440,000",   pct: 13.9,  barColor: "rgba(212,175,55,0.35)",  isFinal: false },
  { name: "Net Profits",       amount: "$417,500",       pct: 13.9,  barColor: "rgba(212,175,55,0.95)",  isFinal: true  },
];
/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const Index = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();
  // Lead capture gate — magic link auth
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
  // Waterfall bar animation — triggers when waterfall scrolls into view
  // IntersectionObserver fires once, then 600ms delay lets user read headline
  const [barsRevealed, setBarsRevealed] = useState(false);
  const waterBarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = waterBarRef.current;
    if (!el) return;
    let delay: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          delay = setTimeout(() => setBarsRevealed(true), 600);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(delay); };
  }, []);
  // Net Profits countup
  const [countVal, setCountVal] = useState(0);
  useEffect(() => {
    if (!barsRevealed) return;
    const delay = setTimeout(() => {
      const target = 417500;
      const dur = 1800;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out
        setCountVal(Math.round(eased * target));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 3400);
    return () => clearTimeout(delay);
  }, [barsRevealed]);
  // Corridor split countup (starts after main counter finishes)
  const [producerVal, setProducerVal] = useState(0);
  const [investorVal, setInvestorVal] = useState(0);
  useEffect(() => {
    if (!barsRevealed) return;
    const delay = setTimeout(() => {
      const target = 208750;
      const dur = 1200;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = Math.round(eased * target);
        setProducerVal(val);
        setInvestorVal(val);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 6000);
    return () => clearTimeout(delay);
  }, [barsRevealed]);
  const handleStartClick    = () => { haptics.medium(); gatedNavigate("/calculator?tab=budget"); };
  // "UNTIL NOW." fade-in on scroll — dramatic reveal for the pivot line
  const untilNowRef = useRef<HTMLDivElement>(null);
  const [untilNowVisible, setUntilNowVisible] = useState(false);
  useEffect(() => {
    const el = untilNowRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setUntilNowVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  // Scroll-triggered reveals — earned entrances for mid-page sections
  const costRef = useRef<HTMLDivElement>(null);
  const [costVisible, setCostVisible] = useState(false);
  const evidenceRef = useRef<HTMLDivElement>(null);
  const [evidenceVisible, setEvidenceVisible] = useState(false);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const [comparisonVisible, setComparisonVisible] = useState(false);
  const nobodyRef = useRef<HTMLDivElement>(null);
  const [nobodyVisible, setNobodyVisible] = useState(false);
  useEffect(() => {
    const reveals = [
      { el: costRef.current, setter: setCostVisible },
      { el: evidenceRef.current, setter: setEvidenceVisible },
      { el: comparisonRef.current, setter: setComparisonVisible },
      { el: nobodyRef.current, setter: setNobodyVisible },
    ];
    const observers: IntersectionObserver[] = [];
    reveals.forEach(({ el, setter }) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setter(true);
            obs.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);
  return (
    <>
      {/* Lead capture modal — magic link auth */}
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
        {/* ═══════ LANDING PAGE ═══════ */}
        <main aria-label="Film Finance Simulator" className="flex-1 flex flex-col" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          {/* ──────────────────────────────────────────────────────────
               § 1  HERO + WATERFALL DEMO
               The visualization IS the pitch. No preamble.
             ────────────────────────────────────────────────────────── */}
          <section id="hero" className="relative pt-14 pb-6">
            {/* Ambient warmth */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 60% 50% at 50% 25%, rgba(212,175,55,0.06) 0%, transparent 100%)",
              }}
            />
            <div className="relative px-4 max-w-md mx-auto">
              {/* Hero card — visual containment for headline + visualization */}
              <div
                className="rounded-2xl px-2 pt-6 pb-5"
                style={{
                  border: '1px solid rgba(212,175,55,0.10)',
                  background: 'rgba(255,255,255,0.02)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 0 40px rgba(212,175,55,0.03)',
                }}
              >
              {/* Headline */}
              <div className="text-center mb-6 px-4">
                <h1 className="font-bebas text-[clamp(3.2rem,11vw,4.8rem)] leading-[0.95] tracking-[0.02em] text-gold mb-6">
                  SEE WHERE EVERY DOLLAR <span className="text-white">GOES</span>
                </h1>
                <p className="text-ink-secondary text-[18px] leading-[1.7] tracking-[0.02em] font-medium max-w-[340px] mx-auto">
                  Democratizing the business of film.
                </p>
              </div>
              {/* ── Waterfall Visualization ── */}
              <div ref={waterBarRef}>
                {/* Waterfall rows — unified financial table */}
                <div className="border border-gold-border bg-black overflow-hidden rounded-xl"
                  style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                  {waterfallTiers.filter(t => !t.isFinal).map((tier, i) => (
                    <div
                      key={tier.name}
                      className={cn(
                        "px-6 py-4 relative",
                        i > 0 && "border-t border-bg-card-rule",
                      )}
                    >
                      <div className="flex justify-between items-baseline mb-2">
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-[12px] text-ink-secondary tabular-nums">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className={cn(
                            "uppercase",
                            i === 0
                              ? "font-bebas tracking-[0.08em] text-[26px] text-white"
                              : "font-sans text-[16px] tracking-[0.04em] font-medium text-ink-body"
                          )}>
                            {tier.name}
                          </span>
                        </div>
                        <span className="font-mono text-[16px] font-semibold text-ink-body">
                          {tier.amount}
                        </span>
                      </div>
                      <div className={cn("w-full relative overflow-hidden", i === 0 ? "h-4" : "h-3")} style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div
                          className="absolute left-0 top-0 h-full"
                          style={{
                            width: barsRevealed ? `${tier.pct}%` : '0%',
                            background: tier.barColor,
                            boxShadow: i === 0 ? '0 0 12px rgba(212,175,55,0.25)' : 'none',
                            transition: `width 1200ms cubic-bezier(0.16,1,0.3,1)`,
                            transitionDelay: `${i * 300}ms`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Net Profits */}
                <div className="mt-4 border border-gold-border bg-black px-6 py-6 text-center rounded-lg"
                  style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                  <p className="text-[12px] tracking-[0.2em] uppercase font-semibold text-gold mb-1">Net Profits</p>
                  <span className="font-mono text-[26px] font-bold text-white">
                    ${countVal.toLocaleString()}
                  </span>
                </div>
                {/* Two corridor boxes */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="border border-gold-border bg-black px-4 py-6 text-center rounded-lg"
                    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                    <p className="text-[12px] tracking-[0.2em] uppercase font-semibold text-gold mb-1">Producer Corridor</p>
                    <span className="font-mono text-[26px] font-bold text-white">
                      ${producerVal.toLocaleString()}
                    </span>
                  </div>
                  <div className="border border-gold-border bg-black px-4 py-6 text-center rounded-lg"
                    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                    <p className="text-[12px] tracking-[0.2em] uppercase font-semibold text-gold mb-1">Investor Corridor</p>
                    <span className="font-mono text-[26px] font-bold text-white">
                      ${investorVal.toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="font-mono text-[12px] text-ink-secondary text-center mt-4">
                  Hypothetical $1.8M budget{"\u00A0"}{"\u2022"}{"\u00A0"}$3M acquisition{"\u00A0"}{"\u2022"}{"\u00A0"}50/50 net profit split
                </p>
              </div>
              </div>{/* /hero card */}
              {/* CTA — earns the click after the visualization */}
              <div className="mt-10 text-center px-2">
                <div className="w-full max-w-[280px] mx-auto">
                  <button onClick={handleStartClick}
                    className="w-full h-14 btn-cta-primary animate-cta-glow-pulse">
                    BUILD YOUR WATERFALL
                  </button>
                </div>
              </div>
            </div>
          </section>
          {/* ──────────────────────────────────────────────────────────
               § 2  THE COST OF ACCESS
               What it costs to learn this elsewhere. Premium ledger.
             ────────────────────────────────────────────────────────── */}
          <section id="cost" className="relative py-14 md:py-20 px-6">
            {/* Ambient warmth */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(212,175,55,0.04) 0%, transparent 100%)",
              }}
            />
            <div
              ref={costRef}
              className="relative max-w-md mx-auto"
              style={{
                opacity: costVisible ? 1 : 0,
                transform: costVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 700ms ease-out, transform 700ms ease-out',
              }}
            >
              <div className="text-center mb-8">
                <h2 className="font-bebas text-[40px] tracking-[0.08em] text-white">
                  THE COST OF ACCESS
                </h2>
              </div>

              <div className="border border-gold-border bg-black overflow-hidden rounded-xl"
                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>

                <div className="px-6 py-5 flex gap-4">
                  <span className="font-mono text-[18px] font-bold text-gold w-[88px] shrink-0 tabular-nums">$800/hr</span>
                  <div className="min-w-0">
                    <p className="font-bebas text-[18px] tracking-[0.06em] text-white leading-tight">Entertainment Attorney</p>
                    <p className="text-[13px] text-ink-secondary mt-1">Retainer required</p>
                  </div>
                </div>

                <div className="px-6 py-5 flex gap-4 border-t border-bg-card-rule">
                  <span className="font-mono text-[18px] font-bold text-gold w-[88px] shrink-0 tabular-nums">$5,000+</span>
                  <div className="min-w-0">
                    <p className="font-bebas text-[18px] tracking-[0.06em] text-white leading-tight">Producing Consultant</p>
                    <p className="text-[13px] text-ink-secondary mt-1">If available</p>
                  </div>
                </div>

                <div className="px-6 py-5 flex gap-4 border-t border-bg-card-rule">
                  <span className="font-mono text-[18px] font-bold text-gold w-[88px] shrink-0 tabular-nums">$200K</span>
                  <div className="min-w-0">
                    <p className="font-bebas text-[18px] tracking-[0.06em] text-white leading-tight">Film School</p>
                    <p className="text-[13px] text-ink-secondary mt-1">3{"\u2013"}4 years</p>
                  </div>
                </div>

                <div className="px-6 py-5 flex gap-4 border-t border-bg-card-rule"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <span className="font-mono text-[18px] font-bold text-gold-label w-[88px] shrink-0">{"\u2014"}</span>
                  <div className="min-w-0">
                    <p className="font-bebas text-[18px] tracking-[0.06em] text-white leading-tight">Trial & Error</p>
                    <p className="text-[13px] text-ink-secondary mt-1">Non-recoverable</p>
                  </div>
                </div>

              </div>

              <p className="text-center text-ink-secondary text-[15px] leading-relaxed mt-6 max-w-[300px] mx-auto">
                You shouldn{"\u2019"}t need <span className="text-white font-medium">$200K</span> to understand your own deal.
              </p>
            </div>
          </section>
          {/* ──────────────────────────────────────────────────────────
               § 3  MOST FILMS LOSE MONEY
               Broken into cinematic beats — each gets its own moment.
             ────────────────────────────────────────────────────────── */}

          {/* § 3a — Problem statement: standalone glowing card */}
          <section id="evidence" className="py-14 md:py-20 px-6">
            <div
              ref={evidenceRef}
              className="max-w-md mx-auto"
              style={{
                opacity: evidenceVisible ? 1 : 0,
                transform: evidenceVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 700ms ease-out, transform 700ms ease-out',
              }}
            >
              <div className="text-center mb-8">
                <h2 className="font-bebas text-[40px] tracking-[0.08em] leading-[0.95] text-gold">
                  MOST FILMS LOSE <span className="text-white">MONEY.</span>
                </h2>
              </div>

              <div
                className="rounded-2xl px-8 py-8 text-center"
                style={{
                  border: '1px solid rgba(212,175,55,0.20)',
                  background: 'rgba(255,255,255,0.03)',
                  boxShadow: '0 0 40px rgba(212,175,55,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <p className="font-bebas text-[24px] tracking-[0.04em] leading-tight text-white mb-4">
                  Your film can make money{"\u00A0"}<span className="text-gold">&</span>{"\u00A0"}you still lose.
                </p>
                <p className="text-[15px] text-ink-secondary leading-relaxed max-w-[300px] mx-auto">
                  Not because it didn{"\u2019"}t recoup.{" "}
                  <span className="text-ink-body font-medium">Because of how the deal was structured.</span>
                </p>
              </div>
            </div>
          </section>

          {/* § 3b — Asset class comparison: open-air, staggered reveal */}
          <section className="py-10 md:py-14 px-6">
            <div ref={comparisonRef} className="max-w-md mx-auto">
              <p
                className="font-mono text-[12px] tracking-[0.12em] uppercase text-ink-secondary text-center mb-6"
                style={{
                  opacity: comparisonVisible ? 1 : 0,
                  transition: 'opacity 500ms ease-out',
                }}
              >
                Every other asset class has infrastructure
              </p>

              {[
                { asset: "Real Estate", tools: "Comps \u00B7 Cap rates \u00B7 Appraisal models" },
                { asset: "Private Equity", tools: "Carry structures \u00B7 IRR frameworks" },
                { asset: "Venture Capital", tools: "Term sheets \u00B7 Valuation benchmarks" },
              ].map((row, i) => (
                <div
                  key={row.asset}
                  className="flex items-baseline justify-between py-3.5 border-t border-bg-card-rule"
                  style={{
                    opacity: comparisonVisible ? 1 : 0,
                    transform: comparisonVisible ? 'translateX(0)' : 'translateX(-12px)',
                    transition: 'opacity 500ms ease-out, transform 500ms ease-out',
                    transitionDelay: `${(i + 1) * 150}ms`,
                  }}
                >
                  <span className="text-[15px] font-semibold text-ink-body">{row.asset}</span>
                  <span className="text-[13px] text-ink-secondary text-right ml-4">{row.tools}</span>
                </div>
              ))}

              {/* Film row — the void, promoted */}
              <div
                className="mt-4 border border-gold-border rounded-lg px-5 py-4 flex items-baseline justify-between"
                style={{
                  background: 'rgba(212,175,55,0.04)',
                  opacity: comparisonVisible ? 1 : 0,
                  transform: comparisonVisible ? 'translateX(0)' : 'translateX(-12px)',
                  transition: 'opacity 500ms ease-out, transform 500ms ease-out',
                  transitionDelay: '600ms',
                }}
              >
                <span className="text-[16px] font-bold text-white">Film</span>
                <span className="font-mono text-[14px] text-gold">{"\u2014"}</span>
              </div>
            </div>
          </section>

          {/* § 3c — "Nobody teaches..." — own interstitial moment */}
          <section className="py-12 md:py-16 px-6">
            <div
              ref={nobodyRef}
              className="text-center"
              style={{
                opacity: nobodyVisible ? 1 : 0,
                transition: 'opacity 600ms ease-out',
              }}
            >
              <p className="font-bebas text-[36px] tracking-[0.06em] text-gold leading-tight">
                Nobody teaches the business of film.
              </p>
            </div>
          </section>
          {/* ── INTERSTITIAL: Until Now — the pivot ── */}
          <section className="py-12 md:py-16 px-6">
            <div
              ref={untilNowRef}
              className="text-center transition-opacity duration-[600ms] ease-out"
              style={{ opacity: untilNowVisible ? 1 : 0 }}
            >
              <p className="font-bebas text-[48px] tracking-[0.08em] text-white">
                UNTIL NOW.
              </p>
            </div>
          </section>
          {/* ──────────────────────────────────────────────────────────
               § 4  FINAL CTA — The Close
             ────────────────────────────────────────────────────────── */}
          <section id="final-cta" className="py-14 md:py-20 px-6">
            <div className="max-w-md mx-auto">
              <div
                className="rounded-2xl px-8 py-10 md:py-14 text-center"
                style={{
                  border: '1px solid rgba(212,175,55,0.30)',
                  background: 'rgba(255,255,255,0.04)',
                  boxShadow: '0 0 60px rgba(212,175,55,0.06), 0 0 120px rgba(212,175,55,0.03), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <h2 className="font-bebas text-[40px] leading-[1.1] tracking-[0.08em] text-gold mb-6">
                  YOUR INVESTORS WILL{"\u00A0"}ASK HOW THE MONEY FLOWS <span className="text-white">BACK.</span>
                </h2>
                <button onClick={handleStartClick}
                  className="w-full max-w-[320px] h-14 btn-cta-primary animate-cta-glow-pulse mx-auto">
                  KNOW YOUR NUMBERS
                </button>
              </div>
            </div>
          </section>
          {/* ── FOOTER ── */}
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
