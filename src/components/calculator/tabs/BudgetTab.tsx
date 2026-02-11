import { WaterfallInputs, GuildState } from "@/lib/waterfall";
import BudgetInput from "../budget/BudgetInput";
import { Info, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface BudgetTabProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onToggleGuild: (guild: keyof GuildState) => void;
  onAdvance: () => void;
}

const BudgetTab = ({ inputs, guilds, onUpdateInput, onToggleGuild, onAdvance }: BudgetTabProps) => {
  return (
    <div className="space-y-8">
      {/* 1. Main Budget Input */}
      <BudgetInput 
        inputs={inputs} 
        onUpdateInput={onUpdateInput} 
        onNext={onAdvance} 
      />

      {/* 2. Guild Toggles - Unified list style (matches CapitalSelect) */}
      <div className="space-y-4 pt-4 border-t border-border-subtle animate-fade-in">
        <div className="bg-bg-elevated border border-border-default rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-border-subtle flex items-center justify-between bg-bg-surface/50">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-text-dim font-semibold">
                Union Signatories
              </span>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-text-dim/50 hover:text-gold cursor-pointer transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[200px] bg-bg-card border-border-subtle text-xs">
                    <p>Check these if your production is signatory to any guilds. This adds mandatory P&H and Residual reserves to the waterfall.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="divide-y divide-border-subtle">
            {([
              { key: 'sag' as const, label: 'SAG-AFTRA', desc: 'Actors' },
              { key: 'dga' as const, label: 'DGA', desc: 'Directors' },
              { key: 'wga' as const, label: 'WGA', desc: 'Writers' },
            ]).map((guild) => {
              const isSelected = guilds[guild.key];
              return (
                <button
                  key={guild.key}
                  onClick={() => onToggleGuild(guild.key)}
                  className={cn(
                    "w-full p-4 text-left transition-all duration-150 group flex items-center gap-4",
                    isSelected ? "bg-bg-surface" : "bg-transparent hover:bg-bg-elevated"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <span className={cn(
                      "text-sm font-semibold transition-colors",
                      isSelected ? "text-gold" : "text-text-mid"
                    )}>
                      {guild.label}
                    </span>
                    <p className="text-xs text-text-dim">{guild.desc}</p>
                  </div>
                  <div className={cn(
                    "w-5 h-5 flex items-center justify-center border transition-all duration-150 rounded-sm",
                    isSelected
                      ? "bg-gold border-gold"
                      : "bg-transparent border-border-subtle group-hover:border-text-dim"
                  )}>
                    {isSelected && <Check className="w-3 h-3 text-black" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-[10px] leading-snug text-text-dim/80 text-center">
          Most indie filmmakers are not guild signatories. Leave unchecked if unsure.
        </p>
      </div>
    </div>
  );
};

export default BudgetTab;
