import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import filmmakerFIcon from "@/assets/filmmaker-f-icon.png";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   AppHeader — search-bar style AI entry point
   Left:   F brand icon (→ home)
   Center: "Ask the OG..." placeholder (tap → opens bot)
   Right:  Sparkles icon (tap → opens bot)
   
   Inspired by Messenger/Perplexity search bar pattern.
   Not a real input — entire bar is a bot trigger.
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
        <div
          className="flex items-center gap-2.5"
          style={{
            pointerEvents: "auto",
            width: "100%",
            maxWidth: "360px",
            marginTop: "12px",
            paddingLeft: "12px",
            paddingRight: "12px",
          }}
        >
          {/* F icon — home button */}
          <button
            onClick={() => { haptics.light(); navigate("/"); }}
            className="flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
            aria-label="Go home"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              background: "rgba(10,10,10,0.88)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1.5px solid rgba(212,175,55,0.50)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.70), 0 0 0 1px rgba(212,175,55,0.08)",
            }}
          >
            <img
              src={filmmakerFIcon}
              alt="Filmmaker.OG"
              className="w-6 h-6 object-contain"
              style={{ filter: "brightness(1.2) saturate(1.1)" }}
            />
          </button>

          {/* Search bar — bot trigger */}
          <button
            onClick={() => { haptics.light(); onBotOpen?.(); }}
            className="flex-1 flex items-center gap-3 active:scale-[0.98] transition-transform"
            aria-label="Ask the OG Bot"
            style={{
              height: "44px",
              borderRadius: "14px",
              background: "rgba(10,10,10,0.88)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1.5px solid rgba(212,175,55,0.30)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.70), 0 0 0 1px rgba(212,175,55,0.06)",
              paddingLeft: "14px",
              paddingRight: "14px",
            }}
          >
            <span
              className="flex-1 text-left font-sans text-[14px] tracking-[0.02em]"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Ask the OG...
            </span>
            <Sparkles
              className="w-[16px] h-[16px] flex-shrink-0"
              strokeWidth={1.8}
              style={{
                color: "rgba(212,175,55,0.70)",
                filter: "drop-shadow(0 0 4px rgba(212,175,55,0.25))",
              }}
            />
          </button>
        </div>
      </header>

      {/* Spacer */}
      <div style={{ height: "calc(44px + 24px)" }} className="flex-shrink-0" />
    </>
  );
};

export default AppHeader;
