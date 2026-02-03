import { WaterfallInputs, GuildState, formatCompactCurrency } from "@/lib/waterfall";
import { Info, Users, Check } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useHaptics } from "@/hooks/use-haptics";
import { cn } from "@/lib/utils";

interface GuildsStepProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  onToggleGuild: (guild: keyof GuildState) => void;
}

const GuildsStep = ({ inputs, guilds, onToggleGuild }: GuildsStepProps) => {
  const haptics = useHaptics();
  const [showHelp, setShowHelp] = useState(false);
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

  return (
    <div className="step-enter">
      {/* Step Header with icon - Consistent with other steps */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
              filter: 'blur(15px)',
              transform: 'scale(2)',
            }}
          />
          <div className="relative w-14 h-14 border border-gold/30 bg-gold/5 flex items-center justify-center">
            <Users className="w-7 h-7 text-gold" />
          </div>
        </div>

        <p className="text-white/40 text-xs mb-2 uppercase tracking-widest">Unions take their cut</p>
        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2">
          Guild <span className="text-gold">Residuals</span>
        </h2>
        <p className="text-white/50 text-sm max-w-xs mx-auto">
          If you're signatory, residuals come off the top. Every time.
        </p>
      </div>

      {/* SVOD Context Banner */}
      <div className="mb-6 p-4 bg-gold/5 border border-gold/20">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white/80 font-medium">Most SVOD deals are non-union</p>
            <p className="text-xs text-white/50 mt-1">
              If your film is being acquired by a streamer, they typically handle residuals.
              Skip these unless you <span className="text-gold">know</span> you're the signatory.
            </p>
          </div>
        </div>
      </div>

      {/* The Card - Using matte-section for consistency */}
      <div className="matte-section overflow-hidden">
        {/* Section header */}
        <div className="matte-section-header px-5 py-3">
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
            Are you signatory to any guilds?
          </span>
        </div>

        {/* Guild Toggles */}
        <div className="p-5 space-y-3">
          {guildOptions.map((guild) => {
            const isSelected = guilds[guild.key];
            const wasJustToggled = justToggled === guild.key;

            return (
              <button
                key={guild.key}
                onClick={() => handleToggle(guild.key)}
                className={cn(
                  "w-full p-4 border flex items-center justify-between transition-all duration-200",
                  isSelected
                    ? 'bg-gold/10 border-gold shadow-[0_0_16px_rgba(212,175,55,0.2)]'
                    : 'bg-[#0A0A0A] border-[#1A1A1A] hover:border-gold/50',
                  wasJustToggled && 'scale-[1.02]'
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Checkbox */}
                  <div className={cn(
                    "w-6 h-6 flex items-center justify-center border transition-all duration-200",
                    isSelected
                      ? 'bg-gold border-gold'
                      : 'bg-transparent border-[#2A2A2A]'
                  )}>
                    {isSelected && (
                      <Check className="w-4 h-4 text-black animate-scale-in" />
                    )}
                  </div>

                  <div className="text-left">
                    <span className={cn(
                      "font-semibold transition-colors",
                      isSelected ? 'text-gold' : 'text-white'
                    )}>
                      {guild.name}
                    </span>
                    <span className="text-xs text-white/40 ml-2">{guild.subtitle}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-sm text-white/50">{guild.rate}</span>
                  {inputs.budget > 0 && isSelected && (
                    <span className="font-mono text-sm text-gold/70 ml-2">
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
          <div className="border-t border-[#1A1A1A] bg-[#0A0A0A]/50">
            <div className="p-5 flex items-center justify-between">
              <span className="text-sm text-white/40">Total guild residuals:</span>
              <span className="font-mono text-xl text-gold font-semibold">
                -{formatCompactCurrency(totalGuildsCost)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Inline Helper */}
      <div className="mt-6">
        <Collapsible open={showHelp} onOpenChange={setShowHelp}>
          <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 text-sm text-gold/70 hover:text-gold transition-colors py-3">
            <Info className="w-4 h-4" />
            <span>Who's responsible for residuals?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="glass-card-gold p-5 animate-reveal-up">
              <p className="text-sm text-white/70 mb-3 leading-relaxed">
                Only toggle these ON if <span className="text-gold font-semibold">your production company</span> is the signatory. In many streamer buyouts, the buyer assumes this obligation.
              </p>
              <div className="premium-divider mb-3" />
              <p className="text-xs text-white/50">
                Check your talent agreements. The signatory is legally responsible for calculating and paying residuals.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* No guilds selected hint */}
      {!guilds.sag && !guilds.wga && !guilds.dga && (
        <div className="mt-4 text-center animate-fade-in">
          <p className="text-xs text-white/30">
            No guild residuals? That helps your position.
          </p>
        </div>
      )}
    </div>
  );
};

export default GuildsStep;
