'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import {
  Users, Search, Filter, ChevronDown, X, Tag,
  Mail, Eye, MoreHorizontal, MessageCircle, Ban,
  Download, Check, Plus,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { CONTACTS, type Contact } from '@/lib/mock-data'
import { ChannelBadge } from '@/components/cbnchat/channel-badge'
import { SkeletonTable } from '@/components/cbnchat/skeleton'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SOURCE_COLORS: Record<string, string> = {
  comment: 'bg-blue-50 text-blue-700 border border-blue-200',
  dm: 'bg-violet-50 text-violet-700 border border-violet-200',
  story_reply: 'bg-amber-50 text-amber-700 border border-amber-200',
}

const TAG_COLORS: Record<string, string> = {
  new_lead: 'bg-teal-50 text-teal-700',
  doa: 'bg-rose-50 text-rose-700',
  yesus_curhat: 'bg-indigo-50 text-indigo-700',
  paid_event: 'bg-amber-50 text-amber-700',
}

function formatRelative(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const h = Math.floor(diff / 3_600_000)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return `${Math.floor(d / 30)}mo ago`
}

function SourceBadge({ source }: { source: string }) {
  const label = source.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${SOURCE_COLORS[source] ?? 'bg-slate-100 text-slate-600'}`}>
      {label}
    </span>
  )
}

function TagPill({ tag, onRemove }: { tag: string; onRemove?: () => void }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${TAG_COLORS[tag] ?? 'bg-slate-100 text-slate-600'}`}>
      {tag.replace(/_/g, ' ')}
      {onRemove && (
        <button onClick={onRemove} className="hover:opacity-70 transition-opacity">
          <X className="size-2.5" />
        </button>
      )}
    </span>
  )
}

// ─── Mock message history ─────────────────────────────────────────────────────

const MOCK_MESSAGES = [
  { id: 1, from: 'contact', text: 'info please', time: '2d ago' },
  { id: 2, from: 'bot', text: 'Halo! Terima kasih sudah bertanya. Superyouth Generation adalah komunitas pemuda Kristen di Indonesia. Yuk DM kami!', time: '2d ago' },
  { id: 3, from: 'contact', text: 'mau ikut gimana caranya?', time: '1d ago' },
  { id: 4, from: 'bot', text: 'Silakan follow @superyouthgen dan aktifkan notifikasi ya! Kami akan segera menghubungi kamu.', time: '1d ago' },
  { id: 5, from: 'contact', text: 'oke makasih banyak ya', time: '12h ago' },
]

// ─── Contact Drawer ───────────────────────────────────────────────────────────

function ContactDrawer({
  contact,
  onClose,
}: {
  contact: Contact
  onClose: () => void
}) {
  const [subscribed, setSubscribed] = useState(contact.subscribed)
  const [tags, setTags] = useState<string[]>(contact.tags)
  const [addingTag, setAddingTag] = useState(false)
  const [newTag, setNewTag] = useState('')

  function handleAddTag() {
    const t = newTag.trim().toLowerCase().replace(/\s+/g, '_')
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t])
    }
    setNewTag('')
    setAddingTag(false)
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 h-full w-96 bg-white border-l border-slate-200 shadow-xl z-50 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <span className="text-sm font-semibold text-slate-800">Contact Profile</span>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center size-8 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Profile section */}
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="relative size-16 shrink-0">
              <Image
                src={contact.profile_pic_url ?? `https://api.dicebear.com/7.x/initials/svg?seed=${contact.channel_username}`}
                alt={contact.full_name}
                width={64}
                height={64}
                className="rounded-full object-cover bg-slate-100"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 truncate">{contact.full_name}</p>
              <p className="text-sm text-teal-700 font-medium">@{contact.channel_username}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <ChannelBadge type={contact.channel} />
                <SourceBadge source={contact.source} />
              </div>
            </div>
          </div>

          {/* Subscribed toggle */}
          <div className="flex items-center justify-between mt-4 p-3 bg-slate-50 rounded-lg">
            <div>
              <p className="text-xs font-semibold text-slate-700">Subscribed</p>
              <p className="text-xs text-slate-400 mt-0.5">Can receive broadcast messages</p>
            </div>
            <Switch
              checked={subscribed}
              onCheckedChange={(v) => {
                setSubscribed(v)
                toast.success(v ? 'Contact subscribed' : 'Contact unsubscribed')
              }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Tags</p>
            <button
              onClick={() => setAddingTag(true)}
              className="inline-flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              <Plus className="size-3" />
              Add tag
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <TagPill
                key={tag}
                tag={tag}
                onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))}
              />
            ))}
            {tags.length === 0 && (
              <p className="text-xs text-slate-400 italic">No tags yet</p>
            )}
          </div>
          {addingTag && (
            <div className="flex gap-2 mt-2">
              <input
                autoFocus
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTag()
                  if (e.key === 'Escape') { setAddingTag(false); setNewTag('') }
                }}
                placeholder="e.g. new_lead"
                className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={handleAddTag}
                className="inline-flex items-center justify-center size-7 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors"
              >
                <Check className="size-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Meta info */}
        <div className="px-5 py-4 border-b border-slate-100 grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-slate-400 font-medium">First seen</p>
            <p className="text-slate-700 mt-0.5 font-medium">{formatRelative(contact.first_seen_at)}</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Last seen</p>
            <p className="text-slate-700 mt-0.5 font-medium">{formatRelative(contact.last_seen_at)}</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Source</p>
            <p className="text-slate-700 mt-0.5 font-medium capitalize">{contact.source.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">External ID</p>
            <p className="text-slate-700 mt-0.5 font-medium truncate">{contact.external_user_id}</p>
          </div>
        </div>

        {/* Message history */}
        <div className="px-5 py-4 flex-1">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Message History</p>
          <div className="space-y-3">
            {MOCK_MESSAGES.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === 'bot' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                  msg.from === 'bot'
                    ? 'bg-teal-600 text-white rounded-br-sm'
                    : 'bg-slate-100 text-slate-700 rounded-bl-sm'
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.from === 'bot' ? 'text-teal-200' : 'text-slate-400'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-5 py-4 border-t border-slate-100 flex gap-2 shrink-0">
          <button
            onClick={() => toast.info('Send DM coming in Phase 4')}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium transition-colors"
          >
            <MessageCircle className="size-4" />
            Send DM
          </button>
          <button
            onClick={() => toast.info('Block action coming in Phase 4')}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
          >
            <Ban className="size-4" />
            Block
          </button>
        </div>
      </aside>
    </>
  )
}

// ─── Contacts Table ───────────────────────────────────────────────────────────

const SOURCES = ['All', 'comment', 'dm', 'story_reply'] as const
const ALL_TAGS = ['new_lead', 'doa', 'yesus_curhat', 'paid_event'] as const

export default function ContactsPage() {
  const activeWorkspaceId = useAppStore((s) => s.activeWorkspaceId)

  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [source, setSource] = useState<string>('All')
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [sourceOpen, setSourceOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 200)
    return () => clearTimeout(t)
  }, [activeWorkspaceId])

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const filtered = useMemo(() => {
    return CONTACTS
      .filter((c) => c.workspace_id === activeWorkspaceId)
      .filter((c) => {
        if (!search.trim()) return true
        const q = search.toLowerCase()
        return (
          c.channel_username.toLowerCase().includes(q) ||
          c.full_name.toLowerCase().includes(q)
        )
      })
      .filter((c) => source === 'All' || c.source === source)
      .filter((c) =>
        activeTags.length === 0 || activeTags.every((t) => c.tags.includes(t))
      )
  }, [activeWorkspaceId, search, source, activeTags])

  const hasFilters = search || source !== 'All' || activeTags.length > 0

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            {filtered.length}
          </span>
        </div>
        <button
          onClick={() => toast.info('CSV export coming in Phase 4')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Download className="size-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Source dropdown */}
        <DropdownMenu open={sourceOpen} onOpenChange={setSourceOpen}>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 transition-colors">
              <Filter className="size-4 text-slate-400" />
              {source === 'All' ? 'All Sources' : source.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              <ChevronDown className="size-3.5 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {SOURCES.map((s) => (
              <DropdownMenuItem
                key={s}
                className="gap-2 cursor-pointer capitalize"
                onClick={() => { setSource(s); setSourceOpen(false) }}
              >
                {source === s && <Check className="size-3.5 text-teal-600" />}
                <span className={source !== s ? 'pl-5' : ''}>{s === 'All' ? 'All Sources' : s.replace('_', ' ')}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Tag pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
                activeTags.includes(tag)
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400 hover:text-teal-600'
              }`}
            >
              <Tag className="size-3" />
              {tag.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setSource('All'); setActiveTags([]) }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="size-3.5" />
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={6} />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-slate-200">
          <div className="size-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Users className="size-7 text-slate-400" />
          </div>
          <p className="text-base font-semibold text-slate-700 mb-1">
            {hasFilters ? 'No contacts match your filters' : 'No contacts yet'}
          </p>
          <p className="text-sm text-slate-400 mb-5">
            {hasFilters
              ? 'Try adjusting your search or filters.'
              : 'Contacts will appear here when people interact with your automations.'}
          </p>
          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setSource('All'); setActiveTags([]) }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <X className="size-4" />
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="pl-5 pr-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-10" />
                  <th className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Username</th>
                  <th className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Full Name</th>
                  <th className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Source</th>
                  <th className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tags</th>
                  <th className="hidden md:table-cell px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Last Seen</th>
                  <th className="hidden md:table-cell px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Sub.</th>
                  <th className="px-4 py-3 w-10" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    {/* Avatar */}
                    <td className="pl-5 pr-3 py-3">
                      <Image
                        src={contact.profile_pic_url ?? `https://api.dicebear.com/7.x/initials/svg?seed=${contact.channel_username}`}
                        alt={contact.full_name}
                        width={32}
                        height={32}
                        className="rounded-full bg-slate-100"
                        unoptimized
                      />
                    </td>
                    {/* Username */}
                    <td className="px-3 py-3">
                      <span className="text-sm font-medium text-teal-700">@{contact.channel_username}</span>
                    </td>
                    {/* Full name */}
                    <td className="px-3 py-3">
                      <span className="text-sm text-slate-700">{contact.full_name}</span>
                    </td>
                    {/* Source */}
                    <td className="px-3 py-3">
                      <SourceBadge source={contact.source} />
                    </td>
                    {/* Tags */}
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.slice(0, 2).map((tag) => (
                          <TagPill key={tag} tag={tag} />
                        ))}
                        {contact.tags.length > 2 && (
                          <span className="text-xs text-slate-400">+{contact.tags.length - 2}</span>
                        )}
                      </div>
                    </td>
                    {/* Last seen */}
                    <td className="hidden md:table-cell px-3 py-3">
                      <span className="text-sm text-slate-500">{formatRelative(contact.last_seen_at)}</span>
                    </td>
                    {/* Subscribed */}
                    <td className="hidden md:table-cell px-3 py-3">
                      <span
                        className={`inline-block size-2.5 rounded-full ${contact.subscribed ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        title={contact.subscribed ? 'Subscribed' : 'Unsubscribed'}
                      />
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="opacity-0 group-hover:opacity-100 inline-flex items-center justify-center size-7 rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-all"
                          >
                            <MoreHorizontal className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); setSelectedContact(contact) }}
                          >
                            <Eye className="size-4" />
                            View profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); toast.info('Send DM coming in Phase 4') }}
                          >
                            <Mail className="size-4" />
                            Send DM
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-400">
              Showing {filtered.length} of {CONTACTS.filter((c) => c.workspace_id === activeWorkspaceId).length} contacts
            </p>
          </div>
        </div>
      )}

      {/* Contact Drawer */}
      {selectedContact && (
        <ContactDrawer
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
        />
      )}
    </div>
  )
}
