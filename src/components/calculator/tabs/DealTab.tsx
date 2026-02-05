import { useState, useCallback } from "react";
import { WaterfallInputs, GuildState } from "@/lib/waterfall";
import { CapitalSelections } from "../steps/CapitalSelectStep";
import { useHaptics } from "@/hooks/use-haptics";

// Import deal mini-app components
import { DealOverviewWiki, DealInput } from "../deal";

interface DealTabProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  selections: CapitalSelections;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onAdvance?: () => void; // Called when user completes Deal and wants to go to Waterfall
}

/**
 * DealTab - Step Router (Mini-App Architecture)
 * 
 * This tab manages navigation between isolated mini-app screens.
 * Each screen has ONE job: educate (Wiki) or collect data (Input).
 * 
 * Step Map:
 * 0 = DealOverviewWiki (intro to acquisition/breakeven concepts)
 * 1 = DealInput (enter revenue + see breakeven status)
 * 
 * On completion, advances to Waterfall tab.
 */
const DealTab = ({ inputs, guilds, selections, onUpdateInput, onAdvance }: DealTabProps) => {
  const haptics = useHaptics();
  
  // Start at step 0 if no revenue, otherwise show input
  const [currentStep, setCurrentStep] = useState(() => {
    return inputs.revenue > 0 ? 1 : 0;
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

  // Handle completion - advance to Waterfall tab
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
        return <DealOverviewWiki onContinue={nextStep} />;

      // Step 1: Deal Input
      case 1:
        return (
          <DealInput
            inputs={inputs}
            guilds={guilds}
            selections={selections}
            onUpdateInput={onUpdateInput}
            onNext={handleComplete}
          />
        );

      default:
        return <DealOverviewWiki onContinue={nextStep} />;
    }
  };

  return (
    <div className="pb-8">
      {renderStep()}
    </div>
  );
};

export default DealTab;
