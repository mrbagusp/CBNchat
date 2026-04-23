import Link from 'next/link'
import { MessageCircle, Zap, Bot, Users, LayoutDashboard, ArrowRight, Instagram, Shield } from 'lucide-react'

const FEATURES = [
  {
    icon: Zap,
    title: 'Comment & DM Automation',
    description: 'Trigger automated DM sequences when followers comment on your posts or stories. Zero manual effort.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: Bot,
    title: 'AI-Powered Responses',
    description: 'Deploy ChatGPT-powered flows that answer prayer requests, FAQs, and ministry enquiries 24/7.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    icon: Users,
    title: 'CRM Lead Capture',
    description: 'Every commenter and DM sender becomes a tagged contact. Build segmented lists automatically.',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  {
    icon: LayoutDashboard,
    title: 'Multi-Account Dashboard',
    description: 'Manage all your ministry Instagram accounts from a single workspace with role-based access.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
]

const WORKSPACES = [
  { name: 'Superyouth Generation', username: '@superyouthgen', followers: '45.2K' },
  { name: 'Cahaya Bagi Negeri', username: '@cahayabaginegeri', followers: '12.8K' },
  { name: 'Superbook Indonesia', username: '@superbookindonesia', followers: '8.4K' },
  { name: 'Ingin Didoakan', username: '@ingindidoakan', followers: '3.2K' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-bold text-slate-900">CBNchat</span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors">Features</a>
            <a href="#accounts" className="text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors">Accounts</a>
            <Link href="/privacy" className="text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors">Privacy</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 hover:text-teal-700 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-teal-500" />
          <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            Purpose-built for Christian media
          </span>
        </div>

        <h1 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl text-balance">
          Turn Instagram comments<br className="hidden sm:block" /> into{' '}
          <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
            ministry leads
          </span>
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-500 text-pretty">
          CBNchat automates your Instagram DMs, captures CRM leads, and runs AI-powered conversations — so your team can focus on ministry, not manual replies.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-md hover:from-rose-600 hover:to-pink-600 transition-all"
          >
            <Instagram className="h-5 w-5" />
            Continue with Instagram
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors"
          >
            View Demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-sm text-slate-400">
          <Shield className="h-4 w-4" />
          Secured via official Instagram Login API
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-slate-900">Everything your ministry needs</h2>
            <p className="text-slate-500">From comment triggers to AI replies — built for scale.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, description, color, bg }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accounts */}
      <section id="accounts" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-2xl font-bold text-slate-900">Powering CBN Indonesia properties</h2>
            <p className="text-slate-500">Trusted by leading Christian media accounts across Indonesia.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {WORKSPACES.map(({ name, username, followers }) => (
              <div key={name} className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-xs font-bold text-white">
                  {name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{name}</p>
                  <p className="text-xs text-slate-400">{username} &middot; {followers} followers</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-teal-700">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="mb-3 text-3xl font-bold text-white text-balance">
            Ready to automate your ministry reach?
          </h2>
          <p className="mb-8 text-teal-200">
            Connect your Instagram account and start building automations in minutes.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-teal-700 hover:bg-teal-50 transition-colors shadow-md"
          >
            <Instagram className="h-5 w-5" />
            Connect Instagram — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-7">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">CBNchat</span>
            <span className="text-sm text-slate-400 ml-1">&copy; 2026 CBN Indonesia. All rights reserved.</span>
          </div>
          <div className="flex gap-5 text-sm text-slate-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <a href="mailto:privacy@cbnchat.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
