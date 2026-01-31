import { Input } from "@/components/ui/input";
import { WaterfallInputs } from "@/lib/waterfall";
import { Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface DealStepProps {
  inputs: WaterfallInputs;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
}

const DealStep = ({ inputs, onUpdateInput }: DealStepProps) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string) => {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0;
  };

  const modals: Record<string, { title: string; content: React.ReactNode }> = {
    budget: {
      title: "NEGATIVE COST",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <p>The total capital required to produce the master and deliver to distributors. Includes all Above-the-Line and Below-the-Line expenses.</p>
          <p className="text-xs text-muted-foreground/70">Excludes marketing, sales fees, and financing costs.</p>
        </div>
      )
    },
    revenue: {
      title: "ACQUISITION PRICE",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <p>In a Cost-Plus buyout (Netflix/Amazon/Apple), the streamer purchases 100% of the copyright for a fixed price.</p>
          <p>This is your "Gross Receipts" — the single pot from which all debts and equity are repaid.</p>
        </div>
      )
    }
  };

  return (
    <div className="step-enter">
      {/* Step Header */}
      <div className="text-center mb-8">
        <h2 className="font-bebas text-2xl tracking-[0.15em] text-gold mb-2">
          THE DEAL
        </h2>
        <p className="text-white/50 text-sm">
          Enter your production budget and the streamer's offer
        </p>
      </div>

      {/* Single Focused Card */}
      <div className="bg-card border border-border p-6 space-y-6">
        {/* Budget */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs tracking-wider uppercase font-semibold text-foreground">
              Production Budget
            </label>
            <button
              onClick={() => setActiveModal('budget')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors"
            >
              <Info className="w-4 h-4 text-gold" />
            </button>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xl text-muted-foreground">$</span>
            <Input
              type="text"
              inputMode="numeric"
              value={formatValue(inputs.budget)}
              onChange={(e) => onUpdateInput('budget', parseValue(e.target.value))}
              placeholder="2,000,000"
              className="pl-12 h-16 text-2xl font-mono text-foreground text-right rounded-none border-border focus:border-gold focus:ring-0 bg-background"
              onFocus={(e) => e.target.select()}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">Total cost to produce and deliver the film</p>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Revenue */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs tracking-wider uppercase font-semibold text-foreground">
              Acquisition Price
            </label>
            <button
              onClick={() => setActiveModal('revenue')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors"
            >
              <Info className="w-4 h-4 text-gold" />
            </button>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xl text-muted-foreground">$</span>
            <Input
              type="text"
              inputMode="numeric"
              value={formatValue(inputs.revenue)}
              onChange={(e) => onUpdateInput('revenue', parseValue(e.target.value))}
              placeholder="3,500,000"
              className="pl-12 h-16 text-2xl font-mono text-foreground text-right rounded-none border-border focus:border-gold focus:ring-0 bg-background"
              onFocus={(e) => e.target.select()}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">Netflix/Amazon typically pay 100-130% of budget</p>
        </div>
      </div>

      {/* Helpful Context */}
      <div className="mt-6 p-4 border border-border/50 bg-card/50">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-gold font-semibold">TIP:</span> In streamer buyouts, the acquisition price is your total revenue. There are no backend residuals or profit participation from the platform.
        </p>
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

export default DealStep;
