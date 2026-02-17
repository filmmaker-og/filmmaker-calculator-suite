import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useHaptics } from "@/hooks/use-haptics";
import {
  RotateCcw,
  Check,
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
   COMPARISON TABLE — asset classes + their tools
   ═══════════════════════════════════════════════════════════════════ */
const assetClasses = [
  { name: "Real Estate", tools: "Comps & Appraisals" },
  { name: "Private Equity", tools: "Return Models & Carry Structures" },
  { name: "Venture Capital", tools: "Term Sheets & Valuation Frameworks" },
];

/* ═══════════════════════════════════════════════════════════════════
   THREE REALITIES — column panels
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
    tier: "Courtesy", product: "Waterfall Simulator",
    desc: "Model your deal. See where every dollar goes.",
    pct: 30, barClass: "bg-[#D4AF37]/30", tierColor: "text-white/50",
    nameColor: "text-white/80", descColor: "text-white/50", barH: "h-2",
  },
  {
    tier: "Premium", product: "The Blueprint",
    desc: "The full financial picture. Every number, every tier, every scenario.",
    pct: 65, barClass: "bg-[#D4AF37]/50", tierColor: "text-[rgba(212,175,55,0.60)]",
    nameColor: "text-white/90", descColor: "text-white/50", barH: "h-2",
  },
  {
    tier: "Investment Grade", product: "The Pitch Package",
    desc: "What the other side of the table expects to see.",
    pct: 100, barClass: "bg-[#D4AF37]/70", tierColor: "text-[#D4AF37]",
    nameColor: "text-white", descColor: "text-white/60", barH: "h-3",
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
  <div className="text-center mb-8">
    <p className="text-white/50 text-xs tracking-[0.3em] uppercase font-semibold mb-3">{eyebrow}</p>
    <h2 className="font-bebas text-3xl md:text-4xl tracking-[0.08em] text-gold">{children}</h2>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   DIVIDER
   ═══════════════════════════════════════════════════════════════════ */
const Divider = () => (
  <div className="px-8"><div className="h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" /></div>
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
  const revFaq      = useReveal();

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
                  <button onClick={handleContinueClick} className="w-full h-16 text-base btn-cta-primary">
                    CONTINUE YOUR DEAL
                  </button>
                  <p className="text-white/40 text-xs tracking-wider text-center">{formatCompactCurrency(savedState!.budget)} budget in progress</p>
                  <button onClick={handleStartFresh}
                    className="w-full flex items-center justify-center gap-1.5 text-xs tracking-wider text-white/40 hover:text-white/60 transition-colors py-2">
                    <RotateCcw className="w-3 h-3" /> Start a new deal
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-[320px] mx-auto">
                  <button onClick={handleStartClick} className="w-full h-16 text-base btn-cta-primary">
                    BUILD YOUR WATERFALL
                  </button>
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
            <div ref={revMission.ref} className={cn("transition-all duration-600 ease-out", revMission.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
              <SHeader eyebrow="The Thesis">
                FILM AS AN ALTERNATIVE <span className="text-white">ASSET</span>
              </SHeader>

              {/* Comparison table — centered vertical stack with arrows */}
              <div className="max-w-sm mx-auto text-center">
                {assetClasses.map((ac) => (
                  <div key={ac.name}>
                    <div className="py-4">
                      <p className="font-bebas text-[19px] md:text-[22px] tracking-[0.08em] uppercase text-white/80">
                        {ac.name}
                      </p>
                      <p className="text-sm text-white/50 mt-1">{ac.tools}</p>
                    </div>
                    <div className="flex justify-center py-2">
                      <span className="text-gold/30 text-lg">&darr;</span>
                    </div>
                  </div>
                ))}

                {/* Film — the empty row */}
                <div className="py-4">
                  <p className="font-bebas text-[19px] md:text-[22px] tracking-[0.08em] uppercase text-white">
                    Film
                  </p>
                  <div className="flex justify-center mt-2">
                    <span className="text-white/20 text-3xl font-light select-none">&ne;</span>
                  </div>
                </div>
              </div>

              {/* Blum quote */}
              <div className="mt-10 max-w-md mx-auto relative bg-white/[0.04] border-l-[3px] p-6 md:p-8"
                style={{ borderLeftColor: 'rgba(212,175,55,0.40)' }}>
                <div className="absolute top-2 left-4 font-bebas text-[72px] md:text-[96px] leading-none select-none pointer-events-none"
                  style={{ color: 'rgba(212,175,55,0.20)' }} aria-hidden="true">&ldquo;</div>
                <p className="relative z-10 text-sm md:text-base leading-relaxed text-white/80 italic">
                  Filmmakers have a perception in the business world of being kind of flaky dudes... you need to be buttoned down... speak the language that they speak.
                </p>
                <p className="mt-4 font-bebas text-[13px] tracking-[0.12em] uppercase" style={{ color: 'rgba(212,175,55,0.60)' }}>
                  Jason Blum &mdash; Blumhouse
                </p>
              </div>

              {/* Declaration between gold rules */}
              <div className="mt-12 max-w-md mx-auto">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                <div className="py-8 px-4 text-center">
                  <h3 className="font-bebas text-2xl md:text-3xl tracking-[0.06em] uppercase text-white leading-tight">
                    We Built The Arsenal That Levels The Playing&nbsp;Field.
                  </h3>
                </div>
                <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
               § 3  THE EVIDENCE — three reality panels
             ────────────────────────────────────────────────────────── */}
          <section id="evidence" className="snap-section py-16 px-6">
            <div ref={revEvidence.ref} className={cn("transition-all duration-600 ease-out", revEvidence.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
              <SHeader eyebrow="The Evidence">
                MOST INDIE FILMS <span className="text-white">LOSE MONEY.</span>
              </SHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {realities.map((r, i) => (
                  <div
                    key={r.label}
                    className={cn(
                      "relative p-6 bg-white/[0.03] border border-white/[0.06] overflow-hidden transition-all duration-500 ease-out",
                      revEvidence.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                    )}
                    style={{ transitionDelay: revEvidence.visible ? `${i * 150}ms` : '0ms' }}
                  >
                    <div className="relative z-10">
                      <h3 className="font-bebas text-[17px] tracking-[0.12em] uppercase" style={{ color: '#D4AF37' }}>
                        {r.label}
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed mt-3">{r.body}</p>
                      <div className="h-[1px] bg-gradient-to-r from-[rgba(212,175,55,0.40)] to-transparent mt-4 mb-3" />
                      <p className={cn(
                        "font-semibold",
                        r.loud ? "text-base text-white" : "text-sm text-white/90"
                      )}>
                        {r.punchline}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
               § 4  THE WATERFALL — proportional bars
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="waterfall">
            <div ref={revWater.ref} className={cn("transition-all duration-500 ease-out", revWater.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
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
                    style={tier.isFinal ? { background: 'rgba(249,224,118,0.04)' } : undefined}
                  >
                    {/* Labels */}
                    <div className="flex justify-between items-baseline mb-2">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-[11px] text-white/30 tabular-nums">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className={cn(
                          "font-bebas tracking-[0.08em] uppercase",
                          tier.isFinal ? "text-[23px] text-[#F9E076]" :
                          i === 0 ? "text-[20px] text-white" : "text-[17px] text-white/80"
                        )}>
                          {tier.name}
                        </span>
                      </div>
                      <span className={cn(
                        "font-mono font-semibold",
                        tier.isFinal ? "text-[22px] font-bold text-[#F9E076]" :
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
                          background: tier.isFinal ? '#F9E076' : `rgba(255,255,255,${tier.barOpacity})`,
                          boxShadow: tier.isFinal ? '0 0 8px rgba(249,224,118,0.3)' : 'none',
                          transition: `width 500ms cubic-bezier(0.16,1,0.3,1)`,
                          transitionDelay: `${tier.isFinal ? 1200 : i * 150}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* Footer */}
                <div className="border-t border-white/[0.06] px-5 py-5 text-center">
                  <p className="text-[14px] font-medium tracking-wide text-white/50">
                    This is the standard waterfall.
                  </p>
                </div>
              </div>
            </div>
          </SectionFrame>

          <Divider />

          {/* ──────────────────────────────────────────────────────────
               § 5  KNOWLEDGE ISN'T CHEAP — 2-1-1 cost cards
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="cost">
            <div ref={revCost.ref} className={cn("transition-all duration-500 ease-out", revCost.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
              <SHeader eyebrow="The Industry Standard">
                KNOWLEDGE ISN'T <span className="text-white">CHEAP</span>
              </SHeader>

              <div className="max-w-sm mx-auto">
                {/* Row 1: two small cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-white/[0.06] bg-black p-4 text-center">
                    <p className="font-mono text-base font-semibold text-white/80">$5K&ndash;$15K</p>
                    <p className="text-xs tracking-wider uppercase text-white/50 mt-1.5">Entertainment Attorney</p>
                  </div>
                  <div className="border border-white/[0.06] bg-black p-4 text-center">
                    <p className="font-mono text-base font-semibold text-white/80">$2K&ndash;$5K</p>
                    <p className="text-xs tracking-wider uppercase text-white/50 mt-1.5">Producing Consultant</p>
                  </div>
                </div>

                {/* Row 2: Film School — dominates */}
                <div className="mt-3">
                  <div className="border p-6 text-center bg-white/[0.03]" style={{ borderColor: 'rgba(212,175,55,0.20)' }}>
                    <p className="font-mono text-2xl md:text-3xl font-bold text-white/90">$50K&ndash;$200K</p>
                    <p className="text-xs tracking-wider uppercase text-white/50 mt-2">Film School</p>
                  </div>
                </div>

                {/* Row 3: Trial and Error */}
                <div className="mt-3">
                  <div className="border border-white/[0.06] bg-black p-4 text-center">
                    <p className="font-mono text-base font-semibold text-white/80">3&ndash;5 Years</p>
                    <p className="text-xs tracking-wider uppercase text-white/50 mt-1.5">Trial and Error</p>
                  </div>
                </div>
              </div>
            </div>
          </SectionFrame>

          <Divider />

          {/* ──────────────────────────────────────────────────────────
               § 6  THE PATH — gold bar product ladder + CTA
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="path">
            <div ref={revPath.ref} className={cn("transition-all duration-500 ease-out", revPath.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
              <SHeader eyebrow="The Path">
                YOUR <span className="text-white">MOVE.</span>
              </SHeader>

              {/* Product ladder — gold proportional bars */}
              <div ref={ladderRef} className="max-w-md mx-auto">
                {productTiers.map((t, i) => (
                  <div key={t.tier} className={cn("py-4", i > 0 && "border-t border-white/[0.06]")}>
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className={cn("font-bebas text-[13px] tracking-[0.15em] uppercase", t.tierColor)}>
                        {t.tier}
                      </span>
                      <span className={cn("text-sm font-semibold", t.nameColor)}>
                        {t.product}
                      </span>
                    </div>
                    <p className={cn("text-sm mb-2", t.descColor)}>{t.desc}</p>
                    <div className={cn("w-full bg-white/[0.04] relative overflow-hidden", t.barH)}>
                      <div
                        className={cn("absolute left-0 top-0 h-full", t.barClass)}
                        style={{
                          width: ladderRevealed ? `${t.pct}%` : '0%',
                          transition: 'width 500ms cubic-bezier(0.16,1,0.3,1)',
                          transitionDelay: `${i * 200}ms`,
                          boxShadow: i === 2 ? '0 0 8px rgba(212,175,55,0.2)' : 'none',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center mt-10">
                <button onClick={handleStartClick}
                  className="w-full max-w-[320px] h-16 text-base btn-cta-primary mx-auto">
                  BUILD YOUR WATERFALL
                </button>
                <div className="mt-4">
                  <a href="/store" className="text-white/40 text-sm hover:text-gold transition-colors">
                    See premium packages <span className="text-gold/70">&rarr;</span>
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
            <div ref={revFaq.ref} className={cn("max-w-2xl mx-auto transition-all duration-500 ease-out", revFaq.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
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
          <section id="final-cta" className="snap-section py-8 px-4">
            <div className="flex overflow-hidden border border-white/[0.06]">
              <div className="w-1 flex-shrink-0 bg-gradient-to-b from-gold via-gold/60 to-gold/20" style={{ boxShadow: '0 0 16px rgba(212,175,55,0.30)' }} />
              <div className="bg-black flex-1 min-w-0 overflow-hidden relative">
                <div className="h-[2px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                  style={{ width: '100%', height: '100%', background: `radial-gradient(ellipse 60% 60% at 50% 10%, rgba(212,175,55,0.08) 0%, transparent 70%)` }} />
                <div className="relative p-8 md:p-12 max-w-md mx-auto text-center">
                  <h2 className="font-bebas text-3xl md:text-4xl tracking-[0.08em] text-gold mb-4">
                    INVESTORS WILL ASK HOW THE MONEY FLOWS <span className="text-white">BACK</span>.<br />HAVE THE <span className="text-white">ANSWER</span>.
                  </h2>
                  <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto mb-6">
                    Your next investor meeting shouldn't be the first time you see your own&nbsp;waterfall.
                  </p>
                  <button onClick={handleStartClick}
                    className="w-full max-w-[320px] h-16 text-base btn-cta-final mx-auto">
                    BUILD YOUR WATERFALL
                  </button>
                </div>
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
