import { PremiumInput } from "@/components/ui/premium-input";
import { WaterfallInputs } from "@/lib/waterfall";
import { Info } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface BudgetStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const BudgetStep = ({ inputs, onUpdateInput }: BudgetStepProps) => {
  const [showHelp, setShowHelp] = useState(false);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  const isCompleted = inputs.budget > 0;

  return (
    <div className="step-enter min-h-[50vh] flex flex-col justify-center">
      {/* The Question */}
      <div className="text-center mb-10">
        <h2 className="font-bebas text-3xl tracking-[0.1em] text-foreground mb-3">
          What did it cost to make
          <br />
          <span className="text-gold">your film?</span>
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          All-in. Production + post + delivery. The whole thing.
        </p>
      </div>

      {/* The Input - Premium Style */}
      <div className="space-y-4">
        <PremiumInput
          type="text"
          inputMode="numeric"
          value={formatValue(inputs.budget)}
          onChange={(e) => onUpdateInput('budget', parseValue(e.target.value))}
          placeholder="2,000,000"
          showCurrency
          label="Negative Cost"
          example="$2,000,000"
          isCompleted={isCompleted}
          isNext={!isCompleted}
          containerClassName="py-2"
        />

        {/* Inline Helper */}
        <Collapsible open={showHelp} onOpenChange={setShowHelp}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-gold hover:text-gold-highlight transition-colors mx-auto">
            <Info className="w-4 h-4" />
            <span>What's "Negative Cost"?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 p-4 bg-card border border-border text-sm text-muted-foreground leading-relaxed animate-fade-in">
            <p className="mb-2">
              <span className="text-gold font-semibold">Negative Cost</span> is the total capital required to produce the master and deliver to distributors.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Includes all Above-the-Line and Below-the-Line expenses. Excludes marketing, sales fees, and financing costs.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default BudgetStep;
