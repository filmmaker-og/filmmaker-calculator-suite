import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
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
  { name: "Acquisition Price", amount: "$3,000,000",    pct: 100.0, barColor: "rgba(212,175,55,0.80)",  isFinal: false },
  { name: "CAM Fees",          amount: "\u2212$22,500",      pct: 99.3,  barColor: "rgba(180,85,55,0.70)",   isFinal: false },
  { name: "Sales Agent",       amount: "\u2212$450,000",     pct: 84.3,  barColor: "rgba(180,85,55,0.70)",   isFinal: false },
  { name: "Senior Debt",       amount: "\u2212$440,000",     pct: 69.6,  barColor: "rgba(180,85,55,0.70)",   isFinal: false },
  { name: "Mezzanine",         amount: "\u2212$230,000",     pct: 61.9,  barColor: "rgba(180,85,55,0.70)",   isFinal: false },
  { name: "Equity Recoupment", amount: "\u2212$1,440,000",   pct: 13.9,  barColor: "rgba(180,85,55,0.70)",   isFinal: false },
  { name: "Net Profits",       amount: "$417,500",       pct: 13.9,  barColor: "rgba(212,175,55,0.90)",  isFinal: true  },
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


  // Waterfall bar animation — fires on load with a brief delay
  // so the user has time to read the headline before bars animate
  const [barsRevealed, setBarsRevealed] = useState(false);
  const waterBarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const delay = setTimeout(() => setBarsRevealed(true), 600);
    return () => clearTimeout(delay);
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
    }, 2200);
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
    }, 4600);
    return () => clearTimeout(delay);
  }, [barsRevealed]);

  const handleStartClick    = () => { haptics.medium(); gatedNavigate("/calculator?tab=budget"); };

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
          <section id="hero" className="relative pt-20 pb-12">
            {/* Ambient warmth */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 60% 50% at 50% 25%, rgba(212,175,55,0.06) 0%, transparent 100%)",
              }}
            />

            <div className="relative px-6 max-w-md mx-auto">
              {/* Headline */}
              <div className="text-center mb-10">
                <h1 className="font-bebas text-[clamp(3.2rem,11vw,4.8rem)] leading-[0.95] tracking-[0.02em] text-white mb-6">
                  SEE WHERE EVERY<br /><span className="text-gold">DOLLAR GOES</span>
                </h1>
                <p className="text-ink-secondary text-[17px] leading-[1.7] tracking-[0.02em] font-medium max-w-[340px] mx-auto">
                  Model your deal before you sign it. Free. No account to start.
                </p>
              </div>

              {/* Context line — anchors the visualization */}
              <p className="font-mono text-[14px] text-ink-body text-center mb-6">
                Hypothetical: $1.8M budget{"\u00A0"}{"\u2192"}{"\u00A0"}$3M acquisition
              </p>

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
                      <div className={cn("w-full relative overflow-hidden", i === 0 ? "h-4" : "h-3")} style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div
                          className="absolute left-0 top-0 h-full"
                          style={{
                            width: barsRevealed ? `${tier.pct}%` : '0%',
                            background: tier.barColor,
                            boxShadow: i === 0 ? '0 0 12px rgba(212,175,55,0.25)' : 'none',
                            transition: `width 800ms cubic-bezier(0.16,1,0.3,1)`,
                            transitionDelay: `${i * 200}ms`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Net Profits */}
                <div className="mt-4 border border-gold-border bg-black px-6 py-6 text-center rounded-lg"
                  style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                  <p className="text-[13px] tracking-[0.2em] uppercase font-semibold text-gold mb-1">Net Profits</p>
                  <span className="font-mono text-[32px] font-bold text-white">
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
                  <div className="border border-gold-border bg-black px-4 py-6 text-center rounded-lg"
                    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                    <p className="text-[13px] tracking-[0.2em] uppercase font-semibold text-gold mb-1">Producer Corridor</p>
                    <span className="font-mono text-[26px] font-bold text-white">
                      ${producerVal.toLocaleString()}
                    </span>
                  </div>
                  <div className="border border-gold-border bg-black px-4 py-6 text-center rounded-lg"
                    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                    <p className="text-[13px] tracking-[0.2em] uppercase font-semibold text-gold mb-1">Investor Corridor</p>
                    <span className="font-mono text-[26px] font-bold text-white">
                      ${investorVal.toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="font-mono text-[13px] text-ink-secondary text-center mt-4">50/50 net profit split after full recoupment.</p>
              </div>

              {/* CTA — earns the click after the visualization */}
              <div className="mt-12 text-center">
                <div className="w-full max-w-[280px] mx-auto">
                  <button onClick={handleStartClick}
                    className="w-full h-14 btn-cta-primary animate-cta-glow-pulse">
                    BUILD YOUR WATERFALL
                  </button>
                </div>
              </div>
            </div>
          </section>


          {/* Gold structural divider */}
          <div className="flex justify-center py-8 md:py-12">
            <div className="w-16 h-px" style={{ background: "rgba(212,175,55,0.35)" }} />
          </div>


          {/* ──────────────────────────────────────────────────────────
               § 2  THE REALITY — Closed Doors
               What it costs to learn this elsewhere.
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="cost" tier="standard">
            <div>

              <div className="text-center mb-8">
                <h2 className="font-bebas text-[40px] tracking-[0.08em] text-white">
                  THE REALITY
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {closedDoors.map((door) => (
                  <div
                    key={door.name}
                    className="relative border p-4 flex flex-col rounded-xl bg-bg-card border-bg-card-border min-h-[150px]"
                  >
                    <span className="font-mono text-[22px] font-bold text-gold mb-2">
                      {door.cost}
                    </span>
                    <p className="font-bebas text-[17px] tracking-[0.08em] uppercase leading-tight text-white mb-2">
                      {door.name}
                    </p>
                    <p className="text-[14px] leading-[1.5] text-ink-secondary mt-auto">
                      {door.lock}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </SectionFrame>


          {/* Gold structural divider */}
          <div className="flex justify-center py-8 md:py-12">
            <div className="w-16 h-px" style={{ background: "rgba(212,175,55,0.35)" }} />
          </div>


          {/* ──────────────────────────────────────────────────────────
               § 3  THE PROBLEM + THESIS
               Why this matters — the intellectual resolution.
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="evidence" tier="minimal">
            <div>

              <div className="text-center mb-8">
                <h2 className="font-bebas text-[40px] tracking-[0.08em] leading-[0.95] text-white">
                  MOST FILMS LOSE <span className="text-gold">MONEY.</span>
                </h2>
              </div>

              <div className="relative bg-bg-card border border-bg-card-border rounded-xl">
                {/* Gold left accent */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.55), rgba(212,175,55,0.25), transparent)' }} />
                <div className="p-8 md:p-10">

                  {/* — Problem narrative — */}
                  <p className="font-bebas text-[26px] md:text-[32px] tracking-[0.06em] leading-tight mb-6">
                    <span className="text-gold">YOUR FILM CAN MAKE MONEY</span><br />
                    <span className="text-white">AND YOU STILL LOSE.</span>
                  </p>

                  <div className="space-y-4 mb-6">
                    <p className="text-ink-secondary text-[17px] leading-relaxed">
                      Not because it didn{"\u2019"}t recoup.
                    </p>
                    <p className="text-ink-body text-[17px] leading-relaxed font-medium">
                      Because of how the deal was structured.
                    </p>
                  </div>

                  {/* Gold divider */}
                  <div className="h-[1px] w-12 bg-gold-accent mb-6" />

                  <p className="font-sans text-[19px] font-semibold tracking-[0.02em] text-ink-body mb-8">
                    Most filmmakers learn it too late.
                  </p>

                  {/* — Thesis: alternative asset class — */}
                  <div className="border-t border-bg-card-rule pt-6 space-y-4">
                    {[
                      { asset: "Real Estate", tool: "comps and cap rate models" },
                      { asset: "Private Equity", tool: "carry and IRR structures" },
                      { asset: "Venture Capital", tool: "term sheets and valuation frameworks" },
                    ].map((row) => (
                      <p key={row.asset} className="text-ink-secondary text-[17px] leading-relaxed">
                        <span className="text-ink-body font-semibold">{row.asset}</span> has {row.tool}.
                      </p>
                    ))}
                    {/* The punchline */}
                    <p className="font-bebas text-[26px] tracking-[0.06em] text-gold leading-tight mt-6">
                      Film had nothing.
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </SectionFrame>


          {/* ── INTERSTITIAL: Until Now — the pivot ── */}
          <section className="py-16 md:py-20 px-6">
            <div className="flex items-center justify-center gap-4 max-w-xs mx-auto">
              <div className="flex-1 h-px" style={{ background: "rgba(212,175,55,0.40)" }} />
              <span className="font-bebas text-[26px] tracking-[0.10em] text-white whitespace-nowrap">
                UNTIL NOW.
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(212,175,55,0.40)" }} />
            </div>
          </section>


          {/* Gold structural divider */}
          <div className="flex justify-center py-8 md:py-12">
            <div className="w-16 h-px" style={{ background: "rgba(212,175,55,0.35)" }} />
          </div>


          {/* ──────────────────────────────────────────────────────────
               § 4  FINAL CTA — The Close
             ────────────────────────────────────────────────────────── */}
          <section id="final-cta" className="py-24 md:py-32 px-6">
            <div className="max-w-md mx-auto">
              <div
                className="rounded-2xl px-8 py-16 md:py-20 text-center"
                style={{
                  border: '1px solid rgba(212,175,55,0.30)',
                  background: 'rgba(255,255,255,0.04)',
                  boxShadow: '0 0 60px rgba(212,175,55,0.06), 0 0 120px rgba(212,175,55,0.03), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <h2 className="font-bebas text-[40px] leading-[1.1] tracking-[0.08em] text-white mb-8">
                  YOUR INVESTORS WILL{"\u00A0"}ASK HOW THE MONEY FLOWS <span className="text-gold">BACK</span>.
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
