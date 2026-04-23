# CBNchat — Build from Scratch (Phase 1)

You are building **CBNchat**, an Instagram/Facebook automation platform similar to Manychat and InstantDM. This is Phase 1 — the app shell, demo data, and navigation. No real backend, no real auth. Everything runs on in-memory mock data.

**CRITICAL RULES — read before writing ANY code:**

1. Use **Tailwind CSS v3** (NOT v4). The config files below are final — do not change versions.
2. Use `useAppStore((s) => s.someField)` for Zustand — NEVER `useAppStore()` without selector, NEVER `useAppStore((s) => ({ ... }))` returning an object literal. These cause infinite re-render loops.
3. Do NOT add `dynamic({ ssr: false })` or `suppressHydrationWarning` anywhere.
4. Do NOT install `fs`, `path`, or `url` as npm packages — they are Node built-ins.
5. Every file you create must compile with `npx next build` — no TypeScript errors allowed.

---

## STEP 1: Create project + config files (copy exactly, do not modify)

### `package.json`
```json
{
  "name": "cbnchat-builder",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^15.1.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-tooltip": "^1.1.4",
    "@radix-ui/react-switch": "^1.1.1",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-separator": "^1.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0",
    "tailwindcss": "^3.4.17",
    "tailwindcss-animate": "^1.0.7",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20",
    "lucide-react": "^0.468.0",
    "sonner": "^1.7.0",
    "recharts": "^2.15.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
}
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `next.config.js`
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}
module.exports = nextConfig
```

### `postcss.config.js`
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### `tailwind.config.js`
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

### `app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 174 65% 25%;
  --primary-foreground: 0 0% 100%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 174 65% 25%;
  --radius: 0.75rem;
}

* {
  border-color: hsl(var(--border));
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
```

---

## STEP 2: Create shadcn/ui components

Create these files in `components/ui/`. These are standard shadcn/ui components — use the exact shadcn source code from https://ui.shadcn.com for each:

- `components/ui/button.tsx` — using `@radix-ui/react-slot`, `class-variance-authority`
- `components/ui/badge.tsx`
- `components/ui/dropdown-menu.tsx` — using `@radix-ui/react-dropdown-menu`
- `components/ui/tooltip.tsx` — using `@radix-ui/react-tooltip`
- `components/ui/input.tsx`
- `components/ui/label.tsx` — using `@radix-ui/react-label`
- `components/ui/separator.tsx` — using `@radix-ui/react-separator`
- `components/ui/switch.tsx` — using `@radix-ui/react-switch`
- `components/ui/sonner.tsx` — wraps `sonner` Toaster component

Also create `lib/utils.ts`:
```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## STEP 3: Create `lib/mock-data.ts` — seed data

Export these as typed const objects. The data model is **channel-agnostic** — NO `ig_` prefixed column names anywhere. All tables have a `channel` field.

```typescript
// Types
export type ChannelType = 'instagram' | 'facebook_page' | 'tiktok' | 'whatsapp'

export interface Organization {
  id: string; name: string; slug: string; plan: string
}

export interface Profile {
  id: string; organization_id: string; full_name: string;
  avatar_url: string | null; role: string; email: string
}

export interface Workspace {
  id: string; organization_id: string; channel: ChannelType; name: string;
  external_id: string; external_username: string; account_type: string;
  profile_picture_url: string; follower_count: number; media_count: number;
  status: string; plan: string; connected_at: string | null; trial_ends_at: string | null
}

export interface Automation {
  id: string; workspace_id: string; name: string; status: string;
  trigger_type: string; folder_id: string | null;
  stats: { triggered: number; completed: number; failed: number }; created_at: string
}

export interface AutomationRun {
  id: string; automation_id: string; automation_name: string;
  status: 'completed' | 'failed' | 'running';
  started_at: string; triggered_by: { comment_text?: string } | null
}

export interface Contact {
  id: string; workspace_id: string; channel: ChannelType;
  external_user_id: string; channel_username: string; full_name: string;
  profile_pic_url: string | null; first_seen_at: string; last_seen_at: string;
  tags: string[]; subscribed: boolean; source: string
}

// Organization
export const ORGANIZATION: Organization = {
  id: 'org-cbn', name: 'CBN Indonesia', slug: 'cbn-indonesia', plan: 'pro'
}

// Demo user
export const DEMO_PROFILE: Profile = {
  id: 'user-demo', organization_id: 'org-cbn', full_name: 'Demo User',
  avatar_url: null, role: 'owner', email: 'demo@cbnchat.local'
}

export const DEFAULT_WORKSPACE_ID = 'ws-superyouth'

// 4 Instagram workspaces
export const WORKSPACES: Workspace[] = [
  {
    id: 'ws-superyouth', organization_id: 'org-cbn', channel: 'instagram',
    name: 'Superyouth Generation', external_id: 'ig_001',
    external_username: 'superyouthgen', account_type: 'business',
    profile_picture_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Superyouth',
    follower_count: 45200, media_count: 183, status: 'connected', plan: 'pro',
    connected_at: '2026-01-15T08:00:00Z', trial_ends_at: '2026-04-21T23:59:59Z'
  },
  {
    id: 'ws-cahaya', organization_id: 'org-cbn', channel: 'instagram',
    name: 'Cahaya Bagi Negeri', external_id: 'ig_002',
    external_username: 'cahayabaginegeri', account_type: 'business',
    profile_picture_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Cahaya',
    follower_count: 12800, media_count: 94, status: 'connected', plan: 'pro',
    connected_at: '2026-02-10T08:00:00Z', trial_ends_at: null
  },
  {
    id: 'ws-superbook', organization_id: 'org-cbn', channel: 'instagram',
    name: 'Superbook Indonesia', external_id: 'ig_003',
    external_username: 'superbookindonesia', account_type: 'business',
    profile_picture_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Superbook',
    follower_count: 8400, media_count: 56, status: 'connected', plan: 'free',
    connected_at: '2026-03-01T08:00:00Z', trial_ends_at: null
  },
  {
    id: 'ws-doa', organization_id: 'org-cbn', channel: 'instagram',
    name: 'Ingin Didoakan', external_id: 'ig_004',
    external_username: 'ingindidoakan', account_type: 'creator',
    profile_picture_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Didoakan',
    follower_count: 3150, media_count: 28, status: 'connected', plan: 'pro',
    connected_at: '2026-03-20T08:00:00Z', trial_ends_at: null
  },
]

// 3 automations for Superyouth
export const AUTOMATIONS: Automation[] = [
  {
    id: 'auto-1', workspace_id: 'ws-superyouth', name: 'Auto-DM from new comments',
    status: 'live', trigger_type: 'post_comment', folder_id: 'folder-1',
    stats: { triggered: 247, completed: 231, failed: 16 }, created_at: '2026-03-01T10:00:00Z'
  },
  {
    id: 'auto-2', workspace_id: 'ws-superyouth', name: 'Story reply → offer ebook',
    status: 'draft', trigger_type: 'story_reply', folder_id: 'folder-2',
    stats: { triggered: 0, completed: 0, failed: 0 }, created_at: '2026-04-10T10:00:00Z'
  },
  {
    id: 'auto-3', workspace_id: 'ws-superyouth', name: 'AI reply for prayer requests',
    status: 'live', trigger_type: 'dm_message', folder_id: null,
    stats: { triggered: 89, completed: 85, failed: 4 }, created_at: '2026-04-05T10:00:00Z'
  },
]

// Generate 20 automation runs with timestamps from last 7 days
function generateRuns(): AutomationRun[] {
  const statuses: Array<'completed' | 'failed' | 'running'> = ['completed', 'completed', 'completed', 'completed', 'failed', 'running']
  const comments = ['info please', 'amin', 'mau ikut', 'link dong', 'saya mau', 'hallelujah', 'gimana caranya?', 'DM ya', 'amen', 'keren banget']
  const runs: AutomationRun[] = []
  const now = Date.now()
  for (let i = 0; i < 20; i++) {
    const hoursAgo = Math.floor(Math.random() * 168)
    runs.push({
      id: `run-${i}`,
      automation_id: i % 3 === 0 ? 'auto-3' : 'auto-1',
      automation_name: i % 3 === 0 ? 'AI reply for prayer requests' : 'Auto-DM from new comments',
      status: statuses[i % statuses.length],
      started_at: new Date(now - hoursAgo * 3600000).toISOString(),
      triggered_by: { comment_text: comments[i % comments.length] },
    })
  }
  return runs.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
}
export const AUTOMATION_RUNS = generateRuns()

// Generate 30 contacts
function generateContacts(): Contact[] {
  const usernames = [
    'yusuf.kristian', 'maria_doa', 'hamba_tuhan23', 'terangbagi.sesama',
    'kasihkristus_id', 'bertumbuh.dlmkristus', 'anakdoa_jkt', 'pemudakatolik',
    'injiluntuksemua', 'doaku.didengar', 'pengharapan_baru', 'iman.teguh',
    'kasih_sayang_id', 'berdoa_setiaphari', 'gereja.muda', 'pelayan_tuhan',
    'sukacita_surga', 'firman.hidup', 'anugerah_allah', 'murid.kristus',
    'terang.dunia', 'garam.bumi_id', 'salib.kasih', 'doa.pagi',
    'renungan.harian', 'ibadah.online', 'rohani.muda', 'berkat.melimpah',
    'mazmur_23', 'yohanes.316'
  ]
  const tags = ['new_lead', 'doa', 'yesus_curhat', 'paid_event']
  const sources = ['comment', 'dm', 'story_reply', 'comment', 'comment']
  const wsIds = ['ws-superyouth', 'ws-superyouth', 'ws-cahaya', 'ws-superbook', 'ws-doa']
  const now = Date.now()
  return usernames.map((u, i) => ({
    id: `contact-${i}`,
    workspace_id: wsIds[i % wsIds.length],
    channel: 'instagram' as ChannelType,
    external_user_id: `iguser_${i}`,
    channel_username: u,
    full_name: u.replace(/[._]/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()).replace(/\d+/g, '').trim(),
    profile_pic_url: `https://api.dicebear.com/7.x/initials/svg?seed=${u}`,
    first_seen_at: new Date(now - (30 - i) * 86400000).toISOString(),
    last_seen_at: new Date(now - i * 3600000).toISOString(),
    tags: [tags[i % tags.length], ...(i % 3 === 0 ? [tags[(i + 1) % tags.length]] : [])],
    subscribed: i % 7 !== 0,
    source: sources[i % sources.length],
  }))
}
export const CONTACTS = generateContacts()

// Dashboard stats with sparkline data
export function getDashboardStats(_workspaceId: string) {
  return {
    triggered: { value: 336, change: '+12%' },
    newContacts: { value: 184, change: '+8%' },
    messagesSent: { value: 1247, change: '+23%' },
    crmLeads: { value: 94, change: '+15%' },
    sparklines: {
      triggered: [28, 34, 41, 38, 52, 67, 76],
      newContacts: [18, 22, 28, 24, 31, 29, 32],
      messagesSent: [128, 156, 189, 175, 204, 198, 197],
      crmLeads: [8, 11, 14, 13, 17, 15, 16],
    },
  }
}

// Automation folders
export const FOLDERS = [
  { id: 'folder-1', workspace_id: 'ws-superyouth', name: 'RESPONDEN CAROUSEL' },
  { id: 'folder-2', workspace_id: 'ws-superyouth', name: 'RESPONDEN GRAFIS' },
]
```

---

## STEP 4: Create `lib/store.ts` — Zustand store

```typescript
import { create } from 'zustand'
import {
  DEMO_PROFILE, ORGANIZATION, WORKSPACES, DEFAULT_WORKSPACE_ID,
  type Profile, type Organization, type Workspace,
} from './mock-data'

interface AppState {
  user: Profile | null
  organization: Organization | null
  isAuthenticated: boolean
  login: (user: Profile) => void
  loginAsDemo: () => void
  logout: () => void
  activeWorkspaceId: string
  setActiveWorkspaceId: (id: string) => void
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  trialBannerDismissed: boolean
  dismissTrialBanner: () => void
}

// IMPORTANT: Always use atomic selectors when reading from this store.
// ✅ CORRECT: const user = useAppStore((s) => s.user)
// ❌ WRONG:   const { user, logout } = useAppStore((s) => ({ user: s.user, logout: s.logout }))
// ❌ WRONG:   const { user } = useAppStore()
// The wrong patterns create new references every render → infinite loop.
export const useAppStore = create<AppState>()((set, get) => ({
  user: DEMO_PROFILE,
  organization: ORGANIZATION,
  isAuthenticated: true,
  login: (user) => set({ user, isAuthenticated: true, organization: ORGANIZATION }),
  loginAsDemo: () => set({ user: DEMO_PROFILE, organization: ORGANIZATION, isAuthenticated: true }),
  logout: () => set({ user: null, organization: null, isAuthenticated: false }),
  activeWorkspaceId: DEFAULT_WORKSPACE_ID,
  setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  trialBannerDismissed: false,
  dismissTrialBanner: () => set({ trialBannerDismissed: true }),
}))

export function useActiveWorkspace(): Workspace | undefined {
  return useAppStore((s) => WORKSPACES.find((w) => w.id === s.activeWorkspaceId))
}
```

---

## STEP 5: Create root layout `app/layout.tsx`

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'CBNchat — Instagram Automation for Christian Media',
  description: 'Automate Instagram comments and DMs, capture CRM leads, and build multi-step flows.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
```

---

## STEP 6: Build the app shell and all pages

Now build the following. Use the design palette: **teal `#0F766E`** for primary, **amber `#F59E0B`** for accents/badges, **slate** neutrals. Pink gradient (`from-rose-500 to-pink-500`) for Instagram CTAs. All lucide-react icons.

### `app/app/layout.tsx` — simple server component
```tsx
import { AppShell } from '@/components/cbnchat/app-shell'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
```

### `components/cbnchat/app-shell.tsx`
`'use client'` component. Contains:
- **Demo mode banner** (amber `bg-amber-500`, white text, dismissible): "⚠️ DEMO MODE — Auth bypassed, using mock data."
- **Flex row:** Sidebar (left) + main content (right)
- Main content area: Topbar (h-14, white, border-b) + scrollable main `<main>` with `bg-slate-50 p-6 max-w-7xl mx-auto`

### `components/cbnchat/sidebar.tsx`
Left sidebar (240px, collapsible to 72px). Uses **atomic** Zustand selectors (one per line). Contains:
- Logo: teal square with MessageCircle icon + "CBNchat" text
- **WorkspaceSwitcher** below logo (see below)
- Nav items: Home, Automations, AI, Inbox (badge: 1), Contacts, Broadcasts, Settings
- Active state: `bg-teal-50 text-teal-700` with 3px teal left border
- Bottom: "Need Help?" card + user profile dropdown (DropdownMenu)
- Collapse toggle button on the right edge

### `components/cbnchat/workspace-switcher.tsx`
DropdownMenu under the logo. Shows:
- Current workspace avatar (colored initials) + name + plan badge + channel icon
- Dropdown grouped by channel:
  - "Instagram" section header with IG icon → all 4 workspaces
  - "Facebook" section header → "No Facebook Pages connected yet" (italic, disabled)
  - Separator → "+ Connect New Account" item
- Clicking "+ Connect" opens a modal with Instagram (enabled) and Facebook (disabled, "Coming in Phase 7" overlay)

### `components/cbnchat/channel-badge.tsx`
`<ChannelBadge type="instagram" />` — renders small pill with brand icon + color.

### `components/cbnchat/stat-card.tsx`
Dashboard stat tile: icon + label + big value + change indicator (green/red) + Recharts sparkline.

### `components/cbnchat/trial-banner.tsx`
Teal gradient banner with Gift icon, PRO PLAN TRIAL badge, days remaining, "Show Plans" button, dismiss X. Uses **atomic** Zustand selectors.

### `app/login/page.tsx`
InstantDM-style centered login card (~440px). Contents:
- CBNchat logo
- "Welcome to CBNchat 👋"
- "Login to your CBNchat account"
- Pink gradient button: `[Instagram icon] Continue with Instagram` → toast "Coming in Phase 4"
- Trust text: 🔒 "Secured via official Instagram Login API"
- Disabled Facebook blue button: `[FB icon] Continue with Facebook` → tooltip "Coming in Phase 7"
- Divider "or"
- Outline button: `[Mail icon] Continue with Email` → toast "Coming in Phase 4"
- **Amber button:** `🚀 Enter Demo Workspace` → `router.push('/app/home')` — this is the ONLY functional button

### `app/app/home/page.tsx` + `home-client.tsx`
Dashboard. `page.tsx` is a simple server component that imports `HomePageClient`. `home-client.tsx` is `'use client'` and contains:
- Greeting: `@{external_username}! 👋` + ChannelBadge + "X live" indicator + follower count
- TrialBanner (conditional)
- 2 feature highlight cards (ChatGPT automation + PDF Direct)
- 4 stat cards in a grid (Triggered, New Contacts, Messages Sent, CRM Leads) with Recharts sparklines
- 3 quick-action cards (Instagram enabled, Facebook disabled "Coming Soon", Schedule disabled)
- Live Automations list (from AUTOMATIONS where status='live')
- Recent Automation Runs table (from AUTOMATION_RUNS, 10 rows)
- Account Overview + Getting Started checklist cards

### Stub pages (all use the app shell, each has an empty state with icon + "Coming in Phase X"):
- `app/app/automation/page.tsx` — "Coming in Phase 2"
- `app/app/ai/page.tsx` — "Coming in Phase 3"
- `app/app/contacts/page.tsx` — "Coming in Phase 3"
- `app/app/inbox/page.tsx` — "Coming in Phase 6"
- `app/app/broadcasts/page.tsx` — "Coming in Phase 6"
- `app/app/settings/general/page.tsx` + `team/` + `workspaces/` + `integrations/webhooks/` + `billing/` — all stubs with "Coming Soon"
- `app/app/settings/layout.tsx` — settings sub-nav (General, Team, Workspaces, Integrations, Billing)

### `app/page.tsx` — Marketing landing page
Simple hero page (NOT the app shell). Contains:
- Navbar: CBNchat logo + Features, Accounts, Privacy links + Sign in + "Get Started" teal button
- Hero: "Purpose-built for Christian media" badge + "Turn Instagram comments into **ministry leads**" heading + description + "Continue with Instagram" pink button + "View Demo →" outline button
- Features grid (2x2): Comment & DM Automation, AI-Powered Responses, CRM Lead Capture, Multi-Account Dashboard
- "Powering CBN Indonesia properties" section with 4 workspace pills
- CTA footer: teal bg, "Ready to automate your ministry reach?" + "Connect Instagram — It's Free" button

### Legal stubs
- `app/privacy/page.tsx` — placeholder privacy policy
- `app/terms/page.tsx` — placeholder terms of service

---

## STEP 7: Verify

After building everything, confirm:
1. `npm run build` passes with ZERO errors
2. Visit `/` → landing page renders with teal + pink styling
3. Visit `/login` → centered card with 4 buttons (only amber demo button works)
4. Click "Enter Demo Workspace" → `/app/home` renders with sidebar + dashboard
5. Workspace switcher dropdown shows all 4 IG workspaces + Facebook section
6. All sidebar nav items lead to their respective stub pages without errors
7. Dashboard stats show sparklines, automation runs table, getting started checklist

**Show me screenshots of steps 3, 4, and 5 when done. Do not proceed to Phase 2.**
