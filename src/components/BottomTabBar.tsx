import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calculator, ShoppingBag, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import filmmakerFIcon from "@/assets/filmmaker-f-icon.png";

interface BottomTabBarProps {
  onBotOpen?: () => void;
  isBotOpen?: boolean;
  onMoreOpen?: () => void;
}

const tabs = [
  { id: "home",       path: "/",            label: "HOME",  icon: <Home className="w-[18px] h-[18px]" /> },
  { id: "calculator", path: "/calculator",  label: "CALC",  icon: <Calculator className="w-[18px] h-[18px]" /> },
  { id: "store",      path: "/store",       label: "PKGS",  icon: <ShoppingBag className="w-[18px] h-[18px]" /> },
];

const BottomTabBar = ({ onBotOpen, isBotOpen, onMoreOpen }: BottomTabBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[140] flex items-stretch"
      style={{
        height: "calc(var(--bottom-bar-h) + env(safe-area-inset-bottom))",
        paddingBottom: "env(safe-area-inset-bottom)",
        background: "#0A0A0A",
        borderTop: "1px solid rgba(212,175,55,0.28)",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.90), 0 -1px 0 rgba(212,175,55,0.20)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = getActive(tab.path);
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={cn(
              "relative flex-1 flex flex-col items-center justify-center gap-[3px] transition-all duration-200",
              "active:scale-95",
              isActive
                ? "text-gold bg-gold/[0.06]"
                : "text-white/55 hover:text-white/80"
            )}
            aria-label={tab.label}
          >
            {/* Active top indicator */}
            {isActive && (
              <span className="absolute top-0 left-2 right-2 h-[2px] bg-gold rounded-full" />
            )}
            <span className="transition-colors">{tab.icon}</span>
            <span className={cn(
              "font-bebas leading-none transition-colors",
              isActive ? "text-[10px] tracking-[0.15em]" : "text-[10px] tracking-[0.12em]"
            )}>
              {tab.label}
            </span>
          </button>
        );
      })}

      {/* OG Bot tab — F icon */}
      <button
        onClick={onBotOpen}
        className={cn(
          "relative flex-1 flex flex-col items-center justify-center gap-[3px] transition-all duration-200",
          "active:scale-95",
          isBotOpen ? "text-gold bg-gold/[0.06]" : "text-white/55 hover:text-white/80"
        )}
        aria-label="Ask the OG"
      >
        {isBotOpen && <span className="absolute top-0 left-2 right-2 h-[2px] bg-gold rounded-full" />}
        <span className="w-[18px] h-[18px] flex items-center justify-center">
          <img
            src={filmmakerFIcon}
            alt="OG Bot"
            className="w-[18px] h-[18px] object-contain transition-all"
            style={{
              opacity: isBotOpen ? 1 : 0.55,
              filter: isBotOpen ? "drop-shadow(0 0 4px rgba(212,175,55,0.8))" : "none",
            }}
          />
        </span>
        <span className={cn(
          "font-bebas text-[10px] leading-none transition-colors",
          isBotOpen ? "tracking-[0.15em] text-gold" : "tracking-[0.12em]"
        )}>
          ASK
        </span>
      </button>

      {/* ··· More tab */}
      <button
        onClick={onMoreOpen}
        className="relative flex-1 flex flex-col items-center justify-center gap-[3px] transition-all duration-200 active:scale-95 text-white/55 hover:text-white/80"
        aria-label="More"
      >
        <MoreHorizontal className="w-[18px] h-[18px]" />
        <span className="font-bebas text-[10px] tracking-[0.12em] leading-none">MORE</span>
      </button>
    </nav>
  );
};

export default BottomTabBar;
