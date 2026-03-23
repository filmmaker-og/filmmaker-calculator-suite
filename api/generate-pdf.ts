// api/generate-pdf.ts
// Vercel Serverless Function: generates a PDF from a waterfall snapshot
// GET /api/generate-pdf?id={snapshotId}
//
// Uses dynamic imports to avoid ESM/CJS module resolution issues
// with puppeteer-core and @sparticuz/chromium on Node 24 + "type": "module"

import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing snapshot id" });
  }

  try {
    // Dynamic imports — avoids top-level ESM/CJS resolution failures
    const { createClient } = await import("@supabase/supabase-js");
    const { generatePdfHtml } = await import("./_pdf-template.js");
    const chromiumModule = await import("@sparticuz/chromium");
    const puppeteerModule = await import("puppeteer-core");
    const chromium = chromiumModule.default;
    const puppeteer = puppeteerModule.default;

    // 1. Supabase client (server-side — uses process.env)
    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase env vars:", {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
      });
      return res.status(500).json({ error: "Server misconfigured" });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 2. Fetch snapshot
    const { data: snapshot, error: dbError } = await supabase
      .from("waterfall_snapshots")
      .select("*")
      .eq("id", id)
      .single();

    if (dbError || !snapshot) {
      return res.status(404).json({ error: "Snapshot not found" });
    }

    // 3. Generate HTML from snapshot data
    const html = generatePdfHtml(snapshot.snapshot_data);

    // 4. Launch Puppeteer with serverless Chromium
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 612, height: 792 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Wait for Google Fonts to load
    await page.evaluateHandle("document.fonts.ready");

    // 5. Render PDF
    const pdfBuffer = await page.pdf({
      width: "612px",
      height: "792px",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    await browser.close();

    // 6. Return PDF as file download
    const projectName = snapshot.project_name || "Waterfall_Snapshot";
    const safeFilename = projectName.replace(/[^a-zA-Z0-9_-]/g, "_");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeFilename}_Snapshot.pdf"`
    );
    res.setHeader("Cache-Control", "private, max-age=3600");
    return res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF generation error:", error);
    return res.status(500).json({
      error: "Failed to generate PDF",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
