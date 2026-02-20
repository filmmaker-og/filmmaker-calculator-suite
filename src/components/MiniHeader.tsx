import { useNavigate } from "react-router-dom";
import filmmakerFIcon from "@/assets/filmmaker-f-icon.png";

/* ─── MiniHeader — centered glowing F icon for all inner pages ─── */
const MiniHeader = () => {
  const navigate = useNavigate();

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[150] flex items-center justify-center"
      style={{ height: "var(--appbar-h)" }}
    >
      {/* Ambient radial glow behind the icon */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 90% at 50% 50%, rgba(212,175,55,0.18) 0%, transparent 70%)",
        }}
      />
      {/* Gold separator at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.30) 20%, rgba(212,175,55,0.50) 50%, rgba(212,175,55,0.30) 80%, transparent 100%)",
        }}
      />
      <button
        onClick={() => navigate("/")}
        className="relative z-10 flex items-center justify-center w-10 h-10 hover:opacity-80 transition-opacity active:scale-95"
        aria-label="Go home"
        style={{ background: "var(--bg-header)" }}
      >
        <img
          src={filmmakerFIcon}
          alt="FILMMAKER.OG"
          className="w-7 h-7 object-contain"
          style={{ filter: "drop-shadow(0 0 8px rgba(212,175,55,0.60)) brightness(1.1)" }}
        />
      </button>
    </div>
  );
};

export default MiniHeader;
