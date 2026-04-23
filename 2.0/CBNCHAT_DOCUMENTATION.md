# CBNchat — Project Documentation & Roadmap

## 1. Project Overview

**CBNchat** is a self-hosted Instagram/Facebook automation platform built for CBN Indonesia, a Christian media organization. It replaces Manychat at a fraction of the cost.

**Core function:** When someone comments on an Instagram post/reel, CBNchat automatically replies to the comment, sends a DM, captures the contact into a CRM, and runs AI-powered conversation flows.

**Reference products:** Manychat, InstantDM

---

## 2. Architecture

### Tech Stack
| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 15 (App Router) + TypeScript | SSR + client-side routing |
| Styling | Tailwind CSS v3 + shadcn/ui | Proven component library |
| Database | Supabase (PostgreSQL + Auth + RLS) | All-in-one BaaS, free tier |
| Flow Builder | React Flow | Drag-and-drop visual builder |
| Client State | Zustand | Minimal, no boilerplate |
| Server State | TanStack Query | Caching + refetching |
| LLM | OpenAI GPT-4o-mini | AI auto-replies |
| Hosting | Vercel (frontend) + Supabase (backend) | Zero-ops |

### Channel Abstraction
The data model and code are **channel-agnostic**. A `ChannelAdapter` interface lets us add platforms without rewriting existing code:

```
lib/channels/
├── types.ts           ← Interface: buildAuthUrl, exchangeCode, sendDM, etc.
├── index.ts           ← Registry: getChannel('instagram')
├── instagram/         ← MVP implementation
└── facebook/          ← Phase 7
```

### Data Model (Channel-Agnostic)
- **organizations** — tenant boundary
- **profiles** — users linked to auth + org
- **workspaces** — one per IG account or FB Page (has `channel` column)
- **contacts** — people who interacted with us (has `external_user_id`, not `ig_user_id`)
- **automations** — flow definitions (React Flow JSON)
- **automation_runs** — execution logs
- **messages** — incoming + outgoing across all channels
- **webhook_endpoints** — outbound CRM webhook configs
- **webhook_deliveries** — delivery logs with retry tracking
- **ai_configs** — per-workspace AI settings
- **oauth_states** — CSRF protection for OAuth flows

### Authentication Flow (Instagram Login API)
```
User clicks "Continue with Instagram"
  → Redirect to instagram.com/oauth/authorize (scopes: business_basic, manage_messages, manage_comments, content_publish)
  → User sees Instagram's native Allow dialog
  → Instagram redirects back with ?code=XXX
  → Server exchanges code for long-lived token (60 days)
  → Fetch IG profile, create workspace
  → Subscribe to webhooks
  → Redirect to dashboard
```

### Webhook Flow (Incoming Comments/DMs)
```
Instagram detects new comment
  → POST to our /api/webhooks/instagram
  → Verify X-Hub-Signature-256
  → Parse event into NormalizedEvent
  → Match against live automations (trigger_type + keywords)
  → Execute flow steps (Reply to Comment → Send DM → AI Step → Set Tag → Call CRM Webhook)
  → Log automation_run
```

### CRM Webhook Flow (Outgoing)
```
Automation completes → insert webhook_delivery row
  → Cron job (every 1 min) picks up pending deliveries
  → POST to CRM URL with HMAC-SHA256 signature (X-CBNchat-Signature)
  → Retry on failure: 1m, 5m, 30m, 2h, 12h (max 5 attempts)
  → Mark endpoint inactive after 20 consecutive failures
```

---

## 3. Design System

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#0F766E` (teal-700) | Buttons, active states, links |
| Accent | `#F59E0B` (amber-500) | Badges, highlights, demo mode |
| Instagram CTA | `from-rose-500 to-pink-500` | "Continue with Instagram" buttons |
| Facebook CTA | `#1877F2` | "Continue with Facebook" (disabled in MVP) |
| Background | `slate-50` | App shell background |
| Cards | `white` | Content cards |
| Borders | `slate-200` | Card borders |
| Radius | `rounded-xl` (12px) cards, `rounded-lg` (8px) buttons |
| Shadows | `shadow-sm` default, `shadow-md` on hover |
| Font | Inter | Via Google Fonts |

**Rules:**
- No purple/indigo gradients (generic AI look)
- No emoji as icons (except 👋 in greeting)
- lucide-react for all icons

---

## 4. Phased Roadmap

### Phase 1 — App Shell + Demo Data ✅ (current)
**Goal:** Clickable UI with realistic seed data. No real backend.

**Deliverables:**
- Landing page (`/`)
- Login page (`/login`) with demo mode button
- App shell: sidebar, topbar, workspace switcher
- Dashboard (`/app/home`) with stats, automations list, activity feed
- Stub pages for all other routes
- Privacy, Terms, Data Deletion stub pages
- Mock data: 4 workspaces, 30 contacts, 3 automations, 20 runs

**Tech:** Next.js + Tailwind v3 + shadcn/ui + Zustand (in-memory data only)

---

### Phase 2 — Automation Builder
**Goal:** Visual flow builder where users create automation flows.

**Deliverables:**
- Automations list page (folders + table)
- React Flow canvas with custom nodes
- Trigger modal (Instagram triggers enabled, others disabled)
- Node types: Send DM, Reply to Comment, Condition, Smart Delay, Action, Randomizer
- Node editor Sheet (right panel)
- Post/Reel picker modal with mock media
- Save/load flow_definition as JSON
- "Set Live" toggle with validation

**Tech:** React Flow (`reactflow` package), react-hook-form + zod

---

### Phase 3 — Contacts + AI
**Goal:** Contact management + AI-powered replies.

**Deliverables:**
- Contacts page (table, filters, drawer with message history)
- AI config page (system prompt, model, temperature, knowledge base)
- AI test playground (send sample comment → see AI response)
- AI Step node in flow builder

**Tech:** OpenAI SDK (`openai` package), TanStack Query

**Env vars needed:** `OPENAI_API_KEY`

---

### Phase 4 — Instagram OAuth + Webhooks
**Goal:** Real Instagram integration. Comments come in, automations fire.

**Deliverables:**
- "Continue with Instagram" OAuth flow (Instagram Login API)
- Callback handler → exchange code → create workspace
- Webhook receiver `/api/webhooks/instagram` with HMAC verification
- Automation matcher (comment → find matching live automations → execute flow)
- "Simulate Incoming Comment" dev button for testing
- Token refresh cron (daily, refresh tokens expiring within 7 days)
- Replace all mock data reads with real Supabase queries

**Env vars needed:**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
META_INSTAGRAM_APP_ID=
META_INSTAGRAM_APP_SECRET=
META_INSTAGRAM_REDIRECT_URI=
META_WEBHOOK_VERIFY_TOKEN=
META_APP_SECRET=
```

**Parallel task:** Submit Meta App Review (1-4 weeks). Use Development mode (25 test users) until approved.

**Required pages:** `/privacy`, `/terms`, `/api/meta/data-deletion` must have real content.

---

### Phase 5 — CRM Webhooks
**Goal:** Push leads to external CRM via signed webhooks.

**Deliverables:**
- Webhook endpoint CRUD in Settings
- "Test delivery" button
- Delivery log table with retry button
- Supabase Edge Function cron (every 1 min) for delivery
- HMAC-SHA256 signing (header: X-CBNchat-Signature)
- Exponential backoff retry (1m, 5m, 30m, 2h, 12h, max 5 attempts)

**Webhook payload format:**
```json
{
  "event": "contact.created",
  "timestamp": "2026-04-16T10:23:45Z",
  "workspace": { "id": "...", "channel": "instagram", "external_username": "superyouthgen" },
  "data": {
    "contact_id": "...",
    "channel_username": "johndoe",
    "source": "comment",
    "tags": ["new_lead"]
  }
}
```

---

### Phase 6 — Analytics + Polish
**Goal:** Production-ready MVP.

**Deliverables:**
- Real analytics on dashboard (Recharts from DB data)
- Per-automation stats page
- Inbox page (unified DMs, reply directly)
- Empty states, loading skeletons, error toasts, 404 page
- Responsive mobile view (dashboard + contacts)

---

### Phase 7 — Facebook Page Support
**Goal:** Add Facebook Pages as a second channel.

**Deliverables:**
- `FacebookPageAdapter` implementing ChannelAdapter interface
- Facebook Login OAuth flow (scopes: pages_messaging, pages_manage_engagement, pages_read_engagement)
- Page picker UI (user selects which FB Page to connect)
- Webhook receiver `/api/webhooks/facebook`
- Enable "Continue with Facebook" button
- Enable Facebook tab in trigger modal
- New triggers: Page comment, Messenger message

**Env vars:** `META_FACEBOOK_APP_ID`, `META_FACEBOOK_APP_SECRET`, `META_FACEBOOK_REDIRECT_URI`

**Meta App Review:** Separate submission for Facebook scopes.

---

### Phase 8+ — Future
- TikTok integration (same adapter pattern)
- WhatsApp Business integration
- Broadcast messaging
- Post scheduling
- Analytics export
- Team permissions refinement
- i18n (English → Indonesian)
- Self-hosted deployment option (Docker Compose)

---

## 5. Meta App Review Strategy

**Two separate Meta Apps (recommended):**
1. "CBNchat for Instagram" — Phase 4
2. "CBNchat for Facebook" — Phase 7

**Required for review submission:**
- Privacy Policy URL (`/privacy`)
- Terms of Service URL (`/terms`)
- Data Deletion Callback URL (`/api/meta/data-deletion`)
- Screencast demo of each scope in action
- Business verification (CBN Indonesia)

**Development mode:** Up to 25 test users without review. Add team IG accounts as test users for Phase 1-4 development.

---

## 6. Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Tailwind version | v3 (not v4) | shadcn/ui officially supports v3; v4 has breaking syntax changes |
| Zustand selectors | Atomic (one per line) | Object literal selectors cause infinite re-render loops |
| OAuth approach | Instagram Login API (not Facebook Login) | 1-click UX like InstantDM vs 3-step Manychat flow |
| Token storage | Supabase `pgsodium` encryption | At-rest encryption for IG access tokens |
| Multi-tenant | Organization → Workspaces with RLS | Row Level Security at database level |
| Channel architecture | Adapter pattern with interface | Adding new channels is additive, not rewrite |
| Meta Apps | 2 separate apps (IG + FB) | Isolated App Review risk |
| CRM integration | Outbound webhooks (not direct API) | Works with any CRM that accepts webhooks |

---

## 7. File Structure (Phase 1)

```
cbnchat-builder/
├── app/
│   ├── globals.css
│   ├── layout.tsx              # Root layout (Inter font + global CSS)
│   ├── page.tsx                # Landing page
│   ├── login/page.tsx          # Login page (InstantDM-style)
│   ├── privacy/page.tsx        # Privacy policy stub
│   ├── terms/page.tsx          # Terms stub
│   └── app/
│       ├── layout.tsx          # App shell layout (sidebar + topbar)
│       ├── home/
│       │   ├── page.tsx
│       │   └── home-client.tsx # Dashboard (client component)
│       ├── automation/page.tsx # Stub
│       ├── ai/page.tsx         # Stub
│       ├── inbox/page.tsx      # Stub
│       ├── contacts/page.tsx   # Stub
│       ├── broadcasts/page.tsx # Stub
│       └── settings/
│           ├── layout.tsx      # Settings sub-nav
│           ├── general/page.tsx
│           ├── team/page.tsx
│           ├── workspaces/page.tsx
│           ├── integrations/webhooks/page.tsx
│           └── billing/page.tsx
├── components/
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── tooltip.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── separator.tsx
│   │   ├── switch.tsx
│   │   └── sonner.tsx
│   └── cbnchat/                # App-specific components
│       ├── app-shell.tsx
│       ├── sidebar.tsx
│       ├── workspace-switcher.tsx
│       ├── channel-badge.tsx
│       ├── stat-card.tsx
│       └── trial-banner.tsx
├── lib/
│   ├── utils.ts                # cn() helper
│   ├── store.ts                # Zustand store
│   └── mock-data.ts            # All seed data
├── package.json
├── tsconfig.json
├── next.config.js
├── postcss.config.js
├── tailwind.config.js
└── README.md
```

---

## 8. Zustand Usage Rules (CRITICAL)

```typescript
// ✅ CORRECT — atomic selectors, one per line
const user = useAppStore((s) => s.user)
const logout = useAppStore((s) => s.logout)
const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed)

// ❌ WRONG — object literal returns new reference every render → infinite loop
const { user, logout } = useAppStore((s) => ({
  user: s.user,
  logout: s.logout,
}))

// ❌ WRONG — no selector = subscribes to ALL state changes
const { user, logout } = useAppStore()
```

---

## 9. Environment Variables Summary

### Phase 1 (Demo Mode)
```
NEXT_PUBLIC_DEMO_MODE=true
```

### Phase 3 (AI)
```
OPENAI_API_KEY=sk-...
```

### Phase 4 (Instagram OAuth)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
META_INSTAGRAM_APP_ID=123456
META_INSTAGRAM_APP_SECRET=abc123
META_INSTAGRAM_REDIRECT_URI=https://yourdomain.com/api/auth/instagram/callback
META_WEBHOOK_VERIFY_TOKEN=your_random_token
META_APP_SECRET=your_app_secret
```

### Phase 7 (Facebook)
```
META_FACEBOOK_APP_ID=789012
META_FACEBOOK_APP_SECRET=def456
META_FACEBOOK_REDIRECT_URI=https://yourdomain.com/api/auth/facebook/callback
```

---

## 10. Cost Projections

### MVP (Phase 1-6, first year)
| Service | Cost |
|---------|------|
| Supabase Free Tier | $0/mo |
| Vercel Hobby | $0/mo |
| OpenAI GPT-4o-mini (~50k tokens/day) | ~$15/mo |
| Domain | ~$12/yr |
| **Total** | **~$15/mo** |

### Growth (10k+ contacts)
| Service | Cost |
|---------|------|
| Supabase Pro | $25/mo |
| Vercel Pro | $20/mo |
| OpenAI | ~$50/mo |
| **Total** | **~$95/mo** |

### Comparison
| | CBNchat | Manychat |
|---|---|---|
| 4 IG accounts, 3k contacts | ~$15/mo | ~$180/mo |
| Annual savings | | **~$1,980** |
