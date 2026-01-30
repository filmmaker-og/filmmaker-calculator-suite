import { useState } from "react";
import { WaterfallResult, WaterfallInputs, formatCompactCurrency, formatPercent } from "@/lib/waterfall";
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
  const isProfitable = roi >= 100;

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
        <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
      );
    }
    if (status === 'partial') {
      return (
        <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
      );
    }
    return (
      <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
    );
  };

  return (
    <div className="step-enter space-y-4">
      {/* RESULTS DIVIDER */}
      <div className="flex items-center gap-3 mb-2">
        <div className="h-px flex-1 bg-zinc-800" />
        <span className="text-[10px] uppercase tracking-widest text-zinc-500">
          RESULTS
        </span>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      {/* HERO METRIC - ROI with Status */}
      <div 
        className="p-5 rounded-sm text-center" 
        style={{ 
          backgroundColor: '#111111', 
          border: `1px solid ${isProfitable ? '#D4AF37' : '#7f1d1d'}` 
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp size={20} style={{ color: isProfitable ? '#D4AF37' : '#ef4444' }} />
          <span className="text-xs uppercase tracking-widest text-zinc-400">Return on Investment</span>
        </div>
        <p 
          className="font-bebas text-5xl mb-2" 
          style={{ color: isProfitable ? '#D4AF37' : '#ef4444' }}
        >
          {formatPercent(roi)}
        </p>
        <span 
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] font-mono uppercase tracking-wider ${
            isProfitable 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {isProfitable ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
          {isProfitable ? 'PROFITABLE' : 'UNPROFITABLE'}
        </span>
      </div>

      {/* SECONDARY METRICS - 2 Column Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Net Profit */}
        <div className="p-4 rounded-sm text-center" style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a' }}>
          <DollarSign size={14} className={`mx-auto mb-1 ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Net Profit</p>
          <p className={`font-mono text-lg ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {netProfit >= 0 ? '+' : ''}{formatCompactCurrency(netProfit)}
          </p>
        </div>

        {/* Breakeven */}
        <div className="p-4 rounded-sm text-center" style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a' }}>
          <Target size={14} className="mx-auto mb-1 text-zinc-500" />
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Breakeven</p>
          <p className="font-mono text-lg text-zinc-300">
            {formatCompactCurrency(breakevenPoint)}
          </p>
        </div>
      </div>

      {/* WATERFALL FLOW - Clean Vertical List */}
      <div className="rounded-sm overflow-hidden" style={{ border: '1px solid #333' }}>
        {/* Header */}
        <div className="py-3 px-4 flex items-center justify-between" style={{ backgroundColor: '#111111', borderBottom: '1px solid #222' }}>
          <h2 className="font-bebas text-sm tracking-wider uppercase text-zinc-300">
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
        <div style={{ backgroundColor: '#0a0a0a' }}>
          {/* Item 1 */}
          <div className="px-4 py-3 flex items-center gap-3 border-b border-zinc-900">
            <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <span className="text-[9px] font-mono text-zinc-500">1</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">First Money Out</p>
            </div>
            <p className="font-mono text-sm text-white">{formatCompactCurrency(firstMoneyPaid)}</p>
            <StatusBadge status={firstMoneyStatus} />
          </div>

          {/* Item 2 */}
          <div className="px-4 py-3 flex items-center gap-3 border-b border-zinc-900">
            <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <span className="text-[9px] font-mono text-zinc-500">2</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">Debt Service</p>
            </div>
            <p className="font-mono text-sm text-white">{formatCompactCurrency(debtPaid)}</p>
            <StatusBadge status={debtStatus} />
          </div>

          {/* Item 3 */}
          <div className="px-4 py-3 flex items-center gap-3 border-b border-zinc-900">
            <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <span className="text-[9px] font-mono text-zinc-500">3</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">Equity & Premium</p>
            </div>
            <p className="font-mono text-sm text-white">{formatCompactCurrency(equityPaid)}</p>
            <StatusBadge status={equityStatus} />
          </div>

          {/* Item 4 - Highlighted */}
          <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: 'rgba(212, 175, 55, 0.08)' }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D4AF37' }}>
              <span className="text-[9px] font-mono text-black font-bold">4</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: '#D4AF37' }}>Net Profit Pool</p>
            </div>
            <p className="font-mono text-sm" style={{ color: '#D4AF37' }}>{formatCompactCurrency(remaining)}</p>
            <StatusBadge status={profitStatus} />
          </div>
        </div>
      </div>

      {/* Info Modal */}
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="bg-[#111111] border-[#333] text-white max-w-md">
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
