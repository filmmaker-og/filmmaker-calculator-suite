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
        width: "48px",
        height: "48px",
        borderRadius: 0,
        background: isActive ? "rgba(212,175,55,1)" : "#0A0A0A",
        border: isActive
          ? "1.5px solid rgba(212,175,55,0.70)"
          : "1.5px solid rgba(212,175,55,0.45)",
        boxShadow: isActive
          ? "0 0 24px rgba(212,175,55,0.30), 0 4px 16px rgba(0,0,0,0.60)"
          : "0 0 20px rgba(212,175,55,0.15), 0 4px 16px rgba(0,0,0,0.60)",
      }}
    >
      <span
        className="font-bebas leading-none"
        style={{
          fontSize: "18px",
          letterSpacing: "0.14em",
          color: isActive ? "#000000" : "rgba(212,175,55,1)",
        }}
      >
        OG
      </span>
    </button>
  );
};

export default OgBotFab;
