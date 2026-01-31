interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  onStepClick?: (step: number) => void;
}

const StepIndicator = ({ currentStep, totalSteps, stepLabels, onStepClick }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      {stepLabels.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        const isClickable = isCompleted && onStepClick;

        return (
          <button
            key={index}
            onClick={() => isClickable && onStepClick(stepNumber)}
            disabled={!isClickable}
            className={`
              text-[10px] tracking-[0.15em] uppercase font-semibold transition-all
              ${isActive 
                ? 'text-gold' 
                : isCompleted 
                  ? 'text-white/50 hover:text-white/70 cursor-pointer' 
                  : 'text-white/25 cursor-default'
              }
              ${isClickable ? 'hover:text-gold/80' : ''}
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default StepIndicator;
