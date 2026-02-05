import { useNavigate } from "react-router-dom";
import MobileMenu from "./MobileMenu";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

const Header = ({ title }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <>
      {/* Header Bar */}
      <header
        className="fixed top-0 left-0 right-0 z-[150]"
        style={{
          backgroundColor: '#1A1A1A',
        }}
      >
        <div className="flex items-center justify-between px-4" style={{ height: 'var(--appbar-h)' }}>
          {/* Left: Logo Text (clickable to home) */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group"
          >
            {/* FORCE GOLD LOGO COLOR */}
            <span className="font-bebas text-lg tracking-[0.2em] text-[#D4AF37] group-hover:text-white transition-colors duration-300">
              FILMMAKER<span className="text-white group-hover:text-[#D4AF37] transition-colors duration-300">.OG</span>
            </span>
          </button>

          {/* Center: Title (optional) */}
          {title && (
            <span className="font-bebas text-sm tracking-[0.15em] text-gold absolute left-1/2 -translate-x-1/2">
              {title}
            </span>
          )}

          {/* Right: Hamburger Menu - Uses unified MobileMenu */}
          <MobileMenu />
        </div>

        {/* Gold line separator */}
        <div
          className="h-[1px] w-full"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.45) 20%, rgba(255, 215, 0, 0.45) 80%, transparent 100%)",
          }}
        />
      </header>

      {/* Spacer for fixed header */}
      <div style={{ height: 'var(--appbar-h)' }} className="flex-shrink-0" />
    </>
  );
};

export default Header;
