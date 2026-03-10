import React from "react";
import { AlertTriangle } from "lucide-react";

const s: Record<string, React.CSSProperties> = {
  container: {
    background: "#0A0A0A",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px",
    padding: "16px",
    marginTop: "32px",
  },
  inner: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },
  label: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: "10px",
    fontWeight: 500,
    textTransform: "uppercase" as const,
    letterSpacing: "0.15em",
    color: "rgba(255,255,255,0.40)",
    marginBottom: "6px",
  },
  body: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "12px",
    color: "rgba(255,255,255,0.40)",
    lineHeight: 1.6,
  },
};

const DisclaimerFooter = () => {
  return (
    <div style={s.container}>
      <div style={s.inner}>
        <AlertTriangle
          style={{
            width: "16px",
            height: "16px",
            color: "rgba(212,175,55,0.40)",
            flexShrink: 0,
            marginTop: "2px",
          }}
        />
        <div>
          <p style={s.label}>Educational model only</p>
          <p style={s.body}>
            Not financial, legal, or investment advice. Consult qualified entertainment
            counsel and financial advisor before making deal decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerFooter;
