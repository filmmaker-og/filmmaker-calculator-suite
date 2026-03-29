// api/_pdf-template.ts  v10
// Generates HTML for a 6-page PDF rendered by Puppeteer at 612×792px.
// Brand: Gold (#D4AF37) + near-black (#0C0C0E) + warm white (rgba(250,248,244,x))
// Fonts: Bebas Neue (headlines), Inter (body/prose), Roboto Mono (data/numbers)

// ─────────────────────────────────────────────────────────
// INTERFACE
// ─────────────────────────────────────────────────────────

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
  tiers: Array<{ name: string; rate: string; amount: number; remaining: number }>;
  computed: {
    erosionPct: number;
    cashBasis: number;
    investorROI: number;
    breakEvenRevenue: number;
  };
  generatedAt: string;
}

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────
// SHARED FRAGMENTS
// ─────────────────────────────────────────────────────────

const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&family=Roboto+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">`;

const GOLD_BAR = `<div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent 5%,rgba(212,175,55,0.50) 35%,rgba(212,175,55,0.70) 50%,rgba(212,175,55,0.50) 65%,transparent 95%);z-index:10;"></div>`;

const WATERMARK = `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-family:'Bebas Neue',sans-serif;font-size:88px;letter-spacing:16px;color:rgba(212,175,55,0.04);pointer-events:none;z-index:1;white-space:nowrap;user-select:none;">FILMMAKER.OG</div>`;

const FOOTER = `<div style="position:absolute;bottom:18px;left:36px;right:36px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(212,175,55,0.10);padding-top:10px;">
  <div style="font-family:'Roboto Mono',monospace;font-size:9px;letter-spacing:2px;color:rgba(212,175,55,0.45);">FILMMAKER.OG</div>
  <div style="font-family:'Roboto Mono',monospace;font-size:9px;color:rgba(255,255,255,0.35);">filmmakerog.com</div>
</div>`;

function pageHeader(pageNum: string): string {
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 36px 10px;position:relative;z-index:2;">
  <div style="font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:4px;color:rgba(212,175,55,0.50);">FILMMAKER.OG</div>
  <div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.30);">${pageNum}</div>
</div>`;
}

const BASE_CSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #0C0C0E; font-family: 'Inter', sans-serif; width: 612px; }
.page { width: 612px; height: 792px; background: #0C0C0E; position: relative; overflow: hidden; display: flex; flex-direction: column; }`;

// ─────────────────────────────────────────────────────────
// PAGE 1 — THE PROJECT (cover)
// ─────────────────────────────────────────────────────────

function page1(data: SnapshotData): string {
  const { project } = data;

  // Build team grid cells — only include fields that have values
  const teamFields: Array<{ label: string; value: string }> = [];
  if (project.director) teamFields.push({ label: 'Director', value: project.director });
  if (project.writers) teamFields.push({ label: 'Writer', value: project.writers });
  if (project.producers) teamFields.push({ label: 'Producers', value: project.producers });
  if (project.company) teamFields.push({ label: 'Production Co.', value: project.company });
  if (project.cast) teamFields.push({ label: 'Cast', value: project.cast });
  if (project.location) teamFields.push({ label: 'Location', value: project.location });

  const teamCells = teamFields.map(f => `
    <div style="background:#232326;padding:12px 16px;">
      <div style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(212,175,55,0.40);text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">${f.label}</div>
      <div style="font-family:'Inter',sans-serif;font-size:13px;color:rgba(250,248,244,0.85);font-weight:500;">${f.value}</div>
    </div>`).join('');

  const teamGrid = teamFields.length > 0 ? `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(212,175,55,0.06);border-radius:6px;overflow:hidden;margin-bottom:28px;">
      ${teamCells}
    </div>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  ${FONTS}
  <style>${BASE_CSS}</style>
</head>
<body>
  <div class="page">
    ${GOLD_BAR}
    ${WATERMARK}

    <!-- Content — vertically centered -->
    <div style="display:flex;flex-direction:column;justify-content:center;flex:1;padding:0 36px 48px;position:relative;z-index:2;">

      <!-- Brand mark -->
      <div style="font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:5px;color:rgba(212,175,55,0.55);margin-bottom:20px;">FILMMAKER.OG</div>

      <!-- Gold rule -->
      <div style="width:40px;height:1px;background:rgba(212,175,55,0.35);margin-bottom:28px;"></div>

      <!-- Project title -->
      <div style="font-family:'Bebas Neue',sans-serif;font-size:38px;color:rgba(255,255,255,0.96);letter-spacing:1px;line-height:1.0;margin-bottom:8px;">${project.title}</div>

      <!-- Genre -->
      <div style="font-family:'Roboto Mono',monospace;font-size:10px;color:rgba(212,175,55,0.50);text-transform:uppercase;letter-spacing:2px;margin-bottom:14px;">${project.genre}</div>

      <!-- Logline -->
      <div style="font-family:'Inter',sans-serif;font-size:13px;color:rgba(250,248,244,0.60);font-style:italic;max-width:440px;line-height:1.65;margin-bottom:28px;">${project.logline}</div>

      <!-- Gold divider -->
      <div style="height:1px;background:rgba(212,175,55,0.15);margin-bottom:24px;"></div>

      <!-- Team grid -->
      ${teamGrid}

    </div>

    ${FOOTER}
  </div>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────
// PAGE 2 — THE DEAL
// ─────────────────────────────────────────────────────────

function page2(data: SnapshotData): string {
  const { project, inputs, result, computed } = data;

  // Safe defaults
  const profitSplitPct = Math.max(0, Math.min(100, inputs.profitSplit ?? 50));
  const producerSplitPct = 100 - profitSplitPct;
  const safeMultiple = isFinite(result.multiple) && !isNaN(result.multiple) ? result.multiple : 0;

  // S1: financing sources
  const sources: string[] = [];
  if (inputs.equity > 0) sources.push('equity');
  if (inputs.debt > 0) sources.push('senior debt');
  if (inputs.mezzanineDebt > 0) sources.push('mezzanine financing');
  if (inputs.credits > 0) sources.push('tax credits');
  if (inputs.deferments > 0) sources.push('deferrals');

  let sourceStr = '';
  if (sources.length === 0) sourceStr = 'internal financing';
  else if (sources.length === 1) sourceStr = sources[0];
  else if (sources.length === 2) sourceStr = `${sources[0]} and ${sources[1]}`;
  else sourceStr = sources.slice(0, -1).join(', ') + ', and ' + sources[sources.length - 1];

  const s1 = `${project.title} is a ${formatCurrency(inputs.budget)} independent ${project.genre} feature financed through ${sourceStr}.`;

  // S2: recoup status
  let s2 = '';
  if (result.recoupPct >= 100) {
    s2 = `At the modeled acquisition price of ${formatCurrency(inputs.revenue)}, all capital tiers are fully funded with a ${safeMultiple.toFixed(2)}x return to investors.`;
  } else if (result.recoupPct > 0) {
    s2 = `At the modeled acquisition price of ${formatCurrency(inputs.revenue)}, investors recoup ${Math.round(result.recoupPct)}% of their capital obligations.`;
  } else {
    s2 = `At the modeled acquisition price of ${formatCurrency(inputs.revenue)}, the deal does not cover capital obligations.`;
  }

  // S3: erosion
  const erosionPct = Math.round(computed.erosionPct);
  const s3 = `Off-the-top deductions — distribution fees, sales expenses, guild reserves, and collection costs — consume ${erosionPct}% of gross revenue before the waterfall begins.`;

  // S4: margin of safety
  const margin = inputs.revenue - computed.breakEvenRevenue;
  let s4 = '';
  if (margin > 0) {
    const marginPct = Math.round((margin / inputs.revenue) * 100);
    s4 = `The deal carries a ${formatFullCurrency(margin)} margin of safety above break-even, meaning the acquisition price could fall ${marginPct}% before investor capital is at risk.`;
  } else if (margin === 0) {
    s4 = `Revenue exactly meets break-even — there is no margin of safety.`;
  } else {
    s4 = `Revenue falls ${formatFullCurrency(Math.abs(margin))} short of break-even.`;
  }

  // S5: structure description
  let s5 = '';
  const hasDebt = inputs.debt > 0;
  const hasMezz = inputs.mezzanineDebt > 0;
  const hasEquity = inputs.equity > 0;

  if ((hasDebt || hasMezz) && hasEquity) {
    const debtDesc = hasMezz ? 'senior debt repayment followed by mezzanine, then' : 'senior debt repayment, followed by';
    s5 = `The waterfall prioritizes ${debtDesc} equity recoupment at a ${inputs.premium}% preferred return, with remaining profits split ${profitSplitPct}/${producerSplitPct} between investors and producers.`;
  } else if (hasDebt && !hasMezz && !hasEquity) {
    s5 = `The waterfall prioritizes senior debt repayment at a ${inputs.seniorDebtRate}% rate, with remaining profits split ${profitSplitPct}/${producerSplitPct} between investors and producers.`;
  } else {
    s5 = `The waterfall is structured around equity recoupment at a ${inputs.premium}% preferred return, with remaining profits split ${profitSplitPct}/${producerSplitPct} between investors and producers.`;
  }

  // S6: producer backend
  let s6 = '';
  if (result.producer > 0) {
    s6 = `The producer's net backend is ${formatFullCurrency(result.producer)}.`;
  }

  // Prose paragraphs
  const para1 = `${s1} ${s2}`;
  const para2 = `${s3} ${s4}`;
  const para3 = `${s5}${s6 ? ' ' + s6 : ''}`;

  // Pull-quote
  let pullQuote = '';
  if (result.recoupPct >= 100) {
    pullQuote = `All capital tiers funded. ${safeMultiple.toFixed(2)}x return at modeled price.`;
  } else if (result.recoupPct > 0) {
    pullQuote = `Partial recoupment at ${Math.round(result.recoupPct)}%.`;
  } else {
    pullQuote = `Revenue does not cover capital obligations.`;
  }

  // Capital structure table rows
  const capRows: string[] = [];
  let positionIndex = 1;
  const positionLabels = ['FIRST POSITION', 'SECOND POSITION', 'THIRD POSITION', 'FOURTH POSITION', 'FIFTH POSITION'];

  if (inputs.debt > 0) {
    const pct = inputs.budget > 0 ? Math.round((inputs.debt / inputs.budget) * 100) : 0;
    capRows.push(`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 16px;">
        <div>
          <div style="font-family:'Inter',sans-serif;font-size:12px;color:rgba(250,248,244,0.88);font-weight:500;">Senior Debt</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(212,175,55,0.45);">${positionLabels[positionIndex - 1]} · ${inputs.seniorDebtRate}%</div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:'Roboto Mono',monospace;font-size:13px;color:rgba(250,248,244,0.92);font-weight:500;">${formatFullCurrency(inputs.debt)}</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(255,255,255,0.35);">${pct}% of budget</div>
        </div>
      </div>`);
    positionIndex++;
  }

  if (inputs.mezzanineDebt > 0) {
    const pct = inputs.budget > 0 ? Math.round((inputs.mezzanineDebt / inputs.budget) * 100) : 0;
    capRows.push(`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 16px;">
        <div>
          <div style="font-family:'Inter',sans-serif;font-size:12px;color:rgba(250,248,244,0.88);font-weight:500;">Mezzanine Debt</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(212,175,55,0.45);">${positionLabels[positionIndex - 1]} · ${inputs.mezzanineRate}%</div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:'Roboto Mono',monospace;font-size:13px;color:rgba(250,248,244,0.92);font-weight:500;">${formatFullCurrency(inputs.mezzanineDebt)}</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(255,255,255,0.35);">${pct}% of budget</div>
        </div>
      </div>`);
    positionIndex++;
  }

  if (inputs.equity > 0) {
    const pct = inputs.budget > 0 ? Math.round((inputs.equity / inputs.budget) * 100) : 0;
    capRows.push(`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 16px;">
        <div>
          <div style="font-family:'Inter',sans-serif;font-size:12px;color:rgba(250,248,244,0.88);font-weight:500;">Equity</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(212,175,55,0.45);">${inputs.premium}% PREFERRED RETURN</div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:'Roboto Mono',monospace;font-size:13px;color:rgba(250,248,244,0.92);font-weight:500;">${formatFullCurrency(inputs.equity)}</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(255,255,255,0.35);">${pct}% of budget</div>
        </div>
      </div>`);
    positionIndex++;
  }

  if (inputs.credits > 0) {
    capRows.push(`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 16px;">
        <div>
          <div style="font-family:'Inter',sans-serif;font-size:12px;color:rgba(250,248,244,0.88);font-weight:500;">Tax Credits</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(212,175,55,0.45);">NON-DILUTIVE</div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:'Roboto Mono',monospace;font-size:13px;color:rgba(250,248,244,0.92);font-weight:500;">${formatFullCurrency(inputs.credits)}</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(255,255,255,0.35);">applied off-top</div>
        </div>
      </div>`);
    positionIndex++;
  }

  if (inputs.deferments > 0) {
    capRows.push(`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 16px;">
        <div>
          <div style="font-family:'Inter',sans-serif;font-size:12px;color:rgba(250,248,244,0.88);font-weight:500;">Deferrals</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(212,175,55,0.45);">DEFERRED COMPENSATION</div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:'Roboto Mono',monospace;font-size:13px;color:rgba(250,248,244,0.92);font-weight:500;">${formatFullCurrency(inputs.deferments)}</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(255,255,255,0.35);">backend obligation</div>
        </div>
      </div>`);
  }

  // Interleave dividers between rows
  const capRowsWithDividers = capRows.map((row, i) =>
    i < capRows.length - 1 ? row + `\n<div style="height:1px;background:rgba(212,175,55,0.06);margin:0 16px;"></div>` : row
  ).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  ${FONTS}
  <style>${BASE_CSS}</style>
</head>
<body>
  <div class="page">
    ${GOLD_BAR}
    ${WATERMARK}
    ${pageHeader('PAGE 02')}

    <!-- Content -->
    <div style="flex:1;padding:0 36px 48px;position:relative;z-index:2;display:flex;flex-direction:column;">

      <!-- Title -->
      <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:rgba(250,248,244,0.92);letter-spacing:1px;margin-bottom:20px;">THE DEAL</div>

      <!-- TLDR Pull-quote -->
      <div style="border-left:3px solid rgba(212,175,55,0.35);padding:14px 20px;background:rgba(212,175,55,0.02);border-radius:0 5px 5px 0;margin-bottom:24px;">
        <div style="font-family:'Inter',sans-serif;font-size:14px;color:rgba(250,248,244,0.85);font-weight:500;line-height:1.5;">${pullQuote}</div>
      </div>

      <!-- Gold divider -->
      <div style="height:1px;background:linear-gradient(90deg,rgba(212,175,55,0.25),transparent);margin-bottom:24px;"></div>

      <!-- Prose -->
      <div style="font-family:'Inter',sans-serif;font-size:12px;color:rgba(250,248,244,0.70);line-height:1.85;">
        <p style="margin-bottom:18px;">${para1}</p>
        <p style="margin-bottom:18px;">${para2}</p>
        <p style="margin-bottom:18px;">${para3}</p>
      </div>

      <!-- Spacer -->
      <div style="flex:1;"></div>

    </div>

    ${FOOTER}
  </div>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────
// PAGE 3 — WATERFALL DEDUCTIONS
// ─────────────────────────────────────────────────────────

function page3(data: SnapshotData): string {
  const { inputs, result, computed } = data;
  const revenue = inputs.revenue;

  // Build deduction rows dynamically
  const deductionRows: string[] = [];

  if (result.cam > 0) {
    deductionRows.push(`
      <div class="row" style="padding:8px 16px;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:rgba(255,255,255,0.90);">CAM Fee <span style="font-family:'Roboto Mono',monospace;font-size:10px;color:rgba(212,175,55,0.45);margin-left:8px;">1% OF GROSS</span></div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:rgba(220,38,38,0.88);">–${formatFullCurrency(result.cam)}</div>
      </div>
      <div class="divider" style="background:rgba(255,255,255,0.04);"></div>`);
  }

  if (result.guilds > 0) {
    deductionRows.push(`
      <div class="row" style="padding:8px 16px;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:rgba(255,255,255,0.90);">Guild Residuals <span style="font-family:'Roboto Mono',monospace;font-size:10px;color:rgba(212,175,55,0.45);margin-left:8px;">SAG · WGA · DGA</span></div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:rgba(220,38,38,0.88);">–${formatFullCurrency(result.guilds)}</div>
      </div>
      <div class="divider" style="background:rgba(255,255,255,0.04);"></div>`);
  }

  if (result.salesFee > 0) {
    const salesFeePct = revenue > 0 ? Math.round((result.salesFee / revenue) * 100) : 0;
    deductionRows.push(`
      <div class="row" style="padding:8px 16px;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:rgba(255,255,255,0.90);">Sales Commission <span style="font-family:'Roboto Mono',monospace;font-size:10px;color:rgba(212,175,55,0.45);margin-left:8px;">${salesFeePct}%</span></div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:rgba(220,38,38,0.88);">–${formatFullCurrency(result.salesFee)}</div>
      </div>
      <div class="divider" style="background:rgba(255,255,255,0.04);"></div>`);
  }

  if (result.marketing > 0) {
    deductionRows.push(`
      <div class="row" style="padding:8px 16px;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:rgba(255,255,255,0.90);">Sales Expenses <span style="font-family:'Roboto Mono',monospace;font-size:10px;color:rgba(212,175,55,0.45);margin-left:8px;">EXPENSE CAP</span></div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:rgba(220,38,38,0.88);">–${formatFullCurrency(result.marketing)}</div>
      </div>
      <div class="divider" style="background:rgba(255,255,255,0.04);"></div>`);
  }

  // Remove trailing divider from last row
  const deductionRowsHtml = deductionRows.join('').replace(/<div class="divider"[^>]*><\/div>\s*$/, '');

  // Erosion bar: green portion = 100 - erosionPct, red = erosionPct
  const erosionPct = Math.min(100, Math.max(0, computed.erosionPct));
  const greenPct = Math.round(100 - erosionPct);
  const redPct = Math.round(erosionPct);

  // Tax credits connector + card (only if credits > 0)
  const netDistributable = revenue - result.offTopTotal + result.creditsApplied;
  const hasCredits = inputs.credits > 0;

  const taxCreditsSection = hasCredits ? `
    <!-- Connector red→green -->
    <div class="conn" style="height:10px;">
      <div style="width:2px;height:6px;background:linear-gradient(180deg,rgba(220,38,38,0.50),rgba(60,179,113,0.50));border-radius:1px;"></div>
      <div style="width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid rgba(60,179,113,0.55);margin-top:-1px;"></div>
    </div>

    <!-- TAX CREDITS -->
    <div class="card" style="width:55%;padding:12px 20px;border:1px solid rgba(60,179,113,0.22);">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:rgba(60,179,113,0.88);">Tax Credits <span style="font-family:'Roboto Mono',monospace;font-size:10px;color:rgba(212,175,55,0.45);margin-left:8px;">NON-DILUTIVE</span></div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:#3CB371;">+${formatFullCurrency(result.creditsApplied > 0 ? result.creditsApplied : inputs.credits)}</div>
      </div>
    </div>

    <!-- Connector green→gold -->
    <div class="conn" style="height:10px;">
      <div style="width:3px;height:6px;background:linear-gradient(180deg,rgba(60,179,113,0.50),rgba(212,175,55,0.55));box-shadow:0 0 8px rgba(212,175,55,0.25);border-radius:1px;"></div>
      <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid rgba(212,175,55,0.55);margin-top:-1px;"></div>
    </div>` : `
    <!-- Connector red→gold (no credits) -->
    <div class="conn" style="height:10px;">
      <div style="width:3px;height:6px;background:linear-gradient(180deg,rgba(220,38,38,0.50),rgba(212,175,55,0.55));box-shadow:0 0 8px rgba(212,175,55,0.25);border-radius:1px;"></div>
      <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid rgba(212,175,55,0.55);margin-top:-1px;"></div>
    </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  ${FONTS}
  <style>
    ${BASE_CSS}
    .card { background: linear-gradient(180deg, rgba(212,175,55,0.02), #232326); border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.35); }
    .label { font-family: 'Bebas Neue', sans-serif; letter-spacing: 3px; text-align: center; }
    .conn { display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .row { display: flex; justify-content: space-between; align-items: center; padding: 8px 16px; }
    .divider { height: 1px; margin: 0 20px; }
  </style>
</head>
<body>
  <div class="page">
    ${GOLD_BAR}
    ${WATERMARK}
    ${pageHeader('PAGE 03')}

    <div style="padding:0 36px 6px;position:relative;z-index:2;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:rgba(250,248,244,0.92);letter-spacing:1px;">THE WATERFALL</div>
      <div style="font-family:'Inter',sans-serif;font-size:11px;color:rgba(250,248,244,0.50);margin-top:4px;font-style:italic;">Every dollar of acquisition revenue passes through these gates before reaching the capital stack.</div>
    </div>

    <div style="flex:1;padding:0 36px 24px;position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;">

      <!-- ACQUISITION REVENUE -->
      <div class="label" style="font-size:12px;color:rgba(212,175,55,0.50);margin-bottom:6px;">ACQUISITION REVENUE</div>
      <div class="card" style="width:50%;padding:16px 20px;border:1px solid rgba(212,175,55,0.22);text-align:center;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:rgba(255,255,255,0.94);letter-spacing:1px;">${formatFullCurrency(revenue)}</div>
      </div>

      <!-- Connector gold→red -->
      <div class="conn" style="height:10px;">
        <div style="width:2px;height:6px;background:linear-gradient(180deg,rgba(212,175,55,0.55),rgba(220,38,38,0.50));border-radius:1px;"></div>
        <div style="width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid rgba(220,38,38,0.55);margin-top:-1px;"></div>
      </div>

      <!-- OFF-THE-TOP DEDUCTIONS -->
      <div class="label" style="font-size:11px;color:rgba(220,38,38,0.50);margin-bottom:6px;">OFF-THE-TOP DEDUCTIONS</div>
      <div class="card" style="width:100%;border:1px solid rgba(220,38,38,0.22);overflow:hidden;">
        ${deductionRowsHtml}
        <!-- TOTAL footer -->
        <div style="border-top:1px solid rgba(220,38,38,0.15);background:rgba(220,38,38,0.03);padding:10px 20px;display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:center;gap:14px;">
            <div style="font-family:'Roboto Mono',monospace;font-size:10px;color:rgba(220,38,38,0.60);letter-spacing:1px;">TOTAL</div>
            <div style="width:100px;height:8px;background:rgba(255,255,255,0.06);border-radius:4px;overflow:hidden;display:flex;">
              <div style="height:100%;width:${greenPct}%;background:rgba(60,179,113,0.40);border-radius:4px 0 0 4px;"></div>
              <div style="height:100%;flex:1;background:rgba(220,38,38,0.35);border-radius:0 4px 4px 0;"></div>
            </div>
            <div style="font-family:'Roboto Mono',monospace;font-size:9px;color:rgba(255,255,255,0.40);">${redPct}% OF GROSS</div>
          </div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:26px;color:rgba(220,38,38,0.88);">–${formatFullCurrency(result.offTopTotal)}</div>
        </div>
      </div>

      ${taxCreditsSection}

      <!-- NET DISTRIBUTABLE REVENUE -->
      <div class="label" style="font-size:12px;color:rgba(212,175,55,0.50);margin-bottom:6px;">NET DISTRIBUTABLE REVENUE</div>
      <div class="card" style="width:60%;padding:16px 24px;border:1px solid rgba(212,175,55,0.25);text-align:center;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:rgba(255,255,255,0.94);letter-spacing:1px;">${formatFullCurrency(netDistributable)}</div>
        <div style="font-family:'Roboto Mono',monospace;font-size:9px;color:rgba(212,175,55,0.40);margin-top:6px;letter-spacing:1px;">FLOWS INTO CAPITAL RECOUPMENT →</div>
      </div>

    </div>

    ${FOOTER}
  </div>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────
// PAGE 4 — WATERFALL RECOUPMENT
// ─────────────────────────────────────────────────────────

function page4(data: SnapshotData): string {
  const { inputs, result, tiers } = data;

  // Capital structure rows
  const capSources: { label: string; detail: string; amount: number; pct: string }[] = [];
  if (inputs.debt > 0) capSources.push({ label: 'Senior Debt', detail: `First position · ${inputs.seniorDebtRate}%`, amount: inputs.debt, pct: inputs.budget > 0 ? `${Math.round((inputs.debt / inputs.budget) * 100)}%` : '' });
  if (inputs.mezzanineDebt > 0) capSources.push({ label: 'Mezzanine', detail: `Second position · ${inputs.mezzanineRate}%`, amount: inputs.mezzanineDebt, pct: inputs.budget > 0 ? `${Math.round((inputs.mezzanineDebt / inputs.budget) * 100)}%` : '' });
  if (inputs.equity > 0) capSources.push({ label: 'Equity', detail: inputs.premium > 0 ? `${inputs.premium}% preferred` : 'Pari passu', amount: inputs.equity, pct: inputs.budget > 0 ? `${Math.round((inputs.equity / inputs.budget) * 100)}%` : '' });
  if (inputs.credits > 0) capSources.push({ label: 'Tax Credits', detail: 'Non-dilutive', amount: inputs.credits, pct: inputs.budget > 0 ? `${Math.round((inputs.credits / inputs.budget) * 100)}%` : '' });
  if (inputs.deferments > 0) capSources.push({ label: 'Deferrals', detail: 'Subordinate', amount: inputs.deferments, pct: inputs.budget > 0 ? `${Math.round((inputs.deferments / inputs.budget) * 100)}%` : '' });

  const capRows = capSources.map((s, i) =>
    `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 16px;${i > 0 ? 'border-top:1px solid rgba(212,175,55,0.06);' : ''}">
      <div>
        <div style="font-family:'Inter',sans-serif;font-size:11px;color:rgba(250,248,244,0.88);font-weight:500;">${s.label}</div>
        <div style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(212,175,55,0.40);">${s.detail}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-family:'Roboto Mono',monospace;font-size:12px;color:rgba(250,248,244,0.92);font-weight:500;">${formatFullCurrency(s.amount)}</div>
        <div style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(255,255,255,0.35);">${s.pct} of budget</div>
      </div>
    </div>`
  ).join('');

  const profitSplitPct = Math.max(0, Math.min(100, inputs.profitSplit ?? 50));
  const producerSplitPct = 100 - profitSplitPct;

  const profitPool = result.profitPool > 0 ? result.profitPool : 0;
  const investorBackend = profitPool * (profitSplitPct / 100);
  const producerBackend = profitPool * (producerSplitPct / 100);

  // Build tier rows from data.tiers
  const tierRows = tiers.map((tier, i) => {
    const badgeNum = i + 1;
    const isDeferred = tier.name.toLowerCase().includes('defer');
    const amountColor = isDeferred ? 'rgba(240,168,48,0.88)' : 'rgba(255,255,255,0.92)';
    const divider = i < tiers.length - 1
      ? `<div class="divider" style="background:rgba(212,175,55,0.06);"></div>`
      : '';
    return `
      <div class="row" style="padding:14px 20px;">
        <div style="display:flex;align-items:center;gap:14px;">
          <div class="badge">${badgeNum}</div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:rgba(255,255,255,0.92);">${tier.name} <span style="font-family:'Roboto Mono',monospace;font-size:10px;color:rgba(212,175,55,0.45);margin-left:8px;">${tier.rate}</span></div>
        </div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:${amountColor};">${formatFullCurrency(tier.amount)}</div>
      </div>
      ${divider}`;
  }).join('');

  const profitPoolColor = profitPool > 0 ? '#3CB371' : 'rgba(220,38,38,0.85)';
  const profitPoolDisplay = formatFullCurrency(profitPool);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  ${FONTS}
  <style>
    ${BASE_CSS}
    .card { background: linear-gradient(180deg, rgba(212,175,55,0.02), #232326); border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.35); }
    .label { font-family: 'Bebas Neue', sans-serif; letter-spacing: 3px; text-align: center; }
    .conn { display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .row { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; }
    .divider { height: 1px; margin: 0 20px; }
    .badge {
      width: 30px; height: 30px; border-radius: 50%;
      background: rgba(212,175,55,0.12); border: 1px solid rgba(212,175,55,0.30);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Bebas Neue', sans-serif; font-size: 15px; color: #fff;
      flex-shrink: 0; line-height: 1;
    }
  </style>
</head>
<body>
  <div class="page">
    ${GOLD_BAR}
    ${WATERMARK}
    ${pageHeader('PAGE 04')}

    <div style="padding:0 36px 6px;position:relative;z-index:2;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:rgba(250,248,244,0.92);letter-spacing:1px;">THE WATERFALL</div>
      <div style="font-family:'Inter',sans-serif;font-size:11px;color:rgba(250,248,244,0.50);margin-top:4px;font-style:italic;">After deductions, revenue flows through the capital stack in priority order.</div>
    </div>

    <div style="flex:1;padding:8px 36px 48px;position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;">

      <!-- CAPITAL STRUCTURE -->
      ${capSources.length > 0 ? `
      <div style="width:100%;margin-bottom:12px;">
        <div style="font-family:'Roboto Mono',monospace;font-size:9px;color:rgba(212,175,55,0.40);letter-spacing:2px;margin-bottom:6px;">CAPITAL STRUCTURE</div>
        <div style="background:linear-gradient(180deg,rgba(212,175,55,0.02),#232326);border:1px solid rgba(212,175,55,0.12);border-radius:5px;overflow:hidden;">
          ${capRows}
        </div>
      </div>

      <!-- Connector -->
      <div class="conn" style="height:16px;">
        <div style="width:2px;height:10px;background:rgba(212,175,55,0.50);border-radius:1px;"></div>
        <div style="width:0;height:0;border-left:3px solid transparent;border-right:3px solid transparent;border-top:4px solid rgba(212,175,55,0.55);margin-top:-1px;"></div>
      </div>
      ` : ''}

      <!-- CAPITAL RECOUPMENT -->
      <div class="label" style="font-size:12px;color:rgba(212,175,55,0.50);margin-bottom:8px;">CAPITAL RECOUPMENT</div>
      <div class="card" style="width:100%;border:1px solid rgba(212,175,55,0.18);overflow:hidden;">
        ${tierRows}
      </div>

      <!-- Connector gold→green -->
      <div class="conn" style="height:28px;">
        <div style="width:3px;height:18px;background:linear-gradient(180deg,rgba(212,175,55,0.55),rgba(60,179,113,0.60));box-shadow:0 0 8px rgba(60,179,113,0.25);border-radius:1px;"></div>
        <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid rgba(60,179,113,0.60);margin-top:-1px;"></div>
      </div>

      <!-- NET BACKEND PROFIT -->
      <div class="label" style="font-size:12px;color:rgba(60,179,113,0.55);margin-bottom:8px;">NET BACKEND PROFIT</div>
      <div class="card" style="width:100%;padding:20px 24px;border:1px solid rgba(60,179,113,0.40);text-align:center;background:radial-gradient(ellipse at 50% 0%,rgba(60,179,113,0.06) 0%,#232326 70%);box-shadow:0 4px 20px rgba(0,0,0,0.35),0 0 24px rgba(60,179,113,0.06);">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:42px;color:${profitPoolColor};text-shadow:0 0 24px rgba(60,179,113,0.30);letter-spacing:2px;">${profitPoolDisplay}</div>
      </div>

      <!-- Connector green→green -->
      <div class="conn" style="height:24px;">
        <div style="width:2px;height:16px;background:rgba(60,179,113,0.55);box-shadow:0 0 6px rgba(60,179,113,0.30);border-radius:1px;"></div>
        <div style="width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid rgba(60,179,113,0.60);margin-top:-1px;"></div>
      </div>

      <!-- PROFIT SPLIT -->
      <div class="label" style="font-size:11px;color:rgba(60,179,113,0.45);margin-bottom:8px;">PROFIT SPLIT · ${profitSplitPct}/${producerSplitPct}</div>
      <div style="width:100%;display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div class="card" style="padding:16px 20px;border:1px solid rgba(60,179,113,0.22);text-align:center;">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:rgba(255,255,255,0.70);margin-bottom:6px;">INVESTOR</div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:#3CB371;">${formatFullCurrency(investorBackend)}</div>
        </div>
        <div class="card" style="padding:16px 20px;border:1px solid rgba(60,179,113,0.22);text-align:center;">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:rgba(255,255,255,0.70);margin-bottom:6px;">PRODUCER</div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:#3CB371;">${formatFullCurrency(producerBackend)}</div>
        </div>
      </div>

    </div>

    ${FOOTER}
  </div>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────
// PAGE 5 — RISK ANALYSIS
// ─────────────────────────────────────────────────────────

function page5(data: SnapshotData): string {
  const { inputs, result, computed } = data;

  const revenue = inputs.revenue;
  const { cashBasis, breakEvenRevenue } = computed;
  const profitSplitPct = Math.max(0, Math.min(100, inputs.profitSplit ?? 50));
  const producerSplitPct = 100 - profitSplitPct;
  const safeMultiple = isFinite(result.multiple) && !isNaN(result.multiple) ? result.multiple : 0;

  // Variable off-tops (scale with revenue) and fixed off-tops
  const variableOffTops = result.cam + result.salesFee + result.guilds;
  const fixedOffTops = result.marketing;
  const variableOffTopRate = revenue > 0 ? variableOffTops / revenue : 0;

  // Total hurdle for scenario calculations
  const totalHurdleAmount = result.seniorDebtHurdle + result.mezzDebtHurdle + result.equityHurdle + inputs.deferments - result.creditsApplied;

  // Scenario calculation helper
  function calcScenario(price: number): { recoupPct: number; mult: number } {
    const newVarOff = price * variableOffTopRate;
    const newOff = newVarOff + fixedOffTops;
    const newDist = Math.max(0, price - newOff + result.creditsApplied);
    const recoupPct = totalHurdleAmount > 0 ? Math.min(100, (newDist / totalHurdleAmount) * 100) : 0;
    const mult = cashBasis > 0 ? newDist / cashBasis : 0;
    return { recoupPct: Math.round(recoupPct), mult: parseFloat(mult.toFixed(2)) };
  }

  const scenarioMinus15 = calcScenario(revenue * 0.85);
  const scenarioMinus30 = calcScenario(revenue * 0.70);
  const scenarioMinus50 = calcScenario(revenue * 0.50);

  // Margin of safety
  const margin = revenue - breakEvenRevenue;
  const marginPct = revenue > 0 ? Math.round((margin / revenue) * 100) : 0;
  const breakEvenBarPct = revenue > 0 ? Math.min(100, Math.round((breakEvenRevenue / revenue) * 100)) : 100;
  const marginBarPct = 100 - breakEvenBarPct;

  let marginLabel = '';
  let marginProse = '';
  if (margin > 0) {
    marginLabel = `MARGIN OF SAFETY: ${formatFullCurrency(margin)} ABOVE BREAK-EVEN`;
    marginProse = `Revenue exceeds the break-even threshold by ${formatFullCurrency(margin)} — a ${marginPct}% margin of safety. The acquisition price could fall ${marginPct}% before investor capital is at risk.`;
  } else if (margin === 0) {
    marginLabel = `MARGIN OF SAFETY: $0 — AT BREAK-EVEN`;
    marginProse = `Revenue exactly meets break-even — there is no margin of safety.`;
  } else {
    marginLabel = `SHORTFALL: ${formatFullCurrency(Math.abs(margin))} BELOW BREAK-EVEN`;
    marginProse = `Revenue falls ${formatFullCurrency(Math.abs(margin))} short of break-even — investor capital is not fully covered at the modeled price.`;
  }
  const marginLabelColor = margin >= 0 ? '#3CB371' : 'rgba(220,38,38,0.85)';

  // Scenario interpretation prose
  let scenarioInterpretation = '';
  if (safeMultiple >= 1.0) {
    scenarioInterpretation = `At the modeled price, the deal returns ${safeMultiple.toFixed(2)}x.`;
    if (scenarioMinus15.recoupPct >= 100) {
      scenarioInterpretation += ` A 15% haircut still delivers full recoupment at ${scenarioMinus15.mult.toFixed(2)}x.`;
    }
    if (scenarioMinus50.recoupPct < 100) {
      scenarioInterpretation += ` At a 50% discount, investors recover ${scenarioMinus50.recoupPct}% of capital — the structure survives significant downward pressure.`;
    } else {
      scenarioInterpretation += ` The deal survives even a 50% price reduction with full capital recovery.`;
    }
  } else if (safeMultiple >= 0.5) {
    scenarioInterpretation = `At the modeled price, investors recoup ${Math.round(result.recoupPct)}% of capital at ${safeMultiple.toFixed(2)}x. A 15% haircut reduces recovery to ${scenarioMinus15.recoupPct}%. The structure is sensitive to downward price pressure.`;
  } else {
    scenarioInterpretation = `At the modeled price, the deal does not fully cover capital obligations. Further price reductions would accelerate capital erosion. A 50% haircut leaves investors with ${scenarioMinus50.recoupPct}% recovery.`;
  }

  // Assumptions line
  const salesFeePctDisplay = inputs.salesFee ? `${Math.round(inputs.salesFee * 100)}% sales fee` : '';
  const salesExpDisplay = inputs.salesExp ? `${formatCurrency(inputs.salesExp)} expense cap` : '';
  const premiumDisplay = inputs.premium ? `${inputs.premium}% investor premium` : '';
  const splitDisplay = `${profitSplitPct}/${producerSplitPct} backend split`;
  const assumptionParts = [salesFeePctDisplay, salesExpDisplay, premiumDisplay, splitDisplay].filter(Boolean);
  const assumptionsLine = `Assumptions: ${assumptionParts.join(' · ')}`;

  function scenarioRow(price: number, label: string, isModeled: boolean, scenarioResult: { recoupPct: number; mult: number }) {
    const rColor = getReturnColor(scenarioResult.recoupPct);
    const mColor = getMultipleColor(scenarioResult.mult);
    const borderLeft = isModeled ? 'border-left:3px solid rgba(212,175,55,0.40);' : '';
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 20px;border-top:1px solid rgba(255,255,255,0.04);${borderLeft}">
        <div>
          <span style="font-family:'Roboto Mono',monospace;font-size:14px;color:rgba(250,248,244,0.90);">${formatCurrency(price)}</span>
          <span style="font-family:'Roboto Mono',monospace;font-size:10px;color:rgba(255,255,255,0.40);margin-left:8px;">${label}</span>
        </div>
        <div style="display:flex;gap:24px;">
          <span style="font-family:'Roboto Mono',monospace;font-size:14px;color:${rColor};min-width:60px;text-align:right;font-weight:500;">${scenarioResult.recoupPct}%</span>
          <span style="font-family:'Roboto Mono',monospace;font-size:14px;color:${mColor};min-width:60px;text-align:right;font-weight:500;">${scenarioResult.mult.toFixed(2)}x</span>
        </div>
      </div>`;
  }

  const modeledResult = calcScenario(revenue);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  ${FONTS}
  <style>
    ${BASE_CSS}
    .card { background: linear-gradient(180deg, rgba(212,175,55,0.02), #232326); border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.30); }
  </style>
</head>
<body>
  <div class="page">
    ${GOLD_BAR}
    ${WATERMARK}
    ${pageHeader('PAGE 05')}

    <div style="flex:1;padding:0 36px 48px;position:relative;z-index:2;display:flex;flex-direction:column;">

      <!-- Title -->
      <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:rgba(250,248,244,0.92);letter-spacing:1px;margin-bottom:16px;">RISK ANALYSIS</div>

      <!-- Margin of Safety -->
      <div style="margin-bottom:20px;">
        <div style="font-family:'Roboto Mono',monospace;font-size:10px;color:${marginLabelColor};margin-bottom:8px;letter-spacing:0.5px;">${marginLabel}</div>
        <div style="position:relative;height:20px;background:rgba(255,255,255,0.04);border-radius:5px;overflow:hidden;">
          <div style="position:absolute;left:0;top:0;bottom:0;width:${breakEvenBarPct}%;background:rgba(60,179,113,0.30);border-radius:5px 0 0 5px;"></div>
          <div style="position:absolute;left:${breakEvenBarPct}%;top:0;bottom:0;width:${marginBarPct}%;background:rgba(60,179,113,0.50);border-radius:0 5px 5px 0;"></div>
          <div style="position:absolute;left:${breakEvenBarPct}%;top:-3px;bottom:-3px;width:2px;background:#D4AF37;box-shadow:0 0 6px rgba(212,175,55,0.40);transform:translateX(-1px);"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:5px;">
          <span style="font-family:'Roboto Mono',monospace;font-size:9px;color:rgba(255,255,255,0.35);">Break-even: ${formatCurrency(breakEvenRevenue)}</span>
          <span style="font-family:'Roboto Mono',monospace;font-size:9px;color:rgba(255,255,255,0.35);">Modeled: ${formatCurrency(revenue)}</span>
        </div>
      </div>

      <!-- Margin prose -->
      <div style="font-family:'Inter',sans-serif;font-size:11px;color:rgba(250,248,244,0.60);line-height:1.6;font-style:italic;margin-bottom:24px;">${marginProse}</div>

      <!-- Gold divider -->
      <div style="height:1px;background:linear-gradient(90deg,rgba(212,175,55,0.20),transparent);margin-bottom:24px;"></div>

      <!-- Scenario Stress Test -->
      <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:rgba(250,248,244,0.90);letter-spacing:1px;margin-bottom:6px;">SCENARIO STRESS TEST</div>
      <div style="font-family:'Inter',sans-serif;font-size:11px;color:rgba(250,248,244,0.50);font-style:italic;margin-bottom:16px;">What happens when the acquisition price drops.</div>

      <!-- Scenario table -->
      <div style="background:#1A1A1C;border:1px solid rgba(212,175,55,0.12);border-radius:6px;overflow:hidden;margin-bottom:16px;">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 20px;background:rgba(255,255,255,0.02);">
          <span style="font-family:'Roboto Mono',monospace;font-size:9px;color:rgba(255,255,255,0.50);text-transform:uppercase;letter-spacing:1.5px;">Price Scenario</span>
          <div style="display:flex;gap:24px;">
            <span style="font-family:'Roboto Mono',monospace;font-size:9px;color:rgba(255,255,255,0.50);text-transform:uppercase;letter-spacing:1.5px;min-width:60px;text-align:right;">Recoup</span>
            <span style="font-family:'Roboto Mono',monospace;font-size:9px;color:rgba(255,255,255,0.50);text-transform:uppercase;letter-spacing:1.5px;min-width:60px;text-align:right;">Multiple</span>
          </div>
        </div>
        ${scenarioRow(revenue, 'MODELED', true, modeledResult)}
        ${scenarioRow(revenue * 0.85, '−15%', false, scenarioMinus15)}
        ${scenarioRow(revenue * 0.70, '−30%', false, scenarioMinus30)}
        ${scenarioRow(revenue * 0.50, '−50%', false, scenarioMinus50)}
      </div>

      <!-- Interpretation -->
      <div style="font-family:'Inter',sans-serif;font-size:11px;color:rgba(250,248,244,0.60);line-height:1.65;margin-bottom:20px;">${scenarioInterpretation}</div>

      <!-- Spacer -->
      <div style="flex:1;"></div>

      <!-- Assumptions line -->
      <div style="font-family:'Roboto Mono',monospace;font-size:9px;color:rgba(250,248,244,0.38);line-height:1.5;">${assumptionsLine}</div>

    </div>

    ${FOOTER}
  </div>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────
// PAGE 6 — THE VERDICT
// ─────────────────────────────────────────────────────────

function page6(data: SnapshotData): string {
  const { project, inputs, result, tiers, computed } = data;

  const profitSplitPct = Math.max(0, Math.min(100, inputs.profitSplit ?? 50));
  const producerSplitPct = 100 - profitSplitPct;
  const safeMultiple = isFinite(result.multiple) && !isNaN(result.multiple) ? result.multiple : 0;
  const { cashBasis } = computed;
  const revenue = inputs.revenue;

  // Verdict determination
  let verdictText = '';
  let verdictColor = '';
  if (result.recoupPct >= 100 && safeMultiple >= 1.0) {
    verdictText = 'FUNDED';
    verdictColor = '#3CB371';
  } else if (result.recoupPct >= 50) {
    verdictText = 'PARTIAL';
    verdictColor = '#F0A830';
  } else {
    verdictText = 'SHORTFALL';
    verdictColor = 'rgba(220,38,38,0.85)';
  }

  const multipleColor = getMultipleColor(safeMultiple);

  // Scenario stress for summary prose (same logic as page 5)
  const variableOffTops = result.cam + result.salesFee + result.guilds;
  const fixedOffTops = result.marketing;
  const variableOffTopRate = revenue > 0 ? variableOffTops / revenue : 0;
  const totalHurdleAmount = result.seniorDebtHurdle + result.mezzDebtHurdle + result.equityHurdle + inputs.deferments - result.creditsApplied;

  function calcScenario(price: number): { recoupPct: number; mult: number } {
    const newVarOff = price * variableOffTopRate;
    const newOff = newVarOff + fixedOffTops;
    const newDist = Math.max(0, price - newOff + result.creditsApplied);
    const recoupPct = totalHurdleAmount > 0 ? Math.min(100, (newDist / totalHurdleAmount) * 100) : 0;
    const mult = cashBasis > 0 ? newDist / cashBasis : 0;
    return { recoupPct: Math.round(recoupPct), mult: parseFloat(mult.toFixed(2)) };
  }

  const scenarioMinus15 = calcScenario(revenue * 0.85);
  const scenarioMinus30 = calcScenario(revenue * 0.70);
  const scenarioMinus50 = calcScenario(revenue * 0.50);

  // Summary prose
  let summaryProse = '';
  if (safeMultiple >= 1.0) {
    summaryProse = `At the modeled price, the deal returns ${safeMultiple.toFixed(2)}x with all capital tiers fully funded.`;
    if (scenarioMinus15.recoupPct >= 100) {
      summaryProse += ` A 15% haircut still delivers full recoupment at ${scenarioMinus15.mult.toFixed(2)}x.`;
    }
    if (scenarioMinus30.mult >= 1.0) {
      summaryProse += ` The structure survives a 30% reduction while maintaining investor returns above 1.0x.`;
    }
    if (scenarioMinus50.recoupPct < 100) {
      summaryProse += ` At a 50% discount, investors recover ${scenarioMinus50.recoupPct}% of capital.`;
    } else {
      summaryProse += ` The deal survives even a 50% price reduction with full capital recovery.`;
    }
  } else if (safeMultiple >= 0.5) {
    summaryProse = `At the modeled price, investors recoup ${Math.round(result.recoupPct)}% of capital. A 15% haircut reduces recovery to ${scenarioMinus15.recoupPct}%. A 50% reduction leaves ${scenarioMinus50.recoupPct}% recovery. The deal carries meaningful downside risk.`;
  } else {
    summaryProse = `The deal does not cover capital obligations at the modeled price — investors recover ${Math.round(result.recoupPct)}% of capital. A 15% haircut reduces recovery further to ${scenarioMinus15.recoupPct}%. Careful consideration of pricing assumptions is warranted.`;
  }

  // Waterfall narrative
  const tierCount = tiers.length;
  let largestTier = tiers.reduce((a, b) => (a.amount > b.amount ? a : b), { name: '', rate: '', amount: 0, remaining: 0 });
  const profitPool = result.profitPool > 0 ? result.profitPool : 0;
  const producerBackend = profitPool * (producerSplitPct / 100);

  let waterfallNarrative = `Revenue flows through the capital stack in ${tierCount} ${tierCount === 1 ? 'tier' : 'tiers'}.`;
  if (largestTier.amount > 0) {
    const largestPct = revenue > 0 ? Math.round((largestTier.amount / revenue) * 100) : 0;
    waterfallNarrative += ` ${largestTier.name} at ${formatFullCurrency(largestTier.amount)} (${largestPct}% of gross) holds first position.`;
  }
  if (profitPool > 0) {
    waterfallNarrative += ` After all obligations are met, ${formatFullCurrency(profitPool)} remains in the profit pool — split ${profitSplitPct}/${producerSplitPct}.`;
    if (producerBackend > 0) {
      waterfallNarrative += ` The producer's net backend is ${formatFullCurrency(producerBackend)}.`;
    }
  } else {
    waterfallNarrative += ` After obligations are applied, no backend profit remains at this acquisition price.`;
  }

  // Format date
  let displayDate = data.generatedAt;
  try {
    displayDate = new Date(data.generatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch (_) {}

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  ${FONTS}
  <style>${BASE_CSS}</style>
</head>
<body>
  <div class="page">
    ${GOLD_BAR}
    ${WATERMARK}
    ${pageHeader('PAGE 06')}

    <div style="flex:1;padding:0 36px 48px;position:relative;z-index:2;display:flex;flex-direction:column;">

      <!-- Project title -->
      <div style="font-family:'Roboto Mono',monospace;font-size:11px;color:rgba(212,175,55,0.45);text-transform:uppercase;letter-spacing:3px;margin-bottom:8px;">${project.title}</div>

      <!-- Gold rule -->
      <div style="width:40px;height:1px;background:rgba(212,175,55,0.30);margin-bottom:16px;"></div>

      <!-- Verdict strip -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:1px;background:rgba(212,175,55,0.06);border-radius:6px;overflow:hidden;margin-bottom:20px;">
        <div style="background:#1A1A1C;padding:14px 16px;">
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(212,175,55,0.35);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px;">Budget</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:18px;color:rgba(255,255,255,0.88);">${formatCurrency(inputs.budget)}</div>
        </div>
        <div style="background:#1A1A1C;padding:14px 16px;">
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(212,175,55,0.35);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px;">Acquisition</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:18px;color:rgba(255,255,255,0.88);">${formatCurrency(revenue)}</div>
        </div>
        <div style="background:#1A1A1C;padding:14px 16px;">
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(212,175,55,0.35);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px;">Multiple</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:18px;color:${multipleColor};">${safeMultiple.toFixed(2)}x</div>
        </div>
        <div style="background:#1A1A1C;padding:14px 16px;">
          <div style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(212,175,55,0.35);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px;">Verdict</div>
          <div style="font-family:'Roboto Mono',monospace;font-size:18px;color:${verdictColor};font-weight:600;">${verdictText}</div>
        </div>
      </div>

      <!-- Summary prose -->
      <div style="font-family:'Inter',sans-serif;font-size:12px;color:rgba(250,248,244,0.65);line-height:1.7;margin-bottom:24px;">${summaryProse}</div>

      <!-- Gold divider -->
      <div style="height:1px;background:linear-gradient(90deg,rgba(212,175,55,0.20),transparent);margin-bottom:24px;"></div>

      <!-- Waterfall narrative -->
      <div style="font-family:'Inter',sans-serif;font-size:11px;color:rgba(250,248,244,0.55);line-height:1.7;margin-bottom:20px;">${waterfallNarrative}</div>

      <!-- Spacer -->
      <div style="flex:1;"></div>

      <!-- Closer -->
      <div>
        <!-- Gold divider -->
        <div style="height:1px;background:linear-gradient(90deg,rgba(212,175,55,0.15),transparent);margin-bottom:16px;"></div>

        <!-- Prepared by -->
        <div style="font-family:'Roboto Mono',monospace;font-size:9px;color:rgba(212,175,55,0.40);letter-spacing:2px;margin-bottom:12px;">PREPARED USING</div>

        <!-- Brand -->
        <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:rgba(212,175,55,0.55);letter-spacing:2px;margin-bottom:3px;">FILMMAKER.OG</div>
        <div style="font-family:'Roboto Mono',monospace;font-size:10px;color:rgba(212,175,55,0.42);margin-bottom:12px;">filmmakerog.com</div>

        <!-- Seed -->
        <div style="font-family:'Inter',sans-serif;font-size:10px;color:rgba(250,248,244,0.40);font-style:italic;margin-bottom:12px;">This snapshot covers the base case. Full sensitivity analysis available at filmmakerog.com.</div>

        <!-- Date -->
        <div style="font-family:'Roboto Mono',monospace;font-size:9px;color:rgba(255,255,255,0.25);margin-bottom:6px;">${displayDate}</div>

        <!-- Disclaimer -->
        <div style="font-family:'Inter',sans-serif;font-size:8px;color:rgba(250,248,244,0.35);line-height:1.5;">This document is a financial model, not investment advice. All projections are based on user-provided inputs.</div>
      </div>

    </div>

    ${FOOTER}
  </div>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────

export function generatePdfHtml(data: SnapshotData): string {
  return [
    page1(data),
    page2(data),
    page3(data),
    page4(data),
    page5(data),
    page6(data),
  ].join('\n');
}
