import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { GuildState, formatCompactCurrency } from "@/lib/waterfall";
import { Info, Film, Megaphone, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useHaptics } from "@/hooks/use-haptics";

interface WizardStep3Props {
  guilds: GuildState;
  salesFee: number;
  salesExp: number;
  revenue: number;
  onToggleGuild: (guild: keyof GuildState) => void;
  onUpdateSalesFee: (value: number) => void;
  onUpdateSalesExp: (value: number) => void;
}

const WizardStep3 = ({
  guilds,
  salesFee,
  salesExp,
  revenue,
  onToggleGuild,
  onUpdateSalesFee,
  onUpdateSalesExp
}: WizardStep3Props) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const haptics = useHaptics();

  const hasAnyGuildActive = guilds.sag || guilds.wga || guilds.dga;
  const [showResiduals, setShowResiduals] = useState(hasAnyGuildActive);
  const [showDistribution, setShowDistribution] = useState(true);

  const handleResidualsToggle = (checked: boolean) => {
    haptics.light();
    setShowResiduals(checked);
    if (!checked) {
      if (guilds.sag) onToggleGuild('sag');
      if (guilds.wga) onToggleGuild('wga');
      if (guilds.dga) onToggleGuild('dga');
    }
  };

  const handleDistributionToggle = (checked: boolean) => {
    haptics.light();
    setShowDistribution(checked);
    if (!checked) {
      onUpdateSalesFee(0);
      onUpdateSalesExp(0);
    }
  };

  // Summary calculations
  const getGuildSummary = () => {
    if (!hasAnyGuildActive) return null;
    const guildsActive = [
      guilds.sag ? 'SAG' : null,
      guilds.wga ? 'WGA' : null,
      guilds.dga ? 'DGA' : null
    ].filter(Boolean);
    const totalPct = (guilds.sag ? 4.5 : 0) + (guilds.wga ? 1.2 : 0) + (guilds.dga ? 1.2 : 0);
    return `${guildsActive.join(', ')} (${totalPct.toFixed(1)}%)`;
  };

  const getDistributionSummary = () => {
    const parts: string[] = [];
    if (salesFee > 0) parts.push(`${salesFee}% sales`);
    if (salesExp > 0) parts.push(`${formatCompactCurrency(salesExp)} mktg`);
    return parts.length > 0 ? parts.join(' + ') : null;
  };

  // Calculate off-the-top total
  const guildPct = (guilds.sag ? 0.045 : 0) + (guilds.wga ? 0.012 : 0) + (guilds.dga ? 0.012 : 0);
  const offTheTopTotal = (revenue * (salesFee / 100)) + (revenue * 0.01) + (revenue * guildPct) + salesExp;

  const modals = {
    guildResiduals: {
      title: "GUILD RESIDUALS",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <p>
            Residuals are reuse-based payments required under SAG-AFTRA/WGA/DGA agreements.
            Toggle ON only if your production entity is the signatory and responsible for payments.
          </p>
          <p className="text-muted-foreground">
            In many Streamer Buyouts, the buyer assumes this obligation — check your deal terms.
          </p>
        </div>
      )
    },
    distributionCosts: {
      title: "DISTRIBUTION COSTS",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <div>
            <span className="text-foreground font-bold">SALES AGENT FEE</span>
            <p className="mt-1">Commission paid to your sales agent for securing distribution deals. Typically 10-20% of gross revenues. Deducted first.</p>
          </div>
          <div className="my-3 border-b border-dashed border-border" />
          <div>
            <span className="text-foreground font-bold">MARKETING CAP</span>
            <p className="mt-1">Hard cap on expenses the Sales Agent can deduct for taking the film to market (festivals, AFM, Cannes, etc).</p>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="step-enter space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
          <span className="text-gold font-bebas text-sm">3</span>
        </div>
        <div>
          <h2 className="font-bebas text-lg text-foreground tracking-wide">OFF-THE-TOP COSTS</h2>
          <p className="text-xs text-muted-foreground">
            What gets deducted before anyone gets paid? Sales fees, guild residuals.
          </p>
        </div>
      </div>

      {/* Card: Guild Residuals */}
      <div className="rounded-sm border border-border overflow-hidden transition-all duration-200" style={{ borderLeft: '3px solid hsl(var(--gold))' }}>
        <button
          onClick={() => setShowResiduals(!showResiduals)}
          className="w-full py-3 px-4 flex items-center justify-between bg-card hover:bg-card/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Film className="w-4 h-4 text-gold" />
            <div className="text-left">
              <h3 className="font-bebas text-sm tracking-widest uppercase text-gold">
                GUILD RESIDUALS
              </h3>
              {!showResiduals && getGuildSummary() && (
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{getGuildSummary()}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setActiveModal('guildResiduals'); }}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors"
            >
              <Info className="w-4 h-4 text-muted-foreground hover:text-gold transition-colors" />
            </button>
            <Switch
              checked={showResiduals}
              onCheckedChange={handleResidualsToggle}
              onClick={(e) => e.stopPropagation()}
              className="data-[state=checked]:bg-gold"
            />
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showResiduals ? 'rotate-180' : ''}`} />
          </div>
        </button>

        <div className={`transition-all duration-300 ease-out overflow-hidden ${showResiduals ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-5 bg-background border-t border-border">
            <p className="text-[10px] text-muted-foreground mb-4">
              Toggle guilds your production is signatory to. These are deducted from gross.
            </p>
            <div className="space-y-0">
              {/* SAG-AFTRA Row */}
              <div className="flex items-center justify-between py-3 border-b border-border min-h-[52px]">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm text-foreground">SAG-AFTRA</span>
                  <span className="font-mono text-xs text-muted-foreground">(4.5%)</span>
                </div>
                <Switch
                  checked={guilds.sag}
                  onCheckedChange={() => { haptics.light(); onToggleGuild('sag'); }}
                  className="data-[state=checked]:bg-gold"
                />
              </div>

              {/* WGA Row */}
              <div className="flex items-center justify-between py-3 border-b border-border min-h-[52px]">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm text-foreground">WGA</span>
                  <span className="font-mono text-xs text-muted-foreground">(1.2%)</span>
                </div>
                <Switch
                  checked={guilds.wga}
                  onCheckedChange={() => { haptics.light(); onToggleGuild('wga'); }}
                  className="data-[state=checked]:bg-gold"
                />
              </div>

              {/* DGA Row */}
              <div className="flex items-center justify-between py-3 min-h-[52px]">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm text-foreground">DGA</span>
                  <span className="font-mono text-xs text-muted-foreground">(1.2%)</span>
                </div>
                <Switch
                  checked={guilds.dga}
                  onCheckedChange={() => { haptics.light(); onToggleGuild('dga'); }}
                  className="data-[state=checked]:bg-gold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card: Distribution Costs */}
      <div className="rounded-sm border border-border overflow-hidden transition-all duration-200" style={{ borderLeft: '3px solid hsl(var(--gold))' }}>
        <button
          onClick={() => setShowDistribution(!showDistribution)}
          className="w-full py-3 px-4 flex items-center justify-between bg-card hover:bg-card/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Megaphone className="w-4 h-4 text-gold" />
            <div className="text-left">
              <h3 className="font-bebas text-sm tracking-widest uppercase text-gold">
                DISTRIBUTION COSTS
              </h3>
              {!showDistribution && getDistributionSummary() && (
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{getDistributionSummary()}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setActiveModal('distributionCosts'); }}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors"
            >
              <Info className="w-4 h-4 text-muted-foreground hover:text-gold transition-colors" />
            </button>
            <Switch
              checked={showDistribution}
              onCheckedChange={handleDistributionToggle}
              onClick={(e) => e.stopPropagation()}
              className="data-[state=checked]:bg-gold"
            />
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showDistribution ? 'rotate-180' : ''}`} />
          </div>
        </button>

        <div className={`transition-all duration-300 ease-out overflow-hidden ${showDistribution ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-5 space-y-5 bg-background border-t border-border">
            {/* Sales Agent Fee */}
            <div>
              <div className="mb-2">
                <span className="text-xs tracking-wider uppercase font-semibold text-foreground">
                  SALES AGENT FEE
                </span>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Typically 10-15% for domestic, 15-20% for international
                </p>
              </div>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={salesFee === 0 ? '' : salesFee}
                  onChange={(e) => {
                    const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                    onUpdateSalesFee(Math.min(value, 100));
                  }}
                  placeholder="15"
                  className="pl-4 pr-10 h-14 text-xl font-mono text-foreground text-right rounded-sm border-border focus:border-gold focus:ring-1 focus:ring-gold transition-colors bg-card"
                  onFocus={(e) => e.target.select()}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">
                  %
                </span>
              </div>
            </div>

            {/* Marketing Cap */}
            <div>
              <div className="mb-2">
                <span className="text-xs tracking-wider uppercase font-semibold text-foreground">
                  MARKETING CAP
                </span>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Hard cap on sales expenses (festivals, markets, deliverables)
                </p>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">
                  $
                </span>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={salesExp === 0 ? '' : salesExp.toLocaleString()}
                  onChange={(e) => {
                    const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                    onUpdateSalesExp(value);
                  }}
                  placeholder="75,000"
                  className="pl-10 h-14 text-xl font-mono text-foreground text-right rounded-sm border-border focus:border-gold focus:ring-1 focus:ring-gold transition-colors bg-card"
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Deductions Summary */}
      {revenue > 0 && offTheTopTotal > 0 && (
        <div className="p-4 rounded-sm bg-card border border-border">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Total Off-the-Top
            </span>
            <span className="font-mono text-sm text-foreground font-semibold">
              {formatCompactCurrency(offTheTopTotal)}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground/70 mt-1">
            CAM (1%) + Sales + Guilds + Marketing — deducted before debt/equity
          </p>
        </div>
      )}

      {/* Modal */}
      <Dialog open={activeModal !== null} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="border-border max-w-md bg-card">
          <DialogHeader>
            <DialogTitle className="font-bebas text-xl tracking-wider text-gold">
              {activeModal && modals[activeModal as keyof typeof modals]?.title}
            </DialogTitle>
          </DialogHeader>
          {activeModal && modals[activeModal as keyof typeof modals]?.content}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WizardStep3;
