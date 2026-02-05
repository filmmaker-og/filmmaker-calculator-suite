import { useState, useCallback } from "react";
import { WaterfallInputs, GuildState } from "@/lib/waterfall";
import { useHaptics } from "@/hooks/use-haptics";

// Import budget mini-app components
import { BudgetOverviewWiki, BudgetInput } from "../budget";

interface BudgetTabProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onToggleGuild: (guild: keyof GuildState) => void;
  onAdvance?: () => void; // Called when user completes Budget and wants to go to Stack
}

/**
 * BudgetTab - Step Router (Mini-App Architecture)
 * 
 * This tab manages navigation between isolated mini-app screens.
 * Each screen has ONE job: educate (Wiki) or collect data (Input).
 * 
 * Step Map:
 * 0 = BudgetOverviewWiki (intro to negative cost concept)
 * 1 = BudgetInput (enter budget + quick amounts)
 * 
 * On completion, advances to Stack tab.
 */
const BudgetTab = ({ inputs, onUpdateInput, onAdvance }: BudgetTabProps) => {
  const haptics = useHaptics();
  
  // Start at step 0 if no budget, otherwise show input
  const [currentStep, setCurrentStep] = useState(() => {
    return inputs.budget > 0 ? 1 : 0;
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

  // Handle completion - advance to Stack tab
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
        return <BudgetOverviewWiki onContinue={nextStep} />;

      // Step 1: Budget Input
      case 1:
        return (
          <BudgetInput
            inputs={inputs}
            onUpdateInput={onUpdateInput}
            onNext={handleComplete}
          />
        );

      default:
        return <BudgetOverviewWiki onContinue={nextStep} />;
    }
  };

  return (
    <div className="pb-8">
      {renderStep()}
    </div>
  );
};

export default BudgetTab;
