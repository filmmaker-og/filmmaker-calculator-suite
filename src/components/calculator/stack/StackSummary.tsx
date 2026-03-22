import { Receipt, Landmark, CreditCard, Users, Clock, Edit2 } from "lucide-react";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { CapitalSourceSelections } from "./CapitalSelect";
import StandardStepLayout from "../StandardStepLayout";
import { useHaptics } from "@/hooks/use-haptics";

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
}

/**
 * StackSummary - Review and confirm capital stack
 *
 * Shows selected sources with amounts. Edit routes by source key.
 */
const StackSummary = ({ inputs, selections, onEdit, onComplete }: StackSummaryProps) => {
  const haptics = useHaptics();
  const totalCapital = inputs.credits + inputs.debt + inputs.mezzanineDebt + inputs.equity;
  const gapPercent = inputs.budget > 0 ? (totalCapital / inputs.budget) * 100 : 0;
  const isFullyFunded = gapPercent >= 100;
  const fundingGap = inputs.budget - totalCapital;

  const allItems: (StackItem & { selected: boolean })[] = [
    { icon: Receipt, label: 'Tax Credits', amount: inputs.credits, sourceKey: 'taxCredits', selected: selections.taxCredits },
    { icon: Landmark, label: 'Senior Debt', amount: inputs.debt, rate: inputs.seniorDebtRate, rateLabel: 'interest', sourceKey: 'seniorDebt', selected: selections.seniorDebt },
    { icon: CreditCard, label: 'Gap / Mezz', amount: inputs.mezzanineDebt, rate: inputs.mezzanineRate, rateLabel: 'interest', sourceKey: 'gapLoan', selected: selections.gapLoan },
    { icon: Users, label: 'Equity', amount: inputs.equity, rate: inputs.premium, rateLabel: 'pref', sourceKey: 'equity', selected: selections.equity },
    { icon: Clock, label: 'Deferments', amount: inputs.deferments, sourceKey: 'deferments', selected: selections.deferments },
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
      nextLabel="Set Your Deal Terms"
      isComplete={true}
    >
      <div className="space-y-6">

        {/* Progress Bar */}
        {inputs.budget > 0 && (
          <div
            className="relative overflow-hidden"
            style={{
              border: `1px solid rgba(212,175,55,${isFullyFunded ? "0.30" : "0.15"})`,
              background: isFullyFunded ? "rgba(212,175,55,0.08)" : "rgba(255,255,255,0.03)",
              borderRadius: "8px",
              padding: "16px",
              position: "relative",
            }}
          >
            {isFullyFunded && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at right center, rgba(212,175,55,0.12) 0%, transparent 60%)' }}
              />
            )}
            <div className="relative flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(212,175,55,0.75)" }}>Total Capital</span>
              <span
                className="font-mono text-lg font-medium"
                style={{
                  color: "#D4AF37",
                  ...(isFullyFunded ? { textShadow: '0 0 12px rgba(212,175,55,0.4)' } : {}),
                }}
              >
                {formatCompactCurrency(totalCapital)}
              </span>
            </div>

            <div className="relative h-3 w-full overflow-hidden mb-2" style={{ background: "#0A0A0A", borderRadius: "4px" }}>
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${Math.min(gapPercent, 100)}%`,
                  background: gapPercent >= 100 ? "#D4AF37" : "rgba(212,175,55,0.50)",
                  borderRadius: "4px",
                  ...(gapPercent >= 100 ? { boxShadow: '0 0 10px rgba(212,175,55,0.35)' } : {}),
                }}
              />
            </div>

            <div className="relative flex items-center justify-between">
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>Budget: {formatCompactCurrency(inputs.budget)}</span>
              <span
                className="font-mono text-xs font-medium"
                style={{
                  color: gapPercent >= 100 ? "#D4AF37" : "rgba(212,175,55,0.60)",
                  fontWeight: gapPercent >= 100 ? 600 : 500,
                }}
              >
                {gapPercent.toFixed(0)}% Funded
              </span>
            </div>
          </div>
        )}

        {/* Stack Breakdown - Store card pattern */}
        <div
          className="overflow-hidden"
          style={{ background: "#0A0A0A", border: "1px solid rgba(212,175,55,0.20)", borderRadius: "12px" }}
        >
          <div
            className="px-5 py-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: "rgba(212,175,55,0.75)" }}>
              Capital Sources
            </span>
          </div>

          <div>
            {stackItems.length > 0 ? (
              stackItems.map((item, idx) => {
                const Icon = item.icon;
                const isLast = idx === stackItems.length - 1;
                return (
                  <div
                    key={item.label}
                    className="px-5 py-4 flex items-center justify-between transition-colors"
                    style={!isLast ? { borderBottom: "1px solid rgba(255,255,255,0.06)" } : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <div style={{ width: "4px", height: "32px", borderRadius: "999px", background: "#D4AF37" }} />
                      <Icon className="w-4 h-4" style={{ color: "rgba(255,255,255,0.55)" }} />
                      <div>
                        <span className="text-sm font-semibold" style={{ color: "#fff" }}>{item.label}</span>
                        {item.rate !== undefined && (
                          <span className="text-xs ml-2" style={{ color: "rgba(255,255,255,0.55)" }}>@ {item.rate}% {item.rateLabel}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono" style={{ color: "#D4AF37" }}>{formatCompactCurrency(item.amount)}</span>
                      <button
                        onClick={(e) => { haptics.light(e); onEdit(item.sourceKey); }}
                        className="p-1.5 transition-colors"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-5 py-8 text-center">
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>No capital sources selected.</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.40)" }}>
                  Self-financed? You're all set — continue to model your deal terms.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Warning if underfunded */}
        {!isFullyFunded && inputs.budget > 0 && totalCapital > 0 && (
          <div
            className="p-4"
            style={{
              background: "rgba(212,175,55,0.06)",
              borderLeft: "4px solid rgba(212,175,55,0.40)",
              borderRadius: '0 8px 8px 0',
            }}
          >
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
              <span className="font-semibold" style={{ color: "#D4AF37" }}>Note:</span> Your stack doesn't fully cover the budget.
              You can still proceed, but you may need additional financing.
            </p>
          </div>
        )}
      </div>
    </StandardStepLayout>
  );
};

export default StackSummary;
