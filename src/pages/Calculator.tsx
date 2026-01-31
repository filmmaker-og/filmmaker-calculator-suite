import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSwipe } from "@/hooks/use-swipe";
import { useHaptics } from "@/hooks/use-haptics";
import { ChevronLeft, ChevronRight, Home, RotateCcw } from "lucide-react";
import { User } from "@supabase/supabase-js";
import WizardStep1 from "@/components/calculator/WizardStep1";
import WizardStep2 from "@/components/calculator/WizardStep2";
import WizardStep3 from "@/components/calculator/WizardStep3";
import ResultsDashboard from "@/components/calculator/ResultsDashboard";
import MobileMenu from "@/components/MobileMenu";
import { calculateWaterfall, WaterfallInputs, WaterfallResult, GuildState } from "@/lib/waterfall";

const STORAGE_KEY = "filmmaker_og_inputs";
const TOTAL_STEPS = 4;
const STEP_LABELS = ['DEAL', 'CAPITAL', 'COSTS', 'RESULTS'];
const STEP_TYPES: ('input' | 'output')[] = ['input', 'input', 'input', 'output'];

const defaultInputs: WaterfallInputs = {
  revenue: 3500000,
  budget: 2000000,
  credits: 400000,
  debt: 600000,
  seniorDebtRate: 10,
  mezzanineDebt: 0,
  mezzanineRate: 15,
  equity: 1000000,
  premium: 20,
  salesFee: 15,
  salesExp: 75000,
};

const defaultGuilds: GuildState = {
  sag: false,
  wga: false,
  dga: false,
};

const Calculator = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const haptics = useHaptics();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [inputs, setInputs] = useState<WaterfallInputs>(defaultInputs);
  const [guilds, setGuilds] = useState<GuildState>(defaultGuilds);
  const [result, setResult] = useState<WaterfallResult | null>(null);

  useEffect(() => {
    if (searchParams.get("reset") === "true") {
      localStorage.removeItem(STORAGE_KEY);
      setInputs(defaultInputs);
      setGuilds(defaultGuilds);
    }
  }, []);

  useEffect(() => {
    if (searchParams.get("reset") === "true") return;
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.inputs) setInputs(parsed.inputs);
        if (parsed.guilds) setGuilds(parsed.guilds);
        if (parsed.currentStep) {
          const mappedStep = parsed.currentStep >= 5 ? 4 : Math.min(parsed.currentStep, 4);
          setCurrentStep(mappedStep);
        }
      } catch (e) {
        console.error("Failed to load saved inputs");
      }
    }
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ inputs, guilds, currentStep }));
  }, [inputs, guilds, currentStep]);

  useEffect(() => {
    const calculated = calculateWaterfall(inputs, guilds);
    setResult(calculated);
  }, [inputs, guilds]);

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
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(STORAGE_KEY);
    navigate("/");
  };

  const handleStartOver = () => {
    haptics.medium();
    localStorage.removeItem(STORAGE_KEY);
    setInputs(defaultInputs);
    setGuilds(defaultGuilds);
    setCurrentStep(1);
  };

  const updateInput = useCallback((key: keyof WaterfallInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleGuild = useCallback((guild: keyof GuildState) => {
    haptics.light();
    setGuilds(prev => ({ ...prev, [guild]: !prev[guild] }));
  }, [haptics]);

  const nextStep = useCallback(() => {
    haptics.step();
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  }, [haptics]);
  
  const prevStep = useCallback(() => {
    haptics.step();
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, [haptics]);

  const goToStep = useCallback((step: number) => {
    haptics.light();
    setCurrentStep(step);
  }, [haptics]);

  const { handlers: swipeHandlers, state: swipeState } = useSwipe({
    onSwipeLeft: () => currentStep < TOTAL_STEPS && nextStep(),
    onSwipeRight: () => currentStep > 1 && prevStep(),
    threshold: 50,
    rubberBand: true,
    maxOffset: 120,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-6 safe-top bg-card" style={{ borderBottom: '1px solid hsl(var(--gold))', borderLeft: '3px solid hsl(var(--gold))' }}>
          <div className="w-12 h-12" />
          <span className="flex-1 text-center font-bebas text-lg tracking-widest text-gold">
            WATERFALL TERMINAL
          </span>
          <div className="w-12 h-12" />
        </header>
        <div className="header-spacer" />
        <div className="flex-1 flex items-center justify-center">
          <div className="skeleton-gold w-16 h-16 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - Context strip pattern */}
      <header 
        className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-6 safe-top bg-card"
        style={{ borderBottom: '1px solid hsl(var(--gold))', borderLeft: '3px solid hsl(var(--gold))' }}
      >
        <button
          onClick={() => navigate("/")}
          className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-opacity touch-feedback -ml-1"
        >
          <Home className="w-5 h-5 text-gold" />
        </button>
        
        <span className="flex-1 text-center font-bebas text-lg tracking-widest text-gold">
          WATERFALL TERMINAL
        </span>
        
        <MobileMenu onSignOut={handleSignOut} />
      </header>

      <div className="header-spacer" />

      {/* Status Bar - Tappable step labels with INPUT/OUTPUT indicator */}
      <div className="px-6 py-3 border-b border-border bg-card">
        {/* Step Type Indicator */}
        <div className="flex items-center justify-center mb-2">
          <span
            className={`text-[9px] uppercase tracking-[0.2em] font-semibold px-3 py-1 rounded-full transition-all duration-200 ${
              currentStep === 4
                ? 'bg-gold/20 text-gold'
                : 'bg-card border border-border text-muted-foreground'
            }`}
          >
            {currentStep === 4 ? '◆ OUTPUT' : `INPUT ${currentStep}/3`}
          </span>
        </div>

        <div className="flex items-center justify-center gap-0 mb-3">
          {STEP_LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => goToStep(i + 1)}
              className={`text-xs tracking-wider py-2 px-2 min-h-[44px] transition-all duration-150 ${
                i + 1 === currentStep
                  ? 'text-gold font-semibold'
                  : i + 1 < currentStep
                    ? 'text-muted-foreground hover:text-gold/70'
                    : 'text-muted-foreground/50'
              }`}
            >
              {i > 0 && <span className="text-border mx-1.5">•</span>}
              {label}
            </button>
          ))}
        </div>

        {/* Progress bar - thinner, subtle */}
        <div className="h-0.5 rounded-full overflow-hidden bg-border">
          <div
            className="h-full transition-all duration-200 rounded-full bg-gold"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <main 
        className={`flex-1 px-6 py-6 pb-28 overflow-y-auto swipe-content ${swipeState.isSwiping ? 'swiping' : ''}`}
        key={currentStep}
        style={{
          transform: swipeState.isSwiping ? `translateX(${swipeState.offset}px)` : undefined,
          opacity: swipeState.isSwiping ? 1 - Math.abs(swipeState.offset) / 500 : 1,
        }}
        {...swipeHandlers}
      >
        {currentStep === 1 && (
          <WizardStep1 
            budget={inputs.budget}
            revenue={inputs.revenue}
            onUpdateBudget={(val) => updateInput("budget", val)}
            onUpdateRevenue={(val) => updateInput("revenue", val)}
          />
        )}
        {currentStep === 2 && (
          <WizardStep2 
            inputs={inputs} 
            onUpdate={updateInput} 
          />
        )}
        {currentStep === 3 && (
          <WizardStep3
            guilds={guilds}
            salesFee={inputs.salesFee}
            salesExp={inputs.salesExp}
            revenue={inputs.revenue}
            onToggleGuild={toggleGuild}
            onUpdateSalesFee={(val) => updateInput("salesFee", val)}
            onUpdateSalesExp={(val) => updateInput("salesExp", val)}
          />
        )}
        {currentStep === 4 && result && (
          <ResultsDashboard 
            result={result}
            inputs={inputs}
            equity={inputs.equity}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation - Premium styling */}
      <div
        className="fixed bottom-0 left-0 right-0 px-6 pt-4 pb-4 bg-background/95 backdrop-blur-sm z-40 safe-bottom"
        style={{
          borderTop: '1px solid hsl(var(--border))',
          boxShadow: '0 -12px 40px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="flex items-center gap-3 max-w-screen-lg mx-auto">
          {/* Left button: Previous OR empty spacer on step 1 */}
          <div className="flex-1">
            {currentStep > 1 && (
              <Button
                onClick={prevStep}
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground py-5 touch-feedback min-h-[52px] border border-border hover:border-gold/30 transition-all duration-150"
              >
                <ChevronLeft className="w-4 h-4 mr-1.5" />
                Back
              </Button>
            )}
          </div>

          {/* Right button: Next OR Start Over on final step */}
          <div className="flex-1">
            {currentStep < TOTAL_STEPS ? (
              <Button
                onClick={nextStep}
                className="w-full btn-vault py-5 touch-feedback min-h-[52px] relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {currentStep === 3 ? 'VIEW RESULTS' : 'CONTINUE'}
                  <ChevronRight className="w-4 h-4 ml-1.5" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              </Button>
            ) : (
              <Button
                onClick={handleStartOver}
                variant="ghost"
                className="w-full py-5 touch-feedback min-h-[52px] border border-border hover:border-gold/30 text-muted-foreground hover:text-foreground transition-all duration-150"
              >
                <RotateCcw className="w-4 h-4 mr-1.5" />
                New Scenario
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="h-28" />
    </div>
  );
};

export default Calculator;
