import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
import { CapitalSelections } from "@/lib/waterfall";
import { CapitalSourceSelections, defaultSelections } from "@/components/calculator/stack/CapitalSelect";
import EmailGateModal from "@/components/EmailGateModal";
import Header from "@/components/Header"; // Import shared Header

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
  deferments: 0,
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
  
  // ALWAYS DEFAULT TO BUDGET (STEP 1)
  const [activeTab, setActiveTab] = useState<TabId>('budget');
  
  const [inputs, setInputs] = useState<WaterfallInputs>(defaultInputs);
  const [guilds, setGuilds] = useState<GuildState>(defaultGuilds);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [sourceSelections, setSourceSelections] = useState<CapitalSourceSelections>(defaultSelections);

  // Derive capital selections for breakeven calc (from explicit toggle state)
  const capitalSelections: CapitalSelections = {
    taxCredits: sourceSelections.taxCredits,
    seniorDebt: sourceSelections.seniorDebt,
    gapLoan: sourceSelections.gapLoan,
    equity: sourceSelections.equity,
  };

  const toggleSourceSelection = useCallback((key: keyof CapitalSourceSelections) => {
    setSourceSelections(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Reset on ?reset=true or ?skip=true (demo mode)
  useEffect(() => {
    if (searchParams.get("reset") === "true" || searchParams.get("skip") === "true") {
      localStorage.removeItem(STORAGE_KEY);
      setInputs(defaultInputs);
      setGuilds(defaultGuilds);
      setActiveTab('budget');
    }
  }, [searchParams]);

  // Load saved state + IGNORE URL TAB PARAM
  useEffect(() => {
    if (searchParams.get("reset") === "true" || searchParams.get("skip") === "true") return;

    const saved = localStorage.getItem(STORAGE_KEY);
    
    // NOTE: We intentionally IGNORE the "tab" URL parameter here.
    // The requirement is "it should go to step 1 no matter what without logic checking".
    // So deep links to ?tab=waterfall will simply load the app at Step 1 (Budget).
    
    let loadedInputs = defaultInputs;
    let targetTab: TabId = 'budget'; // Default to Budget

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.inputs) loadedInputs = parsed.inputs;
        if (parsed.guilds) setGuilds(parsed.guilds);
        if (parsed.sourceSelections) setSourceSelections(parsed.sourceSelections);
        
        // We only restore the saved tab if it exists. We DO NOT look at the URL.
        if (parsed.activeTab) {
           // Optional: We could even force this to budget if "no matter what" implies ignoring resume?
           // For now, ignoring URL is the key fix for the Wiki link issue.
           targetTab = parsed.activeTab;
        }
      } catch (e) {
        console.error("Failed to load saved inputs");
      }
    }
    
    // Explicitly enforce that if we loaded 'waterfall' from storage but have no data, go to budget.
    // This isn't "logic checking" the URL, it's just basic state sanity.
    if (targetTab === 'waterfall' && (loadedInputs.budget === 0 || loadedInputs.revenue === 0)) {
        targetTab = 'budget';
    }

    setInputs(loadedInputs);
    setActiveTab(targetTab);

  }, [searchParams]);

  // Save state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      inputs,
      guilds,
      activeTab,
      sourceSelections,
    }));
  }, [inputs, guilds, activeTab, sourceSelections]);

  // DERIVE RESULT SYNCHRONOUSLY
  const result = useMemo(() => {
    return calculateWaterfall(inputs, guilds);
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
    if (tab === 'waterfall' && !user && !emailCaptured) {
      setShowEmailGate(true);
      return;
    }
    haptics.light();
    setActiveTab(tab);
  }, [user, emailCaptured, haptics]);

  const handleEmailSuccess = () => {
    setEmailCaptured(true);
    setShowEmailGate(false);
    handleTabChange('waterfall'); 
  };

  const handleEmailSkip = () => {
    setEmailCaptured(true);
    setShowEmailGate(false);
    handleTabChange('waterfall');
  };

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
    if (inputs.budget === 0 || inputs.revenue === 0) {
      disabled.push('waterfall');
    }
    return disabled;
  };

  const getNextTab = (): TabId | null => {
    const currentIndex = STEP_TO_TAB.indexOf(activeTab);
    for (let i = currentIndex + 1; i < STEP_TO_TAB.length; i++) {
      const nextTab = STEP_TO_TAB[i];
      if (!getDisabledTabs().includes(nextTab)) {
        return nextTab;
      }
    }
    return null;
  };

  const handleBack = () => {
    const currentIndex = STEP_TO_TAB.indexOf(activeTab);
    if (currentIndex === 0) {
      navigate("/");
      return;
    } 
    const prevTab = STEP_TO_TAB[currentIndex - 1];
    haptics.light();
    setActiveTab(prevTab);
  };

  const handleNext = useCallback(() => {
    const nextTab = getNextTab();
    if (nextTab) {
      handleTabChange(nextTab);
    }
  }, [handleTabChange, activeTab, inputs]);

  const isCurrentSectionComplete = (): boolean => {
    const completed = getCompletedTabs();
    return completed.includes(activeTab);
  };

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
            onAdvance={handleNext}
            selections={sourceSelections}
            onToggleSelection={toggleSourceSelection}
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
        return (
          <WaterfallTab
            result={result}
            inputs={inputs}
          />
        );
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

  const progressPercent = TAB_TO_STEP[activeTab] * 25;

  return (
    <div className="min-h-screen bg-bg-void flex flex-col">
      <Header />
      <main
        ref={mainRef}
        className="flex-1 px-4 py-6 overflow-y-auto"
        style={{
          paddingBottom: 'calc(var(--tabbar-h) + 100px + env(safe-area-inset-bottom))',
        }}
      >
        <div className={cn("max-w-[460px] mx-auto", "animate-fade-in")}>
          {renderTabContent()}
        </div>
      </main>

      <div
        className="fixed left-0 right-0 z-40 flex items-center justify-between px-4 py-2"
        style={{
          bottom: 'calc(var(--tabbar-h) + env(safe-area-inset-bottom))',
          backgroundColor: 'var(--bg-card)',
        }}
      >
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

        <div className="relative w-11 h-11 flex items-center justify-center">
          <svg className="absolute w-11 h-11 -rotate-90">
            <circle cx="22" cy="22" r="18" fill="none" stroke="var(--border-subtle)" strokeWidth="2" />
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${progressPercent * 1.13} 113`}
              className="transition-all duration-500 ease-out"
              style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 55, 0.5))' }}
            />
          </svg>
          <span className="relative z-10 font-mono text-[11px] font-bold text-gold">
            {progressPercent}%
          </span>
        </div>

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

      <TabBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        completedTabs={getCompletedTabs()}
        disabledTabs={getDisabledTabs()}
      />

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
