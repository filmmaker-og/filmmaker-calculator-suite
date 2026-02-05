 import { cn } from "@/lib/utils";

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
      className="w-full"
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
       {/* Dot row */}
       <div className="relative flex items-center justify-between py-2">
          {/* Dashed gold connection line */}
          <div
            className="absolute left-3 right-3 top-1/2 -translate-y-1/2"
            style={{
              height: '1px',
              backgroundImage: 'repeating-linear-gradient(90deg, hsl(var(--gold)) 0px, hsl(var(--gold)) 4px, transparent 4px, transparent 10px)',
              opacity: 0.4,
            }}
          />

         {/* Dots */}
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
                   "relative z-10 flex items-center justify-center",
                   "w-11 h-11", // 44px touch target
                   "transition-all duration-200",
                   isCompleted && "cursor-pointer"
                 )}
               >
                 <span
                   className={cn(
                     "w-2 h-2 rounded-full transition-all duration-200",
                     isCompleted && "bg-gold",
                     isActive && "border-2 border-gold scale-125",
                     isActive && "shadow-[0_0_8px_rgba(212,175,55,0.5)]",
                     isFuture && "border border-white/20"
                   )}
                 />
               </button>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
