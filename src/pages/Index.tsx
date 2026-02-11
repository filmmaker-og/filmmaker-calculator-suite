import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useHaptics } from "@/hooks/use-haptics";
import {
  RotateCcw,
  DollarSign,
  Layers,
  Handshake,
  BarChart3,
  HelpCircle,
  FileSpreadsheet,
  Presentation,
  BookOpen,
  Check,
  EyeOff,
  Receipt,
  Gavel,
  Calculator,
  Share2,
  Mail,
  Instagram,
  Link2,
  Film,
  Award,
  Waves,
  Lock,
  Quote,
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

const STORAGE_KEY = "filmmaker_og_inputs";
const CINEMATIC_SEEN_KEY = "filmmaker_og_intro_seen";
const SHARE_URL = "https://filmmaker.og";
const SHARE_TEXT = "Free film finance simulator — model your deal structure, capital stack, and revenue waterfall. See where every dollar goes before you sign.";
const SHARE_TITLE = "FILMMAKER.OG — See Where Every Dollar Goes";

/* ═══════════════════════════════════════════════════════════════════
   PROBLEM CARDS — tighter copy, vertical layout
   ═══════════════════════════════════════════════════════════════════ */
const problemCards = [
  { icon: Receipt, title: "There's a pecking order.", body: "Distributors take fees first. Lenders recoup next. Then equity. You're last in line — unless you understand the structure well enough to negotiate your position." },
  { icon: Gavel, title: "The rules exist. Nobody shared them.", body: "Recoupment schedules, fee waterfalls, P&A overages — Hollywood has run this playbook for decades. It's complicated by design, not by accident." },
  { icon: EyeOff, title: "Learn the language. Level the field.", body: "Capital stacks, waterfall structures, producer corridors — the filmmakers who close deals speak this language fluently. Now you can too." },
];

/* ═══════════════════════════════════════════════════════════════════
   FAQ DATA
   ═══════════════════════════════════════════════════════════════════ */
const faqs = [
  { q: "Who is this for?", a: "Independent producers, directors, and investors. Whether you're raising $50K or $5M, the mechanics of recoupment are the same. If you intend to sell your film for profit, you need this." },
  { q: "How does the calculator work?", a: "Four steps: set your budget, build your capital stack, structure your deal, and track exactly where every dollar goes in the waterfall. Takes about 2 minutes." },
  { q: "Is this financial or legal advice?", a: "No. This is a simulation tool for estimation and planning purposes only. Always consult a qualified entertainment attorney or accountant for final deal structures." },
  { q: "Is the calculator free?", a: "Yes. The simulator, waterfall chart, glossary, and unlimited scenarios are completely free. Premium exports — the Excel workbook and investor-ready PDF — are paid add-ons." },
  { q: "What's free vs. paid?", a: "Free: full waterfall simulation, visual chart, deal glossary, and unlimited scenario runs. Paid: downloadable Excel workbook and investor-ready PDF export. The simulation itself has no paywall." },
  { q: "Do I need an account?", a: "No. You can use the calculator without signing up. If you want to save your work, we offer a simple magic link — no password required." },
];

/* ═══════════════════════════════════════════════════════════════════
   HOW IT WORKS STEPS (static — not clickable)
   ═══════════════════════════════════════════════════════════════════ */
const steps = [
  { num: "01", title: "Set Your Budget", desc: "Total production cost plus guild signatories. This is your baseline.", icon: DollarSign },
  { num: "02", title: "Build Your Capital Stack", desc: "Equity, pre-sales, gap, tax incentives — where the money comes from and how each source gets paid back.", icon: Layers },
  { num: "03", title: "Structure Your Deal", desc: "Acquisition price, distribution fees, P&A spend. See how much actually makes it back.", icon: Handshake },
  { num: "04", title: "Track the Recoupment", desc: "Every dollar through the priority chain. Who gets paid first. What's left for you.", icon: Waves },
];

/* ═══════════════════════════════════════════════════════════════════
   SECTION HEADER
   ═══════════════════════════════════════════════════════════════════ */
const SectionHeader = ({ eyebrow, title, subtitle, icon: Icon, plainSubtitle }: {
  eyebrow: string; title: React.ReactNode; subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  plainSubtitle?: boolean;
}) => (
  <div className="text-center mb-8">
    <div className="flex items-center gap-2 justify-center mb-3">
      {Icon && <Icon className="w-5 h-5 text-gold" />}
      <p className="text-text-dim text-xs tracking-[0.3em] uppercase font-semibold">{eyebrow}</p>
    </div>
    <h2 className="font-bebas text-4xl md:text-5xl tracking-[0.08em] text-gold">{title}</h2>
    {subtitle && (
      <p className={cn(
        "text-center max-w-lg mx-auto mt-4 leading-relaxed",
        plainSubtitle
          ? "text-text-mid text-sm"
          : "text-text-mid text-sm px-4 py-2.5 rounded-xl bg-gold/[0.06] border border-gold/20"
      )}>
        {subtitle}
      </p>
    )}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   SECTION FRAME — gold accent border on every section
   ═══════════════════════════════════════════════════════════════════ */
const SectionFrame = ({ id, children, className, alt }: {
  id: string; children: React.ReactNode; className?: string; alt?: boolean;
}) => (
  <section id={id} className="snap-section px-4 py-6">
    <div className="flex rounded-2xl overflow-hidden border border-white/[0.06]">
      <div className="w-1 flex-shrink-0 bg-gradient-to-b from-gold via-gold/60 to-gold/20" style={{ boxShadow: '0 0 12px rgba(212,175,55,0.25)' }} />
      <div className={cn("flex-1 min-w-0", alt ? "bg-bg-surface" : "bg-bg-elevated", className)}>
        <div className="h-[2px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
        <div className="p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════
   SECTION REVEAL — one-shot slide-up (no blur)
   ═══════════════════════════════════════════════════════════════════ */
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

/** Stagger delay style for children within a visible section */
const staggerDelay = (index: number, visible: boolean): React.CSSProperties => ({
  transitionDelay: visible ? `${index * 120}ms` : "0ms",
});

/** Class for stagger-animated child items */
const staggerChild = (visible: boolean) =>
  cn("transition-all duration-600 ease-out", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5");

/* ═══════════════════════════════════════════════════════════════════
   MAIN INDEX COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const haptics = useHaptics();
  const [linkCopied, setLinkCopied] = useState(false);

  // One-shot reveal refs for each section
  const revealProblem = useReveal();
  const revealWaterfall = useReveal();
  const reveal3 = useReveal();
  const revealCosts = useReveal();
  const revealSocial = useReveal();
  const reveal5 = useReveal();
  const reveal6 = useReveal();

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

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try { await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: SHARE_URL }); return; } catch {}
    }
    handleCopyLink();
  }, []);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(`${SHARE_TEXT}\n\n${SHARE_URL}`).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }).catch(() => {});
  }, []);

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
                <img src={filmmakerLogo} alt="Filmmaker.OG" className="w-32 h-32 object-contain rounded-lg relative"
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
        <main className={cn("flex-1 flex flex-col transition-all duration-700 scroll-smooth", isComplete ? "opacity-100" : "opacity-0")}>
          <div className="vignette" />

          {/* ── HERO ── */}
          <section id="hero" className="snap-section min-h-[70vh] flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none animate-spotlight-pulse"
              style={{ width: '100vw', height: '75vh', background: `radial-gradient(ellipse 50% 40% at 50% 10%, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.04) 40%, transparent 70%)` }} />
            <div className="relative px-6 py-4 max-w-xl mx-auto text-center">
              <div className="mb-5 relative inline-block">
                <div className="absolute inset-0 -m-7 animate-logo-breathe" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)', filter: 'blur(18px)' }} />
                <img src={filmmakerLogo} alt="Filmmaker.OG" className="relative w-[96px] h-[96px] object-contain rounded-xl"
                  style={{ filter: 'brightness(1.15) drop-shadow(0 0 28px rgba(212,175,55,0.45))' }} />
              </div>
              <p className="text-text-dim text-sm tracking-[0.35em] uppercase mb-4 font-semibold">Demystifying Film Finance</p>
              <h1 className="font-bebas text-[clamp(2rem,7vw,3.2rem)] leading-[1.05] text-gold mb-4">
                SEE WHERE EVERY<br /><span className="text-white">DOLLAR GOES</span>
              </h1>
              <p className="text-text-mid text-sm font-medium leading-relaxed max-w-sm mx-auto mb-6">
                Know who gets paid first, in what order, and what's left for you. Understand the deal before you sign it.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {[
                  { t: "Break-even clarity", d: "Know what your film must earn before investors recoup." },
                  { t: "Recoupment order", d: "See who gets paid first, and what's left after fees + debt." },
                  { t: "Investor-ready story", d: "Explain the math in plain English without losing confidence." },
                ].map((b) => (
                  <div key={b.t} className="rounded-xl border border-border-subtle bg-bg-card p-4 text-left">
                    <div className="text-gold text-sm font-semibold tracking-wide">{b.t}</div>
                    <div className="text-text-mid text-xs leading-relaxed mt-1">{b.d}</div>
                  </div>
                ))}
              </div>

              {isReturningUser ? (
                <div className="w-full max-w-[320px] mx-auto space-y-3">
                  <button onClick={handleContinueClick}
                    className="w-full h-16 text-base font-bold tracking-[0.14em] transition-all active:scale-[0.96] rounded-md bg-gold/[0.18] border-2 border-gold/50 text-gold animate-cta-glow-pulse hover:border-gold/70 hover:bg-gold/[0.22]">
                    CONTINUE SIMULATION
                  </button>
                  <p className="text-text-dim text-xs tracking-wider text-center">{formatCompactCurrency(savedState!.budget)} budget in progress</p>
                  <button onClick={handleStartFresh}
                    className="w-full flex items-center justify-center gap-1.5 text-xs tracking-wider text-text-dim hover:text-text-mid transition-colors py-2">
                    <RotateCcw className="w-3 h-3" /> Start fresh
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-[320px] mx-auto">
                  <button onClick={handleStartClick}
                    className="w-full h-16 text-base font-bold tracking-[0.14em] transition-all active:scale-[0.96] rounded-md bg-gold/[0.18] border-2 border-gold/50 text-gold animate-cta-glow-pulse hover:border-gold/70 hover:bg-gold/[0.22]">
                    RUN THE CALCULATOR
                  </button>
                </div>
              )}

            </div>
          </section>

          {/* section divider */}
          <div className="px-8"><div className="h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent" /></div>

          {/* ── THE PROBLEM ── */}
          <SectionFrame id="problem">
            <div ref={revealProblem.ref} className={cn("max-w-2xl mx-auto transition-all duration-500 ease-out", revealProblem.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
              <SectionHeader icon={Lock} eyebrow="The Problem" title={<>THE DEAL IS DESIGNED AGAINST <span className="text-white">YOU</span></>} />
              <div className="space-y-3">
                {problemCards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <div key={i} className={cn("flex rounded-xl overflow-hidden border border-border-subtle hover:border-gold/20 transition-colors", staggerChild(revealProblem.visible))} style={staggerDelay(i, revealProblem.visible)}>
                      <div className="w-1 flex-shrink-0 bg-gradient-to-b from-gold via-gold/60 to-gold/20" />
                      <div className="flex-1 bg-bg-card p-5">
                        <div className="flex items-start gap-3 mb-2">
                          <Icon className="w-4 h-4 text-gold flex-shrink-0 mt-1" />
                          <h3 className="font-bebas text-[22px] tracking-[0.06em] uppercase text-gold">{card.title}</h3>
                        </div>
                        <p className="text-text-mid text-sm leading-relaxed pl-7">{card.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionFrame>

          {/* section divider */}
          <div className="px-8"><div className="h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent" /></div>

          {/* ── KNOWLEDGE ISN'T CHEAP — price anchor right after the pain ── */}
          <SectionFrame id="industry-charges">
            <div ref={revealCosts.ref} className={cn("max-w-2xl mx-auto transition-all duration-500 ease-out", revealCosts.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
              <SectionHeader icon={Calculator} eyebrow="Industry Rates" title={<>KNOWLEDGE ISN&apos;T <span className="text-white">CHEAP</span></>} />
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { icon: Gavel, cost: "$5K–$15K", label: "Entertainment Lawyer" },
                  { icon: Calculator, cost: "$10K–$30K", label: "Finance Consultant" },
                  { icon: Handshake, cost: "5–15%", label: "Producer's Rep" },
                  { icon: Film, cost: "10–25%", label: "Sales Agent" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className={cn("rounded-xl border border-border-subtle bg-bg-card p-4 text-center", staggerChild(revealCosts.visible))} style={staggerDelay(i, revealCosts.visible)}>
                      <div className="w-9 h-9 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center mx-auto mb-2">
                        <Icon className="w-4 h-4 text-gold" />
                      </div>
                      <p className="font-mono text-lg font-medium text-text-primary line-through decoration-text-dim/30">{item.cost}</p>
                      <p className="text-text-dim text-xs tracking-wider uppercase mt-0.5">{item.label}</p>
                    </div>
                  );
                })}
              </div>
              <div className="text-center px-6 py-4 rounded-xl bg-gold/[0.06] border border-gold/20 max-w-xs mx-auto">
                <p className="font-bebas text-4xl tracking-[0.1em] text-gold">FREE</p>
                <p className="text-text-dim text-sm tracking-wider mt-1">The same analysis. No catch.</p>
              </div>
            </div>
          </SectionFrame>

          {/* ── THE WATERFALL ── */}
          <SectionFrame id="waterfall-explainer">
            <div ref={revealWaterfall.ref} className={cn("max-w-2xl mx-auto transition-all duration-500 ease-out", revealWaterfall.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
                  <SectionHeader icon={Waves} eyebrow="What They Didn't Teach You In Film School" title={<>FROM FIRST MONEY IN TO LAST MONEY <span className="text-white">OUT</span></>} />
                  <div className="relative flex items-start justify-between max-w-[300px] mx-auto mb-5">
                    <div className="absolute top-[14px] left-[28px] right-[28px] h-[1px] bg-gradient-to-r from-gold/30 via-gold/50 to-gold/30" />
                    {[
                      { icon: DollarSign, label: "Budget" },
                      { icon: Layers, label: "Stack" },
                      { icon: Handshake, label: "Deal" },
                      { icon: Waves, label: "Waterfall" },
                    ].map((s) => {
                      const StepIcon = s.icon;
                      return (
                        <div key={s.label} className="relative flex flex-col items-center gap-1.5 w-[56px]">
                          <div className="w-7 h-7 rounded-full bg-bg-card border border-gold/40 flex items-center justify-center">
                            <StepIcon className="w-3 h-3 text-gold" />
                          </div>
                          <span className="text-xs text-text-dim tracking-wider">{s.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-text-mid text-sm leading-relaxed text-center max-w-xs mx-auto">
                    Most filmmakers have never seen one. The <span className="text-gold font-semibold">waterfall</span> determines who gets paid back, in what order, and how much. It's the key to package financing.
                  </p>
                  <button onClick={() => navigate('/waterfall-info')}
                    className="block mx-auto mt-5 px-6 py-2.5 text-sm font-semibold tracking-[0.15em] uppercase transition-all rounded-md bg-gold/[0.04] border border-gold/25 text-gold hover:bg-gold/[0.08] hover:border-gold/40 active:scale-[0.97]">
                    LEARN MORE &rarr;
                  </button>
            </div>
          </SectionFrame>

          {/* section divider */}
          <div className="px-8"><div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" /></div>

          {/* ── HOW IT WORKS ── */}
          <SectionFrame id="how-it-works" alt>
            <div ref={reveal3.ref} className={cn("max-w-2xl mx-auto transition-all duration-500 ease-out", reveal3.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
              <SectionHeader icon={Film} eyebrow="How It Works" title={<>YOUR DEAL IN FOUR <span className="text-white">STEPS</span></>} subtitle="No finance degree required." plainSubtitle />
              <div className="space-y-3">
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.num} className={staggerChild(reveal3.visible)} style={staggerDelay(i, reveal3.visible)}>
                      <div className="flex rounded-xl overflow-hidden border border-border-subtle hover:border-gold/20 transition-colors">
                        <div className="w-1 flex-shrink-0 bg-gradient-to-b from-gold via-gold/60 to-gold/20" />
                        <div className="flex-1 bg-bg-card p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-xs text-gold/60 tracking-wider">{step.num}</span>
                            <Icon className="w-4 h-4 text-gold" />
                            <h3 className="font-bebas text-[22px] tracking-[0.06em] uppercase text-gold">{step.title}</h3>
                          </div>
                          <p className="text-text-mid text-sm leading-relaxed pl-7">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-xl bg-gold/[0.06] border border-gold/20 px-5 py-4">
                <p className="text-gold text-xs tracking-[0.2em] uppercase font-semibold">Assumptions (plain English)</p>
                <ul className="mt-3 space-y-2 text-text-mid text-sm leading-relaxed">
                  <li>Percent fees are applied to gross revenue before recoupment.</li>
                  <li>Marketing is treated as a fixed expense cap (not a percentage).</li>
                  <li>Tax credits reduce the amount that must be recouped (they don't magically increase revenue).</li>
                </ul>
              </div>

              {/* Mid-page CTA — catch fast deciders */}
              <div className="text-center mt-5 -mb-2">
                <button onClick={handleStartClick}
                  className="h-16 px-10 text-base font-bold tracking-[0.14em] transition-all active:scale-[0.96] rounded-md bg-gold/[0.14] border-2 border-gold/40 text-gold shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:border-gold/60 hover:bg-gold/[0.18]">
                  RUN THE CALCULATOR
                </button>
              </div>
            </div>
          </SectionFrame>

          {/* section divider */}
          <div className="px-8"><div className="h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent" /></div>

          {/* ── SOCIAL PROOF ── */}
          <SectionFrame id="social-proof">
            <div ref={revealSocial.ref} className={cn("max-w-2xl mx-auto transition-all duration-500 ease-out", revealSocial.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
              <SectionHeader icon={Quote} eyebrow="From The Community" title={<>FILMMAKERS WHO <span className="text-white">RAN THE NUMBERS</span></>} />
              <div className="space-y-3">
                {[
                  { quote: "I had no idea my equity investors were fourth in line. This showed me the whole picture before I signed anything.", name: "Sarah M.", role: "Independent Producer" },
                  { quote: "We used the waterfall sim to restructure our gap financing. Saved us from a deal that would have left us with nothing.", name: "James T.", role: "First-time Director" },
                  { quote: "Finally, a tool that speaks producer — not banker. I use it on every project now.", name: "David R.", role: "Line Producer" },
                ].map((t, i) => (
                  <div key={i} className={cn("rounded-xl border border-border-subtle bg-bg-card p-5", staggerChild(revealSocial.visible))} style={staggerDelay(i, revealSocial.visible)}>
                    <Quote className="w-4 h-4 text-gold/40 mb-2" />
                    <p className="text-text-mid text-sm leading-relaxed italic mb-3">{t.quote}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-gold text-sm font-semibold">{t.name}</span>
                      <span className="text-text-dim text-xs tracking-wider">{t.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionFrame>

          {/* section divider */}
          <div className="px-8"><div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" /></div>

          {/* ── WHAT YOU GET (tight receipt) ── */}
          <SectionFrame id="deliverables" alt>
            <div ref={reveal5.ref} className={cn("max-w-2xl mx-auto transition-all duration-500 ease-out", reveal5.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
              <SectionHeader icon={Award} eyebrow="The Deliverables" title={<>WHAT YOU WALK AWAY <span className="text-white">WITH</span></>} />

              {/* Free tier */}
              <p className="text-text-dim text-xs tracking-[0.2em] uppercase font-semibold mb-2">Free — always</p>
              <div className="rounded-xl border border-border-subtle bg-bg-card overflow-hidden divide-y divide-border-subtle mb-4">
                {[
                  { icon: BarChart3, line: "Visual waterfall chart — who gets paid, in what order" },
                  { icon: BookOpen, line: "Full glossary — every deal term in plain English" },
                  { icon: Waves, line: "Unlimited scenarios — adjust the variables, re-run as often as you want" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className={cn("flex items-center gap-3 px-5 py-3.5", staggerChild(reveal5.visible))} style={staggerDelay(i, reveal5.visible)}>
                      <Icon className="w-4 h-4 text-gold flex-shrink-0" />
                      <p className="text-text-mid text-sm leading-snug">{item.line}</p>
                    </div>
                  );
                })}
              </div>

              {/* Premium tier */}
              <p className="text-text-dim text-xs tracking-[0.2em] uppercase font-semibold mb-2">Premium exports</p>
              <div className="rounded-xl border border-gold/20 bg-bg-card overflow-hidden divide-y divide-border-subtle">
                {[
                  { icon: FileSpreadsheet, line: "6-sheet Excel workbook — waterfall, capital stack, investor returns" },
                  { icon: Presentation, line: "Investor-ready PDF — plain language, zero jargon" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className={cn("flex items-center gap-3 px-5 py-3.5", staggerChild(reveal5.visible))} style={staggerDelay(i + 3, reveal5.visible)}>
                      <Icon className="w-4 h-4 text-gold flex-shrink-0" />
                      <p className="text-text-mid text-sm leading-snug">{item.line}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionFrame>

          {/* section divider */}
          <div className="px-8"><div className="h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent" /></div>

          {/* ── FAQ ── */}
          <SectionFrame id="faq">
            <div ref={reveal6.ref} className={cn("max-w-2xl mx-auto transition-all duration-500 ease-out", reveal6.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
              <SectionHeader icon={HelpCircle} eyebrow="Common Questions" title={<>WHAT FILMMAKERS <span className="text-white">ASK</span></>} subtitle="Straight answers. No jargon." plainSubtitle />
              <div className="bg-bg-card rounded-xl px-5 border border-border-subtle">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={faq.q} value={`faq-${i}`} className="border-border-subtle">
                      <AccordionTrigger className="text-text-primary hover:text-text-mid hover:no-underline text-base font-medium text-left">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-text-dim text-sm leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </SectionFrame>

          {/* ── FINAL CTA ── */}
          <section id="final-cta" className="snap-section py-8 px-4">
            <div className="flex rounded-2xl overflow-hidden border border-white/[0.06]">
              <div className="w-1 flex-shrink-0 bg-gradient-to-b from-gold via-gold/60 to-gold/20" style={{ boxShadow: '0 0 12px rgba(212,175,55,0.25)' }} />
              <div className="bg-bg-elevated flex-1 min-w-0 overflow-hidden relative">
                <div className="h-[2px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                  style={{ width: '100%', height: '100%', background: `radial-gradient(ellipse 60% 60% at 50% 10%, rgba(212,175,55,0.08) 0%, transparent 70%)` }} />
                <div className="relative p-8 md:p-12 max-w-md mx-auto text-center">
                  <h2 className="font-bebas text-3xl md:text-4xl tracking-[0.08em] text-gold mb-4">
                    STOP GUESSING.<br />START <span className="text-white">CLOSING</span>.
                  </h2>
                  <p className="text-text-mid text-sm leading-relaxed max-w-xs mx-auto mb-6">
                    Two minutes. Zero cost. Full clarity on your deal.
                  </p>
                  <button onClick={handleStartClick}
                    className="w-full max-w-[320px] h-16 text-base font-bold tracking-[0.14em] transition-all active:scale-[0.96] rounded-md bg-gold/[0.14] border-2 border-gold/40 text-gold shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:border-gold/60 hover:bg-gold/[0.18]">
                    RUN THE CALCULATOR
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="py-10 px-6">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-8" />
            <div className="max-w-sm mx-auto">
              <div className="grid grid-cols-2 gap-3 mb-8 max-w-[340px] mx-auto">
                <a href="mailto:thefilmmaker.og@gmail.com"
                  className="flex items-center justify-center gap-2 text-sm tracking-wider text-gold/70 hover:text-gold transition-colors py-3.5 rounded-lg border border-white/[0.08] hover:border-gold/30">
                  <Mail className="w-4 h-4" /><span>Email</span>
                </a>
                <a href="https://www.instagram.com/filmmaker.og" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm tracking-wider text-gold/70 hover:text-gold transition-colors py-3.5 rounded-lg border border-white/[0.08] hover:border-gold/30">
                  <Instagram className="w-4 h-4" /><span>Instagram</span>
                </a>
                <button onClick={handleShare}
                  className="flex items-center justify-center gap-2 text-sm tracking-wider text-gold/70 hover:text-gold transition-colors py-3.5 rounded-lg border border-white/[0.08] hover:border-gold/30">
                  <Share2 className="w-4 h-4" /><span>Share</span>
                </button>
                <button onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 text-sm tracking-wider text-gold/70 hover:text-gold transition-colors py-3.5 rounded-lg border border-white/[0.08] hover:border-gold/30">
                  {linkCopied ? (
                    <><Check className="w-4 h-4 text-green-400" /><span className="text-green-400">Copied!</span></>
                  ) : (
                    <><Link2 className="w-4 h-4" /><span>Copy Link</span></>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="font-bebas text-3xl tracking-[0.2em] text-gold">
                  FILMMAKER<span className="text-white">.OG</span>
                </span>
                <span className="text-xs font-semibold tracking-[0.15em] text-gold border border-gold/40 rounded-full px-2 py-1 leading-none uppercase">
                  BETA
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
