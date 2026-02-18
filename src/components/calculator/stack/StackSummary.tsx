import { Receipt, Landmark, CreditCard, Users, Clock, Edit2 } from "lucide-react";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { CapitalSourceSelections } from "./CapitalSelect";
import { cn } from "@/lib/utils";
import StandardStepLayout from "../StandardStepLayout";

interface StackSummaryProps {
  inputs: WaterfallInputs;
  selections: CapitalSourceSelections;
  onEdit: (sourceKey: string) => void;
  onComplete: () => void;
}

interface StackItem {
  icon: React.ElementType;
  label: string;
  amount: number;
  rate?: number;
  rateLabel?: string;
  sourceKey: string;
  color: string;
}

/**
 * StackSummary - Review and confirm capital stack
 *
 * Shows selected sources with amounts. Edit routes by source key.
 */
const StackSummary = ({ inputs, selections, onEdit, onComplete }: StackSummaryProps) => {
  const totalCapital = inputs.credits + inputs.debt + inputs.mezzanineDebt + inputs.equity;
  const gapPercent = inputs.budget > 0 ? (totalCapital / inputs.budget) * 100 : 0;
  const isFullyFunded = gapPercent >= 100;
  const fundingGap = inputs.budget - totalCapital;

  const allItems: (StackItem & { selected: boolean })[] = [
    { icon: Receipt, label: 'Tax Credits', amount: inputs.credits, sourceKey: 'taxCredits', color: 'border-gold', selected: selections.taxCredits },
    { icon: Landmark, label: 'Senior Debt', amount: inputs.debt, rate: inputs.seniorDebtRate, rateLabel: 'interest', sourceKey: 'seniorDebt', color: 'border-gold', selected: selections.seniorDebt },
    { icon: CreditCard, label: 'Gap / Mezz', amount: inputs.mezzanineDebt, rate: inputs.mezzanineRate, rateLabel: 'interest', sourceKey: 'gapLoan', color: 'border-gold', selected: selections.gapLoan },
    { icon: Users, label: 'Equity', amount: inputs.equity, rate: inputs.premium, rateLabel: 'pref', sourceKey: 'equity', color: 'border-gold', selected: selections.equity },
    { icon: Clock, label: 'Deferments', amount: inputs.deferments, sourceKey: 'deferments', color: 'border-gold', selected: selections.deferments },
  ];
  const stackItems = allItems.filter(item => item.selected);

  const title = isFullyFunded ? 'Stack Complete' : 'Review Your Stack';
  const subtitle = isFullyFunded
    ? 'Your capital stack covers the budget. Ready to proceed.'
    : `You're ${formatCompactCurrency(fundingGap)} short of your ${formatCompactCurrency(inputs.budget)} budget.`;

  return (
    <StandardStepLayout
      chapter="02"
      title={title}
      subtitle={subtitle}
      onNext={onComplete}
      nextLabel="Continue to Deal Terms"
      isComplete={true} // Always allow continue, even if underfunded (per logic)
    >
      <div className="space-y-6">
        
        {/* Progress Bar */}
        {inputs.budget > 0 && (
          <div
            className={cn(
              "relative p-4 border overflow-hidden",
              isFullyFunded ? "border-gold/30 bg-gold-subtle" : "border-border-default bg-bg-surface"
            )}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            {isFullyFunded && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at right center, rgba(212,175,55,0.12) 0%, transparent 60%)' }}
              />
            )}
            <div className="relative flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">Total Capital</span>
              <span
                className="font-mono text-lg font-medium text-gold"
                style={isFullyFunded ? { textShadow: '0 0 12px rgba(212,175,55,0.4)' } : undefined}
              >
                {formatCompactCurrency(totalCapital)}
              </span>
            </div>

            <div className="relative h-3 w-full bg-bg-elevated overflow-hidden mb-2" style={{ borderRadius: 'var(--radius-sm)' }}>
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  gapPercent >= 100 ? "bg-gold" : "bg-gold/50"
                )}
                style={{
                  width: `${Math.min(gapPercent, 100)}%`,
                  ...(gapPercent >= 100 ? { boxShadow: '0 0 10px rgba(212,175,55,0.35)' } : {}),
                }}
              />
            </div>

            <div className="relative flex items-center justify-between">
              <span className="text-xs text-text-dim">Budget: {formatCompactCurrency(inputs.budget)}</span>
              <span className={cn(
                "font-mono text-xs font-medium",
                gapPercent >= 100 ? "text-gold" : "text-gold/60"
              )}>
                {gapPercent.toFixed(0)}% Funded
              </span>
            </div>
          </div>
        )}

        {/* Stack Breakdown - Matte Look */}
        <div className="bg-bg-elevated border border-border-default rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-border-subtle bg-bg-surface/50">
            <span className="text-xs uppercase tracking-widest text-text-dim font-semibold">
              Capital Sources
            </span>
          </div>

          <div className="divide-y divide-border-subtle">
            {stackItems.length > 0 ? (
              stackItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={item.label}
                    className="px-5 py-4 flex items-center justify-between hover:bg-bg-elevated transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-1 h-8 rounded-full", item.color)} />
                      <Icon className="w-4 h-4 text-text-dim" />
                      <div>
                        <span className="text-sm text-text-primary font-semibold">{item.label}</span>
                        {item.rate !== undefined && (
                          <span className="text-xs text-text-dim ml-2">@ {item.rate}% {item.rateLabel}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-gold">{formatCompactCurrency(item.amount)}</span>
                      <button
                        onClick={() => onEdit(item.sourceKey)}
                        className="p-1.5 text-text-dim hover:text-text-mid transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-5 py-8 text-center">
                <p className="text-text-dim text-sm">No capital sources selected.</p>
                <p className="text-text-dim/70 text-xs mt-1 leading-relaxed">
                  Self-financed? You're all set — continue to model your deal terms.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Warning if underfunded */}
        {!isFullyFunded && inputs.budget > 0 && totalCapital > 0 && (
          <div 
            className="bg-gold/[0.06] border-l-4 border-gold/40 p-4"
            style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}
          >
            <p className="text-xs text-text-mid leading-relaxed">
              <span className="font-semibold text-gold">Note:</span> Your stack doesn't fully cover the budget. 
              You can still proceed, but you may need additional financing.
            </p>
          </div>
        )}
      </div>
    </StandardStepLayout>
  );
};

export default StackSummary;
