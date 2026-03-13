import React from "react";

interface ContextBarProps {
  budget: number;
  acqPrice?: number;
  stackCount?: number;
  genre?: string;
}

const formatShort = (n: number): string => {
  const a = Math.abs(n);
  if (a >= 1e6) return '$' + (a / 1e6).toFixed(a % 1e6 === 0 ? 0 : 1) + 'M';
  if (a >= 1e3) return '$' + (a / 1e3).toFixed(0) + 'K';
  return '$' + a;
};

const s: Record<string, React.CSSProperties> = {
  bar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "10px 16px",
    marginBottom: "16px",
    background: "rgba(212,175,55,0.03)",
    border: "1px solid rgba(212,175,55,0.10)",
    borderRadius: "8px",
    flexWrap: "wrap",
  },
  lbl: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "10px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "rgba(212,175,55,0.40)",
  },
  val: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "11px",
    color: "rgba(255,255,255,0.75)",
  },
  dot: {
    width: "3px",
    height: "3px",
    borderRadius: "50%",
    background: "rgba(212,175,55,0.30)",
  },
};

const ContextBar = ({ budget, acqPrice, stackCount, genre }: ContextBarProps) => {
  const items: React.ReactNode[] = [];

  if (budget > 0) {
    items.push(
      <React.Fragment key="budget">
        <span style={s.lbl}>Budget</span>
        <span style={s.val}>{formatShort(budget)}</span>
      </React.Fragment>
    );
  }

  if (acqPrice && acqPrice > 0) {
    items.push(
      <React.Fragment key="acq">
        <span style={s.dot} />
        <span style={s.lbl}>Acq</span>
        <span style={s.val}>{formatShort(acqPrice)}</span>
      </React.Fragment>
    );
  }

  if (stackCount && stackCount > 0) {
    items.push(
      <React.Fragment key="stack">
        <span style={s.dot} />
        <span style={s.val}>{stackCount} sources</span>
      </React.Fragment>
    );
  }

  if (genre) {
    items.push(
      <React.Fragment key="genre">
        <span style={s.dot} />
        <span style={s.val}>{genre}</span>
      </React.Fragment>
    );
  }

  if (items.length === 0) return null;

  return <div style={s.bar}>{items}</div>;
};

export default ContextBar;
