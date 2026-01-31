import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowLeft, RotateCcw, ChevronRight, ChevronLeft } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { calculateWaterfall, WaterfallInputs, WaterfallResult, GuildState } from "@/lib/waterfall";

// Step Components - Anxiety First Flow
import BudgetStep from "@/components/calculator/steps/BudgetStep";
import SalesAgentStep from "@/components/calculator/steps/SalesAgentStep";
import CamFeeStep from "@/components/calculator/steps/CamFeeStep";
import MarketingStep from "@/components/calculator/steps/MarketingStep";
import GuildsStep from "@/components/calculator/steps/GuildsStep";
import OffTopTotalStep from "@/components/calculator/steps/OffTopTotalStep";
import CapitalSelectStep, { CapitalSelections } from "@/components/calculator/steps/CapitalSelectStep";
import CapitalDetailsStep from "@/components/calculator/steps/CapitalDetailsStep";
import BreakevenStep from "@/components/calculator/steps/BreakevenStep";
import AcquisitionStep from "@/components/calculator/steps/AcquisitionStep";
import RevealStep from "@/components/calculator/steps/RevealStep";
import WaterfallStep from "@/components/calculator/steps/WaterfallStep";
import StepIndicator from "@/components/calculator/StepIndicator";

const STORAGE_KEY = "filmmaker_og_inputs";
const TOTAL_STEPS = 12;

// Step labels for the indicator - grouped into phases
const STEP_LABELS = [
  'BUDGET',      // 1
  'SALES',       // 2
  'CAM',         // 3
  'MARKETING',   // 4
  'GUILDS',      // 5
  'OFF-TOP',     // 6
  'FUNDING',     // 7
  'DETAILS',     // 8
  'BREAKEVEN',   // 9
  'OFFER',       // 10
  'REVEAL',      // 11
  'WATERFALL',   // 12
];

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
      case 1: // Budget
        return inputs.budget > 0;
      case 2: // Sales Agent
        return true; // 0% is valid
      case 3: // CAM Fee
        return true; // Fixed, always proceed
      case 4: // Marketing
        return true; // 0 is valid
      case 5: // Guilds
        return true; // No selection is valid
      case 6: // Off-Top Total
        return true; // Display only
      case 7: // Capital Stack Selection
        return Object.values(capitalSelections).some(Boolean);
      case 8: // Capital Details
        return true; // Any values work
      case 9: // Breakeven
        return true; // Display only
      case 10: // Acquisition Price
        return inputs.revenue > 0;
      case 11: // Reveal
        return true;
      default:
        return true;
    }
  };

  // Get step phase/title
  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'THE BUDGET';
      case 2: return 'SALES AGENT';
      case 3: return 'CAM FEE';
      case 4: return 'MARKETING';
      case 5: return 'GUILDS';
      case 6: return 'OFF-THE-TOP';
      case 7: return 'CAPITAL STACK';
      case 8: return 'CAPITAL DETAILS';
      case 9: return 'THE RECKONING';
      case 10: return 'THE OFFER';
      case 11: return 'YOUR PROFIT';
      case 12: return 'THE WATERFALL';
      default: return 'WATERFALL TERMINAL';
    }
  };

  // Get phase label for header
  const getPhaseLabel = () => {
    if (currentStep <= 6) return 'PHASE 1: THE AWAKENING';
    if (currentStep <= 9) return 'PHASE 2: THE INVESTORS';
    if (currentStep <= 10) return 'PHASE 3: THE OFFER';
    return 'PHASE 4: THE REVEAL';
  };

  // Get CTA text
  const getCtaText = () => {
    switch (currentStep) {
      case 1: return 'WHO GETS PAID FIRST?';
      case 5: return 'ADD IT UP';
      case 6: return 'CONTINUE';
      case 8: return 'THE RECKONING';
      case 9: return 'NOW THE DEAL';
      case 10: return 'SEE RESULTS';
      case 11: return 'SEE BREAKDOWN';
      default: return 'CONTINUE';
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

      {/* Step Counter (simplified - showing step X of 12) */}
      <div className="border-b border-border bg-card/50 py-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {getPhaseLabel()}
          </span>
          <span className="text-muted-foreground/50">•</span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {currentStep}/{TOTAL_STEPS}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <main
        ref={mainRef}
        className="flex-1 px-5 py-6 pb-32 overflow-y-auto"
      >
        {currentStep === 1 && (
          <BudgetStep inputs={inputs} onUpdateInput={updateInput} />
        )}
        {currentStep === 2 && (
          <SalesAgentStep inputs={inputs} onUpdateInput={updateInput} />
        )}
        {currentStep === 3 && (
          <CamFeeStep inputs={inputs} />
        )}
        {currentStep === 4 && (
          <MarketingStep inputs={inputs} onUpdateInput={updateInput} />
        )}
        {currentStep === 5 && (
          <GuildsStep inputs={inputs} guilds={guilds} onToggleGuild={toggleGuild} />
        )}
        {currentStep === 6 && (
          <OffTopTotalStep inputs={inputs} guilds={guilds} />
        )}
        {currentStep === 7 && (
          <CapitalSelectStep selections={capitalSelections} onToggle={toggleCapitalSelection} />
        )}
        {currentStep === 8 && (
          <CapitalDetailsStep inputs={inputs} selections={capitalSelections} onUpdateInput={updateInput} />
        )}
        {currentStep === 9 && (
          <BreakevenStep inputs={inputs} guilds={guilds} selections={capitalSelections} />
        )}
        {currentStep === 10 && (
          <AcquisitionStep inputs={inputs} guilds={guilds} selections={capitalSelections} onUpdateInput={updateInput} />
        )}
        {currentStep === 11 && result && (
          <RevealStep result={result} equity={inputs.equity} />
        )}
        {currentStep === 12 && result && (
          <WaterfallStep result={result} inputs={inputs} />
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
