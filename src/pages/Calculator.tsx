import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { User } from "@supabase/supabase-js";
import WizardStep1 from "@/components/calculator/WizardStep1";
import WizardStep2 from "@/components/calculator/WizardStep2";
import WizardStep3 from "@/components/calculator/WizardStep3";
import WizardStep4 from "@/components/calculator/WizardStep4";
import WizardStep5 from "@/components/calculator/WizardStep5";
import WizardStep6 from "@/components/calculator/WizardStep6";
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
  const [saving, setSaving] = useState(false);
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

  const handleSaveCalculation = async () => {
    if (!user) {
      toast({
        title: "Success",
        description: "Calculation saved to local storage (demo mode).",
      });
      return;
    }
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("saved_calculations")
        .insert([{
          user_id: user.id,
          inputs: JSON.parse(JSON.stringify({ ...inputs, guilds })),
        }]);

      if (error) throw error;

      toast({
        title: "Calculation Saved",
        description: "Your waterfall model has been saved to your dashboard.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save calculation",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="skeleton-gold w-16 h-16 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Command Bar - Fixed Sticky Header: Home Left, Title Center, Menu Right */}
      <header className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-6 border-b border-zinc-900" style={{ backgroundColor: '#000000' }}>
        {/* Left: Home Icon */}
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <Home className="w-5 h-5" style={{ color: '#D4AF37' }} />
        </button>
        
        {/* Center: Title (flex-1 to take remaining space, text-center) */}
        <span className="flex-1 text-center font-bebas text-xl tracking-widest" style={{ color: '#D4AF37' }}>
          WATERFALL TERMINAL
        </span>
        
        {/* Right: Hamburger Menu */}
        <MobileMenu onSignOut={handleSignOut} />
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14" />

      {/* Status Bar - Terminal Plate Style */}
      <div 
        className="px-6 py-4 border-b border-[#333333]"
        style={{ backgroundColor: '#111111' }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-widest text-zinc-500">
            Step {currentStep} of 6
          </span>
          <span className="text-xs font-mono" style={{ color: '#D4AF37' }}>
            {Math.round((currentStep / 6) * 100)}%
          </span>
        </div>
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

      {/* Step Content */}
      <main className="flex-1 px-6 py-6 pb-24 overflow-y-auto">
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
            onSave={handleSaveCalculation}
            saving={saving}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation - Pinned to Viewport */}
      <div 
        className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-background z-40"
        style={{ borderTop: '1px solid #333333' }}
      >
        <div className="flex items-center justify-between gap-6 max-w-screen-lg mx-auto">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="ghost"
            className="text-zinc-400 hover:text-white disabled:opacity-30 flex-1 py-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </Button>
          
          {currentStep < 6 && (
            <Button
              onClick={nextStep}
              className="btn-vault flex-1 py-4"
            >
              NEXT STEP
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Spacer for fixed footer */}
      <div className="h-20" />
    </div>
  );
};

export default Calculator;