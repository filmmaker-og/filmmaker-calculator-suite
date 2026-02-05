import { Clock } from "lucide-react";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import StackInputCard from "./StackInputCard";

interface DefermentsInputProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

/**
 * DefermentsInput - Collect deferred compensation amount
 */
const DefermentsInput = ({
  inputs,
  onUpdateInput,
  onBack,
  onNext,
  onSkip,
}: DefermentsInputProps) => {
  // Deferments are usually 5-15% of budget
  const typicalMin = inputs.budget > 0 ? Math.round(inputs.budget * 0.05) : 50000;
  const typicalMax = inputs.budget > 0 ? Math.round(inputs.budget * 0.15) : 200000;
  const rangeLabel = inputs.budget > 0 
    ? `${formatCompactCurrency(typicalMin)} - ${formatCompactCurrency(typicalMax)}`
    : '5-15% of budget';

  return (
    <StackInputCard
      icon={Clock}
      title="Deferments"
      subtitle="Deferred compensation paid after investor recoupment"
      amountField="deferments"
      amountLabel="Total Deferments"
      amountPlaceholder="100,000"
      amountHint="Total deferred fees (producer, talent, etc.)"
      inputs={inputs}
      onUpdateInput={onUpdateInput}
      onBack={onBack}
      onNext={onNext}
      onSkip={onSkip}
      typicalRangeLabel={rangeLabel}
      helpText="Deferments are paid after equity investors recoup but before the 50/50 profit split."
    />
  );
};

export default DefermentsInput;
