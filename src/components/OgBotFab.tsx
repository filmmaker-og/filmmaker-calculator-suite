import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   OgBotFab — floating action button for the OG bot
   Bottom-right corner, hides when closer section is in viewport
   to avoid overlapping the conversion CTA.
   ═══════════════════════════════════════════════════════════════════ */

interface OgBotFabProps {
  onTap?: () => void;
}

const OgBotFab = ({ onTap }: OgBotFabProps) => {
  const haptics = useHaptics();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const closer = document.querySelector('[data-section="closer"]');
    if (!closer) return;

    const obs = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.3 },
    );
    obs.observe(closer);
    return () => obs.disconnect();
  }, []);

  return (
    <button
      onClick={() => { haptics.medium(); onTap?.(); }}
      className="fixed z-[140] flex items-center justify-center active:scale-90 transition-all duration-300"
      style={{
        bottom: "calc(20px + env(safe-area-inset-bottom))",
        right: "20px",
        width: "44px",
        height: "44px",
        borderRadius: "8px",
        background: "#000000",
        border: "1px solid rgba(212,175,55,0.15)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.80)",
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
      }}
      aria-label="Open OG assistant"
    >
      <Sparkles
        className="text-gold"
        style={{
          width: "26px",
          height: "26px",
          filter: "drop-shadow(0 0 4px rgba(212,175,55,0.25))",
        }}
      />
    </button>
  );
};

export default OgBotFab;
