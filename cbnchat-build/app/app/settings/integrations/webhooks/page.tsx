'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Plus,
  Webhook,
  MoreHorizontal,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Pencil,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  X,
  AlertTriangle,
  Loader2,
  Check,
  Zap,
  ArrowRight,
  RotateCcw,
  FileJson,
  Clock,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'

// ─── Types ────────────────────────────────────────────────────────────────────

type WebhookEvent =
  | 'contact.created'
  | 'contact.tagged'
  | 'automation.completed'
  | 'message.received'

interface WebhookEndpoint {
  id: string
  name: string
  url: string
  events: WebhookEvent[]
  active: boolean
  secret: string
  lastTriggered: string | null
  failureCount: number
}

type DeliveryEvent = WebhookEvent | 'test.delivery'

interface DeliveryEntry {
  id: string
  endpointName: string
  event: DeliveryEvent
  statusCode: number
  timestamp: string
  payload: string
  responseBody: string
  attemptCount: number
  retrying?: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_EVENTS: { value: WebhookEvent; label: string; description: string }[] = [
  { value: 'contact.created', label: 'contact.created', description: 'When a new contact is captured' },
  { value: 'contact.tagged', label: 'contact.tagged', description: 'When a contact tag is added' },
  { value: 'automation.completed', label: 'automation.completed', description: 'When an automation flow finishes' },
  { value: 'message.received', label: 'message.received', description: 'When a new DM or comment is received' },
]

const EVENT_COLOR: Record<WebhookEvent, string> = {
  'contact.created': 'bg-sky-100 text-sky-700 border-sky-200',
  'contact.tagged': 'bg-violet-100 text-violet-700 border-violet-200',
  'automation.completed': 'bg-teal-100 text-teal-700 border-teal-200',
  'message.received': 'bg-purple-100 text-purple-700 border-purple-200',
}

const DELIVERY_EVENT_COLOR: Record<DeliveryEvent, string> = {
  'contact.created': 'bg-sky-100 text-sky-700 border-sky-200',
  'contact.tagged': 'bg-violet-100 text-violet-700 border-violet-200',
  'automation.completed': 'bg-teal-100 text-teal-700 border-teal-200',
  'message.received': 'bg-purple-100 text-purple-700 border-purple-200',
  'test.delivery': 'bg-amber-100 text-amber-700 border-amber-200',
}

function makePayload(event: DeliveryEvent, ts: string) {
  return JSON.stringify({
    event,
    timestamp: ts,
    workspace: { id: 'ws-superyouth', channel: 'instagram', external_username: 'superyouthgen' },
    data: {
      contact_id: 'c-' + Math.random().toString(36).slice(2, 8),
      channel_username: 'johndoe',
      full_name: 'John Doe',
      source: 'comment',
      tags: ['new_lead'],
    },
  }, null, 2)
}

const SEED_DELIVERIES: DeliveryEntry[] = [
  { id: 'del-1', endpointName: 'CBN CRM', event: 'contact.created', statusCode: 200, timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), payload: makePayload('contact.created', new Date(Date.now() - 2 * 3600000).toISOString()), responseBody: '{"ok":true}', attemptCount: 1 },
  { id: 'del-2', endpointName: 'CBN CRM', event: 'automation.completed', statusCode: 500, timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), payload: makePayload('automation.completed', new Date(Date.now() - 5 * 3600000).toISOString()), responseBody: '{"error":"Internal Server Error"}', attemptCount: 3 },
  { id: 'del-3', endpointName: 'CBN CRM', event: 'contact.created', statusCode: 200, timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), payload: makePayload('contact.created', new Date(Date.now() - 24 * 3600000).toISOString()), responseBody: '{"ok":true}', attemptCount: 1 },
  { id: 'del-4', endpointName: 'CBN CRM', event: 'test.delivery', statusCode: 200, timestamp: new Date(Date.now() - 48 * 3600000).toISOString(), payload: makePayload('test.delivery', new Date(Date.now() - 48 * 3600000).toISOString()), responseBody: '{"ok":true}', attemptCount: 1 },
  { id: 'del-5', endpointName: 'CBN CRM', event: 'message.received', statusCode: 500, timestamp: new Date(Date.now() - 72 * 3600000).toISOString(), payload: makePayload('message.received', new Date(Date.now() - 72 * 3600000).toISOString()), responseBody: '{"error":"Timeout"}', attemptCount: 5 },
]

const SEED_ENDPOINTS: WebhookEndpoint[] = [
  {
    id: 'wh-1',
    name: 'CBN CRM',
    url: 'https://example.com/crm-webhook',
    events: ['contact.created', 'automation.completed'],
    active: false,
    secret: 'whsec_demo123',
    lastTriggered: null,
    failureCount: 0,
  },
]

const SAMPLE_PAYLOAD = `{
  "event": "contact.created",
  "timestamp": "2026-04-16T10:23:45Z",
  "workspace": {
    "id": "ws-superyouth",
    "channel": "instagram",
    "external_username": "superyouthgen"
  },
  "data": {
    "contact_id": "c-abc123",
    "channel_username": "johndoe",
    "full_name": "John Doe",
    "source": "comment",
    "tags": ["new_lead"]
  }
}`

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateSecret() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'whsec_'
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function maskSecret(secret: string) {
  if (secret.length <= 10) return secret
  return secret.slice(0, 10) + '•'.repeat(secret.length - 10)
}

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text).then(() => {
    toast.success(`${label} copied to clipboard`)
  })
}

function relativeTime(iso: string | null) {
  if (!iso) return null
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

// ─── PayloadModal ─────────────────────────────────────────────────────────────

function PayloadModal({ entry, onClose }: { entry: DeliveryEntry; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-[560px] rounded-2xl bg-white shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <FileJson className="h-4 w-4 text-slate-500" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Delivery Payload</p>
              <p className="text-xs text-slate-400 mt-0.5">{entry.endpointName} · {entry.event}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(entry.payload, 'Payload')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Payload */}
        <div className="flex-1 overflow-y-auto bg-slate-900 rounded-b-2xl">
          <div className="flex items-center gap-2 border-b border-slate-700 px-4 py-2.5">
            <span className="text-[11px] font-semibold text-slate-400 font-mono">Request Payload</span>
            <span className={`ml-auto inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
              entry.statusCode === 200
                ? 'bg-emerald-900/50 border-emerald-700 text-emerald-400'
                : 'bg-red-900/50 border-red-700 text-red-400'
            }`}>
              {entry.statusCode === 200 ? '200 OK' : `${entry.statusCode} Error`}
            </span>
          </div>
          <pre className="overflow-x-auto px-4 py-4 text-xs leading-relaxed text-green-400 font-mono">
            {entry.payload}
          </pre>
          <div className="border-t border-slate-700 px-4 py-2.5">
            <span className="text-[11px] font-semibold text-slate-400 font-mono">Response Body</span>
          </div>
          <pre className="overflow-x-auto px-4 pb-4 text-xs leading-relaxed text-slate-300 font-mono">
            {(() => {
              try { return JSON.stringify(JSON.parse(entry.responseBody), null, 2) }
              catch { return entry.responseBody }
            })()}
          </pre>
        </div>
      </div>
    </div>
  )
}

// ─── DeliveryLog ──────────────────────────────────────────────────────────────

function DeliveryLog({
  deliveries,
  onRetry,
  onViewPayload,
}: {
  deliveries: DeliveryEntry[]
  onRetry: (id: string) => void
  onViewPayload: (entry: DeliveryEntry) => void
}) {
  if (deliveries.length === 0) return null

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <Clock className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-800">Recent Deliveries</span>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
          Showing last {deliveries.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {['Time', 'Endpoint', 'Event', 'Status', 'Attempt', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {deliveries.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                {/* Time */}
                <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                  {relativeTime(d.timestamp) ?? 'just now'}
                </td>
                {/* Endpoint */}
                <td className="px-4 py-3">
                  <span className="text-xs font-medium text-slate-700">{d.endpointName}</span>
                </td>
                {/* Event */}
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[11px] font-medium ${DELIVERY_EVENT_COLOR[d.event]}`}>
                    {d.event}
                  </span>
                </td>
                {/* Status */}
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                    d.statusCode === 200
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    {d.statusCode === 200 ? (
                      <><Check className="h-3 w-3" />200 OK</>
                    ) : (
                      <><AlertTriangle className="h-3 w-3" />{d.statusCode} Error</>
                    )}
                  </span>
                </td>
                {/* Attempt */}
                <td className="px-4 py-3 text-xs text-slate-500 tabular-nums whitespace-nowrap">
                  {d.attemptCount}/5
                </td>
                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {d.statusCode !== 200 && (
                      <button
                        onClick={() => onRetry(d.id)}
                        disabled={d.retrying}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {d.retrying ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <RotateCcw className="h-3 w-3" />
                        )}
                        Retry
                      </button>
                    )}
                    <button
                      onClick={() => onViewPayload(d)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <FileJson className="h-3 w-3" />
                      View Payload
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── DeleteDialog ─────────────────────────────────────────────────────────────

function DeleteDialog({
  endpoint,
  onConfirm,
  onCancel,
}: {
  endpoint: WebhookEndpoint
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start gap-3 p-6 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-900">Delete webhook?</h3>
            <p className="mt-1 text-sm text-slate-500 leading-relaxed">
              <span className="font-medium text-slate-700">{endpoint.name}</span> will stop receiving events immediately. This cannot be undone.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="ml-auto flex shrink-0 items-center justify-center rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
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
            Delete webhook
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── AddWebhookModal ──────────────────────────────────────────────────────────

function AddWebhookModal({
  onClose,
  onAdd,
}: {
  onClose: () => void
  onAdd: (endpoint: WebhookEndpoint) => void
}) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [selectedEvents, setSelectedEvents] = useState<WebhookEvent[]>([])
  const [secret, setSecret] = useState(() => generateSecret())

  function toggleEvent(event: WebhookEvent) {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    )
  }

  function handleSave() {
    if (!name.trim() || !url.trim() || selectedEvents.length === 0) return
    onAdd({
      id: 'wh-' + Date.now(),
      name: name.trim(),
      url: url.trim(),
      events: selectedEvents,
      active: true,
      secret,
      lastTriggered: null,
      failureCount: 0,
    })
    toast.success('Webhook added!')
    onClose()
  }

  const canSave = name.trim() && url.trim() && selectedEvents.length > 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-[500px] rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add Webhook</h2>
            <p className="mt-0.5 text-xs text-slate-500">Configure an outbound endpoint for your CRM</p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Webhook Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. CBN CRM, HubSpot, Google Sheets"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>

          {/* URL */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Webhook URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-crm.com/api/webhook"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 transition font-mono"
            />
          </div>

          {/* Events */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Events to subscribe
            </label>
            <div className="space-y-2">
              {ALL_EVENTS.map(({ value, label, description }) => {
                const checked = selectedEvents.includes(value)
                return (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                      checked
                        ? 'border-teal-300 bg-teal-50'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleEvent(value)}
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-teal-600"
                    />
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-semibold text-slate-800">{label}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{description}</p>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Secret */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Webhook Secret
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={secret}
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600"
              />
              <button
                onClick={() => setSecret(generateSecret())}
                title="Regenerate secret"
                className="flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => copyToClipboard(secret, 'Secret')}
                title="Copy secret"
                className="flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              Store this securely — it is used to verify webhook signatures and will not be shown again.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 shrink-0">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            Save Webhook
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── WebhookCard ──────────────────────────────────────────────────────────────

function WebhookCard({
  endpoint,
  onToggle,
  onDelete,
  onTestDelivery,
}: {
  endpoint: WebhookEndpoint
  onToggle: (id: string) => void
  onDelete: (endpoint: WebhookEndpoint) => void
  onTestDelivery: (entry: DeliveryEntry) => void
}) {
  const [secretVisible, setSecretVisible] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null)

  const lastSeen = relativeTime(endpoint.lastTriggered)

  function handleTest() {
    setTesting(true)
    setTestSuccess(null)
    setTimeout(() => {
      const failed = Math.random() < 0.2
      const statusCode = failed ? 500 : 200
      const ts = new Date().toISOString()
      const entry: DeliveryEntry = {
        id: 'del-' + Date.now(),
        endpointName: endpoint.name,
        event: 'test.delivery',
        statusCode,
        timestamp: ts,
        payload: makePayload('test.delivery', ts),
        responseBody: failed ? '{"error":"Internal Server Error"}' : '{"ok":true}',
        attemptCount: 1,
      }
      onTestDelivery(entry)
      setTesting(false)
      setTestSuccess(!failed)
      if (failed) {
        toast.error(`Test delivery failed! Status: ${statusCode}`)
      } else {
        toast.success(`Test delivery sent! Status: 200 OK`)
      }
    }, 1500)
  }

  function handleEdit() {
    toast.info('Webhook editing coming in Phase 5')
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      {/* Top row: name + toggle + menu */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 border border-teal-100">
          <Webhook className="h-4 w-4 text-teal-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{endpoint.name}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-medium ${endpoint.active ? 'text-emerald-600' : 'text-slate-400'}`}>
            {endpoint.active ? 'Active' : 'Inactive'}
          </span>
          <Switch
            checked={endpoint.active}
            onCheckedChange={() => onToggle(endpoint.id)}
            className="data-[state=checked]:bg-teal-600"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleEdit} className="flex items-center gap-2 cursor-pointer">
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTest} className="flex items-center gap-2 cursor-pointer">
                <Zap className="h-3.5 w-3.5" />
                Test delivery
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(endpoint)}
                className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* URL row */}
      <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
        <span className="flex-1 min-w-0 truncate font-mono text-xs text-slate-600">
          {endpoint.url}
        </span>
        <button
          onClick={() => copyToClipboard(endpoint.url, 'URL')}
          className="shrink-0 text-slate-400 hover:text-slate-700 transition-colors"
          title="Copy URL"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Events */}
      <div className="flex flex-wrap gap-1.5">
        {endpoint.events.map((ev) => (
          <span
            key={ev}
            className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[11px] font-medium ${EVENT_COLOR[ev]}`}
          >
            {ev}
          </span>
        ))}
      </div>

      {/* Secret row */}
      <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
        <span className="flex-1 min-w-0 truncate font-mono text-xs text-slate-500">
          {secretVisible ? endpoint.secret : maskSecret(endpoint.secret)}
        </span>
        <button
          onClick={() => setSecretVisible((v) => !v)}
          className="shrink-0 text-slate-400 hover:text-slate-700 transition-colors"
          title={secretVisible ? 'Hide secret' : 'Reveal secret'}
        >
          {secretVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={() => copyToClipboard(endpoint.secret, 'Secret')}
          className="shrink-0 text-slate-400 hover:text-slate-700 transition-colors"
          title="Copy secret"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Status row + test button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>
            {lastSeen ? (
              <>Last triggered: <span className="font-medium text-slate-700">{lastSeen}</span></>
            ) : (
              'Never triggered'
            )}
          </span>
          {endpoint.failureCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-red-100 border border-red-200 px-2 py-0.5 text-[11px] font-semibold text-red-700">
              {endpoint.failureCount} {endpoint.failureCount === 1 ? 'failure' : 'failures'}
            </span>
          )}
        </div>

        <button
          onClick={handleTest}
          disabled={testing}
          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
        >
          {testing ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Sending...
            </>
          ) : testSuccess ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-emerald-700">Sent!</span>
            </>
          ) : (
            <>
              <Zap className="h-3.5 w-3.5" />
              Test Delivery
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WebhooksPage() {
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>(SEED_ENDPOINTS)
  const [deliveries, setDeliveries] = useState<DeliveryEntry[]>(SEED_DELIVERIES)
  const [addOpen, setAddOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<WebhookEndpoint | null>(null)
  const [payloadOpen, setPayloadOpen] = useState(false)
  const [viewingPayload, setViewingPayload] = useState<DeliveryEntry | null>(null)

  function handleToggle(id: string) {
    setEndpoints((prev) =>
      prev.map((ep) => (ep.id === id ? { ...ep, active: !ep.active } : ep))
    )
  }

  function handleDelete(endpoint: WebhookEndpoint) {
    setDeleteTarget(endpoint)
  }

  function confirmDelete() {
    if (!deleteTarget) return
    setEndpoints((prev) => prev.filter((ep) => ep.id !== deleteTarget.id))
    toast.success(`"${deleteTarget.name}" webhook deleted`)
    setDeleteTarget(null)
  }

  function handleAdd(endpoint: WebhookEndpoint) {
    setEndpoints((prev) => [...prev, endpoint])
  }

  function handleTestDelivery(entry: DeliveryEntry) {
    setDeliveries((prev) => [entry, ...prev].slice(0, 20))
  }

  function handleRetry(id: string) {
    // Mark as retrying
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, retrying: true } : d))
    )
    setTimeout(() => {
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === id
            ? { ...d, retrying: false, statusCode: 200, responseBody: '{"ok":true}', attemptCount: d.attemptCount + 1 }
            : d
        )
      )
      toast.success('Retry successful!')
    }, 1000)
  }

  return (
    <>
      {/* Modals */}
      {addOpen && (
        <AddWebhookModal onClose={() => setAddOpen(false)} onAdd={handleAdd} />
      )}
      {deleteTarget && (
        <DeleteDialog
          endpoint={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {viewingPayload && (
        <PayloadModal
          entry={viewingPayload}
          onClose={() => setViewingPayload(null)}
        />
      )}

      <div className="mx-auto max-w-4xl space-y-6 p-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 border border-teal-100">
              <Webhook className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">CRM Webhooks</h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Push captured leads and events to your existing CRM
              </p>
            </div>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Webhook
          </button>
        </div>

        {/* How it works card */}
        <div className="rounded-xl bg-teal-50 border border-teal-100 p-5">
          <p className="mb-3 text-sm font-semibold text-teal-800">How it works</p>
          <p className="mb-4 text-sm text-teal-700 leading-relaxed">
            When an automation completes or a new contact is captured, CBNchat sends a signed HTTP POST to your webhook URL. Your CRM receives the data and can create leads, update records, or trigger workflows.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              '1. Event occurs',
              '2. CBNchat sends POST',
              '3. CRM receives data',
            ].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-lg bg-white border border-teal-200 px-3 py-1.5 text-xs font-semibold text-teal-700 shadow-sm">
                  {step}
                </span>
                {i < arr.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-teal-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Endpoints list */}
        <div className="space-y-3">
          {endpoints.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-14">
              <Webhook className="mb-3 h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">No webhooks configured yet</p>
              <button
                onClick={() => setAddOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add your first webhook
              </button>
            </div>
          ) : (
            endpoints.map((ep) => (
              <WebhookCard
                key={ep.id}
                endpoint={ep}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onTestDelivery={handleTestDelivery}
              />
            ))
          )}
        </div>

        {/* Delivery Log */}
        <DeliveryLog
          deliveries={deliveries}
          onRetry={handleRetry}
          onViewPayload={(entry) => setViewingPayload(entry)}
        />

        {/* Payload format — collapsible */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <button
            onClick={() => setPayloadOpen((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${payloadOpen ? 'rotate-90' : ''}`} />
              <span className="text-sm font-semibold text-slate-800">Webhook Payload Format</span>
            </div>
            {payloadOpen
              ? <ChevronUp className="h-4 w-4 text-slate-400" />
              : <ChevronDown className="h-4 w-4 text-slate-400" />
            }
          </button>

          {payloadOpen && (
            <div className="border-t border-slate-100 px-5 py-5 space-y-4">
              {/* JSON block */}
              <div className="relative rounded-xl bg-slate-900 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700">
                  <span className="text-xs font-semibold text-slate-400 font-mono">application/json</span>
                  <button
                    onClick={() => copyToClipboard(SAMPLE_PAYLOAD, 'Payload')}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </button>
                </div>
                <pre className="overflow-x-auto px-4 py-4 text-xs leading-relaxed text-slate-200">
                  {SAMPLE_PAYLOAD}
                </pre>
              </div>

              {/* Signature note */}
              <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  All payloads are signed with <span className="font-mono font-semibold">HMAC-SHA256</span> using your webhook secret.
                  Verify the <span className="font-mono font-semibold">X-CBNchat-Signature</span> header in your server to ensure requests are authentic.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
