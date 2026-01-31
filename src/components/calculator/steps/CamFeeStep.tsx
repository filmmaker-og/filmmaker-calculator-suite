import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { Info, Building2 } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CamFeeStepProps {
  inputs: WaterfallInputs;
}

const CamFeeStep = ({ inputs }: CamFeeStepProps) => {
  const [showHelp, setShowHelp] = useState(false);

  // Calculate impact based on a hypothetical 1.2x deal
  const hypotheticalRevenue = inputs.budget * 1.2;
  const camFeeAmount = hypotheticalRevenue * 0.01;

  return (
    <div className="step-enter">
      {/* The Card */}
      <div className="bg-card border border-border p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-muted flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-bebas text-xl tracking-wider text-gold mb-2">CAM FEE</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              <span className="text-foreground font-semibold">Collection Account Management.</span> The bank that holds your money takes their cut first. 
            </p>
          </div>
        </div>

        {/* Fixed Rate Display */}
        <div className="flex items-center justify-between py-4 border-y border-border">
          <span className="text-muted-foreground">Fixed rate</span>
          <span className="font-mono text-2xl text-foreground">1%</span>
        </div>

        <p className="text-xs text-muted-foreground/70">
          Non-negotiable. Industry standard for escrow and payment administration.
        </p>

        {/* Impact Display */}
        {inputs.budget > 0 && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">On a typical 1.2x deal:</span>
              <span className="font-mono text-xl text-red-400">
                -{formatCompactCurrency(camFeeAmount)}
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
            <span>Why does the bank get paid first?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 p-4 bg-card border border-border text-sm text-muted-foreground leading-relaxed animate-fade-in">
            <p>
              The Collection Account Manager (CAM) is a neutral third party that receives all revenue and distributes it according to the waterfall. They ensure lenders, investors, and talent get paid correctly.
            </p>
            <p className="mt-2 text-xs text-muted-foreground/70">
              Common CAMs include Freeway Entertainment, Fintage House, and major banks with entertainment divisions.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Running Total Hint */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground/50 uppercase tracking-widest">
          And that's not all...
        </p>
      </div>
    </div>
  );
};

export default CamFeeStep;
