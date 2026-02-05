import { cn } from "@/lib/utils";
import { DollarSign, Layers, Handshake, ArrowDownUp, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type TabId = 'budget' | 'stack' | 'deal' | 'waterfall';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'budget', label: 'BUDGET', icon: <DollarSign className="w-5 h-5" /> },
  { id: 'stack', label: 'STACK', icon: <Layers className="w-5 h-5" /> },
  { id: 'deal', label: 'DEAL', icon: <Handshake className="w-5 h-5" /> },
  { id: 'waterfall', label: 'WATERFALL', icon: <ArrowDownUp className="w-5 h-5" /> },
];

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  completedTabs?: TabId[];
  disabledTabs?: TabId[];
}

const TabBar = ({ activeTab, onTabChange, completedTabs = [], disabledTabs = [] }: TabBarProps) => {
  const navigate = useNavigate();

  return (
    <nav className="tab-bar">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="tab-bar-item"
      >
        <span className="tab-icon text-text-dim">
          <ArrowLeft className="w-5 h-5" />
        </span>
        <span>BACK</span>
      </button>

      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isCompleted = completedTabs.includes(tab.id);
        const isDisabled = disabledTabs.includes(tab.id);

        return (
          <button
            key={tab.id}
            onClick={() => !isDisabled && onTabChange(tab.id)}
            disabled={isDisabled}
            className={cn(
              "tab-bar-item",
              isActive && "is-active",
              isDisabled && "opacity-30 cursor-not-allowed"
            )}
          >
            <span className={cn(
              "tab-icon transition-colors",
              isActive ? "text-gold" : isCompleted ? "text-text-mid" : "text-text-dim"
            )}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default TabBar;
