import { Landmark } from "lucide-react";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import StackInputCard from "./StackInputCard";

interface SeniorDebtInputProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}

/**
 * SeniorDebtInput - Collect senior debt amount + interest rate
 */
const SeniorDebtInput = ({
  inputs,
  onUpdateInput,
  onBack,
  onNext,
  onSkip,
}: SeniorDebtInputProps) => {
  // Calculate typical range based on budget
  const typicalMin = inputs.budget > 0 ? Math.round(inputs.budget * 0.2) : 400000;
  const typicalMax = inputs.budget > 0 ? Math.round(inputs.budget * 0.4) : 800000;
  const rangeLabel = inputs.budget > 0 
    ? `${formatCompactCurrency(typicalMin)} - ${formatCompactCurrency(typicalMax)}`
    : '20-40% of budget';

  return (
    <StackInputCard
      icon={Landmark}
      title="Senior Debt"
      subtitle="First-position bank loan with collateral"
      amountField="debt"
      amountLabel="Loan Principal"
      amountPlaceholder="600,000"
      amountHint="How much are you borrowing?"
      rateConfig={{
        field: 'seniorDebtRate',
        label: 'Interest + Fees',
        min: 5,
        max: 20,
        step: 1,
        standardValue: 10,
        standardLabel: 'typical bank rate',
      }}
      inputs={inputs}
      onUpdateInput={onUpdateInput}
      onBack={onBack}
      onNext={onNext}
      onSkip={onSkip}
      typicalRangeLabel={rangeLabel}
      helpText="Senior debt gets repaid after tax credits but before gap/mezz and equity."
    />
  );
};

export default SeniorDebtInput;
