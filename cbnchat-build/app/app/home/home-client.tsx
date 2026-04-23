'use client'

import { useState, useEffect } from 'react'
import { Zap, Users, MessageSquare, Star, Instagram, Calendar, CheckCircle2, Circle, TrendingUp, TrendingDown } from 'lucide-react'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  Legend, Tooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts'
import { useAppStore } from '@/lib/store'
import { WORKSPACES, AUTOMATIONS, AUTOMATION_RUNS, getDashboardStats } from '@/lib/mock-data'
import { TrialBanner } from '@/components/cbnchat/trial-banner'
import { StatCard } from '@/components/cbnchat/stat-card'
import { ChannelBadge } from '@/components/cbnchat/channel-badge'
import { SkeletonDashboard } from '@/components/cbnchat/skeleton'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-600',
  running: 'bg-amber-100 text-amber-700',
}

const CHECKLIST = [
  { label: 'Connect your Instagram account', done: true },
  { label: 'Create your first automation', done: true },
  { label: 'Set up an AI reply flow', done: false },
  { label: 'Add team members', done: false },
  { label: 'Review your CRM contacts', done: false },
]

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function HomePageClient() {
  const activeWorkspaceId = useAppStore((s) => s.activeWorkspaceId)
  const workspace = WORKSPACES.find((w) => w.id === activeWorkspaceId) ?? WORKSPACES[0]
  const stats = getDashboardStats(activeWorkspaceId)
  const liveAutomations = AUTOMATIONS.filter((a) => a.workspace_id === activeWorkspaceId && a.status === 'live')
  const recentRuns = AUTOMATION_RUNS.slice(0, 10)

  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 200)
    return () => clearTimeout(t)
  }, [activeWorkspaceId])

  if (loading) return <SkeletonDashboard />

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">
              @{workspace.external_username}
            </h1>
            <ChannelBadge type={workspace.channel} />
            {liveAutomations.length > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {liveAutomations.length} live
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            {workspace.follower_count.toLocaleString()} followers &middot; {workspace.media_count} posts
          </p>
        </div>
        <div className="text-right text-sm text-slate-500">
          <p className="font-medium text-slate-700">{workspace.name}</p>
          <p className="capitalize">{workspace.account_type} account</p>
        </div>
      </div>

      {/* Trial banner */}
      <TrialBanner />

      {/* Feature highlights */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100">
            <Star className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">ChatGPT Automation</p>
            <p className="text-sm text-slate-500 mt-0.5">Respond to prayer requests and DMs with AI-powered empathy, 24/7.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100">
            <MessageSquare className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">PDF Direct</p>
            <p className="text-sm text-slate-500 mt-0.5">Send eBooks and resources automatically when followers comment a keyword.</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Triggered"
          value={stats.triggered.value}
          change={stats.triggered.change}
          sparkline={stats.sparklines.triggered}
          icon={Zap}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          label="New Contacts"
          value={stats.newContacts.value}
          change={stats.newContacts.change}
          sparkline={stats.sparklines.newContacts}
          icon={Users}
          iconColor="text-teal-600"
          iconBg="bg-teal-50"
        />
        <StatCard
          label="Messages Sent"
          value={stats.messagesSent.value}
          change={stats.messagesSent.change}
          sparkline={stats.sparklines.messagesSent}
          icon={MessageSquare}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
        />
        <StatCard
          label="CRM Leads"
          value={stats.crmLeads.value}
          change={stats.crmLeads.change}
          sparkline={stats.sparklines.crmLeads}
          icon={Star}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Quick Actions</h2>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          <button className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left hover:border-teal-300 hover:bg-teal-50 transition-colors group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 text-white">
              <Instagram className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 group-hover:text-teal-700">New IG Automation</p>
              <p className="text-xs text-slate-400">Comment or DM trigger</p>
            </div>
          </button>

          <div className="relative">
            <button disabled className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left cursor-not-allowed opacity-60">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-blue-500">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Facebook Automation</p>
                <p className="text-xs text-slate-400">Not connected</p>
              </div>
            </button>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-500">
              Coming Soon
            </span>
          </div>

          <div className="relative">
            <button disabled className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left cursor-not-allowed opacity-60">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100">
                <Calendar className="h-5 w-5 text-teal-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Schedule Broadcast</p>
                <p className="text-xs text-slate-400">Mass DM campaign</p>
              </div>
            </button>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-500">
              Phase 6
            </span>
          </div>
        </div>
      </div>

      {/* ── Analytics ─────────────────────────────────────────────── */}

      {/* Weekly Performance + Contact Sources */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">

        {/* Weekly Performance bar chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Weekly Performance</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
              Last 7 days
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[
                { day: 'Mon', triggered: 28, completed: 24, failed: 4 },
                { day: 'Tue', triggered: 34, completed: 31, failed: 3 },
                { day: 'Wed', triggered: 41, completed: 38, failed: 3 },
                { day: 'Thu', triggered: 38, completed: 35, failed: 3 },
                { day: 'Fri', triggered: 52, completed: 48, failed: 4 },
                { day: 'Sat', triggered: 67, completed: 62, failed: 5 },
                { day: 'Sun', triggered: 76, completed: 71, failed: 5 },
              ]}
              barSize={10}
              barGap={2}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
              />
              <Bar dataKey="triggered" name="Triggered" fill="#14b8a6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[3, 3, 0, 0]} />
              <Bar dataKey="failed" name="Failed" fill="#f43f5e" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Contact Sources donut chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Contact Sources</h2>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={220}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Comment', value: 55 },
                    { name: 'DM', value: 25 },
                    { name: 'Story Reply', value: 15 },
                    { name: 'Manual', value: 5 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {[
                    '#14b8a6', // teal — Comment
                    '#3b82f6', // blue — DM
                    '#8b5cf6', // purple — Story Reply
                    '#f59e0b', // amber — Manual
                  ].map((color, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => `${v}%`}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Custom legend + total */}
            <div className="flex flex-col gap-2.5 flex-1 min-w-0">
              <p className="text-2xl font-bold text-slate-900 tabular-nums">{stats.newContacts.value}</p>
              <p className="text-xs text-slate-400 -mt-1.5">total contacts</p>
              {[
                { label: 'Comment', pct: 55, color: '#14b8a6' },
                { label: 'DM', pct: 25, color: '#3b82f6' },
                { label: 'Story Reply', pct: 15, color: '#8b5cf6' },
                { label: 'Manual', pct: 5, color: '#f59e0b' },
              ].map(({ label, pct, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-xs text-slate-600 flex-1 truncate">{label}</span>
                  <span className="text-xs font-semibold text-slate-700 tabular-nums">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Automations */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Top Performing Automations</h2>
          <span className="rounded-full bg-teal-50 border border-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-600">
            This month
          </span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-5 py-2.5 text-left font-medium w-10">#</th>
              <th className="px-5 py-2.5 text-left font-medium">Automation</th>
              <th className="px-5 py-2.5 text-right font-medium">Triggered</th>
              <th className="px-5 py-2.5 text-right font-medium">Completion</th>
              <th className="px-5 py-2.5 text-right font-medium">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {AUTOMATIONS.slice(0, 3).map((auto, i) => {
              const rate = auto.stats.triggered > 0
                ? Math.round((auto.stats.completed / auto.stats.triggered) * 100)
                : 0
              const up = rate >= 80
              return (
                <tr key={auto.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-900 truncate max-w-[200px]">{auto.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{auto.trigger_type.replace(/_/g, ' ')}</p>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-700 tabular-nums">
                    {auto.stats.triggered.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={cn(
                      'font-semibold tabular-nums',
                      rate >= 90 ? 'text-emerald-600' : rate >= 70 ? 'text-amber-600' : 'text-red-500'
                    )}>
                      {rate}%
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {up
                      ? <TrendingUp className="h-4 w-4 text-emerald-500 ml-auto" />
                      : <TrendingDown className="h-4 w-4 text-red-400 ml-auto" />
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Live automations */}
      {liveAutomations.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Live Automations</h2>
          <div className="flex flex-col gap-2">
            {liveAutomations.map((auto) => (
              <div key={auto.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                  <Zap className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{auto.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{auto.trigger_type.replace(/_/g, ' ')}</p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p className="font-semibold text-emerald-600">{auto.stats.triggered} triggered</p>
                  <p>{auto.stats.completed} completed</p>
                </div>
                <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  Live
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent runs table + Getting started side by side */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent runs */}
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Recent Automation Runs</h2>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Automation</th>
                  <th className="px-4 py-2.5 text-left font-medium">Trigger</th>
                  <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  <th className="px-4 py-2.5 text-left font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRuns.map((run) => (
                  <tr key={run.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-slate-900 max-w-[160px] truncate">
                      {run.automation_name}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 max-w-[120px] truncate">
                      {run.triggered_by?.comment_text ?? '—'}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold capitalize', STATUS_STYLES[run.status] ?? 'bg-slate-100 text-slate-600')}>
                        {run.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap">
                      {formatRelativeTime(run.started_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Getting started */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Getting Started</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-teal-500 transition-all"
                style={{ width: `${(CHECKLIST.filter((c) => c.done).length / CHECKLIST.length) * 100}%` }}
              />
            </div>
            <p className="mb-4 text-xs text-slate-400">
              {CHECKLIST.filter((c) => c.done).length} of {CHECKLIST.length} completed
            </p>
            <ul className="flex flex-col gap-2.5">
              {CHECKLIST.map(({ label, done }) => (
                <li key={label} className="flex items-center gap-2.5">
                  {done
                    ? <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
                    : <Circle className="h-4 w-4 shrink-0 text-slate-300" />
                  }
                  <span className={cn('text-sm', done ? 'text-slate-400 line-through' : 'text-slate-700')}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Account overview */}
          <h2 className="mt-5 mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Account Overview</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
            <dl className="flex flex-col gap-2">
              {[
                { label: 'Plan', value: <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-bold text-teal-700 uppercase">{workspace.plan}</span> },
                { label: 'Status', value: <span className="text-emerald-600 font-semibold capitalize">{workspace.status}</span> },
                { label: 'Account type', value: <span className="capitalize text-slate-700">{workspace.account_type}</span> },
                { label: 'Followers', value: <span className="text-slate-700 font-semibold">{workspace.follower_count.toLocaleString()}</span> },
                { label: 'Posts', value: <span className="text-slate-700 font-semibold">{workspace.media_count}</span> },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <dt className="text-slate-400">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
