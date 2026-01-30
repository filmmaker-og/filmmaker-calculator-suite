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
    // Clean 4-phase sequence - deliberate, confident timing
    const timers = [
      setTimeout(() => setSplashPhase('line'), 400),
      setTimeout(() => setSplashPhase('brand'), 1200),
      setTimeout(() => setSplashPhase('complete'), 2200),
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
      
      {/* CINEMATIC SPLASH OVERLAY - Clean, authority-first */}
      <div 
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-700 ${
          showSplash ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: '#000000' }}
      >
        {/* Single gold line - expands from center */}
        <div 
          className={`h-[1px] transition-all ease-out ${
            splashPhase !== 'black' ? 'line-expand opacity-100' : 'w-0 opacity-0'
          }`}
          style={{ 
            backgroundColor: '#D4AF37',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)'
          }}
        />
        
        {/* Brand Name - fades in as a unit */}
        <h1 
          className={`font-bebas text-4xl sm:text-5xl tracking-[0.3em] text-white mt-6 mb-3 transition-all duration-500 ${
            splashPhase === 'brand' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          FILMMAKER.OG
        </h1>
        
        {/* Tagline - slides up with delay */}
        <p 
          className={`text-xs sm:text-sm tracking-[0.4em] uppercase transition-all duration-500 delay-200 ${
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
      
      {/* MAIN CONTENT */}
      <main 
        className={`flex-1 flex flex-col items-center justify-center text-center px-6 py-8 relative z-10 transition-all duration-700 ${
          showSplash ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        
        {/* Hero Section */}
        <div className="max-w-md w-full space-y-8">
          
          {/* Brand Icon - Large and centered, no glow */}
          <div className="flex justify-center">
            <img 
              src={brandIconF} 
              alt="Filmmaker.OG" 
              className="w-32 h-32 md:w-40 md:h-40 object-contain"
            />
          </div>
          
          {/* Title Block */}
          <div className="space-y-3">
            <h1 className="font-bebas text-5xl md:text-6xl lg:text-7xl text-foreground tracking-tight leading-none">
              FILMMAKER.OG
            </h1>
            <p className="text-sm md:text-base tracking-[0.25em] uppercase text-gold">
              STREAMER ACQUISITION CALCULATOR
            </p>
          </div>
          
          {/* Value Proposition - Authority-focused */}
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            The industry-standard waterfall calculator for streamer acquisitions.
          </p>
          
          {/* CTA Button */}
          <div className="pt-4">
            <Button 
              onClick={handleAccessClick}
              className="w-full max-w-xs h-14 text-sm font-black tracking-[0.2em] rounded-sm bg-gold text-primary-foreground hover:bg-gold-highlight transition-all duration-300 border-0 touch-press shadow-lg"
              style={{
                boxShadow: '0 4px 24px rgba(212, 175, 55, 0.3)'
              }}
            >
              ACCESS CALCULATOR
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-6 pt-4">
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
