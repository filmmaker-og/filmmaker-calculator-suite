import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/calculator");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/calculator");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/calculator`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({
        title: "Invalid Email",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

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
      
      setMagicLinkSent(true);
      toast({
        title: "Check Your Email",
        description: "We've sent you a secure login link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send magic link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-dim hover:text-gold flex items-center gap-2 text-sm tracking-widest uppercase transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Gold Line Accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 border border-gold flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-gold" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-3">
            VAULT ACCESS
          </h1>
          <p className="text-dim text-sm tracking-wide">
            Secure authentication required
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-card p-8 space-y-6">
          {!magicLinkSent ? (
            <>
              {/* Google OAuth - Primary for Mobile */}
              <Button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-6 rounded-none bg-white text-black hover:bg-mid font-semibold tracking-wider"
                size="lg"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-[1px] bg-border" />
                <span className="text-dim text-xs uppercase tracking-widest">or</span>
                <div className="flex-1 h-[1px] bg-border" />
              </div>

              {/* Magic Link - Primary for Desktop/Corporate */}
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-mid text-xs tracking-widest uppercase">
                    Secure Email Access
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dim" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 py-6 bg-background border-border rounded-none text-foreground placeholder:text-dim gold-glow-focus"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 rounded-none btn-ghost-gold"
                  size="lg"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "SEND MAGIC LINK"
                  )}
                </Button>
              </form>
            </>
          ) : (
            /* Magic Link Sent State */
            <div className="text-center py-8">
              <div className="w-16 h-16 border border-gold flex items-center justify-center mx-auto mb-6 animate-pulse-gold">
                <Mail className="w-8 h-8 text-gold" />
              </div>
              <h2 className="font-display text-2xl text-foreground mb-3">
                CHECK YOUR EMAIL
              </h2>
              <p className="text-dim text-sm mb-6">
                We've sent a secure login link to<br />
                <span className="text-mid font-medium">{email}</span>
              </p>
              <button
                onClick={() => setMagicLinkSent(false)}
                className="text-gold text-sm tracking-widest uppercase hover:underline"
              >
                Try a different email
              </button>
            </div>
          )}
        </div>

        {/* Security Note */}
        <p className="text-center text-dim text-xs mt-8 tracking-wide">
          No passwords required. Bank-grade security.
        </p>
      </div>
    </div>
  );
};

export default Auth;
