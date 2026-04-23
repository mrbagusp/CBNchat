import { NextRequest, NextResponse } from 'next/server'

// This endpoint is called by Supabase Edge Function cron (every 1 min) in production.
// It picks up pending webhook_deliveries rows and sends them.
// In demo mode, this is a stub that shows the delivery pipeline structure.

export async function POST(req: NextRequest) {
  // TODO(Production):
  // 1. Query webhook_deliveries WHERE status = 'pending' AND next_retry_at <= now()
  // 2. For each delivery:
  //    a. Fetch the webhook_endpoint (URL + secret)
  //    b. Sign payload with HMAC-SHA256: createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex')
  //    c. POST to endpoint URL with headers:
  //       - Content-Type: application/json
  //       - X-CBNchat-Signature: sha256={hmac}
  //       - X-CBNchat-Event: {event_type}
  //       - X-CBNchat-Delivery: {delivery_id}
  //    d. If 2xx: mark as 'delivered', set delivered_at
  //    e. If error: increment attempt_count, set next_retry_at based on exponential backoff:
  //       attempt 1: +1min, attempt 2: +5min, attempt 3: +30min, attempt 4: +2h, attempt 5: +12h
  //    f. If attempt_count >= 5: mark as 'failed', increment endpoint failure_count
  //    g. If endpoint failure_count >= 20: set endpoint active=false, notify owner

  // Parse body but don't require it in demo mode
  await req.json().catch(() => null)

  return NextResponse.json({
    status: 'demo_mode',
    message:
      'Webhook delivery worker is a stub in demo mode. In production, this processes pending deliveries from the webhook_deliveries table.',
    sample_headers: {
      'Content-Type': 'application/json',
      'X-CBNchat-Signature': 'sha256=abc123...',
      'X-CBNchat-Event': 'contact.created',
      'X-CBNchat-Delivery': 'del_abc123',
    },
    retry_schedule: {
      attempt_1: '1 minute',
      attempt_2: '5 minutes',
      attempt_3: '30 minutes',
      attempt_4: '2 hours',
      attempt_5: '12 hours (final)',
    },
  })
}
