import { useState, useCallback } from "react";
import { WaterfallInputs } from "@/lib/waterfall";
import { useHaptics } from "@/hooks/use-haptics";

// Import stack input components (no wikis)
import TaxCreditsInput from "../stack/TaxCreditsInput";
import SeniorDebtInput from "../stack/SeniorDebtInput";
import GapMezzInput from "../stack/GapMezzInput";
import EquityInput from "../stack/EquityInput";
import DefermentsInput from "../stack/DefermentsInput";
import StackSummary from "../stack/StackSummary";

interface StackTabProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onAdvance?: () => void;
}

/**
 * StackTab - Pure Action Zone (No Wiki Steps)
 * 
 * Education lives in /intro. This tab is all about input collection.
 * 
 * Step Map (inputs only):
 * 0 = TaxCreditsInput
 * 1 = SeniorDebtInput
 * 2 = GapMezzInput
 * 3 = EquityInput
 * 4 = DefermentsInput
 * 5 = StackSummary
 * 
 * Smart Start: If any capital data exists, skip to summary.
 */
const StackTab = ({ inputs, onUpdateInput, onAdvance }: StackTabProps) => {
  const haptics = useHaptics();
  
  // Smart start: Check if user has any capital stack data
  const hasStackData = 
    inputs.credits > 0 || 
    inputs.debt > 0 || 
    inputs.mezzanineDebt > 0 || 
    inputs.equity > 0 || 
    inputs.deferments > 0;
  
  // If user has data, start at summary (step 5); otherwise start at first input (step 0)
  const [currentStep, setCurrentStep] = useState(() => {
    return hasStackData ? 5 : 0;
  });

  // Navigation helpers
  const goToStep = useCallback((step: number) => {
    haptics.light();
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [haptics]);

  const nextStep = useCallback(() => {
    goToStep(currentStep + 1);
  }, [currentStep, goToStep]);

  const prevStep = useCallback(() => {
    goToStep(Math.max(0, currentStep - 1));
  }, [currentStep, goToStep]);

  // Skip = advance to next input
  const skipToNextSection = useCallback(() => {
    goToStep(Math.min(5, currentStep + 1));
  }, [currentStep, goToStep]);

  // Handle completion - advance to Deal tab
  const handleComplete = useCallback(() => {
    haptics.medium();
    if (onAdvance) {
      onAdvance();
    }
  }, [haptics, onAdvance]);

  // Map from summary edit step to new step numbers
  // Old step numbers -> New step numbers:
  // 2 (TaxCredits) -> 0
  // 4 (SeniorDebt) -> 1
  // 6 (GapMezz) -> 2
  // 8 (Equity) -> 3
  // 10 (Deferments) -> 4
  const mapOldStepToNew = (oldStep: number): number => {
    const mapping: Record<number, number> = {
      2: 0,   // TaxCredits
      4: 1,   // SeniorDebt
      6: 2,   // GapMezz
      8: 3,   // Equity
      10: 4,  // Deferments
    };
    return mapping[oldStep] ?? 0;
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      // Step 0: Tax Credits Input
      case 0:
        return (
          <TaxCreditsInput
            inputs={inputs}
            onUpdateInput={onUpdateInput}
            onBack={prevStep}
            onNext={nextStep}
            onSkip={skipToNextSection}
          />
        );

      // Step 1: Senior Debt Input
      case 1:
        return (
          <SeniorDebtInput
            inputs={inputs}
            onUpdateInput={onUpdateInput}
            onBack={prevStep}
            onNext={nextStep}
            onSkip={skipToNextSection}
          />
        );

      // Step 2: Gap/Mezz Input
      case 2:
        return (
          <GapMezzInput
            inputs={inputs}
            onUpdateInput={onUpdateInput}
            onBack={prevStep}
            onNext={nextStep}
            onSkip={skipToNextSection}
          />
        );

      // Step 3: Equity Input
      case 3:
        return (
          <EquityInput
            inputs={inputs}
            onUpdateInput={onUpdateInput}
            onBack={prevStep}
            onNext={nextStep}
            onSkip={skipToNextSection}
          />
        );

      // Step 4: Deferments Input
      case 4:
        return (
          <DefermentsInput
            inputs={inputs}
            onUpdateInput={onUpdateInput}
            onBack={prevStep}
            onNext={nextStep}
            onSkip={skipToNextSection}
          />
        );

      // Step 5: Summary
      case 5:
        return (
          <StackSummary
            inputs={inputs}
            onEdit={(oldStep) => goToStep(mapOldStepToNew(oldStep))}
            onComplete={handleComplete}
          />
        );

      default:
        return (
          <TaxCreditsInput
            inputs={inputs}
            onUpdateInput={onUpdateInput}
            onBack={prevStep}
            onNext={nextStep}
            onSkip={skipToNextSection}
          />
        );
    }
  };

  return (
    <div className="pb-8">
      {renderStep()}
    </div>
  );
};

export default StackTab;
