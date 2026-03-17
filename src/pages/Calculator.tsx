import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import { User } from "@supabase/supabase-js";
import { calculateWaterfall, WaterfallInputs, GuildState } from "@/lib/waterfall";

// New Tab Components
import TabBar, { TabId } from "@/components/calculator/TabBar";
import { BudgetTab, StackTab, DealTab, WaterfallTab } from "@/components/calculator/tabs";
import ProjectTab from "@/components/calculator/tabs/ProjectTab";
import { CapitalSourceSelections, defaultSelections } from "@/components/calculator/stack/CapitalSelect";
import EmailGateModal from "@/components/EmailGateModal";

import { EMAIL_CAPTURED_KEY } from "@/lib/constants";
import ContextBar from "@/components/calculator/ContextBar";

export interface ProjectDetails {
  title: string;
  logline: string;
  genre: string;
  customGenre: string;
  status: string;
  producers: string;
  director: string;
  writers: string;
  cast: string;
  company: string;
  location: string;
}

const defaultProject: ProjectDetails = {
  title: '', logline: '', genre: '', customGenre: '',
  status: 'Development', producers: '', director: '',
  writers: '', cast: '', company: '', location: '',
};

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

const STEP_TO_TAB: TabId[] = ['project', 'budget', 'stack', 'deal', 'waterfall'];

/* ═══ Inline styles — Store pattern ═══ */
const s: Record<string, React.CSSProperties> = {
  page: {
    background: "#000",
    backgroundImage: [
      "radial-gradient(ellipse 70% 40% at 20% 10%, rgba(212,175,55,0.06) 0%, transparent 60%)",
      "radial-gradient(ellipse 60% 50% at 80% 60%, rgba(212,175,55,0.03) 0%, transparent 60%)",
    ].join(", "),
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
  },
  main: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    paddingBottom: "calc(62px + 100px + env(safe-area-inset-bottom, 0px))",
  },
  col: {
    maxWidth: "430px",
    margin: "0 auto",
  },
  loading: {
    minHeight: "100vh",
    background: "#000",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "2px solid #D4AF37",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

const Calculator = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const haptics = useHaptics();
  const mainRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Default to project step (step 00)
  const [activeTab, setActiveTab] = useState<TabId>('project');
  const prevTabRef = useRef<TabId>('project');
  const [transitionDir, setTransitionDir] = useState<'right' | 'left' | 'same'>('same');

  const [inputs, setInputs] = useState<WaterfallInputs>(defaultInputs);
  const [guilds, setGuilds] = useState<GuildState>(defaultGuilds);
  const [project, setProject] = useState<ProjectDetails>(defaultProject);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(() => {
    return localStorage.getItem(EMAIL_CAPTURED_KEY) === 'true';
  });
  const [sourceSelections, setSourceSelections] = useState<CapitalSourceSelections>(defaultSelections);

  const capitalSelections = sourceSelections;

  const toggleSourceSelection = useCallback((key: keyof CapitalSourceSelections) => {
    setSourceSelections(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Gate: redirect to landing page if no authenticated session
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  // Honor URL ?tab= param if present
  useEffect(() => {
    const urlTab = searchParams.get("tab") as TabId | null;
    if (urlTab && ['project', 'budget', 'stack', 'deal', 'waterfall'].includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, [searchParams]);

  // Derive result synchronously
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

  const handleTabChange = useCallback((tab: TabId) => {
    haptics.light();
    const prevIndex = STEP_TO_TAB.indexOf(prevTabRef.current);
    const nextIndex = STEP_TO_TAB.indexOf(tab);
    if (nextIndex > prevIndex) {
      setTransitionDir('right');
    } else if (nextIndex < prevIndex) {
      setTransitionDir('left');
    } else {
      setTransitionDir('same');
    }
    prevTabRef.current = tab;
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
    if (project.title.trim().length > 0) completed.push('project');
    if (inputs.budget > 0) completed.push('budget');
    if (inputs.credits > 0 || inputs.debt > 0 || inputs.mezzanineDebt > 0 || inputs.equity > 0) {
      completed.push('stack');
    }
    if (inputs.revenue > 0) completed.push('deal');
    if (inputs.revenue > 0 && inputs.budget > 0) completed.push('waterfall');
    return completed;
  };

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

  const handleNext = useCallback(() => {
    const nextTab = getNextTab();
    if (nextTab) {
      handleTabChange(nextTab);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleTabChange, activeTab, inputs]);

  const stackSourceCount = Object.values(sourceSelections).filter(Boolean).length;
  const selectedGenre = project.genre && project.genre !== "Other" ? project.genre : project.customGenre || '';

  const renderContextBar = () => {
    if (activeTab === 'stack') {
      return <ContextBar budget={inputs.budget} />;
    }
    if (activeTab === 'deal') {
      return (
        <ContextBar
          budget={inputs.budget}
          stackCount={stackSourceCount}
          genre={selectedGenre}
        />
      );
    }
    // Don't show context bar on waterfall tab when deck is active
    if (activeTab === 'waterfall' && inputs.budget > 0 && inputs.revenue > 0) {
      return null;
    }
    if (activeTab === 'waterfall') {
      return (
        <ContextBar
          budget={inputs.budget}
          acqPrice={inputs.revenue}
        />
      );
    }
    return null;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'project':
        return (
          <ProjectTab
            project={project}
            onUpdateProject={setProject}
            onAdvance={() => handleTabChange('budget')}
          />
        );
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
          <>
            {renderContextBar()}
            <StackTab
              inputs={inputs}
              onUpdateInput={updateInput}
              onAdvance={handleNext}
              selections={sourceSelections}
              onToggleSelection={toggleSourceSelection}
            />
          </>
        );
      case 'deal':
        return (
          <>
            {renderContextBar()}
            <DealTab
              inputs={inputs}
              guilds={guilds}
              selections={capitalSelections}
              onUpdateInput={updateInput}
              onAdvance={handleNext}
              genre={selectedGenre}
            />
          </>
        );
      case 'waterfall':
        return (
          <>
            {renderContextBar()}
            <WaterfallTab
              result={result}
              inputs={inputs}
              project={project}
              guilds={guilds}
              selections={capitalSelections}
            />
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div style={s.loading}>
        <div style={s.spinner} />
      </div>
    );
  }

  // Progress = 5 steps at 20% each
  const completedTabs = getCompletedTabs();
  return (
    <div style={s.page}>
      <main ref={mainRef} style={s.main}>
        <div style={s.col}>
          <div
            key={activeTab}
            style={{
              animation: transitionDir === 'right'
                ? 'slideRight 0.35s ease-out'
                : transitionDir === 'left'
                  ? 'slideLeft 0.35s ease-out'
                  : 'stepEnter 0.35s ease-out',
            }}
          >
            {renderTabContent()}
          </div>
        </div>
      </main>

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
