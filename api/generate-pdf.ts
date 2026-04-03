// api/generate-pdf.ts
// Vercel Serverless Function: generates a PDF from a waterfall snapshot
// GET /api/generate-pdf?id={snapshotId}
//
// Requires Vercel env var: AWS_LAMBDA_JS_RUNTIME=nodejs20.x
// (set in Dashboard, not in code — chromium reads it on module load)

import type { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing snapshot id" });
  }

  try {
    // AUTH CHECK: Require user authentication
    const supabaseAuthUrl =
      process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseAuthKey =
      process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_URL
        ? process.env.VITE_SUPABASE_ANON_KEY
        : "";

    // Verify the requesting user is authenticated
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { createClient: createAuthClient } = await import("@supabase/supabase-js");
    const authClient = createAuthClient(supabaseAuthUrl, supabaseAuthKey);
    const { data: { user } } = await authClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const { generatePdfHtml } = await import("./_pdf-template.js");
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = (await import("puppeteer-core")).default;

    // Supabase client (server-side)
    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: "Server misconfigured: missing SUPABASE_SERVICE_ROLE_KEY" });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch snapshot
    const { data: snapshot, error: dbError } = await supabase
      .from("waterfall_snapshots")
      .select("*")
      .eq("id", id)
      // Verify the authenticated user owns this snapshot
      .eq("user_email", user.email)
      .single();

    if (dbError || !snapshot) {
      return res.status(404).json({ error: "Snapshot not found" });
    }

    // Generate HTML
    const html = generatePdfHtml(snapshot.snapshot_data);

    // Get chromium executable path — this extracts the binary to /tmp
    const executablePath = await chromium.executablePath();

    // Set LD_LIBRARY_PATH to the directory containing the chromium binary
    // This is the critical fix — the shared libraries (libnss3.so, etc.)
    // are extracted alongside the binary but the loader doesn't know
    // to look in /tmp for them
    const chromiumDir = path.dirname(executablePath);
    process.env.LD_LIBRARY_PATH = `${chromiumDir}:${process.env.LD_LIBRARY_PATH || ""}`;

    // Launch browser
    chromium.setHeadlessMode = true;
    chromium.setGraphicsMode = false;

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 612, height: 792 });
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.evaluateHandle("document.fonts.ready");

    const pdfBuffer = await page.pdf({
      width: "612px",
      height: "792px",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    await browser.close();

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
