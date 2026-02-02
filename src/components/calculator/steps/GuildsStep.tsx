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
      {/* The Header */}
      <div className="text-center mb-6">
        <h2 className="font-bebas text-2xl tracking-[0.1em] text-foreground mb-2">
          The unions <span className="text-gold">get their piece</span>
        </h2>
        <p className="text-xs text-muted-foreground/70">
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

      {/* The Card */}
      <div className="matte-card p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-muted flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-bebas text-xl tracking-wider text-gold mb-1">GUILD RESIDUALS</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Are you <span className="text-foreground font-semibold">signatory</span> to any guilds?
            </p>
          </div>
        </div>

        {/* Guild Toggles - Enhanced */}
        <div className="space-y-3">
          {guildOptions.map((guild) => {
            const isSelected = guilds[guild.key];
            const wasJustToggled = justToggled === guild.key;
            
            return (
              <button
                key={guild.key}
                onClick={() => handleToggle(guild.key)}
                className={cn(
                  "w-full p-4 border-2 flex items-center justify-between transition-all duration-200 toggle-ripple",
                  isSelected
                    ? 'bg-gold/10 border-gold shadow-[0_0_16px_rgba(212,175,55,0.2)]'
                    : 'bg-background border-border hover:border-gold/50',
                  wasJustToggled && 'scale-[1.02]'
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Checkbox */}
                  <div className={cn(
                    "w-7 h-7 flex items-center justify-center border-2 transition-all duration-200",
                    isSelected
                      ? 'bg-gold border-gold'
                      : 'bg-transparent border-border'
                  )}>
                    {isSelected && (
                      <Check className="w-4 h-4 text-black animate-scale-in" />
                    )}
                  </div>
                  
                  <div className="text-left">
                    <span className={cn(
                      "font-semibold transition-colors",
                      isSelected ? 'text-gold' : 'text-foreground'
                    )}>
                      {guild.name}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">{guild.subtitle}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="font-mono text-sm text-muted-foreground">{guild.rate}</span>
                  {inputs.budget > 0 && isSelected && (
                    <span className="font-mono text-sm text-destructive ml-2">
                      -{formatCompactCurrency(guild.amount)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Total Impact - Animated */}
        {totalGuildsCost > 0 && (
          <div className="pt-4 border-t border-border animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total guild residuals:</span>
              <span className="font-mono text-xl text-destructive">
                -{formatCompactCurrency(totalGuildsCost)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Inline Helper */}
      <div className="mt-4">
        <Collapsible open={showHelp} onOpenChange={setShowHelp}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-gold hover:text-gold-highlight transition-colors">
            <Info className="w-4 h-4" />
            <span>Who's responsible for residuals?</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 p-4 bg-card border border-border text-sm text-muted-foreground leading-relaxed animate-fade-in">
            <p>
              Only toggle these ON if <span className="text-foreground">your production company</span> is the signatory. In many streamer buyouts, the buyer assumes this obligation.
            </p>
            <p className="mt-2 text-xs text-muted-foreground/70">
              Check your talent agreements. The signatory is legally responsible for calculating and paying residuals.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* No guilds selected hint */}
      {!guilds.sag && !guilds.wga && !guilds.dga && (
        <div className="mt-4 text-center animate-fade-in">
          <p className="text-xs text-muted-foreground/50">
            No guild residuals? That helps your position.
          </p>
        </div>
      )}
    </div>
  );
};

export default GuildsStep;
