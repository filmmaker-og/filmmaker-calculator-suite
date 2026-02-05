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
      {/* Header Bar - Matches menu header exactly */}
      <header
        className="fixed top-0 left-0 right-0 z-[150]"
        style={{
          backgroundColor: '#1A1A1A',
          height: 'var(--appbar-h)',
        }}
      >
        <div className="flex items-center justify-between px-4 h-full">
          {/* Left: Logo Text (clickable to home) */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <span className="font-bebas text-lg tracking-[0.2em] text-gold">
              FILMMAKER.OG
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
      </header>

      {/* Spacer for fixed header */}
      <div style={{ height: 'var(--appbar-h)' }} className="flex-shrink-0" />
    </>
  );
};

export default Header;
