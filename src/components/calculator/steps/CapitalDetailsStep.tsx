import { PremiumInput } from "@/components/ui/premium-input";
import { PercentStepper } from "@/components/ui/percent-stepper";
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
  const [activeField, setActiveField] = useState<number>(-1);

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

  // Track field indices for spotlight effect
  let fieldIndex = 0;

  return (
    <div className="step-enter">
      {/* Step Header */}
      <div className="text-center mb-8">
        <h2 className="font-bebas text-2xl tracking-[0.1em] text-foreground mb-2">
          Everyone who put money in
          <br />
          <span className="text-gold">gets paid back first</span>
        </h2>
        <p className="text-muted-foreground text-sm">
          With interest. Before you.
        </p>
      </div>

      {/* Dynamic Cards Based on Selection */}
      <div className="space-y-4">
        {/* Tax Credits */}
        {selections.taxCredits && (
          <div 
            className={`bg-card border border-border p-5 space-y-4 transition-all duration-300 ${
              activeField >= 0 && activeField !== fieldIndex ? 'opacity-40 blur-[0.5px]' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bebas text-base tracking-wider text-foreground">TAX CREDITS</h3>
              <button
                onClick={() => setActiveModal('taxCredits')}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold/10"
              >
                <Info className="w-4 h-4 text-gold" />
              </button>
            </div>
            <PremiumInput
              type="text"
              inputMode="numeric"
              value={formatValue(inputs.credits)}
              onChange={(e) => onUpdateInput('credits', parseValue(e.target.value))}
              placeholder="400,000"
              showCurrency
              example="$400,000"
              isCompleted={inputs.credits > 0}
              isNext={inputs.credits === 0}
              onFocus={() => setActiveField(fieldIndex)}
              onBlur={() => setActiveField(-1)}
            />
          </div>
        )}
        {selections.taxCredits && fieldIndex++}

        {/* Senior Debt */}
        {selections.seniorDebt && (
          <div 
            className={`bg-card border border-border p-5 space-y-4 transition-all duration-300 ${
              activeField >= 0 && activeField !== fieldIndex && activeField !== fieldIndex + 1 ? 'opacity-40 blur-[0.5px]' : ''
            }`}
          >
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
              <PremiumInput
                type="text"
                inputMode="numeric"
                value={formatValue(inputs.debt)}
                onChange={(e) => onUpdateInput('debt', parseValue(e.target.value))}
                placeholder="600,000"
                showCurrency
                label="Principal Amount"
                example="$600,000"
                isCompleted={inputs.debt > 0}
                isNext={inputs.debt === 0}
                onFocus={() => setActiveField(fieldIndex)}
                onBlur={() => setActiveField(-1)}
              />
              <PercentStepper
                value={inputs.seniorDebtRate}
                onChange={(value) => onUpdateInput('seniorDebtRate', value)}
                min={5}
                max={20}
                step={1}
                label="Interest + Fees"
                standardValue={10}
                standardLabel="typical bank rate"
                isCompleted={true}
              />
            </div>
          </div>
        )}
        {selections.seniorDebt && (fieldIndex += 2)}

        {/* Gap Loan */}
        {selections.gapLoan && (
          <div 
            className={`bg-card border border-border p-5 space-y-4 transition-all duration-300 ${
              activeField >= 0 && activeField !== fieldIndex && activeField !== fieldIndex + 1 ? 'opacity-40 blur-[0.5px]' : ''
            }`}
          >
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
              <PremiumInput
                type="text"
                inputMode="numeric"
                value={formatValue(inputs.mezzanineDebt)}
                onChange={(e) => onUpdateInput('mezzanineDebt', parseValue(e.target.value))}
                placeholder="200,000"
                showCurrency
                label="Principal Amount"
                example="$200,000"
                isCompleted={inputs.mezzanineDebt > 0}
                isNext={inputs.mezzanineDebt === 0}
                onFocus={() => setActiveField(fieldIndex)}
                onBlur={() => setActiveField(-1)}
              />
              <PercentStepper
                value={inputs.mezzanineRate}
                onChange={(value) => onUpdateInput('mezzanineRate', value)}
                min={10}
                max={25}
                step={1}
                label="Interest + Fees"
                standardValue={18}
                standardLabel="typical gap rate"
                isCompleted={true}
              />
            </div>
          </div>
        )}
        {selections.gapLoan && (fieldIndex += 2)}

        {/* Equity */}
        {selections.equity && (
          <div 
            className={`bg-card border border-border p-5 space-y-4 transition-all duration-300 ${
              activeField >= 0 && activeField !== fieldIndex && activeField !== fieldIndex + 1 ? 'opacity-40 blur-[0.5px]' : ''
            }`}
          >
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
              <PremiumInput
                type="text"
                inputMode="numeric"
                value={formatValue(inputs.equity)}
                onChange={(e) => onUpdateInput('equity', parseValue(e.target.value))}
                placeholder="1,000,000"
                showCurrency
                label="Net Equity"
                example="$1,000,000"
                isCompleted={inputs.equity > 0}
                isNext={inputs.equity === 0}
                onFocus={() => setActiveField(fieldIndex)}
                onBlur={() => setActiveField(-1)}
              />
              <PercentStepper
                value={inputs.premium}
                onChange={(value) => onUpdateInput('premium', value)}
                min={10}
                max={40}
                step={5}
                label="Preferred Return"
                standardValue={20}
                standardLabel="industry standard"
                isCompleted={true}
              />
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
