import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { Info } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SalesAgentStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const SalesAgentStep = ({ inputs, onUpdateInput }: SalesAgentStepProps) => {
  const [showHelp, setShowHelp] = useState(false);

  // Calculate impact based on a hypothetical 1.2x deal
  const hypotheticalRevenue = inputs.budget * 1.2;
  const salesFeeAmount = hypotheticalRevenue * (inputs.salesFee / 100);

  return (
    <div className="step-enter">
      {/* The Ominous Intro */}
      <div className="text-center mb-8">
        <p className="text-muted-foreground text-sm mb-2 uppercase tracking-widest">Before you see a dime...</p>
        <h2 className="font-bebas text-2xl tracking-[0.1em] text-foreground">
          These people <span className="text-gold">get paid first</span>
        </h2>
      </div>

      {/* The Card */}
      <div className="bg-card border border-border p-6 space-y-6">
        <div>
          <h3 className="font-bebas text-xl tracking-wider text-gold mb-2">SALES AGENT</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The middleman who finds your buyer. They take a percentage off the top of <span className="text-foreground">all revenue</span>.
          </p>
        </div>

        {/* Rate Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Your rate</span>
            <span className="font-mono text-2xl text-gold">{inputs.salesFee}%</span>
          </div>
          <Slider
            value={[inputs.salesFee]}
            onValueChange={(value) => onUpdateInput('salesFee', value[0])}
            min={0}
            max={25}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span className="text-muted-foreground/50">Industry: 10-20%</span>
            <span>25%</span>
          </div>
        </div>

        {/* Impact Display */}
        {inputs.budget > 0 && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">On a typical 1.2x deal:</span>
              <span className="font-mono text-xl text-red-400">
                -{formatCompactCurrency(salesFeeAmount)}
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
            <span>What do sales agents actually do?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 p-4 bg-card border border-border text-sm text-muted-foreground leading-relaxed animate-fade-in">
            <p>
              Sales agents represent your film at markets (AFM, Cannes, Berlin) and negotiate with distributors worldwide. They handle contracts, deliverables, and collections.
            </p>
            <p className="mt-2 text-xs text-muted-foreground/70">
              Typical domestic rate: 10-15%. International: 15-25%. Exclusive vs. non-exclusive affects leverage.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default SalesAgentStep;
