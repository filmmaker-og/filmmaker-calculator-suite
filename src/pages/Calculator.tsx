import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useHaptics } from "@/hooks/use-haptics";
import { useSwipe } from "@/hooks/use-swipe";
import { ArrowLeft, RotateCcw, ChevronRight, ChevronLeft } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { calculateWaterfall, WaterfallInputs, WaterfallResult, GuildState } from "@/lib/waterfall";
import { cn } from "@/lib/utils";

// Step Components - Anxiety First Flow
import BudgetStep from "@/components/calculator/steps/BudgetStep";
import SalesAgentStep from "@/components/calculator/steps/SalesAgentStep";
import CamFeeStep from "@/components/calculator/steps/CamFeeStep";
import MarketingStep from "@/components/calculator/steps/MarketingStep";
import GuildsStep from "@/components/calculator/steps/GuildsStep";
import OffTopTotalStep from "@/components/calculator/steps/OffTopTotalStep";
import CapitalSelectStep, { CapitalSelections } from "@/components/calculator/steps/CapitalSelectStep";
import TaxCreditsStep from "@/components/calculator/steps/TaxCreditsStep";
import SeniorDebtStep from "@/components/calculator/steps/SeniorDebtStep";
import GapLoanStep from "@/components/calculator/steps/GapLoanStep";
import EquityStep from "@/components/calculator/steps/EquityStep";
import BreakevenStep from "@/components/calculator/steps/BreakevenStep";
import AcquisitionStep from "@/components/calculator/steps/AcquisitionStep";
import RevealStep from "@/components/calculator/steps/RevealStep";
import WaterfallStep from "@/components/calculator/steps/WaterfallStep";
import ProgressBar from "@/components/calculator/ProgressBar";

const STORAGE_KEY = "filmmaker_og_inputs";

const defaultInputs: WaterfallInputs = {
  revenue: 0,
  budget: 0,
  credits: 0,
  debt: 0,
  seniorDebtRate: 10,
  mezzanineDebt: 0,
  mezzanineRate: 15,
  equity: 0,
  premium: 20,
  salesFee: 15,
  salesExp: 75000,
};

const defaultGuilds: GuildState = {
  sag: false,
  wga: false,
  dga: false,
};

const defaultCapitalSelections: CapitalSelections = {
  taxCredits: false,
  seniorDebt: true,
  gapLoan: false,
  equity: true,
};

// Step types for dynamic flow
type StepType = 
  | 'budget' 
  | 'sales' 
  | 'cam' 
  | 'marketing' 
  | 'guilds' 
  | 'offtop' 
  | 'capitalSelect'
  | 'taxCredits'
  | 'seniorDebt'
  | 'gapLoan'
  | 'equity'
  | 'breakeven'
  | 'acquisition'
  | 'reveal'
  | 'waterfall';

const Calculator = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const haptics = useHaptics();
  const mainRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [inputs, setInputs] = useState<WaterfallInputs>(defaultInputs);
  const [guilds, setGuilds] = useState<GuildState>(defaultGuilds);
  const [capitalSelections, setCapitalSelections] = useState<CapitalSelections>(defaultCapitalSelections);
  const [result, setResult] = useState<WaterfallResult | null>(null);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [shakeButton, setShakeButton] = useState(false);

  // Build dynamic step list based on capital selections
  const steps = useMemo((): StepType[] => {
    const baseSteps: StepType[] = ['budget', 'sales', 'cam', 'marketing', 'guilds', 'offtop', 'capitalSelect'];
    
    // Add capital detail steps based on selections
    const capitalSteps: StepType[] = [];
    if (capitalSelections.taxCredits) capitalSteps.push('taxCredits');
    if (capitalSelections.seniorDebt) capitalSteps.push('seniorDebt');
    if (capitalSelections.gapLoan) capitalSteps.push('gapLoan');
    if (capitalSelections.equity) capitalSteps.push('equity');
    
    const endSteps: StepType[] = ['breakeven', 'acquisition', 'reveal', 'waterfall'];
    
    return [...baseSteps, ...capitalSteps, ...endSteps];
  }, [capitalSelections]);

  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex];

  // Build step labels for progress bar
  const stepLabels = useMemo(() => {
    return steps.map(step => {
      switch (step) {
        case 'budget': return 'BUDGET';
        case 'sales': return 'SALES';
        case 'cam': return 'CAM';
        case 'marketing': return 'MKTG';
        case 'guilds': return 'GUILDS';
        case 'offtop': return 'OFF-TOP';
        case 'capitalSelect': return 'FUNDING';
        case 'taxCredits': return 'TAX CR';
        case 'seniorDebt': return 'DEBT';
        case 'gapLoan': return 'GAP';
        case 'equity': return 'EQUITY';
        case 'breakeven': return 'B/E';
        case 'acquisition': return 'OFFER';
        case 'reveal': return 'REVEAL';
        case 'waterfall': return 'RESULTS';
        default: return '';
      }
    });
  }, [steps]);

  // Reset on ?reset=true
  useEffect(() => {
    if (searchParams.get("reset") === "true") {
      localStorage.removeItem(STORAGE_KEY);
      setInputs(defaultInputs);
      setGuilds(defaultGuilds);
      setCapitalSelections(defaultCapitalSelections);
      setCurrentStepIndex(0);
    }
  }, [searchParams]);

  // Load saved state
  useEffect(() => {
    if (searchParams.get("reset") === "true") return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.inputs) setInputs(parsed.inputs);
        if (parsed.guilds) setGuilds(parsed.guilds);
        if (parsed.capitalSelections) setCapitalSelections(parsed.capitalSelections);
        if (typeof parsed.currentStepIndex === 'number') setCurrentStepIndex(parsed.currentStepIndex);
      } catch (e) {
        console.error("Failed to load saved inputs");
      }
    }
  }, [searchParams]);

  // Save state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
      inputs, 
      guilds, 
      capitalSelections,
      currentStepIndex 
    }));
  }, [inputs, guilds, capitalSelections, currentStepIndex]);

  // Calculate on input change
  useEffect(() => {
    const calculated = calculateWaterfall(inputs, guilds);
    setResult(calculated);
  }, [inputs, guilds]);

  // Auth
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Scroll to top when switching steps
  useEffect(() => {
    window.scrollTo(0, 0);
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [currentStepIndex]);

  const handleStartOver = () => {
    haptics.medium();
    localStorage.removeItem(STORAGE_KEY);
    setInputs(defaultInputs);
    setGuilds(defaultGuilds);
    setCapitalSelections(defaultCapitalSelections);
    setCurrentStepIndex(0);
  };

  const updateInput = useCallback((key: keyof WaterfallInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleGuild = useCallback((guild: keyof GuildState) => {
    haptics.light();
    setGuilds(prev => ({ ...prev, [guild]: !prev[guild] }));
  }, [haptics]);

  const toggleCapitalSelection = useCallback((key: keyof CapitalSelections) => {
    setCapitalSelections(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Can proceed to next step?
  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 'budget':
        return inputs.budget > 0;
      case 'capitalSelect':
        return Object.values(capitalSelections).some(Boolean);
      case 'acquisition':
        return inputs.revenue > 0;
      default:
        return true;
    }
  }, [currentStep, inputs.budget, inputs.revenue, capitalSelections]);

  const nextStep = useCallback(() => {
    if (!canProceed()) {
      setShakeButton(true);
      haptics.error();
      setTimeout(() => setShakeButton(false), 300);
      return;
    }
    
    haptics.step();
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [canProceed, currentStepIndex, totalSteps, haptics]);

  const prevStep = useCallback(() => {
    haptics.light();
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex, haptics]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < currentStepIndex) {
      haptics.light();
      setCurrentStepIndex(stepIndex);
    }
  }, [currentStepIndex, haptics]);

  // Swipe navigation
  const { handlers: swipeHandlers, state: swipeState } = useSwipe({
    onSwipeLeft: () => {
      if (canProceed() && currentStepIndex < totalSteps - 1) {
        nextStep();
      }
    },
    onSwipeRight: () => {
      if (currentStepIndex > 0) {
        prevStep();
      }
    },
    threshold: 50,
    rubberBand: true,
  });

  // Get step title
  const getStepTitle = () => {
    switch (currentStep) {
      case 'budget': return 'THE BUDGET';
      case 'sales': return 'SALES AGENT';
      case 'cam': return 'CAM FEE';
      case 'marketing': return 'MARKETING';
      case 'guilds': return 'GUILDS';
      case 'offtop': return 'OFF-THE-TOP';
      case 'capitalSelect': return 'CAPITAL STACK';
      case 'taxCredits': return 'TAX CREDITS';
      case 'seniorDebt': return 'SENIOR DEBT';
      case 'gapLoan': return 'GAP LOAN';
      case 'equity': return 'EQUITY';
      case 'breakeven': return 'THE RECKONING';
      case 'acquisition': return 'THE OFFER';
      case 'reveal': return 'YOUR PROFIT';
      case 'waterfall': return 'THE WATERFALL';
      default: return 'WATERFALL TERMINAL';
    }
  };

  // Get CTA text
  const getCtaText = () => {
    switch (currentStep) {
      case 'budget': return 'WHO GETS PAID FIRST?';
      case 'guilds': return 'ADD IT UP';
      case 'offtop': return 'NOW THE INVESTORS';
      case 'capitalSelect': return 'ENTER DETAILS';
      case 'equity': return 'THE RECKONING';
      case 'breakeven': return 'NOW THE DEAL';
      case 'acquisition': return 'SEE RESULTS';
      case 'reveal': return 'SEE BREAKDOWN';
      default: return 'CONTINUE';
    }
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 'budget':
        return <BudgetStep inputs={inputs} onUpdateInput={updateInput} />;
      case 'sales':
        return <SalesAgentStep inputs={inputs} onUpdateInput={updateInput} />;
      case 'cam':
        return <CamFeeStep inputs={inputs} />;
      case 'marketing':
        return <MarketingStep inputs={inputs} onUpdateInput={updateInput} />;
      case 'guilds':
        return <GuildsStep inputs={inputs} guilds={guilds} onToggleGuild={toggleGuild} />;
      case 'offtop':
        return <OffTopTotalStep inputs={inputs} guilds={guilds} />;
      case 'capitalSelect':
        return <CapitalSelectStep selections={capitalSelections} onToggle={toggleCapitalSelection} />;
      case 'taxCredits':
        return <TaxCreditsStep inputs={inputs} onUpdateInput={updateInput} />;
      case 'seniorDebt':
        return <SeniorDebtStep inputs={inputs} onUpdateInput={updateInput} />;
      case 'gapLoan':
        return <GapLoanStep inputs={inputs} onUpdateInput={updateInput} />;
      case 'equity':
        return <EquityStep inputs={inputs} onUpdateInput={updateInput} />;
      case 'breakeven':
        return <BreakevenStep inputs={inputs} guilds={guilds} selections={capitalSelections} />;
      case 'acquisition':
        return <AcquisitionStep inputs={inputs} guilds={guilds} selections={capitalSelections} onUpdateInput={updateInput} />;
      case 'reveal':
        return result ? <RevealStep result={result} equity={inputs.equity} /> : null;
      case 'waterfall':
        return result ? <WaterfallStep result={result} inputs={inputs} /> : null;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="h-14 flex items-center justify-center border-b border-border">
          <span className="font-bebas text-lg tracking-widest text-gold">WATERFALL TERMINAL</span>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header 
        className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-4"
        style={{ backgroundColor: '#0A0A0A' }}
      >
        <button
          onClick={() => currentStepIndex > 0 ? prevStep() : navigate("/")}
          className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity touch-feedback"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex-1 text-center">
          <span className="font-bebas text-base tracking-widest text-gold">
            {getStepTitle()}
          </span>
        </div>

        <div className="w-10 h-10 flex items-center justify-center">
          {currentStepIndex > 0 && (
            <button
              onClick={handleStartOver}
              className="w-10 h-10 flex items-center justify-center hover:opacity-80 touch-feedback"
            >
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </header>

      {/* Gold line separator */}
      <div
        className="fixed top-14 left-0 right-0 h-[1px] z-50"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.5) 20%, rgba(212, 175, 55, 0.5) 80%, transparent 100%)",
        }}
      />

      {/* Spacer for fixed header */}
      <div className="h-14" />

      {/* Progress Bar - Sticky */}
      <ProgressBar
        currentStep={currentStepIndex + 1}
        totalSteps={totalSteps}
        stepLabels={stepLabels}
        onStepClick={(step) => goToStep(step - 1)}
      />

      {/* Main Content with Swipe */}
      <main
        ref={mainRef}
        className="flex-1 px-5 py-6 pb-32 overflow-y-auto"
        {...swipeHandlers}
      >
        {/* Swipe offset transform */}
        <div
          className={cn(
            "transition-transform",
            swipeState.isSwiping ? "duration-0" : "duration-200 ease-out"
          )}
          style={{
            transform: swipeState.isSwiping ? `translateX(${swipeState.offset * 0.3}px)` : undefined,
            opacity: swipeState.isSwiping ? 1 - Math.abs(swipeState.offset) / 400 : 1,
          }}
        >
          {renderStep()}
        </div>

        {/* Swipe edge hints */}
        {currentStepIndex > 0 && (
          <div
            className={cn(
              "fixed left-2 top-1/2 -translate-y-1/2 text-gold/30 transition-opacity",
              swipeState.direction === 'right' ? 'opacity-100' : 'opacity-0'
            )}
          >
            <ChevronLeft className="w-6 h-6" />
          </div>
        )}
        {currentStepIndex < totalSteps - 1 && canProceed() && (
          <div
            className={cn(
              "fixed right-2 top-1/2 -translate-y-1/2 text-gold/30 transition-opacity",
              swipeState.direction === 'left' ? 'opacity-100' : 'opacity-0'
            )}
          >
            <ChevronRight className="w-6 h-6" />
          </div>
        )}
      </main>

      {/* Fixed Bottom CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 px-5 py-4 bg-background z-40"
        style={{
          borderTop: '1px solid hsl(var(--border))',
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))'
        }}
      >
        {currentStepIndex < totalSteps - 1 ? (
          <div className="flex gap-3">
            {currentStepIndex > 0 && (
              <Button
                onClick={prevStep}
                variant="outline"
                className="h-14 px-6 text-sm font-semibold tracking-wider rounded-none border-border hover:border-gold/50 hover:bg-transparent touch-feedback active:scale-95 transition-transform"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={nextStep}
              onTouchStart={() => setIsButtonPressed(true)}
              onTouchEnd={() => setIsButtonPressed(false)}
              onMouseDown={() => setIsButtonPressed(true)}
              onMouseUp={() => setIsButtonPressed(false)}
              onMouseLeave={() => setIsButtonPressed(false)}
              className={cn(
                "flex-1 h-14 text-base font-black tracking-[0.15em] rounded-none bg-gold text-black hover:bg-gold-highlight transition-all",
                isButtonPressed && "scale-[0.97]",
                shakeButton && "animate-shake",
                !canProceed() && "opacity-40 cursor-not-allowed"
              )}
              style={{
                boxShadow: canProceed() ? '0 0 30px rgba(212, 175, 55, 0.3)' : 'none',
              }}
            >
              <span className="flex items-center justify-center gap-3">
                {getCtaText()}
                <ChevronRight className="w-5 h-5" />
              </span>
            </Button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={prevStep}
              variant="outline"
              className="h-14 px-6 text-sm font-semibold tracking-wider rounded-none border-border hover:border-gold/50 hover:bg-transparent touch-feedback active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleStartOver}
              variant="outline"
              className="flex-1 h-14 text-sm font-semibold tracking-wider rounded-none border-border hover:border-gold/50 hover:bg-transparent touch-feedback active:scale-95"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              START OVER
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;
