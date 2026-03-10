import React, { ReactNode, useState } from "react";
import ChapterCard from "./ChapterCard";
import { ArrowRight } from "lucide-react";

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
}

const s: Record<string, React.CSSProperties> = {
  wrapper: {
    animation: "stepEnter 0.4s ease-out forwards",
  },
  subtitle: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.40)",
    lineHeight: "1.55",
    paddingBottom: "16px",
    marginBottom: "16px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  cta: {
    width: "100%",
    padding: "16px",
    marginTop: "20px",
    background: "#F9E076",
    border: "none",
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
    boxShadow: "0 0 20px rgba(249,224,118,0.25), 0 0 60px rgba(249,224,118,0.08)",
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
}: StandardStepLayoutProps) => {
  const [pressed, setPressed] = useState(false);

  return (
    <div style={s.wrapper}>
      <ChapterCard
        chapter={chapter}
        title={title}
        isActive={true}
        glossaryTrigger={glossaryTrigger}
      >
        <div>
          {subtitle && (
            <p style={s.subtitle}>{subtitle}</p>
          )}

          <div>{children}</div>

          {onNext && isComplete && (
            <button
              onClick={onNext}
              onMouseDown={() => setPressed(true)}
              onMouseUp={() => setPressed(false)}
              onMouseLeave={() => setPressed(false)}
              onTouchStart={() => setPressed(true)}
              onTouchEnd={() => setPressed(false)}
              style={{
                ...s.cta,
                ...(pressed ? s.ctaPressed : {}),
              }}
            >
              {nextLabel}
              <ArrowRight style={{ width: "18px", height: "18px" }} />
            </button>
          )}
        </div>
      </ChapterCard>
    </div>
  );
};

export default StandardStepLayout;
