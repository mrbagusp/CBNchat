import { NextRequest, NextResponse } from 'next/server'

// TODO(Phase 4 Production): Replace with real Instagram OAuth URL
// Real URL: https://www.instagram.com/oauth/authorize?client_id=...&redirect_uri=...&scope=...&state=...
export async function GET(req: NextRequest) {
  const state = crypto.randomUUID()

  // In production: store state in oauth_states table for CSRF protection
  // In demo: just redirect to our own callback with mock data
  const mockCallbackUrl = new URL('/api/auth/instagram/callback', req.url)
  mockCallbackUrl.searchParams.set('code', 'mock_auth_code_' + Date.now())
  mockCallbackUrl.searchParams.set('state', state)

  return NextResponse.redirect(mockCallbackUrl)
}
