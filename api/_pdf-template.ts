// api/_pdf-template.ts
// Generates the HTML string for the PDF snapshot
// Aligned to BRAND_SYSTEM v3.0 — gold + black + warm white, no purple

interface SnapshotData {
  project: {
    title: string;
    genre: string;
    logline: string;
    cast: string;
    director: string;
    producers: string;
    company: string;
    location: string;
  };
  inputs: {
    revenue: number;
    budget: number;
    credits: number;
    equity: number;
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
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n).toLocaleString('en-US')}`;
  return `$${n.toFixed(0)}`;
}

function formatFullCurrency(n: number): string {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function getReturnColor(pct: number): string {
  if (pct >= 100) return '#3CB371';
  if (pct >= 80) return '#F0A830';
  return '#DC2626';
}

export function generatePdfHtml(data: SnapshotData): string {
  const { project, inputs, result, tiers, computed } = data;

  const date = new Date(data.generatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const returnColor = getReturnColor(result.recoupPct);

  // Erosion segments
  const distPct = inputs.salesFee || 25;
  const paPct = inputs.revenue > 0 ? (inputs.salesExp / inputs.revenue) * 100 : 8;
  const remainPct = 100 - computed.erosionPct;

  // Build tier cards HTML — gold-rimmed badges, warm surfaces
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

  // Gate card builder — v3.0 compliant, no purple
  const gateCard = (
    badge: string,
    headline: string,
    desc: string,
    iconSvg: string,
    accentColor: string,
    accentGlow: string,
  ) =>
    `<div style="border-radius:8px;padding:32px 28px;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;border:1px solid rgba(212,175,55,0.15);border-top:1px solid rgba(255,255,255,0.08);background:#1A1A1C;box-shadow:0 4px 16px rgba(0,0,0,0.30);min-height:220px;">
      <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse 80% 50% at 50% 20%,${accentGlow} 0%,transparent 55%);pointer-events:none;"></div>
      <div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(212,175,55,0.35),transparent);"></div>
      <div style="width:44px;height:44px;border-radius:50%;border:1px solid ${accentColor};display:flex;align-items:center;justify-content:center;margin-bottom:14px;position:relative;z-index:1;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${iconSvg}</svg>
      </div>
      <div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:3px;text-transform:uppercase;border:1px solid ${accentColor};color:${accentColor};padding:4px 14px;border-radius:2px;margin-bottom:14px;position:relative;z-index:1;">${badge}</div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:22px;color:rgba(250,248,244,0.92);text-align:center;line-height:1.15;letter-spacing:1px;margin-bottom:10px;position:relative;z-index:1;">${headline}</div>
      <div style="font-family:'Inter',sans-serif;font-size:10.5px;color:rgba(250,248,244,0.55);text-align:center;line-height:1.75;max-width:320px;font-weight:300;margin-bottom:18px;position:relative;z-index:1;">${desc}</div>
      <div style="font-family:'Roboto Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:8px 20px;border-radius:3px;border:1px solid rgba(212,175,55,0.25);color:rgba(212,175,55,0.65);background:rgba(212,175,55,0.03);position:relative;z-index:1;">Available at filmmakerog.com</div>
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
    .watermark {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%,-50%) rotate(-35deg);
      font-family: 'Bebas Neue',sans-serif; font-size: 80px;
      letter-spacing: 20px; color: rgba(212,175,55,0.02);
      white-space: nowrap; pointer-events: none; z-index: 0;
    }
    .eyebrow {
      display: flex; align-items: center; justify-content: center;
      gap: 10px; margin-bottom: 14px;
    }
    .eyebrow .rule { flex: 1; height: 1px; background: rgba(212,175,55,0.35); }
    .eyebrow span {
      font-family: 'Roboto Mono',monospace; font-size: 9px;
      letter-spacing: 3px; text-transform: uppercase; color: #D4AF37;
      white-space: nowrap;
    }
    .section-divider {
      height: 1px;
      background: linear-gradient(to right, transparent 0%, rgba(212,175,55,0.35) 20%, rgba(212,175,55,0.40) 50%, rgba(212,175,55,0.35) 80%, transparent 100%);
      margin: 0 36px;
    }
    .gold-break {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent);
      margin: 16px 48px;
    }
    .footer {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0 36px; position: absolute; bottom: 16px; left: 0; right: 0;
    }
    .footer-brand {
      font-family: 'Bebas Neue',sans-serif; font-size: 9px;
      letter-spacing: 4px; color: rgba(212,175,55,0.2);
    }
    .footer-page {
      font-family: 'Roboto Mono',monospace; font-size: 8px;
      color: rgba(255,255,255,0.2);
    }
  </style>
</head>
<body>

  <!-- PAGE 1: COVER -->
  <div class="page" style="display:flex;flex-direction:column;padding:0;">
    <div style="position:absolute;top:0;left:0;right:0;height:300px;background:radial-gradient(ellipse 80% 50% at 50% 10%,rgba(212,175,55,0.10) 0%,transparent 60%);pointer-events:none;"></div>
    <div style="position:absolute;bottom:0;left:0;right:0;height:250px;background:radial-gradient(ellipse 100% 70% at 50% 100%,rgba(212,175,55,0.06) 0%,transparent 60%);pointer-events:none;"></div>

    <div style="margin:100px 36px 0;padding:32px 28px 28px;border-radius:8px;background:#1A1A1C;border:1px solid rgba(212,175,55,0.15);border-top:1px solid rgba(255,255,255,0.08);box-shadow:0 4px 16px rgba(0,0,0,0.30);position:relative;overflow:hidden;z-index:5;">
      <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse 80% 50% at 50% 10%,rgba(212,175,55,0.10) 0%,transparent 60%);pointer-events:none;"></div>
      <div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(212,175,55,0.45),transparent);z-index:3;"></div>

      <div style="font-family:'Roboto Mono',monospace;font-size:9px;letter-spacing:5px;color:rgba(212,175,55,0.60);text-transform:uppercase;text-align:center;margin-bottom:16px;position:relative;z-index:2;">Waterfall Snapshot</div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:48px;color:#fff;line-height:0.95;letter-spacing:2px;text-align:center;margin-bottom:10px;position:relative;z-index:2;">${project.title.toUpperCase()}</div>
      <div style="font-family:'Inter',sans-serif;font-size:12px;color:rgba(250,248,244,0.55);font-weight:300;line-height:1.7;text-align:center;margin-bottom:24px;position:relative;z-index:2;padding:0 12px;">Recoupment waterfall analysis for a ${formatCurrency(inputs.budget)} independent feature film</div>

      <div style="padding:0 8px;margin-bottom:0;position:relative;z-index:2;">
        <div class="eyebrow"><div class="rule"></div><span>Project Details</span><div class="rule"></div></div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(212,175,55,0.10);border-radius:8px;overflow:hidden;position:relative;z-index:2;">
        <div style="background:#232326;padding:14px 16px;"><div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2.5px;color:rgba(212,175,55,0.45);text-transform:uppercase;margin-bottom:4px;">Genre</div><div style="font-family:'Inter',sans-serif;font-size:13px;color:rgba(250,248,244,0.88);font-weight:500;">${project.genre}</div></div>
        <div style="background:#232326;padding:14px 16px;"><div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2.5px;color:rgba(212,175,55,0.45);text-transform:uppercase;margin-bottom:4px;">Total Budget</div><div style="font-family:'Inter',sans-serif;font-size:13px;color:rgba(250,248,244,0.88);font-weight:500;">${formatFullCurrency(inputs.budget)}</div></div>
        <div style="background:#232326;padding:14px 16px;"><div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2.5px;color:rgba(212,175,55,0.45);text-transform:uppercase;margin-bottom:4px;">Cast</div><div style="font-family:'Inter',sans-serif;font-size:13px;color:rgba(250,248,244,0.88);font-weight:500;">${project.cast || 'Not specified'}</div></div>
        <div style="background:#232326;padding:14px 16px;"><div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2.5px;color:rgba(212,175,55,0.45);text-transform:uppercase;margin-bottom:4px;">Location</div><div style="font-family:'Inter',sans-serif;font-size:13px;color:rgba(250,248,244,0.88);font-weight:500;">${project.location || 'Not specified'}</div></div>
      </div>
    </div>

    <!-- KPI row -->
    <div style="display:flex;gap:8px;margin:20px 36px 0;position:relative;z-index:5;">
      <div style="flex:1;padding:14px 12px;background:#232326;border:1px solid rgba(212,175,55,0.12);border-top:1px solid rgba(255,255,255,0.04);border-radius:8px;text-align:center;">
        <div style="font-family:'Roboto Mono',monospace;font-size:7.5px;letter-spacing:2px;color:rgba(212,175,55,0.45);text-transform:uppercase;margin-bottom:6px;">Investor ROI</div>
        <div style="font-family:'Roboto Mono',monospace;font-size:20px;font-weight:500;color:${returnColor};">${computed.investorROI.toFixed(1)}%</div>
        <div style="font-family:'Inter',sans-serif;font-size:9px;color:rgba(250,248,244,0.35);margin-top:3px;font-weight:300;">Cash-on-cash</div>
      </div>
      <div style="flex:1;padding:14px 12px;background:#232326;border:1px solid rgba(212,175,55,0.12);border-top:1px solid rgba(255,255,255,0.04);border-radius:8px;text-align:center;">
        <div style="font-family:'Roboto Mono',monospace;font-size:7.5px;letter-spacing:2px;color:rgba(212,175,55,0.45);text-transform:uppercase;margin-bottom:6px;">Break-Even</div>
        <div style="font-family:'Roboto Mono',monospace;font-size:20px;font-weight:500;color:#F0A830;">${formatCurrency(computed.breakEvenRevenue)}</div>
        <div style="font-family:'Inter',sans-serif;font-size:9px;color:rgba(250,248,244,0.35);margin-top:3px;font-weight:300;">Revenue needed</div>
      </div>
      <div style="flex:1;padding:14px 12px;background:#232326;border:1px solid rgba(212,175,55,0.12);border-top:1px solid rgba(255,255,255,0.04);border-radius:8px;text-align:center;">
        <div style="font-family:'Roboto Mono',monospace;font-size:7.5px;letter-spacing:2px;color:rgba(212,175,55,0.45);text-transform:uppercase;margin-bottom:6px;">Producer Net</div>
        <div style="font-family:'Roboto Mono',monospace;font-size:20px;font-weight:500;color:#D4AF37;">${formatCurrency(result.producer)}</div>
        <div style="font-family:'Inter',sans-serif;font-size:9px;color:rgba(250,248,244,0.35);margin-top:3px;font-weight:300;">After all tiers</div>
      </div>
    </div>

    <div style="position:absolute;bottom:44px;left:0;right:0;text-align:center;z-index:5;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:6px;color:rgba(212,175,55,0.35);">FILMMAKER.OG</div>
      <div style="font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(255,255,255,0.2);letter-spacing:1.5px;margin-top:4px;">${date}</div>
    </div>
    <div style="position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(to right,transparent 0%,rgba(212,175,55,0.40) 50%,transparent 100%);z-index:10;"></div>
  </div>

  <!-- PAGE 2: WATERFALL -->
  <div class="page">
    <div class="watermark">FILMMAKER.OG</div>
    <div style="padding:0 36px;margin-bottom:4px;position:relative;z-index:2;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <div class="footer-brand">FILMMAKER.OG</div>
        <div class="footer-page">PAGE 02</div>
      </div>
      <div class="eyebrow"><div class="rule"></div><span>How The Money Flows</span><div class="rule"></div></div>
    </div>

    <div style="padding:16px 36px 0;position:relative;z-index:2;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:rgba(220,38,38,0.9);letter-spacing:1px;margin-bottom:4px;">-${computed.erosionPct.toFixed(1)}%</div>
      <div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.4);text-transform:uppercase;margin-bottom:12px;">Total Off-The-Top Erosion</div>
      <div style="height:28px;border-radius:4px;overflow:hidden;display:flex;border:1px solid rgba(220,38,38,0.15);">
        <div style="height:100%;background:rgba(220,38,38,0.45);width:${Math.min(distPct, 40)}%;display:flex;align-items:center;justify-content:center;font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(255,255,255,0.7);">${Math.round(distPct)}%</div>
        <div style="height:100%;background:rgba(220,38,38,0.30);width:${Math.min(paPct, 20)}%;display:flex;align-items:center;justify-content:center;font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(255,255,255,0.7);">${Math.round(paPct)}%</div>
        <div style="height:100%;background:rgba(60,179,113,0.15);width:${Math.max(remainPct, 20)}%;display:flex;align-items:center;justify-content:center;font-family:'Roboto Mono',monospace;font-size:8px;color:rgba(255,255,255,0.7);">${Math.round(remainPct)}%</div>
      </div>
    </div>

    <div class="gold-break"></div>

    <div style="padding:0 36px;position:relative;z-index:2;">
      ${tierCardsHtml}
    </div>

    <div style="margin:16px 36px 0;padding:14px 16px;border-radius:8px;border:1px solid rgba(60,179,113,0.35);border-top:1px solid rgba(60,179,113,0.15);background:#232326;box-shadow:0 0 20px rgba(60,179,113,0.06);display:flex;justify-content:space-between;align-items:center;position:relative;z-index:2;overflow:hidden;">
      <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse at 50% 0%,rgba(60,179,113,0.08) 0%,transparent 70%);pointer-events:none;"></div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:#3CB371;letter-spacing:1px;position:relative;z-index:1;">Net Backend Profit</div>
      <div style="font-family:'Roboto Mono',monospace;font-size:20px;font-weight:500;color:#3CB371;position:relative;z-index:1;">${formatFullCurrency(result.producer)}</div>
    </div>

    <div class="footer">
      <div class="footer-brand">FILMMAKER.OG</div>
      <div class="footer-page">2 / 5</div>
    </div>
  </div>

  <!-- PAGE 3: INVESTOR SUMMARY -->
  <div class="page">
    <div class="watermark">FILMMAKER.OG</div>
    <div style="padding:0 36px;margin-bottom:16px;position:relative;z-index:2;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <div class="footer-brand">FILMMAKER.OG</div>
        <div class="footer-page">PAGE 03</div>
      </div>
      <div class="eyebrow"><div class="rule"></div><span>Investor Returns</span><div class="rule"></div></div>
    </div>

    <div style="padding:0 36px;position:relative;z-index:2;">
      <div style="border-radius:8px;background:#1A1A1C;border:1px solid rgba(212,175,55,0.15);border-top:1px solid rgba(255,255,255,0.08);padding:24px;margin-bottom:16px;position:relative;overflow:hidden;">
        <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(180deg,rgba(212,175,55,0.06),#232326);pointer-events:none;border-radius:8px;"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;position:relative;z-index:1;">
          <div>
            <div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2px;color:rgba(212,175,55,0.45);text-transform:uppercase;margin-bottom:6px;">Total Investment</div>
            <div style="font-family:'Roboto Mono',monospace;font-size:22px;font-weight:500;color:rgba(250,248,244,0.92);">${formatFullCurrency(inputs.equity)}</div>
          </div>
          <div>
            <div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2px;color:rgba(212,175,55,0.45);text-transform:uppercase;margin-bottom:6px;">Total Returned</div>
            <div style="font-family:'Roboto Mono',monospace;font-size:22px;font-weight:500;color:${returnColor};">${formatFullCurrency(result.investor)}</div>
          </div>
          <div>
            <div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2px;color:rgba(212,175,55,0.45);text-transform:uppercase;margin-bottom:6px;">Return Multiple</div>
            <div style="font-family:'Roboto Mono',monospace;font-size:22px;font-weight:500;color:${returnColor};">${result.multiple.toFixed(2)}x</div>
          </div>
          <div>
            <div style="font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:2px;color:rgba(212,175,55,0.45);text-transform:uppercase;margin-bottom:6px;">Recoupment</div>
            <div style="font-family:'Roboto Mono',monospace;font-size:22px;font-weight:500;color:${returnColor};">${result.recoupPct.toFixed(0)}%</div>
          </div>
        </div>
      </div>

      <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:rgba(250,248,244,0.92);letter-spacing:1px;margin:24px 0 12px;">Assumptions</div>
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
              `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 16px;${
                i > 0 ? 'border-top:1px solid rgba(255,255,255,0.03);' : ''
              }">
            <span style="font-family:'Inter',sans-serif;font-size:11px;color:rgba(250,248,244,0.55);font-weight:400;">${label}</span>
            <span style="font-family:'Roboto Mono',monospace;font-size:11px;color:rgba(255,255,255,0.85);font-weight:500;">${value}</span>
          </div>`,
          )
          .join('')}
      </div>
    </div>

    <div class="section-divider" style="margin-top:24px;"></div>

    <div style="padding:24px 36px 0;position:relative;z-index:2;">
      ${gateCard(
        'The Full Analysis',
        'See How Your Deal Performs Under Pressure',
        'Multi-scenario sensitivity modeling, break-even analysis, and investor return projections across five revenue outcomes.',
        '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>',
        'rgba(212,175,55,0.55)',
        'rgba(212,175,55,0.06)',
      )}
    </div>

    <div class="footer">
      <div class="footer-brand">FILMMAKER.OG</div>
      <div class="footer-page">3 / 5</div>
    </div>
  </div>

  <!-- PAGE 4: GATE 2 + GATE 3 -->
  <div class="page">
    <div class="watermark">FILMMAKER.OG</div>
    <div style="padding:0 36px;margin-bottom:16px;position:relative;z-index:2;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <div class="footer-brand">FILMMAKER.OG</div>
        <div class="footer-page">PAGE 04</div>
      </div>
    </div>

    <div style="padding:0 36px;position:relative;z-index:2;margin-bottom:24px;">
      ${gateCard(
        'Comp Report',
        'Know What Your Film Is Worth Before You Shoot',
        'Five comparable transactions from the current market — matched by genre, budget range, and cast tier. Real deal data, not estimates.',
        '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>',
        'rgba(60,179,113,0.55)',
        'rgba(60,179,113,0.06)',
      )}
    </div>

    <div class="section-divider"></div>

    <div style="padding:24px 36px 0;position:relative;z-index:2;">
      ${gateCard(
        "The Producer's Package",
        'Your Investor Memo. Built to Close.',
        'Form intake, 10 market comps, lookbook, and a presentation-ready investment memo. Delivered in 3-5 business days.',
        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line>',
        'rgba(212,175,55,0.55)',
        'rgba(212,175,55,0.06)',
      )}
    </div>

    <div class="footer">
      <div class="footer-brand">FILMMAKER.OG</div>
      <div class="footer-page">4 / 5</div>
    </div>
  </div>

  <!-- PAGE 5: BACK PAGE -->
  <div class="page" style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
    <div style="position:absolute;top:0;left:0;right:0;height:300px;background:radial-gradient(ellipse 80% 50% at 50% 10%,rgba(212,175,55,0.08) 0%,transparent 60%);pointer-events:none;"></div>
    <div style="position:absolute;bottom:0;left:0;right:0;height:250px;background:radial-gradient(ellipse 100% 70% at 50% 100%,rgba(212,175,55,0.05) 0%,transparent 60%);pointer-events:none;"></div>

    <div style="text-align:center;position:relative;z-index:2;">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:8px;color:#D4AF37;margin-bottom:8px;">FILMMAKER.OG</div>
      <div style="width:48px;height:1px;background:linear-gradient(90deg,transparent,rgba(212,175,55,0.5),transparent);margin:0 auto 32px;"></div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:rgba(250,248,244,0.92);letter-spacing:1px;line-height:1.1;margin-bottom:12px;">YOUR INVESTORS<br>WILL ASK.</div>
      <div style="font-family:'Inter',sans-serif;font-size:13px;color:rgba(250,248,244,0.45);font-weight:300;line-height:1.7;max-width:380px;margin:0 auto 40px;">Run your numbers. Model your waterfall. Know your deal before you pitch it.</div>
      <div style="font-family:'Roboto Mono',monospace;font-size:11px;letter-spacing:2px;color:rgba(212,175,55,0.6);text-transform:uppercase;">filmmakerog.com</div>
    </div>

    <div class="footer">
      <div class="footer-brand">FILMMAKER.OG</div>
      <div class="footer-page">5 / 5</div>
    </div>
  </div>

</body>
</html>`;
}
