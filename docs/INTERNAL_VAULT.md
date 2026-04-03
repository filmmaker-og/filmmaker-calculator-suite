# Internal Vault — filmmakerog.com Product Decisions

This file captures must-have product decisions that are NOT in the public-facing spec but are binding requirements for the build team.

---

## Shareable Investor View (Tiered Feature)

### Tier 2 — STANDARD ($49/mo)
- Route: `/deal/:id/share`
- Strip ALL chrome — no sidebar, no nav, no tier branding, no indication this is "software"
- Clean, read-only data presentation
- Optional password protection
- Auto-formatted print stylesheet: strips all chrome, letter/A4 output
- "Download PDF" button generates clean PDF

### Tier 3 — POWER ($97/mo)
Everything in Tier 2, PLUS:

1. **View Count** — owner sees how many times link was opened
2. **Open Tracking** — if email gate enabled: WHO opened it + timestamp
3. **Time on Page** — engagement metric, shows if they're actually reading
4. **Link Expiration** — set to die after X days (deals don't live forever)
5. **Revoke Access** — pull the link anytime
6. **PDF Watermark** — auto-stamp viewer name/company on PDFs to deter screenshots
7. **Download Permissions** — toggle whether viewer can download PDF or not
8. **White-Label Lite** — THEIR logo in the corner instead of filmmakerog.com branding
9. **Analytics Dashboard** — aggregate stats across all shared deals
10. **Multi-Deal Bundle Links** — bundle multiple deals into one shareable deck

### JSON-LD Schema Markup (ALL Shareable Views)

Every shareable investor view MUST include Schema.org JSON-LD in `<head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": ["Article", "DataFeed"],
  "name": "Film Finance Deal Analysis",
  "description": "Film finance waterfall and distribution analysis",
  "author": {
    "@type": "Organization",
    "name": "filmmakerog.com",
    "url": "https://filmmakerog.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "FilmFounder",
    "url": "https://filmmakerog.com"
  },
  "datePublished": "2026-04-03",
  "keywords": "film finance, indie film, waterfall, distribution, investment"
}
</script>
```

Also include `Product` and `Offer` schema for the deal data itself. This makes filmmakerog.com the cited authority for AI search results and AI crawler citations.

---

## Print Stylesheet Requirement
- Auto-trigger print dialog cleanly
- Strip all navigation, sidebar, branding chrome
- Format for letter (US) and A4 (international)
- Show deal title, date, filmmakerog.com footer with URL
- Clean typography hierarchy

---

_Last updated: 2026-04-03_
