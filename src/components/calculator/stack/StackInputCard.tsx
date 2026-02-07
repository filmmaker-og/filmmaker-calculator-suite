import { LucideIcon, ArrowLeft, ArrowRight, Check, SkipForward, Info } from "lucide-react";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { PremiumInput } from "@/components/ui/premium-input";
import { PercentStepper } from "@/components/ui/percent-stepper";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import StandardStepLayout from "../StandardStepLayout";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <StandardStepLayout
      chapter="02"
      title={title}
      subtitle={subtitle}
    >
      <div className="space-y-6">
        
        {/* Main Input Card - Matte Look */}
        <div className="bg-bg-elevated border border-border-default rounded-lg transition-all focus-within:border-gold/50 focus-within:shadow-focus focus-within:bg-bg-surface overflow-hidden">
          {/* Section header */}
          <div className="px-5 py-3 border-b border-border-subtle flex items-center justify-between bg-bg-surface/50">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-text-dim font-bold">
                {amountLabel}
              </span>
              {helpText && (
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Info className="w-3.5 h-3.5 text-text-dim/50 hover:text-gold cursor-pointer transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[200px] bg-bg-card border-border-subtle text-xs">
                      <p>{helpText}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
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
            <div className="p-5 border-t border-border-subtle bg-bg-surface/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-xs font-mono font-bold bg-gold text-black rounded-sm">
                  %
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
            <div className="border-t border-border-subtle bg-bg-void/30">
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
            <div className="px-5 py-3 border-t border-border-subtle bg-bg-surface/20">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-dim">Typical range</span>
                <span className="text-xs font-mono text-text-mid">{typicalRangeLabel}</span>
              </div>
            </div>
          )}
        </div>

        {/* HELP TEXT REMOVED FROM BOTTOM - Now in Tooltip */}
        {/* Navigation Buttons (Custom) */}
        <div className="flex items-center gap-3 pt-2">
          {/* Back */}
          <button
            onClick={onBack}
            className={cn(
              "flex-1 py-3 flex items-center justify-center gap-2",
              "border border-border-subtle text-text-mid",
              "hover:border-text-dim hover:text-text-primary transition-all",
              "active:scale-[0.98]",
              "rounded-md"
            )}
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
                "bg-gold-cta-subtle border border-gold-cta-muted text-gold-cta",
                "hover:bg-gold-cta-subtle hover:border-gold-cta transition-all",
                "active:scale-[0.98]",
                "rounded-md shadow-button"
              )}
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
                "active:scale-[0.98]",
                "rounded-md"
              )}
            >
              <span className="text-xs font-medium uppercase tracking-wider">Skip This</span>
              <SkipForward className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
    </StandardStepLayout>
  );
};

export default StackInputCard;
