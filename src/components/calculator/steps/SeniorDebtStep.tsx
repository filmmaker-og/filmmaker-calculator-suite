import { PremiumInput } from "@/components/ui/premium-input";
import { PercentStepper } from "@/components/ui/percent-stepper";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { Info } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SeniorDebtStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const SeniorDebtStep = ({ inputs, onUpdateInput }: SeniorDebtStepProps) => {
  const [showHelp, setShowHelp] = useState(false);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  // Calculate total repayment
  const totalRepayment = inputs.debt * (1 + inputs.seniorDebtRate / 100);

  const isCompleted = inputs.debt > 0;

  return (
    <div className="step-enter">
      {/* Step Header */}
      <div className="text-center mb-8">
        <h2 className="font-bebas text-2xl tracking-[0.1em] text-foreground mb-2">
          Senior Debt
        </h2>
        <p className="text-muted-foreground text-sm">
          First-position loan. Gets paid back before anyone else.
        </p>
      </div>

      {/* The Input Card */}
      <div className="bg-card border border-border p-5 space-y-5">
        <PremiumInput
          type="text"
          inputMode="numeric"
          value={formatValue(inputs.debt)}
          onChange={(e) => onUpdateInput('debt', parseValue(e.target.value))}
          placeholder="600,000"
          showCurrency
          label="Principal Amount"
          example="$600,000"
          isCompleted={isCompleted}
          isNext={!isCompleted}
        />

        <PercentStepper
          value={inputs.seniorDebtRate}
          onChange={(value) => onUpdateInput('seniorDebtRate', value)}
          min={5}
          max={20}
          step={1}
          label="Interest + Fees"
          standardValue={10}
          standardLabel="typical bank rate"
          isCompleted={true}
        />

        {/* Repayment Preview */}
        {inputs.debt > 0 && (
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
            <span>What is senior debt?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 p-4 bg-card border border-border text-sm text-muted-foreground leading-relaxed animate-fade-in">
            <p className="mb-3">
              Senior debt is secured against pre-sales or tax credit receivables. It's the safest position in the capital stack.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Banks and specialized film lenders typically offer 8-12% interest rates for productions with solid collateral.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default SeniorDebtStep;
