import { PremiumInput } from "@/components/ui/premium-input";
import { WaterfallInputs } from "@/lib/waterfall";
import { Info } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TaxCreditsStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const TaxCreditsStep = ({ inputs, onUpdateInput }: TaxCreditsStepProps) => {
  const [showHelp, setShowHelp] = useState(false);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  const isCompleted = inputs.credits > 0;

  return (
    <div className="step-enter">
      {/* Step Header */}
      <div className="text-center mb-8">
        <h2 className="font-bebas text-2xl tracking-[0.1em] text-foreground mb-2">
          Tax Credits &<br />
          <span className="text-gold">Incentives</span>
        </h2>
        <p className="text-muted-foreground text-sm">
          Government money that reduces your investor burden.
        </p>
      </div>

      {/* The Input Card */}
      <div className="bg-card border border-border p-5 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bebas text-base tracking-wider text-foreground">TAX CREDIT VALUE</h3>
        </div>
        
        <PremiumInput
          type="text"
          inputMode="numeric"
          value={formatValue(inputs.credits)}
          onChange={(e) => onUpdateInput('credits', parseValue(e.target.value))}
          placeholder="400,000"
          showCurrency
          example="$400,000"
          isCompleted={isCompleted}
          isNext={!isCompleted}
        />

        {/* Context */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="text-emerald-400 font-semibold">+</span> This amount offsets your capital requirements, reducing what investors need to recoup.
          </p>
        </div>
      </div>

      {/* Inline Helper */}
      <div className="mt-6">
        <Collapsible open={showHelp} onOpenChange={setShowHelp}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-gold hover:text-gold-highlight transition-colors">
            <Info className="w-4 h-4" />
            <span>What are typical tax credit rates?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 p-4 bg-card border border-border text-sm text-muted-foreground leading-relaxed animate-fade-in">
            <p className="mb-3">Government incentives vary by location:</p>
            <ul className="space-y-2 text-xs">
              <li>• <span className="text-foreground font-semibold">UK</span> — 25% of qualifying spend</li>
              <li>• <span className="text-foreground font-semibold">Georgia, USA</span> — 20-30% transferable credit</li>
              <li>• <span className="text-foreground font-semibold">New Mexico</span> — 25-35% refundable credit</li>
              <li>• <span className="text-foreground font-semibold">Ireland</span> — 32% on eligible expenditure</li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default TaxCreditsStep;
