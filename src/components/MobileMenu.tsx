import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Copy, Check, LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useHaptics } from "@/hooks/use-haptics";

interface MobileMenuProps {
  onOpenLegal?: () => void;
  onSignOut?: () => void;
}

const MobileMenu = ({ onOpenLegal, onSignOut }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedInsta, setCopiedInsta] = useState(false);
  const haptics = useHaptics();

  const handleOpenMenu = () => {
    haptics.medium();
    setIsOpen(true);
  };

  const handleCloseMenu = () => {
    haptics.light();
    setIsOpen(false);
  };

  const handleLegalClick = () => {
    haptics.light();
    setIsOpen(false);
    if (onOpenLegal) {
      onOpenLegal();
    } else {
      setShowLegalModal(true);
    }
  };

  const handleAboutClick = () => {
    haptics.light();
    setIsOpen(false);
    setShowAboutModal(true);
  };

  const handleContactClick = () => {
    haptics.light();
    setIsOpen(false);
    setShowContactModal(true);
  };

  const handleCopyEmail = async () => {
    haptics.success();
    await navigator.clipboard.writeText("thefilmmaker.og@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyInsta = async () => {
    haptics.success();
    await navigator.clipboard.writeText("www.instagram.com/filmmaker.og");
    setCopiedInsta(true);
    setTimeout(() => setCopiedInsta(false), 2000);
  };

  const menuLinks = [
    { label: "PRODUCER'S SERVICES", href: "/store", isHighlighted: true },
    { label: "ABOUT", href: "#about", onClick: handleAboutClick },
    { label: "CONTACT", href: "#contact", onClick: handleContactClick },
  ];

  const legalText = "Educational disclaimer: For educational purposes only. This calculator is a simplified model and is not legal, tax, accounting, or investment advice. This assumes a bankable sales agent and commercially viable cast. Deal outcomes vary by contract definitions (e.g., gross vs adjusted gross), corridor fees, reserves/holdbacks, timing of cashflows, collection account management, audit results, chargebacks, and other negotiated terms. Consult a qualified entertainment attorney and financial advisor.";

  return (
    <>
      {/* Hamburger Button - Touch-friendly sizing */}
      <button
        onClick={handleOpenMenu}
        className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-all duration-100 touch-press -mr-1"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 icon-bounce" style={{ color: '#D4AF37' }} />
      </button>

      {/* Full-screen Black Overlay Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col animate-fade-in safe-top">
          {/* Close Button - Touch-friendly */}
          <button
            onClick={handleCloseMenu}
            className="absolute top-6 right-4 w-14 h-14 flex items-center justify-center text-foreground hover:text-gold transition-all duration-100 touch-press"
            aria-label="Close menu"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Menu Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            {/* Logo */}
            <span className="font-bebas text-gold text-2xl tracking-[0.3em] mb-16">
              FILMMAKER.OG
            </span>

            {/* Navigation Links - Increased gap for better touch targets */}
            <nav className="flex flex-col items-center gap-10">
              {menuLinks.map((link) => {
                const linkClass = link.isHighlighted 
                  ? "font-bebas text-4xl font-bold tracking-wider transition-colors touch-press"
                  : "font-bebas text-4xl text-foreground hover:text-gold transition-colors tracking-wider touch-press";
                const linkStyle = link.isHighlighted ? { color: '#D4AF37' } : undefined;
                
                const handleLinkClick = () => {
                  haptics.light();
                  if (link.onClick) {
                    link.onClick();
                  } else {
                    setIsOpen(false);
                  }
                };
                
                return link.onClick ? (
                  <button
                    key={link.label}
                    onClick={handleLinkClick}
                    className={linkClass}
                    style={linkStyle}
                  >
                    {link.label}
                  </button>
                ) : link.href.startsWith("/") ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={handleLinkClick}
                    className={linkClass}
                    style={linkStyle}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={handleLinkClick}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={linkClass}
                    style={linkStyle}
                  >
                    {link.label}
                  </a>
                );
              })}
              
              {/* Legal Button */}
              <button
                onClick={handleLegalClick}
                className="font-bebas text-4xl text-foreground hover:text-gold transition-colors tracking-wider"
              >
                LEGAL
              </button>

              {/* Sign Out - Only show if handler provided */}
              {onSignOut && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onSignOut();
                  }}
                  className="font-bebas text-4xl tracking-wider transition-colors mt-8"
                  style={{ color: '#666666' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#aa4444'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
                >
                  <span className="flex items-center gap-3">
                    <LogOut className="w-6 h-6" />
                    SIGN OUT
                  </span>
                </button>
              )}
            </nav>
          </div>

          {/* Footer - With safe area padding */}
          <div className="pb-12 text-center space-y-3 safe-bottom">
            <a
              href="https://www.instagram.com/filmmaker.og"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-gold transition-colors text-sm tracking-widest block py-2"
            >
              @filmmaker.og (IG)
            </a>
            <span className="text-muted-foreground text-sm tracking-widest block py-1">
              thefilmmaker.og@gmail.com
            </span>
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

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="bg-surface border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl text-gold tracking-wider">
              CONTACT
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-black/50 border border-zinc-800 rounded px-4 py-3">
              <span className="text-zinc-300 text-sm">thefilmmaker.og@gmail.com</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyEmail}
                className="text-gold hover:text-gold/80 hover:bg-transparent p-2"
              >
                {copiedEmail ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="flex items-center justify-between bg-black/50 border border-zinc-800 rounded px-4 py-3">
              <a
                href="https://www.instagram.com/filmmaker.og"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 text-sm hover:text-gold transition-colors"
              >
                www.instagram.com/filmmaker.og
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyInsta}
                className="text-gold hover:text-gold/80 hover:bg-transparent p-2"
              >
                {copiedInsta ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileMenu;
