import { useState, forwardRef } from "react";
import { WaterfallResult, WaterfallInputs, formatCompactCurrency, formatPercent, formatMultiple } from "@/lib/waterfall";
import {
  AlertTriangle, Users, Briefcase, Target, TrendingUp,
  CheckCircle2, DollarSign, Info
} from "lucide-react";
import RestrictedAccessModal from "@/components/RestrictedAccessModal";
import WaterfallChart from "./WaterfallChart";
import DeckPreview from "./DeckPreview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ResultsDashboardProps {
  result: WaterfallResult;
  inputs: WaterfallInputs;
  equity: number;
}

const ResultsDashboard = forwardRef<HTMLDivElement, ResultsDashboardProps>(({ result, inputs, equity }, ref) => {
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const totalInvested = inputs.debt + inputs.mezzanineDebt + inputs.equity;
  const totalDistributed = result.recouped + result.profitPool;
  const roi = totalInvested > 0 ? (totalDistributed / totalInvested) * 100 : 0;
  const isProfitable = result.profitPool > 0;
  const isUnderperforming = result.multiple < 1.2 && inputs.equity > 0;
  const netProfit = result.profitPool;

  // Calculate waterfall tier amounts
  const firstMoneyOut = result.cam + result.salesFee + result.guilds + result.marketing;
  const seniorDebt = result.ledger.find(l => l.name === "Senior Debt")?.amount || 0;
  const mezzDebt = result.ledger.find(l => l.name === "Gap/Mezz Debt")?.amount || 0;
  const debtService = seniorDebt + mezzDebt;
  const equityPrem = result.ledger.find(l => l.name === "Equity")?.amount || 0;

  return (
    <div ref={ref} className="step-enter space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
            <CheckCircle2 size={16} className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bebas text-lg text-foreground tracking-wide">YOUR WATERFALL</h2>
            <p className="text-[11px] text-muted-foreground">
              Here's how your {formatCompactCurrency(inputs.revenue)} flows
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowInfoModal(true)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors"
        >
          <Info size={18} className="text-muted-foreground hover:text-gold transition-colors" />
        </button>
      </div>

      {/* Hero Profit Card */}
      <div
        className="relative p-6 rounded-sm text-center overflow-hidden"
        style={{
          backgroundColor: 'hsl(var(--card))',
          border: `2px solid ${isProfitable ? 'hsl(var(--gold))' : 'hsl(0 84% 40%)'}`,
        }}
      >
        {isProfitable && (
          <div className="absolute inset-0 bg-gradient-to-b from-gold/10 via-gold/5 to-transparent pointer-events-none" />
        )}

        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold mb-3">
            Net Profit Pool
          </p>

          <p
            className="font-bebas text-5xl sm:text-6xl mb-2 tabular-nums leading-none"
            style={{ color: isProfitable ? 'hsl(var(--gold))' : 'hsl(var(--destructive))' }}
          >
            {isProfitable ? '+' : ''}{formatCompactCurrency(netProfit)}
          </p>

          <p className="text-xs text-muted-foreground mb-4">
            Split 50/50 between you and your investors
          </p>

          <div className="flex items-center justify-center gap-2">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider ${isProfitable
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/15 text-red-400 border border-red-500/30'
                }`}
            >
              {isProfitable ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              {isProfitable ? 'PROFITABLE' : 'SHORTFALL'}
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-sm bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} className="text-muted-foreground" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Your Share</span>
          </div>
          <p className="font-mono text-xl text-foreground">{formatCompactCurrency(result.producer)}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Producer's 50%</p>
        </div>
        <div className="p-4 rounded-sm bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase size={14} className="text-gold" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Investor Gets</span>
          </div>
          <p className="font-mono text-xl text-gold">{formatCompactCurrency(result.investor)}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Recoup + 50% profit</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-sm text-center bg-card border border-border">
          <TrendingUp size={14} className={`mx-auto mb-1 ${roi >= 100 ? 'text-emerald-400' : 'text-red-400'}`} />
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">Return</p>
          <p className={`font-mono text-sm font-semibold ${roi >= 100 ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatPercent(roi)}
          </p>
        </div>
        <div className="p-3 rounded-sm text-center bg-card border border-border">
          <Target size={14} className="mx-auto mb-1 text-muted-foreground" />
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">Breakeven</p>
          <p className="font-mono text-sm text-foreground">{formatCompactCurrency(result.totalHurdle)}</p>
        </div>
        <div className="p-3 rounded-sm text-center bg-card border border-border relative overflow-hidden">
          {result.multiple >= 1.2 && (
            <div className="absolute inset-0 bg-gradient-to-b from-gold/10 to-transparent pointer-events-none" />
          )}
          <DollarSign size={14} className={`mx-auto mb-1 relative z-10 ${result.multiple >= 1.2 ? 'text-gold' : 'text-muted-foreground'}`} />
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5 relative z-10">Multiple</p>
          <p className={`font-mono text-sm font-semibold relative z-10 ${result.multiple >= 1.2 ? 'text-gold' : 'text-foreground'}`}>
            {formatMultiple(result.multiple)}
          </p>
        </div>
      </div>

      {/* Waterfall Chart */}
      <div className="p-5 rounded-sm bg-card border border-border" style={{ borderLeft: '3px solid hsl(var(--gold))' }}>
        <WaterfallChart
          revenue={inputs.revenue}
          offTheTop={firstMoneyOut}
          debtService={debtService}
          equityPremium={equityPrem}
          profitPool={result.profitPool}
        />
      </div>

      {/* Warning Banner */}
      {isUnderperforming && (
        <div className="p-4 rounded-sm flex items-start gap-3 bg-amber-500/10 border border-amber-500/30">
          <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">
              Investor multiple is {formatMultiple(result.multiple)}
            </p>
            <p className="text-xs text-muted-foreground">
              Most institutional investors expect 1.2x minimum. Consider adjusting your capital structure.
            </p>
          </div>
        </div>
      )}

      {/* Blurred Deck Preview - The Trap */}
      <div className="pt-2">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-3 text-center">
          Your personalized deliverable
        </p>
        <DeckPreview
          onUnlock={() => setShowRestrictedModal(true)}
          producerShare={result.producer}
          investorReturn={result.investor}
          multiple={result.multiple}
        />
      </div>

      {/* Info Modal */}
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="bg-card border-border text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bebas text-xl tracking-wider text-gold">
              HOW THE WATERFALL WORKS
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
              Film revenue flows through each tier in strict order. Only after one tier is fully paid does money flow to the next.
            </DialogDescription>

            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-mono text-zinc-300">1</span>
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm">First Money Out</p>
                  <p className="text-muted-foreground text-xs">CAM (1%), sales agent fee, guild residuals, marketing costs</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-red-900/70 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-mono text-red-300">2</span>
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm">Debt Service</p>
                  <p className="text-muted-foreground text-xs">Senior lenders and gap/mezz financing repaid with interest</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-900/70 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-mono text-blue-300">3</span>
                </div>
                <div>
                  <p className="text-foreground font-medium text-sm">Equity + Premium</p>
                  <p className="text-muted-foreground text-xs">Investors receive their principal plus preferred return</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-mono text-emerald-100">4</span>
                </div>
                <div>
                  <p className="text-emerald-400 font-medium text-sm">Profit Pool</p>
                  <p className="text-muted-foreground text-xs">Whatever remains is split 50/50 between producers and investors</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <RestrictedAccessModal
        isOpen={showRestrictedModal}
        onClose={() => setShowRestrictedModal(false)}
      />
    </div>
  );
});

ResultsDashboard.displayName = 'ResultsDashboard';

export default ResultsDashboard;
