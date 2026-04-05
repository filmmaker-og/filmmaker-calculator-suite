import React, { ReactNode, useState } from "react";
import ChapterCard, { CardVariant } from "./ChapterCard";
import { ArrowRight } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import { ctaGold, white } from "@/lib/tokens";

interface StandardStepLayoutProps {
  chapter: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onNext?: () => void;
  nextLabel?: string;
  isComplete?: boolean;
  className?: string;
  glossaryTrigger?: ReactNode;
  variant?: CardVariant;
  breathing?: boolean;
  pulsing?: boolean;
}

const s: Record<string, React.CSSProperties> = {
  wrapper: {
    animation: "stepEnter 0.4s ease-out forwards",
  },
  subtitle: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.48)",
    lineHeight: "1.6",
    paddingBottom: "16px",
    marginBottom: "16px",
    borderBottom: `1px solid ${white(0.08)}`,
  },
  cta: {
    width: "100%",
    padding: "16px",
    marginTop: "20px",
    background: "linear-gradient(180deg, #FBE88A 0%, #F9E076 45%, #E8D06A 100%)",
    border: "none",
    borderTop: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "8px",
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "20px",
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: "#000",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "transform 0.12s ease, opacity 0.15s",
    boxShadow: `0 0 20px ${ctaGold(0.25)}, 0 0 60px ${ctaGold(0.15)}`,
    minHeight: "56px",
  },
  ctaHover: {
    boxShadow: `0 0 30px ${ctaGold(0.35)}, 0 0 80px ${ctaGold(0.20)}`,
  },
  ctaPressed: {
    transform: "scale(0.98)",
  },
};

const StandardStepLayout = ({
  chapter,
  title,
  subtitle,
  children,
  onNext,
  nextLabel = "Continue",
  isComplete = false,
  glossaryTrigger,
  variant,
  breathing,
  pulsing,
}: StandardStepLayoutProps) => {
  const haptics = useHaptics();
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div style={s.wrapper}>
      <ChapterCard
        chapter={chapter}
        title={title}
        isActive={true}
        glossaryTrigger={glossaryTrigger}
        variant={variant}
        breathing={breathing}
        pulsing={pulsing}
      >
        <div>
          {subtitle && (
            <p style={s.subtitle}>{subtitle}</p>
          )}

          <div>{children}</div>

          {onNext && isComplete && (
            <button
              onClick={(e) => { haptics.medium(e); onNext(); }}
              onMouseDown={() => setPressed(true)}
              onMouseUp={() => setPressed(false)}
              onMouseLeave={() => { setPressed(false); setHovered(false); }}
              onMouseEnter={() => setHovered(true)}
              onTouchStart={() => setPressed(true)}
              onTouchEnd={() => setPressed(false)}
              style={{
                ...s.cta,
                ...(hovered ? s.ctaHover : {}),
                ...(pressed ? s.ctaPressed : {}),
              }}
            >
              {nextLabel}
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </ChapterCard>
    </div>
  );
};

export default StandardStepLayout;
