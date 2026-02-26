import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import {
  Check,
  X,
} from "lucide-react";
// Logo import removed — headline is the visual anchor
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
  { name: "Trial & Error", lock: "No second chances.", cost: "Everything" },
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
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const Index = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();


  // Lead capture gate — requires OTP verification
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
  const handleStoreClick    = () => { haptics.medium(); navigate("/store"); };

  return (
    <>

      {/* Lead capture modal — requires OTP verification */}
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
          <section id="hero" className="snap-section min-h-0 pt-24 pb-16 flex flex-col justify-center">
            <div className="px-6 py-4 max-w-xl mx-auto text-center relative">
              {/* Atmospheric gold gradient — ambient warmth, not a light show */}
              <div
                className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)' }}
                aria-hidden="true"
              />
              <h1 className="font-bebas text-[clamp(2.8rem,9vw,4.2rem)] leading-[1.05] tracking-[0.06em] text-gold mb-5 relative z-10">
                SEE WHERE EVERY<br /><span className="text-white">DOLLAR GOES</span>
              </h1>
              <p className="mb-12 text-ink-secondary text-[17px] leading-[1.7] tracking-[0.02em] font-medium max-w-[360px] mx-auto relative z-10">
                Built by a Tribeca-winning producer whose debut sold to <span className="text-gold font-semibold">Netflix</span>.
              </p>

              <div className="w-full max-w-[320px] mx-auto space-y-3 relative z-10">
                <button onClick={handleStartClick} className="w-full h-14 btn-cta-primary animate-cta-glow-pulse">
                  BUILD YOUR WATERFALL
                </button>
              </div>

            </div>
          </section>


          {/* Gold structural divider */}
          <div className="flex justify-center py-6">
            <div className="w-12 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)' }} />
          </div>

          {/* ──────────────────────────────────────────────────────────
               § 2  THE PROBLEM + THESIS — with "Until now." punchline
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="evidence">
            <div>

              <div className="text-center mb-10">
                <p className="text-[14px] tracking-[0.20em] uppercase font-semibold text-ink-secondary mb-5 text-center">The Problem</p>
                <h2
                  className="font-bebas text-[40px] tracking-[0.08em] leading-[0.95] text-gold"
                  style={{ textShadow: '0 0 30px rgba(212,175,55,0.30), 0 0 60px rgba(212,175,55,0.12)' }}
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
                  <div className="p-8 md:p-10 pl-9 md:pl-11">

                    {/* — Problem narrative — */}
                    <p className="font-bebas text-[26px] md:text-[32px] tracking-[0.06em] leading-tight mb-6">
                      <span className="text-gold">YOUR FILM CAN MAKE MONEY</span><br />
                      <span className="text-white">AND YOU STILL LOSE.</span>
                    </p>

                    <div className="space-y-3 mb-6">
                      <p className="text-ink-secondary text-[17px] leading-relaxed">
                        Not because it didn{"\u2019"}t recoup.
                      </p>
                      <p className="text-ink-body text-[17px] leading-relaxed font-medium">
                        Because of how the deal was structured.
                      </p>
                    </div>

                    {/* Gold divider */}
                    <div className="h-[1px] w-12 bg-gold-accent mb-6" />

                    <p className="font-bebas text-[26px] tracking-[0.08em] text-ink-body mb-8">
                      Most filmmakers learn it too late.
                    </p>

                    {/* — Thesis: alternative asset class — */}
                    <div className="border-t border-bg-card-rule pt-6 space-y-5">
                      {[
                        { asset: "Real Estate", tool: "comps and cap rate models" },
                        { asset: "Private Equity", tool: "carry and IRR structures" },
                        { asset: "Venture Capital", tool: "term sheets and valuation frameworks" },
                      ].map((row) => (
                        <div key={row.asset} className="flex items-baseline gap-3">
                          <Check className="w-4 h-4 text-gold flex-shrink-0 relative top-[2px]" />
                          <p className="text-ink-secondary text-[17px] leading-relaxed">
                            <span className="text-ink-body font-semibold">{row.asset}</span> has {row.tool}.
                          </p>
                        </div>
                      ))}
                      {/* The punchline */}
                      <div className="flex items-baseline gap-3 mt-2">
                        <X className="w-4 h-4 text-ink-secondary flex-shrink-0 relative top-[2px]" />
                        <p className="font-bebas text-[26px] tracking-[0.06em] text-gold leading-tight">
                          Film has no standardized framework.
                        </p>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            </div>
          </SectionFrame>

          {/* Gold structural divider */}
          <div className="flex justify-center py-6">
            <div className="w-12 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)' }} />
          </div>

          {/* ──────────────────────────────────────────────────────────
               § 3  THE COST — escalates the pain before the pivot
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="cost">
            <div>

              <div className="text-center mb-8">
                <p className="text-[14px] tracking-[0.20em] uppercase font-semibold text-ink-secondary mb-5">The Cost</p>
                <h2 className="font-bebas text-[40px] tracking-[0.08em] text-gold"
                  style={{ textShadow: '0 0 30px rgba(212,175,55,0.30), 0 0 60px rgba(212,175,55,0.12)' }}>
                  THE <span className="text-white">REALITY</span>
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {closedDoors.map((door) => (
                  <div
                    key={door.name}
                    className="relative border p-6 flex flex-col overflow-hidden rounded-xl bg-bg-card border-bg-card-border"
                  >
                    {/* Cost — the visual anchor */}
                    <span className="font-mono text-[26px] font-bold text-gold mb-2">
                      {door.cost}
                    </span>
                    {/* Title */}
                    <p className="font-bebas text-[17px] tracking-[0.08em] uppercase leading-tight text-white mb-2">
                      {door.name}
                    </p>
                    {/* Description — pushed to bottom for alignment */}
                    <p className="text-[14px] leading-[1.5] text-ink-secondary mt-auto">
                      {door.lock}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </SectionFrame>

          {/* ── INTERSTITIAL: Blum Quote — authority validates the pain ── */}
          <section className="py-12 md:py-16 px-6">
            <div className="max-w-md mx-auto">
              <div
                className="relative bg-bg-elevated border border-gold-accent overflow-hidden rounded-xl"
                style={{
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 0 30px rgba(212,175,55,0.10)',
                }}
              >
                {/* Gold left accent — strong */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.80), rgba(212,175,55,0.40), transparent)' }} />
                <div className="p-7 md:p-9 pl-8 md:pl-10">
                  {/* Opening quote mark */}
                  <div className="font-bebas text-[52px] md:text-[64px] leading-none select-none pointer-events-none text-gold -mb-4 -ml-1"
                    aria-hidden="true">{"\u201C"}</div>
                  <blockquote className="relative z-10">
                    <p className="text-[17px] leading-[1.7] text-ink-body italic">
                      Filmmakers have a perception in the business world of being kind of flaky dudes{"\u2026"} you need to be buttoned down{"\u2026"} speak the language that they speak.
                    </p>
                  </blockquote>
                  <div className="mt-6 pt-4 border-t border-white/[0.06]">
                    <div className="inline-flex items-center gap-3 rounded-lg px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <div className="w-8 h-[1.5px] bg-gold-accent flex-shrink-0" />
                      <div>
                        <cite className="not-italic">
                          <span className="font-bebas text-[17px] tracking-[0.14em] uppercase text-gold">Jason Blum</span>
                        </cite>
                        <p className="text-ink-secondary text-[13px] tracking-[0.06em] mt-0.5">Blumhouse {"\u2014"} {"\u201C"}Paranormal Activity{"\u201D"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Gold structural divider */}
          <div className="flex justify-center py-6">
            <div className="w-12 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)' }} />
          </div>

          {/* ──────────────────────────────────────────────────────────
               § 4  THE SOLUTION — the product reveal
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="waterfall" variant="gold">
            <div>

              <p className="text-[14px] tracking-[0.20em] uppercase font-semibold text-ink-secondary text-center mb-5">The Solution</p>
              <h2 className="font-bebas text-[40px] text-gold tracking-[0.08em] text-center mb-2"
                style={{ textShadow: '0 0 30px rgba(212,175,55,0.30), 0 0 60px rgba(212,175,55,0.12)' }}>THE <span className="text-white">WATERFALL</span></h2>
              <p className="font-bebas text-[26px] tracking-[0.06em] text-ink-secondary text-center mb-6">
                We built the framework.
              </p>

              <div ref={waterBarRef} className="max-w-md mx-auto">
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
                        <div className="flex items-baseline gap-3">
                          <span className="font-mono text-[13px] text-ink-secondary tabular-nums">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className={cn(
                            "font-bebas tracking-[0.08em] uppercase",
                            i === 0 ? "text-[26px] text-white" : "text-[17px] text-ink-body"
                          )}>
                            {tier.name}
                          </span>
                        </div>
                        <span className="font-mono text-[17px] font-semibold text-ink-body">
                          {tier.amount}
                        </span>
                      </div>
                      <div className={cn("w-full relative overflow-hidden", i === 0 ? "h-3" : "h-2")} style={{ background: "rgba(255,255,255,0.12)" }}>
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
                <div className="mt-4 border border-gold-border bg-black px-5 py-5 text-center rounded-lg"
                  style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                  <p className="text-[13px] tracking-[0.2em] uppercase font-semibold text-gold mb-1">Net Profits</p>
                  <span className="font-mono text-[26px] font-bold text-white">
                    ${countVal.toLocaleString()}
                  </span>
                </div>

                {/* Branching connector — financial schematic */}
                <div className="flex justify-center">
                  <div className="w-[2px] h-6 bg-gold-accent" />
                </div>
                <div className="flex items-start">
                  <div className="flex-1 flex justify-end">
                    <div className="w-1/2 h-[2px] bg-gold-accent" />
                  </div>
                  <div className="flex-1 flex justify-start">
                    <div className="w-1/2 h-[2px] bg-gold-accent" />
                  </div>
                </div>

                {/* Two corridor boxes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gold-border bg-black px-4 py-5 text-center rounded-lg"
                    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                    <p className="text-[13px] tracking-[0.2em] uppercase font-semibold text-gold mb-1">Producer Corridor</p>
                    <span className="font-mono text-[26px] font-bold text-white">
                      ${producerVal.toLocaleString()}
                    </span>
                  </div>
                  <div className="border border-gold-border bg-black px-4 py-5 text-center rounded-lg"
                    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                    <p className="text-[13px] tracking-[0.2em] uppercase font-semibold text-gold mb-1">Investor Corridor</p>
                    <span className="font-mono text-[26px] font-bold text-white">
                      ${investorVal.toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="font-mono text-[13px] text-ink-secondary text-center mt-5">Based on a hypothetical $1.8M budget and a $3M acquisition.</p>
              </div>
            </div>
          </SectionFrame>


          {/* ──────────────────────────────────────────────────────────
               § 6  WHAT YOU GET — the solution ladder
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="offer">
            <div>
              <div className="text-center mb-8">
                <p className="text-[14px] tracking-[0.20em] uppercase font-semibold text-ink-secondary mb-5">The Offer</p>
                <h2 className="font-bebas text-[40px] tracking-[0.08em] text-gold leading-[1.05]"
                  style={{ textShadow: '0 0 30px rgba(212,175,55,0.30), 0 0 60px rgba(212,175,55,0.12)' }}>
                  YOUR PATH{"\u00A0"}<span className="text-white">FORWARD</span>
                </h2>
              </div>

              <div className="space-y-3">
                {/* Free Calculator — the entry point (filled) */}
                <div className="rounded-xl p-5 md:p-6 bg-bg-card">
                  <span className="inline-block font-bebas text-[14px] tracking-[0.20em] uppercase text-gold mb-2">Free</span>
                  <h3 className="font-bebas text-[26px] md:text-[32px] tracking-[0.06em] text-white mb-2">THE CALCULATOR</h3>
                  <p className="text-ink-secondary text-[17px] leading-relaxed mb-5">
                    Model your deal. Stress-test your numbers. See where every dollar flows.
                  </p>
                  <div className="text-center">
                    <button onClick={handleStartClick}
                      className="w-full max-w-[260px] h-12 btn-cta-primary text-[17px]">
                      START FREE
                    </button>
                  </div>
                </div>

                {/* The Blueprint — $197 (transparent) */}
                <div className="rounded-xl p-5 md:p-6">
                  <span className="inline-block font-mono text-[26px] font-bold text-gold mb-2">$197</span>
                  <h3 className="font-bebas text-[26px] md:text-[32px] tracking-[0.06em] text-white mb-2">THE BLUEPRINT</h3>
                  <p className="text-ink-secondary text-[17px] leading-relaxed mb-5">
                    Your complete finance plan in 4 professional documents. Formatted for your attorney.
                  </p>
                  <div className="text-center">
                    <button onClick={handleStoreClick}
                      className="w-full max-w-[260px] h-12 btn-cta-secondary text-[17px]">
                      VIEW DETAILS
                    </button>
                  </div>
                </div>

                {/* The Pitch Package — $497 (filled) */}
                <div className="rounded-xl p-5 md:p-6 bg-bg-card">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-mono text-[26px] md:text-[32px] font-bold text-gold">$497</span>
                    <span className="font-mono text-[17px] text-ink-secondary line-through">$697</span>
                    <span className="text-[13px] tracking-[0.10em] uppercase font-semibold text-gold-accent">Save $200</span>
                  </div>
                  <h3 className="font-bebas text-[26px] md:text-[32px] tracking-[0.06em] text-white mb-2">THE PITCH PACKAGE</h3>
                  <p className="text-ink-secondary text-[17px] leading-relaxed mb-5">
                    8 documents including a pitch deck and investor return profiles. Walk into the room prepared.
                  </p>
                  <div className="text-center">
                    <button onClick={handleStoreClick}
                      className="w-full max-w-[260px] h-12 btn-cta-secondary text-[17px]">
                      VIEW DETAILS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SectionFrame>


          {/* Gold structural divider */}
          <div className="flex justify-center py-6">
            <div className="w-12 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)' }} />
          </div>

          {/* ──────────────────────────────────────────────────────────
               § 7  FINAL CTA — The Moment of Truth
             ────────────────────────────────────────────────────────── */}
          <section id="final-cta" className="snap-section py-14 md:py-20 px-6">
            <div className="max-w-md mx-auto">
              <div
                className="relative bg-bg-elevated overflow-hidden rounded-xl text-center px-8 py-14 md:px-10 md:py-16"
                style={{
                  border: '1px solid rgba(212,175,55,0.40)',
                  boxShadow: [
                    'inset 0 1px 0 rgba(255,255,255,0.06)',
                    '0 0 12px rgba(212,175,55,0.12)',
                    '0 0 40px rgba(212,175,55,0.08)',
                    '0 4px 20px rgba(0,0,0,0.50)',
                    '0 12px 48px rgba(0,0,0,0.30)',
                  ].join(', '),
                }}
              >
                <h2 className="font-bebas text-[40px] leading-[1.1] tracking-[0.08em] text-gold mb-10">
                  YOUR INVESTOR WILL{"\u00A0"}ASK HOW THE MONEY FLOWS <span className="text-white">BACK</span>.
                </h2>
                <button onClick={handleStartClick}
                  className="w-full max-w-[320px] h-14 btn-cta-primary animate-cta-glow-pulse mx-auto">
                  BUILD YOUR WATERFALL
                </button>
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="py-8 px-6 max-w-md mx-auto">
            <p className="text-ink-secondary/50 text-[11px] tracking-wide leading-relaxed text-center">
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
