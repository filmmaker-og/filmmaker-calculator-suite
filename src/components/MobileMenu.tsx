import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Calculator, BookOpen, Book, Mail, Instagram, Briefcase, Share2, Link2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getShareUrl, SHARE_TEXT, SHARE_TITLE } from "@/lib/constants";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const navigate = useNavigate();

  // Swipe-to-dismiss
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const delta = e.changedTouches[0].clientY - touchStartY.current;
    if (delta > 60) setIsOpen(false);
    touchStartY.current = null;
  };

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleCopyLink = useCallback(() => {
    const shareContent = `${SHARE_TEXT}\n\n${getShareUrl()}`;
    navigator.clipboard.writeText(shareContent).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }).catch(() => { /* do nothing */ });
  }, []);

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
  }, [handleCopyLink]);

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

      {/* Bottom Sheet */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-bg-card border-t border-border-default z-[201] shadow-modal transition-transform duration-300 ease-out rounded-t-2xl max-h-[85vh] overflow-y-auto",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-5">
          <div className="w-8 h-1 bg-white/15 rounded-full" />
        </div>

        <div className="px-4 pb-6 space-y-6">
          {/* Primary Nav — 2-col grid */}
          <div className="space-y-2">
            <h3 className="font-bebas text-xs text-text-dim uppercase tracking-[0.2em] pl-1 mb-2">Menu</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleNavigate('/store')}
                className="flex items-center gap-2.5 p-3.5 border border-gold/30 bg-gold/[0.06] text-left group hover:border-gold/60 transition-all"
                style={{ borderRadius: 0 }}
              >
                <Briefcase className="w-4 h-4 text-gold flex-shrink-0" />
                <span className="font-bebas text-base tracking-wide text-gold leading-none">Packages</span>
              </button>

              <button
                onClick={() => handleNavigate('/')}
                className="flex items-center gap-2.5 p-3.5 border border-border-subtle bg-white/[0.02] text-left group hover:border-gold/30 hover:bg-gold/[0.04] transition-all"
                style={{ borderRadius: 0 }}
              >
                <Home className="w-4 h-4 text-white/50 group-hover:text-gold flex-shrink-0 transition-colors" />
                <span className="font-bebas text-base tracking-wide text-white/70 group-hover:text-white leading-none transition-colors">Home</span>
              </button>

              <button
                onClick={() => handleNavigate('/calculator')}
                className="flex items-center gap-2.5 p-3.5 border border-border-subtle bg-white/[0.02] text-left group hover:border-gold/30 hover:bg-gold/[0.04] transition-all"
                style={{ borderRadius: 0 }}
              >
                <Calculator className="w-4 h-4 text-white/50 group-hover:text-gold flex-shrink-0 transition-colors" />
                <span className="font-bebas text-base tracking-wide text-white/70 group-hover:text-white leading-none transition-colors">Calculator</span>
              </button>

              <button
                onClick={() => handleNavigate('/waterfall-info')}
                className="flex items-center gap-2.5 p-3.5 border border-border-subtle bg-white/[0.02] text-left group hover:border-gold/30 hover:bg-gold/[0.04] transition-all"
                style={{ borderRadius: 0 }}
              >
                <BookOpen className="w-4 h-4 text-white/50 group-hover:text-gold flex-shrink-0 transition-colors" />
                <span className="font-bebas text-base tracking-wide text-white/70 group-hover:text-white leading-none transition-colors">Waterfall</span>
              </button>

              <button
                onClick={() => handleNavigate('/glossary')}
                className="flex items-center gap-2.5 p-3.5 col-span-2 border border-border-subtle bg-white/[0.02] text-left group hover:border-gold/30 hover:bg-gold/[0.04] transition-all"
                style={{ borderRadius: 0 }}
              >
                <Book className="w-4 h-4 text-white/50 group-hover:text-gold flex-shrink-0 transition-colors" />
                <span className="font-bebas text-base tracking-wide text-white/70 group-hover:text-white leading-none transition-colors">The Resource</span>
              </button>
            </div>
          </div>

          {/* Contact + Share — 2-col grid */}
          <div className="pt-2 border-t border-border-subtle space-y-2">
            <h3 className="font-bebas text-xs text-text-dim uppercase tracking-[0.2em] pl-1 mb-2">Contact & Share</h3>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="mailto:thefilmmaker.og@gmail.com"
                className="flex items-center gap-2.5 p-3.5 border border-border-subtle bg-white/[0.02] text-left group hover:border-gold/30 hover:bg-gold/[0.04] transition-all"
                style={{ borderRadius: 0 }}
              >
                <Mail className="w-4 h-4 text-white/50 group-hover:text-gold flex-shrink-0 transition-colors" />
                <span className="font-bebas text-sm tracking-wide text-white/70 group-hover:text-white leading-none transition-colors">Email Us</span>
              </a>

              <a
                href="https://www.instagram.com/filmmaker.og"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3.5 border border-border-subtle bg-white/[0.02] text-left group hover:border-gold/30 hover:bg-gold/[0.04] transition-all"
                style={{ borderRadius: 0 }}
              >
                <Instagram className="w-4 h-4 text-white/50 group-hover:text-gold flex-shrink-0 transition-colors" />
                <span className="font-bebas text-sm tracking-wide text-white/70 group-hover:text-white leading-none transition-colors">Instagram</span>
              </a>

              <button
                onClick={handleShare}
                className="flex items-center gap-2.5 p-3.5 border border-border-subtle bg-white/[0.02] text-left group hover:border-gold/30 hover:bg-gold/[0.04] transition-all"
                style={{ borderRadius: 0 }}
              >
                <Share2 className="w-4 h-4 text-white/50 group-hover:text-gold flex-shrink-0 transition-colors" />
                <span className="font-bebas text-sm tracking-wide text-white/70 group-hover:text-white leading-none transition-colors">Share</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2.5 p-3.5 border border-border-subtle bg-white/[0.02] text-left group hover:border-gold/30 hover:bg-gold/[0.04] transition-all"
                style={{ borderRadius: 0 }}
              >
                {linkCopied ? (
                  <>
                    <Check className="w-4 h-4 text-gold flex-shrink-0" />
                    <span className="font-bebas text-sm tracking-wide text-gold leading-none">Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 text-white/50 group-hover:text-gold flex-shrink-0 transition-colors" />
                    <span className="font-bebas text-sm tracking-wide text-white/70 group-hover:text-white leading-none transition-colors">Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Brand footer */}
          <div className="pt-2 border-t border-border-default flex items-center gap-2.5 pl-1">
            <span className="font-bebas text-lg tracking-[0.2em] text-gold">
              FILMMAKER<span className="text-white">.OG</span>
            </span>
            <span className="text-[8px] font-semibold tracking-[0.15em] text-gold border border-gold/40 px-1.5 py-0.5 leading-none uppercase">
              BETA
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
