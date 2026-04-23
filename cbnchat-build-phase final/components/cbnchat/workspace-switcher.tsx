'use client'

import { useState } from 'react'
import { ChevronDown, Check, Plus, Instagram, AlertCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { WORKSPACES, type Workspace } from '@/lib/mock-data'

const TEAL_SHADES = [
  'bg-teal-600',
  'bg-teal-500',
  'bg-teal-700',
  'bg-teal-400',
]

function WorkspaceAvatar({ workspace, index, size = 'md' }: { workspace: Workspace; index: number; size?: 'sm' | 'md' }) {
  const initials = workspace.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const bg = TEAL_SHADES[index % TEAL_SHADES.length]
  const sizeClass = size === 'sm' ? 'h-6 w-6 text-xs' : 'h-8 w-8 text-sm'
  return (
    <div className={cn('flex shrink-0 items-center justify-center rounded-md font-semibold text-white', bg, sizeClass)}>
      {initials}
    </div>
  )
}

export function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const activeWorkspaceId = useAppStore((s) => s.activeWorkspaceId)
  const setActiveWorkspaceId = useAppStore((s) => s.setActiveWorkspaceId)
  const [connectOpen, setConnectOpen] = useState(false)

  const activeWorkspace = WORKSPACES.find((w) => w.id === activeWorkspaceId) ?? WORKSPACES[0]
  const activeIndex = WORKSPACES.findIndex((w) => w.id === activeWorkspaceId)
  const instagramWorkspaces = WORKSPACES.filter((w) => w.channel === 'instagram')

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 text-left hover:bg-slate-50 transition-colors',
              collapsed && 'justify-center p-2'
            )}
          >
            <WorkspaceAvatar workspace={activeWorkspace} index={activeIndex} />
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {activeWorkspace.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    @{activeWorkspace.external_username}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
              </>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64" align="start" sideOffset={4}>
          <DropdownMenuLabel className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
            <Instagram className="h-3 w-3 text-pink-500" />
            Instagram
          </DropdownMenuLabel>
          {instagramWorkspaces.map((ws, i) => (
            <DropdownMenuItem
              key={ws.id}
              onClick={() => setActiveWorkspaceId(ws.id)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <WorkspaceAvatar workspace={ws} index={i} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{ws.name}</p>
                <p className="truncate text-xs text-slate-500">@{ws.external_username}</p>
              </div>
              {ws.id === activeWorkspaceId && (
                <Check className="h-4 w-4 text-teal-600" />
              )}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuLabel className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-blue-500">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </DropdownMenuLabel>
          <div className="px-2 py-1.5">
            <p className="text-xs italic text-slate-400">No Facebook Pages connected yet</p>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setConnectOpen(true)}
            className="flex items-center gap-2 cursor-pointer text-teal-600 font-medium"
          >
            <Plus className="h-4 w-4" />
            Connect New Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Connect modal */}
      {connectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConnectOpen(false)}>
          <div className="w-96 rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-1 text-lg font-bold text-slate-900">Connect New Account</h2>
            <p className="mb-5 text-sm text-slate-500">Choose a channel to connect</p>

            <button className="mb-3 flex w-full items-center gap-3 rounded-xl border-2 border-pink-200 bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 text-left hover:border-pink-400 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white">
                <Instagram className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Instagram</p>
                <p className="text-xs text-slate-500">Connect a Business or Creator account</p>
              </div>
            </button>

            <div className="relative mb-5">
              <button disabled className="flex w-full items-center gap-3 rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-left opacity-60 cursor-not-allowed">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Facebook Page</p>
                  <p className="text-xs text-slate-500">Connect a Facebook Business Page</p>
                </div>
              </button>
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/70">
                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                  Coming in Phase 7
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setConnectOpen(false)}
                className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
