import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MobileMenu from "@/components/MobileMenu";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background px-6">
      {/* Floating Menu */}
      <MobileMenu />
      
      {/* Main Content - Magazine Cover Layout */}
      <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
        
        {/* Element 1: The Masthead */}
        <h1 className="font-bebas text-5xl md:text-7xl lg:text-9xl text-foreground tracking-tighter leading-none">
          FILMMAKER.OG
        </h1>
        
        {/* Element 2: The Tool */}
        <p className="text-gold text-xs md:text-sm tracking-[0.3em] uppercase mt-2 mb-8">
          STREAMER ACQUISITION CALCULATOR
        </p>
        
        {/* Element 3: The Mission / Hero */}
        <h2 className="font-inter-black text-xl md:text-2xl lg:text-3xl text-foreground leading-tight max-w-2xl mb-12">
          THE ARTISTS EQUITY MODEL, DECODED.
        </h2>
        
        {/* Element 4: Action Stack */}
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
      
      {/* Element 5: Legal Footer */}
      <footer className="py-8 text-center">
        <p className="text-muted-foreground text-xs leading-relaxed max-w-md mx-auto">
          Educational disclaimer: For educational purposes only. This calculator is a simplified model and is not legal, tax, accounting, or investment advice. This assumes a bankable sales agent and commercially viable cast. Deal outcomes vary by contract definitions (e.g., gross vs adjusted gross), corridor fees, reserves/holdbacks, timing of cashflows, collection account management, audit results, chargebacks, and other negotiated terms. Consult a qualified entertainment attorney and financial advisor.
        </p>
      </footer>
    </div>
  );
};

export default Index;