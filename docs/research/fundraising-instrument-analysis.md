<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

### 1. Where Models Agree

| Finding | GPT-5.4 Thinking | Claude Opus 4.6 Thinking | Gemini 3.1 Pro Thinking | Evidence |
| :-- | :-- | :-- | :-- | :-- |
| Raise structure should keep investor count low (≈4–8) with a meaningful minimum check | ✓ | ✓ | ✓ | All recommend ~4–8 investors to minimize admin/cap-table complexity and keep terms uniform. |
| SAFE / convertible-style instrument usually fits early SaaS better than priced equity for \$40k | ✓ | ✓ | ✓ | All flag direct equity as costly/complex due to early valuation, higher legal overhead, and cap table issues.[^1_1][^1_2] |
| Avoid heavy investor control rights (board seats, vetoes, anti-dilution) in a F\&F round | ✓ | ✓ | ✓ | All recommend keeping F\&F passive: basic updates only; avoid governance/control hooks inappropriate for small checks.[^1_1] |
| Securities compliance still applies (no “friends \& family exemption”); use a proper exemption and documentation | ✓ | ✓ | ✓ | Multiple sources: securities laws apply; 506(b) safe harbor limits and disclosure needs, plus Form D filing timing.[^1_2][^1_3][^1_4] |
| Use standardized docs/templates where possible (YC SAFE; standard note forms) to reduce friction | ✓ | ✓ | ✓ | YC SAFE templates are meant to be standard and low-negotiation; note templates also exist via reputable generators.[^1_1][^1_5] |


***

### 2. Where Models Disagree

| Topic | GPT-5.4 Thinking | Claude Opus 4.6 Thinking | Gemini 3.1 Pro Thinking | Why They Differ |
| :-- | :-- | :-- | :-- | :-- |
| Primary recommended instrument | YC post-money SAFE (cap-only) | Convertible note (SAFE secondary) | YC post-money SAFE (cap + discount) | GPT-5.4 prioritizes no maturity/interest pressure for a solo founder.[^1_1] Claude prioritizes investor comfort/protection via debt framing and a defined timeline.[^1_6] Gemini prioritizes SaaS founder-friendliness plus a standard discount to “reward” early risk. |
| Valuation cap level for a \$40k F\&F round | ~\$0.75M–\$1.25M | ~\$0.5M–\$0.75M | ~\$2M–\$3M | Different assumptions about (a) how early/pre-revenue you are, (b) how much upside F\&F should get, and (c) how much “anchor risk” a low cap creates for later rounds. Benchmarks cited by GPT (Carta under-\$250k caps) are much higher but he adjusts downward for stage.[^1_7] Gemini keeps dilution low to avoid future friction. |
| Minimum check size | \$2.5k | \$2.5k | \$5k–\$10k | Gemini is most cap-table/admin conservative (fewer investors). GPT/Claude allow smaller checks to widen participation while still limiting count. |
| Discount on SAFE | No discount (cap-only) | Often 20% (esp. for SAFE or note) | 20% discount | GPT emphasizes simplicity for non-tech F\&F (one variable: cap).[^1_1] Claude/Gemini treat discount as “market standard reward,” aligning with common note terms.[^1_6] |
| Revenue-share / profit participation viability | “Secondary option only if demanded” | “Possible but often awkward; cap 1.5–2.0x” | “Do not use; fatal for SaaS” | Gemini weighs future VC/angel perception and cashflow reinvestment most heavily. GPT/Claude leave room for film-industry expectations but warn about drag and complexity.[^1_8][^1_9] |


***

### 3. Unique Discoveries

| Model | Unique Finding | Why It Matters |
| :-- | :-- | :-- |
| GPT-5.4 Thinking | Ties loan interest-rate choice to IRS AFR (e.g., March 2026 short-term AFR 3.59%) and suggests using AFR to avoid imputed-interest/gift issues | If you use a simple loan with family, AFR can be a practical floor to reduce tax headaches and “was this a gift?” ambiguity.[^1_10][^1_11] |
| Claude Opus 4.6 Thinking | Suggests an “MFN” concept for convertible terms (and optional maturity outcomes: extend/repay/convert) | Helps keep early investors from feeling disadvantaged if you later issue better terms, without granting heavy control rights. |
| Gemini 3.1 Pro Thinking | “Film vs tech culture clash” warning: film investors expect recoup/profit-participation norms; you must explicitly reframe this as a software company | This is a real relationship-risk reducer for your specific network—prevents mismatched expectations about payouts and timelines. |


***

## 4. Comprehensive Analysis

### High-Confidence Findings

All three models converge on the operational realities of a \$40,000 friends-and-family raise for a single-founder SaaS + bespoke modeling business like FILMMAKER.OG: keep the round simple, keep the investor count low, and avoid governance complexity. The strongest shared guidance is to structure the raise so you can keep building—meaning identical terms for everyone, a small set of investors (roughly 4–8), and a minimum check size that doesn’t create a “micro-investor swarm” you’ll have to manage for years. For your product—software with some bespoke services—this cleanliness matters because future professional investors will scrutinize your cap table and early documents.

The models also agree that priced equity is usually the wrong tool at this size and stage. A priced equity round forces you to pick a valuation now (when you likely have limited SaaS traction), and it tends to cost more in legal/admin than it’s worth for \$40k. Similarly, they align on “rights hygiene”: friends-and-family investors should not get board seats, veto rights, special anti-dilution, or other control provisions that create ongoing conflict or future financing friction. Instead, you can offer lightweight “trust rights”: periodic updates and an annual high-level financial summary.[^1_1]

Compliance is another high-confidence area: there is no special securities-law carveout just because investors are friends and family. If you’re offering a security (SAFE, convertible note, equity, revenue-share/profit participation), you generally need to rely on an exemption (often Reg D 506(b) in the US), avoid general solicitation, and document the offering properly. If you use Reg D, Form D is typically due within 15 days after the first sale (the first time an investor is irrevocably committed).  This is exactly the sort of “small but fatal” operational detail that gets missed in informal F\&F raises.[^1_2][^1_4][^1_3]

### Areas of Divergence

The main strategic disagreement is instrument choice: GPT-5.4 and Gemini prefer a SAFE as the primary instrument, while Claude prefers a convertible note. The difference is mostly about *relationship and timeline risk*. Claude emphasizes that family investors often understand a “loan that can turn into equity” more readily than a pure future-equity agreement, and that a maturity date can create a forcing function to resolve the instrument (convert, repay, or extend). GPT-5.4 argues the opposite: maturity dates are precisely what you do *not* want with family, because if the company isn’t in a position to repay when maturity hits, you’re forced into awkward renegotiations that can damage relationships. Gemini aligns more with GPT on eliminating repayment pressure and preserving cash for growth.[^1_6][^1_1]

They also disagree on valuation cap magnitude. GPT-5.4 proposes roughly \$0.75M–\$1.25M, Claude is even lower (~\$0.5M–\$0.75M), while Gemini is much higher (~\$2M–\$3M). The practical way to reconcile this is to treat the cap less as “true valuation” and more as (a) your early-believer reward and (b) your future fundraising flexibility constraint. A *very low* cap can make F\&F happy but can “anchor” your next round or create unexpectedly high dilution when you raise real money; a *very high* cap may feel unfair to early believers (especially given your endorsements and domain credibility) but keeps your future cap table cleaner. This is a values decision as much as a market decision.[^1_7]

Discount is another divergence: GPT-5.4 prefers cap-only for simplicity, while Claude and Gemini typically include a 20% discount (common in convertible notes and sometimes SAFEs). The simplest rule for F\&F is: **pick one lever** (cap *or* discount) unless you have sophisticated investors. Using only a cap reduces confusion; using only a discount can backfire if your next financing is another convertible round (discount may not apply depending on document structure), which is why nonstandard “F\&F SAFE” variants exist.[^1_12][^1_6]

Revenue-share/profit participation is contentious. Gemini says “don’t,” mainly because it taxes early revenue that should be reinvested and can spook future tech investors. GPT-5.4/Claude allow it only if a specific investor insists, and warn about the definitional/legal complexity (“what counts as revenue?”) and the long-term drag. For your SaaS + bespoke hybrid, revenue-share is especially tricky because bespoke revenue may spike irregularly and could unintentionally accelerate payouts, while SaaS revenue is what you want to reinvest to scale.[^1_8][^1_9]

### Unique Insights Worth Noting

GPT-5.4’s AFR point is particularly useful if you decide to do a simple loan with a family member: using at least the IRS Applicable Federal Rate can reduce imputed-interest/gift characterization risk. For March 2026, short-term AFR is cited as 3.59% annually.  This is not a “business optimization” insight so much as a “family harmony + tax hygiene” insight.[^1_10]

Gemini’s “film vs tech culture clash” is also specific to you. Your endorsements and background sit in the film-finance world, where investors are used to profit participation/recoup waterfalls. Your Codex feature should explicitly reframe: “This is a software company; returns come from equity value on a future financing or exit, not film-style recoup.” That single paragraph will prevent many misunderstandings.

### Recommendations (actionable, tailored)

**Recommendation for your Codex feature default:** use a **standard YC Post-Money SAFE** as the primary instrument (lowest admin burden; no interest/maturity pressure), with **one economic lever** (a valuation cap), and offer an **optional pro rata side letter** only for larger checks. If you expect pushback from more conservative family members, provide a “fallback path” in the Codex flow: a **simple promissory note** (loan) at or above AFR with either deferred repayment or a revenue-triggered start—while clearly warning that debt creates relationship risk if the business can’t repay.[^1_10][^1_1]

Below is the copyable, Codex-ready guidance + sample language you requested.

***

# Codex-Ready Guidance + Terms (Copyable)

## 0) Not legal advice (required snippet)

> **Not legal or tax advice.** This is general educational guidance. Startup fundraising involves securities laws and tax considerations even for friends and family. Consult a startup attorney (securities/Reg D) and a CPA before accepting funds.[^1_2]

***

## 1) Suggested “ask” structures to raise \$40,000

### Option A (recommended default): “4–8 supporters”

- **Target:** \$40,000 total
- 
# investors: 4–8

- **Min check:** \$2,500 (floor)
- **Target check:** \$5,000–\$10,000
- **Max check:** \$10,000–\$15,000 (cap concentration)
- **Close window:** rolling close, but aim to finish within ~60 days


### Option B (cleanest admin): “Unit-based”

- Offer **4 units of \$10,000**.
- Allow **half units of \$5,000** if needed.
- Avoid <\$2,500 checks unless it’s truly necessary.

**Implementation note for Codex:** enforce (a) max investor count, (b) min check, (c) identical terms across investors.

***

## 2) Instrument comparison (family/friends round, this startup)

### Simple loan (promissory note)

**Pros:** familiar, no dilution, straightforward.
**Cons:** repayment pressure; if you can’t repay, relationships get damaged; for family loans, consider AFR as a floor to reduce tax issues.[^1_10]

### Convertible note

**Pros:** familiar “loan that becomes equity”; discount/cap reward early risk; investor comfort from “debt.”[^1_6]
**Cons:** **maturity clock** and potential renegotiation; more moving parts than SAFE.[^1_6]

### SAFE (recommended default)

**Pros:** no interest, no maturity; standard YC templates; low negotiation surface; supports rolling closes.[^1_1]
**Cons:** some F\&F don’t understand “future equity” without education; no repayment right.

### Direct equity (priced round)

**Pros:** clarity of ownership.
**Cons:** forces valuation now; more legal/admin cost; cap table complexity—usually not worth it for \$40k.[^1_1]

### Revenue-share / profit participation

**Pros:** familiar to film investors; can return cash before exit.
**Cons:** definitional complexity; ongoing drag; may deter later tech investors; still can be a security.[^1_9]

***

## 3) Recommended investor economics \& terms (defaults)

### Primary recommendation: YC Post-Money SAFE (Valuation Cap, no discount)

Use the standard YC template as your base.[^1_1]

**Suggested defaults (Codex settings):**

- **Valuation Cap:** pick a single number your product can justify *without boxing you in* later. (Models disagreed; offer a selectable range in Codex.)
    - Conservative founder-friendly: **\$2.0M–\$3.0M** (lower dilution; easier future rounds)
    - Investor-rewarding: **\$0.75M–\$1.25M** (more upside for early believers)
- **Discount:** **None** (simplicity)
- **Interest / maturity:** none (SAFE)
- **Minimum check:** \$2,500 (or \$5,000 if you want fewer investors)
- **Maximum check:** \$10,000–\$15,000
- **Pro rata rights:** optional side letter only; offer only for **\$5,000+ or \$10,000+** checks.[^1_1]
- **Qualified financing trigger (for conversion definitions in your summary):** e.g., **\$250,000+ priced equity financing** (you can mirror the SAFE’s definitions and simply explain it in plain language)


### Secondary fallback: Simple loan (if an investor refuses SAFE)

- **Term:** 24–36 months
- **Rate:** at/above AFR floor; March 2026 short-term AFR is cited as **3.59%**.[^1_10]
- **Repayment:** ideally **deferred** (e.g., interest accrues; principal due at maturity) unless you already have reliable revenue.

***

## 4) Repayment timeline \& expectations (copyable)

### For SAFE (set expectations)

- **Time horizon:** “Likely 2–5+ years; may never return capital.”
- **Return mechanism:** conversion in a future priced round or payout/convert on acquisition/dissolution (per SAFE mechanics).[^1_1]


### For a loan (if used)

- **Realistic commitment window:** 24–36 months only if you have a credible revenue plan.
- Prefer **balloon maturity** or **revenue-triggered** repayment start rather than fixed amortization in year one.

***

## 5) Investor rights to offer / avoid (F\&F appropriate)

**Offer (lightweight):**

- Quarterly email updates (short)
- Annual unaudited summary (revenue, expenses, key milestones)

**Avoid:**

- board seats/observers
- voting/veto rights pre-conversion
- anti-dilution beyond SAFE math
- consent rights over operations/fundraising

***

## 6) Sample plain-language pitch ask + one-paragraph term summary

### Pitch ask (copy/paste)

> I’m raising **\$40,000** from a small group of friends and family to fund the next build-and-launch phase of **FILMMAKER.OG**, a film-finance tool that combines **SaaS** (subscription software) with **bespoke/ad-hoc financial modeling** for independent producers. I’m a second-generation filmmaker and producer’s rep, hip-pocketed by CAA, and I’ve worked with Netflix. I’ve also received endorsements from **Brian O’Shea (The Exchange / Voltage), Rufus Parker (P2 Films), and Brian Sampey (Ares Management)**—which I’m using as credibility for the market need and my industry access (not as any guarantee of outcomes).
>
> I’m taking **\$2,500–\$10,000** checks on the same terms using a **YC SAFE (Simple Agreement for Future Equity)**. This is **not a loan**—it’s an early investment that converts into equity if I later raise a priced funding round or if the company is acquired. This is high-risk and you should only invest what you can afford to lose.

### One-paragraph term summary (copy/paste)

> **Friends \& Family SAFE Summary (not legal advice):** Investor purchases a **Post-Money SAFE (YC standard)** with a **valuation cap of $[CAP]**, **no discount**, **no interest**, and **no maturity date**. The SAFE converts into equity upon a future priced equity financing (or is handled per the SAFE in a liquidity event/dissolution). Minimum check is **$[MIN]**; maximum check is **\$[MAX]**. Investor receives no voting or board rights prior to conversion. Founder will provide **quarterly email updates** and an **annual high-level financial summary**. This is a private offering and securities laws apply.[^1_2][^1_1]

***

## 7) Sample concise term sheet / template language (SAFE)

### SAFE “term summary” header (drop-in)

```text
FILMMAKER.OG — FRIENDS & FAMILY SAFE (SUMMARY OF KEY TERMS)
(Not legal advice; for discussion. Use the standard YC Post-Money SAFE as the definitive document.)

Issuer: [Company legal name]
Instrument: YC Post-Money SAFE (Valuation Cap, No Discount)[web:28]
Total raise: Up to $40,000
Minimum check: $[2,500 or 5,000]
Maximum check: $[10,000–15,000]

Economics
- Valuation Cap: $[CAP]
- Discount: None
- Interest / Maturity: None (SAFE is not debt)

Investor Rights
- Information: Quarterly email update + annual high-level summary
- Pro rata: Optional side letter for checks ≥ $[5,000 or 10,000]
- Governance: No board seat, no observer, no voting pre-conversion

Risk
- High risk; possible total loss; illiquid; long time horizon.
```


***

## 8) Best practices for raising from family \& friends (Codex checklist)

**Documentation \& process**

- Use one instrument and identical terms.
- Use an investor questionnaire / suitability acknowledgment (especially if relying on Reg D).
- Avoid public solicitation if relying on private placement concepts.[^1_3]
- Track every investor + signed doc + payment date in a simple ledger.

**Compliance basics (US-oriented)**

- Under Reg D Rule 506(b), you can sell to unlimited accredited investors and up to 35 non-accredited (who must be sophisticated), with added disclosure obligations for non-accredited investors.[^1_3]
- Form D is generally due within **15 days after first sale**.[^1_4]

**Expectation-setting**

- Put “can lose 100%” in writing.
- Separate investor updates from family gatherings (process boundary).

**Tax basics (flag for CPA)**

- If you do a **family loan**, consider using AFR as a floor to reduce imputed interest/gift risk.[^1_10]
- If you issue equity later, ask counsel/CPA about QSBS eligibility (don’t promise it).

**Next steps**

- Have startup counsel review your plan before you take the first check.
- Ensure IP is owned/assigned to the company entity before fundraising (diligence hygiene).

***

## 9) Commonly missed items (tailored to SaaS + film-finance)

- **Film vs SaaS expectations:** explicitly state “this is not a film waterfall/profit participation investment; it’s a software company equity-style risk.” (Gemini insight)
- **Too many tiny checks:** creates long-term admin burden and scares later investors.
- **Overstating endorsements:** get permission to use names; never imply endorsers guarantee returns.
- **Maturity-date traps (if using notes):** don’t set a maturity you can’t handle; plan maturity outcomes up front.[^1_6]

***

If you tell me (a) your current legal entity type (LLC vs Delaware C-Corp), (b) whether most investors will be accredited, and (c) your current revenue/MRR (if any), I can “lock” a single recommended cap/min-check setting and produce a final one-page Codex template with fill-in fields only.
<span style="display:none">[^1_100][^1_101][^1_102][^1_103][^1_104][^1_105][^1_106][^1_107][^1_108][^1_109][^1_110][^1_111][^1_112][^1_113][^1_114][^1_115][^1_116][^1_117][^1_118][^1_13][^1_14][^1_15][^1_16][^1_17][^1_18][^1_19][^1_20][^1_21][^1_22][^1_23][^1_24][^1_25][^1_26][^1_27][^1_28][^1_29][^1_30][^1_31][^1_32][^1_33][^1_34][^1_35][^1_36][^1_37][^1_38][^1_39][^1_40][^1_41][^1_42][^1_43][^1_44][^1_45][^1_46][^1_47][^1_48][^1_49][^1_50][^1_51][^1_52][^1_53][^1_54][^1_55][^1_56][^1_57][^1_58][^1_59][^1_60][^1_61][^1_62][^1_63][^1_64][^1_65][^1_66][^1_67][^1_68][^1_69][^1_70][^1_71][^1_72][^1_73][^1_74][^1_75][^1_76][^1_77][^1_78][^1_79][^1_80][^1_81][^1_82][^1_83][^1_84][^1_85][^1_86][^1_87][^1_88][^1_89][^1_90][^1_91][^1_92][^1_93][^1_94][^1_95][^1_96][^1_97][^1_98][^1_99]</span>

<div align="center">⁂</div>

[^1_1]: https://www.ycombinator.com/documents

[^1_2]: https://www.jacksonkelly.com/the-legal-brief/theres-no-such-thing-as-friends-and-family-under-the-securities-laws/

[^1_3]: https://www.sec.gov/resources-small-businesses/exempt-offerings/private-placements-rule-506b

[^1_4]: https://www.sec.gov/resources-small-businesses/exempt-offerings/filing-form-d-notice

[^1_5]: https://www.cooleygo.com/documents/series-seed-notes-financing-package/

[^1_6]: https://www.cooleygo.com/convertible-debt/

[^1_7]: https://carta.com/data/state-of-pre-seed-q2-2025/

[^1_8]: https://qubit.capital/blog/equity-vs-revenue-share

[^1_9]: https://www.upcounsel.com/revenue-share-partnership-agreement

[^1_10]: https://www.eidebailly.com/insights/blogs/2026/2/202603-afr

[^1_11]: https://www.irs.gov/pub/irs-drop/rr-26-06.pdf

[^1_12]: https://siliconhillslawyer.com/2021/08/24/friends-family-ff-safe-template/

[^1_13]: https://ppmlawyers.com/raising-capital-from-friends-family-what-the-law-really-says/

[^1_14]: https://www.frantzward.com/the-non-existent-friends-and-family-exemption-under-federal-and-state-securities-law/

[^1_15]: https://www.huntlawgrp.com/raising-friends-and-family-capital-avoiding-securities-violations-in-informal-rounds/

[^1_16]: https://www.thevccorner.com/p/friends-and-family-funding-guide

[^1_17]: https://www.rho.co/blog/friends-and-family-funding-guide-for-startups

[^1_18]: https://krownelaw.com/theres-no-friends-and-family-exemption/

[^1_19]: https://www.law.cornell.edu/wex/rule_506

[^1_20]: https://carta.com/learn/private-funds/regulations/regulation-d/506b-vs-506c/

[^1_21]: https://www.novoco.com/resource-centers/affordable-housing-tax-credits/2026-applicable-federal-rates

[^1_22]: https://www.nationalfamilymortgage.com/afr-rates/

[^1_23]: https://www.cooleygo.com/glossary/convertible-note/

[^1_24]: https://www.gilion.com/basics/convertible-notes

[^1_25]: https://www.svb.com/startup-insights/raising-capital/raising-startup-funds-friends-and-family/

[^1_26]: https://www.nolo.com/legal-encyclopedia/raising-private-money-gifts-loans-30078.html

[^1_27]: https://www.merceradvisors.com/insights/family-finance/diving-into-tax-consequences-with-intrafamily-gifts-and-loans/

[^1_28]: https://www.allied.vc/articles/safe-vs-convertible-notes-key-differences

[^1_29]: https://startupproject.org/blog/convertible-note-guide/

[^1_30]: https://promise.legal/resources/safe-vs-convertible

[^1_31]: https://www.cooleygo.com/documents/y-combinator-safe-financing-document-generator/

[^1_32]: https://www.cakeequity.com/guides/safe-vs-convertible-note

[^1_33]: https://www.joinarc.com/guides/convertible-note

[^1_34]: https://zyner.io/blog/safe-agreement-template-for-pre-seed

[^1_35]: https://www.clockwork.app/blog/convertible-notes-term-sheet-template

[^1_36]: https://angelcapitalassociation.org/wp-content/uploads/2024/12/ACA-Model-Convertible-Note-Term-Sheet-Version-1.2-11_24163750677.4-C.docx

[^1_37]: https://help.pulley.com/en/articles/6080319-how-to-fill-out-each-safe-field

[^1_38]: https://www.wallstreetprep.com/knowledge/safe-note/

[^1_39]: https://www.rimonlaw.com/safes-2-0-ycombinator-updates-the-form-2/

[^1_40]: https://gesmer.com/publications/safe-vs-convertible-note/

[^1_41]: https://blog.promise.legal/startup-central/how-to-structure-a-friends-and-family-investment-agreement-a-practical-legal-checklist-for-startup-founders/

[^1_42]: https://shaycpa.com/understanding-investor-information-rights-a-guide-for-founders/

[^1_43]: https://www.vestd.com/blog/friends-and-family-investment-rounds-a-founders-guide

[^1_44]: https://www.linkedin.com/posts/mike-schmansky_your-first-sale-starts-a-15-day-clock-activity-7376269122151534592-GrbM

[^1_45]: https://www.cooleygo.com/frequently-asked-questions-convertible-debt/

[^1_46]: https://www.varnumlaw.com/insights/reasons-to-include-only-accredited-investors-in-your-rule-506b-private-offering/

[^1_47]: https://www.ssm.legal/blog/friends-family-complying-with-securities-laws

[^1_48]: https://www.colonialfilings.com/blog/is-reg-d-filing-required-for-friends-and-family/

[^1_49]: https://www.joinarc.com/guides/friends-and-family-round

[^1_50]: https://ff.co/startup-statistics-guide/

[^1_51]: https://resources.b2venture.vc/fundraising/round-terms-and-term-sheets

[^1_52]: https://www.dlapiper.com/insights/publications/accelerate/funding-equity-debt/friends-and-family-round-vs-angel-round

[^1_53]: https://qubit.capital/blog/convertible-debt-safe-notes

[^1_54]: https://www.heuking.de/en/landingpages/the-venture-capital-playbook/sample-term-sheet.html

[^1_55]: https://iota-finance.com/iota-finance-blog/prepare-your-startups-financials-for-a-friends-and-family-round

[^1_56]: https://foundersnetwork.com/convertible-note-vs-equity/

[^1_57]: https://www.failory.com/blog/seed-funding

[^1_58]: https://mintlify.com/Ro5s/Startup-Starter-Pack/library/yc/safe-agreements

[^1_59]: https://www.youtube.com/watch?v=KZY1n_FfSMI

[^1_60]: https://www.ycombinator.com/library/4A-a-guide-to-seed-fundraising

[^1_61]: https://www.reddit.com/r/startups/comments/hy76r4/how_to_structure_friends_and_family_round/

[^1_62]: https://www.okeeffeattorneys.com/beware-of-offering-stock-to-friends-and-family/

[^1_63]: https://www.linkedin.com/pulse/ycs-secret-safe-chris-harvey-rsffc

[^1_64]: https://carta.com/learn/startups/fundraising/

[^1_65]: https://montague.law/blog/a-comprehensive-guide-to-the-yc-safe/

[^1_66]: https://carta.com/learn/startups/fundraising/pre-seed-funding/

[^1_67]: https://www.cooleygo.com/collections/understanding-convertible-debt/

[^1_68]: https://www.cooleygo.com/understanding-the-valuation-cap/

[^1_69]: https://www.cooleygo.com/documents/kiss-convertible-debt-equity-agreements/

[^1_70]: https://support.carta.com/kb/guide/en/how-to-use-the-safe-and-convertible-note-calculator-7puQPQ3bT3/Steps/3724995

[^1_71]: https://www.irs.gov/pub/irs-drop/rr-26-03.pdf

[^1_72]: https://www.cooleygo.com/calculating-share-price-outstanding-convertible-notes-or-safes/

[^1_73]: https://capwave.ai/blog/safes-vs-convertible-notes-which-one-is-right-for-your-startup

[^1_74]: https://www.cohenco.com/knowledge-center/insights/march-2025/how-convertible-notes-and-safes-can-help-tech-companies-address-short-term-cash-flow

[^1_75]: https://www.reddit.com/r/startups/comments/1c5mcmj/friend_and_family_round_explain_to_me_like_im_5/

[^1_76]: https://whatstrending.fenwick.com/post/convertible-notes-safes-still-popular-but-terms-are-tightening

[^1_77]: https://ecvc.wsgr.com/a/web/vgnKwoeAkUKT6MTc96jYem/entrepreneurs-report-q1-2025.pdf

[^1_78]: https://www.hustlefund.vc/post/angel-squad-convertible-notes-investing-guide-terms-valuations-negotiation-tactics

[^1_79]: https://fi.co/insight/how-to-raise-a-friends-and-family-round

[^1_80]: https://www.metal.so/collections/2025-pre-seed-funding-benchmarks-saas-startups-round-size-valuation-equity

[^1_81]: https://www.saastr.com/can-i-use-y-combinators-safe-as-it-is-for-friends-and-family-round-without-hiring-a-lawyer-to-look-at-it/

[^1_82]: https://www.metal.so/collections/2025-pre-seed-round-size-valuation-benchmarks-us-saas-founders

[^1_83]: https://futuresight.ventures/futuresight-ventures-top-15-most-compelling-pre-seed-and-seed-benchmarks-courtesy-of-carta/

[^1_84]: https://navi.com/blog/revenue-sharing/

[^1_85]: https://carta.com/data/state-of-pre-seed-2025/

[^1_86]: https://www.paddle.com/resources/revenue-sharing

[^1_87]: https://www.linkedin.com/posts/peterjameswalker_startups-founders-fundraising-activity-7344405634752069633-kF_Q

[^1_88]: https://www.sec.gov/resources-small-businesses/exempt-offerings/exemption-limited-offerings-not-exceeding-10-million-rule-504-regulation-d

[^1_89]: https://www.varnumlaw.com/insights/shared-earnings-arrangements-offer-flexibility-for-startups-investors/

[^1_90]: https://www.alexanderjarvis.com/post-money-safe-calculator/

[^1_91]: https://www.linkedin.com/posts/amoswatene_saas-startups-valuation-activity-7338976235328286720-Kwwe

[^1_92]: https://globalcapitalnetwork.com/what-investors-really-want-to-see-in-a-startup-before-saying-yes/

[^1_93]: https://www.brex.com/journal/family-and-friends-funding

[^1_94]: https://cyberbuilders.substack.com/p/balancing-growth-and-profitability

[^1_95]: https://anthonylawllc.com/blog/a-primer-on-raising-money-from-friends-and-family-for-your-business

[^1_96]: https://www.manatt.com/insights/newsletters/manatt-for-entrepreneurs/raising-capital-through-private-placements-rule-50

[^1_97]: https://www.whitefordlaw.com/news-events/sec-adopts-final-rules-permitting-general-solicitation-in-rule-506-offerings-mad

[^1_98]: http://business.cch.com/srd/Q-25708.pdf

[^1_99]: https://www.alexanderjarvis.com/post-money-safe-pro-rata-side-letter-explained-line-by-line/

[^1_100]: https://freemanlaw.com/fundraising-for-your-business-through-private-placements-rule-506b/

[^1_101]: https://databento.com/compliance/rule-506-b

[^1_102]: https://www.jdsupra.com/legalnews/requirements-of-a-form-d-notice-filing-2016953/

[^1_103]: https://www.pandadoc.com/family-member-promissory-note-template/

[^1_104]: https://eforms.com/loan-agreement/family/

[^1_105]: https://www.lawdepot.com/us/financial/promissory-note-form/

[^1_106]: https://ailawyer.pro/templates/family-member-promissory-note-template

[^1_107]: https://finance.yahoo.com/news/sample-promissory-note-loans-family-120000088.html

[^1_108]: https://www.wolterskluwer.com/en/solutions/bizfilings/tools-and-resources/tools-forms/unsecured-promissory-note-template

[^1_109]: https://www.torys.com/-/media/project/zenith-tenant/zenith-site/assets/startup-legal-playbook/sample-docs/sample-convertible-note-financing-term-sheet.pdf

[^1_110]: https://esign.com/loan-agreement/family/

[^1_111]: https://www.docusign.com/templates/promissory-note

[^1_112]: https://www.irs.gov/applicable-federal-rates

[^1_113]: https://www.irs.gov/pub/irs-drop/rr-26-02.pdf

[^1_114]: https://certuity.com/insights/intrafamily-loans-in-2026/

[^1_115]: https://www.svb.com/startup-insights/raising-capital/determining-seed-startup-valuation/

[^1_116]: https://www.irs.gov/businesses/small-businesses-self-employed/section-7520-interest-rates

[^1_117]: https://www.finrofca.com/news/how-to-calculate-a-startup-valuation-using-the-comparables-method

[^1_118]: https://www.thewallstreetschool.com/blog/startup-valuation-models-explained/


---

# reframe with this in mind I am MILES Hardy the founder

MILES HARDY — COMPLETE PROFILE
Heritage \& Pedigree
Miles is a second-generation Hollywood producer. His father is John Hardy — a legendary producer whose credits include Sex, Lies, and Videotape (Cannes Palme d'Or, the film that essentially launched the American indie movement), Erin Brockovich, Ocean's Eleven, and Ocean's Twelve. Miles didn't learn film finance from a textbook or a course. He grew up inside the machine — at dinner tables where deals were being structured, in rooms where the math on a \$50M production was being worked out in real time. That's not a credential you can acquire. It's DNA.
Industry Career
CAA — Hip-Pocketed. Miles was hip-pocketed at Creative Artists Agency, the single most powerful talent agency in entertainment. Being hip-pocketed means a specific agent has taken you on informally — they're investing personal time and reputation before you're a full roster client. At CAA, that means someone at the top of the food chain believed in Miles enough to put their own credibility behind him. This isn't an application process. It's an invitation.
King Cobra (2016). Co-Producer. Cast included James Franco and Christian Slater. World premiere at the Tribeca Film Festival. Acquired by IFC Films for domestic distribution. Distributed globally on Netflix. The film is now part of the Voltage Pictures library — Voltage being an Academy Award-winning production company (they produced The Hurt Locker). Miles negotiated this deal alongside CAA. He wasn't observing the process — he was in the negotiation.
Linda Lichter \& Elsa Ramo. Miles sat in live negotiations with two of the most powerful entertainment attorneys in Hollywood, actively working out recoupment waterfalls and film finance structures with real capital at stake. Linda Lichter has represented talent and producers on some of the most significant indie deals of the last three decades. Elsa Ramo is one of the foremost securities and entertainment finance attorneys in the country — she literally writes the PPMs and operating agreements that structure how investor money flows into films. Miles wasn't reading about waterfall mechanics — he was watching them get built in real time by the people who invented the modern frameworks.
Producer's Rep Work. After King Cobra, Miles did producer's representative work — helping other filmmakers structure their deals, navigate financing, interface with sales agents and distributors. This is where the origin story of filmmaker.og lives. In this work, Miles kept encountering the same problem over and over: filmmakers who didn't understand how the waterfall worked, who were confused about where their money went after a sale, who were spending thousands of dollars on attorneys and reps just to get basic financial transparency on their own projects. The tools didn't exist. The information was gatekept. And the people who had it charged a fortune to explain it.
Commercial Production Background. Before and alongside his film work, Miles produced commercial content for Nike, Adidas, Microsoft, and the NBA. This isn't a footnote — it means he's operated at the intersection of entertainment and brand capital, understands institutional production pipelines, and has delivered at scale for Fortune 500 clients. The production discipline required for a Nike campaign is the same rigor he's applying to the platform.
Tribeca Film Festival Alumni. Not just a screening — Miles premiered at one of the world's most prestigious film festivals. Tribeca acceptance signals curatorial validation at the highest level of independent cinema.
The Origin Story — Why This Product
This is the part that makes Miles the right founder and not just a qualified one.
During his producer's rep experience, Miles consistently saw the same structural failure: filmmakers at every level — first-timers, second features, even people with festival credits — didn't understand the financial architecture of their own projects. They didn't know how a recoupment waterfall worked. They didn't understand how off-the-tops eroded their returns before a single dollar reached profit participation. They were spending \$400-\$1,000/hour on entertainment attorneys just to get someone to explain the math, or \$3,000-\$10,000 on a producer's rep to structure something that should be transparent and accessible.
The gap wasn't knowledge — the information exists. The gap was tooling. There was no instrument that let a filmmaker model their own waterfall, stress-test scenarios, and generate investor-grade documentation without hiring a gatekeeper. The Excel spreadsheets floating around were dangerous — wrong formulas, missing tiers, no industry-standard structure. The attorneys and reps had no incentive to make this accessible because opacity was their business model.
Miles's insight was: I need this tool myself. It should exist. And if I build it, I can open the gate for everyone else. That's not a market thesis derived from research. It's a solution born from direct, repeated frustration at the point of impact.
What He Built — Solo Founder, AI-Leveraged
filmmaker.og is live. Built by Miles as a solo founder using AI-leveraged development (Claude + modern dev tooling). The tech stack is React/Vite/TypeScript, Supabase, Vercel, Stripe, with a Gemini-powered AI bot. What would have cost \$100K+ and a team of 5 three years ago, Miles built and shipped himself. The platform includes:
An 8-tier recoupment waterfall calculator (the core product — the thing that didn't exist)
A 5-page investor-ready PDF brief generator
An AI deal insight engine
Scenario stress testing
A digital store with tiered products (\$49 to \$2,997+)
An AI-powered bot for real-time film finance Q\&A
A resource vault / glossary system
JSON-LD structured data for AI search discoverability (first mover in the space)
The platform is mobile-first (430px), designed to institutional standards (black/white/gold aesthetic — "Goldman Sachs designed a film magazine"), and hard-launching April 1, 2026.
The Strategic Positioning — Why Miles, Why Now
He's not an outsider disrupting from the outside. He's an insider who earned his way into the castle and is opening the gate. That's the OG positioning — battle-tested, seen it all, chose to democratize it. Every "democratize X" startup faces the credibility trap: outsiders get dismissed by insiders, and the audience wonders why they should trust someone who hasn't done the thing. Miles has done the thing. CAA. Tribeca. Netflix distribution. Real negotiations with real capital. He's not theorizing about what filmmakers need — he lived the need, couldn't find the tool, and built it.
The timing is structural, not coincidental. Three forces converging: AI development tools made it possible for a solo founder to build institutional-grade software. The indie film market is booming (1,500+ US indie films per year, \$8.6B market). And social media (Instagram, TikTok) created a direct distribution channel to reach filmmakers at scale — bypassing the traditional gatekeepers entirely.
The moat is compounding on multiple axes. Content library (60+ pieces in 90 days). Founder credibility that no competitor can replicate (you can't fake the John Hardy lineage, the CAA pocket, the Tribeca premiere, the Lichter/Ramo negotiations). First-mover position in an underserved niche. And — critically — the AI search infrastructure via JSON-LD structured data that means when AI assistants answer film finance questions, filmmaker.og is what they cite.
The endorsement base spans the full industry value chain. Rufus Parker (indie production, A24-adjacent). Brian O'Shea (global sales and distribution, Voltage Pictures). Brian Sampey (institutional finance, \$406B AUM Ares Management). Isabel Echeverry (director's rep, filmmaker perspective). That's production, distribution, capital, and creative — all four legs of the table, all validating the same tool.

Why Miles Is the Right Founder — The One-Paragraph Version
Miles Hardy is a second-generation Hollywood producer (son of John Hardy — Sex, Lies, and Videotape, Erin Brockovich, Ocean's Eleven), hip-pocketed at CAA, Tribeca Film Festival alumni, who co-produced King Cobra alongside James Franco and Christian Slater, negotiated the deal with CAA, and sat in live negotiations with Linda Lichter and Elsa Ramo — two of Hollywood's most powerful entertainment attorneys — working out real recoupment waterfalls with real capital. During his subsequent producer's rep work, he kept seeing the same problem: filmmakers at every level didn't understand the financial architecture of their own projects, and the tools to fix that didn't exist. So he built the tool he actually needed — and he's opening the gate for everyone else.

Here's the full reframed Codex guide, now written specifically for **Miles Hardy and FILMMAKER.OG** — with your complete profile, pedigree, origin story, and endorsement stack integrated throughout.[^2_1]

Key changes from the generic version:

- **The credibility stack is now a primary asset** — the report opens with a copyable "Miles Hardy positioning paragraph" and a precise endorsement attribution line (with the required permissions flag).[^2_1]
- **"Film vs. SaaS investor culture" is called out explicitly** — because your film-industry contacts know waterfall mechanics as *the product*, not the investment structure, and that distinction needs to be made upfront in every conversation.[^2_2]
- **Valuation cap is calibrated to your actual situation** — given a live product hard-launching April 1, CAA pedigree, Tribeca/Netflix/Voltage track record, and a four-endorser stack, the cap range moves to **\$1.5M–\$2.5M**, not the rock-bottom \$500K–\$750K you'd set for a first-time founder with a pitch deck.[^2_3][^2_4]
- **The pitch ask uses your actual biography** — every sentence is grounded in John Hardy, CAA, King Cobra, Tribeca, Lichter/Ramo — the real de-risking story.
- **Single-founder risk disclosure** is addressed directly — because your investors should know the platform IP and brand are owned by the entity, not you personally.

The report includes all nine deliverables from the original brief plus the Codex implementation checklist, fully reattributed to Miles and FILMMAKER.OG.
<span style="display:none">[^2_10][^2_100][^2_101][^2_102][^2_103][^2_104][^2_105][^2_106][^2_107][^2_108][^2_109][^2_11][^2_110][^2_111][^2_112][^2_113][^2_114][^2_115][^2_116][^2_117][^2_118][^2_119][^2_12][^2_13][^2_14][^2_15][^2_16][^2_17][^2_18][^2_19][^2_20][^2_21][^2_22][^2_23][^2_24][^2_25][^2_26][^2_27][^2_28][^2_29][^2_30][^2_31][^2_32][^2_33][^2_34][^2_35][^2_36][^2_37][^2_38][^2_39][^2_40][^2_41][^2_42][^2_43][^2_44][^2_45][^2_46][^2_47][^2_48][^2_49][^2_5][^2_50][^2_51][^2_52][^2_53][^2_54][^2_55][^2_56][^2_57][^2_58][^2_59][^2_6][^2_60][^2_61][^2_62][^2_63][^2_64][^2_65][^2_66][^2_67][^2_68][^2_69][^2_7][^2_70][^2_71][^2_72][^2_73][^2_74][^2_75][^2_76][^2_77][^2_78][^2_79][^2_8][^2_80][^2_81][^2_82][^2_83][^2_84][^2_85][^2_86][^2_87][^2_88][^2_89][^2_9][^2_90][^2_91][^2_92][^2_93][^2_94][^2_95][^2_96][^2_97][^2_98][^2_99]</span>

<div align="center">⁂</div>

[^2_1]: https://www.jacksonkelly.com/the-legal-brief/theres-no-such-thing-as-friends-and-family-under-the-securities-laws/

[^2_2]: https://ppmlawyers.com/raising-capital-from-friends-family-what-the-law-really-says/

[^2_3]: https://www.perplexity.ai/search/7daf1a60-2e4a-40ad-aa23-37eb12fda3b4

[^2_4]: https://www.svb.com/startup-insights/raising-capital/raising-startup-funds-friends-and-family/

[^2_5]: https://www.thevccorner.com/p/friends-and-family-funding-guide

[^2_6]: https://carta.com/learn/startups/fundraising/pre-seed-funding/

[^2_7]: https://qubit.capital/blog/convertible-debt-safe-notes

[^2_8]: https://www.vestd.com/blog/friends-and-family-investment-rounds-a-founders-guide

[^2_9]: https://www.cooleygo.com/convertible-debt/

[^2_10]: https://www.eidebailly.com/insights/blogs/2026/2/202603-afr

[^2_11]: https://www.rho.co/blog/friends-and-family-funding-guide-for-startups

[^2_12]: https://www.gilion.com/basics/convertible-notes

[^2_13]: https://startupproject.org/blog/convertible-note-guide/

[^2_14]: https://promise.legal/resources/safe-vs-convertible

[^2_15]: https://www.okeeffeattorneys.com/beware-of-offering-stock-to-friends-and-family/

[^2_16]: https://www.allied.vc/articles/safe-vs-convertible-notes-key-differences

[^2_17]: https://www.cooleygo.com/documents/series-seed-notes-financing-package/

[^2_18]: https://angelcapitalassociation.org/wp-content/uploads/2024/12/ACA-Model-Convertible-Note-Term-Sheet-Version-1.2-11_24163750677.4-C.docx

[^2_19]: https://www.sec.gov/resources-small-businesses/exempt-offerings/private-placements-rule-506b

[^2_20]: https://www.ycombinator.com/documents

[^2_21]: https://siliconhillslawyer.com/2021/08/24/friends-family-ff-safe-template/

[^2_22]: https://mintlify.com/Ro5s/Startup-Starter-Pack/library/yc/safe-agreements

[^2_23]: https://zyner.io/blog/safe-agreement-template-for-pre-seed

[^2_24]: https://www.saastr.com/can-i-use-y-combinators-safe-as-it-is-for-friends-and-family-round-without-hiring-a-lawyer-to-look-at-it/

[^2_25]: https://navi.com/blog/revenue-sharing/

[^2_26]: https://qubit.capital/blog/equity-vs-revenue-share

[^2_27]: https://www.upcounsel.com/revenue-share-partnership-agreement

[^2_28]: https://www.metal.so/collections/2025-pre-seed-funding-benchmarks-saas-startups-round-size-valuation-equity

[^2_29]: https://carta.com/data/state-of-pre-seed-q2-2025/

[^2_30]: https://help.pulley.com/en/articles/6080319-how-to-fill-out-each-safe-field

[^2_31]: https://www.linkedin.com/posts/amoswatene_saas-startups-valuation-activity-7338976235328286720-Kwwe

[^2_32]: https://www.wallstreetprep.com/knowledge/safe-note/

[^2_33]: https://www.varnumlaw.com/insights/reasons-to-include-only-accredited-investors-in-your-rule-506b-private-offering/

[^2_34]: https://www.cooleygo.com/frequently-asked-questions-convertible-debt/

[^2_35]: https://www.frantzward.com/the-non-existent-friends-and-family-exemption-under-federal-and-state-securities-law/

[^2_36]: https://www.ssm.legal/blog/friends-family-complying-with-securities-laws

[^2_37]: https://www.sec.gov/resources-small-businesses/exempt-offerings/filing-form-d-notice

[^2_38]: https://www.merceradvisors.com/insights/family-finance/diving-into-tax-consequences-with-intrafamily-gifts-and-loans/

[^2_39]: https://www.joinarc.com/guides/friends-and-family-round

[^2_40]: https://ff.co/startup-statistics-guide/

[^2_41]: https://www.cakeequity.com/guides/safe-vs-convertible-note

[^2_42]: https://resources.b2venture.vc/fundraising/round-terms-and-term-sheets

[^2_43]: https://www.dlapiper.com/insights/publications/accelerate/funding-equity-debt/friends-and-family-round-vs-angel-round

[^2_44]: https://www.heuking.de/en/landingpages/the-venture-capital-playbook/sample-term-sheet.html

[^2_45]: https://iota-finance.com/iota-finance-blog/prepare-your-startups-financials-for-a-friends-and-family-round

[^2_46]: https://foundersnetwork.com/convertible-note-vs-equity/

[^2_47]: https://blog.promise.legal/startup-central/how-to-structure-a-friends-and-family-investment-agreement-a-practical-legal-checklist-for-startup-founders/

[^2_48]: https://www.failory.com/blog/seed-funding

[^2_49]: https://gesmer.com/publications/safe-vs-convertible-note/

[^2_50]: https://www.youtube.com/watch?v=KZY1n_FfSMI

[^2_51]: https://www.ycombinator.com/library/4A-a-guide-to-seed-fundraising

[^2_52]: https://www.reddit.com/r/startups/comments/hy76r4/how_to_structure_friends_and_family_round/

[^2_53]: https://www.cooleygo.com/documents/y-combinator-safe-financing-document-generator/

[^2_54]: https://www.linkedin.com/pulse/ycs-secret-safe-chris-harvey-rsffc

[^2_55]: https://carta.com/learn/startups/fundraising/

[^2_56]: https://krownelaw.com/theres-no-friends-and-family-exemption/

[^2_57]: https://montague.law/blog/a-comprehensive-guide-to-the-yc-safe/

[^2_58]: https://www.cooleygo.com/glossary/convertible-note/

[^2_59]: https://www.cooleygo.com/collections/understanding-convertible-debt/

[^2_60]: https://www.cooleygo.com/understanding-the-valuation-cap/

[^2_61]: https://www.irs.gov/pub/irs-drop/rr-26-06.pdf

[^2_62]: https://www.cooleygo.com/documents/kiss-convertible-debt-equity-agreements/

[^2_63]: https://support.carta.com/kb/guide/en/how-to-use-the-safe-and-convertible-note-calculator-7puQPQ3bT3/Steps/3724995

[^2_64]: https://www.irs.gov/pub/irs-drop/rr-26-03.pdf

[^2_65]: https://www.cooleygo.com/calculating-share-price-outstanding-convertible-notes-or-safes/

[^2_66]: https://capwave.ai/blog/safes-vs-convertible-notes-which-one-is-right-for-your-startup

[^2_67]: https://www.joinarc.com/guides/convertible-note

[^2_68]: https://www.cohenco.com/knowledge-center/insights/march-2025/how-convertible-notes-and-safes-can-help-tech-companies-address-short-term-cash-flow

[^2_69]: https://www.reddit.com/r/startups/comments/1c5mcmj/friend_and_family_round_explain_to_me_like_im_5/

[^2_70]: https://whatstrending.fenwick.com/post/convertible-notes-safes-still-popular-but-terms-are-tightening

[^2_71]: https://ecvc.wsgr.com/a/web/vgnKwoeAkUKT6MTc96jYem/entrepreneurs-report-q1-2025.pdf

[^2_72]: https://www.huntlawgrp.com/raising-friends-and-family-capital-avoiding-securities-violations-in-informal-rounds/

[^2_73]: https://www.hustlefund.vc/post/angel-squad-convertible-notes-investing-guide-terms-valuations-negotiation-tactics

[^2_74]: https://fi.co/insight/how-to-raise-a-friends-and-family-round

[^2_75]: https://www.metal.so/collections/2025-pre-seed-round-size-valuation-benchmarks-us-saas-founders

[^2_76]: https://futuresight.ventures/futuresight-ventures-top-15-most-compelling-pre-seed-and-seed-benchmarks-courtesy-of-carta/

[^2_77]: https://carta.com/data/state-of-pre-seed-2025/

[^2_78]: https://www.colonialfilings.com/blog/is-reg-d-filing-required-for-friends-and-family/

[^2_79]: https://www.paddle.com/resources/revenue-sharing

[^2_80]: https://www.linkedin.com/posts/peterjameswalker_startups-founders-fundraising-activity-7344405634752069633-kF_Q

[^2_81]: https://www.sec.gov/resources-small-businesses/exempt-offerings/exemption-limited-offerings-not-exceeding-10-million-rule-504-regulation-d

[^2_82]: https://www.varnumlaw.com/insights/shared-earnings-arrangements-offer-flexibility-for-startups-investors/

[^2_83]: https://www.alexanderjarvis.com/post-money-safe-calculator/

[^2_84]: https://globalcapitalnetwork.com/what-investors-really-want-to-see-in-a-startup-before-saying-yes/

[^2_85]: https://www.brex.com/journal/family-and-friends-funding

[^2_86]: https://cyberbuilders.substack.com/p/balancing-growth-and-profitability

[^2_87]: https://anthonylawllc.com/blog/a-primer-on-raising-money-from-friends-and-family-for-your-business

[^2_88]: https://www.rimonlaw.com/safes-2-0-ycombinator-updates-the-form-2/

[^2_89]: https://www.law.cornell.edu/wex/rule_506

[^2_90]: https://carta.com/learn/private-funds/regulations/regulation-d/506b-vs-506c/

[^2_91]: https://www.manatt.com/insights/newsletters/manatt-for-entrepreneurs/raising-capital-through-private-placements-rule-50

[^2_92]: https://www.linkedin.com/posts/mike-schmansky_your-first-sale-starts-a-15-day-clock-activity-7376269122151534592-GrbM

[^2_93]: https://www.whitefordlaw.com/news-events/sec-adopts-final-rules-permitting-general-solicitation-in-rule-506-offerings-mad

[^2_94]: http://business.cch.com/srd/Q-25708.pdf

[^2_95]: https://www.alexanderjarvis.com/post-money-safe-pro-rata-side-letter-explained-line-by-line/

[^2_96]: https://freemanlaw.com/fundraising-for-your-business-through-private-placements-rule-506b/

[^2_97]: https://databento.com/compliance/rule-506-b

[^2_98]: https://www.jdsupra.com/legalnews/requirements-of-a-form-d-notice-filing-2016953/

[^2_99]: https://www.pandadoc.com/family-member-promissory-note-template/

[^2_100]: https://eforms.com/loan-agreement/family/

[^2_101]: https://www.lawdepot.com/us/financial/promissory-note-form/

[^2_102]: https://ailawyer.pro/templates/family-member-promissory-note-template

[^2_103]: https://finance.yahoo.com/news/sample-promissory-note-loans-family-120000088.html

[^2_104]: https://www.clockwork.app/blog/convertible-notes-term-sheet-template

[^2_105]: https://www.nolo.com/legal-encyclopedia/raising-private-money-gifts-loans-30078.html

[^2_106]: https://www.wolterskluwer.com/en/solutions/bizfilings/tools-and-resources/tools-forms/unsecured-promissory-note-template

[^2_107]: https://www.torys.com/-/media/project/zenith-tenant/zenith-site/assets/startup-legal-playbook/sample-docs/sample-convertible-note-financing-term-sheet.pdf

[^2_108]: https://esign.com/loan-agreement/family/

[^2_109]: https://www.docusign.com/templates/promissory-note

[^2_110]: https://www.irs.gov/applicable-federal-rates

[^2_111]: https://www.irs.gov/pub/irs-drop/rr-26-02.pdf

[^2_112]: https://certuity.com/insights/intrafamily-loans-in-2026/

[^2_113]: https://www.nationalfamilymortgage.com/afr-rates/

[^2_114]: https://shaycpa.com/understanding-investor-information-rights-a-guide-for-founders/

[^2_115]: https://www.svb.com/startup-insights/raising-capital/determining-seed-startup-valuation/

[^2_116]: https://www.irs.gov/businesses/small-businesses-self-employed/section-7520-interest-rates

[^2_117]: https://www.finrofca.com/news/how-to-calculate-a-startup-valuation-using-the-comparables-method

[^2_118]: https://www.thewallstreetschool.com/blog/startup-valuation-models-explained/

[^2_119]: https://www.novoco.com/resource-centers/affordable-housing-tax-credits/2026-applicable-federal-rates


---

# which model is the most likely easiest path to attracting investors and with this in mind my background did your initial high risk statement change

Two direct answers before diving into the nuance:

**1. Easiest path to attracting investors: the Convertible Note.**

Not the SAFE — even though the SAFE is better *structurally* for you as a solo founder. Here's why the note wins on the "easiest to attract" dimension:

Your specific F\&F audience is most likely people from the **film industry** — producers, reps, distributors, entertainment attorneys, finance people at firms like Ares. That world is built on **debt instruments with defined repayment mechanics**. They read waterfall structures. They know what a promissory note is. They understand interest. A convertible note maps directly onto how they already think about money: *"You're lending me capital, I'm paying you back plus a return, and if this takes off you get equity upside."* That framing closes faster in a film-adjacent network than "here's a SAFE that converts to equity at some undefined future point."[^3_1][^3_2]

The SAFE is still the *better instrument for you operationally* — no maturity pressure, no cash-flow drain — but if the question is purely "which gets a yes fastest," the convertible note wins with this specific investor pool.[^3_1]

**The practical answer:** Lead with the **convertible note framing in conversation** — "it's a loan that converts to equity" — but execute it as a SAFE if investors are comfortable once they understand the mechanics. Many sophisticated film-industry people, once the SAFE is explained plainly, will prefer it precisely because there's no repayment pressure on your business.

***

**2. Does your background change the "high risk" disclosure? No — but it meaningfully changes what the risk actually is.**

The boilerplate "possible total loss, illiquid, long time horizon" language is legally required and stays in every document regardless of who the founder is. That's non-negotiable.[^3_3][^3_4]

**What does change:**

The *nature* of the risk profile shifts significantly with Miles Hardy's profile. Here's how to think about it honestly:


| Risk Factor | Generic Solo SaaS Founder | Miles Hardy / FILMMAKER.OG |
| :-- | :-- | :-- |
| **Founder will-quit risk** | High — most solo founders abandon | Low — this is a decade of lived frustration becoming a product; not a trend bet |
| **Market knowledge / fit risk** | High — many founders build for a market they don't understand | Very Low — Miles is the customer; built it because *he* needed it |
| **Network/distribution risk** | High — how do you reach filmmakers? | Low — CAA, Tribeca, O'Shea, Parker, Sampey, Instagram/TikTok content engine already built[^3_5] |
| **Product validation risk** | High — does anyone want this? | Low — the product fills a gap Miles identified from direct professional experience |
| **Execution risk** | Moderate — can they build it? | Low — platform is **live**, launching April 1, 2026 |
| **Financial model risk** | Moderate — will anyone pay? | Moderate — SaaS traction at real MRR is still unproven |
| **Competitive risk** | Moderate | Moderate — underserved niche, but no moat is guaranteed |

The honest reframing for investor conversations is:

> *"This is still early-stage risk capital — you can lose it all, and that disclosure is real. But the founder risk profile here is materially different from a typical solo startup. The product exists, the market need was validated by direct professional experience, the network for distribution is institutional-grade, and this founder doesn't walk away — this tool is the culmination of a career. What you're actually betting on is SaaS revenue growth and timing, not whether Miles Hardy is the right person to build this."*

That's not softening the legal risk language — it's being more *precise* about what the residual risk actually is. The risk is commercial execution (converting a live product into recurring revenue), not founder fit, market fit, or build risk. That's a meaningfully smaller risk stack than average.[^3_6]

The disclosure still says "possible total loss." But the conversation around it is much stronger.[^3_4]

<div align="center">⁂</div>

[^3_1]: https://gesmer.com/publications/safe-vs-convertible-note/

[^3_2]: https://www.okeeffeattorneys.com/beware-of-offering-stock-to-friends-and-family/

[^3_3]: https://www.jacksonkelly.com/the-legal-brief/theres-no-such-thing-as-friends-and-family-under-the-securities-laws/

[^3_4]: https://ppmlawyers.com/raising-capital-from-friends-family-what-the-law-really-says/

[^3_5]: https://www.perplexity.ai/search/7daf1a60-2e4a-40ad-aa23-37eb12fda3b4

[^3_6]: https://carta.com/learn/startups/fundraising/pre-seed-funding/


---

# with this is mind give me a proposal and language I can use in a summary with the key points for the easiest raise path and I want to reward the investors with a little bit higher returns or benefits

The report has everything you need to walk into any conversation or send a clean follow-up. Here's the strategic logic behind the structure:

## Why this version closes faster

The three sweeteners — **7% interest, 25% discount, and the 1.25x floor** — do specific psychological work with a film-industry audience:[^4_1][^4_2]

- **7% interest** removes the "I'm just giving Miles money and hoping" objection. Your money earns from the day you sign.
- **25% discount** (above the market standard of 20%) is the "early money gets the best price" principle — which everyone in film already knows from waterfall structures.[^4_2][^4_3]
- **1.25x floor** is the closest thing to a film-style recoup protection you can offer in a startup note. It answers the question *"what if this never raises again?"* with something concrete rather than silence.[^4_1]


## What the pro rata for all investors does

Standard practice is to reserve pro rata rights for large checks only. Offering it to **all** Founders' Circle investors — regardless of check size — signals that you're treating early believers as genuine partners, not as a fundraising ATM. In a community where relationships are currency, that lands differently than a standard term sheet.[^4_4]

## One practical note

Before presenting the 1.25x floor to any investor, confirm with your startup attorney that it's structured correctly — specifically whether it's a liquidation preference on the note, a separate covenant, or built into the change-of-control provision. The language matters legally even if the concept is simple. The report includes the right framing to hand to counsel.[^4_5]
<span style="display:none">[^4_10][^4_100][^4_101][^4_102][^4_103][^4_104][^4_105][^4_106][^4_107][^4_108][^4_109][^4_11][^4_110][^4_111][^4_112][^4_113][^4_114][^4_115][^4_116][^4_117][^4_118][^4_12][^4_13][^4_14][^4_15][^4_16][^4_17][^4_18][^4_19][^4_20][^4_21][^4_22][^4_23][^4_24][^4_25][^4_26][^4_27][^4_28][^4_29][^4_30][^4_31][^4_32][^4_33][^4_34][^4_35][^4_36][^4_37][^4_38][^4_39][^4_40][^4_41][^4_42][^4_43][^4_44][^4_45][^4_46][^4_47][^4_48][^4_49][^4_50][^4_51][^4_52][^4_53][^4_54][^4_55][^4_56][^4_57][^4_58][^4_59][^4_6][^4_60][^4_61][^4_62][^4_63][^4_64][^4_65][^4_66][^4_67][^4_68][^4_69][^4_7][^4_70][^4_71][^4_72][^4_73][^4_74][^4_75][^4_76][^4_77][^4_78][^4_79][^4_8][^4_80][^4_81][^4_82][^4_83][^4_84][^4_85][^4_86][^4_87][^4_88][^4_89][^4_9][^4_90][^4_91][^4_92][^4_93][^4_94][^4_95][^4_96][^4_97][^4_98][^4_99]</span>

<div align="center">⁂</div>

[^4_1]: https://www.jacksonkelly.com/the-legal-brief/theres-no-such-thing-as-friends-and-family-under-the-securities-laws/

[^4_2]: https://ppmlawyers.com/raising-capital-from-friends-family-what-the-law-really-says/

[^4_3]: https://gesmer.com/publications/safe-vs-convertible-note/

[^4_4]: https://www.okeeffeattorneys.com/beware-of-offering-stock-to-friends-and-family/

[^4_5]: https://www.cooleygo.com/convertible-debt/

[^4_6]: https://www.gilion.com/basics/convertible-notes

[^4_7]: https://startupproject.org/blog/convertible-note-guide/

[^4_8]: https://www.metal.so/collections/2025-pre-seed-funding-benchmarks-saas-startups-round-size-valuation-equity

[^4_9]: https://promise.legal/resources/safe-vs-convertible

[^4_10]: https://help.pulley.com/en/articles/6080319-how-to-fill-out-each-safe-field

[^4_11]: https://www.joinarc.com/guides/friends-and-family-round

[^4_12]: https://www.svb.com/startup-insights/raising-capital/raising-startup-funds-friends-and-family/

[^4_13]: https://ff.co/startup-statistics-guide/

[^4_14]: https://www.thevccorner.com/p/friends-and-family-funding-guide

[^4_15]: https://www.rho.co/blog/friends-and-family-funding-guide-for-startups

[^4_16]: https://www.cakeequity.com/guides/safe-vs-convertible-note

[^4_17]: https://resources.b2venture.vc/fundraising/round-terms-and-term-sheets

[^4_18]: https://www.dlapiper.com/insights/publications/accelerate/funding-equity-debt/friends-and-family-round-vs-angel-round

[^4_19]: https://qubit.capital/blog/convertible-debt-safe-notes

[^4_20]: https://www.heuking.de/en/landingpages/the-venture-capital-playbook/sample-term-sheet.html

[^4_21]: https://iota-finance.com/iota-finance-blog/prepare-your-startups-financials-for-a-friends-and-family-round

[^4_22]: https://foundersnetwork.com/convertible-note-vs-equity/

[^4_23]: https://blog.promise.legal/startup-central/how-to-structure-a-friends-and-family-investment-agreement-a-practical-legal-checklist-for-startup-founders/

[^4_24]: https://www.failory.com/blog/seed-funding

[^4_25]: https://www.ycombinator.com/documents

[^4_26]: https://mintlify.com/Ro5s/Startup-Starter-Pack/library/yc/safe-agreements

[^4_27]: https://www.youtube.com/watch?v=KZY1n_FfSMI

[^4_28]: https://www.ycombinator.com/library/4A-a-guide-to-seed-fundraising

[^4_29]: https://zyner.io/blog/safe-agreement-template-for-pre-seed

[^4_30]: https://www.reddit.com/r/startups/comments/hy76r4/how_to_structure_friends_and_family_round/

[^4_31]: https://www.cooleygo.com/documents/y-combinator-safe-financing-document-generator/

[^4_32]: https://www.vestd.com/blog/friends-and-family-investment-rounds-a-founders-guide

[^4_33]: https://www.linkedin.com/pulse/ycs-secret-safe-chris-harvey-rsffc

[^4_34]: https://carta.com/learn/startups/fundraising/

[^4_35]: https://krownelaw.com/theres-no-friends-and-family-exemption/

[^4_36]: https://montague.law/blog/a-comprehensive-guide-to-the-yc-safe/

[^4_37]: https://carta.com/learn/startups/fundraising/pre-seed-funding/

[^4_38]: https://www.cooleygo.com/documents/series-seed-notes-financing-package/

[^4_39]: https://www.cooleygo.com/glossary/convertible-note/

[^4_40]: https://www.cooleygo.com/collections/understanding-convertible-debt/

[^4_41]: https://www.cooleygo.com/frequently-asked-questions-convertible-debt/

[^4_42]: https://www.allied.vc/articles/safe-vs-convertible-notes-key-differences

[^4_43]: https://www.eidebailly.com/insights/blogs/2026/2/202603-afr

[^4_44]: https://www.cooleygo.com/understanding-the-valuation-cap/

[^4_45]: https://www.irs.gov/pub/irs-drop/rr-26-06.pdf

[^4_46]: https://www.cooleygo.com/documents/kiss-convertible-debt-equity-agreements/

[^4_47]: https://support.carta.com/kb/guide/en/how-to-use-the-safe-and-convertible-note-calculator-7puQPQ3bT3/Steps/3724995

[^4_48]: https://www.irs.gov/pub/irs-drop/rr-26-03.pdf

[^4_49]: https://www.cooleygo.com/calculating-share-price-outstanding-convertible-notes-or-safes/

[^4_50]: https://capwave.ai/blog/safes-vs-convertible-notes-which-one-is-right-for-your-startup

[^4_51]: https://www.joinarc.com/guides/convertible-note

[^4_52]: https://www.cohenco.com/knowledge-center/insights/march-2025/how-convertible-notes-and-safes-can-help-tech-companies-address-short-term-cash-flow

[^4_53]: https://www.reddit.com/r/startups/comments/1c5mcmj/friend_and_family_round_explain_to_me_like_im_5/

[^4_54]: https://whatstrending.fenwick.com/post/convertible-notes-safes-still-popular-but-terms-are-tightening

[^4_55]: https://www.frantzward.com/the-non-existent-friends-and-family-exemption-under-federal-and-state-securities-law/

[^4_56]: https://ecvc.wsgr.com/a/web/vgnKwoeAkUKT6MTc96jYem/entrepreneurs-report-q1-2025.pdf

[^4_57]: https://www.huntlawgrp.com/raising-friends-and-family-capital-avoiding-securities-violations-in-informal-rounds/

[^4_58]: https://www.hustlefund.vc/post/angel-squad-convertible-notes-investing-guide-terms-valuations-negotiation-tactics

[^4_59]: https://fi.co/insight/how-to-raise-a-friends-and-family-round

[^4_60]: https://carta.com/data/state-of-pre-seed-q2-2025/

[^4_61]: https://www.saastr.com/can-i-use-y-combinators-safe-as-it-is-for-friends-and-family-round-without-hiring-a-lawyer-to-look-at-it/

[^4_62]: https://www.metal.so/collections/2025-pre-seed-round-size-valuation-benchmarks-us-saas-founders

[^4_63]: https://futuresight.ventures/futuresight-ventures-top-15-most-compelling-pre-seed-and-seed-benchmarks-courtesy-of-carta/

[^4_64]: https://navi.com/blog/revenue-sharing/

[^4_65]: https://www.ssm.legal/blog/friends-family-complying-with-securities-laws

[^4_66]: https://www.upcounsel.com/revenue-share-partnership-agreement

[^4_67]: https://carta.com/data/state-of-pre-seed-2025/

[^4_68]: https://www.colonialfilings.com/blog/is-reg-d-filing-required-for-friends-and-family/

[^4_69]: https://www.paddle.com/resources/revenue-sharing

[^4_70]: https://www.linkedin.com/posts/peterjameswalker_startups-founders-fundraising-activity-7344405634752069633-kF_Q

[^4_71]: https://www.sec.gov/resources-small-businesses/exempt-offerings/exemption-limited-offerings-not-exceeding-10-million-rule-504-regulation-d

[^4_72]: https://qubit.capital/blog/equity-vs-revenue-share

[^4_73]: https://www.varnumlaw.com/insights/shared-earnings-arrangements-offer-flexibility-for-startups-investors/

[^4_74]: https://www.alexanderjarvis.com/post-money-safe-calculator/

[^4_75]: https://www.linkedin.com/posts/amoswatene_saas-startups-valuation-activity-7338976235328286720-Kwwe

[^4_76]: https://www.wallstreetprep.com/knowledge/safe-note/

[^4_77]: https://globalcapitalnetwork.com/what-investors-really-want-to-see-in-a-startup-before-saying-yes/

[^4_78]: https://www.brex.com/journal/family-and-friends-funding

[^4_79]: https://cyberbuilders.substack.com/p/balancing-growth-and-profitability

[^4_80]: https://anthonylawllc.com/blog/a-primer-on-raising-money-from-friends-and-family-for-your-business

[^4_81]: https://www.rimonlaw.com/safes-2-0-ycombinator-updates-the-form-2/

[^4_82]: https://www.law.cornell.edu/wex/rule_506

[^4_83]: https://www.sec.gov/resources-small-businesses/exempt-offerings/private-placements-rule-506b

[^4_84]: https://www.varnumlaw.com/insights/reasons-to-include-only-accredited-investors-in-your-rule-506b-private-offering/

[^4_85]: https://carta.com/learn/private-funds/regulations/regulation-d/506b-vs-506c/

[^4_86]: https://www.manatt.com/insights/newsletters/manatt-for-entrepreneurs/raising-capital-through-private-placements-rule-50

[^4_87]: https://www.linkedin.com/posts/mike-schmansky_your-first-sale-starts-a-15-day-clock-activity-7376269122151534592-GrbM

[^4_88]: https://www.whitefordlaw.com/news-events/sec-adopts-final-rules-permitting-general-solicitation-in-rule-506-offerings-mad

[^4_89]: http://business.cch.com/srd/Q-25708.pdf

[^4_90]: https://www.alexanderjarvis.com/post-money-safe-pro-rata-side-letter-explained-line-by-line/

[^4_91]: https://freemanlaw.com/fundraising-for-your-business-through-private-placements-rule-506b/

[^4_92]: https://www.sec.gov/resources-small-businesses/exempt-offerings/filing-form-d-notice

[^4_93]: https://databento.com/compliance/rule-506-b

[^4_94]: https://www.jdsupra.com/legalnews/requirements-of-a-form-d-notice-filing-2016953/

[^4_95]: https://www.pandadoc.com/family-member-promissory-note-template/

[^4_96]: https://eforms.com/loan-agreement/family/

[^4_97]: https://www.lawdepot.com/us/financial/promissory-note-form/

[^4_98]: https://ailawyer.pro/templates/family-member-promissory-note-template

[^4_99]: https://finance.yahoo.com/news/sample-promissory-note-loans-family-120000088.html

[^4_100]: https://www.clockwork.app/blog/convertible-notes-term-sheet-template

[^4_101]: https://www.nolo.com/legal-encyclopedia/raising-private-money-gifts-loans-30078.html

[^4_102]: https://www.wolterskluwer.com/en/solutions/bizfilings/tools-and-resources/tools-forms/unsecured-promissory-note-template

[^4_103]: https://www.torys.com/-/media/project/zenith-tenant/zenith-site/assets/startup-legal-playbook/sample-docs/sample-convertible-note-financing-term-sheet.pdf

[^4_104]: https://esign.com/loan-agreement/family/

[^4_105]: https://siliconhillslawyer.com/2021/08/24/friends-family-ff-safe-template/

[^4_106]: https://www.merceradvisors.com/insights/family-finance/diving-into-tax-consequences-with-intrafamily-gifts-and-loans/

[^4_107]: https://www.docusign.com/templates/promissory-note

[^4_108]: https://angelcapitalassociation.org/wp-content/uploads/2024/12/ACA-Model-Convertible-Note-Term-Sheet-Version-1.2-11_24163750677.4-C.docx

[^4_109]: https://www.irs.gov/applicable-federal-rates

[^4_110]: https://www.irs.gov/pub/irs-drop/rr-26-02.pdf

[^4_111]: https://certuity.com/insights/intrafamily-loans-in-2026/

[^4_112]: https://www.nationalfamilymortgage.com/afr-rates/

[^4_113]: https://shaycpa.com/understanding-investor-information-rights-a-guide-for-founders/

[^4_114]: https://www.svb.com/startup-insights/raising-capital/determining-seed-startup-valuation/

[^4_115]: https://www.irs.gov/businesses/small-businesses-self-employed/section-7520-interest-rates

[^4_116]: https://www.finrofca.com/news/how-to-calculate-a-startup-valuation-using-the-comparables-method

[^4_117]: https://www.thewallstreetschool.com/blog/startup-valuation-models-explained/

[^4_118]: https://www.novoco.com/resource-centers/affordable-housing-tax-credits/2026-applicable-federal-rates

