import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowLeft, RotateCcw, ChevronRight, Edit3 } from "lucide-react";
import { User } from "@supabase/supabase-js";
import InputSheet from "@/components/calculator/InputSheet";
import ResultsDashboard from "@/components/calculator/ResultsDashboard";
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
  const haptics = useHaptics();
  const mainRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [inputs, setInputs] = useState<WaterfallInputs>(defaultInputs);
  const [guilds, setGuilds] = useState<GuildState>(defaultGuilds);
  const [result, setResult] = useState<WaterfallResult | null>(null);

  // Reset on ?reset=true
  useEffect(() => {
    if (searchParams.get("reset") === "true") {
      localStorage.removeItem(STORAGE_KEY);
      setInputs(defaultInputs);
      setGuilds(defaultGuilds);
      setShowResults(false);
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
        if (parsed.showResults) setShowResults(parsed.showResults);
      } catch (e) {
        console.error("Failed to load saved inputs");
      }
    }
  }, [searchParams]);

  // Save state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ inputs, guilds, showResults }));
  }, [inputs, guilds, showResults]);

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

  // Scroll to top when switching views
  useEffect(() => {
    window.scrollTo(0, 0);
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [showResults]);

  const handleStartOver = () => {
    haptics.medium();
    localStorage.removeItem(STORAGE_KEY);
    setInputs(defaultInputs);
    setGuilds(defaultGuilds);
    setShowResults(false);
  };

  const updateInput = useCallback((key: keyof WaterfallInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleGuild = useCallback((guild: keyof GuildState) => {
    haptics.light();
    setGuilds(prev => ({ ...prev, [guild]: !prev[guild] }));
  }, [haptics]);

  const handleCalculate = () => {
    haptics.medium();
    setShowResults(true);
  };

  const handleEditInputs = () => {
    haptics.light();
    setShowResults(false);
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
          onClick={() => showResults ? handleEditInputs() : navigate("/")}
          className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex-1 text-center">
          <span className="font-bebas text-base tracking-widest text-gold">
            {showResults ? 'RESULTS' : 'WATERFALL TERMINAL'}
          </span>
        </div>

        <div className="w-10 h-10 flex items-center justify-center">
          {showResults && (
            <button
              onClick={handleEditInputs}
              className="w-10 h-10 flex items-center justify-center hover:opacity-80"
            >
              <Edit3 className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14" />

      {/* Main Content */}
      <main
        ref={mainRef}
        className="flex-1 px-5 py-6 pb-32 overflow-y-auto"
      >
        {showResults && result ? (
          <ResultsDashboard
            result={result}
            inputs={inputs}
            equity={inputs.equity}
          />
        ) : (
          <InputSheet
            inputs={inputs}
            guilds={guilds}
            onUpdateInput={updateInput}
            onToggleGuild={toggleGuild}
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
        {showResults ? (
          <div className="flex gap-3">
            <Button
              onClick={handleEditInputs}
              variant="outline"
              className="flex-1 h-14 text-sm font-semibold tracking-wider rounded-none border-border hover:border-gold/50 hover:bg-transparent"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              EDIT INPUTS
            </Button>
            <Button
              onClick={handleStartOver}
              variant="outline"
              className="h-14 px-6 text-sm font-semibold tracking-wider rounded-none border-border hover:border-gold/50 hover:bg-transparent"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleCalculate}
            className="w-full h-14 text-base font-black tracking-[0.15em] rounded-none bg-gold text-black hover:bg-gold-highlight transition-all"
            style={{ boxShadow: '0 0 30px rgba(212, 175, 55, 0.3)' }}
          >
            <span className="flex items-center justify-center gap-3">
              CALCULATE WATERFALL
              <ChevronRight className="w-5 h-5" />
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Calculator;
