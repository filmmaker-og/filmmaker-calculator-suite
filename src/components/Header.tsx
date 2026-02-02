import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Home, Calculator, Mail, Info } from "lucide-react";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

const Header = ({ title, showBack = false, onBack }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogoClick = () => {
    navigate("/");
  };

  const menuItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Calculator", icon: Calculator, path: "/calculator" },
    { label: "How It Works", icon: Info, path: null, action: () => {} },
    { label: "Contact", icon: Mail, path: null, action: () => window.location.href = "mailto:hello@filmmaker.og" },
  ];

  return (
    <>
      {/* Header Bar - Matte Charcoal */}
      <header
        className="fixed top-0 left-0 right-0 z-[150]"
        style={{ backgroundColor: "#0A0A0A" }}
      >
        <div className="flex items-center justify-between px-4 h-14">
          {/* Left: Logo Text (clickable to home) */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <span className="font-bebas text-lg tracking-[0.12em] text-white/90">
              FILMMAKER.OG
            </span>
          </button>

          {/* Center: Title (optional) */}
          {title && (
            <span className="font-bebas text-sm tracking-[0.15em] text-gold absolute left-1/2 -translate-x-1/2">
              {title}
            </span>
          )}

          {/* Right: Hamburger Menu */}
          <button
            onClick={() => setMenuOpen(true)}
            className="w-11 h-11 flex items-center justify-center hover:bg-white/5 rounded-sm transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-white/70" />
          </button>
        </div>

        {/* Gold line separator */}
        <div
          className="h-[1px] w-full"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.5) 20%, rgba(212, 175, 55, 0.5) 80%, transparent 100%)",
          }}
        />
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14 flex-shrink-0" />

      {/* Full-screen Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[200] flex flex-col"
          style={{ backgroundColor: "#0A0A0A" }}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between px-4 h-14">
            <span className="font-bebas text-lg tracking-[0.12em] text-white/70">
              MENU
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-11 h-11 flex items-center justify-center hover:bg-white/5 rounded-sm transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Gold line */}
          <div
            className="h-[1px] w-full"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.5) 20%, rgba(212, 175, 55, 0.5) 80%, transparent 100%)",
            }}
          />

          {/* Menu Items */}
          <nav className="flex-1 flex flex-col px-6 py-8">
            {menuItems.map((item) => {
              const isActive = item.path && location.pathname === item.path;
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                    } else if (item.action) {
                      item.action();
                    }
                    setMenuOpen(false);
                  }}
                  className={`flex items-center gap-4 py-5 border-b border-white/10 transition-colors ${
                    isActive ? "text-gold" : "text-white/60 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-bebas text-xl tracking-[0.08em]">
                    {item.label.toUpperCase()}
                  </span>
                  {isActive && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-gold" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer in menu */}
          <div className="px-6 py-8 border-t border-white/10">
            <p className="text-white/40 text-sm leading-relaxed mb-3">
              Questions about your deal?
            </p>
            <a
              href="mailto:hello@filmmaker.og"
              className="text-gold text-base font-semibold tracking-wide hover:text-gold-highlight transition-colors"
            >
              hello@filmmaker.og
            </a>
            <p className="text-white/20 text-[10px] mt-8 tracking-wider">
              © 2024 FILMMAKER.OG · Educational purposes only
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
