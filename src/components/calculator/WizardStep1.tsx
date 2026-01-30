import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Info, ArrowDown } from "lucide-react";
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

  // Quick visual indicator of profit/loss
  const delta = revenue - budget;
  const isProfitable = delta > 0;

  return (
    <div className="step-enter space-y-4">
      {/* Terminal Card - Budget */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        {/* Header Strip */}
        <div className="py-3 px-4 border-b border-[#333333] flex items-center justify-between" style={{ backgroundColor: '#111111' }}>
          <div className="flex items-center gap-2">
            <h2 className="font-bebas text-lg tracking-wider uppercase" style={{ color: '#D4AF37' }}>
              PRODUCTION BUDGET
            </h2>
            <button
              onClick={() => setInfoBudgetOpen(true)}
              className="transition-all duration-100 hover:opacity-80 active:scale-95 p-1.5 -m-1.5"
              aria-label="More information"
            >
              <Info className="w-4 h-4" style={{ color: '#D4AF37' }} />
            </button>
          </div>
        </div>

        {/* Body Area */}
        <div className="p-4" style={{ backgroundColor: '#000000' }}>
          {/* Label Row */}
          <div className="mb-3">
            <span className="text-white font-bold text-xs tracking-wide uppercase">
              NEGATIVE COST
            </span>
          </div>

          {/* Input Box */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-600">
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
              placeholder="0"
              className="pl-9 py-5 text-xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all focus:scale-[1.01] min-h-[52px]"
              style={{ backgroundColor: '#0a0a0a' }}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>
      </div>

      {/* Arrow Divider */}
      <div className="flex items-center justify-center py-1">
        <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center">
          <ArrowDown className="w-4 h-4 text-zinc-500" />
        </div>
      </div>

      {/* Terminal Card - Revenue */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        {/* Header Strip */}
        <div className="py-3 px-4 border-b border-[#333333] flex items-center justify-between" style={{ backgroundColor: '#111111' }}>
          <div className="flex items-center gap-2">
            <h2 className="font-bebas text-lg tracking-wider uppercase" style={{ color: '#D4AF37' }}>
              STREAMER BUYOUT
            </h2>
            <button
              onClick={() => setInfoRevenueOpen(true)}
              className="transition-all duration-100 hover:opacity-80 active:scale-95 p-1.5 -m-1.5"
              aria-label="More information"
            >
              <Info className="w-4 h-4" style={{ color: '#D4AF37' }} />
            </button>
          </div>
        </div>

        {/* Body Area */}
        <div className="p-4" style={{ backgroundColor: '#000000' }}>
          {/* Label Row */}
          <div className="mb-3">
            <span className="text-white font-bold text-xs tracking-wide uppercase">
              ACQUISITION PRICE
            </span>
          </div>

          {/* Input Box */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-600">
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
              placeholder="0"
              className="pl-9 py-5 text-xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all focus:scale-[1.01] min-h-[52px]"
              style={{ backgroundColor: '#0a0a0a' }}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>
      </div>

      {/* Quick Delta Indicator */}
      {budget > 0 && revenue > 0 && (
        <div 
          className="p-3 rounded-sm text-center"
          style={{ 
            backgroundColor: isProfitable ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${isProfitable ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}
        >
          <span className="text-xs uppercase tracking-widest text-zinc-500 mr-2">Gross Spread:</span>
          <span className={`font-mono text-sm ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
            {isProfitable ? '+' : ''}{delta.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
          </span>
        </div>
      )}

      {/* Budget Info Modal */}
      <Dialog open={infoBudgetOpen} onOpenChange={setInfoBudgetOpen}>
        <DialogContent 
          className="max-w-md rounded-sm"
          style={{ 
            backgroundColor: '#111111',
            border: '1px solid #D4AF37'
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl tracking-wider" style={{ color: '#D4AF37' }}>
              NEGATIVE COST
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5 mt-4">
            <div>
              <h4 className="text-white font-bold text-sm mb-2">DEFINITION</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#999999' }}>
                The total capital required to produce the master and deliver to distributors. 
                Includes all Above-the-Line (Talent) and Below-the-Line (Crew/Locations) expenses. 
                Excludes marketing (P&A), sales fees, and financing costs.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-2">THE BOTTOM LINE</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#999999' }}>
                This is your "Cost Basis." This number must be fully recouped from the Buyout Price 
                before Net Profits are calculated.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Revenue Info Modal */}
      <Dialog open={infoRevenueOpen} onOpenChange={setInfoRevenueOpen}>
        <DialogContent 
          className="max-w-md rounded-sm"
          style={{ 
            backgroundColor: '#111111',
            border: '1px solid #D4AF37'
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl tracking-wider" style={{ color: '#D4AF37' }}>
              STREAMER ACQUISITION
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5 mt-4">
            <div>
              <h4 className="text-white font-bold text-sm mb-2">DEFINITION</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#999999' }}>
                In a Cost-Plus buyout (Netflix/Amazon/Apple), the streamer purchases 100% of the 
                copyright for a fixed price. This fee usually covers the Negative Cost plus a 
                negotiated Premium (Profit).
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-2">THE GOAL</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#999999' }}>
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
