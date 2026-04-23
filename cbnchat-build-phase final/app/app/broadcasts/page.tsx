'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Radio,
  Plus,
  Send,
  BarChart2,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// ─── Types ────────────────────────────────────────────────────────────────────

type BroadcastStatus = 'sent' | 'scheduled' | 'draft' | 'failed'

interface Broadcast {
  id: string
  name: string
  status: BroadcastStatus
  sent: number
  opened: number
  createdAt: string
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  BroadcastStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  sent: {
    label: 'Sent',
    icon: CheckCircle2,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  scheduled: {
    label: 'Scheduled',
    icon: Clock,
    className: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  draft: {
    label: 'Draft',
    icon: BarChart2,
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  failed: {
    label: 'Failed',
    icon: XCircle,
    className: 'bg-red-50 text-red-600 border-red-200',
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function openRate(sent: number, opened: number) {
  if (sent === 0) return '—'
  return `${Math.round((opened / sent) * 100)}%`
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-xl border border-slate-200">
      <div className="flex items-center justify-center size-16 rounded-2xl bg-slate-100 mb-4">
        <Radio className="size-8 text-slate-400" />
      </div>
      <p className="text-base font-semibold text-slate-800 mb-1">No broadcasts yet</p>
      <p className="text-sm text-slate-400 mb-6 max-w-xs leading-relaxed">
        Create your first campaign to reach your audience with a targeted DM blast.
      </p>
      <button
        onClick={onNew}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        <Plus className="size-4" />
        New Broadcast
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BroadcastsPage() {
  // Start with an empty list — the user hasn't created any broadcasts yet
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([])

  function handleNew() {
    toast.info('Broadcast creation coming soon.')
  }

  function handleDelete(id: string) {
    setBroadcasts((prev) => prev.filter((b) => b.id !== id))
    toast.success('Broadcast deleted.')
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="flex items-center justify-center size-8 rounded-lg bg-teal-700">
              <Radio className="size-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Broadcasts</h1>
          </div>
          <p className="text-sm text-slate-500">
            Schedule and send DM campaigns to segmented contact lists.
          </p>
        </div>

        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus className="size-4" />
          New Broadcast
        </button>
      </div>

      {/* Summary stat pills — only shown when broadcasts exist */}
      {broadcasts.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Total', value: broadcasts.length, color: 'bg-slate-100 text-slate-700' },
            { label: 'Sent', value: broadcasts.filter((b) => b.status === 'sent').length, color: 'bg-emerald-50 text-emerald-700' },
            { label: 'Scheduled', value: broadcasts.filter((b) => b.status === 'scheduled').length, color: 'bg-sky-50 text-sky-700' },
            { label: 'Draft', value: broadcasts.filter((b) => b.status === 'draft').length, color: 'bg-slate-100 text-slate-500' },
          ].map(({ label, value, color }) => (
            <span key={label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${color}`}>
              {label}: {value}
            </span>
          ))}
        </div>
      )}

      {/* Table or empty state */}
      {broadcasts.length === 0 ? (
        <EmptyState onNew={handleNew} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Name
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Sent
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Opened
                  </th>
                  <th className="hidden md:table-cell px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Created
                  </th>
                  <th className="px-5 py-3.5 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {broadcasts.map((bc) => {
                  const cfg = STATUS_CONFIG[bc.status]
                  const Icon = cfg.icon
                  return (
                    <tr key={bc.id} className="hover:bg-slate-50 transition-colors">
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center size-8 rounded-lg bg-teal-50 shrink-0">
                            <Send className="size-3.5 text-teal-600" />
                          </div>
                          <span className="font-medium text-slate-900 truncate max-w-[180px]">
                            {bc.name}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.className}`}>
                          <Icon className="size-3" />
                          {cfg.label}
                        </span>
                      </td>

                      {/* Sent */}
                      <td className="px-5 py-4 text-right font-medium text-slate-700 tabular-nums">
                        {bc.sent.toLocaleString()}
                      </td>

                      {/* Opened */}
                      <td className="px-5 py-4 text-right tabular-nums">
                        <span className="text-slate-700 font-medium">{bc.opened.toLocaleString()}</span>
                        <span className="text-slate-400 text-xs ml-1.5">
                          ({openRate(bc.sent, bc.opened)})
                        </span>
                      </td>

                      {/* Created (hidden on mobile) */}
                      <td className="hidden md:table-cell px-5 py-4 text-sm text-slate-500">
                        {formatDate(bc.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex items-center justify-center size-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                              <MoreHorizontal className="size-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem onClick={() => toast.info('Broadcast editing coming soon.')}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info('Duplicate coming soon.')}>
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(bc.id)}
                              className="text-red-600 focus:text-red-700 focus:bg-red-50"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
