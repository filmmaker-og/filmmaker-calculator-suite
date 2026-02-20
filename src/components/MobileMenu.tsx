import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Calculator, BookOpen, Book, Mail, Instagram, Share2, X as CloseIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getShareUrl, SHARE_TEXT, SHARE_TITLE } from "@/lib/constants";

interface MobileMenuProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const MobileMenu = ({ isOpen: controlledOpen, onOpenChange }: MobileMenuProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = (v: boolean) => {
    if (onOpenChange) onOpenChange(v);
    else setInternalOpen(v);
  };
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

  const handleShare = async () => {
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
    // Fallback: copy to clipboard
    const shareContent = `${SHARE_TEXT}\n\n${getShareUrl()}`;
    navigator.clipboard.writeText(shareContent).catch(() => {});
  };

  /* ─── Section label with flanking gold rules ─────────────────── */
  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-3 pl-1 mb-2">
      <div className="h-[1px] flex-1" style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.35) 0%, transparent 100%)" }} />
      <span className="font-bebas text-[10px] text-gold/50 uppercase tracking-[0.25em] flex-shrink-0">{children}</span>
      <div className="h-[1px] flex-1" style={{ background: "linear-gradient(270deg, rgba(212,175,55,0.35) 0%, transparent 100%)" }} />
    </div>
  );

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
          "fixed bottom-0 left-0 right-0 bg-bg-card z-[201] rounded-t-2xl max-h-[85vh] overflow-y-auto",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          boxShadow: "0 -4px 60px rgba(212,175,55,0.12), 0 -2px 20px rgba(0,0,0,0.80)",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Gold top edge line */}
        <div
          className="h-[1px] w-full"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.50) 30%, rgba(212,175,55,0.50) 70%, transparent 100%)",
          }}
        />

        {/* Drag handle + X close button */}
        <div className="relative flex justify-center pt-3 pb-5">
          <div className="w-8 h-1 bg-white/15 rounded-full" />
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-4 w-8 h-8 flex items-center justify-center text-white/40 hover:text-gold transition-colors"
            aria-label="Close menu"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 pb-6 space-y-6">
          {/* Primary Nav — 2-col grid */}
          <div className="space-y-2">
            <SectionLabel>Menu</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleNavigate('/store')}
                className="flex items-center gap-2.5 p-3.5 border col-span-2 text-left group transition-all"
                style={{
                  borderRadius: 0,
                  borderColor: "rgba(212,175,55,0.50)",
                  background: "rgba(212,175,55,0.12)",
                }}
              >
                <div
                  className="w-7 h-7 flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--gold)", borderRadius: 0 }}
                >
                  <Book className="w-4 h-4 text-black" />
                </div>
                <span className="font-bebas text-base tracking-wide text-gold leading-none">Packages</span>
                <span className="ml-auto font-bebas text-[10px] tracking-[0.2em] text-gold/40 leading-none">VIEW ALL →</span>
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
                className="flex items-center gap-2.5 p-3.5 border border-border-subtle bg-white/[0.02] text-left group hover:border-gold/30 hover:bg-gold/[0.04] transition-all"
                style={{ borderRadius: 0 }}
              >
                <Book className="w-4 h-4 text-white/50 group-hover:text-gold flex-shrink-0 transition-colors" />
                <span className="font-bebas text-base tracking-wide text-white/70 group-hover:text-white leading-none transition-colors">Glossary</span>
              </button>
            </div>
          </div>

          {/* Contact + Share */}
          <div className="pt-2 border-t border-border-subtle space-y-2">
            <SectionLabel>Contact & Share</SectionLabel>
            <div className="grid grid-cols-3 gap-2">
              <a
                href="mailto:thefilmmaker.og@gmail.com"
                className="flex flex-col items-center gap-1.5 p-3.5 border border-border-subtle bg-white/[0.02] text-center group hover:border-gold/30 hover:bg-gold/[0.04] transition-all"
                style={{ borderRadius: 0 }}
              >
                <Mail className="w-4 h-4 text-white/50 group-hover:text-gold transition-colors" />
                <span className="font-bebas text-xs tracking-wide text-white/60 group-hover:text-white leading-none transition-colors">Email</span>
              </a>

              <a
                href="https://www.instagram.com/filmmaker.og"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 p-3.5 border border-border-subtle bg-white/[0.02] text-center group hover:border-gold/30 hover:bg-gold/[0.04] transition-all"
                style={{ borderRadius: 0 }}
              >
                <Instagram className="w-4 h-4 text-white/50 group-hover:text-gold transition-colors" />
                <span className="font-bebas text-xs tracking-wide text-white/60 group-hover:text-white leading-none transition-colors">Instagram</span>
              </a>

              <button
                onClick={handleShare}
                className="flex flex-col items-center gap-1.5 p-3.5 border border-border-subtle bg-white/[0.02] text-center group hover:border-gold/30 hover:bg-gold/[0.04] transition-all"
                style={{ borderRadius: 0 }}
              >
                <Share2 className="w-4 h-4 text-white/50 group-hover:text-gold transition-colors" />
                <span className="font-bebas text-xs tracking-wide text-white/60 group-hover:text-white leading-none transition-colors">Share</span>
              </button>
            </div>
          </div>

          {/* Brand footer */}
          <div
            className="pt-3 border-t flex items-center justify-between"
            style={{
              borderTopColor: "rgba(212,175,55,0.12)",
            }}
          >
            <button
              onClick={() => handleNavigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
            >
              <span className="font-bebas text-lg tracking-[0.2em] text-gold group-hover:text-white transition-colors duration-200">
                FILMMAKER<span className="text-white group-hover:text-gold transition-colors duration-200">.OG</span>
              </span>
            </button>
            <div className="h-[1px] flex-1 mx-4"
              style={{
                background: "linear-gradient(90deg, rgba(212,175,55,0.35) 0%, transparent 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
