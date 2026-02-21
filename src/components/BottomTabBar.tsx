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

  const GOLD_FULL = "rgba(212,175,55,1)";
  const GOLD_DIM  = "rgba(212,175,55,0.75)";

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
        className="relative flex items-stretch overflow-hidden"
        style={{
          pointerEvents: "auto",
          width: "100%",
          maxWidth: "340px",
          height: "54px",
          borderRadius: "16px",
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1.5px solid rgba(212,175,55,0.55)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.90), 0 0 0 1px rgba(212,175,55,0.14), 0 0 16px rgba(212,175,55,0.10), inset 0 0.5px 0 rgba(212,175,55,0.12)",
          paddingLeft: "6px",
          paddingRight: "6px",
        }}
      >
        {/* Gold top edge line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.45) 30%, rgba(212,175,55,0.60) 50%, rgba(212,175,55,0.45) 70%, transparent 100%)",
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
                "relative flex-1 flex flex-col items-center justify-center gap-[3px] transition-all duration-200 active:scale-95 overflow-hidden",
                isActive && "rounded-lg",
              )}
              style={{
                background: isActive ? "rgba(212,175,55,0.06)" : "transparent",
              }}
              aria-label={tab.label}
            >
              {/* Gold tap-ripple */}
              {rippleId === tab.id && (
                <span
                  className="absolute top-1/2 left-1/2 w-10 h-10 rounded-full pointer-events-none animate-tap-ripple"
                  style={{ background: "rgba(212,175,55,0.3)" }}
                />
              )}
              <Icon
                className="w-5 h-5"
                style={{ color: isActive ? GOLD_FULL : GOLD_DIM }}
              />
              <span
                className="font-bebas leading-none transition-all"
                style={{
                  fontSize: "11px",
                  letterSpacing: isActive ? "0.16em" : "0.10em",
                  fontWeight: 500,
                  color: isActive ? GOLD_FULL : "rgba(255,255,255,0.65)",
                }}
              >
                {tab.label}
              </span>
              {/* Telegram-style active dot indicator */}
              {isActive && (
                <span
                  className="absolute bottom-[5px] left-1/2 -translate-x-1/2"
                  style={{
                    width: "24px",
                    height: "2.5px",
                    borderRadius: "2px",
                    background: GOLD_FULL,
                    display: "block",
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
