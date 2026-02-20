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
  { id: "home",       path: "/",           label: "HOME", icon: Home },
  { id: "calculator", path: "/calculator", label: "CALC", icon: Calculator },
  { id: "store",      path: "/store",      label: "PKGS", icon: ShoppingBag },
];

const BottomTabBar = ({ onBotOpen, isBotOpen, onMoreOpen }: BottomTabBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const GOLD_FULL = "rgba(212,175,55,1)";
  const GOLD_DIM  = "rgba(212,175,55,0.65)";

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[140] flex items-stretch"
      style={{
        height: "calc(var(--bottom-bar-h) + env(safe-area-inset-bottom))",
        paddingBottom: "env(safe-area-inset-bottom)",
        background: "#0A0A0A",
        borderTop: "2px solid rgba(212,175,55,0.40)",
        boxShadow: "0 -12px 40px rgba(0,0,0,0.95)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = getActive(tab.path);
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={cn(
              "relative flex-1 flex flex-col items-center justify-center gap-[3px] transition-all duration-200 active:scale-95",
            )}
            style={{ color: isActive ? GOLD_FULL : GOLD_DIM }}
            aria-label={tab.label}
          >
            {/* Active 3px top indicator */}
            {isActive && (
              <span
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: GOLD_FULL }}
              />
            )}
            <Icon className="w-5 h-5" />
            <span
              className="font-mono leading-none transition-all"
              style={{
                fontSize: "11px",
                letterSpacing: isActive ? "0.16em" : "0.10em",
                fontWeight: isActive ? 500 : 400,
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
        style={{ color: isBotOpen ? GOLD_FULL : GOLD_DIM }}
        aria-label="Ask the OG"
      >
        {isBotOpen && (
          <span
            className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ background: GOLD_FULL }}
          />
        )}
        <span className="w-5 h-5 flex items-center justify-center">
          <img
            src={filmmakerFIcon}
            alt="OG Bot"
            className="w-5 h-5 object-contain transition-all"
            style={{
              opacity: isBotOpen ? 1 : 0.65,
              filter: isBotOpen
                ? "drop-shadow(0 0 6px rgba(212,175,55,0.9))"
                : "sepia(0.3) saturate(0.8)",
            }}
          />
        </span>
        <span
          className="font-mono leading-none transition-all"
          style={{
            fontSize: "11px",
            letterSpacing: isBotOpen ? "0.16em" : "0.10em",
            fontWeight: isBotOpen ? 500 : 400,
          }}
        >
          ASK
        </span>
      </button>

      {/* ··· More tab */}
      <button
        onClick={onMoreOpen}
        className="relative flex-1 flex flex-col items-center justify-center gap-[3px] transition-all duration-200 active:scale-95"
        style={{ color: GOLD_DIM }}
        aria-label="More"
      >
        <MoreHorizontal className="w-5 h-5" />
        <span
          className="font-mono leading-none"
          style={{ fontSize: "11px", letterSpacing: "0.10em" }}
        >
          MORE
        </span>
      </button>
    </nav>
  );
};

export default BottomTabBar;
