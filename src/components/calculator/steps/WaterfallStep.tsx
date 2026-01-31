import { useState } from "react";
import { WaterfallResult, WaterfallInputs, formatCompactCurrency, formatMultiple } from "@/lib/waterfall";
import { Info, Lock, TrendingUp, AlertTriangle } from "lucide-react";
import RestrictedAccessModal from "@/components/RestrictedAccessModal";
import WaterfallChart from "../WaterfallChart";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface WaterfallStepProps {
  result: WaterfallResult;
  inputs: WaterfallInputs;
}

const WaterfallStep = ({ result, inputs }: WaterfallStepProps) => {
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
    <div className="step-enter space-y-6">
      {/* Step Header */}
      <div className="text-center mb-6">
        <h2 className="font-bebas text-2xl tracking-[0.15em] text-gold mb-2">
          THE WATERFALL
        </h2>
        <p className="text-white/50 text-sm">
          How your revenue flows through each tier
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 bg-card border border-border text-center">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Profit Pool</p>
          <p className={`font-mono text-lg font-semibold ${isProfitable ? 'text-gold' : 'text-red-400'}`}>
            {formatCompactCurrency(result.profitPool)}
          </p>
        </div>
        <div className="p-4 bg-card border border-border text-center">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Breakeven</p>
          <p className="font-mono text-lg text-foreground">
            {formatCompactCurrency(result.totalHurdle)}
          </p>
        </div>
        <div className="p-4 bg-card border border-border text-center">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Multiple</p>
          <p className={`font-mono text-lg font-semibold ${result.multiple >= 1.2 ? 'text-gold' : result.multiple >= 1 ? 'text-foreground' : 'text-red-400'}`}>
            {formatMultiple(result.multiple)}
          </p>
        </div>
      </div>

      {/* Warning */}
      {isUnderperforming && (
        <div className="p-4 flex items-start gap-3 bg-amber-500/10 border border-amber-500/30">
          <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
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
      <div className="bg-card border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bebas text-sm tracking-widest text-gold uppercase">
            Revenue Flow
          </h3>
          <button
            onClick={() => setShowInfoModal(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold/10"
          >
            <Info className="w-4 h-4 text-gold" />
          </button>
        </div>

        <WaterfallChart
          revenue={inputs.revenue}
          offTheTop={firstMoneyOut}
          debtService={debtService}
          equityPremium={equityPrem}
          profitPool={result.profitPool}
        />
      </div>

      {/* Ledger Breakdown */}
      <div className="bg-card border border-border">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="font-bebas text-sm tracking-widest text-foreground uppercase">
            Detailed Breakdown
          </h3>
        </div>
        <div className="divide-y divide-border">
          {result.ledger.map((item, index) => (
            <div key={index} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm text-foreground">{item.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase">{item.detail}</p>
              </div>
              <p className="font-mono text-sm text-foreground">
                {formatCompactCurrency(item.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Investor Deck CTA */}
      <div className="p-5 bg-card border border-gold/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-gold" />
          </div>
          <div className="flex-1">
            <h4 className="font-bebas text-base tracking-wider text-foreground mb-1">
              INVESTOR DECK
            </h4>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Get a professional PDF with your deal summary, waterfall breakdown, and return projections.
            </p>
            <Button
              onClick={() => setShowRestrictedModal(true)}
              className="w-full h-12 text-sm font-semibold tracking-wider rounded-none bg-gold text-black hover:bg-gold-highlight"
              style={{
                boxShadow: '0 0 30px rgba(212, 175, 55, 0.25)',
              }}
            >
              UNLOCK YOUR DECK
            </Button>
            <p className="text-[9px] text-muted-foreground/60 text-center mt-2">
              Free with email · No credit card
            </p>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="bg-card border-border max-w-md rounded-none">
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

export default WaterfallStep;
