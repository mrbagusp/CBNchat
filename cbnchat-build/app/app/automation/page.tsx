'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Workflow, Plus, Search, FolderOpen, MoreHorizontal,
  Play, Pause, FileEdit, Trash2, Zap, Copy
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { AUTOMATIONS, FOLDERS, type Automation } from '@/lib/mock-data'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SkeletonTable } from '@/components/cbnchat/skeleton'

function StatusBadge({ status }: { status: string }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
        Live
      </span>
    )
  }
  if (status === 'paused') {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700">
        <span className="size-2 rounded-full bg-amber-400" />
        Paused
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
      <span className="size-2 rounded-full bg-slate-300" />
      Draft
    </span>
  )
}

function formatTrigger(trigger: string) {
  return trigger
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function AutomationRow({
  automation,
  onStatusToggle,
  onDelete,
}: {
  automation: Automation
  onStatusToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
      <td className="pl-4 py-3 w-10">
        <input
          type="checkbox"
          className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
        />
      </td>
      <td className="px-4 py-3">
        <Link
          href={`/app/automation/${automation.id}`}
          className="font-medium text-slate-900 hover:text-teal-700 transition-colors"
        >
          {automation.name}
        </Link>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={automation.status} />
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
          <Zap className="size-3.5 text-amber-500" />
          {formatTrigger(automation.trigger_type)}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-slate-700 tabular-nums">
        {automation.stats.triggered.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-sm text-emerald-700 tabular-nums">
        {automation.stats.completed.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-sm text-rose-600 tabular-nums">
        {automation.stats.failed.toLocaleString()}
      </td>
      <td className="px-4 py-3 w-12">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="opacity-0 group-hover:opacity-100 inline-flex items-center justify-center size-8 rounded-md hover:bg-slate-200 transition-all">
              <MoreHorizontal className="size-4 text-slate-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => toast.info('Editor coming in Phase 2')}
            >
              <FileEdit className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => toast.success('Automation duplicated')}
            >
              <Copy className="size-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => onStatusToggle(automation.id)}
            >
              {automation.status === 'live' ? (
                <>
                  <Pause className="size-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  Resume
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="gap-2 cursor-pointer"
              onClick={() => onDelete(automation.id)}
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}

export default function AutomationPage() {
  const activeWorkspaceId = useAppStore((s) => s.activeWorkspaceId)

  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeFolder, setActiveFolder] = useState<string | null>(null)
  const [automations, setAutomations] = useState<Automation[]>(AUTOMATIONS)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 200)
    return () => clearTimeout(t)
  }, [activeWorkspaceId])

  const workspaceFolders = FOLDERS.filter(
    (f) => f.workspace_id === activeWorkspaceId
  )

  const filtered = automations
    .filter((a) => a.workspace_id === activeWorkspaceId)
    .filter((a) =>
      search.trim() === '' ||
      a.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((a) => {
      if (activeFolder === null) return true
      return a.folder_id === activeFolder
    })

  function handleStatusToggle(id: string) {
    setAutomations((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a
        const next = a.status === 'live' ? 'paused' : 'live'
        toast.success(`Automation ${next === 'live' ? 'resumed' : 'paused'}`)
        return { ...a, status: next }
      })
    )
  }

  function handleDelete(id: string) {
    setAutomations((prev) => prev.filter((a) => a.id !== id))
    toast.success('Automation deleted')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold text-slate-900">Automations</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search all Automations"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-72 pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <Link
            href="/app/automation/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="size-4" />
            New Automation
          </Link>
        </div>
      </div>

      {/* Folder tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        <button
          onClick={() => setActiveFolder(null)}
          className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
            activeFolder === null
              ? 'text-teal-700 border-b-2 border-teal-600 -mb-px'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          All
        </button>
        {workspaceFolders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => setActiveFolder(folder.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-1.5 relative ${
              activeFolder === folder.id
                ? 'text-teal-700 border-b-2 border-teal-600 -mb-px'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FolderOpen className="size-3.5" />
            {folder.name}
          </button>
        ))}
        <button
          onClick={() => toast.info('Folder management coming in Phase 2')}
          className="ml-2 px-3 py-2.5 text-sm text-slate-400 hover:text-teal-700 transition-colors"
        >
          + New Folder
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={5} />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-xl border border-slate-200">
          <div className="size-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Workflow className="size-8 text-slate-400" />
          </div>
          <p className="text-base font-semibold text-slate-800 mb-1">
            {search ? 'No automations match your search' : 'No automations yet'}
          </p>
          <p className="text-sm text-slate-400 mb-6 max-w-xs leading-relaxed">
            {search
              ? 'Try a different search term or clear the search field.'
              : 'Create your first automation to start capturing leads and sending replies automatically.'}
          </p>
          {!search && (
            <Link
              href="/app/automation/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Plus className="size-4" />
              Create Automation
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="pl-4 py-3 w-10">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Name
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Trigger
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Triggered
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Completed
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Failed
                </th>
                <th className="px-4 py-3 w-12" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((automation) => (
                <AutomationRow
                  key={automation.id}
                  automation={automation}
                  onStatusToggle={handleStatusToggle}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-400">
              Showing {filtered.length} automation{filtered.length !== 1 ? 's' : ''}
              {activeFolder !== null && ` in ${workspaceFolders.find((f) => f.id === activeFolder)?.name}`}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
