import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Mail,
  Instagram,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { getProduct, mainProducts } from "@/lib/store-products";
import { getShareUrl, SHARE_TEXT, SHARE_TITLE } from "@/lib/constants";
import { useState, useCallback } from "react";

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
            <p className="text-ink-body mb-4">Package not found.</p>
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
  const descParagraphs = product.fullDescription.split("\n\n");

  return (
    <div className="min-h-screen bg-black flex flex-col grain-overlay">
      <main className="flex-1 animate-fade-in pb-24">
        {/* BACK NAV */}
        <div className="px-6 pt-6 max-w-2xl mx-auto">
          <button
            onClick={() => navigate("/store")}
            className="flex items-center gap-2 text-[14px] text-ink-secondary hover:text-ink-body transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Packages
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            HERO
            ═══════════════════════════════════════════════════════════ */}
        <section className="px-6 pt-8 pb-2 max-w-2xl mx-auto">
          {product.badge && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1.5 rounded-full bg-gold/[0.15] border border-gold/30 text-gold text-[12px] tracking-[0.15em] uppercase font-bold">
                {product.badge}
              </span>
            </div>
          )}

          <h1 className="font-bebas text-3xl md:text-4xl text-white leading-tight mb-3">
            {product.name.toUpperCase()}
          </h1>

          <div className="mb-6">
            {product.originalPrice && (
              <span className="font-mono text-lg text-ink-secondary line-through mr-2">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="font-mono text-4xl font-medium text-white">
              ${product.price.toLocaleString()}
            </span>
          </div>

          <div className="space-y-4 mb-2">
            {descParagraphs.map((p, i) => (
              <p key={i} className="text-ink-body text-[14px] leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            WHAT'S INCLUDED
            ═══════════════════════════════════════════════════════════ */}
        <section id="whats-included" className="px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <p className="text-ink-secondary text-[12px] tracking-[0.2em] uppercase text-center mb-2 font-semibold">
              Deliverables
            </p>
            <h2 className="font-bebas text-3xl tracking-[0.06em] text-gold text-center mb-8">
              WHAT'S <span className="text-white">INCLUDED</span>
            </h2>
            <div className="space-y-4">
              {product.whatsIncluded.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-gold-border bg-transparent p-5"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <h3 className="font-bebas text-lg tracking-[0.06em] text-white">
                      {item.title.toUpperCase()}
                    </h3>
                  </div>
                  <p className="text-ink-body text-[14px] leading-relaxed pl-7">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            WHO THIS IS FOR
            ═══════════════════════════════════════════════════════════ */}
        <section id="who-its-for" className="px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <p className="text-ink-secondary text-[12px] tracking-[0.2em] uppercase text-center mb-2 font-semibold">
              Ideal For
            </p>
            <h2 className="font-bebas text-3xl tracking-[0.06em] text-gold text-center mb-8">
              WHO THIS IS <span className="text-white">FOR</span>
            </h2>
            <p className="text-ink-body text-[14px] leading-relaxed">
              {product.whoItsFor}
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            WHAT YOU'LL BUILD
            ═══════════════════════════════════════════════════════════ */}
        <section id="what-youll-build" className="px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <p className="text-ink-secondary text-[12px] tracking-[0.2em] uppercase text-center mb-2 font-semibold">
              The Result
            </p>
            <h2 className="font-bebas text-3xl tracking-[0.06em] text-gold text-center mb-8">
              WHAT YOU'LL <span className="text-white">BUILD</span>
            </h2>
            <p className="text-ink-body text-[14px] leading-relaxed">
              {product.whatYoullBuild}
            </p>

            {/* Upgrade prompt (Blueprint only) */}
            {product.upgradePrompt && (
              <div className="mt-6 rounded-xl border border-gold/20 bg-gold/[0.04] p-5">
                <h3 className="font-bebas text-lg tracking-[0.08em] text-gold mb-2">
                  {product.upgradePrompt.title}
                </h3>
                <p className="text-ink-body text-[14px] leading-relaxed mb-4">
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

        {/* ═══════════════════════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════════════════════ */}
        <footer className="py-10 px-6">
          <div className="max-w-sm mx-auto">
            <div className="grid grid-cols-2 gap-3 mb-8 max-w-[340px] mx-auto">
              <a
                href="mailto:thefilmmaker.og@gmail.com"
                className="flex items-center justify-center gap-2 text-[14px] tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 rounded-lg border border-gold-border hover:border-gold/30"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </a>
              <a
                href="https://www.instagram.com/filmmaker.og"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-[14px] tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 rounded-lg border border-gold-border hover:border-gold/30"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>
            </div>

            <div className="flex items-center justify-center mb-2">
              <span className="font-bebas text-3xl tracking-[0.2em] text-gold">
                FILMMAKER<span className="text-white">.OG</span>
              </span>
            </div>
            <p className="text-ink-secondary/60 text-[12px] tracking-wide text-center mb-4">
              Democratizing the business of film.
            </p>
            <p className="text-ink-secondary/60 text-[12px] tracking-wide leading-relaxed text-center">
              For educational and informational purposes only. Not legal, tax, or
              investment advice. Consult a qualified entertainment attorney before
              making financing decisions.
            </p>
          </div>
        </footer>
      </main>

      {/* ═══════════════════════════════════════════════════════════
          STICKY BOTTOM CTA BAR
          ═══════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-gold-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="font-bebas text-base text-white truncate">
              {product.name.toUpperCase()}
            </span>
            <span className="font-mono text-lg font-medium text-white">
              ${product.price.toLocaleString()}
            </span>
          </div>
          <button
            onClick={() => navigate("/store#products")}
            className={cn(
              "h-12 px-6 flex-shrink-0 text-[14px]",
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
