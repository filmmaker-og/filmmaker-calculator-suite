import { ReactNode, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

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
  onMoreOpen?: () => void;
}

const GOLD_FULL = "rgba(212,175,55,1)";
const GOLD_DIM  = "rgba(212,175,55,0.65)";

const AppHeader = ({ onMoreOpen }: AppHeaderProps) => {
  const navigate = useNavigate();
  const { ctaSlot } = useHeaderCta();
  const haptics = useHaptics();

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[150]"
        style={{
          background: "rgba(10,10,10,0.88)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Subtle top gold edge — bookends with footer */}
        <div
          className="h-[1px] w-full"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.20) 30%, rgba(212,175,55,0.20) 70%, transparent 100%)",
          }}
        />

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

          {/* Right — vertical ⋮ menu */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={() => { haptics.light(); onMoreOpen?.(); }}
              className="w-10 h-10 flex items-center justify-center transition-all duration-200 active:scale-90 hover:opacity-80"
              aria-label="More options"
              style={{ color: GOLD_DIM }}
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gold gradient separator line — enhanced to match footer presence */}
        <div
          className="h-[1px] w-full"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.55) 30%, rgba(212,175,55,0.55) 70%, transparent 100%)",
            boxShadow: "0 1px 12px rgba(212,175,55,0.08)",
          }}
        />
      </header>

      {/* Spacer for fixed header */}
      <div style={{ height: "var(--appbar-h)" }} className="flex-shrink-0" />
    </>
  );
};

export default AppHeader;
