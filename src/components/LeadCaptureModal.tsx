import { useState, useEffect, useRef } from "react";
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
}

const LeadCaptureModal = ({ isOpen, onClose, onSuccess }: LeadCaptureModalProps) => {
  const { toast } = useToast();
  const haptics = useHaptics();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          data: { full_name: name.trim() },
        },
      });
      if (error) throw error;

      haptics.success();
      setSent(true);
    } catch (error) {
      haptics.error();
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          data: { full_name: name.trim() },
        },
      });
      if (error) throw error;
      haptics.light();
      toast({ title: "Code Resent", description: `Check ${email}` });
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

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const newCode = [...otpCode];
    newCode[index] = digit;
    setOtpCode(newCode);

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newCode = [...otpCode];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setOtpCode(newCode);
    // Focus the next empty field or the last one
    const nextEmpty = newCode.findIndex((d) => !d);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  // Auto-verify when all 6 digits are entered
  const fullCode = otpCode.join("");
  useEffect(() => {
    if (fullCode.length !== 6 || verifying) return;

    const verify = async () => {
      setVerifying(true);
      try {
        const { error } = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: fullCode,
          type: "email",
        });
        if (error) throw error;
        haptics.success();
        onSuccess();
      } catch (error) {
        haptics.error();
        setOtpCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        toast({
          title: "Invalid Code",
          description: "Please check the code and try again.",
          variant: "destructive",
        });
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [fullCode, verifying, email, haptics, onSuccess, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-sm mx-auto bg-bg-void border-border-subtle p-0 gap-0">
        {/* Gold accent */}
        <div className="h-[2px] w-full bg-gold" />

        {sent ? (
          // OTP code entry
          <div className="p-6 text-center">
            <div className="w-12 h-12 border border-gold/50 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-gold" />
            </div>
            <p className="font-bebas text-xl tracking-wider text-text-primary mb-2">
              ENTER YOUR CODE
            </p>
            <p className="text-text-dim text-sm mb-2">
              We sent a 6-digit code to
            </p>
            <p className="font-mono text-gold text-sm mb-6">
              {email}
            </p>

            {/* 6-digit OTP input */}
            <div className="flex justify-center gap-2 mb-6" onPaste={handleOtpPaste}>
              {otpCode.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  disabled={verifying}
                  className="w-11 h-14 text-center font-mono text-xl bg-bg-header border border-border-subtle text-text-primary focus:border-gold focus:outline-none transition-colors rounded-md disabled:opacity-50"
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {verifying && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <Loader2 className="w-4 h-4 animate-spin text-gold" />
                <span className="text-text-dim text-xs">Verifying...</span>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleResend}
                disabled={loading}
                className="text-text-dim hover:text-text-mid text-xs tracking-wider transition-colors"
              >
                {loading ? "Sending..." : "Didn't get it? Resend"}
              </button>
              <div>
                <button
                  onClick={() => { setSent(false); setOtpCode(["", "", "", "", "", ""]); }}
                  className="text-text-dim hover:text-text-mid text-xs transition-colors"
                >
                  Use different email
                </button>
              </div>
            </div>
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
                className="w-full h-12 btn-cta-primary disabled:opacity-40"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    SEND CODE
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
