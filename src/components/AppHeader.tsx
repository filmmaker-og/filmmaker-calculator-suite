import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   AppHeader
   Left:  FILMMAKER.OG wordmark → home
   Right: ⋮ three dots → MobileMenu
   Full-width. Solid #000. Gold bottom border.
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
        className="fixed top-0 left-0 right-0 z-[150]"
        style={{
          height: "var(--appbar-h)",
          background: "#000000",
          borderBottom: "1px solid rgba(212,175,55,0.25)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.80)",
        }}
      >
        <div
          className="flex items-center justify-between h-full"
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            paddingLeft: "16px",
            paddingRight: "8px",
          }}
        >
          <button
            onClick={() => { haptics.light(); navigate("/"); }}
            className="flex items-center hover:opacity-80 transition-opacity"
            aria-label="Go home"
          >
            <span className="font-bebas text-[24px] tracking-[0.2em] text-gold">
              FILMMAKER<span className="text-ink-body">.OG</span>
            </span>
          </button>

          <button
            onClick={() => { haptics.light(); onMoreOpen?.(); }}
            className="flex items-center justify-center w-10 h-10 active:scale-95 transition-transform"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5 text-gold-label" />
          </button>
        </div>
      </header>

      <div style={{ height: "var(--appbar-h)" }} className="flex-shrink-0" />
    </>
  );
};

export default AppHeader;
