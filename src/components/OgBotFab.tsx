import { Sparkles } from "lucide-react";

interface OgBotFabProps {
  onClick: () => void;
  isActive?: boolean;
}

const OgBotFab = ({ onClick, isActive }: OgBotFabProps) => {
  return (
    <button
      onClick={onClick}
      aria-label="Ask the OG Bot"
      className="fixed z-[145] flex flex-col items-center justify-center transition-all duration-200 active:scale-90"
      style={{
        bottom: "calc(78px + env(safe-area-inset-bottom))",
        right: "16px",
        width: "52px",
        height: "52px",
        borderRadius: "14px",
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
      {/* Inner atmosphere — subtle gold light source */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "13px",
          background: isActive
            ? "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)"
            : "radial-gradient(circle at 30% 30%, rgba(212,175,55,0.12) 0%, transparent 60%)",
        }}
      />

      {/* Inner border ring — lens/bezel depth */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "3px",
          borderRadius: "11px",
          border: isActive
            ? "1px solid rgba(0,0,0,0.12)"
            : "1px solid rgba(212,175,55,0.15)",
        }}
      />

      {/* Sparkle accent — inside top-right */}
      <Sparkles
        className="absolute pointer-events-none"
        style={{
          top: "6px",
          right: "6px",
          width: "11px",
          height: "11px",
          color: "rgba(212,175,55,0.60)",
        }}
        strokeWidth={2}
      />

      {/* OG text */}
      <span
        className="relative font-bebas leading-none"
        style={{
          fontSize: "22px",
          letterSpacing: "0.16em",
          color: isActive ? "#000000" : "rgba(212,175,55,1)",
        }}
      >
        OG
      </span>
    </button>
  );
};

export default OgBotFab;
