import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  className?: string;
}

/**
 * StepIndicator - Visual progress through multi-step flows
 * 
 * Displays dots/segments to show where user is in the flow.
 * Uses gold for completed/active, dim for upcoming.
 */
const StepIndicator = ({ 
  currentStep, 
  totalSteps, 
  labels,
  className 
}: StepIndicatorProps) => {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Step label */}
      {labels && labels[currentStep] && (
        <span className="text-xs font-mono text-gold/80 uppercase tracking-widest">
          {labels[currentStep]}
        </span>
      )}
      
      {/* Progress dots */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          
          return (
            <div
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                isActive 
                  ? "w-6 bg-gold" 
                  : isCompleted
                    ? "w-3 bg-gold/60"
                    : "w-3 bg-white/20"
              )}
            />
          );
        })}
      </div>
      
      {/* Numeric indicator */}
      <span className="text-[10px] text-text-dim font-mono">
        Step {currentStep + 1} of {totalSteps}
      </span>
    </div>
  );
};

export default StepIndicator;
