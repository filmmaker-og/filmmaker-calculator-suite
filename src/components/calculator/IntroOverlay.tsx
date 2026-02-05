import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface IntroOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const IntroOverlay = ({ isOpen, onClose }: IntroOverlayProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#0A0A0A] border border-gold/20 max-w-md p-0 overflow-hidden">
        {/* Header Image/Gradient */}
        <div className="h-32 bg-gradient-to-b from-gold/10 to-transparent relative flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_70%)]" />
          <div className="relative z-10 text-center">
            <h2 className="font-bebas text-4xl tracking-[0.08em] text-white">
              WELCOME <span className="text-gold">PRODUCER</span>
            </h2>
          </div>
        </div>

        <div className="px-6 pb-8">
          <div className="space-y-6">
            <p className="text-white/70 text-sm leading-relaxed text-center">
              This tool simulates a professional film financing waterfall. You'll input your numbers step-by-step to see how money flows from revenue to net profits.
            </p>

            <div className="space-y-4">
              {[
                { title: "Build Your Stack", desc: "Define budget, debt, and equity." },
                { title: "Set The Deal", desc: "Input streamer acquisition numbers." },
                { title: "See The Waterfall", desc: "Watch how every dollar is split." }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="mt-1">
                    <CheckCircle2 className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm tracking-wide">{item.title}</h3>
                    <p className="text-white/50 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              onClick={onClose}
              className="w-full bg-gold hover:bg-gold/90 text-black font-bold tracking-wider h-12"
            >
              START CALCULATION <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IntroOverlay;
