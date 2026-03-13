import React, { useState } from "react";
import { DollarSign, Layers, Handshake, ArrowDownUp } from "lucide-react";

export type TabId = 'budget' | 'stack' | 'deal' | 'waterfall' | 'project';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'budget', label: 'BUDGET', icon: <DollarSign style={{ width: 20, height: 20 }} /> },
  { id: 'stack', label: 'STACK', icon: <Layers style={{ width: 20, height: 20 }} /> },
  { id: 'deal', label: 'DEAL', icon: <Handshake style={{ width: 20, height: 20 }} /> },
  { id: 'waterfall', label: 'WATERFALL', icon: <ArrowDownUp style={{ width: 20, height: 20 }} /> },
];

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  completedTabs?: TabId[];
  disabledTabs?: TabId[];
}

const s: Record<string, React.CSSProperties> = {
  container: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    height: "62px",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    background: "rgba(6,6,6,0.92)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderTop: "1px solid rgba(212,175,55,0.20)",
    padding: "0 4px",
    paddingBottom: "env(safe-area-inset-bottom, 0px)",
  },
  tab: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    color: "rgba(255,255,255,0.40)",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "none",
    background: "transparent",
    position: "relative",
    paddingBottom: "6px",
  },
  tabActive: {
    color: "#F9E076",
  },
  tabCompleted: {
    color: "rgba(255,255,255,0.65)",
  },
  iconInactive: {
    opacity: 0.4,
    transition: "all 0.2s",
  },
  iconActive: {
    opacity: 1,
    transition: "all 0.2s",
  },
  iconCompleted: {
    opacity: 0.7,
    transition: "all 0.2s",
  },
  // Gold underline for active tab
  underlineActive: {
    position: "absolute",
    bottom: 0,
    left: "20%",
    right: "20%",
    height: "2px",
    background: "linear-gradient(90deg, rgba(212,175,55,0.50), #D4AF37, rgba(212,175,55,0.50))",
    borderRadius: "1px",
    transition: "all 0.3s",
  },
  // Dimmer gold underline for completed tabs
  underlineCompleted: {
    position: "absolute",
    bottom: 0,
    left: "20%",
    right: "20%",
    height: "2px",
    background: "rgba(212,175,55,0.30)",
    borderRadius: "1px",
    transition: "all 0.3s",
  },
};

const TabBar = ({ activeTab, onTabChange, completedTabs = [], disabledTabs = [] }: TabBarProps) => {
  const [pressedId, setPressedId] = useState<TabId | null>(null);

  return (
    <nav style={s.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isCompleted = completedTabs.includes(tab.id);
        const isDisabled = disabledTabs.includes(tab.id);
        const isPressed = pressedId === tab.id;

        const tabStyle: React.CSSProperties = {
          ...s.tab,
          ...(isActive ? s.tabActive : {}),
          ...(isCompleted && !isActive ? s.tabCompleted : {}),
          ...(isDisabled ? { opacity: 0.3, cursor: "not-allowed" } : {}),
          ...(isPressed ? { transform: "scale(0.95)" } : {}),
        };

        const iconStyle = isActive
          ? s.iconActive
          : isCompleted
            ? s.iconCompleted
            : s.iconInactive;

        return (
          <button
            key={tab.id}
            onClick={() => !isDisabled && onTabChange(tab.id)}
            onMouseDown={() => setPressedId(tab.id)}
            onMouseUp={() => setPressedId(null)}
            onMouseLeave={() => setPressedId(null)}
            onTouchStart={() => setPressedId(tab.id)}
            onTouchEnd={() => setPressedId(null)}
            disabled={isDisabled}
            style={tabStyle}
          >
            <span style={iconStyle}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            {/* Gold underline indicators */}
            {isActive && <span style={s.underlineActive} />}
            {isCompleted && !isActive && <span style={s.underlineCompleted} />}
          </button>
        );
      })}
    </nav>
  );
};

export default TabBar;
