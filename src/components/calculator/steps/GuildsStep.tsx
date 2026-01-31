import { WaterfallInputs, GuildState, formatCompactCurrency } from "@/lib/waterfall";
import { Info, Users } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useHaptics } from "@/hooks/use-haptics";

interface GuildsStepProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  onToggleGuild: (guild: keyof GuildState) => void;
}

const GuildsStep = ({ inputs, guilds, onToggleGuild }: GuildsStepProps) => {
  const haptics = useHaptics();
  const [showHelp, setShowHelp] = useState(false);

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
    onToggleGuild(guild);
  };

  return (
    <div className="step-enter">
      {/* The Card */}
      <div className="bg-card border border-border p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-muted flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-bebas text-xl tracking-wider text-gold mb-2">GUILD RESIDUALS</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Are you <span className="text-foreground font-semibold">signatory</span> to any guilds? These residuals come off the top. Every time.
            </p>
          </div>
        </div>

        {/* Guild Toggles */}
        <div className="space-y-3">
          {/* SAG */}
          <button
            onClick={() => handleToggle('sag')}
            className={`w-full p-4 border flex items-center justify-between transition-all touch-feedback ${
              guilds.sag
                ? 'bg-gold/10 border-gold'
                : 'bg-background border-border hover:border-gold/50'
            }`}
          >
            <div className="text-left">
              <span className={`font-semibold ${guilds.sag ? 'text-gold' : 'text-foreground'}`}>
                SAG-AFTRA
              </span>
              <span className="text-xs text-muted-foreground ml-2">Actors</span>
            </div>
            <div className="text-right">
              <span className="font-mono text-sm text-muted-foreground">4.5%</span>
              {inputs.budget > 0 && guilds.sag && (
                <span className="font-mono text-sm text-red-400 ml-2">
                  -{formatCompactCurrency(sagAmount)}
                </span>
              )}
            </div>
          </button>

          {/* WGA */}
          <button
            onClick={() => handleToggle('wga')}
            className={`w-full p-4 border flex items-center justify-between transition-all touch-feedback ${
              guilds.wga
                ? 'bg-gold/10 border-gold'
                : 'bg-background border-border hover:border-gold/50'
            }`}
          >
            <div className="text-left">
              <span className={`font-semibold ${guilds.wga ? 'text-gold' : 'text-foreground'}`}>
                WGA
              </span>
              <span className="text-xs text-muted-foreground ml-2">Writers</span>
            </div>
            <div className="text-right">
              <span className="font-mono text-sm text-muted-foreground">1.2%</span>
              {inputs.budget > 0 && guilds.wga && (
                <span className="font-mono text-sm text-red-400 ml-2">
                  -{formatCompactCurrency(wgaAmount)}
                </span>
              )}
            </div>
          </button>

          {/* DGA */}
          <button
            onClick={() => handleToggle('dga')}
            className={`w-full p-4 border flex items-center justify-between transition-all touch-feedback ${
              guilds.dga
                ? 'bg-gold/10 border-gold'
                : 'bg-background border-border hover:border-gold/50'
            }`}
          >
            <div className="text-left">
              <span className={`font-semibold ${guilds.dga ? 'text-gold' : 'text-foreground'}`}>
                DGA
              </span>
              <span className="text-xs text-muted-foreground ml-2">Directors</span>
            </div>
            <div className="text-right">
              <span className="font-mono text-sm text-muted-foreground">1.2%</span>
              {inputs.budget > 0 && guilds.dga && (
                <span className="font-mono text-sm text-red-400 ml-2">
                  -{formatCompactCurrency(dgaAmount)}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Total Impact */}
        {totalGuildsCost > 0 && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total guild residuals:</span>
              <span className="font-mono text-xl text-red-400">
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
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground/50">
            No guild residuals? That helps your position.
          </p>
        </div>
      )}
    </div>
  );
};

export default GuildsStep;
