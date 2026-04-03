import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

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
      className="fixed z-[140] flex items-center justify-center active:scale-[0.97] transition-all duration-300"
      style={{
        bottom: onCalculator ? "calc(90px + env(safe-area-inset-bottom))" : "calc(36px + env(safe-area-inset-bottom))",
        right: "24px",
        width: "52px",
        height: "52px",
        borderRadius: "10px",
        background: "#F9E076",
        border: "none",
        boxShadow: "0 0 20px rgba(249,224,118,0.25), 0 4px 16px rgba(0,0,0,0.40)",
        animation: "cta-glow-pulse 4s ease-in-out infinite",
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
      }}
      aria-label="Open OG assistant"
    >
      <Sparkles
        style={{
          width: "28px",
          height: "28px",
          color: "#000",
        }}
      />
    </button>
  );
};

export default OgBotFab;
