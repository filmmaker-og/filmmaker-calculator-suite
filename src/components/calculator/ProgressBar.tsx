import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  onStepClick?: (step: number) => void;
}

/**
 * Minimal Progress Bar
 * - Compact badges without labels on mobile
 * - Active badge: gold fill
 * - Completed badge: gold outline + check
 * - Future badge: muted border
 */
const ProgressBar = ({
  currentStep,
  totalSteps,
  onStepClick,
}: ProgressBarProps) => {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full bg-black border-b border-[#1A1A1A]">
      <div className="px-4 py-3">
        {/* Badge row */}
        <div className="relative flex items-center justify-between">
          {/* Connection line */}
          <div className="absolute left-3 right-3 top-1/2 h-[1px] bg-[#1A1A1A] -translate-y-1/2" />

          {/* Progress fill */}
          <div
            className="absolute left-3 top-1/2 h-[1px] -translate-y-1/2 transition-all duration-300 ease-out bg-gold"
            style={{
              width: `calc(${progress}% * (100% - 24px) / 100%)`,
            }}
          />

          {/* Badges */}
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;
            const isFuture = stepNum > currentStep;

            return (
              <button
                key={stepNum}
                onClick={() => isCompleted && onStepClick?.(stepNum)}
                disabled={!isCompleted}
                className={cn(
                  "relative z-10 w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-medium transition-all duration-150",
                  isActive && "bg-gold text-black",
                  isCompleted && "bg-black border border-gold text-gold hover:bg-gold/10 cursor-pointer",
                  isFuture && "bg-black border border-[#2A2A2A] text-white/30"
                )}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3" />
                ) : (
                  stepNum
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
