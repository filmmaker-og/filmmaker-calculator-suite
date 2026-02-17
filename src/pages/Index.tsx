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
    punchline: "the margin you projected at greenlight doesn\u2019t exist.",
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
  { name: "Acquisition Price", amount: "$3,000,000",    pct: 100.0, barOpacity: 0.60, isFinal: false },
  { name: "CAM Fees",          amount: "\u2212$22,500",      pct: 99.3,  barOpacity: 0.45, isFinal: false },
  { name: "Sales Agent",       amount: "\u2212$450,000",     pct: 84.3,  barOpacity: 0.40, isFinal: false },
  { name: "Senior Debt",       amount: "\u2212$440,000",     pct: 69.6,  barOpacity: 0.30, isFinal: false },
  { name: "Mezzanine",         amount: "\u2212$230,000",     pct: 61.9,  barOpacity: 0.25, isFinal: false },
  { name: "Equity Recoupment", amount: "\u2212$1,440,000",   pct: 13.9,  barOpacity: 0.18, isFinal: false },
  { name: "Net Profits",       amount: "$417,500",       pct: 13.9,  barOpacity: 1,    isFinal: true  },
];

/* ═══════════════════════════════════════════════════════════════════
   PRODUCT LADDER — gold bar tiers
   ═══════════════════════════════════════════════════════════════════ */
const productTiers = [
  {
    tier: "Courtesy", product: "Waterfall Simulator", price: "Free",
    desc: "Model your deal. See where every dollar goes.",
    pct: 30, barClass: "bg-[#D4AF37]/30", tierColor: "text-white/50",
    nameColor: "text-white/80", descColor: "text-white/50", barH: "h-2",
    featured: false,
  },
  {
    tier: "Premium", product: "The Blueprint", price: "$197",
    desc: "The full financial picture. Every number, every tier, every scenario.",
    pct: 65, barClass: "bg-[#D4AF37]/50", tierColor: "text-[rgba(212,175,55,0.60)]",
    nameColor: "text-white/90", descColor: "text-white/50", barH: "h-2",
    featured: false,
  },
  {
    tier: "Investment Grade", product: "The Pitch Package", price: "$497",
    desc: "What the other side of the table expects to see.",
    pct: 100, barClass: "bg-[#D4AF37]/70", tierColor: "text-[#D4AF37]",
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
    a: "Film is an alternative asset class\u00A0\u2014 same category as real estate, private equity, and venture capital. Every other alt asset gives investors standardized tools to model returns. Film doesn\u2019t. That\u2019s why the industry has a reputation as a bad investment. It\u2019s not. It\u2019s a misunderstood one. This tool is the starting point.",
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
    <div className="max-w-md mx-auto relative">
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-gold/30 bg-black" />
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

  // Ladder bar animation
  const [ladderRevealed, setLadderRevealed] = useState(false);
  const ladderRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ladderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setLadderRevealed(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

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
      setTimeout(() => setPhase('beam'), 400),
      setTimeout(() => setPhase('logo'), 1200),
      setTimeout(() => setPhase('pulse'), 2000),
      setTimeout(() => setPhase('tagline'), 2800),
      setTimeout(() => setPhase('complete'), 4000),
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
              <p className="text-white/50 text-xs tracking-[0.2em] uppercase mb-6">
                Built by a Tribeca-winning, CAA-repped producer whose debut sold to&nbsp;Netflix.
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
                  <p className="text-white/30 text-xs tracking-[0.10em] text-center">No account required. Results in 60&nbsp;seconds.</p>
                </div>
              )}

              <div className="mt-8 flex justify-center animate-bounce-subtle cursor-pointer active:scale-[0.97]"
                onClick={() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })}>
                <ChevronDown className="w-5 h-5 text-gold/60" />
              </div>
            </div>
          </section>

          <Divider />

          {/* ──────────────────────────────────────────────────────────
               § 2  MISSION — comparison table + Blum quote + declaration
             ────────────────────────────────────────────────────────── */}
          <section id="mission" className="snap-section py-16 px-6">
            <div ref={revMission.ref} className={cn("transition-all duration-700 ease-out", revMission.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
              <SHeader eyebrow="The Thesis">
                FILM IS AN ALTERNATIVE <span className="text-white">ASSET CLASS</span>
              </SHeader>

              {/* Institutional comparison — asset class grid */}
              <div className="max-w-md mx-auto">
                <div className="grid grid-cols-1 gap-[1px] bg-white/[0.06] border border-white/[0.06] overflow-hidden">
                  {[
                    { asset: "Real Estate", tool: "Comps & Cap Rate Models", status: true },
                    { asset: "Private Equity", tool: "Carry & IRR Structures", status: true },
                    { asset: "Venture Capital", tool: "Term Sheet Standards", status: true },
                    { asset: "Film", tool: "Nothing.", status: false },
                  ].map((row, i) => (
                    <div
                      key={row.asset}
                      className={cn(
                        "flex items-center justify-between px-5 py-4 transition-all duration-500 ease-out",
                        row.status ? "bg-white/[0.02]" : "bg-gold/[0.04]",
                        revMission.visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                      )}
                      style={{ transitionDelay: revMission.visible ? `${300 + i * 120}ms` : '0ms' }}
                    >
                      <div className="flex items-center gap-3">
                        {row.status
                          ? <Check className="w-3.5 h-3.5 text-gold/50 flex-shrink-0" />
                          : <X className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                        }
                        <span className={cn(
                          "font-bebas text-[15px] tracking-[0.10em] uppercase",
                          row.status ? "text-white/60" : "text-gold"
                        )}>
                          {row.asset}
                        </span>
                      </div>
                      <span className={cn(
                        "text-sm",
                        row.status ? "text-white/40" : "font-bebas text-[17px] tracking-[0.06em] text-white"
                      )}>
                        {row.tool}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-center text-white/50 text-sm leading-relaxed mt-6">
                  Every alternative asset class gives investors standardized tools to model&nbsp;returns.
                </p>
                <p className="text-center font-bebas text-2xl md:text-3xl tracking-[0.06em] text-gold mt-3">
                  Until now.
                </p>
              </div>

              {/* Blum quote — properly structured */}
              <div className="mt-12 max-w-md mx-auto">
                <div className="relative bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                  {/* Gold left accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-gold/60 via-gold/30 to-transparent" />
                  <div className="p-6 md:p-8 pl-7 md:pl-10">
                    {/* Opening quote mark */}
                    <div className="font-bebas text-[64px] md:text-[80px] leading-none select-none pointer-events-none text-gold/20 -mb-6 -ml-1"
                      aria-hidden="true">{"\u201C"}</div>
                    <blockquote className="relative z-10">
                      <p className="text-[15px] md:text-base leading-[1.7] text-white/80 italic">
                        Filmmakers have a perception in the business world of being kind of flaky dudes{"\u2026"} you need to be buttoned down{"\u2026"} speak the language that they speak.
                      </p>
                    </blockquote>
                    <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center gap-3">
                      <div className="w-8 h-[1px] bg-gold/40" />
                      <cite className="not-italic">
                        <span className="font-bebas text-[14px] tracking-[0.14em] uppercase text-gold/70">Jason Blum</span>
                        <span className="text-white/30 text-xs ml-2">Blumhouse Productions</span>
                      </cite>
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
          <section id="evidence" className="snap-section py-16 px-6">
            <div ref={revEvidence.ref} className={cn("transition-all duration-700 ease-out", revEvidence.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
              <SHeader eyebrow="The Problem">
                MOST INDIE FILMS <span className="text-white">LOSE MONEY.</span>
              </SHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {realities.map((r, i) => (
                  <div
                    key={r.label}
                    className={cn(
                      "relative p-6 bg-white/[0.02] border border-white/[0.06] overflow-hidden transition-all duration-600 ease-out group",
                      revEvidence.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                    style={{ transitionDelay: revEvidence.visible ? `${i * 180}ms` : '0ms' }}
                  >
                    {/* Top gold accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-mono text-[11px] text-gold/40">{String(i + 1).padStart(2, '0')}</span>
                        <h3 className="font-bebas text-[17px] tracking-[0.12em] uppercase text-gold">
                          {r.label}
                        </h3>
                      </div>
                      <p className="text-white/60 text-sm leading-relaxed">{r.body}</p>
                      <div className="h-[1px] bg-gradient-to-r from-gold/30 to-transparent mt-4 mb-3" />
                      <p
                        className={cn(
                          "font-semibold transition-opacity duration-[0ms]",
                          r.loud ? "text-base text-white" : "text-sm text-white/80",
                          revEvidence.visible ? "opacity-100" : "opacity-0"
                        )}
                        style={{
                          transitionTimingFunction: 'step-end',
                          transitionDelay: revEvidence.visible ? `${600 + i * 180}ms` : '0ms',
                        }}
                      >
                        {r.punchline}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
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
                        tier.isFinal ? "text-[22px] font-bold text-[#00C853]" :
                        i === 0 ? "text-[15px] text-white/80" : "text-[15px] text-white/60"
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
                          background: tier.isFinal ? '#00C853' : `rgba(255,255,255,${tier.barOpacity})`,
                          boxShadow: tier.isFinal ? '0 0 10px rgba(0,200,83,0.35)' : 'none',
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
                    This is the standard waterfall.
                  </p>
                  <button onClick={handleStartClick}
                    className="w-full max-w-[280px] h-12 text-sm btn-cta-primary mx-auto">
                    WHAT DOES YOUR DEAL LOOK LIKE?
                  </button>
                </div>
              </div>
            </div>
          </SectionFrame>

          <Divider />

          {/* ──────────────────────────────────────────────────────────
               § 5  CLOSED DOORS — the reality of what exists
             ────────────────────────────────────────────────────────── */}
          <section id="cost" className="snap-section py-16 px-6">
            <div ref={revCost.ref} className={cn("transition-all duration-700 ease-out", revCost.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
              <SHeader eyebrow="The Reality">
                EVERY OTHER DOOR <span className="text-white">IS CLOSED.</span>
              </SHeader>

              <div className="max-w-sm mx-auto border border-white/[0.06] overflow-hidden">
                {closedDoors.map((door, i) => (
                  <div
                    key={door.name}
                    className={cn(
                      "px-5 py-5 transition-all duration-600 ease-out relative",
                      i > 0 && "border-t border-white/[0.06]",
                      revCost.visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                    )}
                    style={{
                      transitionDelay: revCost.visible ? `${i * 150}ms` : '0ms',
                      background: doorsLocked ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2.5">
                          <Lock
                            className={cn(
                              "w-3.5 h-3.5 flex-shrink-0 transition-all duration-700",
                              doorsLocked ? "text-white/25 opacity-100" : "text-white/0 opacity-0"
                            )}
                            style={{ transitionDelay: doorsLocked ? `${i * 200}ms` : '0ms' }}
                          />
                          <p
                            className={cn(
                              "font-bebas text-[19px] md:text-[22px] tracking-[0.10em] uppercase transition-all duration-700",
                              doorsLocked ? "text-white/20 line-through decoration-white/10" : "text-white/80"
                            )}
                            style={{ transitionDelay: doorsLocked ? `${i * 200}ms` : '0ms' }}
                          >
                            {door.name}
                          </p>
                        </div>
                        <p
                          className={cn(
                            "text-sm italic mt-1.5 transition-all duration-700",
                            doorsLocked ? "text-white/40 opacity-100" : "opacity-0"
                          )}
                          style={{ transitionDelay: doorsLocked ? `${i * 200 + 100}ms` : '0ms' }}
                        >
                          {door.lock}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "font-mono text-xs transition-all duration-700 flex-shrink-0 ml-4",
                          doorsLocked ? "text-white/15" : "text-white/30"
                        )}
                        style={{ transitionDelay: doorsLocked ? `${i * 200 + 50}ms` : '0ms' }}
                      >
                        {door.cost}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
               DECLARATION — the hinge between closed doors and the path
             ────────────────────────────────────────────────────────── */}
          <section className="py-12 px-6 relative">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 70%)' }} />
            <div ref={revDecl.ref} className={cn("max-w-md mx-auto relative transition-all duration-700 ease-out", revDecl.visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.96]")}>
              <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
              <div className="py-10 px-4 text-center">
                <h3 className="font-bebas text-[28px] md:text-[36px] tracking-[0.08em] uppercase text-gold leading-tight">
                  We Built The Arsenal That Levels The Playing{"\u00A0"}<span className="text-white">Field</span>.
                </h3>
              </div>
              <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
               § 6  THE PATH — gold bar product ladder + CTA
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="path">
            <div ref={revPath.ref} className={cn("transition-all duration-700 ease-out", revPath.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
              <SHeader eyebrow="The Arsenal">
                THREE TIERS. <span className="text-white">ONE STANDARD.</span>
              </SHeader>

              <p className="text-center text-white/50 text-sm mb-8 max-w-sm mx-auto">
                Whether you&rsquo;re modeling your first deal or walking into a meeting with real&nbsp;capital, there&rsquo;s a tier built for&nbsp;you.
              </p>

              {/* Product ladder — gold proportional bars */}
              <div ref={ladderRef} className="max-w-md mx-auto border border-white/[0.06] overflow-hidden">
                {productTiers.map((t, i) => (
                  <div
                    key={t.tier}
                    className={cn(
                      "px-5 py-5 transition-all duration-600 ease-out relative",
                      i > 0 && "border-t border-white/[0.06]",
                      i === 2 && "bg-gold/[0.03]",
                      revPath.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                    )}
                    style={{ transitionDelay: revPath.visible ? `${i * 150}ms` : '0ms' }}
                  >
                    {t.featured && (
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                    )}
                    {t.featured && (
                      <div className="mb-2">
                        <span className="text-[11px] tracking-[0.16em] uppercase font-bold text-gold/80 bg-gold/[0.08] px-2 py-0.5 border border-gold/20">
                          Recommended
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline justify-between mb-1.5">
                      <div className="flex items-baseline gap-3">
                        <span className={cn("font-bebas text-[13px] tracking-[0.15em] uppercase", t.tierColor)}>
                          {t.tier}
                        </span>
                        <span className={cn("text-sm font-semibold", t.nameColor)}>
                          {t.product}
                        </span>
                      </div>
                      <span className={cn(
                        "font-mono text-[13px] font-semibold",
                        t.featured ? "text-gold" : "text-white/40"
                      )}>
                        {t.price}
                      </span>
                    </div>
                    <p className={cn("text-sm mb-3", t.descColor)}>{t.desc}</p>
                    <div className={cn("w-full bg-white/[0.04] relative overflow-hidden", t.barH)}>
                      <div
                        className={cn("absolute left-0 top-0 h-full", t.barClass)}
                        style={{
                          width: ladderRevealed ? `${t.pct}%` : '0%',
                          transition: 'width 600ms cubic-bezier(0.16,1,0.3,1)',
                          transitionDelay: `${i * 250}ms`,
                          boxShadow: i === 2 ? '0 0 12px rgba(212,175,55,0.25)' : 'none',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center mt-10">
                <p className="text-white/40 text-xs tracking-[0.15em] uppercase mb-4">Start free. Upgrade when you&rsquo;re ready.</p>
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
            <div ref={revFinal.ref} className={cn("relative overflow-hidden border border-gold/20 transition-all duration-700 ease-out", revFinal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
              {/* Gold corner accents */}
              <div className="absolute top-0 left-0 w-8 h-[1px] bg-gold/50" />
              <div className="absolute top-0 left-0 w-[1px] h-8 bg-gold/50" />
              <div className="absolute top-0 right-0 w-8 h-[1px] bg-gold/50" />
              <div className="absolute top-0 right-0 w-[1px] h-8 bg-gold/50" />
              <div className="absolute bottom-0 left-0 w-8 h-[1px] bg-gold/50" />
              <div className="absolute bottom-0 left-0 w-[1px] h-8 bg-gold/50" />
              <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-gold/50" />
              <div className="absolute bottom-0 right-0 w-[1px] h-8 bg-gold/50" />

              {/* Ambient glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                style={{ width: '100%', height: '100%', background: `radial-gradient(ellipse 60% 50% at 50% 20%, rgba(212,175,55,0.06) 0%, transparent 70%)` }} />

              <div className="relative p-8 md:p-14 max-w-md mx-auto text-center">
                <p className="text-gold/60 text-xs tracking-[0.3em] uppercase font-semibold mb-5">The Moment of Truth</p>
                <h2 className="font-bebas text-[28px] md:text-[38px] leading-[1.1] tracking-[0.06em] text-gold mb-5">
                  YOUR INVESTOR WILL ASK<br />HOW THE MONEY FLOWS <span className="text-white">BACK</span>.
                </h2>
                <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto mb-3">
                  That meeting shouldn&rsquo;t be the first time you see your own&nbsp;waterfall.
                </p>
                <p className="text-white/30 text-xs tracking-wider mb-8">
                  Free to start. No account&nbsp;required.
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
            <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent mb-8" />
            <div className="max-w-sm mx-auto">
              <div className="grid grid-cols-2 gap-3 mb-8 max-w-[340px] mx-auto">
                <a href="mailto:thefilmmaker.og@gmail.com"
                  className="flex items-center justify-center gap-2 text-sm tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 border border-white/[0.08] hover:border-gold/30">
                  <Mail className="w-4 h-4" /><span>Email</span>
                </a>
                <a href="https://www.instagram.com/filmmaker.og" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 border border-white/[0.08] hover:border-gold/30">
                  <Instagram className="w-4 h-4" /><span>Instagram</span>
                </a>
                <button onClick={handleShare}
                  className="flex items-center justify-center gap-2 text-sm tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 border border-white/[0.08] hover:border-gold/30">
                  <Share2 className="w-4 h-4" /><span>Share</span>
                </button>
                <button onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 text-sm tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 border border-white/[0.08] hover:border-gold/30">
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
            </div>
          </footer>
        </main>
      </div>
    </>
  );
};

export default Index;
