import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MobileMenu from "@/components/MobileMenu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useHaptics } from "@/hooks/use-haptics";
import brandIconF from "@/assets/brand-icon-f.jpg"; 

const Index = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [splashPhase, setSplashPhase] = useState<'black' | 'brand' | 'line' | 'complete'>('black');

  const legalText = "Educational disclaimer: For educational purposes only. This calculator is a simplified model and is not legal, tax, accounting, or investment advice. Consult a qualified entertainment attorney.";

  useEffect(() => {
    // Premium cinematic sequence: 2s total for impact
    const timers = [
      setTimeout(() => setSplashPhase('brand'), 400),     // Brand fades in with gravitas
      setTimeout(() => setSplashPhase('line'), 1100),     // Line draws with precision
      setTimeout(() => setSplashPhase('complete'), 2000), // Hold for impact, then reveal
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
      
      {/* CINEMATIC SPLASH - Premium opening sequence */}
      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-700 ease-out ${
          showSplash ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: '#000000' }}
      >
        {/* Layered Ambient Glow - More depth */}
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

        {/* Brand Name - Cinematic entrance */}
        <h1
          className={`font-bebas text-5xl sm:text-6xl md:text-7xl text-white mb-5 transition-all duration-700 ease-out relative z-10 ${
            splashPhase !== 'black' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
          }`}
          style={{ textShadow: splashPhase !== 'black' ? '0 0 40px rgba(255,255,255,0.1)' : 'none' }}
        >
          FILMMAKER.OG
        </h1>

        {/* Gold Line - Precision draw animation */}
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

        {/* Tagline - Elegant reveal */}
        <p
          className={`text-xs sm:text-sm tracking-[0.35em] uppercase mt-7 transition-all duration-600 relative z-10 ${
            splashPhase === 'line' || splashPhase === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
          style={{
            color: '#D4AF37',
            transitionDelay: '150ms'
          }}
        >
          STREAMER ACQUISITION MODEL
        </p>
      </div>

      {/* HEADER */}
      <header
        className={`relative z-50 px-6 h-14 flex items-center justify-between safe-top transition-all duration-500 ${
          showSplash ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
        }`}
        style={{
          borderBottom: '1px solid hsl(var(--border))',
          transitionDelay: showSplash ? '0ms' : '200ms'
        }}
      >
        <div className="flex items-center gap-3">
          <img
            src={brandIconF}
            alt="F"
            className="w-7 h-7 object-contain"
          />
          <span className="font-bebas text-base tracking-wide text-foreground">
            FILMMAKER.OG
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/store"
            className="hidden sm:block text-xs font-mono tracking-widest text-muted-foreground hover:text-gold transition-colors"
          >
            SERVICES
          </Link>
          <MobileMenu onOpenLegal={() => setShowLegalModal(true)} />
        </div>
      </header>
      
      {/* MAIN CONTENT */}
      <main
        className={`flex-1 flex flex-col items-center justify-center text-center px-6 py-8 relative z-10 transition-all duration-600 ${
          showSplash ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
        style={{ transitionDelay: showSplash ? '0ms' : '100ms' }}
      >

        <div className="max-w-md w-full space-y-6">

          {/* Brand Icon with subtle glow */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl scale-150 opacity-50" />
              <img
                src={brandIconF}
                alt="Filmmaker.OG"
                className="w-20 h-20 object-contain relative z-10"
              />
            </div>
          </div>

          {/* Title Block */}
          <div className="space-y-3">
            <h1 className="font-bebas text-4xl md:text-5xl text-foreground leading-none">
              FILMMAKER.OG
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-[1px] bg-gold/40" />
              <p className="text-xs tracking-[0.2em] uppercase text-gold font-medium">
                STREAMER ACQUISITION CALCULATOR
              </p>
              <div className="w-8 h-[1px] bg-gold/40" />
            </div>
          </div>

          {/* Value Prop - Clearer for first-time users */}
          <div className="space-y-2 max-w-xs mx-auto">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Model your film's financial waterfall for Netflix, Amazon, and Apple acquisitions.
            </p>
            <p className="text-muted-foreground/70 text-xs">
              See exactly how revenue flows to debt holders, investors, and producers.
            </p>
          </div>

          {/* CTA Button - More prominent */}
          <div className="pt-2">
            <Button
              onClick={handleAccessClick}
              className="w-full max-w-xs h-14 text-sm font-black tracking-[0.15em] rounded-sm bg-gold text-primary-foreground hover:bg-gold-highlight transition-all duration-150 touch-press mx-auto relative overflow-hidden group"
              style={{ boxShadow: '0 4px 24px rgba(212, 175, 55, 0.35)' }}
            >
              <span className="relative z-10">START MODELING</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
          </div>

          {/* Trust Indicators - More premium */}
          <div className="flex items-center justify-center gap-8 pt-4">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-xs text-muted-foreground font-medium">Free to Use</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
              <span className="text-xs text-muted-foreground font-medium">No Card Required</span>
            </div>
          </div>
        </div>
      </main>
      
      {/* FOOTER */}
      <footer className={`py-4 text-center relative z-10 transition-opacity duration-500 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        <button
          onClick={() => setShowLegalModal(true)}
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors py-3 px-4 min-h-[44px]"
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
