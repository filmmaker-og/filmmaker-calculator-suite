import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { calculateWaterfall, WaterfallInputs, GuildState } from "@/lib/waterfall";
import { cn } from "@/lib/utils";

// New Tab Components
import TabBar, { TabId } from "@/components/calculator/TabBar";
import { BudgetTab, StackTab, DealTab, WaterfallTab } from "@/components/calculator/tabs";
import { CapitalSourceSelections, defaultSelections } from "@/components/calculator/stack/CapitalSelect";
import EmailGateModal from "@/components/EmailGateModal";
import Header from "@/components/Header";

import { EMAIL_CAPTURED_KEY } from "@/lib/constants";


const defaultInputs: WaterfallInputs = {
  revenue: 0,
  budget: 0,
  credits: 0,
  debt: 0,
  seniorDebtRate: 10,
  mezzanineDebt: 0,
  mezzanineRate: 18,
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
  const [emailCaptured, setEmailCaptured] = useState(() => {
    return localStorage.getItem(EMAIL_CAPTURED_KEY) === 'true';
  });
  const [sourceSelections, setSourceSelections] = useState<CapitalSourceSelections>(defaultSelections);

  // sourceSelections is now the same type as CapitalSelections (unified)
  const capitalSelections = sourceSelections;

  const toggleSourceSelection = useCallback((key: keyof CapitalSourceSelections) => {
    setSourceSelections(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Gate: redirect to landing page if no authenticated session (hard gate — magic link required)
  useEffect(() => {
    if (loading) return; // wait for auth check to resolve
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  // Honor URL ?tab= param if present (e.g., from info pages or post-purchase)
  useEffect(() => {
    const urlTab = searchParams.get("tab") as TabId | null;
    if (urlTab && ['budget', 'stack', 'deal', 'waterfall'].includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, [searchParams]);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle tab change — no gate, let them see their results freely
  const handleTabChange = useCallback((tab: TabId) => {
    haptics.light();
    setActiveTab(tab);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEmailSuccess = () => {
    setEmailCaptured(true);
    localStorage.setItem(EMAIL_CAPTURED_KEY, 'true');
    setShowEmailGate(false);
  };

  const handleEmailSkip = () => {
    setEmailCaptured(true);
    localStorage.setItem(EMAIL_CAPTURED_KEY, 'true');
    setShowEmailGate(false);
  };

  // Triggered by WaterfallTab's Export CTA
  const handleExportClick = () => {
    if (!user && !emailCaptured) {
      setShowEmailGate(true);
    } else {
      navigate('/store');
    }
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

  // No tabs are ever disabled — Waterfall shows "Protocol Locked" + Demo button when empty
  const getDisabledTabs = (): TabId[] => {
    return [];
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
            onExport={handleExportClick}
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

  // Progress = number of completed tabs * 25%
  const completedTabs = getCompletedTabs();
  const progressPercent = completedTabs.length * 25;

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
            "border border-border-subtle text-text-mid",
            "hover:border-text-dim hover:text-text-primary",
            "active:scale-95"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Back</span>
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
          <span className="relative z-10 font-mono text-[11px] font-medium text-gold">
            {progressPercent}%
          </span>
        </div>

        {getNextTab() && isCurrentSectionComplete() && (
          <button
            onClick={handleNext}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-all",
              "bg-gold-cta-subtle border border-gold-cta-muted text-gold-cta",
              "hover:border-gold-cta",
              "active:scale-95 shadow-button"
            )}
          >
            <span className="text-xs font-semibold uppercase tracking-wider">Next</span>
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
