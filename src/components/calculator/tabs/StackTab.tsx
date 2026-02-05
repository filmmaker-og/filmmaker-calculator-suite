import { useState, useCallback } from "react";
import { WaterfallInputs } from "@/lib/waterfall";
import { useHaptics } from "@/hooks/use-haptics";

// Import all stack mini-app components
import {
  StackOverviewWiki,
  TaxCreditsWiki,
  TaxCreditsInput,
  SeniorDebtWiki,
  SeniorDebtInput,
  GapMezzWiki,
  GapMezzInput,
  EquityWiki,
  EquityInput,
  DefermentsWiki,
  DefermentsInput,
  StackSummary,
} from "../stack";

interface StackTabProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onAdvance?: () => void; // Called when user completes Stack and wants to go to Deal
}

/**
 * StackTab - Step Router (Mini-App Architecture)
 * 
 * This tab manages navigation between isolated mini-app screens.
 * Each screen has ONE job: educate (Wiki) or collect data (Input).
 * 
 * Step Map:
 * 0  = StackOverviewWiki (intro to capital stack concept)
 * 1  = TaxCreditsWiki
 * 2  = TaxCreditsInput
 * 3  = SeniorDebtWiki
 * 4  = SeniorDebtInput
 * 5  = GapMezzWiki
 * 6  = GapMezzInput
 * 7  = EquityWiki
 * 8  = EquityInput
 * 9  = DefermentsWiki
 * 10 = DefermentsInput
 * 11 = StackSummary
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
  
  // If user has data, start at summary (step 11); otherwise start at overview (step 0)
  const [currentStep, setCurrentStep] = useState(() => {
    return hasStackData ? 11 : 0;
  });

  // Navigation helpers
  const goToStep = useCallback((step: number) => {
    haptics.light();
    setCurrentStep(step);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [haptics]);

  const nextStep = useCallback(() => {
    goToStep(currentStep + 1);
  }, [currentStep, goToStep]);

  const prevStep = useCallback(() => {
    goToStep(Math.max(0, currentStep - 1));
  }, [currentStep, goToStep]);

  // Skip = advance by 2 (skip input, go to next wiki)
  const skipToNextSection = useCallback(() => {
    // From input step, skip to next wiki (or summary if at end)
    // Input steps are even: 2, 4, 6, 8, 10
    // Next wiki is +1: 3, 5, 7, 9, 11
    const nextWikiStep = currentStep + 1;
    goToStep(Math.min(11, nextWikiStep));
  }, [currentStep, goToStep]);

  // Handle completion - advance to Deal tab
  const handleComplete = useCallback(() => {
    haptics.medium();
    if (onAdvance) {
      onAdvance();
    }
  }, [haptics, onAdvance]);

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      // Step 0: Overview Wiki
      case 0:
        return <StackOverviewWiki onContinue={nextStep} />;

      // Steps 1-2: Tax Credits
      case 1:
        return <TaxCreditsWiki onContinue={nextStep} />;
      case 2:
        return (
          <TaxCreditsInput
            inputs={inputs}
            onUpdateInput={onUpdateInput}
            onBack={prevStep}
            onNext={nextStep}
            onSkip={skipToNextSection}
          />
        );

      // Steps 3-4: Senior Debt
      case 3:
        return <SeniorDebtWiki onContinue={nextStep} />;
      case 4:
        return (
          <SeniorDebtInput
            inputs={inputs}
            onUpdateInput={onUpdateInput}
            onBack={prevStep}
            onNext={nextStep}
            onSkip={skipToNextSection}
          />
        );

      // Steps 5-6: Gap/Mezz
      case 5:
        return <GapMezzWiki onContinue={nextStep} />;
      case 6:
        return (
          <GapMezzInput
            inputs={inputs}
            onUpdateInput={onUpdateInput}
            onBack={prevStep}
            onNext={nextStep}
            onSkip={skipToNextSection}
          />
        );

      // Steps 7-8: Equity
      case 7:
        return <EquityWiki onContinue={nextStep} />;
      case 8:
        return (
          <EquityInput
            inputs={inputs}
            onUpdateInput={onUpdateInput}
            onBack={prevStep}
            onNext={nextStep}
            onSkip={skipToNextSection}
          />
        );

      // Steps 9-10: Deferments
      case 9:
        return <DefermentsWiki onContinue={nextStep} />;
      case 10:
        return (
          <DefermentsInput
            inputs={inputs}
            onUpdateInput={onUpdateInput}
            onBack={prevStep}
            onNext={nextStep}
            onSkip={skipToNextSection}
          />
        );

      // Step 11: Summary
      case 11:
        return (
          <StackSummary
            inputs={inputs}
            onEdit={goToStep}
            onComplete={handleComplete}
          />
        );

      default:
        return <StackOverviewWiki onContinue={nextStep} />;
    }
  };

  return (
    <div className="pb-8">
      {renderStep()}
    </div>
  );
};

export default StackTab;
