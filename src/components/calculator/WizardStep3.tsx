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
      {/* Guild Toggles Card */}
      <div 
        className="overflow-hidden"
        style={{ 
          border: '1px solid #D4AF37',
          borderRadius: '8px'
        }}
      >
        {/* Header Strip */}
        <div 
          className="px-6 py-4"
          style={{ backgroundColor: '#111111' }}
        >
          <h2 
            className="font-bebas text-xl tracking-wider"
            style={{ color: '#D4AF37' }}
          >
            03 | GUILD PARTICIPATIONS
          </h2>
        </div>

        {/* Card Body */}
        <div 
          className="p-6"
          style={{ backgroundColor: '#000000' }}
        >
          <div className="grid grid-cols-1 gap-4">
            {guildInfo.map((guild) => (
              <button
                key={guild.key}
                onClick={() => onToggleGuild(guild.key)}
                className="p-4 text-left transition-all duration-300 rounded-md"
                style={{
                  backgroundColor: '#0a0a0a',
                  border: guilds[guild.key] ? '1px solid #D4AF37' : '1px solid #333333',
                  boxShadow: guilds[guild.key] ? '0 0 20px rgba(212, 175, 55, 0.2)' : 'none'
                }}
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
                      className="w-6 h-6 flex items-center justify-center transition-all rounded"
                      style={{
                        border: guilds[guild.key] ? '1px solid #D4AF37' : '1px solid #444444',
                        backgroundColor: guilds[guild.key] ? '#D4AF37' : 'transparent'
                      }}
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
      <div 
        className="overflow-hidden"
        style={{ 
          border: '1px solid #D4AF37',
          borderRadius: '8px'
        }}
      >
        {/* Header Strip */}
        <div 
          className="px-6 py-4"
          style={{ backgroundColor: '#111111' }}
        >
          <h2 
            className="font-bebas text-xl tracking-wider"
            style={{ color: '#D4AF37' }}
          >
            DISTRIBUTION COSTS
          </h2>
        </div>

        {/* Card Body */}
        <div 
          className="p-6 space-y-6"
          style={{ backgroundColor: '#000000' }}
        >
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
                className="py-5 text-xl font-mono text-white text-right pr-10 rounded-md transition-colors"
                style={{ 
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #333333',
                }}
                onFocus={(e) => {
                  e.target.select();
                  e.currentTarget.style.borderColor = '#D4AF37';
                  e.currentTarget.style.boxShadow = '0 0 0 1px #D4AF37';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#333333';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-500">
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
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-500">
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
                className="pl-10 py-5 text-xl font-mono text-white text-right rounded-md transition-colors"
                style={{ 
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #333333',
                }}
                onFocus={(e) => {
                  e.target.select();
                  e.currentTarget.style.borderColor = '#D4AF37';
                  e.currentTarget.style.boxShadow = '0 0 0 1px #D4AF37';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#333333';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardStep3;
