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
  const [activeTab, setActiveTab] = useState<TabId>('budget');
  const [inputs, setInputs] = useState<WaterfallInputs>(defaultInputs);
  const [guilds, setGuilds] = useState<GuildState>(defaultGuilds);
  // REMOVED: state-based result
  // const [result, setResult] = useState<WaterfallResult | null>(null);
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

  // Load saved state
  useEffect(() => {
    if (searchParams.get("reset") === "true" || searchParams.get("skip") === "true") return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.inputs) {
          setInputs(parsed.inputs);
        }
        if (parsed.guilds) setGuilds(parsed.guilds);
        if (parsed.sourceSelections) setSourceSelections(parsed.sourceSelections);
        // Only restore saved tab if no explicit ?tab= param was provided
        const tabParam = searchParams.get("tab") as TabId | null;
        if (tabParam && STEP_TO_TAB.includes(tabParam)) {
          setActiveTab(tabParam);
        } else if (parsed.activeTab) {
          setActiveTab(parsed.activeTab);
        }
      } catch (e) {
        console.error("Failed to load saved inputs");
      }
    } else {
      // No saved state — still respect ?tab= param
      const tabParam = searchParams.get("tab") as TabId | null;
      if (tabParam && STEP_TO_TAB.includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
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
  // This ensures 'result' is never null during a render if inputs exist.
  // It prevents the "flash of null" or "nothing loads" issue when switching tabs.
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
    // Email gate: show when trying to view waterfall (tab 4) if not authenticated
    // Trigger only if we are advancing to 'waterfall' for the first time
    if (tab === 'waterfall' && !user && !emailCaptured) {
      setShowEmailGate(true);
      return;
    }

    haptics.light();
    setActiveTab(tab);
  }, [user, emailCaptured, haptics]);

  // Email gate handlers
  const handleEmailSuccess = () => {
    setEmailCaptured(true);
    setShowEmailGate(false);
    handleTabChange('waterfall'); // Continue to waterfall after success
  };

  const handleEmailSkip = () => {
    setEmailCaptured(true);
    setShowEmailGate(false);
    handleTabChange('waterfall'); // Continue even on skip (demo mode)
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

  // Stack Tab Internal State Handling (Step within Step)
  // We need to know if we are "deep" inside the Stack Wizard to know if Back should go to previous stack step or previous TAB
  // This is a limitation of the current architecture where StackTab manages its own internal state
  // ideally, this state should be lifted up, but for now we will rely on the TAB navigation.
  
  // FIX: handleBack Logic
  const handleBack = () => {
    const currentIndex = STEP_TO_TAB.indexOf(activeTab);
    
    // 1. If we are on the first tab (Budget), go to Home (Intro)
    if (currentIndex === 0) {
      navigate("/"); // Go to root (Intro), NOT /?skipIntro=true which skips the intro
      return;
    } 

    // 2. Otherwise, simply go to the previous TAB
    const prevTab = STEP_TO_TAB[currentIndex - 1];
    haptics.light();
    setActiveTab(prevTab);
  };

  // Handle Next button
  const handleNext = useCallback(() => {
    const nextTab = getNextTab();
    if (nextTab) {
      handleTabChange(nextTab);
    }
  }, [handleTabChange, activeTab, inputs]);

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
        // FIX: Always render WaterfallTab if result is available (which it always is now via useMemo)
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
          backgroundColor: 'var(--bg-card)',
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
              stroke="var(--border-subtle)"
              strokeWidth="2"
            />
            {/* Progress arc */}
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
              style={{
                filter: 'drop-shadow(0 0 4px rgba(212, 175, 55, 0.5))',
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

      {/* Email Gate Modal - Removed IntroOverlay */}
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
