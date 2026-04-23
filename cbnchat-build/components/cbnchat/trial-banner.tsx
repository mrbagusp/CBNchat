'use client'

import { Gift, X } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { WORKSPACES } from '@/lib/mock-data'

export function TrialBanner() {
  const activeWorkspaceId = useAppStore((s) => s.activeWorkspaceId)
  const dismissed = useAppStore((s) => s.trialBannerDismissed)
  const dismissTrialBanner = useAppStore((s) => s.dismissTrialBanner)

  const workspace = WORKSPACES.find((w) => w.id === activeWorkspaceId)

  if (dismissed || !workspace?.trial_ends_at) return null

  const trialEnd = new Date(workspace.trial_ends_at)
  const now = new Date()
  const daysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / 86400000))

  return (
    <div className="relative flex items-center gap-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-3 text-white shadow-sm mb-6">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
        <Gift className="h-4 w-4" />
      </div>
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-amber-900">
          Pro Plan Trial
        </span>
        <span className="text-sm">
          {daysLeft > 0
            ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining on your trial`
            : 'Your trial has ended'}
        </span>
      </div>
      <button
        onClick={dismissTrialBanner}
        aria-label="Dismiss trial banner"
        className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-white/20 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
