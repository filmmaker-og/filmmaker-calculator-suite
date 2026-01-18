import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, ExternalLink, ArrowRight } from "lucide-react";
import filmmakerLogo from "@/assets/filmmaker-logo.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const ua = navigator.userAgent || navigator.vendor;
    const isInApp = /FBAN|FBAV|Instagram|Messenger|WebView/i.test(ua);
    setIsInAppBrowser(isInApp);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleOpenSystemBrowser = () => {
    const url = window.location.href;
    window.open(url, "_system");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--mid)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--mid)) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Gold Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Main Content - Flex grow to push footer down */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* 1. MASTHEAD - Massive Centered Logo */}
        <div className="mb-8 animate-fade-in flex flex-col items-center" style={{ animationDelay: "0.1s" }}>
          {/* Huge Logo Icon Centered Above Text */}
          <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 border-2 border-gold flex items-center justify-center mb-6 overflow-hidden">
            <img 
              src={filmmakerLogo} 
              alt="Filmmaker.OG Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Massive Logo Text */}
          <span className="font-display text-foreground tracking-[0.3em] text-5xl md:text-6xl lg:text-7xl font-bold text-center">
            FILMMAKER.OG
          </span>
        </div>

        {/* 2. HERO - Sub-headline, Headline, Sub-text */}
        <div className="text-center max-w-4xl mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {/* Logo with Text */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-12 md:w-14 md:h-14 border border-gold flex items-center justify-center overflow-hidden">
              <img 
                src={filmmakerLogo} 
                alt="Filmmaker.OG" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-display text-foreground tracking-[0.2em] text-2xl md:text-3xl font-bold">
              FILMMAKER.OG
            </span>
          </div>
          
          {/* Sub-headline - Gold */}
          <p className="text-gold font-display text-lg md:text-xl lg:text-2xl tracking-[0.3em] uppercase mb-6">
            STREAMER ACQUISITION CALCULATOR
          </p>
          
          {/* Headline - Heavy */}
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl leading-tight mb-6 tracking-tight font-bold">
            <span className="gold-gradient-text">DEMOCRATIZING</span>
            <br />
            <span className="text-foreground">THE FILM BUSINESS</span>
          </h1>
          
          {/* Sub-text - Grey */}
          <p className="text-dim text-lg md:text-xl font-light tracking-wide">
            The mathematics of Hollywood, decoded.
          </p>
        </div>

        {/* CTA Section - Large Centered Button */}
        <div className="flex flex-col items-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Button
            onClick={() => navigate("/auth")}
            className="btn-vault px-10 py-7 text-lg md:text-xl rounded-none group"
            size="lg"
          >
            <Lock className="w-5 h-5 md:w-6 md:h-6 mr-3" />
            ACCESS TERMINAL
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Instagram Trap Fix - Mobile Only */}
          {isMobile && isInAppBrowser && (
            <Button
              onClick={handleOpenSystemBrowser}
              variant="outline"
              className="btn-ghost-gold px-6 py-4 text-sm rounded-none"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              OPEN IN SYSTEM BROWSER
            </Button>
          )}

          {/* Secondary Link */}
          <button
            onClick={() => navigate("/store")}
            className="text-dim hover:text-gold text-sm tracking-widest uppercase mt-4 transition-colors duration-300"
          >
            Skip to Services →
          </button>
          
          {/* Educational Disclaimer */}
          <p className="text-dim/50 text-[10px] leading-relaxed max-w-2xl text-center mt-6">
            Educational disclaimer: For educational purposes only. This calculator is a simplified model and is not legal, tax, accounting, or investment advice. This assumes a bankable sales agent and commercially viable cast. Deal outcomes vary by contract definitions (e.g., gross vs adjusted gross), corridor fees, reserves/holdbacks, timing of cashflows, collection account management, audit results, chargebacks, and other negotiated terms. Consult a qualified entertainment attorney and financial advisor.
          </p>
        </div>
      </main>

      {/* 3. FOOTER - Grid Layout */}
      <footer className="relative z-10 py-8 px-6 border-t border-border/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Col 1 (Left): Small Logo */}
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 border border-gold flex items-center justify-center overflow-hidden">
                <img 
                  src={filmmakerLogo} 
                  alt="Filmmaker.OG" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display text-mid tracking-[0.2em] text-sm">
                FILMMAKER.OG
              </span>
            </div>

            {/* Col 2 (Center): Trust Indicators */}
            <div className="flex items-center justify-center gap-3 text-dim text-xs tracking-widest uppercase">
              <span>Private</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span>Secure</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span>Institutional</span>
            </div>

            {/* Col 3 (Right): Instagram */}
            <div className="flex justify-center md:justify-end">
              <a
                href="https://www.instagram.com/filmmaker.og"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dim hover:text-gold transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* About Modal */}
      <dialog
        id="about-modal"
        className="bg-background border border-border p-8 max-w-md backdrop:bg-black/80 rounded-none"
      >
        <div className="space-y-6">
          <h2 className="font-display text-2xl text-foreground">ABOUT US</h2>
          <p className="text-dim text-sm leading-relaxed">
            FILMMAKER.OG is dedicated to democratizing the film business by providing institutional-grade tools and education to independent filmmakers and producers.
          </p>
          <div className="pt-4 border-t border-border">
            <p className="text-mid text-sm">
              <span className="text-dim">Contact: </span>
              <a href="mailto:support@filmmaker.og" className="text-gold hover:underline">
                support@filmmaker.og
              </a>
            </p>
          </div>
          <button
            onClick={() => {
              const dialog = document.getElementById("about-modal") as HTMLDialogElement;
              dialog?.close();
            }}
            className="text-dim hover:text-gold text-sm tracking-widest uppercase transition-colors"
          >
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default Index;
