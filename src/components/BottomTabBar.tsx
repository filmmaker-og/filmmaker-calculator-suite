import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calculator, ShoppingBag, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/hooks/use-haptics";

const tabs = [
  { id: "home",       path: "/",           label: "HOME", icon: Home },
  { id: "calculator", path: "/calculator", label: "CALC", icon: Calculator },
  { id: "store",      path: "/store",      label: "SHOP", icon: ShoppingBag },
  { id: "resources",  path: "/resources",  label: "INFO", icon: BookOpen },
];

/* ═══════════════════════════════════════════════════════════════════
   BottomTabBar — uses chrome-* design tokens
   Matches AppHeader luminance tier (architectural gold)
   ═══════════════════════════════════════════════════════════════════ */
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
    /* Full-width transparent wrapper — handles safe-area, centers the pill */
    <div
      className="fixed bottom-0 left-0 right-0 z-[140] flex justify-center"
      style={{
        paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
        background: "transparent",
        pointerEvents: "none",
      }}
    >
      {/* Floating box-rounded nav pill */}
      <nav
        className="relative flex items-stretch overflow-hidden bg-chrome-bg-solid border-[1.5px] border-chrome-border backdrop-blur-[16px]"
        style={{
          pointerEvents: "auto",
          width: "100%",
          maxWidth: "340px",
          height: "54px",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.90), 0 0 0 1px rgba(212,175,55,0.15), 0 0 12px rgba(212,175,55,0.06)",
          paddingLeft: "6px",
          paddingRight: "6px",
        }}
      >
        {/* Gold top edge line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none bg-gradient-to-r from-transparent via-chrome-glow to-transparent" />

        {tabs.map((tab) => {
          const isActive = getActive(tab.path);
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTap(tab)}
              className={cn(
                "relative flex-1 flex flex-col items-center justify-center gap-[3px] transition-all duration-200 active:scale-95 overflow-hidden",
                isActive && "rounded-lg bg-chrome-active",
              )}
              aria-label={tab.label}
            >
              {/* Gold tap-ripple */}
              {rippleId === tab.id && (
                <span
                  className="absolute top-1/2 left-1/2 w-10 h-10 rounded-full pointer-events-none animate-tap-ripple bg-chrome-ripple"
                />
              )}
              <Icon
                className={cn("w-5 h-5", isActive ? "text-gold" : "text-gold-label")}
              />
              <span
                className={cn(
                  "font-bebas leading-none transition-all text-[11px]",
                  isActive
                    ? "text-gold tracking-[0.16em] font-medium"
                    : "text-ink-secondary tracking-[0.10em] font-medium"
                )}
              >
                {tab.label}
              </span>
              {/* Active indicator bar */}
              {isActive && (
                <span
                  className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-6 h-[2.5px] rounded-sm bg-gold block"
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
