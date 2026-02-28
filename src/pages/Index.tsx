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
  // Net Profits countup — scroll-triggered independently
  const [countVal, setCountVal] = useState(0);
  const netProfitRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = netProfitRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          obs.disconnect();
          const target = 417500;
          const dur = 1200;
          const start = performance.now();
          const step = (now: number) => {
            const t = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out
            setCountVal(Math.round(eased * target));
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  // Corridor split countup — scroll-triggered independently
  const [producerVal, setProducerVal] = useState(0);
  const [investorVal, setInvestorVal] = useState(0);
  const corridorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = corridorRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          obs.disconnect();
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
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const handleStartClick = () => { haptics.medium(); gatedNavigate("/calculator?tab=budget"); };
  // Scroll-triggered reveals — value section + bridge
  const valueRef = useRef<HTMLDivElement>(null);
  const [valueVisible, setValueVisible] = useState(false);
  const bridgeRef = useRef<HTMLDivElement>(null);
  const [bridgeVisible, setBridgeVisible] = useState(false);
  useEffect(() => {
    const sections = [
      { el: valueRef.current, setter: setValueVisible },
      { el: bridgeRef.current, setter: setBridgeVisible },
    ];
    const observers: IntersectionObserver[] = [];
    sections.forEach(({ el, setter }) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setter(true);
            obs.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(obs => obs.disconnect());
  }, []);
  // Value section tile data
  const withItems = [
    { title: "Revenue Mapped", desc: "Revenue divided automatically across every stakeholder" },
    { title: "Investor-Ready PDF", desc: "Share a polished waterfall document with one click" },
    { title: "Full Clarity", desc: "See exactly who gets paid and when in the cascade" },
    { title: "Real Numbers", desc: "Know your margins before you shoot a single frame" },
  ];
  const withoutItems = [
    { title: "Guesswork Deals", desc: "Structured on hope, not data" },
    { title: "No Framework", desc: "No shared language for investor conversations" },
    { title: "Ambiguity", desc: "Money flow is unclear to everyone involved" },
    { title: "Trial & Error", desc: "Years of expensive lessons learned the hard way" },
  ];
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
        <main aria-label="Film Finance Simulator" className="flex-1 flex flex-col" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          {/* ──────────────────────────────────────────────────────────
               § 1  THE WATERFALL — named demo with context
               Show them the thing. Name it. Let the animation sell.
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
              {/* Headline — the hero */}
              <div className="text-center mb-8 px-2">
                <h1 className="font-bebas text-[clamp(3.2rem,11vw,4.8rem)] leading-[0.95] tracking-[0.02em] text-gold mb-3">
                  SEE WHERE EVERY DOLLAR <span className="text-white">GOES</span>
                </h1>
                <p className="text-ink-secondary text-[16px] leading-[1.7] tracking-[0.02em] font-medium">
                  Democratizing the business of film.
                </p>
              </div>
              {/* Waterfall card — the proof */}
              <div
                className="rounded-2xl px-2 pt-5 pb-5"
                style={{
                  border: '1px solid rgba(212,175,55,0.10)',
                  background: 'rgba(255,255,255,0.02)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 0 40px rgba(212,175,55,0.03)',
                }}
              >
              {/* Card header — names the visualization */}
              <div className="text-center mb-4 px-4">
                <p className="font-bebas text-[28px] tracking-[0.08em] uppercase text-gold mb-2">
                  THE WATERFALL
                </p>
                <p className="text-ink-secondary text-[16px] leading-[1.6] max-w-[300px] mx-auto">
                  Your recoupment schedule{"\u00A0"}{"\u2014"}{"\u00A0"}who gets paid, in what order, and what{"\u2019"}s left.
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
                <div ref={netProfitRef} className="mt-4 border border-gold-border bg-black px-6 py-6 text-center rounded-lg"
                  style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                  <p className="text-[12px] tracking-[0.2em] uppercase font-semibold text-gold mb-1">Net Profits</p>
                  <span className="font-mono text-[26px] font-bold text-white">
                    ${countVal.toLocaleString()}
                  </span>
                </div>
                {/* Two corridor boxes */}
                <div ref={corridorRef} className="grid grid-cols-2 gap-4 mt-4">
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
              </div>{/* /waterfall card */}
              {/* First CTA — earns the click after the demo */}
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
               § 2  WHAT YOU GET — value clarity
               Checks = what you walk away with. X marks = what
               you're stuck with now. Conversion language, not content.
             ────────────────────────────────────────────────────────── */}
          <section id="value" className="relative py-14 md:py-20 px-6">
            {/* Ambient warmth */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(212,175,55,0.04) 0%, transparent 100%)",
              }}
            />
            <div
              ref={valueRef}
              className="relative max-w-md mx-auto"
            >
              <div className="border border-gold-border bg-black overflow-hidden rounded-xl"
                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>

                {/* Checks — what you get */}
                <div className="px-5 pt-6 pb-5">
                  <p className="font-mono text-[14px] tracking-[0.12em] uppercase text-gold mb-5 px-1">
                    With your waterfall
                  </p>
                  <div className="flex flex-col gap-3">
                    {withItems.map((item, i) => (
                      <div
                        key={item.title}
                        className="flex items-start gap-4 rounded-lg px-4 py-4"
                        style={{
                          background: 'rgba(212,175,55,0.04)',
                          border: '1px solid rgba(212,175,55,0.08)',
                          opacity: valueVisible ? 1 : 0,
                          transform: valueVisible ? 'translateY(0)' : 'translateY(12px)',
                          transition: 'opacity 500ms ease-out, transform 500ms ease-out',
                          transitionDelay: `${i * 120}ms`,
                        }}
                      >
                        <div
                          className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center mt-0.5"
                          style={{
                            background: 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
                            boxShadow: '0 2px 8px rgba(212,175,55,0.25)',
                          }}
                        >
                          <span className="text-black text-[16px] font-bold leading-none">{"\u2713"}</span>
                        </div>
                        <div>
                          <p className="text-[15px] font-semibold text-white leading-snug">{item.title}</p>
                          <p className="text-[13px] text-ink-secondary leading-snug mt-1">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gold divider */}
                <div className="mx-6 h-[1px]" style={{
                  background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.30), transparent)',
                  opacity: valueVisible ? 1 : 0,
                  transition: 'opacity 500ms ease-out',
                  transitionDelay: `${withItems.length * 120}ms`,
                }} />

                {/* X marks — without it */}
                <div className="px-5 pt-6 pb-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <p
                    className="font-mono text-[14px] tracking-[0.12em] uppercase text-ink-secondary mb-5 px-1"
                    style={{
                      opacity: valueVisible ? 1 : 0,
                      transition: 'opacity 500ms ease-out',
                      transitionDelay: `${withItems.length * 120 + 80}ms`,
                    }}
                  >
                    Without it
                  </p>
                  <div className="flex flex-col gap-3">
                    {withoutItems.map((item, i) => (
                      <div
                        key={item.title}
                        className="flex items-start gap-4 rounded-lg px-4 py-4"
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.05)',
                          opacity: valueVisible ? 1 : 0,
                          transform: valueVisible ? 'translateY(0)' : 'translateY(12px)',
                          transition: 'opacity 500ms ease-out, transform 500ms ease-out',
                          transitionDelay: `${(withItems.length + i + 1) * 120}ms`,
                        }}
                      >
                        <div
                          className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center mt-0.5"
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          <span className="text-ink-secondary text-[14px] leading-none">{"\u2717"}</span>
                        </div>
                        <div>
                          <p className="text-[15px] font-semibold text-ink-secondary leading-snug">{item.title}</p>
                          <p className="text-[13px] text-ink-ghost leading-snug mt-1">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </section>
          {/* ──────────────────────────────────────────────────────────
               § 3  THE CLOSE — setup → payoff → action
             ────────────────────────────────────────────────────────── */}
          <section id="final-cta" className="py-14 md:py-20 px-6">
            <div className="max-w-md mx-auto">
              <div
                ref={bridgeRef}
                className="rounded-2xl px-8 py-10 md:py-14 text-center"
                style={{
                  border: '1px solid rgba(212,175,55,0.30)',
                  background: 'rgba(255,255,255,0.04)',
                  boxShadow: '0 0 60px rgba(212,175,55,0.06), 0 0 120px rgba(212,175,55,0.03), inset 0 1px 0 rgba(255,255,255,0.06)',
                  opacity: bridgeVisible ? 1 : 0,
                  transform: bridgeVisible ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'opacity 700ms ease-out, transform 700ms ease-out',
                }}
              >
                <h2 className="font-bebas text-[40px] leading-[1.1] tracking-[0.08em] text-gold mb-6">
                  YOUR INVESTORS WILL{"\u00A0"}ASK HOW THE MONEY FLOWS <span className="text-white">BACK.</span>
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
