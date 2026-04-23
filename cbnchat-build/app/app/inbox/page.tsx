'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Inbox,
  Search,
  Send,
  MoreHorizontal,
  Bot,
  Instagram,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string
  direction: 'in' | 'out'
  text: string
  time: string
  auto?: boolean
}

interface Conversation {
  id: string
  username: string
  avatarSeed: string
  avatarColor: string
  lastMessage: string
  timestamp: string
  unread: boolean
  messages: Message[]
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    username: '@yusuf.kristian',
    avatarSeed: 'yusuf',
    avatarColor: '0ea5e9',
    lastMessage: 'Terima kasih kak, mau ikut doanya 🙏',
    timestamp: '2h ago',
    unread: true,
    messages: [
      { id: 'm1', direction: 'in', text: 'Kak, saya mau ikut acara doa bersama gimana caranya?', time: '10:30 AM' },
      { id: 'm2', direction: 'out', text: 'Halo Yusuf! 😊 Terima kasih sudah menghubungi kami. Untuk acara doa bersama, kamu bisa daftar melalui link berikut: cbnchat.id/doa', time: '10:30 AM', auto: true },
      { id: 'm3', direction: 'in', text: 'Oke kak terima kasih! 🙏', time: '10:45 AM' },
      { id: 'm4', direction: 'out', text: 'Sama-sama! Kalau ada pertanyaan lain, jangan ragu untuk bertanya ya', time: '11:00 AM' },
      { id: 'm5', direction: 'in', text: 'Kak boleh minta jadwal ibadah minggu ini?', time: '2:00 PM' },
      { id: 'm6', direction: 'out', text: 'Jadwal ibadah minggu ini: Minggu pukul 09:00 WIB di Gedung Serbaguna Lantai 2. Tema: Kasih yang Memulihkan 🙌', time: '2:00 PM', auto: true },
      { id: 'm7', direction: 'in', text: 'Terima kasih kak, mau ikut doanya 🙏', time: '3:00 PM' },
    ],
  },
  {
    id: 'c2',
    username: '@maria_doa',
    avatarSeed: 'maria',
    avatarColor: 'ec4899',
    lastMessage: 'Amin, Tuhan berkati 💕',
    timestamp: '5h ago',
    unread: false,
    messages: [
      { id: 'm1', direction: 'in', text: 'Kak doakan saya ya, lagi banyak ujian nih', time: '8:00 AM' },
      { id: 'm2', direction: 'out', text: 'Halo! Kami akan mendoakan kamu. Kirimi kami nama kamu supaya bisa didoakan secara spesifik 🙏', time: '8:00 AM', auto: true },
      { id: 'm3', direction: 'in', text: 'Nama saya Maria, doakan nilai ujiannya ya kak', time: '8:05 AM' },
      { id: 'm4', direction: 'out', text: 'Kami doakan Maria selalu diberi hikmat dan kekuatan ya! Tuhan pasti buka jalan terbaik 🙌', time: '8:10 AM' },
      { id: 'm5', direction: 'in', text: 'Amin, Tuhan berkati 💕', time: '8:12 AM' },
    ],
  },
  {
    id: 'c3',
    username: '@hamba_tuhan23',
    avatarSeed: 'hamba',
    avatarColor: '8b5cf6',
    lastMessage: 'Kak, gimana cara join komunitas?',
    timestamp: '1d ago',
    unread: false,
    messages: [
      { id: 'm1', direction: 'in', text: 'Permisi kak, saya lihat postingan tentang komunitas pemuda', time: 'Yesterday 3:00 PM' },
      { id: 'm2', direction: 'out', text: 'Halo! Komunitas pemuda kami terbuka untuk semua. Info lengkap ada di bio kami 😊', time: 'Yesterday 3:00 PM', auto: true },
      { id: 'm3', direction: 'in', text: 'Kak, gimana cara join komunitas?', time: 'Yesterday 3:15 PM' },
      { id: 'm4', direction: 'out', text: 'Kamu bisa daftar lewat link di bio atau DM kami nomor WA untuk langkah selanjutnya!', time: 'Yesterday 3:20 PM' },
    ],
  },
  {
    id: 'c4',
    username: '@kasihkristus_id',
    avatarSeed: 'kasih',
    avatarColor: 'f43f5e',
    lastMessage: 'Saya sudah daftar, terima kasih!',
    timestamp: '1d ago',
    unread: false,
    messages: [
      { id: 'm1', direction: 'in', text: 'Kak mau tanya soal pendaftaran retreat', time: 'Yesterday 10:00 AM' },
      { id: 'm2', direction: 'out', text: 'Halo! Retreat bulan depan masih buka pendaftaran. Biaya Rp 150.000 termasuk makan dan akomodasi 🏕️', time: 'Yesterday 10:00 AM', auto: true },
      { id: 'm3', direction: 'in', text: 'Wah seru! Bisa transfer ke mana kak?', time: 'Yesterday 10:30 AM' },
      { id: 'm4', direction: 'out', text: 'Transfer ke BCA 1234567890 a/n Yayasan CBN. Kirim bukti transfer ke email admin@cbn.id ya!', time: 'Yesterday 10:35 AM' },
      { id: 'm5', direction: 'in', text: 'Saya sudah daftar, terima kasih!', time: 'Yesterday 11:00 AM' },
      { id: 'm6', direction: 'out', text: 'Terima kasih! Konfirmasi pendaftaran akan dikirim via email. Sampai jumpa di retreat! 🙌', time: 'Yesterday 11:05 AM' },
    ],
  },
  {
    id: 'c5',
    username: '@bertumbuh.dlmkristus',
    avatarSeed: 'bertumbuh',
    avatarColor: '10b981',
    lastMessage: 'Boleh minta link pendaftaran?',
    timestamp: '2d ago',
    unread: false,
    messages: [
      { id: 'm1', direction: 'in', text: 'Selamat sore kak!', time: '2 days ago 4:00 PM' },
      { id: 'm2', direction: 'out', text: 'Selamat sore! Ada yang bisa kami bantu? 😊', time: '2 days ago 4:00 PM', auto: true },
      { id: 'm3', direction: 'in', text: 'Boleh minta link pendaftaran?', time: '2 days ago 4:05 PM' },
    ],
  },
  {
    id: 'c6',
    username: '@anakdoa_jkt',
    avatarSeed: 'anakdoa',
    avatarColor: 'f59e0b',
    lastMessage: 'Doakan keluarga saya kak 🙏',
    timestamp: '3d ago',
    unread: false,
    messages: [
      { id: 'm1', direction: 'in', text: 'Kak boleh minta doa untuk keluarga saya?', time: '3 days ago 9:00 AM' },
      { id: 'm2', direction: 'out', text: 'Tentu! Ceritakan kebutuhan doanya, kami dengan senang hati mendoakan 🙏', time: '3 days ago 9:00 AM', auto: true },
      { id: 'm3', direction: 'in', text: 'Keluarga saya lagi ada masalah kesehatan dan keuangan kak', time: '3 days ago 9:10 AM' },
      { id: 'm4', direction: 'out', text: 'Kami mendoakan pemulihan kesehatan dan berkat untuk keluargamu. Tuhan tidak pernah meninggalkan kita 💛', time: '3 days ago 9:15 AM' },
      { id: 'm5', direction: 'in', text: 'Doakan keluarga saya kak 🙏', time: '3 days ago 9:20 AM' },
    ],
  },
  {
    id: 'c7',
    username: '@pemudakatolik',
    avatarSeed: 'pemuda',
    avatarColor: '6366f1',
    lastMessage: 'Kapan live worship berikutnya?',
    timestamp: '3d ago',
    unread: false,
    messages: [
      { id: 'm1', direction: 'in', text: 'Kak live worship kemarin keren banget!', time: '3 days ago 7:00 PM' },
      { id: 'm2', direction: 'out', text: 'Terima kasih! Senang kamu menikmatinya 🎵 Puji Tuhan!', time: '3 days ago 7:00 PM' },
      { id: 'm3', direction: 'in', text: 'Kapan live worship berikutnya?', time: '3 days ago 7:10 PM' },
      { id: 'm4', direction: 'out', text: 'Live worship selanjutnya akan diadakan Sabtu depan pukul 19:00 WIB. Pantau terus IG kami ya! 🙌', time: '3 days ago 7:15 PM', auto: true },
    ],
  },
  {
    id: 'c8',
    username: '@injiluntuksemua',
    avatarSeed: 'injil',
    avatarColor: '0891b2',
    lastMessage: 'Mantap kak, kontennya bagus!',
    timestamp: '5d ago',
    unread: false,
    messages: [
      { id: 'm1', direction: 'in', text: 'Baru follow, kontennya inspiratif sekali kak!', time: '5 days ago 2:00 PM' },
      { id: 'm2', direction: 'out', text: 'Halo! Terima kasih banyak sudah follow dan menikmati konten kami 🙏 Semoga memberkati!', time: '5 days ago 2:00 PM', auto: true },
      { id: 'm3', direction: 'in', text: 'Mantap kak, kontennya bagus!', time: '5 days ago 2:30 PM' },
    ],
  },
]

// ─── Avatar helper ────────────────────────────────────────────────────────────

function Avatar({ seed, color, size = 36 }: { seed: string; color: string; size?: number }) {
  return (
    <img
      src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}&backgroundColor=${color}&radius=50`}
      alt={seed}
      width={size}
      height={size}
      className="rounded-full shrink-0 object-cover"
      style={{ width: size, height: size }}
    />
  )
}

// ─── ConversationRow ──────────────────────────────────────────────────────────

function ConversationRow({
  conv,
  active,
  onClick,
}: {
  conv: Conversation
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-start gap-3 px-4 py-3 border-b border-slate-50 text-left transition-colors',
        active
          ? 'bg-teal-50 border-l-2 border-l-teal-600'
          : 'hover:bg-slate-50 border-l-2 border-l-transparent',
      )}
    >
      <div className="relative shrink-0 mt-0.5">
        <Avatar seed={conv.avatarSeed} color={conv.avatarColor} size={36} />
        {conv.unread && (
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={cn('text-sm truncate', conv.unread ? 'font-semibold text-slate-900' : 'font-medium text-slate-700')}>
            {conv.username}
          </span>
          <span className="text-[11px] text-slate-400 shrink-0">{conv.timestamp}</span>
        </div>
        <p className={cn('text-xs truncate', conv.unread ? 'text-slate-700 font-medium' : 'text-slate-400')}>
          {conv.lastMessage}
        </p>
      </div>
    </button>
  )
}

// ─── MessageBubble ────────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: Message }) {
  const isOut = msg.direction === 'out'
  return (
    <div className={cn('flex flex-col gap-1 max-w-[70%]', isOut ? 'items-end self-end' : 'items-start self-start')}>
      {isOut && msg.auto && (
        <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400 px-1">
          <Bot className="h-3 w-3" />
          Auto-reply
        </span>
      )}
      <div
        className={cn(
          'px-3.5 py-2.5 text-sm leading-relaxed',
          isOut
            ? 'bg-teal-600 text-white rounded-2xl rounded-br-md'
            : 'bg-slate-200 text-slate-800 rounded-2xl rounded-bl-md',
        )}
      >
        {msg.text}
      </div>
      <span className="text-[11px] text-slate-400 px-1">{msg.time}</span>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function InboxPage() {
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [convMap, setConvMap] = useState<Record<string, Conversation>>(
    () => Object.fromEntries(CONVERSATIONS.map((c) => [c.id, c]))
  )
  const [draft, setDraft] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const filtered = CONVERSATIONS.filter(
    (c) =>
      c.username.toLowerCase().includes(query.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(query.toLowerCase()),
  )

  const activeConv = activeId ? convMap[activeId] : null

  // Scroll to bottom when messages change or conversation switches
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeId, activeConv?.messages.length])

  // Mark as read when opened
  function handleSelect(id: string) {
    setActiveId(id)
    setConvMap((prev) => ({
      ...prev,
      [id]: { ...prev[id], unread: false },
    }))
  }

  function handleSend() {
    if (!draft.trim() || !activeId) return
    const msg: Message = {
      id: 'm-' + Date.now(),
      direction: 'out',
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setConvMap((prev) => ({
      ...prev,
      [activeId]: {
        ...prev[activeId],
        lastMessage: draft.trim(),
        messages: [...prev[activeId].messages, msg],
      },
    }))
    setDraft('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full overflow-hidden">

      {/* ── Left panel ─────────────────────────────────────────────── */}
      <aside className="w-80 shrink-0 flex flex-col border-r border-slate-200 bg-white overflow-hidden">

        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-100">
          <h1 className="text-sm font-semibold text-slate-900 mb-3">Inbox</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 px-6 text-center">
              <Inbox className="h-8 w-8 text-slate-300" />
              <p className="text-sm text-slate-400">No conversations found</p>
            </div>
          ) : (
            filtered.map((conv) => (
              <ConversationRow
                key={conv.id}
                conv={convMap[conv.id]}
                active={conv.id === activeId}
                onClick={() => handleSelect(conv.id)}
              />
            ))
          )}
        </div>
      </aside>

      {/* ── Right panel ─────────────────────────────────────────────── */}
      <main className="flex flex-1 flex-col overflow-hidden bg-slate-50">

        {/* Empty state */}
        {!activeConv && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center px-8">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-slate-100">
              <Inbox className="h-7 w-7 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Select a conversation</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Choose a conversation from the left to view messages
              </p>
            </div>
          </div>
        )}

        {/* Active conversation */}
        {activeConv && (
          <>
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 h-14 shrink-0 bg-white border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Avatar seed={activeConv.avatarSeed} color={activeConv.avatarColor} size={34} />
                <div>
                  <p className="text-sm font-semibold text-slate-900 leading-tight">{activeConv.username}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <Instagram className="h-3 w-3 text-pink-500" />
                    Instagram DM
                  </span>
                </div>
              </div>
              <button className="flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
              {activeConv.messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="shrink-0 bg-white border-t border-slate-200 px-4 pt-3 pb-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
                <button
                  onClick={handleSend}
                  disabled={!draft.trim()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1.5 text-center text-[11px] text-slate-400">
                In production, messages are sent via Instagram DM API
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
