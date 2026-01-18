import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Save, Loader2 } from "lucide-react";
import { User } from "@supabase/supabase-js";
import WizardStep1 from "@/components/calculator/WizardStep1";
import WizardStep2 from "@/components/calculator/WizardStep2";
import WizardStep3 from "@/components/calculator/WizardStep3";
import WizardStep4 from "@/components/calculator/WizardStep4";
import WizardStep5 from "@/components/calculator/WizardStep5";
import WizardStep6 from "@/components/calculator/WizardStep6";
import { calculateWaterfall, WaterfallInputs, WaterfallResult, GuildState } from "@/lib/waterfall";

const STORAGE_KEY = "filmmaker_og_inputs";

const defaultInputs: WaterfallInputs = {
  revenue: 3500000,
  budget: 2000000,
  credits: 400000,
  debt: 600000,
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
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [inputs, setInputs] = useState<WaterfallInputs>(defaultInputs);
  const [guilds, setGuilds] = useState<GuildState>(defaultGuilds);
  const [result, setResult] = useState<WaterfallResult | null>(null);

  // Load saved inputs from localStorage
  useEffect(() => {
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
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ inputs, guilds, currentStep }));
  }, [inputs, guilds, currentStep]);

  // Calculate result whenever inputs change
  useEffect(() => {
    const calculated = calculateWaterfall(inputs, guilds);
    setResult(calculated);
  }, [inputs, guilds]);

  // Auth check
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) {
        navigate("/auth");
      }
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
    if (!user) return;
    
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
        description: "Your waterfall model has been saved to your vault.",
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-gold flex items-center justify-center">
              <span className="font-display text-gold text-sm">F</span>
            </div>
            <span className="font-display text-mid tracking-[0.2em] text-xs hidden sm:block">
              WATERFALL TERMINAL
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-dim text-xs hidden sm:block">{user?.email}</span>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-dim hover:text-gold"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-dim text-xs uppercase tracking-widest">
              Step {currentStep} of 6
            </span>
            <span className="text-gold text-xs font-mono">
              {Math.round((currentStep / 6) * 100)}%
            </span>
          </div>
          <div className="progress-gold h-1">
            <div 
              className="progress-gold-fill h-full"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
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
          <WizardStep5 result={result} />
        )}
        {currentStep === 6 && result && (
          <WizardStep6 
            result={result}
            equity={inputs.equity}
            onSave={handleSaveCalculation}
            saving={saving}
          />
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="ghost"
            className="text-dim hover:text-foreground disabled:opacity-30"
          >
            ← Previous
          </Button>
          
          {currentStep < 6 ? (
            <Button
              onClick={nextStep}
              className="btn-vault px-8 py-4 rounded-none"
            >
              Continue →
            </Button>
          ) : (
            <Button
              onClick={handleSaveCalculation}
              disabled={saving}
              className="btn-vault px-8 py-4 rounded-none"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              SAVE TO VAULT
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Calculator;
