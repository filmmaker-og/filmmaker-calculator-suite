import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calculator, ShoppingBag, BookOpen, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   BottomTabBar — 4-tab navigation pill
   HOME removed (F icon in header handles it)
   CALC · SHOP · INFO · MORE
   ═══════════════════════════════════════════════════════════════════ */

const navTabs = [
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
        className="relative flex items-stretch overflow-hidden"
        style={{
          pointerEvents: "auto",
          width: "100%",
          maxWidth: "320px",
          height: "54px",
          borderRadius: "16px",
          background: "rgba(10,10,10,0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1.5px solid rgba(212,175,55,0.50)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.90), 0 0 0 1px rgba(212,175,55,0.10), 0 0 12px rgba(212,175,55,0.06)",
          paddingLeft: "6px",
          paddingRight: "6px",
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
                className={cn("w-5 h-5 transition-all duration-200", isActive ? "text-gold" : "text-gold-label")}
                style={isActive ? { filter: "drop-shadow(0 0 4px rgba(212,175,55,0.35))" } : undefined}
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
                  className="absolute bottom-[4px] left-1/2 -translate-x-1/2 block"
                  style={{
                    width: "18px",
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

        {/* MORE tab */}
        <button
          onClick={handleMoreTap}
          className="relative flex-1 flex flex-col items-center justify-center gap-[3px] transition-all duration-200 active:scale-95 overflow-hidden"
          aria-label="More options"
        >
          {rippleId === "more" && (
            <span className="absolute top-1/2 left-1/2 w-10 h-10 rounded-full pointer-events-none animate-tap-ripple bg-chrome-ripple" />
          )}
          <MoreHorizontal className="w-5 h-5 text-gold-label transition-all duration-200" />
          <span className="font-bebas leading-none text-[11px] text-ink-secondary tracking-[0.10em]">
            MORE
          </span>
        </button>
      </nav>
    </div>
  );
};

export default BottomTabBar;
