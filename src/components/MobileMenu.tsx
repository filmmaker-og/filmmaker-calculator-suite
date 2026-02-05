import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Menu, X, Copy, Check, LogOut, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useHaptics } from "@/hooks/use-haptics";
import filmmakerLogo from "@/assets/filmmaker-logo.jpg";

interface MobileMenuProps {
  onOpenLegal?: () => void;
  onSignOut?: () => void;
}

const MobileMenu = ({ onOpenLegal, onSignOut }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showGlossaryModal, setShowGlossaryModal] = useState(false);
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

  const handleGlossaryClick = () => {
    haptics.light();
    setIsOpen(false);
    setShowGlossaryModal(true);
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
    { label: "LEARN", href: "/intro", isHighlighted: false },
    { label: "ABOUT", href: "#about", onClick: handleAboutClick },
    { label: "CONTACT", href: "#contact", onClick: handleContactClick },
  ];

  const legalText = "Educational disclaimer: For educational purposes only. This calculator is a simplified model and is not legal, tax, accounting, or investment advice. This assumes a bankable sales agent and commercially viable cast. Deal outcomes vary by contract definitions (e.g., gross vs adjusted gross), corridor fees, reserves/holdbacks, timing of cashflows, collection account management, audit results, chargebacks, and other negotiated terms. Consult a qualified entertainment attorney and financial advisor.";

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={handleOpenMenu}
        className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-all duration-100 -mr-1"
        style={{ touchAction: 'manipulation' }}
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-gold" />
      </button>

      {/* Full-screen Menu Overlay - Portal to body */}
      {isOpen && createPortal(
        <div
          className="flex flex-col"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000000',
            zIndex: 9999,
            paddingTop: 'env(safe-area-inset-top)',
          }}
        >
           {/* Matte grey header */}
           <div
             className="flex items-center justify-between px-4"
             style={{
               height: 'var(--appbar-h)',
               backgroundColor: '#1A1A1A',
             }}
           >
             <span className="font-bebas text-gold text-lg tracking-[0.2em]">
               FILMMAKER.OG
             </span>
            <button
              onClick={handleCloseMenu}
              className="w-12 h-12 flex items-center justify-center text-white hover:text-gold transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
           </div>
 
           {/* Gold separator line */}
           <div
             className="h-[1px]"
             style={{
               background: "linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.45) 20%, rgba(255, 215, 0, 0.45) 80%, transparent 100%)",
             }}
           />

          {/* Menu Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            {/* Glowing F Logo */}
            <div className="relative mb-10">
              {/* Radial aura behind logo */}
              <div
                className="absolute inset-0 -m-4 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%)',
                  filter: 'blur(8px)',
                }}
              />
              <img
                src={filmmakerLogo}
                alt="Filmmaker Logo"
                className="relative w-24 h-24 rounded-lg"
                style={{
                  filter: 'brightness(1.15) drop-shadow(0 0 20px rgba(255, 215, 0, 0.4))',
                }}
              />
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col items-center gap-8">
              {menuLinks.map((link) => {
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
                    className={`font-bebas text-2xl tracking-[0.15em] transition-colors ${
                      link.isHighlighted ? 'text-gold' : 'text-white hover:text-gold'
                    }`}
                  >
                    {link.label}
                  </button>
                ) : link.href.startsWith("/") ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={handleLinkClick}
                    className={`font-bebas text-2xl tracking-[0.15em] transition-colors ${
                      link.isHighlighted ? 'text-gold' : 'text-white hover:text-gold'
                    }`}
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
                    className={`font-bebas text-2xl tracking-[0.15em] transition-colors ${
                      link.isHighlighted ? 'text-gold' : 'text-white hover:text-gold'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}

              {/* Glossary Button - Coming Soon */}
              <button
                onClick={handleGlossaryClick}
                className="font-bebas text-2xl text-white/40 hover:text-white/60 transition-colors tracking-[0.15em] flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                GLOSSARY
                <span className="text-xs text-white/30 font-sans">(Soon)</span>
              </button>

              {/* Legal Button */}
              <button
                onClick={handleLegalClick}
                className="font-bebas text-2xl text-white/60 hover:text-white transition-colors tracking-[0.15em]"
              >
                LEGAL
              </button>

              {/* Sign Out */}
              {onSignOut && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onSignOut();
                  }}
                  className="font-bebas text-xl tracking-[0.15em] text-white/30 hover:text-white/50 transition-colors mt-6 flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  SIGN OUT
                </button>
              )}
            </nav>
          </div>

          {/* Footer */}
          <div
            className="py-6 text-center space-y-2"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          >
            <a
              href="https://www.instagram.com/filmmaker.og"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-gold transition-colors text-xs tracking-widest block py-1"
            >
              @filmmaker.og
            </a>
            <span className="text-white/20 text-xs tracking-widest block">
              thefilmmaker.og@gmail.com
            </span>
          </div>
        </div>,
        document.body
      )}

      {/* Legal Modal */}
      <Dialog open={showLegalModal} onOpenChange={setShowLegalModal}>
        <DialogContent className="bg-[#0A0A0A] border-[#1A1A1A] max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl text-gold tracking-wider">
              LEGAL DISCLAIMER
            </DialogTitle>
          </DialogHeader>
          <p className="text-white/50 text-sm leading-relaxed">
            {legalText}
          </p>
        </DialogContent>
      </Dialog>

      {/* About Modal */}
      <Dialog open={showAboutModal} onOpenChange={setShowAboutModal}>
        <DialogContent className="bg-[#0A0A0A] border-[#1A1A1A] max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl text-gold tracking-wider">
              DEMOCRATIZING THE BUSINESS OF FILM
            </DialogTitle>
          </DialogHeader>
          <div className="text-white/50 text-sm leading-relaxed space-y-4">
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
        <DialogContent className="bg-[#0A0A0A] border-[#1A1A1A] max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl text-gold tracking-wider">
              CONTACT
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-black border border-[#1A1A1A] px-4 py-3">
              <span className="text-white/70 text-sm">thefilmmaker.og@gmail.com</span>
              <button
                onClick={handleCopyEmail}
                className="text-gold hover:text-gold/80 p-2 transition-colors"
              >
                {copiedEmail ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between bg-black border border-[#1A1A1A] px-4 py-3">
              <a
                href="https://www.instagram.com/filmmaker.og"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 text-sm hover:text-gold transition-colors"
              >
                www.instagram.com/filmmaker.og
              </a>
              <button
                onClick={handleCopyInsta}
                className="text-gold hover:text-gold/80 p-2 transition-colors"
              >
                {copiedInsta ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Glossary Coming Soon Modal */}
      <Dialog open={showGlossaryModal} onOpenChange={setShowGlossaryModal}>
        <DialogContent className="bg-[#0A0A0A] border-[#1A1A1A] max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl text-gold tracking-wider flex items-center gap-3">
              <BookOpen className="w-6 h-6" />
              GLOSSARY
            </DialogTitle>
          </DialogHeader>
          <div className="text-white/50 text-sm leading-relaxed space-y-4">
            <p>
              A comprehensive glossary of film finance terminology is currently in development.
            </p>
            <p>
              In the meantime, look for the <span className="text-gold">ℹ️</span> icons throughout the calculator for quick definitions of key terms like <span className="text-white">negative cost</span>, <span className="text-white">recoupment</span>, <span className="text-white">off-the-tops</span>, and more.
            </p>
            <p className="text-white/30 text-xs">
              Need clarification on a specific term? Reach out via the Contact page.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileMenu;
