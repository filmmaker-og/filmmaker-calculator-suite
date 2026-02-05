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
      {/* Header Bar - Matte Grey with Gold Tint */}
      <header
        className="fixed top-0 left-0 right-0 z-[150]"
        style={{
          background: "linear-gradient(180deg, rgba(255, 215, 0, 0.08) 0%, rgba(26, 26, 26, 0.95) 100%)",
          backgroundColor: "#1A1A1A",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <div className="flex items-center justify-between px-4 h-14">
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

        {/* Gold line separator */}
        <div
          className="h-[1px] w-full"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.45) 20%, rgba(255, 215, 0, 0.45) 80%, transparent 100%)",
          }}
        />
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14 flex-shrink-0" />
    </>
  );
};

export default Header;
