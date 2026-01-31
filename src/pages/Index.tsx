import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [splashPhase, setSplashPhase] = useState<'black' | 'brand' | 'line' | 'complete'>('black');

  const legalText = "Educational disclaimer: For educational purposes only. This calculator is a simplified model and is not legal, tax, accounting, or investment advice. Consult a qualified entertainment attorney.";

  useEffect(() => {
    const timers = [
      setTimeout(() => setSplashPhase('brand'), 400),
      setTimeout(() => setSplashPhase('line'), 1100),
      setTimeout(() => setSplashPhase('complete'), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleStartClick = () => {
    haptics.medium();
    navigate("/calculator");
  };

  const showSplash = splashPhase !== 'complete';

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">

      {/* CINEMATIC SPLASH */}
      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-700 ease-out ${
          showSplash ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: '#000000' }}
      >
        {/* Ambient glow */}
        <div
          className={`absolute w-96 h-96 rounded-full transition-all duration-1000 ${
            splashPhase !== 'black' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className={`absolute w-48 h-48 rounded-full transition-all duration-700 delay-200 ${
            splashPhase !== 'black' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, transparent 60%)',
            filter: 'blur(30px)',
          }}
        />

        <h1
          className={`font-bebas text-5xl sm:text-6xl md:text-7xl text-white mb-5 transition-all duration-700 ease-out relative z-10 ${
            splashPhase !== 'black' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
          }`}
          style={{ textShadow: splashPhase !== 'black' ? '0 0 40px rgba(255,255,255,0.1)' : 'none' }}
        >
          FILMMAKER.OG
        </h1>

        <div
          className={`h-[2px] transition-all ease-out relative ${
            splashPhase === 'line' || splashPhase === 'complete' ? 'w-52 opacity-100' : 'w-0 opacity-0'
          }`}
          style={{
            backgroundColor: '#D4AF37',
            boxShadow: '0 0 30px rgba(212, 175, 55, 0.7), 0 0 60px rgba(212, 175, 55, 0.3)',
            transitionDuration: splashPhase === 'line' || splashPhase === 'complete' ? '800ms' : '0ms',
          }}
        />

        <p
          className={`text-xs sm:text-sm tracking-[0.35em] uppercase mt-7 transition-all duration-600 relative z-10 ${
            splashPhase === 'line' || splashPhase === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
          style={{ color: '#D4AF37', transitionDelay: '150ms' }}
        >
          STREAMER ACQUISITION MODEL
        </p>
      </div>

      {/* MAIN CONTENT - Centered, minimal */}
      <main
        className={`flex-1 flex flex-col items-center justify-center text-center px-8 relative z-10 transition-all duration-600 ${
          showSplash ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
        style={{ transitionDelay: showSplash ? '0ms' : '150ms' }}
      >
        <div className="w-full max-w-xs space-y-12">

          {/* Brand - small, understated */}
          <div className="space-y-1">
            <p className="text-[10px] tracking-[0.4em] text-muted-foreground/60 uppercase">
              Filmmaker.og
            </p>
          </div>

          {/* Main Headline - massive, authoritative */}
          <div className="space-y-6">
            <h1 className="font-bebas text-5xl sm:text-6xl text-foreground leading-[0.9] tracking-wide">
              WATERFALL
              <br />
              <span className="text-gold">CALCULATOR</span>
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Model streamer acquisition deals
              <br />
              like the agencies do.
            </p>
          </div>

          {/* Single CTA */}
          <div className="pt-4">
            <Button
              onClick={handleStartClick}
              className="w-full h-14 text-base font-black tracking-[0.15em] rounded-none bg-gold text-black hover:bg-gold-highlight transition-all duration-150 touch-press group"
              style={{ boxShadow: '0 0 40px rgba(212, 175, 55, 0.3)' }}
            >
              <span className="flex items-center justify-center gap-3">
                START ANALYSIS
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </Button>
          </div>

        </div>
      </main>

      {/* MINIMAL FOOTER */}
      <footer
        className={`py-6 text-center relative z-10 transition-opacity duration-500 ${
          showSplash ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <p className="text-[9px] tracking-[0.2em] text-muted-foreground/40 uppercase mb-4">
          Revenue · Debt · Equity · Splits
        </p>
        <button
          onClick={() => setShowLegalModal(true)}
          className="text-[9px] tracking-widest text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors py-2 px-4"
        >
          Educational purposes only
        </button>
      </footer>

      {/* LEGAL MODAL */}
      <Dialog open={showLegalModal} onOpenChange={setShowLegalModal}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl text-gold tracking-wide">
              LEGAL DISCLAIMER
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {legalText}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
