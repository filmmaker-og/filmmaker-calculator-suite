import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MobileMenu from "@/components/MobileMenu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowRight, TrendingUp, PieChart, BarChart3 } from "lucide-react";
import brandIconF from "@/assets/brand-icon-f.jpg";

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

  const handleAccessClick = () => {
    haptics.medium();
    navigate("/auth");
  };

  const showSplash = splashPhase !== 'complete';

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">

      {/* CINEMATIC SPLASH */}
      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-700 ease-out ${showSplash ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        style={{ backgroundColor: '#000000' }}
      >
        <div
          className={`absolute w-96 h-96 rounded-full transition-all duration-1000 ${splashPhase !== 'black' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className={`absolute w-48 h-48 rounded-full transition-all duration-700 delay-200 ${splashPhase !== 'black' ? 'opacity-100' : 'opacity-0'
            }`}
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, transparent 60%)',
            filter: 'blur(30px)',
          }}
        />

        <h1
          className={`font-bebas text-5xl sm:text-6xl md:text-7xl text-white mb-5 transition-all duration-700 ease-out relative z-10 ${splashPhase !== 'black' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
            }`}
          style={{ textShadow: splashPhase !== 'black' ? '0 0 40px rgba(255,255,255,0.1)' : 'none' }}
        >
          FILMMAKER.OG
        </h1>

        <div
          className={`h-[2px] transition-all ease-out relative ${splashPhase === 'line' || splashPhase === 'complete' ? 'w-52 opacity-100' : 'w-0 opacity-0'
            }`}
          style={{
            backgroundColor: '#D4AF37',
            boxShadow: '0 0 30px rgba(212, 175, 55, 0.7), 0 0 60px rgba(212, 175, 55, 0.3)',
            transitionDuration: splashPhase === 'line' || splashPhase === 'complete' ? '800ms' : '0ms',
          }}
        />

        <p
          className={`text-xs sm:text-sm tracking-[0.35em] uppercase mt-7 transition-all duration-600 relative z-10 ${splashPhase === 'line' || splashPhase === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          style={{ color: '#D4AF37', transitionDelay: '150ms' }}
        >
          STREAMER ACQUISITION MODEL
        </p>
      </div>

      {/* MINIMAL HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-5 h-12 flex items-center justify-between bg-background/80 backdrop-blur-sm transition-all duration-500 ${showSplash ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
          }`}
        style={{ borderBottom: '1px solid hsl(var(--border) / 0.5)' }}
      >
        <div className="flex items-center gap-2">
          <img src={brandIconF} alt="F" className="w-6 h-6 object-contain" />
          <span className="font-bebas text-sm tracking-wide text-muted-foreground">
            FILMMAKER.OG
          </span>
        </div>
        <div className="flex items-center">
          <Link
            to="/store"
            className="hidden sm:block text-[10px] font-mono tracking-widest text-muted-foreground hover:text-gold transition-colors mr-2"
          >
            SERVICES
          </Link>
          <MobileMenu onOpenLegal={() => setShowLegalModal(true)} />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main
        className={`flex-1 flex flex-col items-center justify-center text-center px-6 py-16 relative z-10 transition-all duration-600 ${showSplash ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        style={{ transitionDelay: showSplash ? '0ms' : '150ms' }}
      >
        <div className="max-w-sm w-full space-y-8">

          {/* Value Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">
                Free Institutional Tool
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="font-bebas text-4xl sm:text-5xl text-foreground leading-[0.95]">
              SEE HOW NETFLIX
              <br />
              <span className="text-gold">DEALS PAY OUT</span>
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px] mx-auto">
              Model exactly how streamer acquisition revenue flows to lenders, investors, and producers.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-3 gap-2 py-2">
            <div className="flex flex-col items-center gap-2 p-3 rounded-sm bg-card/50 border border-border/50">
              <BarChart3 size={18} className="text-gold" />
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">Waterfall</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-sm bg-card/50 border border-border/50">
              <TrendingUp size={18} className="text-gold" />
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">ROI Calc</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-sm bg-card/50 border border-border/50">
              <PieChart size={18} className="text-gold" />
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">Splits</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-3">
            <Button
              onClick={handleAccessClick}
              className="w-full h-14 text-base font-black tracking-[0.1em] rounded-sm bg-gold text-primary-foreground hover:bg-gold-highlight transition-all duration-150 touch-press relative overflow-hidden group"
              style={{ boxShadow: '0 8px 32px rgba(212, 175, 55, 0.4)' }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                START MODELING
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            </Button>
            <p className="text-[10px] text-muted-foreground/70">
              No credit card. No account required for demo.
            </p>
          </div>

          {/* What You Get */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4 font-semibold">
              What you'll model
            </p>
            <div className="space-y-2.5 text-left">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] text-gold font-mono">1</span>
                </div>
                <span className="text-xs text-muted-foreground">Your production budget & acquisition price</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] text-gold font-mono">2</span>
                </div>
                <span className="text-xs text-muted-foreground">Capital structure: tax credits, debt, equity</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] text-gold font-mono">3</span>
                </div>
                <span className="text-xs text-muted-foreground">Off-the-top: sales fees, guild residuals</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] text-emerald-400 font-mono">4</span>
                </div>
                <span className="text-xs text-foreground font-medium">Full waterfall visualization & ROI</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className={`py-4 text-center relative z-10 transition-opacity duration-500 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        <button
          onClick={() => setShowLegalModal(true)}
          className="text-[10px] uppercase tracking-widest text-muted-foreground/50 hover:text-muted-foreground transition-colors py-3 px-4 min-h-[44px]"
        >
          Educational Purposes Only
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
