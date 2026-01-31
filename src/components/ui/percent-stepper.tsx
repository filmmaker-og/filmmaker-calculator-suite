import * as React from "react";
import { cn } from "@/lib/utils";
import { Minus, Plus, Check } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";

interface PercentStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  standardValue?: number;
  standardLabel?: string;
  isCompleted?: boolean;
  isNext?: boolean;
  className?: string;
}

const PercentStepper = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 5,
  label,
  standardValue,
  standardLabel = "standard",
  isCompleted = false,
  isNext = false,
  className,
}: PercentStepperProps) => {
  const haptics = useHaptics();
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleIncrement = () => {
    if (value < max) {
      haptics.light();
      setIsAnimating(true);
      onChange(Math.min(max, value + step));
      setTimeout(() => setIsAnimating(false), 150);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      haptics.light();
      setIsAnimating(true);
      onChange(Math.max(min, value - step));
      setTimeout(() => setIsAnimating(false), 150);
    }
  };

  const prevValue = Math.max(min, value - step);
  const nextValue = Math.min(max, value + step);
  const isStandard = standardValue !== undefined && value === standardValue;

  return (
    <div
      className={cn(
        "relative transition-all duration-200",
        "border-2 bg-gradient-to-b from-background to-[hsl(0_0%_3%)]",
        isCompleted
          ? "border-gold/70 bg-[rgba(212,175,55,0.04)]"
          : isNext
          ? "border-gold/50 animate-pulse-border"
          : "border-border",
        className
      )}
    >
      {/* Label row */}
      {label && (
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            {label}
          </label>
          {isCompleted && (
            <div className="w-5 h-5 bg-gold flex items-center justify-center animate-scale-in">
              <Check className="w-3 h-3 text-black" />
            </div>
          )}
        </div>
      )}

      {/* Stepper row */}
      <div className="flex items-center justify-center gap-6 px-4 pb-3">
        {/* Decrement button */}
        <button
          onClick={handleDecrement}
          disabled={value <= min}
          className={cn(
            "w-14 h-14 flex items-center justify-center border transition-all touch-feedback",
            value <= min
              ? "border-border/50 text-muted-foreground/30 cursor-not-allowed"
              : "border-border text-foreground hover:border-gold hover:text-gold active:scale-95"
          )}
        >
          <Minus className="w-5 h-5" />
        </button>

        {/* Value display */}
        <div className="flex flex-col items-center min-w-[80px]">
          <span
            className={cn(
              "font-mono text-4xl tabular-nums transition-transform duration-150",
              isAnimating && "scale-110",
              isStandard ? "text-gold" : "text-foreground"
            )}
          >
            {value}%
          </span>
          {/* Neighboring values hint */}
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground/50">
            <span>↑ {prevValue}%</span>
            <span className="text-muted-foreground/30">•</span>
            <span>↓ {nextValue}%</span>
          </div>
        </div>

        {/* Increment button */}
        <button
          onClick={handleIncrement}
          disabled={value >= max}
          className={cn(
            "w-14 h-14 flex items-center justify-center border transition-all touch-feedback",
            value >= max
              ? "border-border/50 text-muted-foreground/30 cursor-not-allowed"
              : "border-border text-foreground hover:border-gold hover:text-gold active:scale-95"
          )}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Standard indicator */}
      {standardValue !== undefined && (
        <div className="px-4 pb-3 text-center">
          <span
            className={cn(
              "text-xs transition-colors",
              isStandard ? "text-gold" : "text-muted-foreground/50"
            )}
          >
            {isStandard ? `✓ ${standardLabel}` : `${standardLabel}: ${standardValue}%`}
          </span>
        </div>
      )}
    </div>
  );
};

export { PercentStepper };
