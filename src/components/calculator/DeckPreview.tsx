import { Lock, FileText, TrendingUp, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeckPreviewProps {
  onUnlock: () => void;
  producerShare: number;
  investorReturn: number;
  multiple: number;
}

const DeckPreview = ({ onUnlock, producerShare, investorReturn, multiple }: DeckPreviewProps) => {
  return (
    <div className="relative rounded-sm overflow-hidden border border-gold/30">
      {/* Premium header bar */}
      <div className="h-1 w-full bg-gradient-to-r from-gold via-gold-highlight to-gold" />

      {/* Blurred preview content */}
      <div className="relative bg-card p-5">
        {/* Blur overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-background/60 z-10 flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center mb-4 border border-gold/40">
            <Lock className="w-6 h-6 text-gold" />
          </div>
          <h3 className="font-bebas text-xl text-foreground tracking-wider mb-2">
            INVESTOR DECK READY
          </h3>
          <p className="text-xs text-muted-foreground text-center max-w-[200px] mb-5">
            Your personalized waterfall deck is generated
          </p>
          <Button
            onClick={onUnlock}
            className="btn-vault px-8 py-4 min-h-[48px] font-bebas tracking-wider relative overflow-hidden group"
          >
            <span className="relative z-10">UNLOCK FULL DECK</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
          </Button>
        </div>

        {/* Fake deck slides - visible but blurred */}
        <div className="space-y-3 opacity-50 select-none pointer-events-none">
          {/* Slide 1: Deal Summary */}
          <div className="bg-muted/30 rounded-sm p-4 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-gold" />
              <span className="text-xs font-bebas tracking-wider text-gold">DEAL SUMMARY</span>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
          </div>

          {/* Slide 2: Waterfall Structure */}
          <div className="bg-muted/30 rounded-sm p-4 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-gold" />
              <span className="text-xs font-bebas tracking-wider text-gold">WATERFALL STRUCTURE</span>
            </div>
            <div className="flex gap-1 h-8">
              <div className="flex-[3] bg-zinc-700 rounded-sm" />
              <div className="flex-[2] bg-red-900/50 rounded-sm" />
              <div className="flex-[2] bg-blue-900/50 rounded-sm" />
              <div className="flex-[1] bg-emerald-600/50 rounded-sm" />
            </div>
          </div>

          {/* Slide 3: Returns Analysis */}
          <div className="bg-muted/30 rounded-sm p-4 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <PieChart className="w-4 h-4 text-gold" />
              <span className="text-xs font-bebas tracking-wider text-gold">RETURNS ANALYSIS</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="h-8 w-8 mx-auto rounded-full bg-emerald-600/30 mb-1" />
                <div className="h-2 bg-muted rounded w-12 mx-auto" />
              </div>
              <div className="text-center">
                <div className="h-8 w-8 mx-auto rounded-full bg-blue-600/30 mb-1" />
                <div className="h-2 bg-muted rounded w-12 mx-auto" />
              </div>
              <div className="text-center">
                <div className="h-8 w-8 mx-auto rounded-full bg-gold/30 mb-1" />
                <div className="h-2 bg-muted rounded w-12 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="bg-card px-4 py-3 border-t border-border flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          3 Slides • Investor Ready
        </span>
        <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">
          Premium
        </span>
      </div>
    </div>
  );
};

export default DeckPreview;
