import { PremiumInput } from "@/components/ui/premium-input";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { Info, Coins, TrendingDown, TrendingUp, Users, HelpCircle, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useHaptics } from "@/hooks/use-haptics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CapitalStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const CapitalStep = ({ inputs, onUpdateInput }: CapitalStepProps) => {
  const haptics = useHaptics();
  const [showHelp, setShowHelp] = useState(false);
  const [showDebtHelp, setShowDebtHelp] = useState(false);
  const [showEquityHelp, setShowEquityHelp] = useState(false);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  // Rate stepper handlers
  const adjustRate = (field: 'seniorDebtRate' | 'mezzanineRate' | 'premium', delta: number, min: number, max: number) => {
    haptics.light();
    const current = inputs[field] || 0;
    const newValue = Math.min(max, Math.max(min, current + delta));
    onUpdateInput(field, newValue);
  };

  // Calculate total capital raised
  const totalCapital = inputs.credits + inputs.debt + inputs.mezzanineDebt + inputs.equity;
  const gapPercent = inputs.budget > 0 ? (totalCapital / inputs.budget) * 100 : 0;

  return (
    <div className="step-enter min-h-[60vh] flex flex-col justify-center">
      {/* Header */}
      <div className="text-center mb-8">
        {/* Icon with glow */}
        <div className="relative inline-block mb-6">
          <div
            className="absolute inset-0 animate-pulse-slow"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
              filter: 'blur(15px)',
              transform: 'scale(2)',
            }}
          />
          <div className="relative w-14 h-14 border border-gold/30 bg-gold/5 flex items-center justify-center">
            <Coins className="w-7 h-7 text-gold" />
          </div>
        </div>

        <p className="text-white/40 text-xs mb-2 uppercase tracking-widest">Capital structure</p>
        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2 leading-tight">
          How did you <span className="text-gold">finance it?</span>
        </h2>
        <p className="text-white/50 text-sm max-w-xs mx-auto">
          Enter all capital sources. Leave blank if not used.
        </p>
      </div>

      {/* TAX CREDITS */}
      <div className="matte-section mb-4">
        <div className="matte-section-header px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-gold/60" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
              Tax Credits &amp; Incentives
            </span>
          </div>
          {inputs.credits > 0 && (
            <span className="text-xs text-gold font-mono">✓</span>
          )}
        </div>
        <div className="p-5">
          <PremiumInput
            type="text"
            inputMode="numeric"
            value={formatValue(inputs.credits)}
            onChange={(e) => onUpdateInput('credits', parseValue(e.target.value))}
            placeholder="0"
            showCurrency
            label="Credit Amount"
            example="$400,000"
            actionHint="Government incentives (if applicable)"
            isCompleted={inputs.credits > 0}
          />
          <p className="text-xs text-emerald-400/60 mt-2">
            ✓ Reduces capital requirement, improves investor position
          </p>
        </div>
      </div>

      {/* SENIOR DEBT */}
      <div className="matte-section mb-4">
        <div className="matte-section-header px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingDown className="w-4 h-4 text-gold/60" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
              Senior Debt
            </span>
            <button
              onClick={() => setShowDebtHelp(true)}
              className="w-4 h-4 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center hover:bg-gold/20 transition-colors"
            >
              <HelpCircle className="w-2.5 h-2.5 text-gold" />
            </button>
          </div>
          {inputs.debt > 0 && (
            <span className="text-xs text-gold font-mono">✓</span>
          )}
        </div>
        <div className="p-5 space-y-4">
          <PremiumInput
            type="text"
            inputMode="numeric"
            value={formatValue(inputs.debt)}
            onChange={(e) => onUpdateInput('debt', parseValue(e.target.value))}
            placeholder="0"
            showCurrency
            label="Loan Amount"
            example="$500,000"
            actionHint="First-position lender (if applicable)"
            isCompleted={inputs.debt > 0}
          />

          {/* Interest Rate Stepper */}
          {inputs.debt > 0 && (
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-4 animate-reveal-up">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-white/40">Interest Rate</span>
                <span className="text-xs text-white/30">6-12% typical</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => adjustRate('seniorDebtRate', -1, 0, 20)}
                  className="w-10 h-10 flex items-center justify-center border border-[#2A2A2A] text-white/60 hover:border-gold hover:text-gold transition-all active:scale-95"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className={`font-mono text-2xl tabular-nums min-w-[60px] text-center ${inputs.seniorDebtRate === 10 ? 'text-gold' : 'text-white'}`}>
                  {inputs.seniorDebtRate}%
                </span>
                <button
                  onClick={() => adjustRate('seniorDebtRate', 1, 0, 20)}
                  className="w-10 h-10 flex items-center justify-center border border-[#2A2A2A] text-white/60 hover:border-gold hover:text-gold transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {inputs.seniorDebtRate === 10 && (
                <p className="text-[10px] text-gold/70 mt-2 text-center">✓ standard rate</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* GAP/MEZZ DEBT */}
      <div className="matte-section mb-4">
        <div className="matte-section-header px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingDown className="w-4 h-4 text-gold/60" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
              Gap / Mezzanine Debt
            </span>
            <button
              onClick={() => setShowDebtHelp(true)}
              className="w-4 h-4 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center hover:bg-gold/20 transition-colors"
            >
              <HelpCircle className="w-2.5 h-2.5 text-gold" />
            </button>
          </div>
          {inputs.mezzanineDebt > 0 && (
            <span className="text-xs text-gold font-mono">✓</span>
          )}
        </div>
        <div className="p-5 space-y-4">
          <PremiumInput
            type="text"
            inputMode="numeric"
            value={formatValue(inputs.mezzanineDebt)}
            onChange={(e) => onUpdateInput('mezzanineDebt', parseValue(e.target.value))}
            placeholder="0"
            showCurrency
            label="Loan Amount"
            example="$300,000"
            actionHint="Subordinated debt (if applicable)"
            isCompleted={inputs.mezzanineDebt > 0}
          />

          {/* Interest Rate Stepper */}
          {inputs.mezzanineDebt > 0 && (
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-4 animate-reveal-up">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-white/40">Interest Rate</span>
                <span className="text-xs text-white/30">10-18% typical</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => adjustRate('mezzanineRate', -1, 0, 30)}
                  className="w-10 h-10 flex items-center justify-center border border-[#2A2A2A] text-white/60 hover:border-gold hover:text-gold transition-all active:scale-95"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className={`font-mono text-2xl tabular-nums min-w-[60px] text-center ${inputs.mezzanineRate === 15 ? 'text-gold' : 'text-white'}`}>
                  {inputs.mezzanineRate}%
                </span>
                <button
                  onClick={() => adjustRate('mezzanineRate', 1, 0, 30)}
                  className="w-10 h-10 flex items-center justify-center border border-[#2A2A2A] text-white/60 hover:border-gold hover:text-gold transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {inputs.mezzanineRate === 15 && (
                <p className="text-[10px] text-gold/70 mt-2 text-center">✓ standard rate</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* EQUITY */}
      <div className="matte-section mb-6">
        <div className="matte-section-header px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-gold/60" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
              Equity Investment
            </span>
            <button
              onClick={() => setShowEquityHelp(true)}
              className="w-4 h-4 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center hover:bg-gold/20 transition-colors"
            >
              <HelpCircle className="w-2.5 h-2.5 text-gold" />
            </button>
          </div>
          {inputs.equity > 0 && (
            <span className="text-xs text-gold font-mono">✓</span>
          )}
        </div>
        <div className="p-5 space-y-4">
          <PremiumInput
            type="text"
            inputMode="numeric"
            value={formatValue(inputs.equity)}
            onChange={(e) => onUpdateInput('equity', parseValue(e.target.value))}
            placeholder="0"
            showCurrency
            label="Investment Amount"
            example="$800,000"
            actionHint="Equity capital raised (if applicable)"
            isCompleted={inputs.equity > 0}
          />

          {/* Premium Stepper */}
          {inputs.equity > 0 && (
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-4 animate-reveal-up">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-white/40">Equity Premium</span>
                <span className="text-xs text-white/30">15-25% typical</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => adjustRate('premium', -5, 0, 50)}
                  className="w-10 h-10 flex items-center justify-center border border-[#2A2A2A] text-white/60 hover:border-gold hover:text-gold transition-all active:scale-95"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className={`font-mono text-2xl tabular-nums min-w-[60px] text-center ${inputs.premium === 20 ? 'text-gold' : 'text-white'}`}>
                  {inputs.premium}%
                </span>
                <button
                  onClick={() => adjustRate('premium', 5, 0, 50)}
                  className="w-10 h-10 flex items-center justify-center border border-[#2A2A2A] text-white/60 hover:border-gold hover:text-gold transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {inputs.premium === 20 && (
                <p className="text-[10px] text-gold/70 mt-2 text-center">✓ industry standard</p>
              )}
              <p className="text-xs text-white/30 mt-3 text-center">
                Principal + {inputs.premium}% = {formatCompactCurrency(inputs.equity * (1 + inputs.premium / 100))} hurdle
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Capital Summary */}
      {totalCapital > 0 && inputs.budget > 0 && (
        <div className="glass-card-gold p-5">
          <p className="text-xs text-white/30 uppercase tracking-wider mb-3">
            Capital Stack Summary
          </p>
          <div className="space-y-2 text-sm">
            {inputs.credits > 0 && (
              <div className="flex justify-between">
                <span className="text-white/40">Tax Credits</span>
                <span className="font-mono text-emerald-400">+{formatCompactCurrency(inputs.credits)}</span>
              </div>
            )}
            {inputs.debt > 0 && (
              <div className="flex justify-between">
                <span className="text-white/40">Senior Debt</span>
                <span className="font-mono text-white/70">+{formatCompactCurrency(inputs.debt)}</span>
              </div>
            )}
            {inputs.mezzanineDebt > 0 && (
              <div className="flex justify-between">
                <span className="text-white/40">Gap Loan</span>
                <span className="font-mono text-white/70">+{formatCompactCurrency(inputs.mezzanineDebt)}</span>
              </div>
            )}
            {inputs.equity > 0 && (
              <div className="flex justify-between">
                <span className="text-white/40">Equity</span>
                <span className="font-mono text-white/70">+{formatCompactCurrency(inputs.equity)}</span>
              </div>
            )}
            <div className="premium-divider-gold" />
            <div className="flex justify-between">
              <span className="text-xs uppercase tracking-wider text-white/50 font-semibold">Total Capital</span>
              <span className="font-mono text-xl text-gold font-semibold">
                {formatCompactCurrency(totalCapital)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/30">Coverage</span>
              <span className="font-mono text-white/50">{gapPercent.toFixed(0)}% of budget</span>
            </div>
          </div>
        </div>
      )}

      {/* Help */}
      <div className="mt-6">
        <Collapsible open={showHelp} onOpenChange={setShowHelp}>
          <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 text-sm text-gold/70 hover:text-gold transition-colors py-3">
            <Info className="w-4 h-4" />
            <span>How does the capital stack work?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="glass-card-gold p-5 animate-reveal-up">
              <p className="text-sm text-white/70 mb-3 leading-relaxed">
                Each capital source has a <span className="text-gold font-semibold">different priority</span> in the waterfall.
              </p>
              <div className="premium-divider-gold mb-3" />
              <div className="space-y-2 text-xs text-white/50">
                <p>• Tax credits reduce the gap, improving investor returns</p>
                <p>• Senior debt gets repaid first (lowest risk, lowest return)</p>
                <p>• Gap/mezz debt is repaid next (higher risk, higher interest)</p>
                <p>• Equity is last to be repaid (highest risk, profit participation)</p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Help Dialog - Debt */}
      <Dialog open={showDebtHelp} onOpenChange={setShowDebtHelp}>
        <DialogContent className="bg-[#0A0A0A] border-[#1A1A1A] max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-bebas text-xl tracking-wider text-gold flex items-center gap-2">
              <Info className="w-5 h-5" />
              FILM DEBT FINANCING
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-white/60 text-sm leading-relaxed">
            Debt is repaid before equity investors see any returns.
          </DialogDescription>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-gold/70 uppercase tracking-wider mb-2">Senior Debt</p>
              <p className="text-sm text-white/60 leading-relaxed">
                First-position loans against distribution contracts or tax credits. Lower risk = lower interest (6-12%).
              </p>
            </div>
            <div className="pt-3 border-t border-[#1A1A1A]">
              <p className="text-xs text-gold/70 uppercase tracking-wider mb-2">Gap / Mezzanine Debt</p>
              <p className="text-sm text-white/60 leading-relaxed">
                Subordinated loans that fill the "gap" between senior debt and equity. Higher risk = higher interest (12-18%).
              </p>
            </div>
            <div className="pt-3 border-t border-[#1A1A1A]">
              <p className="text-xs text-white/40">
                All debt must be repaid in full (principal + interest) before equity investors receive anything.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help Dialog - Equity */}
      <Dialog open={showEquityHelp} onOpenChange={setShowEquityHelp}>
        <DialogContent className="bg-[#0A0A0A] border-[#1A1A1A] max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-bebas text-xl tracking-wider text-gold flex items-center gap-2">
              <Info className="w-5 h-5" />
              EQUITY & PREMIUM
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-white/60 text-sm leading-relaxed">
            Equity investors provide cash in exchange for ownership and profit participation.
          </DialogDescription>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-gold/70 uppercase tracking-wider mb-2">What is premium?</p>
              <p className="text-sm text-white/60 leading-relaxed">
                The "premium" or "preferred return" guarantees investors get their money back PLUS a bonus percentage before anyone else sees profit.
              </p>
            </div>
            <div className="pt-3 border-t border-[#1A1A1A]">
              <p className="text-xs text-gold/70 uppercase tracking-wider mb-2">Example</p>
              <p className="text-sm text-white/60 leading-relaxed">
                $500K equity + 20% premium = $600K hurdle that must be paid before the profit pool opens.
              </p>
            </div>
            <div className="pt-3 border-t border-[#1A1A1A]">
              <p className="text-xs text-white/40">
                After the hurdle, remaining profits are typically split 50/50 between producer and investors.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CapitalStep;
