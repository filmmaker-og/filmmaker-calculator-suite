import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   AppHeader — floating pill
   Left:   FILMMAKER.OG wordmark (tap → home)
   Right:  Kebab (→ MobileMenu)
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

          {/* Wordmark → home */}
          <button
            onClick={() => { haptics.light(); navigate("/"); }}
            className="flex items-center hover:opacity-80 active:scale-[0.97] transition-all"
            aria-label="Go home"
          >
            <span className="font-bebas text-[22px] tracking-[0.2em] text-gold">
              FILMMAKER<span className="text-white">.OG</span>
            </span>
          </button>

          {/* Kebab → menu */}
          <button
            onClick={() => { haptics.light(); onMoreOpen?.(); }}
            className="flex items-center justify-center w-10 h-10 active:scale-95 transition-transform"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5 text-gold" />
          </button>
        </nav>
      </header>

      {/* Spacer */}
      <div style={{ height: "calc(var(--appbar-h) + 12px)" }} className="flex-shrink-0" />
    </>
  );
};

export default AppHeader;
