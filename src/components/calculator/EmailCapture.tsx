import { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EmailCaptureProps {
  onSubmit?: (email: string) => Promise<void>;
}

const EmailCapture = ({ onSubmit }: EmailCaptureProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(email);
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setIsSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="matte-card p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bebas text-base tracking-wider text-foreground mb-1">
              CHECK YOUR INBOX
            </h4>
            <p className="text-xs text-muted-foreground">
              Your PDF analysis is on its way.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="matte-card p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-muted flex items-center justify-center flex-shrink-0">
          <Mail className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h4 className="font-bebas text-base tracking-wider text-foreground mb-1">
            SAVE YOUR RESULTS
          </h4>
          <p className="text-xs text-muted-foreground mb-4">
            Get a PDF of this analysis emailed to you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 h-11 bg-background border-border rounded-none text-sm"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 px-5 rounded-none bg-muted hover:bg-muted/80 text-foreground font-medium tracking-wide"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "SEND"
                )}
              </Button>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </form>

          <p className="text-[9px] text-muted-foreground/50 mt-3">
            No spam. Just your analysis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailCapture;
