import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const LOOPS_API_KEY = Deno.env.get('LOOPS_API_KEY');
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET');

interface WebhookPayload {
  type: 'INSERT';
  table: string;
  record: {
    id: string;
    name: string;
    email: string;
    source: string;
    created_at: string;
  };
  schema: string;
}

Deno.serve(async (req: Request) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Verify webhook secret if set
  if (WEBHOOK_SECRET) {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  try {
    const payload: WebhookPayload = await req.json();

    // Only process INSERT events on leads table
    if (payload.type !== 'INSERT' || payload.table !== 'leads') {
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { name, email, source } = payload.record;

    // Split name into first/last
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Push to Loops
    const loopsResponse = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOOPS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        source: source || 'calculator',
        subscribed: true,
        userGroup: 'lead',
      }),
    });

    const loopsData = await loopsResponse.json();

    // If contact already exists, update instead
    if (!loopsResponse.ok && loopsData?.message?.includes('already exists')) {
      const updateResponse = await fetch('https://app.loops.so/api/v1/contacts/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${LOOPS_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          source: source || 'calculator',
        }),
      });
      const updateData = await updateResponse.json();
      return new Response(JSON.stringify({ success: true, action: 'updated', data: updateData }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, action: 'created', data: loopsData }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error syncing lead to Loops:', error);
    return new Response(JSON.stringify({ error: 'Webhook processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
