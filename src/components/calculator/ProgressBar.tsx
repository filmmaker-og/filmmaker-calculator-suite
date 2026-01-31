import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  onStepClick?: (step: number) => void;
}

const ProgressBar = ({
  currentStep,
  totalSteps,
  stepLabels,
  onStepClick,
}: ProgressBarProps) => {
  const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full px-4 py-3 bg-card/50 border-b border-border">
      {/* Progress track */}
      <div className="relative h-1 bg-border rounded-full overflow-hidden mb-2">
        {/* Completed progress */}
        <div
          className="absolute left-0 top-0 h-full bg-gold transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
        
        {/* Step segments */}
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
                  "flex-1 relative group",
                  isClickable && "cursor-pointer"
                )}
              >
                {/* Segment divider */}
                {index < totalSteps - 1 && (
                  <div className="absolute right-0 top-0 w-px h-full bg-background/50" />
                )}
                
                {/* Current step indicator dot */}
                {isCurrent && (
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold-highlight animate-pulse-gold"
                    style={{
                      boxShadow: '0 0 8px rgba(249, 224, 118, 0.6)',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step counter */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-[10px] font-mono text-gold">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
