import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuLinks = [
    { label: "ABOUT", href: "#about" },
    { label: "SERVICES", href: "/store" },
    { label: "CONTACT", href: "mailto:support@filmmaker.og" },
    { label: "LEGAL", href: "#legal" },
  ];

  return (
    <>
      {/* Floating Hamburger Button - Top Right */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-40 w-12 h-12 flex items-center justify-center text-foreground hover:text-gold transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
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
                link.href.startsWith("/") ? (
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
    </>
  );
};

export default MobileMenu;