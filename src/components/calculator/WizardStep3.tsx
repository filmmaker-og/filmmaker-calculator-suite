import { Input } from "@/components/ui/input";
import { GuildState } from "@/lib/waterfall";
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
    <div className="animate-fade-in space-y-6">
      {/* Guild Participations Card */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        {/* Header Strip */}
        <div className="py-4 px-6 border-b border-[#333333]" style={{ backgroundColor: '#111111' }}>
          <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
            03 | GUILD PARTICIPATIONS
          </h2>
        </div>

        {/* Body Area */}
        <div className="p-6" style={{ backgroundColor: '#000000' }}>
          <div className="space-y-3">
            {guildInfo.map((guild) => (
              <button
                key={guild.key}
                onClick={() => onToggleGuild(guild.key)}
                className={`w-full p-4 text-left transition-all duration-300 rounded-sm border ${
                  guilds[guild.key] 
                    ? 'border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]' 
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
                style={{ backgroundColor: '#0a0a0a' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bebas text-lg text-white mb-1">
                      {guild.name}
                    </h3>
                    <p className="text-zinc-500 text-sm">{guild.desc}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-zinc-400">{guild.rate}</span>
                    <div 
                      className={`w-6 h-6 flex items-center justify-center transition-all rounded-sm border ${
                        guilds[guild.key] 
                          ? 'border-[#D4AF37] bg-[#D4AF37]' 
                          : 'border-zinc-700'
                      }`}
                    >
                      {guilds[guild.key] && <Check className="w-4 h-4 text-black" />}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution Costs Card */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        {/* Header Strip */}
        <div className="py-4 px-6 border-b border-[#333333]" style={{ backgroundColor: '#111111' }}>
          <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
            DISTRIBUTION COSTS
          </h2>
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
                className="py-5 text-xl font-mono text-white text-right pr-10 rounded-sm border-zinc-800 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
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
                className="pl-10 py-5 text-xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
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
