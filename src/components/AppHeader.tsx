import { Sparkles } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   AppHeader — floating pill
   Left:   FILMMAKER.OG wordmark (→ home via tab bar)
   Right:  OG bot trigger ("OG" badge + sparkle)
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
            maxWidth: "340px",
            height: "var(--appbar-h)",
            marginTop: "12px",
            borderRadius: "18px",
            background: "#000000",
            border: "1.5px solid rgba(212,175,55,0.55)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.95), 0 0 0 1px rgba(212,175,55,0.12), 0 0 16px rgba(212,175,55,0.08)",
            paddingLeft: "18px",
            paddingRight: "10px",
          }}
        >
          {/* Gold top edge line */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.40) 30%, rgba(212,175,55,0.55) 50%, rgba(212,175,55,0.40) 70%, transparent 100%)",
            }}
          />

          {/* Wordmark */}
          <span className="font-bebas text-[22px] tracking-[0.2em] text-gold select-none">
            FILMMAKER<span className="text-white">.OG</span>
          </span>

          {/* OG Bot trigger */}
          <button
            onClick={() => { haptics.light(); onBotOpen?.(); }}
            className="relative flex items-center gap-1.5 active:scale-95 transition-transform"
            aria-label="Ask the OG Bot"
            style={{
              height: "34px",
              paddingLeft: "10px",
              paddingRight: "10px",
              borderRadius: "10px",
              background: "rgba(212,175,55,0.08)",
              border: "1px solid rgba(212,175,55,0.30)",
            }}
          >
            <span
              className="font-bebas text-[15px] tracking-[0.12em] text-gold leading-none"
            >
              OG
            </span>
            <Sparkles
              className="w-3.5 h-3.5 text-gold"
              strokeWidth={2}
              style={{ filter: "drop-shadow(0 0 4px rgba(212,175,55,0.50))" }}
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
