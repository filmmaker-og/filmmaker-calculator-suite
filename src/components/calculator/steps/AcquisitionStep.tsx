import { PremiumInput } from "@/components/ui/premium-input";
import { WaterfallInputs, GuildState, formatCompactCurrency, calculateBreakeven } from "@/lib/waterfall";
import { CapitalSelections } from "./CapitalSelectStep";
import { Info, Target, DollarSign, Zap, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import StandardStepLayout from "../StandardStepLayout";

interface AcquisitionStepProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  selections: CapitalSelections;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const AcquisitionStep = ({ inputs, guilds, selections, onUpdateInput }: AcquisitionStepProps) => {
  const [showHelp, setShowHelp] = useState(false);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  const breakeven = calculateBreakeven(inputs, guilds, selections);
  const cushion = inputs.revenue - breakeven;
  const isAboveBreakeven = cushion > 0;
  const isCompleted = inputs.revenue > 0;

  return (
    <StandardStepLayout
      icon={Target}
      title="What's the streamer"
      titleHighlight="offering you?"
      subtitle="This is the moment of truth. Enter the total acquisition price."
      sectionLabel="The Offer"
      sectionIcon={DollarSign}
      isCompleted={isCompleted}
      contextCard={
        // Breakeven context card
        <div className="glass-card-gold p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-gold" />
              <div>
                <span className="text-xs uppercase tracking-wider text-gold/70 block">Your breakeven</span>
                <span className="font-mono text-lg text-gold font-semibold">
                  {Number.isFinite(breakeven) ? formatCompactCurrency(breakeven) : 'Calculating...'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-white/30 block">Minimum to recoup</span>
              <span className="text-xs text-white/50">all costs + returns</span>
            </div>
          </div>
        </div>
      }
      quickReference={
        <>
          {/* Status indicator if revenue entered */}
          {inputs.revenue > 0 && Number.isFinite(breakeven) && (
            <div className="mb-4">
              <div
                className={`p-5 border transition-all ${
                  isAboveBreakeven
                    ? 'border-gold/30 bg-gold/5'
                    : 'border-gold/20 bg-gold/[0.02]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 flex items-center justify-center border ${
                      isAboveBreakeven
                        ? 'border-gold/40 bg-gold/10'
                        : 'border-gold/20 bg-gold/5'
                    }`}
                  >
                    {isAboveBreakeven ? (
                      <TrendingUp className="w-6 h-6 text-gold" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-gold/50" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p
                      className={`text-sm font-bold tracking-wide ${
                        isAboveBreakeven ? 'text-gold' : 'text-gold/50'
                      }`}
                    >
                      {isAboveBreakeven ? 'ABOVE BREAKEVEN' : 'BELOW BREAKEVEN'}
                    </p>
                    <p className="text-sm text-white/60 font-mono">
                      {isAboveBreakeven
                        ? `+${formatCompactCurrency(Math.abs(cushion))} cushion`
                        : `${formatCompactCurrency(Math.abs(cushion))} shortfall`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Typical ranges */}
          <div className="py-4 px-5 bg-[#0A0A0A] border border-[#1A1A1A]">
            <p className="text-xs text-white/40 text-center mb-3">Typical acquisition ranges</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <span className="text-xs text-white/50 font-mono block">100-110%</span>
                <span className="text-[10px] text-white/30">baseline</span>
              </div>
              <div className="border-x border-[#1A1A1A] px-2">
                <span className="text-xs text-gold/70 font-mono block">115-130%</span>
                <span className="text-[10px] text-gold/50">strong</span>
              </div>
              <div>
                <span className="text-xs text-gold font-mono block">130%+</span>
                <span className="text-[10px] text-gold/70">exceptional</span>
              </div>
            </div>
          </div>
        </>
      }
      helpContent={
        <Collapsible open={showHelp} onOpenChange={setShowHelp}>
          <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 text-sm text-gold/70 hover:text-gold transition-colors py-3">
            <Info className="w-4 h-4" />
            <span>What's a typical acquisition price?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="glass-card-gold p-5 animate-reveal-up">
              <p className="text-sm text-white/70 mb-3 leading-relaxed">
                In streamer buyouts (Netflix, Amazon, Apple), the acquisition is typically
                expressed as a <span className="text-gold font-semibold">multiple of budget</span>.
              </p>
              <div className="premium-divider mb-3" />
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/40">Budget x 1.0-1.1</span>
                  <span className="text-white/60">Baseline deal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gold/70">Budget x 1.15-1.3</span>
                  <span className="text-gold/60">Strong deal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gold">Budget x 1.3+</span>
                  <span className="text-gold/80">Bidding war</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      }
    >
      <PremiumInput
        type="text"
        inputMode="numeric"
        value={formatValue(inputs.revenue)}
        onChange={(e) => onUpdateInput('revenue', parseValue(e.target.value))}
        placeholder="3,500,000"
        showCurrency
        label="Acquisition Price"
        example="$3,500,000"
        actionHint="Enter the total offer amount"
        isCompleted={isCompleted}
        isNext={!isCompleted}
        isHero={true}
      />
    </StandardStepLayout>
  );
};

export default AcquisitionStep;
