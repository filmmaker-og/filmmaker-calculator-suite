import { useState } from "react";
import { WaterfallResult, WaterfallInputs, formatCurrency, formatPercent } from "@/lib/waterfall";
import { Info, CheckCircle2, AlertTriangle } from "lucide-react";
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
  const netProfitPool = result.profitPool;

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
        <span className="flex items-center gap-1 text-emerald-400 text-xs font-mono">
          <CheckCircle2 size={12} />
          PAID
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-red-400 text-xs font-mono">
        <AlertTriangle size={12} />
        {status === 'partial' ? 'PARTIAL' : 'UNPAID'}
      </span>
    );
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* CARD 5A: THE VERDICT - Performance Scoreboard */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        {/* Header Strip */}
        <div className="py-4 px-6 border-b border-[#333333] flex items-center justify-between" style={{ backgroundColor: '#111111' }}>
          <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
            05A | PERFORMANCE METRICS
          </h2>
          <button
            onClick={() => setShowInfoModal(true)}
            className="p-1 rounded-sm transition-colors hover:bg-zinc-800"
            aria-label="Performance info"
          >
            <Info size={18} className="text-[#D4AF37]" />
          </button>
        </div>

        {/* Body Area */}
        <div className="p-6 text-center" style={{ backgroundColor: '#000000' }}>
          {/* Primary Metric: ROI */}
          <div className="mb-6">
            <p className="text-zinc-500 text-xs tracking-widest uppercase mb-2">Return on Investment</p>
            <p className="font-bebas text-5xl" style={{ color: '#D4AF37' }}>
              {formatPercent(roi)}
            </p>
          </div>

          {/* Secondary Metric: Net Profit */}
          <div className="mb-6 pb-6 border-b border-zinc-800">
            <p className="text-zinc-500 text-xs tracking-widest uppercase mb-2">Net Profit (Loss)</p>
            <p className={`font-mono text-2xl ${netProfit >= 0 ? 'text-white' : 'text-red-400'}`}>
              {netProfit >= 0 ? '+' : ''}{formatCurrency(netProfit)}
            </p>
          </div>

          {/* Tertiary Metric: Breakeven Point */}
          <div>
            <p className="text-zinc-500 text-xs tracking-widest uppercase mb-2">Breakeven Point</p>
            <p className="font-mono text-lg text-zinc-400">
              {formatCurrency(breakevenPoint)}
            </p>
          </div>
        </div>
      </div>

      {/* CARD 5B: THE PAYMENT LEDGER - The Flow */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        {/* Header Strip */}
        <div className="py-4 px-6 border-b border-[#333333] flex items-center justify-between" style={{ backgroundColor: '#111111' }}>
          <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
            05B | PRIORITY OF PAYMENTS
          </h2>
          <button
            onClick={() => setShowInfoModal(true)}
            className="p-1 rounded-sm transition-colors hover:bg-zinc-800"
            aria-label="Priority info"
          >
            <Info size={18} className="text-[#D4AF37]" />
          </button>
        </div>

        {/* Vertical Flow List */}
        <div style={{ backgroundColor: '#000000' }}>
          {/* Row 1: First Money Out */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#D4AF37] font-mono text-xs">01</span>
                <span className="text-white font-medium text-sm">FIRST MONEY OUT</span>
              </div>
              <p className="text-zinc-500 text-xs">Guilds / Sales Fees / Expenses</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-white text-sm mb-1">{formatCurrency(firstMoneyPaid)}</p>
              <StatusBadge status={firstMoneyStatus} />
            </div>
          </div>

          {/* Row 2: Debt Service */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#D4AF37] font-mono text-xs">02</span>
                <span className="text-white font-medium text-sm">DEBT SERVICE</span>
              </div>
              <p className="text-zinc-500 text-xs">Senior + Gap + Interest</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-white text-sm mb-1">{formatCurrency(debtPaid)}</p>
              <StatusBadge status={debtStatus} />
            </div>
          </div>

          {/* Row 3: Equity & Premium */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#D4AF37] font-mono text-xs">03</span>
                <span className="text-white font-medium text-sm">EQUITY & PREM.</span>
              </div>
              <p className="text-zinc-500 text-xs">Capital + Preferred Return</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-white text-sm mb-1">{formatCurrency(equityPaid)}</p>
              <StatusBadge status={equityStatus} />
            </div>
          </div>

          {/* Row 4: Net Profit Pool */}
          <div className="p-4 flex items-center justify-between" style={{ backgroundColor: '#0a0a0a' }}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#D4AF37] font-mono text-xs">04</span>
                <span className="text-[#D4AF37] font-bebas text-sm tracking-wider">NET PROFIT POOL</span>
              </div>
              <p className="text-zinc-500 text-xs">Remaining Funds</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[#D4AF37] text-lg">{formatCurrency(remaining)}</p>
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
