import { useState, useCallback, useMemo } from "react";
import { WaterfallInputs } from "@/lib/waterfall";
import { useHaptics } from "@/hooks/use-haptics";
import { cn } from "@/lib/utils";

import CapitalSelect, { CapitalSourceSelections } from "../stack/CapitalSelect";
import TaxCreditsInput from "../stack/TaxCreditsInput";
import SeniorDebtInput from "../stack/SeniorDebtInput";
import GapMezzInput from "../stack/GapMezzInput";
import EquityInput from "../stack/EquityInput";
import DefermentsInput from "../stack/DefermentsInput";
import StackSummary from "../stack/StackSummary";

/* ── Step label map ─────────────────────────────── */
const STEP_LABELS: Record<string, string> = {
  select: 'Sources',
  taxCredits: 'Tax Credits',
  seniorDebt: 'Debt',
  gapLoan: 'Gap',
  equity: 'Equity',
  deferments: 'Defers',
  summary: 'Review',
};

/* ── Wizard progress pip row ───────────────────── */
const WizardProgress = ({ steps, currentIndex }: { steps: string[]; currentIndex: number }) => (
  <div className="px-6 pt-4 pb-2">
    <div className="flex items-center justify-center">
      {steps.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={step} className="flex items-center">
            {i > 0 && (
              <div className={cn(
                "h-[1.5px] transition-colors duration-300",
                steps.length <= 4 ? "w-6" : "w-4",
                isCompleted ? "bg-gold/60" : "bg-white/10"
              )} />
            )}
            <div className={cn(
              "rounded-full transition-all duration-300",
              isCurrent
                ? "w-2.5 h-2.5 bg-gold shadow-[0_0_6px_rgba(212,175,55,0.6)]"
                : isCompleted
                  ? "w-2 h-2 bg-gold/50"
                  : "w-2 h-2 bg-white/15"
            )} />
          </div>
        );
      })}
    </div>
    <p className="text-center text-[11px] font-mono text-text-dim mt-2 tracking-wider">
      Step {currentIndex + 1} of {steps.length}
      {" — "}
      <span className="text-text-mid">{STEP_LABELS[steps[currentIndex]] ?? steps[currentIndex]}</span>
    </p>
  </div>
);

interface StackTabProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onAdvance?: () => void;
  selections: CapitalSourceSelections;
  onToggleSelection: (key: keyof CapitalSourceSelections) => void;
}

/**
 * StackTab — Dynamic Capital Stack Flow
 *
 * Step 0: CapitalSelect (toggle which sources you have)
 * Steps 1-N: Only the input screens for SELECTED sources
 * Final step: StackSummary
 *
 * No more forced linear march. No more "Skip" button confusion.
 */
const StackTab = ({ inputs, onUpdateInput, onAdvance, selections, onToggleSelection }: StackTabProps) => {
  const haptics = useHaptics();

  // Build dynamic step list based on selections
  const steps = useMemo(() => {
    const list: string[] = ['select'];
    if (selections.taxCredits) list.push('taxCredits');
    if (selections.seniorDebt) list.push('seniorDebt');
    if (selections.gapLoan) list.push('gapLoan');
    if (selections.equity) list.push('equity');
    if (selections.deferments) list.push('deferments');
    list.push('summary');
    return list;
  }, [selections]);

  // Smart start: if user has data AND selections, jump to summary
  const hasAnyData =
    inputs.credits > 0 ||
    inputs.debt > 0 ||
    inputs.mezzanineDebt > 0 ||
    inputs.equity > 0 ||
    inputs.deferments > 0;

  const hasAnySelection = Object.values(selections).some(Boolean);

  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    if (hasAnyData && hasAnySelection) return steps.length - 1;
    return 0;
  });

  // Clamp to valid range when steps change
  const safeIndex = Math.min(currentStepIndex, steps.length - 1);
  const currentStep = steps[safeIndex];

  const goToStep = useCallback((index: number) => {
    haptics.light();
    setCurrentStepIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [haptics]);

  const nextStep = useCallback(() => {
    goToStep(Math.min(steps.length - 1, safeIndex + 1));
  }, [safeIndex, steps.length, goToStep]);

  const prevStep = useCallback(() => {
    goToStep(Math.max(0, safeIndex - 1));
  }, [safeIndex, goToStep]);

  const handleComplete = useCallback(() => {
    haptics.medium();
    if (onAdvance) onAdvance();
  }, [haptics, onAdvance]);

  // Edit from summary: find the step index for a given source key
  const handleEdit = (sourceKey: string) => {
    const index = steps.indexOf(sourceKey);
    if (index >= 0) goToStep(index);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'select':
        return (
          <CapitalSelect
            selections={selections}
            onToggle={onToggleSelection}
            onNext={nextStep}
          />
        );
      case 'taxCredits':
        return (
          <TaxCreditsInput inputs={inputs} onUpdateInput={onUpdateInput}
            onBack={prevStep} onNext={nextStep} onSkip={nextStep} />
        );
      case 'seniorDebt':
        return (
          <SeniorDebtInput inputs={inputs} onUpdateInput={onUpdateInput}
            onBack={prevStep} onNext={nextStep} onSkip={nextStep} />
        );
      case 'gapLoan':
        return (
          <GapMezzInput inputs={inputs} onUpdateInput={onUpdateInput}
            onBack={prevStep} onNext={nextStep} onSkip={nextStep} />
        );
      case 'equity':
        return (
          <EquityInput inputs={inputs} onUpdateInput={onUpdateInput}
            onBack={prevStep} onNext={nextStep} onSkip={nextStep} />
        );
      case 'deferments':
        return (
          <DefermentsInput inputs={inputs} onUpdateInput={onUpdateInput}
            onBack={prevStep} onNext={nextStep} onSkip={nextStep} />
        );
      case 'summary':
        return (
          <StackSummary inputs={inputs} selections={selections}
            onEdit={handleEdit} onComplete={handleComplete} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="pb-8">
      <WizardProgress steps={steps} currentIndex={safeIndex} />
      {renderStep()}
    </div>
  );
};

export default StackTab;
