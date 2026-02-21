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
        borderRadius: "50%",
        background: "transparent",
        border: "none",
        boxShadow: isActive
          ? "0 0 24px rgba(212,175,55,0.35), 0 4px 16px rgba(0,0,0,0.50)"
          : "0 4px 20px rgba(0,0,0,0.60)",
      }}
    >
      {/* Sparkle AI indicator — top right, overlapping icon edge */}
      <Sparkles
        className="absolute pointer-events-none"
        style={{
          top: "2px",
          right: "2px",
          width: "14px",
          height: "14px",
          color: isActive ? "rgba(249,224,118,0.90)" : "rgba(212,175,55,0.70)",
          filter: isActive ? "drop-shadow(0 0 4px rgba(212,175,55,0.50))" : "none",
        }}
        strokeWidth={2}
      />

      {/* F brand icon */}
      <img
        src={filmmakerFIcon}
        alt=""
        className="pointer-events-none"
        style={{
          width: "36px",
          height: "36px",
          objectFit: "contain",
          filter: "brightness(1.25) saturate(1.1) drop-shadow(0 0 10px rgba(212,175,55,0.40))",
        }}
      />
    </button>
  );
};

export default OgBotFab;
