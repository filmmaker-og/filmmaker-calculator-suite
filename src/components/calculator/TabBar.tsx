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
    padding: "6px 0",
    fontFamily: "'Inter', sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    color: "rgba(255,255,255,0.55)",
    cursor: "pointer",
    borderRadius: "6px",
    transition: "all 0.15s",
    border: "none",
    background: "transparent",
    position: "relative",
  },
  tabActive: {
    color: "#F9E076",
    background: "rgba(212,175,55,0.08)",
  },
  tabCompleted: {
    color: "rgba(255,255,255,0.65)",
  },
  iconInactive: {
    opacity: 0.5,
    transition: "all 0.15s",
  },
  iconActive: {
    opacity: 1,
    color: "#F9E076",
    transition: "all 0.15s",
  },
  iconCompleted: {
    opacity: 0.8,
    color: "rgba(255,255,255,0.65)",
    transition: "all 0.15s",
  },
  completedDot: {
    position: "absolute",
    top: "8px",
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: "#D4AF37",
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
            <span style={{ position: "relative" }}>
              <span style={iconStyle}>
                {tab.icon}
              </span>
              {isCompleted && !isActive && (
                <span style={s.completedDot} />
              )}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default TabBar;
