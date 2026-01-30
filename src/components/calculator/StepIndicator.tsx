import { useHaptics } from "@/hooks/use-haptics";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick: (step: number) => void;
  /** Optional swipe offset for visual feedback during swipe gestures */
  swipeOffset?: number;
}

const StepIndicator = ({ 
  currentStep, 
  totalSteps = 6, 
  onStepClick,
  swipeOffset = 0 
}: StepIndicatorProps) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  const haptics = useHaptics();
  
  const handleStepClick = (step: number, isClickable: boolean) => {
    if (isClickable) {
      haptics.light();
      onStepClick(step);
    }
  };
  
  return (
    <div className="flex items-center justify-center gap-3">
      {steps.map((step) => {
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;
        const isClickable = step <= currentStep;
        
        // Subtle offset animation based on swipe direction
        const pillOffset = swipeOffset !== 0 && isCurrent 
          ? Math.max(-3, Math.min(3, swipeOffset / 50)) 
          : 0;
        
        return (
          <button
            key={step}
            onClick={() => handleStepClick(step, isClickable)}
            disabled={!isClickable}
            className={`step-pill ${
              isCompleted ? 'completed' : 
              isCurrent ? 'current' : 'upcoming'
            } ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
            style={{
              transform: pillOffset !== 0 ? `translateX(${pillOffset}px)` : undefined,
            }}
            aria-label={`${isCompleted ? 'Completed: ' : isCurrent ? 'Current: ' : ''}Step ${step}`}
            aria-current={isCurrent ? 'step' : undefined}
          />
        );
      })}
    </div>
  );
};

export default StepIndicator;
