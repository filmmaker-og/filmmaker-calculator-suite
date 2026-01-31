import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowLeft, RotateCcw, ChevronRight, ChevronLeft } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { calculateWaterfall, WaterfallInputs, WaterfallResult, GuildState } from "@/lib/waterfall";

// Step Components
import DealStep from "@/components/calculator/steps/DealStep";
import CapitalSelectStep, { CapitalSelections } from "@/components/calculator/steps/CapitalSelectStep";
import CapitalDetailsStep from "@/components/calculator/steps/CapitalDetailsStep";
import DeductionsStep from "@/components/calculator/steps/DeductionsStep";
import RevealStep from "@/components/calculator/steps/RevealStep";
import WaterfallStep from "@/components/calculator/steps/WaterfallStep";
import StepIndicator from "@/components/calculator/StepIndicator";

const STORAGE_KEY = "filmmaker_og_inputs";
const TOTAL_STEPS = 6;

const STEP_LABELS = ['DEAL', 'CAPITAL', 'DETAILS', 'COSTS', 'REVEAL', 'WATERFALL'];

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

const Calculator = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const haptics = useHaptics();
  const mainRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [inputs, setInputs] = useState<WaterfallInputs>(defaultInputs);
  const [guilds, setGuilds] = useState<GuildState>(defaultGuilds);
  const [capitalSelections, setCapitalSelections] = useState<CapitalSelections>(defaultCapitalSelections);
  const [result, setResult] = useState<WaterfallResult | null>(null);

  // Reset on ?reset=true
  useEffect(() => {
    if (searchParams.get("reset") === "true") {
      localStorage.removeItem(STORAGE_KEY);
      setInputs(defaultInputs);
      setGuilds(defaultGuilds);
      setCapitalSelections(defaultCapitalSelections);
      setCurrentStep(1);
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
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
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
      currentStep 
    }));
  }, [inputs, guilds, capitalSelections, currentStep]);

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
  }, [currentStep]);

  const handleStartOver = () => {
    haptics.medium();
    localStorage.removeItem(STORAGE_KEY);
    setInputs(defaultInputs);
    setGuilds(defaultGuilds);
    setCapitalSelections(defaultCapitalSelections);
    setCurrentStep(1);
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

  const nextStep = () => {
    haptics.medium();
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    haptics.light();
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step < currentStep) {
      haptics.light();
      setCurrentStep(step);
    }
  };

  // Can proceed to next step?
  const canProceed = () => {
    switch (currentStep) {
      case 1: // Deal
        return inputs.budget > 0 && inputs.revenue > 0;
      case 2: // Capital Select
        return Object.values(capitalSelections).some(Boolean);
      case 3: // Capital Details
        return true; // Allow proceeding with any values
      case 4: // Deductions
        return true;
      case 5: // Reveal
        return true;
      default:
        return true;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'THE DEAL';
      case 2: return 'CAPITAL STACK';
      case 3: return 'CAPITAL DETAILS';
      case 4: return 'DEDUCTIONS';
      case 5: return 'YOUR PROFIT';
      case 6: return 'THE WATERFALL';
      default: return 'WATERFALL TERMINAL';
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
      <header className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-4 bg-background border-b border-border">
        <button
          onClick={() => currentStep > 1 ? prevStep() : navigate("/")}
          className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex-1 text-center">
          <span className="font-bebas text-base tracking-widest text-gold">
            {getStepTitle()}
          </span>
        </div>

        <div className="w-10 h-10 flex items-center justify-center">
          {currentStep > 1 && (
            <button
              onClick={handleStartOver}
              className="w-10 h-10 flex items-center justify-center hover:opacity-80"
            >
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14" />

      {/* Step Indicator */}
      <div className="border-b border-border bg-card/50">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          stepLabels={STEP_LABELS}
          onStepClick={goToStep}
        />
      </div>

      {/* Main Content */}
      <main
        ref={mainRef}
        className="flex-1 px-5 py-6 pb-32 overflow-y-auto"
      >
        {currentStep === 1 && (
          <DealStep
            inputs={inputs}
            onUpdateInput={updateInput}
          />
        )}
        {currentStep === 2 && (
          <CapitalSelectStep
            selections={capitalSelections}
            onToggle={toggleCapitalSelection}
          />
        )}
        {currentStep === 3 && (
          <CapitalDetailsStep
            inputs={inputs}
            selections={capitalSelections}
            onUpdateInput={updateInput}
          />
        )}
        {currentStep === 4 && (
          <DeductionsStep
            inputs={inputs}
            guilds={guilds}
            onUpdateInput={updateInput}
            onToggleGuild={toggleGuild}
          />
        )}
        {currentStep === 5 && result && (
          <RevealStep
            result={result}
            equity={inputs.equity}
          />
        )}
        {currentStep === 6 && result && (
          <WaterfallStep
            result={result}
            inputs={inputs}
          />
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
        {currentStep < TOTAL_STEPS ? (
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                onClick={prevStep}
                variant="outline"
                className="h-14 px-6 text-sm font-semibold tracking-wider rounded-none border-border hover:border-gold/50 hover:bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex-1 h-14 text-base font-black tracking-[0.15em] rounded-none bg-gold text-black hover:bg-gold-highlight disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              style={{
                boxShadow: canProceed() ? '0 0 30px rgba(212, 175, 55, 0.3)' : 'none',
              }}
            >
              <span className="flex items-center justify-center gap-3">
                {currentStep === 5 ? 'SEE BREAKDOWN' : 'CONTINUE'}
                <ChevronRight className="w-5 h-5" />
              </span>
            </Button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={prevStep}
              variant="outline"
              className="h-14 px-6 text-sm font-semibold tracking-wider rounded-none border-border hover:border-gold/50 hover:bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleStartOver}
              variant="outline"
              className="flex-1 h-14 text-sm font-semibold tracking-wider rounded-none border-border hover:border-gold/50 hover:bg-transparent"
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
