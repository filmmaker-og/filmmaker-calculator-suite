import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   AppHeader — floating pill
   Left:  FILMMAKER.OG → home
   Right: ⋮ kebab → MobileMenu
   320px centered pill, 8px radius, solid black, gold border
   ═══════════════════════════════════════════════════════════════════ */
interface AppHeaderProps {
  onMoreOpen?: () => void;
}

const AppHeader = ({ onMoreOpen }: AppHeaderProps) => {
  const navigate = useNavigate();
  const haptics = useHaptics();

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[150] flex justify-center"
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        <nav
          className="relative flex items-center justify-between overflow-hidden"
          style={{
            pointerEvents: "auto",
            width: "100%",
            maxWidth: "320px",
            height: "54px",
            marginTop: "max(12px, env(safe-area-inset-top, 12px))",
            borderRadius: "8px",
            background: "#000000",
            border: "1px solid rgba(212,175,55,0.25)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.95)",
            paddingLeft: "16px",
            paddingRight: "10px",
          }}
        >
          <button
            onClick={() => { haptics.light(); navigate("/"); }}
            className="flex items-center hover:opacity-80 transition-opacity"
            aria-label="Go home"
          >
            <span className="font-bebas text-[22px] tracking-[0.2em] text-gold">
              FILMMAKER<span className="text-ink-body">.OG</span>
            </span>
          </button>

          <button
            onClick={() => { haptics.light(); onMoreOpen?.(); }}
            className="flex items-center justify-center w-10 h-10 active:scale-95 transition-transform"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5 text-gold" />
          </button>
        </nav>
      </header>

      <div style={{ height: "calc(54px + max(24px, env(safe-area-inset-top, 24px)))" }} className="flex-shrink-0" />
    </>
  );
};

export default AppHeader;
