import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calculator, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import filmmakerFIcon from "@/assets/filmmaker-f-icon.png";

interface BottomTabBarProps {
  onBotOpen?: () => void;
  isBotOpen?: boolean;
}

const tabs = [
  { id: "home",       path: "/",            label: "HOME",     icon: <Home className="w-5 h-5" /> },
  { id: "calculator", path: "/calculator",  label: "CALC",     icon: <Calculator className="w-5 h-5" /> },
  { id: "store",      path: "/store",       label: "PACKAGES", icon: <ShoppingBag className="w-5 h-5" /> },
];

const BottomTabBar = ({ onBotOpen, isBotOpen }: BottomTabBarProps) => {
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
        borderTop: "1px solid rgba(212,175,55,0.18)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.80)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = getActive(tab.path);
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200",
              "active:scale-95",
              isActive ? "text-gold" : "text-white/30 hover:text-white/60"
            )}
            aria-label={tab.label}
          >
            <span className={cn("transition-colors", isActive ? "text-gold" : "text-white/30")}>
              {tab.icon}
            </span>
            <span className="font-bebas text-[9px] tracking-[0.18em] leading-none">
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute bottom-0 w-8 h-[2px] bg-gold rounded-full" style={{ position: "relative" }} />
            )}
          </button>
        );
      })}

      {/* OG Bot tab — F icon */}
      <button
        onClick={onBotOpen}
        className={cn(
          "flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200",
          "active:scale-95",
          isBotOpen ? "text-gold" : "text-white/30 hover:text-white/60"
        )}
        aria-label="Ask the OG"
      >
        <span
          className="w-5 h-5 flex items-center justify-center overflow-hidden"
          style={{ borderRadius: 0 }}
        >
          <img
            src={filmmakerFIcon}
            alt="OG Bot"
            className={cn(
              "w-5 h-5 object-contain transition-opacity",
              isBotOpen ? "opacity-100" : "opacity-30 group-hover:opacity-60"
            )}
            style={{ filter: isBotOpen ? "none" : "grayscale(1)" }}
          />
        </span>
        <span
          className={cn(
            "font-bebas text-[9px] tracking-[0.18em] leading-none transition-colors",
            isBotOpen ? "text-gold" : "text-white/30"
          )}
        >
          ASK
        </span>
      </button>
    </nav>
  );
};

export default BottomTabBar;
