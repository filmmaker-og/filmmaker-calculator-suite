import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  onStepClick?: (step: number) => void;
}

/**
 * Premium Progress Bar
 *
 * A luxurious progress indicator with:
 * - Smooth animated progress fill
 * - Glowing current step indicator
 * - Clickable completed steps
 * - Matte grey styling
 */
const ProgressBar = ({
  currentStep,
  totalSteps,
  stepLabels,
  onStepClick,
}: ProgressBarProps) => {
  const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full bg-[#0A0A0A] border-b border-[#1A1A1A]">
      <div className="px-5 py-4">
        {/* Top row: Step counter and percentage */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
              Step
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-sm text-gold font-semibold">
                {currentStep}
              </span>
              <span className="font-mono text-xs text-white/20">
                / {totalSteps}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-gold/70">
              {Math.round(percentage)}%
            </span>
            <span className="text-[10px] text-white/30 uppercase tracking-wider">
              complete
            </span>
          </div>
        </div>

        {/* Progress track */}
        <div className="relative h-1.5 bg-[#1A1A1A] overflow-hidden">
          {/* Completed progress fill */}
          <div
            className="absolute left-0 top-0 h-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              background: 'linear-gradient(90deg, #D4AF37 0%, #F9E076 100%)',
              boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
            }}
          />

          {/* Step markers */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: totalSteps }).map((_, index) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;
              const isClickable = isCompleted && onStepClick;

              return (
                <button
                  key={index}
                  onClick={() => isClickable && onStepClick(stepNumber)}
                  disabled={!isClickable}
                  className={cn(
                    "flex-1 relative",
                    isClickable && "cursor-pointer"
                  )}
                  title={stepLabels?.[index] || `Step ${stepNumber}`}
                >
                  {/* Segment divider */}
                  {index < totalSteps - 1 && (
                    <div className="absolute right-0 top-0 w-px h-full bg-[#0A0A0A]" />
                  )}

                  {/* Current step glow indicator */}
                  {isCurrent && (
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                      style={{
                        background: '#F9E076',
                        boxShadow: '0 0 12px rgba(249, 224, 118, 0.8), 0 0 24px rgba(249, 224, 118, 0.4)',
                        animation: 'pulse 2s ease-in-out infinite',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current step label (if provided) */}
        {stepLabels && stepLabels[currentStep - 1] && (
          <div className="mt-3 flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-medium">
              {stepLabels[currentStep - 1]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
