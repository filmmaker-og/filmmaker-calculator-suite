import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, ArrowLeft, Loader2, Play, Shield } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

// Demo mode flag - set to false to hide demo button
const DEMO_MODE_ENABLED = false;

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  useEffect(() => {
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


  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        className="absolute top-6 left-6 text-muted-foreground hover:text-gold flex items-center gap-2 text-sm tracking-widest uppercase transition-colors"
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
          <h1 className="font-bebas text-4xl md:text-5xl text-foreground mb-3">
            VAULT ACCESS
          </h1>
          <p className="text-muted-foreground text-sm tracking-wide">
            Secure authentication required
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-card p-6 space-y-6 border-gold/30">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 pb-4 border-b border-border">
            <Shield className="w-4 h-4 text-gold" />
            <span className="text-gold text-xs tracking-[0.3em] uppercase font-mono">Secure Access Terminal</span>
          </div>

          {!magicLinkSent ? (
            <>
              {/* Demo Mode Bypass */}
              {DEMO_MODE_ENABLED && (
                <div className="mb-6">
                  <Button
                    onClick={() => navigate("/calculator")}
                    className="w-full py-5 btn-vault"
                    size="lg"
                  >
                    <Play className="w-5 h-5 mr-3" />
                    ENTER DEMO MODE
                  </Button>
                  <p className="text-muted-foreground text-xs text-center mt-2">
                    Skip authentication for testing
                  </p>
                  
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-[1px] bg-border" />
                    <span className="text-muted-foreground text-xs uppercase tracking-widest">or authenticate</span>
                    <div className="flex-1 h-[1px] bg-border" />
                  </div>
                </div>
              )}

              {/* Magic Link Form */}
              <form onSubmit={handleMagicLink} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-gold text-xs tracking-[0.2em] uppercase font-mono">
                    Enter Authorized Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/60" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      inputMode="email"
                      className="pl-12 py-5 bg-surface border-border rounded-md text-foreground placeholder:text-muted-foreground/50 gold-glow-focus font-mono tracking-wide touch-input"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 btn-vault group"
                  size="lg"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-3" />
                      REQUEST SECURE ACCESS KEY
                    </>
                  )}
                </Button>
              </form>

              <p className="text-muted-foreground/60 text-[10px] text-center tracking-wide font-mono">
                A one-time access key will be sent to your email
              </p>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 border border-gold flex items-center justify-center mx-auto mb-6 animate-pulse-gold">
                <Mail className="w-8 h-8 text-gold" />
              </div>
              <h2 className="font-bebas text-2xl text-foreground mb-3">
                CHECK YOUR EMAIL
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                We've sent a secure login link to<br />
                <span className="text-foreground font-medium">{email}</span>
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

        <p className="text-center text-muted-foreground text-xs mt-8 tracking-wide">
          No passwords required. Bank-grade security.
        </p>
      </div>
    </div>
  );
};

export default Auth;