import { Users } from "lucide-react";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import StackInputCard from "./StackInputCard";

interface EquityInputProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

/**
 * EquityInput - Collect equity amount + preferred return
 */
const EquityInput = ({
  inputs,
  onUpdateInput,
  onBack,
  onNext,
  onSkip,
}: EquityInputProps) => {
  // Calculate typical range based on budget
  const typicalMin = inputs.budget > 0 ? Math.round(inputs.budget * 0.3) : 500000;
  const typicalMax = inputs.budget > 0 ? Math.round(inputs.budget * 0.6) : 2000000;
  const rangeLabel = inputs.budget > 0 
    ? `${formatCompactCurrency(typicalMin)} - ${formatCompactCurrency(typicalMax)}`
    : '30-60% of budget';

  return (
    <StackInputCard
      icon={Users}
      title="Equity Investment"
      subtitle="Cash investment with preferred return"
      amountField="equity"
      amountLabel="Net Equity"
      amountPlaceholder="1,000,000"
      amountHint="How much equity capital are you raising?"
      rateConfig={{
        field: 'premium',
        label: 'Preferred Return',
        min: 10,
        max: 40,
        step: 5,
        standardValue: 20,
        standardLabel: 'industry standard',
      }}
      inputs={inputs}
      onUpdateInput={onUpdateInput}
      onBack={onBack}
      onNext={onNext}
      onSkip={onSkip}
      showSkip={false}  // Equity is usually required
      typicalRangeLabel={rangeLabel}
      helpText="Equity investors get principal + preferred return before the 50/50 profit split."
    />
  );
};

export default EquityInput;
