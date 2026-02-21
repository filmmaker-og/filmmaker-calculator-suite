import { ReactNode, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   HeaderCtaContext — allows any page to inject a CTA into the header
   ═══════════════════════════════════════════════════════════════════ */
interface HeaderCtaContextType {
  ctaSlot: ReactNode;
  setCtaSlot: (node: ReactNode) => void;
}

export const HeaderCtaContext = createContext<HeaderCtaContextType>({ ctaSlot: null, setCtaSlot: () => {} });
export const useHeaderCta = () => useContext(HeaderCtaContext);

/* ═══════════════════════════════════════════════════════════════════
   AppHeader — unified global header for all pages
   Left:   FILMMAKER.OG (→ home)
   Center: optional CTA slot
   Right:  kebab menu (→ MobileMenu)
   ═══════════════════════════════════════════════════════════════════ */
interface AppHeaderProps {
  onMoreOpen?: () => void;
}

const GOLD_FULL = "rgba(212,175,55,1)";

const AppHeader = ({ onMoreOpen }: AppHeaderProps) => {
  const navigate = useNavigate();
  const haptics = useHaptics();
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
            onClick={() => { haptics.light(); navigate("/"); }}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group flex-shrink-0"
            aria-label="Go home"
          >
            <span
              className="font-bebas text-[22px] tracking-[0.2em] group-hover:opacity-80 transition-opacity duration-200"
              style={{ color: GOLD_FULL }}
            >
              FILMMAKER
              <span style={{ color: "rgba(255,255,255,0.90)" }}>
                .OG
              </span>
            </span>
          </button>

          {/* Center — optional CTA slot */}
          {ctaSlot && (
            <div className="flex-1 flex justify-center px-3 overflow-hidden">
              {ctaSlot}
            </div>
          )}

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
              style={{ color: "rgba(212,175,55,0.65)" }}
            />
          </button>
        </div>

        {/* Gold line separator */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
      </header>

      {/* Spacer for fixed header */}
      <div style={{ height: "var(--appbar-h)" }} className="flex-shrink-0" />
    </>
  );
};

export default AppHeader;
