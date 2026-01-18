import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MobileMenu from "@/components/MobileMenu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import brandIconF from "@/assets/brand-icon-f.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [showLegalModal, setShowLegalModal] = useState(false);

  const legalText = "Educational disclaimer: For educational purposes only. This calculator is a simplified model and is not legal, tax, accounting, or investment advice. This assumes a bankable sales agent and commercially viable cast. Deal outcomes vary by contract definitions (e.g., gross vs adjusted gross), corridor fees, reserves/holdbacks, timing of cashflows, collection account management, audit results, chargebacks, and other negotiated terms. Consult a qualified entertainment attorney and financial advisor.";

  return (
    // THE VOID: Hardcoded black background with radial spotlight
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
      
      {/* VIGNETTE: Subtle center spotlight */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(38,38,38,0.4) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%)'
        }}
      />

      {/* Floating Menu */}
      <div className="relative z-50">
        <MobileMenu onOpenLegal={() => setShowLegalModal(true)} />
      </div>
      
      {/* Main Content - Centered Stack */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 relative z-10">
        
        {/* MASTHEAD: Centered Stack - Icon on top, Text below */}
        <div className="flex flex-col items-center justify-center mb-8">
          {/* Brand Icon (F) */}
          <img 
            src={brandIconF} 
            alt="Filmmaker.OG Brand Icon" 
            className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain mb-4"
          />
          
          {/* Brand Text */}
          <h1 className="font-bebas text-7xl md:text-8xl lg:text-[10rem] text-white tracking-tighter leading-none">
            FILMMAKER.OG
          </h1>
        </div>
        
        {/* THE HERO */}
        <div className="mb-12">
          {/* Label - Single Line */}
          <p 
            className="text-[10px] md:text-xs tracking-[0.3em] uppercase mb-6 whitespace-nowrap"
            style={{ color: '#D4AF37' }}
          >
            STREAMER ACQUISITION CALCULATOR
          </p>
          
          {/* Headline - Multiple Lines */}
          <h2 className="font-bebas text-3xl md:text-4xl lg:text-5xl text-white leading-tight max-w-[280px] md:max-w-xs mx-auto">
            DEMOCRATIZING THE BUSINESS OF FILM
          </h2>
        </div>
        
        {/* ACTION STACK */}
        <div className="w-full max-w-xs space-y-4">
          {/* Primary Button - Gold with Highlight Glow */}
          <Button 
            onClick={() => navigate("/auth")}
            className="w-full h-14 text-lg font-black tracking-widest rounded-sm transition-all duration-300 border animate-pulse-gold"
            style={{ 
              backgroundColor: '#D4AF37', 
              color: '#000000',
              borderColor: '#D4AF37',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F9E076';
              e.currentTarget.style.borderColor = '#F9E076';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#D4AF37';
              e.currentTarget.style.borderColor = '#D4AF37';
            }}
          >
            ACCESS TERMINAL
          </Button>
          
          {/* Secondary Button - Ghost */}
          <Link to="/store" className="block">
            <Button 
              variant="ghost"
              className="w-full h-12 text-sm tracking-widest text-white hover:text-white hover:bg-transparent transition-colors border border-transparent hover:border-zinc-700"
            >
              SKIP TO SERVICES
            </Button>
          </Link>
        </div>
      </div>
      
      {/* FOOTER: Minimal Link */}
      <footer className="py-8 text-center relative z-10">
        <button
          onClick={() => setShowLegalModal(true)}
          className="text-[10px] uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
        >
          For educational/information purposes only.
        </button>
      </footer>

      {/* LEGAL MODAL */}
      <Dialog open={showLegalModal} onOpenChange={setShowLegalModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
          <DialogHeader>
            <DialogTitle 
              className="font-bebas text-2xl tracking-wider"
              style={{ color: '#D4AF37' }}
            >
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
