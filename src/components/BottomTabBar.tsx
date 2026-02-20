import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calculator, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "home",       path: "/",           label: "HOME", icon: Home },
  { id: "calculator", path: "/calculator", label: "CALC", icon: Calculator },
  { id: "store",      path: "/store",      label: "PKGS", icon: ShoppingBag },
];

const BottomTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const GOLD_FULL = "rgba(212,175,55,1)";
  const GOLD_DIM  = "rgba(212,175,55,0.65)";

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
          border: "1.5px solid rgba(212,175,55,0.35)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.90), 0 0 0 1px rgba(212,175,55,0.10)",
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
              onClick={() => navigate(tab.path)}
              className={cn(
                "relative flex-1 flex flex-col items-center justify-center gap-[3px] transition-all duration-200 active:scale-95",
              )}
              style={{ color: isActive ? GOLD_FULL : GOLD_DIM }}
              aria-label={tab.label}
            >
              <Icon className="w-5 h-5" />
              <span
                className="font-mono leading-none transition-all"
                style={{
                  fontSize: "10px",
                  letterSpacing: isActive ? "0.16em" : "0.10em",
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {tab.label}
              </span>
              {/* Telegram-style active dot indicator */}
              {isActive && (
                <span
                  className="absolute bottom-[5px] left-1/2 -translate-x-1/2"
                  style={{
                    width: "18px",
                    height: "2px",
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
