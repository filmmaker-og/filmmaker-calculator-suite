import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import filmmakerFIcon from "@/assets/filmmaker-f-icon.png";
import { Sparkles } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   AppHeader — full-width institutional header
   Left:   FILMMAKER.OG wordmark (→ home)
   Right:  OG Bot trigger (F icon + sparkle badge)  |  kebab menu
   
   No pill. No glass. Solid black. Brand-first.
   ═══════════════════════════════════════════════════════════════════ */
interface AppHeaderProps {
  onBotOpen?: () => void;
  onMoreOpen?: () => void;
}

const AppHeader = ({ onBotOpen, onMoreOpen }: AppHeaderProps) => {
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
          {/* Left — wordmark → home */}
          <button
            onClick={() => { haptics.light(); navigate("/"); }}
            className="flex items-center hover:opacity-80 transition-opacity"
            aria-label="Go home"
          >
            <span className="font-bebas text-[24px] tracking-[0.2em] text-gold">
              FILMMAKER<span className="text-ink-body">.OG</span>
            </span>
          </button>

          {/* Right — bot trigger + menu */}
          <div className="flex items-center gap-1">
            {/* OG Bot trigger */}
            <button
              onClick={() => { haptics.light(); onBotOpen?.(); }}
              className="relative flex items-center justify-center w-10 h-10 active:scale-90 transition-transform"
              aria-label="Ask the OG Bot"
            >
              <img
                src={filmmakerFIcon}
                alt=""
                className="w-6 h-6 object-contain"
                style={{ filter: "brightness(1.15) saturate(1.1)" }}
              />
              <Sparkles
                className="absolute -top-0.5 -right-0.5 w-3 h-3 text-gold"
                strokeWidth={2}
                style={{ filter: "drop-shadow(0 0 3px rgba(212,175,55,0.50))" }}
              />
            </button>

            {/* Kebab menu */}
            <button
              onClick={() => { haptics.light(); onMoreOpen?.(); }}
              className="flex items-center justify-center w-10 h-10 active:scale-95 transition-transform"
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5 text-gold-label" />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div style={{ height: "var(--appbar-h)" }} className="flex-shrink-0" />
    </>
  );
};

export default AppHeader;
