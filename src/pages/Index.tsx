import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MobileMenu from "@/components/MobileMenu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import brandIconF from "@/assets/brand-icon-f.jpg"; 

const Index = () => {
  const navigate = useNavigate();
  const [showLegalModal, setShowLegalModal] = useState(false);

  const legalText = "Educational disclaimer: For educational purposes only. This calculator is a simplified model and is not legal, tax, accounting, or investment advice. Consult a qualified entertainment attorney.";

  return (
    // THE VOID: Pure Black (Brand Guide #000000)
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
      
      {/* VIGNETTE: Subtle depth, no color pollution */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(30,30,30,0.3) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,1) 100%)'
        }}
      />

      {/* HEADER: Logo Left, Menu Right - with safe area for notched devices */}
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
      
      {/* CONTENT: Absolute Center with fade-in animation */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 relative z-10 animate-page-in">
        
        {/* 1. THE TOTEM (Icon) */}
        <div className="mb-4">
          <img 
            src={brandIconF} 
            alt="Filmmaker.OG" 
            className="w-24 h-24 md:w-32 md:h-32 object-contain"
          />
        </div>
        
        {/* 2. THE BRAND (Logotype) */}
        <h1 className="font-bebas text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-none mb-8">
          FILMMAKER.OG
        </h1>

        {/* 3. THE UTILITY (Brand Gold #D4AF37) */}
        <p 
          className="text-xs md:text-sm tracking-[0.3em] uppercase mb-16"
          style={{ color: '#D4AF37' }}
        >
          STREAMER ACQUISITION CALCULATOR
        </p>
        
        {/* 4. THE ACTION (Solid, Confident) */}
        <div className="w-full max-w-xs space-y-4">
          {/* Primary: Base #D4AF37 -> Hover #F9E076 (Bright Gold) */}
          <Button 
            onClick={() => navigate("/auth")}
            className="w-full h-14 text-sm font-black tracking-[0.2em] rounded-sm bg-[#D4AF37] text-black hover:bg-[#F9E076] transition-colors duration-300 border border-[#D4AF37]"
          >
            ACCESS CALCULATOR
          </Button>
          
        </div>
      </div>
      
      {/* FOOTER: Improved touch target for legal link */}
      <footer className="py-4 text-center relative z-10">
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
