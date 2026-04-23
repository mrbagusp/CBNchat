'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Plus,
  Instagram,
  MoreHorizontal,
  RefreshCw,
  ExternalLink,
  Unlink,
  ChevronDown,
  ChevronUp,
  Shield,
  X,
  AlertTriangle,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChannelBadge } from '@/components/cbnchat/channel-badge'
import { WORKSPACES, type Workspace } from '@/lib/mock-data'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-teal-600',
  'bg-teal-500',
  'bg-teal-700',
  'bg-violet-600',
]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

// ─── WorkspaceAvatar ──────────────────────────────────────────────────────────

function WorkspaceAvatar({ workspace, index }: { workspace: Workspace; index: number }) {
  const bg = AVATAR_COLORS[index % AVATAR_COLORS.length]
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl font-bold text-white text-lg ${bg}`}
      style={{ width: 48, height: 48 }}
    >
      {getInitials(workspace.name)}
    </div>
  )
}

// ─── Confirm Disconnect Dialog ────────────────────────────────────────────────

function DisconnectDialog({
  workspace,
  onConfirm,
  onCancel,
}: {
  workspace: Workspace
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Disconnect account?</h3>
              <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                This will remove <span className="font-medium text-slate-700">@{workspace.external_username}</span> from CBNchat. All automations for this account will be paused. You can reconnect at any time.
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="ml-2 flex shrink-0 items-center justify-center rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            Yes, disconnect
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Connect New Account Modal ────────────────────────────────────────────────

function ConnectModal({ onClose }: { onClose: () => void }) {
  function handleInstagram() {
    toast.info(
      'OAuth flow will redirect to Instagram in production. For now, a mock workspace would be added.'
    )
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Connect New Account</h2>
            <p className="mt-0.5 text-sm text-slate-500">Choose a channel to connect</p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Instagram — enabled */}
        <button
          onClick={handleInstagram}
          className="mb-3 flex w-full items-center gap-3 rounded-xl border-2 border-pink-200 bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 text-left hover:border-pink-400 transition-colors group"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white">
            <Instagram className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900">Instagram</p>
            <p className="text-xs text-slate-500">Connect a Business or Creator account</p>
          </div>
        </button>

        {/* Facebook — disabled */}
        <div className="relative mb-5">
          <div className="flex w-full items-center gap-3 rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 opacity-50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Facebook Page</p>
              <p className="text-xs text-slate-500">Connect a Facebook Business Page</p>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-xl">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
              Coming Soon
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// ─── WorkspaceCard ────────────────────────────────────────────────────────────

function WorkspaceCard({
  workspace,
  index,
  onDisconnect,
}: {
  workspace: Workspace
  index: number
  onDisconnect: (ws: Workspace) => void
}) {
  const isConnected = workspace.status === 'connected'

  function handleRefresh() {
    toast.success(`Token refreshed for @${workspace.external_username}`)
  }

  function handleViewProfile() {
    toast.info(`Opening @${workspace.external_username} on Instagram`)
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Avatar */}
      <WorkspaceAvatar workspace={workspace} index={index} />

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">{workspace.name}</span>
          <ChannelBadge type={workspace.channel} />
        </div>
        <p className="mt-0.5 text-sm text-slate-500">@{workspace.external_username}</p>
        <p className="mt-0.5 text-xs text-slate-400">
          Connected on {formatDate(workspace.connected_at)}
        </p>
        <div className="mt-1.5 flex items-center gap-3">
          <span className="text-xs text-slate-500">
            <span className="font-medium text-slate-700">{formatCount(workspace.follower_count)}</span> followers
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500">
            <span className="font-medium text-slate-700">{workspace.media_count}</span> posts
          </span>
        </div>
      </div>

      {/* Right badges + menu */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        {/* Status */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isConnected
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isConnected ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          />
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>

        {/* Plan */}
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
            workspace.plan === 'pro'
              ? 'bg-teal-600 text-white'
              : 'bg-slate-200 text-slate-600'
          }`}
        >
          {workspace.plan}
        </span>

        {/* Dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={handleRefresh} className="flex items-center gap-2 cursor-pointer">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh Token
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleViewProfile} className="flex items-center gap-2 cursor-pointer">
              <ExternalLink className="h-3.5 w-3.5" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDisconnect(workspace)}
              className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Unlink className="h-3.5 w-3.5" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkspacesSettingsPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(WORKSPACES)
  const [confirmWs, setConfirmWs] = useState<Workspace | null>(null)
  const [connectOpen, setConnectOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  function handleDisconnectConfirm() {
    if (!confirmWs) return
    setWorkspaces((prev) => prev.filter((w) => w.id !== confirmWs.id))
    toast.success(`@${confirmWs.external_username} disconnected`)
    setConfirmWs(null)
  }

  return (
    <>
      {/* Modals */}
      {confirmWs && (
        <DisconnectDialog
          workspace={confirmWs}
          onConfirm={handleDisconnectConfirm}
          onCancel={() => setConfirmWs(null)}
        />
      )}
      {connectOpen && <ConnectModal onClose={() => setConnectOpen(false)} />}

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Connected Accounts</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your Instagram and social accounts connected to CBNchat.
            </p>
          </div>
          <button
            onClick={() => setConnectOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Connect New Account
          </button>
        </div>

        {/* Connected accounts list */}
        <div className="space-y-3">
          {workspaces.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center">
              <p className="text-sm font-medium text-slate-500">No accounts connected yet.</p>
              <button
                onClick={() => setConnectOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Connect your first account
              </button>
            </div>
          ) : (
            workspaces.map((ws, i) => (
              <WorkspaceCard
                key={ws.id}
                workspace={ws}
                index={i}
                onDisconnect={setConfirmWs}
              />
            ))
          )}
        </div>

        {/* Connect new account — dashed card */}
        <button
          onClick={() => setConnectOpen(true)}
          className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-teal-200 bg-teal-50/40 px-6 py-5 text-teal-600 hover:border-teal-400 hover:bg-teal-50 transition-colors group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed border-teal-300 group-hover:border-teal-500 transition-colors">
            <Plus className="h-4 w-4" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">Connect via Instagram</p>
            <p className="text-xs text-teal-500">
              Add another Instagram Business or Creator account
            </p>
          </div>
        </button>

        {/* About Instagram Connection — collapsible */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <button
            onClick={() => setInfoOpen((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Shield className="h-4 w-4 text-teal-600 shrink-0" />
              <span className="text-sm font-semibold text-slate-800">About Instagram Connection</span>
            </div>
            {infoOpen
              ? <ChevronUp className="h-4 w-4 text-slate-400" />
              : <ChevronDown className="h-4 w-4 text-slate-400" />
            }
          </button>
          {infoOpen && (
            <div className="border-t border-slate-100 px-5 py-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                CBNchat connects via the official Instagram Login API. Your credentials are never stored — we use OAuth tokens that expire and auto-refresh every 60 days. You can disconnect at any time.
              </p>
              <ul className="mt-3 space-y-1.5">
                {[
                  'Tokens are encrypted at rest and never shared with third parties.',
                  'Disconnecting immediately revokes all API access for that account.',
                  'Automations are paused automatically if a token expires.',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-xs text-slate-500">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
