import { PremiumInput } from "@/components/ui/premium-input";
import { WaterfallInputs, GuildState, formatCompactCurrency, calculateBreakeven } from "@/lib/waterfall";
import { CapitalSelections } from "./CapitalSelectStep";
import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AcquisitionStepProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  selections: CapitalSelections;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const AcquisitionStep = ({ inputs, guilds, selections, onUpdateInput }: AcquisitionStepProps) => {
  const [showHelp, setShowHelp] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const prevRevenue = useRef(inputs.revenue);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  // Use the algebraic breakeven calculation
  const breakeven = calculateBreakeven(inputs, guilds, selections);
  
  // Calculate cushion
  const cushion = inputs.revenue - breakeven;
  const isAboveBreakeven = cushion > 0;

  // Animate cushion value when revenue changes
  useEffect(() => {
    if (prevRevenue.current !== inputs.revenue) {
      const start = displayValue;
      const end = Math.abs(cushion);
      const duration = 500;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
        const current = start + (end - start) * eased;
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
      prevRevenue.current = inputs.revenue;
    }
  }, [inputs.revenue, cushion, displayValue]);

  const isCompleted = inputs.revenue > 0;

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

      {/* The Input - Premium */}
      <div className="space-y-6">
        <PremiumInput
          type="text"
          inputMode="numeric"
          value={formatValue(inputs.revenue)}
          onChange={(e) => onUpdateInput('revenue', parseValue(e.target.value))}
          placeholder="3,500,000"
          showCurrency
          label="Acquisition Price"
          example="$3,500,000"
          isCompleted={isCompleted}
          isNext={!isCompleted}
          containerClassName="py-2"
        />

        {/* Breakeven Reminder */}
        <div className="p-4 bg-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Your breakeven</span>
            <span className="font-mono text-lg text-gold">
              {Number.isFinite(breakeven) ? formatCompactCurrency(breakeven) : '∞'}
            </span>
          </div>

          {/* Status Indicator with Animation */}
          {inputs.revenue > 0 && Number.isFinite(breakeven) && (
            <div 
              className={`p-4 border transition-all duration-300 ${
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
                    <span className="font-mono animate-count-up">
                      {isAboveBreakeven 
                        ? `+${formatCompactCurrency(displayValue)} cushion` 
                        : `${formatCompactCurrency(-displayValue)} shortfall`
                      }
                    </span>
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
