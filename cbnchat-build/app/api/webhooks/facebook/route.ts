import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    { error: 'Facebook webhooks not yet implemented. Coming in Phase 7.' },
    { status: 501 }
  )
}

export async function POST() {
  return NextResponse.json(
    { error: 'Facebook webhooks not yet implemented. Coming in Phase 7.' },
    { status: 501 }
  )
}
