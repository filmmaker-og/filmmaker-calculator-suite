import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black px-6 py-12">
      
      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center text-center w-full max-w-2xl">
        
        {/* Element 1: The Masthead */}
        <h1 className="font-bebas text-6xl md:text-9xl text-white tracking-tighter leading-none">
          FILMMAKER.OG
        </h1>
        
        {/* Element 2: The Tool */}
        <p className="text-gold text-xs md:text-sm tracking-[0.3em] uppercase mt-2 mb-8">
          STREAMER ACQUISITION CALCULATOR
        </p>
        
        {/* Element 3: The Mission */}
        <h2 className="font-impact text-4xl md:text-6xl text-white leading-tight max-w-2xl text-center">
          DEMOCRATIZING THE FILM BUSINESS
        </h2>
        
        {/* Element 4: The Gate */}
        <Button 
          onClick={() => navigate("/auth")}
          className="w-full max-w-xs py-4 mt-12 text-lg font-bold tracking-widest bg-gold text-black hover:bg-gold/90"
        >
          ACCESS TERMINAL
        </Button>
      </div>
      
      {/* Element 5: The Footer */}
      <footer className="w-full flex justify-center gap-8 mt-12 text-xs text-muted-foreground">
        <Dialog>
          <DialogTrigger asChild>
            <button className="hover:text-gold transition-colors">Menu</button>
          </DialogTrigger>
          <DialogContent className="bg-black/95 border-gold/20">
            <DialogHeader>
              <DialogTitle className="text-gold font-bebas text-2xl tracking-wider">FILMMAKER.OG</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p className="text-white">About Us</p>
              <p>A private institutional tool for film finance professionals.</p>
              <p className="mt-4 text-white">Contact</p>
              <a href="mailto:support@filmmaker.og" className="text-gold hover:underline">support@filmmaker.og</a>
              <div className="pt-4 border-t border-gold/10">
                <a 
                  href="https://www.instagram.com/filmmaker.og" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gold hover:underline"
                >
                  @filmmaker.og on Instagram
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <span className="text-gold/50">•</span>
        
        <Dialog>
          <DialogTrigger asChild>
            <button className="hover:text-gold transition-colors">Legal</button>
          </DialogTrigger>
          <DialogContent className="bg-black/95 border-gold/20 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-gold font-bebas text-2xl tracking-wider">DISCLAIMER</DialogTitle>
            </DialogHeader>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Educational disclaimer: For educational purposes only. This calculator is a simplified model and is not legal, tax, accounting, or investment advice. This assumes a bankable sales agent and commercially viable cast. Deal outcomes vary by contract definitions (e.g., gross vs adjusted gross), corridor fees, reserves/holdbacks, timing of cashflows, collection account management, audit results, chargebacks, and other negotiated terms. Consult a qualified entertainment attorney and financial advisor.
            </p>
          </DialogContent>
        </Dialog>
      </footer>
    </div>
  );
};

export default Index;
