import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ComposedChart, Line,
  ScatterChart, Scatter, CartesianGrid, Legend, ReferenceLine
} from "recharts";

/* ═══════════════════════════════════════
   DESIGN TOKENS — v4.5
   ═══════════════════════════════════════ */
const T = {
  bg: "#000",
  glass: "rgba(6,6,6,0.88)", glassBright: "rgba(12,12,14,0.92)",
  glassRecessed: "rgba(3,3,3,0.80)",
  gold: "#D4AF37", goldPrimary: "#F2CA50",
  goldDim: "rgba(212,175,55,0.20)", goldGhost: "rgba(212,175,55,0.06)",
  goldLine: "rgba(212,175,55,0.40)",
  blue: "#5B8DEF", purple: "#9D7AED",
  green: "#4DAF78", red: "#C84040", amber: "#F0A830",
  equity: "#E8B84D",
  blueDim: "rgba(91,141,239,0.10)", purpleDim: "rgba(157,122,237,0.10)",
  greenDim: "rgba(77,175,120,0.10)", redDim: "rgba(200,64,64,0.10)",
  amberDim: "rgba(240,168,48,0.10)",
  w92: "rgba(250,248,244,0.92)", w85: "rgba(250,248,244,0.85)",
  w75: "rgba(250,248,244,0.72)", w65: "rgba(250,248,244,0.65)",
  cw90: "rgba(255,255,255,0.90)", cw70: "rgba(255,255,255,0.70)",
  cw50: "rgba(255,255,255,0.50)", cw30: "rgba(255,255,255,0.30)",
  border: "rgba(212,175,55,0.12)", borderBright: "rgba(212,175,55,0.25)",
  radius: "12px",
  inputBg: "rgba(212,175,55,0.04)", inputBorder: "rgba(212,175,55,0.18)",
};
const F = { display: "'Bebas Neue',sans-serif", body: "'Inter',sans-serif", mono: "'Roboto Mono',monospace" };
const grainSVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`;
// v4.5: Custom scrollbar + shimmer keyframes
const GlobalStyles = () => <style>{`
  ::-webkit-scrollbar{width:8px;height:8px}
  ::-webkit-scrollbar-track{background:#000}
  ::-webkit-scrollbar-thumb{background:rgba(212,175,55,0.15);border-radius:4px}
  ::-webkit-scrollbar-thumb:hover{background:rgba(212,175,55,0.25)}
  @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
`}</style>;

/* ═══════════════════════════════════════
   DATA CONSTANTS (unchanged)
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
// v4.5: Renamed presets
const DIST_PRESETS = {
  "SVOD Buyout":{exhib:0,pa:0,distFee:25,saComm:10,desc:"Straight to streaming. Lowest breakeven."},
  "Theatrical":{exhib:50,pa:150000,distFee:30,saComm:12,desc:"Platform release + SVOD. Higher visibility."},
  "Hybrid / Self":{exhib:10,pa:75000,distFee:15,saComm:5,desc:"Self-distributed. Max control, more effort."},
};
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
  {term:"Distribution Fee",def:"Distributor's commission on net revenue. Typically 25-35%."},
  {term:"Sales Agent Commission",def:"Fee for territory-by-territory international rights sales. Typically 10-15%."},
  {term:"Tax Credit / Rebate",def:"State incentive returning a percentage of qualified production spend. Received post-wrap."},
  {term:"Bridge Loan",def:"Short-term loan against the expected tax credit, providing cash during production."},
  {term:"Gap Financing",def:"Loan against unsold distribution rights. Higher risk, higher interest, second position."},
  {term:"Mezzanine",def:"Subordinated debt between senior debt and equity in repayment priority."},
  {term:"Equity",def:"At-risk investment capital. Last in line for repayment but participates in profit upside."},
  {term:"SPV",def:"Special Purpose Vehicle. A single-purpose LLC for one film production."},
  {term:"Reg D 506(b)",def:"Federal securities exemption for accredited investors without public advertising. Requires a PPM."},
  {term:"PPM",def:"Private Placement Memorandum. Legal document required to offer securities to investors."},
  {term:"Completion Bond",def:"Insurance guaranteeing delivery on budget and schedule. Typically 2-3% of budget."},
  {term:"CAMA",def:"Collection Account Management Agreement. Neutral third-party account ensuring waterfall compliance."},
  {term:"E&O Insurance",def:"Errors & Omissions. Required by distributors at delivery. Covers IP claims."},
  {term:"SAG-AFTRA",def:"Screen Actors Guild. Union representing actors with budget-tier-based minimums."},
  {term:"DGA",def:"Directors Guild of America. Represents directors, ADs, and UPMs."},
  {term:"WGA",def:"Writers Guild of America. Governs writer minimums, credits, and residuals."},
  {term:"IATSE",def:"International Alliance of Theatrical Stage Employees. Covers most BTL crew: grips, electric, camera, art dept."},
];
// v4.5: Added "Not Sure" options
const VEHICLES = ["Not Sure","Single-Purpose LLC","Limited Partnership","S-Corp","C-Corp"];
const EXEMPTIONS = ["Not Sure","Reg D 506(b)","Reg D 506(c)","Reg A+","Reg CF"];
const CC = {ATL:T.gold,BTL:T.blue,Post:T.purple,"G&A":T.green};
const CL = {ATL:"Above the Line",BTL:"Below the Line",Post:"Post-Production","G&A":"G&A"};
const CAT_BENCH = {ATL:[20,30],BTL:[30,40],Post:[10,15],"G&A":[7,12]};
// v4.5: Quick-start presets
const QUICK_PRESETS = [
  {label:"Micro · $500K",genre:"Horror",budget:500000,sag:false,dga:false,wga:false,iatse:false,state:"GA",minInv:25000},
  {label:"Mid-Range · $2.5M",genre:"Thriller",budget:2500000,sag:true,dga:true,wga:true,iatse:true,state:"GA",minInv:50000},
  {label:"Premium · $7M",genre:"Action",budget:7000000,sag:true,dga:true,wga:true,iatse:true,state:"CA",minInv:100000},
];
// v4.5: SAG auto-tier
const autoSagTier = b => b<300000?"Ultra Low Budget":b<700000?"Modified Low Budget":b<2650000?"Low Budget":"Standard";

/* ═══════════════════════════════════════
   DERIVE — v4 math engine (UNCHANGED)
   ═══════════════════════════════════════ */
function derive(inp, budgetEdits, bondOn, bondPct, contPct) {
  const tc = Math.round(inp.totalBudget * inp.taxCreditPct / 100);
  const sd = Math.round(tc * inp.taxCreditLoanPct / 100);
  const bondAmt = bondOn ? Math.round(inp.totalBudget * bondPct / 100) : 0;
  const bi = BT.map((t, i) => { const def = Math.round(inp.totalBudget * t.p); const ed = budgetEdits[i]; return { name: t.n, amount: ed !== undefined ? ed : def, category: t.c, isEdited: ed !== undefined }; });
  if (bondOn) bi.push({ name: "Completion Bond", amount: bondAmt, category: "G&A", isEdited: false, isBond: true });
  const ct = {}; bi.forEach(x => { ct[x.category] = (ct[x.category] || 0) + x.amount; });
  const cont = Math.round(((ct.BTL || 0) + (ct.Post || 0)) * (contPct / 100));
  const actualBudget = bi.reduce((s, b) => s + b.amount, 0) + cont;
  const eq = Math.max(0, actualBudget - sd - inp.gapMezz - inp.preSaleLoan);
  const estInv = inp.minInvestment > 0 ? Math.ceil(eq / inp.minInvestment) : 0;
  const b = GB[inp.genre] || GB.Thriller; const m = inp.totalBudget / 1e6;
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
  const rt = { conservative: rw.reduce((s,r)=>s+r.conservative,0), base: rw.reduce((s,r)=>s+r.base,0), upside: rw.reduce((s,r)=>s+r.upside,0) };
  const baseTotal = rw.reduce((s,r)=>s+r.base,0)||1;
  const thFraction = (b.th*m*1e3)/baseTotal, intlFraction = ((b.mg+b.ov+b.it)*m*1e3)/baseTotal;
  const drAmt = sd*(1+inp.seniorDebtRate/100*inp.loanTerm/12);
  const gpAmt = inp.gapMezz*(1+inp.gapRate/100*inp.loanTerm/12);
  const psAmt = inp.preSaleLoan*(1+inp.seniorDebtRate/100*inp.loanTerm/12);
  function calcWF(gr) {
    const hasTh=inp.paBudget>0; const et=hasTh?gr*thFraction*(inp.exhibitorPct/100):0;
    const ap=gr-et-inp.paBudget; const df=Math.max(0,ap)*(inp.distFeePct/100); const ad=Math.max(0,ap-df);
    const sc=gr*intlFraction*(inp.saCommPct/100); const npp=Math.max(0,ad-sc);
    const afd=Math.max(0,npp-drAmt-gpAmt-psAmt); const ra=eq*(1+inp.recoupPremium/100);
    const ir=Math.min(ra,afd); const rem=Math.max(0,afd-ra);
    const ib=rem*(inp.investorBackend/100); const pb=rem*(1-inp.investorBackend/100); const tr=ir+ib;
    return {gr,et,pa:inp.paBudget,df,sc,npp,drAmt,gpAmt,psAmt,afd,ir,rem,ib,pb,tr,moic:eq>0?tr/eq:null,roi:eq>0?(tr-eq)/eq:null,eq,hasTh};
  }
  function findBEFor(ov) {
    let lo=0,hi=2e7;for(let i=0;i<30;i++){const mid=(lo+hi)/2;const h2=(ov.pa||0)>0;const e2=h2?mid*thFraction*((ov.exhib||0)/100):0;const a2=mid-e2-(ov.pa||0);const d2=Math.max(0,a2)*((ov.df||25)/100);const ad2=Math.max(0,a2-d2);const s2=mid*intlFraction*((ov.sa||10)/100);const n2=Math.max(0,ad2-s2);const af2=Math.max(0,n2-drAmt-gpAmt-psAmt);const ra2=eq*(1+inp.recoupPremium/100);const ir2=Math.min(ra2,af2);const t2=ir2+Math.max(0,af2-ra2)*(inp.investorBackend/100);t2>=eq?hi=mid:lo=mid;}
    return Math.round((lo+hi)/2);
  }
  // v4.5: Renamed strategies
  const be = [
    {strategy:"SVOD Buyout",breakeven:findBEFor({exhib:0,pa:0,df:25,sa:10})},
    {strategy:"Theatrical",breakeven:findBEFor({exhib:inp.exhibitorPct,pa:inp.paBudget,df:inp.distFeePct,sa:inp.saCommPct})},
    {strategy:"Wide Release",breakeven:findBEFor({exhib:52,pa:Math.max(1e6,actualBudget*.5),df:35,sa:12})},
    {strategy:"Intl Pre-Sales",breakeven:findBEFor({exhib:0,pa:50000,df:20,sa:12})},
    {strategy:"Hybrid/Self",breakeven:findBEFor({exhib:10,pa:75000,df:15,sa:5})},
  ];
  const cf = [
    {month:"Mo 1",inflows:eq+sd+inp.gapMezz+inp.preSaleLoan,outflows:-Math.round(actualBudget*.094),phase:"Pre-Prod"},
    {month:"Mo 2",inflows:0,outflows:-Math.round(actualBudget*.068),phase:"Pre-Prod"},
    {month:"Mo 3",inflows:0,outflows:-Math.round(actualBudget*.158),phase:"Production"},
    {month:"Mo 4",inflows:0,outflows:-Math.round(actualBudget*.158),phase:"Production"},
    {month:"Mo 5",inflows:0,outflows:-Math.round(actualBudget*.115),phase:"Production"},
    {month:"Mo 6",inflows:0,outflows:-Math.round(actualBudget*.115),phase:"Post"},
    {month:"Mo 7",inflows:0,outflows:-Math.round(actualBudget*.115),phase:"Post"},
    {month:"Mo 8",inflows:0,outflows:-Math.round(actualBudget*.090),phase:"Post"},
    {month:"Mo 9",inflows:0,outflows:-Math.round(actualBudget*.044),phase:"Delivery"},
    {month:"Mo 10",inflows:0,outflows:-Math.round(actualBudget*.043),phase:"Delivery"},
    {month:"Mo 11",inflows:Math.round(rt.base*.12),outflows:-Math.round(drAmt),phase:"Distrib."},
    {month:"Mo 12",inflows:Math.round(rt.base*.30)+tc,outflows:0,phase:"Distrib."},
    {month:"Mo 18",inflows:Math.round(rt.base*.08),outflows:0,phase:"Distrib."},
    {month:"Mo 24+",inflows:Math.round(rt.base*.10),outflows:0,phase:"Distrib."},
  ];
  let cum=0;cf.forEach(x=>{cum+=x.inflows+x.outflows;x.cumulative=cum;x.net=x.inflows+x.outflows;});
  const sources = [{name:"TC Bridge Loan",amount:sd,color:T.blue,pos:"1st — repaid from tax credit"},inp.gapMezz>0&&{name:"Gap/Mezz",amount:inp.gapMezz,color:T.amber,pos:"2nd Position"},inp.preSaleLoan>0&&{name:"Pre-Sale Loan",amount:inp.preSaleLoan,color:T.purple,pos:"1st Position"},{name:"Equity",amount:eq,color:T.equity,pos:"At-risk capital"}].filter(Boolean);
  const cs = [{name:"Tax Credit",amount:tc,color:T.green,pos:"Non-dilutive — post-wrap"},{name:"Senior Debt",amount:sd,color:T.blue,pos:"1st Position"},inp.gapMezz>0&&{name:"Gap/Mezz",amount:inp.gapMezz,color:T.amber,pos:"2nd Position"},inp.preSaleLoan>0&&{name:"Pre-Sale Loan",amount:inp.preSaleLoan,color:T.purple,pos:"1st Position"},{name:"Equity",amount:eq,color:T.equity,pos:"At-risk capital"}].filter(Boolean);
  const bd = [{name:"Above the Line",value:ct.ATL||0,color:T.gold},{name:"Below the Line",value:ct.BTL||0,color:T.blue},{name:"Post-Production",value:ct.Post||0,color:T.purple},{name:"G&A",value:ct["G&A"]||0,color:T.green},{name:"Contingency",value:cont,color:T.amber}];
  const risks = RISKS_RAW.map(r=>({...r,score:(r.prob/100)*r.impact}));
  return {tc,sd,eq,estInv,bi,ct,cont,rw,rt,calcWF,cf,be,cs,sources,bd,risks,drAmt,gpAmt,psAmt,actualBudget,bondAmt,thFraction,intlFraction};
}

/* ═══════════════════════════════════════
   FORMAT HELPERS — v4.5: NaN guards added
   ═══════════════════════════════════════ */
const fmt = n => { if(n==null||!isFinite(n))return "$0";if(Math.abs(n)>=1e6)return "$"+(n/1e6).toFixed(1)+"M";if(Math.abs(n)>=1e3)return "$"+Math.round(n/1e3)+"K";return "$"+Math.round(n);};
const fF = n => "$"+((n&&isFinite(n))?n:0).toLocaleString();
const pct = n => ((!n||!isFinite(n))?0:(n*100)).toFixed(1)+"%";

/* ═══════════════════════════════════════
   UI COMPONENTS — v4.5
   ═══════════════════════════════════════ */
// v4.5: Glass with hover lift + optional glow
const Glass = ({children,style,tier="standard",accent=false,...p}) => {
  const [hov,setHov] = useState(false);
  const bg = tier==="primary"?T.glassBright:tier==="recessed"?T.glassRecessed:T.glass;
  const glow = tier==="primary"?`0 0 24px ${T.goldGhost}`:"none";
  return <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{background:bg,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:`1px solid ${hov?T.borderBright:T.border}`,borderTop:accent?`1px solid ${T.goldLine}`:`1px solid ${hov?T.borderBright:T.border}`,borderRadius:T.radius,padding:"28px",position:"relative",overflow:"hidden",transform:hov?"translateY(-2px)":"translateY(0)",boxShadow:tier==="primary"?glow:"none",transition:"transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",...style}} {...p}>
    {accent&&<div style={{position:"absolute",top:0,left:0,width:"100%",height:"1px",background:`linear-gradient(90deg,transparent,${T.goldPrimary},transparent)`,opacity:0.5}}/>}
    {children}
  </div>;
};
const SL = ({children,sub}) => (
  <div style={{marginBottom:sub?"16px":"10px"}}>
    <div style={{fontFamily:F.mono,fontSize:"11px",letterSpacing:"3px",color:T.goldPrimary,textTransform:"uppercase",fontWeight:500}}>{children}</div>
    {sub&&<div style={{fontFamily:F.body,fontSize:"14px",color:T.w75,marginTop:"8px",lineHeight:1.6,maxWidth:"640px"}}>{sub}</div>}
  </div>
);
const AV = ({children}) => {
  const ref=useRef(null);const prev=useRef(children);
  useEffect(()=>{if(ref.current&&prev.current!==children){ref.current.style.transition='none';ref.current.style.opacity='0.4';ref.current.style.transform='translateY(3px)';requestAnimationFrame(()=>{if(ref.current){ref.current.style.transition='opacity 0.35s ease-out, transform 0.35s ease-out';ref.current.style.opacity='1';ref.current.style.transform='translateY(0)';}});prev.current=children;}},[children]);
  return <span ref={ref} style={{display:"inline-block"}}>{children}</span>;
};
const KPI = ({label,value,sub,color,bars}) => (
  <Glass style={{textAlign:"center",flex:1,minWidth:"155px",padding:"24px 18px"}} accent>
    <div style={{fontFamily:F.mono,fontSize:"11px",color:T.cw50,letterSpacing:"2px",textTransform:"uppercase",marginBottom:"12px",fontWeight:700}}>{label}</div>
    <div style={{fontFamily:F.display,fontSize:"38px",color:color||T.w92,lineHeight:1}}><AV>{value}</AV></div>
    {bars&&<div style={{display:"flex",gap:"3px",justifyContent:"center",marginTop:"10px",height:"16px",alignItems:"flex-end"}}>{bars.map((b,i)=><div key={i} style={{width:"14px",background:b.c,borderRadius:"2px 2px 0 0",height:`${Math.max(4,b.h)}px`,opacity:0.7}}/>)}</div>}
    {sub&&<div style={{fontFamily:F.mono,fontSize:"11px",color:T.cw50,marginTop:"8px"}}>{sub}</div>}
  </Glass>
);
const Divider = () => <div style={{height:"1px",background:`linear-gradient(90deg,transparent,${T.border},transparent)`,margin:"18px 0"}}/>;
// v4.5: Focus glow on inputs
const ComboInput = ({label,value,onChange,min=0,max=100,step=1,suffix="%",explain,fmt:fn,benchMin,benchMax}) => {
  const [foc,setFoc] = useState(false);
  const pctFill = max>min?((Math.min(max,Math.max(min,value))-min)/(max-min))*100:0;
  return <div style={{marginBottom:"24px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:"8px"}}>
      <span style={{fontFamily:F.mono,fontSize:"11px",color:T.cw70,letterSpacing:"1.5px",textTransform:"uppercase",fontWeight:700}}>{label}</span>
      <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
        {suffix!=="%"&&<span style={{fontFamily:F.mono,fontSize:"14px",color:T.goldPrimary}}>$</span>}
        <input type="number" value={value} onChange={e=>onChange(Number(e.target.value)||0)} min={min} max={max} step={step} onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
          style={{width:suffix==="%"?"65px":"130px",background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:"8px",padding:"8px 10px",color:T.goldPrimary,fontFamily:F.mono,fontSize:"15px",fontWeight:700,outline:"none",textAlign:"right",boxSizing:"border-box",boxShadow:foc?`0 0 0 2px rgba(212,175,55,0.15)`:"none",transition:"box-shadow 0.2s"}}/>
        {suffix&&<span style={{fontFamily:F.mono,fontSize:"12px",color:T.cw50}}>{suffix}</span>}
      </div>
    </div>
    <div style={{position:"relative"}}>
      {benchMin!=null&&benchMax!=null&&<div style={{position:"absolute",top:0,height:"4px",left:`${((benchMin-min)/(max-min))*100}%`,width:`${((benchMax-benchMin)/(max-min))*100}%`,background:"rgba(242,202,80,0.12)",borderRadius:"2px",pointerEvents:"none"}}/>}
      <input type="range" min={min} max={max} step={step} value={Math.min(max,Math.max(min,value))} onChange={e=>onChange(Number(e.target.value))} style={{width:"100%",accentColor:T.goldPrimary,height:"3px",cursor:"pointer",background:`linear-gradient(to right,${T.goldPrimary} ${pctFill}%,rgba(255,255,255,0.08) ${pctFill}%)`}}/>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",fontFamily:F.mono,fontSize:"10px",color:T.cw30,marginTop:"3px"}}>
      <span>{fn?fn(min):`${min}${suffix}`}</span>
      {benchMin!=null&&<span style={{color:T.cw50}}>typical {fn?fn(benchMin):benchMin}–{fn?fn(benchMax):benchMax}{suffix===""?"":suffix}</span>}
      <span>{fn?fn(max):`${max}${suffix}`}</span>
    </div>
    {explain&&<div style={{fontFamily:F.body,fontSize:"13px",color:T.w65,marginTop:"6px",lineHeight:1.5}}>{explain}</div>}
  </div>;
};
const TextInput = ({label,value,onChange,explain,placeholder}) => {
  const [foc,setFoc] = useState(false);
  return <div style={{marginBottom:"24px"}}>
    <div style={{fontFamily:F.mono,fontSize:"11px",color:T.cw70,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"8px",fontWeight:700}}>{label}</div>
    <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||label} onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
      style={{width:"100%",background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:"10px",padding:"12px 14px",color:T.w92,fontFamily:F.body,fontSize:"15px",outline:"none",boxSizing:"border-box",boxShadow:foc?`0 0 0 2px rgba(212,175,55,0.15)`:"none",transition:"box-shadow 0.2s"}}/>
    {explain&&<div style={{fontFamily:F.body,fontSize:"13px",color:T.w65,marginTop:"4px"}}>{explain}</div>}
  </div>;
};
const SelectInput = ({label,value,onChange,options,explain}) => (
  <div style={{marginBottom:"24px"}}>
    <div style={{fontFamily:F.mono,fontSize:"11px",color:T.cw70,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"8px",fontWeight:700}}>{label}</div>
    <div style={{position:"relative"}}>
      <select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:"10px",padding:"12px 14px",paddingRight:"36px",color:T.w92,fontFamily:F.body,fontSize:"14px",outline:"none",appearance:"none",cursor:"pointer",boxSizing:"border-box"}}>
        {options.map(o=><option key={typeof o==="string"?o:o.value} value={typeof o==="string"?o:o.value} style={{background:"#111",color:"#fff"}}>{typeof o==="string"?o:o.label}</option>)}
      </select>
      <span style={{position:"absolute",right:"14px",top:"50%",transform:"translateY(-50%)",fontFamily:F.mono,fontSize:"12px",color:T.cw50,pointerEvents:"none"}}>▾</span>
    </div>
    {explain&&<div style={{fontFamily:F.body,fontSize:"13px",color:T.w65,marginTop:"4px"}}>{explain}</div>}
  </div>
);
const SD = ({title}) => <div style={{display:"flex",alignItems:"center",gap:"16px",margin:"40px 0 24px"}}><div style={{height:"1px",flex:1,background:T.border}}/><span style={{fontFamily:F.mono,fontSize:"12px",letterSpacing:"4px",color:T.goldPrimary,opacity:0.6,fontWeight:500}}>{title}</span><div style={{height:"1px",flex:1,background:T.border}}/></div>;
const CTT = ({active,payload,label}) => {if(!active||!payload?.length)return null;return<div style={{background:"#111",backdropFilter:"blur(12px)",border:`1px solid ${T.border}`,borderRadius:"10px",padding:"12px 16px",fontFamily:F.mono,fontSize:"12px",boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}><div style={{color:T.w85,marginBottom:"6px",fontWeight:600}}>{label}</div>{payload.map((p,i)=><div key={i} style={{color:p.color||T.cw90,marginBottom:"3px"}}>{p.name}: {typeof p.value==="number"?fF(Math.abs(p.value)):p.value}</div>)}</div>;};
// v4.5: Redesigned FlowStep — clean rows, no indent
const FlowStep = ({num,label,amount,isLoss,isHighlight,explain}) => (
  <div style={{display:"flex",alignItems:"center",gap:"16px",padding:"14px 0",borderBottom:`1px solid ${T.border}`}}>
    <div style={{width:"32px",height:"32px",borderRadius:"50%",background:isHighlight?"rgba(242,202,80,0.10)":isLoss?T.redDim:T.greenDim,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.mono,fontSize:"12px",color:isHighlight?T.goldPrimary:isLoss?T.red:T.green,fontWeight:700,flexShrink:0}}>{num}</div>
    <div style={{flex:1,minWidth:0}}>
      <div style={{fontFamily:F.body,fontSize:"14px",color:T.w92,fontWeight:isHighlight?600:400}}>{label}</div>
      {explain&&<div style={{fontFamily:F.body,fontSize:"12px",color:T.w65,marginTop:"3px"}}>{explain}</div>}
    </div>
    {amount!=null&&<div style={{fontFamily:F.mono,fontSize:"16px",color:isLoss?T.red:isHighlight?T.goldPrimary:T.green,fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}><AV>{isLoss?"−":""}{fF(Math.abs(Math.round(amount)))}</AV></div>}
  </div>
);
const Toggle = ({label,value,onChange,explain}) => (
  <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"16px"}}>
    <button onClick={()=>onChange(!value)} style={{width:"44px",height:"24px",borderRadius:"12px",background:value?T.goldPrimary:"rgba(255,255,255,0.08)",border:"none",cursor:"pointer",position:"relative",flexShrink:0,transition:"background 0.2s"}}><div style={{width:"18px",height:"18px",borderRadius:"50%",background:"#fff",position:"absolute",top:"3px",left:value?"23px":"3px",transition:"left 0.2s",boxShadow:"0 2px 4px rgba(0,0,0,0.3)"}}/></button>
    <div><span style={{fontFamily:F.mono,fontSize:"12px",color:value?T.goldPrimary:T.cw70,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px"}}>{label}</span>{explain&&<div style={{fontFamily:F.body,fontSize:"12px",color:T.w65,marginTop:"2px"}}>{explain}</div>}</div>
  </div>
);
const SideSelect = ({label,value,onChange,children}) => (
  <div style={{marginBottom:"12px"}}>
    <div style={{fontFamily:F.mono,fontSize:"10px",color:T.cw50,marginBottom:"4px",fontWeight:500,textTransform:"uppercase",letterSpacing:"1.5px"}}>{label}</div>
    <div style={{position:"relative"}}>
      <select value={value} onChange={onChange} style={{width:"100%",background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:"8px",padding:"7px 28px 7px 8px",color:T.cw90,fontFamily:F.mono,fontSize:"11px",outline:"none",boxSizing:"border-box",appearance:"none",cursor:"pointer"}}>{children}</select>
      <span style={{position:"absolute",right:"8px",top:"50%",transform:"translateY(-50%)",fontFamily:F.mono,fontSize:"11px",color:T.cw50,pointerEvents:"none"}}>▾</span>
    </div>
  </div>
);
const SideToggle = ({label,value,onChange}) => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"6px"}}>
    <span style={{fontFamily:F.mono,fontSize:"10px",color:value?T.goldPrimary:T.cw50,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px"}}>{label}</span>
    <button onClick={()=>onChange(!value)} style={{width:"36px",height:"20px",borderRadius:"10px",background:value?T.goldPrimary:"rgba(255,255,255,0.08)",border:"none",cursor:"pointer",position:"relative",flexShrink:0,transition:"background 0.2s"}}><div style={{width:"14px",height:"14px",borderRadius:"50%",background:"#fff",position:"absolute",top:"3px",left:value?"19px":"3px",transition:"left 0.2s"}}/></button>
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
  const [guilds,setGuilds] = useState({sag:false,dga:false,wga:false,iatse:false});
  const [sagTier,setSagTier] = useState("Modified Low Budget");
  const [bondOn,setBondOn] = useState(false);
  const [bondPct,setBondPct] = useState(2.5);
  const [contPct,setContPct] = useState(10);
  const [distPreset,setDistPreset] = useState("Theatrical");
  const [budgetEdits,setBudgetEdits] = useState({});
  const [tab,setTab] = useState(0);
  const [wizStep,setWizStep] = useState(0);
  const [scenario,setScenario] = useState(null);
  const [expandedRisk,setExpandedRisk] = useState(null);
  const [tabAnim,setTabAnim] = useState(true);
  const [isMobile,setIsMobile] = useState(false);
  const [vehicle,setVehicle] = useState("Not Sure");
  const [exemption,setExemption] = useState("Not Sure");
  const [sidebarCollapsed,setSidebarCollapsed] = useState({});
  const [wizardDone,setWizardDone] = useState(false);
  const [confirmReset,setConfirmReset] = useState(false);
  const [showCrew,setShowCrew] = useState(false);
  const mainRef = useRef(null);

  useEffect(()=>{const c=()=>setIsMobile(window.innerWidth<1024);c();window.addEventListener("resize",c);return()=>window.removeEventListener("resize",c);},[]);
  // v4.5: SAG auto-tier when budget changes
  useEffect(()=>{if(guilds.sag)setSagTier(autoSagTier(inp.totalBudget));},[inp.totalBudget,guilds.sag]);
  // v4.5: Fixed scroll-to-top
  const switchTab = i => {setTabAnim(false);setTimeout(()=>{setTab(i);setTabAnim(true);requestAnimationFrame(()=>{if(mainRef.current)mainRef.current.scrollTop=0;});},50);};
  const s = useCallback((k,v)=>setInp(p=>({...p,[k]:v})),[]);
  const d = useMemo(()=>derive(inp,budgetEdits,bondOn,bondPct,contPct),[inp,budgetEdits,bondOn,bondPct,contPct]);
  const activeScenario = scenario!==null?scenario:d.rt.base;
  const wf = useMemo(()=>d.calcWF(activeScenario),[d,activeScenario]);
  const wfBase = useMemo(()=>d.calcWF(d.rt.base),[d]);
  const wfCon = useMemo(()=>d.calcWF(d.rt.conservative),[d]);
  const wfUp = useMemo(()=>d.calcWF(d.rt.upside),[d]);
  const wb = useMemo(()=>{const items=[{n:"Gross Rev",v:wf.gr,f:T.goldPrimary,t:"total"},{n:"Exhibitor",v:wf.et,f:T.red,t:"loss"},{n:"P&A",v:wf.pa,f:T.red,t:"loss"},{n:"Dist Fee",v:wf.df,f:T.red,t:"loss"},{n:"SA Comm",v:wf.sc,f:T.red,t:"loss"},{n:"Debt",v:wf.drAmt+wf.gpAmt+wf.psAmt,f:T.red,t:"loss"},{n:"Recoup",v:wf.ir,f:T.goldDim,t:"loss"},{n:"Inv Back",v:wf.ib,f:T.green,t:"gain"},{n:"Prod Back",v:wf.pb,f:T.purple,t:"gain"}].filter(i=>i.v>0||i.t==="total");let r=0;return items.map(i=>{if(i.t==="total"){r=i.v;return{name:i.n,base:0,value:i.v,fill:i.f};}else if(i.t==="loss"){r-=i.v;return{name:i.n,base:Math.max(0,r),value:i.v,fill:i.f};}else{return{name:i.n,base:0,value:i.v,fill:i.f};}});},[wf]);
  const sR = useMemo(()=>[0.5,1,1.5,2.5,3.5,5].map(x=>Math.round(d.actualBudget*x)),[d.actualBudget]);
  const sE = [Math.round(d.eq*.6),Math.round(d.eq*.8),d.eq,Math.round(d.eq*1.15),Math.round(d.eq*1.45)];
  const cSR = (rev,eqA)=>{const w=d.calcWF(rev);const r=d.eq>0?eqA/d.eq:0;return d.eq>0?((w.tr*r)-eqA)/eqA:-1;};
  const ht = inp.title.trim().length>0;
  const tid = TABS[tab]?.id;
  const findBE = useMemo(()=>{if(d.eq<=0)return 0;let lo=0,hi=2e7;for(let i=0;i<30;i++){const mid=(lo+hi)/2;d.calcWF(mid).tr>=d.eq?hi=mid:lo=mid;}return Math.round((lo+hi)/2);},[d]);
  const find2x = useMemo(()=>{if(d.eq<=0)return 0;let lo=0,hi=4e7;for(let i=0;i<30;i++){const mid=(lo+hi)/2;d.calcWF(mid).tr>=d.eq*2?hi=mid:lo=mid;}return Math.round((lo+hi)/2);},[d]);
  const stateData = STATES.find(st=>st.id===inp.shootState)||STATES[12];
  const warnings = useMemo(()=>{const w=[];if(d.eq<=0)w.push("Equity is $0 or negative — debt sources exceed budget.");if(d.eq>0&&d.eq>d.actualBudget*.6)w.push(`Equity is ${Math.round(d.eq/d.actualBudget*100)}% of budget.`);if(inp.paBudget>inp.totalBudget*.4)w.push("P&A exceeds 40% of budget.");if(inp.recoupPremium>30)w.push(`${inp.recoupPremium}% premium above standard.`);if(inp.taxCreditPct===0)w.push("No tax incentive entered.");const st=d.sources.reduce((s,c)=>s+c.amount,0),ut=d.bd.reduce((s,c)=>s+c.value,0);if(Math.abs(st-ut)>1000)w.push(`Sources/Uses gap: ${fF(Math.abs(st-ut))}`);return w;},[inp,d]);
  const wizSteps = ["Your Film","Funding Sources","Investor Terms","Distribution"];
  const applyDist = name => {const p=DIST_PRESETS[name];if(p){s("exhibitorPct",p.exhib);s("paBudget",p.pa);s("distFeePct",p.distFee);s("saCommPct",p.saComm);setDistPreset(name);}};
  const guildStr = [guilds.sag&&`SAG${sagTier?" ("+sagTier.replace("Budget","").trim()+")":""}`,guilds.dga&&"DGA",guilds.wga&&"WGA",guilds.iatse&&"IATSE"].filter(Boolean).join(", ")||"Non-Union";
  const resetProject = ()=>{setInp(defaultInp);setCrew({producer:"",director:"",writer:"",cast:""});setGuilds({sag:false,dga:false,wga:false,iatse:false});setBondOn(false);setBondPct(2.5);setContPct(10);setBudgetEdits({});setDistPreset("Theatrical");setWizStep(0);setScenario(null);setVehicle("Not Sure");setExemption("Not Sure");setWizardDone(false);setConfirmReset(false);switchTab(0);};
  const applyPreset = p => {s("genre",p.genre);s("totalBudget",p.budget);s("shootState",p.state);s("minInvestment",p.minInv);setGuilds({sag:p.sag,dga:p.dga,wga:p.wga,iatse:p.iatse});if(p.sag)setSagTier(autoSagTier(p.budget));};
  const contentStyle = {opacity:tabAnim?1:0,transform:tabAnim?"translateY(0)":"translateY(8px)",transition:"opacity 0.3s ease, transform 0.3s ease"};
  const moicDisplay = v => v!==null&&isFinite(v)?v.toFixed(2)+"×":"N/A";
  const moicColor = v => v===null||!isFinite(v)?T.cw50:v>=1?T.green:T.red;
  const toggleSection = label => setSidebarCollapsed(p=>({...p,[label]:!p[label]}));
  const finishWizard = () => {setWizardDone(true);switchTab(1);};
  const moicBars = (con,base,up)=>{const mx=Math.max(Math.abs(con||0),Math.abs(base||0),Math.abs(up||0),0.01);return[{c:T.red,h:(Math.abs(con||0)/mx)*14},{c:T.goldPrimary,h:(Math.abs(base||0)/mx)*14},{c:T.green,h:(Math.abs(up||0)/mx)*14}];};
  // v4.5: Scenario labels
  const SL_BEAR="Bear",SL_BASE="Base",SL_BULL="Bull";

  /* ═══ MOBILE GATE ═══ */
  if(isMobile) return (
    <div style={{background:"#000",color:T.w92,fontFamily:F.body,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",textAlign:"center"}}>
      <div style={{fontFamily:F.mono,fontSize:"10px",letterSpacing:"4px",color:T.goldPrimary,opacity:0.5,marginBottom:"16px",fontWeight:700}}>FILMMAKER.OG</div>
      <div style={{fontFamily:F.display,fontSize:"28px",color:T.w92,marginBottom:"16px"}}>BUILT FOR DESKTOP</div>
      <div style={{fontFamily:F.body,fontSize:"15px",color:T.w65,lineHeight:1.6,maxWidth:"320px"}}>The charts, models, and investor-ready exports need a full screen. Open on your laptop.</div>
    </div>
  );

  /* ═══ SIDEBAR ═══ */
  const sidebar = (
    <aside style={{width:"256px",minWidth:"256px",height:"100vh",position:"fixed",left:0,top:0,background:"#000",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderRight:`1px solid ${T.border}`,padding:"24px 20px",display:"flex",flexDirection:"column",overflowY:"auto",zIndex:60}}>
      <div style={{display:"inline-flex",alignSelf:"flex-start",background:"rgba(212,175,55,0.10)",border:`1px solid rgba(212,175,55,0.25)`,borderRadius:"6px",padding:"6px 14px",marginBottom:"20px"}}>
        <span style={{fontFamily:F.mono,fontSize:"12px",color:T.gold,letterSpacing:"3px",fontWeight:500}}>FILMMAKER.OG</span>
      </div>
      <div style={{fontFamily:F.display,fontSize:"20px",color:T.w92,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ht?inp.title.toUpperCase():fmt(inp.totalBudget)+" PRODUCTION"}</div>
      <div style={{fontFamily:F.mono,fontSize:"11px",color:T.cw50,marginTop:"4px"}}>{inp.genre} · {stateData.name}</div>
      <Divider/>
      <div style={{display:"flex",gap:"16px"}}>
        <div><div style={{fontFamily:F.mono,fontSize:"10px",color:T.cw50,letterSpacing:"2px",fontWeight:500}}>BUDGET</div><div style={{fontFamily:F.display,fontSize:"24px",color:T.gold,marginTop:"2px"}}><AV>{fmt(d.actualBudget)}</AV></div></div>
        <div><div style={{fontFamily:F.mono,fontSize:"10px",color:T.cw50,letterSpacing:"2px",fontWeight:500}}>EQUITY</div><div style={{fontFamily:F.display,fontSize:"24px",color:T.equity,marginTop:"2px"}}><AV>{fF(d.eq)}</AV></div></div>
      </div>
      <Divider/>
      <nav style={{flex:1}}>
        {NAV_SECTIONS.map(sec=>{const collapsed=sidebarCollapsed[sec.label];return(
          <div key={sec.label} style={{marginBottom:"8px"}}>
            <div onClick={()=>toggleSection(sec.label)} style={{fontFamily:F.mono,fontSize:"10px",color:T.gold,letterSpacing:"3px",opacity:0.5,marginBottom:"6px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",fontWeight:500}}>
              <span>{sec.label}</span><span style={{fontSize:"10px",color:T.cw50}}>{collapsed?"▸":"▾"}</span>
            </div>
            {!collapsed&&TABS.filter(t=>sec.tiers.includes(t.tier)).map(t=>{
              const idx=TABS.indexOf(t);const active=tab===idx;
              // v4.5: Gray out locked tabs
              const locked=!wizardDone&&t.tier>0&&t.id!=="glossary";
              return<div key={t.id} onClick={()=>locked?null:switchTab(idx)} style={{padding:"8px 12px",borderRadius:"8px",fontSize:"14px",fontFamily:F.body,color:locked?T.cw30:active?T.gold:T.cw70,background:active?"rgba(212,175,55,0.05)":"transparent",borderLeft:active?`2px solid ${T.gold}`:"2px solid transparent",cursor:locked?"default":"pointer",marginBottom:"2px",transition:"all 0.15s",fontWeight:active?500:400,opacity:locked?0.5:1}}>
                {t.label}{locked&&" 🔒"}
              </div>;
            })}
          </div>
        );})}
      </nav>
      <Divider/>
      <div style={{fontFamily:F.mono,fontSize:"10px",color:T.gold,letterSpacing:"3px",opacity:0.5,marginBottom:"8px",fontWeight:500}}>QUICK ADJUST</div>
      <SideSelect label="State" value={inp.shootState} onChange={e=>s("shootState",e.target.value)}>{STATES.map(st=><option key={st.id} value={st.id} style={{background:"#111"}}>{st.name}</option>)}</SideSelect>
      <SideSelect label="Strategy" value={distPreset} onChange={e=>applyDist(e.target.value)}>{Object.keys(DIST_PRESETS).map(n=><option key={n} value={n} style={{background:"#111"}}>{n}</option>)}</SideSelect>
      <div style={{fontFamily:F.mono,fontSize:"10px",color:T.cw50,marginBottom:"4px",fontWeight:500}}>Scenario</div>
      <div style={{display:"flex",gap:"4px",marginBottom:"12px"}}>{[{l:SL_BEAR,v:d.rt.conservative,c:T.red},{l:SL_BASE,v:d.rt.base,c:T.gold},{l:SL_BULL,v:d.rt.upside,c:T.green}].map(x=><button key={x.l} onClick={()=>setScenario(x.v)} style={{flex:1,padding:"6px 4px",borderRadius:"6px",fontSize:"10px",fontFamily:F.mono,fontWeight:600,border:`1px solid ${activeScenario===x.v?x.c:T.border}`,background:activeScenario===x.v?"rgba(255,255,255,0.03)":"transparent",color:activeScenario===x.v?x.c:T.cw50,cursor:"pointer"}}>{x.l}</button>)}</div>
      <SideToggle label="Completion Bond" value={bondOn} onChange={setBondOn}/>
      <div style={{fontFamily:F.mono,fontSize:"10px",color:T.cw50,marginTop:"8px",marginBottom:"4px",fontWeight:500}}>Guilds</div>
      <SideToggle label="SAG-AFTRA" value={guilds.sag} onChange={v=>setGuilds(p=>({...p,sag:v}))}/>
      <SideToggle label="DGA" value={guilds.dga} onChange={v=>setGuilds(p=>({...p,dga:v}))}/>
      <SideToggle label="WGA" value={guilds.wga} onChange={v=>setGuilds(p=>({...p,wga:v}))}/>
      <SideToggle label="IATSE" value={guilds.iatse} onChange={v=>setGuilds(p=>({...p,iatse:v}))}/>
      <div style={{marginTop:"auto",paddingTop:"16px"}}>
        <button onClick={()=>confirmReset?resetProject():setConfirmReset(true)} onMouseLeave={()=>setConfirmReset(false)}
          style={{width:"100%",fontFamily:F.mono,fontSize:"11px",color:confirmReset?T.red:T.cw50,cursor:"pointer",padding:"8px 12px",background:confirmReset?T.redDim:"transparent",border:`1px solid ${confirmReset?T.red:T.border}`,borderRadius:"8px",transition:"all 0.15s",fontWeight:500}}>
          {confirmReset?"CLICK AGAIN TO CONFIRM":"Reset Project"}
        </button>
      </div>
    </aside>
  );

  /* ═══ MAIN RENDER ═══ */
  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#000",backgroundImage:grainSVG,fontFamily:F.body,color:T.w92}}>
      <GlobalStyles/>
      {sidebar}
      <main ref={mainRef} style={{marginLeft:"256px",flex:1,padding:"36px 48px",overflowY:"auto",minHeight:"100vh"}}>
        <div style={{maxWidth:"1000px",margin:"0 auto",...contentStyle}}>

        {/* ═══ SETUP WIZARD ═══ */}
        {tid==="setup"&&<div style={{maxWidth:"580px",margin:"0 auto"}}><Glass tier="primary" accent>
          <div style={{textAlign:"center",marginBottom:"16px"}}>
            <div style={{width:"40%",height:"1px",background:`linear-gradient(90deg,transparent,${T.goldPrimary},transparent)`,margin:"0 auto 20px",opacity:0.4}}/>
            {/* v4.5: Bigger hero, subtitle */}
            <div style={{fontFamily:F.display,fontSize:"44px",color:T.w92,lineHeight:0.95}}>BUILD YOUR MODEL</div>
            <div style={{fontFamily:F.mono,fontSize:"12px",color:T.gold,letterSpacing:"3px",marginTop:"10px",opacity:0.6}}>INSTITUTIONAL-GRADE FILM FINANCE</div>
            <div style={{fontFamily:F.body,fontSize:"14px",color:T.w65,marginTop:"12px"}}>Step {wizStep+1} of 4 — {wizSteps[wizStep]}</div>
            {wizardDone&&<div onClick={()=>switchTab(1)} style={{fontFamily:F.mono,fontSize:"11px",color:T.goldPrimary,marginTop:"10px",cursor:"pointer",opacity:0.7,fontWeight:700,letterSpacing:"1px"}}>SKIP TO YOUR DEAL →</div>}
          </div>
          {/* v4.5: Thicker progress bar with glow */}
          <div style={{height:"5px",background:"rgba(255,255,255,0.05)",borderRadius:"3px",margin:"16px 0 28px",overflow:"hidden"}}><div style={{height:"100%",width:`${((wizStep+1)/4)*100}%`,background:`linear-gradient(90deg,${T.gold},${T.goldPrimary})`,borderRadius:"3px",transition:"width 0.3s",boxShadow:`0 0 12px ${T.goldGhost}`}}/></div>

          {wizStep===0&&<>
            {/* v4.5: Quick-start presets */}
            <div style={{fontFamily:F.mono,fontSize:"10px",color:T.cw50,letterSpacing:"2px",marginBottom:"10px",textAlign:"center"}}>QUICK START</div>
            <div style={{display:"flex",gap:"8px",marginBottom:"28px"}}>{QUICK_PRESETS.map(p=><button key={p.label} onClick={()=>applyPreset(p)} style={{flex:1,padding:"12px 8px",background:inp.totalBudget===p.budget?"rgba(212,175,55,0.04)":"transparent",border:`1px solid ${inp.totalBudget===p.budget?T.goldLine:T.border}`,borderRadius:"8px",cursor:"pointer",textAlign:"center",transition:"all 0.15s"}}>
              <div style={{fontFamily:F.mono,fontSize:"11px",color:inp.totalBudget===p.budget?T.goldPrimary:T.cw70,fontWeight:700}}>{p.label}</div>
              <div style={{fontFamily:F.body,fontSize:"11px",color:T.w65,marginTop:"4px"}}>{p.genre}{p.sag?" · Union":" · Non-Union"}</div>
            </button>)}</div>
            <TextInput label="Project Title" value={inp.title} onChange={v=>s("title",v)} explain="As it appears in legal documents"/>
            <SelectInput label="Genre" value={inp.genre} onChange={v=>s("genre",v)} options={GENRES} explain="Drives revenue benchmarks"/>
            {/* v4.5: Collapsible crew */}
            <div onClick={()=>setShowCrew(!showCrew)} style={{display:"flex",alignItems:"center",gap:"8px",margin:"28px 0 16px",cursor:"pointer"}}>
              <div style={{height:"1px",flex:1,background:T.border}}/>
              <span style={{fontFamily:F.mono,fontSize:"12px",letterSpacing:"4px",color:T.goldPrimary,opacity:0.6,fontWeight:500}}>CREATIVE TEAM {showCrew?"▾":"▸"}</span>
              <div style={{height:"1px",flex:1,background:T.border}}/>
            </div>
            <div style={{fontFamily:F.body,fontSize:"12px",color:T.cw50,textAlign:"center",marginBottom:showCrew?"16px":"0",marginTop:"-8px"}}>{showCrew?"":"Optional — add your team or skip ahead"}</div>
            {showCrew&&<>
              <TextInput label="Producer(s)" value={crew.producer} onChange={v=>setCrew(p=>({...p,producer:v}))} placeholder="Lead producer"/>
              <TextInput label="Director" value={crew.director} onChange={v=>setCrew(p=>({...p,director:v}))} placeholder="Director or TBD"/>
              <TextInput label="Writer(s)" value={crew.writer} onChange={v=>setCrew(p=>({...p,writer:v}))} placeholder="Screenwriter(s)"/>
              <TextInput label="Lead Cast" value={crew.cast} onChange={v=>setCrew(p=>({...p,cast:v}))} placeholder="Attached or TBD"/>
            </>}
            <SD title="PRODUCTION"/>
            <SelectInput label="Shoot State" value={inp.shootState} onChange={v=>s("shootState",v)} options={STATES.map(st=>({value:st.id,label:st.name}))} explain="For tax credit guidance — does not auto-fill"/>
            <ComboInput label="Total Production Budget" value={inp.totalBudget} onChange={v=>s("totalBudget",v)} min={250000} max={10000000} step={50000} suffix="" fmt={fmt} explain="All-in: cast, crew, post, insurance, contingency" benchMin={1e6} benchMax={5e6}/>
            {/* v4.5: Scroll indicator */}
            {wizStep===0&&<div style={{textAlign:"center",marginTop:"8px",animation:"pulse 2s ease-in-out infinite"}}><div style={{fontFamily:F.mono,fontSize:"10px",color:T.cw30,letterSpacing:"2px"}}>SCROLL TO CONTINUE</div><div style={{color:T.cw30,fontSize:"16px",marginTop:"4px"}}>▾</div></div>}
          </>}
          {wizStep===1&&<>
            <div style={{background:"rgba(242,202,80,0.04)",border:`1px solid ${T.border}`,borderTop:`1px solid ${T.goldLine}`,borderRadius:"10px",padding:"16px",marginBottom:"24px"}}>
              <div style={{fontFamily:F.mono,fontSize:"11px",color:T.goldPrimary,letterSpacing:"1px",fontWeight:700}}>{stateData.name.toUpperCase()} — {stateData.type.toUpperCase()}</div>
              <div style={{fontFamily:F.body,fontSize:"13px",color:T.w65,marginTop:"8px",lineHeight:1.6}}>{stateData.note}</div>
              <div style={{fontFamily:F.body,fontSize:"12px",color:T.w65,marginTop:"6px",fontStyle:"italic"}}>Enter the rate you're modeling. Consult a production tax attorney.</div>
            </div>
            <ComboInput label="Tax Credit Rate" value={inp.taxCreditPct} onChange={v=>s("taxCreditPct",v)} min={0} max={45} explain={`= ${fF(Math.round(inp.totalBudget*inp.taxCreditPct/100))}`} benchMin={stateData.id!=="OTHER"?Math.max(0,stateData.rate-5):undefined} benchMax={stateData.id!=="OTHER"?stateData.rate+10:undefined}/>
            <ComboInput label="TC Loan Advance" value={inp.taxCreditLoanPct} onChange={v=>s("taxCreditLoanPct",v)} min={0} max={100} explain={`= ${fF(Math.round(inp.totalBudget*inp.taxCreditPct/100*inp.taxCreditLoanPct/100))} senior debt`} benchMin={85} benchMax={95}/>
            <ComboInput label="Gap / Mezz" value={inp.gapMezz} onChange={v=>s("gapMezz",v)} min={0} max={Math.round(inp.totalBudget*.2)} step={10000} suffix="" fmt={fmt} explain="Leave at $0 if unsure."/>
            <ComboInput label="Pre-Sale Loan" value={inp.preSaleLoan} onChange={v=>s("preSaleLoan",v)} min={0} max={Math.round(inp.totalBudget*.25)} step={10000} suffix="" fmt={fmt} explain="Leave at $0 if no signed pre-sales."/>
            <div style={{background:"rgba(242,202,80,0.04)",border:`1px solid ${T.border}`,borderTop:`1px solid ${T.goldLine}`,borderRadius:"12px",padding:"24px",textAlign:"center",margin:"16px 0"}}>
              <div style={{fontFamily:F.mono,fontSize:"11px",color:T.cw50,letterSpacing:"2px",fontWeight:700}}>EQUITY RAISE NEEDED</div>
              <div style={{fontFamily:F.display,fontSize:"54px",color:T.equity,lineHeight:1.1,marginTop:"8px"}}><AV>{fF(d.eq)}</AV></div>
              <div style={{fontFamily:F.body,fontSize:"13px",color:T.w65,marginTop:"10px"}}>~{d.estInv} investors at {fF(inp.minInvestment)} min</div>
            </div>
          </>}
          {wizStep===2&&<>
            <ComboInput label="Recoupment Premium" value={inp.recoupPremium} onChange={v=>s("recoupPremium",v)} min={0} max={40} explain={`Investors get ${100+inp.recoupPremium}% back before profit.`} benchMin={15} benchMax={25}/>
            <ComboInput label="Investor Backend" value={inp.investorBackend} onChange={v=>s("investorBackend",v)} min={20} max={80} explain={`Profit: ${inp.investorBackend}% inv / ${100-inp.investorBackend}% you.`} benchMin={40} benchMax={50}/>
            <ComboInput label="Min Investment" value={inp.minInvestment} onChange={v=>s("minInvestment",v)} min={10000} max={250000} step={5000} suffix="" fmt={fmt} explain="Smallest check you'll accept." benchMin={25000} benchMax={100000}/>
            <ComboInput label="Senior Debt Rate" value={inp.seniorDebtRate} onChange={v=>s("seniorDebtRate",v)} min={5} max={18} step={.5} explain="TC bridge loan. 8-12% typical." benchMin={8} benchMax={12}/>
            {inp.gapMezz>0&&<ComboInput label="Gap Loan Rate" value={inp.gapRate} onChange={v=>s("gapRate",v)} min={8} max={24} step={.5} explain="Higher risk = higher rate." benchMin={12} benchMax={20}/>}
            <ComboInput label="Loan Term" value={inp.loanTerm} onChange={v=>s("loanTerm",v)} min={6} max={48} suffix=" mo" explain="Time to repay from distribution." benchMin={12} benchMax={36}/>
            <SD title="PRODUCTION"/>
            <Toggle label={bondOn?"COMPLETION BOND — ON":"COMPLETION BOND — OFF"} value={bondOn} onChange={setBondOn} explain="Required by most lenders."/>
            {bondOn&&<ComboInput label="Bond %" value={bondPct} onChange={setBondPct} min={1.5} max={4} step={.5} explain={`= ${fF(Math.round(inp.totalBudget*bondPct/100))}`} benchMin={2} benchMax={3}/>}
            <SD title="GUILDS"/>
            <Toggle label="SAG-AFTRA" value={guilds.sag} onChange={v=>setGuilds(p=>({...p,sag:v}))} explain="Actors union."/>
            {guilds.sag&&<SelectInput label="SAG Tier" value={sagTier} onChange={setSagTier} options={["Ultra Low Budget","Modified Low Budget","Low Budget","Standard"]} explain={`Auto-selected for ${fmt(inp.totalBudget)} budget. Override if needed.`}/>}
            <Toggle label="DGA" value={guilds.dga} onChange={v=>setGuilds(p=>({...p,dga:v}))} explain="Directors Guild."/>
            <Toggle label="WGA" value={guilds.wga} onChange={v=>setGuilds(p=>({...p,wga:v}))} explain="Writers Guild."/>
            <Toggle label="IATSE" value={guilds.iatse} onChange={v=>setGuilds(p=>({...p,iatse:v}))} explain="BTL crew: grips, electric, camera, art dept."/>
            {!guilds.sag&&!guilds.dga&&!guilds.wga&&!guilds.iatse&&<div style={{fontFamily:F.body,fontSize:"13px",color:T.w65,fontStyle:"italic"}}>Non-union project.</div>}
          </>}
          {wizStep===3&&<>
            <div style={{fontFamily:F.body,fontSize:"14px",color:T.w65,marginBottom:"18px"}}>Choose a strategy, then adjust.</div>
            <div style={{display:"flex",gap:"8px",marginBottom:"28px"}}>{Object.keys(DIST_PRESETS).map(n=><button key={n} onClick={()=>applyDist(n)} style={{flex:1,background:distPreset===n?"rgba(242,202,80,0.04)":"transparent",border:`1px solid ${distPreset===n?T.goldLine:T.border}`,borderRadius:"10px",padding:"14px",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}><div style={{fontFamily:F.mono,fontSize:"11px",color:distPreset===n?T.goldPrimary:T.cw70,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px"}}>{n}</div><div style={{fontFamily:F.body,fontSize:"12px",color:T.w65,marginTop:"6px",lineHeight:1.5}}>{DIST_PRESETS[n].desc}</div></button>)}</div>
            <ComboInput label="Exhibitor Split" value={inp.exhibitorPct} onChange={v=>s("exhibitorPct",v)} min={0} max={60} explain="Theater's cut. 0% for streaming." benchMin={45} benchMax={55}/>
            <ComboInput label="P&A / Marketing" value={inp.paBudget} onChange={v=>s("paBudget",v)} min={0} max={Math.round(inp.totalBudget*.5)} step={10000} suffix="" fmt={fmt} explain="Distributor's spend. $0 for streaming."/>
            <ComboInput label="Distribution Fee" value={inp.distFeePct} onChange={v=>s("distFeePct",v)} min={10} max={40} explain="25-35% typical." benchMin={25} benchMax={35}/>
            <ComboInput label="SA Commission" value={inp.saCommPct} onChange={v=>s("saCommPct",v)} min={5} max={20} explain="10-15% typical." benchMin={10} benchMax={15}/>
            {warnings.length>0&&<div style={{background:T.amberDim,border:`1px solid rgba(240,168,48,0.20)`,borderRadius:"10px",padding:"14px 16px",margin:"16px 0"}}>{warnings.map((w,i)=><div key={i} style={{fontFamily:F.body,fontSize:"13px",color:T.amber,marginBottom:i<warnings.length-1?"8px":0,lineHeight:1.4}}>⚠ {w}</div>)}</div>}
          </>}
          {/* v4.5: Button hierarchy — BACK ghost, NEXT gold, final shimmer CTA */}
          <div style={{display:"flex",gap:"12px",marginTop:"28px"}}>
            {wizStep>0&&<button onClick={()=>setWizStep(w=>w-1)} style={{flex:1,padding:"16px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:"10px",fontFamily:F.display,fontSize:"16px",letterSpacing:"2px",color:T.cw70,cursor:"pointer"}}>← BACK</button>}
            {wizStep<3
              ?<button disabled={inp.totalBudget<250000} onClick={()=>setWizStep(w=>w+1)} style={{flex:1,padding:"16px",background:`linear-gradient(135deg,${T.goldPrimary},${T.gold})`,border:"none",borderRadius:"10px",fontFamily:F.display,fontSize:"16px",letterSpacing:"2px",color:"#000",cursor:inp.totalBudget<250000?"not-allowed":"pointer",opacity:inp.totalBudget<250000?0.4:1,fontWeight:700}}>NEXT →</button>
              :<button onClick={finishWizard} style={{flex:1,padding:"16px",background:`linear-gradient(135deg,${T.goldPrimary},${T.gold})`,border:"none",borderRadius:"10px",fontFamily:F.display,fontSize:"18px",letterSpacing:"3px",color:"#000",cursor:"pointer",fontWeight:700,boxShadow:`0 4px 24px rgba(242,202,80,0.20)`,position:"relative",overflow:"hidden"}}><span style={{position:"relative",zIndex:1}}>VIEW YOUR DEAL →</span><div style={{position:"absolute",top:0,left:0,width:"55%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)",animation:"shimmer 2.5s ease-in-out infinite"}}/></button>}
          </div>
        </Glass></div>}

        {/* ═══ EMPTY STATE — v4.5: Premium gate ═══ */}
        {!wizardDone&&tid!=="setup"&&tid!=="glossary"&&<div style={{textAlign:"center",padding:"120px 24px"}}>
          <div style={{fontFamily:F.mono,fontSize:"12px",color:T.gold,letterSpacing:"4px",opacity:0.3,marginBottom:"20px"}}>FILMMAKER.OG</div>
          <div style={{width:"60px",height:"1px",background:T.goldLine,margin:"0 auto 24px"}}/>
          <div style={{fontFamily:F.display,fontSize:"26px",color:T.cw50,marginBottom:"14px"}}>BUILD YOUR MODEL TO UNLOCK</div>
          <div style={{fontFamily:F.body,fontSize:"14px",color:T.w65,marginBottom:"28px",maxWidth:"360px",margin:"0 auto 28px"}}>Complete the 4-step setup wizard to generate your financial analysis.</div>
          <button onClick={()=>switchTab(0)} style={{padding:"12px 28px",background:"rgba(212,175,55,0.04)",border:`1px solid ${T.goldLine}`,borderRadius:"10px",fontFamily:F.display,fontSize:"14px",letterSpacing:"2px",color:T.goldPrimary,cursor:"pointer"}}>GO TO SETUP →</button>
        </div>}

        {/* ═══ SNAPSHOT ═══ */}
        {tid==="snapshot"&&wizardDone&&<div style={{display:"flex",flexDirection:"column",gap:"28px",maxWidth:"720px",margin:"0 auto"}}>
          {/* v4.5: Restyled disclaimer — institutional, not warning */}
          <div style={{background:"rgba(255,255,255,0.02)",borderRadius:"8px",padding:"10px 16px",textAlign:"center",border:`1px solid ${T.border}`}}><span style={{fontFamily:F.mono,fontSize:"10px",color:T.cw50,letterSpacing:"2px"}}>ILLUSTRATIVE MODEL · NOT AN OFFER OF SECURITIES · CONSULT PROFESSIONALS</span></div>
          <Glass tier="primary" accent><SL>The Project</SL>
            <div style={{fontFamily:F.body,fontSize:"16px",color:T.w85,lineHeight:1.8}}>You're making a <strong style={{color:T.goldPrimary,fontWeight:600}}>{inp.genre}</strong> film with a budget of <strong style={{color:T.goldPrimary,fontWeight:600}}>{fF(d.actualBudget)}</strong>. You need <strong style={{color:T.equity,fontWeight:600}}>{fF(d.eq)}</strong> from investors — roughly <strong style={{fontWeight:600}}>{d.estInv} investors</strong> at {fF(inp.minInvestment)} each.</div>
            {(crew.producer||crew.director||crew.writer||crew.cast)&&<div style={{marginTop:"16px",display:"flex",gap:"20px",flexWrap:"wrap"}}>{[{l:"Producer",v:crew.producer},{l:"Director",v:crew.director},{l:"Writer",v:crew.writer},{l:"Cast",v:crew.cast}].filter(x=>x.v).map(x=><div key={x.l}><div style={{fontFamily:F.mono,fontSize:"10px",color:T.cw50,letterSpacing:"1.5px",fontWeight:700}}>{x.l.toUpperCase()}</div><div style={{fontFamily:F.body,fontSize:"14px",color:T.w75,marginTop:"3px"}}>{x.v}</div></div>)}</div>}
          </Glass>
          <Glass><SL sub="Production cash sources = budget uses.">Sources & Uses</SL>
            {(()=>{const st=d.sources.reduce((s,c)=>s+c.amount,0),ut=d.bd.reduce((s,c)=>s+c.value,0),bal=Math.abs(st-ut)<1000;return<>
            <div style={{display:"flex",gap:"28px",marginTop:"14px"}}>
              <div style={{flex:1}}><div style={{fontFamily:F.mono,fontSize:"10px",color:T.goldPrimary,letterSpacing:"2px",marginBottom:"12px",fontWeight:700}}>SOURCES</div>{d.sources.map(c=><div key={c.name} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}><span style={{fontFamily:F.body,fontSize:"14px",color:T.w75}}>{c.name}</span><span style={{fontFamily:F.mono,fontSize:"14px",color:T.cw90,fontWeight:600}}><AV>{fF(c.amount)}</AV></span></div>)}<div style={{display:"flex",justifyContent:"space-between",padding:"14px 0",borderTop:`1px solid ${T.goldDim}`,marginTop:"4px"}}><strong style={{fontSize:"14px",fontWeight:700}}>Total</strong><strong style={{fontSize:"14px",fontWeight:700,color:bal?T.w92:T.amber}}><AV>{fF(st)}</AV></strong></div></div>
              <div style={{width:"1px",background:T.border}}/>
              <div style={{flex:1}}><div style={{fontFamily:F.mono,fontSize:"10px",color:T.goldPrimary,letterSpacing:"2px",marginBottom:"12px",fontWeight:700}}>USES</div>{d.bd.map(c=><div key={c.name} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}><span style={{fontFamily:F.body,fontSize:"14px",color:T.w75}}>{c.name}</span><span style={{fontFamily:F.mono,fontSize:"14px",color:T.w75}}>{fF(c.value)}</span></div>)}<div style={{display:"flex",justifyContent:"space-between",padding:"14px 0",borderTop:`1px solid ${T.goldDim}`,marginTop:"4px"}}><strong style={{fontSize:"14px",fontWeight:700}}>Total</strong><strong style={{fontSize:"14px",fontWeight:700,color:bal?T.w92:T.amber}}>{fF(ut)}</strong></div></div>
            </div>
            {!bal&&<div style={{fontFamily:F.mono,fontSize:"11px",color:T.amber,textAlign:"center",marginTop:"8px",fontWeight:600}}>⚠ Gap: {fF(Math.abs(st-ut))}</div>}
            </>;})()}
          </Glass>
          {/* v4.5: Redesigned FlowStep — clean cascade, no indent */}
          <Glass><SL sub="Every dollar passes through deductions in this order.">How Investors Get Paid</SL>
            <FlowStep num="1" label="Gross Revenue" explain="All sources: streaming, theatrical, international, TV" amount={wfBase.gr}/>
            <FlowStep num="2" label="Distribution Costs" explain={wfBase.hasTh?`Exhibitors ${inp.exhibitorPct}% · Distributor ${inp.distFeePct}% · P&A · Sales Agent ${inp.saCommPct}%`:`Distributor ${inp.distFeePct}% · Sales Agent ${inp.saCommPct}%`} amount={-(wfBase.et+wfBase.pa+wfBase.df+wfBase.sc)} isLoss/>
            <FlowStep num="3" label="Net Producer Proceeds" amount={wfBase.npp} isHighlight/>
            <FlowStep num="4" label="Debt Repayment" explain="Senior debt, gap/mezz, pre-sale loans" amount={-(wfBase.drAmt+wfBase.gpAmt+wfBase.psAmt)} isLoss/>
            <FlowStep num="5" label={`Investor Recoupment (${100+inp.recoupPremium}%)`} explain={`${fF(d.eq)} principal + ${inp.recoupPremium}% premium`} amount={-wfBase.ir} isLoss/>
            <FlowStep num="6" label={`Profit Split (${inp.investorBackend}/${100-inp.investorBackend})`} explain="Investor backend / Producer backend" amount={wfBase.ib+wfBase.pb}/>
          </Glass>
          <Glass tier="primary" accent><SL sub="Revenue needed at each outcome.">What Has to Happen</SL>
            {(()=>{const mx=Math.max(d.rt.upside,find2x)*1.15;const mk=[{l:"Breakeven",v:findBE,c:T.amber},{l:SL_BASE,v:d.rt.base,c:T.goldPrimary},{l:SL_BULL,v:d.rt.upside,c:T.green}];if(find2x<mx*.95)mk.push({l:"2×",v:find2x,c:T.gold});return<div style={{marginTop:"16px"}}><div style={{position:"relative",height:"40px",background:"rgba(255,255,255,0.05)",borderRadius:"10px",overflow:"hidden"}}><div style={{position:"absolute",left:0,top:0,height:"100%",width:`${Math.min(95,(d.rt.base/mx)*100)}%`,background:`linear-gradient(90deg,rgba(77,175,120,0.08),rgba(242,202,80,0.12))`,borderRadius:"10px"}}/>{mk.map(m=><div key={m.l} style={{position:"absolute",left:`${Math.min(97,(m.v/mx)*100)}%`,top:0,height:"100%",width:"2px",background:m.c,opacity:0.8}}/>)}</div><div style={{position:"relative",height:"56px",marginTop:"8px"}}>{mk.map(m=><div key={m.l} style={{position:"absolute",left:`${Math.min(88,Math.max(2,(m.v/mx)*100))}%`,textAlign:"center",transform:"translateX(-50%)"}}><div style={{fontFamily:F.mono,fontSize:"11px",color:m.c,fontWeight:700}}>{m.l}</div><div style={{fontFamily:F.mono,fontSize:"13px",color:T.cw70}}>{fmt(m.v)}</div></div>)}</div></div>;})()}
            <div style={{fontFamily:F.body,fontSize:"16px",color:T.w75,lineHeight:1.8,marginTop:"10px"}}>At <strong style={{fontWeight:600}}>{SL_BASE} Case</strong>, investors receive <strong style={{color:moicColor(wfBase.moic),fontWeight:600}}><AV>{wfBase.moic!==null?fF(Math.round(wfBase.tr)):"N/A"}</AV></strong> — {wfBase.moic!==null?<><strong style={{color:moicColor(wfBase.moic),fontWeight:600}}>{moicDisplay(wfBase.moic)}</strong>.{wfBase.moic<1&&" Partial loss."}{wfBase.moic>=1&&wfBase.moic<1.5&&" Capital recovered."}{wfBase.moic>=1.5&&" Strong return."}</>:"Fully debt-financed."}</div>
          </Glass>
          <Glass tier="recessed"><SL>The Risk</SL>
            {d.risks.filter(r=>r.score>=.8).sort((a,b)=>b.score-a.score).slice(0,3).map((r,i)=><div key={i} style={{padding:"12px 0",borderBottom:`1px solid ${T.border}`}}><div style={{display:"flex",alignItems:"center",gap:"12px"}}><span style={{fontFamily:F.mono,fontSize:"12px",color:T.red,fontWeight:700,minWidth:"34px"}}>{r.prob}%</span><span style={{fontFamily:F.body,fontSize:"14px",color:T.w92,fontWeight:600}}>{r.name}</span></div><div style={{fontFamily:F.body,fontSize:"12px",color:T.w65,marginTop:"4px",marginLeft:"46px",fontStyle:"italic"}}>{r.mit}</div></div>)}
            <div style={{fontFamily:F.body,fontSize:"14px",color:T.red,marginTop:"16px",fontWeight:600}}>It is possible to lose the entire investment.</div>
          </Glass>
          <Glass tier="primary" accent>
            <SL>The Opportunity</SL>
            <div style={{display:"flex",gap:"16px",marginTop:"10px"}}>
              {[{l:"BULL REVENUE",v:fmt(d.rt.upside),c:T.green},{l:"INVESTOR RETURN",v:wfUp.moic!==null?moicDisplay(wfUp.moic):"N/A",c:T.green},{l:"COST REDUCTION",v:Math.round((1-d.eq/d.actualBudget)*100)+"%",c:T.equity}].map(x=><div key={x.l} style={{flex:1,textAlign:"center",padding:"20px 12px",background:"rgba(255,255,255,0.03)",borderRadius:"10px"}}>
                <div style={{fontFamily:F.mono,fontSize:"10px",color:T.cw50,letterSpacing:"1.5px",fontWeight:700}}>{x.l}</div>
                <div style={{fontFamily:F.display,fontSize:"34px",color:x.c,marginTop:"8px"}}><AV>{x.v}</AV></div>
              </div>)}
            </div>
            <div style={{fontFamily:F.body,fontSize:"14px",color:T.w75,lineHeight:1.8,marginTop:"18px"}}>Budget: {fF(d.actualBudget)} → Equity: <strong style={{color:T.equity,fontWeight:600}}>{fF(d.eq)}</strong>. Tax credits and debt reduce investor exposure by {Math.round((1-d.eq/d.actualBudget)*100)}%.</div>
          </Glass>
          <div style={{textAlign:"center"}}><button onClick={()=>switchTab(3)} style={{background:"rgba(212,175,55,0.04)",border:`1px solid ${T.goldLine}`,borderRadius:"10px",padding:"14px 32px",fontFamily:F.display,fontSize:"14px",letterSpacing:"3px",color:T.goldPrimary,cursor:"pointer"}}>EXPLORE THE WATERFALL →</button></div>
        </div>}

        {/* ═══ OVERVIEW ═══ */}
        {tid==="overview"&&wizardDone&&<div style={{display:"flex",flexDirection:"column",gap:"28px"}}>
          <div style={{display:"flex",gap:"14px",flexWrap:"wrap"}}>
            <KPI label="Equity Raise" value={fmt(d.eq)} color={T.equity} bars={moicBars(d.eq*.6,d.eq,d.eq*1.4)}/>
            <KPI label="Base MOIC" value={moicDisplay(wfBase.moic)} color={moicColor(wfBase.moic)} bars={moicBars(wfCon.moic,wfBase.moic,wfUp.moic)}/>
            <KPI label="Budget" value={fmt(d.actualBudget)}/>
            <KPI label="Tax Credit" value={fmt(d.tc)} sub={`${stateData.name} @ ${inp.taxCreditPct}%`}/>
          </div>
          <Glass accent><SL>Capital Stack</SL><div style={{display:"flex",height:"36px",borderRadius:"10px",overflow:"hidden",marginTop:"14px"}}>{d.cs.map(c=><div key={c.name} style={{width:`${(c.amount/((d.actualBudget+d.tc)||1))*100}%`,background:c.color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.mono,fontSize:"11px",color:"#000",fontWeight:700}}>{c.amount>=d.actualBudget*.08?fmt(c.amount):""}</div>)}</div><div style={{display:"flex",gap:"18px",marginTop:"12px",flexWrap:"wrap"}}>{d.cs.map(c=><div key={c.name} style={{display:"flex",alignItems:"center",gap:"6px"}}><div style={{width:9,height:9,borderRadius:"50%",background:c.color}}/><span style={{fontFamily:F.mono,fontSize:"11px",color:T.cw70}}>{c.name}</span></div>)}</div></Glass>
          <div style={{display:"flex",gap:"14px"}}><Glass style={{flex:1}}><SL>Revenue</SL><div style={{display:"flex",gap:"14px",marginTop:"14px"}}>{[{l:SL_BEAR,v:d.rt.conservative,c:T.red},{l:SL_BASE,v:d.rt.base,c:T.goldPrimary},{l:SL_BULL,v:d.rt.upside,c:T.green}].map(x=><div key={x.l} style={{flex:1,textAlign:"center"}}><div style={{fontFamily:F.mono,fontSize:"10px",color:T.cw50,letterSpacing:"1px",fontWeight:700}}>{x.l}</div><div style={{fontFamily:F.display,fontSize:"30px",color:x.c,lineHeight:1.2,marginTop:"6px"}}><AV>{fmt(x.v)}</AV></div></div>)}</div></Glass>
          <Glass style={{flex:1}}><SL>Budget</SL><div style={{display:"flex",alignItems:"center",gap:"20px"}}><div style={{width:130,height:130,position:"relative"}}><ResponsiveContainer><PieChart><Pie data={d.bd} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={58} stroke={"#000"} strokeWidth={2}>{d.bd.map((e,i)=><Cell key={i} fill={e.color} opacity={0.85}/>)}</Pie></PieChart></ResponsiveContainer><div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}><div style={{fontFamily:F.display,fontSize:"16px",color:T.w92}}>{fmt(d.actualBudget)}</div></div></div><div style={{display:"flex",flexDirection:"column",gap:"5px"}}>{d.bd.map(e=><div key={e.name} style={{display:"flex",alignItems:"center",gap:"6px"}}><div style={{width:8,height:8,borderRadius:"2px",background:e.color,opacity:0.85}}/><span style={{fontFamily:F.mono,fontSize:"11px",color:T.cw70}}>{e.name}</span><span style={{fontFamily:F.mono,fontSize:"11px",color:T.cw90}}>{fmt(e.value)}</span></div>)}</div></div></Glass></div>
        </div>}

        {/* ═══ WATERFALL ═══ */}
        {tid==="waterfall"&&wizardDone&&<div style={{display:"flex",flexDirection:"column",gap:"28px"}}>
          <Glass tier="primary" accent><SL>Revenue Scenario</SL>
            <div style={{fontFamily:F.mono,fontSize:"13px",color:T.cw70,marginBottom:"10px"}}>Gross: <span style={{color:T.goldPrimary,fontSize:"28px",fontFamily:F.display}}><AV>{fF(activeScenario)}</AV></span></div>
            <input type="range" min={250000} max={Math.max(1e7,inp.totalBudget*5)} step={50000} value={activeScenario} onChange={e=>setScenario(Number(e.target.value))} style={{width:"100%",accentColor:T.goldPrimary,height:"3px",cursor:"pointer"}}/>
            <div style={{display:"flex",gap:"8px",marginTop:"16px"}}>{[{l:SL_BEAR,v:d.rt.conservative,moic:wfCon.moic},{l:SL_BASE+" Case",v:d.rt.base,moic:wfBase.moic},{l:SL_BULL,v:d.rt.upside,moic:wfUp.moic}].map(x=><button key={x.l} onClick={()=>setScenario(x.v)} style={{flex:1,background:activeScenario===x.v?"rgba(242,202,80,0.04)":"transparent",border:`1px solid ${activeScenario===x.v?T.goldLine:T.border}`,borderRadius:"10px",padding:"16px",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>
              <div style={{fontFamily:F.mono,fontSize:"11px",color:activeScenario===x.v?T.goldPrimary:T.cw50,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px"}}>{x.l}</div>
              <div style={{fontFamily:F.display,fontSize:"28px",color:activeScenario===x.v?T.w92:T.cw70,marginTop:"4px"}}><AV>{fmt(x.v)}</AV></div>
              <div style={{display:"inline-block",background:x.moic!==null?(x.moic>=1?T.greenDim:T.redDim):"rgba(255,255,255,0.03)",borderRadius:"6px",padding:"4px 12px",marginTop:"8px"}}><span style={{fontFamily:F.mono,fontSize:"17px",fontWeight:700,color:moicColor(x.moic)}}>{moicDisplay(x.moic)}</span></div>
            </button>)}</div>
          </Glass>
          <Glass><SL>Waterfall Bridge</SL><div style={{width:"100%",height:360,marginTop:"10px"}}><ResponsiveContainer><BarChart data={wb} margin={{left:10,right:10,top:10,bottom:35}}><CartesianGrid horizontal vertical={false} stroke="rgba(255,255,255,0.03)"/><XAxis dataKey="name" tick={{fill:T.cw70,fontSize:11,fontFamily:F.mono}} angle={-30} textAnchor="end" height={55}/><YAxis tick={{fill:T.cw70,fontSize:11,fontFamily:F.mono}} tickFormatter={fmt}/><Tooltip content={<CTT/>}/><Bar dataKey="base" stackId="a" fill="transparent"/><Bar dataKey="value" stackId="a" radius={[6,6,0,0]}>{wb.map((d,i)=><Cell key={i} fill={d.fill} opacity={0.8}/>)}</Bar></BarChart></ResponsiveContainer></div></Glass>
          <div style={{display:"flex",gap:"14px",flexWrap:"wrap"}}>
            <KPI label="Investor Return" value={wf.moic!==null?fmt(wf.tr):"N/A"} color={wf.moic!==null?(wf.tr>=d.eq?T.green:T.red):T.cw50}/>
            <KPI label="MOIC" value={moicDisplay(wf.moic)} color={moicColor(wf.moic)}/>
            <KPI label="ROI" value={wf.roi!==null?pct(wf.roi):"N/A"} color={wf.roi!==null?(wf.roi>=0?T.green:T.red):T.cw50}/>
            <KPI label="Producer Net" value={fmt(wf.pb)} color={T.purple}/>
          </div>
        </div>}

        {/* ═══ REVENUE ═══ */}
        {tid==="revenue"&&wizardDone&&<div style={{display:"flex",flexDirection:"column",gap:"28px"}}>
          <div style={{display:"flex",gap:"14px",flexWrap:"wrap"}}><KPI label={SL_BEAR} value={fmt(d.rt.conservative)} color={T.red}/><KPI label={SL_BASE} value={fmt(d.rt.base)} color={T.goldPrimary}/><KPI label={SL_BULL} value={fmt(d.rt.upside)} color={T.green}/></div>
          <Glass><SL sub={`${inp.genre} benchmarks at ${fmt(inp.totalBudget)}.`}>Revenue by Window</SL><div style={{width:"100%",height:380,marginTop:"14px"}}><ResponsiveContainer><BarChart data={d.rw} margin={{left:10,right:10,top:10,bottom:55}}><CartesianGrid horizontal vertical={false} stroke="rgba(255,255,255,0.03)"/><XAxis dataKey="window" tick={{fill:T.cw70,fontSize:11,fontFamily:F.mono}} angle={-30} textAnchor="end" height={55}/><YAxis tick={{fill:T.cw70,fontSize:11,fontFamily:F.mono}} tickFormatter={fmt}/><Tooltip content={<CTT/>}/><Bar dataKey="conservative" name={SL_BEAR} fill={T.red} opacity={0.55} radius={[3,3,0,0]} barSize={14}/><Bar dataKey="base" name={SL_BASE} fill={T.goldPrimary} opacity={0.65} radius={[3,3,0,0]} barSize={14}/><Bar dataKey="upside" name={SL_BULL} fill={T.green} opacity={0.65} radius={[3,3,0,0]} barSize={14}/><Legend wrapperStyle={{fontFamily:F.mono,fontSize:"11px"}}/></BarChart></ResponsiveContainer></div></Glass>
          <Glass><SL sub="Gold line = budget.">Breakeven by Strategy</SL><div style={{width:"100%",height:220,marginTop:"14px"}}><ResponsiveContainer><BarChart data={d.be} layout="vertical" margin={{left:120,right:30}}><XAxis type="number" tick={{fill:T.cw70,fontSize:11,fontFamily:F.mono}} tickFormatter={fmt}/><YAxis type="category" dataKey="strategy" tick={{fill:T.cw70,fontSize:12,fontFamily:F.mono}} width={115}/><Tooltip content={<CTT/>}/><ReferenceLine x={d.actualBudget} stroke={T.goldPrimary} strokeDasharray="5 5" strokeOpacity={0.5}/><Bar dataKey="breakeven" radius={[0,6,6,0]} barSize={20}>{d.be.map((b,i)=><Cell key={i} fill={b.breakeven<d.actualBudget*1.5?T.green:b.breakeven<d.actualBudget*4?T.amber:T.red} opacity={.6}/>)}</Bar></BarChart></ResponsiveContainer></div></Glass>
          {/* v4.5: Comp Reports card upgraded */}
          <Glass accent style={{textAlign:"center"}}><div style={{fontFamily:F.mono,fontSize:"11px",color:T.purple,letterSpacing:"3px",marginBottom:"12px",fontWeight:700}}>CUSTOM COMP REPORTS</div><div style={{fontFamily:F.body,fontSize:"15px",color:T.w75,lineHeight:1.7,maxWidth:"480px",margin:"0 auto"}}>How did comparable films perform? Real market data for your genre, budget range, and distribution strategy.</div><button style={{marginTop:"18px",padding:"12px 32px",background:T.purpleDim,border:`1px solid rgba(157,122,237,0.25)`,borderRadius:"10px",fontFamily:F.mono,fontSize:"11px",letterSpacing:"2px",color:T.purple,cursor:"pointer",fontWeight:700,textTransform:"uppercase"}}>LEARN MORE →</button></Glass>
        </div>}

        {/* ═══ BUDGET ═══ */}
        {tid==="budget"&&wizardDone&&<div style={{display:"flex",flexDirection:"column",gap:"28px"}}>
          <div style={{fontFamily:F.body,fontSize:"14px",color:T.w65}}>Click any amount to customize. Hover rows to edit.</div>
          <Glass accent><SL>Budget — <AV>{fmt(d.actualBudget)}</AV></SL><div style={{width:"100%",height:220}}><ResponsiveContainer><PieChart><Pie data={d.bd} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={90} stroke={"#000"} strokeWidth={2}>{d.bd.map((e,i)=><Cell key={i} fill={e.color} opacity={0.85}/>)}</Pie><Tooltip content={<CTT/>}/></PieChart></ResponsiveContainer></div><div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>{d.bd.map(e=><div key={e.name} style={{display:"flex",alignItems:"center",gap:"5px"}}><div style={{width:8,height:8,borderRadius:"2px",background:e.color,opacity:0.85}}/><span style={{fontFamily:F.mono,fontSize:"11px",color:T.cw70}}>{e.name} {fmt(e.value)}</span></div>)}</div></Glass>
          {Object.keys(CC).map(cat=>{const items=d.bi.filter(b=>b.category===cat&&!b.isBond);const catTotal=items.reduce((s,b)=>s+b.amount,0)+(cat==="G&A"&&bondOn?d.bondAmt:0);const catPct=(catTotal/((d.actualBudget||1))*100).toFixed(1);const bench=CAT_BENCH[cat];const outOfRange=bench&&(parseFloat(catPct)<bench[0]||parseFloat(catPct)>bench[1]);return<Glass key={cat} tier="recessed"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}><SL>{CL[cat]}</SL><span style={{fontFamily:F.mono,fontSize:"16px",color:CC[cat],fontWeight:700}}><AV>{fmt(catTotal)}</AV></span></div>{bench&&<div style={{fontFamily:F.mono,fontSize:"11px",color:outOfRange?T.amber:T.cw70,marginBottom:"14px",fontWeight:500}}>Currently {catPct}% — Typical {bench[0]}-{bench[1]}%</div>}{items.map(item=>{const gi=d.bi.indexOf(item);const itemPct=(item.amount/((d.actualBudget||1))*100).toFixed(1);return<div key={item.name} style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}><span style={{fontFamily:F.mono,fontSize:"13px",color:T.w75,flex:1}}>{item.name}</span><span style={{fontFamily:F.mono,fontSize:"11px",color:T.cw50,minWidth:"44px",textAlign:"right"}}>{itemPct}%</span><div style={{display:"flex",alignItems:"center",gap:"3px"}}><span style={{fontFamily:F.mono,fontSize:"13px",color:T.goldPrimary}}>$</span><input type="number" value={item.amount} onChange={e=>setBudgetEdits(p=>({...p,[gi]:Number(e.target.value)||0}))} style={{width:"110px",background:item.isEdited?"rgba(242,202,80,0.06)":T.inputBg,border:`1px solid ${item.isEdited?T.goldDim:T.inputBorder}`,borderRadius:"8px",padding:"8px 10px",color:item.isEdited?T.goldPrimary:T.cw90,fontFamily:F.mono,fontSize:"13px",outline:"none",textAlign:"right"}}/></div>{item.isEdited&&<button onClick={()=>setBudgetEdits(p=>{const n={...p};delete n[gi];return n;})} style={{background:"none",border:"none",color:T.cw50,cursor:"pointer",fontFamily:F.mono,fontSize:"11px"}}>reset</button>}</div>})}{cat==="G&A"&&bondOn&&<div style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 0"}}><span style={{fontFamily:F.mono,fontSize:"13px",color:T.w75,flex:1}}>Completion Bond</span><span style={{fontFamily:F.mono,fontSize:"13px",color:T.w75}}>{fF(d.bondAmt)}</span></div>}</Glass>;})}
          <Glass style={{textAlign:"center"}} tier="recessed">
            <span style={{fontFamily:F.mono,fontSize:"11px",color:T.cw70,fontWeight:700,letterSpacing:"1.5px"}}>CONTINGENCY ({contPct}% of BTL+Post)</span>
            <div style={{fontFamily:F.display,fontSize:"34px",color:T.amber,margin:"8px 0"}}><AV>{fmt(d.cont)}</AV></div>
            <input type="range" min={0} max={20} step={1} value={contPct} onChange={e=>setContPct(Number(e.target.value))} style={{width:"200px",accentColor:T.amber,height:"3px",cursor:"pointer"}}/>
            <div style={{fontFamily:F.mono,fontSize:"10px",color:T.cw50,marginTop:"4px"}}>Standard is 10%</div>
          </Glass>
        </div>}

        {/* ═══ CAPITAL ═══ */}
        {tid==="capital"&&wizardDone&&<div style={{display:"flex",flexDirection:"column",gap:"28px"}}>
          <Glass accent><SL>Capital Stack</SL><div style={{marginTop:"18px"}}>{d.cs.map((l,i)=><div key={l.name} style={{display:"flex",alignItems:"stretch",borderBottom:i<d.cs.length-1?`1px solid ${T.border}`:"none"}}><div style={{width:"6px",background:l.color,opacity:0.85,borderRadius:"3px"}}/><div style={{flex:1,padding:"20px"}}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontFamily:F.body,fontSize:"16px",color:T.w92,fontWeight:600}}>{l.name}</div><div style={{fontFamily:F.mono,fontSize:"11px",color:T.cw50}}>{l.pos}</div></div><div style={{fontFamily:F.mono,fontSize:"18px",color:T.cw90,fontWeight:700}}><AV>{fF(l.amount)}</AV></div></div></div></div>)}</div></Glass>
          <Glass><SL>Investor Terms</SL><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"20px",marginTop:"14px"}}>{[
            {l:"Vehicle",v:vehicle,isSelect:true,options:VEHICLES,onChange:setVehicle,e:vehicle==="Not Sure"?"Your attorney will advise.":undefined},
            {l:"Min Investment",v:fF(inp.minInvestment)},
            {l:"Exemption",v:exemption,isSelect:true,options:EXEMPTIONS,onChange:setExemption,e:exemption==="Not Sure"?"Your attorney will advise.":exemption==="Reg D 506(b)"?"No public advertising.":exemption==="Reg D 506(c)"?"Public advertising. Verified accredited.":"See attorney."},
            {l:"Premium",v:`${100+inp.recoupPremium}%`},{l:"Inv Backend",v:`${inp.investorBackend}%`},{l:"Prod Backend",v:`${100-inp.investorBackend}%`},
            {l:"Guilds",v:guildStr},{l:"Loan Term",v:`${inp.loanTerm} mo`},{l:"Bond",v:bondOn?`Yes (${bondPct}%)`:"No"},
          ].map(x=><div key={x.l}>
            <div style={{fontFamily:F.mono,fontSize:"9px",color:T.cw50,letterSpacing:"1.5px",fontWeight:700}}>{x.l.toUpperCase()}</div>
            {x.isSelect?<div style={{position:"relative",marginTop:"4px"}}><select value={x.v} onChange={e=>x.onChange(e.target.value)} style={{width:"100%",background:T.inputBg,border:`1px solid ${T.inputBorder}`,borderRadius:"6px",padding:"4px 24px 4px 6px",color:T.cw90,fontFamily:F.body,fontSize:"13px",outline:"none",appearance:"none",cursor:"pointer"}}>{x.options.map(o=><option key={o} value={o} style={{background:"#111"}}>{o}</option>)}</select><span style={{position:"absolute",right:"6px",top:"50%",transform:"translateY(-50%)",fontFamily:F.mono,fontSize:"11px",color:T.cw50,pointerEvents:"none"}}>▾</span></div>
            :<div style={{fontFamily:F.body,fontSize:"14px",color:T.cw90,marginTop:"4px",fontWeight:600}}>{x.v}</div>}
            {x.e&&<div style={{fontFamily:F.body,fontSize:"11px",color:T.w65,fontStyle:"italic",marginTop:"3px"}}>{x.e}</div>}
          </div>)}</div><div style={{fontFamily:F.body,fontSize:"12px",color:T.w65,marginTop:"18px",fontStyle:"italic"}}>Default structure. Your attorney will confirm.</div></Glass>
        </div>}

        {/* ═══ CASH FLOW ═══ */}
        {tid==="cashflow"&&wizardDone&&<div style={{display:"flex",flexDirection:"column",gap:"28px"}}>
          <div style={{fontFamily:F.body,fontSize:"14px",color:T.w65}}>Cash deploys during production, returns through distribution.{stateData.months!=="—"?` TC est: ${stateData.months} mo.`:""}</div>
          <Glass><SL>Cash Flow</SL><div style={{width:"100%",height:360,marginTop:"14px"}}><ResponsiveContainer><ComposedChart data={d.cf} margin={{left:10,right:10,top:10,bottom:10}}><CartesianGrid horizontal vertical={false} stroke="rgba(255,255,255,0.03)"/><XAxis dataKey="month" tick={{fill:T.cw70,fontSize:11,fontFamily:F.mono}}/><YAxis yAxisId="b" tick={{fill:T.cw70,fontSize:11,fontFamily:F.mono}} tickFormatter={fmt}/><YAxis yAxisId="l" orientation="right" tick={{fill:T.cw70,fontSize:11,fontFamily:F.mono}} tickFormatter={fmt}/><Tooltip content={<CTT/>}/><Bar yAxisId="b" dataKey="inflows" name="In" fill={T.green} opacity={0.55} radius={[4,4,0,0]} barSize={16}/><Bar yAxisId="b" dataKey="outflows" name="Out" fill={T.red} opacity={0.45} radius={[0,0,4,4]} barSize={16}/><Line yAxisId="l" type="monotone" dataKey="cumulative" name="Cum" stroke={T.goldPrimary} strokeWidth={2} dot={{fill:T.goldPrimary,r:3}}/><ReferenceLine yAxisId="b" y={0} stroke={T.cw30}/><Legend wrapperStyle={{fontFamily:F.mono,fontSize:"11px"}}/></ComposedChart></ResponsiveContainer></div></Glass>
          {/* v4.5: Taller timeline bar */}
          <Glass><SL>Timeline</SL><div style={{display:"flex",height:"44px",borderRadius:"8px",overflow:"hidden",marginTop:"14px"}}>{[{p:"Pre-Prod",m:2,c:T.gold},{p:"Production",m:3,c:T.goldPrimary},{p:"Post",m:3,c:T.purple},{p:"Delivery",m:2,c:T.amber},{p:"Distribution",m:4,c:T.green}].map(x=><div key={x.p} style={{flex:x.m,background:x.c,opacity:0.75,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.mono,fontSize:"12px",color:"#000",fontWeight:700,borderRight:"1px solid #000"}}>{x.p}</div>)}</div></Glass>
        </div>}

        {/* ═══ SENSITIVITY ═══ */}
        {tid==="sensitivity"&&wizardDone&&<div style={{display:"flex",flexDirection:"column",gap:"28px"}}>
          <Glass><SL sub="Each cell = investor ROI at that revenue × equity. Your row highlighted.">ROI Heat Map</SL><div style={{overflowX:"auto",marginTop:"14px"}}><table style={{width:"100%",borderCollapse:"collapse",fontFamily:F.mono,fontSize:"12px"}}><thead><tr><th style={{padding:"10px 8px",color:T.cw70,textAlign:"left",borderBottom:`1px solid ${T.border}`,fontSize:"11px",fontWeight:700}}>Equity ↓ / Rev →</th>{sR.map(r=><th key={r} style={{padding:"10px 8px",color:T.cw70,textAlign:"center",borderBottom:`1px solid ${T.border}`,fontSize:"11px",fontWeight:700}}>{fmt(r)}</th>)}</tr></thead><tbody>{sE.map((eq,ri)=><tr key={eq}><td style={{padding:"10px 8px",color:T.cw70,borderBottom:`1px solid ${T.border}`,background:ri%2?"rgba(255,255,255,0.02)":"transparent"}}>{fmt(eq)}</td>{sR.map(rev=>{const roi=cSR(rev,eq);const bg=roi<=-1?T.redDim:roi<-.5?"rgba(200,64,64,0.06)":roi<0?T.amberDim:roi<.5?T.greenDim:"rgba(77,175,120,0.18)";const c=roi<=-.5?T.red:roi<0?T.amber:T.green;return<td key={rev} style={{padding:"10px 8px",textAlign:"center",background:bg,color:c,borderBottom:`1px solid ${T.border}`,fontWeight:eq===d.eq?700:500,outline:eq===d.eq?`1px solid ${T.goldDim}`:undefined}}>{roi<=-1?"Loss":pct(roi)}</td>;})}</tr>)}</tbody></table></div></Glass>
          <Glass><SL sub="Gold line = budget.">Breakeven</SL><div style={{width:"100%",height:220,marginTop:"14px"}}><ResponsiveContainer><BarChart data={d.be} layout="vertical" margin={{left:120,right:30}}><XAxis type="number" tick={{fill:T.cw70,fontSize:11,fontFamily:F.mono}} tickFormatter={fmt}/><YAxis type="category" dataKey="strategy" tick={{fill:T.cw70,fontSize:12,fontFamily:F.mono}} width={115}/><Tooltip content={<CTT/>}/><ReferenceLine x={d.actualBudget} stroke={T.goldPrimary} strokeDasharray="5 5" strokeOpacity={0.5}/><Bar dataKey="breakeven" radius={[0,6,6,0]} barSize={20}>{d.be.map((b,i)=><Cell key={i} fill={b.breakeven<d.actualBudget*1.5?T.green:b.breakeven<d.actualBudget*4?T.amber:T.red} opacity={.6}/>)}</Bar></BarChart></ResponsiveContainer></div></Glass>
        </div>}

        {/* ═══ RISK ═══ */}
        {tid==="risk"&&wizardDone&&<div style={{display:"flex",flexDirection:"column",gap:"28px"}}>
          <Glass><SL>Risk Matrix</SL><div style={{width:"100%",height:360,marginTop:"14px"}}><ResponsiveContainer><ScatterChart margin={{left:10,right:30,top:10,bottom:10}}><CartesianGrid horizontal vertical={false} stroke="rgba(255,255,255,0.03)"/><XAxis type="number" dataKey="prob" name="Probability" unit="%" domain={[0,55]} tick={{fill:T.cw70,fontSize:11,fontFamily:F.mono}} label={{value:"Probability →",position:"bottom",fill:T.cw50,fontSize:10}}/><YAxis type="number" dataKey="impact" name="Impact" domain={[1,5.5]} tick={{fill:T.cw70,fontSize:11,fontFamily:F.mono}} label={{value:"Impact →",angle:-90,position:"left",fill:T.cw50,fontSize:10}}/><Tooltip content={({active,payload})=>{if(!active||!payload?.length)return null;const r=payload[0].payload;return<div style={{background:"#111",backdropFilter:"blur(12px)",border:`1px solid ${T.border}`,borderRadius:"10px",padding:"10px 14px",fontFamily:F.mono,fontSize:"12px",boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}><div style={{color:T.w92,fontWeight:700}}>{r.name}</div><div style={{color:T.cw70}}>{r.prob}% · {r.impact}/5 · {r.score.toFixed(2)}</div></div>;}}/><Scatter data={d.risks} shape={({cx,cy,payload})=>{const c=payload.score>=.8?T.red:payload.score>=.4?T.amber:T.green;const idx=[...d.risks].sort((a,b)=>b.score-a.score).indexOf(payload)+1;return<g><circle cx={cx} cy={cy} r={Math.max(10,payload.score*9)} fill={c} opacity={0.3} stroke={c} strokeWidth={1}/><text x={cx} y={cy+4} textAnchor="middle" fill="#fff" fontSize="9" fontFamily={F.mono}>{idx}</text></g>;}}/>
          </ScatterChart></ResponsiveContainer></div></Glass>
          <Glass><SL>Risk Register</SL>{[...d.risks].sort((a,b)=>b.score-a.score).map((r,i)=>{const c=r.score>=.8?T.red:r.score>=.4?T.amber:T.green;const bg=r.score>=.8?T.redDim:r.score>=.4?T.amberDim:T.greenDim;const ex=expandedRisk===i;return<div key={i} onClick={()=>setExpandedRisk(ex?null:i)} style={{cursor:"pointer",padding:"12px 0",borderBottom:`1px solid ${T.border}`}}><div style={{display:"flex",alignItems:"center",gap:"12px"}}><div style={{width:"28px",height:"28px",borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.mono,fontSize:"12px",color:c,fontWeight:700,flexShrink:0}}>{i+1}</div><div style={{flex:1}}><div style={{fontFamily:F.body,fontSize:"14px",color:T.w92,fontWeight:600}}>{r.name}</div><div style={{fontFamily:F.mono,fontSize:"11px",color:T.cw50}}>{r.cat} · {r.prob}% · {r.impact}/5</div></div><span style={{fontFamily:F.mono,fontSize:"12px",color:T.cw50}}>{ex?"▾":"▸"}</span></div>{ex&&<div style={{marginTop:"10px",marginLeft:"40px",fontFamily:F.body,fontSize:"13px",color:T.w65,lineHeight:1.6}}>{r.mit}</div>}</div>;})}</Glass>
        </div>}

        {/* ═══ GLOSSARY ═══ */}
        {tid==="glossary"&&<div style={{display:"flex",flexDirection:"column",gap:"28px"}}>
          <Glass><SL sub="Every financial term in this model.">Glossary</SL>
            {GLOSSARY.map((g,i)=><div key={i} style={{padding:"16px 0",borderBottom:i<GLOSSARY.length-1?`1px solid ${T.border}`:"none"}}>
              <div style={{fontFamily:F.mono,fontSize:"13px",color:T.goldPrimary,fontWeight:700}}>{g.term}</div>
              <div style={{fontFamily:F.body,fontSize:"14px",color:T.w75,lineHeight:1.6,marginTop:"6px"}}>{g.def}</div>
            </div>)}
          </Glass>
        </div>}

        <div style={{marginTop:"48px",paddingTop:"18px",borderTop:`1px solid ${T.border}`,textAlign:"center",fontFamily:F.mono,fontSize:"11px",color:T.cw50}}>Illustrative model only. Not an offer of securities. Consult entertainment attorneys before raising capital.</div>
        </div>
      </main>
    </div>
  );
}
