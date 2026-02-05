import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { Minus, Plus, Wallet, Coins, Building2, Banknote, Landmark, Layers, Clock } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import { cn } from "@/lib/utils";
import StandardStepLayout from "../StandardStepLayout";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface StackTabProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const StackTab = ({ inputs, onUpdateInput }: StackTabProps) => {
  const haptics = useHaptics();
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

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
  const isCompleted = totalCapital >= inputs.budget && inputs.budget > 0;
  const hasAnyCapital = totalCapital > 0;

  // Helper component for capital source cards
  const CapitalSourceCard = ({
    label,
    icon: Icon,
    description,
    value,
    field,
    rateField,
    rateLabel,
    rateMin,
    rateMax,
    rateDelta,
    accordionId
  }: {
    label: string;
    icon: any;
    description: string;
    value: number;
    field: keyof WaterfallInputs;
    rateField?: 'seniorDebtRate' | 'mezzanineRate' | 'premium';
    rateLabel?: string;
    rateMin?: number;
    rateMax?: number;
    rateDelta?: number;
    accordionId: string;
  }) => {
    const hasValue = value > 0;
    const rateValue = rateField ? inputs[rateField] : 0;
    const isActive = activeAccordion === accordionId;

    return (
      <div
        className={cn(
          "border transition-all duration-300",
          hasValue 
            ? "border-gold/30 bg-gold/5" 
            : isActive
              ? "border-gold/20 bg-gold/[0.02]"
              : "border-[#1A1A1A] bg-black hover:border-[#2A2A2A]"
        )}
      >
        <button
          onClick={() => setActiveAccordion(isActive ? null : accordionId)}
          className="w-full p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 flex items-center justify-center border transition-colors",
              hasValue ? "border-gold/30 text-gold" : "border-white/10 text-white/30"
            )}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold tracking-wider text-white uppercase">{label}</div>
              {hasValue && (
                <div className="text-xs text-gold font-mono mt-0.5">
                  {formatCompactCurrency(value)}
                  {rateField && ` @ ${rateValue}%`}
                </div>
              )}
            </div>
          </div>
          <div className="text-white/20">
            {isActive ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </div>
        </button>

        <Collapsible open={isActive}>
          <CollapsibleContent>
            <div className="px-4 pb-4 pt-0 space-y-4">
              <p className="text-xs text-white/40 leading-relaxed border-l-2 border-white/10 pl-3">
                {description}
              </p>

              <div
                className={cn(
                  "flex items-center border transition-all",
                  isCompleted ? "border-gold/30" : "border-[#2A2A2A]"
                )}
              >
                <span className="pl-4 pr-2 font-mono text-white/40">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatValue(value)}
                  onChange={(e) => onUpdateInput(field, parseValue(e.target.value))}
                  placeholder="0"
                  className="flex-1 bg-transparent py-3 pr-4 outline-none font-mono text-xl text-white text-right placeholder:text-white/20 tabular-nums"
                />
              </div>

              {/* Rate adjuster */}
              {rateField && (
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-xs text-white/50 uppercase tracking-wider">{rateLabel}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => adjustRate(rateField, -(rateDelta || 1), rateMin || 0, rateMax || 50)}
                      disabled={(rateValue as number) <= (rateMin || 0)}
                      className="w-8 h-8 flex items-center justify-center border border-[#2A2A2A] text-white/40 hover:text-white hover:border-white/30 transition-colors disabled:opacity-30"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-sm text-white w-12 text-center tabular-nums">
                      {rateValue}%
                    </span>
                    <button
                      onClick={() => adjustRate(rateField, rateDelta || 1, rateMin || 0, rateMax || 50)}
                      disabled={(rateValue as number) >= (rateMax || 50)}
                      className="w-8 h-8 flex items-center justify-center border border-[#2A2A2A] text-white/40 hover:text-white hover:border-white/30 transition-colors disabled:opacity-30"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  // Simple card for deferments (no rate adjuster)
  const DefermentCard = () => {
    const hasValue = inputs.deferments > 0;
    const isActive = activeAccordion === 'deferments';

    return (
      <div
        className={cn(
          "border transition-all duration-300",
          hasValue 
            ? "border-gold/30 bg-gold/5" 
            : isActive
              ? "border-gold/20 bg-gold/[0.02]"
              : "border-[#1A1A1A] bg-black hover:border-[#2A2A2A]"
        )}
      >
        <button
          onClick={() => setActiveAccordion(isActive ? null : 'deferments')}
          className="w-full p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 flex items-center justify-center border transition-colors",
              hasValue ? "border-gold/30 text-gold" : "border-white/10 text-white/30"
            )}>
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold tracking-wider text-white uppercase">Deferments</div>
              {hasValue && (
                <div className="text-xs text-gold font-mono mt-0.5">
                  {formatCompactCurrency(inputs.deferments)}
                </div>
              )}
            </div>
          </div>
          <div className="text-white/20">
            {isActive ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </div>
        </button>

        <Collapsible open={isActive}>
          <CollapsibleContent>
            <div className="px-4 pb-4 pt-0 space-y-4">
              <p className="text-xs text-white/40 leading-relaxed border-l-2 border-white/10 pl-3">
                Deferred compensation paid after investors recoup. Typically producer fees, director fees, or talent participation.
              </p>

              <div
                className={cn(
                  "flex items-center border transition-all",
                  hasValue ? "border-gold/30" : "border-[#2A2A2A]"
                )}
              >
                <span className="pl-4 pr-2 font-mono text-white/40">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatValue(inputs.deferments)}
                  onChange={(e) => onUpdateInput('deferments', parseValue(e.target.value))}
                  placeholder="0"
                  className="flex-1 bg-transparent py-3 pr-4 outline-none font-mono text-xl text-white text-right placeholder:text-white/20 tabular-nums"
                />
              </div>

              <p className="text-[10px] text-white/30 leading-relaxed">
                Deferments are paid after equity investors recoup their principal + premium, but before the 50/50 profit split.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  return (
    <StandardStepLayout
      icon={Wallet}
      title="Build Your"
      titleHighlight="Capital Stack"
      subtitle="Define how your budget is funded"
      sectionLabel="Sources of Funds"
      sectionIcon={Coins}
      isCompleted={isCompleted}
      quickReference={
        inputs.budget > 0 ? (
          <div className="mt-6 p-4 border border-gold/20 bg-gold/[0.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/50">Total Capital</span>
              <span className="font-mono text-xl text-gold">{formatCompactCurrency(totalCapital)}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-2">
              <div 
                className={cn(
                  "h-full transition-all duration-500",
                  gapPercent >= 100 ? "bg-gold" : "bg-gold/50"
                )}
                style={{ width: `${Math.min(gapPercent, 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-white/30">Budget: {formatCompactCurrency(inputs.budget)}</span>
              <span className={cn(
                "font-mono text-xs font-bold",
                gapPercent >= 100 ? "text-gold" : "text-white/50"
              )}>
                {gapPercent.toFixed(0)}% Funded
              </span>
            </div>
            
            {gapPercent < 100 && (
              <p className="text-xs text-white/40 mt-3 text-right">
                Gap: <span className="text-white/70">{formatCompactCurrency(inputs.budget - totalCapital)}</span>
              </p>
            )}
          </div>
        ) : null
      }
    >
      {/* Onboarding Card - Shows only when no capital entered */}
      {!hasAnyCapital && (
        <div
          className="mb-6 p-5 border border-gold/30 bg-gold/[0.03] animate-fade-in"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <div className="flex items-start gap-3 mb-3">
            <Layers className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <h3 className="text-base font-bold text-gold">
              Your Capital Stack
            </h3>
          </div>
          <p className="text-sm text-text-primary leading-relaxed mb-3">
            This is how your film gets funded. Most indie films use a combination of these sources:
          </p>
          <ul className="text-sm text-text-mid space-y-1.5 ml-1">
            <li className="flex items-start gap-2">
              <span className="text-gold">•</span>
              <span><span className="text-white font-medium">Tax Credits</span> — Government incentives (usually 20-40%)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold">•</span>
              <span><span className="text-white font-medium">Senior Debt</span> — Bank loans secured by pre-sales</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold">•</span>
              <span><span className="text-white font-medium">Gap/Mezz</span> — Bridge financing at higher rates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold">•</span>
              <span><span className="text-white font-medium">Equity</span> — Investor capital with premium returns</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold">•</span>
              <span><span className="text-white font-medium">Deferments</span> — Deferred fees paid after recoupment</span>
            </li>
          </ul>
          <p className="text-xs text-text-dim mt-4">
            Tap each source below to add amounts. Leave blank if not used.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {/* Tax Credits */}
        <CapitalSourceCard
          label="Tax Credits"
          icon={Building2}
          description="Government incentives (20-40% of spend). Usually the first money in, secured against production spend."
          value={inputs.credits}
          field="credits"
          accordionId="tax"
        />

        {/* Senior Debt */}
        <CapitalSourceCard
          label="Senior Debt"
          icon={Banknote}
          description="Bank loans secured by pre-sales or tax credits. Lowest risk, lowest return."
          value={inputs.debt}
          field="debt"
          rateField="seniorDebtRate"
          rateLabel="Interest"
          rateMin={0}
          rateMax={20}
          rateDelta={1}
          accordionId="senior"
        />

        {/* Gap / Mezz Debt */}
        <CapitalSourceCard
          label="Gap / Mezz Debt"
          icon={Landmark}
          description="Higher risk loans bridging the gap between senior debt and equity. Higher interest rates."
          value={inputs.mezzanineDebt}
          field="mezzanineDebt"
          rateField="mezzanineRate"
          rateLabel="Interest"
          rateMin={0}
          rateMax={30}
          rateDelta={1}
          accordionId="mezz"
        />

        {/* Equity */}
        <CapitalSourceCard
          label="Equity"
          icon={Coins}
          description="Investor capital. Highest risk, highest reward (usually 120% premium + 50% profits)."
          value={inputs.equity}
          field="equity"
          rateField="premium"
          rateLabel="Premium"
          rateMin={0}
          rateMax={50}
          rateDelta={5}
          accordionId="equity"
        />

        {/* Deferments */}
        <DefermentCard />
      </div>
    </StandardStepLayout>
  );
};

export default StackTab;
