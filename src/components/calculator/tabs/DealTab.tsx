import { useCallback } from "react";
import { WaterfallInputs, GuildState, CapitalSelections } from "@/lib/waterfall";
import { useHaptics } from "@/hooks/use-haptics";

// Import deal input component
import DealInput from "../deal/DealInput";

interface DealTabProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  selections: CapitalSelections;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onAdvance?: () => void;
}

/**
 * DealTab - Pure Action Zone
 * 
 * No wiki screens - education lives on the landing page.
 * This tab goes straight to input collection.
 * 
 * On completion, advances to Waterfall tab.
 */
const DealTab = ({ inputs, guilds, selections, onUpdateInput, onAdvance }: DealTabProps) => {
  const haptics = useHaptics();

  // Handle completion - advance to Waterfall tab
  const handleComplete = useCallback(() => {
    haptics.medium();
    if (onAdvance) {
      onAdvance();
    }
  }, [haptics, onAdvance]);

  return (
    <div className="pb-8">
      <DealInput
        inputs={inputs}
        guilds={guilds}
        selections={selections}
        onUpdateInput={onUpdateInput}
        onNext={handleComplete}
      />
    </div>
  );
};

export default DealTab;
