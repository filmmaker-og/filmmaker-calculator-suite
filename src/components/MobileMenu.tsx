import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X as CloseIcon } from "lucide-react";
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
    <p className="font-sans text-[13px] uppercase tracking-[0.2em] mb-3 pl-1" style={{ color: "#D4AF37" }}>{children}</p>
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
          "fixed bottom-0 left-0 right-0 z-[201] max-h-[85vh] overflow-y-auto",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          background: "#111111",
          borderRadius: "8px 8px 0 0",
          boxShadow: "0 -4px 60px rgba(212,175,55,0.08), 0 -2px 20px rgba(0,0,0,0.80)",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Gold top edge line */}
        <div
          className="h-[1px] w-full"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.25) 30%, rgba(212,175,55,0.25) 70%, transparent 100%)",
          }}
        />

        {/* Drag handle + X close button */}
        <div className="relative flex justify-center pt-4 pb-6">
          <div className="w-8 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
          <button
            onClick={() => { haptics.light(); setIsOpen(false); }}
            className="absolute top-3 right-4 w-9 h-9 flex items-center justify-center transition-colors"
            style={{ color: "rgba(255,255,255,0.40)" }}
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
                { path: "/",           label: "Home" },
                { path: "/calculator", label: "Calculator" },
                { path: "/store",      label: "Shop" },
                { path: "/resources",  label: "Resources" },
              ] as const).map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "22px 16px",
                    background: "#0a0a0a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderTop: "2px solid #D4AF37",
                    borderRadius: "8px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "1.35rem",
                      letterSpacing: "0.1em",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact + Share */}
          <div className="pt-2 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <SectionLabel>Contact & Share</SectionLabel>
            <div className="grid grid-cols-3 gap-2">
              <a
                href="mailto:thefilmmaker.og@gmail.com"
                onClick={() => haptics.light()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "22px 16px",
                  background: "#0a0a0a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderTop: "2px solid #D4AF37",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.35rem",
                    letterSpacing: "0.1em",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  Email
                </span>
              </a>

              <a
                href="https://www.instagram.com/filmmaker.og"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => haptics.light()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "22px 16px",
                  background: "#0a0a0a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderTop: "2px solid #D4AF37",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.35rem",
                    letterSpacing: "0.1em",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  Instagram
                </span>
              </a>

              <button
                onClick={handleShare}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "22px 16px",
                  background: "#0a0a0a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderTop: "2px solid #D4AF37",
                  borderRadius: "8px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.35rem",
                    letterSpacing: "0.1em",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  Share
                </span>
              </button>
            </div>
          </div>

          {/* Legal disclaimer */}
          <div className="pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[11px] tracking-wide leading-relaxed" style={{ color: "rgba(255,255,255,0.40)" }}>
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
