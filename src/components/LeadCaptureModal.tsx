import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const emailSchema = z.string().email("Please enter a valid email");
const nameSchema = z.string().min(1, "Name is required").max(100);

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeadCaptureModal = ({ isOpen, onClose }: LeadCaptureModalProps) => {
  const { toast } = useToast();
  const haptics = useHaptics();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameResult = nameSchema.safeParse(name.trim());
    if (!nameResult.success) {
      haptics.error();
      toast({ title: "Name Required", description: "Please enter your name", variant: "destructive" });
      return;
    }

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      haptics.error();
      toast({ title: "Invalid Email", description: "Please enter a valid email address", variant: "destructive" });
      return;
    }

    haptics.medium();
    setLoading(true);

    try {
      const redirectTo = `${window.location.origin}/calculator?tab=budget`;
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: redirectTo,
        },
      });
      if (error) throw error;

      haptics.success();
      setSent(true);
    } catch (error) {
      haptics.error();
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/calculator?tab=budget`;
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: redirectTo,
        },
      });
      if (error) throw error;
      haptics.light();
      toast({ title: "Link Resent", description: `Check ${email}` });
    } catch (error) {
      haptics.error();
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[calc(100%-2rem)] max-w-sm mx-auto p-0 gap-0"
        style={{
          background: "#000000",
          border: "1px solid rgba(212,175,55,0.15)",
          borderRadius: "6px",
        }}
      >
        <DialogTitle className="sr-only">Sign in to access the calculator</DialogTitle>
        {/* Autofill override — prevents Chrome painting inputs white/blue */}
        <style>{`
          .lead-capture-input:-webkit-autofill,
          .lead-capture-input:-webkit-autofill:hover,
          .lead-capture-input:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0 1000px #1A1A1A inset !important;
            -webkit-text-fill-color: #FFFFFF !important;
            caret-color: #FFFFFF;
          }
        `}</style>
        {/* Gold accent */}
        <div className="h-[1px] w-full" style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }} />

        {sent ? (
          // Magic link sent — check your email
          <div className="p-6 text-center">
            <div
              className="w-12 h-12 flex items-center justify-center mx-auto mb-4"
              style={{ border: "1px solid rgba(212,175,55,0.25)", borderRadius: "6px" }}
            >
              <Mail className="w-6 h-6 text-gold" />
            </div>
            <p className="font-bebas text-[20px] leading-[1.05] tracking-[0.06em] text-white mb-2">
              CHECK YOUR EMAIL
            </p>
            <p className="text-[14px] text-ink-secondary mb-2">
              We sent a sign-in link to
            </p>
            <p className="font-mono text-gold text-[14px] mb-6">
              {email}
            </p>
            <p className="text-[12px] text-ink-secondary mb-6">
              Click the link in your email to access the calculator.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleResend}
                disabled={loading}
                className="text-[12px] tracking-[0.12em] text-ink-secondary transition-colors"
              >
                {loading ? "Sending..." : "Didn't get it? Resend"}
              </button>
              <div>
                <button
                  onClick={() => setSent(false)}
                  className="text-[12px] text-ink-secondary transition-colors"
                >
                  Use different email
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Name + email form
          <form onSubmit={handleSubmit} className="p-6">
            <p className="font-bebas text-[20px] leading-[1.05] tracking-[0.06em] text-white text-center mb-1">
              BUILD YOUR WATERFALL
            </p>
            <p className="text-[12px] text-ink-secondary text-center mb-6">
              Enter your name and email to start building your waterfall.
            </p>

            <div className="space-y-4">
              <input
                type="text"
                autoComplete="name"
                autoCapitalize="words"
                autoFocus
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && name.trim()) {
                    e.preventDefault();
                    (e.currentTarget.nextElementSibling as HTMLInputElement)?.focus();
                  }
                }}
                className="lead-capture-input w-full h-12 px-4 text-white text-[14px] focus:outline-none transition-all"
                style={{
                  background: "#1A1A1A",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "4px",
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = "#D4AF37";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.08)";
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />

              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && email && name.trim()) {
                    e.preventDefault();
                    handleSubmit(e as unknown as React.FormEvent);
                  }
                }}
                className="lead-capture-input w-full h-12 px-4 font-mono text-white text-[14px] focus:outline-none transition-all"
                style={{
                  background: "#1A1A1A",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "4px",
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = "#D4AF37";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.08)";
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />

              <button
                type="submit"
                disabled={loading || !email || !name.trim()}
                className="w-full h-12 btn-cta-primary font-bold disabled:opacity-40"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    GET ACCESS
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeadCaptureModal;
