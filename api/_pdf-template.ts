// api/_pdf-template.ts
// Generates the HTML string for the PDF snapshot
// BRAND_SYSTEM v3.1 — gold + black + warm white, zero purple
// Narrative document: 3 long-form prose sections + 4 bridge lines + closer

interface SnapshotData {
  project: {
    title: string;
    genre: string;
    logline: string;
    cast: string;
    director: string;
    writers: string;
    producers: string;
    company: string;
    location: string;
  };
  inputs: {
    revenue: number;
    budget: number;
    credits: number;
    equity: number;
    debt: number;
    seniorDebtRate: number;
    mezzanineDebt: number;
    mezzanineRate: number;
    salesFee: number;
    salesExp: number;
    deferments: number;
    premium: number;
    profitSplit: number;
  };
  result: {
    offTopTotal: number;
    investor: number;
    producer: number;
    multiple: number;
    recoupPct: number;
    profitPool: number;
    cam: number;
    salesFee: number;
    guilds: number;
    marketing: number;
    seniorDebtHurdle: number;
    mezzDebtHurdle: number;
    equityHurdle: number;
    totalHurdle: number;
    deferments: number;
    credits: number;
    creditsApplied: number;
    recouped: number;
    debtTotal: number;
    profitSplit: number;
  };
  tiers: Array<{
    name: string;
    rate: string;
    amount: number;
    remaining: number;
  }>;
  computed: {
    erosionPct: number;
    cashBasis: number;
    investorROI: number;
    breakEvenRevenue: number;
  };
  generatedAt: string;
}

function formatCurrency(n: number): string {
  if (!isFinite(n) || isNaN(n)) return 'N/A';
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n).toLocaleString('en-US')}`;
  return `$${n.toFixed(0)}`;
}

function formatFullCurrency(n: number): string {
  if (!isFinite(n) || isNaN(n)) return 'N/A';
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function getReturnColor(pct: number): string {
  if (pct >= 100) return '#3CB371';
  if (pct >= 50) return '#F0A830';
  return 'rgba(220,38,38,0.85)';
}

function getMultipleColor(m: number): string {
  if (!isFinite(m) || isNaN(m)) return 'rgba(220,38,38,0.85)';
  if (m >= 1.0) return '#3CB371';
  if (m >= 0.5) return '#F0A830';
  return 'rgba(220,38,38,0.85)';
}

export function generatePdfHtml(data: SnapshotData): string {
  const { project, inputs, result, tiers, computed } = data;

  const date = new Date(data.generatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const returnColor = getReturnColor(result.recoupPct);
  const multipleColor = getMultipleColor(result.multiple);
  const revenue = inputs.revenue;
  const cashBasis = computed.cashBasis;
  const breakeven = computed.breakEvenRevenue;
  const safeMultiple = isFinite(result.multiple) && !isNaN(result.multiple) ? result.multiple : 0;
  const netProfit = result.producer;
  const netProfitColor = netProfit > 0 ? '#3CB371' : 'rgba(220,38,38,0.85)';
  const erosionPct = computed.erosionPct;
  const remainPct = 100 - erosionPct;
  const isBreakevenValid = isFinite(breakeven) && breakeven > 0;

  // ── SVG Donut segments ──
  const donutSegments: { label: string; amount: number; color: string }[] = [];
  if (result.cam > 0) donutSegments.push({ label: 'CAM Fee', amount: result.cam, color: 'rgba(220,38,38,0.50)' });
  if (result.salesFee > 0) donutSegments.push({ label: 'Sales Commission', amount: result.salesFee, color: 'rgba(220,38,38,0.65)' });
  if (result.marketing > 0) donutSegments.push({ label: 'Sales Expenses', amount: result.marketing, color: 'rgba(220,38,38,0.80)' });
  if (result.guilds > 0) donutSegments.push({ label: 'Guild Reserves', amount: result.guilds, color: 'rgba(220,38,38,0.35)' });
  if (result.seniorDebtHurdle > 0) donutSegments.push({ label: 'Senior Debt', amount: result.seniorDebtHurdle, color: 'rgba(255,255,255,0.22)' });
  if (result.mezzDebtHurdle > 0) donutSegments.push({ label: 'Mezzanine Debt', amount: result.mezzDebtHurdle, color: 'rgba(240,168,48,0.50)' });
  if (result.equityHurdle > 0) donutSegments.push({ label: 'Equity + Premium', amount: result.equityHurdle, color: 'rgba(212,175,55,0.55)' });
  if (inputs.deferments > 0) donutSegments.push({ label: 'Deferments', amount: inputs.deferments, color: 'rgba(255,255,255,0.12)' });
  if (result.profitPool > 0) donutSegments.push({ label: "What's Left", amount: result.profitPool, color: 'rgba(60,179,113,0.60)' });

  const segmentTotal = donutSegments.reduce((s, seg) => s + seg.amount, 0);

  // SVG donut circles
  const r = 70;
  const circumference = 2 * Math.PI * r;
  let cumulativeAngle = 0;
  const donutCircles = revenue > 0 ? donutSegments.map((seg) => {
    const pct = segmentTotal > 0 ? (seg.amount / revenue) * 100 : 0;
    const segLength = (pct / 100) * circumference;
    if (segLength <= 0) return '';
    const rotation = (cumulativeAngle / 360) * 360 - 90;
    cumulativeAngle += (pct / 100) * 360;
    return `<circle cx="100" cy="100" r="${r}" fill="none" stroke="${seg.color}" stroke-width="25" stroke-dasharray="${segLength.toFixed(2)} ${(circumference - segLength).toFixed(2)}" stroke-dashoffset="0" transform="rotate(${rotation.toFixed(2)} 100 100)"/>`;
  }).join('\n            ') : '';

  const showShortfall = result.profitPool <= 0;
  const donutCenterLabel = showShortfall ? 'SHORTFALL' : "WHAT'S LEFT";
  const donutCenterValue = showShortfall
    ? `&minus;${formatCurrency(Math.abs(result.profitPool))}`
    : formatCurrency(result.profitPool);
  const donutCenterColor = showShortfall ? 'rgba(220,38,38,0.85)' : '#3CB371';
  const donutCenterLabelColor = showShortfall ? 'rgba(220,38,38,0.70)' : 'rgba(255,255,255,0.45)';

  // Per-dollar breakdown rows
  const perDollarRows = revenue > 0 ? donutSegments.filter(s => s.amount > 0).map(seg => {
    const perDollar = seg.amount / revenue;
    const pct = (seg.amount / revenue) * 100;
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
              <span style="display:flex;align-items:center;gap:8px;font-family:'Inter',sans-serif;font-size:10px;color:rgba(250,248,244,0.70);">
                <span style="width:8px;height:8px;border-radius:50%;background:${seg.color};flex-shrink:0;display:inline-block;"></span>
                ${seg.label}
              </span>
              <span style="display:flex;align-items:center;gap:8px;">
                <span style="font-family:'Roboto Mono',monospace;font-size:10px;color:${seg.color};">$${perDollar.toFixed(2)}</span>
                <span style="font-family:'Roboto Mono',monospace;font-size:9px;color:rgba(255,255,255,0.40);">(${pct.toFixed(0)}%)</span>
              </span>
            </div>`;
  }).join('') : '<div style="font-family:\'Inter\',sans-serif;font-size:11px;color:rgba(255,255,255,0.35);padding:12px 0;">No revenue to allocate.</div>';

  // ── Tier cards HTML ──
  const tierCardsHtml = tiers
    .map((tier, i) => {
      const isProfit = tier.remaining === 0 && i === tiers.length - 1;
      const amountColor = isProfit ? '#3CB371' : 'rgba(250,248,244,0.92)';
      const borderColor = isProfit
        ? 'rgba(60,179,113,0.25)'
        : 'rgba(220,38,38,0.18)';

      return `${
        i > 0
          ? `<div style="display:flex;flex-direction:column;align-items:center;margin:-2px 0;">
        <div style="width:2px;height:8px;background:${
          isProfit ? 'rgba(60,179,113,0.3)' : 'rgba(220,38,38,0.3)'
        };border-radius:1px;"></div>
        <div style="width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid ${
          isProfit ? 'rgba(60,179,113,0.3)' : 'rgba(220,38,38,0.3)'
        };margin-top:-1px;"></div>
      </div>`
          : ''
      }
    <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:8px;background:#232326;border:1px solid ${borderColor};border-top:1px solid rgba(255,255,255,0.04);position:relative;">
      <div style="width:28px;height:28px;border-radius:50%;background:rgba(212,175,55,0.12);border:1px solid rgba(212,175,55,0.30);display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:13px;color:#fff;flex-shrink:0;">
        ${String(i + 1).padStart(2, '0')}
      </div>
      <div style="flex:1;">
        <div style="font-family:'Inter',sans-serif;font-size:11px;font-weight:500;color:rgba(250,248,244,0.88);">${tier.name}</div>
        <div style="font-family:'Roboto Mono',monospace;font-size:9px;color:rgba(212,175,55,0.55);margin-top:2px;">${tier.rate}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-family:'Roboto Mono',monospace;font-size:12px;font-weight:500;color:${amountColor};">${formatFullCurrency(tier.amount)}</div>
        <div style="font-family:'Roboto Mono',monospace;font-size:9px;color:rgba(255,255,255,0.35);margin-top:2px;">&rarr; ${formatFullCurrency(tier.remaining)}</div>
      </div>
    </div>`;
    })
    .join('');

  // ── Margin of Safety ──
  const margin = revenue - breakeven;
  const isAbove = margin >= 0;
  let marginBarHtml: string;
  if (!isBreakevenValid || revenue <= 0) {
    marginBarHtml = `<div style="padding:12px 16px;border-radius:8px;border:1px solid rgba(212,175,55,0.12);border-top:1px solid rgba(255,255,255,0.04);background:linear-gradient(180deg,rgba(212,175,55,0.02),#232326);">
      <div style="font-family:'Roboto Mono',monospace;font-size:11px;color:rgba(212,175,55,0.55);">MARGIN OF SAFETY: N/A</div>
    </div>`;
  } else {
    const maxVal = Math.max(revenue, breakeven);
    const revPct = (revenue / maxVal) * 100;
    const bePct = (breakeven / maxVal) * 100;
    const labelText = isAbove
      ? `MARGIN OF SAFETY: ${formatCurrency(Math.abs(margin))} above break-even`
      : `SHORTFALL: ${formatCurrency(Math.abs(margin))} below break-even`;
    const labelColor = isAbove ? '#3CB371' : 'rgba(220,38,38,0.85)';

    marginBarHtml = `<div style="padding:12px 16px;border-radius:8px;border:1px solid rgba(212,175,55,0.12);border-top:1px solid rgba(255,255,255,0.04);background:linear-gradient(180deg,rgba(212,175,55,0.02),#232326);">
      <div style="font-family:'Roboto Mono',monospace;font-size:10px;color:${labelColor};margin-bottom:8px;">${labelText}</div>
      <div style="position:relative;height:20px;background:rgba(255,255,255,0.04);border-radius:4px;overflow:hidden;">
        ${isAbove
          ? `<div style="position:absolute;left:0;top:0;bottom:0;width:${bePct.toFixed(1)}%;background:rgba(60,179,113,0.30);border-radius:4px 0 0 4px;"></div>
             <div style="position:absolute;left:${bePct.toFixed(1)}%;top:0;bottom:0;width:${(revPct - bePct).toFixed(1)}%;background:rgba(60,179,113,0.50);border-radius:0 4px 4px 0;"></div>`
          : `<div style="position:absolute;left:0;top:0;bottom:0;width:${revPct.toFixed(1)}%;background:rgba(60,179,113,0.30);border-radius:4px 0 0 4px;"></div>
             <div style="position:absolute;left:${revPct.toFixed(1)}%;top:0;bottom:0;width:${(bePct - revPct).toFixed(1)}%;background:rgba(220,38,38,0.20);border-radius:0 4px 4px 0;"></div>`
        }
        <div style="position:absolute;left:${bePct.toFixed(1)}%;top:-2px;bottom:-2px;width:2px;background:#D4AF37;box-shadow:0 0 6px rgba(212,175,55,0.40);transform:translateX(-1px);"></div>
      </div>
    </div>`;
  }

  // ── Capital sources ──
  const capitalSources: { label: string; amount: number; pct: string; detail: string }[] = [];
  if (inputs.debt > 0) capitalSources.push({ label: 'Senior Debt', amount: inputs.debt, pct: `${inputs.budget > 0 ? Math.round((inputs.debt / inputs.budget) * 100) : 0}%`, detail: `First position · ${inputs.seniorDebtRate}%` });
  if (inputs.mezzanineDebt > 0) capitalSources.push({ label: 'Mezzanine / Gap', amount: inputs.mezzanineDebt, pct: `${inputs.budget > 0 ? Math.round((inputs.mezzanineDebt / inputs.budget) * 100) : 0}%`, detail: `Second position · ${inputs.mezzanineRate}%` });
  if (inputs.equity > 0) capitalSources.push({ label: 'Equity', amount: inputs.equity, pct: `${inputs.budget > 0 ? Math.round((inputs.equity / inputs.budget) * 100) : 0}%`, detail: inputs.premium > 0 ? `${inputs.premium}% preferred return` : 'Pari passu' });
  if (inputs.credits > 0) capitalSources.push({ label: 'Tax Credits', amount: inputs.credits, pct: `${inputs.budget > 0 ? Math.round((inputs.credits / inputs.budget) * 100) : 0}%`, detail: 'Non-dilutive' });
  if (inputs.deferments > 0) capitalSources.push({ label: 'Deferrals', amount: inputs.deferments, pct: `${inputs.budget > 0 ? Math.round((inputs.deferments / inputs.budget) * 100) : 0}%`, detail: 'Subordinate to all capital' });

  const capitalRowsHtml = capitalSources.map((s, i) =>
    `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 16px;${i > 0 ? 'border-top:1px solid rgba(255,255,255,0.04);' : ''}">
      <div>
        <div style="font-family:'Inter',sans-serif;font-size:11px;font-weight:500;color:rgba(250,248,244,0.88);">${s.label}</div>
        <div style="font-family:'Roboto Mono',monospace;font-size:9px;color:rgba(255,255,255,0.40);margin-top:2px;">${s.detail}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-family:'Roboto Mono',monospace;font-size:12px;font-weight:500;color:rgba(250,248,244,0.92);">${formatFullCurrency(s.amount)}</div>
        <div style="font-family:'Roboto Mono',monospace;font-size:9px;color:rgba(255,255,255,0.40);margin-top:2px;">${s.pct} of budget</div>
      </div>
    </div>`
  ).join('');

  // ── Scenario stress test ──
  // Separate variable off-tops (scale with revenue) from fixed off-tops (don't scale)
  const variableOffTops = result.cam + result.salesFee + result.guilds; // CAM%, sales%, guild%
  const fixedOffTops = result.marketing; // marketing/expense cap is fixed
  const variableOffTopRate = revenue > 0 ? variableOffTops / revenue : 0;
  const totalHurdle = result.seniorDebtHurdle + result.mezzDebtHurdle + result.equityHurdle + inputs.deferments - result.creditsApplied;

  const scenarioData = [
    { label: formatCurrency(revenue), sub: 'modeled', haircut: '0%', price: revenue },
    { label: formatCurrency(revenue * 0.85), sub: '−15%', haircut: '15%', price: revenue * 0.85 },
    { label: formatCurrency(revenue * 0.70), sub: '−30%', haircut: '30%', price: revenue * 0.70 },
    { label: formatCurrency(revenue * 0.50), sub: '−50%', haircut: '50%', price: revenue * 0.50 },
  ].map(s => {
    const newVariableOffTops = s.price * variableOffTopRate;
    const newOffTops = newVariableOffTops + fixedOffTops;
    const newDistributable = Math.max(0, s.price - newOffTops);
    const returnPct = totalHurdle > 0 ? Math.min(100, (newDistributable / totalHurdle) * 100) : 0;
    const multiple = cashBasis > 0 ? newDistributable / cashBasis : 0;
    const color = getReturnColor(returnPct);
    return { ...s, returnPct, multiple, color };
  });

  const scenarioRowsHtml = scenarioData.map((s, i) =>
    `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 16px;${i > 0 ? 'border-top:1px solid rgba(255,255,255,0.04);' : ''}${i === 0 ? 'border-left:3px solid rgba(212,175,55,0.40);' : ''}">
      <div>
        <span style="font-family:'Roboto Mono',monospace;font-size:12px;color:rgba(250,248,244,0.88);">${s.label}</span>
        <span style="font-family:'Roboto Mono',monospace;font-size:9px;color:rgba(255,255,255,0.40);margin-left:6px;">${s.sub}</span>
      </div>
      <div style="display:flex;gap:16px;">
        <span style="font-family:'Roboto Mono',monospace;font-size:12px;font-weight:500;color:${s.color};min-width:50px;text-align:right;">${Math.round(s.returnPct)}%</span>
        <span style="font-family:'Roboto Mono',monospace;font-size:12px;font-weight:500;color:${s.color};min-width:50px;text-align:right;">${s.multiple.toFixed(1)}&times;</span>
      </div>
    </div>`
  ).join('');

  // ═══════════════════════════════════════════════════════════════
  // PROSE GENERATION — all text derived from deal data, no filler
  // ═══════════════════════════════════════════════════════════════

  // ── Empty state guard ──
  const isEmptyDeal = inputs.revenue <= 0 && inputs.budget <= 0;

  // ── Capital source names (for prose) ──
  const capitalSourceNames: string[] = [];
  if (inputs.equity > 0) capitalSourceNames.push('equity');
  if (inputs.debt > 0) capitalSourceNames.push('senior debt');
  if (inputs.mezzanineDebt > 0) capitalSourceNames.push('mezzanine financing');
  if (inputs.credits > 0) capitalSourceNames.push('tax credits');
  if (inputs.deferments > 0) capitalSourceNames.push('deferrals');
  const sourcesList = capitalSourceNames.join(', ').replace(/, ([^,]*)$/, ' and $1');

  // ── EXECUTIVE SUMMARY (Page 1) — 4-6 sentences ──
  const execSummaryParts: string[] = [];

  if (isEmptyDeal) {
    execSummaryParts.push('No deal data has been entered. Complete the calculator inputs to generate an executive summary.');
  } else {
  // Sentence 1: What this is
  execSummaryParts.push(`${project.title} is a ${formatCurrency(inputs.budget)} independent ${project.genre ? project.genre.toLowerCase() + ' ' : ''}feature${sourcesList ? ' financed through ' + sourcesList : ''}.`);

  // Sentence 2: Return outcome
  if (result.recoupPct >= 100) {
    execSummaryParts.push(`At the modeled acquisition price of ${formatCurrency(revenue)}, all capital tiers are fully funded with a ${safeMultiple.toFixed(1)}x return to investors.`);
  } else if (result.recoupPct > 0) {
    execSummaryParts.push(`At the modeled acquisition price of ${formatCurrency(revenue)}, investors recoup ${result.recoupPct.toFixed(0)}% of their capital with a ${safeMultiple.toFixed(1)}x return.`);
  } else {
    execSummaryParts.push(`At the modeled acquisition price of ${formatCurrency(revenue)}, net distributable revenue does not cover capital obligations.`);
  }

  // Sentence 3: Erosion
  execSummaryParts.push(`Off-the-top deductions\u2009\u2014\u2009distribution fees, sales expenses, guild reserves, and collection costs\u2009\u2014\u2009consume ${erosionPct.toFixed(0)}% of gross revenue before the waterfall begins.`);

  // Sentence 4: Margin of safety or shortfall
  if (isBreakevenValid && revenue > 0) {
    if (revenue > breakeven) {
      const marginDollar = revenue - breakeven;
      const marginPctVal = Math.round((marginDollar / revenue) * 100);
      execSummaryParts.push(`The deal carries a ${formatCurrency(marginDollar)} margin of safety above break-even, meaning the acquisition price could drop ${marginPctVal}% before investor capital is at risk.`);
    } else {
      const shortfall = breakeven - revenue;
      execSummaryParts.push(`Revenue falls ${formatCurrency(shortfall)} short of the break-even point at this price.`);
    }
  }

  // Sentence 5: Waterfall priority
  if (inputs.debt > 0 && inputs.mezzanineDebt > 0 && inputs.equity > 0) {
    execSummaryParts.push(`The waterfall prioritizes senior debt repayment, followed by mezzanine financing, then equity recoupment${inputs.premium > 0 ? ' at a ' + inputs.premium + '% preferred return' : ''}, with remaining profits split ${inputs.profitSplit}/${100 - inputs.profitSplit} between investors and producers.`);
  } else if (inputs.debt > 0 && inputs.equity > 0) {
    execSummaryParts.push(`The waterfall prioritizes senior debt repayment, followed by equity recoupment${inputs.premium > 0 ? ' at a ' + inputs.premium + '% preferred return' : ''}, with remaining profits split ${inputs.profitSplit}/${100 - inputs.profitSplit} between investors and producers.`);
  } else if (inputs.equity > 0) {
    execSummaryParts.push(`After off-the-top deductions, equity investors recoup their capital${inputs.premium > 0 ? ' plus a ' + inputs.premium + '% premium' : ''}, with remaining profits split ${inputs.profitSplit}/${100 - inputs.profitSplit} between investors and producers.`);
  }

  // Sentence 6: Net to producer
  if (netProfit > 0) {
    execSummaryParts.push(`The producer\u2019s net backend is ${formatCurrency(netProfit)}.`);
  }
  } // end isEmptyDeal else

  const execSummaryText = execSummaryParts.join(' ');

  // ── WATERFALL NARRATIVE (Page 3) — 3-4 sentences ──
  const waterfallNarrativeParts: string[] = [];

  waterfallNarrativeParts.push(`Revenue flows through ${tiers.length} tiers before reaching the profit split.`);

  // Find the largest recoupment obligation
  const obligationTiers = tiers.filter((_, i) => i < tiers.length - 1 && tiers[i].amount > 0);
  if (obligationTiers.length > 0) {
    const largest = obligationTiers.reduce((max, t) => t.amount > max.amount ? t : max, obligationTiers[0]);
    if (largest.amount > 0) {
      const largePct = revenue > 0 ? Math.round((largest.amount / revenue) * 100) : 0;
      waterfallNarrativeParts.push(`The largest single obligation is ${largest.name.toLowerCase()} at ${formatCurrency(largest.amount)}${largePct > 0 ? ' (' + largePct + '% of gross)' : ''}.`);
    }
  }

  if (result.profitPool > 0) {
    waterfallNarrativeParts.push(`After all obligations are met, ${formatCurrency(result.profitPool)} remains in the profit pool\u2009\u2014\u2009split ${inputs.profitSplit}/${100 - inputs.profitSplit} between investors and producers.`);
    if (netProfit > 0) {
      waterfallNarrativeParts.push(`The filmmaker\u2019s net backend is ${formatCurrency(netProfit)}.`);
    }
  } else {
    waterfallNarrativeParts.push(`At this price, revenue is exhausted before all capital tiers are satisfied. No profit pool is generated.`);
  }

  const waterfallNarrativeText = waterfallNarrativeParts.join(' ');

  // ── MARGIN PROSE (Page 3) ──
  let marginProseText = '';
  if (isBreakevenValid && revenue > 0) {
    if (revenue > breakeven) {
      const marginDollar = revenue - breakeven;
      const marginPctVal = Math.round((marginDollar / revenue) * 100);
      marginProseText = `At the modeled price, revenue exceeds the break-even threshold by ${formatCurrency(marginDollar)}\u2009\u2014\u2009a ${marginPctVal}% margin of safety. The acquisition price could drop ${marginPctVal}% before investor capital is at risk.`;
    } else {
      const shortfall = breakeven - revenue;
      marginProseText = `Revenue falls ${formatCurrency(shortfall)} short of the break-even point. At this price, investor recoupment is incomplete.`;
    }
  }

  // ── SCENARIO INTERPRETATION (Page 4) — 2-3 sentences ──
  const scenarioInterpParts: string[] = [];

  const modeledScenario = scenarioData[0];
  const mild = scenarioData[1];
  const moderate = scenarioData[2];
  const severe = scenarioData[3];

  if (modeledScenario.returnPct >= 100) {
    scenarioInterpParts.push(`At the modeled price, the deal returns ${modeledScenario.multiple.toFixed(1)}x.`);
    if (mild.returnPct >= 100) {
      scenarioInterpParts.push(`A 15% haircut still delivers full recoupment at ${mild.multiple.toFixed(1)}x.`);
    } else if (mild.returnPct >= 50) {
      scenarioInterpParts.push(`A 15% haircut reduces the return to ${mild.multiple.toFixed(1)}x with ${Math.round(mild.returnPct)}% recoupment.`);
    }
    if (moderate.returnPct < 100) {
      scenarioInterpParts.push(`At a 30% discount, investor return drops to ${moderate.multiple.toFixed(1)}x\u2009\u2014\u2009${Math.round(moderate.returnPct) >= 50 ? 'partial recoupment' : 'significant capital loss'}.`);
    }
    if (severe.returnPct < 50) {
      scenarioInterpParts.push(`The structure does not survive a 50% reduction.`);
    }
  } else {
    scenarioInterpParts.push(`At the modeled price, the deal returns ${modeledScenario.multiple.toFixed(1)}x with ${Math.round(modeledScenario.returnPct)}% recoupment.`);
    scenarioInterpParts.push(`Any reduction in acquisition price further erodes investor returns.`);
  }

  const scenarioInterpText = scenarioInterpParts.join(' ');

  // ── Team grid rows ──
  const teamFields: { role: string; name: string }[] = [];
  if (project.director) teamFields.push({ role: 'Director', name: project.director });
  if (project.writers) teamFields.push({ role: 'Writer', name: project.writers });
  if (project.producers) teamFields.push({ role: 'Producers', name: project.producers });
  if (project.company) teamFields.push({ role: 'Production Co.', name: project.company });
  if (project.cast) teamFields.push({ role: 'Cast', name: project.cast });
  if (project.location) teamFields.push({ role: 'Location', name: project.location });

  const teamGridHtml = teamFields.length > 0 ? `
    <div style="display:grid;grid-template-columns:${teamFields.length <= 3 ? 'repeat(' + teamFields.length + ', 1fr)' : '1fr 1fr'};gap:1px;background:rgba(212,175,55,0.08);border-radius:6px;overflow:hidden;margin-bottom:16px;">
      ${teamFields.map(f => `<div style="background:#232326;padding:10px 14px;">
        <div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2px;color:rgba(212,175,55,0.40);text-transform:uppercase;margin-bottom:3px;">${f.role}</div>
        <div style="font-family:'Inter',sans-serif;font-size:11px;color:rgba(250,248,244,0.85);font-weight:500;line-height:1.3;">${f.name}</div>
      </div>`).join('')}
    </div>` : '';

  // ── Structure prose ──
  let structureProseText = '';
  if (capitalSources.length > 0) {
    const structParts = capitalSources.map(s => `${s.pct} ${s.label.toLowerCase()} (${formatFullCurrency(s.amount)})`);
    const structList = structParts.join(', ').replace(/, ([^,]*)$/, ' and $1');
    let positionSentence = '';
    if (inputs.debt > 0 && inputs.mezzanineDebt > 0) {
      positionSentence = ' The lender holds first position in the recoupment waterfall, followed by mezzanine debt, meaning equity investors do not see returns until all senior creditors are made whole.';
    } else if (inputs.debt > 0) {
      positionSentence = ' Senior debt holds first position in the recoupment waterfall, meaning equity investors do not see returns until the lender is made whole.';
    }
    structureProseText = `The production is financed with ${structList}.${positionSentence}`;
  }

  // ── Reusable HTML fragments ──
  const goldTopBar = '<div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent 5%,rgba(212,175,55,0.50) 30%,rgba(212,175,55,0.70) 50%,rgba(212,175,55,0.50) 70%,transparent 95%);z-index:10;"></div>';
  const watermarkHtml = '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-family:\'Bebas Neue\',sans-serif;font-size:80px;letter-spacing:12px;color:rgba(212,175,55,0.03);pointer-events:none;z-index:0;">FILMMAKER.OG</div>';
  const pageHeader = (pageNum: string) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:0 36px;margin-bottom:16px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:4px;color:rgba(212,175,55,0.50);">FILMMAKER.OG</div>
      <div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.30);text-transform:uppercase;">PAGE ${pageNum}</div>
    </div>`;
  const pageFooter = (pageNum: string) => `<div style="position:absolute;bottom:20px;left:36px;right:36px;display:flex;justify-content:space-between;align-items:center;">
      <div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:1.5px;color:rgba(212,175,55,0.35);">FILMMAKER.OG</div>
      <div style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(255,255,255,0.25);">filmmakerog.com</div>
      <div style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(255,255,255,0.20);">${pageNum} / 5</div>
    </div>`;

  // Bridge line helper
  const bridge = (text: string) => `<div style="padding:0 36px;margin-bottom:12px;position:relative;z-index:2;">
    <div style="font-family:'Inter',sans-serif;font-size:11px;color:rgba(250,248,244,0.60);font-style:italic;line-height:1.6;letter-spacing:0.01em;">${text}</div>
  </div>`;

  // Prose block helper
  const proseBlock = (text: string, marginBottom = '16px') => `<div style="padding:0 36px;margin-bottom:${marginBottom};position:relative;z-index:2;">
    <div style="font-family:'Inter',sans-serif;font-size:11px;color:rgba(250,248,244,0.65);line-height:1.7;font-weight:400;">${text}</div>
  </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&family=Roboto+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0C0C0E; font-family: 'Inter', sans-serif; width: 612px; }
    .page {
      width: 612px; min-height: 792px; background: #0C0C0E;
      position: relative; overflow: hidden;
      page-break-after: always; padding: 28px 0;
    }
    .page:last-child { page-break-after: avoid; }
    .gold-break {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent);
      margin: 14px 48px;
    }
  </style>
</head>
<body>

  <!-- PAGE 1: EXECUTIVE SUMMARY -->
  <div class="page" style="display:flex;flex-direction:column;padding:0;">
    ${goldTopBar}
    ${watermarkHtml}
    <div style="position:absolute;top:0;left:0;right:0;height:300px;background:radial-gradient(ellipse 80% 50% at 50% 10%,rgba(212,175,55,0.10) 0%,transparent 60%);pointer-events:none;"></div>
    <div style="position:absolute;bottom:0;left:0;right:0;height:250px;background:radial-gradient(ellipse 100% 70% at 50% 100%,rgba(212,175,55,0.06) 0%,transparent 60%);pointer-events:none;"></div>

    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 36px;position:relative;z-index:2;">
      <!-- Brand + Eyebrow -->
      <div style="font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:6px;color:rgba(212,175,55,0.60);text-align:center;margin-bottom:4px;">FILMMAKER.OG</div>
      <div style="font-family:'Roboto Mono',monospace;font-size:9px;letter-spacing:5px;color:rgba(212,175,55,0.40);text-transform:uppercase;text-align:center;margin-bottom:20px;">Waterfall Snapshot</div>

      <!-- Title -->
      <div style="font-family:'Bebas Neue',sans-serif;font-size:48px;color:#fff;line-height:0.95;letter-spacing:2px;text-align:center;margin-bottom:8px;">${project.title.toUpperCase()}</div>

      <!-- Genre + Logline -->
      ${project.genre ? `<div style="font-family:'Roboto Mono',monospace;font-size:10px;letter-spacing:2px;color:rgba(212,175,55,0.50);text-transform:uppercase;text-align:center;margin-bottom:8px;">${project.genre}</div>` : ''}
      ${project.logline ? `<div style="font-family:'Inter',sans-serif;font-size:11px;color:rgba(250,248,244,0.60);font-style:italic;font-weight:300;line-height:1.6;text-align:center;max-width:420px;margin:0 auto 16px;">${project.logline}</div>` : '<div style="margin-bottom:16px;"></div>'}

      <!-- Team Grid -->
      ${teamGridHtml}

      <!-- 2x2 Metric Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(212,175,55,0.10);border-radius:8px;overflow:hidden;margin-bottom:8px;">
        <div style="background:#1A1A1C;padding:14px;text-align:center;">
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2.5px;color:rgba(212,175,55,0.45);text-transform:uppercase;margin-bottom:5px;">Budget</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:20px;font-weight:500;color:rgba(250,248,244,0.92);">${formatCurrency(inputs.budget)}</div>
        </div>
        <div style="background:#1A1A1C;padding:14px;text-align:center;">
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2.5px;color:rgba(212,175,55,0.45);text-transform:uppercase;margin-bottom:5px;">Acquisition</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:20px;font-weight:500;color:rgba(250,248,244,0.92);">${formatCurrency(revenue)}</div>
        </div>
        <div style="background:#1A1A1C;padding:14px;text-align:center;">
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2.5px;color:rgba(212,175,55,0.45);text-transform:uppercase;margin-bottom:5px;">Net Profit</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:20px;font-weight:500;color:${netProfitColor};">${netProfit >= 0 ? formatCurrency(netProfit) : `&minus;${formatCurrency(Math.abs(netProfit))}`}</div>
        </div>
        <div style="background:#1A1A1C;padding:14px;text-align:center;">
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2.5px;color:rgba(212,175,55,0.45);text-transform:uppercase;margin-bottom:5px;">Multiple</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:20px;font-weight:500;color:${multipleColor};">${safeMultiple.toFixed(1)}&times;</div>
        </div>
      </div>

      <!-- Supplementary row -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:rgba(212,175,55,0.08);border-radius:8px;overflow:hidden;margin-bottom:16px;">
        <div style="background:#232326;padding:10px;text-align:center;">
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2px;color:rgba(212,175,55,0.40);text-transform:uppercase;margin-bottom:4px;">Break-Even</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:13px;font-weight:500;color:#F0A830;">${isBreakevenValid ? formatCurrency(breakeven) : 'N/A'}</div>
        </div>
        <div style="background:#232326;padding:10px;text-align:center;">
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2px;color:rgba(212,175,55,0.40);text-transform:uppercase;margin-bottom:4px;">Cash Basis</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:13px;font-weight:500;color:rgba(212,175,55,0.80);">${formatCurrency(cashBasis)}</div>
        </div>
        <div style="background:#232326;padding:10px;text-align:center;">
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2px;color:rgba(212,175,55,0.40);text-transform:uppercase;margin-bottom:4px;">Investor ROI</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:13px;font-weight:500;color:${returnColor};">${computed.investorROI.toFixed(1)}%</div>
        </div>
      </div>

      <!-- Executive Summary prose -->
      <div style="font-family:'Inter',sans-serif;font-size:11px;color:rgba(250,248,244,0.65);line-height:1.7;font-weight:400;">${execSummaryText}</div>
    </div>

    ${pageFooter('1')}
    <div style="position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(to right,transparent 0%,rgba(212,175,55,0.40) 50%,transparent 100%);z-index:10;"></div>
  </div>

  <!-- PAGE 2: REVENUE ALLOCATION -->
  <div class="page">
    ${goldTopBar}
    ${watermarkHtml}
    ${pageHeader('02')}

    <div style="padding:0 36px;margin-bottom:4px;position:relative;z-index:2;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:rgba(250,248,244,0.92);letter-spacing:1px;margin-bottom:4px;">WHERE YOUR DOLLAR GOES</div>
    </div>

    ${bridge('Every dollar of revenue passes through multiple gates before it reaches the filmmaker.')}

    <!-- SVG Donut -->
    <div style="padding:0 36px;position:relative;z-index:2;display:flex;justify-content:center;margin-bottom:16px;">
      <div style="position:relative;width:200px;height:200px;">
        <svg viewBox="0 0 200 200" width="200" height="200">
          <circle cx="100" cy="100" r="${r}" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="25"/>
          ${donutCircles}
        </svg>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;">
          <div style="font-family:'Roboto Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${donutCenterLabelColor};margin-bottom:3px;">${donutCenterLabel}</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:16px;font-weight:500;color:${donutCenterColor};">${donutCenterValue}</div>
        </div>
      </div>
    </div>

    <!-- Per-Dollar Breakdown -->
    <div style="padding:0 36px;position:relative;z-index:2;margin-bottom:16px;">
      <div style="border-radius:8px;background:#1A1A1C;border:1px solid rgba(212,175,55,0.12);border-top:1px solid rgba(255,255,255,0.04);padding:12px 16px;">
        ${perDollarRows}
      </div>
    </div>

    <!-- Erosion bar -->
    <div style="padding:0 36px;position:relative;z-index:2;">
      <div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.4);text-transform:uppercase;margin-bottom:8px;">TOTAL OFF-THE-TOP EROSION: <span style="color:rgba(220,38,38,0.85);">${erosionPct.toFixed(1)}%</span></div>
      <div style="height:20px;border-radius:4px;overflow:hidden;display:flex;border:1px solid rgba(220,38,38,0.15);">
        <div style="height:100%;background:rgba(220,38,38,0.45);width:${Math.min(erosionPct, 100)}%;"></div>
        <div style="height:100%;background:rgba(60,179,113,0.15);width:${Math.max(remainPct, 0)}%;"></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:4px;">
        <span style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(220,38,38,0.65);">Deductions: ${erosionPct.toFixed(0)}%</span>
        <span style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(60,179,113,0.65);">Distributable: ${remainPct.toFixed(0)}%</span>
      </div>
    </div>

    ${pageFooter('2')}
  </div>

  <!-- PAGE 3: THE WATERFALL -->
  <div class="page">
    ${goldTopBar}
    ${watermarkHtml}
    ${pageHeader('03')}

    <div style="padding:0 36px;margin-bottom:4px;position:relative;z-index:2;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:rgba(250,248,244,0.92);letter-spacing:1px;margin-bottom:4px;">HOW THE MONEY FLOWS</div>
    </div>

    ${bridge('The waterfall determines priority\u2009\u2014\u2009who gets paid first, and how much is left.')}

    <div style="padding:0 36px;position:relative;z-index:2;">
      ${tierCardsHtml}
    </div>

    <!-- Net Backend Profit -->
    <div style="margin:16px 36px 0;padding:14px 16px;border-radius:8px;border:1px solid rgba(60,179,113,0.35);border-top:1px solid rgba(60,179,113,0.15);background:#232326;box-shadow:0 0 20px rgba(60,179,113,0.06);display:flex;justify-content:space-between;align-items:center;position:relative;z-index:2;overflow:hidden;">
      <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse at 50% 0%,rgba(60,179,113,0.08) 0%,transparent 70%);pointer-events:none;"></div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:#3CB371;letter-spacing:1px;position:relative;z-index:1;">Net Backend Profit</div>
      <div style="font-family:'Roboto Mono',monospace;font-size:20px;font-weight:500;color:#3CB371;position:relative;z-index:1;">${formatFullCurrency(result.producer)}</div>
    </div>

    <!-- Waterfall narrative prose -->
    <div style="padding:0 36px;margin-top:16px;position:relative;z-index:2;">
      <div style="font-family:'Inter',sans-serif;font-size:11px;color:rgba(250,248,244,0.65);line-height:1.7;font-weight:400;">${waterfallNarrativeText}</div>
    </div>

    <div class="gold-break"></div>

    <!-- Margin prose -->
    ${marginProseText ? `<div style="padding:0 36px;margin-bottom:12px;position:relative;z-index:2;">
      <div style="font-family:'Inter',sans-serif;font-size:11px;color:rgba(250,248,244,0.60);line-height:1.6;font-style:italic;">${marginProseText}</div>
    </div>` : ''}

    <!-- Margin of Safety strip -->
    <div style="padding:0 36px;position:relative;z-index:2;">
      ${marginBarHtml}
    </div>

    ${pageFooter('3')}
  </div>

  <!-- PAGE 4: CAPITAL STRUCTURE + SCENARIOS -->
  <div class="page">
    ${goldTopBar}
    ${watermarkHtml}
    ${pageHeader('04')}

    <div style="padding:0 36px;margin-bottom:4px;position:relative;z-index:2;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:rgba(250,248,244,0.92);letter-spacing:1px;margin-bottom:12px;">CAPITAL STRUCTURE</div>
    </div>

    <!-- Structure prose -->
    ${structureProseText ? proseBlock(structureProseText, '12px') : ''}

    <!-- Capital sources table -->
    <div style="padding:0 36px;position:relative;z-index:2;margin-bottom:20px;">
      <div style="border-radius:8px;background:#1A1A1C;border:1px solid rgba(212,175,55,0.15);border-top:1px solid rgba(255,255,255,0.08);overflow:hidden;">
        ${capitalRowsHtml || '<div style="padding:16px;font-family:\'Inter\',sans-serif;font-size:11px;color:rgba(255,255,255,0.35);">No capital sources entered.</div>'}
      </div>
    </div>

    <!-- Scenario stress test -->
    <div style="padding:0 36px;position:relative;z-index:2;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:rgba(250,248,244,0.92);letter-spacing:1px;margin-bottom:4px;">SCENARIO STRESS TEST</div>
    </div>

    ${bridge('What happens when the acquisition price drops.')}

    <div style="padding:0 36px;position:relative;z-index:2;margin-bottom:12px;">
      <div style="border-radius:8px;background:#1A1A1C;border:1px solid rgba(212,175,55,0.15);border-top:1px solid rgba(255,255,255,0.08);overflow:hidden;">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 16px;background:rgba(255,255,255,0.03);">
          <span style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.60);text-transform:uppercase;">If your price drops</span>
          <div style="display:flex;gap:16px;">
            <span style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:1.5px;color:rgba(255,255,255,0.60);text-transform:uppercase;min-width:50px;text-align:right;">Return</span>
            <span style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:1.5px;color:rgba(255,255,255,0.60);text-transform:uppercase;min-width:50px;text-align:right;">Multiple</span>
          </div>
        </div>
        ${scenarioRowsHtml}
      </div>
    </div>

    <!-- Scenario interpretation prose -->
    ${proseBlock(scenarioInterpText, '16px')}

    <!-- Assumptions -->
    <div style="padding:0 36px;position:relative;z-index:2;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:rgba(250,248,244,0.80);letter-spacing:1px;margin-bottom:8px;">Assumptions</div>
      <div style="border-radius:8px;background:#232326;border:1px solid rgba(212,175,55,0.12);border-top:1px solid rgba(255,255,255,0.04);overflow:hidden;">
        ${[
          ['Projected Revenue', formatFullCurrency(inputs.revenue)],
          ['Sales Agent Fee', `${inputs.salesFee}%`],
          ['Marketing Cap', formatFullCurrency(inputs.salesExp)],
          ['Investor Premium', `${inputs.premium}%`],
          ['Deferred Fees', formatFullCurrency(inputs.deferments)],
          ['Tax Credits', formatFullCurrency(inputs.credits)],
          ['Backend Split', `${inputs.profitSplit}/${100 - inputs.profitSplit} (Investor/Producer)`],
        ]
          .map(
            ([label, value], i) =>
              `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 16px;${
                i > 0 ? 'border-top:1px solid rgba(255,255,255,0.03);' : ''
              }">
            <span style="font-family:'Inter',sans-serif;font-size:10px;color:rgba(250,248,244,0.60);font-weight:400;">${label}</span>
            <span style="font-family:'Roboto Mono',monospace;font-size:10px;color:rgba(255,255,255,0.85);font-weight:500;">${value}</span>
          </div>`,
          )
          .join('')}
      </div>
    </div>

    ${pageFooter('4')}
  </div>

  <!-- PAGE 5: BACK PAGE -->
  <div class="page" style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
    ${goldTopBar}
    <div style="position:absolute;top:0;left:0;right:0;height:300px;background:radial-gradient(ellipse 80% 50% at 50% 10%,rgba(212,175,55,0.08) 0%,transparent 60%);pointer-events:none;"></div>
    <div style="position:absolute;bottom:0;left:0;right:0;height:250px;background:radial-gradient(ellipse 100% 70% at 50% 100%,rgba(212,175,55,0.05) 0%,transparent 60%);pointer-events:none;"></div>

    <div style="text-align:center;position:relative;z-index:2;max-width:400px;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:6px;color:rgba(212,175,55,0.50);margin-bottom:4px;">${project.title.toUpperCase()}</div>
      <div style="width:48px;height:1px;background:linear-gradient(90deg,transparent,rgba(212,175,55,0.5),transparent);margin:0 auto 28px;"></div>

      <div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:rgba(250,248,244,0.88);letter-spacing:1px;line-height:1.1;margin-bottom:16px;">MODEL YOUR WATERFALL<br>BEFORE YOU SIGN.</div>
      <div style="font-family:'Inter',sans-serif;font-size:12px;color:rgba(250,248,244,0.60);font-weight:300;line-height:1.7;margin-bottom:32px;">Run your numbers. Structure your capital stack. Know your deal inside out before you walk into the room.</div>

      <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:6px;color:rgba(212,175,55,0.60);margin-bottom:8px;">FILMMAKER.OG</div>
      <div style="font-family:'Roboto Mono',monospace;font-size:10px;letter-spacing:2px;color:rgba(212,175,55,0.45);text-transform:uppercase;">filmmakerog.com</div>
      <div style="font-family:'Roboto Mono',monospace;font-size:9px;color:rgba(255,255,255,0.25);margin-top:12px;">${date}</div>
    </div>

    ${pageFooter('5')}
  </div>

</body>
</html>`;
}
