import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calculator, ShoppingBag, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   BottomTabBar — floating pill, 4 tabs
   HOME · CALC · SHOP · INFO
   
   340px pill. Solid black. Gold border at 0.55 (confident).
   Icons 22px, labels 12px — readable, not cramped.
   Active state: gold icon + glow + top indicator bar.
   ═══════════════════════════════════════════════════════════════════ */

const tabs = [
  { id: "home",       path: "/",           label: "HOME", icon: Home },
  { id: "calculator", path: "/calculator", label: "CALC", icon: Calculator },
  { id: "store",      path: "/store",      label: "SHOP", icon: ShoppingBag },
  { id: "resources",  path: "/resources",  label: "INFO", icon: BookOpen },
];

const BottomTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const haptics = useHaptics();
  const [rippleId, setRippleId] = useState<string | null>(null);

  const getActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleTap = useCallback((tab: typeof tabs[0]) => {
    haptics.light();
    setRippleId(tab.id);
    navigate(tab.path);
    setTimeout(() => setRippleId(null), 420);
  }, [navigate, haptics]);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[140] flex justify-center"
      style={{
        paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
        pointerEvents: "none",
      }}
    >
      <nav
        className="relative flex items-stretch overflow-hidden"
        style={{
          pointerEvents: "auto",
          width: "100%",
          maxWidth: "340px",
          height: "58px",
          borderRadius: "18px",
          background: "#000000",
          border: "1.5px solid rgba(212,175,55,0.55)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.95), 0 0 0 1px rgba(212,175,55,0.12), 0 0 16px rgba(212,175,55,0.08)",
          paddingLeft: "6px",
          paddingRight: "6px",
        }}
      >
        {/* Gold top edge line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.40) 30%, rgba(212,175,55,0.55) 50%, rgba(212,175,55,0.40) 70%, transparent 100%)",
          }}
        />

        {tabs.map((tab) => {
          const isActive = getActive(tab.path);
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTap(tab)}
              className={cn(
                "relative flex-1 flex flex-col items-center justify-center gap-[4px] transition-all duration-200 active:scale-95 overflow-hidden",
                isActive && "rounded-xl",
              )}
              style={{
                background: isActive ? "rgba(212,175,55,0.08)" : "transparent",
              }}
              aria-label={tab.label}
            >
              {/* Tap ripple */}
              {rippleId === tab.id && (
                <span
                  className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full pointer-events-none animate-tap-ripple"
                  style={{ background: "rgba(212,175,55,0.20)" }}
                />
              )}

              {/* Icon */}
              <Icon
                className={cn(
                  "transition-all duration-200",
                  isActive ? "text-gold" : "text-ink-secondary"
                )}
                style={{
                  width: "22px",
                  height: "22px",
                  ...(isActive ? { filter: "drop-shadow(0 0 5px rgba(212,175,55,0.40))" } : {}),
                }}
                strokeWidth={isActive ? 2 : 1.5}
              />

              {/* Label */}
              <span
                className={cn(
                  "font-bebas leading-none transition-all",
                  isActive
                    ? "text-gold tracking-[0.16em]"
                    : "text-ink-secondary tracking-[0.10em]"
                )}
                style={{ fontSize: "12px" }}
              >
                {tab.label}
              </span>

              {/* Active indicator — top edge */}
              {isActive && (
                <span
                  className="absolute top-[2px] left-1/2 -translate-x-1/2 block"
                  style={{
                    width: "20px",
                    height: "2.5px",
                    borderRadius: "0 0 3px 3px",
                    background: "#D4AF37",
                    boxShadow: "0 2px 8px rgba(212,175,55,0.60)",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomTabBar;
