import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSwipe } from "@/hooks/use-swipe";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { User } from "@supabase/supabase-js";
import WizardStep1 from "@/components/calculator/WizardStep1";
import WizardStep2 from "@/components/calculator/WizardStep2";
import WizardStep3 from "@/components/calculator/WizardStep3";
import WizardStep4 from "@/components/calculator/WizardStep4";
import WizardStep5 from "@/components/calculator/WizardStep5";
import WizardStep6 from "@/components/calculator/WizardStep6";
import StepIndicator from "@/components/calculator/StepIndicator";
import MobileMenu from "@/components/MobileMenu";
import { calculateWaterfall, WaterfallInputs, WaterfallResult, GuildState } from "@/lib/waterfall";

const STORAGE_KEY = "filmmaker_og_inputs";

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
      // Don't reset step - allow user to navigate freely
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
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
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
    setGuilds(prev => ({ ...prev, [guild]: !prev[guild] }));
  }, []);

  const nextStep = useCallback(() => setCurrentStep(prev => Math.min(prev + 1, 6)), []);
  const prevStep = useCallback(() => setCurrentStep(prev => Math.max(prev - 1, 1)), []);

  // Swipe gesture handlers
  const swipeHandlers = useSwipe({
    onSwipeLeft: nextStep,
    onSwipeRight: prevStep,
    threshold: 50,
  });

  // Loading skeleton that matches final layout to prevent jumping
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header skeleton - same dimensions as real header */}
        <header className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-6 border-b border-zinc-900 safe-top" style={{ backgroundColor: '#000000' }}>
          <div className="w-12 h-12" />
          <span className="flex-1 text-center font-bebas text-lg tracking-widest" style={{ color: '#D4AF37' }}>
            WATERFALL TERMINAL
          </span>
          <div className="w-12 h-12" />
        </header>
        <div className="header-spacer" />
        {/* Content skeleton */}
        <div className="flex-1 flex items-center justify-center">
          <div className="skeleton-gold w-16 h-16 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Command Bar - Fixed Sticky Header: Home Left, Title Center, Menu Right */}
      <header className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-6 border-b border-zinc-900 safe-top" style={{ backgroundColor: '#000000' }}>
        {/* Left: Home Icon */}
        <button
          onClick={() => navigate("/")}
          className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-opacity touch-feedback -ml-1"
        >
          <Home className="w-5 h-5" style={{ color: '#D4AF37' }} />
        </button>
        
        {/* Center: Title (flex-1 to take remaining space, text-center) */}
        <span className="flex-1 text-center font-bebas text-lg sm:text-xl tracking-widest" style={{ color: '#D4AF37' }}>
          WATERFALL TERMINAL
        </span>
        
        {/* Right: Hamburger Menu */}
        <MobileMenu onSignOut={handleSignOut} />
      </header>

      {/* Spacer for fixed header - accounts for safe area */}
      <div className="header-spacer" />

      {/* Status Bar - Terminal Plate Style with tappable step indicators */}
      <div 
        className="px-6 py-4 border-b border-[#333333]"
        style={{ backgroundColor: '#111111' }}
      >
        {/* Tappable step indicator pills */}
        <div className="flex items-center justify-between mb-3">
          <StepIndicator 
            currentStep={currentStep} 
            onStepClick={setCurrentStep} 
          />
          <span className="text-xs font-mono ml-4" style={{ color: '#D4AF37' }}>
            {Math.round((currentStep / 6) * 100)}%
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1 rounded-sm overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
          <div 
            className="h-full transition-all duration-300 rounded-sm"
            style={{ 
              width: `${(currentStep / 6) * 100}%`,
              backgroundColor: '#D4AF37'
            }}
          />
        </div>
      </div>

      {/* Step Content with fade animation */}
      <main 
        className="flex-1 px-6 py-6 pb-24 overflow-y-auto animate-page-in" 
        key={currentStep}
        {...swipeHandlers}
      >
        {currentStep === 1 && (
          <WizardStep1 
            budget={inputs.budget} 
            onUpdate={(val) => updateInput("budget", val)} 
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
        {currentStep === 4 && (
          <WizardStep4 
            revenue={inputs.revenue} 
            onUpdate={(val) => updateInput("revenue", val)} 
          />
        )}
        {currentStep === 5 && result && (
          <WizardStep5 result={result} inputs={inputs} />
        )}
        {currentStep === 6 && result && (
          <WizardStep6 
            result={result}
            equity={inputs.equity}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation - Consistent layout */}
      <div 
        className="fixed bottom-0 left-0 right-0 px-6 pt-4 pb-4 bg-background z-40 safe-bottom"
        style={{ borderTop: '1px solid #333333' }}
      >
        <div className="flex items-center gap-4 max-w-screen-lg mx-auto">
          {/* Previous button - only show after step 1, otherwise invisible spacer */}
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
          
          {/* Next button - always visible until step 6, centered when alone */}
          <div className="flex-1">
            {currentStep < 6 && (
              <Button
                onClick={nextStep}
                className="w-full btn-vault py-5 touch-feedback min-h-[52px]"
              >
                NEXT STEP
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Spacer for fixed footer */}
      <div className="h-24" />
    </div>
  );
};

export default Calculator;