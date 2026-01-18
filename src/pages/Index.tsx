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
        
        {/* Element 1: Brand Icon */}
        <div className="w-16 h-16 mb-6 rounded-sm overflow-hidden border-2 border-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]">
          <img 
            src={filmmakerLogo} 
            alt="Filmmaker.OG" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Element 2: The Masthead */}
        <h1 className="font-bebas text-5xl md:text-7xl lg:text-9xl text-foreground tracking-tighter leading-none">
          FILMMAKER.OG
        </h1>
        
        {/* Element 3: The Tool */}
        <p className="text-gold text-xs md:text-sm tracking-[0.3em] uppercase mt-4 mb-10">
          STREAMER ACQUISITION CALCULATOR
        </p>
        
        {/* Element 4: The Mission / Hero */}
        <h2 className="font-inter-black text-xl md:text-2xl lg:text-3xl text-foreground leading-tight max-w-2xl mb-16">
          DEMOCRATIZING THE BUSINESS OF FILM
        </h2>
        
        {/* Element 5: Action Stack */}
        <div className="w-full max-w-xs space-y-4">
          {/* Primary Button */}
          <Button 
            onClick={() => navigate("/auth")}
            className="w-full py-5 text-base font-inter-black tracking-widest btn-vault"
          >
            ACCESS TERMINAL
          </Button>
          
          {/* Secondary Button */}
          <Link to="/store" className="block">
            <Button 
              variant="outline"
              className="w-full py-5 text-base btn-ghost-gold"
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
