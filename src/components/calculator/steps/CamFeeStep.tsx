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
      {/* Step Header with icon */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
              filter: 'blur(15px)',
              transform: 'scale(2)',
            }}
          />
          <div className="relative w-14 h-14 border border-gold/30 bg-gold/5 flex items-center justify-center">
            <Building2 className="w-7 h-7 text-gold" />
          </div>
        </div>

        <p className="text-white/40 text-xs mb-2 uppercase tracking-widest">Before anyone else...</p>
        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2">
          The CAM <span className="text-gold">gets paid FIRST</span>
        </h2>
        <p className="text-white/50 text-sm max-w-xs mx-auto">
          The bank holding your money takes 1%. Non-negotiable.
        </p>
      </div>

      {/* The Card with matte styling */}
      <div className="matte-section overflow-hidden">
        {/* Section header */}
        <div className="matte-section-header px-5 py-3">
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
            Collection Account Management
          </span>
        </div>

        {/* Fixed Rate Display */}
        <div className="p-5 border-b border-[#1A1A1A]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">Fixed industry rate</p>
              <p className="text-xs text-white/30 mt-1">Applied to all revenue</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-4xl text-gold font-semibold">1%</span>
            </div>
          </div>
        </div>

        {/* Context */}
        <div className="p-5 border-b border-[#1A1A1A]">
          <p className="text-sm text-white/50 leading-relaxed">
            A neutral third party ensures everyone—lenders, investors, talent—gets paid correctly according to the waterfall.
          </p>
        </div>

        {/* Impact Display */}
        {inputs.budget > 0 && (
          <div className="bg-[#0A0A0A]/50">
            <div className="p-5">
              <p className="text-xs text-white/30 uppercase tracking-wider mb-3">
                Impact on a typical 1.2x deal
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/40">CAM fee (1%)</span>
                <span className="font-mono text-xl text-red-400 font-semibold">
                  -{formatCompactCurrency(camFeeAmount)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between py-3 border-t border-[#1A1A1A]">
            <span className="text-xs text-white/30">Common CAMs</span>
            <span className="text-xs text-white/50">Freeway, Fintage House</span>
          </div>
        </div>
      </div>

      {/* Inline Helper */}
      <div className="mt-6">
        <Collapsible open={showHelp} onOpenChange={setShowHelp}>
          <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 text-sm text-gold/70 hover:text-gold transition-colors py-3">
            <Info className="w-4 h-4" />
            <span>Why does the bank get paid first?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="glass-card-gold p-5 animate-reveal-up">
              <p className="text-sm text-white/70 mb-3 leading-relaxed">
                The Collection Account Manager (CAM) receives
                <span className="text-gold font-semibold"> all revenue first</span> and distributes it according to the waterfall.
              </p>
              <div className="premium-divider mb-3" />
              <p className="text-xs text-white/50">
                They ensure lenders, investors, and talent get paid correctly—a neutral referee for your deal.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default CamFeeStep;
