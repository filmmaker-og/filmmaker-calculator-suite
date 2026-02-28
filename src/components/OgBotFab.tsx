import { Sparkles } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

/* ═══════════════════════════════════════════════════════════════════
   OgBotFab — floating action button for the OG bot
   Bottom-right corner, always visible, opens the bot sheet.
   ═══════════════════════════════════════════════════════════════════ */

interface OgBotFabProps {
  onTap?: () => void;
}

const OgBotFab = ({ onTap }: OgBotFabProps) => {
  const haptics = useHaptics();

  return (
    <button
      onClick={() => { haptics.medium(); onTap?.(); }}
      className="fixed z-[140] flex items-center justify-center active:scale-90 transition-transform"
      style={{
        bottom: "calc(20px + env(safe-area-inset-bottom))",
        right: "20px",
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        background: "#000000",
        border: "1.5px solid rgba(255,255,255,0.12)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.80)",
      }}
      aria-label="Open OG assistant"
    >
      <Sparkles
        className="text-gold"
        style={{
          width: "22px",
          height: "22px",
          filter: "drop-shadow(0 0 4px rgba(212,175,55,0.30))",
        }}
      />
    </button>
  );
};

export default OgBotFab;
