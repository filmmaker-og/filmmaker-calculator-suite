import { Input } from "@/components/ui/input";
import { WaterfallInputs, GuildState, formatCompactCurrency } from "@/lib/waterfall";
import { CapitalSelections } from "./CapitalSelectStep";
import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

  // Calculate breakeven (same logic as BreakevenStep)
  const hypotheticalRevenue = inputs.budget * 1.2;
  const salesFeeAmount = hypotheticalRevenue * (inputs.salesFee / 100);
  const camAmount = hypotheticalRevenue * 0.01;
  const marketingAmount = inputs.salesExp;
  const guildsPct = (guilds.sag ? 0.045 : 0) + (guilds.wga ? 0.012 : 0) + (guilds.dga ? 0.012 : 0);
  const guildsAmount = hypotheticalRevenue * guildsPct;
  const offTopTotal = salesFeeAmount + camAmount + marketingAmount + guildsAmount;

  const seniorDebtRepay = selections.seniorDebt ? inputs.debt * (1 + inputs.seniorDebtRate / 100) : 0;
  const mezzDebtRepay = selections.gapLoan ? inputs.mezzanineDebt * (1 + inputs.mezzanineRate / 100) : 0;
  const totalDebtRepay = seniorDebtRepay + mezzDebtRepay;
  const equityRepay = selections.equity ? inputs.equity * (1 + inputs.premium / 100) : 0;
  const creditsOffset = selections.taxCredits ? inputs.credits : 0;

  const breakeven = offTopTotal + totalDebtRepay + equityRepay - creditsOffset;
  
  // Calculate cushion
  const cushion = inputs.revenue - breakeven;
  const isAboveBreakeven = cushion > 0;

  return (
    <div className="step-enter">
      {/* The Question */}
      <div className="text-center mb-8">
        <h2 className="font-bebas text-2xl tracking-[0.1em] text-foreground mb-2">
          What's the streamer
          <br />
          <span className="text-gold">offering?</span>
        </h2>
        <p className="text-muted-foreground text-sm">
          This is your gross revenue. The total acquisition price.
        </p>
      </div>

      {/* The Input */}
      <div className="space-y-6">
        <div className="relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 font-mono text-2xl text-muted-foreground">$</span>
          <Input
            type="text"
            inputMode="numeric"
            value={formatValue(inputs.revenue)}
            onChange={(e) => onUpdateInput('revenue', parseValue(e.target.value))}
            placeholder="3,500,000"
            className="pl-14 h-20 text-3xl font-mono text-foreground text-right rounded-none border-border focus:border-gold focus:ring-0 bg-card"
            onFocus={(e) => e.target.select()}
          />
        </div>

        {/* Breakeven Reminder */}
        <div className="p-4 bg-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Your breakeven</span>
            <span className="font-mono text-lg text-gold">{formatCompactCurrency(breakeven)}</span>
          </div>

          {/* Status Indicator */}
          {inputs.revenue > 0 && (
            <div 
              className={`p-4 border ${
                isAboveBreakeven 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                {isAboveBreakeven ? (
                  <TrendingUp className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400 flex-shrink-0" />
                )}
                <div>
                  <p className={`text-sm font-semibold ${isAboveBreakeven ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isAboveBreakeven ? 'ABOVE BREAKEVEN' : 'BELOW BREAKEVEN'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isAboveBreakeven 
                      ? `+${formatCompactCurrency(cushion)} cushion` 
                      : `${formatCompactCurrency(cushion)} shortfall`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inline Helper */}
      <div className="mt-4">
        <Collapsible open={showHelp} onOpenChange={setShowHelp}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-gold hover:text-gold-highlight transition-colors">
            <Info className="w-4 h-4" />
            <span>What's a typical acquisition price?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 p-4 bg-card border border-border text-sm text-muted-foreground leading-relaxed animate-fade-in">
            <p>
              In streamer buyouts (Netflix, Amazon, Apple), the acquisition is typically:
            </p>
            <ul className="mt-2 space-y-1 text-xs">
              <li>• <span className="text-foreground">100-110%</span> of budget = baseline deal</li>
              <li>• <span className="text-foreground">115-130%</span> of budget = strong deal</li>
              <li>• <span className="text-foreground">130%+</span> of budget = exceptional (bidding war)</li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default AcquisitionStep;
