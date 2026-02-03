import { PremiumInput } from "@/components/ui/premium-input";
import { WaterfallInputs } from "@/lib/waterfall";
import { Info, Film, DollarSign } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import StandardStepLayout from "../StandardStepLayout";

interface BudgetStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const BudgetStep = ({ inputs, onUpdateInput }: BudgetStepProps) => {
  const [showHelp, setShowHelp] = useState(false);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  const isCompleted = inputs.budget > 0;

  return (
    <StandardStepLayout
      icon={Film}
      title="What did it cost"
      titleHighlight="to make your film?"
      subtitle="All-in production cost. Development through delivery. The whole thing."
      sectionLabel="Production Budget"
      sectionIcon={DollarSign}
      isCompleted={isCompleted}
      quickReference={
        <div className="flex items-center justify-between py-3 px-5 bg-[#0A0A0A] border border-[#1A1A1A]">
          <span className="text-xs text-white/30">Typical indie range</span>
          <span className="text-xs font-mono text-white/50">$500K - $10M</span>
        </div>
      }
      helpContent={
        <Collapsible open={showHelp} onOpenChange={setShowHelp}>
          <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 text-sm text-gold/70 hover:text-gold transition-colors py-3">
            <Info className="w-4 h-4" />
            <span>What should I include?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="glass-card-gold p-5 animate-reveal-up">
              <p className="text-sm text-white/70 mb-3 leading-relaxed">
                <span className="text-gold font-semibold">Negative Cost</span> is the total capital
                required to produce the master and deliver to distributors.
              </p>
              <div className="premium-divider-gold mb-3" />
              <div className="space-y-2 text-xs text-white/40">
                <p className="flex items-start gap-2">
                  <span className="text-gold">+</span>
                  <span>Above-the-Line (talent, director, writer)</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gold">+</span>
                  <span>Below-the-Line (crew, equipment, locations)</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gold">+</span>
                  <span>Post-production & deliverables</span>
                </p>
                <p className="flex items-start gap-2 text-white/30">
                  <span className="text-white/20">−</span>
                  <span>Excludes: marketing, sales fees, financing costs</span>
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      }
    >
      <PremiumInput
        type="text"
        inputMode="numeric"
        value={formatValue(inputs.budget)}
        onChange={(e) => onUpdateInput('budget', parseValue(e.target.value))}
        placeholder="2,000,000"
        showCurrency
        label="Negative Cost"
        example="$2,000,000"
        actionHint="Enter your film's total budget"
        isCompleted={isCompleted}
        isNext={!isCompleted}
      />
    </StandardStepLayout>
  );
};

export default BudgetStep;
