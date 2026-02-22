import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Calculator, ShoppingBag, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   BottomTabBar — floating pill, matches AppHeader exactly
   3 buttons: SHOP · CALC · OG
   320px centered pill, 16px radius, solid black, gold border 0.50
   ═══════════════════════════════════════════════════════════════════ */

interface BottomTabBarProps {
  onBotOpen?: () => void;
}

const BottomTabBar = ({ onBotOpen }: BottomTabBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const haptics = useHaptics();
  const [rippleId, setRippleId] = useState<string | null>(null);

  const tabs = [
    {
      id: "shop",
      label: "SHOP",
      icon: ShoppingBag,
      isActive: location.pathname.startsWith("/store"),
      onTap: () => navigate("/store"),
    },
    {
      id: "calc",
      label: "CALC",
      icon: Calculator,
      isActive: location.pathname.startsWith("/calculator"),
      onTap: () => navigate("/calculator"),
    },
    {
      id: "og",
      label: "OG",
      icon: Sparkles,
      isActive: false,
      onTap: () => onBotOpen?.(),
    },
  ];

  const handleTap = useCallback((tab: typeof tabs[0]) => {
    haptics.light();
    setRippleId(tab.id);
    tab.onTap();
    setTimeout(() => setRippleId(null), 420);
  }, [haptics]);

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
          maxWidth: "320px",
          height: "54px",
          borderRadius: "16px",
          background: "#000000",
          border: "1.5px solid rgba(212,175,55,0.50)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.95), 0 0 0 1px rgba(212,175,55,0.10)",
          paddingLeft: "8px",
          paddingRight: "8px",
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTap(tab)}
              className={cn(
                "relative flex-1 flex flex-col items-center justify-center gap-[5px] transition-all duration-200 active:scale-95 overflow-hidden",
                tab.isActive && "rounded-xl",
              )}
              style={{
                background: tab.isActive ? "rgba(212,175,55,0.08)" : "transparent",
              }}
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
                  "font-bebas leading-none transition-all text-[14px]",
                  tab.isActive
                    ? "text-gold tracking-[0.16em]"
                    : "text-ink-body tracking-[0.12em]"
                )}
              >
                {tab.label}
              </span>

              {tab.isActive && (
                <span
                  className="absolute top-[2px] left-1/2 -translate-x-1/2 block"
                  style={{
                    width: "20px",
                    height: "2.5px",
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
