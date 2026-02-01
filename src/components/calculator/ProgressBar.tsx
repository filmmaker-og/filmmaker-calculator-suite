import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  onStepClick?: (step: number) => void;
  currentPhase?: number;
  phaseLabels?: string[];
}

// Map steps to phases for display
const getPhaseForStepIndex = (stepIndex: number, totalSteps: number): number => {
  // Phase distribution: BUDGET (1), DEDUCTIONS (5), FINANCING (variable), BREAKEVEN (2), RESULTS (2)
  if (stepIndex === 0) return 1; // budget
  if (stepIndex >= 1 && stepIndex <= 5) return 2; // sales, cam, marketing, guilds, offtop
  if (stepIndex === 6) return 3; // capitalSelect
  // Determine if we're in the financing detail steps or the end steps
  const endStepsCount = 4; // breakeven, acquisition, reveal, waterfall
  const endStepsStart = totalSteps - endStepsCount;
  
  if (stepIndex >= endStepsStart && stepIndex < endStepsStart + 2) return 4; // breakeven, acquisition
  if (stepIndex >= endStepsStart + 2) return 5; // reveal, waterfall
  
  return 3; // capital detail steps (taxCredits, seniorDebt, gapLoan, equity)
};

const PHASE_LABELS = ['BUDGET', 'DEDUCTIONS', 'FINANCING', 'BREAKEVEN', 'RESULTS'];

/**
 * Simplified Progress Bar with 5 Narrative Phases
 */
const ProgressBar = ({
  currentStep,
  totalSteps,
  stepLabels,
  onStepClick,
}: ProgressBarProps) => {
  const currentPhase = getPhaseForStepIndex(currentStep - 1, totalSteps);
  const phaseProgress = ((currentPhase - 1) / (PHASE_LABELS.length - 1)) * 100;

  return (
    <div className="w-full bg-[#0A0A0A] border-b border-[#1A1A1A]">
      <div className="px-5 py-4">
        {/* Phase Labels Row */}
        <div className="flex items-center justify-between mb-3">
          {PHASE_LABELS.map((label, index) => {
            const phaseNum = index + 1;
            const isActive = phaseNum === currentPhase;
            const isCompleted = phaseNum < currentPhase;

            return (
              <button
                key={label}
                onClick={() => {
                  // Map phase back to first step in that phase
                  if (isCompleted && onStepClick) {
                    // Find first step of this phase
                    let targetStep = 1;
                    if (phaseNum === 2) targetStep = 2;
                    if (phaseNum === 3) targetStep = 7;
                    if (phaseNum === 4) targetStep = totalSteps - 3;
                    if (phaseNum === 5) targetStep = totalSteps - 1;
                    onStepClick(targetStep);
                  }
                }}
                disabled={!isCompleted}
                className={cn(
                  "text-[10px] font-semibold tracking-[0.15em] uppercase transition-all duration-300",
                  isActive && "text-gold",
                  isCompleted && "text-gold/60 cursor-pointer hover:text-gold",
                  !isActive && !isCompleted && "text-white/20"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Progress Track */}
        <div className="relative h-1 bg-[#1A1A1A] overflow-hidden">
          {/* Completed progress fill */}
          <div
            className="absolute left-0 top-0 h-full transition-all duration-500 ease-out"
            style={{
              width: `${phaseProgress}%`,
              background: 'linear-gradient(90deg, #D4AF37 0%, #F9E076 100%)',
              boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
            }}
          />

          {/* Phase markers */}
          <div className="absolute inset-0 flex">
            {PHASE_LABELS.map((_, index) => {
              const phaseNum = index + 1;
              const isActive = phaseNum === currentPhase;
              const isCompleted = phaseNum < currentPhase;

              return (
                <div
                  key={index}
                  className="flex-1 relative"
                >
                  {/* Segment divider */}
                  {index < PHASE_LABELS.length - 1 && (
                    <div className="absolute right-0 top-0 w-px h-full bg-[#0A0A0A]" />
                  )}

                  {/* Current phase glow indicator */}
                  {isActive && (
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                      style={{
                        background: '#F9E076',
                        boxShadow: '0 0 12px rgba(249, 224, 118, 0.8), 0 0 24px rgba(249, 224, 118, 0.4)',
                        animation: 'pulse 2s ease-in-out infinite',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step Info */}
        <div className="mt-3 flex items-center justify-between">
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

          {stepLabels && stepLabels[currentStep - 1] && (
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-medium">
              {stepLabels[currentStep - 1]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
