import { CreditCard } from "lucide-react";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import StackInputCard from "./StackInputCard";

interface GapMezzInputProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

/**
 * GapMezzInput - Collect gap/mezzanine debt amount + interest rate
 */
const GapMezzInput = ({
  inputs,
  onUpdateInput,
  onBack,
  onNext,
  onSkip,
}: GapMezzInputProps) => {
  // Calculate typical range based on budget
  const typicalMin = inputs.budget > 0 ? Math.round(inputs.budget * 0.1) : 200000;
  const typicalMax = inputs.budget > 0 ? Math.round(inputs.budget * 0.25) : 500000;
  const rangeLabel = inputs.budget > 0 
    ? `${formatCompactCurrency(typicalMin)} - ${formatCompactCurrency(typicalMax)}`
    : '10-25% of budget';

  return (
    <StackInputCard
      icon={CreditCard}
      title="Gap / Mezz Debt"
      subtitle="Bridge loan between senior debt and equity"
      amountField="mezzanineDebt"
      amountLabel="Loan Principal"
      amountPlaceholder="200,000"
      amountHint="How much gap financing do you need?"
      rateConfig={{
        field: 'mezzanineRate',
        label: 'Interest + Fees',
        min: 10,
        max: 25,
        step: 1,
        standardValue: 18,
        standardLabel: 'typical gap rate',
      }}
      inputs={inputs}
      onUpdateInput={onUpdateInput}
      onBack={onBack}
      onNext={onNext}
      onSkip={onSkip}
      typicalRangeLabel={rangeLabel}
      helpText="Gap debt is repaid after senior debt but before equity investors."
    />
  );
};

export default GapMezzInput;
