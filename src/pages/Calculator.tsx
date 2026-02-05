import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { calculateWaterfall, WaterfallInputs, WaterfallResult, GuildState } from "@/lib/waterfall";
import { cn } from "@/lib/utils";

// New Tab Components
import TabBar, { TabId } from "@/components/calculator/TabBar";
import { BudgetTab, StackTab, DealTab, WaterfallTab } from "@/components/calculator/tabs";
import { CapitalSelections } from "@/components/calculator/steps/CapitalSelectStep";
import EmailGateModal from "@/components/EmailGateModal";
import Header from "@/components/Header"; // Import shared Header
import IntroOverlay from "@/components/calculator/IntroOverlay"; // Import IntroOverlay

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

// Tab configuration
const TAB_CONFIG: { id: TabId; label: string; chapter: string }[] = [
  { id: 'budget', label: 'BUDGET', chapter: '01' },
  { id: 'stack', label: 'STACK', chapter: '02' },
  { id: 'deal', label: 'DEAL', chapter: '03' },
  { id: 'waterfall', label: 'WATERFALL', chapter: '04' },
];

// Tab to step number mapping
const TAB_TO_STEP: Record<TabId, number> = {
  budget: 1,
  stack: 2,
  deal: 3,
  waterfall: 4,
};

const STEP_TO_TAB: TabId[] = ['budget', 'stack', 'deal', 'waterfall'];

const Calculator = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const haptics = useHaptics();
  const mainRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('budget');
  const [inputs, setInputs] = useState<WaterfallInputs>(defaultInputs);
  const [guilds, setGuilds] = useState<GuildState>(defaultGuilds);
  const [result, setResult] = useState<WaterfallResult | null>(null);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [showIntro, setShowIntro] = useState(true); // Default to showing intro
  const [capitalSelections] = useState<CapitalSelections>({
    taxCredits: false,
    seniorDebt: false,
    gapLoan: false,
    equity: false,
  });

  // Reset on ?reset=true or ?skip=true (demo mode)
  useEffect(() => {
    if (searchParams.get("reset") === "true" || searchParams.get("skip") === "true") {
      localStorage.removeItem(STORAGE_KEY);
      setInputs(defaultInputs);
      setGuilds(defaultGuilds);
      setActiveTab('budget');
    }
  }, [searchParams]);

  // Load saved state
  useEffect(() => {
    if (searchParams.get("reset") === "true" || searchParams.get("skip") === "true") return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.inputs) {
          // Validate and clean inputs - remove suspicious test values
          const cleanInputs = { ...parsed.inputs };
          // Clear values that look like test data (999, 9999, etc)
          if (cleanInputs.budget && cleanInputs.budget < 10000) {
            cleanInputs.budget = 0;
          }
          if (cleanInputs.revenue && cleanInputs.revenue < 10000) {
            cleanInputs.revenue = 0;
          }
          setInputs(cleanInputs);
        }
        if (parsed.guilds) setGuilds(parsed.guilds);
        if (parsed.activeTab) setActiveTab(parsed.activeTab);
        
        // If we have saved data, maybe skip intro? 
        // Let's keep it for now unless explicitly dismissed previously (not implemented yet)
        // or if inputs are populated.
        if (parsed.inputs && parsed.inputs.budget > 0) {
             setShowIntro(false);
        }

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
      activeTab
    }));
  }, [inputs, guilds, activeTab]);

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

  // Scroll to top when switching tabs
  useEffect(() => {
    window.scrollTo(0, 0);
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const updateInput = useCallback((key: keyof WaterfallInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleGuild = useCallback((guild: keyof GuildState) => {
    haptics.light();
    setGuilds(prev => ({ ...prev, [guild]: !prev[guild] }));
  }, [haptics]);

  // Handle tab change with validation
  const handleTabChange = useCallback((tab: TabId) => {
    // Email gate: show after budget tab if not authenticated and not already captured
    if (activeTab === 'budget' && tab !== 'budget' && !user && !emailCaptured) {
      setShowEmailGate(true);
      return;
    }

    haptics.light();
    setActiveTab(tab);
  }, [activeTab, user, emailCaptured, haptics]);

  // Email gate handlers
  const handleEmailSuccess = () => {
    setEmailCaptured(true);
    setShowEmailGate(false);
  };

  const handleEmailSkip = () => {
    setEmailCaptured(true);
    setShowEmailGate(false);
  };

  // Get current tab config
  const currentTabConfig = TAB_CONFIG.find(t => t.id === activeTab);

  // Determine which tabs are completed
  const getCompletedTabs = (): TabId[] => {
    const completed: TabId[] = [];
    if (inputs.budget > 0) completed.push('budget');
    if (inputs.credits > 0 || inputs.debt > 0 || inputs.mezzanineDebt > 0 || inputs.equity > 0) {
      completed.push('stack');
    }
    if (inputs.revenue > 0) completed.push('deal');
    if (inputs.revenue > 0 && inputs.budget > 0) completed.push('waterfall');
    return completed;
  };

  // Determine which tabs are disabled
  const getDisabledTabs = (): TabId[] => {
    const disabled: TabId[] = [];
    // Waterfall requires both budget and revenue
    if (inputs.budget === 0 || inputs.revenue === 0) {
      disabled.push('waterfall');
    }
    return disabled;
  };

  // Get next available tab
  const getNextTab = (): TabId | null => {
    const currentIndex = STEP_TO_TAB.indexOf(activeTab);
    // Find next tab that's not disabled
    for (let i = currentIndex + 1; i < STEP_TO_TAB.length; i++) {
      const nextTab = STEP_TO_TAB[i];
      if (!getDisabledTabs().includes(nextTab)) {
        return nextTab;
      }
    }
    return null;
  };

  // Get previous tab or home
  const handleBack = () => {
    const currentIndex = STEP_TO_TAB.indexOf(activeTab);
    if (currentIndex === 0) {
      // If on first tab, go back to home, skipping intro
      navigate("/?skipIntro=true");
    } else {
      // Go to previous tab
      const prevTab = STEP_TO_TAB[currentIndex - 1];
      haptics.light();
      setActiveTab(prevTab);
    }
  };

  // Handle Next button
  const handleNext = () => {
    const nextTab = getNextTab();
    if (nextTab) {
      handleTabChange(nextTab);
    }
  };

  // Check if current section is completed
  const isCurrentSectionComplete = (): boolean => {
    const completed = getCompletedTabs();
    return completed.includes(activeTab);
  };

  // Render current tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'budget':
        return (
          <BudgetTab
            inputs={inputs}
            guilds={guilds}
            onUpdateInput={updateInput}
            onToggleGuild={toggleGuild}
            onAdvance={handleNext}
          />
        );
      case 'stack':
        return (
          <StackTab
            inputs={inputs}
            onUpdateInput={updateInput}
          />
        );
      case 'deal':
        return (
          <DealTab
            inputs={inputs}
            guilds={guilds}
            selections={capitalSelections}
            onUpdateInput={updateInput}
            onAdvance={handleNext}
          />
        );
      case 'waterfall':
        return result ? (
          <WaterfallTab
            result={result}
            inputs={inputs}
          />
        ) : null;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-void flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Calculate progress percentage
  const progressPercent = TAB_TO_STEP[activeTab] * 25;

  return (
    <div className="min-h-screen bg-bg-void flex flex-col">
      {/* Shared Header - Fixes logo color and consistency */}
      <Header />

      {/* Main Content */}
      <main
        ref={mainRef}
        className="flex-1 px-4 py-6 overflow-y-auto"
        style={{
          paddingBottom: 'calc(var(--tabbar-h) + 100px + env(safe-area-inset-bottom))',
        }}
      >
        <div
          className={cn(
            "max-w-[460px] mx-auto",
            "animate-fade-in"
          )}
        >
          {renderTabContent()}
        </div>
      </main>

      {/* Floating bar above tab bar - Back + Progress + Next */}
      <div
        className="fixed left-0 right-0 z-40 flex items-center justify-between px-4 py-2"
        style={{
          bottom: 'calc(var(--tabbar-h) + env(safe-area-inset-bottom))',
          backgroundColor: '#0A0A0A',
        }}
      >
        {/* Back button - same style as Next */}
        <button
          onClick={handleBack}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md transition-all",
            "border border-gold-muted bg-gold-subtle text-white",
            "hover:bg-gold hover:text-black",
            "active:scale-95"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Back</span>
        </button>

        {/* Circular progress indicator */}
        <div className="relative w-11 h-11 flex items-center justify-center">
          {/* Background circle */}
          <svg className="absolute w-11 h-11 -rotate-90">
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="#333"
              strokeWidth="2"
            />
            {/* Progress arc */}
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="#FFD700"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${progressPercent * 1.13} 113`}
              className="transition-all duration-500 ease-out"
              style={{
                filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))',
              }}
            />
          </svg>
          {/* Percentage text */}
          <span className="relative z-10 font-mono text-[11px] font-bold text-gold">
            {progressPercent}%
          </span>
        </div>

        {/* Next button - pulsing when available */}
        {getNextTab() && isCurrentSectionComplete() && (
          <button
            onClick={handleNext}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-all",
              "border border-gold-muted bg-gold-subtle text-white",
              "hover:bg-gold hover:text-black",
              "active:scale-95 animate-pulse-subtle"
            )}
          >
            <span className="text-xs font-bold uppercase tracking-wider">Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tab Bar - Fixed Bottom */}
      <TabBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        completedTabs={getCompletedTabs()}
        disabledTabs={getDisabledTabs()}
      />

      {/* Intro Overlay */}
      <IntroOverlay 
        isOpen={showIntro} 
        onClose={() => setShowIntro(false)} 
      />

      {/* Email Gate Modal */}
      <EmailGateModal
        isOpen={showEmailGate}
        onClose={() => setShowEmailGate(false)}
        onSuccess={handleEmailSuccess}
        onSkip={handleEmailSkip}
      />
    </div>
  );
};

export default Calculator;
