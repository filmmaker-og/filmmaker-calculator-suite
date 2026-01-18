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
          background: 'radial-gradient(ellipse at center, rgba(30,30,30,0.4) 0%, rgba(0,0,0,0) 70%)'
        }}
      />

      {/* Floating Menu */}
      <div className="relative z-50">
        <MobileMenu onOpenLegal={() => setShowLegalModal(true)} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 relative z-10">
        
        {/* MASTHEAD: Logo + Text */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-8">
          {/* Brand Icon (Styled F) */}
          <div className="w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-sm border-2 border-gold shadow-[0_0_20px_rgba(212,175,55,0.3)] flex-shrink-0 flex items-center justify-center bg-black">
            <span className="font-bebas text-gold text-4xl md:text-5xl lg:text-6xl">F</span>
          </div>
          
          <h1 className="font-bebas text-6xl md:text-8xl lg:text-[10rem] text-white tracking-tighter leading-none">
            FILMMAKER.OG
          </h1>
        </div>
        
        {/* THE TOOL */}
        <p className="text-gold text-xs md:text-sm tracking-[0.3em] uppercase mb-6">
          STREAMER ACQUISITION CALCULATOR
        </p>
        
        {/* THE MISSION */}
        <h2 className="font-black text-xl md:text-2xl lg:text-3xl text-white leading-tight max-w-2xl mb-16">
          DEMOCRATIZING THE BUSINESS OF FILM
        </h2>
        
        {/* ACTION STACK */}
        <div className="w-full max-w-xs space-y-4">
          {/* Primary Button - Gold Pulse */}
          <Button 
            onClick={() => navigate("/auth")}
            className="w-full h-14 text-lg font-black tracking-widest rounded-sm bg-gold text-black hover:bg-white hover:text-black transition-all duration-300 border border-gold shadow-[0_0_20px_rgba(212,175,55,0.4)] animate-pulse-gold"
          >
            ACCESS TERMINAL
          </Button>
          
          {/* Secondary Button */}
          <Link to="/store" className="block">
            <Button 
              variant="ghost"
              className="w-full h-12 text-sm tracking-widest text-zinc-400 hover:text-white hover:bg-transparent transition-colors"
            >
              Skip to Services
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
          Educational Purposes Only
        </button>
      </footer>

      {/* LEGAL MODAL */}
      <Dialog open={showLegalModal} onOpenChange={setShowLegalModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
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
