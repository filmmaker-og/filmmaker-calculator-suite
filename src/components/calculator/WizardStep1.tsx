import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/waterfall";

interface WizardStep1Props {
  budget: number;
  onUpdate: (value: number) => void;
}

const WizardStep1 = ({ budget, onUpdate }: WizardStep1Props) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <span className="text-gold text-xs tracking-[0.3em] uppercase">Step 1</span>
        <h2 className="font-display text-4xl md:text-5xl text-foreground mt-2">
          THE BASIS
        </h2>
        <p className="text-dim mt-3 max-w-xl">
          Enter the total production budget (negative cost) of your film project.
        </p>
      </div>

      <div className="glass-card p-8">
        <div className="space-y-4">
          <Label htmlFor="budget" className="text-mid text-xs tracking-widest uppercase">
            Negative Cost (Production Budget)
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold font-mono text-xl">
              $
            </span>
            <Input
              id="budget"
              type="tel"
              inputMode="numeric"
              value={budget.toLocaleString()}
              onChange={(e) => {
                const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                onUpdate(value);
              }}
              className="pl-10 py-8 text-3xl font-mono bg-background border-border rounded-none text-foreground gold-glow-focus text-right"
            />
          </div>
          <p className="text-dim text-sm">
            Default: {formatCurrency(2000000)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WizardStep1;
