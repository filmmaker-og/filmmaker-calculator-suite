import { Input } from "@/components/ui/input";
import { WaterfallInputs } from "@/lib/waterfall";
import { Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { CapitalSelections } from "./CapitalSelectStep";

interface CapitalDetailsStepProps {
  inputs: WaterfallInputs;
  selections: CapitalSelections;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const CapitalDetailsStep = ({ inputs, selections, onUpdateInput }: CapitalDetailsStepProps) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string, isPercent: boolean = false) => {
    const value = parseInt(str.replace(/[^0-9]/g, '')) || 0;
    return isPercent ? Math.min(value, 100) : value;
  };

  const modals: Record<string, { title: string; content: React.ReactNode }> = {
    taxCredits: {
      title: "TAX INCENTIVES",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <p>Non-recourse funds from government programs. These reduce the net capital required from investors.</p>
          <p className="text-xs text-muted-foreground/70">Examples: UK (25%), Georgia (20-30%), New Mexico (25-35%)</p>
        </div>
      )
    },
    seniorDebt: {
      title: "SENIOR DEBT",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <p>First-position debt secured against pre-sales or tax credit receivables.</p>
          <p>Paid back first in the waterfall, before any equity returns.</p>
        </div>
      )
    },
    gapLoan: {
      title: "GAP / BRIDGE LOAN",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <p>Higher-risk debt to bridge the financing gap when presales don't cover the full budget.</p>
          <p>Subordinate to senior debt but ahead of equity in the waterfall.</p>
        </div>
      )
    },
    equity: {
      title: "INVESTOR EQUITY",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <p><strong className="text-foreground">Net Equity:</strong> Cash investment after tax credits and debt.</p>
          <p><strong className="text-foreground">Preferred Return:</strong> The hurdle rate investors must receive before profits split. Typically 15-20%.</p>
        </div>
      )
    }
  };

  // Count how many sections we're showing
  const sections = [];
  if (selections.taxCredits) sections.push('taxCredits');
  if (selections.seniorDebt) sections.push('seniorDebt');
  if (selections.gapLoan) sections.push('gapLoan');
  if (selections.equity) sections.push('equity');

  return (
    <div className="step-enter">
      {/* Step Header */}
      <div className="text-center mb-8">
        <h2 className="font-bebas text-2xl tracking-[0.15em] text-gold mb-2">
          CAPITAL DETAILS
        </h2>
        <p className="text-white/50 text-sm">
          Enter the amounts for each financing source
        </p>
      </div>

      {/* Dynamic Cards Based on Selection */}
      <div className="space-y-4">
        {/* Tax Credits */}
        {selections.taxCredits && (
          <div className="bg-card border border-border p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bebas text-base tracking-wider text-foreground">TAX CREDITS</h3>
              <button
                onClick={() => setActiveModal('taxCredits')}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold/10"
              >
                <Info className="w-4 h-4 text-gold" />
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
              <Input
                type="text"
                inputMode="numeric"
                value={formatValue(inputs.credits)}
                onChange={(e) => onUpdateInput('credits', parseValue(e.target.value))}
                placeholder="400,000"
                className="pl-10 h-14 text-xl font-mono text-foreground text-right rounded-none border-border focus:border-gold bg-background"
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>
        )}

        {/* Senior Debt */}
        {selections.seniorDebt && (
          <div className="bg-card border border-border p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bebas text-base tracking-wider text-foreground">SENIOR DEBT</h3>
              <button
                onClick={() => setActiveModal('seniorDebt')}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold/10"
              >
                <Info className="w-4 h-4 text-gold" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={formatValue(inputs.debt)}
                  onChange={(e) => onUpdateInput('debt', parseValue(e.target.value))}
                  placeholder="600,000"
                  className="pl-10 h-14 text-xl font-mono text-foreground text-right rounded-none border-border focus:border-gold bg-background"
                  onFocus={(e) => e.target.select()}
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Interest + Fees</span>
                <div className="relative flex-1">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formatValue(inputs.seniorDebtRate)}
                    onChange={(e) => onUpdateInput('seniorDebtRate', parseValue(e.target.value, true))}
                    placeholder="10"
                    className="pr-10 h-12 text-lg font-mono text-foreground text-right rounded-none border-border focus:border-gold bg-background"
                    onFocus={(e) => e.target.select()}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gap Loan */}
        {selections.gapLoan && (
          <div className="bg-card border border-border p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bebas text-base tracking-wider text-foreground">GAP / BRIDGE LOAN</h3>
              <button
                onClick={() => setActiveModal('gapLoan')}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold/10"
              >
                <Info className="w-4 h-4 text-gold" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={formatValue(inputs.mezzanineDebt)}
                  onChange={(e) => onUpdateInput('mezzanineDebt', parseValue(e.target.value))}
                  placeholder="200,000"
                  className="pl-10 h-14 text-xl font-mono text-foreground text-right rounded-none border-border focus:border-gold bg-background"
                  onFocus={(e) => e.target.select()}
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Interest + Fees</span>
                <div className="relative flex-1">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formatValue(inputs.mezzanineRate)}
                    onChange={(e) => onUpdateInput('mezzanineRate', parseValue(e.target.value, true))}
                    placeholder="18"
                    className="pr-10 h-12 text-lg font-mono text-foreground text-right rounded-none border-border focus:border-gold bg-background"
                    onFocus={(e) => e.target.select()}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Equity */}
        {selections.equity && (
          <div className="bg-card border border-border p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bebas text-base tracking-wider text-foreground">EQUITY INVESTMENT</h3>
              <button
                onClick={() => setActiveModal('equity')}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold/10"
              >
                <Info className="w-4 h-4 text-gold" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={formatValue(inputs.equity)}
                  onChange={(e) => onUpdateInput('equity', parseValue(e.target.value))}
                  placeholder="1,000,000"
                  className="pl-10 h-14 text-xl font-mono text-foreground text-right rounded-none border-border focus:border-gold bg-background"
                  onFocus={(e) => e.target.select()}
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Preferred Return</span>
                <div className="relative flex-1">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formatValue(inputs.premium)}
                    onChange={(e) => onUpdateInput('premium', parseValue(e.target.value, true))}
                    placeholder="20"
                    className="pr-10 h-12 text-lg font-mono text-foreground text-right rounded-none border-border focus:border-gold bg-background"
                    onFocus={(e) => e.target.select()}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={activeModal !== null} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="border-border max-w-md bg-card rounded-none">
          <DialogHeader>
            <DialogTitle className="font-bebas text-xl tracking-wider text-gold">
              {activeModal && modals[activeModal]?.title}
            </DialogTitle>
          </DialogHeader>
          {activeModal && modals[activeModal]?.content}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CapitalDetailsStep;
