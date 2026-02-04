import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowRight, Loader2, Mail, X } from "lucide-react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

const emailSchema = z.string().email("Please enter a valid email");

interface EmailGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSkip: () => void;
}

const EmailGateModal = ({ isOpen, onClose, onSuccess, onSkip }: EmailGateModalProps) => {
  const { toast } = useToast();
  const haptics = useHaptics();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      haptics.error();
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
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
        },
      });
      if (error) throw error;

      haptics.success();
      setSent(true);

      // Auto-continue after showing confirmation
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error: any) {
      haptics.error();
      toast({
        title: "Error",
        description: error.message || "Failed to send link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-sm mx-auto bg-black border-[#1A1A1A] p-0 gap-0">
        {/* Gold accent */}
        <div className="h-[2px] w-full bg-gold" />

        {sent ? (
          // Success state
          <div className="p-6 text-center">
            <div className="w-12 h-12 border border-gold/50 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-gold" />
            </div>
            <p className="font-bebas text-xl tracking-wider text-white mb-2">
              CHECK YOUR EMAIL
            </p>
            <p className="text-white/40 text-sm mb-4">
              Link sent to <span className="text-gold font-mono">{email}</span>
            </p>
            <p className="text-white/30 text-xs">
              Continuing to your model...
            </p>
          </div>
        ) : (
          // Email form
          <form onSubmit={handleSubmit} className="p-6">
            <p className="font-bebas text-xl tracking-wider text-white text-center mb-1">
              SAVE YOUR PROGRESS
            </p>
            <p className="text-white/40 text-xs text-center mb-6">
              Get a link to return to your model anytime
            </p>

            <div className="space-y-4">
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                autoFocus
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 bg-[#0A0A0A] border border-[#2A2A2A] text-white placeholder:text-white/30 font-mono text-sm focus:border-gold focus:outline-none transition-colors"
              />

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full h-12 font-black text-sm tracking-wider bg-gold text-black hover:bg-gold-bright disabled:opacity-40 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    SEND LINK
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>

            {/* Skip - tiny, for dev testing */}
            <button
              type="button"
              onClick={onSkip}
              className="w-full mt-4 py-2 text-white/30 hover:text-white/50 text-[11px] tracking-wider transition-colors"
            >
              continue without saving
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailGateModal;
