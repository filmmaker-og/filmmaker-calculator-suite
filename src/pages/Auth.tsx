import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2, ShieldCheck, Home, User } from "lucide-react";
import { z } from "zod";
import brandIconF from "@/assets/brand-icon-f.jpg";
import MobileMenu from "@/components/MobileMenu";

const emailSchema = z.string().email("Please enter a valid email address");
const nameSchema = z.string().min(1, "First name is required").max(50, "Name must be less than 50 characters");

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
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
    
    // Validate first name
    const nameResult = nameSchema.safeParse(firstName.trim());
    if (!nameResult.success) {
      toast({
        title: "Invalid Name",
        description: nameResult.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    // Validate email
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      toast({
        title: "Invalid Email",
        description: emailResult.error.errors[0].message,
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
          data: {
            first_name: firstName.trim(),
          },
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#000000' }}>
      {/* Global Command Bar - Fixed Header */}
      <header className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-6" style={{ backgroundColor: '#000000', borderBottom: '1px solid #D4AF37' }}>
        {/* Left: Home Icon */}
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <Home className="w-5 h-5" style={{ color: '#D4AF37' }} />
        </button>
        
        {/* Center: Brand Title */}
        <span className="flex-1 text-center font-bebas text-xl tracking-widest" style={{ color: '#D4AF37' }}>
          FILMMAKER.OG
        </span>
        
        {/* Right: Services Link + Hamburger Menu */}
        <div className="flex items-center">
          <Link 
            to="/store" 
            className="hidden sm:block text-xs font-mono tracking-widest mr-4 hover:opacity-80 transition-opacity"
            style={{ color: '#D4AF37' }}
          >
            SERVICES
          </Link>
          <MobileMenu />
        </div>
      </header>

      {/* Main Content - Centered with padding for header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 pt-20">
        <div className="w-full max-w-md">
          {/* Brand Seal - The "F" Crest */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto border-2 overflow-hidden" style={{ borderColor: '#D4AF37' }}>
              <img 
                src={brandIconF} 
                alt="Brand Seal" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Auth Card - Terminal Structure */}
          <div className="border-2 overflow-hidden" style={{ borderColor: '#D4AF37' }}>
            {/* Terminal Header Strip - Matte Carbon */}
            <div 
              className="flex items-center gap-2 py-4 px-6"
              style={{ backgroundColor: '#111111', borderBottom: '1px solid #333333' }}
            >
              <ShieldCheck className="w-5 h-5" fill="#D4AF37" style={{ color: '#D4AF37' }} />
              <span className="font-bebas text-lg tracking-wide" style={{ color: '#D4AF37' }}>
                SECURE ACCESS CALCULATOR
              </span>
            </div>

            {/* Vault Body - Void Black */}
            <div className="p-8" style={{ backgroundColor: '#000000' }}>
              {!magicLinkSent ? (
                <>
                  {/* Magic Link Form */}
                  <form onSubmit={handleMagicLink} className="space-y-5">
                    {/* First Name Input */}
                    <div className="space-y-3">
                      <Label htmlFor="firstName" className="text-sm tracking-[0.2em] uppercase font-mono text-zinc-500">
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" fill="rgba(212, 175, 55, 0.6)" style={{ color: 'rgba(212, 175, 55, 0.6)' }} />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Your first name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="pl-12 h-14 text-lg rounded-sm text-white placeholder:text-[#666666] font-mono tracking-wide touch-input focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                          style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}
                          required
                          tabIndex={1}
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm tracking-[0.2em] uppercase font-mono text-zinc-500">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'rgba(212, 175, 55, 0.6)' }} />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          inputMode="email"
                          className="pl-12 h-14 text-lg rounded-sm text-white placeholder:text-[#666666] font-mono tracking-wide touch-input focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                          style={{ backgroundColor: '#0a0a0a', borderColor: '#333333' }}
                          required
                          tabIndex={2}
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={loading || !firstName.trim()}
                      className="w-full h-14 rounded-sm font-bebas text-xl tracking-wider transition-colors disabled:cursor-not-allowed"
                      style={{ 
                        backgroundColor: '#D4AF37', 
                        color: '#000000',
                        opacity: loading || !firstName.trim() ? 0.5 : 1 
                      }}
                      onMouseEnter={(e) => {
                        if (!loading && firstName.trim()) {
                          e.currentTarget.style.backgroundColor = '#F9E076';
                        }
                      }}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D4AF37'}
                      size="lg"
                      tabIndex={3}
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-black" />
                      ) : (
                        "REQUEST SECURE ACCESS LINK"
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 border-2 flex items-center justify-center mx-auto mb-6 animate-pulse" style={{ borderColor: '#D4AF37' }}>
                    <Mail className="w-8 h-8" style={{ color: '#D4AF37' }} />
                  </div>
                  <h2 className="font-bebas text-2xl text-white mb-3">
                    CHECK YOUR EMAIL
                  </h2>
                  <p className="text-[#888888] text-sm mb-6">
                    We've sent a secure login link to<br />
                    <span className="text-white font-medium">{email}</span>
                  </p>
                  <button
                    onClick={() => setMagicLinkSent(false)}
                    className="text-sm tracking-widest uppercase transition-colors"
                    style={{ color: '#D4AF37' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#F9E076'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#D4AF37'}
                  >
                    Try a different email
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Instructional Text - Outside Card */}
          <p className="text-center text-sm mt-6 text-zinc-400">
            A secure access link will be sent to your email.
          </p>
          <p className="text-center text-[10px] uppercase tracking-widest mt-2 font-bold text-zinc-600">
            NO PASSWORDS REQUIRED • BANK-GRADE SECURITY
          </p>

          {/* Demo Access Link - Subtle */}
          <button
            onClick={() => navigate("/calculator?reset=true")}
            className="block mx-auto mt-4 text-[10px] tracking-wide transition-colors hover:underline text-zinc-800 hover:text-zinc-600"
          >
            Demo Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;