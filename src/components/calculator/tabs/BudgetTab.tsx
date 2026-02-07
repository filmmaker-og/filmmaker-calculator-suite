import { WaterfallInputs, GuildState } from "@/lib/waterfall";
import { useState } from "react";
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

      {/* 2. Guild Toggles - Refined "Matte" Style */}
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
              "group relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200",
              guilds.sag
                ? "bg-bg-elevated border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]" // Active: Gold border + Glow, but dark bg
                : "bg-bg-elevated border-border-default hover:border-border-active"   // Inactive: Standard matte
            )}
          >
            {guilds.sag && (
              <div className="absolute top-2 right-2">
                <Check className="w-3 h-3 text-gold" />
              </div>
            )}
            <span className={cn("font-bold text-sm", guilds.sag ? "text-gold" : "text-text-dim group-hover:text-text-mid")}>
              SAG
            </span>
            <span className="text-[9px] uppercase tracking-wider mt-1 opacity-60 text-text-dim">
              Actors
            </span>
          </button>

          {/* DGA */}
          <button
            onClick={() => onToggleGuild('dga')}
            className={cn(
              "group relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200",
              guilds.dga
                ? "bg-bg-elevated border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                : "bg-bg-elevated border-border-default hover:border-border-active"
            )}
          >
            {guilds.dga && (
               <div className="absolute top-2 right-2">
                <Check className="w-3 h-3 text-gold" />
              </div>
            )}
            <span className={cn("font-bold text-sm", guilds.dga ? "text-gold" : "text-text-dim group-hover:text-text-mid")}>
              DGA
            </span>
            <span className="text-[9px] uppercase tracking-wider mt-1 opacity-60 text-text-dim">
              Directors
            </span>
          </button>

          {/* WGA */}
          <button
            onClick={() => onToggleGuild('wga')}
            className={cn(
              "group relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200",
              guilds.wga
                ? "bg-bg-elevated border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                : "bg-bg-elevated border-border-default hover:border-border-active"
            )}
          >
             {guilds.wga && (
               <div className="absolute top-2 right-2">
                <Check className="w-3 h-3 text-gold" />
              </div>
            )}
            <span className={cn("font-bold text-sm", guilds.wga ? "text-gold" : "text-text-dim group-hover:text-text-mid")}>
              WGA
            </span>
            <span className="text-[9px] uppercase tracking-wider mt-1 opacity-60 text-text-dim">
              Writers
            </span>
          </button>
        </div>
        
        {/* SVOD Sub-note */}
        <p className="text-[10px] leading-snug text-text-dim/80 uppercase tracking-wider">
          SVOD acquisition deals: most indie filmmakers are not guild signatories. Stress-test by unchecking guilds to see how much your break-even moves.
        </p>
      </div>
    </div>
  );
};

export default BudgetTab;
