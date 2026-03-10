import { WaterfallInputs, GuildState } from "@/lib/waterfall";
import BudgetInput from "../budget/BudgetInput";

interface BudgetTabProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onToggleGuild: (guild: keyof GuildState) => void;
  onAdvance: () => void;
}

const BudgetTab = ({ inputs, guilds, onUpdateInput, onToggleGuild, onAdvance }: BudgetTabProps) => {
  return (
    <BudgetInput
      inputs={inputs}
      guilds={guilds}
      onUpdateInput={onUpdateInput}
      onToggleGuild={onToggleGuild}
      onNext={onAdvance}
    />
  );
};

export default BudgetTab;
