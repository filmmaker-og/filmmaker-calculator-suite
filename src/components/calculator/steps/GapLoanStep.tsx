import { PremiumInput } from "@/components/ui/premium-input";
import { PercentStepper } from "@/components/ui/percent-stepper";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { Info } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface GapLoanStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const GapLoanStep = ({ inputs, onUpdateInput }: GapLoanStepProps) => {
  const [showHelp, setShowHelp] = useState(false);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  // Calculate total repayment
  const totalRepayment = inputs.mezzanineDebt * (1 + inputs.mezzanineRate / 100);

  const isCompleted = inputs.mezzanineDebt > 0;

  return (
    <div className="step-enter">
      {/* Step Header */}
      <div className="text-center mb-8">
        <h2 className="font-bebas text-2xl tracking-[0.1em] text-foreground mb-2">
          Gap / Bridge Loan
        </h2>
        <p className="text-muted-foreground text-sm">
          Higher-risk debt to bridge the financing gap.
        </p>
      </div>

      {/* The Input Card */}
      <div className="bg-card border border-border p-5 space-y-5">
        <PremiumInput
          type="text"
          inputMode="numeric"
          value={formatValue(inputs.mezzanineDebt)}
          onChange={(e) => onUpdateInput('mezzanineDebt', parseValue(e.target.value))}
          placeholder="200,000"
          showCurrency
          label="Principal Amount"
          example="$200,000"
          isCompleted={isCompleted}
          isNext={!isCompleted}
        />

        <PercentStepper
          value={inputs.mezzanineRate}
          onChange={(value) => onUpdateInput('mezzanineRate', value)}
          min={10}
          max={25}
          step={1}
          label="Interest + Fees"
          standardValue={18}
          standardLabel="typical gap rate"
          isCompleted={true}
        />

        {/* Repayment Preview */}
        {inputs.mezzanineDebt > 0 && (
          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Total Repayment</span>
              <span className="font-mono text-lg text-foreground">{formatCompactCurrency(totalRepayment)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Inline Helper */}
      <div className="mt-6">
        <Collapsible open={showHelp} onOpenChange={setShowHelp}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-gold hover:text-gold-highlight transition-colors">
            <Info className="w-4 h-4" />
            <span>What is gap financing?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 p-4 bg-card border border-border text-sm text-muted-foreground leading-relaxed animate-fade-in">
            <p className="mb-3">
              Gap loans bridge the difference when presales don't cover the full budget. They're subordinate to senior debt but ahead of equity.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Because of the higher risk, gap lenders typically charge 15-20% interest plus fees.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default GapLoanStep;
