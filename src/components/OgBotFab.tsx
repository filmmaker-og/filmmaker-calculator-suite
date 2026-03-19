import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   OgBotFab — floating action button for the OG bot
   Bottom-right corner. Hidden on /calculator (overlaps TabBar)
   and when closer section is in viewport on the landing page.
   ═══════════════════════════════════════════════════════════════════ */

interface OgBotFabProps {
  onTap?: () => void;
}

const OgBotFab = ({ onTap }: OgBotFabProps) => {
  const haptics = useHaptics();
  const location = useLocation();
  const [hiddenByCloser, setHiddenByCloser] = useState(false);

  // Hide on calculator — FAB overlaps TabBar
  const onCalculator = location.pathname.startsWith("/calculator");

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

  const hidden = onCalculator || hiddenByCloser;

  return (
    <button
      onClick={() => { haptics.medium(); onTap?.(); }}
      className="fixed z-[140] flex items-center justify-center active:scale-90 transition-all duration-300"
      style={{
        bottom: "calc(20px + env(safe-area-inset-bottom))",
        right: "20px",
        width: "52px",
        height: "52px",
        borderRadius: "10px",
        background: "linear-gradient(135deg, rgb(75,30,130) 0%, rgb(110,50,170) 100%)",
        border: "none",
        boxShadow: "0 4px 16px rgba(120,60,180,0.40), 0 0 40px rgba(120,60,180,0.15)",
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
      }}
      aria-label="Open OG assistant"
    >
      <Sparkles
        style={{
          width: "28px",
          height: "28px",
          color: "#D4AF37",
          filter: "drop-shadow(0 0 6px rgba(212,175,55,0.40))",
        }}
      />
    </button>
  );
};

export default OgBotFab;
