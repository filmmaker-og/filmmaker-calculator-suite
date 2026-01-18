import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { GuildState } from "@/lib/waterfall";
import { Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  
  // Master toggle - default OFF, check if any guild is active
  const hasAnyGuildActive = guilds.sag || guilds.wga || guilds.dga;
  const [showResiduals, setShowResiduals] = useState(hasAnyGuildActive);

  // Circuit breaker handler
  const handleResidualsToggle = (checked: boolean) => {
    setShowResiduals(checked);
    if (!checked) {
      // Turn off all guilds when master toggle is OFF
      if (guilds.sag) onToggleGuild('sag');
      if (guilds.wga) onToggleGuild('wga');
      if (guilds.dga) onToggleGuild('dga');
    }
  };

  const modals = {
    guildResiduals: {
      title: "GUILD RESIDUALS",
      content: (
        <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
          <p>
            Residuals are reuse-based payments required under SAG-AFTRA/WGA/DGA agreements. 
            Toggle ON only if your production entity is the signatory and responsible for payments.
          </p>
          <p className="text-zinc-500">
            In many Streamer Buyouts, the buyer assumes this obligation.
          </p>
        </div>
      )
    },
    distributionCosts: {
      title: "DISTRIBUTION COSTS",
      content: (
        <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
          <div>
            <span className="text-white font-bold">SALES AGENT FEE</span>
            <p className="mt-1">Commission paid to your sales agent for securing distribution deals. Typically 10-20% of gross revenues.</p>
          </div>
          <div className="my-3 border-b border-dashed border-zinc-700" />
          <div>
            <span className="text-white font-bold">MARKETING CAP (SALES EXPENSES)</span>
            <p className="mt-1">The hard cap on expenses the Sales Agent can deduct for taking the film to market. This covers costs for film markets (Cannes, AFM, EFM), promotional materials, legal deliverables, and screenings.</p>
          </div>
          <p className="text-zinc-400 text-xs italic mt-3">
            Note: This is distinct from Distributor P&A. These are the costs required to find a buyer, not to release the film.
          </p>
        </div>
      )
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* MODAL */}
      <Dialog open={activeModal !== null} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="border-[#D4AF37] max-w-md" style={{ backgroundColor: '#0a0a0a' }}>
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl tracking-wider" style={{ color: '#D4AF37' }}>
              {activeModal && modals[activeModal as keyof typeof modals]?.title}
            </DialogTitle>
          </DialogHeader>
          {activeModal && modals[activeModal as keyof typeof modals]?.content}
        </DialogContent>
      </Dialog>

      {/* CARD 3A: GUILD RESIDUALS */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        {/* Header Strip */}
        <div 
          className="py-4 px-6 flex items-center justify-between"
          style={{ 
            backgroundColor: '#111111',
            borderBottom: showResiduals ? '1px solid #333333' : 'none'
          }}
        >
          {/* LEFT GROUP */}
          <div className="flex items-center gap-3">
            <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
              3A | GUILD RESIDUALS
            </h2>
            <button 
              onClick={() => setActiveModal('guildResiduals')}
              className="text-zinc-500 hover:text-[#D4AF37] transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          {/* RIGHT GROUP - Toggle only */}
          <Switch 
            checked={showResiduals} 
            onCheckedChange={handleResidualsToggle} 
            className="data-[state=checked]:bg-[#D4AF37]"
          />
        </div>

        {/* Body Area - Circuit Breaker */}
        {showResiduals && (
          <div className="p-6" style={{ backgroundColor: '#000000' }}>
            <div className="space-y-0">
              {/* SAG-AFTRA Row */}
              <div 
                className="flex items-center justify-between py-4 border-b border-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bebas text-lg text-white">SAG-AFTRA</span>
                  <span className="font-mono text-xs text-zinc-500">(4.5% EST)</span>
                </div>
                <Switch 
                  checked={guilds.sag} 
                  onCheckedChange={() => onToggleGuild('sag')} 
                  className="data-[state=checked]:bg-[#D4AF37]"
                />
              </div>

              {/* WGA Row */}
              <div 
                className="flex items-center justify-between py-4 border-b border-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bebas text-lg text-white">WGA</span>
                  <span className="font-mono text-xs text-zinc-500">(1.2% EST)</span>
                </div>
                <Switch 
                  checked={guilds.wga} 
                  onCheckedChange={() => onToggleGuild('wga')} 
                  className="data-[state=checked]:bg-[#D4AF37]"
                />
              </div>

              {/* DGA Row */}
              <div 
                className="flex items-center justify-between py-4"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bebas text-lg text-white">DGA</span>
                  <span className="font-mono text-xs text-zinc-500">(1.2% EST)</span>
                </div>
                <Switch 
                  checked={guilds.dga} 
                  onCheckedChange={() => onToggleGuild('dga')} 
                  className="data-[state=checked]:bg-[#D4AF37]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CARD 3B: DISTRIBUTION COSTS */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        {/* Header Strip */}
        <div 
          className="py-4 px-6 flex items-center justify-between border-b border-[#333333]"
          style={{ backgroundColor: '#111111' }}
        >
          {/* LEFT GROUP */}
          <div className="flex items-center gap-3">
            <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
              3B | DISTRIBUTION COSTS
            </h2>
            <button 
              onClick={() => setActiveModal('distributionCosts')}
              className="text-zinc-500 hover:text-[#D4AF37] transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          {/* No master toggle for distribution costs */}
        </div>

        {/* Body Area */}
        <div className="p-6 space-y-6" style={{ backgroundColor: '#000000' }}>
          {/* Sales Agent Fee */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-white font-bold text-sm tracking-wide uppercase">
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
                className="pl-4 pr-10 py-5 text-2xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                style={{ backgroundColor: '#0a0a0a' }}
                onFocus={(e) => e.target.select()}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-600">
                %
              </span>
            </div>
          </div>

          {/* Marketing Cap */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-white font-bold text-sm tracking-wide uppercase">
                Marketing Cap
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-600">
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
                className="pl-10 py-5 text-2xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                style={{ backgroundColor: '#0a0a0a' }}
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardStep3;
