import { useState } from "react";
import { WaterfallResult, WaterfallInputs, formatCurrency, formatPercent } from "@/lib/waterfall";
import { Info, CheckCircle2, AlertTriangle, TrendingUp, Target, DollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface WizardStep5Props {
  result: WaterfallResult;
  inputs: WaterfallInputs;
}

const WizardStep5 = ({ result, inputs }: WizardStep5Props) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Calculate ROI: (Total Distributions / Total Cash Invested)
  const totalInvested = inputs.debt + inputs.equity;
  const totalDistributed = result.recouped + result.profitPool;
  const roi = totalInvested > 0 ? (totalDistributed / totalInvested) * 100 : 0;

  // Net Profit (Loss)
  const netProfit = result.profitPool;

  // Breakeven Point (the total hurdle amount)
  const breakevenPoint = result.totalHurdle;

  // Calculate category amounts for the flow
  const firstMoneyOut = result.cam + result.salesFee + result.guilds + result.marketing;
  const debtService = result.ledger.find(l => l.name === "Senior Debt")?.amount || 0;
  const equityPrem = result.ledger.find(l => l.name === "Equity")?.amount || 0;

  // Calculate what was actually paid based on waterfall logic
  const revenue = inputs.revenue;
  let remaining = revenue;

  // First Money Out
  const firstMoneyPaid = Math.min(remaining, firstMoneyOut);
  remaining = Math.max(0, remaining - firstMoneyOut);
  const firstMoneyStatus = firstMoneyPaid >= firstMoneyOut ? 'paid' : firstMoneyPaid > 0 ? 'partial' : 'unpaid';

  // Debt Service
  const debtPaid = Math.min(remaining, debtService);
  remaining = Math.max(0, remaining - debtService);
  const debtStatus = debtPaid >= debtService ? 'paid' : debtPaid > 0 ? 'partial' : 'unpaid';

  // Equity & Premium
  const equityPaid = Math.min(remaining, equityPrem);
  remaining = Math.max(0, remaining - equityPrem);
  const equityStatus = equityPaid >= equityPrem ? 'paid' : equityPaid > 0 ? 'partial' : 'unpaid';

  // Net Profit Pool (whatever remains)
  const profitStatus = remaining > 0 ? 'paid' : 'unpaid';

  const StatusBadge = ({ status }: { status: 'paid' | 'partial' | 'unpaid' }) => {
    if (status === 'paid') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-wider">
          <CheckCircle2 size={10} />
          Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-red-500/20 text-red-400 text-[10px] font-mono uppercase tracking-wider">
        <AlertTriangle size={10} />
        {status === 'partial' ? 'Partial' : 'Unpaid'}
      </span>
    );
  };

  return (
    <div className="animate-fade-in space-y-5">
      {/* HERO METRICS - Three Key Numbers */}
      <div className="grid grid-cols-3 gap-3">
        {/* ROI */}
        <div className="p-4 rounded-sm text-center" style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a' }}>
          <div className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D4AF37' }}>
            <TrendingUp size={16} className="text-black" />
          </div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">ROI</p>
          <p className="font-bebas text-2xl" style={{ color: '#D4AF37' }}>
            {formatPercent(roi)}
          </p>
        </div>

        {/* Net Profit */}
        <div className="p-4 rounded-sm text-center" style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a' }}>
          <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${netProfit >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}>
            <DollarSign size={16} className="text-black" />
          </div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Net Profit</p>
          <p className={`font-mono text-lg ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {netProfit >= 0 ? '+' : ''}{formatCurrency(netProfit)}
          </p>
        </div>

        {/* Breakeven */}
        <div className="p-4 rounded-sm text-center" style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a' }}>
          <div className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center bg-zinc-700">
            <Target size={16} className="text-white" />
          </div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Breakeven</p>
          <p className="font-mono text-lg text-zinc-300">
            {formatCurrency(breakevenPoint)}
          </p>
        </div>
      </div>

      {/* WATERFALL FLOW - Clean Vertical List */}
      <div className="rounded-sm overflow-hidden" style={{ border: '1px solid #D4AF37' }}>
        {/* Header */}
        <div className="py-3 px-4 flex items-center justify-between" style={{ backgroundColor: '#111111', borderBottom: '1px solid #333333' }}>
          <h2 className="font-bebas text-base tracking-wider uppercase" style={{ color: '#D4AF37' }}>
            Priority of Payments
          </h2>
          <button
            onClick={() => setShowInfoModal(true)}
            className="p-1.5 rounded-sm transition-colors hover:bg-zinc-800"
            aria-label="Info"
          >
            <Info size={14} className="text-[#D4AF37]" />
          </button>
        </div>

        {/* Flow Items */}
        <div style={{ backgroundColor: '#000000' }}>
          {/* Item 1 */}
          <div className="px-4 py-3 flex items-center gap-3 border-b border-zinc-800/50">
            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-mono text-zinc-400">1</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">First Money Out</p>
              <p className="text-[10px] text-zinc-500 truncate">Guilds / Sales / CAM</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-mono text-sm text-white">{formatCurrency(firstMoneyPaid)}</p>
              <StatusBadge status={firstMoneyStatus} />
            </div>
          </div>

          {/* Item 2 */}
          <div className="px-4 py-3 flex items-center gap-3 border-b border-zinc-800/50">
            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-mono text-zinc-400">2</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">Debt Service</p>
              <p className="text-[10px] text-zinc-500 truncate">Senior + Gap + Interest</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-mono text-sm text-white">{formatCurrency(debtPaid)}</p>
              <StatusBadge status={debtStatus} />
            </div>
          </div>

          {/* Item 3 */}
          <div className="px-4 py-3 flex items-center gap-3 border-b border-zinc-800/50">
            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-mono text-zinc-400">3</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">Equity & Premium</p>
              <p className="text-[10px] text-zinc-500 truncate">Capital + Preferred Return</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-mono text-sm text-white">{formatCurrency(equityPaid)}</p>
              <StatusBadge status={equityStatus} />
            </div>
          </div>

          {/* Item 4 - Highlighted */}
          <div className="px-4 py-4 flex items-center gap-3" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D4AF37' }}>
              <span className="text-[10px] font-mono text-black font-bold">4</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#D4AF37' }}>Net Profit Pool</p>
              <p className="text-[10px] text-zinc-500 truncate">Available for Distribution</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-mono text-lg" style={{ color: '#D4AF37' }}>{formatCurrency(remaining)}</p>
              <StatusBadge status={profitStatus} />
            </div>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="bg-[#111111] border-[#D4AF37] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl tracking-wider text-[#D4AF37]">
              WATERFALL DEFINITIONS
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <h3 className="font-bebas text-lg text-[#D4AF37] mb-1">ROI (RETURN ON INVESTMENT)</h3>
              <DialogDescription className="text-zinc-400 text-sm leading-relaxed">
                Calculated as (Total Distributions / Total Cash Invested). A figure above 100% indicates profit.
              </DialogDescription>
            </div>
            <div className="border-t border-zinc-800 pt-4">
              <h3 className="font-bebas text-lg text-[#D4AF37] mb-1">PRIORITY OF PAYMENTS</h3>
              <DialogDescription className="text-zinc-400 text-sm leading-relaxed">
                Funds are distributed in strict order. Senior Debt pays before Gap; Gap pays before Equity. If the waterfall stops at Debt, Equity gets zero.
              </DialogDescription>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WizardStep5;
