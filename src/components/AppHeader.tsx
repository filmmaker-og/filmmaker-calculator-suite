import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   AppHeader — unified global header for all pages
   Left:   FILMMAKER.OG (→ home)
   Right:  kebab menu (→ MobileMenu)
   ═══════════════════════════════════════════════════════════════════ */
interface AppHeaderProps {
  onMoreOpen?: () => void;
}

const GOLD_FULL = "rgba(212,175,55,1)";

const AppHeader = ({ onMoreOpen }: AppHeaderProps) => {
  const navigate = useNavigate();
  const haptics = useHaptics();

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[150] flex justify-center"
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        {/* Floating centered bar */}
        <nav
          className="relative flex items-center justify-between overflow-hidden"
          style={{
            pointerEvents: "auto",
            width: "100%",
            maxWidth: "300px",
            height: "var(--appbar-h)",
            marginTop: "12px",
            borderRadius: "16px",
            background: "rgba(10,10,10,0.88)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1.5px solid rgba(212,175,55,0.35)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.90), 0 0 0 1px rgba(212,175,55,0.10), 0 0 20px rgba(212,175,55,0.08)",
            paddingLeft: "16px",
            paddingRight: "12px",
          }}
        >
          {/* Gold top edge line inside the bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.30) 30%, rgba(212,175,55,0.40) 50%, rgba(212,175,55,0.30) 70%, transparent 100%)",
            }}
          />

          {/* Left — FILMMAKER.OG wordmark */}
          <button
            onClick={() => { haptics.light(); navigate("/"); }}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group flex-shrink-0"
            aria-label="Go home"
          >
            <span className="font-bebas text-[22px] tracking-[0.2em] group-hover:opacity-80 transition-opacity duration-200"
              style={{ color: GOLD_FULL }}
            >
              FILMMAKER
              <span style={{ color: "rgba(255,255,255,0.90)" }}>
                .OG
              </span>
            </span>
          </button>

          {/* Right — kebab menu */}
          <button
            onClick={() => { haptics.light(); onMoreOpen?.(); }}
            className="flex items-center justify-center transition-all duration-200 active:scale-95 flex-shrink-0"
            aria-label="More options"
            style={{
              width: "40px",
              height: "40px",
            }}
          >
            <MoreVertical
              className="w-5 h-5"
              style={{ color: GOLD_FULL }}
            />
          </button>
        </nav>
      </header>

      {/* Spacer for fixed header — accounts for margin-top + bar height */}
      <div style={{ height: "calc(var(--appbar-h) + 12px)" }} className="flex-shrink-0" />
    </>
  );
};

export default AppHeader;
