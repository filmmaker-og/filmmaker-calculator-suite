import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import {
  RotateCcw,
  Check,
  X,
  LockKeyhole,
  Mail,
  Instagram,
  Link2,
  ChevronDown,
} from "lucide-react";
import filmmakerLogo from "@/assets/filmmaker-f-icon.png";
import Header from "@/components/Header";
import LeadCaptureModal from "@/components/LeadCaptureModal";
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
import SectionHeader from "@/components/SectionHeader";

const STORAGE_KEY = "filmmaker_og_inputs";
const CINEMATIC_SEEN_KEY = "filmmaker_og_intro_seen";

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
   PRODUCT LADDER — gold bar tiers
   ═══════════════════════════════════════════════════════════════════ */
const productTiers = [
  {
    tier: "Courtesy", product: "Waterfall Simulator", price: "Free",
    desc: "Model your deal. See where every dollar goes.",
    pct: 30, barClass: "bg-[#D4AF37]/30", tierColor: "text-gold/50",
    nameColor: "text-white/90", descColor: "text-white/50", barH: "h-2",
    featured: false, elevated: false,
  },
  {
    tier: "Investment Grade", product: "The Pitch Package", price: "$497", originalPrice: "$697",
    desc: "What the other side of the table expects to see.",
    pct: 100, barClass: "bg-[#D4AF37]/70", tierColor: "text-gold",
    nameColor: "text-white", descColor: "text-white/60", barH: "h-3",
    featured: true, elevated: false,
  },
  {
    tier: "Premium", product: "The Blueprint", price: "$197",
    desc: "The full financial picture. Every number, every tier, every scenario.",
    pct: 65, barClass: "bg-[#D4AF37]/50", tierColor: "text-gold/70",
    nameColor: "text-white/90", descColor: "text-white/55", barH: "h-2",
    featured: false, elevated: true,
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
    q: "How do I get started?",
    a: "Enter your email, open the magic link, and you\u2019re in\u00A0\u2014 no password, no credit card. Set your budget, adjust the deal terms, and the waterfall builds itself in real time. When you\u2019re ready for the meeting, upgrade to export the investor-ready package.",
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

  // Hero scroll tracking (for sticky CTA)
  const heroRef = useRef<HTMLElement>(null);
  const [heroPast, setHeroPast] = useState(false);

  // Intro skip
  const introTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [showSkipHint, setShowSkipHint] = useState(false);

  // Reveals
  const revMission     = useReveal();
  const revEvidence    = useReveal();
  const revTransition  = useReveal();
  const revBlum        = useReveal();
  const revWater       = useReveal();
  const revCost        = useReveal();
  const revPath        = useReveal();
  const revDecl        = useReveal();
  const revFaq         = useReveal();
  const revFinal       = useReveal();
  const revUntilNow    = useReveal();
  const revArsenal     = useReveal();

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
    introTimersRef.current = [
      setTimeout(() => setPhase('beam'), 300),
      setTimeout(() => setPhase('logo'), 800),
      setTimeout(() => setPhase('pulse'), 1300),
      setTimeout(() => setPhase('tagline'), 1800),
      setTimeout(() => setPhase('complete'), 2600),
    ];
    return () => introTimersRef.current.forEach(clearTimeout);
  }, [shouldSkip]);

  // Show "tap to skip" hint after 1s
  useEffect(() => {
    if (shouldSkip || phase === 'complete') return;
    const t = setTimeout(() => setShowSkipHint(true), 1000);
    return () => clearTimeout(t);
  }, [shouldSkip, phase]);

  const handleSkipIntro = useCallback(() => {
    introTimersRef.current.forEach(clearTimeout);
    setPhase('complete');
  }, []);

  useEffect(() => {
    if (phase === 'complete' && !hasSeenCinematic) {
      try { localStorage.setItem(CINEMATIC_SEEN_KEY, "true"); } catch {}
    }
  }, [phase, hasSeenCinematic]);

  const handleStartClick    = () => { haptics.medium(); gatedNavigate("/calculator?tab=budget"); };
  const handleContinueClick = () => { haptics.medium(); gatedNavigate("/calculator"); };
  const handleStartFresh    = () => { haptics.light(); gatedNavigate("/calculator?tab=budget&reset=true"); };

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

  // Hero scroll observer — triggers sticky CTA
  useEffect(() => {
    if (!isComplete) return;
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setHeroPast(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-56px 0px 0px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isComplete]);

  // Sticky CTA button for the header
  const stickyCtaButton = isComplete ? (
    <button
      onClick={isReturningUser ? handleContinueClick : handleStartClick}
      className={cn(
        "font-bebas text-[13px] tracking-[0.14em] uppercase whitespace-nowrap",
        "h-8 px-3.5",
        "bg-gold-cta-subtle border border-gold-cta-muted text-gold-cta",
        "transition-all duration-300 ease-out",
        "hover:border-gold-cta",
        "active:scale-[0.97]",
        heroPast
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-1 pointer-events-none"
      )}
      style={{ borderRadius: 0 }}
    >
      {isReturningUser ? "CONTINUE" : "BUILD FREE"}
    </button>
  ) : undefined;

  return (
    <>
      {isComplete && <Header rightSlot={stickyCtaButton} />}

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

        {/* ═══════ CINEMATIC INTRO ═══════ */}
        {!shouldSkip && (
          <div
            className={cn("fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-1000 cursor-pointer", isComplete ? "opacity-0 pointer-events-none" : "opacity-100")}
            style={{ backgroundColor: '#000' }}
            onClick={handleSkipIntro}
            role="button"
            aria-label="Skip intro"
          >
            <div className={cn("absolute inset-0 pointer-events-none transition-all duration-1000", showBeam ? "opacity-100" : "opacity-0")}
              style={{ background: `radial-gradient(ellipse 70% 60% at 50% 0%, rgba(212,175,55,0.08) 0%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.01) 60%, transparent 80%)`, clipPath: showBeam ? 'polygon(25% 0%,75% 0%,95% 100%,5% 100%)' : 'polygon(48% 0%,52% 0%,52% 30%,48% 30%)', transition: 'clip-path 1.2s cubic-bezier(0.22,1,0.36,1), opacity 0.8s ease' }} />
            <div className={cn("absolute inset-0 pointer-events-none transition-all duration-1000", showBeam ? "opacity-100" : "opacity-0")}
              style={{ background: `radial-gradient(ellipse 30% 45% at 50% 0%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.15) 30%, rgba(212,175,55,0.05) 50%, transparent 70%)`, clipPath: showBeam ? 'polygon(38% 0%,62% 0%,78% 100%,22% 100%)' : 'polygon(48% 0%,52% 0%,52% 30%,48% 30%)', transition: 'clip-path 1s cubic-bezier(0.22,1,0.36,1) 0.1s, opacity 0.8s ease' }} />
            <div className={cn("absolute left-1/2 top-1/2 w-[400px] h-[400px] pointer-events-none transition-all duration-700", showLogo ? "opacity-100" : "opacity-0")}
              style={{ background: `radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(255,255,255,0.08) 30%, transparent 70%)`, transform: 'translate(-50%,-50%)', filter: 'blur(40px)', animation: isPulsed ? 'focal-pulse 3s ease-in-out infinite' : 'none' }} />
            <div className="relative z-10 flex flex-col items-center">
              <div className={cn("relative transition-all duration-1000 ease-out", showLogo ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-6")}>
                <div className={cn("absolute inset-0 -m-4 transition-opacity duration-700", isPulsed ? "opacity-100" : "opacity-0")}
                  style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.5) 0%, transparent 70%)', filter: 'blur(15px)' }} />
                <img src={filmmakerLogo} alt="Filmmaker.OG" className="w-32 h-32 object-contain relative z-10"
                  style={{ filter: 'brightness(1.5) saturate(1.2)', transition: 'filter 0.7s ease' }} />
              </div>
              <p className={cn("mt-8 text-sm tracking-[0.4em] uppercase font-semibold transition-all duration-700", showTagline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3")}
                style={{ color: '#D4AF37', textShadow: '0 0 20px rgba(212,175,55,0.4)' }}>Know Your Numbers</p>
              <div className="mt-6 w-32 h-[2px] overflow-hidden bg-white/10">
                <div className={cn("h-full bg-gold", showTagline ? "animate-progress-draw" : "")}
                  style={{ boxShadow: '0 0 15px rgba(212,175,55,0.7)', width: showTagline ? undefined : '0%' }} />
              </div>
            </div>

            {/* Tap to skip hint */}
            <p
              className={cn(
                "absolute bottom-10 left-1/2 -translate-x-1/2",
                "text-[11px] tracking-[0.3em] uppercase text-white/25",
                "transition-all duration-500 select-none pointer-events-none",
                showSkipHint && !isComplete
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-1"
              )}
            >
              tap to skip
            </p>
          </div>
        )}

        {/* ═══════ LANDING PAGE ═══════ */}
        <main aria-label="Film Finance Simulator" className={cn("flex-1 flex flex-col transition-all duration-700", isComplete ? "opacity-100" : "opacity-0")}>

          {/* ──────────────────────────────────────────────────────────
               § 1  HERO
             ────────────────────────────────────────────────────────── */}
          <section id="hero" ref={heroRef} className="snap-section min-h-0 pt-20 pb-12 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none animate-spotlight-pulse"
              style={{ width: '100vw', height: '120%', background: `radial-gradient(ellipse 50% 50% at 50% 15%, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.04) 45%, transparent 75%)` }} />
            {/* Static spotlight cone — settled version of cinematic intro beam */}
            <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 25% 40% at 50% 0%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 30%, rgba(212,175,55,0.02) 50%, transparent 70%)`,
                clipPath: 'polygon(42% 0%, 58% 0%, 72% 100%, 28% 100%)',
              }} />
            {/* Left spotlight cone */}
            <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 20% 35% at 30% 0%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)`,
                clipPath: 'polygon(22% 0%, 38% 0%, 55% 100%, 15% 100%)',
              }} />
            {/* Right spotlight cone */}
            <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 20% 35% at 70% 0%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)`,
                clipPath: 'polygon(62% 0%, 78% 0%, 85% 100%, 45% 100%)',
              }} />
            {/* Floor bounce glow */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 60% 80% at 50% 100%, rgba(212,175,55,0.06) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)`,
              }} />
            <div className="relative px-6 py-4 max-w-xl mx-auto text-center">
              <div className="mb-5 relative inline-block">
                <div className="absolute inset-0 -m-10 animate-logo-breathe" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.45) 0%, transparent 70%)', filter: 'blur(18px)' }} />
                <img src={filmmakerLogo} alt="Filmmaker.OG" className="relative z-10 w-[96px] h-[96px] object-contain"
                  style={{ filter: 'brightness(1.6) saturate(1.2) drop-shadow(0 0 12px rgba(212,175,55,0.5))' }} />
              </div>
              <h1 className="font-bebas text-[clamp(2.8rem,9vw,4.2rem)] leading-[1.05] text-gold mb-5">
                SEE WHERE EVERY<br /><span className="text-white">DOLLAR GOES</span>
              </h1>
              <p className="mb-6 text-white/60 text-[14px] leading-[1.7] tracking-[0.06em] uppercase font-medium max-w-[360px] mx-auto">
                Built by a Tribeca-winning producer whose debut sold to <span className="text-gold font-semibold">Netflix</span>.
              </p>

              {isReturningUser ? (
                <div className="w-full max-w-[320px] mx-auto space-y-3">
                  <button onClick={handleContinueClick} className="w-full h-14 text-base btn-cta-primary">
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
                  <button onClick={handleStartClick} className="w-full h-14 text-base btn-cta-primary">
                    BUILD YOUR WATERFALL &mdash; FREE
                  </button>
                  <p className="text-white/50 text-sm tracking-wider">No credit card. Takes 2{"\u00A0"}minutes.</p>
                </div>
              )}

              <div className="mt-8 flex justify-center animate-bounce-subtle cursor-pointer active:scale-[0.97]"
                onClick={() => document.getElementById('waterfall')?.scrollIntoView({ behavior: 'smooth' })}>
                <ChevronDown className="w-6 h-6 text-gold" />
              </div>
            </div>
          </section>

          <Divider />

          {/* ──────────────────────────────────────────────────────────
               § 2  THE PROBLEM — narrative setup for waterfall reveal
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="evidence">
            <div ref={revEvidence.ref} className={cn("transition-all duration-700 ease-out", revEvidence.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
              <SectionHeader eyebrow="The Problem" title={<>MOST FILMS LOSE <span className="text-white">MONEY.</span></>} flankingLines compact />

              <div className="max-w-md mx-auto">
                <div className="relative bg-white/[0.04] border border-white/[0.10] overflow-hidden"
                  style={{ boxShadow: '0 0 20px rgba(212,175,55,0.06)' }}>
                  {/* Gold left accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.55), rgba(212,175,55,0.25), transparent)' }} />
                  <div className="p-7 md:p-9 pl-8 md:pl-10">
                    {/* Dramatic sub-headline */}
                    <p
                      className={cn(
                        "font-bebas text-[24px] md:text-[30px] tracking-[0.06em] leading-tight mb-6 transition-all duration-600 ease-out",
                        revEvidence.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                      )}
                      style={{ transitionDelay: revEvidence.visible ? '200ms' : '0ms' }}
                    >
                      <span className="text-gold">YOUR FILM CAN MAKE MONEY</span><br />
                      <span className="text-white">AND YOU STILL LOSE.</span>
                    </p>

                    {/* The beats */}
                    <div className="space-y-3 mb-6">
                      <p
                        className={cn(
                          "text-white/50 text-[15px] leading-relaxed transition-all duration-500 ease-out",
                          revEvidence.visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                        )}
                        style={{ transitionDelay: revEvidence.visible ? '500ms' : '0ms' }}
                      >
                        Not because it didn{"\u2019"}t recoup.
                      </p>
                      <p
                        className={cn(
                          "text-white/70 text-[15px] leading-relaxed font-medium transition-all duration-500 ease-out",
                          revEvidence.visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                        )}
                        style={{ transitionDelay: revEvidence.visible ? '700ms' : '0ms' }}
                      >
                        Because of how the deal was structured.
                      </p>
                    </div>

                    {/* Gold divider — dramatic pause */}
                    <div
                      className={cn(
                        "h-[1px] w-12 bg-gold/40 mb-6 transition-all duration-600 ease-out",
                        revEvidence.visible ? "opacity-100" : "opacity-0"
                      )}
                      style={{ transitionDelay: revEvidence.visible ? '950ms' : '0ms' }}
                    />

                    {/* The kicker */}
                    <p
                      className={cn(
                        "text-gold/80 text-[15px] tracking-wide italic mb-2 transition-all duration-500 ease-out",
                        revEvidence.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                      )}
                      style={{ transitionDelay: revEvidence.visible ? '1100ms' : '0ms' }}
                    >
                      There{"\u2019"}s a name for it.
                    </p>
                    <p
                      className={cn(
                        "font-bebas text-[20px] md:text-[24px] tracking-[0.08em] text-white/80 transition-all duration-500 ease-out",
                        revEvidence.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                      )}
                      style={{ transitionDelay: revEvidence.visible ? '1300ms' : '0ms' }}
                    >
                      Most filmmakers learn it too late.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SectionFrame>

          <Divider />

          {/* ──────────────────────────────────────────────────────────
               § 3  THE WATERFALL — proportional bars
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="waterfall">
            <div ref={revWater.ref} className={cn("transition-all duration-700 ease-out", revWater.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
              <SectionHeader eyebrow="The Waterfall" title={<>HOW THE MONEY <span className="text-white">FLOWS</span></>} flankingLines compact />

              <p className="text-white/50 text-sm text-center mb-1">A simplified $3M SVOD acquisition.</p>
              <p className="text-white/60 text-sm font-medium text-center mb-6">Here&rsquo;s what actually reaches the filmmaker.</p>

              <div ref={waterBarRef} className="border border-white/[0.06] bg-black max-w-md mx-auto overflow-hidden">
                {waterfallTiers.map((tier, i) => (
                  <div
                    key={tier.name}
                    className={cn(
                      "px-5 py-4 relative",
                      i > 0 && "border-t border-white/[0.06]",
                      tier.isFinal && "py-7 border-t-2 border-gold/30"
                    )}
                    style={tier.isFinal ? { background: 'rgba(212,175,55,0.06)' } : undefined}
                  >
                    {/* Gold left accent on final row */}
                    {tier.isFinal && (
                      <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                        style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.80), rgba(212,175,55,0.40), transparent)' }} />
                    )}
                    {/* Labels */}
                    <div className={cn("flex justify-between items-baseline", tier.isFinal ? "mb-3" : "mb-2")}>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-[11px] text-white/30 tabular-nums">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className={cn(
                          "font-bebas tracking-[0.08em] uppercase",
                          tier.isFinal ? "text-[24px] md:text-[28px] text-gold" :
                          i === 0 ? "text-[20px] text-white" : "text-[17px] text-white/80"
                        )}>
                          {tier.name}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "font-mono font-semibold",
                          tier.isFinal ? "text-[26px] md:text-[30px] font-bold text-gold" :
                          i === 0 ? "text-[17px] text-white/90" : "text-[17px] text-white/70"
                        )}
                        style={tier.isFinal ? { textShadow: '0 0 20px rgba(212,175,55,0.4), 0 0 40px rgba(212,175,55,0.15)' } : undefined}
                      >
                        {tier.isFinal ? `$${countVal.toLocaleString()}` : tier.amount}
                      </span>
                    </div>
                    {/* Proportional bar */}
                    <div className={cn("w-full bg-white/[0.06] relative overflow-hidden", tier.isFinal ? "h-4" : i === 0 ? "h-3" : "h-2")}>
                      <div
                        className="absolute left-0 top-0 h-full"
                        style={{
                          width: barsRevealed ? `${tier.pct}%` : '0%',
                          background: tier.barColor,
                          boxShadow: tier.isFinal ? '0 0 12px rgba(212,175,55,0.35)' : i === 0 ? '0 0 8px rgba(212,175,55,0.15)' : 'none',
                          transition: `width 500ms cubic-bezier(0.16,1,0.3,1)`,
                          transitionDelay: `${tier.isFinal ? 1200 : i * 150}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* Mid-waterfall CTA — capture intent at emotional peak */}
                <div className="border-t border-white/[0.06] px-5 py-6 text-center">
                  <button onClick={handleStartClick}
                    className="w-full max-w-[320px] h-14 text-base btn-cta-primary mx-auto">
                    WHAT DOES YOUR DEAL LOOK LIKE?
                  </button>
                </div>
              </div>
            </div>
          </SectionFrame>

          <Divider />

          {/* ──────────────────────────────────────────────────────────
               § 3  THE THESIS — stacked manifesto + Blum quote
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="mission">
            <div ref={revMission.ref} className={cn("transition-all duration-700 ease-out", revMission.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
              <SectionHeader eyebrow="The Thesis" title={<>FILM AS AN ALTERNATIVE{"\u00A0"}ASSET{"\u00A0"}<span className="text-white">CLASS</span></>} flankingLines compact />

              {/* Stacked manifesto */}
              <div className="max-w-md mx-auto">
                <div className="relative bg-white/[0.04] border border-white/[0.10] overflow-hidden">
                  {/* Gold left accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.55), rgba(212,175,55,0.25), transparent)' }} />
                  <div className="p-7 md:p-9 pl-8 md:pl-10 space-y-5">
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
                        style={{ transitionDelay: revMission.visible ? `${400 + i * 150}ms` : '0ms' }}
                      >
                        <Check className="w-3.5 h-3.5 text-gold/50 flex-shrink-0 relative top-[2px]" />
                        <p className="text-white/60 text-[15px] leading-relaxed">
                          <span className="text-white/80 font-semibold">{row.asset}</span> has {row.tool}.
                        </p>
                      </div>
                    ))}
                    {/* The punchline — standalone row matching asset class rows */}
                    <div
                      className={cn(
                        "flex items-baseline gap-3 mt-2 transition-all duration-500 ease-out",
                        revMission.visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                      )}
                      style={{ transitionDelay: revMission.visible ? '850ms' : '0ms' }}
                    >
                      <X className="w-4 h-4 text-white/50 flex-shrink-0 relative top-[2px]" />
                      <p className="font-bebas text-[22px] md:text-[26px] tracking-[0.06em] text-gold leading-tight">
                        Film has no standardized framework.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </SectionFrame>

          {/* ── TRANSITION — thesis to validation ── */}
          <section className="py-10 md:py-14 px-6 relative">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)' }} />
            <div
              ref={revUntilNow.ref}
              className={cn(
                "max-w-md mx-auto text-center transition-all duration-700 ease-out",
                revUntilNow.visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
              )}
            >
              <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-8" />
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
              <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent mt-8" />
            </div>
          </section>

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
                className="relative bg-gold/[0.08] border-2 border-gold/45 overflow-hidden"
                style={{ boxShadow: '0 0 40px rgba(212,175,55,0.12), 0 8px 32px rgba(212,175,55,0.06), inset 0 1px 0 rgba(212,175,55,0.15)' }}
              >
                {/* Gold left accent — strong */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.80), rgba(212,175,55,0.40), transparent)' }} />
                <div className="p-5 md:p-7 pl-6 md:pl-9">
                  {/* Opening quote mark */}
                  <div className="font-bebas text-[48px] md:text-[60px] leading-none select-none pointer-events-none text-gold/55 -mb-4 -ml-1"
                    aria-hidden="true">{"\u201C"}</div>
                  <blockquote className="relative z-10">
                    <p className="text-[15px] md:text-base leading-[1.7] text-white/85 italic">
                      Filmmakers have a perception in the business world of being kind of flaky dudes{"\u2026"} you need to be buttoned down{"\u2026"} speak the language that they speak.
                    </p>
                  </blockquote>
                  <div className="mt-4 -mx-1 p-3 bg-gold/[0.12] border border-gold/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-[1.5px] bg-gold/50" />
                      <cite className="not-italic">
                        <span className="font-bebas text-[14px] tracking-[0.14em] uppercase text-gold">Jason Blum</span>
                      </cite>
                    </div>
                    <p className="text-white/50 text-xs tracking-[0.08em] mt-1.5 ml-9">Blumhouse "Paranormal Activity"</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
               DECLARATION — the hinge between problem and gatekeepers
             ────────────────────────────────────────────────────────── */}
          <section className="py-10 md:py-16 px-6 relative">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(212,175,55,0.07) 0%, transparent 70%)' }} />
            <div ref={revDecl.ref} className={cn("max-w-md mx-auto relative transition-all duration-700 ease-out", revDecl.visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.96]")}>
              <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
              <div className="py-12 px-4 text-center">
                <h3 className="font-bebas text-[32px] md:text-[40px] tracking-[0.08em] uppercase text-gold leading-tight">
                  We Built The Toolkit They Didn{"\u2019"}t Teach You In Film{"\u00A0"}<span className="text-white">School</span>.
                </h3>
              </div>
              <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
              <div className="flex justify-center mt-6 cursor-pointer active:scale-[0.97]"
                onClick={() => document.getElementById('cost')?.scrollIntoView({ behavior: 'smooth' })}>
                <ChevronDown className="w-5 h-5 text-gold/50 animate-bounce-subtle" />
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
               § 5  CLOSED DOORS — the reality of what exists
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="cost">
            <div ref={revCost.ref} className={cn("transition-all duration-700 ease-out", revCost.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
              <SectionHeader eyebrow="The Reality" title={<>THE GATEKEEPERS WON{"\u2019"}T LET YOU <span className="text-white">IN.</span></>} flankingLines compact />

              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                {closedDoors.map((door, i) => (
                  <div
                    key={door.name}
                    className={cn(
                      "relative border p-4 md:p-6 transition-all duration-700 ease-out overflow-hidden",
                      "bg-white/[0.06] border-white/[0.12]",
                      revCost.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                    style={{
                      transitionDelay: revCost.visible ? `${i * 150}ms` : '0ms',
                    }}
                  >
                    {/* Gold left elbow */}
                    <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                      style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.55), rgba(212,175,55,0.25), transparent)' }}
                    />
                    <div className="pl-2">
                      <p className="font-bebas text-[17px] md:text-[20px] tracking-[0.08em] uppercase leading-tight text-white mb-2">
                        {door.name}
                      </p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[15px] font-bold text-gold">
                          {door.cost}
                        </span>
                        <LockKeyhole
                          className="w-4 h-4 text-gold/70"
                          strokeWidth={2.5}
                        />
                      </div>
                      <p className="text-sm leading-relaxed text-white/60">
                        {door.lock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionFrame>

          {/* ── TRANSITION — gatekeepers to arsenal hinge ── */}
          <section className="py-10 md:py-14 px-6 relative">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)' }} />
            <div
              ref={revTransition.ref}
              className={cn(
                "max-w-md mx-auto text-center transition-all duration-700 ease-out",
                revTransition.visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
              )}
            >
              <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-8" />
              <p
                className="font-bebas text-[40px] md:text-[50px] tracking-[0.06em] text-gold"
                style={{
                  textShadow: revTransition.visible
                    ? '0 0 30px rgba(212,175,55,0.4), 0 0 60px rgba(212,175,55,0.15)'
                    : 'none',
                }}
              >
                Level the Playing{"\u00A0"}<span className="text-white">Field</span>.
              </p>
              <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent mt-8" />
              <div className="flex justify-center mt-6 cursor-pointer active:scale-[0.97]"
                onClick={() => document.getElementById('arsenal')?.scrollIntoView({ behavior: 'smooth' })}>
                <ChevronDown className="w-6 h-6 text-gold animate-bounce-subtle" />
              </div>
            </div>
          </section>

          {/* ── § 6  THE ARSENAL ── */}
          <section id="arsenal" className="py-8 md:py-12 px-6">
            <div
              ref={revArsenal.ref}
              className={cn(
                "max-w-md mx-auto transition-all duration-700 ease-out",
                revArsenal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <div
                className="relative bg-white/[0.04] border border-white/[0.10] overflow-hidden"
                style={{ boxShadow: '0 0 20px rgba(212,175,55,0.08)' }}
              >
                {/* Gold left accent */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.55), rgba(212,175,55,0.25), transparent)' }} />
                <div className="p-7 md:p-10 pl-8 md:pl-10 text-center">
                  <p className="text-white/50 text-xs tracking-[0.3em] uppercase font-semibold mb-4">What You Get</p>
                  <h3 className="font-bebas text-[28px] md:text-[34px] tracking-[0.08em] uppercase text-gold leading-tight mb-4">
                    The Arsenal
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto">
                    Institutional-grade deal tools. Built for independent producers who can{"\u2019"}t afford to learn the hard way.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────
               § 7  THE PATH — gold bar product ladder + CTA
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="path">
            <div ref={revPath.ref} className={cn("transition-all duration-700 ease-out", revPath.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
              <SectionHeader eyebrow="Inside The Arsenal" title={<>NO <span className="text-white">GUESSWORK.</span></>} flankingLines compact />

              <p className="text-center text-white/50 text-sm mb-8 max-w-sm mx-auto">
                Whether you&rsquo;re modeling your first deal or walking into a meeting with real&nbsp;capital, there&rsquo;s a tier built for&nbsp;you.
              </p>

              {/* Product cards */}
              <div ref={ladderRef} className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                {productTiers.map((t, i) => (
                  <div
                    key={t.tier}
                    className={cn(
                      "relative border overflow-hidden p-5 md:p-7 transition-all duration-600 ease-out",
                      t.featured
                        ? "border-gold/60 bg-gold/[0.10] scale-[1.04]"
                        : t.elevated
                          ? "border-gold/30 bg-white/[0.05]"
                          : "border-white/[0.10] bg-white/[0.04]",
                      revPath.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                    )}
                    style={{
                      transitionDelay: revPath.visible ? `${i * 150}ms` : '0ms',
                      ...(t.featured ? { boxShadow: '0 0 40px rgba(212,175,55,0.12), 0 12px 40px rgba(212,175,55,0.08), inset 0 1px 0 rgba(212,175,55,0.20)' } : {}),
                    }}
                  >
                    {/* Gold left accent — all cards get one, featured is stronger */}
                    <div className={cn(
                      "absolute left-0 top-0 bottom-0 w-[3px]",
                    )}
                      style={{
                        background: t.featured
                          ? 'linear-gradient(to bottom, rgba(212,175,55,0.80), rgba(212,175,55,0.40), transparent)'
                          : t.elevated
                            ? 'linear-gradient(to bottom, rgba(212,175,55,0.55), rgba(212,175,55,0.25), transparent)'
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
                      <span className={cn("font-bebas text-[13px] tracking-[0.12em] uppercase", t.tierColor)}>
                        {t.tier}
                      </span>
                      <span className={cn(
                        "font-mono text-[15px] font-semibold",
                        t.featured ? "text-gold" : "text-white/50"
                      )}>
                        {'originalPrice' in t && t.originalPrice && (
                          <span className="text-white/40 line-through mr-1.5 text-[13px]">{t.originalPrice}</span>
                        )}
                        {t.price}
                      </span>
                    </div>
                    <h4 className={cn("font-bebas text-[22px] tracking-[0.10em] uppercase mb-2 pl-1", t.nameColor)}>
                      {t.product}
                    </h4>
                    <p className={cn("text-sm leading-relaxed mb-4 pl-1", t.descColor)}>{t.desc}</p>
                    <button
                      onClick={() => { haptics.light(); i === 0 ? gatedNavigate("/calculator?tab=budget") : navigate("/store"); }}
                      className={cn(
                        "w-full mt-2 font-bebas tracking-[0.10em] uppercase transition-all",
                        t.featured
                          ? "h-12 text-sm btn-cta-primary"
                          : "h-10 text-sm btn-cta-secondary"
                      )}
                    >
                      {i === 0 ? "GET STARTED" : "VIEW PACKAGE"}
                    </button>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center mt-10">
                <button onClick={handleStartClick}
                  className="w-full max-w-[320px] h-14 text-base btn-cta-primary mx-auto">
                  MODEL YOUR FIRST DEAL
                </button>
                <div className="mt-5 flex items-center justify-center gap-4">
                  <button onClick={() => navigate("/store")} className="text-white/40 text-sm hover:text-gold transition-colors">
                    Compare packages <span className="text-gold/70">&rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </SectionFrame>

          <Divider />

          {/* ──────────────────────────────────────────────────────────
               § 8  FAQ
             ────────────────────────────────────────────────────────── */}
          <SectionFrame id="faq">
            <div ref={revFaq.ref} className={cn("max-w-lg mx-auto transition-all duration-700 ease-out", revFaq.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
              <SectionHeader eyebrow="Common Questions" title={<>WHAT FILMMAKERS <span className="text-white">ASK</span></>} flankingLines compact />

              <div className="bg-black px-5 border border-white/[0.06]">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={faq.q} value={`faq-${i}`} className="border-b border-white/[0.08]">
                      <AccordionTrigger className="font-bebas text-lg md:text-xl tracking-[0.08em] uppercase text-gold/80 hover:text-gold hover:no-underline text-left">
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
               § 9  FINAL CTA
             ────────────────────────────────────────────────────────── */}
          <section id="final-cta" className="snap-section py-10 px-6">
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
                <p className="text-white/50 text-xs tracking-[0.3em] uppercase font-semibold mb-5">The Moment of Truth</p>
                <h2 className="font-bebas text-3xl md:text-4xl leading-[1.1] tracking-[0.08em] text-gold mb-5">
                  YOUR INVESTOR WILL ASK<br />HOW THE MONEY FLOWS <span className="text-white">BACK</span>.
                </h2>
                <p className="text-white/55 text-sm leading-relaxed max-w-xs mx-auto mb-8">
                  That meeting shouldn&rsquo;t be the first time you think about your recoupment&nbsp;structure.
                </p>
                <button onClick={handleStartClick}
                  className="w-full max-w-[320px] h-14 text-base btn-cta-final mx-auto">
                  BUILD YOUR WATERFALL
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
                  <Link2 className="w-4 h-4" /><span>Share</span>
                </button>
                <button onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2.5 text-sm tracking-wider text-gold/80 hover:text-gold bg-white/[0.04] hover:bg-white/[0.07] transition-all active:scale-[0.97] py-5 border border-white/[0.12] hover:border-gold/40">
                  {linkCopied ? (
                    <><Check className="w-4 h-4 text-gold" /><span className="text-gold">Copied!</span></>
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
              <p className="text-white/40 text-xs tracking-wide leading-relaxed text-center">
                For educational and informational purposes only. Not legal, tax, or investment advice.
                Consult a qualified entertainment attorney before making financing decisions.
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <button onClick={() => navigate("/terms")} className="text-white/30 text-xs hover:text-white/50 transition-colors">Terms</button>
                <span className="text-white/10">|</span>
                <button onClick={() => navigate("/privacy")} className="text-white/30 text-xs hover:text-white/50 transition-colors">Privacy</button>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
};

export default Index;
