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
        borderRadius: 0,
        background: isActive ? "rgba(212,175,55,1)" : "#0A0A0A",
        border: isActive
          ? "1.5px solid rgba(212,175,55,0.70)"
          : "1.5px solid rgba(212,175,55,0.50)",
        boxShadow: isActive
          ? "0 0 28px rgba(212,175,55,0.35), 0 4px 16px rgba(0,0,0,0.60)"
          : "0 0 22px rgba(212,175,55,0.18), 0 4px 16px rgba(0,0,0,0.60), inset 0 1px 0 rgba(212,175,55,0.08)",
      }}
    >
      {/* Corner accents — decorative notch marks */}
      <div className="absolute top-0 left-0 w-[6px] h-[1px] pointer-events-none"
        style={{ background: isActive ? "rgba(0,0,0,0.30)" : "rgba(212,175,55,0.50)" }} />
      <div className="absolute top-0 left-0 w-[1px] h-[6px] pointer-events-none"
        style={{ background: isActive ? "rgba(0,0,0,0.30)" : "rgba(212,175,55,0.50)" }} />
      <div className="absolute top-0 right-0 w-[6px] h-[1px] pointer-events-none"
        style={{ background: isActive ? "rgba(0,0,0,0.30)" : "rgba(212,175,55,0.50)" }} />
      <div className="absolute top-0 right-0 w-[1px] h-[6px] pointer-events-none"
        style={{ background: isActive ? "rgba(0,0,0,0.30)" : "rgba(212,175,55,0.50)" }} />
      <div className="absolute bottom-0 left-0 w-[6px] h-[1px] pointer-events-none"
        style={{ background: isActive ? "rgba(0,0,0,0.30)" : "rgba(212,175,55,0.50)" }} />
      <div className="absolute bottom-0 left-0 w-[1px] h-[6px] pointer-events-none"
        style={{ background: isActive ? "rgba(0,0,0,0.30)" : "rgba(212,175,55,0.50)" }} />
      <div className="absolute bottom-0 right-0 w-[6px] h-[1px] pointer-events-none"
        style={{ background: isActive ? "rgba(0,0,0,0.30)" : "rgba(212,175,55,0.50)" }} />
      <div className="absolute bottom-0 right-0 w-[1px] h-[6px] pointer-events-none"
        style={{ background: isActive ? "rgba(0,0,0,0.30)" : "rgba(212,175,55,0.50)" }} />

      {/* OG text */}
      <span
        className="font-bebas leading-none"
        style={{
          fontSize: "19px",
          letterSpacing: "0.14em",
          color: isActive ? "#000000" : "rgba(212,175,55,1)",
        }}
      >
        OG
      </span>
      {/* bot label */}
      <span
        className="font-mono uppercase leading-none"
        style={{
          fontSize: "8px",
          letterSpacing: "0.12em",
          color: isActive ? "rgba(0,0,0,0.60)" : "rgba(212,175,55,0.60)",
          marginTop: "1px",
        }}
      >
        bot
      </span>
    </button>
  );
};

export default OgBotFab;
