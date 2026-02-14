import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Calculator, BookOpen, Book, Mail, Instagram, Briefcase, Share2, Link2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const getShareUrl = () => window.location.origin;
const SHARE_TEXT = "Before you sign a deal, see exactly who gets paid and what's left for you. Free film finance tool — no account required.";
const SHARE_TITLE = "FILMMAKER.OG — See Where Every Dollar Goes";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: SHARE_TITLE,
          text: SHARE_TEXT,
          url: getShareUrl(),
        });
        return;
      } catch {
        // User cancelled or API failed — fall through to clipboard
      }
    }
    handleCopyLink();
  }, []);

  const handleCopyLink = useCallback(() => {
    const shareContent = `${SHARE_TEXT}\n\n${getShareUrl()}`;
    navigator.clipboard.writeText(shareContent).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }).catch(() => { /* do nothing */ });
  }, []);

  return (
    <>
      {/* Animated Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-bg-elevated transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <div className="w-5 h-4 relative flex flex-col justify-between">
          <span
            className={cn(
              "block h-[1.5px] w-full bg-gold rounded-full transition-all duration-300 origin-center",
              isOpen && "translate-y-[7px] rotate-45"
            )}
          />
          <span
            className={cn(
              "block h-[1.5px] w-full bg-gold rounded-full transition-all duration-300",
              isOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
            )}
          />
          <span
            className={cn(
              "block h-[1.5px] w-full bg-gold rounded-full transition-all duration-300 origin-center",
              isOpen && "-translate-y-[7px] -rotate-45"
            )}
          />
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 w-[280px] bg-bg-card border-l border-border-default z-[201] p-6 shadow-modal transition-transform duration-300 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsOpen(false)}
            className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-bg-elevated transition-colors"
            aria-label="Close menu"
          >
            <div className="w-5 h-4 relative">
              <span className="block h-[1.5px] w-full bg-text-dim rounded-full absolute top-1/2 -translate-y-1/2 rotate-45 transition-colors hover:bg-white" />
              <span className="block h-[1.5px] w-full bg-text-dim rounded-full absolute top-1/2 -translate-y-1/2 -rotate-45 transition-colors hover:bg-white" />
            </div>
          </button>
        </div>

        <div className="space-y-6 flex-1">
          <div className="space-y-2">
            <h3 className="font-bebas text-xs text-text-dim uppercase tracking-[0.2em] pl-3">Menu</h3>

            <button
              onClick={() => handleNavigate('/store')}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-text-primary hover:bg-bg-elevated transition-colors text-left group"
            >
              <Briefcase className="w-5 h-5 text-gold group-hover:text-gold" />
              <span className="font-bebas text-base tracking-wide text-gold">Packages</span>
            </button>

            <button
              onClick={() => handleNavigate('/')}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-text-primary hover:bg-bg-elevated transition-colors text-left group"
            >
              <Home className="w-5 h-5 text-gold/70 group-hover:text-gold" />
              <span className="font-bebas text-base tracking-wide">Home</span>
            </button>

            <button
              onClick={() => handleNavigate('/calculator')}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-text-primary hover:bg-bg-elevated transition-colors text-left group"
            >
              <Calculator className="w-5 h-5 text-gold/70 group-hover:text-gold" />
              <span className="font-bebas text-base tracking-wide">Calculator</span>
            </button>

            <button
              onClick={() => handleNavigate('/waterfall-info')}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-text-primary hover:bg-bg-elevated transition-colors text-left group"
            >
              <BookOpen className="w-5 h-5 text-gold/70 group-hover:text-gold" />
              <span className="font-bebas text-base tracking-wide">Waterfall Protocol</span>
            </button>

            <button
              onClick={() => handleNavigate('/glossary')}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-text-primary hover:bg-bg-elevated transition-colors text-left group"
            >
              <Book className="w-5 h-5 text-gold/70 group-hover:text-gold" />
              <span className="font-bebas text-base tracking-wide">Glossary</span>
            </button>
          </div>

          <div className="space-y-2 pt-6 border-t border-border-subtle">
            <h3 className="font-bebas text-xs text-text-dim uppercase tracking-[0.2em] pl-3">Contact</h3>

            <a
              href="mailto:thefilmmaker.og@gmail.com"
              className="w-full flex items-center gap-3 p-3 rounded-lg text-text-primary hover:bg-bg-elevated transition-colors text-left group"
            >
              <Mail className="w-5 h-5 text-gold/70 group-hover:text-gold" />
              <span className="font-bebas text-sm tracking-wide">thefilmmaker.og@gmail.com</span>
            </a>

            <a
              href="https://www.instagram.com/filmmaker.og"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 p-3 rounded-lg text-text-primary hover:bg-bg-elevated transition-colors text-left group"
            >
              <Instagram className="w-5 h-5 text-gold/70 group-hover:text-gold" />
              <span className="font-bebas text-sm tracking-wide">@filmmaker.og</span>
            </a>
          </div>

          <div className="space-y-2 pt-6 border-t border-border-subtle">
            <h3 className="font-bebas text-xs text-text-dim uppercase tracking-[0.2em] pl-3">Share</h3>

            <button
              onClick={handleShare}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-text-primary hover:bg-bg-elevated transition-colors text-left group"
            >
              <Share2 className="w-5 h-5 text-gold/70 group-hover:text-gold" />
              <span className="font-bebas text-sm tracking-wide">Share this tool</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-text-primary hover:bg-bg-elevated transition-colors text-left group"
            >
              {linkCopied ? (
                <>
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="font-bebas text-sm tracking-wide text-green-400">Link copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-5 h-5 text-gold/70 group-hover:text-gold" />
                  <span className="font-bebas text-sm tracking-wide">Copy link</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-border-default px-3">
          <div className="flex items-center gap-2.5">
            <span className="font-bebas text-lg tracking-[0.2em] text-gold">
              FILMMAKER<span className="text-white">.OG</span>
            </span>
            <span className="text-[8px] font-semibold tracking-[0.15em] text-gold border border-gold/40 rounded-full px-1.5 py-0.5 leading-none uppercase">
              BETA
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
