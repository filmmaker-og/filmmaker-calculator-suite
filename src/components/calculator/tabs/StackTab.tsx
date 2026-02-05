import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { Minus, Plus } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import { cn } from "@/lib/utils";
import ChapterCard from "../ChapterCard";
import GlossaryTrigger, { GLOSSARY } from "../GlossaryTrigger";

interface StackTabProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const StackTab = ({ inputs, onUpdateInput }: StackTabProps) => {
  const haptics = useHaptics();

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  const adjustRate = (field: 'seniorDebtRate' | 'mezzanineRate' | 'premium', delta: number, min: number, max: number) => {
    haptics.light();
    const current = inputs[field] || 0;
    const newValue = Math.min(max, Math.max(min, current + delta));
    onUpdateInput(field, newValue);
  };

  const totalCapital = inputs.credits + inputs.debt + inputs.mezzanineDebt + inputs.equity;
  const gapPercent = inputs.budget > 0 ? (totalCapital / inputs.budget) * 100 : 0;

  // Helper component for capital source cards
  const CapitalSourceCard = ({
    label,
    glossary,
    value,
    field,
    rateField,
    rateLabel,
    rateMin,
    rateMax,
    rateDelta,
  }: {
    label: string;
   glossary: {
     term: string;
     title: string;
     description: string;
     details?: React.ReactNode;
   };
    value: number;
    field: keyof WaterfallInputs;
    rateField?: 'seniorDebtRate' | 'mezzanineRate' | 'premium';
    rateLabel?: string;
    rateMin?: number;
    rateMax?: number;
    rateDelta?: number;
  }) => {
    const hasValue = value > 0;
    const rateValue = rateField ? inputs[rateField] : 0;

    return (
      <div
        className={cn(
          "border overflow-hidden transition-all",
          hasValue ? "border-gold-muted bg-gold-subtle" : "border-border-default bg-bg-card"
        )}
        style={{ borderRadius: 'var(--radius-lg)' }}
      >
        <div className="p-4 flex items-center justify-between border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-dim">{label}</span>
            <GlossaryTrigger {...glossary} />
          </div>
          {hasValue && <span className="text-xs text-gold">✓</span>}
        </div>

        <div className="p-4 space-y-4">
          <div
            className={cn(
              "flex items-center border transition-all",
              hasValue ? "bg-bg-surface border-border-active" : "bg-bg-surface border-border-default"
            )}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <span className="pl-4 pr-2 font-mono text-text-dim">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={formatValue(value)}
              onChange={(e) => onUpdateInput(field, parseValue(e.target.value))}
              placeholder="0"
              className="flex-1 bg-transparent py-3 pr-4 outline-none font-mono text-[22px] text-text-primary text-right placeholder:text-text-dim tabular-nums"
            />
          </div>

          {/* Rate adjuster - only show when value > 0 */}
          {hasValue && rateField && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-text-dim">{rateLabel}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustRate(rateField, -(rateDelta || 1), rateMin || 0, rateMax || 50)}
                  disabled={(rateValue as number) <= (rateMin || 0)}
                  className="w-8 h-8 flex items-center justify-center border border-border-default rounded-md text-text-dim hover:text-text-primary transition-colors disabled:opacity-30"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono text-sm text-text-primary w-12 text-center tabular-nums">
                  {rateValue}%
                </span>
                <button
                  onClick={() => adjustRate(rateField, rateDelta || 1, rateMin || 0, rateMax || 50)}
                  disabled={(rateValue as number) >= (rateMax || 50)}
                  className="w-8 h-8 flex items-center justify-center border border-border-default rounded-md text-text-dim hover:text-text-primary transition-colors disabled:opacity-30"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-8">
      <ChapterCard
        chapter="02"
        title="STACK"
        isActive={totalCapital > 0}
        glossaryTrigger={
          <GlossaryTrigger {...GLOSSARY.capitalStack} />
        }
      >
        <p className="text-sm text-text-dim mb-6">
          Enter all financing sources. Leave blank if not used.
        </p>

        <div className="space-y-3">
          {/* Tax Credits */}
          <CapitalSourceCard
            label="Tax Credits"
            glossary={{
              term: "Tax Credits",
              title: "TAX CREDITS",
              description: "Government incentives that reduce the cost of production. Usually the first source of capital, secured against the budget.",
              details: (
                <p>Tax credits vary by location (20-40% of qualified spend). They're typically discounted and borrowed against, not paid directly.</p>
              ),
            }}
            value={inputs.credits}
            field="credits"
          />

          {/* Senior Debt */}
          <CapitalSourceCard
            label="Senior Debt"
            glossary={GLOSSARY.seniorDebt}
            value={inputs.debt}
            field="debt"
            rateField="seniorDebtRate"
            rateLabel="Interest"
            rateMin={0}
            rateMax={20}
            rateDelta={1}
          />

          {/* Gap / Mezz Debt */}
          <CapitalSourceCard
            label="Gap / Mezz Debt"
            glossary={GLOSSARY.mezzanineDebt}
            value={inputs.mezzanineDebt}
            field="mezzanineDebt"
            rateField="mezzanineRate"
            rateLabel="Interest"
            rateMin={0}
            rateMax={30}
            rateDelta={1}
          />

          {/* Equity */}
          <CapitalSourceCard
            label="Equity"
            glossary={GLOSSARY.equity}
            value={inputs.equity}
            field="equity"
            rateField="premium"
            rateLabel="Premium"
            rateMin={0}
            rateMax={50}
            rateDelta={5}
          />
        </div>

        {/* Summary - only if capital entered and budget exists */}
        {totalCapital > 0 && inputs.budget > 0 && (
          <div
            className="mt-6 p-4 border border-gold-muted bg-gold-subtle"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-dim">Total Capital</span>
              <span className="font-mono text-xl text-gold">{formatCompactCurrency(totalCapital)}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-text-dim">Budget Coverage</span>
              <span className={cn(
                "font-mono text-sm",
                gapPercent >= 100 ? "text-status-success" : "text-status-warning"
              )}>
                {gapPercent.toFixed(0)}%
              </span>
            </div>
            {gapPercent < 100 && (
              <p className="text-xs text-status-warning mt-2">
                Gap: {formatCompactCurrency(inputs.budget - totalCapital)} uncovered
              </p>
            )}
          </div>
        )}
      </ChapterCard>
    </div>
  );
};

export default StackTab;
