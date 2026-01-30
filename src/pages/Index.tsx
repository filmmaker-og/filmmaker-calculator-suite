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
  const [introComplete, setIntroComplete] = useState(false);

  const legalText = "Educational disclaimer: For educational purposes only. This calculator is a simplified model and is not legal, tax, accounting, or investment advice. Consult a qualified entertainment attorney.";

  useEffect(() => {
    // Intro animation sequence
    const timer = setTimeout(() => {
      setIntroComplete(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleAccessClick = () => {
    haptics.medium();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
      
      {/* INTRO ANIMATION OVERLAY */}
      <div 
        className={`fixed inset-0 z-[100] pointer-events-none flex items-center justify-center transition-opacity duration-700 ${introComplete ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundColor: '#000000' }}
      >
        {/* Gold line reveal */}
        <div className="relative">
          <div 
            className="h-[2px] bg-gold animate-intro-line"
            style={{ 
              width: introComplete ? '200px' : '0px',
              transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)'
            }}
          />
        </div>
      </div>

      {/* Pure black background - no vignette haze */}

      {/* HEADER */}
      <header className="relative z-50 px-6 py-4 flex items-center justify-between safe-top" style={{ borderBottom: '1px solid #D4AF37' }}>
        <span className="font-bebas text-xl tracking-widest" style={{ color: '#D4AF37' }}>
          FILMMAKER.OG
        </span>
        <div className="flex items-center">
          <Link 
            to="/store" 
            className="hidden sm:block text-xs font-mono tracking-widest mr-4 hover:opacity-80 transition-opacity"
            style={{ color: '#D4AF37' }}
          >
            SERVICES
          </Link>
          <MobileMenu onOpenLegal={() => setShowLegalModal(true)} />
        </div>
      </header>
      
      {/* CONTENT: Moved up with less bottom padding */}
      <div 
        className={`flex-1 flex flex-col items-center justify-center text-center px-6 py-6 relative z-10 transition-all duration-700 ${introComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ marginTop: '-4rem' }}
      >
        
        {/* 1. THE TOTEM (Icon) - Larger, no border, matching Auth page style */}
        <div 
          className={`mb-4 transition-all duration-500 delay-100 ${introComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          <img 
            src={brandIconF} 
            alt="Filmmaker.OG" 
            className="w-28 h-28 md:w-36 md:h-36 object-contain"
          />
        </div>
        
        {/* 2. THE BRAND (Logotype) - staggered */}
        <h1 
          className={`font-bebas text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-none mb-4 transition-all duration-500 delay-200 ${introComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        >
          FILMMAKER.OG
        </h1>

        {/* 3. THE UTILITY - staggered */}
        <p 
          className={`text-xs md:text-sm tracking-[0.3em] uppercase mb-10 transition-all duration-500 delay-300 ${introComplete ? 'opacity-100' : 'opacity-0'}`}
          style={{ color: '#D4AF37' }}
        >
          STREAMER ACQUISITION CALCULATOR
        </p>
        
        {/* 4. THE ACTION - staggered */}
        <div 
          className={`w-full max-w-xs space-y-4 transition-all duration-500 delay-500 ${introComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <Button 
            onClick={handleAccessClick}
            className="w-full h-14 text-sm font-black tracking-[0.2em] rounded-sm bg-[#D4AF37] text-black hover:bg-[#F9E076] transition-colors duration-300 border border-[#D4AF37] touch-press"
          >
            ACCESS CALCULATOR
          </Button>
        </div>
      </div>
      
      {/* FOOTER */}
      <footer className="py-3 text-center relative z-10">
        <button
          onClick={() => setShowLegalModal(true)}
          className="text-xs uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors py-3 px-4 min-h-[44px]"
        >
          Educational Purposes Only
        </button>
      </footer>

      {/* LEGAL MODAL */}
      <Dialog open={showLegalModal} onOpenChange={setShowLegalModal}>
        <DialogContent className="bg-surface border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl text-gold tracking-wider">
              LEGAL DISCLAIMER
            </DialogTitle>
          </DialogHeader>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {legalText}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
