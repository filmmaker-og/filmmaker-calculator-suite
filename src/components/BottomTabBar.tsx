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
        borderTop: "2px solid rgba(212,175,55,0.35)",
        boxShadow: "0 -12px 40px rgba(0,0,0,0.95), 0 -2px 0 rgba(212,175,55,0.15), inset 0 1px 0 rgba(212,175,55,0.08)",
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
            )}
            style={{
              background: isActive ? "#1A1300" : "transparent",
              color: isActive ? "rgba(212,175,55,1)" : "rgba(212,175,55,0.45)",
            }}
            aria-label={tab.label}
          >
            {/* Active top indicator */}
            {isActive && (
              <span
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "rgba(212,175,55,0.9)" }}
              />
            )}
            <span className="transition-colors">{tab.icon}</span>
            <span
              className="font-bebas leading-none transition-all"
              style={{
                fontSize: isActive ? "10px" : "9px",
                letterSpacing: isActive ? "0.18em" : "0.10em",
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}

      {/* OG Bot tab — F icon */}
      <button
        onClick={onBotOpen}
        className="relative flex-1 flex flex-col items-center justify-center gap-[3px] transition-all duration-200 active:scale-95"
        style={{
          background: isBotOpen ? "#1A1300" : "transparent",
          color: isBotOpen ? "rgba(212,175,55,1)" : "rgba(212,175,55,0.45)",
        }}
        aria-label="Ask the OG"
      >
        {isBotOpen && (
          <span
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: "rgba(212,175,55,0.9)" }}
          />
        )}
        <span className="w-[18px] h-[18px] flex items-center justify-center">
          <img
            src={filmmakerFIcon}
            alt="OG Bot"
            className="w-[18px] h-[18px] object-contain transition-all"
            style={{
              opacity: isBotOpen ? 1 : 0.40,
              filter: isBotOpen
                ? "drop-shadow(0 0 6px rgba(212,175,55,0.9))"
                : "sepia(0.3) saturate(0.8)",
            }}
          />
        </span>
        <span
          className="font-bebas leading-none transition-all"
          style={{
            fontSize: isBotOpen ? "10px" : "9px",
            letterSpacing: isBotOpen ? "0.18em" : "0.10em",
          }}
        >
          ASK
        </span>
      </button>

      {/* ··· More tab */}
      <button
        onClick={onMoreOpen}
        className="relative flex-1 flex flex-col items-center justify-center gap-[3px] transition-all duration-200 active:scale-95"
        style={{ color: "rgba(212,175,55,0.45)" }}
        aria-label="More"
      >
        <MoreHorizontal className="w-[18px] h-[18px]" />
        <span
          className="font-bebas leading-none"
          style={{ fontSize: "9px", letterSpacing: "0.10em" }}
        >
          MORE
        </span>
      </button>
    </nav>
  );
};

export default BottomTabBar;
