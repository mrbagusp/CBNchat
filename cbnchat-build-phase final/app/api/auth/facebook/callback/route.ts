import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    { error: 'Facebook OAuth not yet implemented. Coming in Phase 7.' },
    { status: 501 }
  )
}
