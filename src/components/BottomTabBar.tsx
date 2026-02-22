import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calculator, ShoppingBag, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   BottomTabBar — full-width, matches AppHeader spec exactly
   Height: 54px (--appbar-h)
   Border: 1px gold @ 0.25
   Background: solid #000000
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
      className="fixed bottom-0 left-0 right-0 z-[140]"
    >
      <nav
        className="relative flex items-stretch"
        style={{
          width: "100%",
          height: "var(--appbar-h)",
          background: "#000000",
          borderTop: "1px solid rgba(212,175,55,0.25)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.80)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        {tabs.map((tab) => {
          const isActive = getActive(tab.path);
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTap(tab)}
              className="relative flex-1 flex flex-col items-center justify-center gap-[4px] transition-all duration-200 active:scale-95 overflow-hidden"
              aria-label={tab.label}
            >
              {/* Tap ripple */}
              {rippleId === tab.id && (
                <span
                  className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full pointer-events-none animate-tap-ripple"
                  style={{ background: "rgba(212,175,55,0.15)" }}
                />
              )}

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

              {/* Active indicator — hangs from top border */}
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 block"
                  style={{
                    width: "20px",
                    height: "2px",
                    borderRadius: "0 0 2px 2px",
                    background: "#D4AF37",
                    boxShadow: "0 2px 8px rgba(212,175,55,0.50)",
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
