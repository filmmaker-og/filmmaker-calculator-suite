import { Receipt } from "lucide-react";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import StackInputCard from "./StackInputCard";

interface TaxCreditsInputProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

/**
 * TaxCreditsInput - Collect tax credit amount
 */
const TaxCreditsInput = ({
  inputs,
  onUpdateInput,
  onBack,
  onNext,
  onSkip,
}: TaxCreditsInputProps) => {
  // Calculate typical range based on budget
  const typicalMin = inputs.budget > 0 ? Math.round(inputs.budget * 0.2) : 400000;
  const typicalMax = inputs.budget > 0 ? Math.round(inputs.budget * 0.35) : 1000000;
  const rangeLabel = inputs.budget > 0 
    ? `${formatCompactCurrency(typicalMin)} - ${formatCompactCurrency(typicalMax)}`
    : '20-35% of budget';

  return (
    <StackInputCard
      icon={Receipt}
      title="Tax Credits"
      subtitle="Government incentives reduce your capital requirements"
      amountField="credits"
      amountLabel="Credit Value"
      amountPlaceholder="400,000"
      amountHint="Enter your expected tax credit rebate"
      inputs={inputs}
      onUpdateInput={onUpdateInput}
      onBack={onBack}
      onNext={onNext}
      onSkip={onSkip}
      typicalRangeLabel={rangeLabel}
      helpText="Tax credits are repaid first in the waterfall—lowest risk position."
    />
  );
};

export default TaxCreditsInput;
