import { Sparkles } from "lucide-react";
import filmmakerFIcon from "@/assets/filmmaker-f-icon.png";

interface OgBotFabProps {
  onClick: () => void;
  isActive?: boolean;
}

const OgBotFab = ({ onClick, isActive }: OgBotFabProps) => {
  return (
    <button
      onClick={onClick}
      aria-label="Ask the OG Bot"
      className="fixed z-[145] flex items-center justify-center transition-all duration-200 active:scale-90"
      style={{
        bottom: "calc(78px + env(safe-area-inset-bottom))",
        right: "16px",
        width: "56px",
        height: "56px",
        borderRadius: "16px",
        background: isActive
          ? "linear-gradient(135deg, #D4AF37 0%, #F9E076 100%)"
          : "linear-gradient(135deg, #0A0A0A 0%, #111111 100%)",
        border: isActive
          ? "1.5px solid rgba(249,224,118,0.70)"
          : "1.5px solid rgba(212,175,55,0.50)",
        boxShadow: isActive
          ? "0 0 28px rgba(212,175,55,0.40), 0 4px 16px rgba(0,0,0,0.60)"
          : "0 0 20px rgba(212,175,55,0.15), 0 4px 16px rgba(0,0,0,0.60)",
      }}
    >
      {/* Sparkle AI indicator — top right corner */}
      <Sparkles
        className="absolute pointer-events-none"
        style={{
          top: "5px",
          right: "5px",
          width: "12px",
          height: "12px",
          color: isActive ? "rgba(0,0,0,0.40)" : "rgba(212,175,55,0.65)",
        }}
        strokeWidth={2}
      />

      {/* F brand icon */}
      <img
        src={filmmakerFIcon}
        alt=""
        className="pointer-events-none"
        style={{
          width: "32px",
          height: "32px",
          objectFit: "contain",
          filter: isActive
            ? "brightness(0.3)"
            : "brightness(1.25) saturate(1.1)",
        }}
      />
    </button>
  );
};

export default OgBotFab;
