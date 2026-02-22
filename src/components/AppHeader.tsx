import { Sparkles } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   AppHeader — minimal branded pill
   Left:   FILMMAKER.OG wordmark
   Right:  Sparkles → opens OgBot
   ═══════════════════════════════════════════════════════════════════ */
interface AppHeaderProps {
  onBotOpen?: () => void;
}

const AppHeader = ({ onBotOpen }: AppHeaderProps) => {
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
            maxWidth: "280px",
            height: "var(--appbar-h)",
            marginTop: "12px",
            borderRadius: "16px",
            background: "rgba(10,10,10,0.88)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1.5px solid rgba(212,175,55,0.50)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.90), 0 0 0 1px rgba(212,175,55,0.10), 0 0 20px rgba(212,175,55,0.08)",
            paddingLeft: "16px",
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

          {/* Wordmark */}
          <span className="font-bebas text-[22px] tracking-[0.2em] text-gold select-none">
            FILMMAKER<span className="text-ink-body">.OG</span>
          </span>

          {/* Sparkles → bot */}
          <button
            onClick={() => { haptics.light(); onBotOpen?.(); }}
            className="flex items-center justify-center flex-shrink-0 transition-all duration-200 active:scale-90 w-10 h-10"
            aria-label="Ask the OG Bot"
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
