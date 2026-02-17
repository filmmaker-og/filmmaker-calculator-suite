import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useHaptics } from "@/hooks/use-haptics";
import {
  RotateCcw,
  Check,
  X,
  Lock,
  Share2,
  Mail,
  Instagram,
  Link2,
  ChevronDown,
} from "lucide-react";
import filmmakerLogo from "@/assets/filmmaker-logo.jpg";
import Header from "@/components/Header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { formatCompactCurrency } from "@/lib/waterfall";
import { getShareUrl, SHARE_TEXT, SHARE_TITLE } from "@/lib/constants";
import SectionFrame from "@/components/SectionFrame";

const STORAGE_KEY = "filmmaker_og_inputs";
const CINEMATIC_SEEN_KEY = "filmmaker_og_intro_seen";

/* ═══════════════════════════════════════════════════════════════════
   CLOSED DOORS — the reality of what's available
   ═══════════════════════════════════════════════════════════════════ */
const closedDoors = [
  { name: "Entertainment Attorney", lock: "If they\u2019ll take the meeting.", cost: "$500/hr" },
  { name: "Producing Consultant", lock: "Costs more than your development budget.", cost: "$5K+" },
  { name: "Film School", lock: "Four years you don\u2019t have.", cost: "$200K" },
  { name: "Trial & Error", lock: "Your investors don\u2019t get a second chance.", cost: "Everything" },
];

/* ═══════════════════════════════════════════════════════════════════
   THE PROBLEM — column panels showing why indie films lose money
   ═══════════════════════════════════════════════════════════════════ */
const realities = [
  {
    label: "The Recoupment Gap",
    body: "They budget the production. They don\u2019t budget the recoupment. CAM fees, sales commissions, debt service, corridor splits, recoupment premiums\u00A0\u2014 the friction between gross receipts and net profits isn\u2019t in the plan.",
    punchline: "Every number in the investor deck is modeled against the wrong baseline.",
    loud: false,
  },
  {
    label: "Net Profit Erosion",
    body: "\u201CNet profits\u201D in a distribution agreement isn\u2019t net. It\u2019s gross minus distribution fees, P&A recoupment, delivery costs, market reserves, and overhead charges. By the time standard contractual deductions clear,",
    punchline: "The margin you projected at green light doesn\u2019t exist.",
    loud: false,
  },
  {
    label: "Structural Asymmetry",
    body: "Distributors, sales agents, and financiers run waterfall models before every term sheet. They stress-test the capital stack, the recoupment order, and the corridor structure before they sit down. The producer across the table brought a budget topsheet.",
    punchline: "That asymmetry isn\u2019t accidental. It\u2019s on purpose.",
    loud: true,
  },
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
  { name: "Net Profits",       amount: "$417,500",       pct: 13.9,  barColor: "#00C853",               isFinal: true  },
];

/* ═══════════════════════════════════════════════════════════════════
   PRODUCT LADDER — gold bar tiers
   ═══════════════════════════════════════════════════════════════════ */
const productTiers = [
  {
    tier: "Courtesy", product: "Waterfall Simulator", price: "Free",
    desc: "Model your deal. See where every dollar goes.",
    pct: 30, barClass: "bg-[#D4AF37]/30", tierColor: "text-gold/50",
    nameColor: "text-white/90", descColor: "text-white/50", barH: "h-2",
    featured: false,
  },
  {
    tier: "Premium", product: "The Blueprint", price: "$197",
    desc: "The full financial picture. Every number, every tier, every scenario.",
    pct: 65, barClass: "bg-[#D4AF37]/50", tierColor: "text-gold/60",
    nameColor: "text-white/90", descColor: "text-white/50", barH: "h-2",
    featured: false,
  },
  {
    tier: "Investment Grade", product: "The Pitch Package", price: "$497",
    desc: "What the other side of the table expects to see.",
    pct: 100, barClass: "bg-[#D4AF37]/70", tierColor: "text-gold",
    nameColor: "text-white", descColor: "text-white/60", barH: "h-3",
    featured: true,
  },
];

/* ═══════════════════════════════════════════════════════════════════
   FAQ DATA
   ═══════════════════════════════════════════════════════════════════ */
const faqs = [
  {
    q: "What assumptions does the waterfall use?",
    a: "The simulator models the standard independent film recoupment hierarchy used in real production financing\u00A0\u2014 CAM fees, sales agent commission, senior and mezzanine debt service, equity recoupment with preferred return, and backend profit splits. Benchmarks reflect current market terms for films in the $1M\u2013$10M budget range. Every deal is different. This gives you the structure\u00A0\u2014 your attorney finalizes the numbers.",
  },
  {
    q: "What are the premium exports?",
    a: "The simulator, waterfall chart, deal glossary, and unlimited scenarios are completely free\u00A0\u2014 no account required. When you\u2019re ready to take it into a real meeting, premium exports include a 6-sheet Excel workbook and an investor-ready PDF. These are the documents your investor\u2019s accountant and attorney will actually review.",
  },
  {
    q: "Who built this?",
    a: "A producer who spent years learning through expensive mistakes what should have been accessible from day one. Tribeca-winning, CAA-repped, debut sold to Netflix. This tool exists because the waterfall shouldn\u2019t be something you discover for the first time when someone else\u2019s lawyer slides it across the table.",
  },
  {
    q: "Why is this free?",
    a: "Film as an alternative asset class\u00A0\u2014 same category as real estate, private equity, and venture capital. Every other alt asset gives investors standardized tools to model returns. Film doesn\u2019t. That\u2019s why the industry has a reputation as a bad investment. It\u2019s not. It\u2019s a misunderstood one. This tool is the starting point.",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   SCROLL-TRIGGERED REVEAL HOOK
   ═══════════════════════════════════════════════════════════════════ */
const useReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

/* ═══════════════════════════════════════════════════════════════════
   SECTION HEADER (inline — consistent everywhere)
   ═══════════════════════════════════════════════════════════════════ */
const SHeader = ({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) => (
  <div className="text-center mb-10">
    <div className="flex items-center justify-center gap-4 mb-4">
      <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-gold/40" />
      <p className="text-gold/70 text-xs tracking-[0.3em] uppercase font-semibold">{eyebrow}</p>
      <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-gold/40" />
    </div>
    <h2 className="font-bebas text-3xl md:text-4xl tracking-[0.08em] text-gold">{children}</h2>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   DIVIDER
   ═══════════════════════════════════════════════════════════════════ */
const Divider = () => (
  <div className="py-4 px-6">
    <div className="max-w-md mx-auto">
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const haptics = useHaptics();
  const [linkCopied, setLinkCopied] = useState(false);

  // Reveals
  const revMission  = useReveal();
  const revEvidence = useReveal();
  const revWater    = useReveal();
  const revCost     = useReveal();
  const revPath     = useReveal();
  const revDecl     = useReveal();
  const revFaq      = useReveal();
  const revFinal    = useReveal();

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

  const ladderRef = useRef<HTMLDivElement>(null);

  // Closed doors — lock animation (doors dim after appearing)
  const [doorsLocked, setDoorsLocked] = useState(false);
  useEffect(() => {
    if (revCost.visible) {
      const timer = setTimeout(() => setDoorsLocked(true), 800);
      return () => clearTimeout(timer);
    }
  }, [revCost.visible]);

  // Net Profits countup
  const [countVal, setCountVal] = useState(0);
  useEffect(() => {
    if (!barsRevealed) return;
    const delay = setTimeout(() => {
      const target = 417500;
      const dur = 800;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / dur, 1);
        setCountVal(Math.round(t * target));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 1800);
    return () => clearTimeout(delay);
  }, [barsRevealed]);

  // Returning user
  const savedState = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed?.inputs?.budget > 0) return { budget: parsed.inputs.budget as number };
    } catch { /* ignore */ }
    return null;
  }, []);
  const isReturningUser = savedState !== null;

  // Cinematic intro
  const hasSeenCinematic = useMemo(() => {
    try { return localStorage.getItem(CINEMATIC_SEEN_KEY) === "true"; } catch { return false; }
  }, []);
  const shouldSkip = searchParams.get("skipIntro") === "true" || hasSeenCinematic;
  const [phase, setPhase] = useState<'dark'|'beam'|'logo'|'pulse'|'tagline'|'complete'>(shouldSkip ? 'complete' : 'dark');

  useEffect(() => {
    if (shouldSkip) return;
    const timers = [
      setTimeout(() => setPhase('beam'), 300),
      setTimeout(() => setPhase('logo'), 800),
      setTimeout(() => setPhase('pulse'), 1300),
      setTimeout(() => setPhase('tagline'), 1800),
      setTimeout(() => setPhase('complete'), 2600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [shouldSkip]);

  useEffect(() => {
    if (phase === 'complete' && !hasSeenCinematic) {
      try { localStorage.setItem(CINEMATIC_SEEN_KEY, "true"); } catch {}
    }
  }, [phase, hasSeenCinematic]);

  const handleStartClick    = () => { haptics.medium(); navigate("/calculator?tab=budget"); };
  const handleContinueClick = () => { haptics.medium(); navigate("/calculator"); };
  const handleStartFresh    = () => { haptics.light(); navigate("/calculator?tab=budget&reset=true"); };

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(`${SHARE_TEXT}\n\n${getShareUrl()}`).then(() => {
      setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000);
    }).catch(() => {});
  }, []);

  const handleShare = useCallback(async () => {
    if (navigator.share) { try { await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: getShareUrl() }); return; } catch {} }
    handleCopyLink();
  }, [handleCopyLink]);

  const isComplete = phase === 'complete';
  const showBeam = phase !== 'dark' && !shouldSkip;
  const showLogo = (phase !== 'dark' && phase !== 'beam') || shouldSkip;
  const isPulsed = ['pulse','tagline','complete'].includes(phase) || shouldSkip;
  const showTagline = ['tagline','complete'].includes(phase) || shouldSkip;

  return (
    <>
      {isComplete && <Header />}

      <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">

        {/* ═══════ CINEMATIC INTRO ═══════ */}
        {!shouldSkip && (
          <div className={cn("fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-1000", isComplete ? "opacity-0 pointer-events-none" : "opacity-100")} style={{ backgroundColor: '#000' }}>
            <div className={cn("absolute inset-0 pointer-events-none transition-all duration-1000", showBeam ? "opacity-100" : "opacity-0")}
              style={{ background: `radial-gradient(ellipse 70% 60% at 50% 0%, rgba(212,175,55,0.08) 0%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.01) 60%, transparent 80%)`, clipPath: showBeam ? 'polygon(25% 0%,75% 0%,95% 100%,5% 100%)' : 'polygon(48% 0%,52% 0%,52% 30%,48% 30%)', transition: 'clip-path 1.2s cubic-bezier(0.22,1,0.36,1), opacity 0.8s ease' }} />
            <div className={cn("absolute inset-0 pointer-events-none transition-all duration-1000", showBeam ? "opacity-100" : "opacity-0")}
              style={{ background: `radial-gradient(ellipse 30% 45% at 50% 0%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.15) 30%, rgba(212,175,55,0.05) 50%, transparent 70%)`, clipPath: showBeam ? 'polygon(38% 0%,62% 0%,78% 100%,22% 100%)' : 'polygon(48% 0%,52% 0%,52% 30%,48% 30%)', transition: 'clip-path 1s cubic-bezier(0.22,1,0.36,1) 0.1s, opacity 0.8s ease' }} />
            <div className={cn("absolute left-1/2 top-1/2 w-[400px] h-[400px] pointer-events-none transition-all duration-700", showLogo ? "opacity-100" : "opacity-0")}
              style={{ background: `radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(255,255,255,0.08) 30%, transparent 70%)`, transform: 'translate(-50%,-50%)', filter: 'blur(40px)', animation: isPulsed ? 'focal-pulse 3s ease-in-out infinite' : 'none' }} />
            <div className="relative z-10 flex flex-col items-center">
              <div className={cn("relative transition-all duration-1000 ease-out", showLogo ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-6")}>
                <div className={cn("absolute inset-0 -m-4 transition-opacity duration-700", isPulsed ? "opacity-100" : "opacity-0")}
                  style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)', filter: 'blur(15px)' }} />
                <img src={filmmakerLogo} alt="Filmmaker.OG" className="w-32 h-32 object-contain relative"
                  style={{ filter: isPulsed ? 'brightness(1.2) drop-shadow(0 0 30px rgba(212,175,55,0.5))' : 'brightness(0.9)', transition: 'filter 0.7s ease' }} />
              </div>
              <p className={cn("mt-8 text-sm tracking-[0.4em] uppercase font-semibold transition-all duration-700", showTagline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3")}
                style={{ color: '#D4AF37', textShadow: '0 0 20px rgba(212,175,55,0.4)' }}>Know Your Numbers</p>
              <div className="mt-6 w-32 h-[2px] overflow-hidden bg-white/10">
                <div className={cn("h-full bg-gold", showTagline ? "animate-progress-draw" : "")}
                  style={{ boxShadow: '0 0 15px rgba(212,175,55,0.7)', width: showTagline ? undefined : '0%' }} />
              </div>
            </div>
          </div>
        )}

        {/* ═══════ LANDING PAGE ═══════ */}
        <main aria-label="Film Finance Simulator" className={cn("flex-1 flex flex-col transition-all duration-700", isComplete ? "opacity-100" : "opacity-0")}>

          {/* ──────────────────────────────────────────────────────────
               § 1  HERO
             ────────────────────────────────────────────────────────── */}
          <section id="hero" className="snap-section min-h-0 pt-20 pb-12 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none animate-spotlight-pulse"
              style={{ width: '100vw', height: '120%', background: `radial-gradient(ellipse 50% 50% at 50% 15%, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.04) 45%, transparent 75%)` }} />
            <div className="relative px-6 py-4 max-w-xl mx-auto text-center">
              <div className="mb-5 relative inline-block">
                <div className="absolute inset-0 -m-7 animate-logo-breathe" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)', filter: 'blur(18px)' }} />
                <img src={filmmakerLogo} alt="Filmmaker.OG" className="relative w-[96px] h-[96px] object-contain"
                  style={{ filter: 'brightness(1.15) drop-shadow(0 0 28px rgba(212,175,55,0.45))' }} />
              </div>
              <h1 className="font-bebas text-[clamp(2.8rem,9vw,4.2rem)] leading-[1.05] text-gold mb-3">
                SEE WHERE EVERY<br /><span className="text-white">DOLLAR GOES</span>
              </h1>
              <p className="text-white/90 text-[15px] tracking-[0.12em] uppercase font-medium mb-1">
                Built by a Tribeca-winning, CAA-repped producer
              </p>
              <p className="text-white/50 text-[13px] tracking-[0.18em] uppercase mb-6">
                whose debut sold to <span className="text-gold font-semibold">Netflix</span>.
              </p>

              {isReturningUser ? (
                <div className="w-full max-w-[320px] mx-auto space-y-3">
                  <button onClick={handleContinueClick} className="w-full h-[60px] text-base btn-cta-primary">
                    CONTINUE YOUR DEAL
                  </button>
                  <p className="text-white/40 text-xs tracking-wider text-center">{formatCompactCurrency(savedState!.budget)} budget in progress</p>
                  <button onClick={handleStartFresh}
                    className="w-full flex items-center justify-center gap-1.5 text-xs tracking-wider text-white/40 hover:text-white/60 transition-colors py-2">
                    <RotateCcw className="w-3 h-3" /> Start a new deal
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-[320px] mx-auto space-y-3">
                  <button onClick={handleStartClick} className="w-full h-[60px] text-base btn-cta-primary">
                    BUILD YOUR WATERFALL &mdash; FREE
                  </button>
                </div>
              )}

              <div className="mt-8 flex justify-center animate-bounce-subtle cursor-pointer active:scale-[0.97]"
                onClick={() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })}>
                <ChevronDown className="w-6 h-6 text-gold" />
              </div>
            </div>
          </section>

          <Divider />

          {/* ──────────────────────────────────────────────────────────
               § 2  MISSION — stacked thesis + Blum quote
             ────────────────────────────────────────────────────────── */}
          <section id="mission" className="snap-section py-16 px-6">
            <div ref={revMission.ref} className={cn("transition-all duration-700 ease-out", revMission.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
              <SHeader eyebrow="The Thesis">
                FILM AS AN ALTERNATIVE{"\u00A0"}<span className="text-gold">ASSET</span>{"\u00A0"}<span className="text-white">CLASS</span>
              </SHeader>

              {/* Stacked manifesto */}
              <div className="max-w-md mx-auto">
                <div className="relative bg-white/[0.04] border border-white/[0.10] overflow-hidden">
                  {/* Gold left accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.80), rgba(212,175,55,0.40), transparent)' }} />
                  <div className="p-7 md:p-9 pl-8 md:pl-10 space-y-5">
                    {[
                      { asset: "Real Estate", tool: "comps and cap rate models" },
                      { asset: "Private Equity", tool: "carry and IRR structures" },
                      { asset: "Venture Capital", tool: "term sheet standards" },
                    ].map((row, i) => (
                      <div
                        key={row.asset}
                        className={cn(
                          "flex items-baseline gap-3 transition-all duration-500 ease-out",
                          revMission.visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                        )}
                        style={{ transitionDelay: revMission.visible ? `${400 + i * 150}ms` : '0ms' }}
                      >
                        <Check className="w-3.5 h-3.5 text-gold/50 flex-shrink-0 relative top-[2px]" />
                        <p className="text-white/60 text-[15px] leading-relaxed">
                          <span className="text-white/80 font-semibold">{row.asset}</span> has {row.tool}.
                        </p>
                      </div>
                    ))}
                    {/* The punchline — contained with background for visual weight */}
                    <div
                      className={cn(
                        "mt-1 -mx-1 p-4 bg-gold/[0.08] border border-gold/20 flex items-center gap-3 transition-all duration-500 ease-out",
                        revMission.visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                      )}
                      style={{ transitionDelay: revMission.visible ? '850ms' : '0ms' }}
                    >
                      <X className="w-4 h-4 text-white/40 flex-shrink-0" />
                      <p className="font-bebas text-[22px] md:text-[26px] tracking-[0.06em] text-gold leading-tight">
                        Film has nothing.
                      </p>
                    </div>
                  </div>
                </div>

                <p
                  className={cn(
                    "text-center font-bebas text-[36px] md:text-[44px] tracking-[0.06em] text-gold mt-10 transition-all duration-700 ease-out",
                    revMission.visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                  )}
                  style={{
                    transitionDelay: revMission.visible ? '1100ms' : '0ms',
                    textShadow: revMission.visible ? '0 0 30px rgba(212,175,55,0.4), 0 0 60px rgba(212,175,55,0.15)' : 'none',
                  }}
                >
                  Until now.
                </p>
              </div>

              {/* Blum quote */}
              <div className="mt-10 max-w-md mx-auto">
                <div className="relative bg-white/[0.04] border border-white/[0.10] overflow-hidden">
                  {/* Gold left accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.60), rgba(212,175,55,0.30), transparent)' }} />
                  <div className="p-7 md:p-9 pl-8 md:pl-11">
                    {/* Opening quote mark */}
                    <div className="font-bebas text-[56px] md:text-[68px] leading-none select-none pointer-events-none text-gold/25 -mb-5 -ml-1"
                      aria-hidden="true">{"\u201C"}</div>
                    <blockquote className="relative z-10">
                      <p className="text-[15px] md:text-base leading-[1.8] text-white/80 italic">
                        Filmmakers have a perception in the business world of being kind of flaky dudes{"\u2026"} you need to be buttoned down{"\u2026"} speak the language that they speak.
                      </p>
                    </blockquote>
                    <div className="mt-6 pt-5 border-t border-white/[0.08]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-[1px] bg-gold/50" />
                        <cite className="not-italic">
                          <span className="font-bebas text-[16px] tracking-[0.14em] uppercase text-gold">Jason Blum</span>
                        </cite>
                      </div>
                      <p className="text-white/50 text-sm tracking-[0.08em] mt-2 ml-11">Blumhouse Productions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Divider />

          {/* ──────────────────────────────────────────────────────────
               § 3  THE PROBLEM — three reality panels
             ────────────────────────────────────────────────────────── */}
          <section id="evidence" className="snap-section py-16 px-6" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.01) 100%)' }}>
            <div ref={revEvidence.ref} className={cn("transition-all duration-700 ease-out", revEvidence.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
              <SHeader eyebrow="The Problem">
                MOST INDIE FILMS <span className="text-gold">LOSE</span> <span className="text-white">MONEY.</span>
              </SHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {realities.map((r, i) => (
                  <div
                    key={r.label}
                    className={cn(
                      "relative p-6 md:p-7 bg-white/[0.04] border border-white/[0.10] overflow-hidden transition-all duration-600 ease-out group",
                      revEvidence.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                    style={{ transitionDelay: revEvidence.visible ? `${i * 180}ms` : '0ms' }}
                  >
                    {/* Gold left accent bar — matched to toolkit cards */}
                    <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                      style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.55), rgba(212,175,55,0.25), transparent)' }} />
                    <div className="relative z-10 pl-2">
                      <div className="flex items-baseline gap-3 mb-3">
                        <span className="font-mono text-2xl text-gold/35 font-semibold leading-none">{String(i + 1).padStart(2, '0')}</span>
                        <h3 className="font-bebas text-[17px] tracking-[0.12em] uppercase text-gold">
                          {r.label}
                        </h3>
                      </div>
                      <p className="text-white/60 text-sm leading-relaxed">{r.body}</p>
                      <div className="h-[1px] bg-gradient-to-r from-gold/30 to-transparent mt-4 mb-3" />
                      <p
                        className={cn(
                          "text-sm font-semibold text-white/70 italic transition-opacity duration-[0ms]",
                          revEvidence.visible ? "opacity-100" : "opacity-0"
                        )}
                        style={{
                          transitionTimingFunction: 'step-end',
                          transitionDelay: revEvidence.visible ? `${600 + i * 180}ms` : '0ms',
                        }}
                      >
                        {"\u201C"}{r.punchline}{"\u201D"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Post-problem declaration */}
              <p
                className={cn(
                  "text-center font-bebas text-[24px] md:text-[30px] tracking-[0.08em] text-gold/80 mt-10 transition-all duration-500 ease-out",
                  revEvidence.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                )}
                style={{ transitionDelay: revEvidence.visible ? '800ms' : '0ms' }}
              >
                We leveled the playing{"\u00A0"}<span className="text-white">field</span>.
              </p>
            </div>
          </section>

          <Divider />

          {/* ──────────────────────────────────────────────────────────
               § 4  THE WATERFALL — proportional bars
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="waterfall">
            <div ref={revWater.ref} className={cn("transition-all duration-700 ease-out", revWater.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
              <SHeader eyebrow="The Waterfall">
                HOW THE MONEY <span className="text-white">FLOWS</span>
              </SHeader>

              <p className="text-white/50 text-sm text-center mb-1">A $3M SVOD acquisition.</p>
              <p className="text-white/70 text-sm font-medium text-center mb-6">Here&rsquo;s what actually reaches the filmmaker.</p>

              <div ref={waterBarRef} className="border border-white/[0.06] bg-black max-w-md mx-auto overflow-hidden">
                {waterfallTiers.map((tier, i) => (
                  <div
                    key={tier.name}
                    className={cn(
                      "px-5 py-4",
                      i > 0 && "border-t border-white/[0.06]",
                      tier.isFinal && "py-5"
                    )}
                    style={tier.isFinal ? { background: 'rgba(0,200,83,0.04)' } : undefined}
                  >
                    {/* Labels */}
                    <div className="flex justify-between items-baseline mb-2">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-[11px] text-white/30 tabular-nums">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className={cn(
                          "font-bebas tracking-[0.08em] uppercase",
                          tier.isFinal ? "text-[23px] text-[#00C853]" :
                          i === 0 ? "text-[20px] text-white" : "text-[17px] text-white/80"
                        )}>
                          {tier.name}
                        </span>
                      </div>
                      <span className={cn(
                        "font-mono font-semibold",
                        tier.isFinal ? "text-[24px] font-bold text-[#00C853]" :
                        i === 0 ? "text-[17px] text-white/90" : "text-[17px] text-white/70"
                      )}>
                        {tier.isFinal ? `$${countVal.toLocaleString()}` : tier.amount}
                      </span>
                    </div>
                    {/* Proportional bar */}
                    <div className={cn("w-full bg-white/[0.06] relative overflow-hidden", tier.isFinal ? "h-3" : i === 0 ? "h-3" : "h-2")}>
                      <div
                        className="absolute left-0 top-0 h-full"
                        style={{
                          width: barsRevealed ? `${tier.pct}%` : '0%',
                          background: tier.barColor,
                          boxShadow: tier.isFinal ? '0 0 10px rgba(0,200,83,0.35)' : i === 0 ? '0 0 8px rgba(212,175,55,0.15)' : 'none',
                          transition: `width 500ms cubic-bezier(0.16,1,0.3,1)`,
                          transitionDelay: `${tier.isFinal ? 1200 : i * 150}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* Mid-waterfall CTA — capture intent at emotional peak */}
                <div className="border-t border-white/[0.06] px-5 py-6 text-center">
                  <p className="text-white/50 text-[13px] tracking-wide mb-4">
                    A simplified waterfall.
                  </p>
                  <button onClick={handleStartClick}
                    className="w-full max-w-[280px] h-12 text-sm btn-cta-primary mx-auto">
                    WHAT DOES YOUR DEAL LOOK LIKE?
                  </button>
                  <button onClick={handleShare}
                    className="mt-4 inline-flex items-center gap-2 text-xs tracking-wider text-white/30 hover:text-gold/60 transition-colors">
                    <Share2 className="w-3.5 h-3.5" /> Send this to your producing partner
                  </button>
                </div>
              </div>
            </div>
          </SectionFrame>

          <Divider />

          {/* ──────────────────────────────────────────────────────────
               § 5  CLOSED DOORS — the reality of what exists
             ────────────────────────────────────────────────────────── */}
          <section id="cost" className="snap-section py-16 px-6" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.01) 100%)' }}>
            <div ref={revCost.ref} className={cn("transition-all duration-700 ease-out", revCost.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
              <SHeader eyebrow="The Reality">
                THE DOORS ARE <span className="text-white">CLOSED.</span>
              </SHeader>

              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                {closedDoors.map((door, i) => (
                  <div
                    key={door.name}
                    className={cn(
                      "relative border p-6 transition-all duration-700 ease-out overflow-hidden",
                      doorsLocked
                        ? "bg-white/[0.02] border-white/[0.06]"
                        : "bg-white/[0.06] border-white/[0.12]",
                      revCost.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                    style={{
                      transitionDelay: revCost.visible ? `${i * 150}ms` : '0ms',
                    }}
                  >
                    {/* Gold left elbow — dims with lock */}
                    <div className={cn(
                      "absolute left-0 top-0 bottom-0 w-[3px] transition-opacity duration-700",
                      doorsLocked ? "opacity-15" : "opacity-100"
                    )}
                      style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.70), rgba(212,175,55,0.35), transparent)' }}
                    />
                    <div className="pl-2">
                      <div className="flex items-start justify-between mb-2">
                        <p
                          className={cn(
                            "font-bebas text-[18px] md:text-[20px] tracking-[0.10em] uppercase leading-tight transition-all duration-700",
                            doorsLocked ? "text-white/20" : "text-white"
                          )}
                          style={{ transitionDelay: doorsLocked ? `${i * 200}ms` : '0ms' }}
                        >
                          {door.name}
                        </p>
                        <Lock
                          className={cn(
                            "w-4 h-4 flex-shrink-0 ml-2 mt-0.5 transition-all duration-700",
                            doorsLocked ? "text-white/30 opacity-100" : "text-white/0 opacity-0"
                          )}
                          style={{ transitionDelay: doorsLocked ? `${i * 200}ms` : '0ms' }}
                        />
                      </div>
                      <span
                        className={cn(
                          "inline-block font-mono text-[15px] font-bold mb-3 transition-all duration-700",
                          doorsLocked ? "text-white/15" : "text-gold"
                        )}
                        style={{ transitionDelay: doorsLocked ? `${i * 200 + 50}ms` : '0ms' }}
                      >
                        {door.cost}
                      </span>
                      <p
                        className={cn(
                          "text-sm leading-relaxed transition-all duration-700",
                          doorsLocked ? "text-white/30 opacity-100" : "text-white/50 opacity-100"
                        )}
                        style={{ transitionDelay: doorsLocked ? `${i * 200 + 100}ms` : '0ms' }}
                      >
                        {door.lock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
               DECLARATION — the hinge between closed doors and the path
             ────────────────────────────────────────────────────────── */}
          <section className="py-16 px-6 relative">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(212,175,55,0.07) 0%, transparent 70%)' }} />
            <div ref={revDecl.ref} className={cn("max-w-md mx-auto relative transition-all duration-700 ease-out", revDecl.visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.96]")}>
              <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
              <div className="py-12 px-4 text-center">
                <h3 className="font-bebas text-[30px] md:text-[40px] tracking-[0.08em] uppercase text-gold leading-tight">
                  We Built The Toolkit They Didn{"\u2019"}t Teach You In Film{"\u00A0"}<span className="text-white">School</span>.
                </h3>
                <p className="text-white/40 text-sm tracking-[0.12em] uppercase mt-4">Three tiers. Zero gatekeeping.</p>
              </div>
              <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
              <div className="flex justify-center mt-6">
                <ChevronDown className="w-5 h-5 text-gold/50 animate-bounce-subtle" />
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
               § 6  THE PATH — gold bar product ladder + CTA
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="path">
            <div ref={revPath.ref} className={cn("transition-all duration-700 ease-out", revPath.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
              <SHeader eyebrow="The Toolkit">
                THREE TIERS. <span className="text-white">ONE STANDARD.</span>
              </SHeader>

              <p className="text-center text-white/50 text-sm mb-8 max-w-sm mx-auto">
                Whether you&rsquo;re modeling your first deal or walking into a meeting with real&nbsp;capital, there&rsquo;s a tier built for&nbsp;you.
              </p>

              {/* Product cards */}
              <div ref={ladderRef} className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                {productTiers.map((t, i) => (
                  <div
                    key={t.tier}
                    className={cn(
                      "relative border overflow-hidden p-6 transition-all duration-600 ease-out",
                      t.featured
                        ? "border-gold/40 bg-gold/[0.06]"
                        : "border-white/[0.10] bg-white/[0.04]",
                      revPath.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                    )}
                    style={{
                      transitionDelay: revPath.visible ? `${i * 150}ms` : '0ms',
                      ...(t.featured ? { boxShadow: '0 0 30px rgba(212,175,55,0.08), inset 0 1px 0 rgba(212,175,55,0.15)' } : {}),
                    }}
                  >
                    {/* Gold left accent — all cards get one, featured is stronger */}
                    <div className={cn(
                      "absolute left-0 top-0 bottom-0 w-[3px]",
                    )}
                      style={{
                        background: t.featured
                          ? 'linear-gradient(to bottom, rgba(212,175,55,0.80), rgba(212,175,55,0.40), transparent)'
                          : 'linear-gradient(to bottom, rgba(212,175,55,0.35), rgba(212,175,55,0.15), transparent)',
                      }}
                    />
                    {t.featured && (
                      <div className="mb-3">
                        <span className="text-sm tracking-[0.16em] uppercase font-bold text-gold bg-gold/[0.15] px-3 py-1.5 border border-gold/50">
                          Recommended
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline justify-between mb-1 pl-1">
                      <span className={cn("font-bebas text-[13px] tracking-[0.15em] uppercase", t.tierColor)}>
                        {t.tier}
                      </span>
                      <span className={cn(
                        "font-mono text-[15px] font-semibold",
                        t.featured ? "text-gold" : "text-white/50"
                      )}>
                        {t.price}
                      </span>
                    </div>
                    <h4 className={cn("font-bebas text-[22px] tracking-[0.08em] uppercase mb-2 pl-1", t.nameColor)}>
                      {t.product}
                    </h4>
                    <p className={cn("text-sm leading-relaxed mb-4 pl-1", t.descColor)}>{t.desc}</p>
                    <a
                      href={i === 0 ? "/calculator?tab=budget" : "/store"}
                      className={cn(
                        "inline-flex items-center text-sm tracking-wider transition-colors pl-1",
                        t.featured ? "text-gold hover:text-gold/80" : "text-white/50 hover:text-white/70"
                      )}
                    >
                      {i === 0 ? "Get Started" : "View Package"} <span className="ml-1.5">&rarr;</span>
                    </a>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center mt-10">
                <button onClick={handleStartClick}
                  className="w-full max-w-[320px] h-[60px] text-base btn-cta-primary mx-auto">
                  MODEL YOUR FIRST DEAL
                </button>
                <div className="mt-5 flex items-center justify-center gap-4">
                  <a href="/store" className="text-white/40 text-sm hover:text-gold transition-colors">
                    Compare packages <span className="text-gold/70">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          </SectionFrame>

          <Divider />

          {/* ──────────────────────────────────────────────────────────
               § 7  FAQ
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="faq">
            <div ref={revFaq.ref} className={cn("max-w-2xl mx-auto transition-all duration-700 ease-out", revFaq.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
              <SHeader eyebrow="Common Questions">
                WHAT FILMMAKERS <span className="text-white">ASK</span>
              </SHeader>

              <div className="bg-black px-5 border border-white/[0.06]">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={faq.q} value={`faq-${i}`}>
                      <AccordionTrigger className="font-bebas text-xl tracking-[0.06em] uppercase text-gold hover:text-gold/70 hover:no-underline text-left">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-white/60 text-sm leading-relaxed normal-case font-sans">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </SectionFrame>

          <Divider />

          {/* ──────────────────────────────────────────────────────────
               § 8  FINAL CTA
             ────────────────────────────────────────────────────────── */}
          <section id="final-cta" className="snap-section py-10 px-4">
            <div ref={revFinal.ref} className={cn("relative overflow-hidden transition-all duration-700 ease-out", revFinal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
              {/* Gold corner accents — cinematic frame, no full border */}
              <div className="absolute top-0 left-0 w-12 h-[2px] bg-gold/80" />
              <div className="absolute top-0 left-0 w-[2px] h-12 bg-gold/80" />
              <div className="absolute top-0 right-0 w-12 h-[2px] bg-gold/80" />
              <div className="absolute top-0 right-0 w-[2px] h-12 bg-gold/80" />
              <div className="absolute bottom-0 left-0 w-12 h-[2px] bg-gold/80" />
              <div className="absolute bottom-0 left-0 w-[2px] h-12 bg-gold/80" />
              <div className="absolute bottom-0 right-0 w-12 h-[2px] bg-gold/80" />
              <div className="absolute bottom-0 right-0 w-[2px] h-12 bg-gold/80" />

              {/* Ambient glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                style={{ width: '100%', height: '100%', background: `radial-gradient(ellipse 60% 50% at 50% 20%, rgba(212,175,55,0.08) 0%, transparent 70%)` }} />

              <div className="relative p-10 md:p-16 max-w-md mx-auto text-center">
                <p className="text-gold/70 text-xs tracking-[0.3em] uppercase font-semibold mb-5">The Moment of Truth</p>
                <h2 className="font-bebas text-[28px] md:text-[38px] leading-[1.1] tracking-[0.06em] text-gold mb-5">
                  YOUR INVESTOR WILL ASK<br />HOW THE MONEY FLOWS <span className="text-white">BACK</span>.
                </h2>
                <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto mb-8">
                  That meeting shouldn&rsquo;t be the first time you see your own&nbsp;waterfall.
                </p>
                <button onClick={handleStartClick}
                  className="w-full max-w-[320px] h-16 text-base btn-cta-final mx-auto">
                  BUILD YOUR WATERFALL &mdash; FREE
                </button>
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="py-10 px-6">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-8" />
            <div className="max-w-sm mx-auto">
              <div className="grid grid-cols-2 gap-3 mb-8 max-w-[340px] mx-auto">
                <a href="mailto:thefilmmaker.og@gmail.com"
                  className="flex items-center justify-center gap-2.5 text-sm tracking-wider text-gold/80 hover:text-gold bg-white/[0.04] hover:bg-white/[0.07] transition-all active:scale-[0.97] py-5 border border-white/[0.12] hover:border-gold/40">
                  <Mail className="w-4 h-4" /><span>Email</span>
                </a>
                <a href="https://www.instagram.com/filmmaker.og" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 text-sm tracking-wider text-gold/80 hover:text-gold bg-white/[0.04] hover:bg-white/[0.07] transition-all active:scale-[0.97] py-5 border border-white/[0.12] hover:border-gold/40">
                  <Instagram className="w-4 h-4" /><span>Instagram</span>
                </a>
                <button onClick={handleShare}
                  className="flex items-center justify-center gap-2.5 text-sm tracking-wider text-gold/80 hover:text-gold bg-white/[0.04] hover:bg-white/[0.07] transition-all active:scale-[0.97] py-5 border border-white/[0.12] hover:border-gold/40">
                  <Share2 className="w-4 h-4" /><span>Share</span>
                </button>
                <button onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2.5 text-sm tracking-wider text-gold/80 hover:text-gold bg-white/[0.04] hover:bg-white/[0.07] transition-all active:scale-[0.97] py-5 border border-white/[0.12] hover:border-gold/40">
                  {linkCopied ? (
                    <><Check className="w-4 h-4 text-green-400" /><span className="text-green-400">Copied!</span></>
                  ) : (
                    <><Link2 className="w-4 h-4" /><span>Copy Link</span></>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center mb-4">
                <span className="font-bebas text-3xl tracking-[0.2em] text-gold">
                  FILMMAKER<span className="text-white">.OG</span>
                </span>
              </div>
              <p className="text-white/30 text-xs tracking-wide leading-relaxed text-center">
                For educational and informational purposes only. Not legal, tax, or investment advice.
                Consult a qualified entertainment attorney before making financing decisions.
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <a href="/terms" className="text-white/20 text-xs hover:text-white/40 transition-colors">Terms</a>
                <span className="text-white/10">|</span>
                <a href="/privacy" className="text-white/20 text-xs hover:text-white/40 transition-colors">Privacy</a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
};

export default Index;
