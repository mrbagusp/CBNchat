import { NextRequest, NextResponse } from 'next/server'

// GET — Meta webhook verification challenge
// Meta sends: GET /api/webhooks/instagram?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=CHALLENGE_STRING
export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get('hub.mode')
  const token = req.nextUrl.searchParams.get('hub.verify_token')
  const challenge = req.nextUrl.searchParams.get('hub.challenge')

  // TODO(Production): Use env var META_WEBHOOK_VERIFY_TOKEN
  const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'cbnchat_verify_token_demo'

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[Webhook] Verification successful')
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
}

// POST — Receive incoming webhook events from Instagram
export async function POST(req: NextRequest) {
  const body = await req.text()

  // TODO(Production): Verify X-Hub-Signature-256 header
  // const signature = req.headers.get('x-hub-signature-256')
  // const expectedSignature = createHmac('sha256', META_APP_SECRET).update(body).digest('hex')
  // if (signature !== `sha256=${expectedSignature}`) return NextResponse.json({}, { status: 401 })

  let payload
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  console.log('[Webhook] Received event:', JSON.stringify(payload, null, 2))

  // Parse Instagram webhook format
  // Instagram sends: { object: 'instagram', entry: [{ id, time, changes: [{ field, value }] }] }
  if (payload.object === 'instagram' && payload.entry) {
    for (const entry of payload.entry) {
      for (const change of entry.changes || []) {
        if (change.field === 'comments') {
          console.log('[Webhook] New comment:', change.value)
          // TODO(Production):
          // 1. Upsert contact from commenter info
          // 2. Store message in messages table
          // 3. Match against live automations
          // 4. Execute matching automation flow
        }
        if (change.field === 'messages') {
          console.log('[Webhook] New DM:', change.value)
        }
      }
    }
  }

  // Must respond 200 within 20 seconds or Meta will retry
  return NextResponse.json({ status: 'received' }, { status: 200 })
}
