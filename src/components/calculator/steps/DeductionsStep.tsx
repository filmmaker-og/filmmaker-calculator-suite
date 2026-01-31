import { Input } from "@/components/ui/input";
import { WaterfallInputs, GuildState } from "@/lib/waterfall";
import { Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useHaptics } from "@/hooks/use-haptics";

interface DeductionsStepProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onToggleGuild: (guild: keyof GuildState) => void;
}

const DeductionsStep = ({ inputs, guilds, onUpdateInput, onToggleGuild }: DeductionsStepProps) => {
  const haptics = useHaptics();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string, isPercent: boolean = false) => {
    const value = parseInt(str.replace(/[^0-9]/g, '')) || 0;
    return isPercent ? Math.min(value, 100) : value;
  };

  const modals: Record<string, { title: string; content: React.ReactNode }> = {
    salesFee: {
      title: "SALES AGENT FEE",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <p>Commission for securing distribution deals. The sales agent takes this percentage off the top of all revenue.</p>
          <p className="text-xs text-muted-foreground/70">Typically 10-15% domestic, 15-20% international</p>
        </div>
      )
    },
    marketing: {
      title: "MARKETING CAP",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <p>Hard cap on sales and marketing expenses including festival submissions, market attendance, and deliverables.</p>
          <p className="text-xs text-muted-foreground/70">This amount is deducted before any debt or equity repayment.</p>
        </div>
      )
    },
    guilds: {
      title: "GUILD RESIDUALS",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <p>Residuals are reuse-based payments under SAG-AFTRA/WGA/DGA agreements.</p>
          <p>Toggle ON only if your production is the signatory (responsible party).</p>
          <p className="text-xs text-muted-foreground/70">In many streamer buyouts, the buyer assumes this obligation.</p>
        </div>
      )
    }
  };

  return (
    <div className="step-enter">
      {/* Step Header */}
      <div className="text-center mb-8">
        <h2 className="font-bebas text-2xl tracking-[0.15em] text-gold mb-2">
          DEDUCTIONS
        </h2>
        <p className="text-white/50 text-sm">
          Off-the-top costs before debt and equity repayment
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {/* Sales Agent Fee */}
        <div className="bg-card border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bebas text-base tracking-wider text-foreground">SALES AGENT FEE</h3>
            <button
              onClick={() => setActiveModal('salesFee')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold/10"
            >
              <Info className="w-4 h-4 text-gold" />
            </button>
          </div>
          <div className="relative">
            <Input
              type="text"
              inputMode="numeric"
              value={formatValue(inputs.salesFee)}
              onChange={(e) => onUpdateInput('salesFee', parseValue(e.target.value, true))}
              placeholder="15"
              className="pr-12 h-14 text-xl font-mono text-foreground text-right rounded-none border-border focus:border-gold bg-background"
              onFocus={(e) => e.target.select()}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xl text-muted-foreground">%</span>
          </div>
        </div>

        {/* Marketing Cap */}
        <div className="bg-card border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bebas text-base tracking-wider text-foreground">MARKETING CAP</h3>
            <button
              onClick={() => setActiveModal('marketing')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold/10"
            >
              <Info className="w-4 h-4 text-gold" />
            </button>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
            <Input
              type="text"
              inputMode="numeric"
              value={formatValue(inputs.salesExp)}
              onChange={(e) => onUpdateInput('salesExp', parseValue(e.target.value))}
              placeholder="75,000"
              className="pl-10 h-14 text-xl font-mono text-foreground text-right rounded-none border-border focus:border-gold bg-background"
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>

        {/* Guild Residuals */}
        <div className="bg-card border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bebas text-base tracking-wider text-foreground">GUILD RESIDUALS</h3>
            <button
              onClick={() => setActiveModal('guilds')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold/10"
            >
              <Info className="w-4 h-4 text-gold" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Are you the signatory for any guilds?
          </p>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => { haptics.light(); onToggleGuild('sag'); }}
              className={`py-4 px-3 border text-center transition-all touch-feedback ${
                guilds.sag
                  ? 'bg-gold/20 border-gold text-gold'
                  : 'bg-background border-border text-muted-foreground hover:border-gold/50'
              }`}
            >
              <span className="text-sm font-semibold block">SAG</span>
              <span className="text-xs font-mono opacity-70">4.5%</span>
            </button>
            <button
              onClick={() => { haptics.light(); onToggleGuild('wga'); }}
              className={`py-4 px-3 border text-center transition-all touch-feedback ${
                guilds.wga
                  ? 'bg-gold/20 border-gold text-gold'
                  : 'bg-background border-border text-muted-foreground hover:border-gold/50'
              }`}
            >
              <span className="text-sm font-semibold block">WGA</span>
              <span className="text-xs font-mono opacity-70">1.2%</span>
            </button>
            <button
              onClick={() => { haptics.light(); onToggleGuild('dga'); }}
              className={`py-4 px-3 border text-center transition-all touch-feedback ${
                guilds.dga
                  ? 'bg-gold/20 border-gold text-gold'
                  : 'bg-background border-border text-muted-foreground hover:border-gold/50'
              }`}
            >
              <span className="text-sm font-semibold block">DGA</span>
              <span className="text-xs font-mono opacity-70">1.2%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Helpful Context */}
      <div className="mt-6 p-4 border border-border/50 bg-card/50">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-gold font-semibold">NOTE:</span> A 1% CAM (Collection Account Management) fee is automatically applied to all calculations. This covers bank/escrow administration.
        </p>
      </div>

      {/* Modal */}
      <Dialog open={activeModal !== null} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="border-border max-w-md bg-card rounded-none">
          <DialogHeader>
            <DialogTitle className="font-bebas text-xl tracking-wider text-gold">
              {activeModal && modals[activeModal]?.title}
            </DialogTitle>
          </DialogHeader>
          {activeModal && modals[activeModal]?.content}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeductionsStep;
