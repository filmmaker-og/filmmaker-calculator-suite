import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useHaptics } from "@/hooks/use-haptics";
import {
  RotateCcw,
  DollarSign,
  Layers,
  Handshake,
  BarChart3,
  ChevronDown,
  HelpCircle,
  FileSpreadsheet,
  Presentation,
  BookOpen,
  Check,
  Scale,
  EyeOff,
  Receipt,
  Gavel,
  Calculator,
  UserCheck,
  Briefcase,
  Share2,
  Mail,
  Instagram,
  Link2,
  Clapperboard,
  Film,
  Award,
  AlertTriangle,
  Waves,
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
   INDUSTRY COST COMPARISON
   ═══════════════════════════════════════════════════════════════════ */
const industryCosts = [
  { icon: Gavel, label: "Entertainment Lawyer", cost: "$5K–$15K", note: "Per deal analysis" },
  { icon: Calculator, label: "Finance Consultant", cost: "$10K–$30K", note: "Financial modeling" },
  { icon: UserCheck, label: "Producer's Rep", cost: "5–10%", note: "Percentage of deal" },
  { icon: Briefcase, label: "Sales Agent", cost: "10–25%", note: "Of gross revenue" },
];

/* ═══════════════════════════════════════════════════════════════════
   FAQ DATA
   ═══════════════════════════════════════════════════════════════════ */
const faqs = [
  { q: "Who is this for?", a: "Independent producers, directors, and investors. Whether you're raising $50K or $5M, the mechanics of recoupment are the same. If you intend to sell your film for profit, you need this." },
  { q: "How does the calculator work?", a: "Four steps: set your budget, build your capital stack, model an acquisition deal, and see exactly where every dollar goes in the waterfall. It takes about 2 minutes." },
  { q: "Is this financial or legal advice?", a: "No. This is a simulation tool for estimation and planning purposes only. Always consult a qualified entertainment attorney or accountant for final deal structures." },
  { q: 'What is a "waterfall"?', a: "A waterfall is the priority order in which revenue from your film is distributed — who gets paid first, second, and last. Most filmmakers make deals without ever seeing how the money flows back.", link: { label: "Learn more on Wikipedia", url: "https://en.wikipedia.org/wiki/Hollywood_accounting" } },
  { q: "Is the calculator free?", a: "Yes, the simulation is completely free. Run as many scenarios as you want, adjust the variables, and see different outcomes. No paywalls, no limits." },
  { q: "Do I need an account?", a: "No. You can use the calculator without signing up. If you want to save your work, we offer a simple magic link — no password required." },
];

/* ═══════════════════════════════════════════════════════════════════
   HOW IT WORKS STEPS (static — not clickable)
   ═══════════════════════════════════════════════════════════════════ */
const steps = [
  { num: "01", title: "Set Your Budget", desc: "Enter your total production budget and select any guild/union signatories. This establishes the baseline for everything that follows.", icon: DollarSign },
  { num: "02", title: "Build Your Capital Stack", desc: "Choose where your money is coming from — equity, pre-sales, gap financing, tax incentives. Each source has different recoupment priorities.", icon: Layers },
  { num: "03", title: "Model the Deal", desc: "Set the acquisition price, distribution fees, and marketing spend. This is where you see how much actually comes back.", icon: Handshake },
  { num: "04", title: "See the Waterfall", desc: "Watch every dollar flow through the priority chain. See exactly who gets paid, in what order, and what's left for you.", icon: Waves, callout: "Most filmmakers make deals without ever seeing how the money flows back. This tool shows you — in under 2 minutes." },
];

/* ═══════════════════════════════════════════════════════════════════
   PROBLEM CARDS — filmmaker language, not finance jargon
   ═══════════════════════════════════════════════════════════════════ */
const problemCards = [
  { icon: Receipt, title: "The investor asks how they get paid back.", body: "You need an answer — not a vague promise. How does the money come back? In what order? What if the film underperforms? If you can't show them the math, the conversation stalls before it starts." },
  { icon: EyeOff, title: "Nobody ran the numbers.", body: "Most indie deals aren't structured to protect both sides. Not out of bad faith — just math nobody modeled. Filmmakers give away too much. Investors take on more risk than they realize. It starts with one missing step: seeing how the money actually flows." },
  { icon: Scale, title: "Structure is what gets you funded.", body: "When investors can see their downside is managed — preferred returns, clear priority, transparent recoupment — they say yes faster. A well-structured deal doesn't just protect you. It's what turns a pitch into a funded project." },
];

/* ═══════════════════════════════════════════════════════════════════
   SECTION HEADER
   ═══════════════════════════════════════════════════════════════════ */
const SectionHeader = ({ eyebrow, title, subtitle, icon: Icon, plainSubtitle }: {
  eyebrow: string; title: string; subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  plainSubtitle?: boolean;
}) => (
  <div className="text-center mb-8">
    <div className="flex items-center gap-2 justify-center mb-3">
      {Icon && <Icon className="w-4 h-4 text-gold" />}
      <p className="text-gold text-xs tracking-[0.3em] uppercase font-semibold">{eyebrow}</p>
    </div>
    <h2 className="font-bebas text-4xl md:text-5xl tracking-[0.08em] text-text-primary">{title}</h2>
    {subtitle && (
      <p className={cn(
        "text-center max-w-lg mx-auto mt-4 leading-relaxed",
        plainSubtitle
          ? "text-text-mid text-[15px]"
          : "text-text-mid text-[15px] px-4 py-2.5 rounded-xl bg-gold/[0.06] border border-gold/20"
      )}>
        {subtitle}
      </p>
    )}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   SECTION CHEVRON
   ═══════════════════════════════════════════════════════════════════ */
const SectionChevron = ({ nextId, large }: { nextId?: string; large?: boolean }) => {
  const handleClick = useCallback(() => {
    if (!nextId) return;
    const el = document.getElementById(nextId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [nextId]);

  if (!nextId) return null;

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center mx-auto rounded-full border border-white/10 hover:border-gold/40 transition-all group",
        large ? "w-12 h-12 mt-6" : "w-10 h-10 mt-5"
      )}
      aria-label="Scroll to next section"
    >
      <ChevronDown className={cn(
        "text-text-dim group-hover:text-gold animate-bounce-chevron transition-colors",
        large ? "w-6 h-6" : "w-5 h-5"
      )} />
    </button>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SECTION FRAME — content-driven height (no forced min-h)
   ═══════════════════════════════════════════════════════════════════ */
const SectionFrame = ({ id, children, className }: {
  id: string; children: React.ReactNode; className?: string;
}) => (
  <section id={id} className="snap-section px-4 py-6">
    <div className={cn("bg-bg-elevated border border-white/[0.06] rounded-2xl overflow-hidden", className)}>
      <div className="h-[2px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
      <div className="p-6 md:p-8">
        {children}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════
   SECTION FADE-IN HOOK (IntersectionObserver)
   ═══════════════════════════════════════════════════════════════════ */
const useFadeIn = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return {
    ref,
    visible,
    className: cn("transition-all duration-500 ease-out", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"),
  };
};

/** Stagger delay style for children within a visible section */
const staggerDelay = (index: number, visible: boolean): React.CSSProperties => ({
  transitionDelay: visible ? `${index * 80}ms` : "0ms",
});

/** Class for stagger-animated child items */
const staggerChild = (visible: boolean) =>
  cn("transition-all duration-500 ease-out", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3");

/* ═══════════════════════════════════════════════════════════════════
   MAIN INDEX COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const haptics = useHaptics();
  const [linkCopied, setLinkCopied] = useState(false);

  // Fade-in refs for each section
  const fade2 = useFadeIn();
  const fade3 = useFadeIn();
  const fade4 = useFadeIn();
  const fade5 = useFadeIn();
  const fade6 = useFadeIn();

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
        <main className={cn("flex-1 flex flex-col transition-all duration-700 snap-container", isComplete ? "opacity-100" : "opacity-0")}>
          <div className="vignette" />

          {/* ── HERO ── */}
          <section id="hero" className="snap-section min-h-[calc(100vh-56px)] flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none animate-spotlight-pulse"
              style={{ width: '100vw', height: '75vh', background: `radial-gradient(ellipse 50% 40% at 50% 10%, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.04) 40%, transparent 70%)` }} />
            <div className="relative px-6 pt-10 pb-4 max-w-xl mx-auto text-center">
              <div className="mb-6 relative inline-block">
                <div className="absolute inset-0 -m-8" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)', filter: 'blur(16px)' }} />
                <img src={filmmakerLogo} alt="Filmmaker.OG" className="relative w-28 h-28 object-contain rounded-lg"
                  style={{ filter: 'brightness(1.15) drop-shadow(0 0 25px rgba(212,175,55,0.45))' }} />
              </div>
              <p className="text-gold text-xs tracking-[0.35em] uppercase mb-4 font-semibold">Free Film Finance Simulator</p>
              <h1 className="font-bebas text-[clamp(2.2rem,8vw,3.6rem)] leading-[1.05] text-text-primary mb-4">
                SEE WHERE EVERY<br />DOLLAR <span className="text-gold">GOES</span>
              </h1>
              <p className="text-text-mid text-base font-medium leading-relaxed max-w-sm mx-auto mb-8">
                Model your deal. See the waterfall. Know if the math works for
                everyone — before you sign anything. Free. Two minutes.
              </p>

              {isReturningUser ? (
                <div className="w-full max-w-[320px] mx-auto space-y-3">
                  <button onClick={handleContinueClick}
                    className="w-full h-16 text-base font-semibold tracking-[0.12em] transition-all active:scale-[0.96] rounded-md bg-gold-cta-subtle border border-gold-cta-muted text-gold-cta shadow-button hover:border-gold-cta">
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
                    className="w-full h-16 text-base font-semibold tracking-[0.12em] transition-all active:scale-[0.96] rounded-md bg-gold-cta-subtle border border-gold-cta-muted text-gold-cta shadow-button hover:border-gold-cta">
                    RUN THE NUMBERS
                  </button>
                  <p className="text-text-dim text-[13px] tracking-wider mt-3">No account required</p>
                </div>
              )}

              <SectionChevron nextId="problem" large />
            </div>
          </section>

          {/* ── THE PROBLEM (moved up — lead with pain) ── */}
          <SectionFrame id="problem">
            <div ref={fade2.ref} className={cn(fade2.className, "max-w-2xl mx-auto")}>
              <SectionHeader icon={AlertTriangle} eyebrow="The Problem" title="WHY MOST INDIE FILMS LOSE MONEY" subtitle="It's not bad films. It's deals made without seeing how the money flows back." />
              <div className="space-y-4">
                {problemCards.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <div key={i} className={cn("bg-bg-card border border-border-subtle hover:border-gold/20 rounded-xl p-5 transition-colors", staggerChild(fade2.visible))} style={staggerDelay(i, fade2.visible)}>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center">
                          <Icon className="w-4 h-4 text-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-text-primary text-lg font-semibold mb-1.5">{card.title}</h3>
                          <p className="text-text-dim text-[15px] leading-relaxed">{card.body}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <SectionChevron nextId="how-it-works" />
          </SectionFrame>

          {/* ── HOW IT WORKS ── */}
          <SectionFrame id="how-it-works">
            <div ref={fade3.ref} className={cn(fade3.className, "max-w-2xl mx-auto")}>
              <SectionHeader icon={Film} eyebrow="How It Works" title="FOUR STEPS TO CLARITY" subtitle="From budget to waterfall in four steps. No financial background required." plainSubtitle />
              <div className="space-y-4">
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.num} className={staggerChild(fade3.visible)} style={staggerDelay(i, fade3.visible)}>
                      <div className="flex items-start gap-4 bg-bg-card border border-border-subtle hover:border-gold/20 rounded-xl p-5 transition-colors">
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center">
                          <Icon className="w-4 h-4 text-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs text-text-dim tracking-wider">{step.num}</span>
                            <h3 className="text-text-primary text-lg font-semibold">{step.title}</h3>
                          </div>
                          <p className="text-text-dim text-[15px] leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                      {step.callout && (
                        <div className="mt-3 px-4 py-3 bg-gold/[0.08] border border-gold/25 rounded-xl">
                          <p className="text-gold/80 text-[15px] leading-relaxed italic">{step.callout}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Mid-page CTA — catch fast deciders */}
              <div className="text-center mt-8">
                <button onClick={handleStartClick}
                  className="h-14 px-10 text-sm font-semibold tracking-[0.12em] transition-all active:scale-[0.96] rounded-md border border-gold-cta-muted text-gold-cta hover:border-gold-cta hover:bg-gold/[0.06]">
                  RUN THE NUMBERS — FREE
                </button>
              </div>
            </div>
            <SectionChevron nextId="industry-charges" />
          </SectionFrame>

          {/* ── INDUSTRY CHARGES ── */}
          <SectionFrame id="industry-charges">
            <div ref={fade4.ref} className={cn(fade4.className, "max-w-2xl mx-auto")}>
              <SectionHeader icon={Clapperboard} eyebrow="The Industry Standard" title="WHAT OTHERS CHARGE FOR THIS ANALYSIS" subtitle="This is what it costs to understand your own deal. Until now." />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {industryCosts.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className={cn("bg-bg-card border border-border-subtle hover:border-gold/20 rounded-xl p-5 relative overflow-hidden transition-colors", staggerChild(fade4.visible))} style={staggerDelay(i, fade4.visible)}>
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gold/[0.03] rounded-full blur-2xl translate-x-4 -translate-y-4" />
                      <div className="relative">
                        <div className="w-9 h-9 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center mb-3">
                          <Icon className="w-4 h-4 text-gold" />
                        </div>
                        <p className="font-mono text-xl md:text-2xl font-medium text-text-primary line-through decoration-text-dim/30 mb-0.5">{item.cost}</p>
                        <p className="text-text-dim text-xs tracking-wider uppercase">{item.label}</p>
                        <p className="text-text-dim text-[13px] mt-1">{item.note}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-center mt-4 px-6 py-5 rounded-xl bg-gold/[0.06] border border-gold/20 max-w-xs mx-auto">
                <p className="font-bebas text-4xl md:text-5xl tracking-[0.1em] text-gold">FREE</p>
                <p className="text-text-dim text-[15px] tracking-wider mt-1">The same analysis. No catch.</p>
              </div>
            </div>
            <SectionChevron nextId="deliverables" />
          </SectionFrame>

          {/* ── WHAT YOU GET ── */}
          <SectionFrame id="deliverables">
            <div ref={fade5.ref} className={cn(fade5.className, "max-w-2xl mx-auto")}>
              <SectionHeader icon={Award} eyebrow="The Deliverables" title="WHAT YOU WALK AWAY WITH" subtitle="Everything you need to walk into a room full of money people and hold your own." plainSubtitle />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: FileSpreadsheet, title: "The document that closes your raise", desc: "A 6-sheet Excel workbook — executive summary, waterfall ledger, capital breakdown, and investor returns. Hand it over and let the numbers speak." },
                  { icon: Presentation, title: "A PDF your investor will actually read", desc: "Presentation-ready, plain language, zero jargon. Email it, print it, or hand it across the table. Designed to make you look like you've done this before." },
                  { icon: BarChart3, title: "One chart that explains everything", desc: "A visual waterfall showing who gets paid, in what order, and how much. The most important chart in film finance — and now it's yours." },
                  { icon: BookOpen, title: "Every term, in plain English", desc: "A glossary of every financial term in your deal. No MBA required — just the language you need to hold your own in any room." },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className={cn("bg-bg-card border border-border-subtle hover:border-gold/20 rounded-xl p-5 transition-colors", staggerChild(fade5.visible))} style={staggerDelay(i, fade5.visible)}>
                      <div className="w-9 h-9 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center mb-3">
                        <Icon className="w-4 h-4 text-gold" />
                      </div>
                      <h3 className="text-text-primary text-lg font-semibold mb-1.5">{item.title}</h3>
                      <p className="text-text-dim text-[15px] leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <SectionChevron nextId="faq" />
          </SectionFrame>

          {/* ── FAQ ── */}
          <SectionFrame id="faq">
            <div ref={fade6.ref} className={cn(fade6.className, "max-w-2xl mx-auto")}>
              <SectionHeader icon={HelpCircle} eyebrow="Common Questions" title="WHAT FILMMAKERS ASK" subtitle="Quick answers to the questions we hear most." plainSubtitle />
              <div className="flex rounded-xl overflow-hidden border border-border-subtle">
                <div className="w-1 flex-shrink-0 bg-gradient-to-b from-gold via-gold/60 to-gold/20" style={{ boxShadow: '0 0 12px rgba(212,175,55,0.25)' }} />
                <div className="flex-1 bg-bg-card px-5">
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, i) => (
                      <AccordionItem key={faq.q} value={`faq-${i}`} className="border-border-subtle">
                        <AccordionTrigger className="text-text-primary hover:text-text-mid hover:no-underline text-lg font-semibold text-left">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-text-dim text-[15px] leading-relaxed">
                          {faq.a}
                          {faq.link && (
                            <a href={faq.link.url} target="_blank" rel="noopener noreferrer"
                              className="inline-block mt-2 text-gold/70 hover:text-gold text-[13px] tracking-wider transition-colors underline underline-offset-2 decoration-gold/30">
                              {faq.link.label} &rarr;
                            </a>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>
            <SectionChevron nextId="final-cta" />
          </SectionFrame>

          {/* ── FINAL CTA ── */}
          <section id="final-cta" className="snap-section py-8 px-4">
            <div className="bg-bg-elevated border border-white/[0.06] rounded-2xl overflow-hidden relative">
              <div className="h-[2px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                style={{ width: '100%', height: '100%', background: `radial-gradient(ellipse 60% 60% at 50% 10%, rgba(212,175,55,0.08) 0%, transparent 70%)` }} />
              <div className="relative p-8 md:p-12 max-w-md mx-auto text-center">
                <p className="text-gold text-xs tracking-[0.3em] uppercase font-semibold mb-3">One Last Thing</p>
                <h2 className="font-bebas text-3xl md:text-4xl tracking-[0.08em] text-text-primary mb-4">
                  YOU ALREADY KNOW<br />THE ANSWER
                </h2>
                <p className="text-text-mid text-[15px] leading-relaxed max-w-xs mx-auto mb-6">
                  Every filmmaker who's been burned wishes they'd run the numbers first.
                  This is the tool that does it — free, in two minutes, no strings.
                </p>
                <button onClick={handleStartClick}
                  className="w-full max-w-[320px] h-16 text-base font-semibold tracking-[0.12em] transition-all active:scale-[0.96] rounded-md bg-gold-cta-subtle border border-gold-cta-muted text-gold-cta shadow-button hover:border-gold-cta">
                  SEE YOUR WATERFALL
                </button>
                <p className="text-text-dim text-[13px] tracking-wider mt-4">No account. No credit card. Just the math.</p>
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="py-8 px-6">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-gold/25 to-transparent mb-8" />
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 mb-5">
                <a href="mailto:thefilmmaker.og@gmail.com"
                  className="flex items-center gap-1 text-xs tracking-wider text-gold/70 hover:text-gold transition-colors py-1.5 px-2.5 rounded-full border border-white/[0.06] hover:border-gold/30">
                  <Mail className="w-3 h-3" /><span>Email</span>
                </a>
                <a href="https://www.instagram.com/filmmaker.og" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs tracking-wider text-gold/70 hover:text-gold transition-colors py-1.5 px-2.5 rounded-full border border-white/[0.06] hover:border-gold/30">
                  <Instagram className="w-3 h-3" /><span>Instagram</span>
                </a>
                <button onClick={handleShare}
                  className="flex items-center gap-1 text-xs tracking-wider text-gold/70 hover:text-gold transition-colors py-1.5 px-2.5 rounded-full border border-white/[0.06] hover:border-gold/30">
                  <Share2 className="w-3 h-3" /><span>Share</span>
                </button>
                <button onClick={handleCopyLink}
                  className="flex items-center gap-1 text-xs tracking-wider text-gold/70 hover:text-gold py-1.5 px-2.5 rounded-full border border-white/[0.06] hover:border-gold/30 transition-colors">
                  {linkCopied ? (
                    <><Check className="w-3 h-3 text-green-400" /><span className="text-green-400">Copied!</span></>
                  ) : (
                    <><Link2 className="w-3 h-3" /><span>Copy URL</span></>
                  )}
                </button>
              </div>

              <p className="text-text-dim text-xs tracking-wide leading-relaxed text-center mb-3">
                This tool is for educational and informational purposes only.
                It does not constitute legal, tax, accounting, or investment advice.
                Consult a qualified entertainment attorney before making any investment or financing decisions.
              </p>
              <div className="flex items-center justify-center gap-2.5">
                <span className="font-bebas text-lg tracking-[0.2em] text-gold">
                  FILMMAKER<span className="text-white">.OG</span>
                </span>
                <span className="text-[10px] font-semibold tracking-[0.15em] text-gold border border-gold/40 rounded-full px-1.5 py-0.5 leading-none uppercase">
                  BETA
                </span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
};

export default Index;
