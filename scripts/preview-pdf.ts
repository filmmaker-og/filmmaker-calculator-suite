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
    revenue: 3000000,
    budget: 1500000,
    credits: 500000,
    equity: 500000,
    debt: 800000,
    seniorDebtRate: 12,
    mezzanineDebt: 200000,
    mezzanineRate: 18,
    salesFee: 10,
    salesExp: 75000,
    deferments: 50000,
    premium: 20,
    profitSplit: 50,
  },
  result: {
    offTopTotal: 570000,
    investor: 324000,
    producer: 324000,
    multiple: 1.43,
    recoupPct: 100,
    profitPool: 648000,
    cam: 30000,
    salesFee: 300000,
    guilds: 165000,
    marketing: 75000,
    seniorDebtHurdle: 896000,
    mezzDebtHurdle: 236000,
    equityHurdle: 600000,
    totalHurdle: 1782000,
    deferments: 50000,
    credits: 500000,
    creditsApplied: 500000,
    recouped: 1782000,
    debtTotal: 1132000,
    profitSplit: 50,
  },
  tiers: [
    { name: "Senior Debt", rate: "PRINCIPAL + 12%", amount: 896000, remaining: 0 },
    { name: "Mezzanine", rate: "PRINCIPAL + 18%", amount: 236000, remaining: 0 },
    { name: "Equity + Premium", rate: "PRINCIPAL + 20%", amount: 600000, remaining: 0 },
    { name: "Deferments", rate: "DEFERRED COMP", amount: 50000, remaining: 0 },
  ],
  computed: {
    erosionPct: 19.0,
    cashBasis: 1500000,
    investorROI: 43.0,
    breakEvenRevenue: 2500000,
  },
  generatedAt: new Date().toISOString(),
};

const html = generatePdfHtml(demoData as any);
fs.writeFileSync('/home/user/workspace/pdf-preview.html', html);
console.log('HTML written to /home/user/workspace/pdf-preview.html');
console.log('Pages:', (html.match(/class="page"/g) || []).length);
