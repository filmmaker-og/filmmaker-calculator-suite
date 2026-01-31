import { PremiumInput } from "@/components/ui/premium-input";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { Info, Megaphone } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface MarketingStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const MarketingStep = ({ inputs, onUpdateInput }: MarketingStepProps) => {
  const [showHelp, setShowHelp] = useState(false);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  const isCompleted = inputs.salesExp > 0;

  return (
    <div className="step-enter">
      {/* The Card */}
      <div className="bg-card border border-border p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-muted flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-bebas text-xl tracking-wider text-gold mb-2">MARKETING & DELIVERY</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Festivals. Markets. Posters. Deliverables. <span className="text-foreground">It adds up fast.</span>
            </p>
          </div>
        </div>

        {/* Premium Input */}
        <PremiumInput
          type="text"
          inputMode="numeric"
          value={formatValue(inputs.salesExp)}
          onChange={(e) => onUpdateInput('salesExp', parseValue(e.target.value))}
          placeholder="75,000"
          showCurrency
          label="Marketing Cap"
          example="$75,000"
          isCompleted={isCompleted}
          isNext={!isCompleted}
          hint={
            <p className="text-xs text-muted-foreground/70">
              This comes off before anyone sees profit.
            </p>
          }
        />

        {/* Impact Display */}
        {inputs.salesExp > 0 && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Deducted before profit:</span>
              <span className="font-mono text-xl text-red-400">
                -{formatCompactCurrency(inputs.salesExp)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Inline Helper */}
      <div className="mt-4">
        <Collapsible open={showHelp} onOpenChange={setShowHelp}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-gold hover:text-gold-highlight transition-colors">
            <Info className="w-4 h-4" />
            <span>What counts as marketing expenses?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 p-4 bg-card border border-border text-sm text-muted-foreground leading-relaxed animate-fade-in">
            <ul className="space-y-2">
              <li>• <span className="text-foreground">Festival fees</span> - Sundance, SXSW, Toronto submissions</li>
              <li>• <span className="text-foreground">Market attendance</span> - AFM, Cannes, Berlin booths</li>
              <li>• <span className="text-foreground">Deliverables</span> - DCP, HDR master, M&E tracks</li>
              <li>• <span className="text-foreground">Promo materials</span> - Posters, trailers, screeners</li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default MarketingStep;
