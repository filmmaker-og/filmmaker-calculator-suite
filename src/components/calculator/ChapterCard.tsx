import React, { ReactNode } from "react";

interface ChapterCardProps {
  chapter: string;  // "00", "01", etc.
  title: string;
  isActive?: boolean;
  children: ReactNode;
  glossaryTrigger?: ReactNode;
  className?: string;
}

const s: Record<string, React.CSSProperties> = {
  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  eyebrowLine: {
    flex: 1,
    height: "1px",
    background: "rgba(212,175,55,0.40)",
  },
  eyebrowLabel: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "#D4AF37",
    whiteSpace: "nowrap" as const,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  eyebrowNum: {
    opacity: 0.70,
  },
  card: {
    background: "#0A0A0A",
    border: "1px solid rgba(212,175,55,0.20)",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
    transition: "border-color 0.25s ease",
  },
  cardActive: {
    background: "#0A0A0A",
    border: "1px solid rgba(212,175,55,0.35)",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 24px 50px rgba(0,0,0,0.8)",
    transition: "border-color 0.25s ease",
  },
  cardTopLine: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.40), transparent)",
    pointerEvents: "none" as const,
  },
  cardTopLineActive: {
    height: "2px",
    background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.60), transparent)",
    pointerEvents: "none" as const,
  },
  cardPad: {
    padding: "24px 20px",
  },
};

const ChapterCard = ({
  chapter,
  title,
  isActive = true,
  children,
  glossaryTrigger,
}: ChapterCardProps) => {
  return (
    <section>
      {/* Eyebrow-ruled opener */}
      <div style={s.eyebrow}>
        <div style={s.eyebrowLine} />
        <span style={s.eyebrowLabel}>
          <span style={s.eyebrowNum}>{chapter}</span> · {title}
          {glossaryTrigger && <span>{glossaryTrigger}</span>}
        </span>
        <div style={s.eyebrowLine} />
      </div>

      {/* Card body — Store treatment */}
      <div style={isActive ? s.cardActive : s.card}>
        <div style={isActive ? s.cardTopLineActive : s.cardTopLine} />
        <div style={s.cardPad}>
          {children}
        </div>
      </div>
    </section>
  );
};

export default ChapterCard;
