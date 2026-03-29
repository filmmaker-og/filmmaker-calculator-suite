import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   AppHeader — floating bar (matches max-w-xl card column)
   Left:  FILMMAKER.OG → home
   Right: ⋮ kebab → MobileMenu
   576px max, full-round pill, glassmorphic, gold border
   ═══════════════════════════════════════════════════════════════════ */
interface AppHeaderProps {
  onMoreOpen?: () => void;
}

const AppHeader = ({ onMoreOpen }: AppHeaderProps) => {
  const navigate = useNavigate();
  const haptics = useHaptics();

  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handler = () => {
      const currentY = window.scrollY;
      if (currentY > 80 && currentY > lastScrollY.current) {
        setHeaderHidden(true);
      } else {
        setHeaderHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => {
      window.removeEventListener('scroll', handler);
    };
  }, []);

  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const onFocus = () => setSearchFocused(true);
    const onBlur = () => setSearchFocused(false);
    window.addEventListener('vault-search-focus', onFocus);
    window.addEventListener('vault-search-blur', onBlur);
    return () => {
      window.removeEventListener('vault-search-focus', onFocus);
      window.removeEventListener('vault-search-blur', onBlur);
    };
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[150] flex justify-center"
        style={{
          background: "transparent",
          pointerEvents: "none",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: (headerHidden || searchFocused) ? "translateY(-150%)" : "translateY(0)",
        }}
      >
        <nav
          className="relative flex items-center justify-between overflow-hidden"
          style={{
            pointerEvents: "auto",
            width: "100%",
            maxWidth: "min(460px, calc(100vw - 48px))",
            height: "54px",
            marginTop: "max(12px, env(safe-area-inset-top, 12px))",
            marginLeft: "24px",
            marginRight: "24px",
            borderRadius: "12px",
            background: "rgba(26,26,28,0.90)",
            border: "1px solid rgba(212,175,55,0.25)",
            boxShadow: "0 2px 24px rgba(0,0,0,0.8), 0 0 12px rgba(212,175,55,0.06)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            paddingLeft: "20px",
            paddingRight: "12px",
          }}
        >
          <button
            onClick={() => { haptics.light(); navigate("/"); }}
            className="flex items-center hover:opacity-80 transition-opacity"
            aria-label="Go home"
          >
            <span className="font-bebas text-[28px] tracking-[0.14em] text-gold-full leading-none">
              FILMMAKER<span className="text-white">.OG</span>
            </span>
          </button>

          <button
            onClick={() => { haptics.light(); onMoreOpen?.(); }}
            className="flex items-center justify-center w-10 h-10 active:scale-95 transition-transform"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5 text-gold-full" />
          </button>
        </nav>
      </header>

      <div style={{ height: "calc(54px + max(24px, env(safe-area-inset-top, 24px)))" }} className="flex-shrink-0" />
    </>
  );
};

export default AppHeader;
