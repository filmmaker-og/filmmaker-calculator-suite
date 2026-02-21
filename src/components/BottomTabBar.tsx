import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calculator, ShoppingBag, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "home",       path: "/",           label: "HOME", icon: Home },
  { id: "calculator", path: "/calculator", label: "CALC", icon: Calculator },
  { id: "store",      path: "/store",      label: "PKGS", icon: ShoppingBag },
  { id: "resources",  path: "/resources",  label: "INFO", icon: BookOpen },
];

const BottomTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rippleId, setRippleId] = useState<string | null>(null);

  const getActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleTap = useCallback((tab: typeof tabs[0]) => {
    setRippleId(tab.id);
    navigate(tab.path);
    setTimeout(() => setRippleId(null), 420);
  }, [navigate]);

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
        className="flex items-stretch"
        style={{
          pointerEvents: "auto",
          width: "100%",
          maxWidth: "340px",
          height: "54px",
          borderRadius: "16px",
          background: "#0A0A0A",
          border: "1.5px solid rgba(212,175,55,0.45)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.90), 0 0 0 1px rgba(212,175,55,0.10), 0 0 15px rgba(212,175,55,0.08)",
          paddingLeft: "6px",
          paddingRight: "6px",
        }}
      >
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
                background: isActive ? "rgba(212,175,55,0.12)" : "transparent",
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
                  color: isActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.75)",
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
