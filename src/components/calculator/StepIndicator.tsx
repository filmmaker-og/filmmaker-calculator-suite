interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick: (step: number) => void;
}

const StepIndicator = ({ currentStep, totalSteps = 6, onStepClick }: StepIndicatorProps) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  return (
    <div className="flex items-center justify-center gap-3">
      {steps.map((step) => {
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;
        const isClickable = step <= currentStep;
        
        return (
          <button
            key={step}
            onClick={() => isClickable && onStepClick(step)}
            disabled={!isClickable}
            className={`step-pill ${
              isCompleted ? 'completed' : 
              isCurrent ? 'current' : 'upcoming'
            } ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
            aria-label={`${isCompleted ? 'Completed: ' : isCurrent ? 'Current: ' : ''}Step ${step}`}
            aria-current={isCurrent ? 'step' : undefined}
          />
        );
      })}
    </div>
  );
};

export default StepIndicator;
