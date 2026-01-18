import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GuildState, formatCurrency } from "@/lib/waterfall";
import { Check } from "lucide-react";

interface WizardStep3Props {
  guilds: GuildState;
  salesFee: number;
  salesExp: number;
  onToggleGuild: (guild: keyof GuildState) => void;
  onUpdateSalesFee: (value: number) => void;
  onUpdateSalesExp: (value: number) => void;
}

const guildInfo = [
  { key: "sag" as const, name: "SAG-AFTRA", desc: "4.5% Residuals", rate: "4.5%" },
  { key: "wga" as const, name: "WGA", desc: "1.2% Residuals", rate: "1.2%" },
  { key: "dga" as const, name: "DGA", desc: "1.2% Residuals", rate: "1.2%" },
];

const WizardStep3 = ({ 
  guilds, 
  salesFee, 
  salesExp, 
  onToggleGuild, 
  onUpdateSalesFee, 
  onUpdateSalesExp 
}: WizardStep3Props) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <span className="text-gold text-xs tracking-[0.3em] uppercase">Step 3</span>
        <h2 className="font-display text-4xl md:text-5xl text-foreground mt-2">
          THE LEVERS
        </h2>
        <p className="text-dim mt-3 max-w-xl">
          Select applicable guild participations and distribution costs.
        </p>
      </div>

      {/* Guild Toggles */}
      <div className="mb-8">
        <Label className="text-mid text-xs tracking-widest uppercase block mb-4">
          Guild Participations
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guildInfo.map((guild) => (
            <button
              key={guild.key}
              onClick={() => onToggleGuild(guild.key)}
              className={`glass-card p-6 text-left transition-all duration-300 ${
                guilds[guild.key] 
                  ? 'border-gold shadow-[0_0_20px_hsl(43_66%_52%/0.2)]' 
                  : 'hover:border-dim'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl text-foreground mb-1">
                    {guild.name}
                  </h3>
                  <p className="text-dim text-sm">{guild.desc}</p>
                </div>
                <div className={`w-6 h-6 border flex items-center justify-center transition-all ${
                  guilds[guild.key] 
                    ? 'border-gold bg-gold' 
                    : 'border-border'
                }`}>
                  {guilds[guild.key] && <Check className="w-4 h-4 text-background" />}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <span className="font-mono text-gold text-lg">{guild.rate}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sales Fee & Marketing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="salesFee" className="text-mid text-xs tracking-widest uppercase">
                Sales Agent Fee
              </Label>
              <span className="text-dim text-xs font-mono">Default: 15%</span>
            </div>
            <div className="relative">
              <Input
                id="salesFee"
                type="tel"
                inputMode="numeric"
                value={salesFee}
                onChange={(e) => {
                  const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                  onUpdateSalesFee(Math.min(value, 100));
                }}
                className="py-6 text-xl font-mono bg-background border-border rounded-none text-foreground gold-glow-focus text-right pr-10"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gold font-mono text-lg">
                %
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="salesExp" className="text-mid text-xs tracking-widest uppercase">
                Marketing Cap
              </Label>
              <span className="text-dim text-xs font-mono">Default: {formatCurrency(75000)}</span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold font-mono text-lg">
                $
              </span>
              <Input
                id="salesExp"
                type="tel"
                inputMode="numeric"
                value={salesExp.toLocaleString()}
                onChange={(e) => {
                  const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                  onUpdateSalesExp(value);
                }}
                className="pl-10 py-6 text-xl font-mono bg-background border-border rounded-none text-foreground gold-glow-focus text-right"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardStep3;
