import { ReactNode, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   HeaderCtaContext — lets Index.tsx inject a sticky CTA into the
   header's center slot without prop-drilling through the router.
   ═══════════════════════════════════════════════════════════════════ */
interface HeaderCtaContextType {
  ctaSlot: ReactNode;
  setCtaSlot: (node: ReactNode) => void;
}

export const HeaderCtaContext = createContext<HeaderCtaContextType>({
  ctaSlot: null,
  setCtaSlot: () => {},
});

export const useHeaderCta = () => useContext(HeaderCtaContext);

/* ═══════════════════════════════════════════════════════════════════
   AppHeader — unified global header for all pages
   Left:   FILMMAKER.OG (→ home)
   Center: conditional CTA slot (only on landing page, injected via context)
   Right:  F-icon bot button + vertical ⋮ menu button
   ═══════════════════════════════════════════════════════════════════ */
interface AppHeaderProps {
  onBotOpen?: () => void;
  isBotOpen?: boolean;
  onMoreOpen?: () => void;
}

const GOLD_FULL = "rgba(212,175,55,1)";
const GOLD_DIM  = "rgba(212,175,55,0.65)";

const AppHeader = ({ onBotOpen, isBotOpen, onMoreOpen }: AppHeaderProps) => {
  const navigate = useNavigate();
  const { ctaSlot } = useHeaderCta();

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[150]"
        style={{ background: "var(--bg-header)" }}
      >
        <div
          className="flex items-center justify-between px-4"
          style={{ height: "var(--appbar-h)" }}
        >
          {/* Left — FILMMAKER.OG wordmark */}
          <button
            onClick={() => navigate("/")}
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

          {/* Center — optional sticky CTA (landing page only) */}
          {ctaSlot && (
            <div className="flex-1 flex justify-center px-3 overflow-hidden">
              {ctaSlot}
            </div>
          )}

          {/* Right — Bot icon + vertical ⋮ */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* OG Bot button */}
            <button
              onClick={onBotOpen}
              className="relative w-10 h-10 flex flex-col items-center justify-center transition-all duration-200 active:scale-90"
              aria-label="Ask the OG Bot"
            >
              <span
                className="font-bebas leading-none transition-opacity duration-200"
                style={{
                  fontSize: "15px",
                  letterSpacing: "0.14em",
                  color: isBotOpen ? GOLD_FULL : GOLD_DIM,
                }}
              >
                OG
              </span>
              <span
                className="font-mono uppercase leading-none transition-opacity duration-200"
                style={{
                  fontSize: "8px",
                  letterSpacing: "0.10em",
                  color: isBotOpen ? GOLD_FULL : "rgba(212,175,55,0.45)",
                }}
              >
                bot
              </span>
              {/* Active glow ring */}
              {isBotOpen && (
                <span
                  className="absolute inset-0 rounded-md pointer-events-none"
                  style={{
                    background: "rgba(212,175,55,0.08)",
                    border: "1px solid rgba(212,175,55,0.25)",
                  }}
                />
              )}
            </button>

            {/* Vertical ⋮ menu button */}
            <button
              onClick={onMoreOpen}
              className="w-10 h-10 flex items-center justify-center transition-all duration-200 active:scale-90 hover:opacity-80"
              aria-label="More options"
              style={{ color: GOLD_DIM }}
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gold gradient separator line */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
      </header>

      {/* Spacer for fixed header */}
      <div style={{ height: "var(--appbar-h)" }} className="flex-shrink-0" />
    </>
  );
};

export default AppHeader;
