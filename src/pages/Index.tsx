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
  const [splashPhase, setSplashPhase] = useState<'black' | 'line' | 'brand' | 'complete'>('black');

  const legalText = "Educational disclaimer: For educational purposes only. This calculator is a simplified model and is not legal, tax, accounting, or investment advice. Consult a qualified entertainment attorney.";

  useEffect(() => {
    // Clean 4-phase sequence - MASSIVE, deliberate, confident timing
    const timers = [
      setTimeout(() => setSplashPhase('line'), 400),
      setTimeout(() => setSplashPhase('brand'), 1200),
      setTimeout(() => setSplashPhase('complete'), 2400), // Slightly longer to let it breathe
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
      
      {/* CINEMATIC SPLASH OVERLAY - MASSIVE, Authority-First */}
      <div 
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-700 ${
          showSplash ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: '#000000' }}
      >
        {/* Ambient Glow Behind Brand */}
        <div 
          className={`absolute w-80 h-80 rounded-full transition-opacity duration-1000 ${
            splashPhase === 'brand' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        
        {/* Single gold line - BIGGER, expands from center */}
        <div 
          className={`h-[2px] transition-all ease-out ${
            splashPhase !== 'black' ? 'splash-line-expand opacity-100' : 'w-0 opacity-0'
          }`}
          style={{ 
            backgroundColor: '#D4AF37',
            boxShadow: '0 0 30px rgba(212, 175, 55, 0.8), 0 0 60px rgba(212, 175, 55, 0.4)'
          }}
        />
        
        {/* Brand Name - MASSIVE, fades in as a unit */}
        <h1 
          className={`font-bebas text-6xl sm:text-7xl md:text-8xl tracking-[0.3em] text-white mt-8 mb-4 transition-all duration-600 relative z-10 ${
            splashPhase === 'brand' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          FILMMAKER.OG
        </h1>
        
        {/* Tagline - Larger, premium tracking */}
        <p 
          className={`text-sm sm:text-base tracking-[0.5em] uppercase transition-all duration-500 delay-200 relative z-10 ${
            splashPhase === 'brand' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ color: '#D4AF37' }}
        >
          STREAMER ACQUISITION MODEL
        </p>
      </div>

      {/* HEADER */}
      <header 
        className={`relative z-50 px-6 py-4 flex items-center justify-between safe-top transition-opacity duration-500 ${
          showSplash ? 'opacity-0' : 'opacity-100'
        }`} 
        style={{ borderBottom: '1px solid #D4AF37' }}
      >
        <div className="flex items-center gap-3">
          <img 
            src={brandIconF} 
            alt="F" 
            className="w-8 h-8 object-contain"
          />
          <span className="font-bebas text-lg tracking-widest text-gold">
            FILMMAKER.OG
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/store" 
            className="hidden sm:block text-xs font-mono tracking-widest text-gold hover:text-gold-highlight transition-colors"
          >
            SERVICES
          </Link>
          <MobileMenu onOpenLegal={() => setShowLegalModal(true)} />
        </div>
      </header>
      
      {/* MAIN CONTENT - Scales down from splash intentionally */}
      <main 
        className={`flex-1 flex flex-col items-center justify-center text-center px-6 py-8 relative z-10 transition-all duration-700 ${
          showSplash ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        
        {/* Hero Section */}
        <div className="max-w-md w-full space-y-6">
          
          {/* Brand Icon - Prominent but not competing with splash */}
          <div className="flex justify-center">
            <img 
              src={brandIconF} 
              alt="Filmmaker.OG" 
              className="w-24 h-24 md:w-28 md:h-28 object-contain"
            />
          </div>

          {/* Gold Divider - Echoes the splash */}
          <div className="flex justify-center">
            <div className="w-12 h-[2px] bg-gold" style={{ boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)' }} />
          </div>
          
          {/* Title Block - Slightly smaller than splash */}
          <div className="space-y-2">
            <h1 className="font-bebas text-4xl md:text-5xl text-foreground tracking-wide leading-none">
              FILMMAKER.OG
            </h1>
            <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-gold">
              STREAMER ACQUISITION CALCULATOR
            </p>
          </div>
          
          {/* Value Proposition */}
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
            The industry-standard waterfall calculator for streamer acquisitions.
          </p>
          
          {/* CTA Button */}
          <div className="pt-2">
            <Button 
              onClick={handleAccessClick}
              className="w-full max-w-xs h-14 text-sm font-black tracking-[0.2em] rounded-sm bg-gold text-primary-foreground hover:bg-gold-highlight transition-all duration-150 border-0 touch-press"
              style={{
                boxShadow: '0 4px 24px rgba(212, 175, 55, 0.35)'
              }}
            >
              ACCESS CALCULATOR
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">Free to Use</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <span className="text-xs text-muted-foreground">No Card Required</span>
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
            <DialogTitle className="font-bebas text-2xl text-gold tracking-wider">
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
