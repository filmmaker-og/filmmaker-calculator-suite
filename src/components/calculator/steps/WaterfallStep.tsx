import { useState } from "react";
import { WaterfallResult, WaterfallInputs, formatCompactCurrency, formatMultiple } from "@/lib/waterfall";
import { Info, AlertTriangle, FileText } from "lucide-react";
import WaterfallChart from "../WaterfallChart";
import BookCallCTA from "../BookCallCTA";
import EmailCapture from "../EmailCapture";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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
  const [showInfoModal, setShowInfoModal] = useState(false);
  const navigate = useNavigate();

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
        <div className="p-4 matte-card text-center">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Profit Pool</p>
          <p className={`font-mono text-lg font-semibold ${isProfitable ? 'text-gold' : 'text-red-400'}`}>
            {formatCompactCurrency(result.profitPool)}
          </p>
        </div>
        <div className="p-4 matte-card text-center">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Breakeven</p>
          <p className="font-mono text-lg text-foreground">
            {formatCompactCurrency(result.totalHurdle)}
          </p>
        </div>
        <div className="p-4 matte-card text-center">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Multiple</p>
          <p className={`font-mono text-lg font-semibold ${result.multiple >= 1.2 ? 'text-gold' : result.multiple >= 1 ? 'text-foreground' : 'text-red-400'}`}>
            {formatMultiple(result.multiple)}
          </p>
        </div>
      </div>

      {/* Warning */}
      {isUnderperforming && (
        <div className="p-4 flex items-start gap-3 verdict-marginal">
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
      <div className="matte-card p-5">
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
      <div className="matte-card">
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

      {/* WHAT'S NEXT? - Dual Path CTA Section */}
      <div className="pt-6 border-t border-border">
        <h3 className="font-bebas text-lg tracking-[0.15em] text-foreground text-center mb-6">
          WHAT'S NEXT?
        </h3>

        <div className="space-y-4">
          {/* Primary: Book a Call */}
          <BookCallCTA />

          {/* Secondary: DIY Templates */}
          <div className="matte-card p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-muted flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-bebas text-base tracking-wider text-foreground mb-1">
                  DIY TEMPLATES
                </h4>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Term sheets, models, and pitch decks you can customize.
                </p>
                <Button
                  onClick={() => navigate("/store")}
                  variant="outline"
                  className="w-full h-11 text-sm font-medium tracking-wide rounded-none border-border hover:border-gold/50 hover:bg-gold/5"
                >
                  VIEW TEMPLATES
                </Button>
                <p className="text-[10px] text-muted-foreground/60 text-center mt-2">
                  Starting at $49
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative py-4">
            <div className="premium-divider" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-[10px] text-muted-foreground/50 uppercase tracking-widest">
              or
            </span>
          </div>

          {/* Email Capture */}
          <EmailCapture />
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
    </div>
  );
};

export default WaterfallStep;
