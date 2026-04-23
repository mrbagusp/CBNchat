import { NextRequest, NextResponse } from 'next/server'

// Meta requires this endpoint for App Review.
// When a user requests data deletion, Meta calls this endpoint.
export async function POST(req: NextRequest) {
  // TODO(Production): Verify signed_request from Meta
  // TODO(Production): Queue deletion job for user's data

  const confirmationCode = 'del_' + crypto.randomUUID().slice(0, 8)
  const statusUrl = new URL(`/deletion-status/${confirmationCode}`, req.url)

  return NextResponse.json({
    url: statusUrl.toString(),
    confirmation_code: confirmationCode,
  })
}
