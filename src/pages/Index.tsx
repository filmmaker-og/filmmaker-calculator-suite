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
   HOLLYWOOD SCROLL CARDS — merged Problem + Waterfall + Industry Costs
   ═══════════════════════════════════════════════════════════════════ */
const hollywoodCards = [
  { icon: Receipt, label: "The Pecking Order", text: "Distributors take fees first. Lenders recoup next. Then equity. You're last — unless you know the structure." },
  { icon: Gavel, label: "The Hidden Playbook", text: "Recoupment schedules, fee waterfalls, P&A overages. Hollywood wrote the rules — and never shared them." },
  { icon: Waves, label: "The Waterfall", text: "The financial structure that determines who gets paid, in what order, and how much. Most filmmakers have never seen one." },
  { icon: Calculator, label: "Consultants: $10K–$30K", text: "That's what a finance consultant charges to build the model you're about to build yourself." },
  { icon: Gavel, label: "Lawyers: $5K–$15K", text: "Entertainment attorneys charge this per deal analysis. Same math. Different invoice." },
  { icon: EyeOff, label: "Free. Right Here.", text: "The same analysis, the same language, the same leverage — no gatekeepers, no invoices, no catch." },
];

/* ═══════════════════════════════════════════════════════════════════
   FAQ DATA
   ═══════════════════════════════════════════════════════════════════ */
const faqs = [
  { q: "Who is this for?", a: "Independent producers, directors, and investors. Whether you're raising $50K or $5M, the mechanics of recoupment are the same. If you intend to sell your film for profit, you need this." },
  { q: "How does the calculator work?", a: "Four steps: set your budget, build your capital stack, structure your deal, and track exactly where every dollar goes in the waterfall. Takes about 2 minutes." },
  { q: "Is this financial or legal advice?", a: "No. This is a simulation tool for estimation and planning purposes only. Always consult a qualified entertainment attorney or accountant for final deal structures." },
  { q: "Is the calculator free?", a: "Yes, the simulation is completely free. Run as many scenarios as you want, adjust the variables, and see different outcomes. No paywalls, no limits." },
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
  const revealHollywood = useReveal();
  const reveal3 = useReveal();
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
                    MODEL YOUR DEAL
                  </button>
                </div>
              )}

            </div>
          </section>

          {/* section divider */}
          <div className="px-8"><div className="h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent" /></div>

          {/* ── WHAT HOLLYWOOD DOESN'T WANT YOU TO KNOW (merged scroll) ── */}
          <SectionFrame id="hollywood">
            <div ref={revealHollywood.ref} className={cn("max-w-2xl mx-auto transition-all duration-500 ease-out", revealHollywood.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
              <SectionHeader icon={Lock} eyebrow="What They Didn't Teach You In Film School" title={<>WHAT HOLLYWOOD DOESN&apos;T WANT YOU TO <span className="text-white">KNOW</span></>} />

              {/* Horizontal scroll strip */}
              <div className="overflow-x-auto scrollbar-hide -mx-2 px-2 pb-2">
                <div className="flex gap-3" style={{ width: 'max-content' }}>
                  {hollywoodCards.map((card, i) => {
                    const Icon = card.icon;
                    const isLast = i === hollywoodCards.length - 1;
                    return (
                      <div
                        key={i}
                        className={cn(
                          "w-[240px] flex-shrink-0 rounded-xl border overflow-hidden transition-all duration-500",
                          isLast
                            ? "border-gold/30 bg-gold/[0.08]"
                            : "border-border-subtle bg-bg-card",
                          revealHollywood.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        )}
                        style={{ transitionDelay: revealHollywood.visible ? `${i * 80}ms` : "0ms" }}
                      >
                        <div className={cn("h-1", isLast ? "bg-gold" : "bg-gradient-to-r from-gold via-gold/60 to-gold/20")} />
                        <div className="p-4 flex flex-col h-[160px]">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3", isLast ? "bg-gold/20 border border-gold/40" : "bg-bg-elevated border border-border-subtle")}>
                            <Icon className="w-4 h-4 text-gold" />
                          </div>
                          <p className={cn("font-bebas text-[17px] tracking-[0.06em] uppercase mb-2", isLast ? "text-gold" : "text-gold")}>{card.label}</p>
                          <p className={cn("text-xs leading-relaxed flex-1", isLast ? "text-gold/80" : "text-text-dim")}>{card.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scroll hint */}
              <p className="text-text-dim/40 text-xs text-center mt-3 tracking-wider">SWIPE &rarr;</p>
            </div>
          </SectionFrame>

          {/* section divider */}
          <div className="px-8"><div className="h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent" /></div>

          {/* ── HOW IT WORKS ── */}
          <SectionFrame id="how-it-works" alt>
            <div ref={reveal3.ref} className={cn("max-w-2xl mx-auto transition-all duration-500 ease-out", reveal3.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
              <SectionHeader icon={Film} eyebrow="How It Works" title={<>FROM FIRST MONEY IN TO LAST MONEY <span className="text-white">OUT</span></>} subtitle="Four steps. No finance degree." plainSubtitle />
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

              {/* Mid-page CTA — catch fast deciders */}
              <div className="text-center mt-5 -mb-2">
                <button onClick={handleStartClick}
                  className="h-16 px-10 text-base font-bold tracking-[0.14em] transition-all active:scale-[0.96] rounded-md bg-gold/[0.14] border-2 border-gold/40 text-gold shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:border-gold/60 hover:bg-gold/[0.18]">
                  MODEL YOUR DEAL
                </button>
              </div>
            </div>
          </SectionFrame>

          {/* section divider */}
          <div className="px-8"><div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" /></div>

          {/* ── WHAT YOU GET (tight receipt) ── */}
          <SectionFrame id="deliverables" alt>
            <div ref={reveal5.ref} className={cn("max-w-2xl mx-auto transition-all duration-500 ease-out", reveal5.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
              <SectionHeader icon={Award} eyebrow="The Deliverables" title={<>WHAT YOU WALK AWAY <span className="text-white">WITH</span></>} />
              <div className="rounded-xl border border-border-subtle bg-bg-card overflow-hidden divide-y divide-border-subtle">
                {[
                  { icon: FileSpreadsheet, line: "6-sheet Excel workbook — waterfall, capital stack, investor returns" },
                  { icon: Presentation, line: "Investor-ready PDF — plain language, zero jargon" },
                  { icon: BookOpen, line: "Full glossary — every deal term in plain English" },
                  { icon: BarChart3, line: "Visual waterfall chart — who gets paid, in what order" },
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
                    Learn the business of film today.
                  </p>
                  <button onClick={handleStartClick}
                    className="w-full max-w-[320px] h-16 text-base font-bold tracking-[0.14em] transition-all active:scale-[0.96] rounded-md bg-gold/[0.14] border-2 border-gold/40 text-gold shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:border-gold/60 hover:bg-gold/[0.18]">
                    START NOW
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
