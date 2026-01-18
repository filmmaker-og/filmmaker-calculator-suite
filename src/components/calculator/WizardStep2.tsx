import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WaterfallInputs, formatCurrency } from "@/lib/waterfall";

interface WizardStep2Props {
  inputs: WaterfallInputs;
  onUpdate: (key: keyof WaterfallInputs, value: number) => void;
}

const WizardStep2 = ({ inputs, onUpdate }: WizardStep2Props) => {
  const fields = [
    { key: "credits" as const, label: "Soft Money (Tax Credits)", default: 400000 },
    { key: "debt" as const, label: "Senior Debt", default: 600000 },
    { key: "equity" as const, label: "Investor Equity", default: 1000000 },
    { key: "premium" as const, label: "Preferred Return (%)", default: 20, isPercent: true },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <span className="text-gold text-xs tracking-[0.3em] uppercase">Step 2</span>
        <h2 className="font-display text-4xl md:text-5xl text-foreground mt-2">
          CAPITAL STACK
        </h2>
        <p className="text-dim mt-3 max-w-xl">
          Define how your production is financed across different tranches.
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key} className="glass-card p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label 
                  htmlFor={field.key} 
                  className="text-mid text-xs tracking-widest uppercase"
                >
                  {field.label}
                </Label>
                <span className="text-dim text-xs font-mono">
                  Default: {field.isPercent ? `${field.default}%` : formatCurrency(field.default)}
                </span>
              </div>
              <div className="relative">
                {!field.isPercent && (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold font-mono text-lg">
                    $
                  </span>
                )}
                <Input
                  id={field.key}
                  type="tel"
                  inputMode="numeric"
                  value={inputs[field.key].toLocaleString()}
                  onChange={(e) => {
                    const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                    onUpdate(field.key, value);
                  }}
                  className={`${!field.isPercent ? 'pl-10' : 'pl-4'} py-6 text-xl font-mono bg-background border-border rounded-none text-foreground gold-glow-focus text-right`}
                />
                {field.isPercent && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gold font-mono text-lg">
                    %
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WizardStep2;
