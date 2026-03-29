import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowRight, Loader2 } from "lucide-react";
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
  onEmailSubmitted?: (email: string) => void;
  onSuccess?: () => void;
}

const LeadCaptureModal = ({ isOpen, onClose, onEmailSubmitted, onSuccess }: LeadCaptureModalProps) => {
  const { toast } = useToast();
  const haptics = useHaptics();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
      // Best-effort lead capture — insert to leads table
      await supabase.from('leads').insert({
        name: name.trim(),
        email: email.trim(),
        source: 'calculator',
      });
    } catch {
      // Lead capture is best-effort — let them through even if insert fails
    }

    // Save to localStorage so calculator can greet them
    localStorage.setItem('og_lead_name', name.trim());
    localStorage.setItem('og_lead_email', email.trim());

    haptics.success();
    onEmailSubmitted?.(email.trim());
    onClose();
    setLoading(false);
    // If onSuccess callback provided (e.g. already on /calculator), use it instead of hard redirect
    if (onSuccess) {
      onSuccess();
    } else {
      window.location.href = '/calculator';
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[calc(100%-2rem)] max-w-sm mx-auto p-0 gap-0"
        style={{
          background: "#0C0C0E",
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
            -webkit-box-shadow: 0 0 0 1000px rgba(255,255,255,0.95) inset !important;
            -webkit-text-fill-color: #000 !important;
            caret-color: #000;
          }
          .lead-capture-input::placeholder {
            color: rgba(0,0,0,0.40);
          }
        `}</style>
        {/* Gold accent */}
        <div className="h-[1px] w-full" style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }} />

        {
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
                className="lead-capture-input w-full h-12 px-4 text-[14px] focus:outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  color: "#000",
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: "4px",
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = "#D4AF37";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.08)";
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
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
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && email && name.trim()) {
                    e.preventDefault();
                    handleSubmit(e as unknown as React.FormEvent);
                  }
                }}
                className="lead-capture-input w-full h-12 px-4 font-mono text-[14px] focus:outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  color: "#000",
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: "4px",
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = "#D4AF37";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.08)";
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
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
        }
      </DialogContent>
    </Dialog>
  );
};

export default LeadCaptureModal;
