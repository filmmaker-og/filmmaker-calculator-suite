import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

const emailSchema = z.string().email("Please enter a valid email");
const nameSchema = z.string().min(1, "Name is required").max(100);

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSkip: () => void;
}

const LeadCaptureModal = ({ isOpen, onClose, onSuccess, onSkip }: LeadCaptureModalProps) => {
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
      const redirectUrl = `${window.location.origin}/calculator`;
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: redirectUrl,
          data: { full_name: name.trim() },
        },
      });
      if (error) throw error;

      haptics.success();
      setSent(true);

      // Auto-continue after brief confirmation
      setTimeout(() => {
        onSuccess();
      }, 1500);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-sm mx-auto bg-bg-void border-border-subtle p-0 gap-0">
        {/* Gold accent */}
        <div className="h-[2px] w-full bg-gold" />

        {sent ? (
          // Success state
          <div className="p-6 text-center">
            <div className="w-12 h-12 border border-gold/50 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-gold" />
            </div>
            <p className="font-bebas text-xl tracking-wider text-text-primary mb-2">
              CHECK YOUR EMAIL
            </p>
            <p className="text-text-dim text-sm mb-4">
              Link sent to <span className="text-gold font-mono">{email}</span>
            </p>
            <p className="text-text-dim text-xs">
              Building your waterfall...
            </p>
          </div>
        ) : (
          // Name + email form
          <form onSubmit={handleSubmit} className="p-6">
            <p className="font-bebas text-xl tracking-wider text-text-primary text-center mb-1">
              KNOW YOUR NUMBERS
            </p>
            <p className="text-text-dim text-xs text-center mb-6">
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
                className="w-full h-12 px-4 bg-bg-header border border-border-subtle text-text-primary placeholder:text-text-dim text-sm focus:border-gold focus:outline-none transition-colors"
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
                className="w-full h-12 px-4 bg-bg-header border border-border-subtle text-text-primary placeholder:text-text-dim font-mono text-sm focus:border-gold focus:outline-none transition-colors"
              />

              <button
                type="submit"
                disabled={loading || !email || !name.trim()}
                className="w-full h-12 font-semibold text-sm tracking-wider bg-gold-cta text-black hover:brightness-110 disabled:opacity-40 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    START BUILDING
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={onSkip}
              className="w-full mt-4 py-2 text-text-dim hover:text-text-mid text-[11px] tracking-wider transition-colors"
            >
              continue without saving
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeadCaptureModal;
