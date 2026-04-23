'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, MessageCircle, Reply, Sparkles, GitBranch, Clock, Zap, Plus, ExternalLink } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import type { Node } from 'reactflow'

// ─── Types ────────────────────────────────────────────────────────────────────

interface NodeEditorProps {
  node: Node | null
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void
  onClose: () => void
}

// ─── Shared field components ──────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-slate-600 mb-1.5">{children}</label>
}

function Textarea({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  rows?: number
  placeholder?: string
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
    />
  )
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
    />
  )
}

function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full mt-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors"
    >
      Save
    </button>
  )
}

function SectionDivider() {
  return <div className="my-4 border-t border-slate-100" />
}

// ─── Node-type header info ────────────────────────────────────────────────────

const NODE_META: Record<string, { icon: React.ElementType; label: string; iconBg: string; iconColor: string }> = {
  sendDm: { icon: MessageCircle, label: 'Send DM', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  replyComment: { icon: Reply, label: 'Reply to Comment', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  aiStep: { icon: Sparkles, label: 'AI Step', iconBg: 'bg-violet-100', iconColor: 'text-violet-600' },
  condition: { icon: GitBranch, label: 'Condition', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  smartDelay: { icon: Clock, label: 'Smart Delay', iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
  action: { icon: Zap, label: 'Action', iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
  trigger: { icon: Zap, label: 'Trigger', iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
}

// ─── Form variants per node type ──────────────────────────────────────────────

function SendDMForm({
  data,
  onSave,
}: {
  data: Record<string, unknown>
  onSave: (d: Record<string, unknown>) => void
}) {
  const [message, setMessage] = useState((data.message as string) ?? '')
  const [quickReplies, setQuickReplies] = useState<string[]>((data.quickReplies as string[]) ?? [])
  const [newQR, setNewQR] = useState('')

  function addQuickReply() {
    const v = newQR.trim()
    if (!v) return
    setQuickReplies((prev) => [...prev, v])
    setNewQR('')
  }

  function removeQR(i: number) {
    setQuickReplies((prev) => prev.filter((_, idx) => idx !== i))
  }

  return (
    <div>
      <FieldLabel>Message</FieldLabel>
      <Textarea
        value={message}
        onChange={setMessage}
        rows={4}
        placeholder="Type your DM message here…"
      />

      <SectionDivider />

      <FieldLabel>Quick Replies</FieldLabel>
      {quickReplies.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {quickReplies.map((qr, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {qr}
              <button onClick={() => removeQR(i)} className="hover:text-blue-900 ml-0.5">
                <X className="size-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={newQR}
          onChange={(e) => setNewQR(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addQuickReply()}
          placeholder="Quick reply label…"
          className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={addQuickReply}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Plus className="size-3" />
          Add
        </button>
      </div>

      <SaveButton onClick={() => onSave({ message, quickReplies })} />
    </div>
  )
}

function ReplyCommentForm({
  data,
  onSave,
}: {
  data: Record<string, unknown>
  onSave: (d: Record<string, unknown>) => void
}) {
  const [message, setMessage] = useState((data.message as string) ?? '')
  const [alsoDM, setAlsoDM] = useState((data.alsoDM as boolean) ?? false)

  return (
    <div>
      <FieldLabel>Reply Message</FieldLabel>
      <Textarea
        value={message}
        onChange={setMessage}
        rows={3}
        placeholder="Public reply to the comment…"
      />

      <SectionDivider />

      <label className="flex items-center gap-2.5 cursor-pointer group">
        <input
          type="checkbox"
          checked={alsoDM}
          onChange={(e) => setAlsoDM(e.target.checked)}
          className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
        />
        <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
          Also send a DM after replying
        </span>
      </label>

      <SaveButton onClick={() => onSave({ message, alsoDM })} />
    </div>
  )
}

function AIStepForm({
  data,
  onSave,
}: {
  data: Record<string, unknown>
  onSave: (d: Record<string, unknown>) => void
}) {
  const [useWorkspace, setUseWorkspace] = useState((data.useWorkspace as boolean) ?? true)
  const [prompt, setPrompt] = useState((data.prompt as string) ?? '')

  return (
    <div>
      {/* Workspace toggle */}
      <div className="flex items-start justify-between gap-3 p-3.5 bg-violet-50 border border-violet-200 rounded-lg mb-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-violet-800">Use workspace AI config</p>
          <p className="text-xs text-violet-600 mt-0.5 leading-relaxed">
            Uses the system prompt and knowledge base you configured in AI Settings.
          </p>
        </div>
        <Switch
          checked={useWorkspace}
          onCheckedChange={setUseWorkspace}
          className="shrink-0 data-[state=checked]:bg-violet-600"
        />
      </div>

      <Link
        href="/app/ai"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors mb-4"
      >
        <ExternalLink className="size-3" />
        Edit AI Configuration
      </Link>

      <SectionDivider />

      <FieldLabel>
        Custom Prompt Override{' '}
        <span className="text-slate-400 font-normal">(optional)</span>
      </FieldLabel>
      <Textarea
        value={prompt}
        onChange={setPrompt}
        rows={4}
        placeholder="Override the workspace prompt for this step only…"
      />

      <SaveButton
        onClick={() =>
          onSave({
            useWorkspace,
            prompt,
            configured: true,
            model: 'GPT-4o-mini',
          })
        }
      />
    </div>
  )
}

const CONDITION_OPS = [
  { value: 'comment_contains', label: 'Comment contains' },
  { value: 'tag_equals', label: 'Tag equals' },
  { value: 'custom_field_equals', label: 'Custom field equals' },
]

function ConditionForm({
  data,
  onSave,
}: {
  data: Record<string, unknown>
  onSave: (d: Record<string, unknown>) => void
}) {
  const [operator, setOperator] = useState((data.operator as string) ?? 'comment_contains')
  const [value, setValue] = useState((data.value as string) ?? '')

  const conditionLabel = CONDITION_OPS.find((o) => o.value === operator)?.label ?? operator

  return (
    <div>
      <FieldLabel>If</FieldLabel>
      <SelectInput value={operator} onChange={setOperator} options={CONDITION_OPS} />

      <div className="mt-3">
        <FieldLabel>Value</FieldLabel>
        <TextInput
          value={value}
          onChange={setValue}
          placeholder={`e.g. "${operator === 'comment_contains' ? 'info' : 'new_lead'}"`}
        />
      </div>

      <p className="mt-3 text-[11px] text-slate-400">
        The <span className="font-semibold text-emerald-600">Yes</span> branch runs when condition is met.{' '}
        The <span className="font-semibold text-rose-500">No</span> branch runs otherwise.
      </p>

      <SaveButton
        onClick={() =>
          onSave({
            operator,
            value,
            condition: `${conditionLabel}: "${value}"`,
          })
        }
      />
    </div>
  )
}

const DELAY_UNITS = [
  { value: 'seconds', label: 'Seconds' },
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
]

function SmartDelayForm({
  data,
  onSave,
}: {
  data: Record<string, unknown>
  onSave: (d: Record<string, unknown>) => void
}) {
  const [amount, setAmount] = useState((data.amount as string) ?? '5')
  const [unit, setUnit] = useState((data.unit as string) ?? 'minutes')

  return (
    <div>
      <FieldLabel>Wait duration</FieldLabel>
      <div className="flex gap-2">
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <SelectInput value={unit} onChange={setUnit} options={DELAY_UNITS} />
      </div>

      <SaveButton
        onClick={() =>
          onSave({ amount, unit, delay: `Wait ${amount} ${unit}` })
        }
      />
    </div>
  )
}

const ACTION_TYPES = [
  { value: 'set_tag', label: 'Set Tag' },
  { value: 'remove_tag', label: 'Remove Tag' },
  { value: 'update_field', label: 'Update Custom Field' },
  { value: 'call_webhook', label: 'Call Webhook' },
]

function ActionForm({
  data,
  onSave,
}: {
  data: Record<string, unknown>
  onSave: (d: Record<string, unknown>) => void
}) {
  const [type, setType] = useState((data.type as string) ?? 'set_tag')
  const [value, setValue] = useState((data.value as string) ?? '')

  const actionLabel = ACTION_TYPES.find((a) => a.value === type)?.label ?? type

  const valuePlaceholder: Record<string, string> = {
    set_tag: 'e.g. new_lead',
    remove_tag: 'e.g. cold_lead',
    update_field: 'field_name = value',
    call_webhook: 'https://hooks.example.com/...',
  }

  return (
    <div>
      <FieldLabel>Action type</FieldLabel>
      <SelectInput value={type} onChange={setType} options={ACTION_TYPES} />

      <div className="mt-3">
        <FieldLabel>{type === 'call_webhook' ? 'Webhook URL' : 'Value'}</FieldLabel>
        <TextInput
          value={value}
          onChange={setValue}
          placeholder={valuePlaceholder[type]}
        />
      </div>

      <SaveButton
        onClick={() =>
          onSave({
            type,
            value,
            actionType: `${actionLabel}: ${value}`,
          })
        }
      />
    </div>
  )
}

// ─── Main NodeEditor component ────────────────────────────────────────────────

export function NodeEditor({ node, onUpdate, onClose }: NodeEditorProps) {
  // Reset local form when node selection changes
  const [key, setKey] = useState(0)
  useEffect(() => {
    setKey((k) => k + 1)
  }, [node?.id])

  if (!node) return null

  const meta = NODE_META[node.type ?? '']
  const Icon = meta?.icon ?? Zap

  function handleSave(newData: Record<string, unknown>) {
    onUpdate(node!.id, { ...node!.data, ...newData })
  }

  function renderForm() {
    switch (node.type) {
      case 'sendDm':
        return <SendDMForm key={key} data={node.data} onSave={handleSave} />
      case 'replyComment':
        return <ReplyCommentForm key={key} data={node.data} onSave={handleSave} />
      case 'aiStep':
        return <AIStepForm key={key} data={node.data} onSave={handleSave} />
      case 'condition':
        return <ConditionForm key={key} data={node.data} onSave={handleSave} />
      case 'smartDelay':
        return <SmartDelayForm key={key} data={node.data} onSave={handleSave} />
      case 'action':
        return <ActionForm key={key} data={node.data} onSave={handleSave} />
      default:
        return (
          <p className="text-sm text-slate-400 italic mt-2">
            No configurable options for this node type.
          </p>
        )
    }
  }

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full overflow-y-auto shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className={`flex items-center justify-center size-8 rounded-lg ${meta?.iconBg ?? 'bg-slate-100'}`}>
            <Icon className={`size-4 ${meta?.iconColor ?? 'text-slate-500'}`} />
          </span>
          <div>
            <p className="text-xs text-slate-400 leading-none">Editing</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{meta?.label ?? node.type}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center size-8 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close editor"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Form body */}
      <div className="px-4 py-4 flex-1">
        {renderForm()}
      </div>
    </div>
  )
}
