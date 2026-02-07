import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useHaptics } from "@/hooks/use-haptics";
import {
  ArrowRight,
  RotateCcw,
  DollarSign,
  Layers,
  Handshake,
  BarChart3,
  ChevronDown,
  Shield,
  MessageCircle,
  Eye,
  FileSpreadsheet,
  Presentation,
  BookOpen,
  TrendingUp,
  Target,
  Pen,
  Copy,
  Check,
  Scale,
  EyeOff,
  Receipt,
  Gavel,
  Calculator,
  UserCheck,
  Briefcase,
} from "lucide-react";
import filmmakerLogo from "@/assets/filmmaker-logo.jpg";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { formatCompactCurrency } from "@/lib/waterfall";

const STORAGE_KEY = "filmmaker_og_inputs";
const INTRO_SEEN_KEY = "filmmaker_og_intro_seen";

/* ═══════════════════════════════════════════════════════════════════
   SCENARIO PROMPTS — Future chatbot bridge (with copy)
   ═══════════════════════════════════════════════════════════════════ */
const scenarioPrompts = [
  {
    prompt: "Model a $500K horror film acquisition",
    context: "See how genre, budget, and cast affect what buyers will pay.",
  },
  {
    prompt: "Show me how 35% distribution fees affect my backend",
    context: "Model distribution fee ranges and see what's left for you.",
  },
  {
    prompt: "What happens with 120% investor recoupment?",
    context: "Understand how preferred returns change your waterfall.",
  },
  {
    prompt: "Structure a waterfall with equity and pre-sales",
    context: "Build a capital stack and see who gets paid first.",
  },
  {
    prompt: "Model a $2M drama with a Sundance premiere",
    context: "See realistic acquisition ranges for festival films.",
  },
  {
    prompt: "Show my investors their money is protected",
    context: "Map the recoupment structure and risk mitigation.",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   INDUSTRY COST COMPARISON
   ═══════════════════════════════════════════════════════════════════ */
const industryCosts = [
  {
    icon: Gavel,
    label: "Entertainment Lawyer",
    cost: "$5K–$15K",
    note: "Per deal analysis",
  },
  {
    icon: Calculator,
    label: "Finance Consultant",
    cost: "$10K–$30K",
    note: "Financial modeling",
  },
  {
    icon: UserCheck,
    label: "Producer's Rep",
    cost: "5–10%",
    note: "Percentage of deal",
  },
  {
    icon: Briefcase,
    label: "Sales Agent",
    cost: "10–25%",
    note: "Of gross revenue",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   FAQ DATA
   ═══════════════════════════════════════════════════════════════════ */
const faqs = [
  {
    q: "Who is this for?",
    a: "Independent producers, directors, and investors. Whether you're raising $50K or $5M, the mechanics of recoupment are the same. If you intend to sell your film for profit, you need this.",
  },
  {
    q: "How does the calculator work?",
    a: "Four steps: set your budget, build your capital stack, model an acquisition deal, and see exactly where every dollar goes in the waterfall. It takes about 2 minutes.",
  },
  {
    q: "Is this financial or legal advice?",
    a: "No. This is a simulation tool for estimation and planning purposes only. Always consult a qualified entertainment attorney or accountant for final deal structures.",
  },
  {
    q: 'What is a "waterfall"?',
    a: "A waterfall is the priority order in which revenue from your film is distributed — who gets paid first, second, and last. Most filmmakers sign deals without ever seeing theirs.",
  },
  {
    q: "Is the calculator free?",
    a: "Yes, the simulation is completely free. Run as many scenarios as you want, adjust the variables, and see different outcomes. No paywalls, no limits.",
  },
  {
    q: "Do I need an account?",
    a: "No. You can use the calculator without signing up. If you want to save your work, we offer a simple magic link — no password required.",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   HOW IT WORKS STEPS (static — not clickable)
   ═══════════════════════════════════════════════════════════════════ */
const steps = [
  {
    num: "01",
    title: "Set Your Budget",
    desc: "Enter your total production budget and select any guild/union signatories. This establishes the baseline for everything that follows.",
    icon: DollarSign,
  },
  {
    num: "02",
    title: "Build Your Capital Stack",
    desc: "Choose where your money is coming from — equity, pre-sales, gap financing, tax incentives. Each source has different recoupment priorities.",
    icon: Layers,
  },
  {
    num: "03",
    title: "Model the Deal",
    desc: "Set the acquisition price, distribution fees, and marketing spend. This is where you see how much actually comes back.",
    icon: Handshake,
  },
  {
    num: "04",
    title: "See the Waterfall",
    desc: "Watch every dollar flow through the priority chain. See exactly who gets paid, in what order, and what's left for you.",
    icon: BarChart3,
  },
];

/* ═══════════════════════════════════════════════════════════════════
   USE CASES
   ═══════════════════════════════════════════════════════════════════ */
const useCases = [
  {
    icon: TrendingUp,
    title: "Before You Raise",
    desc: "Run the numbers before you pitch investors. Know exactly what you're offering and what they'll get back.",
  },
  {
    icon: Pen,
    title: "Before You Sign",
    desc: "A distributor made an offer. Model the deal terms and see what's actually left for you before you sign.",
  },
  {
    icon: Target,
    title: "Before You Greenlight",
    desc: "You have the budget, the script, the team. Make sure the financial structure actually works.",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   PROBLEM CARDS
   ═══════════════════════════════════════════════════════════════════ */
const problemCards = [
  {
    icon: Receipt,
    title: "Hidden Fee Structures",
    body: "Distribution fees, marketing expenses, and producer's reps can eat 50–70% of revenue before anyone gets paid. Most filmmakers don't see this until it's too late.",
  },
  {
    icon: EyeOff,
    title: "No Waterfall Visibility",
    body: "You signed the deal, but do you know who gets paid first? Second? Last? If you can't map the waterfall, you can't protect your backend.",
  },
  {
    icon: Scale,
    title: "Information Asymmetry",
    body: "Agencies, studios, and distributors thrive on you not knowing the numbers. The less you understand, the better their deal — and the worse yours.",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   FAQ ITEM COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border-subtle last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-text-primary text-sm font-medium pr-4 group-hover:text-text-mid transition-colors">
          {q}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-text-dim flex-shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          open ? "max-h-40 pb-4" : "max-h-0"
        )}
      >
        <p className="text-text-dim text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   GOLD SECTION DIVIDER
   ═══════════════════════════════════════════════════════════════════ */
const GoldDivider = () => (
  <div className="gold-section-divider" />
);

/* ═══════════════════════════════════════════════════════════════════
   SECTION HEADER (eyebrow + title)
   ═══════════════════════════════════════════════════════════════════ */
const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) => (
  <div className="text-center mb-8">
    <div className="flex items-center gap-2 justify-center mb-3">
      {Icon && <Icon className="w-4 h-4 text-gold" />}
      <p className="text-gold text-[10px] tracking-[0.3em] uppercase font-semibold">
        {eyebrow}
      </p>
    </div>
    <h2 className="font-bebas text-2xl md:text-3xl tracking-[0.08em] text-text-primary">
      {title}
    </h2>
    {subtitle && (
      <p className="text-text-mid text-sm text-center max-w-lg mx-auto mt-3 leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN INDEX COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const haptics = useHaptics();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Detect returning user with saved data
  const savedState = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed?.inputs?.budget > 0) {
        return {
          budget: parsed.inputs.budget as number,
          activeTab: parsed.activeTab as string,
        };
      }
    } catch { /* ignore */ }
    return null;
  }, []);

  const isReturningUser = savedState !== null;

  // Intro plays ONCE — check localStorage flag
  const hasSeenIntro = useMemo(() => {
    try {
      return localStorage.getItem(INTRO_SEEN_KEY) === "true";
    } catch { return false; }
  }, []);

  const shouldSkip = searchParams.get("skipIntro") === "true" || hasSeenIntro;

  const [phase, setPhase] = useState<
    'dark' | 'beam' | 'logo' | 'pulse' | 'tagline' | 'complete'
  >(shouldSkip ? 'complete' : 'dark');

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

  // Mark intro as seen when it finishes
  useEffect(() => {
    if (phase === 'complete' && !hasSeenIntro) {
      try { localStorage.setItem(INTRO_SEEN_KEY, "true"); } catch { /* ignore */ }
    }
  }, [phase, hasSeenIntro]);

  const handleStartClick = () => {
    haptics.medium();
    navigate("/calculator?tab=budget");
  };

  const handleContinueClick = () => {
    haptics.medium();
    navigate("/calculator");
  };

  const handleStartFresh = () => {
    haptics.light();
    navigate("/calculator?tab=budget&reset=true");
  };

  const handleCopyPrompt = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    }).catch(() => { /* fallback: do nothing */ });
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

        {/* ═══════════════════════════════════════════════════════════════════
            CINEMATIC INTRO (plays once only)
            ═══════════════════════════════════════════════════════════════════ */}
        {!shouldSkip && (
          <div
            className={cn(
              "fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-1000",
              isComplete ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
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

        {/* ═══════════════════════════════════════════════════════════════════
            LANDING PAGE
            ═══════════════════════════════════════════════════════════════════ */}
        <main className={cn("flex-1 flex flex-col transition-all duration-700", isComplete ? "opacity-100" : "opacity-0")}>
          <div className="vignette" />

          {/* ── SECTION 1: HERO ── */}
          <section className="relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none animate-spotlight-pulse"
              style={{ width: '100vw', height: '75vh', background: `radial-gradient(ellipse 50% 40% at 50% 10%, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.04) 40%, transparent 70%)` }} />
            <div className="relative px-6 pt-24 pb-16 max-w-xl mx-auto text-center">
              <div className="mb-8 relative inline-block">
                <div className="absolute inset-0 -m-8" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)', filter: 'blur(16px)' }} />
                <img src={filmmakerLogo} alt="Filmmaker.OG" className="relative w-32 h-32 object-contain rounded-lg"
                  style={{ filter: 'brightness(1.15) drop-shadow(0 0 25px rgba(212,175,55,0.45))' }} />
              </div>
              <p className="text-gold text-[10px] tracking-[0.35em] uppercase mb-5 font-semibold">Free Film Finance Simulator</p>
              <h1 className="font-bebas text-[clamp(2.4rem,9vw,3.8rem)] leading-[1.05] text-text-primary mb-5">
                SEE WHERE EVERY<br />DOLLAR <span className="text-gold">GOES</span>
              </h1>
              <p className="text-text-mid text-sm leading-relaxed max-w-md mx-auto mb-10">
                Model your film's deal structure, capital stack, and revenue waterfall — the same analysis
                the industry gatekeepers use. Free to simulate. Takes 2 minutes.
              </p>
              {isReturningUser ? (
                <div className="w-full max-w-[320px] mx-auto space-y-3">
                  <button onClick={handleContinueClick} className="w-full h-14 text-sm font-black tracking-[0.12em] transition-all active:scale-[0.96] rounded-md bg-gold-cta-subtle border border-gold-cta-muted text-gold-cta shadow-button hover:border-gold-cta">
                    <span className="flex items-center justify-center gap-2">CONTINUE SIMULATION <ArrowRight size={18} /></span>
                  </button>
                  <p className="text-text-dim text-[11px] tracking-wider text-center">{formatCompactCurrency(savedState!.budget)} budget in progress</p>
                  <button onClick={handleStartFresh} className="w-full flex items-center justify-center gap-1.5 text-[11px] tracking-wider text-text-dim hover:text-text-mid transition-colors py-2">
                    <RotateCcw className="w-3 h-3" /> Start fresh
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-[320px] mx-auto">
                  <button onClick={handleStartClick} className="w-full h-14 text-sm font-black tracking-[0.12em] transition-all active:scale-[0.96] rounded-md bg-gold-cta-subtle border border-gold-cta-muted text-gold-cta shadow-button hover:border-gold-cta">
                    <span className="flex items-center justify-center gap-2">RUN THE NUMBERS <ArrowRight size={18} /></span>
                  </button>
                  <p className="text-text-dim text-[11px] tracking-wider mt-4">No account required</p>
                </div>
              )}
              <div className="mt-10 animate-pulse-slow">
                <ChevronDown className="w-5 h-5 text-text-dim mx-auto" />
              </div>
            </div>
          </section>

          <GoldDivider />

          {/* ── SECTION 2: WHAT THE INDUSTRY CHARGES (redesigned) ── */}
          <section className="px-6 py-14">
            <div className="max-w-2xl mx-auto">
              <SectionHeader
                icon={Gavel}
                eyebrow="The Industry Standard"
                title="WHAT OTHERS CHARGE FOR THIS ANALYSIS"
                subtitle="This is the cost of understanding your own deal. Until now."
              />

              <div className="grid grid-cols-2 gap-3 mb-4">
                {industryCosts.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="bg-bg-elevated border border-border-subtle rounded-xl p-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gold/[0.03] rounded-full blur-2xl translate-x-4 -translate-y-4" />
                      <div className="relative">
                        <div className="w-8 h-8 rounded-lg bg-bg-card border border-border-subtle flex items-center justify-center mb-3">
                          <Icon className="w-3.5 h-3.5 text-gold" />
                        </div>
                        <p className="font-mono text-lg md:text-xl font-bold text-text-primary line-through decoration-text-dim/30 mb-0.5">
                          {item.cost}
                        </p>
                        <p className="text-text-dim text-[10px] tracking-wider uppercase">{item.label}</p>
                        <p className="text-text-dim text-[10px] mt-1">{item.note}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* FREE card — hero treatment */}
              <div className="bg-gold/[0.06] border border-gold/30 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gold/[0.04] via-transparent to-gold/[0.04]" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <p className="text-text-primary text-sm font-semibold">Filmmaker.OG</p>
                      <p className="text-text-dim text-[10px] tracking-wider uppercase">The same analysis. Free.</p>
                    </div>
                  </div>
                  <p className="font-mono text-2xl md:text-3xl font-bold text-gold-cta">
                    Free
                  </p>
                </div>
              </div>
            </div>
          </section>

          <GoldDivider />

          {/* ── SECTION 3: WHEN TO USE THIS ── */}
          <section className="px-6 py-14">
            <div className="max-w-3xl mx-auto">
              <SectionHeader eyebrow="When To Use This" title="THREE MOMENTS THAT DEFINE YOUR DEAL" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {useCases.map((uc) => {
                  const Icon = uc.icon;
                  return (
                    <div key={uc.title} className="bg-bg-elevated border border-border-subtle rounded-xl p-5">
                      <div className="w-9 h-9 rounded-lg bg-bg-card border border-border-subtle flex items-center justify-center mb-3">
                        <Icon className="w-4 h-4 text-gold" />
                      </div>
                      <h3 className="text-text-primary text-sm font-semibold mb-2">{uc.title}</h3>
                      <p className="text-text-dim text-xs leading-relaxed">{uc.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <GoldDivider />

          {/* ── SECTION 4: THE PROBLEM ── */}
          <section className="px-6 py-14">
            <div className="max-w-3xl mx-auto">
              <SectionHeader
                eyebrow="The Problem"
                title="WHY MOST INDIE FILMS LOSE MONEY"
                subtitle="It's not because the films are bad. It's because filmmakers sign deals they don't understand."
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {problemCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.title} className="bg-bg-elevated border border-border-subtle rounded-xl p-5">
                      <div className="w-9 h-9 rounded-lg bg-bg-card border border-border-subtle flex items-center justify-center mb-3">
                        <Icon className="w-4 h-4 text-gold" />
                      </div>
                      <h3 className="text-text-primary text-sm font-semibold mb-2">{card.title}</h3>
                      <p className="text-text-dim text-xs leading-relaxed">{card.body}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <GoldDivider />

          {/* ── SECTION 5: DEMOCRATIZATION ── */}
          <section className="px-6 py-14">
            <div className="max-w-2xl mx-auto">
              <div className="bg-bg-elevated border border-border-default rounded-xl p-7 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-lg bg-gold/10 border border-border-default flex items-center justify-center">
                      <Eye className="w-4 h-4 text-gold" />
                    </div>
                    <p className="text-gold text-[10px] tracking-[0.3em] uppercase font-semibold">Our Mission</p>
                  </div>
                  <h2 className="font-bebas text-2xl md:text-3xl tracking-[0.08em] text-text-primary mb-4">DEMOCRATIZING THE BUSINESS OF FILM</h2>
                  <div className="space-y-3 text-text-mid text-sm leading-relaxed">
                    <p>For too long, the mechanics of film finance have been obscured by gatekeepers. Agencies, distributors, and studios thrive on information asymmetry. They know the numbers; you don't.</p>
                    <p className="text-text-primary font-medium">We built this tool to level the playing field.</p>
                    <p>This tool extracts the proprietary logic used by top-tier entertainment lawyers and sales agents, putting institutional-grade modeling directly into your hands. Free simulation. Just the math.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <GoldDivider />

          {/* ── SECTION 6: HOW IT WORKS ── */}
          <section className="px-6 py-14 bg-bg-elevated">
            <div className="max-w-3xl mx-auto">
              <SectionHeader eyebrow="How It Works" title="FOUR STEPS TO CLARITY" />

              <div className="space-y-3">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.num} className="flex items-start gap-4 bg-bg-card border border-border-subtle rounded-xl p-5">
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center">
                        <Icon className="w-4 h-4 text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] text-text-dim tracking-wider">{step.num}</span>
                          <h3 className="text-text-primary text-sm font-semibold">{step.title}</h3>
                        </div>
                        <p className="text-text-dim text-xs leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <GoldDivider />

          {/* ── SECTION 7: WHAT YOU GET ── */}
          <section className="px-6 py-14">
            <div className="max-w-2xl mx-auto">
              <SectionHeader
                icon={FileSpreadsheet}
                eyebrow="What You Walk Away With"
                title="PROFESSIONAL FINANCIAL DOCUMENTS"
                subtitle="Designed so anyone — your investor, your business partner, your family — can understand your film's financials at a glance."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: FileSpreadsheet, title: "6-Sheet Excel Workbook", desc: "Executive summary, full waterfall ledger, capital stack breakdown, investor return summary, and plain-English glossary." },
                  { icon: Presentation, title: "Presentation-Ready PDF", desc: "A polished document you can email, print, or hand to an investor. Clear visuals, plain language, zero jargon." },
                  { icon: BookOpen, title: "Plain-English Glossary", desc: "Every financial term explained in language a first-time filmmaker can understand. No MBA required." },
                  { icon: BarChart3, title: "Visual Waterfall Chart", desc: "A clear breakdown of who gets paid, in what order, and how much. The most important chart in film finance." },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="bg-bg-elevated border border-border-subtle rounded-xl p-5">
                      <div className="w-9 h-9 rounded-lg bg-bg-card border border-border-subtle flex items-center justify-center mb-3">
                        <Icon className="w-4 h-4 text-gold" />
                      </div>
                      <h3 className="text-text-primary text-sm font-semibold mb-2">{item.title}</h3>
                      <p className="text-text-dim text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <GoldDivider />

          {/* ── SECTION 8: SCENARIO PROMPTS (with copy) ── */}
          <section className="py-14">
            <div className="max-w-3xl mx-auto px-6 mb-6">
              <SectionHeader
                icon={MessageCircle}
                eyebrow="Try a Scenario"
                title="WHAT FILMMAKERS ASK"
                subtitle="Real scenarios indie filmmakers face. Tap copy to save a prompt."
              />
            </div>

            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-4 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex-shrink-0 w-[max(0px,calc((100vw-768px)/2-1.5rem))]" />

              {scenarioPrompts.map((item, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[280px] snap-center bg-bg-elevated border border-border-subtle rounded-xl p-5 text-left hover:border-border-default transition-colors group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-6 h-6 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MessageCircle className="w-3 h-3 text-gold" />
                    </div>
                    <p className="text-text-primary text-sm font-medium leading-snug">
                      {item.prompt}
                    </p>
                  </div>
                  <p className="text-text-dim text-[11px] leading-relaxed mb-4 pl-9">
                    {item.context}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyPrompt(item.prompt, i);
                    }}
                    className="flex items-center gap-1.5 text-[11px] tracking-wider font-semibold pl-9 transition-colors"
                  >
                    {copiedIndex === i ? (
                      <span className="text-green-400 flex items-center gap-1.5">
                        <Check className="w-3 h-3" /> Copied
                      </span>
                    ) : (
                      <span className="text-gold-cta flex items-center gap-1.5">
                        <Copy className="w-3 h-3" /> Copy prompt
                      </span>
                    )}
                  </button>
                </div>
              ))}

              <div className="flex-shrink-0 w-[max(0px,calc((100vw-768px)/2-1.5rem))]" />
            </div>
          </section>

          <GoldDivider />

          {/* ── SECTION 9: FAQ ── */}
          <section className="px-6 py-14">
            <div className="max-w-xl mx-auto">
              <h2 className="font-bebas text-2xl tracking-[0.08em] text-text-primary text-center mb-6">
                FREQUENTLY ASKED QUESTIONS
              </h2>
              <div className="bg-bg-elevated border border-border-subtle rounded-xl px-5">
                {faqs.map((faq) => (
                  <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
              <div className="text-center mt-5">
                <button onClick={() => navigate("/intro")} className="text-text-dim hover:text-text-mid text-[11px] tracking-wider transition-colors">
                  Read the full protocol documentation →
                </button>
              </div>
            </div>
          </section>

          <GoldDivider />

          {/* ── SECTION 10: FINAL CTA ── */}
          <section className="relative px-6 py-20 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{ width: '100vw', height: '100%', background: `radial-gradient(ellipse 60% 60% at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 70%)` }} />
            <div className="relative max-w-md mx-auto text-center">
              <Shield className="w-6 h-6 text-gold mx-auto mb-4" />
              <h2 className="font-bebas text-[clamp(1.8rem,6vw,2.5rem)] leading-[1.1] text-text-primary mb-4">
                KNOW YOUR NUMBERS<br /><span className="text-gold">BEFORE YOU SIGN</span>
              </h2>
              <p className="text-text-mid text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                Don't walk into an investor meeting, distributor negotiation, or signing without understanding your deal.
              </p>
              <button onClick={handleStartClick} className="w-full max-w-[320px] h-14 text-sm font-black tracking-[0.12em] transition-all active:scale-[0.96] rounded-md bg-gold-cta-subtle border border-gold-cta-muted text-gold-cta shadow-button hover:border-gold-cta">
                <span className="flex items-center justify-center gap-2">START FREE SIMULATION <ArrowRight size={18} /></span>
              </button>
              <p className="text-text-dim text-[11px] tracking-wider mt-4">No account required · Takes 2 minutes</p>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="border-t border-border-subtle py-6">
            <div className="px-6 text-center max-w-2xl mx-auto">
              <p className="text-text-dim text-[10px] tracking-wide leading-relaxed">
                This tool is for educational and informational purposes only.
                It does not constitute legal, tax, accounting, or investment advice.
                Consult a qualified entertainment attorney before making any
                investment or financing decisions.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
};

export default Index;
