// api/generate-pdf.ts
// Vercel Serverless Function: generates a PDF from a waterfall snapshot
// Called by the frontend: GET /api/generate-pdf?id={snapshotId}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { generatePdfHtml } from './_pdf-template';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing snapshot id' });
  }

  try {
    // 1. Fetch snapshot from Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: snapshot, error: dbError } = await supabase
      .from('waterfall_snapshots')
      .select('*')
      .eq('id', id)
      .single();

    if (dbError || !snapshot) {
      return res.status(404).json({ error: 'Snapshot not found' });
    }

    // 2. Generate HTML
    const html = generatePdfHtml(snapshot.snapshot_data);

    // 3. Launch Puppeteer
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 612, height: 792 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    // 4. Generate PDF
    const pdfBuffer = await page.pdf({
      width: '612px',
      height: '792px',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await browser.close();

    // 5. Return PDF
    const projectName = snapshot.project_name || 'Waterfall_Snapshot';
    const safeFilename = projectName.replace(/[^a-zA-Z0-9-]/g, '_');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${safeFilename}_Snapshot.pdf"`,
    );
    res.setHeader('Cache-Control', 'private, max-age=3600');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}
