import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useHaptics } from "@/hooks/use-haptics";
import { calculateWaterfall, WaterfallInputs, GuildState } from "@/lib/waterfall";

// New Tab Components
import TabBar, { TabId } from "@/components/calculator/TabBar";
import { BudgetTab, StackTab, DealTab, WaterfallTab } from "@/components/calculator/tabs";
import ProjectTab from "@/components/calculator/tabs/ProjectTab";
import { CapitalSourceSelections, defaultSelections } from "@/components/calculator/stack/CapitalSelect";
import EmailGateModal from "@/components/EmailGateModal";
import LeadCaptureModal from "@/components/LeadCaptureModal";

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
  profitSplit: 50,
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
    background: "#0C0C0E",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
  },
  main: {
    flex: 1,
    padding: "24px",
    overflowY: "auto",
    paddingBottom: "calc(62px + 100px + env(safe-area-inset-bottom, 0px))",
  },
  col: {
    maxWidth: "780px",
    margin: "0 auto",
  },
  loading: {
    minHeight: "100vh",
    background: "#0C0C0E",
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

/* ═══ Progress micro-bar — 5 segments ═══ */
const ProgressBar = ({ activeTab }: { activeTab: TabId }) => {
  const steps: TabId[] = ['project', 'budget', 'stack', 'deal', 'waterfall'];
  const activeIdx = steps.indexOf(activeTab);
  return (
    <div style={{ display: "flex", gap: 3, marginBottom: 20, height: 3 }}>
      {steps.map((step, i) => (
        <div
          key={step}
          style={{
            flex: 1,
            borderRadius: 2,
            background: i < activeIdx
              ? "rgba(212,175,55,0.50)"
              : i === activeIdx
                ? "rgba(212,175,55,0.60)"
                : "rgba(255,255,255,0.08)",
            transition: "background 0.4s",
            ...(i === activeIdx ? { animation: "segPulse 2s ease-in-out infinite" } : {}),
          }}
        />
      ))}
    </div>
  );
};

/* ═══ Glass hero — per-step welcome surface ═══ */
const CalcHero = ({ stepLabel, title, titleGold, subtitle, visible }: {
  stepLabel: string;
  title: string;
  titleGold: string;
  subtitle: string;
  visible: boolean;
}) => {
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const heroReveal: React.CSSProperties = {
    opacity: prefersReducedMotion || visible ? 1 : 0,
    transform: prefersReducedMotion || visible ? "translateY(0)" : "translateY(20px)",
    transition: prefersReducedMotion ? "none" : "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
  };
  return (
    <div style={{ position: "relative", marginBottom: 20, ...heroReveal }}>
      {/* Outer wrapper — #222226 slate stage (matches landing page section wrappers) */}
      <section style={{
        position: "relative",
        borderRadius: 8, overflow: "hidden",
        background: "#222226",
        border: "1px solid rgba(255,255,255,0.10)",
        borderTop: "1px solid rgba(255,255,255,0.18)",
        padding: "20px",
        boxShadow: "0 6px 28px rgba(0,0,0,0.50), 0 0 1px rgba(255,255,255,0.04), 0 0 1px rgba(212,175,55,0.06)",
      }}>
        {/* Inner header band — dark well (matches landing page header bands) */}
        <div style={{
          background: "linear-gradient(180deg, rgba(212,175,55,0.08), #121214)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderTop: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 6,
          padding: "28px 24px 24px",
          textAlign: "center",
          boxShadow: "inset 0 2px 6px rgba(0,0,0,0.25)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, padding: "0 8px" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(212,175,55,0.35)" }} />
            <span style={{
              fontFamily: "'Roboto Mono', monospace", fontSize: 10,
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: "rgba(212,175,55,0.75)", whiteSpace: "nowrap",
            }}>{stepLabel}</span>
            <div style={{ flex: 1, height: 1, background: "rgba(212,175,55,0.35)" }} />
          </div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.8rem",
            letterSpacing: "0.02em", lineHeight: 0.90, color: "#fff",
            marginBottom: 8,
            textShadow: "0 2px 20px rgba(0,0,0,0.95), 0 4px 40px rgba(0,0,0,0.5)",
          }}>
            {title}<br />
            <span style={{
              color: "#D4AF37",
              textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.55), 0 0 80px rgba(212,175,55,0.18)",
            }}>{titleGold}</span>
          </h1>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 15,
            color: "rgba(255,255,255,0.80)", lineHeight: 1.45,
          }}>{subtitle}</p>
        </div>
      </section>
    </div>
  );
};

const Calculator = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const haptics = useHaptics();
  const mainRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);

  // Default to project step (step 00)
  const [activeTab, setActiveTab] = useState<TabId>('project');
  const prevTabRef = useRef<TabId>('project');
  const [transitionDir, setTransitionDir] = useState<'right' | 'left' | 'same'>('same');

  const [inputs, setInputs] = useState<WaterfallInputs>(defaultInputs);
  const [guilds, setGuilds] = useState<GuildState>(defaultGuilds);
  const [project, setProject] = useState<ProjectDetails>(defaultProject);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [showLeadGate, setShowLeadGate] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(() => {
    return localStorage.getItem(EMAIL_CAPTURED_KEY) === 'true';
  });
  const [sourceSelections, setSourceSelections] = useState<CapitalSourceSelections>(defaultSelections);

  const capitalSelections = sourceSelections;

  const toggleSourceSelection = useCallback((key: keyof CapitalSourceSelections) => {
    setSourceSelections(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Gate: show LeadCaptureModal if no lead capture (instead of redirecting away)
  useEffect(() => {
    if (loading) return;
    const hasLead = localStorage.getItem('og_lead_email');
    if (!hasLead) {
      setShowLeadGate(true);
    }
  }, [loading]);

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

  // Check lead status on mount
  useEffect(() => {
    setLoading(false);
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
    if (!emailCaptured) {
      setShowEmailGate(true);
    } else {
      navigate('/store/the-full-analysis');
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
    // Project tab: no context bar (no numbers yet)
    if (activeTab === 'project') return null;
    // Budget tab: show budget only (if set)
    if (activeTab === 'budget') {
      if (inputs.budget <= 0) return null;
      return <ContextBar budget={inputs.budget} />;
    }
    // Stack tab: budget + source count
    if (activeTab === 'stack') {
      return <ContextBar budget={inputs.budget} stackCount={stackSourceCount} />;
    }
    // Deal tab: budget + sources + genre + acq price
    if (activeTab === 'deal') {
      return (
        <ContextBar
          budget={inputs.budget}
          stackCount={stackSourceCount}
          genre={selectedGenre}
          acqPrice={inputs.revenue}
        />
      );
    }
    // Waterfall tab: hidden when deck is active (full data)
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
          <>
            <ProgressBar activeTab={activeTab} />
            <CalcHero
              stepLabel="Step 00 · Project"
              title="What Are You"
              titleGold="Building?"
              subtitle="Tell us about the project — or jump straight to the numbers."
              visible={true}
            />
            <ProjectTab
              project={project}
              onUpdateProject={setProject}
              onAdvance={() => handleTabChange('budget')}
            />
          </>
        );
      case 'budget':
        return (
          <>
            <ProgressBar activeTab={activeTab} />
            {renderContextBar()}
            <BudgetTab
              inputs={inputs}
              guilds={guilds}
              onUpdateInput={updateInput}
              onToggleGuild={toggleGuild}
              onAdvance={handleNext}
            />
          </>
        );
      case 'stack':
        return (
          <>
            <ProgressBar activeTab={activeTab} />
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
            <ProgressBar activeTab={activeTab} />
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
            <ProgressBar activeTab={activeTab} />
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

      <LeadCaptureModal
        isOpen={showLeadGate}
        onClose={() => setShowLeadGate(false)}
        onSuccess={() => setShowLeadGate(false)}
      />
    </div>
  );
};

export default Calculator;
