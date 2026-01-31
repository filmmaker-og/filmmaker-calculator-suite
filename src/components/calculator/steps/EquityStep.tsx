import { PremiumInput } from "@/components/ui/premium-input";
import { PercentStepper } from "@/components/ui/percent-stepper";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { Info } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface EquityStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const EquityStep = ({ inputs, onUpdateInput }: EquityStepProps) => {
  const [showHelp, setShowHelp] = useState(false);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  // Calculate total repayment (principal + premium)
  const totalRepayment = inputs.equity * (1 + inputs.premium / 100);

  const isCompleted = inputs.equity > 0;

  return (
    <div className="step-enter">
      {/* Step Header */}
      <div className="text-center mb-8">
        <h2 className="font-bebas text-2xl tracking-[0.1em] text-foreground mb-2">
          Equity Investment
        </h2>
        <p className="text-muted-foreground text-sm">
          The cash that goes in last—and gets paid back first (after debt).
        </p>
      </div>

      {/* The Input Card */}
      <div className="bg-card border border-border p-5 space-y-5">
        <PremiumInput
          type="text"
          inputMode="numeric"
          value={formatValue(inputs.equity)}
          onChange={(e) => onUpdateInput('equity', parseValue(e.target.value))}
          placeholder="1,000,000"
          showCurrency
          label="Net Equity"
          example="$1,000,000"
          isCompleted={isCompleted}
          isNext={!isCompleted}
        />

        <PercentStepper
          value={inputs.premium}
          onChange={(value) => onUpdateInput('premium', value)}
          min={10}
          max={40}
          step={5}
          label="Preferred Return"
          standardValue={20}
          standardLabel="industry standard"
          isCompleted={true}
        />

        {/* Repayment Preview */}
        {inputs.equity > 0 && (
          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Investor Hurdle</span>
              <span className="font-mono text-lg text-gold">{formatCompactCurrency(totalRepayment)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Investors must receive this amount before profits split 50/50.
            </p>
          </div>
        )}
      </div>

      {/* Inline Helper */}
      <div className="mt-6">
        <Collapsible open={showHelp} onOpenChange={setShowHelp}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-gold hover:text-gold-highlight transition-colors">
            <Info className="w-4 h-4" />
            <span>What's a preferred return?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 p-4 bg-card border border-border text-sm text-muted-foreground leading-relaxed animate-fade-in">
            <p className="mb-3">
              The preferred return (or "pref") is the hurdle rate investors must receive before profits are split with the producer.
            </p>
            <ul className="space-y-2 text-xs">
              <li>• <span className="text-foreground font-semibold">15-20%</span> — Standard for most indie films</li>
              <li>• <span className="text-foreground font-semibold">25%+</span> — Higher risk projects or first-time filmmakers</li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default EquityStep;
