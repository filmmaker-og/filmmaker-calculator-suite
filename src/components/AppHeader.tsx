import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   AppHeader — unified global header for all pages
   Uses chrome-* design tokens for consistent architectural gold
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
        {/* Floating centered bar */}
        <nav
          className="relative flex items-center justify-between overflow-hidden bg-chrome-bg border-[1.5px] border-chrome-border backdrop-blur-[16px]"
          style={{
            pointerEvents: "auto",
            width: "100%",
            maxWidth: "300px",
            height: "var(--appbar-h)",
            marginTop: "12px",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.90), 0 0 0 1px rgba(212,175,55,0.10), 0 0 20px rgba(212,175,55,0.08)",
            paddingLeft: "16px",
            paddingRight: "12px",
          }}
        >
          {/* Gold top edge line — gradient peaks at chrome-glow */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none bg-gradient-to-r from-transparent via-chrome-glow to-transparent"
          />

          {/* Left — FILMMAKER.OG wordmark */}
          <button
            onClick={() => { haptics.light(); navigate("/"); }}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group flex-shrink-0"
            aria-label="Go home"
          >
            <span className="font-bebas text-[22px] tracking-[0.2em] text-gold group-hover:opacity-80 transition-opacity duration-200">
              FILMMAKER
              <span className="text-ink-body">.OG</span>
            </span>
          </button>

          {/* Right — kebab menu */}
          <button
            onClick={() => { haptics.light(); onMoreOpen?.(); }}
            className="flex items-center justify-center transition-all duration-200 active:scale-95 flex-shrink-0 w-10 h-10"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5 text-gold" />
          </button>
        </nav>
      </header>

      {/* Spacer for fixed header — accounts for margin-top + bar height */}
      <div style={{ height: "calc(var(--appbar-h) + 12px)" }} className="flex-shrink-0" />
    </>
  );
};

export default AppHeader;
