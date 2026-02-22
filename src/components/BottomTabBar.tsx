import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calculator, ShoppingBag, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   BottomTabBar — 3 buttons
   SHOP · CALC · OG (bot)
   Full-width. Solid #000. Gold top border.
   Matches AppHeader: same height, same border, same gold.
   ═══════════════════════════════════════════════════════════════════ */

interface BottomTabBarProps {
  onBotOpen?: () => void;
}

const BottomTabBar = ({ onBotOpen }: BottomTabBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const haptics = useHaptics();
  const [rippleId, setRippleId] = useState<string | null>(null);

  const navTabs = [
    {
      id: "shop",
      label: "SHOP",
      icon: ShoppingBag,
      isActive: location.pathname.startsWith("/store"),
      onTap: () => { navigate("/store"); },
    },
    {
      id: "calc",
      label: "CALC",
      icon: Calculator,
      isActive: location.pathname.startsWith("/calculator"),
      onTap: () => { navigate("/calculator"); },
    },
    {
      id: "og",
      label: "OG",
      icon: Sparkles,
      isActive: false,
      onTap: () => { onBotOpen?.(); },
    },
  ];

  const handleTap = useCallback((tab: typeof navTabs[0]) => {
    haptics.light();
    setRippleId(tab.id);
    tab.onTap();
    setTimeout(() => setRippleId(null), 420);
  }, [haptics, navTabs]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[140]">
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
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTap(tab)}
              className="relative flex-1 flex flex-col items-center justify-center gap-[5px] transition-all duration-200 active:scale-95 overflow-hidden"
              aria-label={tab.label}
            >
              {rippleId === tab.id && (
                <span
                  className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full pointer-events-none animate-tap-ripple"
                  style={{ background: "rgba(212,175,55,0.15)" }}
                />
              )}

              <Icon
                className={cn(
                  "transition-all duration-200",
                  tab.isActive ? "text-gold" : "text-gold-label"
                )}
                style={{
                  width: "24px",
                  height: "24px",
                  ...(tab.isActive ? { filter: "drop-shadow(0 0 5px rgba(212,175,55,0.40))" } : {}),
                }}
                strokeWidth={tab.isActive ? 2 : 1.5}
              />

              <span
                className={cn(
                  "font-bebas leading-none transition-all text-[13px]",
                  tab.isActive
                    ? "text-gold tracking-[0.16em]"
                    : "text-ink-secondary tracking-[0.10em]"
                )}
              >
                {tab.label}
              </span>

              {tab.isActive && (
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
