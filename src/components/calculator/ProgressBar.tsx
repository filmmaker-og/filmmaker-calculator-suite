import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  onStepClick?: (step: number) => void;
}

/**
 * Chapter-Based Progress Bar
 *
 * Displays numbered chapter badges with:
 * - Active badge: gold fill + glow
 * - Completed badge: gold outline + checkmark
 * - Future badge: muted
 */
const ProgressBar = ({
  currentStep,
  totalSteps,
  stepLabels = [],
  onStepClick,
}: ProgressBarProps) => {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full bg-[#0A0A0A] border-b border-[#1A1A1A]">
      <div className="px-5 py-4">
        {/* Chapter badges row */}
        <div className="relative flex items-center justify-between">
          {/* Connection line (background) */}
          <div className="absolute left-4 right-4 top-1/2 h-[1px] bg-[#1A1A1A] -translate-y-1/2" />

          {/* Progress fill line */}
          <div
            className="absolute left-4 top-1/2 h-[1px] -translate-y-1/2 transition-all duration-300 ease-out bg-gold"
            style={{
              width: `calc(${progress}% * (100% - 32px) / 100%)`,
            }}
          />

          {/* Chapter badges */}
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;
            const isFuture = stepNum > currentStep;

            return (
              <div key={stepNum} className="relative z-10 flex flex-col items-center">
                {/* Badge */}
                <button
                  onClick={() => isCompleted && onStepClick?.(stepNum)}
                  disabled={!isCompleted}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-200",
                    isActive && "bg-gold text-black",
                    isCompleted && "bg-transparent border border-gold text-gold hover:bg-gold/10 cursor-pointer",
                    isFuture && "bg-transparent border border-[#2A2A2A] text-white/30"
                  )}
                >
                  {/* Badge content */}
                  <span>
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      stepNum
                    )}
                  </span>
                </button>

                {/* Label below badge */}
                {stepLabels[index] && (
                  <span
                    className={cn(
                      "mt-2 text-[9px] font-semibold tracking-[0.15em] uppercase transition-colors duration-300",
                      isActive && "text-gold",
                      isCompleted && "text-gold/60",
                      isFuture && "text-white/20"
                    )}
                  >
                    {stepLabels[index]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
