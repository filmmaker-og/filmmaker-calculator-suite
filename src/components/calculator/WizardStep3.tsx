import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { GuildState } from "@/lib/waterfall";
import { Info, Film, Megaphone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useHaptics } from "@/hooks/use-haptics";

interface WizardStep3Props {
  guilds: GuildState;
  salesFee: number;
  salesExp: number;
  onToggleGuild: (guild: keyof GuildState) => void;
  onUpdateSalesFee: (value: number) => void;
  onUpdateSalesExp: (value: number) => void;
}

const WizardStep3 = ({ 
  guilds, 
  salesFee, 
  salesExp, 
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
            In many Streamer Buyouts, the buyer assumes this obligation.
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
            <p className="mt-1">Commission paid to your sales agent for securing distribution deals. Typically 10-20% of gross revenues.</p>
          </div>
          <div className="my-3 border-b border-dashed border-border" />
          <div>
            <span className="text-foreground font-bold">MARKETING CAP (SALES EXPENSES)</span>
            <p className="mt-1">The hard cap on expenses the Sales Agent can deduct for taking the film to market.</p>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="animate-fade-in space-y-5">
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

      {/* Card 3A: Guild Residuals - Left accent */}
      <div className="rounded-sm border border-border overflow-hidden" style={{ borderLeft: '3px solid hsl(var(--gold))' }}>
        <div className={`py-3 px-4 flex items-center justify-between bg-card ${showResiduals ? 'border-b border-border' : ''}`}>
          <div className="flex items-center gap-3">
            <Film className="w-4 h-4 text-gold" />
            <h3 className="font-bebas text-sm tracking-widest uppercase text-gold">
              GUILD RESIDUALS
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveModal('guildResiduals')}
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors"
            >
              <Info className="w-4 h-4 text-muted-foreground hover:text-gold transition-colors" />
            </button>
            <Switch 
              checked={showResiduals} 
              onCheckedChange={handleResidualsToggle} 
              className="data-[state=checked]:bg-gold"
            />
          </div>
        </div>

        {showResiduals && (
          <div className="p-5 bg-background">
            <div className="space-y-0">
              {/* SAG-AFTRA Row */}
              <div className="flex items-center justify-between py-4 border-b border-border min-h-[56px]">
                <div className="flex items-center gap-3">
                  <span className="font-bebas text-sm text-foreground">SAG-AFTRA</span>
                  <span className="font-mono text-xs text-muted-foreground">(4.5%)</span>
                </div>
                <Switch 
                  checked={guilds.sag} 
                  onCheckedChange={() => { haptics.light(); onToggleGuild('sag'); }} 
                  className="data-[state=checked]:bg-gold"
                />
              </div>

              {/* WGA Row */}
              <div className="flex items-center justify-between py-4 border-b border-border min-h-[56px]">
                <div className="flex items-center gap-3">
                  <span className="font-bebas text-sm text-foreground">WGA</span>
                  <span className="font-mono text-xs text-muted-foreground">(1.2%)</span>
                </div>
                <Switch 
                  checked={guilds.wga} 
                  onCheckedChange={() => { haptics.light(); onToggleGuild('wga'); }} 
                  className="data-[state=checked]:bg-gold"
                />
              </div>

              {/* DGA Row */}
              <div className="flex items-center justify-between py-4 min-h-[56px]">
                <div className="flex items-center gap-3">
                  <span className="font-bebas text-sm text-foreground">DGA</span>
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
        )}
      </div>

      {/* Card 3B: Distribution Costs - Left accent */}
      <div className="rounded-sm border border-border overflow-hidden" style={{ borderLeft: '3px solid hsl(var(--gold))' }}>
        <div className={`py-3 px-4 flex items-center justify-between bg-card ${showDistribution ? 'border-b border-border' : ''}`}>
          <div className="flex items-center gap-3">
            <Megaphone className="w-4 h-4 text-gold" />
            <h3 className="font-bebas text-sm tracking-widest uppercase text-gold">
              DISTRIBUTION COSTS
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveModal('distributionCosts')}
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors"
            >
              <Info className="w-4 h-4 text-muted-foreground hover:text-gold transition-colors" />
            </button>
            <Switch 
              checked={showDistribution} 
              onCheckedChange={handleDistributionToggle} 
              className="data-[state=checked]:bg-gold"
            />
          </div>
        </div>

        {showDistribution && (
          <div className="p-5 space-y-5 bg-background">
            {/* Sales Agent Fee */}
            <div>
              <div className="mb-3">
                <span className="text-xs tracking-wider uppercase font-semibold text-foreground">
                  Sales Agent Fee
                </span>
              </div>
              <div className="relative">
                <Input
                  id="salesFee"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  value={salesFee === 0 ? '' : salesFee}
                  onChange={(e) => {
                    const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                    onUpdateSalesFee(Math.min(value, 100));
                  }}
                  placeholder="0"
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
              <div className="mb-3">
                <span className="text-xs tracking-wider uppercase font-semibold text-foreground">
                  Marketing Cap
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">
                  $
                </span>
                <Input
                  id="salesExp"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  value={salesExp === 0 ? '' : salesExp.toLocaleString()}
                  onChange={(e) => {
                    const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                    onUpdateSalesExp(value);
                  }}
                  placeholder="0"
                  className="pl-10 h-14 text-xl font-mono text-foreground text-right rounded-sm border-border focus:border-gold focus:ring-1 focus:ring-gold transition-colors bg-card"
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WizardStep3;
