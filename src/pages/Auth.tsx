import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useHaptics } from "@/hooks/use-haptics";
import { Mail, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const haptics = useHaptics();
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

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      haptics.error();
      toast({
        title: "Invalid Email",
        description: emailResult.error.errors[0].message,
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
      setMagicLinkSent(true);
      toast({
        title: "Check Your Email",
        description: "We've sent you a secure login link.",
      });
    } catch (error: any) {
      haptics.error();
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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-4 bg-background border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1 text-center">
          <span className="font-bebas text-base tracking-widest text-gold">ACCESS</span>
        </div>
        <div className="w-10" />
      </header>

      <div className="h-14" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-xs">

          {!magicLinkSent ? (
            <>
              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="font-bebas text-3xl tracking-wider text-foreground mb-2">
                  UNLOCK DECK
                </h1>
                <p className="text-sm text-muted-foreground">
                  Get your personalized investor deck via email
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      inputMode="email"
                      className="pl-11 h-14 text-base rounded-none text-foreground placeholder:text-muted-foreground/50 font-mono bg-card border border-border focus:border-gold focus:ring-0"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-none font-black text-base tracking-wider bg-gold text-black hover:bg-gold-highlight"
                  style={{ boxShadow: '0 0 30px rgba(212, 175, 55, 0.3)' }}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      SEND DECK LINK
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Reassurance */}
              <p className="text-[10px] text-muted-foreground/60 text-center mt-4">
                Magic link · No password · No spam
              </p>

              {/* Skip Option */}
              <div className="mt-8 pt-6 border-t border-border text-center">
                <button
                  onClick={() => navigate("/calculator?reset=true")}
                  className="text-xs text-muted-foreground hover:text-gold transition-colors"
                >
                  Skip for now — continue to calculator
                </button>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center">
              <div className="w-16 h-16 border border-gold flex items-center justify-center mx-auto mb-6">
                <Mail className="w-7 h-7 text-gold" />
              </div>
              <h2 className="font-bebas text-2xl text-foreground mb-3 tracking-wider">
                CHECK YOUR EMAIL
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                We've sent a secure link to
                <br />
                <span className="text-foreground font-mono">{email}</span>
              </p>
              <button
                onClick={() => setMagicLinkSent(false)}
                className="text-sm text-gold hover:text-gold-highlight transition-colors"
              >
                Use a different email
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Auth;
