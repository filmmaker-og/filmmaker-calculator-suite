import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X as CloseIcon, Home, Calculator, ShoppingBag, BarChart2, Mail, Instagram, Share2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { getShareUrl, SHARE_TEXT, SHARE_TITLE } from "@/lib/constants";
import { useHaptics } from "@/hooks/use-haptics";

interface MobileMenuProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onOpenBot?: () => void;
}

const MobileMenu = ({ isOpen: controlledOpen, onOpenChange, onOpenBot }: MobileMenuProps) => {
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
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
      <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.25)" }} />
      <span style={{
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "14px",
        letterSpacing: "0.18em",
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
          boxShadow: "0 -16px 50px rgba(0,0,0,0.70), 0 -30px 70px rgba(0,0,0,0.90)",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Bicolor top edge line — matches OgBotSheet */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] pointer-events-none z-10"
          style={{
            background: "linear-gradient(to right, transparent 0%, rgba(212,175,55,0.20) 20%, rgba(212,175,55,0.40) 50%, rgba(212,175,55,0.20) 80%, transparent 100%)",
            borderRadius: "12px 12px 0 0",
          }}
        />

        <style>{`
          @keyframes menu-shimmer {
            0% { left: -100%; }
            30% { left: 200%; }
            100% { left: 200%; }
          }
        `}</style>

        {/* Purple atmospheric glow — pure purple, no gold contamination */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none z-0"
          style={{
            height: "180px",
            background: "transparent",
            borderRadius: "12px 12px 0 0",
          }}
        />

        {/* Purple atmospheric glow — bottom canopy */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-0"
          style={{
            height: "200px",
            background: "transparent",
          }}
        />

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-[3px] rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
        </div>

        {/* Close button — anchored to sheet, clear of ASK THE OG tap zone */}
        <button
          onClick={() => { haptics.light(); setIsOpen(false); }}
          className="absolute top-2 right-4 w-8 h-8 flex items-center justify-center transition-colors z-20"
          style={{ color: "rgba(255,255,255,0.60)" }}
          aria-label="Close menu"
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.80)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.60)")}
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <div style={{ padding: "28px 24px 24px" }}>
          {/* Ask the OG — prominent bot CTA */}
          {onOpenBot && (
            <>
            <button
              onClick={() => { haptics.medium(); onOpenBot(); }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              style={{
                position: "relative",
                overflow: "hidden",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "16px",
                marginBottom: "10px",
                background: "#F9E076",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 0 0 1px rgba(212,175,55,0.40), 0 8px 24px rgba(0,0,0,0.5), 0 0 30px rgba(249,224,118,0.20)",
                transition: "transform 0.15s ease, box-shadow 0.3s ease",
              }}
            >
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "rgba(55,20,100,0.80)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                position: "relative",
                zIndex: 1,
              }}>
                <Sparkles style={{ width: "22px", height: "22px", color: "#D4AF37", filter: "drop-shadow(0 0 6px rgba(212,175,55,0.40))" }} />
              </div>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.8rem",
                letterSpacing: "0.10em",
                color: "#000",
                position: "relative",
                zIndex: 1,
              }}>
                ASK THE OG
              </span>
              <div style={{
                position: "absolute", top: 0, left: "-100%", width: "55%", height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                transform: "skewX(-20deg)",
                animation: "menu-shimmer 2.5s ease-in-out infinite",
              }} />
            </button>

            {/* Separator — premium CTA zone / utility navigation */}
            <div style={{ height: "1px", background: "rgba(212,175,55,0.15)", marginTop: "10px", marginBottom: "10px", maxWidth: "120px", marginLeft: "auto", marginRight: "auto" }} />
            </>
          )}

          {/* Nav — 3-col (matches social row) */}
          <SectionLabel>Navigate</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", marginBottom: "10px" }}>
            {([
              { path: "/calculator", label: "Calculator", icon: <Calculator size={18} color="#D4AF37" /> },
              { path: "/store",      label: "Shop",       icon: <ShoppingBag size={18} color="#D4AF37" /> },
              { path: "/resources",  label: "Resources",  icon: <BarChart2 size={18} color="#D4AF37" /> },
            ] as const).map((item) => (
              <button
                key={item.path}
                aria-label={item.label}
                onClick={() => handleNavigate(item.path)}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.15)"; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 8px",
                  background: "#0A0A0A",
                  border: "1px solid rgba(212,175,55,0.15)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "transform 0.15s ease, border-color 0.25s ease",
                }}
              >
                {item.icon}
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.1rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.88)",
                }}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Follow — social links */}
          <div>
            <SectionLabel>Follow</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", marginBottom: "10px" }}>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/filmmaker.og"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                onClick={() => haptics.light()}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.16) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(212,175,55,0.08), 0 0 12px rgba(212,175,55,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.12) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(212,175,55,0.08), 0 0 10px rgba(212,175,55,0.06)"; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.18) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(212,175,55,0.08), 0 0 14px rgba(212,175,55,0.10)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.12) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(212,175,55,0.08), 0 0 10px rgba(212,175,55,0.06)"; }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 8px",
                  background: "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.12) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)",
                  border: "1px solid rgba(212,175,55,0.08)",
                  borderRadius: "6px",
                  boxShadow: "0 0 20px rgba(212,175,55,0.08), 0 0 10px rgba(212,175,55,0.06)",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "transform 0.15s ease, border-color 0.25s ease, background 0.25s ease",
                }}
              >
                <Instagram size={18} style={{ color: "#D4AF37" }} />
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.1rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.88)",
                }}>Instagram</span>
              </a>

              {/* TikTok — custom SVG */}
              <a
                href="https://www.tiktok.com/@filmmaker.og"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                onClick={() => haptics.light()}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.16) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(212,175,55,0.08), 0 0 12px rgba(212,175,55,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.12) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(212,175,55,0.08), 0 0 10px rgba(212,175,55,0.06)"; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.18) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(212,175,55,0.08), 0 0 14px rgba(212,175,55,0.10)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.12) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(212,175,55,0.08), 0 0 10px rgba(212,175,55,0.06)"; }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 8px",
                  background: "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.12) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)",
                  border: "1px solid rgba(212,175,55,0.08)",
                  borderRadius: "6px",
                  boxShadow: "0 0 20px rgba(212,175,55,0.08), 0 0 10px rgba(212,175,55,0.06)",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "transform 0.15s ease, border-color 0.25s ease, background 0.25s ease",
                }}
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="#D4AF37" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.2 8.2 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.14z"/>
                </svg>
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.1rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.88)",
                }}>TikTok</span>
              </a>

              {/* Facebook — custom SVG */}
              <a
                href="https://www.facebook.com/filmmaker.og"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                onClick={() => haptics.light()}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.16) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(212,175,55,0.08), 0 0 12px rgba(212,175,55,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.12) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(212,175,55,0.08), 0 0 10px rgba(212,175,55,0.06)"; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.18) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(212,175,55,0.08), 0 0 14px rgba(212,175,55,0.10)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.12) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(212,175,55,0.08), 0 0 10px rgba(212,175,55,0.06)"; }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 8px",
                  background: "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.12) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)",
                  border: "1px solid rgba(212,175,55,0.08)",
                  borderRadius: "6px",
                  boxShadow: "0 0 20px rgba(212,175,55,0.08), 0 0 10px rgba(212,175,55,0.06)",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "transform 0.15s ease, border-color 0.25s ease, background 0.25s ease",
                }}
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="#D4AF37" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.1rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.88)",
                }}>Facebook</span>
              </a>

            </div>
          </div>

          {/* Connect — home + email + share */}
          <div>
            <SectionLabel>Connect</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", marginBottom: "10px" }}>

              {/* Home */}
              <button
                aria-label="Home"
                onClick={() => handleNavigate("/")}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.16) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(212,175,55,0.08), 0 0 12px rgba(212,175,55,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.12) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(212,175,55,0.08), 0 0 10px rgba(212,175,55,0.06)"; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.18) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(212,175,55,0.08), 0 0 14px rgba(212,175,55,0.10)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.12) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(212,175,55,0.08), 0 0 10px rgba(212,175,55,0.06)"; }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 8px",
                  background: "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.12) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)",
                  border: "1px solid rgba(212,175,55,0.08)",
                  borderRadius: "6px",
                  boxShadow: "0 0 20px rgba(212,175,55,0.08), 0 0 10px rgba(212,175,55,0.06)",
                  cursor: "pointer",
                  transition: "transform 0.15s ease, border-color 0.25s ease, background 0.25s ease",
                }}
              >
                <Home size={18} color="#D4AF37" />
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.1rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.88)",
                  lineHeight: 1,
                }}>Home</span>
              </button>

              {/* Email */}
              <a
                aria-label="Email"
                href="mailto:thefilmmaker.og@gmail.com"
                onClick={() => haptics.light()}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.16) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(212,175,55,0.08), 0 0 12px rgba(212,175,55,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.12) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(212,175,55,0.08), 0 0 10px rgba(212,175,55,0.06)"; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.18) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(212,175,55,0.08), 0 0 14px rgba(212,175,55,0.10)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.12) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(212,175,55,0.08), 0 0 10px rgba(212,175,55,0.06)"; }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 8px",
                  background: "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.12) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)",
                  border: "1px solid rgba(212,175,55,0.08)",
                  borderRadius: "6px",
                  boxShadow: "0 0 20px rgba(212,175,55,0.08), 0 0 10px rgba(212,175,55,0.06)",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "transform 0.15s ease, border-color 0.25s ease, background 0.25s ease",
                }}
              >
                <Mail size={18} style={{ color: "#D4AF37" }} />
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.1rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.88)",
                  lineHeight: 1,
                }}>Email</span>
              </a>

              {/* Share */}
              <button
                aria-label="Share"
                onClick={handleShare}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.16) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 24px rgba(212,175,55,0.08), 0 0 12px rgba(212,175,55,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.12) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(212,175,55,0.08), 0 0 10px rgba(212,175,55,0.06)"; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.18) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(212,175,55,0.08), 0 0 14px rgba(212,175,55,0.10)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)"; e.currentTarget.style.background = "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.12) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(212,175,55,0.08), 0 0 10px rgba(212,175,55,0.06)"; }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 8px",
                  background: "radial-gradient(ellipse 80% 60% at 50% 15%, rgba(212,175,55,0.12) 0%, transparent 65%), radial-gradient(ellipse 90% 70% at 50% 85%, rgba(212,175,55,0.08) 0%, transparent 65%)",
                  border: "1px solid rgba(212,175,55,0.08)",
                  borderRadius: "6px",
                  boxShadow: "0 0 20px rgba(212,175,55,0.08), 0 0 10px rgba(212,175,55,0.06)",
                  cursor: "pointer",
                  transition: "transform 0.15s ease, border-color 0.25s ease, background 0.25s ease",
                }}
              >
                <Share2 size={18} style={{ color: "#D4AF37" }} />
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.1rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.88)",
                  lineHeight: 1,
                }}>Share</span>
              </button>

            </div>
          </div>

          {/* Legal disclaimer */}
          <div className="pt-3" style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.02em",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.40)",
              textAlign: "center",
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
