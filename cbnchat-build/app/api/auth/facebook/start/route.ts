import { NextResponse } from 'next/server'

// Phase 7 — Facebook OAuth not yet implemented
export async function GET() {
  return NextResponse.json(
    { error: 'Facebook OAuth not yet implemented. Coming in Phase 7.' },
    { status: 501 }
  )
}
