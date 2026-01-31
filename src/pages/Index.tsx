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
    // FIXED SEQUENCE: Brand first, then line underneath - faster 1.6s total
    const timers = [
      setTimeout(() => setSplashPhase('brand'), 300),    // Brand fades in first
      setTimeout(() => setSplashPhase('line'), 800),     // Line draws under brand
      setTimeout(() => setSplashPhase('complete'), 1600), // Transition out
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
      
      {/* CINEMATIC SPLASH - Brand first, line after */}
      <div 
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ${
          showSplash ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: '#000000' }}
      >
        {/* Ambient Glow - Sharp, intentional */}
        <div 
          className={`absolute w-64 h-64 rounded-full transition-opacity duration-700 ${
            splashPhase !== 'black' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 60%)',
            filter: 'blur(40px)',
          }}
        />
        
        {/* Brand Name - Fades in FIRST, NO letter-spacing (readable!) */}
        <h1 
          className={`font-bebas text-5xl sm:text-6xl md:text-7xl text-white mb-4 transition-all duration-500 relative z-10 ${
            splashPhase !== 'black' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          FILMMAKER.OG
        </h1>
        
        {/* Gold Line - Draws SECOND, underneath brand */}
        <div 
          className={`h-[2px] transition-all duration-700 ease-out ${
            splashPhase === 'line' || splashPhase === 'complete' ? 'w-48 opacity-100' : 'w-0 opacity-0'
          }`}
          style={{ 
            backgroundColor: '#D4AF37',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)'
          }}
        />
        
        {/* Tagline - Fades in with line */}
        <p 
          className={`text-sm tracking-[0.3em] uppercase mt-6 transition-all duration-500 delay-100 relative z-10 ${
            splashPhase === 'line' || splashPhase === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
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
        style={{ borderBottom: '1px solid hsl(var(--border))' }}
      >
        <div className="flex items-center gap-3">
          <img 
            src={brandIconF} 
            alt="F" 
            className="w-8 h-8 object-contain"
          />
          <span className="font-bebas text-lg tracking-wide text-foreground">
            FILMMAKER.OG
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/store" 
            className="hidden sm:block text-xs font-mono tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            SERVICES
          </Link>
          <MobileMenu onOpenLegal={() => setShowLegalModal(true)} />
        </div>
      </header>
      
      {/* MAIN CONTENT */}
      <main 
        className={`flex-1 flex flex-col items-center justify-center text-center px-6 py-8 relative z-10 transition-all duration-500 ${
          showSplash ? 'opacity-0' : 'opacity-100'
        }`}
      >
        
        <div className="max-w-md w-full space-y-8">
          
          {/* Brand Icon */}
          <div className="flex justify-center">
            <img 
              src={brandIconF} 
              alt="Filmmaker.OG" 
              className="w-20 h-20 object-contain"
            />
          </div>
          
          {/* Title Block */}
          <div className="space-y-3">
            <h1 className="font-bebas text-4xl md:text-5xl text-foreground leading-none">
              FILMMAKER.OG
            </h1>
            <p className="text-xs tracking-[0.2em] uppercase text-gold">
              STREAMER ACQUISITION CALCULATOR
            </p>
          </div>
          
          {/* Value Prop */}
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
            The industry-standard waterfall calculator for streamer acquisitions.
          </p>
          
          {/* CTA Button */}
          <Button 
            onClick={handleAccessClick}
            className="w-full max-w-xs h-14 text-sm font-black tracking-[0.15em] rounded-sm bg-gold text-primary-foreground hover:bg-gold-highlight transition-all duration-150 touch-press mx-auto"
            style={{ boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)' }}
          >
            ACCESS CALCULATOR
          </Button>
          
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
