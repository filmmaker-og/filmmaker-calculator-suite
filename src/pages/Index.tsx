import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import {
  Check,
  X,
  LockKeyhole,
  ChevronDown,
} from "lucide-react";
import filmmakerLogo from "@/assets/filmmaker-f-icon.png";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { cn } from "@/lib/utils";
import SectionFrame from "@/components/SectionFrame";


/* ═══════════════════════════════════════════════════════════════════
   CLOSED DOORS — the reality of what's available
   ═══════════════════════════════════════════════════════════════════ */
const closedDoors = [
  { name: "Entertainment Attorney", lock: "If they\u2019ll take the meeting.", cost: "$800/hr" },
  { name: "Producing Consultant", lock: "If you can afford one.", cost: "$5K+" },
  { name: "Film School", lock: "Four years you don\u2019t have.", cost: "$200K" },
  { name: "Trial & Error", lock: "Your investors won\u2019t get a second one.", cost: "Everything" },
];

/* ═══════════════════════════════════════════════════════════════════
   WATERFALL TIERS — proportional bars ($3M cascade)
   ═══════════════════════════════════════════════════════════════════ */
const waterfallTiers = [
  { name: "Acquisition Price", amount: "$3,000,000",    pct: 100.0, barColor: "rgba(212,175,55,0.65)", isFinal: false },
  { name: "CAM Fees",          amount: "\u2212$22,500",      pct: 99.3,  barColor: "rgba(212,175,55,0.65)", isFinal: false },
  { name: "Sales Agent",       amount: "\u2212$450,000",     pct: 84.3,  barColor: "rgba(212,175,55,0.65)", isFinal: false },
  { name: "Senior Debt",       amount: "\u2212$440,000",     pct: 69.6,  barColor: "rgba(212,175,55,0.65)", isFinal: false },
  { name: "Mezzanine",         amount: "\u2212$230,000",     pct: 61.9,  barColor: "rgba(212,175,55,0.65)", isFinal: false },
  { name: "Equity Recoupment", amount: "\u2212$1,440,000",   pct: 13.9,  barColor: "rgba(212,175,55,0.65)", isFinal: false },
  { name: "Net Profits",       amount: "$417,500",       pct: 13.9,  barColor: "rgba(212,175,55,0.85)",  isFinal: true  },
];

/* ═══════════════════════════════════════════════════════════════════
   SCROLL-TRIGGERED REVEAL HOOK
   ═══════════════════════════════════════════════════════════════════ */
const useReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [visible, setVisible] = useState(prefersReduced);
  useEffect(() => {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, prefersReduced]);
  return { ref, visible };
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const Index = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();


  // Lead capture gate — requires magic link verification
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

  // Reveals
  const revEvidence    = useReveal();
  const revMission     = useReveal();
  const revWater       = useReveal();
  const revCost        = useReveal();
  const revDecl        = useReveal();
  const revFinal       = useReveal();
  const revUntilNow    = useReveal();
  const revBlum        = useReveal();

  // Waterfall bar animation
  const [barsRevealed, setBarsRevealed] = useState(false);
  const waterBarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = waterBarRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setBarsRevealed(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
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
    }, 1800);
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
    }, 3800);
    return () => clearTimeout(delay);
  }, [barsRevealed]);

  const handleStartClick    = () => { haptics.medium(); gatedNavigate("/calculator?tab=budget"); };

  return (
    <>

      {/* Lead capture modal — requires magic link verification */}
      <LeadCaptureModal
        isOpen={showLeadCapture}
        onClose={() => setShowLeadCapture(false)}
        onSuccess={() => {
          setHasSession(true);
          setShowLeadCapture(false);
          navigate(pendingDestination || "/calculator?tab=budget");
        }}
      />

      <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">

        {/* ═══════ LANDING PAGE ═══════ */}
        <main aria-label="Film Finance Simulator" className="flex-1 flex flex-col" style={{ paddingBottom: "calc(var(--bottom-bar-h) + env(safe-area-inset-bottom))" }}>

          {/* ──────────────────────────────────────────────────────────
               § 1  HERO
             ────────────────────────────────────────────────────────── */}
          <section id="hero" className="snap-section min-h-0 pt-10 pb-12 flex flex-col justify-center relative overflow-hidden">
            {/* Ambient gold glow — stops at logo */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none animate-spotlight-pulse"
              style={{ width: '100vw', height: '280px', background: `radial-gradient(ellipse 35% 55% at 50% 15%, rgba(212,175,55,0.06) 0%, rgba(212,175,55,0.04) 45%, transparent 75%)` }} />
            {/* Static spotlight cone — contained to top half */}
            <div className="absolute top-0 left-0 right-0 pointer-events-none"
              style={{
                height: '280px',
                background: `radial-gradient(ellipse 25% 60% at 50% 0%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 30%, rgba(212,175,55,0.02) 50%, transparent 70%)`,
                clipPath: 'polygon(42% 0%, 58% 0%, 68% 100%, 32% 100%)',
              }} />
            {/* Left focused beam — contained */}
            <div className="absolute top-0 left-0 right-0 pointer-events-none"
              style={{
                height: '260px',
                background: `radial-gradient(ellipse 18% 55% at 38% 0%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)`,
                clipPath: 'polygon(33% 0%, 46% 0%, 54% 100%, 24% 100%)',
              }} />
            {/* Right focused beam — contained */}
            <div className="absolute top-0 left-0 right-0 pointer-events-none"
              style={{
                height: '260px',
                background: `radial-gradient(ellipse 18% 55% at 62% 0%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)`,
                clipPath: 'polygon(54% 0%, 67% 0%, 76% 100%, 46% 100%)',
              }} />
            <div className="relative px-6 py-4 max-w-xl mx-auto text-center">
              <div className="mb-5 relative inline-block">
                <div className="absolute inset-0 -m-10 animate-logo-breathe" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.45) 0%, transparent 70%)', filter: 'blur(18px)' }} />
                <img src={filmmakerLogo} alt="Filmmaker.OG" className="relative z-10 w-[96px] h-[96px] object-contain"
                  style={{ filter: 'brightness(1.25) saturate(1.1) drop-shadow(0 0 12px rgba(212,175,55,0.5))' }} />
              </div>
              <h1 className="font-bebas text-[clamp(2.8rem,9vw,4.2rem)] leading-[1.05] tracking-[0.06em] text-gold mb-5">
                SEE WHERE EVERY<br /><span className="text-white">DOLLAR GOES</span>
              </h1>
              <p className="mb-6 text-ink-secondary text-[16px] leading-[1.7] tracking-[0.02em] font-medium max-w-[360px] mx-auto">
                Built by a Tribeca-winning producer whose debut sold to <span className="text-gold font-semibold">Netflix</span>.
              </p>

              <div className="w-full max-w-[320px] mx-auto space-y-3">
                <button onClick={handleStartClick} className="w-full h-14 btn-cta-primary">
                  BUILD YOUR WATERFALL
                </button>
              </div>

              <div className="mt-8 flex justify-center animate-bounce-subtle cursor-pointer active:scale-[0.97]"
                onClick={() => { haptics.light(); document.getElementById('waterfall')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <ChevronDown className="w-6 h-6 text-gold" />
              </div>
            </div>
          </section>


          {/* ──────────────────────────────────────────────────────────
               § 2  THE WATERFALL — immediately after hero
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="waterfall">
            <div ref={revWater.ref} className={cn("transition-all duration-700 ease-out", revWater.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>

              <h2 className="font-bebas text-[36px] md:text-[44px] text-gold tracking-[0.08em] text-center mb-1">THE <span className="text-white">WATERFALL</span></h2>
              <p className="text-[14px] tracking-[0.20em] uppercase font-semibold text-ink-secondary text-center mb-2">Your recoupment structure</p>

              <div ref={waterBarRef} className="max-w-md mx-auto">
                {/* Waterfall rows — unified financial table */}
                <div className="border border-gold-border bg-black overflow-hidden rounded-xl">
                  {waterfallTiers.filter(t => !t.isFinal).map((tier, i) => (
                    <div
                      key={tier.name}
                      className={cn(
                        "px-5 py-4 relative",
                        i > 0 && "border-t border-bg-card-rule",
                      )}
                    >
                      <div className="flex justify-between items-baseline mb-2">
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-[12px] text-ink-secondary tabular-nums">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className={cn(
                            "font-bebas tracking-[0.08em] uppercase",
                            i === 0 ? "text-[20px] text-white" : "text-[17px] text-ink-body"
                          )}>
                            {tier.name}
                          </span>
                        </div>
                        <span className="font-mono text-[17px] font-semibold text-ink-body">
                          {tier.amount}
                        </span>
                      </div>
                      <div className={cn("w-full relative overflow-hidden", i === 0 ? "h-3" : "h-2")} style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div
                          className="absolute left-0 top-0 h-full"
                          style={{
                            width: barsRevealed ? `${tier.pct}%` : '0%',
                            background: tier.barColor,
                            boxShadow: i === 0 ? '0 0 8px rgba(212,175,55,0.15)' : 'none',
                            transition: `width 500ms cubic-bezier(0.16,1,0.3,1)`,
                            transitionDelay: `${i * 150}ms`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Net Profits */}
                <div className="mt-4 border border-gold-border bg-black px-5 py-4 text-center rounded-lg">
                  <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-gold mb-1">Net Profits</p>
                  <span className="font-mono text-[22px] font-bold text-white">
                    ${countVal.toLocaleString()}
                  </span>
                </div>

                {/* Branching connector */}
                <div className="flex justify-center">
                  <div className="w-[2px] h-6" style={{ background: "rgba(212,175,55,0.60)" }} />
                </div>
                <div className="flex items-start">
                  <div className="flex-1 flex justify-end">
                    <div className="w-1/2 h-[2px]" style={{ background: "rgba(212,175,55,0.60)" }} />
                  </div>
                  <div className="flex-1 flex justify-start">
                    <div className="w-1/2 h-[2px]" style={{ background: "rgba(212,175,55,0.60)" }} />
                  </div>
                </div>

                {/* Two corridor boxes — consistent treatment */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gold-border bg-black px-4 py-5 text-center rounded-lg">
                    <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-gold mb-1">Producer Corridor</p>
                    <span className="font-mono text-[18px] font-bold text-white">
                      ${producerVal.toLocaleString()}
                    </span>
                  </div>
                  <div className="border border-gold-border bg-black px-4 py-5 text-center rounded-lg">
                    <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-gold mb-1">Investor Corridor</p>
                    <span className="font-mono text-[18px] font-bold text-white">
                      ${investorVal.toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="font-mono text-[12px] text-ink-secondary text-center mt-5">Based on a hypothetical $1.8M budget and a $3M acquisition.</p>
              </div>
            </div>
          </SectionFrame>


          {/* ──────────────────────────────────────────────────────────
               § 3  COMBINED PROBLEM + THESIS — one continuous section
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="evidence">
            <div ref={revEvidence.ref} className={cn("transition-all duration-700 ease-out", revEvidence.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>

              <div className="text-center mb-10">
                <p className="text-[14px] tracking-[0.20em] uppercase font-semibold text-ink-secondary mb-5 text-center">The Problem</p>
                <h2
                  className="font-bebas text-[36px] md:text-[44px] tracking-[0.06em] leading-[0.95] text-gold"
                  style={{
                    textShadow: revEvidence.visible
                      ? '0 0 30px rgba(212,175,55,0.25), 0 0 60px rgba(212,175,55,0.10)'
                      : 'none',
                  }}
                >
                  MOST FILMS LOSE <span className="text-white">MONEY.</span>
                </h2>
              </div>

              {/* Unified container — problem flows into thesis */}
              <div className="max-w-md mx-auto">
                <div className="relative bg-bg-card border border-bg-card-border overflow-hidden rounded-xl"
                  style={{ boxShadow: '0 0 20px rgba(212,175,55,0.06)' }}>
                  {/* Gold left accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.55), rgba(212,175,55,0.25), transparent)' }} />
                  <div className="p-7 md:p-9 pl-8 md:pl-10">

                    {/* — Problem narrative — */}
                    <p
                      className={cn(
                        "font-bebas text-[24px] md:text-[30px] tracking-[0.06em] leading-tight mb-6 transition-all duration-500 ease-out",
                        revEvidence.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                      )}
                      style={{ transitionDelay: revEvidence.visible ? '200ms' : '0ms' }}
                    >
                      <span className="text-gold">YOUR FILM CAN MAKE MONEY</span><br />
                      <span className="text-white">AND YOU STILL LOSE.</span>
                    </p>

                    <div className="space-y-3 mb-6">
                      <p
                        className={cn(
                          "text-ink-secondary text-[16px] leading-relaxed transition-all duration-500 ease-out",
                          revEvidence.visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                        )}
                        style={{ transitionDelay: revEvidence.visible ? '300ms' : '0ms' }}
                      >
                        Not because it didn{"\u2019"}t recoup.
                      </p>
                      <p
                        className={cn(
                          "text-ink-body text-[16px] leading-relaxed font-medium transition-all duration-500 ease-out",
                          revEvidence.visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                        )}
                        style={{ transitionDelay: revEvidence.visible ? '450ms' : '0ms' }}
                      >
                        Because of how the deal was structured.
                      </p>
                    </div>

                    {/* Gold divider — dramatic pause */}
                    <div
                      className={cn(
                        "h-[1px] w-12 bg-gold-accent mb-6 transition-all duration-500 ease-out",
                        revEvidence.visible ? "opacity-100" : "opacity-0"
                      )}
                      style={{ transitionDelay: revEvidence.visible ? '600ms' : '0ms' }}
                    />

                    <p
                      className={cn(
                        "font-bebas text-[20px] md:text-[24px] tracking-[0.08em] text-ink-body mb-8 transition-all duration-500 ease-out",
                        revEvidence.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                      )}
                      style={{ transitionDelay: revEvidence.visible ? '750ms' : '0ms' }}
                    >
                      Most filmmakers learn it too late.
                    </p>

                    {/* — Thesis: alternative asset class — */}
                    <div
                      ref={revMission.ref}
                      className={cn(
                        "border-t border-bg-card-rule pt-6 space-y-5 transition-all duration-700 ease-out",
                        revMission.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      )}
                    >
                      {[
                        { asset: "Real Estate", tool: "comps and cap rate models" },
                        { asset: "Private Equity", tool: "carry and IRR structures" },
                        { asset: "Venture Capital", tool: "term sheets and valuation frameworks" },
                      ].map((row, i) => (
                        <div
                          key={row.asset}
                          className={cn(
                            "flex items-baseline gap-3 transition-all duration-500 ease-out",
                            revMission.visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                          )}
                          style={{ transitionDelay: revMission.visible ? `${200 + i * 120}ms` : '0ms' }}
                        >
                          <Check className="w-3.5 h-3.5 text-gold flex-shrink-0 relative top-[2px]" />
                          <p className="text-ink-secondary text-[16px] leading-relaxed">
                            <span className="text-ink-body font-semibold">{row.asset}</span> has {row.tool}.
                          </p>
                        </div>
                      ))}
                      {/* The punchline */}
                      <div
                        className={cn(
                          "flex items-baseline gap-3 mt-2 transition-all duration-500 ease-out",
                          revMission.visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                        )}
                        style={{ transitionDelay: revMission.visible ? '560ms' : '0ms' }}
                      >
                        <X className="w-4 h-4 text-ink-secondary flex-shrink-0 relative top-[2px]" />
                        <p className="font-bebas text-[22px] md:text-[26px] tracking-[0.06em] text-gold leading-tight">
                          Film has no standardized framework.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </SectionFrame>

          {/* ── INTERSTITIAL: Blum Quote ── */}
          <section className="py-6 md:py-10 px-6">
            <div
              ref={revBlum.ref}
              className={cn(
                "max-w-md mx-auto transition-all duration-700 ease-out",
                revBlum.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <div
                className="relative border border-gold-accent overflow-hidden rounded-xl"
                style={{
                  background: '#0C0C0C',
                  boxShadow: '0 0 30px rgba(212,175,55,0.08), inset 0 1px 0 rgba(212,175,55,0.10)',
                }}
              >
                {/* Gold left accent — strong */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.80), rgba(212,175,55,0.40), transparent)' }} />
                <div className="p-5 md:p-7 pl-6 md:pl-9">
                  {/* Opening quote mark */}
                  <div className="font-bebas text-[48px] md:text-[60px] leading-none select-none pointer-events-none text-gold -mb-4 -ml-1"
                    aria-hidden="true">{"\u201C"}</div>
                  <blockquote className="relative z-10">
                    <p className="text-[16px] md:text-[17px] leading-[1.7] text-ink-body italic">
                      Filmmakers have a perception in the business world of being kind of flaky dudes{"\u2026"} you need to be buttoned down{"\u2026"} speak the language that they speak.
                    </p>
                  </blockquote>
                  <div className="mt-4 pt-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-[1.5px] bg-gold-accent" />
                      <cite className="not-italic">
                        <span className="font-bebas text-[15px] tracking-[0.14em] uppercase text-gold">Jason Blum</span>
                      </cite>
                    </div>
                    <p className="text-ink-secondary text-[14px] tracking-[0.08em] mt-1.5 ml-9">Blumhouse "Paranormal Activity"</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
               § 4  CLOSED DOORS — the four cards speak for themselves
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="cost">
            <div ref={revCost.ref} className={cn("transition-all duration-700 ease-out", revCost.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>

              <div className="text-center mb-8">
                <h2 className="font-bebas text-[36px] md:text-[44px] tracking-[0.08em] text-gold"
                  style={{ textShadow: revCost.visible ? '0 0 30px rgba(212,175,55,0.4), 0 0 60px rgba(212,175,55,0.15)' : 'none' }}>
                  THE <span className="text-white">REALITY</span>
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {closedDoors.map((door, i) => (
                  <div
                    key={door.name}
                    className={cn(
                      "relative border p-5 flex flex-col gap-4 transition-all duration-700 ease-out overflow-hidden rounded-xl",
                      "bg-bg-card border-bg-card-border",
                      revCost.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                    style={{
                      transitionDelay: revCost.visible ? `${i * 100}ms` : '0ms',
                    }}
                  >
                    {/* Lock watermark */}
                    <LockKeyhole
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 text-gold-accent"
                      strokeWidth={1}
                    />
                    {/* Title */}
                    <div className="relative z-10">
                      <p className="font-bebas text-[18px] md:text-[20px] tracking-[0.08em] uppercase leading-tight text-white">
                        {door.name}
                      </p>
                    </div>
                    {/* Cost + description */}
                    <div className="relative z-10 mt-auto">
                      <span className="font-mono text-[15px] font-bold text-gold block mb-2">
                        {door.cost}
                      </span>
                      <p className="text-[13px] leading-[1.5] text-ink-secondary">
                        {door.lock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionFrame>

          {/* ── PIVOT — "Until now." ── */}
          <section className="py-10 md:py-14 px-6 relative">
            <div
              ref={revUntilNow.ref}
              className={cn(
                "max-w-md mx-auto text-center transition-all duration-700 ease-out",
                revUntilNow.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              )}
            >
              <div className="flex items-center gap-5 justify-center">
                <div className="h-[1.5px] w-16 bg-gradient-to-r from-transparent to-gold-accent" />
                <p
                  className="font-bebas text-[40px] md:text-[50px] tracking-[0.06em] text-gold"
                  style={{
                    textShadow: revUntilNow.visible
                      ? '0 0 30px rgba(212,175,55,0.4), 0 0 60px rgba(212,175,55,0.15)'
                      : 'none',
                  }}
                >
                  Until <span className="text-white">now</span>.
                </p>
                <div className="h-[1.5px] w-16 bg-gradient-to-l from-transparent to-gold-accent" />
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
               DECLARATION — the hinge before final CTA
             ────────────────────────────────────────────────────────── */}
          <section className="py-10 md:py-16 px-6 relative">
            <div ref={revDecl.ref} className={cn("max-w-md mx-auto relative transition-all duration-700 ease-out", revDecl.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5")}>
              <div className="py-10">
                <div className="flex items-center gap-5 justify-center">
                  <div className="h-[1.5px] w-16 bg-gradient-to-r from-transparent to-gold-accent" />
                  <h3
                    className="font-bebas text-[34px] md:text-[44px] tracking-[0.06em] uppercase text-gold leading-[1.1] text-center"
                    style={{ textShadow: revDecl.visible ? '0 0 30px rgba(212,175,55,0.4), 0 0 60px rgba(212,175,55,0.15)' : 'none' }}
                  >
                    We Built What They Didn{"\u2019"}t Teach You In Film{"\u00A0"}<span className="text-white">School</span>.
                  </h3>
                  <div className="h-[1.5px] w-16 bg-gradient-to-l from-transparent to-gold-accent" />
                </div>
              </div>
              <div className="flex justify-center mt-6 cursor-pointer active:scale-[0.97]"
                onClick={() => { haptics.light(); document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <ChevronDown className="w-5 h-5 text-gold animate-bounce-subtle" />
              </div>
            </div>
          </section>


          {/* ──────────────────────────────────────────────────────────
               § 5  FINAL CTA
             ────────────────────────────────────────────────────────── */}
          <section id="final-cta" className="snap-section py-10 px-4">
            <div
              ref={revFinal.ref}
              className={cn(
                "relative overflow-hidden transition-all duration-700 ease-out rounded-2xl border border-gold-accent",
                revFinal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}
              style={{
                background: 'rgba(212,175,55,0.03)',
                boxShadow: '0 0 40px rgba(212,175,55,0.08), inset 0 1px 0 rgba(212,175,55,0.08)',
              }}
            >
              {/* Ambient glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                style={{ width: '100%', height: '100%', background: `radial-gradient(ellipse 320px 50% at 50% 20%, rgba(212,175,55,0.06) 0%, transparent 70%)` }} />

              <div className="relative p-10 md:p-16 max-w-md mx-auto text-center">
                <p className="text-[14px] tracking-[0.20em] uppercase font-semibold text-ink-secondary mb-5">The Moment of Truth</p>
                <h2 className="font-bebas text-[36px] md:text-[44px] leading-[1.1] tracking-[0.08em] text-gold mb-8">
                  YOUR INVESTOR WILL{"\u00A0"}ASK HOW THE MONEY FLOWS <span className="text-white">BACK</span>.
                </h2>
                <button onClick={handleStartClick}
                  className="w-full max-w-[320px] h-14 btn-cta-final mx-auto">
                  BUILD YOUR WATERFALL
                </button>
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="py-8 flex justify-center px-4">
            <div
              className="text-center overflow-hidden"
              style={{
                width: "100%",
                maxWidth: "320px",
                borderRadius: "16px",
                background: "#000000",
                border: "1.5px solid rgba(212,175,55,0.50)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.95), 0 0 0 1px rgba(212,175,55,0.10)",
                padding: "24px 32px",
              }}
            >
              <p className="text-ink-secondary text-xs tracking-wide leading-relaxed">
                For educational and informational purposes only. Not legal, tax, or investment advice.
                Consult a qualified entertainment attorney before making financing decisions.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
};

export default Index;
