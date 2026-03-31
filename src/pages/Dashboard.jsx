import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ComposedChart, Line,
  ScatterChart, Scatter, CartesianGrid, Legend, ReferenceLine
} from "recharts";

/* ═══════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════ */
const T = {
  bg: "#000", glass: "rgba(6,6,6,0.85)", glassBright: "rgba(12,12,14,0.92)",
  glassRecessed: "rgba(3,3,3,0.78)", sidebar: "#0A0A0A",
  gold: "#D4AF37", goldBright: "#F9E076", goldDim: "rgba(212,175,55,0.25)",
  goldGhost: "rgba(212,175,55,0.08)",
  purple: "rgba(120,60,180,1)", green: "#3CB371", greenDim: "rgba(60,179,113,0.15)",
  red: "rgba(220,38,38,1)", redDim: "rgba(220,38,38,0.15)",
  amber: "#F59E0B", amberDim: "rgba(245,158,11,0.15)",
  equity: "#E8B84D", blue: "#3B82F6",
  w92: "rgba(255,255,255,0.92)", w75: "rgba(255,255,255,0.75)",
  w55: "rgba(255,255,255,0.55)", w40: "rgba(255,255,255,0.40)",
  w25: "rgba(255,255,255,0.25)",
  radius: "12px", border: "rgba(212,175,55,0.12)", borderBright: "rgba(212,175,55,0.28)",
  inputBg: "rgba(212,175,55,0.05)", inputBorder: "rgba(212,175,55,0.18)",
};
const F = { display: "'Bebas Neue',sans-serif", body: "'Inter',sans-serif", mono: "'Roboto Mono',monospace" };
const grainSVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`;

/* ═══════════════════════════════════════
   12-STATE TAX CREDIT DATA
   ═══════════════════════════════════════ */
const STATES = [
  { id:"GA", name:"Georgia", rate:20, type:"Transferable", note:"20% base. +10% GA logo (30%). Sold ~$0.94-0.97. No cap. No sunset. Min $500K.", months:"6-12" },
  { id:"NM", name:"New Mexico", rate:25, type:"Refundable", note:"25% base. +10% rural, +5% TV/facility (40% max). Cash refund. $140M cap FY2026.", months:"6-12" },
  { id:"CA", name:"California", rate:35, type:"Refundable", note:"35% base. +5% VFX, +5% out-LA, +10% local hire. Min $1M, 75% CA spend. $750M cap.", months:"6-18" },
  { id:"NV", name:"Nevada", rate:15, type:"Transferable", note:"15% base. +5% NV BTL, +5% rural (25% max). Non-res BTL ~0%. Small $10M cap.", months:"6-12" },
  { id:"NY", name:"New York", rate:25, type:"Refundable", note:"25% base. +10% upstate (35%). Min $1M. Indie program separate. $700M cap.", months:"6-18" },
  { id:"NJ", name:"New Jersey", rate:35, type:"Transferable", note:"35% base (30% NYC zone). 40% studio partner. State buys 95% for 2026+. To 2049.", months:"12+" },
  { id:"LA", name:"Louisiana", rate:25, type:"Trans/Refund", note:"25% base to 40% (+15% res payroll, +5% rural, +10% screenplay, +5% VFX). Buyback 90%. Cap $125M. Sunset 2031.", months:"3-6+" },
  { id:"TX", name:"Texas", rate:20, type:"Cash Grant", note:"Grant not credit. Post-SB22: up to 25% for $5M+. Non-res wages ineligible. Content review. Sunset 2035.", months:"Variable" },
  { id:"PA", name:"Pennsylvania", rate:25, type:"Transferable", note:"25% base. +5% facility (30%). 30% post. Min 60% PA spend. $100M cap.", months:"6-12" },
  { id:"IL", name:"Illinois", rate:30, type:"Transferable", note:"35% res wages/vendors, 30% non-res (blended ~30%). Bonuses to 55%. $500K/person.", months:"Variable" },
  { id:"MA", name:"Massachusetts", rate:25, type:"Trans/Refund", note:"25% payroll + 25% expenses (if 75%+ MA spend). No cap. $1M salary excl. Permanent.", months:"3-6" },
  { id:"OK", name:"Oklahoma", rate:20, type:"Cash Rebate", note:"20% base to 30%. Min $50K budget, $25K OK spend. $30M cap. Sunset 2031.", months:"4-8" },
  { id:"OTHER", name:"Other / Not Sure", rate:0, type:"—", note:"Enter your rate manually. Check with your state film office.", months:"—" },
];

/* ═══════════════════════════════════════
   GENRES + REVENUE BENCHMARKS
   Per-window revenue per $1M budget (in $K)
   ═══════════════════════════════════════ */
const GENRES = ["Thriller","Horror","Drama","Action","Comedy","Sci-Fi","Documentary","Romance"];
const GB = {
  Thriller:{th:900,mg:75,ov:25,sv:150,tv:12,av:8,dt:38,it:25,an:8,mr:0},
  Horror:{th:1200,mg:100,ov:40,sv:200,tv:18,av:12,dt:25,it:20,an:5,mr:5},
  Drama:{th:600,mg:60,ov:15,sv:120,tv:8,av:5,dt:50,it:35,an:12,mr:0},
  Action:{th:1100,mg:120,ov:50,sv:180,tv:15,av:10,dt:30,it:40,an:6,mr:8},
  Comedy:{th:800,mg:40,ov:10,sv:130,tv:10,av:15,dt:45,it:15,an:8,mr:3},
  "Sci-Fi":{th:700,mg:90,ov:30,sv:160,tv:14,av:8,dt:35,it:30,an:7,mr:12},
  Documentary:{th:200,mg:30,ov:5,sv:80,tv:5,av:20,dt:60,it:20,an:25,mr:0},
  Romance:{th:500,mg:50,ov:10,sv:140,tv:10,av:12,dt:40,it:20,an:8,mr:0},
};

/* ═══════════════════════════════════════
   BUDGET TEMPLATE (% of total budget)
   ═══════════════════════════════════════ */
const BT = [
  {n:"Story & Rights",p:.020,c:"ATL"},{n:"Screenplay",p:.0125,c:"ATL"},{n:"Producer(s)",p:.030,c:"ATL"},
  {n:"Director",p:.050,c:"ATL"},{n:"Lead Cast",p:.100,c:"ATL"},{n:"Supporting Cast",p:.025,c:"ATL"},
  {n:"Production Staff",p:.0175,c:"BTL"},{n:"Camera",p:.040,c:"BTL"},{n:"Grip & Electric",p:.060,c:"BTL"},
  {n:"Art Dept",p:.045,c:"BTL"},{n:"Wardrobe",p:.0175,c:"BTL"},{n:"Hair & Makeup",p:.014,c:"BTL"},
  {n:"Sound",p:.011,c:"BTL"},{n:"Locations",p:.0325,c:"BTL"},{n:"Transport",p:.0275,c:"BTL"},
  {n:"Catering",p:.020,c:"BTL"},{n:"Extras",p:.009,c:"BTL"},{n:"Stunts",p:.0075,c:"BTL"},
  {n:"Editorial",p:.0375,c:"Post"},{n:"Color/DI",p:.020,c:"Post"},{n:"Music",p:.0175,c:"Post"},
  {n:"Sound Design",p:.015,c:"Post"},{n:"VFX/Titles",p:.010,c:"Post"},{n:"Deliverables",p:.010,c:"Post"},
  {n:"Captions",p:.0025,c:"Post"},
  {n:"Insurance+E&O",p:.0185,c:"G&A"},{n:"Legal",p:.010,c:"G&A"},{n:"Accounting",p:.0075,c:"G&A"},
  {n:"Festivals",p:.005,c:"G&A"},{n:"Marketing Seed",p:.010,c:"G&A"},
];

/* ═══════════════════════════════════════
   RISKS (score computed dynamically)
   ═══════════════════════════════════════ */
const RISKS_RAW = [
  {name:"Completion Risk",prob:25,impact:4,cat:"Production",mit:"Completion bond, 10% contingency, experienced line producer."},
  {name:"No Distribution",prob:40,impact:5,cat:"Commercial",mit:"Attach sales agent pre-production, A-list festivals, SVOD-first fallback."},
  {name:"Revenue Under",prob:45,impact:5,cat:"Financial",mit:"Conservative projections, investor priority, diversified windows."},
  {name:"SVOD Contraction",prob:35,impact:4,cat:"Market",mit:"Multi-window strategy, no single-platform dependency."},
  {name:"Key Person Risk",prob:15,impact:5,cat:"Production",mit:"Cast insurance, talent clauses, backup casting."},
  {name:"Tax Credit Risk",prob:20,impact:4,cat:"Financial",mit:"Qualified tax attorney, pre-approval, conservative estimate."},
  {name:"Chain of Title",prob:10,impact:5,cat:"Legal",mit:"Full clearance, E&O insurance, copyright registration."},
  {name:"Bridge Loan Rate",prob:15,impact:3,cat:"Financial",mit:"Fixed-rate agreement, sensitivity at 9%."},
  {name:"Investor Default",prob:10,impact:4,cat:"Operational",mit:"Binding subscriptions, PPM disclaims redemption."},
  {name:"Festival Rejection",prob:40,impact:3,cat:"Commercial",mit:"Direct distribution backup, trailer-driven release."},
  {name:"Music Clearance",prob:20,impact:3,cat:"Legal",mit:"Pre-clear all music, original score preferred."},
  {name:"FX Risk",prob:25,impact:3,cat:"Financial",mit:"USD invoicing, USD collection account."},
  {name:"Talent Controversy",prob:10,impact:4,cat:"Reputational",mit:"Morality clauses, crisis PR, insurance."},
  {name:"Data Loss",prob:10,impact:3,cat:"Operational",mit:"Daily backup, RAID + offsite."},
];

/* ═══════════════════════════════════════
   DISTRIBUTION PRESETS
   ═══════════════════════════════════════ */
const DIST_PRESETS = {
  "SVOD-First":{exhib:0,pa:0,distFee:25,saComm:10,desc:"Straight to streaming. Lowest breakeven."},
  "Limited Theatrical":{exhib:50,pa:150000,distFee:30,saComm:12,desc:"Platform release + SVOD. Higher visibility."},
  "Hybrid / Self":{exhib:10,pa:75000,distFee:15,saComm:5,desc:"Self-distributed. Max control, more effort."},
};

/* ═══════════════════════════════════════
   GLOSSARY
   ═══════════════════════════════════════ */
const GLOSSARY = [
  {term:"Waterfall",def:"The order in which revenue flows from gross receipts to each participant. Each level must be satisfied before money flows to the next."},
  {term:"Recoupment",def:"The process of investors recovering their principal investment from revenue proceeds."},
  {term:"Recoupment Premium",def:"A bonus above the original investment. A 20% premium on $100K means investors receive $120K before any profit split."},
  {term:"MOIC",def:"Multiple on Invested Capital. Total dollars returned divided by dollars invested. 1.5× means $1.50 back for every $1.00."},
  {term:"ROI",def:"Return on Investment. Net profit as a percentage of the investment."},
  {term:"Backend",def:"Profit participation after recoupment. The percentage of remaining proceeds allocated to investors or producers."},
  {term:"Net Producer Proceeds",def:"Revenue reaching the production company after all distribution fees, commissions, and marketing costs."},
  {term:"P&A",def:"Prints & Advertising. The distributor's marketing budget, recouped from revenue. Not a cost the producer pays directly."},
  {term:"Exhibitor Split",def:"Percentage of theatrical box office retained by theaters. Typically 45-55%."},
  {term:"Distribution Fee",def:"Distributor's commission on net revenue for selling and marketing your film. Typically 25-35%."},
  {term:"Sales Agent Commission",def:"Fee for territory-by-territory international rights sales. Typically 10-15%."},
  {term:"Tax Credit / Rebate",def:"State incentive returning a percentage of qualified production spend. Received post-wrap, not during production."},
  {term:"Bridge Loan",def:"Short-term loan against the expected tax credit, providing production cash during filming rather than waiting for the state to pay."},
  {term:"Gap Financing",def:"Loan against unsold distribution rights. Higher risk than a bridge loan, higher interest, second position in repayment."},
  {term:"Mezzanine",def:"Subordinated debt between senior debt and equity in repayment priority. Higher rate reflects higher risk."},
  {term:"Equity",def:"At-risk investment capital. Last in line for repayment but participates in profit upside through backend splits."},
  {term:"SPV",def:"Special Purpose Vehicle. A single-purpose LLC created for one film production, isolating the investment from other activities."},
  {term:"Reg D 506(b)",def:"Federal securities exemption for raising capital from accredited investors without public advertising. Requires a PPM."},
  {term:"PPM",def:"Private Placement Memorandum. The legal document required to offer securities to investors. Drafted by your entertainment attorney."},
  {term:"Completion Bond",def:"Insurance guaranteeing delivery on budget and schedule. Required by most lenders. Typically 2-3% of budget."},
  {term:"CAMA",def:"Collection Account Management Agreement. Neutral third-party account ensuring the waterfall is followed correctly."},
  {term:"E&O Insurance",def:"Errors & Omissions. Required by all distributors at delivery. Covers IP claims. Typically $1M minimum."},
  {term:"SAG-AFTRA",def:"Screen Actors Guild. Union representing actors. Different budget tiers have different minimum rate requirements."},
  {term:"DGA",def:"Directors Guild of America. Represents directors, assistant directors, and unit production managers."},
  {term:"WGA",def:"Writers Guild of America. Governs screenwriter minimums, credits, and residuals."},
];

/* ═══════════════════════════════════════
   DERIVE — Core calculation engine
   All math fixes applied
   ═══════════════════════════════════════ */
function derive(inp, budgetEdits, bondOn, bondPct) {
  const tc = Math.round(inp.totalBudget * inp.taxCreditPct / 100);
  const sd = Math.round(tc * inp.taxCreditLoanPct / 100);
  const bondAmt = bondOn ? Math.round(inp.totalBudget * bondPct / 100) : 0;

  const bi = BT.map((t, i) => {
    const def = Math.round(inp.totalBudget * t.p);
    const ed = budgetEdits[i];
    return { name: t.n, amount: ed !== undefined ? ed : def, category: t.c, isEdited: ed !== undefined };
  });
  if (bondOn) bi.push({ name: "Completion Bond", amount: bondAmt, category: "G&A", isEdited: false, isBond: true });

  const ct = {}; bi.forEach(x => { ct[x.category] = (ct[x.category] || 0) + x.amount; });
  const cont = Math.round(((ct.BTL || 0) + (ct.Post || 0)) * 0.10);
  const actualBudget = bi.reduce((s, b) => s + b.amount, 0) + cont;
  const eq = Math.max(0, actualBudget - sd - inp.gapMezz - inp.preSaleLoan);
  const estInv = inp.minInvestment > 0 ? Math.ceil(eq / inp.minInvestment) : 0;

  const b = GB[inp.genre] || GB.Thriller;
  const m = inp.totalBudget / 1e6;

  const rw = [
    { window:"Theatrical", conservative:Math.round(b.th*m*.45e3), base:Math.round(b.th*m*1e3), upside:Math.round(b.th*m*2.8e3) },
    { window:"Intl MGs", conservative:Math.round(b.mg*m*.33e3), base:Math.round(b.mg*m*1e3), upside:Math.round(b.mg*m*3.3e3) },
    { window:"Intl Overages", conservative:0, base:Math.round(b.ov*m*1e3), upside:Math.round(b.ov*m*4e3) },
    { window:"SVOD", conservative:Math.round(b.sv*m*.25e3), base:Math.round(b.sv*m*1e3), upside:Math.round(b.sv*m*5e3) },
    { window:"TVOD", conservative:Math.round(b.tv*m*.5e3), base:Math.round(b.tv*m*1e3), upside:Math.round(b.tv*m*3.6e3) },
    { window:"AVOD/FAST", conservative:Math.round(b.av*m*.5e3), base:Math.round(b.av*m*1e3), upside:Math.round(b.av*m*3.7e3) },
    { window:"Dom TV", conservative:Math.round(b.dt*m*.27e3), base:Math.round(b.dt*m*1e3), upside:Math.round(b.dt*m*4e3) },
    { window:"Intl TV", conservative:Math.round(b.it*m*.2e3), base:Math.round(b.it*m*1e3), upside:Math.round(b.it*m*4e3) },
    { window:"Ancillary", conservative:Math.round(b.an*m*.33e3), base:Math.round(b.an*m*1e3), upside:Math.round(b.an*m*3.3e3) },
    { window:"Merch", conservative:0, base:Math.round(b.mr*m*1e3), upside:Math.round(b.mr*m*5e3) },
  ];

  // FIX 3.1: NO tax credit in revenue totals
  const rt = {
    conservative: rw.reduce((s, r) => s + r.conservative, 0),
    base: rw.reduce((s, r) => s + r.base, 0),
    upside: rw.reduce((s, r) => s + r.upside, 0),
  };

  // FIX 3.2 + 3.3: Compute genre-specific fractions for exhibitor and SA
  const baseTotal = rw.reduce((s, r) => s + r.base, 0) || 1;
  const thFraction = (b.th * m * 1e3) / baseTotal;
  const intlFraction = ((b.mg + b.ov + b.it) * m * 1e3) / baseTotal;

  const drAmt = sd * (1 + inp.seniorDebtRate / 100 * inp.loanTerm / 12);
  const gpAmt = inp.gapMezz * (1 + inp.gapRate / 100 * inp.loanTerm / 12);
  // FIX 3.4: Pre-sale repayment
  const psAmt = inp.preSaleLoan * (1 + inp.seniorDebtRate / 100 * inp.loanTerm / 12);

  function calcWF(gr) {
    const hasTh = inp.paBudget > 0;
    // FIX 3.3: Exhibitor on theatrical fraction only
    const et = hasTh ? gr * thFraction * (inp.exhibitorPct / 100) : 0;
    const ap = gr - et - inp.paBudget;
    const df = Math.max(0, ap) * (inp.distFeePct / 100);
    const ad = Math.max(0, ap - df);
    // FIX 3.2: SA on international fraction only
    const sc = gr * intlFraction * (inp.saCommPct / 100);
    const npp = Math.max(0, ad - sc);
    // FIX 3.4: Include pre-sale in deductions
    const afd = Math.max(0, npp - drAmt - gpAmt - psAmt);
    const ra = eq * (1 + inp.recoupPremium / 100);
    const ir = Math.min(ra, afd);
    const rem = Math.max(0, afd - ra);
    const ib = rem * (inp.investorBackend / 100);
    const pb = rem * (1 - inp.investorBackend / 100);
    const tr = ir + ib;
    // FIX 3.6: Null MOIC/ROI when equity is 0
    return { gr, et, pa: inp.paBudget, df, sc, npp, drAmt, gpAmt, psAmt, afd, ir, rem, ib, pb, tr,
      moic: eq > 0 ? tr / eq : null, roi: eq > 0 ? (tr - eq) / eq : null, eq, hasTh };
  }

  // FIX 3.7: Binary search breakeven per strategy
  function findBEFor(ov) {
    let lo = 0, hi = 2e7;
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      const hasTh2 = (ov.pa || 0) > 0;
      const et2 = hasTh2 ? mid * thFraction * ((ov.exhib || 0) / 100) : 0;
      const ap2 = mid - et2 - (ov.pa || 0);
      const df2 = Math.max(0, ap2) * ((ov.df || 25) / 100);
      const ad2 = Math.max(0, ap2 - df2);
      const sc2 = mid * intlFraction * ((ov.sa || 10) / 100);
      const npp2 = Math.max(0, ad2 - sc2);
      const afd2 = Math.max(0, npp2 - drAmt - gpAmt - psAmt);
      const ra2 = eq * (1 + inp.recoupPremium / 100);
      const ir2 = Math.min(ra2, afd2);
      const rem2 = Math.max(0, afd2 - ra2);
      const tr2 = ir2 + rem2 * (inp.investorBackend / 100);
      tr2 >= eq ? hi = mid : lo = mid;
    }
    return Math.round((lo + hi) / 2);
  }

  const be = [
    { strategy:"SVOD-First", breakeven: findBEFor({exhib:0,pa:0,df:25,sa:10}) },
    { strategy:"Limited Theatrical", breakeven: findBEFor({exhib:inp.exhibitorPct,pa:inp.paBudget,df:inp.distFeePct,sa:inp.saCommPct}) },
    { strategy:"Wide Release", breakeven: findBEFor({exhib:52,pa:Math.max(1e6,actualBudget*.5),df:35,sa:12}) },
    { strategy:"Intl Pre-Sales", breakeven: findBEFor({exhib:0,pa:50000,df:20,sa:12}) },
    { strategy:"Hybrid/Self", breakeven: findBEFor({exhib:10,pa:75000,df:15,sa:5}) },
  ];

  const cf = [
    {month:"Mo 1",inflows:eq+sd,outflows:-Math.round(actualBudget*.094),phase:"Pre-Prod"},
    {month:"Mo 2",inflows:0,outflows:-Math.round(actualBudget*.068),phase:"Pre-Prod"},
    {month:"Mo 3",inflows:0,outflows:-Math.round(actualBudget*.158),phase:"Production"},
    {month:"Mo 4",inflows:0,outflows:-Math.round(actualBudget*.158),phase:"Production"},
    {month:"Mo 5",inflows:0,outflows:-Math.round(actualBudget*.108),phase:"Production"},
    {month:"Mo 6",inflows:0,outflows:-Math.round(actualBudget*.108),phase:"Post"},
    {month:"Mo 7",inflows:0,outflows:-Math.round(actualBudget*.108),phase:"Post"},
    {month:"Mo 8",inflows:0,outflows:-Math.round(actualBudget*.083),phase:"Post"},
    {month:"Mo 9",inflows:0,outflows:-Math.round(actualBudget*.003),phase:"Delivery"},
    {month:"Mo 10",inflows:0,outflows:-Math.round(actualBudget*.003),phase:"Delivery"},
    {month:"Mo 11",inflows:Math.round(rt.base*.12),outflows:-Math.round(drAmt),phase:"Distrib."},
    {month:"Mo 12",inflows:Math.round(rt.base*.30)+tc,outflows:0,phase:"Distrib."},
    {month:"Mo 18",inflows:Math.round(rt.base*.08),outflows:0,phase:"Distrib."},
    {month:"Mo 24+",inflows:Math.round(rt.base*.10),outflows:0,phase:"Distrib."},
  ];
  let cum = 0; cf.forEach(x => { cum += x.inflows + x.outflows; x.cumulative = cum; x.net = x.inflows + x.outflows; });

  const sources = [
    { name:"TC Bridge Loan", amount:sd, color:T.blue, pos:"1st — repaid from tax credit" },
    inp.gapMezz > 0 && { name:"Gap/Mezz", amount:inp.gapMezz, color:T.amber, pos:"2nd Position" },
    inp.preSaleLoan > 0 && { name:"Pre-Sale Loan", amount:inp.preSaleLoan, color:"#8B5CF6", pos:"1st Position" },
    { name:"Equity", amount:eq, color:T.equity, pos:"At-risk capital" },
  ].filter(Boolean);

  const cs = [
    { name:"Tax Credit", amount:tc, color:T.green, pos:"Non-dilutive — post-wrap" },
    { name:"Senior Debt", amount:sd, color:T.blue, pos:"1st Position" },
    inp.gapMezz > 0 && { name:"Gap/Mezz", amount:inp.gapMezz, color:T.amber, pos:"2nd Position" },
    inp.preSaleLoan > 0 && { name:"Pre-Sale Loan", amount:inp.preSaleLoan, color:"#8B5CF6", pos:"1st Position" },
    { name:"Equity", amount:eq, color:T.equity, pos:"3rd Position" },
  ].filter(Boolean);

  const bd = [
    { name:"Above the Line", value:ct.ATL||0, color:T.gold },
    { name:"Below the Line", value:ct.BTL||0, color:T.blue },
    { name:"Post-Production", value:ct.Post||0, color:T.purple },
    { name:"G&A", value:ct["G&A"]||0, color:T.green },
    { name:"Contingency", value:cont, color:T.amber },
  ];

  // FIX 3.5: Dynamic risk scores
  const risks = RISKS_RAW.map(r => ({ ...r, score: (r.prob / 100) * r.impact }));

  return { tc, sd, eq, estInv, bi, ct, cont, rw, rt, calcWF, cf, be, cs, sources, bd, risks, drAmt, gpAmt, psAmt, actualBudget, bondAmt, thFraction, intlFraction };
}

/* ═══════════════════════════════════════
   FORMAT HELPERS
   ═══════════════════════════════════════ */
const fmt = n => { if (n == null || isNaN(n)) return "$0"; if (Math.abs(n) >= 1e6) return "$"+(n/1e6).toFixed(1)+"M"; if (Math.abs(n) >= 1e3) return "$"+Math.round(n/1e3)+"K"; return "$"+Math.round(n); };
const fF = n => "$"+(n||0).toLocaleString();
const pct = n => ((n||0)*100).toFixed(1)+"%";
const CC = {ATL:T.gold,BTL:T.blue,Post:T.purple,"G&A":T.green};
const CL = {ATL:"Above the Line",BTL:"Below the Line — Production",Post:"Post-Production","G&A":"General & Administrative"};
const CAT_BENCH = {ATL:[20,30],BTL:[30,40],Post:[10,15],"G&A":[7,12]};

/* ═══════════════════════════════════════
   UI COMPONENTS
   ═══════════════════════════════════════ */
const Glass = ({children,style,tier="standard",...p}) => {
  const bg = tier==="primary"?T.glassBright:tier==="recessed"?T.glassRecessed:T.glass;
  const bd = tier==="primary"?T.borderBright:T.border;
  return <div style={{background:bg,border:`1px solid ${bd}`,borderRadius:T.radius,padding:"24px",...style}} {...p}>{children}</div>;
};
const SL = ({children,sub}) => (
  <div style={{marginBottom:sub?"14px":"8px"}}>
    <div style={{fontFamily:F.display,fontSize:"14px",letterSpacing:"5px",color:T.gold,textTransform:"uppercase",opacity:0.7}}>{children}</div>
    {sub && <div style={{fontFamily:F.body,fontSize:"13px",color:T.w40,marginTop:"6px",lineHeight:1.5,maxWidth:"640px"}}>{sub}</div>}
  </div>
);
const KPI = ({label,value,sub,color,explain}) => (
  <Glass style={{textAlign:"center",flex:1,minWidth:"155px",padding:"20px 16px"}}>
    <div style={{fontFamily:F.mono,fontSize:"11px",color:T.w55,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"10px"}}>{label}</div>
    <div style={{fontFamily:F.display,fontSize:"34px",color:color||T.w92,lineHeight:1}}>{value}</div>
    {sub && <div style={{fontFamily:F.mono,fontSize:"11px",color:T.w40,marginTop:"8px"}}>{sub}</div>}
    {explain && <div style={{fontFamily:F.body,fontSize:"11px",color:T.w40,marginTop:"8px",fontStyle:"italic",lineHeight:1.4}}>{explain}</div>}
  </Glass>
);
const Divider = () => <div style={{height:"1px",background:`linear-gradient(90deg,transparent,${T.goldDim},transparent)`,margin:"16px 0"}}/>;
const ComboInput = ({label,value,onChange,min=0,max=100,step=1,suffix="%",explain,fmt:fn,benchMin,benchMax}) => (
  <div style={{marginBottom:"22px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:"6px"}}>
      <span style={{fontFamily:F.mono,fontSize:"11px",color:T.w55,letterSpacing:"1px",textTransform:"uppercase"}}>{label}</span>
      <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
        {suffix!=="%"&&<span style={{fontFamily:F.mono,fontSize:"14px",color:T.gold}}>$</span>}
        <input type="number" value={value} onChange={e=>onChange(Number(e.target.value)||0)} min={min} max={max} step={step}
          style={{width:suffix==="%"?"60px":"120px",background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:"6px",padding:"6px 8px",color:T.gold,fontFamily:F.mono,fontSize:"14px",fontWeight:600,outline:"none",textAlign:"right",boxSizing:"border-box"}}/>
        {suffix&&<span style={{fontFamily:F.mono,fontSize:"12px",color:T.w40}}>{suffix}</span>}
      </div>
    </div>
    <div style={{position:"relative"}}>
      {benchMin!=null&&benchMax!=null&&<div style={{position:"absolute",top:0,height:"4px",left:`${((benchMin-min)/(max-min))*100}%`,width:`${((benchMax-benchMin)/(max-min))*100}%`,background:"rgba(212,175,55,0.15)",borderRadius:"2px",pointerEvents:"none"}}/>}
      <input type="range" min={min} max={max} step={step} value={Math.min(max,Math.max(min,value))} onChange={e=>onChange(Number(e.target.value))} style={{width:"100%",accentColor:T.gold,height:"4px",cursor:"pointer"}}/>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",fontFamily:F.mono,fontSize:"9px",color:T.w25,marginTop:"2px"}}>
      <span>{fn?fn(min):`${min}${suffix}`}</span>
      {benchMin!=null&&<span style={{color:T.w40}}>typical {fn?fn(benchMin):benchMin}–{fn?fn(benchMax):benchMax}{suffix===""?"":suffix}</span>}
      <span>{fn?fn(max):`${max}${suffix}`}</span>
    </div>
    {explain&&<div style={{fontFamily:F.body,fontSize:"11px",color:T.w40,marginTop:"5px",lineHeight:1.4}}>{explain}</div>}
  </div>
);
const TextInput = ({label,value,onChange,explain,placeholder}) => (
  <div style={{marginBottom:"22px"}}>
    <div style={{fontFamily:F.mono,fontSize:"11px",color:T.w55,letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px"}}>{label}</div>
    <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||label}
      style={{width:"100%",background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:"8px",padding:"12px 14px",color:T.w92,fontFamily:F.mono,fontSize:"14px",outline:"none",boxSizing:"border-box"}}/>
    {explain&&<div style={{fontFamily:F.body,fontSize:"11px",color:T.w40,marginTop:"4px"}}>{explain}</div>}
  </div>
);
const SelectInput = ({label,value,onChange,options,explain}) => (
  <div style={{marginBottom:"22px"}}>
    <div style={{fontFamily:F.mono,fontSize:"11px",color:T.w55,letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px"}}>{label}</div>
    <select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:"8px",padding:"12px 14px",color:T.w92,fontFamily:F.mono,fontSize:"14px",outline:"none",appearance:"none",cursor:"pointer",boxSizing:"border-box"}}>
      {options.map(o=><option key={typeof o==="string"?o:o.value} value={typeof o==="string"?o:o.value} style={{background:"#111",color:"#fff"}}>{typeof o==="string"?o:o.label}</option>)}
    </select>
    {explain&&<div style={{fontFamily:F.body,fontSize:"11px",color:T.w40,marginTop:"4px"}}>{explain}</div>}
  </div>
);
const SD = ({title}) => <div style={{display:"flex",alignItems:"center",gap:"16px",margin:"28px 0 18px"}}><div style={{height:"1px",flex:1,background:T.goldDim}}/><span style={{fontFamily:F.display,fontSize:"14px",letterSpacing:"4px",color:T.gold,opacity:0.6}}>{title}</span><div style={{height:"1px",flex:1,background:T.goldDim}}/></div>;
const CTT = ({active,payload,label}) => { if(!active||!payload?.length)return null; return <div style={{background:"rgba(0,0,0,0.95)",border:`1px solid ${T.goldDim}`,borderRadius:"8px",padding:"12px 16px",fontFamily:F.mono,fontSize:"11px"}}><div style={{color:T.w75,marginBottom:"6px"}}>{label}</div>{payload.map((p,i)=><div key={i} style={{color:p.color||T.w92,marginBottom:"3px"}}>{p.name}: {typeof p.value==="number"?fF(Math.abs(p.value)):p.value}</div>)}</div>;};
const FlowStep = ({num,label,amount,isLoss,isHighlight,explain}) => (
  <div style={{display:"flex",alignItems:"center",gap:"14px",padding:"14px 0",borderBottom:`1px solid ${T.goldGhost}`}}>
    <div style={{width:"32px",height:"32px",borderRadius:"50%",background:isHighlight?T.goldGhost:isLoss?T.redDim:T.greenDim,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.mono,fontSize:"12px",color:isHighlight?T.gold:isLoss?T.red:T.green,fontWeight:700,flexShrink:0}}>{num}</div>
    <div style={{flex:1}}><div style={{fontFamily:F.body,fontSize:"14px",color:T.w92,fontWeight:isHighlight?600:400}}>{label}</div>{explain&&<div style={{fontFamily:F.body,fontSize:"11px",color:T.w40,marginTop:"3px",lineHeight:1.4}}>{explain}</div>}</div>
    {amount!=null&&<div style={{fontFamily:F.mono,fontSize:"15px",color:isLoss?T.red:isHighlight?T.gold:T.green,fontWeight:600,whiteSpace:"nowrap"}}>{isLoss?"−":""}{fF(Math.abs(Math.round(amount)))}</div>}
  </div>
);
const Toggle = ({label,value,onChange,explain}) => (
  <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"14px"}}>
    <button onClick={()=>onChange(!value)} style={{width:"44px",height:"24px",borderRadius:"12px",background:value?T.gold:"rgba(255,255,255,0.1)",border:"none",cursor:"pointer",position:"relative",flexShrink:0,transition:"background 0.2s"}}><div style={{width:"18px",height:"18px",borderRadius:"50%",background:"#fff",position:"absolute",top:"3px",left:value?"23px":"3px",transition:"left 0.2s"}}/></button>
    <div><span style={{fontFamily:F.mono,fontSize:"12px",color:value?T.gold:T.w40}}>{label}</span>{explain&&<div style={{fontFamily:F.body,fontSize:"10px",color:T.w40,marginTop:"1px"}}>{explain}</div>}</div>
  </div>
);

/* ═══════════════════════════════════════
   TABS + NAV
   ═══════════════════════════════════════ */
const TABS = [
  {id:"setup",label:"Setup",tier:0},{id:"snapshot",label:"Your Deal",tier:0},
  {id:"overview",label:"Overview",tier:1},{id:"waterfall",label:"Waterfall",tier:1},{id:"revenue",label:"Revenue",tier:1},
  {id:"budget",label:"Budget",tier:2},{id:"capital",label:"Capital",tier:2},{id:"cashflow",label:"Cash Flow",tier:2},
  {id:"sensitivity",label:"Sensitivity",tier:2},{id:"risk",label:"Risk",tier:2},{id:"glossary",label:"Glossary",tier:2},
];
const NAV_SECTIONS = [{label:"BUILD",tiers:[0]},{label:"YOUR DEAL",tiers:[1]},{label:"DEEP DIVE",tiers:[2]}];

/* ═══════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════ */
export default function Dashboard() {
  const defaultInp = {title:"",genre:"Thriller",totalBudget:2000000,shootState:"GA",taxCreditPct:0,taxCreditLoanPct:90,gapMezz:0,preSaleLoan:0,minInvestment:50000,recoupPremium:20,investorBackend:50,seniorDebtRate:9,gapRate:16,loanTerm:18,exhibitorPct:50,paBudget:150000,distFeePct:30,saCommPct:12};
  const [inp,setInp] = useState(defaultInp);
  const [crew,setCrew] = useState({producer:"",director:"",writer:"",cast:""});
  const [logline,setLogline] = useState("");
  const [guilds,setGuilds] = useState({sag:false,dga:false,wga:false});
  const [sagTier,setSagTier] = useState("Modified Low Budget");
  const [bondOn,setBondOn] = useState(false);
  const [bondPct,setBondPct] = useState(2.5);
  const [distPreset,setDistPreset] = useState("Limited Theatrical");
  const [budgetEdits,setBudgetEdits] = useState({});
  const [tab,setTab] = useState(0);
  const [wizStep,setWizStep] = useState(0);
  const [scenario,setScenario] = useState(3500000);
  const [expandedRisk,setExpandedRisk] = useState(null);
  const [mounted,setMounted] = useState(false);
  const [tabAnim,setTabAnim] = useState(true);
  const [isMobile,setIsMobile] = useState(false);
  const mainRef = useRef(null);

  useEffect(()=>{setMounted(true);const c=()=>setIsMobile(window.innerWidth<1024);c();window.addEventListener("resize",c);return()=>window.removeEventListener("resize",c);},[]);
  const switchTab = i => { setTabAnim(false); setTimeout(()=>{setTab(i);setTabAnim(true);if(mainRef.current)mainRef.current.scrollTo(0,0);},50);};
  const s = useCallback((k,v) => setInp(p=>({...p,[k]:v})),[]);
  const d = useMemo(()=>derive(inp,budgetEdits,bondOn,bondPct),[inp,budgetEdits,bondOn,bondPct]);
  const wf = useMemo(()=>d.calcWF(scenario),[d,scenario]);
  const wfBase = useMemo(()=>d.calcWF(d.rt.base),[d]);
  const wfCon = useMemo(()=>d.calcWF(d.rt.conservative),[d]);
  const wfUp = useMemo(()=>d.calcWF(d.rt.upside),[d]);
  const wb = useMemo(()=>{
    const items=[{n:"Gross Rev",v:wf.gr,f:T.gold,t:"total"},{n:"Exhibitor",v:wf.et,f:"rgba(220,38,38,0.5)",t:"loss"},{n:"P&A",v:wf.pa,f:"rgba(220,38,38,0.5)",t:"loss"},{n:"Dist Fee",v:wf.df,f:"rgba(220,38,38,0.5)",t:"loss"},{n:"SA Comm",v:wf.sc,f:"rgba(220,38,38,0.5)",t:"loss"},{n:"Debt",v:wf.drAmt+wf.gpAmt+wf.psAmt,f:"rgba(220,38,38,0.5)",t:"loss"},{n:"Recoup",v:wf.ir,f:T.goldDim,t:"loss"},{n:"Inv Back",v:wf.ib,f:T.green,t:"gain"},{n:"Prod Back",v:wf.pb,f:T.purple,t:"gain"}].filter(i=>i.v>0||i.t==="total");
    let r=0;return items.map(i=>{if(i.t==="total"){r=i.v;return{name:i.n,base:0,value:i.v,fill:i.f};}else if(i.t==="loss"){r-=i.v;return{name:i.n,base:Math.max(0,r),value:i.v,fill:i.f};}else{return{name:i.n,base:0,value:i.v,fill:i.f};}});
  },[wf]);
  const sR=[500000,1e6,1500000,2500000,3500000,5e6];
  const sE=[Math.round(d.eq*.6),Math.round(d.eq*.8),d.eq,Math.round(d.eq*1.15),Math.round(d.eq*1.45)];
  const cSR=(rev,eqA)=>{const w=d.calcWF(rev);const r=d.eq>0?eqA/d.eq:0;return d.eq>0?((w.tr*r)-eqA)/eqA:-1;};
  const ht = inp.title.trim().length>0;
  const tid = TABS[tab]?.id;
  const findBE = useMemo(()=>{let lo=0,hi=2e7;for(let i=0;i<30;i++){const mid=(lo+hi)/2;const w=d.calcWF(mid);(w.tr>=d.eq)?hi=mid:lo=mid;}return Math.round((lo+hi)/2);},[d]);
  const find2x = useMemo(()=>{let lo=0,hi=4e7;for(let i=0;i<30;i++){const mid=(lo+hi)/2;d.calcWF(mid).tr>=d.eq*2?hi=mid:lo=mid;}return Math.round((lo+hi)/2);},[d]);
  const stateData = STATES.find(st=>st.id===inp.shootState)||STATES[12];
  const warnings = useMemo(()=>{const w=[];if(d.eq>d.actualBudget*.6)w.push(`Equity is ${Math.round(d.eq/d.actualBudget*100)}% of budget.`);if(inp.paBudget>inp.totalBudget*.4)w.push("P&A exceeds 40% of budget.");if(inp.recoupPremium>30)w.push(`${inp.recoupPremium}% premium is above standard (15-25%).`);if(inp.taxCreditPct===0)w.push("No tax incentive entered.");return w;},[inp,d]);
  const wizSteps=["Your Film","Funding Sources","Investor Terms","Distribution"];
  const applyDist = name => {const p=DIST_PRESETS[name];if(p){s("exhibitorPct",p.exhib);s("paBudget",p.pa);s("distFeePct",p.distFee);s("saCommPct",p.saComm);setDistPreset(name);}};
  const guildStr = [guilds.sag&&`SAG${sagTier?" ("+sagTier.replace("Budget","").trim()+")":""}`,guilds.dga&&"DGA",guilds.wga&&"WGA"].filter(Boolean).join(", ")||"Non-Union";
  const resetProject = ()=>{setInp(defaultInp);setCrew({producer:"",director:"",writer:"",cast:""});setLogline("");setGuilds({sag:false,dga:false,wga:false});setBondOn(false);setBondPct(2.5);setBudgetEdits({});setDistPreset("Limited Theatrical");setWizStep(0);setScenario(3500000);switchTab(0);};
  const contentStyle = {opacity:tabAnim?1:0,transform:tabAnim?"translateY(0)":"translateY(12px)",transition:"opacity 0.25s ease, transform 0.25s ease"};
  const moicDisplay = v => v !== null ? v.toFixed(2)+"×" : "N/A";
  const moicColor = v => v === null ? T.w55 : v >= 1 ? T.green : T.red;

  /* ═══ MOBILE GATE ═══ */
  if(isMobile) return (
    <div style={{background:T.bg,backgroundImage:grainSVG,color:T.w92,fontFamily:F.body,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",textAlign:"center"}}>
      <div style={{fontFamily:F.display,fontSize:"12px",letterSpacing:"6px",color:T.gold,opacity:0.5,marginBottom:"12px"}}>FILMMAKER.OG</div>
      <div style={{fontFamily:F.display,fontSize:"28px",color:T.w92,marginBottom:"16px"}}>BUILT FOR DESKTOP</div>
      <div style={{fontFamily:F.body,fontSize:"14px",color:T.w55,lineHeight:1.6,maxWidth:"320px"}}>The charts, models, and investor-ready exports need a full screen. Open on your laptop.</div>
    </div>
  );

  /* ═══ SIDEBAR ═══ */
  const sidebar = (
    <aside style={{width:"240px",minWidth:"240px",height:"100vh",position:"fixed",left:0,top:0,background:T.sidebar,borderRight:`1px solid ${T.border}`,padding:"20px 16px",display:"flex",flexDirection:"column",overflowY:"auto",zIndex:10}}>
      {/* Project Identity */}
      <div style={{fontFamily:F.mono,fontSize:"9px",color:T.gold,letterSpacing:"2px",opacity:0.5,marginBottom:"12px"}}>FILMMAKER.OG</div>
      <div style={{fontFamily:F.display,fontSize:"18px",color:T.w92,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ht?inp.title.toUpperCase():fmt(inp.totalBudget)+" PRODUCTION"}</div>
      <div style={{fontFamily:F.mono,fontSize:"10px",color:T.w55,marginTop:"4px"}}>{inp.genre} · {stateData.name}</div>
      <Divider/>
      <div style={{fontFamily:F.mono,fontSize:"9px",color:T.w40,letterSpacing:"1.5px",marginBottom:"2px"}}>BUDGET</div>
      <div style={{fontFamily:F.display,fontSize:"24px",color:T.gold}}>{fmt(d.actualBudget)}</div>
      <div style={{fontFamily:F.mono,fontSize:"9px",color:T.w40,letterSpacing:"1.5px",marginTop:"10px",marginBottom:"2px"}}>EQUITY NEEDED</div>
      <div style={{fontFamily:F.display,fontSize:"24px",color:T.equity}}>{fF(d.eq)}</div>
      <Divider/>

      {/* Navigation */}
      {NAV_SECTIONS.map(sec => (
        <div key={sec.label}>
          <div style={{fontFamily:F.mono,fontSize:"9px",color:T.gold,letterSpacing:"2px",opacity:0.5,marginTop:"14px",marginBottom:"6px"}}>{sec.label}</div>
          {TABS.filter(t=>sec.tiers.includes(t.tier)).map(t=>{
            const idx=TABS.indexOf(t);
            const active=tab===idx;
            return <div key={t.id} onClick={()=>switchTab(idx)} style={{padding:"8px 12px",borderRadius:"6px",fontSize:"13px",fontFamily:F.body,color:active?T.gold:T.w55,background:active?T.goldGhost:"transparent",borderLeft:active?`2px solid ${T.gold}`:"2px solid transparent",cursor:"pointer",marginBottom:"2px",transition:"all 0.15s"}}>{t.label}</div>;
          })}
        </div>
      ))}
      <Divider/>

      {/* Quick Adjust */}
      <div style={{fontFamily:F.mono,fontSize:"9px",color:T.gold,letterSpacing:"2px",opacity:0.5,marginBottom:"8px"}}>QUICK ADJUST</div>
      <div style={{marginBottom:"10px"}}>
        <div style={{fontFamily:F.mono,fontSize:"10px",color:T.w40,marginBottom:"4px"}}>State</div>
        <select value={inp.shootState} onChange={e=>s("shootState",e.target.value)} style={{width:"100%",background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:"6px",padding:"6px 8px",color:T.w92,fontFamily:F.mono,fontSize:"11px",outline:"none",boxSizing:"border-box"}}>{STATES.map(st=><option key={st.id} value={st.id} style={{background:"#111"}}>{st.name}</option>)}</select>
      </div>
      <div style={{marginBottom:"10px"}}>
        <div style={{fontFamily:F.mono,fontSize:"10px",color:T.w40,marginBottom:"4px"}}>Strategy</div>
        <select value={distPreset} onChange={e=>applyDist(e.target.value)} style={{width:"100%",background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:"6px",padding:"6px 8px",color:T.w92,fontFamily:F.mono,fontSize:"11px",outline:"none",boxSizing:"border-box"}}>{Object.keys(DIST_PRESETS).map(n=><option key={n} value={n} style={{background:"#111"}}>{n}</option>)}</select>
      </div>
      <div style={{marginBottom:"10px"}}>
        <div style={{fontFamily:F.mono,fontSize:"10px",color:T.w40,marginBottom:"4px"}}>Bond</div>
        <button onClick={()=>setBondOn(!bondOn)} style={{background:bondOn?T.goldGhost:"transparent",border:`1px solid ${bondOn?T.goldDim:T.goldGhost}`,borderRadius:"6px",padding:"4px 12px",fontFamily:F.mono,fontSize:"10px",color:bondOn?T.gold:T.w40,cursor:"pointer"}}>{bondOn?"ON":"OFF"}</button>
      </div>

      {/* Reset — pushed to bottom */}
      <div style={{marginTop:"auto",paddingTop:"16px"}}>
        <div onClick={resetProject} style={{fontFamily:F.mono,fontSize:"10px",color:T.w40,cursor:"pointer",padding:"4px 0"}}>Reset Project</div>
      </div>
    </aside>
  );

  /* ═══ MAIN RENDER ═══ */
  return (
    <div style={{display:"flex",minHeight:"100vh",background:T.bg,backgroundImage:grainSVG,fontFamily:F.body,color:T.w92}}>
      {sidebar}
      <main ref={mainRef} style={{marginLeft:"240px",flex:1,padding:"32px 40px",overflowY:"auto",minHeight:"100vh"}}>
        <div style={{maxWidth:"1000px",margin:"0 auto",...contentStyle}}>

        {/* ═══ SETUP WIZARD ═══ */}
        {tid==="setup"&&<div style={{maxWidth:"580px",margin:"0 auto"}}><Glass tier="primary">
          <div style={{textAlign:"center",marginBottom:"12px"}}>
            <div style={{width:"60%",height:"1px",background:`linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)`,margin:"0 auto 16px"}}/>
            <div style={{fontFamily:F.display,fontSize:"32px",color:T.w92,textShadow:"0 0 40px rgba(212,175,55,0.08)"}}>BUILD YOUR MODEL</div>
            <div style={{fontFamily:F.body,fontSize:"13px",color:T.w40,marginTop:"6px"}}>Step {wizStep+1} of 4 — {wizSteps[wizStep]}</div>
          </div>
          <div style={{height:"3px",background:T.goldGhost,borderRadius:"2px",margin:"16px 0 28px",overflow:"hidden"}}><div style={{height:"100%",width:`${((wizStep+1)/4)*100}%`,background:`linear-gradient(90deg,${T.gold},${T.goldBright})`,borderRadius:"2px",transition:"width 0.3s"}}/></div>

          {wizStep===0&&<>
            <TextInput label="Project Title" value={inp.title} onChange={v=>s("title",v)} explain="As it appears in legal documents"/>
            <SelectInput label="Genre" value={inp.genre} onChange={v=>s("genre",v)} options={GENRES} explain="Drives revenue benchmarks"/>
            <SD title="CREATIVE TEAM"/>
            <TextInput label="Producer(s)" value={crew.producer} onChange={v=>setCrew(p=>({...p,producer:v}))} placeholder="Lead producer"/>
            <TextInput label="Director" value={crew.director} onChange={v=>setCrew(p=>({...p,director:v}))} placeholder="Director or TBD"/>
            <TextInput label="Writer(s)" value={crew.writer} onChange={v=>setCrew(p=>({...p,writer:v}))} placeholder="Screenwriter(s)"/>
            <TextInput label="Lead Cast" value={crew.cast} onChange={v=>setCrew(p=>({...p,cast:v}))} placeholder="Attached or TBD"/>
            <SD title="PRODUCTION"/>
            <SelectInput label="Shoot State" value={inp.shootState} onChange={v=>s("shootState",v)} options={STATES.map(st=>({value:st.id,label:st.name}))} explain="For tax credit guidance — does not auto-fill"/>
            <ComboInput label="Total Production Budget" value={inp.totalBudget} onChange={v=>s("totalBudget",v)} min={250000} max={10000000} step={50000} suffix="" fmt={fmt} explain="All-in: cast, crew, post, insurance, contingency" benchMin={1e6} benchMax={5e6}/>
          </>}

          {wizStep===1&&<>
            <div style={{background:T.goldGhost,border:`1px solid ${T.goldDim}`,borderRadius:"10px",padding:"14px 16px",marginBottom:"22px"}}>
              <div style={{fontFamily:F.mono,fontSize:"10px",color:T.gold,letterSpacing:"1px"}}>{stateData.name.toUpperCase()} — {stateData.type.toUpperCase()}</div>
              <div style={{fontFamily:F.body,fontSize:"12px",color:T.w55,marginTop:"6px",lineHeight:1.5}}>{stateData.note}</div>
              <div style={{fontFamily:F.body,fontSize:"11px",color:T.w40,marginTop:"6px",fontStyle:"italic"}}>Enter the rate you're modeling. Consult a production tax attorney to confirm qualification.</div>
            </div>
            <ComboInput label="Tax Credit Rate" value={inp.taxCreditPct} onChange={v=>s("taxCreditPct",v)} min={0} max={45} explain={`= ${fF(Math.round(inp.totalBudget*inp.taxCreditPct/100))}`} benchMin={stateData.id!=="OTHER"?Math.max(0,stateData.rate-5):undefined} benchMax={stateData.id!=="OTHER"?stateData.rate+10:undefined}/>
            <ComboInput label="TC Loan Advance" value={inp.taxCreditLoanPct} onChange={v=>s("taxCreditLoanPct",v)} min={0} max={100} explain={`= ${fF(Math.round(inp.totalBudget*inp.taxCreditPct/100*inp.taxCreditLoanPct/100))} senior debt`} benchMin={85} benchMax={95}/>
            <ComboInput label="Gap / Mezz" value={inp.gapMezz} onChange={v=>s("gapMezz",v)} min={0} max={Math.round(inp.totalBudget*.2)} step={10000} suffix="" fmt={fmt} explain="Second-priority loan. Most projects don't need it."/>
            <ComboInput label="Pre-Sale Loan" value={inp.preSaleLoan} onChange={v=>s("preSaleLoan",v)} min={0} max={Math.round(inp.totalBudget*.25)} step={10000} suffix="" fmt={fmt} explain="Requires sales agent with executed MGs."/>
            <div style={{background:T.goldGhost,border:`2px solid ${T.goldDim}`,borderRadius:"12px",padding:"20px",textAlign:"center",margin:"12px 0"}}>
              <div style={{fontFamily:F.mono,fontSize:"10px",color:T.w55,letterSpacing:"2px"}}>EQUITY RAISE NEEDED</div>
              <div style={{fontFamily:F.display,fontSize:"48px",color:T.equity,lineHeight:1.1,marginTop:"6px"}}>{fF(d.eq)}</div>
              <div style={{fontFamily:F.body,fontSize:"12px",color:T.w40,marginTop:"8px"}}>~{d.estInv} investors at {fF(inp.minInvestment)} min</div>
            </div>
          </>}

          {wizStep===2&&<>
            <ComboInput label="Recoupment Premium" value={inp.recoupPremium} onChange={v=>s("recoupPremium",v)} min={0} max={40} explain={`Investors get ${100+inp.recoupPremium}% back before profit. 20% standard.`} benchMin={15} benchMax={25}/>
            <ComboInput label="Investor Backend" value={inp.investorBackend} onChange={v=>s("investorBackend",v)} min={20} max={80} explain={`Profit: ${inp.investorBackend}% inv / ${100-inp.investorBackend}% you.`} benchMin={40} benchMax={50}/>
            <ComboInput label="Min Investment" value={inp.minInvestment} onChange={v=>s("minInvestment",v)} min={10000} max={250000} step={5000} suffix="" fmt={fmt} explain="Smallest check you'll accept." benchMin={25000} benchMax={100000}/>
            <ComboInput label="Senior Debt Rate" value={inp.seniorDebtRate} onChange={v=>s("seniorDebtRate",v)} min={5} max={18} step={.5} explain="TC bridge loan rate. 8-12% typical." benchMin={8} benchMax={12}/>
            {inp.gapMezz>0&&<ComboInput label="Gap Loan Rate" value={inp.gapRate} onChange={v=>s("gapRate",v)} min={8} max={24} step={.5} explain="Higher risk = higher rate." benchMin={12} benchMax={20}/>}
            <ComboInput label="Loan Term" value={inp.loanTerm} onChange={v=>s("loanTerm",v)} min={6} max={48} suffix=" mo" explain="Time to repay from distribution." benchMin={12} benchMax={36}/>
            <SD title="PRODUCTION REQUIREMENTS"/>
            <Toggle label={bondOn?"COMPLETION BOND — ON":"COMPLETION BOND — OFF"} value={bondOn} onChange={setBondOn} explain="Required by most lenders. Skip to save 2-3%."/>
            {bondOn&&<ComboInput label="Bond %" value={bondPct} onChange={setBondPct} min={1.5} max={4} step={.5} explain={`= ${fF(Math.round(inp.totalBudget*bondPct/100))}`} benchMin={2} benchMax={3}/>}
            <SD title="GUILD STATUS"/>
            <Toggle label="SAG-AFTRA" value={guilds.sag} onChange={v=>setGuilds(p=>({...p,sag:v}))} explain="Actors union. Affects cast minimums."/>
            {guilds.sag&&<SelectInput label="SAG Tier" value={sagTier} onChange={setSagTier} options={["Ultra Low Budget","Modified Low Budget","Low Budget","Standard"]} explain="Determines cast minimum rates."/>}
            <Toggle label="DGA" value={guilds.dga} onChange={v=>setGuilds(p=>({...p,dga:v}))} explain="Directors Guild. Affects director minimums."/>
            <Toggle label="WGA" value={guilds.wga} onChange={v=>setGuilds(p=>({...p,wga:v}))} explain="Writers Guild. Affects writer minimums."/>
            {!guilds.sag&&!guilds.dga&&!guilds.wga&&<div style={{fontFamily:F.body,fontSize:"12px",color:T.w40,fontStyle:"italic",marginTop:"4px"}}>Non-union project — no guild minimums apply.</div>}
          </>}

          {wizStep===3&&<>
            <div style={{fontFamily:F.body,fontSize:"13px",color:T.w55,marginBottom:"16px"}}>Choose a strategy to auto-fill, then adjust.</div>
            <div style={{display:"flex",gap:"10px",marginBottom:"24px"}}>{Object.keys(DIST_PRESETS).map(n=><button key={n} onClick={()=>applyDist(n)} style={{flex:1,background:distPreset===n?T.goldGhost:"transparent",border:`1px solid ${distPreset===n?T.goldDim:T.goldGhost}`,borderRadius:"10px",padding:"12px",cursor:"pointer",textAlign:"left"}}><div style={{fontFamily:F.mono,fontSize:"11px",color:distPreset===n?T.gold:T.w55,fontWeight:600}}>{n}</div><div style={{fontFamily:F.body,fontSize:"10px",color:T.w40,marginTop:"4px",lineHeight:1.4}}>{DIST_PRESETS[n].desc}</div></button>)}</div>
            <ComboInput label="Exhibitor Split" value={inp.exhibitorPct} onChange={v=>s("exhibitorPct",v)} min={0} max={60} explain="Theater's cut. 0% for streaming-only." benchMin={45} benchMax={55}/>
            <ComboInput label="P&A / Marketing" value={inp.paBudget} onChange={v=>s("paBudget",v)} min={0} max={Math.round(inp.totalBudget*.5)} step={10000} suffix="" fmt={fmt} explain="Distributor's spend recouped from revenue. $0 for streaming."/>
            <ComboInput label="Distribution Fee" value={inp.distFeePct} onChange={v=>s("distFeePct",v)} min={10} max={40} explain="Distributor's commission. 25-35% typical." benchMin={25} benchMax={35}/>
            <ComboInput label="SA Commission" value={inp.saCommPct} onChange={v=>s("saCommPct",v)} min={5} max={20} explain="Agent's fee on international. 10-15% typical." benchMin={10} benchMax={15}/>
            {warnings.length>0&&<div style={{background:T.amberDim,border:"1px solid rgba(245,158,11,0.3)",borderRadius:"10px",padding:"14px 16px",margin:"16px 0"}}>{warnings.map((w,i)=><div key={i} style={{fontFamily:F.body,fontSize:"12px",color:T.amber,marginBottom:i<warnings.length-1?"8px":0,lineHeight:1.4}}>⚠ {w}</div>)}</div>}
          </>}

          <div style={{display:"flex",gap:"12px",marginTop:"24px"}}>
            {wizStep>0&&<button onClick={()=>setWizStep(w=>w-1)} style={{flex:1,padding:"16px",background:"transparent",border:`1px solid ${T.goldDim}`,borderRadius:"10px",fontFamily:F.display,fontSize:"16px",letterSpacing:"2px",color:T.gold,cursor:"pointer"}}>← BACK</button>}
            {wizStep<3
              ?<button onClick={()=>setWizStep(w=>w+1)} style={{flex:1,padding:"16px",background:T.goldGhost,border:`1px solid ${T.goldDim}`,borderRadius:"10px",fontFamily:F.display,fontSize:"16px",letterSpacing:"2px",color:T.gold,cursor:"pointer"}}>NEXT →</button>
              :<button onClick={()=>switchTab(1)} style={{flex:1,padding:"16px",background:`linear-gradient(135deg,${T.gold},${T.goldBright})`,border:"none",borderRadius:"10px",fontFamily:F.display,fontSize:"18px",letterSpacing:"3px",color:"#000",cursor:"pointer",fontWeight:700}}>VIEW YOUR DEAL →</button>}
          </div>
        </Glass></div>}

        {/* ═══ SNAPSHOT ═══ */}
        {tid==="snapshot"&&<div style={{display:"flex",flexDirection:"column",gap:"20px",maxWidth:"720px",margin:"0 auto"}}>
          <Glass tier="primary"><SL>The Project</SL>
            {logline?<div style={{fontFamily:F.body,fontSize:"15px",color:T.w75,fontStyle:"italic",marginBottom:"12px",lineHeight:1.5}}>"{logline}"</div>:<input type="text" value={logline} onChange={e=>setLogline(e.target.value)} placeholder="Add a one-line description (optional)" style={{width:"100%",background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:"8px",padding:"10px 14px",color:T.w75,fontFamily:F.body,fontSize:"13px",outline:"none",boxSizing:"border-box",fontStyle:"italic",marginBottom:"12px"}}/>}
            <div style={{fontFamily:F.body,fontSize:"15px",color:T.w92,lineHeight:1.7}}>You're making a <strong style={{color:T.gold}}>{inp.genre}</strong> film with a budget of <strong style={{color:T.gold}}>{fF(d.actualBudget)}</strong>. You need <strong style={{color:T.equity}}>{fF(d.eq)}</strong> from investors — roughly <strong>{d.estInv} investors</strong> at {fF(inp.minInvestment)} each.</div>
            {(crew.producer||crew.director||crew.writer||crew.cast)&&<div style={{marginTop:"12px",display:"flex",gap:"16px",flexWrap:"wrap"}}>{[{l:"Producer",v:crew.producer},{l:"Director",v:crew.director},{l:"Writer",v:crew.writer},{l:"Cast",v:crew.cast}].filter(x=>x.v).map(x=><div key={x.l}><div style={{fontFamily:F.mono,fontSize:"9px",color:T.w40,letterSpacing:"1px"}}>{x.l.toUpperCase()}</div><div style={{fontFamily:F.body,fontSize:"13px",color:T.w75,marginTop:"2px"}}>{x.v}</div></div>)}</div>}
          </Glass>
          <Glass><SL sub="Production cash sources = budget uses.">Sources & Uses</SL>
            <div style={{display:"flex",gap:"24px",marginTop:"12px"}}>
              <div style={{flex:1}}><div style={{fontFamily:F.mono,fontSize:"11px",color:T.gold,letterSpacing:"2px",marginBottom:"10px"}}>SOURCES</div>{d.sources.map(c=><div key={c.name} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.goldGhost}`}}><span style={{fontFamily:F.body,fontSize:"13px",color:T.w75}}>{c.name}</span><span style={{fontFamily:F.mono,fontSize:"13px",color:c.color}}>{fF(c.amount)}</span></div>)}<div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderTop:`2px solid ${T.goldDim}`,marginTop:"4px"}}><strong>Total</strong><strong>{fF(d.sources.reduce((s,c)=>s+c.amount,0))}</strong></div></div>
              <div style={{width:"1px",background:T.goldGhost}}/>
              <div style={{flex:1}}><div style={{fontFamily:F.mono,fontSize:"11px",color:T.gold,letterSpacing:"2px",marginBottom:"10px"}}>USES</div>{d.bd.map(c=><div key={c.name} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.goldGhost}`}}><span style={{fontFamily:F.body,fontSize:"13px",color:T.w75}}>{c.name}</span><span style={{fontFamily:F.mono,fontSize:"13px",color:T.w75}}>{fF(c.value)}</span></div>)}<div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderTop:`2px solid ${T.goldDim}`,marginTop:"4px"}}><strong>Total</strong><strong>{fF(d.bd.reduce((s,c)=>s+c.value,0))}</strong></div></div>
            </div>
          </Glass>
          {/* FIX 2.12: Flow BEFORE thermometer */}
          <Glass><SL sub="Every dollar passes through deductions in this order.">How Investors Get Paid</SL>
            <FlowStep num="1" label="Your film earns revenue" explain="Streaming, theatrical, international, TV" amount={wfBase.gr}/>
            <FlowStep num="2" label={wfBase.hasTh?"Theaters, distributors, and agents take their cut":"Distributor and sales agent take their fees"} explain={wfBase.hasTh?`Exhibitors (~${inp.exhibitorPct}%), distributor (~${inp.distFeePct}%), P&A (distributor's spend), SA commission`:`Distributor fee (~${inp.distFeePct}%) and SA commission (~${inp.saCommPct}%). No theatrical — straight to streaming.`} amount={-(wfBase.et+wfBase.pa+wfBase.df+wfBase.sc)} isLoss/>
            <FlowStep num="3" label="Net Producer Proceeds" explain="Money reaching your production company" amount={wfBase.npp} isHighlight/>
            <FlowStep num="4" label="Loans repaid first" explain="Senior debt, gap, and pre-sale — first priority" amount={-(wfBase.drAmt+wfBase.gpAmt+wfBase.psAmt)} isLoss/>
            <FlowStep num="5" label={`Investors get ${100+inp.recoupPremium}% back`} explain={`${fF(d.eq)} + ${inp.recoupPremium}% = ${fF(Math.round(d.eq*(1+inp.recoupPremium/100)))}`} amount={-wfBase.ir} isLoss/>
            <FlowStep num="6" label={`Profit splits ${inp.investorBackend}/${100-inp.investorBackend}`} explain={`${inp.investorBackend}% investors / ${100-inp.investorBackend}% filmmaker`} amount={wfBase.ib+wfBase.pb}/>
          </Glass>
          {/* Thermometer */}
          <Glass tier="primary"><SL sub="Revenue needed at each outcome level.">What Has to Happen</SL>
            {(()=>{const mx=Math.max(d.rt.upside,find2x)*1.15;const mk=[{l:"Breakeven",v:findBE,c:T.amber},{l:"Base",v:d.rt.base,c:T.gold},{l:"Upside",v:d.rt.upside,c:T.green}];if(find2x<mx*.95)mk.push({l:"2×",v:find2x,c:T.goldBright});return<div style={{marginTop:"16px"}}><div style={{position:"relative",height:"40px",background:T.goldGhost,borderRadius:"8px",overflow:"hidden"}}><div style={{position:"absolute",left:0,top:0,height:"100%",width:`${Math.min(95,(d.rt.base/mx)*100)}%`,background:"linear-gradient(90deg,rgba(60,179,113,0.12),rgba(212,175,55,0.18))",borderRadius:"8px"}}/>{mk.map(m=><div key={m.l} style={{position:"absolute",left:`${Math.min(97,(m.v/mx)*100)}%`,top:0,height:"100%",width:"2px",background:m.c,opacity:0.9}}/>)}</div><div style={{position:"relative",height:"56px",marginTop:"6px"}}>{mk.map(m=><div key={m.l} style={{position:"absolute",left:`${Math.min(88,Math.max(2,(m.v/mx)*100))}%`,textAlign:"center",transform:"translateX(-50%)"}}><div style={{fontFamily:F.mono,fontSize:"10px",color:m.c,fontWeight:700}}>{m.l}</div><div style={{fontFamily:F.mono,fontSize:"12px",color:T.w55}}>{fmt(m.v)}</div></div>)}</div></div>;})()}
            <div style={{fontFamily:F.body,fontSize:"15px",color:T.w75,lineHeight:1.7}}>At <strong>Base Case</strong>, investors receive <strong style={{color:moicColor(wfBase.moic)}}>{wfBase.moic!==null?fF(Math.round(wfBase.tr)):"N/A"}</strong> — {wfBase.moic!==null?<><strong style={{color:moicColor(wfBase.moic)}}>{moicDisplay(wfBase.moic)}</strong>.{wfBase.moic<1&&" Partial loss."}{wfBase.moic>=1&&wfBase.moic<1.5&&" Capital recovered."}{wfBase.moic>=1.5&&" Strong return."}</>:"This deal is fully debt-financed with no equity at risk."}</div>
          </Glass>
          <Glass tier="recessed"><SL>The Risk</SL>
            {d.risks.filter(r=>r.score>=.8).sort((a,b)=>b.score-a.score).slice(0,3).map((r,i)=><div key={i} style={{padding:"10px 0",borderBottom:`1px solid ${T.goldGhost}`}}><div style={{display:"flex",alignItems:"center",gap:"10px"}}><span style={{fontFamily:F.mono,fontSize:"11px",color:T.red,fontWeight:700,minWidth:"34px"}}>{r.prob}%</span><span style={{fontFamily:F.body,fontSize:"13px",color:T.w92}}>{r.name}</span></div><div style={{fontFamily:F.body,fontSize:"11px",color:T.w55,marginTop:"4px",marginLeft:"44px",fontStyle:"italic"}}>{r.mit}</div></div>)}
            <div style={{fontFamily:F.body,fontSize:"13px",color:T.red,marginTop:"14px",fontWeight:500,opacity:0.85}}>It is possible to lose the entire investment.</div>
          </Glass>
          <Glass tier="primary" style={{borderColor:T.goldDim}}><SL>The Opportunity</SL>
            <div style={{fontFamily:F.body,fontSize:"14px",color:T.w75,lineHeight:1.7}}>At <strong style={{color:T.green}}>Upside</strong> ({fF(d.rt.upside)}), investors receive <strong style={{color:T.green}}>{wfUp.moic!==null?fF(Math.round(wfUp.tr)):"N/A"}</strong> — <strong style={{color:T.green}}>{moicDisplay(wfUp.moic)}</strong>. Capital at risk: {fF(d.actualBudget)} → <strong style={{color:T.equity}}>{fF(d.eq)}</strong> ({Math.round((1-d.eq/d.actualBudget)*100)}% reduction).</div>
          </Glass>
          <div style={{fontFamily:F.body,fontSize:"11px",color:T.w40,textAlign:"center",lineHeight:1.5}}>Illustrative projections from genre data. Not financial, legal, or tax advice. Verify with professionals.</div>
          <div style={{textAlign:"center"}}><button onClick={()=>switchTab(2)} style={{background:"transparent",border:`1px solid ${T.goldDim}`,borderRadius:"8px",padding:"12px 28px",fontFamily:F.display,fontSize:"14px",letterSpacing:"3px",color:T.gold,cursor:"pointer"}}>EXPLORE FULL MODEL →</button></div>
        </div>}

        {/* ═══ OVERVIEW ═══ */}
        {tid==="overview"&&<div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
          <div style={{display:"flex",gap:"14px",flexWrap:"wrap"}}><KPI label="Budget" value={fmt(d.actualBudget)}/><KPI label="Equity" value={fmt(d.eq)} color={T.equity}/><KPI label="Tax Credit" value={fmt(d.tc)} color={T.green} sub={`${stateData.name} @ ${inp.taxCreditPct}%`}/><KPI label="Base MOIC" value={moicDisplay(wfBase.moic)} color={moicColor(wfBase.moic)}/></div>
          <Divider/>
          <Glass><SL>Capital Stack</SL><div style={{display:"flex",height:"36px",borderRadius:"8px",overflow:"hidden",marginTop:"12px"}}>{d.cs.map(c=><div key={c.name} style={{width:`${(c.amount/(d.actualBudget+d.tc))*100}%`,background:c.color,opacity:0.8,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.mono,fontSize:"11px",color:"#000",fontWeight:600}}>{c.amount>=d.actualBudget*.08?fmt(c.amount):""}</div>)}</div><div style={{display:"flex",gap:"18px",marginTop:"10px",flexWrap:"wrap"}}>{d.cs.map(c=><div key={c.name} style={{display:"flex",alignItems:"center",gap:"6px"}}><div style={{width:9,height:9,borderRadius:"50%",background:c.color}}/><span style={{fontFamily:F.mono,fontSize:"11px",color:T.w55}}>{c.name}</span></div>)}</div></Glass>
          <div style={{display:"flex",gap:"14px"}}><Glass style={{flex:1}}><SL>Revenue</SL><div style={{display:"flex",gap:"14px",marginTop:"12px"}}>{[{l:"Conservative",v:d.rt.conservative,c:T.red},{l:"Base",v:d.rt.base,c:T.gold},{l:"Upside",v:d.rt.upside,c:T.green}].map(x=><div key={x.l} style={{flex:1,textAlign:"center"}}><div style={{fontFamily:F.mono,fontSize:"9px",color:T.w40,letterSpacing:"1px"}}>{x.l}</div><div style={{fontFamily:F.display,fontSize:"30px",color:x.c,lineHeight:1.2,marginTop:"4px"}}>{fmt(x.v)}</div></div>)}</div></Glass>
          <Glass style={{flex:1}}><SL>Budget</SL><div style={{display:"flex",alignItems:"center",gap:"20px"}}><div style={{width:130,height:130,position:"relative"}}><ResponsiveContainer><PieChart><Pie data={d.bd} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={58} stroke="none">{d.bd.map((e,i)=><Cell key={i} fill={e.color} opacity={0.8}/>)}</Pie></PieChart></ResponsiveContainer><div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}><div style={{fontFamily:F.mono,fontSize:"7px",color:T.gold,letterSpacing:"1.5px"}}>TOTAL</div><div style={{fontFamily:F.display,fontSize:"16px",color:T.w92}}>{fmt(d.actualBudget)}</div></div></div><div style={{display:"flex",flexDirection:"column",gap:"4px"}}>{d.bd.map(e=><div key={e.name} style={{display:"flex",alignItems:"center",gap:"6px"}}><div style={{width:8,height:8,borderRadius:"2px",background:e.color,opacity:0.8}}/><span style={{fontFamily:F.mono,fontSize:"10px",color:T.w55,minWidth:"90px"}}>{e.name}</span><span style={{fontFamily:F.mono,fontSize:"10px",color:T.w75}}>{fmt(e.value)}</span></div>)}</div></div></Glass></div>
        </div>}

        {/* ═══ WATERFALL ═══ */}
        {tid==="waterfall"&&<div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
          <Glass tier="primary"><SL>Revenue Scenario</SL>
            <div style={{fontFamily:F.mono,fontSize:"12px",color:T.w55,marginBottom:"8px"}}>Gross: <span style={{color:T.gold,fontSize:"22px",fontFamily:F.display}}>{fF(scenario)}</span></div>
            <input type="range" min={250000} max={Math.max(1e7,inp.totalBudget*5)} step={50000} value={scenario} onChange={e=>setScenario(Number(e.target.value))} style={{width:"100%",accentColor:T.gold,height:"4px",cursor:"pointer"}}/>
            <div style={{display:"flex",gap:"10px",marginTop:"14px"}}>{[{l:"Conservative",v:d.rt.conservative,moic:wfCon.moic,desc:"Soft market"},{l:"Base Case",v:d.rt.base,moic:wfBase.moic,desc:"Standard acquisition"},{l:"Upside",v:d.rt.upside,moic:wfUp.moic,desc:"Competitive bidding"}].map(x=><button key={x.l} onClick={()=>setScenario(x.v)} style={{flex:1,background:scenario===x.v?T.goldGhost:"transparent",border:`1px solid ${scenario===x.v?T.goldDim:T.goldGhost}`,borderLeft:scenario===x.v?`3px solid ${T.gold}`:undefined,borderRadius:"10px",padding:"14px",cursor:"pointer",textAlign:"left"}}>
              <div style={{fontFamily:F.mono,fontSize:"12px",color:scenario===x.v?T.gold:T.w55,fontWeight:600}}>{x.l}</div>
              <div style={{fontFamily:F.display,fontSize:"22px",color:scenario===x.v?T.w92:T.w55,marginTop:"4px"}}>{fmt(x.v)}</div>
              <div style={{display:"inline-block",background:x.moic!==null?(x.moic>=1?T.greenDim:T.redDim):T.goldGhost,borderRadius:"4px",padding:"2px 8px",marginTop:"6px"}}><span style={{fontFamily:F.mono,fontSize:"14px",fontWeight:700,color:moicColor(x.moic)}}>{moicDisplay(x.moic)}</span></div>
              <div style={{fontFamily:F.body,fontSize:"10px",color:T.w40,marginTop:"4px"}}>{x.desc}</div>
            </button>)}</div>
          </Glass>
          <Glass><SL>Waterfall Bridge</SL><div style={{width:"100%",height:340,marginTop:"8px"}}><ResponsiveContainer><BarChart data={wb} margin={{left:10,right:10,top:10,bottom:35}}><CartesianGrid horizontal vertical={false} stroke="rgba(255,255,255,0.03)"/><XAxis dataKey="name" tick={{fill:T.w40,fontSize:10,fontFamily:F.mono}} angle={-30} textAnchor="end" height={55}/><YAxis tick={{fill:T.w40,fontSize:10,fontFamily:F.mono}} tickFormatter={fmt}/><Tooltip content={<CTT/>}/><Bar dataKey="base" stackId="a" fill="transparent"/><Bar dataKey="value" stackId="a" radius={[4,4,0,0]}>{wb.map((d,i)=><Cell key={i} fill={d.fill}/>)}</Bar></BarChart></ResponsiveContainer></div></Glass>
          <div style={{display:"flex",gap:"14px",flexWrap:"wrap"}}><KPI label="Investor Return" value={wf.moic!==null?fmt(wf.tr):"N/A"} color={wf.moic!==null?(wf.tr>=d.eq?T.green:T.red):T.w55}/><KPI label="MOIC" value={moicDisplay(wf.moic)} color={moicColor(wf.moic)}/><KPI label="ROI" value={wf.roi!==null?pct(wf.roi):"N/A"} color={wf.roi!==null?(wf.roi>=0?T.green:T.red):T.w55}/><KPI label="Producer Net" value={fmt(wf.pb)} color={T.purple}/></div>
        </div>}

        {/* ═══ REVENUE ═══ */}
        {tid==="revenue"&&<div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
          <div style={{display:"flex",gap:"14px",flexWrap:"wrap"}}><KPI label="Conservative" value={fmt(d.rt.conservative)} color={T.red}/><KPI label="Base" value={fmt(d.rt.base)} color={T.gold}/><KPI label="Upside" value={fmt(d.rt.upside)} color={T.green}/></div>
          <Glass><SL sub={`${inp.genre} benchmarks at ${fmt(inp.totalBudget)}. Illustrative.`}>Revenue by Window</SL><div style={{width:"100%",height:380,marginTop:"12px"}}><ResponsiveContainer><BarChart data={d.rw} margin={{left:10,right:10,top:10,bottom:55}}><CartesianGrid horizontal vertical={false} stroke="rgba(255,255,255,0.03)"/><XAxis dataKey="window" tick={{fill:T.w40,fontSize:10,fontFamily:F.mono}} angle={-30} textAnchor="end" height={55}/><YAxis tick={{fill:T.w40,fontSize:10,fontFamily:F.mono}} tickFormatter={fmt}/><Tooltip content={<CTT/>}/><Bar dataKey="conservative" name="Con" fill={T.red} opacity={0.6} radius={[2,2,0,0]} barSize={14}/><Bar dataKey="base" name="Base" fill={T.gold} opacity={0.7} radius={[2,2,0,0]} barSize={14}/><Bar dataKey="upside" name="Up" fill={T.green} opacity={0.7} radius={[2,2,0,0]} barSize={14}/><Legend wrapperStyle={{fontFamily:F.mono,fontSize:"10px"}}/></BarChart></ResponsiveContainer></div></Glass>
          <Glass><SL sub="Gold line = budget.">Breakeven by Strategy</SL><div style={{width:"100%",height:220,marginTop:"12px"}}><ResponsiveContainer><BarChart data={d.be} layout="vertical" margin={{left:120,right:30}}><XAxis type="number" tick={{fill:T.w40,fontSize:10,fontFamily:F.mono}} tickFormatter={fmt}/><YAxis type="category" dataKey="strategy" tick={{fill:T.w55,fontSize:11,fontFamily:F.mono}} width={115}/><Tooltip content={<CTT/>}/><ReferenceLine x={d.actualBudget} stroke={T.gold} strokeDasharray="5 5"/><Bar dataKey="breakeven" radius={[0,4,4,0]} barSize={20}>{d.be.map((b,i)=><Cell key={i} fill={b.breakeven<d.actualBudget*1.5?T.green:b.breakeven<d.actualBudget*4?T.amber:T.red} opacity={.65}/>)}</Bar></BarChart></ResponsiveContainer></div></Glass>
          <Glass tier="recessed" style={{textAlign:"center",borderColor:"rgba(120,60,180,0.2)"}}><div style={{fontFamily:F.display,fontSize:"16px",color:T.purple,letterSpacing:"3px",marginBottom:"8px"}}>CUSTOM COMP REPORTS</div><div style={{fontFamily:F.body,fontSize:"13px",color:T.w55,lineHeight:1.6}}>How did comparable films perform? Real market data for your genre.</div><div style={{display:"flex",gap:"12px",justifyContent:"center",marginTop:"14px"}}><div style={{background:T.goldGhost,border:`1px solid ${T.goldDim}`,borderRadius:"8px",padding:"10px 20px"}}><div style={{fontFamily:F.display,fontSize:"20px",color:T.gold}}>$595</div><div style={{fontFamily:F.mono,fontSize:"10px",color:T.w40}}>10 Films</div></div><div style={{background:T.goldGhost,border:`1px solid ${T.goldDim}`,borderRadius:"8px",padding:"10px 20px"}}><div style={{fontFamily:F.display,fontSize:"20px",color:T.gold}}>$995</div><div style={{fontFamily:F.mono,fontSize:"10px",color:T.w40}}>20 Films</div></div></div></Glass>
        </div>}

        {/* ═══ BUDGET (EDITABLE) ═══ */}
        {tid==="budget"&&<div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
          <div style={{fontFamily:F.body,fontSize:"13px",color:T.w40}}>Click any amount to customize. Total recalculates.</div>
          <Glass><SL>Budget — {fmt(d.actualBudget)}</SL><div style={{width:"100%",height:220}}><ResponsiveContainer><PieChart><Pie data={d.bd} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={90} stroke={T.bg} strokeWidth={2}>{d.bd.map((e,i)=><Cell key={i} fill={e.color} opacity={0.85}/>)}</Pie><Tooltip content={<CTT/>}/></PieChart></ResponsiveContainer></div><div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>{d.bd.map(e=><div key={e.name} style={{display:"flex",alignItems:"center",gap:"5px"}}><div style={{width:8,height:8,borderRadius:"2px",background:e.color}}/><span style={{fontFamily:F.mono,fontSize:"10px",color:T.w55}}>{e.name} {fmt(e.value)}</span></div>)}</div></Glass>
          {Object.keys(CC).map(cat=>{const items=d.bi.filter(b=>b.category===cat&&!b.isBond);const catTotal=items.reduce((s,b)=>s+b.amount,0)+(cat==="G&A"&&bondOn?d.bondAmt:0);const catPct=(catTotal/d.actualBudget*100).toFixed(1);const bench=CAT_BENCH[cat];const outOfRange=bench&&(parseFloat(catPct)<bench[0]||parseFloat(catPct)>bench[1]);return<Glass key={cat} tier="recessed"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}><SL>{CL[cat]}</SL><span style={{fontFamily:F.mono,fontSize:"14px",color:CC[cat]}}>{fmt(catTotal)}</span></div>{bench&&<div style={{fontFamily:F.mono,fontSize:"11px",color:outOfRange?T.amber:T.w40,marginBottom:"12px"}}>Currently {catPct}% — Typical {bench[0]}-{bench[1]}%</div>}{items.map(item=>{const gi=d.bi.indexOf(item);const itemPct=(item.amount/d.actualBudget*100).toFixed(1);return<div key={item.name} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 0",borderBottom:`1px solid ${T.goldGhost}`}}><span style={{fontFamily:F.mono,fontSize:"12px",color:T.w55,flex:1}}>{item.name}</span><span style={{fontFamily:F.mono,fontSize:"10px",color:T.w40,minWidth:"40px"}}>{itemPct}%</span><div style={{display:"flex",alignItems:"center",gap:"3px"}}><span style={{fontFamily:F.mono,fontSize:"11px",color:T.gold}}>$</span><input type="number" value={item.amount} onChange={e=>setBudgetEdits(p=>({...p,[gi]:Number(e.target.value)||0}))} style={{width:"100px",background:item.isEdited?T.goldGhost:T.inputBg,border:`1px solid ${item.isEdited?T.goldDim:T.inputBorder}`,borderRadius:"6px",padding:"6px 8px",color:item.isEdited?T.gold:T.w92,fontFamily:F.mono,fontSize:"12px",outline:"none",textAlign:"right"}}/></div>{item.isEdited&&<button onClick={()=>setBudgetEdits(p=>{const n={...p};delete n[gi];return n;})} style={{background:"none",border:"none",color:T.w40,cursor:"pointer",fontFamily:F.mono,fontSize:"10px"}}>reset</button>}</div>})}{cat==="G&A"&&bondOn&&<div style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 0"}}><span style={{fontFamily:F.mono,fontSize:"12px",color:T.w55,flex:1}}>Completion Bond</span><span style={{fontFamily:F.mono,fontSize:"12px",color:T.w75}}>{fF(d.bondAmt)}</span></div>}</Glass>;})}
          <Glass style={{textAlign:"center"}} tier="recessed"><span style={{fontFamily:F.mono,fontSize:"11px",color:T.w40}}>CONTINGENCY (10% BTL+Post)</span><div style={{fontFamily:F.display,fontSize:"30px",color:T.amber}}>{fmt(d.cont)}</div></Glass>
        </div>}

        {/* ═══ CAPITAL ═══ */}
        {tid==="capital"&&<div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
          <Glass><SL>Capital Stack</SL><div style={{marginTop:"16px"}}>{d.cs.map((l,i)=><div key={l.name} style={{display:"flex",alignItems:"stretch",borderBottom:i<d.cs.length-1?`1px solid ${T.goldGhost}`:"none"}}><div style={{width:"8px",background:l.color,opacity:0.7}}/><div style={{flex:1,padding:"18px"}}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontFamily:F.body,fontSize:"15px",color:T.w92,fontWeight:500}}>{l.name}</div><div style={{fontFamily:F.mono,fontSize:"11px",color:T.w40}}>{l.pos}</div></div><div style={{fontFamily:F.mono,fontSize:"16px",color:l.color}}>{fF(l.amount)}</div></div></div></div>)}</div></Glass>
          <Glass><SL>Investor Terms</SL><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"18px",marginTop:"12px"}}>{[
            {l:"Vehicle",v:"Single-Purpose LLC"},
            {l:"Min Investment",v:fF(inp.minInvestment)},
            {l:"Exemption",v:"Reg D 506(b)",e:"Federal exemption for accredited investors without public advertising."},
            {l:"Premium",v:`${100+inp.recoupPremium}%`},
            {l:"Inv Backend",v:`${inp.investorBackend}%`},
            {l:"Prod Backend",v:`${100-inp.investorBackend}%`},
            {l:"Guilds",v:guildStr},
            {l:"Loan Term",v:`${inp.loanTerm} mo`,e:"Time from close to distribution proceeds."},
            {l:"Bond",v:bondOn?`Yes (${bondPct}%)`:"No"},
          ].map(x=><div key={x.l}><div style={{fontFamily:F.mono,fontSize:"9px",color:T.w40,letterSpacing:"1px"}}>{x.l.toUpperCase()}</div><div style={{fontFamily:F.body,fontSize:"13px",color:T.w92,marginTop:"3px"}}>{x.v}</div>{x.e&&<div style={{fontFamily:F.body,fontSize:"10px",color:T.w40,fontStyle:"italic",marginTop:"2px"}}>{x.e}</div>}</div>)}</div><div style={{fontFamily:F.body,fontSize:"11px",color:T.w40,marginTop:"16px",fontStyle:"italic"}}>Default structure. Your attorney will confirm.</div></Glass>
        </div>}

        {/* ═══ CASH FLOW ═══ */}
        {tid==="cashflow"&&<div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
          <div style={{fontFamily:F.body,fontSize:"13px",color:T.w40}}>Cash deploys during production, returns through distribution.{stateData.months!=="—"?` TC receipt est: ${stateData.months} mo (${stateData.name}).`:""}</div>
          <Glass><SL>Cash Flow</SL><div style={{width:"100%",height:340,marginTop:"12px"}}><ResponsiveContainer><ComposedChart data={d.cf} margin={{left:10,right:10,top:10,bottom:10}}><CartesianGrid horizontal vertical={false} stroke="rgba(255,255,255,0.03)"/><XAxis dataKey="month" tick={{fill:T.w40,fontSize:10,fontFamily:F.mono}}/><YAxis yAxisId="b" tick={{fill:T.w40,fontSize:10,fontFamily:F.mono}} tickFormatter={fmt}/><YAxis yAxisId="l" orientation="right" tick={{fill:T.w40,fontSize:10,fontFamily:F.mono}} tickFormatter={fmt}/><Tooltip content={<CTT/>}/><Bar yAxisId="b" dataKey="inflows" name="In" fill={T.green} opacity={0.6} radius={[3,3,0,0]} barSize={16}/><Bar yAxisId="b" dataKey="outflows" name="Out" fill={T.red} opacity={0.5} radius={[0,0,3,3]} barSize={16}/><Line yAxisId="l" type="monotone" dataKey="cumulative" name="Cum" stroke={T.gold} strokeWidth={2} dot={{fill:T.gold,r:3}}/><ReferenceLine yAxisId="b" y={0} stroke={T.w25}/><Legend wrapperStyle={{fontFamily:F.mono,fontSize:"10px"}}/></ComposedChart></ResponsiveContainer></div></Glass>
          <Glass><SL>Timeline</SL><div style={{display:"flex",height:"30px",borderRadius:"6px",overflow:"hidden",marginTop:"12px"}}>{[{p:"Pre-Prod",m:2,c:T.blue},{p:"Production",m:3,c:T.gold},{p:"Post",m:3,c:T.purple},{p:"Delivery",m:2,c:T.amber},{p:"Distribution",m:4,c:T.green}].map(x=><div key={x.p} style={{flex:x.m,background:x.c,opacity:0.5,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.mono,fontSize:"9px",color:"#fff",fontWeight:600,borderRight:"1px solid #000"}}>{x.p}</div>)}</div></Glass>
        </div>}

        {/* ═══ SENSITIVITY ═══ */}
        {tid==="sensitivity"&&<div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
          <Glass><SL sub="Your equity highlighted.">ROI Heat Map</SL><div style={{overflowX:"auto",marginTop:"12px"}}><table style={{width:"100%",borderCollapse:"collapse",fontFamily:F.mono,fontSize:"11px"}}><thead><tr><th style={{padding:"10px 6px",color:T.w40,textAlign:"left",borderBottom:`1px solid ${T.goldDim}`,fontSize:"10px"}}>Equity ↓ / Rev →</th>{sR.map(r=><th key={r} style={{padding:"10px 6px",color:T.w55,textAlign:"center",borderBottom:`1px solid ${T.goldDim}`,fontSize:"10px"}}>{fmt(r)}</th>)}</tr></thead><tbody>{sE.map(eq=><tr key={eq}><td style={{padding:"10px 6px",color:T.w55,borderBottom:`1px solid ${T.goldGhost}`}}>{fmt(eq)}</td>{sR.map(rev=>{const roi=cSR(rev,eq);const bg=roi<=-1?"rgba(220,38,38,0.3)":roi<-.5?"rgba(220,38,38,0.15)":roi<0?"rgba(245,158,11,0.15)":roi<.5?"rgba(60,179,113,0.12)":"rgba(60,179,113,0.25)";const c=roi<=-.5?T.red:roi<0?T.amber:T.green;return<td key={rev} style={{padding:"10px 6px",textAlign:"center",background:bg,color:c,borderBottom:`1px solid ${T.goldGhost}`,fontWeight:eq===d.eq?700:400,outline:eq===d.eq?`1px solid ${T.goldDim}`:undefined}}>{roi<=-1?"Loss":pct(roi)}</td>;})}</tr>)}</tbody></table></div></Glass>
          <Glass><SL sub="Gold line = budget.">Breakeven</SL><div style={{width:"100%",height:220,marginTop:"12px"}}><ResponsiveContainer><BarChart data={d.be} layout="vertical" margin={{left:120,right:30}}><CartesianGrid horizontal vertical={false} stroke="rgba(255,255,255,0.03)"/><XAxis type="number" tick={{fill:T.w40,fontSize:10,fontFamily:F.mono}} tickFormatter={fmt}/><YAxis type="category" dataKey="strategy" tick={{fill:T.w55,fontSize:11,fontFamily:F.mono}} width={115}/><Tooltip content={<CTT/>}/><ReferenceLine x={d.actualBudget} stroke={T.gold} strokeDasharray="5 5"/><Bar dataKey="breakeven" radius={[0,4,4,0]} barSize={20}>{d.be.map((b,i)=><Cell key={i} fill={b.breakeven<d.actualBudget*1.5?T.green:b.breakeven<d.actualBudget*4?T.amber:T.red} opacity={.65}/>)}</Bar></BarChart></ResponsiveContainer></div></Glass>
        </div>}

        {/* ═══ RISK ═══ */}
        {tid==="risk"&&<div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
          <Glass><SL>Risk Matrix</SL><div style={{width:"100%",height:340,marginTop:"12px"}}><ResponsiveContainer><ScatterChart margin={{left:10,right:30,top:10,bottom:10}}><CartesianGrid horizontal vertical={false} stroke="rgba(255,255,255,0.03)"/><XAxis type="number" dataKey="prob" name="P" unit="%" domain={[0,55]} tick={{fill:T.w40,fontSize:10,fontFamily:F.mono}}/><YAxis type="number" dataKey="impact" name="I" domain={[1,5.5]} tick={{fill:T.w40,fontSize:10,fontFamily:F.mono}}/><Tooltip content={({active,payload})=>{if(!active||!payload?.length)return null;const r=payload[0].payload;return<div style={{background:"rgba(0,0,0,0.95)",border:`1px solid ${T.goldDim}`,borderRadius:"8px",padding:"10px 14px",fontFamily:F.mono,fontSize:"11px"}}><div style={{color:T.w92,fontWeight:600}}>{r.name}</div><div style={{color:T.w55}}>{r.prob}% · {r.impact}/5 · {r.score.toFixed(2)}</div></div>;}}/><Scatter data={d.risks} shape={({cx,cy,payload})=>{const c=payload.score>=.8?T.red:payload.score>=.4?T.amber:T.green;return<circle cx={cx} cy={cy} r={Math.max(8,payload.score*8)} fill={c} opacity={0.45} stroke={c} strokeWidth={1}/>;}}/>
          </ScatterChart></ResponsiveContainer></div><div style={{display:"flex",gap:"18px",justifyContent:"center",marginTop:"8px"}}>{[{l:"High",c:T.red},{l:"Med",c:T.amber},{l:"Low",c:T.green}].map(x=><div key={x.l} style={{display:"flex",alignItems:"center",gap:"6px"}}><div style={{width:10,height:10,borderRadius:"50%",background:x.c,opacity:0.6}}/><span style={{fontFamily:F.mono,fontSize:"10px",color:T.w55}}>{x.l}</span></div>)}</div></Glass>
          <Glass><SL>Risk Register</SL>{[...d.risks].sort((a,b)=>b.score-a.score).map((r,i)=>{const c=r.score>=.8?T.red:r.score>=.4?T.amber:T.green;const bg=r.score>=.8?T.redDim:r.score>=.4?T.amberDim:T.greenDim;const ex=expandedRisk===i;return<div key={i} onClick={()=>setExpandedRisk(ex?null:i)} style={{cursor:"pointer",padding:"10px 0",borderBottom:`1px solid ${T.goldGhost}`}}><div style={{display:"flex",alignItems:"center",gap:"10px"}}><div style={{width:"34px",height:"24px",borderRadius:"4px",background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.mono,fontSize:"11px",color:c,fontWeight:700,flexShrink:0}}>{r.score.toFixed(1)}</div><div style={{flex:1}}><div style={{fontFamily:F.body,fontSize:"13px",color:T.w92}}>{r.name}</div><div style={{fontFamily:F.mono,fontSize:"10px",color:T.w40}}>{r.cat} · {r.prob}% · {r.impact}/5</div></div><span style={{fontFamily:F.mono,fontSize:"11px",color:T.w40}}>{ex?"▾":"▸"}</span></div>{ex&&<div style={{marginTop:"10px",marginLeft:"44px",fontFamily:F.body,fontSize:"12px",color:T.w55,lineHeight:1.6}}>{r.mit}</div>}</div>;})}</Glass>
        </div>}

        {/* ═══ GLOSSARY ═══ */}
        {tid==="glossary"&&<div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
          <Glass><SL sub="Every financial term in this model, explained in plain English.">Glossary</SL>
            {GLOSSARY.map((g,i)=><div key={i} style={{padding:"14px 0",borderBottom:i<GLOSSARY.length-1?`1px solid ${T.goldGhost}`:"none"}}>
              <div style={{fontFamily:F.mono,fontSize:"13px",color:T.gold,fontWeight:600}}>{g.term}</div>
              <div style={{fontFamily:F.body,fontSize:"13px",color:T.w75,lineHeight:1.5,marginTop:"4px"}}>{g.def}</div>
            </div>)}
          </Glass>
        </div>}

        <div style={{marginTop:"36px",paddingTop:"16px",borderTop:`1px solid ${T.goldGhost}`,textAlign:"center",fontFamily:F.mono,fontSize:"10px",color:T.w25}}>Illustrative model only. Not an offer of securities. Consult entertainment attorneys before raising capital.</div>
        </div>
      </main>
    </div>
  );
}
