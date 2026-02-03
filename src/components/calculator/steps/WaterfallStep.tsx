import { useState } from "react";
import {
  WaterfallResult,
  WaterfallInputs,
  formatCompactCurrency,
  formatMultiple,
} from "@/lib/waterfall";
import {
  Info,
  Lock,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import RestrictedAccessModal from "@/components/RestrictedAccessModal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LedgerRow } from "@/components/ui/matte-card";
import { cn } from "@/lib/utils";
import { colors } from "@/lib/design-system";
import WaterfallVisual from "@/components/calculator/WaterfallVisual";

interface WaterfallStepProps {
  result: WaterfallResult;
  inputs: WaterfallInputs;
}

const WaterfallStep = ({ result, inputs }: WaterfallStepProps) => {
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("waterfall");

  const isProfitable = result.profitPool > 0;
  const isUnderperforming = result.multiple < 1.2 && inputs.equity > 0;

  // Calculate waterfall tier amounts
  const firstMoneyOut =
    result.cam + result.salesFee + result.guilds + result.marketing;
  const seniorDebt =
    result.ledger.find((l) => l.name === "Senior Debt")?.amount || 0;
  const mezzDebt =
    result.ledger.find((l) => l.name === "Gap/Mezz Debt")?.amount || 0;
  const debtService = seniorDebt + mezzDebt;
  const equityPrem = result.ledger.find((l) => l.name === "Equity")?.amount || 0;

  // Calculate percentages for visual bars
  const totalRevenue = inputs.revenue || 1;
  const offTopPercent = (firstMoneyOut / totalRevenue) * 100;
  const debtPercent = (debtService / totalRevenue) * 100;
  const equityPercent = (equityPrem / totalRevenue) * 100;
  const profitPercent = Math.max(0, (result.profitPool / totalRevenue) * 100);

  // Waterfall tiers with colors
  const waterfallTiers = [
    {
      label: "Gross Revenue",
      value: formatCompactCurrency(inputs.revenue),
      percentage: 100,
      color: colors.gold,
      isTotal: false,
    },
    {
      label: "Off-the-Top Fees",
      value: `-${formatCompactCurrency(firstMoneyOut)}`,
      percentage: offTopPercent,
      color: "#6B7280", // Gray
      isTotal: false,
    },
    {
      label: "Debt Repayment",
      value: `-${formatCompactCurrency(debtService)}`,
      percentage: debtPercent,
      color: "#EF4444", // Red
      isTotal: false,
    },
    {
      label: "Equity + Premium",
      value: `-${formatCompactCurrency(equityPrem)}`,
      percentage: equityPercent,
      color: "#3B82F6", // Blue
      isTotal: false,
    },
  ];

  return (
    <div className="step-enter pb-8">
      {/* Step Header */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)",
              filter: "blur(15px)",
              transform: "scale(2)",
            }}
          />
          <div className="relative w-14 h-14 border border-gold/30 bg-gold/5 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-gold" />
          </div>
        </div>

        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2">
          The <span className="text-gold">Waterfall</span>
        </h2>
        <p className="text-white/50 text-sm max-w-xs mx-auto">
          How your revenue flows through each tier
        </p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="p-3 bg-[#0A0A0A] border border-[#1A1A1A] text-center">
          <p className="text-[9px] uppercase tracking-wider text-white/40 mb-1">
            Profit Pool
          </p>
          <p
            className={cn(
              "font-mono text-base font-semibold",
              isProfitable ? "text-gold" : "text-red-400"
            )}
          >
            {formatCompactCurrency(result.profitPool)}
          </p>
        </div>
        <div className="p-3 bg-[#0A0A0A] border border-[#1A1A1A] text-center">
          <p className="text-[9px] uppercase tracking-wider text-white/40 mb-1">
            Breakeven
          </p>
          <p className="font-mono text-base text-white">
            {formatCompactCurrency(result.totalHurdle)}
          </p>
        </div>
        <div className="p-3 bg-[#0A0A0A] border border-[#1A1A1A] text-center">
          <p className="text-[9px] uppercase tracking-wider text-white/40 mb-1">
            Multiple
          </p>
          <p
            className={cn(
              "font-mono text-base font-semibold",
              result.multiple >= 1.2
                ? "text-gold"
                : result.multiple >= 1
                  ? "text-white"
                  : "text-red-400"
            )}
          >
            {formatMultiple(result.multiple)}
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      {isUnderperforming && (
        <div className="mb-6 p-4 flex items-start gap-3 bg-amber-500/10 border border-amber-500/30">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white font-medium">
              Multiple is {formatMultiple(result.multiple)}
            </p>
            <p className="text-xs text-white/50">
              Institutional investors typically expect 1.2x minimum.
            </p>
          </div>
        </div>
      )}

      {/* WATERFALL VISUALIZATION - Visual "Pouring" Chart */}
      <div className="matte-section overflow-hidden mb-6">
        <button
          onClick={() =>
            setExpandedSection(
              expandedSection === "waterfall" ? null : "waterfall"
            )
          }
          className="w-full matte-section-header px-5 py-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.2em] text-gold/80 font-semibold">
              Revenue Flow
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowInfoModal(true);
              }}
              className="w-8 h-8 flex items-center justify-center hover:bg-gold/10 transition-colors"
            >
              <Info className="w-4 h-4 text-gold/60" />
            </button>
            {expandedSection === "waterfall" ? (
              <ChevronUp className="w-4 h-4 text-white/40" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white/40" />
            )}
          </div>
        </button>

        {expandedSection === "waterfall" && (
          <div className="px-5 py-4">
            <WaterfallVisual
              revenue={inputs.revenue}
              offTheTop={firstMoneyOut}
              debtService={debtService}
              equityPremium={equityPrem}
              profitPool={result.profitPool}
            />
          </div>
        )}
      </div>

      {/* DETAILED LEDGER */}
      <div className="matte-section overflow-hidden mb-6">
        <button
          onClick={() =>
            setExpandedSection(expandedSection === "ledger" ? null : "ledger")
          }
          className="w-full matte-section-header px-5 py-4 flex items-center justify-between"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
            Detailed Breakdown
          </span>
          {expandedSection === "ledger" ? (
            <ChevronUp className="w-4 h-4 text-white/40" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/40" />
          )}
        </button>

        {expandedSection === "ledger" && (
          <div className="divide-y divide-[#1A1A1A]">
            {result.ledger.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-5 py-4"
              >
                <div>
                  <p className="text-sm text-white">{item.name}</p>
                  <p className="text-[10px] text-white/40 uppercase">
                    {item.detail}
                  </p>
                </div>
                <p className="font-mono text-sm text-white/80">
                  {formatCompactCurrency(item.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* INVESTOR DECK CTA */}
      <div className="glass-card-gold p-5 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-gold" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-white mb-1">Investor Deck</h4>
            <p className="text-xs text-white/50 mb-4 leading-relaxed">
              Get a professional PDF with your deal summary, waterfall
              breakdown, and return projections.
            </p>
            <Button
              onClick={() => setShowRestrictedModal(true)}
              className="w-full h-12 text-sm font-black tracking-wider rounded-none bg-gold-cta text-black hover:brightness-110"
              style={{
                boxShadow: "0 0 30px rgba(212, 175, 55, 0.25)",
              }}
            >
              UNLOCK YOUR DECK
            </Button>
            <p className="text-[9px] text-white/30 text-center mt-2">
              Free with email &middot; No credit card
            </p>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="space-y-3">
        <p className="text-xs text-white/30 uppercase tracking-wider text-center">
          Go deeper
        </p>

        <a
          href="https://filmmaker.og/store"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 bg-[#0A0A0A] border border-[#1A1A1A] hover:border-[#2A2A2A] transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gold/60" />
              <span className="text-sm text-white/70">
                Download Full Excel Model
              </span>
            </div>
            <ExternalLink className="w-4 h-4 text-white/30" />
          </div>
        </a>

        <a
          href="mailto:thefilmmaker.og@gmail.com?subject=Deal%20Review%20Request"
          className="block p-4 bg-[#0A0A0A] border border-[#1A1A1A] hover:border-[#2A2A2A] transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-gold/60" />
              <span className="text-sm text-white/70">
                Get Professional Deal Review
              </span>
            </div>
            <ExternalLink className="w-4 h-4 text-white/30" />
          </div>
        </a>
      </div>

      {/* Info Modal */}
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="bg-[#0A0A0A] border-[#1A1A1A] max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="font-bebas text-xl tracking-wider text-gold">
              HOW THE WATERFALL WORKS
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-white/50 text-sm leading-relaxed mt-2">
            Film revenue flows through each tier in strict order. Only after one
            tier is fully paid does money flow to the next.
          </DialogDescription>
          <div className="space-y-3 mt-4">
            {[
              {
                num: "1",
                color: "bg-gold/20",
                textColor: "text-gold",
                title: "Gross Revenue",
                desc: "The total acquisition price from the streamer",
              },
              {
                num: "2",
                color: "bg-zinc-700",
                textColor: "text-zinc-300",
                title: "Off-the-Top",
                desc: "CAM (1%), sales agent fee, guild residuals, marketing",
              },
              {
                num: "3",
                color: "bg-red-900/70",
                textColor: "text-red-300",
                title: "Debt Service",
                desc: "Senior and mezzanine lenders repaid with interest",
              },
              {
                num: "4",
                color: "bg-blue-900/70",
                textColor: "text-blue-300",
                title: "Equity + Premium",
                desc: "Investors receive principal plus preferred return",
              },
              {
                num: "5",
                color: "bg-emerald-600",
                textColor: "text-white",
                title: "Profit Pool",
                desc: "Whatever remains is split 50/50",
                isProfit: true,
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div
                  className={cn(
                    "w-6 h-6 flex items-center justify-center flex-shrink-0",
                    item.color
                  )}
                >
                  <span className={cn("text-[10px] font-mono", item.textColor)}>
                    {item.num}
                  </span>
                </div>
                <div>
                  <p
                    className={cn(
                      "font-medium text-sm",
                      item.isProfit ? "text-emerald-400" : "text-white"
                    )}
                  >
                    {item.title}
                  </p>
                  <p className="text-white/40 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
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
