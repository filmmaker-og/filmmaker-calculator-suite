import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MobileMenuProps {
  onOpenLegal?: () => void;
}

const MobileMenu = ({ onOpenLegal }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const handleLegalClick = () => {
    setIsOpen(false);
    if (onOpenLegal) {
      onOpenLegal();
    } else {
      setShowLegalModal(true);
    }
  };

  const handleAboutClick = () => {
    setIsOpen(false);
    setShowAboutModal(true);
  };

  const menuLinks = [
    { label: "ABOUT", href: "#about", onClick: handleAboutClick },
    { label: "SERVICES", href: "/store" },
    { label: "CONTACT", href: "mailto:support@filmmaker.og" },
  ];

  const legalText = "Educational disclaimer: For educational purposes only. This calculator is a simplified model and is not legal, tax, accounting, or investment advice. This assumes a bankable sales agent and commercially viable cast. Deal outcomes vary by contract definitions (e.g., gross vs adjusted gross), corridor fees, reserves/holdbacks, timing of cashflows, collection account management, audit results, chargebacks, and other negotiated terms. Consult a qualified entertainment attorney and financial advisor.";

  return (
    <>
      {/* Floating Hamburger Button - Top Right */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-40 w-12 h-12 flex items-center justify-center text-gold hover:text-gold/80 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-7 h-7" />
      </button>

      {/* Full-screen Black Overlay Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col animate-fade-in">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-foreground hover:text-gold transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Menu Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            {/* Logo */}
            <span className="font-bebas text-gold text-2xl tracking-[0.3em] mb-16">
              FILMMAKER.OG
            </span>

            {/* Navigation Links */}
            <nav className="flex flex-col items-center gap-8">
              {menuLinks.map((link) => (
                link.onClick ? (
                  <button
                    key={link.label}
                    onClick={link.onClick}
                    className="font-bebas text-4xl text-foreground hover:text-gold transition-colors tracking-wider"
                  >
                    {link.label}
                  </button>
                ) : link.href.startsWith("/") ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="font-bebas text-4xl text-foreground hover:text-gold transition-colors tracking-wider"
                  >
                    {link.label}
                  </Link>
                ) : link.href.startsWith("mailto:") ? (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="font-bebas text-4xl text-foreground hover:text-gold transition-colors tracking-wider"
                  >
                    {link.label}
                  </a>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => setIsOpen(false)}
                    className="font-bebas text-4xl text-foreground hover:text-gold transition-colors tracking-wider"
                  >
                    {link.label}
                  </button>
                )
              ))}
              
              {/* Legal Button */}
              <button
                onClick={handleLegalClick}
                className="font-bebas text-4xl text-foreground hover:text-gold transition-colors tracking-wider"
              >
                LEGAL
              </button>
            </nav>
          </div>

          {/* Footer */}
          <div className="pb-12 text-center">
            <a
              href="https://www.instagram.com/filmmaker.og"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-gold transition-colors text-sm tracking-widest"
            >
              @filmmaker.og
            </a>
          </div>
        </div>
      )}

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

      {/* About Modal */}
      <Dialog open={showAboutModal} onOpenChange={setShowAboutModal}>
        <DialogContent className="bg-surface border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl text-gold tracking-wider">
              DEMOCRATIZING THE BUSINESS OF FILM
            </DialogTitle>
          </DialogHeader>
          <div className="text-zinc-400 text-sm leading-relaxed space-y-4">
            <p>
              We provide institutional-grade film finance intelligence to producers operating in the $1M–$10M budget range.
            </p>
            <p>
              <span className="font-bold text-white">THE PEDIGREE</span> Second-generation filmmaker. Festival winner. Former Major Agency client. We teach Cost-Plus buyout structures, all-rights valuation, platform negotiation strategies, and SPV structuring—the frameworks that determine whether your film gets financed or dies in development.
            </p>
            <p>
              <span className="font-bold text-white">THE SHADOW MANDATE</span> We operate without attribution. This allows us to teach the actual mechanics—what moves Netflix deals, when Amazon pays premiums, how to price perpetual rights—without the political constraints that force industry insiders to soften the truth.
            </p>
            <p>
              This is the business intelligence required to treat independent film as an asset class.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileMenu;
