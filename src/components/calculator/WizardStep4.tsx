import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/waterfall";

interface WizardStep4Props {
  revenue: number;
  onUpdate: (value: number) => void;
}

const WizardStep4 = ({ revenue, onUpdate }: WizardStep4Props) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <span className="text-gold text-xs tracking-[0.3em] uppercase">Step 4</span>
        <h2 className="font-display text-4xl md:text-5xl text-foreground mt-2">
          THE MARKET
        </h2>
        <p className="text-dim mt-3 max-w-xl">
          Project your total gross revenue from all distribution windows.
        </p>
      </div>

      <div className="glass-card p-8">
        <div className="space-y-4">
          <Label htmlFor="revenue" className="text-mid text-xs tracking-widest uppercase">
            Projected Gross Revenue
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold font-mono text-xl">
              $
            </span>
            <Input
              id="revenue"
              type="tel"
              inputMode="numeric"
              value={revenue.toLocaleString()}
              onChange={(e) => {
                const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                onUpdate(value);
              }}
              className="pl-10 py-8 text-3xl font-mono bg-background border-border rounded-none text-foreground gold-glow-focus text-right"
            />
          </div>
          <p className="text-dim text-sm">
            Default: {formatCurrency(3500000)}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-dim text-sm leading-relaxed">
            <span className="text-gold font-semibold">Tip:</span> Consider all revenue windows including 
            theatrical, streaming licenses, SVOD, AVOD, international presales, and ancillary rights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WizardStep4;
