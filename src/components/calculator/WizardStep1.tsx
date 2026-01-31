import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Info, DollarSign, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WizardStep1Props {
  budget: number;
  revenue: number;
  onUpdateBudget: (value: number) => void;
  onUpdateRevenue: (value: number) => void;
}

const WizardStep1 = ({ budget, revenue, onUpdateBudget, onUpdateRevenue }: WizardStep1Props) => {
  const [infoBudgetOpen, setInfoBudgetOpen] = useState(false);
  const [infoRevenueOpen, setInfoRevenueOpen] = useState(false);

  return (
    <div className="step-enter space-y-5">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
          <span className="text-gold font-bebas text-sm">1</span>
        </div>
        <div>
          <h2 className="font-bebas text-lg text-foreground tracking-wide">THE DEAL</h2>
          <p className="text-xs text-muted-foreground">
            How much does it cost to make? How much will the streamer pay?
          </p>
        </div>
      </div>

      {/* Card A: Production Budget */}
      <div className="rounded-sm border border-border overflow-hidden" style={{ borderLeft: '3px solid hsl(var(--gold))' }}>
        <div className="py-3 px-4 flex items-center justify-between bg-card border-b border-border">
          <div className="flex items-center gap-3">
            <DollarSign className="w-4 h-4 text-gold" />
            <h3 className="font-bebas text-sm tracking-widest uppercase text-gold">
              PRODUCTION BUDGET
            </h3>
          </div>
          <button
            onClick={() => setInfoBudgetOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors"
            aria-label="More information"
          >
            <Info className="w-4 h-4 text-muted-foreground hover:text-gold transition-colors" />
          </button>
        </div>

        <div className="p-5 bg-background">
          <div className="mb-2">
            <span className="text-xs tracking-wider uppercase font-semibold text-foreground">
              NEGATIVE COST
            </span>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Total cost to produce and deliver (excl. marketing)
            </p>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">
              $
            </span>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={budget === 0 ? '' : budget.toLocaleString()}
              onChange={(e) => {
                const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                onUpdateBudget(value);
              }}
              placeholder="2,000,000"
              className="pl-10 h-14 text-xl font-mono text-foreground text-right rounded-sm border-border focus:border-gold focus:ring-1 focus:ring-gold transition-all bg-card"
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>
      </div>

      {/* Card B: Streamer Buyout */}
      <div className="rounded-sm border border-border overflow-hidden" style={{ borderLeft: '3px solid hsl(var(--gold))' }}>
        <div className="py-3 px-4 flex items-center justify-between bg-card border-b border-border">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-gold" />
            <h3 className="font-bebas text-sm tracking-widest uppercase text-gold">
              STREAMER BUYOUT
            </h3>
          </div>
          <button
            onClick={() => setInfoRevenueOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors"
            aria-label="More information"
          >
            <Info className="w-4 h-4 text-muted-foreground hover:text-gold transition-colors" />
          </button>
        </div>

        <div className="p-5 bg-background">
          <div className="mb-2">
            <span className="text-xs tracking-wider uppercase font-semibold text-foreground">
              ACQUISITION PRICE
            </span>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Netflix/Amazon typically pay 100-120% of budget
            </p>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">
              $
            </span>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={revenue === 0 ? '' : revenue.toLocaleString()}
              onChange={(e) => {
                const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                onUpdateRevenue(value);
              }}
              placeholder="3,500,000"
              className="pl-10 h-14 text-xl font-mono text-foreground text-right rounded-sm border-border focus:border-gold focus:ring-1 focus:ring-gold transition-all bg-card"
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>
      </div>

      {/* Hint Card */}
      <div className="p-4 rounded-sm bg-card/50 border border-border/50">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          <span className="text-gold font-semibold">TIP:</span> In a Cost-Plus deal, the streamer pays a fixed buyout price for 100% of the rights.
          This acquisition price is your total revenue — all waterfall distributions come from this pot.
        </p>
      </div>

      {/* Budget Info Modal */}
      <Dialog open={infoBudgetOpen} onOpenChange={setInfoBudgetOpen}>
        <DialogContent className="max-w-md rounded-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl tracking-wider text-gold">
              NEGATIVE COST
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-4">
            <div>
              <h4 className="text-foreground font-bold text-sm mb-2">DEFINITION</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The total capital required to produce the master and deliver to distributors.
                Includes all Above-the-Line (Talent) and Below-the-Line (Crew/Locations) expenses.
                Excludes marketing (P&A), sales fees, and financing costs.
              </p>
            </div>

            <div>
              <h4 className="text-foreground font-bold text-sm mb-2">THE BOTTOM LINE</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                This is your "Cost Basis." This number must be fully recouped from the Buyout Price
                before Net Profits are calculated.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Revenue Info Modal */}
      <Dialog open={infoRevenueOpen} onOpenChange={setInfoRevenueOpen}>
        <DialogContent className="max-w-md rounded-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl tracking-wider text-gold">
              STREAMER ACQUISITION
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-4">
            <div>
              <h4 className="text-foreground font-bold text-sm mb-2">DEFINITION</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                In a Cost-Plus buyout (Netflix/Amazon/Apple), the streamer purchases 100% of the
                copyright for a fixed price. This fee usually covers the Negative Cost plus a
                negotiated Premium (Profit).
              </p>
            </div>

            <div>
              <h4 className="text-foreground font-bold text-sm mb-2">THE GOAL</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                This number is the "Gross Receipts" for the purpose of the waterfall. It is the
                single pot of money from which all debts and equity must be repaid.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WizardStep1;
