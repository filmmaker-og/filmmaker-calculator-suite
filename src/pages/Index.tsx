import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useHaptics } from "@/hooks/use-haptics";
import {
  ArrowRight,
  RotateCcw,
  DollarSign,
  Layers,
  Handshake,
  BarChart3,
  ChevronRight,
  ChevronDown,
  Shield,
  Sparkles,
  Star,
  MessageCircle,
} from "lucide-react";
import filmmakerLogo from "@/assets/filmmaker-logo.jpg";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { formatCompactCurrency } from "@/lib/waterfall";
import { products } from "@/lib/store-products";

const STORAGE_KEY = "filmmaker_og_inputs";

/* ═══════════════════════════════════════════════════════════════════
   SCENARIO PROMPTS — Future chatbot bridge
   ═══════════════════════════════════════════════════════════════════ */
const scenarioPrompts = [
  {
    question: "I have a $500K horror film. What's a realistic acquisition price?",
    context: "Genre, budget, and cast all affect what buyers will pay.",
  },
  {
    question: "My investors want 120% recoupment before I see a dime. Is that fair?",
    context: "Standard investor recoupment and how to negotiate.",
  },
  {
    question: "My distributor wants 35% fees. Is that standard?",
    context: "Distribution fee ranges and what to watch for.",
  },
  {
    question: "I'm raising equity and pre-sales. How do I structure the waterfall?",
    context: "Capital stack priority and revenue distribution order.",
  },
  {
    question: "My film got into Sundance. What should I expect from buyers?",
    context: "Festival economics and acquisition price ranges.",
  },
  {
    question: "How do I show investors their money is protected?",
    context: "Recoupment structure, preferred returns, and risk mitigation.",
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
    q: "What is a \"waterfall\"?",
    a: "A waterfall is the priority order in which revenue from your film is distributed — who gets paid first, second, and last. Most filmmakers sign deals without ever seeing theirs.",
  },
  {
    q: "Is the calculator free?",
    a: "Yes, the simulation is completely free. Run as many scenarios as you want. Professional document exports (investor-ready PDFs and Excel packages) are available starting at $197.",
  },
  {
    q: "Do I need an account?",
    a: "No. You can use the calculator without signing up. If you want to save your work, we offer a simple magic link — no password required.",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   HOW IT WORKS STEPS
   ═══════════════════════════════════════════════════════════════════ */
const steps = [
  {
    num: "01",
    title: "Set Your Budget",
    desc: "Enter your total production budget and select any guild/union signatories. This establishes the baseline for everything that follows.",
    icon: DollarSign,
    tab: "budget",
  },
  {
    num: "02",
    title: "Build Your Capital Stack",
    desc: "Choose where your money is coming from — equity, pre-sales, gap financing, tax incentives. Each source has different recoupment priorities.",
    icon: Layers,
    tab: "stack",
  },
  {
    num: "03",
    title: "Model the Deal",
    desc: "Set the acquisition price, distribution fees, and marketing spend. This is where you see how much actually comes back.",
    icon: Handshake,
    tab: "deal",
  },
  {
    num: "04",
    title: "See the Waterfall",
    desc: "Watch every dollar flow through the priority chain. See exactly who gets paid, in what order, and what's left for you.",
    icon: BarChart3,
    tab: "waterfall",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   FAQ ITEM COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border-subtle">
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
   MAIN INDEX COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const haptics = useHaptics();
  const carouselRef = useRef<HTMLDivElement>(null);

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

  // Check if we should skip intro based on URL param
  const shouldSkip = searchParams.get("skipIntro") === "true";

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
            CINEMATIC INTRO - Theatrical Spotlight (unchanged)
            ═══════════════════════════════════════════════════════════════════ */}
        <div
          className={cn(
            "fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-1000",
            isComplete ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
          style={{ backgroundColor: '#000000' }}
        >
          {/* OUTER SPOTLIGHT CONE BEAM */}
          <div
            className={cn(
              "absolute inset-0 pointer-events-none transition-all duration-1000",
              showBeam ? "opacity-100" : "opacity-0"
            )}
            style={{
              background: `radial-gradient(ellipse 70% 60% at 50% 0%, rgba(212, 175, 55, 0.08) 0%, rgba(255, 255, 255, 0.12) 20%, rgba(255, 255, 255, 0.05) 40%, rgba(255, 255, 255, 0.01) 60%, transparent 80%)`,
              clipPath: showBeam ? 'polygon(25% 0%, 75% 0%, 95% 100%, 5% 100%)' : 'polygon(48% 0%, 52% 0%, 52% 30%, 48% 30%)',
              transition: 'clip-path 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s ease',
            }}
          />

          {/* BRIGHT CORE BEAM */}
          <div
            className={cn(
              "absolute inset-0 pointer-events-none transition-all duration-1000",
              showBeam ? "opacity-100" : "opacity-0"
            )}
            style={{
              background: `radial-gradient(ellipse 30% 45% at 50% 0%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.15) 30%, rgba(212, 175, 55, 0.05) 50%, transparent 70%)`,
              clipPath: showBeam ? 'polygon(38% 0%, 62% 0%, 78% 100%, 22% 100%)' : 'polygon(48% 0%, 52% 0%, 52% 30%, 48% 30%)',
              transition: 'clip-path 1s cubic-bezier(0.22, 1, 0.36, 1) 0.1s, opacity 0.8s ease',
            }}
          />

          {/* DUST PARTICLES */}
          <div
            className={cn(
              "absolute inset-0 pointer-events-none transition-opacity duration-1500",
              showBeam ? "opacity-100" : "opacity-0"
            )}
            style={{
              background: `radial-gradient(ellipse 80% 100% at 50% 0%, rgba(212, 175, 55, 0.02) 0%, transparent 60%)`,
            }}
          />

          {/* FOCAL POOL */}
          <div
            className={cn(
              "absolute left-1/2 top-1/2 w-[400px] h-[400px] pointer-events-none transition-all duration-700",
              showLogo ? "opacity-100" : "opacity-0"
            )}
            style={{
              background: `radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(255, 255, 255, 0.08) 30%, rgba(255, 255, 255, 0.03) 50%, transparent 70%)`,
              transform: 'translate(-50%, -50%)',
              filter: 'blur(40px)',
              animation: isPulsed ? 'focal-pulse 3s ease-in-out infinite' : 'none',
            }}
          />

          {/* CENTER CONTENT */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={cn(
                "relative transition-all duration-1000 ease-out",
                showLogo ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-6"
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 -m-4 transition-opacity duration-700",
                  isPulsed ? "opacity-100" : "opacity-0"
                )}
                style={{
                  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)',
                  filter: 'blur(15px)',
                }}
              />
              <img
                src={filmmakerLogo}
                alt="Filmmaker.OG"
                className="w-32 h-32 object-contain rounded-lg relative"
                style={{
                  filter: isPulsed
                    ? 'brightness(1.2) drop-shadow(0 0 30px rgba(212, 175, 55, 0.5))'
                    : 'brightness(0.9)',
                  transition: 'filter 0.7s ease',
                }}
              />
            </div>

            <p
              className={cn(
                "mt-8 text-sm tracking-[0.4em] uppercase font-semibold transition-all duration-700",
                showTagline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              )}
              style={{
                color: '#D4AF37',
                textShadow: '0 0 20px rgba(212, 175, 55, 0.4)',
              }}
            >
              Know Your Numbers
            </p>

            <div className="mt-6 w-32 h-[2px] overflow-hidden bg-border-subtle rounded-full">
              <div
                className={cn(
                  "h-full bg-gold rounded-full transition-all",
                  showTagline && !shouldSkip ? "animate-progress-draw" : ""
                )}
                style={{
                  boxShadow: '0 0 15px rgba(212, 175, 55, 0.7)',
                  width: shouldSkip ? '100%' : (showTagline ? undefined : '0%'),
                }}
              />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            LANDING PAGE — Full Scrollable Content
            ═══════════════════════════════════════════════════════════════════ */}
        <main
          className={cn(
            "flex-1 flex flex-col transition-all duration-700",
            isComplete ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Cinematic Vignette */}
          <div className="vignette" />

          {/* ─────────────────────────────────────────────────────────
              SECTION 1: HERO
              ───────────────────────────────────────────────────────── */}
          <section className="relative overflow-hidden">
            {/* Ambient spotlight glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none animate-spotlight-pulse"
              style={{
                width: '100vw',
                height: '75vh',
                background: `radial-gradient(ellipse 50% 40% at 50% 10%, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.04) 40%, transparent 70%)`,
              }}
            />

            <div className="relative px-6 pt-24 pb-16 max-w-xl mx-auto text-center">
              {/* Logo */}
              <div className="mb-6 relative inline-block">
                <div
                  className="absolute inset-0 -m-6"
                  style={{
                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
                    filter: 'blur(12px)',
                  }}
                />
                <img
                  src={filmmakerLogo}
                  alt="Filmmaker.OG"
                  className="relative w-20 h-20 object-contain rounded-lg"
                  style={{
                    filter: 'brightness(1.15) drop-shadow(0 0 25px rgba(212, 175, 55, 0.45))',
                  }}
                />
              </div>

              {/* Eyebrow */}
              <p className="text-gold text-[10px] tracking-[0.35em] uppercase mb-5 font-semibold">
                Free Film Finance Simulator
              </p>

              {/* Headline */}
              <h1 className="font-bebas text-[clamp(2.4rem,9vw,3.8rem)] leading-[1.05] text-text-primary mb-5">
                SEE WHERE EVERY
                <br />
                DOLLAR{" "}
                <span className="text-gold">GOES</span>
              </h1>

              {/* Subhead */}
              <p className="text-text-mid text-sm leading-relaxed max-w-md mx-auto mb-10">
                Model your film's deal structure, capital stack, and revenue waterfall
                — the same analysis entertainment lawyers charge{" "}
                <span className="text-text-primary font-semibold">$5,000–$15,000</span>{" "}
                to produce. Free to simulate. Takes 2 minutes.
              </p>

              {/* CTA — Returning vs New User */}
              {isReturningUser ? (
                <div className="w-full max-w-[320px] mx-auto space-y-3">
                  <button
                    onClick={handleContinueClick}
                    className="w-full h-14 text-sm font-black tracking-[0.12em] transition-all active:scale-[0.96] rounded-md bg-gold-cta-subtle border border-gold-cta-muted text-gold-cta shadow-button hover:border-gold-cta"
                  >
                    <span className="flex items-center justify-center gap-2">
                      CONTINUE SIMULATION
                      <ArrowRight size={18} />
                    </span>
                  </button>
                  <p className="text-text-dim text-[11px] tracking-wider text-center">
                    {formatCompactCurrency(savedState!.budget)} budget in progress
                  </p>
                  <button
                    onClick={handleStartFresh}
                    className="w-full flex items-center justify-center gap-1.5 text-[11px] tracking-wider text-text-dim hover:text-text-mid transition-colors py-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Start fresh
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-[320px] mx-auto">
                  <button
                    onClick={handleStartClick}
                    className="w-full h-14 text-sm font-black tracking-[0.12em] transition-all active:scale-[0.96] rounded-md bg-gold-cta-subtle border border-gold-cta-muted text-gold-cta shadow-button hover:border-gold-cta"
                  >
                    <span className="flex items-center justify-center gap-2">
                      RUN THE NUMBERS
                      <ArrowRight size={18} />
                    </span>
                  </button>
                  <p className="text-text-dim text-[11px] tracking-wider mt-4">
                    No account required
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────
              SECTION 2: THE PROBLEM
              ───────────────────────────────────────────────────────── */}
          <section className="px-6 py-16 border-t border-border-subtle">
            <div className="max-w-3xl mx-auto">
              <p className="text-gold text-[10px] tracking-[0.3em] uppercase text-center mb-3 font-semibold">
                The Problem
              </p>
              <h2 className="font-bebas text-2xl md:text-3xl tracking-[0.08em] text-text-primary text-center mb-4">
                WHY MOST INDIE FILMS LOSE MONEY
              </h2>
              <p className="text-text-mid text-sm text-center max-w-lg mx-auto mb-10 leading-relaxed">
                It's not because the films are bad. It's because filmmakers sign deals
                they don't understand, with terms that guarantee they never see a dollar.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    title: "Hidden Fee Structures",
                    body: "Distribution fees, marketing expenses, and producer's reps can eat 50–70% of revenue before anyone gets paid. Most filmmakers don't see this until it's too late.",
                  },
                  {
                    title: "No Waterfall Visibility",
                    body: "You signed the deal, but do you know who gets paid first? Second? Last? If you can't map the waterfall, you can't protect your backend.",
                  },
                  {
                    title: "Information Asymmetry",
                    body: "Agencies, studios, and distributors thrive on you not knowing the numbers. The less you understand, the better their deal — and the worse yours.",
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="bg-bg-card border border-border-subtle rounded-lg p-5"
                  >
                    <h3 className="text-text-primary text-sm font-semibold mb-2">
                      {card.title}
                    </h3>
                    <p className="text-text-dim text-xs leading-relaxed">
                      {card.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────
              SECTION 3: HOW IT WORKS
              ───────────────────────────────────────────────────────── */}
          <section className="px-6 py-16 bg-bg-elevated border-t border-border-subtle">
            <div className="max-w-3xl mx-auto">
              <p className="text-gold text-[10px] tracking-[0.3em] uppercase text-center mb-3 font-semibold">
                How It Works
              </p>
              <h2 className="font-bebas text-2xl md:text-3xl tracking-[0.08em] text-text-primary text-center mb-10">
                FOUR STEPS TO CLARITY
              </h2>

              <div className="space-y-6">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <button
                      key={step.num}
                      onClick={() => navigate(`/calculator?tab=${step.tab}`)}
                      className="w-full flex items-start gap-5 bg-bg-card border border-border-subtle rounded-lg p-5 text-left group hover:border-border-default transition-colors"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-md bg-bg-elevated border border-border-subtle flex items-center justify-center group-hover:border-border-default transition-colors">
                        <Icon className="w-4 h-4 text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] text-text-dim tracking-wider">
                            {step.num}
                          </span>
                          <h3 className="text-text-primary text-sm font-semibold">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-text-dim text-xs leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-dim flex-shrink-0 mt-3 group-hover:text-text-mid transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────
              SECTION 4: SCENARIO PROMPT CAROUSEL
              ───────────────────────────────────────────────────────── */}
          <section className="py-16 border-t border-border-subtle">
            <div className="max-w-3xl mx-auto px-6 mb-8">
              <div className="flex items-center gap-2 justify-center mb-3">
                <MessageCircle className="w-4 h-4 text-gold" />
                <p className="text-gold text-[10px] tracking-[0.3em] uppercase font-semibold">
                  Real Questions, Real Answers
                </p>
              </div>
              <h2 className="font-bebas text-2xl md:text-3xl tracking-[0.08em] text-text-primary text-center mb-3">
                WHAT FILMMAKERS ASK
              </h2>
              <p className="text-text-mid text-sm text-center max-w-lg mx-auto leading-relaxed">
                These are the questions indie filmmakers ask every day.
                Our calculator helps you find the answers.
              </p>
            </div>

            {/* Horizontal Snap Carousel */}
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-4 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* Left spacer for centering on large screens */}
              <div className="flex-shrink-0 w-[max(0px,calc((100vw-768px)/2-1.5rem))]" />

              {scenarioPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={handleStartClick}
                  className="flex-shrink-0 w-[280px] snap-center bg-bg-card border border-border-subtle rounded-lg p-5 text-left hover:border-border-default transition-colors group"
                >
                  <p className="text-text-primary text-sm font-medium leading-snug mb-3 group-hover:text-text-mid transition-colors">
                    "{prompt.question}"
                  </p>
                  <p className="text-text-dim text-[11px] leading-relaxed mb-4">
                    {prompt.context}
                  </p>
                  <span className="flex items-center gap-1.5 text-gold-cta text-[11px] tracking-wider font-semibold">
                    Try the calculator <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}

              {/* Right spacer */}
              <div className="flex-shrink-0 w-[max(0px,calc((100vw-768px)/2-1.5rem))]" />
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────
              SECTION 5: TRUST BAR
              ───────────────────────────────────────────────────────── */}
          <section className="border-t border-border-subtle bg-bg-elevated">
            <div className="px-6 py-10 max-w-3xl mx-auto">
              <p className="text-text-dim text-[10px] tracking-[0.2em] uppercase text-center mb-6 font-semibold">
                What Others Charge for the Same Analysis
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {[
                  { label: "Entertainment Lawyer", cost: "$5K–$15K" },
                  { label: "Finance Consultant", cost: "$10K–$30K" },
                  { label: "Producer's Rep", cost: "$50K–$250K+" },
                  { label: "Filmmaker.OG", cost: "Free", highlight: true },
                ].map((item) => (
                  <div key={item.label} className="py-3">
                    <p
                      className={cn(
                        "font-mono text-lg font-bold",
                        item.highlight
                          ? "text-gold-cta"
                          : "text-text-dim line-through decoration-text-dim/40"
                      )}
                    >
                      {item.cost}
                    </p>
                    <p className="text-text-dim text-[10px] tracking-wider uppercase mt-1">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Sub-note */}
              <p className="text-text-dim text-[11px] text-center mt-6 max-w-md mx-auto leading-relaxed">
                The simulation is free. Professional document exports start at{" "}
                <span className="text-gold font-mono font-bold">$197</span>.
              </p>
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────
              SECTION 6: FAQ
              ───────────────────────────────────────────────────────── */}
          <section className="px-6 py-16 border-t border-border-subtle">
            <div className="max-w-xl mx-auto">
              <h2 className="font-bebas text-2xl tracking-[0.08em] text-text-primary text-center mb-8">
                FREQUENTLY ASKED QUESTIONS
              </h2>

              <div className="bg-bg-card border border-border-subtle rounded-lg px-5">
                {faqs.map((faq) => (
                  <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={() => navigate("/intro")}
                  className="text-text-dim hover:text-text-mid text-[11px] tracking-wider transition-colors"
                >
                  Read the full protocol documentation →
                </button>
              </div>
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────
              SECTION 7: STORE TEASE
              ───────────────────────────────────────────────────────── */}
          <section className="px-6 py-16 bg-bg-elevated border-t border-border-subtle">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 justify-center mb-3">
                <Sparkles className="w-4 h-4 text-gold" />
                <p className="text-gold text-[10px] tracking-[0.3em] uppercase font-semibold">
                  Professional Exports
                </p>
              </div>
              <h2 className="font-bebas text-2xl md:text-3xl tracking-[0.08em] text-text-primary text-center mb-3">
                READY TO GET SERIOUS?
              </h2>
              <p className="text-text-mid text-sm text-center max-w-lg mx-auto mb-8 leading-relaxed">
                Turn your simulation into investor-ready documents.
                One-time purchase. No subscriptions.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {products.map((product) => {
                  const Icon = product.icon;
                  return (
                    <button
                      key={product.id}
                      onClick={() => navigate(`/store/${product.slug}`)}
                      className={cn(
                        "text-left p-4 rounded-lg border transition-all hover:border-border-default",
                        product.featured
                          ? "bg-gold/[0.04] border-border-default"
                          : "bg-bg-card border-border-subtle"
                      )}
                    >
                      {product.featured && (
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-2.5 h-2.5 text-gold fill-gold" />
                          <span className="text-gold text-[9px] tracking-[0.2em] uppercase font-bold">
                            Popular
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={cn("w-3.5 h-3.5", product.featured ? "text-gold" : "text-text-dim")} />
                        <span className="font-bebas text-sm text-text-primary leading-tight">
                          {product.name.replace("The ", "").toUpperCase()}
                        </span>
                      </div>
                      <div className="mb-1">
                        {product.originalPrice && (
                          <span className="text-text-dim text-[10px] line-through mr-1.5 font-mono">
                            ${product.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className={cn(
                          "font-mono text-lg font-bold",
                          product.featured ? "text-gold-cta" : "text-gold"
                        )}>
                          ${product.price.toLocaleString()}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-text-dim text-[10px] hover:text-text-mid transition-colors">
                        Details <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={() => navigate("/store/compare")}
                  className="text-text-dim hover:text-text-mid text-[11px] tracking-wider transition-colors"
                >
                  Compare all packages →
                </button>
              </div>
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────
              SECTION 8: FINAL CTA
              ───────────────────────────────────────────────────────── */}
          <section className="relative px-6 py-20 border-t border-border-subtle overflow-hidden">
            {/* Ambient glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                width: '100vw',
                height: '100%',
                background: `radial-gradient(ellipse 60% 60% at 50% 0%, rgba(212, 175, 55, 0.06) 0%, transparent 70%)`,
              }}
            />

            <div className="relative max-w-md mx-auto text-center">
              <Shield className="w-6 h-6 text-gold mx-auto mb-4" />
              <h2 className="font-bebas text-[clamp(1.8rem,6vw,2.5rem)] leading-[1.1] text-text-primary mb-4">
                KNOW YOUR NUMBERS
                <br />
                <span className="text-gold">BEFORE YOU SIGN</span>
              </h2>
              <p className="text-text-mid text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                Don't walk into an investor meeting, distributor negotiation,
                or signing without understanding your deal.
              </p>

              <button
                onClick={handleStartClick}
                className="w-full max-w-[320px] h-14 text-sm font-black tracking-[0.12em] transition-all active:scale-[0.96] rounded-md bg-gold-cta-subtle border border-gold-cta-muted text-gold-cta shadow-button hover:border-gold-cta"
              >
                <span className="flex items-center justify-center gap-2">
                  START FREE SIMULATION
                  <ArrowRight size={18} />
                </span>
              </button>
              <p className="text-text-dim text-[11px] tracking-wider mt-4">
                No account required · Takes 2 minutes
              </p>
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────
              FOOTER
              ───────────────────────────────────────────────────────── */}
          <footer className="border-t border-border-subtle py-8">
            <div className="px-6 text-center max-w-2xl mx-auto">
              <p className="text-text-dim text-[10px] tracking-wide leading-relaxed">
                This tool is for educational and informational purposes only.
                It does not constitute legal, tax, accounting, or investment advice.
                The financial projections are based on user-provided assumptions and
                should not be relied upon as guarantees of future performance.
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
