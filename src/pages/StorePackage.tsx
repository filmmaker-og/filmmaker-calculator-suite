import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Mail, Instagram } from "lucide-react";

import { cn } from "@/lib/utils";
import { getProduct } from "@/lib/store-products";
import { getShareUrl, SHARE_TEXT, SHARE_TITLE } from "@/lib/constants";


const StorePackage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = getProduct(slug || "");
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard
      .writeText(`${SHARE_TEXT}\n\n${getShareUrl()}`)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch(() => {});
  }, []);

  // Redirect add-on product pages to store
  if (product?.isAddOn) {
    navigate("/store");
    return null;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-ink-body text-[16px] mb-4">Package not found.</p>
            <button
              onClick={() => navigate("/store")}
              className="text-ink-secondary text-[14px] hover:text-ink-body transition-colors"
            >
              Back to Packages
            </button>
          </div>
        </main>
      </div>
    );
  }

  const isFeatured = product.featured;
  const isPremium = product.tier === 3;
  const descParagraphs = product.fullDescription.split("\n\n");

  return (
    <div className="min-h-screen bg-black flex flex-col grain-overlay">
      <main className="flex-1 pb-24" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>

        {/* BACK NAV */}
        <div className="px-6 pt-6 max-w-md mx-auto">
          <button
            onClick={() => navigate("/store")}
            className="flex items-center gap-2 text-[14px] text-ink-secondary hover:text-ink-body transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Packages
          </button>
        </div>

        {/* ──────────────────────────────────────────────────────────
             PRODUCT HEADER
           ────────────────────────────────────────────────────────── */}
        <section className="px-6 pt-8 pb-6 max-w-md mx-auto">
          {product.badge && (
            <div className="mb-4">
              <span className={cn(
                "inline-block px-3 py-1.5 text-[12px] tracking-[0.15em] uppercase font-bold rounded",
                isFeatured
                  ? "bg-gold/20 border border-gold/40 text-gold"
                  : isPremium
                  ? "bg-gold/10 border border-gold/25 text-gold"
                  : "border border-gold-border text-ink-secondary"
              )}>
                {product.badge}
              </span>
            </div>
          )}

          <h1 className="font-bebas text-[40px] tracking-[0.06em] text-white leading-tight mb-3">
            {product.name.toUpperCase()}
          </h1>

          <div className="mb-6">
            {product.originalPrice && (
              <span className="font-mono text-[16px] text-ink-secondary line-through mr-2">
                ${product.originalPrice}
              </span>
            )}
            <span className="font-mono text-[40px] font-bold text-white">
              ${product.price.toLocaleString()}
            </span>
          </div>

          <div className="space-y-4">
            {descParagraphs.map((p, i) => (
              <p key={i} className="text-ink-body text-[16px] leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </section>


        {/* ──────────────────────────────────────────────────────────
             WHAT'S INCLUDED — ledger-style cards
           ────────────────────────────────────────────────────────── */}
        <section className="py-14 md:py-20 px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-bebas text-[40px] tracking-[0.08em] text-gold">
                WHAT{"\u2019"}S <span className="text-white">INCLUDED</span>
              </h2>
            </div>

            <div
              className="border border-gold-border bg-black overflow-hidden rounded-xl"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}
            >
              {product.whatsIncluded.map((item, i) => (
                <div
                  key={item.title}
                  className={cn(
                    "px-6 py-5",
                    i > 0 && "border-t border-bg-card-rule",
                  )}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <h3 className="font-bebas text-[16px] tracking-[0.06em] text-white">
                      {item.title.toUpperCase()}
                    </h3>
                  </div>
                  <p className="text-ink-secondary text-[16px] leading-relaxed pl-7">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ──────────────────────────────────────────────────────────
             WHO THIS IS FOR
           ────────────────────────────────────────────────────────── */}
        <section className="py-14 md:py-20 px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-bebas text-[40px] tracking-[0.08em] text-gold">
                WHO THIS IS <span className="text-white">FOR</span>
              </h2>
            </div>
            <p className="text-ink-body text-[16px] leading-relaxed">
              {product.whoItsFor}
            </p>
          </div>
        </section>


        {/* ──────────────────────────────────────────────────────────
             WHAT YOU'LL BUILD
           ────────────────────────────────────────────────────────── */}
        <section className="py-14 md:py-20 px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-bebas text-[40px] tracking-[0.08em] text-gold">
                WHAT YOU{"\u2019"}LL <span className="text-white">BUILD</span>
              </h2>
            </div>
            <p className="text-ink-body text-[16px] leading-relaxed">
              {product.whatYoullBuild}
            </p>

            {/* Upgrade prompt */}
            {product.upgradePrompt && (
              <div
                className="mt-8 p-6 rounded-xl"
                style={{
                  border: '1px solid rgba(212,175,55,0.15)',
                  background: 'rgba(212,175,55,0.03)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <h3 className="font-bebas text-[16px] tracking-[0.08em] text-gold mb-2">
                  {product.upgradePrompt.title}
                </h3>
                <p className="text-ink-secondary text-[16px] leading-relaxed mb-4">
                  {product.upgradePrompt.body}
                </p>
                <button
                  onClick={() => navigate(product.upgradePrompt!.link)}
                  className="text-gold text-[14px] font-semibold hover:text-gold/80 transition-colors"
                >
                  {product.upgradePrompt.cta}
                </button>
              </div>
            )}
          </div>
        </section>


        {/* ──────────────────────────────────────────────────────────
             FOOTER
           ────────────────────────────────────────────────────────── */}
        <footer className="py-8 px-6 max-w-md mx-auto">
          <p className="text-ink-secondary text-[14px] tracking-[0.04em] text-center mb-3">
            Democratizing the business of film.
          </p>
          <p className="text-ink-ghost text-[12px] tracking-wide leading-relaxed text-center">
            For educational and informational purposes only. Not legal, tax, or
            investment advice. Consult a qualified entertainment attorney before
            making financing decisions.
          </p>
        </footer>
      </main>

      {/* ──────────────────────────────────────────────────────────
           STICKY BOTTOM CTA BAR
         ────────────────────────────────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md"
        style={{
          background: 'rgba(0,0,0,0.92)',
          borderTop: '1px solid rgba(212,175,55,0.15)',
        }}
      >
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="font-bebas text-[16px] text-white truncate">
              {product.name.toUpperCase()}
            </span>
            <span className="font-mono text-[16px] font-bold text-white">
              ${product.price.toLocaleString()}
            </span>
          </div>
          <button
            onClick={() => navigate("/store#products")}
            className={cn(
              "h-12 px-6 flex-shrink-0 uppercase tracking-[0.06em]",
              isFeatured ? "btn-cta-primary" : "btn-cta-secondary"
            )}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default StorePackage;
