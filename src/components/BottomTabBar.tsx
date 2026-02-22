import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calculator, ShoppingBag, BookOpen, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   BottomTabBar — 5-tab navigation pill
   Width matches AppHeader at 320px — bookend chrome system
   5th tab: MORE → opens MobileMenu (kebab relocated from header)
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
      className="fixed bottom-0 left-0 right-0 z-[140] flex justify-center"
      style={{
        paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
        background: "transparent",
        pointerEvents: "none",
      }}
    >
      <nav
        className="relative flex items-stretch overflow-hidden bg-chrome-bg-solid border-[1.5px] border-chrome-border backdrop-blur-[16px]"
        style={{
          pointerEvents: "auto",
          width: "100%",
          maxWidth: "320px",
          height: "54px",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.90), 0 0 0 1px rgba(212,175,55,0.15), 0 0 12px rgba(212,175,55,0.06)",
          paddingLeft: "4px",
          paddingRight: "4px",
        }}
      >
        {/* Gold top edge line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.30) 30%, rgba(212,175,55,0.40) 50%, rgba(212,175,55,0.30) 70%, transparent 100%)",
          }}
        />

        {/* Nav tabs */}
        {navTabs.map((tab) => {
          const isActive = getActive(tab.path);
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleNavTap(tab)}
              className={cn(
                "relative flex-1 flex flex-col items-center justify-center gap-[3px] transition-all duration-200 active:scale-95 overflow-hidden",
                isActive && "rounded-lg",
              )}
              style={{
                background: isActive ? "rgba(212,175,55,0.10)" : "transparent",
              }}
              aria-label={tab.label}
            >
              {rippleId === tab.id && (
                <span className="absolute top-1/2 left-1/2 w-10 h-10 rounded-full pointer-events-none animate-tap-ripple bg-chrome-ripple" />
              )}
              <Icon
                className={cn("w-[18px] h-[18px] transition-all duration-200", isActive ? "text-gold" : "text-gold-label")}
                style={isActive ? { filter: "drop-shadow(0 0 4px rgba(212,175,55,0.35))" } : undefined}
              />
              <span
                className={cn(
                  "font-bebas leading-none transition-all text-[10px]",
                  isActive
                    ? "text-gold tracking-[0.14em] font-medium"
                    : "text-ink-secondary tracking-[0.08em] font-medium"
                )}
              >
                {tab.label}
              </span>
              {isActive && (
                <span
                  className="absolute bottom-[4px] left-1/2 -translate-x-1/2 block"
                  style={{
                    width: "16px",
                    height: "2px",
                    borderRadius: "2px",
                    background: "#D4AF37",
                    boxShadow: "0 0 6px rgba(212,175,55,0.50)",
                  }}
                />
              )}
            </button>
          );
        })}

        {/* MORE tab — opens MobileMenu */}
        <button
          onClick={handleMoreTap}
          className="relative flex-1 flex flex-col items-center justify-center gap-[3px] transition-all duration-200 active:scale-95 overflow-hidden"
          aria-label="More options"
        >
          {rippleId === "more" && (
            <span className="absolute top-1/2 left-1/2 w-10 h-10 rounded-full pointer-events-none animate-tap-ripple bg-chrome-ripple" />
          )}
          <MoreHorizontal className="w-[18px] h-[18px] text-gold-label transition-all duration-200" />
          <span className="font-bebas leading-none text-[10px] text-ink-secondary tracking-[0.08em] font-medium">
            MORE
          </span>
        </button>
      </nav>
    </div>
  );
};

export default BottomTabBar;
