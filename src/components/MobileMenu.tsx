import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Calculator, BookOpen, Book, Mail, Instagram, Share2, X as CloseIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getShareUrl, SHARE_TEXT, SHARE_TITLE } from "@/lib/constants";
import { useHaptics } from "@/hooks/use-haptics";

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
  const haptics = useHaptics();

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
    haptics.light();
    setIsOpen(false);
    navigate(path);
  };

  const handleShare = async () => {
    haptics.light();
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
      <span className="font-bebas text-[13px] text-gold/60 uppercase tracking-[0.25em] flex-shrink-0">{children}</span>
      <div className="h-[1px] flex-1" style={{ background: "linear-gradient(270deg, rgba(212,175,55,0.35) 0%, transparent 100%)" }} />
    </div>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bottom Sheet — premium black */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[201] rounded-t-2xl max-h-[85vh] overflow-y-auto",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          background: "#0A0A0A",
          boxShadow: "0 -4px 60px rgba(212,175,55,0.12), 0 -2px 20px rgba(0,0,0,0.80)",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Gold top edge line */}
        <div
          className="h-[1px] w-full"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.65) 30%, rgba(212,175,55,0.65) 70%, transparent 100%)",
          }}
        />

        {/* Drag handle + X close button */}
        <div className="relative flex justify-center pt-3 pb-5">
          <div className="w-8 h-1 bg-gold/30 rounded-full" />
          <button
            onClick={() => { haptics.light(); setIsOpen(false); }}
            className="absolute top-2 right-4 w-9 h-9 flex items-center justify-center text-gold/60 hover:text-gold transition-colors"
            aria-label="Close menu"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 pb-6 space-y-6">
          {/* Primary Nav — 2×2 grid */}
          <div className="space-y-2">
            <SectionLabel>Menu</SectionLabel>
            <div className="grid grid-cols-2 gap-2.5">
              {([
                { path: "/store",      icon: Book,       label: "Packages",   featured: true },
                { path: "/",           icon: Home,       label: "Home",       featured: false },
                { path: "/calculator", icon: Calculator, label: "Calculator", featured: false },
                { path: "/resources",  icon: BookOpen,   label: "Resources",  featured: false },
              ] as const).map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className="relative flex flex-col items-center justify-center gap-2 py-5 border text-center group transition-all overflow-hidden"
                    style={{
                      borderRadius: 8,
                      borderColor: item.featured ? "rgba(212,175,55,0.50)" : "rgba(255,255,255,0.12)",
                      background: item.featured ? "rgba(212,175,55,0.10)" : "rgba(255,255,255,0.04)",
                      boxShadow: item.featured ? "0 0 20px rgba(212,175,55,0.08), inset 0 1px 0 rgba(212,175,55,0.08)" : "none",
                    }}
                  >
                    {/* Gold left accent on featured */}
                    {item.featured && (
                      <div
                        className="absolute left-0 top-0 bottom-0 w-[2px]"
                        style={{ background: "linear-gradient(to bottom, rgba(212,175,55,0.70), rgba(212,175,55,0.25))" }}
                      />
                    )}
                    <Icon
                      className="w-5 h-5 transition-colors"
                      style={{ color: item.featured ? "rgba(212,175,55,1)" : "rgba(255,255,255,0.70)" }}
                    />
                    <span
                      className="font-bebas text-[18px] tracking-[0.12em] leading-none transition-colors"
                      style={{ color: item.featured ? "rgba(212,175,55,1)" : "rgba(255,255,255,0.85)" }}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact + Share */}
          <div className="pt-2 border-t border-white/[0.08] space-y-2">
            <SectionLabel>Contact & Share</SectionLabel>
            <div className="grid grid-cols-3 gap-2">
              <a
                href="mailto:thefilmmaker.og@gmail.com"
                onClick={() => haptics.light()}
                className="relative flex flex-col items-center gap-2 p-4 border border-white/[0.10] bg-white/[0.04] text-center group hover:border-gold/40 hover:bg-gold/[0.06] transition-all overflow-hidden"
                style={{ borderRadius: 8 }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background: "linear-gradient(to bottom, rgba(212,175,55,0.40), transparent)", boxShadow: "0 0 8px rgba(212,175,55,0.15)" }} />
                <Mail className="w-5 h-5 text-gold/70 group-hover:text-gold transition-colors" />
                <span className="font-bebas text-[14px] tracking-[0.08em] text-white/70 group-hover:text-white leading-none transition-colors">Email</span>
              </a>

              <a
                href="https://www.instagram.com/filmmaker.og"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => haptics.light()}
                className="relative flex flex-col items-center gap-2 p-4 border border-white/[0.10] bg-white/[0.04] text-center group hover:border-gold/40 hover:bg-gold/[0.06] transition-all overflow-hidden"
                style={{ borderRadius: 8 }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background: "linear-gradient(to bottom, rgba(212,175,55,0.40), transparent)", boxShadow: "0 0 8px rgba(212,175,55,0.15)" }} />
                <Instagram className="w-5 h-5 text-gold/70 group-hover:text-gold transition-colors" />
                <span className="font-bebas text-[14px] tracking-[0.08em] text-white/70 group-hover:text-white leading-none transition-colors">Instagram</span>
              </a>

              <button
                onClick={handleShare}
                className="relative flex flex-col items-center gap-2 p-4 border border-white/[0.10] bg-white/[0.04] text-center group hover:border-gold/40 hover:bg-gold/[0.06] transition-all overflow-hidden"
                style={{ borderRadius: 8 }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background: "linear-gradient(to bottom, rgba(212,175,55,0.40), transparent)", boxShadow: "0 0 8px rgba(212,175,55,0.15)" }} />
                <Share2 className="w-5 h-5 text-gold/70 group-hover:text-gold transition-colors" />
                <span className="font-bebas text-[14px] tracking-[0.08em] text-white/70 group-hover:text-white leading-none transition-colors">Share</span>
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
              <span className="font-bebas text-[22px] tracking-[0.2em] text-gold group-hover:text-white transition-colors duration-200">
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
