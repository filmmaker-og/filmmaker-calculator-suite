import { LucideIcon, ArrowLeft, ArrowRight, Check, SkipForward } from "lucide-react";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { PremiumInput } from "@/components/ui/premium-input";
import { PercentStepper } from "@/components/ui/percent-stepper";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface RateConfig {
  field: 'seniorDebtRate' | 'mezzanineRate' | 'premium';
  label: string;
  min: number;
  max: number;
  step: number;
  standardValue: number;
  standardLabel: string;
}

interface StackInputCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  amountField: keyof WaterfallInputs;
  amountLabel: string;
  amountPlaceholder: string;
  amountHint: string;
  rateConfig?: RateConfig;
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
  typicalRangeLabel?: string;
  helpText?: string;
}

/**
 * StackInputCard - Data collection mini-app screen
 * 
 * Job: Collect one capital source amount (+ optional rate)
 * Pattern: Enter value → See calculation → Next/Skip
 */
const StackInputCard = ({
  icon: Icon,
  title,
  subtitle,
  amountField,
  amountLabel,
  amountPlaceholder,
  amountHint,
  rateConfig,
  inputs,
  onUpdateInput,
  onBack,
  onNext,
  onSkip,
  showSkip = true,
  typicalRangeLabel,
  helpText,
}: StackInputCardProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  const amount = (inputs[amountField] as number) || 0;
  const hasAmount = amount > 0;
  const rateValue = rateConfig ? (inputs[rateConfig.field] as number) : 0;
  
  // Calculate total with rate if applicable
  const totalRepayment = rateConfig ? amount * (1 + rateValue / 100) : amount;
  const interestAmount = rateConfig ? amount * (rateValue / 100) : 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
      if (hasAmount) {
        onNext();
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Header */}
      <div className="text-center mb-6">
        <div className="relative inline-block mb-4">
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
              filter: 'blur(15px)',
              transform: 'scale(2)',
            }}
          />
          <div className="relative w-14 h-14 border border-gold/30 bg-gold/5 flex items-center justify-center" style={{ borderRadius: 'var(--radius-md)' }}>
            <Icon className="w-7 h-7 text-gold" />
          </div>
        </div>

        <h2 className="font-bebas text-3xl tracking-[0.08em] text-text-primary mb-1">
          {title}
        </h2>
        <p className="text-text-dim text-xs max-w-xs mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Main Input Card */}
      <div className="matte-section overflow-hidden">
        {/* Section header */}
        <div className="matte-section-header px-5 py-3 flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-text-dim font-bold">
            {amountLabel}
          </span>
          {hasAmount && (
            <span className="text-xs text-gold font-mono flex items-center gap-1">
              <Check className="w-3 h-3" />
            </span>
          )}
        </div>

        {/* Amount Input */}
        <div className="p-5">
          <PremiumInput
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={formatValue(amount)}
            onChange={(e) => onUpdateInput(amountField, parseValue(e.target.value))}
            onKeyDown={handleKeyDown}
            placeholder={amountPlaceholder}
            showCurrency
            actionHint={amountHint}
            isCompleted={hasAmount}
            isNext={!hasAmount}
          />
        </div>

        {/* Rate Stepper (if applicable) */}
        {rateConfig && hasAmount && (
          <div className="p-5 border-t border-border-subtle">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 flex items-center justify-center text-xs font-mono font-bold bg-gold text-black">
                2
              </div>
              <span className="text-xs uppercase tracking-widest text-gold font-bold">
                {rateConfig.label}
              </span>
            </div>

            <PercentStepper
              value={rateValue}
              onChange={(value) => onUpdateInput(rateConfig.field, value)}
              min={rateConfig.min}
              max={rateConfig.max}
              step={rateConfig.step}
              standardValue={rateConfig.standardValue}
              standardLabel={rateConfig.standardLabel}
              isCompleted={true}
            />
          </div>
        )}

        {/* Calculation Result */}
        {hasAmount && rateConfig && (
          <div className="border-t border-border-subtle bg-bg-void/50">
            <div className="p-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-dim">Principal</span>
                  <span className="font-mono text-text-mid">{formatCompactCurrency(amount)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-dim">+ {rateConfig.label} ({rateValue}%)</span>
                  <span className="font-mono text-text-mid">{formatCompactCurrency(interestAmount)}</span>
                </div>
                <div className="h-px bg-gold/20" />
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-gold font-semibold">Total Repayment</span>
                  <span className="font-mono text-xl text-gold font-semibold">{formatCompactCurrency(totalRepayment)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Typical Range */}
        {typicalRangeLabel && (
          <div className="px-5 pb-5">
            <div className="flex items-center justify-between py-3 border-t border-border-subtle">
              <span className="text-xs text-text-dim">Typical range</span>
              <span className="text-xs font-mono text-text-mid">{typicalRangeLabel}</span>
            </div>
          </div>
        )}
      </div>

      {/* Help Text */}
      {helpText && (
        <p className="text-xs text-text-dim leading-relaxed text-center px-4">
          {helpText}
        </p>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-3">
        {/* Back */}
        <button
          onClick={onBack}
          className={cn(
            "flex-1 py-3 flex items-center justify-center gap-2",
            "border border-border-subtle text-text-mid",
            "hover:border-text-dim hover:text-text-primary transition-all",
            "active:scale-[0.98]"
          )}
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Back</span>
        </button>

        {/* Skip (if no value) or Next (if has value) */}
        {hasAmount ? (
          <button
            onClick={onNext}
            className={cn(
              "flex-[2] py-3 flex items-center justify-center gap-2",
              "bg-gold/10 border border-gold/30 text-gold",
              "hover:bg-gold/20 hover:border-gold/50 transition-all",
              "active:scale-[0.98]"
            )}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <span className="text-xs font-bold uppercase tracking-wider">Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : showSkip && onSkip ? (
          <button
            onClick={onSkip}
            className={cn(
              "flex-[2] py-3 flex items-center justify-center gap-2",
              "border border-border-subtle text-text-dim",
              "hover:border-white/20 hover:text-text-mid transition-all",
              "active:scale-[0.98]"
            )}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <span className="text-xs font-medium uppercase tracking-wider">Skip This</span>
            <SkipForward className="w-4 h-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default StackInputCard;
