import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useHaptics } from "@/hooks/use-haptics";
import { Loader2, Lock, Sparkles } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email");

interface EmailGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSkip?: () => void; // Only available for admin/testing
  allowSkip?: boolean; // Controlled by URL param
}

const EmailGateModal = ({ isOpen, onClose, onSuccess, onSkip, allowSkip = false }: EmailGateModalProps) => {
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
    >
      <div className="w-[calc(100%-2rem)] max-w-sm mx-auto bg-black border border-[#1A1A1A]">
        {/* Gold accent line */}
        <div className="h-[2px] w-full bg-gold" />

        {sent ? (
          // Success state
          <div className="p-8 text-center">
            <div className="w-14 h-14 border border-gold/50 flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-7 h-7 text-gold" />
            </div>
            <p className="font-bebas text-2xl tracking-wider text-white mb-2">
              YOU'RE IN
            </p>
            <p className="text-white/50 text-sm mb-4">
              Check <span className="text-gold font-mono text-xs">{email}</span> for your link
            </p>
            <p className="text-white/30 text-xs">
              Loading your waterfall...
            </p>
            <div className="mt-4">
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-gold/50" />
            </div>
          </div>
        ) : (
          // Email form - THE GATE
          <form onSubmit={handleSubmit} className="p-6">
            {/* Lock icon */}
            <div className="flex justify-center mb-5">
              <div className="w-12 h-12 border border-[#2A2A2A] flex items-center justify-center">
                <Lock className="w-6 h-6 text-white/40" />
              </div>
            </div>

            {/* Headline - reveal framing */}
            <p className="font-bebas text-2xl tracking-wider text-white text-center mb-1">
              YOUR WATERFALL IS READY
            </p>
            <p className="text-white/40 text-sm text-center mb-6 leading-relaxed">
              Enter your email to see where every dollar goes.
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
                className="w-full h-14 px-4 bg-[#0A0A0A] border border-[#2A2A2A] text-white placeholder:text-white/30 font-mono text-sm focus:border-gold/50 focus:outline-none transition-colors"
              />

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full h-14 font-black text-sm tracking-[0.15em] bg-gold text-black hover:brightness-110 disabled:opacity-40 transition-all active:scale-[0.98]"
                style={{
                  boxShadow: email ? '0 0 30px rgba(212, 175, 55, 0.3)' : 'none',
                }}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "REVEAL MY RESULTS"
                )}
              </button>
            </div>

            {/* Privacy note */}
            <p className="text-white/20 text-[10px] text-center mt-4 tracking-wide">
              We'll send you a magic link. No password needed.
            </p>

            {/* Skip - ONLY for admin/testing */}
            {allowSkip && onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="w-full mt-4 py-2 text-white/20 hover:text-white/30 text-[10px] tracking-wider transition-colors"
              >
                [dev] skip
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default EmailGateModal;
