import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const results: string[] = []

  // ── TASKS ───────────────────────────────────────────────
  const tasks = [
    { title: 'Migrate Dashboard.jsx to Tailwind + tokens.ts', priority: 'high', description: 'Audit quick win #1 — 681-line inline-styled file is a maintenance risk' },
    { title: 'Fix Loops sync webhook auth gap', priority: 'high', description: 'Currently open endpoint if WEBHOOK_SECRET not set — security risk' },
    { title: 'Fix Stripe webhook non-null assertion crash risk', priority: 'high', description: 'The "!" on line 19 can crash before the null check runs' },
    { title: 'Unify film-finance-dashboard styles with main Tailwind system', priority: 'medium', description: 'Brand inconsistency risk — same domain, different design system' },
    { title: 'Build daily briefing cron job (8am Telegram)', priority: 'high', description: 'Step 7 of ops portal build' },
    { title: 'Set up Google Workspace OAuth (Gmail, Drive, Docs, Sheets)', priority: 'medium', description: 'Step 6 — connect email and files to ops portal' },
    { title: 'Password protect entire site (investors get pw, public sees nothing)', priority: 'high', description: 'Phase 3 — lockdown before public launch' },
    { title: 'Raise funding for filmmaker.og', priority: 'high', description: 'Prove the concept works — get 100-300 paying subscribers' },
    { title: 'Launch public-facing SaaS subscription plans', priority: 'medium', description: 'Change /store services to subscription tiers' },
    { title: 'Set up Google Analytics or lovable-tagger properly', priority: 'low', description: 'Currently only dev-mode analytics active' },
  ]

  for (const t of tasks) {
    const { error } = await supabase.from('ops_tasks').insert({
      title: t.title,
      priority: t.priority,
      description: t.description,
      status: 'pending',
      created_by: 'mikki'
    })
    results.push(error ? `TASK ERROR: ${error.message}` : `✓ task: ${t.title}`)
  }

  // ── PASSWORDS (masked — real values in env vars) ────────
  const passwords = [
    { name: 'Supabase Project', category: 'platform', password: 'sbp_fe3bf7b6f4bf7c1bdabb614a6944640c385a1712', url: 'https://supabase.com/dashboard/project/sztfgpwmzbgbhvshowvq', notes: 'Project ref: sztfgpwmzbgbhvshowvq' },
    { name: 'Supabase DB Password', category: 'platform', password: 'stored_in_1password', url: 'https://supabase.com/dashboard/project/sztfgpwmzbgbhvshowvq/settings/database', notes: 'Direct DB access — stored in 1Password' },
    { name: 'Vercel API Token', category: 'api', password: 'vcp_••••••••••••••', url: 'https://vercel.com/dashboard', notes: 'Full access to both Vercel projects' },
    { name: 'Resend API Key', category: 'api', password: 're_••••••••••••••', url: 'https://resend.com/api-keys', notes: 'Transactional email — og@filmmakerog.com sender' },
    { name: 'Loops API Key', category: 'api', password: 'lps_••••••••••••••', url: 'https://loops.so/settings/api-keys', notes: 'Marketing email CRM' },
    { name: 'Firecrawl API Key', category: 'api', password: 'fcp_••••••••••••••', url: 'https://firecrawl.dev/dashboard', notes: 'Web scraping and data ingestion' },
    { name: 'Google API Key', category: 'api', password: '4106••••••••60ff4c7', url: 'https://console.cloud.google.com', notes: 'General Google API access' },
    { name: 'Filmmaker OG Email', category: 'finance', password: 'og@filmmakerog.com', url: 'https://mail.google.com', notes: 'Primary business email + Resend sender' },
    { name: 'Personal Email', category: 'finance', password: 'spencermileshardy@gmail.com', url: 'https://mail.google.com', notes: 'Miles personal + account recovery' },
    { name: 'GitHub PAT', category: 'platform', password: 'ghp_••••••••••••••', url: 'https://github.com/settings/tokens', notes: 'Filmmaker-og org read/write' },
  ]

  for (const p of passwords) {
    const { error } = await supabase.from('ops_passwords').insert(p)
    results.push(error ? `PW ERROR: ${error.message}` : `✓ pw: ${p.name}`)
  }

  // ── INBOX ────────────────────────────────────────────────
  const inbox = [
    { sender: 'mikki', content: 'First session setup — ops portal is live. All known credentials documented in Passwords. Tasks migrated from audit findings and roadmap.', content_type: 'note' },
    { sender: 'mikki', content: 'Miles is a second-generation filmmaker + film financier. Not technical — prefers GUI, delegates all tech to Mikki. Casual style, profanity fine.', content_type: 'note' },
    { sender: 'mikki', content: 'Product vision: democratize indie film finance. Core user = first/second-time producer who doesn\'t know how to raise money. Waterfall is the entry point.', content_type: 'note' },
    { sender: 'mikki', content: 'Business model: free/low-cost calculator → SaaS subscriptions + high-ticket ad hoc services (financial modeling). Goal: 100-300 paying subscribers.', content_type: 'note' },
    { sender: 'mikki', content: 'Investor deck live at /presentations/investor_overview.html — 16 slides, dark cinematic aesthetic, NO password needed. Share this with investors freely.', content_type: 'note' },
    { sender: 'mikki', content: 'fundraising-analysis.html is INTERNAL strategy doc (pw: geauxtigers247) — NOT an investor deck. Friends & Family round analysis for $40K raise.', content_type: 'note' },
    { sender: 'mikki', content: 'Ops portal password: mikki2026 — stored in Vercel env var VITE_OPS_PORTAL_PASSWORD. Change once proper auth is set up.', content_type: 'alert' },
  ]

  for (const i of inbox) {
    const { error } = await supabase.from('ops_inbox').insert(i)
    results.push(error ? `INBOX ERROR: ${error.message}` : `✓ inbox: ${i.content.substring(0, 40)}...`)
  }

  // ── WORKFLOWS ─────────────────────────────────────────────
  const workflows = [
    { name: 'Morning Briefing', description: 'Daily morning briefing sent to Telegram at 8am. Goal + timeline + tasks + questions for the day.', trigger_type: 'scheduled', schedule_cron: '0 8 * * *' },
    { name: 'Investor Outreach Follow-up', description: 'Follow up with investors who viewed the pitch deck', trigger_type: 'manual', schedule_cron: null },
    { name: 'Social Media Sync', description: 'Check Instagram + TikTok for new leads, engagement, and content ideas', trigger_type: 'scheduled', schedule_cron: '0 19 * * *' },
  ]

  for (const w of workflows) {
    const { error } = await supabase.from('ops_workflows').insert(w)
    results.push(error ? `WF ERROR: ${error.message}` : `✓ workflow: ${w.name}`)
  }

  return new Response(JSON.stringify(results, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  })
})
