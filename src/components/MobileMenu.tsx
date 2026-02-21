import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Calculator, BookOpen, ShoppingBag, Mail, Instagram, Share2, X as CloseIcon } from "lucide-react";
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

  /* ─── Section label ─────────────────────────────────────────── */
  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="font-bebas text-[16px] text-white/70 uppercase tracking-[0.20em] mb-3 pl-1">{children}</p>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bottom Sheet */}
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
        <div className="relative flex justify-center pt-4 pb-6">
          <div className="w-8 h-1 bg-white/15 rounded-full" />
          <button
            onClick={() => { haptics.light(); setIsOpen(false); }}
            className="absolute top-3 right-4 w-9 h-9 flex items-center justify-center text-gold/60 hover:text-gold transition-colors"
            aria-label="Close menu"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 pb-6 space-y-6">
          {/* Primary Nav — 2×2 grid */}
          <div className="space-y-3">
            <SectionLabel>Menu</SectionLabel>
            <div className="grid grid-cols-2 gap-2.5">
              {([
                { path: "/",           icon: Home,        label: "Home" },
                { path: "/calculator", icon: Calculator,  label: "Calculator" },
                { path: "/store",      icon: ShoppingBag, label: "Shop" },
                { path: "/resources",  icon: BookOpen,    label: "Resources" },
              ] as const).map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className="relative flex flex-col items-center justify-center gap-2 py-5 border text-center group transition-all overflow-hidden"
                    style={{
                      borderRadius: 12,
                      borderColor: "rgba(255,255,255,0.10)",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <Icon
                      className="w-5 h-5 transition-colors"
                      style={{ color: "rgba(212,175,55,1)" }}
                    />
                    <span
                      className="font-bebas text-[18px] tracking-[0.12em] leading-none transition-colors"
                      style={{ color: "rgba(255,255,255,0.85)" }}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact + Share */}
          <div className="pt-2 border-t border-white/[0.08] space-y-3">
            <SectionLabel>Contact & Share</SectionLabel>
            <div className="grid grid-cols-3 gap-2">
              <a
                href="mailto:thefilmmaker.og@gmail.com"
                onClick={() => haptics.light()}
                className="relative flex flex-col items-center gap-2 p-4 border border-white/[0.10] bg-white/[0.03] text-center group hover:border-gold/40 hover:bg-gold/[0.06] transition-all overflow-hidden"
                style={{ borderRadius: 12 }}
              >
                <Mail className="w-5 h-5 text-gold/70 group-hover:text-gold transition-colors" />
                <span className="font-bebas text-[15px] tracking-[0.08em] text-white/75 group-hover:text-white leading-none transition-colors">Email</span>
              </a>

              <a
                href="https://www.instagram.com/filmmaker.og"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => haptics.light()}
                className="relative flex flex-col items-center gap-2 p-4 border border-white/[0.10] bg-white/[0.03] text-center group hover:border-gold/40 hover:bg-gold/[0.06] transition-all overflow-hidden"
                style={{ borderRadius: 12 }}
              >
                <Instagram className="w-5 h-5 text-gold/70 group-hover:text-gold transition-colors" />
                <span className="font-bebas text-[15px] tracking-[0.08em] text-white/75 group-hover:text-white leading-none transition-colors">Instagram</span>
              </a>

              <button
                onClick={handleShare}
                className="relative flex flex-col items-center gap-2 p-4 border border-white/[0.10] bg-white/[0.03] text-center group hover:border-gold/40 hover:bg-gold/[0.06] transition-all overflow-hidden"
                style={{ borderRadius: 12 }}
              >
                <Share2 className="w-5 h-5 text-gold/70 group-hover:text-gold transition-colors" />
                <span className="font-bebas text-[15px] tracking-[0.08em] text-white/75 group-hover:text-white leading-none transition-colors">Share</span>
              </button>
            </div>
          </div>

          {/* Legal disclaimer — replaces the old FILMMAKER.OG brand footer */}
          <div className="pt-3 border-t border-white/[0.06]">
            <p className="text-white/30 text-[11px] tracking-wide leading-relaxed text-center px-2">
              For educational and informational purposes only. Not legal, tax, or investment advice.
              Consult a qualified entertainment attorney before making financing decisions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
