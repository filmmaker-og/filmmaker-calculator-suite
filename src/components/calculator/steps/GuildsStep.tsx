import { WaterfallInputs, GuildState, formatCompactCurrency } from "@/lib/waterfall";
import { Check } from "lucide-react";
import { useState } from "react";
import { useHaptics } from "@/hooks/use-haptics";
import { cn } from "@/lib/utils";

interface GuildsStepProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  onToggleGuild: (guild: keyof GuildState) => void;
}

const GuildsStep = ({ inputs, guilds, onToggleGuild }: GuildsStepProps) => {
  const haptics = useHaptics();
  const [justToggled, setJustToggled] = useState<string | null>(null);

  // Calculate impact based on a hypothetical 1.2x deal
  const hypotheticalRevenue = inputs.budget * 1.2;
  const sagAmount = hypotheticalRevenue * 0.045;
  const wgaAmount = hypotheticalRevenue * 0.012;
  const dgaAmount = hypotheticalRevenue * 0.012;

  const totalGuildsCost =
    (guilds.sag ? sagAmount : 0) +
    (guilds.wga ? wgaAmount : 0) +
    (guilds.dga ? dgaAmount : 0);

  const handleToggle = (guild: keyof GuildState) => {
    haptics.light();
    setJustToggled(guild);
    onToggleGuild(guild);
    setTimeout(() => setJustToggled(null), 200);
  };

  const guildOptions = [
    { key: 'sag' as keyof GuildState, name: 'SAG-AFTRA', subtitle: 'Actors', rate: '4.5%', amount: sagAmount },
    { key: 'wga' as keyof GuildState, name: 'WGA', subtitle: 'Writers', rate: '1.2%', amount: wgaAmount },
    { key: 'dga' as keyof GuildState, name: 'DGA', subtitle: 'Directors', rate: '1.2%', amount: dgaAmount },
  ];

  const activeCount = [guilds.sag, guilds.wga, guilds.dga].filter(Boolean).length;

  return (
    <div className="min-h-[60vh] flex flex-col justify-center">
      {/* Hero question - minimal */}
      <div className="text-center mb-8">
        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2">
          Guild Residuals
        </h2>
        <p className="text-white/40 text-sm">
          Are you signatory to any guilds?
        </p>
      </div>

      {/* Guild Toggles Card */}
      <div className="bg-black border border-[#1A1A1A]">
        <div className="p-4 border-b border-[#1A1A1A] flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-white/40">Select if signatory</span>
          {activeCount > 0 && (
            <span className="text-xs text-white/30">{activeCount} selected</span>
          )}
        </div>

        <div className="p-4 space-y-3">
          {guildOptions.map((guild) => {
            const isSelected = guilds[guild.key];
            const wasJustToggled = justToggled === guild.key;

            return (
              <button
                key={guild.key}
                onClick={() => handleToggle(guild.key)}
                className={cn(
                  "w-full p-4 border flex items-center justify-between transition-all duration-150",
                  isSelected
                    ? 'bg-white/5 border-white/20'
                    : 'bg-black border-[#2A2A2A] hover:border-white/20',
                  wasJustToggled && 'scale-[1.01]'
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Checkbox */}
                  <div className={cn(
                    "w-5 h-5 flex items-center justify-center border transition-all duration-150",
                    isSelected
                      ? 'bg-gold border-gold'
                      : 'bg-transparent border-[#3A3A3A]'
                  )}>
                    {isSelected && (
                      <Check className="w-3 h-3 text-black" />
                    )}
                  </div>

                  <div className="text-left">
                    <span className={cn(
                      "font-medium text-sm transition-colors",
                      isSelected ? 'text-white' : 'text-white/70'
                    )}>
                      {guild.name}
                    </span>
                    <span className="text-xs text-white/30 ml-2">{guild.subtitle}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-sm text-white/40">{guild.rate}</span>
                  {inputs.budget > 0 && isSelected && (
                    <span className="font-mono text-xs text-white/50 ml-2">
                      -{formatCompactCurrency(guild.amount)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Total Impact */}
        {totalGuildsCost > 0 && (
          <div className="border-t border-[#1A1A1A] p-4 flex items-center justify-between">
            <span className="text-sm text-white/40">Total residuals</span>
            <span className="font-mono text-lg text-white">
              -{formatCompactCurrency(totalGuildsCost)}
            </span>
          </div>
        )}
      </div>

      {/* Hint text */}
      {!guilds.sag && !guilds.wga && !guilds.dga && (
        <p className="mt-4 text-center text-xs text-white/30">
          Most SVOD buyouts are non-union. Skip if the buyer handles residuals.
        </p>
      )}
    </div>
  );
};

export default GuildsStep;
