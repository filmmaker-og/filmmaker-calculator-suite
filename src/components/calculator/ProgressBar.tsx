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
 * - Fixed position below header
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
    <div
      className="w-full border-b border-border-default"
      style={{
        position: 'fixed',
        top: 'var(--appbar-h)',
        left: 0,
        right: 0,
        zIndex: 40,
        backgroundColor: '#000000',
      }}
    >
      <div className="px-6 py-4">
        {/* Badge row */}
        <div className="relative flex items-center justify-between">
          {/* Connection line */}
          <div className="absolute left-3 right-3 top-1/2 h-[1px] bg-[#2A2A2A] -translate-y-1/2" />

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
                  isActive && "bg-gold text-bg-void",
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
