import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, ExternalLink, ArrowRight } from "lucide-react";
const Index = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  useEffect(() => {
    // Detect mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Detect Instagram/Facebook in-app browser
    const ua = navigator.userAgent || navigator.vendor;
    const isInApp = /FBAN|FBAV|Instagram|Messenger|WebView/i.test(ua);
    setIsInAppBrowser(isInApp);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const handleOpenSystemBrowser = () => {
    // Try to open in system browser
    const url = window.location.href;
    window.open(url, "_system");
  };
  return <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
      backgroundImage: `linear-gradient(hsl(var(--mid)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--mid)) 1px, transparent 1px)`,
      backgroundSize: '50px 50px'
    }} />
      
      {/* Gold Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Logo/Brand Mark */}
        <div className="mb-8 animate-fade-in" style={{
        animationDelay: "0.1s"
      }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-gold flex items-center justify-center">
              
            </div>
            <span className="font-display text-mid tracking-[0.3em] text-sm">FILMMAKER.OG</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mb-12 animate-fade-in" style={{
        animationDelay: "0.2s"
      }}>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-none mb-6 tracking-tight">
            <span className="gold-gradient-text">DEMOCRATIZING</span>
            <br />
            <span className="text-foreground">THE FILM BUSINESS</span>
            <br />
            <span className="text-foreground"></span>
          </h1>
          <p className="text-dim text-lg md:text-xl font-light tracking-wide max-w-xl mx-auto">
            The mathematics of Hollywood, decoded.
          </p>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col items-center gap-4 animate-fade-in" style={{
        animationDelay: "0.4s"
      }}>
          {/* Primary CTA */}
          <Button onClick={() => navigate("/auth")} className="btn-vault px-8 py-6 text-lg rounded-none group" size="lg">
            <Lock className="w-5 h-5 mr-3" />
            ACCESS TERMINAL
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Instagram Trap Fix - Mobile Only */}
          {isMobile && isInAppBrowser && <Button onClick={handleOpenSystemBrowser} variant="outline" className="btn-ghost-gold px-6 py-4 text-sm rounded-none">
              <ExternalLink className="w-4 h-4 mr-2" />
              OPEN IN SYSTEM BROWSER
            </Button>}

          {/* Secondary Link */}
          <button onClick={() => navigate("/store")} className="text-dim hover:text-gold text-sm tracking-widest uppercase mt-4 transition-colors duration-300">
            Skip to Services →
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 flex flex-col items-center gap-4 animate-fade-in" style={{
        animationDelay: "0.6s"
      }}>
          <div className="flex items-center gap-8 text-dim text-xs tracking-widest uppercase">
            <span>Private</span>
            <span className="w-1 h-1 rounded-full bg-gold" />
            <span>Secure</span>
            <span className="w-1 h-1 rounded-full bg-gold" />
            <span>Institutional</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-6 text-center">
        <p className="text-dim text-xs tracking-wide">
          Educational Purposes Only. Not Financial Advice.
        </p>
      </footer>
    </div>;
};
export default Index;