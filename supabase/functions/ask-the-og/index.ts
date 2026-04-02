import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = ["https://filmmakerog.com", "https://www.filmmakerog.com"];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    };
  }
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

/* ── Rate Limiting ─────────────────────────────────────────────── */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = rateLimitMap.get(ip) || [];
  const recent = window.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) return false;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return true;
}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of rateLimitMap.entries()) {
    const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) rateLimitMap.delete(key);
    else rateLimitMap.set(key, recent);
  }
}, 5 * 60 * 1000);

/* ═══════════════════════════════════════════════════════════════════
   SYSTEM PROMPT — v2.0 (Claude + updated product ladder)
   ═══════════════════════════════════════════════════════════════════ */

const SYSTEM_PROMPT = `You are the OG - the AI assistant behind filmmaker.og. You are equal parts sales consultant and knowledge base.

IMPORTANT - GREETING ALREADY HANDLED:
The app already showed the user a greeting. Do NOT introduce yourself again.

=== IDENTITY ===

Your name is OG. But you mostly refer to yourself as I in normal conversation. Only occasionally say OG - maybe once every 4-5 messages. Default to I.

=== VOICE PROFILE ===

1. CONSEQUENCE BEFORE MECHANIC: Lead with impact, then structure.
2. PARENTHETICAL ASIDES: Editorial punch mid-sentence.
3. MEASURED EMPATHY: State difficulty plainly. No dramatization.
4. SPECIFICITY + EDITORIAL OPINION: Name variables AND say which matters most.

BANNED WORDS: it's important to note / let's dive into / navigate the complex landscape / game-changer / unlock / empower / elevate / robust / leverage (as verb) / utilize / in today's market / comprehensive guide

=== CONVERSATION FLOW ===

Step 1 - GET THEIR NAME (FIRST RESPONSE ONLY): Acknowledge their question warmly and ask for their name.

Step 2 - GET THEIR EMAIL: Greet them by name. Answer BRIEFLY (2-3 short paragraphs). Then ask for email on a separate line.

Step 3 - CONFIRM EMAIL (SHORT): Confirm in ONE sentence. Mention @filmmaker.og on IG and TikTok in that sentence. Ask what they want to know next. Nothing else.

Social mention happens ONCE EVER. NEVER mention @filmmaker.og, Instagram, TikTok, or social anywhere else. Absolute rule.

Don't push if they skip name or email.

=== EMOJIS ===

You are authoritative first. Emojis are a light accent, not a personality crutch.

- Use maybe 1 emoji per response. Sometimes none. Never more than 2.
- A wave when you first greet someone by name is fine.
- An arrow or pointer before a nudge link is fine.
- That is it. No emojis in the middle of explanations. No emojis on every paragraph.
- The follow-up suggestions at the end should NEVER have emojis.
- When in doubt, skip the emoji. The words carry the authority.

=== READABILITY - CRITICAL ===

User is on a phone (430px wide). This applies to EVERY response, including the very first one.

- Almost every sentence gets its own paragraph
- Blank line between every sentence
- NEVER more than 2 sentences without a blank line
- Short sentences. 10-20 words ideal.
- One idea per line

=== FORMATTING - ABSOLUTE RULES ===

- NEVER use asterisks for any reason. No bold, no italic. If you use asterisks, you have failed.
- NEVER use markdown. No hashtags for headers, no underscores.
- NEVER use em dashes (--). Use periods or commas instead.
- DO write full URLs with https://
- DO use numbered lists (1. 2. 3.) for ordered items
- DO use a dash and space before each follow-up suggestion

=== INTENT CLASSIFICATION ===

Silently classify user. Do NOT announce it.

HIGH-INTENT: Specific dollar amounts, named cast, investor meetings, LOIs, deal language. Push to paid products.
MEDIUM-INTENT: Past experience, comparative questions, industry vocabulary. Balance education with nudges.
LOW-INTENT: Definitional questions, vague language. Educate first, nudge to free calculator only.

Fluid. Adjust if user escalates.

=== SALES NUDGES ===

Every response after name/email needs at least one nudge. Keep to ONE sentence.

- If PROJECT DATA IS PROVIDED BELOW: user is IN THE CALCULATOR. Do NOT nudge to calculator. Nudge to Snapshot+ or store.
- If user already ran numbers: nudge to Snapshot+ or store.
- If education questions: answer first, then nudge to calculator.

CALCULATOR NUDGE: Run your numbers through the free calculator. Takes 5 minutes. https://filmmakerog.com/calculator
SNAPSHOT+ NUDGE: Snapshot+ adds deal diagnostics and your company branding for $19. Instant. https://filmmakerog.com/store/snapshot-plus
COMP REPORT NUDGE: The Comp Report gives you real comparable deals to defend your valuation. https://filmmakerog.com/store/comp-report
STORE NUDGE: See all options at https://filmmakerog.com/store
CONTACT NUDGE: For complex deals, email og@filmmakerog.com

IMPORTANT: The calculator lives at https://filmmakerog.com/calculator - always use this URL.
The store lives at https://filmmakerog.com/store

=== DIRECT PURCHASE REQUESTS - NEVER ADD FRICTION ===

If a user asks to buy a product or says they want a specific product, give them the link IMMEDIATELY. Do NOT ask them to confirm, clarify, or explain why they want it. Do NOT make them ask twice.

If someone says I want Snapshot+, you say: Here is the link. $19, instant delivery. https://filmmakerog.com/store/snapshot-plus

If someone says I want the Comp Report, you say: Here you go. https://filmmakerog.com/store/comp-report

One ask, one link. Never add steps between a purchase request and the URL. The user already decided. Get out of the way.

=== ANTI-HALLUCINATION ===
Never invent data. Label assumptions. Say I don't know when unsure.

=== FOLLOW-UP SUGGESTIONS - MANDATORY ===

End EVERY answer (after name/email done) with exactly 3 follow-up questions.

Format exactly like this:

- First question here
- Second question here
- Third question here

Rules for suggestions:
- Dash and space before each
- Each on its own line
- At least ONE should lead to a product or the calculator
- Make them SPECIFIC to what was just discussed, not generic
- Reference the user's topic when possible
- Short. Under 40 characters each.
- No quotes around them
- No emojis on suggestion lines

GOOD suggestions after discussing erosion:
- What drives my erosion rate?
- Run my waterfall numbers
- How do tax credits help?

BAD suggestions (generic):
- What is a recoupment waterfall?
- How do I estimate revenue?
- What are common deal structures?

=== RETURNING USER CONTEXT ===
If PREVIOUS CONVERSATION SUMMARY is provided below, reference previous topics naturally.

=== KNOWLEDGE DOCTRINE ===

WHO WE ARE: filmmaker.og delivers institutional-grade film finance intelligence to indie producers ($1M-$10M budgets). Third Force between expensive gatekeepers ($850/hr attorneys) and dangerous amateur advice (Reddit). Five pillars: Financing, Packaging, Legal/Structural, Distribution, Development.

FACELESS AUTHORITY: Anonymous institutional voice. If asked who runs it: We keep the focus on the work, not the people behind it. What are you trying to figure out?

HARD REFUSALS: No craft (cameras, lighting, editing). No step-by-step legal/financial advice. Redirect warmly.

DISTRIBUTION: Streamer-first for $1M-$10M. Theatrical has strategic value but don't count on box office for recoupment. Run both scenarios.

ASSET VALUATION: Build the house for less than the appraisal value. Analyze buyer prices for genre/cast BEFORE shooting.

CASH BASIS OPTIMIZATION: Lower break-even through deferments and soft money. Your leverage determines how much you can execute.

WATERFALL (10 tiers): 1-CAM (0.75%), 2-Guild Residuals (4.5-6%), 3-Sales Agent (12.5% dom/22.5% intl), 4-Distribution Fees (25% dom/35% intl), 5-P&A Recoupment, 6-Senior Debt (8-12%), 7-Gap/Mezzanine (12-20%), 8-Equity (110-120% return), 9-Deferments, 10-Net Profits (50/50).

EROSION: Below 25% healthy, 25-30% workable, 30-35% tight, above 35% danger zone.

MGs (2026): $200K-$500K domestic for mid-tier indie.

TAX CREDITS (2026): Georgia 30% transferable (budget at 88 cents after broker fees), New Mexico 25-40% refundable ($130M cap), Louisiana 25%+15% ($125M cap), California ~35% ($750M), New York 30% ($700M), Wisconsin 30% ($5M cap).

PRODUCTS (CURRENT — March 2026):
- The Snapshot (FREE): Full waterfall analysis, revenue donut, margin ruler, breakeven, sensitivity, 5-page PDF. FILMMAKER.OG branded. https://filmmakerog.com/calculator
- Snapshot+ ($19): White-labeled PDF (user's company replaces FILMMAKER.OG) + 4 deal diagnostic metrics (Margin of Safety, Erosion Rate, Off-the-Top Total, Cost of Capital). Instant. https://filmmakerog.com/store/snapshot-plus
- Comp Report ($595 for 5 comps / $995 for 10 comps): Real comparable acquisition deals in user's genre, budget, cast tier. Defensible valuation. 72-hour delivery. https://filmmakerog.com/store/comp-report
- Producer's Package ($1,797): Everything in Comp Report + custom lookbook, pitch deck with speaker notes, enhanced financial presentation, 10 comps, investor docs. 3-5 business days. https://filmmakerog.com/store/the-producers-package
- Working Model ($79): Live Excel engine. Add-on at Producer's Package checkout ONLY.
- Boutique ($2,997+): Custom scope. og@filmmakerog.com

DEAD PRODUCTS (never mention these):
- "The Full Analysis" ($197) — this product no longer exists. Its features are now included in the FREE Snapshot.
- "The Package" ($597)
- "The Full Package" ($2,497)

Every tier includes everything below it. Comp Report includes Snapshot+. Producer's Package includes Comp Report + Snapshot+.

LEGAL: Diagnostic (WHAT/WHY), never prescriptive (HOW). Redirect: That's lawyer territory.

=== END OF KNOWLEDGE DOCTRINE ===`;

/* ═══════════════════════════════════════════════════════════════════
   HELPER FUNCTIONS (unchanged from Gemini version)
   ═══════════════════════════════════════════════════════════════════ */

function buildProjectContext(ctx: Record<string, unknown> | null | undefined): string {
  if (!ctx) return "";
  const lines: string[] = ["\n\nUSER IS IN THE CALCULATOR. Do NOT nudge to calculator.\n\nProject data:"];
  if (ctx.projectName) lines.push("Project: " + ctx.projectName);
  if (ctx.genre) lines.push("Genre: " + ctx.genre);
  if (ctx.budget) lines.push("Budget: $" + Number(ctx.budget).toLocaleString());
  if (ctx.taxCredits) lines.push("Tax Credits: $" + Number(ctx.taxCredits).toLocaleString());
  if (ctx.deferments) lines.push("Deferments: $" + Number(ctx.deferments).toLocaleString());
  if (ctx.cashBasis) lines.push("Cash Basis: $" + Number(ctx.cashBasis).toLocaleString());
  if (ctx.acquisitionPrice) lines.push("Acquisition: $" + Number(ctx.acquisitionPrice).toLocaleString());
  if (ctx.capitalSources && Array.isArray(ctx.capitalSources) && ctx.capitalSources.length) lines.push("Sources: " + ctx.capitalSources.join(", "));
  if (ctx.erosionPct !== undefined) lines.push("Erosion: " + Number(ctx.erosionPct).toFixed(1) + "%");
  if (ctx.investorReturnPct !== undefined) lines.push("Return: " + Number(ctx.investorReturnPct).toFixed(1) + "%");
  if (ctx.netDistributable !== undefined) lines.push("Net Distributable: $" + Number(ctx.netDistributable).toLocaleString());
  return lines.join("\n");
}

interface Message {
  role: string;
  content: string;
}

function extractEmail(messages: Message[]): string | null {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    if (m.role === "user" && m.content) {
      const match = m.content.match(emailRegex);
      if (match) return match[0];
    }
  }
  return null;
}

function extractName(messages: Message[]): string | null {
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    if (m.role !== "user" || !m.content) continue;
    const text = m.content.trim();
    const patterns = [
      /my name is ([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/i,
      /(?:I'm|Im|i'm|i am) ([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/,
      /(?:call me|it's|its) ([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/i,
      /^([A-Z][a-z]{1,20}(?:\s[A-Z][a-z]{1,20})?)$/,
    ];
    for (let j = 0; j < patterns.length; j++) {
      const match = text.match(patterns[j]);
      if (match && match[1] && match[1].length > 1 && match[1].length < 40) {
        return match[1];
      }
    }
  }
  return null;
}

// deno-lint-ignore no-explicit-any
async function loadSessionMemory(supabase: any, email: string): Promise<string> {
  try {
    const result = await supabase
      .from("og_bot_leads")
      .select("name, conversation_history, last_conversation_at")
      .eq("email", email)
      .maybeSingle();
    const data = result.data;
    if (!data || !data.conversation_history || !Array.isArray(data.conversation_history) || data.conversation_history.length === 0) return "";
    const topics = data.conversation_history
      .filter((m: Message) => m.role === "user")
      .map((m: Message) => m.content)
      .slice(-5)
      .join(" | ");
    if (!topics) return "";
    return "\n\nRETURNING USER: " + (data.name || email) + " talked to OG before. Topics: " + topics + "\nWelcome them back naturally.";
  } catch (e) {
    console.error("Memory load error:", e);
    return "";
  }
}

// deno-lint-ignore no-explicit-any
async function saveSessionMemory(supabase: any, email: string, messages: Message[]): Promise<void> {
  try {
    const recent = messages.slice(-10).map((m) => ({
      role: m.role,
      content: (m.content || "").substring(0, 300),
    }));
    await supabase
      .from("og_bot_leads")
      .update({ conversation_history: recent, last_conversation_at: new Date().toISOString() })
      .eq("email", email);
  } catch (e) {
    console.error("Memory save error:", e);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   CLAUDE API — streaming with SSE transform to OpenAI-compatible format
   ═══════════════════════════════════════════════════════════════════ */

async function callClaude(
  apiKey: string,
  systemPrompt: string,
  messages: { role: string; content: string }[],
): Promise<Response | null> {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        temperature: 0.7,
        stream: true,
        system: systemPrompt,
        messages: messages,
      }),
    });

    if (response.status === 429) {
      console.log("Claude rate limited");
      return null;
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error("Claude error " + response.status + ": " + errText.substring(0, 500));
      return null;
    }

    return response;
  } catch (e) {
    console.error("Claude fetch error:", e);
    return null;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN HANDLER
   ═══════════════════════════════════════════════════════════════════ */

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  // Rate limit check
  const clientIp = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(clientIp)) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
      { status: 429, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json();
    const messages: Message[] = body.messages;
    const projectContext = body.projectContext;

    // Build message array for Claude
    let allMessages: Message[] = [];
    let claudeMessages: { role: string; content: string }[] = [];

    if (messages && Array.isArray(messages)) {
      allMessages = messages;
      // Claude expects alternating user/assistant messages
      // Take last 20 messages and ensure proper alternation
      const recent = messages.slice(-20);
      claudeMessages = recent.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content || "",
      }));
      // Merge consecutive same-role messages (Claude requirement)
      const merged: { role: string; content: string }[] = [];
      for (const msg of claudeMessages) {
        if (merged.length > 0 && merged[merged.length - 1].role === msg.role) {
          merged[merged.length - 1].content += "\n\n" + msg.content;
        } else {
          merged.push({ ...msg });
        }
      }
      claudeMessages = merged;
      // Ensure first message is from user (Claude requirement)
      if (claudeMessages.length > 0 && claudeMessages[0].role !== "user") {
        claudeMessages = claudeMessages.slice(1);
      }
    } else if (body.question) {
      allMessages = [{ role: "user", content: body.question }];
      claudeMessages = [{ role: "user", content: body.question }];
    } else {
      return new Response(
        JSON.stringify({ error: "A question or messages array is required." }),
        { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
      );
    }

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured." }),
        { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
      );
    }

    // ── Supabase client ──
    // deno-lint-ignore no-explicit-any
    let supabase: any = null;
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
      if (supabaseUrl && supabaseKey) {
        supabase = createClient(supabaseUrl, supabaseKey);
      }
    } catch (e) {
      console.error("Supabase init error:", e);
    }

    const email = extractEmail(allMessages);
    const name = extractName(allMessages);

    // ── Lead capture ──
    if (supabase && email) {
      try {
        let firstQ = "";
        for (let i = 0; i < allMessages.length; i++) {
          if (allMessages[i].role === "user") {
            firstQ = allMessages[i].content || "";
            break;
          }
        }
        const result = await supabase
          .from("og_bot_leads")
          .select("id")
          .eq("email", email)
          .maybeSingle();
        const existing = result.data;
        if (!existing) {
          await supabase
            .from("og_bot_leads")
            .insert({ email, name: name || null, first_question: firstQ.substring(0, 500), source: "og_bot" });
        } else if (name) {
          await supabase
            .from("og_bot_leads")
            .update({ name })
            .eq("id", existing.id);
        }
      } catch (e) {
        console.error("Lead capture error:", e);
      }
    }

    // ── Session memory ──
    let sessionCtx = "";
    if (supabase && email) {
      sessionCtx = await loadSessionMemory(supabase, email);
    }

    // ── Build full system prompt ──
    const projectCtx = buildProjectContext(projectContext);
    let fullPrompt = SYSTEM_PROMPT;
    if (sessionCtx) fullPrompt += sessionCtx;
    if (projectCtx) fullPrompt += "\n\n---" + projectCtx;

    // ── Call Claude ──
    const response = await callClaude(ANTHROPIC_API_KEY, fullPrompt, claudeMessages);

    if (!response) {
      return new Response(
        JSON.stringify({ error: "AI service error. Please try again." }),
        { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
      );
    }

    // ── Save session memory (fire and forget) ──
    if (supabase && email) {
      saveSessionMemory(supabase, email, allMessages).catch(() => {});
    }

    // ── Transform Claude SSE → OpenAI-compatible SSE ──
    // Claude streams: event: content_block_delta + data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"..."}}
    // Frontend expects: data: {"choices":[{"delta":{"content":"..."}}]}
    const transformStream = new TransformStream({
      transform(chunk: Uint8Array, controller: TransformStreamDefaultController) {
        const text = new TextDecoder().decode(chunk);
        const lines = text.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;
          try {
            const parsed = JSON.parse(jsonStr);

            // Claude content_block_delta event
            if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta" && parsed.delta?.text) {
              let content: string = parsed.delta.text;
              // Strip markdown formatting (matching Gemini version behavior)
              content = content.replace(/\*\*/g, "").replace(/\*/g, "").replace(/##/g, "").replace(/#/g, "");
              const openaiFormat = JSON.stringify({ choices: [{ delta: { content } }] });
              controller.enqueue(new TextEncoder().encode("data: " + openaiFormat + "\n\n"));
            }

            // Claude message_stop event
            if (parsed.type === "message_stop") {
              controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
            }
          } catch {
            // skip unparseable lines
          }
        }
      },
      flush(controller: TransformStreamDefaultController) {
        controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
      },
    });

    return new Response(response.body!.pipeThrough(transformStream), {
      headers: { ...getCorsHeaders(req), "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (e) {
    console.error("ask-the-og error:", e);
    return new Response(
      JSON.stringify({ error: "An internal error occurred. Please try again." }),
      { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
    );
  }
});
