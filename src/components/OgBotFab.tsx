import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import { gold, GOLD } from "@/lib/tokens";

/* ═══════════════════════════════════════════════════════════════════
   OgBotFab — floating action button for the OG bot
   Bottom-right corner. Repositioned above TabBar on /calculator.
   Hidden when closer section is in viewport on the landing page.
   ═══════════════════════════════════════════════════════════════════ */

interface OgBotFabProps {
  onTap?: () => void;
}

const OgBotFab = ({ onTap }: OgBotFabProps) => {
  const haptics = useHaptics();
  const location = useLocation();
  const [hiddenByCloser, setHiddenByCloser] = useState(false);

  useEffect(() => {
    const closer = document.querySelector('[data-section="closer"]');
    if (!closer) return;

    const obs = new IntersectionObserver(
      ([entry]) => setHiddenByCloser(entry.isIntersecting),
      { threshold: 0.3 },
    );
    obs.observe(closer);
    return () => obs.disconnect();
  }, []);

  const onCalculator = location.pathname.startsWith("/calculator");
  const hidden = hiddenByCloser;

  return (
    <button
      onClick={() => { haptics.medium(); onTap?.(); }}
      className="fixed z-[140] flex items-center justify-center active:scale-90 transition-all duration-300"
      style={{
        bottom: onCalculator ? "calc(90px + env(safe-area-inset-bottom))" : "calc(36px + env(safe-area-inset-bottom))",
        right: "24px",
        width: "52px",
        height: "52px",
        borderRadius: "8px",
        background: `linear-gradient(135deg, ${gold(0.25)} 0%, ${gold(0.15)} 100%)`,
        border: `1px solid ${gold(0.25)}`,
        boxShadow: `0 4px 16px ${gold(0.30)}, 0 0 40px ${gold(0.12)}`,
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
      }}
      aria-label="Open OG assistant"
    >
      <Sparkles
        size={28}
        color={GOLD}
        style={{ filter: `drop-shadow(0 0 6px ${gold(0.40)})` }}
      />
    </button>
  );
};

export default OgBotFab;
