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
import SectionHeader from "@/components/SectionHeader";

const STORAGE_KEY = "filmmaker_og_inputs";
const CINEMATIC_SEEN_KEY = "filmmaker_og_intro_seen";

/* ═══════════════════════════════════════════════════════════════════
   THREE REALITIES — editorial evidence blocks
   ═══════════════════════════════════════════════════════════════════ */
const realities = [
  {
    label: "THE RECOUPMENT GAP",
    body: "They budget the production. They don\u2019t budget the recoupment. CAM fees, sales commissions, debt service, corridor splits, recoupment premiums\u00A0\u2014 the friction between gross receipts and net profits isn\u2019t in the plan.",
    punchline: "Every number in the investor deck is modeled against the wrong\u00A0baseline.",
  },
  {
    label: "NET PROFIT EROSION",
    body: "\u201CNet profits\u201D in a distribution agreement isn\u2019t net. It\u2019s gross minus distribution fees, P&A recoupment, delivery costs, market reserves, and overhead charges.",
    punchline: "By the time standard contractual deductions clear, the margin you projected at greenlight doesn\u2019t\u00A0exist.",
  },
  {
    label: "STRUCTURAL ASYMMETRY",
    body: "Distributors, sales agents, and financiers run waterfall models before every term sheet. They stress-test the capital stack, the recoupment order, and the corridor structure before they sit down. The producer across the table brought a budget topsheet.",
    punchline: "That asymmetry isn\u2019t accidental. It\u2019s on\u00A0purpose.",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   FAQ DATA
   ═══════════════════════════════════════════════════════════════════ */
const faqs = [
  {
    q: "What assumptions does the waterfall use?",
    a: "The simulator models the standard independent film recoupment hierarchy\u00A0\u2014 CAM fees, sales agent commission, senior and mezzanine debt service, equity recoupment with preferred return, and backend profit splits. Benchmarks reflect current market terms for films in the $1M\u2013$10M budget range. Every deal is different. This gives you the structure\u00A0\u2014 your attorney finalizes the numbers."
  },
  {
    q: "Who built this?",
    a: "A producer who spent years learning through expensive mistakes what should have been accessible from day one. Tribeca-winning, CAA-repped, debut sold to Netflix. This tool exists because the waterfall shouldn\u2019t be something you discover for the first time when someone else\u2019s lawyer slides it across the table."
  },
  {
    q: "Is this financial or legal advice?",
    a: "No. This is an educational simulation tool for estimation and planning purposes only. Always consult a qualified entertainment attorney or accountant before making financing decisions."
  },
  {
    q: "What if I want a custom financial model?",
    a: "The simulator gives you the framework. The packages give you the documents. If your deal requires bespoke modeling\u00A0\u2014 complex capital stacks, multi-territory structures, or co-financing arrangements\u00A0\u2014 reach out. That\u2019s what we do."
  },
];

/* ═══════════════════════════════════════════════════════════════════
   WATERFALL TIERS — 7-row dollar-amount cascade ($3M → $417K)
   ═══════════════════════════════════════════════════════════════════ */
const waterfallTiers = [
  { name: "Acquisition Price",  amount: "$3,000,000",   barWidth: 100.0 },
  { name: "CAM Fees",           amount: "−$22,500",     barWidth: 99.3  },
  { name: "Sales Agent",        amount: "−$450,000",    barWidth: 84.3  },
  { name: "Senior Debt",        amount: "−$440,000",    barWidth: 69.6  },
  { name: "Mezzanine",          amount: "−$230,000",    barWidth: 61.9  },
  { name: "Equity Recoupment",  amount: "−$1,440,000",  barWidth: 13.9  },
  { name: "Net Profits",        amount: "$417,500",     barWidth: 13.9  },
];


/* ═══════════════════════════════════════════════════════════════════
   MOTION SYSTEM — easing tokens + one-shot reveal
   ═══════════════════════════════════════════════════════════════════ */
const EASE_REVEAL = 'cubic-bezier(0.16, 1, 0.3, 1)';
const EASE_SCALE  = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
};

/** Countup animation: 0 → target over duration ms */
const useCountUp = (target: number, duration: number, trigger: boolean) => {
  const [value, setValue] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!trigger || hasRun.current) return;
    hasRun.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [trigger, target, duration]);

  return value;
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN INDEX COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const haptics = useHaptics();
  const [linkCopied, setLinkCopied] = useState(false);

  // One-shot reveal refs for each section
  const revealMission = useReveal();
  const revealDeclaration = useReveal();
  const revealProblem = useReveal();
  const revealReality0 = useReveal();
  const revealReality1 = useReveal();
  const revealReality2 = useReveal();
  const revealFlow = useReveal();
  const revealCost = useReveal();
  const revealPath = useReveal();
  const revealFaq = useReveal();
  const realityReveals = [revealReality0, revealReality1, revealReality2];

  // Net Profits countup — triggers after net profits bar appears (~1900ms = 1400ms delay + 500ms bar anim)
  const [countupReady, setCountupReady] = useState(false);
  useEffect(() => {
    if (revealFlow.visible) {
      const t = setTimeout(() => setCountupReady(true), 1900);
      return () => clearTimeout(t);
    }
  }, [revealFlow.visible]);
  const netProfitsCount = useCountUp(417500, 1000, countupReady);

  const savedState = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed?.inputs?.budget > 0) return { budget: parsed.inputs.budget as number, activeTab: parsed.activeTab as string };
    } catch { /* ignore */ }
    return null;
  }, []);

  const isReturningUser = savedState !== null;

  const hasSeenCinematic = useMemo(() => {
    try { return localStorage.getItem(CINEMATIC_SEEN_KEY) === "true"; } catch { return false; }
  }, []);

  const shouldSkip = searchParams.get("skipIntro") === "true" || hasSeenCinematic;

  const [phase, setPhase] = useState<'dark' | 'beam' | 'logo' | 'pulse' | 'tagline' | 'complete'>(shouldSkip ? 'complete' : 'dark');

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
      try { localStorage.setItem(CINEMATIC_SEEN_KEY, "true"); } catch { /* ignore */ }
    }
  }, [phase, hasSeenCinematic]);

  const handleStartClick = () => { haptics.medium(); navigate("/calculator?tab=budget"); };
  const handleContinueClick = () => { haptics.medium(); navigate("/calculator"); };
  const handleStartFresh = () => { haptics.light(); navigate("/calculator?tab=budget&reset=true"); };

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(`${SHARE_TEXT}\n\n${getShareUrl()}`).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }).catch(() => {});
  }, []);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try { await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: getShareUrl() }); return; } catch {}
    }
    handleCopyLink();
  }, [handleCopyLink]);

  const isComplete = phase === 'complete';
  const showBeam = phase !== 'dark' && !shouldSkip;
  const showLogo = (phase !== 'dark' && phase !== 'beam') || shouldSkip;
  const isPulsed = ['pulse', 'tagline', 'complete'].includes(phase) || shouldSkip;
  const showTagline = ['tagline', 'complete'].includes(phase) || shouldSkip;

  return (
    <>
      {isComplete && <Header />}

      <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">

        {/* ═══════ CINEMATIC INTRO (plays once only) ═══════ */}
        {!shouldSkip && (
          <div
            className={cn("fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-1000", isComplete ? "opacity-0 pointer-events-none" : "opacity-100")}
            style={{ backgroundColor: '#000000' }}
          >
            <div className={cn("absolute inset-0 pointer-events-none transition-all duration-1000", showBeam ? "opacity-100" : "opacity-0")}
              style={{ background: `radial-gradient(ellipse 70% 60% at 50% 0%, rgba(212,175,55,0.08) 0%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.01) 60%, transparent 80%)`, clipPath: showBeam ? 'polygon(25% 0%,75% 0%,95% 100%,5% 100%)' : 'polygon(48% 0%,52% 0%,52% 30%,48% 30%)', transition: 'clip-path 1.2s cubic-bezier(0.22,1,0.36,1), opacity 0.8s ease' }} />
            <div className={cn("absolute inset-0 pointer-events-none transition-all duration-1000", showBeam ? "opacity-100" : "opacity-0")}
              style={{ background: `radial-gradient(ellipse 30% 45% at 50% 0%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.15) 30%, rgba(212,175,55,0.05) 50%, transparent 70%)`, clipPath: showBeam ? 'polygon(38% 0%,62% 0%,78% 100%,22% 100%)' : 'polygon(48% 0%,52% 0%,52% 30%,48% 30%)', transition: 'clip-path 1s cubic-bezier(0.22,1,0.36,1) 0.1s, opacity 0.8s ease' }} />
            <div className={cn("absolute inset-0 pointer-events-none transition-opacity duration-1500", showBeam ? "opacity-100" : "opacity-0")}
              style={{ background: `radial-gradient(ellipse 80% 100% at 50% 0%, rgba(212,175,55,0.02) 0%, transparent 60%)` }} />
            <div className={cn("absolute left-1/2 top-1/2 w-[400px] h-[400px] pointer-events-none transition-all duration-700", showLogo ? "opacity-100" : "opacity-0")}
              style={{ background: `radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.03) 50%, transparent 70%)`, transform: 'translate(-50%,-50%)', filter: 'blur(40px)', animation: isPulsed ? 'focal-pulse 3s ease-in-out infinite' : 'none' }} />
            <div className="relative z-10 flex flex-col items-center">
              <div className={cn("relative transition-all duration-1000 ease-out", showLogo ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-6")}>
                <div className={cn("absolute inset-0 -m-4 transition-opacity duration-700", isPulsed ? "opacity-100" : "opacity-0")}
                  style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)', filter: 'blur(15px)' }} />
                <img src={filmmakerLogo} alt="Filmmaker.OG" className="w-32 h-32 object-contain rounded-none relative"
                  style={{ filter: isPulsed ? 'brightness(1.2) drop-shadow(0 0 30px rgba(212,175,55,0.5))' : 'brightness(0.9)', transition: 'filter 0.7s ease' }} />
              </div>
              <p className={cn("mt-8 text-sm tracking-[0.4em] uppercase font-semibold transition-all duration-700", showTagline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3")}
                style={{ color: '#D4AF37', textShadow: '0 0 20px rgba(212,175,55,0.4)' }}>Know Your Numbers</p>
              <div className="mt-6 w-32 h-[2px] overflow-hidden bg-border-subtle rounded-full">
                <div className={cn("h-full bg-gold rounded-full transition-all", showTagline ? "animate-progress-draw" : "")}
                  style={{ boxShadow: '0 0 15px rgba(212,175,55,0.7)', width: showTagline ? undefined : '0%' }} />
              </div>
            </div>
          </div>
        )}

        {/* ═══════ LANDING PAGE ═══════ */}
        <main aria-label="Film Finance Simulator" className={cn("flex-1 flex flex-col transition-all duration-700 scroll-smooth", isComplete ? "opacity-100" : "opacity-0")}>
          <div className="vignette" />

          {/* ── HERO ── */}
          <section id="hero" className="snap-section min-h-0 pt-20 pb-12 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none animate-spotlight-pulse"
              style={{ width: '100vw', height: '120%', background: `radial-gradient(ellipse 50% 50% at 50% 15%, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.04) 45%, transparent 75%)` }} />
            <div className="relative px-6 py-4 max-w-xl mx-auto text-center">
              <div className="mb-5 relative inline-block">
                <div className="absolute inset-0 -m-7 animate-logo-breathe" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)', filter: 'blur(18px)' }} />
                <img src={filmmakerLogo} alt="Filmmaker.OG" className="relative w-[96px] h-[96px] object-contain rounded-none"
                  style={{ filter: 'brightness(1.15) drop-shadow(0 0 28px rgba(212,175,55,0.45))' }} />
              </div>
              <h1 className="font-bebas text-[clamp(2.8rem,9vw,4.2rem)] leading-[1.05] text-gold mb-3">
                SEE WHERE EVERY<br /><span className="text-white">DOLLAR GOES</span>
              </h1>
              <p className="text-text-dim text-sm tracking-[0.18em] uppercase mb-6">
                Built by a Tribeca-winning, CAA-repped producer whose debut sold to&nbsp;Netflix.
              </p>

              {isReturningUser ? (
                <div className="w-full max-w-[320px] mx-auto space-y-3">
                  <button onClick={handleContinueClick}
                    className="w-full h-16 text-base btn-cta-primary">
                    CONTINUE YOUR DEAL
                  </button>
                  <p className="text-text-dim text-xs tracking-wider text-center">{formatCompactCurrency(savedState!.budget)} budget in progress</p>
                  <button onClick={handleStartFresh}
                    className="w-full flex items-center justify-center gap-1.5 text-xs tracking-wider text-text-dim hover:text-text-mid transition-colors py-2">
                    <RotateCcw className="w-3 h-3" /> Start a new deal
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-[320px] mx-auto">
                  <button onClick={handleStartClick}
                    className="w-full h-16 text-base btn-cta-primary">
                    BUILD YOUR WATERFALL
                  </button>
                </div>
              )}

              {/* Scroll indicator — tappable, scrolls to Problem */}
              <div
                className="mt-8 flex justify-center animate-bounce-subtle cursor-pointer active:scale-[0.97]"
                onClick={() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <ChevronDown className="w-5 h-5 text-gold/60" />
              </div>
            </div>
          </section>

          {/* section divider */}
          <div className="px-8"><div className="h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" /></div>

          {/* ── § 2: THESIS — structured comparison with visual elbows ── */}
          <section id="mission" className="py-16 px-6">
            <div ref={revealMission.ref} className="max-w-lg mx-auto text-center">
              <p className="text-white/50 text-xs tracking-[0.3em] uppercase font-semibold mb-3">The Thesis</p>
              <h2 className="font-bebas text-4xl md:text-5xl tracking-[0.08em] text-gold">
                FILM AS AN ALTERNATIVE <span className="text-white">ASSET</span>
              </h2>

              {/* Comparison table — contained card with elbow accents */}
              <div className="max-w-sm mx-auto mt-10">
                <div className="border border-white/[0.08] bg-white/[0.02] relative">
                  {/* top-left elbow accent */}
                  <div className="absolute top-0 left-0 w-5 h-[1px] bg-gold/30" />
                  <div className="absolute top-0 left-0 w-[1px] h-5 bg-gold/30" />
                  {/* top-right elbow accent */}
                  <div className="absolute top-0 right-0 w-5 h-[1px] bg-gold/30" />
                  <div className="absolute top-0 right-0 w-[1px] h-5 bg-gold/30" />
                  {/* bottom-left elbow accent */}
                  <div className="absolute bottom-0 left-0 w-5 h-[1px] bg-gold/30" />
                  <div className="absolute bottom-0 left-0 w-[1px] h-5 bg-gold/30" />
                  {/* bottom-right elbow accent */}
                  <div className="absolute bottom-0 right-0 w-5 h-[1px] bg-gold/30" />
                  <div className="absolute bottom-0 right-0 w-[1px] h-5 bg-gold/30" />

                  <div className="px-6 py-8">
                    {[
                      { asset: "Real Estate", tool: "Comps & Appraisals", delay: 0 },
                      { asset: "Private Equity", tool: "Return Models & Carry Structures", delay: 200 },
                      { asset: "Venture Capital", tool: "Term Sheets & Valuation Frameworks", delay: 400 },
                    ].map((row, idx) => (
                      <div key={row.asset}>
                        <div
                          className={cn("text-center py-3 transition-all", revealMission.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3")}
                          style={{ transitionDuration: '400ms', transitionDelay: revealMission.visible ? `${row.delay}ms` : '0ms', transitionTimingFunction: EASE_REVEAL }}
                        >
                          <p className="font-bebas text-[24px] md:text-[28px] tracking-[0.08em] uppercase text-white/90">{row.asset}</p>
                          <p className="text-sm text-white/50 mt-1">{row.tool}</p>
                        </div>
                        {idx < 2 && (
                          <div
                            className={cn("text-center py-1 transition-all", revealMission.visible ? "opacity-100 scale-100" : "opacity-0 scale-75")}
                            style={{ transitionDuration: '350ms', transitionDelay: revealMission.visible ? `${row.delay + 120}ms` : '0ms' }}
                          >
                            <span className="text-gold/50 text-xl">&darr;</span>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* ≠ disruption */}
                    <div className="my-3">
                      <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
                    </div>
                    <div
                      className={cn("text-center transition-all", revealMission.visible ? "opacity-100 scale-100" : "opacity-0 scale-75")}
                      style={{ transitionDuration: '400ms', transitionDelay: revealMission.visible ? '550ms' : '0ms' }}
                    >
                      <span className="text-gold text-3xl md:text-4xl font-bold" style={{ textShadow: '0 0 12px rgba(212,175,55,0.4)' }}>&ne;</span>
                    </div>
                    <div className="my-3">
                      <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
                    </div>

                    {/* Film row — the gap */}
                    <div
                      className={cn("text-center py-3 transition-all", revealMission.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3")}
                      style={{ transitionDuration: '400ms', transitionDelay: revealMission.visible ? '700ms' : '0ms', transitionTimingFunction: EASE_REVEAL }}
                    >
                      <p className="font-bebas text-[28px] md:text-[34px] tracking-[0.08em] uppercase text-white">Film</p>
                      <p className="text-sm text-white/40 mt-1 italic">Budget Topsheets &amp; Gut Instinct</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blum quote block */}
              <div
                className={cn("mt-10 max-w-sm mx-auto bg-white/[0.04] border-l-[3px] border-gold/40 p-6 md:p-8 text-left transition-all", revealMission.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
                style={{ transitionDuration: '400ms', transitionDelay: revealMission.visible ? '900ms' : '0ms', transitionTimingFunction: EASE_REVEAL }}
              >
                <span className="font-bebas text-[72px] md:text-[96px] leading-none text-gold/20 select-none pointer-events-none block -mb-10 md:-mb-14">&ldquo;</span>
                <p className="italic text-white/80 text-base md:text-lg leading-relaxed">
                  Filmmakers are &ldquo;flaky dudes&rdquo; who don&rsquo;t understand the business side.
                </p>
                <p className="font-bebas text-base tracking-[0.1em] text-gold/60 mt-4">Jason Blum &mdash; Blumhouse</p>
              </div>

            </div>
          </section>

          {/* ── § 3: THREE REALITIES (open — text on black) ── */}
          <section id="problem" className="py-16 px-6">
            <div ref={revealProblem.ref} className="max-w-4xl mx-auto">
              <div className="text-center">
                <SectionHeader eyebrow="The Evidence" title={<>MOST INDIE FILMS <span className="text-white">LOSE MONEY.</span></>} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {realities.map((r, i) => {
                  const rv = realityReveals[i];
                  return (
                    <div
                      ref={rv.ref}
                      key={r.label}
                      className={cn(
                        "p-6 bg-white/[0.05] border border-white/[0.06] transition-all",
                        rv.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      )}
                      style={{ transitionDuration: '450ms', transitionDelay: rv.visible ? `${i * 150}ms` : '0ms', transitionTimingFunction: EASE_REVEAL }}
                    >
                      <h3 className="font-bebas text-[17px] tracking-[0.12em] uppercase" style={{ color: '#D4AF37' }}>
                        {r.label}
                      </h3>
                      <p className="text-white/70 text-[15px] leading-relaxed mt-3">{r.body}</p>
                      {/* Gold rule */}
                      <div className="h-[1px] bg-gradient-to-r from-gold/40 to-transparent mt-4 mb-3" />
                      {/* Punchline — snap cut */}
                      {i === 2 ? (
                        <div
                          className={cn(
                            "border-l-[3px] border-gold/60 pl-4 py-1 transition-opacity",
                            rv.visible ? "opacity-100" : "opacity-0"
                          )}
                          style={{ transitionDuration: '200ms', transitionDelay: rv.visible ? `${i * 150 + 400}ms` : '0ms', transitionTimingFunction: 'step-end' }}
                        >
                          <p className="text-[15px] font-semibold text-white">{r.punchline}</p>
                        </div>
                      ) : (
                        <p
                          className={cn(
                            "text-[15px] font-semibold text-white/90 transition-opacity",
                            rv.visible ? "opacity-100" : "opacity-0"
                          )}
                          style={{ transitionDuration: '200ms', transitionDelay: rv.visible ? `${i * 150 + 400}ms` : '0ms', transitionTimingFunction: 'step-end' }}
                        >{r.punchline}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── DECLARATION — centered hinge between problem and proof ── */}
          <section className="py-10 px-6">
            <div ref={revealDeclaration.ref} className="max-w-md mx-auto">
              {/* Divider above */}
              <div
                className={cn("h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent transition-opacity mb-6", revealDeclaration.visible ? "opacity-100" : "opacity-0")}
                style={{ transitionDuration: '400ms' }}
              />
              {/* Declaration text — centered, balanced */}
              <div
                className={cn("text-center transition-all", revealDeclaration.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3")}
                style={{ transitionDuration: '500ms', transitionDelay: revealDeclaration.visible ? '100ms' : '0ms', transitionTimingFunction: EASE_REVEAL }}
              >
                <p className="font-bebas text-xl md:text-2xl tracking-[0.08em] uppercase text-white/80 leading-snug">
                  We built the arsenal that levels the playing&nbsp;field.
                </p>
                <p className="font-bebas text-sm tracking-[0.14em] uppercase text-gold/50 mt-2">&mdash; FILMMAKER.OG</p>
              </div>
              {/* Divider below */}
              <div
                className={cn("h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent transition-opacity mt-6", revealDeclaration.visible ? "opacity-100" : "opacity-0")}
                style={{ transitionDuration: '400ms' }}
              />
            </div>
          </section>

          {/* ── § 4: HOW THE MONEY FLOWS — visual break from gold-on-black ── */}
          <section id="how-it-flows" className="py-12 px-6 relative">
            {/* Subtle background shift to break monotone */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(212,175,55,0.02) 30%, rgba(212,175,55,0.03) 50%, rgba(212,175,55,0.02) 70%, transparent 100%)' }} />
            <div ref={revealFlow.ref} className={cn("max-w-2xl mx-auto relative transition-all duration-500", revealFlow.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")} style={{ transitionTimingFunction: EASE_REVEAL }}>
              <SectionHeader eyebrow="The Waterfall" title={<>HOW THE MONEY <span className="text-white">FLOWS</span></>} />

              {/* Annotation */}
              <div className="text-center mb-5 max-w-md mx-auto">
                <p className="text-white/50 text-base">A $3M SVOD acquisition.</p>
                <p className="text-white/70 text-base font-medium mt-1">Here&rsquo;s what actually reaches the filmmaker.</p>
              </div>

              {/* Proportional bar visualization */}
              <div className="border border-gold/15 bg-bg-card max-w-md mx-auto overflow-hidden">
                {waterfallTiers.map((tier, i) => {
                  const isFirst = i === 0;
                  const isLast = i === waterfallTiers.length - 1;
                  const isMiddle = !isFirst && !isLast;
                  // Paced cascade: 200ms between rows, net profits delayed
                  const tierDelay = isLast ? 1400 : i * 200;
                  // Gold-tinted bars fading as money disappears, green for Net Profits
                  const barColor = isLast
                    ? ''
                    : isFirst
                      ? 'bg-gold/50'
                      : i <= 2
                        ? 'bg-gold/35'
                        : 'bg-gold/20';

                  return (
                    <div
                      key={tier.name}
                      className={cn(
                        "px-5 transition-opacity",
                        i > 0 && "border-t border-border-subtle",
                        isLast ? "py-5" : "py-4",
                        revealFlow.visible ? "opacity-100" : "opacity-0"
                      )}
                      style={{
                        transitionDuration: '350ms',
                        transitionDelay: revealFlow.visible ? `${tierDelay}ms` : '0ms',
                        ...(isLast ? { background: 'rgba(0,200,83,0.04)' } : {}),
                      }}
                    >
                      {/* Labels row */}
                      <div className="flex justify-between items-baseline mb-2">
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-[11px] text-white/30 tabular-nums">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className={cn(
                            "font-bebas tracking-[0.08em] uppercase leading-none",
                            isLast ? "text-[23px]" : "text-[20px]",
                            isFirst && "text-white",
                            isMiddle && "text-white/80",
                          )}
                          style={isLast ? { color: '#00C853' } : undefined}
                          >
                            {tier.name}
                          </span>
                        </div>
                        <span className={cn(
                          "font-mono font-semibold",
                          isLast ? "text-[22px] font-bold" : "text-[15px]",
                          isFirst && "text-white/80",
                          isMiddle && "text-white/60",
                        )}
                        style={isLast ? { color: '#00C853' } : undefined}
                        >
                          {isLast ? `$${netProfitsCount.toLocaleString()}` : tier.amount}
                        </span>
                      </div>
                      {/* The proportional bar */}
                      <div className={cn("w-full bg-white/[0.04] relative overflow-hidden", isLast ? "h-3" : "h-2")}>
                        <div
                          className={cn("absolute left-0 top-0 h-full transition-all", barColor)}
                          style={{
                            width: revealFlow.visible ? `${tier.barWidth}%` : '0%',
                            transitionDuration: '600ms',
                            transitionDelay: `${tierDelay}ms`,
                            transitionTimingFunction: EASE_REVEAL,
                            ...(isLast ? { background: '#00C853', boxShadow: '0 0 10px rgba(0,200,83,0.35)' } : {}),
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Tagline + CTA — capture intent at emotional peak */}
                <div
                  className={cn("border-t border-gold/15 px-5 py-6 text-center transition-opacity", revealFlow.visible ? "opacity-100" : "opacity-0")}
                  style={{ transitionDuration: '500ms', transitionDelay: revealFlow.visible ? '3200ms' : '0ms' }}
                >
                  <p className="text-[15px] font-medium tracking-wide text-white/50 mb-4">
                    This is the standard waterfall.
                  </p>
                  <button onClick={handleStartClick}
                    className="w-full max-w-[280px] h-12 text-sm btn-cta-primary">
                    WHAT DOES YOUR DEAL LOOK LIKE?
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── § 5: KNOWLEDGE ISN'T CHEAP + PRODUCT TIERS (merged) ── */}
          <SectionFrame id="price-anchor">
            <div ref={revealCost.ref} className={cn("max-w-2xl mx-auto transition-all duration-500", revealCost.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")} style={{ transitionTimingFunction: EASE_REVEAL }}>
              <SectionHeader eyebrow="The Industry Standard" title={<>KNOWLEDGE ISN'T <span className="text-white">CHEAP</span></>} />

              {/* Cost comparison cards */}
              <div className="max-w-sm mx-auto">
                <div
                  className={cn("grid grid-cols-2 gap-3 transition-all", revealCost.visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.92]")}
                  style={{ transitionDuration: '400ms', transitionTimingFunction: EASE_SCALE }}
                >
                  <div className="border border-gold/15 bg-bg-card p-5 text-center">
                    <p className="font-mono text-xl font-semibold text-gold/80">$5K–$15K</p>
                    <p className="text-white/50 text-sm tracking-wider uppercase mt-1.5">Entertainment Attorney</p>
                  </div>
                  <div className="border border-gold/15 bg-bg-card p-5 text-center">
                    <p className="font-mono text-xl font-semibold text-gold/80">$2K–$5K</p>
                    <p className="text-white/50 text-sm tracking-wider uppercase mt-1.5">Producing Consultant</p>
                  </div>
                </div>
                <div
                  className={cn("mt-3 border-2 border-gold/30 bg-bg-card p-8 text-center relative overflow-hidden transition-all", revealCost.visible ? "opacity-100 scale-100 animate-glow-pulse" : "opacity-0 scale-[0.92]")}
                  style={{ transitionDuration: '400ms', transitionDelay: revealCost.visible ? '250ms' : '0ms', transitionTimingFunction: EASE_SCALE }}
                >
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)' }} />
                  <p className="font-mono text-3xl md:text-4xl font-bold text-gold relative">$50K–$200K</p>
                  <p className="text-white/50 text-xs tracking-[0.2em] uppercase mt-3 relative">Film School</p>
                </div>
                <div
                  className={cn("mt-3 border border-gold/15 bg-bg-card p-5 text-center transition-all", revealCost.visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.92]")}
                  style={{ transitionDuration: '400ms', transitionDelay: revealCost.visible ? '500ms' : '0ms', transitionTimingFunction: EASE_SCALE }}
                >
                  <p className="font-mono text-xl font-semibold text-gold/80">3–5 Years</p>
                  <p className="text-white/50 text-sm tracking-wider uppercase mt-1.5">Trial and Error</p>
                </div>
              </div>
            </div>
          </SectionFrame>

          {/* section divider */}
          <div className="px-8"><div className="h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" /></div>

          {/* ── § 6: THE PATH — Stacked product tiers with prices ── */}
          <SectionFrame id="the-path">
            <div ref={revealPath.ref} className={cn("max-w-2xl mx-auto transition-all duration-500", revealPath.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")} style={{ transitionTimingFunction: EASE_REVEAL }}>
              <SectionHeader eyebrow="The Path" title={<>YOUR <span className="text-white">MOVE.</span></>} />

              <div
                className={cn("text-center mb-8 transition-all", revealPath.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[10px]")}
                style={{ transitionDuration: '400ms', transitionTimingFunction: EASE_REVEAL }}
              >
                <p className="font-bebas text-xl md:text-2xl tracking-[0.10em] uppercase text-white/60">
                  Your deal&ensp;&middot;&ensp;Your numbers&ensp;&middot;&ensp;Your&nbsp;leverage
                </p>
              </div>

              {/* Product tiers — stacked, tappable, with prices */}
              <div className="max-w-sm mx-auto space-y-3">
                {/* Tier 1: Free */}
                <div
                  className={cn("transition-all cursor-pointer group", revealPath.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
                  style={{ transitionDuration: '400ms', transitionTimingFunction: EASE_REVEAL }}
                  onClick={handleStartClick}
                >
                  <div className="border border-border-subtle bg-bg-card p-5 flex items-center justify-between gap-4 group-hover:border-gold/30 group-active:scale-[0.99] transition-all">
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Vertical accent bar */}
                      <div className="w-1 self-stretch bg-gold/25 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bebas text-[13px] tracking-[0.15em] uppercase text-white/40">Courtesy</p>
                        <p className="font-semibold text-[15px] text-white/80">Waterfall Simulator</p>
                        <p className="text-xs text-white/40 mt-0.5">Model your deal. See where every dollar goes.</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-mono text-lg font-bold text-white/70">Free</p>
                    </div>
                  </div>
                </div>

                {/* Tier 2: The Blueprint */}
                <div
                  className={cn("transition-all cursor-pointer group", revealPath.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
                  style={{ transitionDuration: '400ms', transitionDelay: revealPath.visible ? '150ms' : '0ms', transitionTimingFunction: EASE_REVEAL }}
                  onClick={() => navigate("/store")}
                >
                  <div className="border border-gold/20 bg-bg-card p-5 flex items-center justify-between gap-4 group-hover:border-gold/40 group-active:scale-[0.99] transition-all">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-1 self-stretch bg-gold/45 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bebas text-[13px] tracking-[0.15em] uppercase" style={{ color: 'rgba(212,175,55,0.60)' }}>Premium</p>
                        <p className="font-semibold text-[15px] text-white/90">The Blueprint</p>
                        <p className="text-xs text-white/40 mt-0.5">Your complete finance plan, documented.</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-mono text-lg font-bold text-gold/80">$197</p>
                    </div>
                  </div>
                </div>

                {/* Tier 3: The Pitch Package — featured */}
                <div
                  className={cn("transition-all cursor-pointer group", revealPath.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
                  style={{ transitionDuration: '400ms', transitionDelay: revealPath.visible ? '300ms' : '0ms', transitionTimingFunction: EASE_REVEAL }}
                  onClick={() => navigate("/store")}
                >
                  <div className="border-2 border-gold/35 bg-bg-card p-5 flex items-center justify-between gap-4 relative overflow-hidden group-hover:border-gold/50 group-active:scale-[0.99] transition-all">
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 70%)' }} />
                    <div className="flex items-center gap-4 min-w-0 relative">
                      <div className="w-1 self-stretch flex-shrink-0" style={{ background: '#D4AF37', boxShadow: '0 0 6px rgba(212,175,55,0.3)' }} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bebas text-[13px] tracking-[0.15em] uppercase text-gold">Investment Grade</p>
                          <span className="text-[10px] tracking-wider uppercase bg-gold/10 text-gold/80 px-1.5 py-0.5">Save $200</span>
                        </div>
                        <p className="font-semibold text-[15px] text-white">The Pitch Package</p>
                        <p className="text-xs text-white/50 mt-0.5">Presentation-ready for the room.</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 relative">
                      <p className="font-mono text-xs text-white/40 line-through">$697</p>
                      <p className="font-mono text-xl font-bold text-gold">$497</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom CTA — for the free path */}
              <div className="text-center mt-8">
                <button onClick={handleStartClick}
                  className="w-full max-w-[320px] h-14 text-sm btn-cta-primary">
                  BUILD YOUR WATERFALL &mdash; FREE
                </button>
              </div>
            </div>
          </SectionFrame>

          {/* section divider: Path → FAQ */}
          <div className="px-8"><div className="h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" /></div>

          {/* ── § 7: FAQ ── */}
          <SectionFrame id="faq">
            <div ref={revealFaq.ref} className={cn("max-w-2xl mx-auto transition-all duration-500", revealFaq.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")} style={{ transitionTimingFunction: EASE_REVEAL }}>
              <SectionHeader eyebrow="Common Questions" title={<>WHAT FILMMAKERS <span className="text-white">ASK</span></>} />
              <div className="bg-bg-card rounded-none px-5 border border-border-subtle">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={faq.q} value={`faq-${i}`}>
                      <AccordionTrigger className="font-bebas text-[22px] tracking-[0.06em] uppercase text-gold hover:text-gold/70 hover:no-underline text-left">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-white/70 text-[15px] leading-relaxed normal-case font-sans">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </SectionFrame>

          {/* section divider */}
          <div className="px-8"><div className="h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" /></div>

          {/* ── FINAL CTA ── */}
          <section id="final-cta" className="snap-section py-8 px-4">
            <div className="flex rounded-none overflow-hidden border border-white/[0.06]">
              <div className="w-1 flex-shrink-0 bg-gradient-to-b from-gold via-gold/60 to-gold/20" style={{ boxShadow: '0 0 16px rgba(212,175,55,0.30)' }} />
              <div className="bg-transparent flex-1 min-w-0 overflow-hidden relative">
                <div className="h-[2px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                  style={{ width: '100%', height: '100%', background: `radial-gradient(ellipse 60% 60% at 50% 10%, rgba(212,175,55,0.08) 0%, transparent 70%)` }} />
                <div className="relative p-8 md:p-12 max-w-md mx-auto text-center">
                  <h2 className="font-bebas text-3xl md:text-4xl tracking-[0.08em] text-gold mb-4">
                    INVESTORS WILL ASK HOW THE MONEY FLOWS <span className="text-white">BACK</span>.<br />HAVE THE <span className="text-white">ANSWER</span>.
                  </h2>
                  <p className="text-white/50 text-base leading-relaxed max-w-xs mx-auto mb-6">
                    Your next investor meeting shouldn't be the first time you see your own&nbsp;waterfall.
                  </p>
                  <button onClick={handleStartClick}
                    className="w-full max-w-[320px] h-16 text-base btn-cta-primary">
                    START FREE &mdash; BUILD YOUR WATERFALL
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
                  className="flex items-center justify-center gap-2 text-sm tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 rounded-none border border-white/[0.08] hover:border-gold/30">
                  <Mail className="w-4 h-4" /><span>Email</span>
                </a>
                <a href="https://www.instagram.com/filmmaker.og" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 rounded-none border border-white/[0.08] hover:border-gold/30">
                  <Instagram className="w-4 h-4" /><span>Instagram</span>
                </a>
                <button onClick={handleShare}
                  className="flex items-center justify-center gap-2 text-sm tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 rounded-none border border-white/[0.08] hover:border-gold/30">
                  <Share2 className="w-4 h-4" /><span>Share</span>
                </button>
                <button onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 text-sm tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 rounded-none border border-white/[0.08] hover:border-gold/30">
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
              <p className="text-text-dim/60 text-xs tracking-wide leading-relaxed text-center">
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
