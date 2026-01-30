import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSwipe } from "@/hooks/use-swipe";
import { useHaptics } from "@/hooks/use-haptics";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { User } from "@supabase/supabase-js";
import WizardStep1 from "@/components/calculator/WizardStep1";
import WizardStep2 from "@/components/calculator/WizardStep2";
import WizardStep3 from "@/components/calculator/WizardStep3";
import ResultsDashboard from "@/components/calculator/ResultsDashboard";
import StepIndicator from "@/components/calculator/StepIndicator";
import MobileMenu from "@/components/MobileMenu";
import { calculateWaterfall, WaterfallInputs, WaterfallResult, GuildState } from "@/lib/waterfall";

const STORAGE_KEY = "filmmaker_og_inputs";
const TOTAL_STEPS = 4;

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

  // Check for reset parameter (demo mode entry) - only run once on mount
  useEffect(() => {
    if (searchParams.get("reset") === "true") {
      localStorage.removeItem(STORAGE_KEY);
      setInputs(defaultInputs);
      setGuilds(defaultGuilds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load saved inputs from localStorage (only if not resetting)
  useEffect(() => {
    if (searchParams.get("reset") === "true") return;
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.inputs) setInputs(parsed.inputs);
        if (parsed.guilds) setGuilds(parsed.guilds);
        // Map old 6-step to new 4-step (steps 5,6 become step 4)
        if (parsed.currentStep) {
          const mappedStep = parsed.currentStep >= 5 ? 4 : Math.min(parsed.currentStep, 4);
          setCurrentStep(mappedStep);
        }
      } catch (e) {
        console.error("Failed to load saved inputs");
      }
    }
  }, [searchParams]);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ inputs, guilds, currentStep }));
  }, [inputs, guilds, currentStep]);

  // Calculate result whenever inputs change
  useEffect(() => {
    const calculated = calculateWaterfall(inputs, guilds);
    setResult(calculated);
  }, [inputs, guilds]);

  // Auth check - allow demo mode
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

  // Swipe gesture handlers with visual feedback
  const { handlers: swipeHandlers, state: swipeState } = useSwipe({
    onSwipeLeft: () => currentStep < TOTAL_STEPS && nextStep(),
    onSwipeRight: () => currentStep > 1 && prevStep(),
    threshold: 50,
    rubberBand: true,
    maxOffset: 120,
  });

  // Loading skeleton that matches final layout to prevent jumping
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-6 safe-top" style={{ backgroundColor: '#000000', borderBottom: '1px solid #D4AF37' }}>
          <div className="w-12 h-12" />
          <span className="flex-1 text-center font-bebas text-lg tracking-widest" style={{ color: '#D4AF37' }}>
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
      {/* Command Bar - Fixed Sticky Header */}
      <header className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-6 safe-top" style={{ backgroundColor: '#000000', borderBottom: '1px solid #D4AF37' }}>
        <button
          onClick={() => navigate("/")}
          className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-opacity touch-feedback -ml-1"
        >
          <Home className="w-5 h-5" style={{ color: '#D4AF37' }} />
        </button>
        
        <span className="flex-1 text-center font-bebas text-lg sm:text-xl tracking-widest" style={{ color: '#D4AF37' }}>
          WATERFALL TERMINAL
        </span>
        
        <MobileMenu onSignOut={handleSignOut} />
      </header>

      <div className="header-spacer" />

      {/* Status Bar - Simplified with step labels */}
      <div className="px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-[10px] tracking-wider">
            {['DEAL', 'CAPITAL', 'DEDUCTIONS', 'RESULTS'].map((label, i) => (
              <span 
                key={label} 
                className={`${i + 1 === currentStep ? 'text-gold font-semibold' : 'text-muted-foreground'} ${i > 0 ? 'before:content-["•"] before:mx-1.5 before:text-border' : ''}`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StepIndicator 
            currentStep={currentStep} 
            totalSteps={TOTAL_STEPS}
            onStepClick={setCurrentStep}
            swipeOffset={swipeState.offset}
          />
          <div className="flex-1 h-1 rounded-full overflow-hidden bg-border">
            <div 
              className="h-full transition-all duration-300 rounded-full bg-gold"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <main 
        className={`flex-1 px-6 py-6 pb-24 overflow-y-auto swipe-content ${swipeState.isSwiping ? 'swiping' : ''}`}
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

      {/* Fixed Bottom Navigation - Enhanced with shadow */}
      <div 
        className="fixed bottom-0 left-0 right-0 px-6 pt-4 pb-4 bg-background z-40 safe-bottom"
        style={{ 
          borderTop: '1px solid hsl(var(--border))',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="flex items-center gap-4 max-w-screen-lg mx-auto">
          <div className="flex-1">
            {currentStep > 1 && (
              <Button
                onClick={prevStep}
                variant="ghost"
                className="w-full text-zinc-400 hover:text-white py-5 touch-feedback min-h-[52px]"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex-1">
            {currentStep < TOTAL_STEPS && (
              <Button
                onClick={nextStep}
                className="w-full btn-vault py-5 touch-feedback min-h-[52px]"
              >
                {currentStep === 3 ? 'VIEW RESULTS' : 'NEXT STEP'}
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="h-24" />
    </div>
  );
};

export default Calculator;
