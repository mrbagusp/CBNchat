'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Images,
  Search,
  Video,
  Image as ImageIcon,
  LayoutGrid,
  Zap,
  ExternalLink,
  PlayCircle,
  Layers,
  Filter,
} from 'lucide-react'
import { MOCK_MEDIA, type MediaItem } from '@/lib/mock-data'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

// ─── Media type badge config ──────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  MediaItem['media_type'],
  { label: string; icon: React.ElementType; bg: string; text: string }
> = {
  VIDEO: {
    label: 'Video',
    icon: PlayCircle,
    bg: 'bg-rose-500/90',
    text: 'text-white',
  },
  IMAGE: {
    label: 'Image',
    icon: ImageIcon,
    bg: 'bg-sky-500/90',
    text: 'text-white',
  },
  CAROUSEL: {
    label: 'Carousel',
    icon: Layers,
    bg: 'bg-violet-500/90',
    text: 'text-white',
  },
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────

const FILTER_TABS = [
  { id: 'ALL', label: 'All', icon: LayoutGrid },
  { id: 'VIDEO', label: 'Videos', icon: Video },
  { id: 'IMAGE', label: 'Images', icon: ImageIcon },
  { id: 'CAROUSEL', label: 'Carousels', icon: Layers },
] as const

type FilterId = typeof FILTER_TABS[number]['id']

// ─── Post card ────────────────────────────────────────────────────────────────

function PostCard({
  item,
  onCreateAutomation,
}: {
  item: MediaItem
  onCreateAutomation: (item: MediaItem) => void
}) {
  const cfg = TYPE_CONFIG[item.media_type]
  const Icon = cfg.icon

  return (
    <article className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-teal-300 hover:shadow-md transition-all duration-200">
      {/* Thumbnail */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={item.thumbnail_url}
          alt={item.caption}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Type badge — top left */}
        <div
          className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-sm ${cfg.bg} ${cfg.text}`}
        >
          <Icon className="size-2.5" />
          {cfg.label}
        </div>

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-3">
          <button
            onClick={() => onCreateAutomation(item)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-teal-500 hover:bg-teal-400 text-white text-xs font-semibold transition-colors"
          >
            <Zap className="size-3.5" />
            Create Automation
          </button>
          <a
            href={item.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="size-3.5" />
            View on Instagram
          </a>
        </div>
      </div>

      {/* Caption + meta */}
      <div className="p-3">
        <p className="text-xs font-medium text-slate-800 line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {item.caption}
        </p>
        <p className="text-[10px] text-slate-400 mt-2">{formatRelativeTime(item.timestamp)}</p>
      </div>
    </article>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PostsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterId>('ALL')

  const filtered = useMemo(() => {
    return MOCK_MEDIA.filter((item) => {
      const matchType = activeFilter === 'ALL' || item.media_type === activeFilter
      const matchSearch =
        search.trim() === '' ||
        item.caption.toLowerCase().includes(search.toLowerCase())
      return matchType && matchSearch
    })
  }, [search, activeFilter])

  // Counts per type for tab badges
  const counts = useMemo(
    () => ({
      ALL: MOCK_MEDIA.length,
      VIDEO: MOCK_MEDIA.filter((m) => m.media_type === 'VIDEO').length,
      IMAGE: MOCK_MEDIA.filter((m) => m.media_type === 'IMAGE').length,
      CAROUSEL: MOCK_MEDIA.filter((m) => m.media_type === 'CAROUSEL').length,
    }),
    []
  )

  function handleCreateAutomation(item: MediaItem) {
    // In Phase 4, this will pre-populate the automation builder with this post
    toast.success(`Creating automation for: "${item.caption.slice(0, 40)}..."`)
    router.push('/app/automation/new')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="flex items-center justify-center size-8 rounded-lg bg-gradient-to-br from-rose-400 to-pink-500">
              <Images className="size-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Posts</h1>
          </div>
          <p className="text-sm text-slate-500">
            {MOCK_MEDIA.length} posts synced from Instagram &middot; Click a post to create an automation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.info('Manual sync coming in Phase 4 with real API')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Sync Posts
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Type filter tabs */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {FILTER_TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveFilter(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeFilter === id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="size-3.5" />
              {label}
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeFilter === id
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {counts[id]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search captions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <Filter className="size-3.5" />
            </button>
          )}
        </div>

        {/* Result count */}
        {(search || activeFilter !== 'ALL') && (
          <span className="text-sm text-slate-500">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="size-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Images className="size-7 text-slate-400" />
          </div>
          <p className="text-base font-medium text-slate-700 mb-1">No posts found</p>
          <p className="text-sm text-slate-400">
            {search ? 'Try a different search term.' : 'No posts match the selected filter.'}
          </p>
          <button
            onClick={() => { setSearch(''); setActiveFilter('ALL') }}
            className="mt-4 text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map((item) => (
            <PostCard
              key={item.id}
              item={item}
              onCreateAutomation={handleCreateAutomation}
            />
          ))}
        </div>
      )}

      {/* Footer info */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
        <span>Showing {filtered.length} of {MOCK_MEDIA.length} posts</span>
        <span>Last synced: just now</span>
      </div>
    </div>
  )
}
