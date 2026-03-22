import React, { ReactNode } from "react";

export type CardVariant = 'warm' | 'feature' | 'data' | 'neutral';

interface ChapterCardProps {
  chapter: string;  // "00", "01", etc.
  title: string;
  isActive?: boolean;
  children: ReactNode;
  glossaryTrigger?: ReactNode;
  className?: string;
  variant?: CardVariant;
  /** For warm cards: controls breathing animation */
  breathing?: boolean;
  /** For warm cards: triggers completion pulse */
  pulsing?: boolean;
  /** For feature cards: 'positive' | 'negative' | null for state-dependent glow */
  glowState?: 'positive' | 'negative' | null;
  /** Render card body without padding (for custom layouts) */
  noPad?: boolean;
  /** Hide the eyebrow header */
  hideEyebrow?: boolean;
}

const eyebrowS: Record<string, React.CSSProperties> = {
  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "0 -24px 16px",
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
    padding: "0 4px",
  },
  eyebrowNum: {
    opacity: 0.70,
  },
};

/* ── Card variant styles ── */

const cardStyles: Record<CardVariant, React.CSSProperties> = {
  warm: {
    background: "#0A0A0A",
    border: "1px solid rgba(212,175,55,0.35)",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 24px 50px rgba(0,0,0,0.8), inset 0 1px 0 rgba(212,175,55,0.10)",
    position: "relative",
  },
  feature: {
    background: "#0A0A0A",
    border: "1px solid rgba(212,175,55,0.25)",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
    transition: "box-shadow 0.5s",
    position: "relative",
  },
  data: {
    background: "#0A0A0A",
    border: "1px solid rgba(212,175,55,0.20)",
    borderRadius: "12px",
    overflow: "hidden",
    position: "relative",
  },
  neutral: {
    background: "#0A0A0A",
    border: "1px solid rgba(212,175,55,0.15)",
    borderRadius: "12px",
    overflow: "hidden",
    position: "relative",
  },
};

const warmGlow: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: "280px",
  background: [
    "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.18) 0%, transparent 70%)",
    "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(120,60,180,0.08) 0%, transparent 60%)",
  ].join(", "),
  pointerEvents: "none",
};

const featureGlow: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: "220px",
  background: [
    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.14) 0%, transparent 70%)",
    "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(120,60,180,0.06) 0%, transparent 60%)",
  ].join(", "),
  pointerEvents: "none",
};

const dataGlow: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: "180px",
  background: [
    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.10) 0%, transparent 70%)",
    "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(120,60,180,0.06) 0%, transparent 60%)",
  ].join(", "),
  pointerEvents: "none",
};

const neutralGlow: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: "140px",
  background: [
    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 70%)",
    "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(120,60,180,0.04) 0%, transparent 60%)",
  ].join(", "),
  pointerEvents: "none",
};

const warmTopline: React.CSSProperties = {
  height: "2px",
  background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.60), transparent)",
  position: "relative",
  overflow: "hidden",
};

const warmToplineShimmer: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: "-100%",
  width: "60%",
  height: "100%",
  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.30), transparent)",
  animation: "toplineShimmer 8s ease-in-out infinite",
};

const featureTopline: React.CSSProperties = {
  height: "1px",
  background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.40), transparent)",
};

const cardPad: React.CSSProperties = {
  padding: "24px 24px",
};

const cardH: React.CSSProperties = {
  fontFamily: "'Bebas Neue', sans-serif",
  fontSize: "28px",
  color: "#D4AF37",
  letterSpacing: "0.06em",
  lineHeight: 1,
  marginBottom: "6px",
};

const cardHSub: React.CSSProperties = {
  fontSize: "13px",
  color: "rgba(255,255,255,0.40)",
  marginBottom: "24px",
};

const ChapterCard = ({
  chapter,
  title,
  isActive = true,
  children,
  glossaryTrigger,
  variant,
  breathing = false,
  pulsing = false,
  glowState = null,
  noPad = false,
  hideEyebrow = false,
}: ChapterCardProps) => {
  // Determine variant — if not explicitly set, use legacy behavior
  const effectiveVariant = variant;

  // Build card style
  let cardStyle: React.CSSProperties;
  if (effectiveVariant) {
    cardStyle = { ...cardStyles[effectiveVariant] };

    // Warm card animations
    if (effectiveVariant === 'warm') {
      if (breathing) {
        cardStyle.animation = "breathe 3s ease-in-out infinite";
      } else if (pulsing) {
        cardStyle.animation = "completePulse 0.6s ease-out";
      }
    }

    // Feature card state-dependent glow
    if (effectiveVariant === 'feature' && glowState) {
      if (glowState === 'positive') {
        cardStyle.boxShadow = "0 16px 40px rgba(0,0,0,0.6), 0 0 40px rgba(212,175,55,0.15)";
      } else if (glowState === 'negative') {
        cardStyle.boxShadow = "0 16px 40px rgba(0,0,0,0.6), 0 0 40px rgba(220,38,38,0.18)";
      }
    }
  } else {
    // Legacy fallback for non-variant usage
    cardStyle = isActive
      ? {
          background: "#0A0A0A",
          border: "1px solid rgba(212,175,55,0.35)",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 24px 50px rgba(0,0,0,0.8)",
          transition: "border-color 0.25s ease",
        }
      : {
          background: "#0A0A0A",
          border: "1px solid rgba(212,175,55,0.20)",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
          transition: "border-color 0.25s ease",
        };
  }

  const showWarmExtras = effectiveVariant === 'warm';
  const showFeatureTopline = effectiveVariant === 'feature';
  const showLegacyTopline = !effectiveVariant;

  // Determine which atmospheric glow to render
  const glowLayer = effectiveVariant === 'warm' ? warmGlow
    : effectiveVariant === 'feature' ? featureGlow
    : effectiveVariant === 'data' ? dataGlow
    : effectiveVariant === 'neutral' ? neutralGlow
    : null;

  return (
    <section>
      {/* Eyebrow-ruled opener */}
      {!hideEyebrow && (
        <div style={eyebrowS.eyebrow}>
          <div style={eyebrowS.eyebrowLine} />
          <span style={eyebrowS.eyebrowLabel}>
            <span style={eyebrowS.eyebrowNum}>{chapter}</span> · {title}
            {glossaryTrigger && <span>{glossaryTrigger}</span>}
          </span>
          <div style={eyebrowS.eyebrowLine} />
        </div>
      )}

      {/* Card body */}
      <div style={cardStyle}>
        {/* Atmospheric glow layer for all variants */}
        {glowLayer && <div style={glowLayer} />}

        {/* Warm card extras: topline */}
        {showWarmExtras && (
          <div style={warmTopline}>
            <div style={warmToplineShimmer} />
          </div>
        )}

        {/* Feature card topline */}
        {showFeatureTopline && <div style={featureTopline} />}

        {/* Legacy topline */}
        {showLegacyTopline && (
          <div
            style={
              isActive
                ? { height: "2px", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.60), transparent)", pointerEvents: "none" as const }
                : { height: "1px", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.40), transparent)", pointerEvents: "none" as const }
            }
          />
        )}

        {noPad ? children : <div style={cardPad}>{children}</div>}
      </div>
    </section>
  );
};

export { cardH, cardHSub };
export default ChapterCard;
