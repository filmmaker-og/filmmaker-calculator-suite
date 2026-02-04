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
import DisclaimerFooter from "@/components/calculator/DisclaimerFooter";

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

  // Waterfall tiers with gold-only colors
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
      color: "#3A3A3A", // Matte gray
      isTotal: false,
    },
    {
      label: "Debt Repayment",
      value: `-${formatCompactCurrency(debtService)}`,
      percentage: debtPercent,
      color: "rgba(212, 175, 55, 0.4)", // Gold at 40%
      isTotal: false,
    },
    {
      label: "Equity + Premium",
      value: `-${formatCompactCurrency(equityPrem)}`,
      percentage: equityPercent,
      color: "rgba(212, 175, 55, 0.6)", // Gold at 60%
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
              isProfitable ? "text-gold" : "text-gold/50"
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
                  : "text-gold/50"
            )}
          >
            {formatMultiple(result.multiple)}
          </p>
        </div>
      </div>

      {/* Warning Banner - Gold-only palette */}
      {isUnderperforming && (
        <div className="mb-6 p-4 flex items-start gap-3 bg-gold/10 border border-gold/30">
          <AlertTriangle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
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

      {/* WHAT YOU JUST MODELED - Complexity Summary */}
      <div className="matte-section p-5 mb-6">
        <p className="text-[9px] uppercase tracking-[0.2em] text-gold/60 mb-4 text-center">
          What you just modeled
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Revenue Tiers", value: "4 phases" },
            { label: "Fee Structures", value: "CAM + Sales + Guilds" },
            { label: "Capital Stack", value: `${(inputs.debt > 0 ? 1 : 0) + (inputs.mezzanineDebt > 0 ? 1 : 0) + (inputs.equity > 0 ? 1 : 0)} tranches` },
            { label: "Return Calc", value: "Pref + 50/50 split" },
          ].map((item) => (
            <div key={item.label} className="text-center p-3 bg-[#0A0A0A] border border-[#1A1A1A]">
              <p className="text-[9px] text-white/40 uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-xs text-white font-medium">{item.value}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-white/30 text-center mt-4 leading-relaxed">
          This is how agencies and studios model deals.
          <br />
          <span className="text-gold/60">Now imagine explaining this to investors.</span>
        </p>
      </div>

      {/* THE TRAP - Implementation Gap CTA */}
      <div className="relative mb-6">
        {/* Glow effect */}
        <div
          className="absolute -inset-4 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />

        <div className="relative glass-card-gold p-6 border-gold/40">
          <div className="text-center mb-5">
            <Lock className="w-8 h-8 text-gold mx-auto mb-3" />
            <h3 className="font-bebas text-2xl tracking-[0.1em] text-white mb-2">
              YOU HAVE THE <span className="text-gold">NUMBERS</span>
            </h3>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs mx-auto">
              But can you walk investors through a 4-tier waterfall with preferred returns and profit participation?
            </p>
          </div>

          <Button
            onClick={() => setShowRestrictedModal(true)}
            className="w-full h-14 text-base font-black tracking-[0.15em] rounded-none bg-gold-cta text-black hover:brightness-110 transition-all active:scale-[0.98]"
            style={{
              boxShadow: '0 0 50px rgba(212, 175, 55, 0.4), 0 4px 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            GET THE INVESTOR DECK
          </Button>

          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="text-[9px] text-white/30 uppercase tracking-wider">Templates</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="text-[9px] text-white/30 uppercase tracking-wider">Models</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="text-[9px] text-white/30 uppercase tracking-wider">Strategy</span>
          </div>
        </div>
      </div>

      {/* Secondary CTAs */}
      <div className="space-y-3 mb-6">
        <a
          href="https://filmmaker.og/store"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 bg-[#0A0A0A] border border-[#1A1A1A] hover:border-gold/30 hover:bg-gold/5 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:border-gold/40 transition-colors">
                <FileText className="w-5 h-5 text-gold/60 group-hover:text-gold transition-colors" />
              </div>
              <div>
                <span className="text-sm text-white font-medium block">Full Excel Model</span>
                <span className="text-[10px] text-white/40">Editable financials</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-gold/60 transition-colors" />
          </div>
        </a>

        <a
          href="mailto:thefilmmaker.og@gmail.com?subject=Deal%20Review%20Request&body=I%20just%20modeled%20a%20deal%20and%20would%20like%20professional%20review."
          className="block p-4 bg-[#0A0A0A] border border-[#1A1A1A] hover:border-gold/30 hover:bg-gold/5 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:border-gold/40 transition-colors">
                <TrendingUp className="w-5 h-5 text-gold/60 group-hover:text-gold transition-colors" />
              </div>
              <div>
                <span className="text-sm text-white font-medium block">1-on-1 Deal Review</span>
                <span className="text-[10px] text-white/40">Expert consultation</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-gold/60 transition-colors" />
          </div>
        </a>
      </div>

      {/* Legal Disclaimer */}
      <DisclaimerFooter />

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
                color: "bg-[#3A3A3A]",
                textColor: "text-white/70",
                title: "Off-the-Top",
                desc: "CAM (1%), sales agent fee, guild residuals, marketing",
              },
              {
                num: "3",
                color: "bg-gold/40",
                textColor: "text-gold/80",
                title: "Debt Service",
                desc: "Senior and mezzanine lenders repaid with interest",
              },
              {
                num: "4",
                color: "bg-gold/60",
                textColor: "text-gold",
                title: "Equity + Premium",
                desc: "Investors receive principal plus preferred return",
              },
              {
                num: "5",
                color: "bg-gold",
                textColor: "text-black",
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
                      item.isProfit ? "text-gold" : "text-white"
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
