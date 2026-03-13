import { useCallback } from "react";
import { WaterfallInputs, GuildState, CapitalSelections } from "@/lib/waterfall";
import { useHaptics } from "@/hooks/use-haptics";

import DealInput from "../deal/DealInput";

interface DealTabProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  selections: CapitalSelections;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onAdvance?: () => void;
  genre?: string;
}

const DealTab = ({ inputs, guilds, selections, onUpdateInput, onAdvance, genre }: DealTabProps) => {
  const haptics = useHaptics();

  const handleComplete = useCallback(() => {
    haptics.medium();
    if (onAdvance) {
      onAdvance();
    }
  }, [haptics, onAdvance]);

  return (
    <div style={{ paddingBottom: "32px" }}>
      <DealInput
        inputs={inputs}
        guilds={guilds}
        selections={selections}
        onUpdateInput={onUpdateInput}
        onNext={handleComplete}
        genre={genre}
      />
    </div>
  );
};

export default DealTab;
