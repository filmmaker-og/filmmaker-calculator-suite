import { WaterfallInputs, GuildState } from "@/lib/waterfall";
import { useState } from "react";
import BudgetInput from "../budget/BudgetInput";
import { Info } from "lucide-react";
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
  // We only have one step in this tab now (BudgetInput), but we are adding the Guild Toggles here.
  
  return (
    <div className="space-y-8">
      {/* 1. Main Budget Input */}
      <BudgetInput 
        inputs={inputs} 
        onUpdateInput={onUpdateInput} 
        onNext={onAdvance} 
      />

      {/* 2. Guild Toggles (Moved back here per request) */}
      <div className="space-y-4 pt-4 border-t border-border-subtle animate-fade-in">
        <div className="flex items-center gap-2 mb-3">
           <span className="text-xs font-bold uppercase tracking-widest text-text-dim">
            Union Signatories
          </span>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Info className="w-3.5 h-3.5 text-text-dim/50 hover:text-gold cursor-pointer transition-colors" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[200px] bg-bg-card border-gold/30 text-xs">
                <p>Check these if your production is signatory to any guilds. This adds mandatory P&H and Residual reserves to the waterfall.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* SAG-AFTRA */}
          <button
            onClick={() => onToggleGuild('sag')}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200",
              guilds.sag
                ? "bg-gold/10 border-gold text-gold shadow-[0_0_10px_rgba(212,175,55,0.1)]"
                : "bg-bg-elevated border-border-default text-text-dim hover:border-gold/30 hover:text-text-mid"
            )}
          >
            <span className="font-bold text-sm">SAG</span>
            <span className="text-[9px] uppercase tracking-wider mt-1 opacity-70">Actors</span>
          </button>

          {/* DGA */}
          <button
            onClick={() => onToggleGuild('dga')}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200",
              guilds.dga
                ? "bg-gold/10 border-gold text-gold shadow-[0_0_10px_rgba(212,175,55,0.1)]"
                : "bg-bg-elevated border-border-default text-text-dim hover:border-gold/30 hover:text-text-mid"
            )}
          >
            <span className="font-bold text-sm">DGA</span>
            <span className="text-[9px] uppercase tracking-wider mt-1 opacity-70">Directors</span>
          </button>

          {/* WGA */}
          <button
            onClick={() => onToggleGuild('wga')}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200",
              guilds.wga
                ? "bg-gold/10 border-gold text-gold shadow-[0_0_10px_rgba(212,175,55,0.1)]"
                : "bg-bg-elevated border-border-default text-text-dim hover:border-gold/30 hover:text-text-mid"
            )}
          >
            <span className="font-bold text-sm">WGA</span>
            <span className="text-[9px] uppercase tracking-wider mt-1 opacity-70">Writers</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetTab;
