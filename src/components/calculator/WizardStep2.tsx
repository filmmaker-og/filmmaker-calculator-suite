import { Input } from "@/components/ui/input";
import { WaterfallInputs } from "@/lib/waterfall";

interface WizardStep2Props {
  inputs: WaterfallInputs;
  onUpdate: (key: keyof WaterfallInputs, value: number) => void;
}

const WizardStep2 = ({ inputs, onUpdate }: WizardStep2Props) => {
  const fields = [
    { key: "credits" as const, label: "Soft Money (Tax Credits)" },
    { key: "debt" as const, label: "Senior Debt" },
    { key: "equity" as const, label: "Investor Equity" },
    { key: "premium" as const, label: "Preferred Return", isPercent: true },
  ];

  return (
    <div className="animate-fade-in">
      {/* Terminal Card */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        {/* Header Strip */}
        <div className="py-4 px-6 border-b border-[#333333]" style={{ backgroundColor: '#111111' }}>
          <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
            02 | CAPITAL STACK
          </h2>
        </div>

        {/* Body Area */}
        <div className="p-6 space-y-6" style={{ backgroundColor: '#000000' }}>
          {fields.map((field) => (
            <div key={field.key}>
              {/* Label */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-white font-bold text-sm tracking-wide uppercase">
                  {field.label}
                </span>
              </div>
              
              {/* Input Box */}
              <div className="relative">
                {!field.isPercent && (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-600">
                    $
                  </span>
                )}
                <Input
                  id={field.key}
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  value={inputs[field.key] === 0 ? '' : inputs[field.key].toLocaleString()}
                  onChange={(e) => {
                    const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                    onUpdate(field.key, field.isPercent ? Math.min(value, 100) : value);
                  }}
                  placeholder="0"
                  className={`${!field.isPercent ? 'pl-10' : 'pl-4'} ${field.isPercent ? 'pr-10' : ''} py-5 text-xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors`}
                  style={{ backgroundColor: '#0a0a0a' }}
                  onFocus={(e) => e.target.select()}
                />
                {field.isPercent && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-600">
                    %
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WizardStep2;
