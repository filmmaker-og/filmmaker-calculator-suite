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
import filmmakerLogo from "@/assets/filmmaker-logo.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [showLegalModal, setShowLegalModal] = useState(false);

  const legalText = "Educational disclaimer: For educational purposes only. This calculator is a simplified model and is not legal, tax, accounting, or investment advice. This assumes a bankable sales agent and commercially viable cast. Deal outcomes vary by contract definitions (e.g., gross vs adjusted gross), corridor fees, reserves/holdbacks, timing of cashflows, collection account management, audit results, chargebacks, and other negotiated terms. Consult a qualified entertainment attorney and financial advisor.";

  return (
    <div className="min-h-screen flex flex-col bg-background px-6">
      {/* Floating Menu */}
      <MobileMenu onOpenLegal={() => setShowLegalModal(true)} />
      
      {/* Main Content - Magazine Cover Layout */}
      <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
        
        {/* Element 1: Main Header - Logo + Masthead Inline */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-8">
          {/* Brand Icon */}
          <div className="w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-sm overflow-hidden border-2 border-gold shadow-[0_0_20px_rgba(212,175,55,0.3)] flex-shrink-0">
            <img 
              src={filmmakerLogo} 
              alt="Filmmaker.OG" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* The Masthead */}
          <h1 className="font-bebas text-6xl md:text-8xl lg:text-[10rem] text-foreground tracking-tighter leading-none">
            FILMMAKER.OG
          </h1>
        </div>
        
        {/* Element 2: The Tool */}
        <p className="text-gold text-xs md:text-sm tracking-[0.3em] uppercase mb-6">
          STREAMER ACQUISITION CALCULATOR
        </p>
        
        {/* Element 3: The Mission / Hero */}
        <h2 className="font-inter-black text-xl md:text-2xl lg:text-3xl text-foreground leading-tight max-w-2xl mb-16">
          DEMOCRATIZING THE BUSINESS OF FILM
        </h2>
        
        {/* Element 4: Action Stack */}
        <div className="w-full max-w-xs space-y-4">
          {/* Primary Button - Slow Pulsing */}
          <Button 
            onClick={() => navigate("/auth")}
            className="w-full py-6 text-base font-inter-black tracking-widest rounded-none bg-gold text-background hover:bg-gold/90 shadow-[0_0_30px_rgba(212,175,55,0.4)] animate-[pulse_3s_ease-in-out_infinite] hover:animate-none transition-all duration-300 border-2 border-gold"
          >
            ACCESS TERMINAL
          </Button>
          
          {/* Secondary Button */}
          <Link to="/store" className="block">
            <Button 
              variant="outline"
              className="w-full py-6 text-base font-inter-black tracking-widest rounded-none border border-gold/60 text-gold bg-transparent hover:bg-gold/10 transition-all duration-300"
            >
              SKIP TO SERVICES
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Element 6: Minimal Legal Footer */}
      <footer className="py-8 text-center">
        <button
          onClick={() => setShowLegalModal(true)}
          className="text-xs text-muted-foreground/60 underline underline-offset-2 hover:text-muted-foreground transition-colors cursor-pointer"
        >
          For educational/information purposes only.
        </button>
      </footer>

      {/* Legal Modal */}
      <Dialog open={showLegalModal} onOpenChange={setShowLegalModal}>
        <DialogContent className="bg-surface border-border max-w-md">
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
