import { NextRequest, NextResponse } from 'next/server'

// TODO(Phase 4 Production):
// 1. Verify state matches oauth_states table
// 2. Exchange code for short-lived token via POST https://api.instagram.com/oauth/access_token
// 3. Exchange short-lived for long-lived token via GET https://graph.instagram.com/access_token
// 4. Fetch user profile via GET https://graph.instagram.com/me
// 5. Store encrypted token in workspaces table
// 6. Subscribe to webhooks

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')

  if (!code || !state) {
    return NextResponse.redirect(new URL('/login?error=missing_params', req.url))
  }

  // Mock: simulate successful OAuth
  // In production this would create a real workspace in Supabase
  console.log('[Mock OAuth] Code:', code, 'State:', state)

  // Redirect to app with success message
  return NextResponse.redirect(new URL('/app/home?connected=true', req.url))
}
