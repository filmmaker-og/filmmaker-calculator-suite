import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { Minus, Plus, Coins, Building2, Banknote, Landmark, Layers, Clock } from "lucide-react";
import { useHaptics } from "@/hooks/use-haptics";
import { cn } from "@/lib/utils";
import ChapterCard from "../ChapterCard";
import GlossaryTrigger, { GLOSSARY } from "../GlossaryTrigger";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useState, useRef } from "react";

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

  // Accordion order for Enter key navigation
  const accordionOrder = ['tax', 'senior', 'mezz', 'equity', 'deferments'];

  const advanceToNextAccordion = (currentId: string) => {
    const currentIndex = accordionOrder.indexOf(currentId);
    if (currentIndex < accordionOrder.length - 1) {
      setActiveAccordion(accordionOrder[currentIndex + 1]);
    } else {
      setActiveAccordion(null); // Close last one
    }
  };

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
    const inputRef = useRef<HTMLInputElement>(null);
    const hasValue = value > 0;
    const rateValue = rateField ? inputs[rateField] : 0;
    const isActive = activeAccordion === accordionId;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        inputRef.current?.blur();
        setTimeout(() => advanceToNextAccordion(accordionId), 100);
      }
    };

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
        style={{ borderRadius: 'var(--radius-md)' }}
      >
        <button
          onClick={() => setActiveAccordion(isActive ? null : accordionId)}
          className="w-full p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 flex items-center justify-center border transition-colors",
              hasValue ? "border-gold/30 text-gold" : "border-white/10 text-white/30"
            )} style={{ borderRadius: 'var(--radius-sm)' }}>
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
                  hasValue ? "border-gold/30" : "border-[#2A2A2A]"
                )}
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <span className="pl-4 pr-2 font-mono text-white/40">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  value={formatValue(value)}
                  onChange={(e) => onUpdateInput(field, parseValue(e.target.value))}
                  onKeyDown={handleKeyDown}
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
                      style={{ borderRadius: 'var(--radius-sm)' }}
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
                      style={{ borderRadius: 'var(--radius-sm)' }}
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
    const inputRef = useRef<HTMLInputElement>(null);
    const hasValue = inputs.deferments > 0;
    const isActive = activeAccordion === 'deferments';

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        inputRef.current?.blur();
        setActiveAccordion(null); // Last item, just close
      }
    };

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
        style={{ borderRadius: 'var(--radius-md)' }}
      >
        <button
          onClick={() => setActiveAccordion(isActive ? null : 'deferments')}
          className="w-full p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 flex items-center justify-center border transition-colors",
              hasValue ? "border-gold/30 text-gold" : "border-white/10 text-white/30"
            )} style={{ borderRadius: 'var(--radius-sm)' }}>
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
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <span className="pl-4 pr-2 font-mono text-white/40">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  value={formatValue(inputs.deferments)}
                  onChange={(e) => onUpdateInput('deferments', parseValue(e.target.value))}
                  onKeyDown={handleKeyDown}
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
    <div className="space-y-6 pb-8">
      {/* Onboarding Card - Shows only when no capital entered */}
      {!hasAnyCapital && (
        <div
          className="p-5 border border-gold/30 bg-gold/[0.03] animate-fade-in"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <div className="flex items-start gap-3 mb-3">
            <Layers className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <h3 className="text-base font-bold text-gold">
              Now let's fund your film.
            </h3>
          </div>
          <p className="text-sm text-text-primary leading-relaxed mb-4">
            The <span className="text-white font-medium">capital stack</span> is how your budget gets funded. It's the combination of money sources—each with different risk levels, costs, and repayment priorities.
          </p>
          <p className="text-sm text-text-mid leading-relaxed mb-4">
            Why does this matter? Because <span className="text-white font-medium">whoever puts money in first gets paid back first</span>. This "waterfall" of repayment determines who takes the most risk—and who gets the biggest reward.
          </p>
          <div className="p-3 bg-white/[0.02] border border-white/10 mb-4" style={{ borderRadius: 'var(--radius-md)' }}>
            <p className="text-xs text-text-dim leading-relaxed">
              <span className="text-gold font-medium">Typical indie structure:</span> Tax credits (safest) → Senior debt → Gap/mezz debt → Equity (riskiest, but highest upside)
            </p>
          </div>
          <p className="text-xs text-text-dim">
            Tap each source below to add amounts. Leave blank if not applicable.
          </p>
        </div>
      )}

      <ChapterCard
        chapter="02"
        title="CAPITAL STACK"
        isActive={true}
        glossaryTrigger={<GlossaryTrigger {...GLOSSARY.capitalStack} />}
      >
        {/* Progress indicator */}
        {inputs.budget > 0 && (
          <div className="mb-6 p-4 border border-border-default bg-bg-surface" style={{ borderRadius: 'var(--radius-md)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-text-dim">Total Capital</span>
              <span className="font-mono text-lg text-gold">{formatCompactCurrency(totalCapital)}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-2 w-full bg-white/10 overflow-hidden mb-2" style={{ borderRadius: 'var(--radius-sm)' }}>
              <div 
                className={cn(
                  "h-full transition-all duration-500",
                  gapPercent >= 100 ? "bg-gold" : "bg-gold/50"
                )}
                style={{ width: `${Math.min(gapPercent, 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-text-dim">Budget: {formatCompactCurrency(inputs.budget)}</span>
              <span className={cn(
                "font-mono text-xs font-bold",
                gapPercent >= 100 ? "text-gold" : "text-text-mid"
              )}>
                {gapPercent.toFixed(0)}% Funded
              </span>
            </div>
            
            {gapPercent < 100 && gapPercent > 0 && (
              <p className="text-xs text-text-dim mt-2 text-right">
                Gap: <span className="text-white font-mono">{formatCompactCurrency(inputs.budget - totalCapital)}</span>
              </p>
            )}
          </div>
        )}

        {/* Capital Sources */}
        <div className="space-y-3">
          <CapitalSourceCard
            label="Tax Credits"
            icon={Building2}
            description="Government incentives (20-40% of spend). Usually the first money in, secured against production spend."
            value={inputs.credits}
            field="credits"
            accordionId="tax"
          />

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

          <DefermentCard />
        </div>
      </ChapterCard>
    </div>
  );
};

export default StackTab;
