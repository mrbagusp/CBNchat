'use client'

import { useState, KeyboardEvent } from 'react'
import {
  Instagram,
  Video,
  MessageCircle,
  UserCheck,
  X,
  MessageSquareText,
  ImagePlay,
  ShoppingBag,
  Radio,
  ChevronLeft,
  Search,
  PlayCircle,
  Layers,
  Image as ImageIcon,
  Check,
  Globe,
  Clock,
  Hash,
  ChevronDown,
} from 'lucide-react'
import { MOCK_MEDIA, type MediaItem } from '@/lib/mock-data'
import { formatDistanceToNow } from 'date-fns'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TriggerOption {
  type: string
  label: string
  description: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
}

export type PostSelectionMode = 'specific' | 'all' | 'next'
export type CommentMode = 'all' | 'keyword'
export type KeywordMatchMode = 'contains' | 'exact' | 'starts_with'

export interface TriggerConfig {
  triggerType: string
  triggerLabel: string
  postMode: PostSelectionMode
  selectedMediaIds: string[]
  commentMode: CommentMode
  keywords: string[]
  keywordMatch: KeywordMatchMode
}

interface TriggerModalProps {
  open: boolean
  onClose: () => void
  onSelect: (config: TriggerConfig) => void
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MEDIA_TYPE_ICON: Record<MediaItem['media_type'], React.ElementType> = {
  VIDEO: PlayCircle,
  IMAGE: ImageIcon,
  CAROUSEL: Layers,
}

const MEDIA_TYPE_LABEL: Record<MediaItem['media_type'], string> = {
  VIDEO: 'Video',
  IMAGE: 'Image',
  CAROUSEL: 'Carousel',
}

const MEDIA_TYPE_COLOR: Record<MediaItem['media_type'], string> = {
  VIDEO: 'bg-rose-500',
  IMAGE: 'bg-sky-500',
  CAROUSEL: 'bg-violet-500',
}

function relativeTime(ts: string) {
  try {
    return formatDistanceToNow(new Date(ts), { addSuffix: true })
  } catch {
    return ts
  }
}

// ─── Channel tabs ─────────────────────────────────────────────────────────────

const CHANNEL_TABS = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, disabled: false },
  { id: 'tiktok', label: 'TikTok', icon: Video, disabled: true },
  { id: 'messenger', label: 'Messenger', icon: MessageCircle, disabled: true },
  { id: 'contact_events', label: 'Contact Events', icon: UserCheck, disabled: true },
]

// ─── Instagram trigger options ────────────────────────────────────────────────

const INSTAGRAM_TRIGGERS: TriggerOption[] = [
  {
    type: 'post_comment',
    label: 'Post or Reel Comments',
    description: 'User comments on your Post or Reel. Reply with a DM or comment automatically.',
    icon: MessageSquareText,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-500',
  },
  {
    type: 'story_reply',
    label: 'Story Reply',
    description: 'User replies to your Story. Capture leads from Story interactions.',
    icon: ImagePlay,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
  },
  {
    type: 'dm_message',
    label: 'Instagram Message',
    description: 'User sends a direct message to your inbox. Trigger a flow on keyword match.',
    icon: MessageCircle,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
  },
  {
    type: 'ig_ad',
    label: 'Instagram Ads',
    description: 'User clicks an Instagram Ad and messages you. Convert ad traffic into leads.',
    icon: ShoppingBag,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    type: 'live_comment',
    label: 'Live Comments',
    description: 'User comments during a Live broadcast. Engage your live audience automatically.',
    icon: Radio,
    iconBg: 'bg-pink-50',
    iconColor: 'text-pink-500',
  },
]

// ─── Step progress indicator ──────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all ${
            i < current ? 'bg-teal-500 w-6' : i === current ? 'bg-teal-400 w-4' : 'bg-slate-200 w-4'
          }`}
        />
      ))}
      <span className="text-[10px] text-slate-400 ml-1 font-medium">
        Step {current + 1} of {total}
      </span>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

type Step = 0 | 1 | 2

const DEFAULT_CONFIG: Omit<TriggerConfig, 'triggerType' | 'triggerLabel'> = {
  postMode: 'specific',
  selectedMediaIds: [],
  commentMode: 'all',
  keywords: [],
  keywordMatch: 'contains',
}

export function TriggerModal({ open, onClose, onSelect }: TriggerModalProps) {
  const [activeChannel, setActiveChannel] = useState('instagram')
  const [step, setStep] = useState<Step>(0)
  const [pendingTrigger, setPendingTrigger] = useState<TriggerOption | null>(null)

  // Step 2 state
  const [postMode, setPostMode] = useState<PostSelectionMode>('specific')
  const [selectedMediaIds, setSelectedMediaIds] = useState<Set<string>>(new Set())
  const [mediaSearch, setMediaSearch] = useState('')

  // Step 3 state
  const [commentMode, setCommentMode] = useState<CommentMode>('all')
  const [keywords, setKeywords] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState('')
  const [keywordMatch, setKeywordMatch] = useState<KeywordMatchMode>('contains')

  if (!open) return null

  // ── Helpers ──

  function handleClose() {
    onClose()
    setTimeout(resetState, 250)
  }

  function resetState() {
    setStep(0)
    setPendingTrigger(null)
    setPostMode('specific')
    setSelectedMediaIds(new Set())
    setMediaSearch('')
    setCommentMode('all')
    setKeywords([])
    setKeywordInput('')
    setKeywordMatch('contains')
  }

  function handleTriggerClick(trigger: TriggerOption) {
    if (trigger.type === 'post_comment') {
      setPendingTrigger(trigger)
      setStep(1)
    } else {
      onSelect({
        triggerType: trigger.type,
        triggerLabel: trigger.label,
        ...DEFAULT_CONFIG,
      })
      handleClose()
    }
  }

  function handleStep2Next() {
    if (!canProceedStep2) return
    setStep(2)
  }

  function handleSaveTrigger() {
    if (!pendingTrigger) return
    // Auto-add any text still in the input field before saving
    let finalKeywords = [...keywords]
    const pending = keywordInput.trim().toLowerCase()
    if (pending && !finalKeywords.includes(pending)) {
      finalKeywords = [...finalKeywords, pending]
      setKeywords(finalKeywords)
      setKeywordInput('')
    }
    if (commentMode === 'keyword' && finalKeywords.length === 0) return
    onSelect({
      triggerType: pendingTrigger.type,
      triggerLabel: pendingTrigger.label,
      postMode,
      selectedMediaIds: Array.from(selectedMediaIds),
      commentMode,
      keywords: finalKeywords,
      keywordMatch,
    })
    handleClose()
  }

  function toggleMedia(id: string) {
    setSelectedMediaIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function addKeyword() {
    const kw = keywordInput.trim().toLowerCase()
    if (kw && !keywords.includes(kw)) {
      setKeywords((prev) => [...prev, kw])
    }
    setKeywordInput('')
  }

  function handleKeywordKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword()
    }
    if (e.key === 'Backspace' && keywordInput === '' && keywords.length > 0) {
      setKeywords((prev) => prev.slice(0, -1))
    }
  }

  function removeKeyword(kw: string) {
    setKeywords((prev) => prev.filter((k) => k !== kw))
  }

  const filteredMedia = MOCK_MEDIA.filter(
    (m) =>
      mediaSearch.trim() === '' ||
      m.caption.toLowerCase().includes(mediaSearch.toLowerCase())
  )

  const canProceedStep2 =
    postMode === 'all' ||
    postMode === 'next' ||
    (postMode === 'specific' && selectedMediaIds.size > 0)

  const canSaveStep3 =
    commentMode === 'all' ||
    (commentMode === 'keyword' && (keywords.length > 0 || keywordInput.trim() !== ''))

  // ── Render ──

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-[720px] max-h-[600px] flex flex-col overflow-hidden">

        {/* ════════════════════════════════════════════════════
            STEP 0 — Select trigger type
        ════════════════════════════════════════════════════ */}
        {step === 0 && (
          <>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Choose a Trigger</h2>
                <p className="text-xs text-slate-500 mt-0.5">Select the event that starts your automation</p>
              </div>
              <button onClick={handleClose} className="flex items-center justify-center size-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                <X className="size-4" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Channel tabs */}
              <nav className="w-48 border-r border-slate-100 py-2 shrink-0 overflow-y-auto">
                {CHANNEL_TABS.map((tab) => (
                  <div key={tab.id} className="relative">
                    <button
                      disabled={tab.disabled}
                      onClick={() => !tab.disabled && setActiveChannel(tab.id)}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors text-left
                        ${tab.disabled ? 'opacity-40 cursor-not-allowed text-slate-500' : 'cursor-pointer'}
                        ${activeChannel === tab.id && !tab.disabled
                          ? 'bg-rose-50 text-rose-600 border-r-2 border-rose-500'
                          : !tab.disabled ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' : ''
                        }`}
                    >
                      <tab.icon className="size-4 shrink-0" />
                      {tab.label}
                    </button>
                    {tab.disabled && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded pointer-events-none">
                        SOON
                      </span>
                    )}
                  </div>
                ))}
              </nav>

              {/* Trigger cards */}
              <div className="flex-1 overflow-y-auto py-3 px-3 space-y-2">
                {activeChannel === 'instagram' && INSTAGRAM_TRIGGERS.map((trigger) => (
                  <button
                    key={trigger.type}
                    onClick={() => handleTriggerClick(trigger)}
                    className="w-full flex items-start gap-3 px-4 py-3 bg-white border border-slate-200 rounded-lg hover:border-teal-300 hover:bg-teal-50/30 hover:shadow-sm transition-all text-left group"
                  >
                    <span className={`flex items-center justify-center size-9 rounded-lg shrink-0 mt-0.5 ${trigger.iconBg}`}>
                      <trigger.icon className={`size-4 ${trigger.iconColor}`} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                        {trigger.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{trigger.description}</p>
                    </div>
                    {trigger.type === 'post_comment' && (
                      <span className="shrink-0 mt-0.5 text-[10px] font-semibold text-teal-600 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded whitespace-nowrap">
                        3-step setup
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 1 — Pick a Post or Reel
        ════════════════════════════════════════════════════ */}
        {step === 1 && (
          <>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <button onClick={() => setStep(0)} className="flex items-center justify-center size-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0">
                  <ChevronLeft className="size-4" />
                </button>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-slate-900">Which Post or Reel?</h2>
                  <StepIndicator current={1} total={3} />
                </div>
              </div>
              <button onClick={handleClose} className="flex items-center justify-center size-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0">
                <X className="size-4" />
              </button>
            </div>

            {/* Mode selector */}
            <div className="flex gap-2 px-5 pt-4 pb-3 shrink-0">
              {(
                [
                  { id: 'specific', label: 'Specific Post or Reel' },
                  { id: 'all', label: 'All Posts or Reels' },
                  { id: 'next', label: 'Next Post or Reel' },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPostMode(m.id)}
                  className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                    postMode === m.id
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Mode content */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              {postMode === 'specific' && (
                <>
                  {/* Search */}
                  <div className="px-5 pb-3 shrink-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search by caption..."
                        value={mediaSearch}
                        onChange={(e) => setMediaSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    {selectedMediaIds.size > 0 && (
                      <p className="text-xs text-teal-700 font-medium mt-2">
                        {selectedMediaIds.size} post{selectedMediaIds.size !== 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>

                  {/* Grid */}
                  <div className="flex-1 overflow-y-auto px-5 pb-3">
                    <div className="grid grid-cols-3 gap-3">
                      {filteredMedia.map((media) => {
                        const TypeIcon = MEDIA_TYPE_ICON[media.media_type]
                        const isSelected = selectedMediaIds.has(media.id)
                        return (
                          <button
                            key={media.id}
                            onClick={() => toggleMedia(media.id)}
                            className={`relative group rounded-xl overflow-hidden border-2 text-left transition-all ${
                              isSelected
                                ? 'border-teal-500 shadow-md shadow-teal-100'
                                : 'border-slate-200 hover:border-teal-300 hover:shadow-sm'
                            }`}
                          >
                            {/* Thumbnail */}
                            <div className="aspect-square bg-slate-100 overflow-hidden">
                              <img
                                src={media.thumbnail_url}
                                alt={media.caption}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Type badge */}
                            <div className="absolute top-1.5 left-1.5">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-white ${MEDIA_TYPE_COLOR[media.media_type]}`}>
                                <TypeIcon className="size-2.5" />
                                {MEDIA_TYPE_LABEL[media.media_type]}
                              </span>
                            </div>

                            {/* Selected checkmark */}
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 size-5 rounded-full bg-teal-500 flex items-center justify-center shadow">
                                <Check className="size-3 text-white" />
                              </div>
                            )}

                            {/* Caption + time */}
                            <div className="p-2 bg-white border-t border-slate-100">
                              <p className="text-[11px] text-slate-700 font-medium leading-tight line-clamp-2 min-h-[2.5em]">
                                {media.caption}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1">
                                {relativeTime(media.timestamp)}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}

              {postMode === 'all' && (
                <div className="flex-1 flex items-center justify-center px-8">
                  <div className="text-center max-w-xs">
                    <div className="mx-auto size-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-4">
                      <Globe className="size-8 text-teal-500" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-2">All Posts and Reels</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      This automation will trigger on comments from any of your existing and future posts or reels.
                    </p>
                  </div>
                </div>
              )}

              {postMode === 'next' && (
                <div className="flex-1 flex items-center justify-center px-8">
                  <div className="text-center max-w-xs">
                    <div className="mx-auto size-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
                      <Clock className="size-8 text-amber-500" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-2">Next Post or Reel</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      This automation will activate on the next post or reel you publish after saving. It applies to that single post only.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <p className="text-xs text-slate-500">
                {postMode === 'specific' && selectedMediaIds.size === 0 && 'Select at least one post to continue'}
                {postMode === 'specific' && selectedMediaIds.size > 0 && `${selectedMediaIds.size} post${selectedMediaIds.size !== 1 ? 's' : ''} selected`}
                {postMode === 'all' && 'Will apply to all posts and reels'}
                {postMode === 'next' && 'Will apply to your next published post'}
              </p>
              <button
                onClick={handleStep2Next}
                disabled={!canProceedStep2}
                className="px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 2 — Comment trigger settings
        ════════════════════════════════════════════════════ */}
        {step === 2 && (
          <>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <button onClick={() => setStep(1)} className="flex items-center justify-center size-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0">
                  <ChevronLeft className="size-4" />
                </button>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-slate-900">When should it trigger?</h2>
                  <StepIndicator current={2} total={3} />
                </div>
              </div>
              <button onClick={handleClose} className="flex items-center justify-center size-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0">
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">

              {/* All comments option */}
              <button
                onClick={() => setCommentMode('all')}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  commentMode === 'all'
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-slate-200 hover:border-teal-200 hover:bg-slate-50'
                }`}
              >
                <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  commentMode === 'all' ? 'border-teal-500 bg-teal-500' : 'border-slate-300'
                }`}>
                  {commentMode === 'all' && <Check className="size-3 text-white" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">All Comments</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Trigger the automation on every new comment, regardless of what it says.
                  </p>
                </div>
              </button>

              {/* By keyword option — div, NOT button, to avoid nested interactive elements */}
              <div
                role="radio"
                aria-checked={commentMode === 'keyword'}
                onClick={() => setCommentMode('keyword')}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  commentMode === 'keyword'
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-slate-200 hover:border-teal-200 hover:bg-slate-50'
                }`}
              >
                <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  commentMode === 'keyword' ? 'border-teal-500 bg-teal-500' : 'border-slate-300'
                }`}>
                  {commentMode === 'keyword' && <Check className="size-3 text-white" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">By Keyword</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Only trigger when a comment contains specific keywords.
                  </p>
                </div>
              </div>

              {/* Keyword configuration — rendered outside the radio card to avoid nesting */}
              {commentMode === 'keyword' && (
                <div className="ml-9 space-y-3 pt-1">
                  {/* Keyword chips + input */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Keywords
                    </label>
                    <div className="min-h-[44px] flex flex-wrap gap-1.5 items-center p-2 border border-slate-200 rounded-lg bg-white focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition-all">
                      {keywords.map((kw) => (
                        <span
                          key={kw}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 text-xs font-medium"
                        >
                          <Hash className="size-3" />
                          {kw}
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeKeyword(kw) }}
                            className="ml-0.5 text-teal-500 hover:text-teal-800 transition-colors"
                          >
                            <X className="size-2.5" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder={keywords.length === 0 ? 'Type keyword and press Enter...' : 'Add more...'}
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={handleKeywordKeyDown}
                        className="flex-1 min-w-[120px] text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Press Enter to add, or keywords in the input will be saved automatically.
                    </p>
                  </div>

                  {/* Match mode */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Match mode
                    </label>
                    <div className="relative">
                      <select
                        value={keywordMatch}
                        onChange={(e) => setKeywordMatch(e.target.value as KeywordMatchMode)}
                        className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
                      >
                        <option value="contains">Comment contains keyword</option>
                        <option value="exact">Exact match</option>
                        <option value="starts_with">Comment starts with keyword</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {keywords.length === 0 && keywordInput.trim() === '' && (
                    <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      Add at least one keyword to continue.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <p className="text-xs text-slate-500">
                {commentMode === 'all' && 'Triggers on every comment'}
                {commentMode === 'keyword' && keywords.length === 0 && keywordInput.trim() === '' && 'Add keywords to continue'}
                {commentMode === 'keyword' && (keywords.length > 0 || keywordInput.trim() !== '') && (
                  `Triggers on: ${[...keywords, keywordInput.trim()].filter(Boolean).join(', ')}`
                )}
              </p>
              <button
                onClick={handleSaveTrigger}
                disabled={!canSaveStep3}
                className="px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Save Trigger
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
