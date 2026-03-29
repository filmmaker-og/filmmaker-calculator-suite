import { generatePdfHtml } from '../api/_pdf-template';
import * as fs from 'fs';

const demoData = {
  project: {
    title: "Untitled Thriller",
    genre: "Thriller",
    logline: "A retired detective returns to her hometown to investigate a cold case that mirrors her own family's darkest secret.",
    cast: "TBD",
    director: "Alex Rivera",
    writers: "Sam Torres",
    producers: "Jane Smith",
    company: "Demo Productions",
    location: "Louisiana",
  },
  inputs: {
    revenue: 2500000,
    budget: 1000000,
    credits: 0,
    equity: 500000,
    debt: 500000,
    seniorDebtRate: 10,
    mezzanineDebt: 0,
    mezzanineRate: 0,
    salesFee: 15,
    salesExp: 75000,
    deferments: 0,
    premium: 20,
    profitSplit: 50,
  },
  result: {
    offTopTotal: 475000,
    investor: 1037500,
    producer: 437500,
    multiple: 2.075,
    recoupPct: 100,
    profitPool: 875000,
    cam: 25000,
    salesFee: 375000,
    guilds: 0,
    marketing: 75000,
    seniorDebtHurdle: 550000,
    mezzDebtHurdle: 0,
    equityHurdle: 600000,
    totalHurdle: 1625000,
    deferments: 0,
    credits: 0,
    creditsApplied: 0,
    recouped: 1625000,
    debtTotal: 550000,
    profitSplit: 50,
  },
  tiers: [
    { name: "Senior Debt", rate: "Phase 1 — funded", amount: 550000, remaining: 0 },
    { name: "Equity + Premium", rate: "Phase 2 — funded", amount: 600000, remaining: 0 },
  ],
  computed: {
    erosionPct: 19.0,
    cashBasis: 1000000,
    investorROI: 107.5,
    breakEvenRevenue: 2006173,
  },
  generatedAt: new Date().toISOString(),
};

const html = generatePdfHtml(demoData as any);
fs.writeFileSync('/home/user/workspace/pdf-preview.html', html);
console.log('HTML written to /home/user/workspace/pdf-preview.html');
console.log('Pages:', (html.match(/class="page"/g) || []).length);
