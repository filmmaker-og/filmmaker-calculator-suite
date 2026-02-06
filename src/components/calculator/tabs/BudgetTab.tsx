import { useCallback } from "react";
import { WaterfallInputs, GuildState } from "@/lib/waterfall";
import { useHaptics } from "@/hooks/use-haptics";

// Import budget input component
import BudgetInput from "../budget/BudgetInput";

interface BudgetTabProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onToggleGuild: (guild: keyof GuildState) => void;
  onAdvance?: () => void;
}

/**
 * BudgetTab - Pure Action Zone
 * 
 * No wiki screens - education lives in /intro.
 * This tab goes straight to input collection.
 * 
 * On completion, advances to Stack tab.
 */
const BudgetTab = ({ inputs, onUpdateInput, onAdvance }: BudgetTabProps) => {
  const haptics = useHaptics();

  // Handle completion - advance to Stack tab
  const handleComplete = useCallback(() => {
    haptics.medium();
    if (onAdvance) {
      onAdvance();
    }
  }, [haptics, onAdvance]);

  return (
    <div className="pb-8">
      <BudgetInput
        inputs={inputs}
        onUpdateInput={onUpdateInput}
        onNext={handleComplete}
      />
    </div>
  );
};

export default BudgetTab;
