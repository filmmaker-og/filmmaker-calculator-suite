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

          {/* Right: Hamburger Menu - Uses unified MobileMenu */}
          <MobileMenu />
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
    </>
  );
};

export default Header;
