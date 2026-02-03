import { useState } from "react";
import { WaterfallResult, WaterfallInputs, formatCompactCurrency, formatMultiple } from "@/lib/waterfall";
import { AlertTriangle, TrendingUp, Info, Lock } from "lucide-react";
import RestrictedAccessModal from "@/components/RestrictedAccessModal";
import WaterfallChart from "./WaterfallChart";
import { Button } from "@/components/ui/button";
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

const ResultsDashboard = ({ result, inputs, equity }: ResultsDashboardProps) => {
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const isProfitable = result.profitPool > 0;
  const isUnderperforming = result.multiple < 1.2 && inputs.equity > 0;

  // Calculate waterfall tier amounts
  const firstMoneyOut = result.cam + result.salesFee + result.guilds + result.marketing;
  const seniorDebt = result.ledger.find(l => l.name === "Senior Debt")?.amount || 0;
  const mezzDebt = result.ledger.find(l => l.name === "Gap/Mezz Debt")?.amount || 0;
  const debtService = seniorDebt + mezzDebt;
  const equityPrem = result.ledger.find(l => l.name === "Equity")?.amount || 0;

  return (
    <div className="space-y-6">
      {/* Hero: Profit Pool */}
      <div
        className="relative p-6 text-center border"
        style={{
          borderColor: isProfitable ? 'hsl(var(--gold))' : 'hsl(0 60% 50%)',
          backgroundColor: 'hsl(var(--card))'
        }}
      >
        {isProfitable && (
          <div className="absolute inset-0 bg-gradient-to-b from-gold/10 via-transparent to-transparent pointer-events-none" />
        )}

        <div className="relative z-10">
          <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-semibold mb-2">
            Your Profit Pool
          </p>
          <p
            className="font-bebas text-5xl tabular-nums leading-none mb-3"
            style={{ color: isProfitable ? 'hsl(var(--gold))' : 'hsl(0 70% 60%)' }}
          >
            {isProfitable ? '+' : ''}{formatCompactCurrency(result.profitPool)}
          </p>

          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="text-center">
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">You</p>
              <p className="font-mono text-foreground">{formatCompactCurrency(result.producer)}</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Investor</p>
              <p className="font-mono text-gold">{formatCompactCurrency(result.investor)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className={result.multiple >= 1 ? 'text-emerald-400' : 'text-red-400'} />
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Investor Multiple</span>
          </div>
          <p className={`font-mono text-2xl font-semibold ${result.multiple >= 1.2 ? 'text-gold' : result.multiple >= 1 ? 'text-foreground' : 'text-red-400'}`}>
            {formatMultiple(result.multiple)}
          </p>
        </div>
        <div className="p-4 bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Info size={14} className="text-muted-foreground" />
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Breakeven</span>
          </div>
          <p className="font-mono text-2xl text-foreground">
            {formatCompactCurrency(result.totalHurdle)}
          </p>
        </div>
      </div>

      {/* Warning */}
      {isUnderperforming && (
        <div className="p-4 flex items-start gap-3 bg-amber-500/10 border border-amber-500/30">
          <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium">
              Multiple is {formatMultiple(result.multiple)}
            </p>
            <p className="text-xs text-muted-foreground">
              Institutional investors typically expect 1.2x minimum.
            </p>
          </div>
        </div>
      )}

      {/* Waterfall Visualization */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bebas text-sm tracking-widest text-gold uppercase">
            Revenue Waterfall
          </h3>
          <button
            onClick={() => setShowInfoModal(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gold/10"
          >
            <Info className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 bg-card border border-border">
          <WaterfallChart
            revenue={inputs.revenue}
            offTheTop={firstMoneyOut}
            debtService={debtService}
            equityPremium={equityPrem}
            profitPool={result.profitPool}
          />
        </div>
      </div>

      {/* Investor Deck CTA */}
      <div className="p-5 bg-card border border-border">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-gold" />
          </div>
          <div className="flex-1">
            <h4 className="font-bebas text-base tracking-wider text-foreground mb-1">
              INVESTOR DECK
            </h4>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Get a professional PDF with your deal summary, waterfall breakdown, and return projections.
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="py-2 px-1 bg-muted/30 border border-border/50">
                <p className="text-[9px] text-muted-foreground uppercase">Deal</p>
                <p className="font-mono text-xs text-foreground">{formatCompactCurrency(inputs.revenue)}</p>
              </div>
              <div className="py-2 px-1 bg-muted/30 border border-border/50">
                <p className="text-[9px] text-muted-foreground uppercase">Profit</p>
                <p className="font-mono text-xs text-foreground">{formatCompactCurrency(result.profitPool)}</p>
              </div>
              <div className="py-2 px-1 bg-muted/30 border border-border/50">
                <p className="text-[9px] text-muted-foreground uppercase">Multiple</p>
                <p className="font-mono text-xs text-gold">{formatMultiple(result.multiple)}</p>
              </div>
            </div>
            <Button
              onClick={() => setShowRestrictedModal(true)}
              className="w-full h-12 text-sm font-semibold tracking-wider rounded-none bg-gold-cta text-black hover:brightness-110"
            >
              UNLOCK DECK
            </Button>
            <p className="text-[9px] text-muted-foreground/60 text-center mt-2">
              Free with email · No credit card
            </p>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bebas text-xl tracking-wider text-gold">
              HOW THE WATERFALL WORKS
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-muted-foreground text-sm leading-relaxed mt-2">
            Film revenue flows through each tier in strict order. Only after one tier is fully paid does money flow to the next.
          </DialogDescription>
          <div className="space-y-3 mt-4">
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 bg-gold/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-mono text-gold">1</span>
              </div>
              <div>
                <p className="text-foreground font-medium text-sm">Gross Revenue</p>
                <p className="text-muted-foreground text-xs">The total acquisition price from the streamer</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 bg-zinc-700 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-mono text-zinc-300">2</span>
              </div>
              <div>
                <p className="text-foreground font-medium text-sm">Off-the-Top</p>
                <p className="text-muted-foreground text-xs">CAM (1%), sales agent fee, guild residuals, marketing</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 bg-red-900/70 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-mono text-red-300">3</span>
              </div>
              <div>
                <p className="text-foreground font-medium text-sm">Debt Service</p>
                <p className="text-muted-foreground text-xs">Senior and mezzanine lenders repaid with interest</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 bg-blue-900/70 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-mono text-blue-300">4</span>
              </div>
              <div>
                <p className="text-foreground font-medium text-sm">Equity + Premium</p>
                <p className="text-muted-foreground text-xs">Investors receive principal plus preferred return</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 bg-emerald-600 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-mono text-white">5</span>
              </div>
              <div>
                <p className="text-emerald-400 font-medium text-sm">Profit Pool</p>
                <p className="text-muted-foreground text-xs">Whatever remains is split 50/50</p>
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
};

export default ResultsDashboard;
