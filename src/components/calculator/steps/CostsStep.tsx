import { PremiumInput } from "@/components/ui/premium-input";
import { PercentStepper } from "@/components/ui/percent-stepper";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { Info, DollarSign, Building2, Briefcase } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CostsStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const CostsStep = ({ inputs, onUpdateInput }: CostsStepProps) => {
  const [showHelp, setShowHelp] = useState(false);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  // Calculate totals for preview
  const hypotheticalRevenue = inputs.budget * 1.2;
  const camFeeAmount = hypotheticalRevenue * 0.01;
  const salesFeeAmount = hypotheticalRevenue * (inputs.salesFee / 100);
  const totalOffTop = camFeeAmount + salesFeeAmount + 75000; // $75K sales expense cap

  const isBudgetComplete = inputs.budget > 0;
  const isSalesFeeComplete = inputs.salesFee > 0;

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
            <DollarSign className="w-7 h-7 text-gold" />
          </div>
        </div>

        <p className="text-white/40 text-xs mb-2 uppercase tracking-widest">Production costs</p>
        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2 leading-tight">
          Budget &amp; <span className="text-gold">Cost Structure</span>
        </h2>
        <p className="text-white/50 text-sm max-w-xs mx-auto">
          Your negative cost and mandatory fees
        </p>
      </div>

      {/* BUDGET */}
      <div className="matte-section mb-6">
        <div className="matte-section-header px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign className="w-4 h-4 text-gold/60" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
              Production Budget
            </span>
          </div>
          {isBudgetComplete && (
            <span className="text-xs text-gold font-mono">✓</span>
          )}
        </div>
        <div className="p-5">
          <PremiumInput
            type="text"
            inputMode="numeric"
            value={formatValue(inputs.budget)}
            onChange={(e) => onUpdateInput('budget', parseValue(e.target.value))}
            placeholder="2,000,000"
            showCurrency
            label="Negative Cost"
            example="$2,000,000"
            actionHint="All-in production cost"
            isCompleted={isBudgetComplete}
            isNext={!isBudgetComplete}
          />
        </div>
      </div>

      {/* CAM FEE (Fixed at 1%) */}
      <div className="matte-section mb-6">
        <div className="matte-section-header px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-4 h-4 text-gold/60" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
              CAM Fee (Fixed)
            </span>
          </div>
          <span className="text-xs text-gold font-mono">✓</span>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">Collection Account Management</p>
              <p className="text-xs text-white/30 mt-1">Non-negotiable industry standard</p>
            </div>
            <span className="font-mono text-3xl text-gold font-semibold">1%</span>
          </div>
        </div>
      </div>

      {/* SALES AGENT */}
      <div className="matte-section mb-6">
        <div className="matte-section-header px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase className="w-4 h-4 text-gold/60" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
              Sales Agent Terms
            </span>
          </div>
          {isSalesFeeComplete && (
            <span className="text-xs text-gold font-mono">✓</span>
          )}
        </div>
        
        <div className="p-5 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 flex items-center justify-center text-xs font-mono font-bold bg-gold text-black">
              1
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-gold/80 font-semibold">
              Commission Rate
            </span>
          </div>

          <PercentStepper
            value={inputs.salesFee}
            onChange={(value) => onUpdateInput('salesFee', value)}
            min={0}
            max={30}
            step={5}
            standardValue={15}
            standardLabel="industry average"
            isCompleted={true}
          />
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-6 flex items-center justify-center text-xs font-mono font-bold bg-gold text-black">
              2
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-gold/80 font-semibold">
              Sales &amp; Marketing Cap
            </span>
          </div>

          <div className="bg-[#0A0A0A]/50 p-4 border border-gold/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">AFM, markets, deliverables</p>
                <p className="text-xs text-gold/70 mt-1">Industry standard cap</p>
              </div>
              <span className="font-mono text-2xl text-white font-semibold">$75K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      {inputs.budget > 0 && (
        <div className="glass-card-gold p-5">
          <p className="text-xs text-white/30 uppercase tracking-wider mb-3">
            Impact on typical 1.2x deal
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/40">CAM (1%)</span>
              <span className="font-mono text-red-400">-{formatCompactCurrency(camFeeAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Sales Commission ({inputs.salesFee}%)</span>
              <span className="font-mono text-red-400">-{formatCompactCurrency(salesFeeAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Sales &amp; Marketing</span>
              <span className="font-mono text-red-400">-$75K</span>
            </div>
            <div className="premium-divider-gold" />
            <div className="flex justify-between">
              <span className="text-xs uppercase tracking-wider text-white/50 font-semibold">Total Off-Top</span>
              <span className="font-mono text-xl text-red-400 font-semibold">
                -{formatCompactCurrency(totalOffTop)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Help */}
      <div className="mt-6">
        <Collapsible open={showHelp} onOpenChange={setShowHelp}>
          <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 text-sm text-gold/70 hover:text-gold transition-colors py-3">
            <Info className="w-4 h-4" />
            <span>What are "off-the-top" fees?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="glass-card-gold p-5 animate-reveal-up">
              <p className="text-sm text-white/70 mb-3 leading-relaxed">
                These fees are deducted <span className="text-gold font-semibold">before anyone else gets paid</span>—lenders, investors, or profit participants.
              </p>
              <div className="premium-divider-gold mb-3" />
              <p className="text-xs text-white/50">
                They reduce the amount available to repay capital and generate profit.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default CostsStep;
