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
          <div className="absolute left-6 right-6 top-1/2 h-[2px] bg-[#1A1A1A] -translate-y-1/2" />

          {/* Progress fill line */}
          <div
            className="absolute left-6 top-1/2 h-[2px] -translate-y-1/2 transition-all duration-500 ease-out"
            style={{
              width: `calc(${progress}% * (100% - 48px) / 100%)`,
              background: 'linear-gradient(90deg, #D4AF37 0%, #F9E076 100%)',
              boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
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
                    "relative w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-all duration-300",
                    // Active state - gold fill + glow
                    isActive && [
                      "bg-gold text-black",
                      "shadow-[0_0_20px_rgba(212,175,55,0.6),0_0_40px_rgba(212,175,55,0.3)]",
                      "ring-2 ring-gold-highlight ring-offset-2 ring-offset-[#0A0A0A]",
                    ],
                    // Completed state - gold outline + checkmark
                    isCompleted && [
                      "bg-[#0A0A0A] border-2 border-gold text-gold",
                      "hover:bg-gold/10 cursor-pointer",
                    ],
                    // Future state - muted
                    isFuture && [
                      "bg-[#0A0A0A] border border-[#2A2A2A] text-white/30",
                    ]
                  )}
                >
                  {/* Inner glow for active */}
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-full animate-pulse-slow"
                      style={{
                        background: 'radial-gradient(circle, rgba(249, 224, 118, 0.3) 0%, transparent 70%)',
                      }}
                    />
                  )}

                  {/* Badge content */}
                  <span className="relative">
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
