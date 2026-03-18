import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X as CloseIcon, Home, Calculator, ShoppingBag, BarChart2, Mail, Instagram, Share2 } from "lucide-react";
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
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
      <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.25)" }} />
      <span style={{
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "13px",
        letterSpacing: "0.15em",
        textTransform: "uppercase" as const,
        color: "#D4AF37",
        whiteSpace: "nowrap" as const,
      }}>{children}</span>
      <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.25)" }} />
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

      {/* Bottom Sheet */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[201] max-h-[85vh] overflow-y-auto",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          background: "rgba(6,6,6,0.92)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          borderRadius: "12px 12px 0 0",
          boxShadow: "0 -4px 60px rgba(212,175,55,0.08), 0 -2px 20px rgba(0,0,0,0.80)",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Gold top edge line */}
        <div
          className="h-[1px] w-full"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.30) 20%, rgba(212,175,55,0.40) 50%, rgba(212,175,55,0.30) 80%, transparent 100%)",
          }}
        />

        {/* Drag handle + X close button */}
        <div className="relative flex justify-center pt-4 pb-2">
          <div className="w-8 h-[3px] rounded-full" style={{ background: "rgba(255,255,255,0.20)" }} />
          <button
            onClick={() => { haptics.light(); setIsOpen(false); }}
            className="absolute top-3 right-4 w-9 h-9 flex items-center justify-center transition-colors"
            style={{ color: "rgba(255,255,255,0.40)" }}
            aria-label="Close menu"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div style={{ padding: "8px 24px 28px" }}>
          {/* Primary Nav — 2×2 grid */}
          <div style={{ marginBottom: "16px" }}>
            <SectionLabel>Navigate</SectionLabel>
            <div className="grid grid-cols-2 gap-2.5">
              {([
                { path: "/",           label: "Home",       icon: <Home size={20} color="#D4AF37" /> },
                { path: "/calculator", label: "Calculator", icon: <Calculator size={20} color="#D4AF37" /> },
                { path: "/store",      label: "Shop",       icon: <ShoppingBag size={20} color="#D4AF37" /> },
                { path: "/resources",  label: "Resources",  icon: <BarChart2 size={20} color="#D4AF37" /> },
              ] as const).map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
                  onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "22px 16px",
                    background: "#0A0A0A",
                    border: "1px solid rgba(212,175,55,0.15)",
                    borderRadius: "8px",
                    transition: "transform 0.15s ease, border-color 0.25s ease",
                  }}
                >
                  {item.icon}
                  <span
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "1.2rem",
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

          {/* Follow — social links */}
          <div style={{ paddingTop: "4px" }}>
            <SectionLabel>Follow</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/filmmaker.og"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => haptics.light()}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "18px 12px",
                  background: "#0A0A0A",
                  border: "1px solid rgba(212,175,55,0.12)",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "transform 0.15s ease, border-color 0.25s ease",
                }}
              >
                <Instagram size={20} style={{ color: "rgba(212,175,55,0.40)" }} />
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.2rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.85)",
                }}>Instagram</span>
              </a>

              {/* TikTok — custom SVG */}
              <a
                href="https://www.tiktok.com/@filmmaker.og"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => haptics.light()}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "18px 12px",
                  background: "#0A0A0A",
                  border: "1px solid rgba(212,175,55,0.12)",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "transform 0.15s ease, border-color 0.25s ease",
                }}
              >
                <svg width={20} height={20} viewBox="0 0 24 24" fill="rgba(212,175,55,0.40)" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.2 8.2 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.14z"/>
                </svg>
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.2rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.85)",
                }}>TikTok</span>
              </a>

              {/* Facebook — custom SVG */}
              <a
                href="https://www.facebook.com/filmmaker.og"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => haptics.light()}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "18px 12px",
                  background: "#0A0A0A",
                  border: "1px solid rgba(212,175,55,0.12)",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "transform 0.15s ease, border-color 0.25s ease",
                }}
              >
                <svg width={20} height={20} viewBox="0 0 24 24" fill="rgba(212,175,55,0.40)" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.2rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.85)",
                }}>Facebook</span>
              </a>

            </div>
          </div>

          {/* Connect — email + share */}
          <div>
            <SectionLabel>Connect</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>

              {/* Email */}
              <a
                href="mailto:thefilmmaker.og@gmail.com"
                onClick={() => haptics.light()}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "16px",
                  background: "#0A0A0A",
                  border: "1px solid rgba(212,175,55,0.15)",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "transform 0.15s ease, border-color 0.25s ease",
                }}
              >
                <Mail size={18} style={{ color: "#D4AF37", flexShrink: 0 }} />
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.2rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: 1,
                }}>Email</span>
              </a>

              {/* Share */}
              <button
                onClick={handleShare}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "16px",
                  background: "#0A0A0A",
                  border: "1px solid rgba(212,175,55,0.15)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "transform 0.15s ease, border-color 0.25s ease",
                }}
              >
                <Share2 size={18} style={{ color: "#D4AF37", flexShrink: 0 }} />
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.2rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: 1,
                }}>Share</span>
              </button>

            </div>
          </div>

          {/* Legal disclaimer */}
          <div className="pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.05em",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.40)",
            }}>
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
