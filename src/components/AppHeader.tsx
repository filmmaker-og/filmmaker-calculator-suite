import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import filmmakerFIcon from "@/assets/filmmaker-f-icon.png";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   AppHeader — unified global header pill
   Left:   F brand icon (→ home)
   Center: FILMMAKER.OG wordmark
   Right:  Sparkles AI icon (→ OgBot)
   
   Width matches BottomTabBar at 320px — bookend chrome system
   ═══════════════════════════════════════════════════════════════════ */
interface AppHeaderProps {
  onBotOpen?: () => void;
}

const AppHeader = ({ onBotOpen }: AppHeaderProps) => {
  const navigate = useNavigate();
  const haptics = useHaptics();

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[150] flex justify-center"
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        <nav
          className="relative flex items-center justify-between overflow-hidden bg-chrome-bg border-[1.5px] border-chrome-border backdrop-blur-[16px]"
          style={{
            pointerEvents: "auto",
            width: "100%",
            maxWidth: "320px",
            height: "var(--appbar-h)",
            marginTop: "12px",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.90), 0 0 0 1px rgba(212,175,55,0.10), 0 0 20px rgba(212,175,55,0.08)",
            paddingLeft: "12px",
            paddingRight: "12px",
          }}
        >
          {/* Gold top edge line */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.30) 30%, rgba(212,175,55,0.40) 50%, rgba(212,175,55,0.30) 70%, transparent 100%)",
            }}
          />

          {/* Left — F icon → home */}
          <button
            onClick={() => { haptics.light(); navigate("/"); }}
            className="flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity active:scale-95"
            aria-label="Go home"
            style={{ width: "36px", height: "36px" }}
          >
            <img
              src={filmmakerFIcon}
              alt="Filmmaker.OG"
              className="w-7 h-7 object-contain"
              style={{ filter: "brightness(1.2) saturate(1.1)" }}
            />
          </button>

          {/* Center — wordmark (decorative, not interactive) */}
          <span className="font-bebas text-[20px] tracking-[0.18em] text-gold select-none pointer-events-none">
            FILMMAKER
            <span className="text-ink-body">.OG</span>
          </span>

          {/* Right — Sparkles → open AI bot */}
          <button
            onClick={() => { haptics.light(); onBotOpen?.(); }}
            className="flex items-center justify-center flex-shrink-0 transition-all duration-200 active:scale-90"
            aria-label="Ask the OG Bot"
            style={{ width: "36px", height: "36px" }}
          >
            <Sparkles
              className="w-[18px] h-[18px] text-gold"
              strokeWidth={1.8}
              style={{ filter: "drop-shadow(0 0 6px rgba(212,175,55,0.40))" }}
            />
          </button>
        </nav>
      </header>

      {/* Spacer */}
      <div style={{ height: "calc(var(--appbar-h) + 12px)" }} className="flex-shrink-0" />
    </>
  );
};

export default AppHeader;
