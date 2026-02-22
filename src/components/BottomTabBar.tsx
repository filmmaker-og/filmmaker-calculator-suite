import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calculator, ShoppingBag, BookOpen, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   BottomTabBar — full-width edge-to-edge bar
   HOME · CALC · SHOP · INFO · MORE
   ═══════════════════════════════════════════════════════════════════ */

const navTabs = [
  { id: "home",       path: "/",           label: "HOME",  icon: Home },
  { id: "calculator", path: "/calculator", label: "CALC",  icon: Calculator },
  { id: "store",      path: "/store",      label: "SHOP",  icon: ShoppingBag },
  { id: "resources",  path: "/resources",  label: "INFO",  icon: BookOpen },
];

interface BottomTabBarProps {
  onMoreOpen?: () => void;
}

const BottomTabBar = ({ onMoreOpen }: BottomTabBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const haptics = useHaptics();
  const [rippleId, setRippleId] = useState<string | null>(null);

  const getActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleNavTap = useCallback((tab: typeof navTabs[0]) => {
    haptics.light();
    setRippleId(tab.id);
    navigate(tab.path);
    setTimeout(() => setRippleId(null), 420);
  }, [navigate, haptics]);

  const handleMoreTap = useCallback(() => {
    haptics.light();
    setRippleId("more");
    onMoreOpen?.();
    setTimeout(() => setRippleId(null), 420);
  }, [haptics, onMoreOpen]);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[140]"
      style={{
        background: "transparent",
        pointerEvents: "none",
      }}
    >
      <nav
        className="relative flex items-stretch"
        style={{
          pointerEvents: "auto",
          width: "100%",
          height: "60px",
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(212,175,55,0.35)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.60), 0 -1px 0 rgba(212,175,55,0.08)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
      >
        {/* Nav tabs */}
        {navTabs.map((tab) => {
          const isActive = getActive(tab.path);
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleNavTap(tab)}
              className={cn(
                "relative flex-1 flex flex-col items-center justify-center gap-[4px] transition-all duration-200 active:scale-95 overflow-hidden",
              )}
              aria-label={tab.label}
            >
              {rippleId === tab.id && (
                <span
                  className="absolute top-1/2 left-1/2 w-10 h-10 rounded-full pointer-events-none animate-tap-ripple"
                  style={{ background: "rgba(212,175,55,0.15)" }}
                />
              )}
              <Icon
                className={cn("w-5 h-5 transition-all duration-200", isActive ? "text-gold" : "text-ink-secondary")}
                style={isActive ? { filter: "drop-shadow(0 0 4px rgba(212,175,55,0.30))" } : undefined}
              />
              <span
                className={cn(
                  "font-bebas leading-none transition-all text-[11px]",
                  isActive
                    ? "text-gold tracking-[0.14em]"
                    : "text-ink-secondary tracking-[0.10em]"
                )}
              >
                {tab.label}
              </span>
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 block"
                  style={{
                    width: "24px",
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

        {/* MORE tab */}
        <button
          onClick={handleMoreTap}
          className="relative flex-1 flex flex-col items-center justify-center gap-[4px] transition-all duration-200 active:scale-95 overflow-hidden"
          aria-label="More options"
        >
          {rippleId === "more" && (
            <span
              className="absolute top-1/2 left-1/2 w-10 h-10 rounded-full pointer-events-none animate-tap-ripple"
              style={{ background: "rgba(212,175,55,0.15)" }}
            />
          )}
          <MoreHorizontal className="w-5 h-5 text-ink-secondary transition-all duration-200" />
          <span className="font-bebas leading-none text-[11px] text-ink-secondary tracking-[0.10em]">
            MORE
          </span>
        </button>
      </nav>
    </div>
  );
};

export default BottomTabBar;
