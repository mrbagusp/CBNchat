'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
  Handle,
  Position,
  type NodeTypes,
  type NodeProps,
  type Node,
  type Connection,
} from 'reactflow'
import 'reactflow/dist/style.css'
import {
  ChevronLeft,
  Pencil,
  Play,
  Pause,
  Eye,
  Save,
  Zap,
  Plus,
  Instagram,
  Bot,
  GitBranch,
  Shuffle,
  Clock,
  MousePointerClick,
  MessageSquare,
  Info,
  Bug,
  X,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { AUTOMATIONS, MOCK_MEDIA } from '@/lib/mock-data'
import { TriggerModal, type TriggerConfig } from '@/components/cbnchat/trigger-modal'
import { NodeEditor } from '@/components/cbnchat/node-editor'
import {
  SendDMNode,
  ReplyCommentNode,
  AIStepNode,
  ConditionNode,
  SmartDelayNode,
  ActionNode,
} from '@/components/cbnchat/flow-nodes'

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
        LIVE
      </span>
    )
  }
  if (status === 'paused') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <span className="size-1.5 rounded-full bg-amber-400" />
        PAUSED
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
      <span className="size-1.5 rounded-full bg-slate-400" />
      DRAFT
    </span>
  )
}

// ─── Custom TriggerNode ───────────────────────────────────────────────────────
// data shape: { onOpen?: () => void; triggerLabel?: string }

function TriggerNode({ selected, data }: NodeProps) {
  const hastrigger = Boolean(data?.triggerLabel)

  return (
    <div
      className={`w-72 bg-white rounded-xl shadow-md border-2 transition-all ${
        hastrigger
          ? 'border-teal-400'
          : selected
            ? 'border-teal-500 border-dashed'
            : 'border-teal-300 border-dashed'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <div className={`flex items-center justify-center size-8 rounded-lg shrink-0 ${hastrigger ? 'bg-teal-600' : 'bg-teal-50'}`}>
          <Zap className={`size-4 ${hastrigger ? 'text-white' : 'text-teal-600'}`} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider leading-none">
            Trigger
          </p>
          <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">
            {hastrigger ? data.triggerLabel : 'When...'}
          </p>
        </div>
      </div>

      {/* Body — unconfigured state */}
      {!hastrigger && (
        <div className="px-4 pb-3">
          <p className="text-xs text-slate-500 leading-relaxed">
            A Trigger is an event that starts your Automation. Click to add a Trigger.
          </p>
        </div>
      )}

      {/* Configured state: show channel pill + post/keyword summary */}
      {hastrigger && (
        <div className="px-4 pb-3 space-y-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs font-medium">
            <Instagram className="size-3" />
            Instagram
          </span>
          {data?.postSummary && (
            <p className="text-xs text-slate-500 truncate">{data.postSummary}</p>
          )}
          {data?.keywordSummary && (
            <p className="text-xs text-teal-600 truncate font-medium">{data.keywordSummary}</p>
          )}
        </div>
      )}

      {/* CTA or configured state footer */}
      <div className="px-4 pb-4">
        {!hastrigger && (
          <button
            onClick={() => data?.onOpen?.()}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border-2 border-dashed border-teal-300 text-sm font-medium text-teal-600 hover:border-teal-500 hover:bg-teal-50 transition-colors"
          >
            <Plus className="size-4" />
            New Trigger
          </button>
        )}
      </div>

      {/* Source handle — always present so edges can connect */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-teal-400 !border-2 !border-white"
      />
    </div>
  )
}

// ─── Simulate Comment Dev Tools Panel ────────────────────────────────────────

interface SimResult {
  matched: boolean
  automationName: string
  reason: string
  keywords?: string[]
  steps: { label: string; detail: string }[]
}

interface SimEntry {
  id: string
  ts: string
  username: string
  comment: string
  matched: boolean
}

interface SimulateCommentPanelProps {
  onClose: () => void
  automationName: string
  status: string
  nodes: Node[]
  triggerData: Record<string, unknown>
}

function SimulateCommentPanel({
  onClose,
  automationName,
  status,
  nodes,
  triggerData,
}: SimulateCommentPanelProps) {
  const [username, setUsername] = useState('@test_commenter')
  const [comment, setComment] = useState('doa untuk keluarga saya 🙏')
  const [selectedMediaId, setSelectedMediaId] = useState(MOCK_MEDIA[0]?.id ?? '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SimResult | null>(null)
  const [history, setHistory] = useState<SimEntry[]>([])

  function runSimulation() {
    setLoading(true)
    setResult(null)

    setTimeout(() => {
      const triggerType = triggerData?.triggerType as string | undefined
      const postMode = triggerData?.postMode as string | undefined
      const commentMode = triggerData?.commentMode as string | undefined
      const keywords = (triggerData?.keywords as string[]) ?? []
      const selectedMediaIds = (triggerData?.selectedMediaIds as string[]) ?? []

      // Build execution steps from nodes on canvas
      const steps: { label: string; detail: string }[] = []
      for (const n of nodes) {
        if (n.type === 'replyComment') {
          const msg = (n.data?.message as string) || 'Terima kasih! Cek DM kamu ya 🙏'
          steps.push({ label: 'Reply to Comment', detail: `"${msg}"` })
        } else if (n.type === 'sendDm') {
          const msg = (n.data?.message as string) || 'Halo! Terima kasih sudah berkomentar...'
          steps.push({ label: 'Send DM', detail: `"${msg}"` })
        } else if (n.type === 'aiStep') {
          steps.push({ label: 'AI Step', detail: 'Generating AI response...' })
        } else if (n.type === 'action') {
          const actionType = (n.data?.actionType as string) || 'Set tag'
          const value = (n.data?.value as string) || 'new_lead'
          steps.push({ label: 'Action', detail: `${actionType}: ${value}` })
        } else if (n.type === 'condition') {
          steps.push({ label: 'Condition', detail: 'Evaluating condition branch...' })
        } else if (n.type === 'smartDelay') {
          const dur = (n.data?.duration as string) || '1 hour'
          steps.push({ label: 'Smart Delay', detail: `Wait ${dur}` })
        }
      }

      // Determine match
      let matched = false
      let reason = ''

      if (status !== 'live') {
        reason = 'Automation is not live — set it to Live before testing'
      } else if (!triggerType) {
        reason = 'No trigger configured on the trigger node'
      } else if (triggerType !== 'post_comment') {
        reason = `Trigger type "${triggerType}" does not match this simulation (expects post_comment)`
      } else {
        // Check post match
        let postMatch = false
        if (postMode === 'all' || postMode === 'next') {
          postMatch = true
        } else {
          postMatch = selectedMediaIds.includes(selectedMediaId)
        }

        if (!postMatch) {
          reason = 'Selected post is not in the trigger\'s specific posts list'
        } else if (commentMode === 'all') {
          matched = true
          reason = 'All comments mode — triggers on every comment'
        } else if (commentMode === 'keyword') {
          const lc = comment.toLowerCase()
          const hit = keywords.find((kw) => lc.includes(kw.toLowerCase()))
          if (hit) {
            matched = true
            reason = `Keyword "${hit}" found in comment`
          } else {
            reason = `Comment does not contain any trigger keywords`
          }
        } else {
          matched = true
          reason = 'Trigger matched'
        }
      }

      const sim: SimResult = {
        matched,
        automationName,
        reason,
        keywords,
        steps: matched ? steps : [],
      }
      setResult(sim)

      const entry: SimEntry = {
        id: crypto.randomUUID(),
        ts: new Date().toLocaleTimeString(),
        username: username || '@tester',
        comment,
        matched,
      }
      setHistory((prev) => [entry, ...prev].slice(0, 5))
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[560px] max-h-[88vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center size-9 rounded-xl bg-amber-50 border border-amber-200 shrink-0 mt-0.5">
              <Bug className="size-4 text-amber-600" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Simulate Incoming Comment</h2>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed max-w-xs">
                Test your automation without real Instagram webhooks. In production this happens automatically.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center size-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Form */}
          <div className="space-y-3">
            {/* Username */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Commenter Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                placeholder="@test_commenter"
              />
            </div>

            {/* Comment text */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Comment Text
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition resize-none"
                placeholder="Type a comment..."
              />
            </div>

            {/* Post selector */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Post
              </label>
              <div className="relative">
                <select
                  value={selectedMediaId}
                  onChange={(e) => setSelectedMediaId(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent cursor-pointer transition"
                >
                  {MOCK_MEDIA.slice(0, 5).map((m) => (
                    <option key={m.id} value={m.id}>
                      [{m.media_type}] {m.caption.slice(0, 50)}{m.caption.length > 50 ? '...' : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Send button */}
          <button
            onClick={runSimulation}
            disabled={loading || !comment.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Bug className="size-4" />
                Send Simulated Comment
              </>
            )}
          </button>

          {/* Result */}
          {result && (
            <div className={`rounded-xl border p-4 space-y-3 ${
              result.matched
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-amber-50 border-amber-200'
            }`}>
              {/* Title */}
              <div className="flex items-center gap-2">
                {result.matched ? (
                  <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="size-5 text-amber-600 shrink-0" />
                )}
                <p className={`text-sm font-bold ${result.matched ? 'text-emerald-800' : 'text-amber-800'}`}>
                  {result.matched ? 'Automation TRIGGERED' : 'No automation matched'}
                </p>
              </div>

              {/* Details */}
              <div className={`text-xs space-y-0.5 ${result.matched ? 'text-emerald-700' : 'text-amber-700'}`}>
                {result.matched && (
                  <>
                    <p><span className="font-semibold">Automation:</span> {result.automationName}</p>
                    <p><span className="font-semibold">Trigger:</span> Post or Reel Comments</p>
                  </>
                )}
                <p><span className="font-semibold">{result.matched ? 'Match reason' : 'Reason'}:</span> {result.reason}</p>
                {!result.matched && result.keywords && result.keywords.length > 0 && (
                  <p className="mt-1">
                    <span className="font-semibold">Try using one of these keywords:</span>{' '}
                    {result.keywords.map((kw) => (
                      <span key={kw} className="inline-block bg-amber-200 text-amber-900 rounded px-1.5 py-0.5 mr-1 font-mono text-[11px]">{kw}</span>
                    ))}
                  </p>
                )}
              </div>

              {/* Execution steps */}
              {result.matched && result.steps.length > 0 && (
                <div className="space-y-1.5 pt-1 border-t border-emerald-200">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    Simulated execution
                  </p>
                  {result.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-emerald-700">
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>
                        <span className="font-semibold">Step {i + 1}: {step.label}</span>
                        {' → '}
                        <span className="text-emerald-600">{step.detail}</span>
                      </span>
                    </div>
                  ))}
                  <a
                    href="/app/home"
                    className="inline-flex items-center gap-1 text-xs text-teal-600 hover:text-teal-800 font-medium mt-1 transition-colors"
                  >
                    <ExternalLink className="size-3" />
                    View in Automation Runs
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Recent simulations */}
          {history.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Recent Simulations
              </p>
              <div className="space-y-1.5">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100"
                  >
                    <span className="text-[10px] text-slate-400 tabular-nums shrink-0">{entry.ts}</span>
                    <span className="text-xs text-slate-500 font-medium shrink-0">{entry.username}</span>
                    <span className="text-xs text-slate-600 truncate flex-1 italic">
                      &ldquo;{entry.comment.slice(0, 35)}{entry.comment.length > 35 ? '…' : ''}&rdquo;
                    </span>
                    <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      entry.matched
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {entry.matched ? 'Matched' : 'No match'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Side panel step definitions ─────────────────────────────────────────────

const STEP_SECTIONS = [
  {
    label: 'Content',
    items: [
      { icon: Instagram, label: 'Send DM', nodeType: 'sendDm', disabled: false },
      { icon: MessageSquare, label: 'Reply to Comment', nodeType: 'replyComment', disabled: false },
      { icon: MessageSquare, label: 'TikTok', nodeType: null, disabled: true },
      { icon: MessageSquare, label: 'Messenger', nodeType: null, disabled: true },
    ],
  },
  {
    label: 'AI',
    items: [
      { icon: Bot, label: 'AI Step', nodeType: 'aiStep', disabled: false },
    ],
  },
  {
    label: 'Logic',
    items: [
      { icon: MousePointerClick, label: 'Action', nodeType: 'action', disabled: false },
      { icon: GitBranch, label: 'Condition', nodeType: 'condition', disabled: false },
      { icon: Shuffle, label: 'Randomizer', nodeType: null, disabled: true },
      { icon: Clock, label: 'Smart Delay', nodeType: 'smartDelay', disabled: false },
    ],
  },
]

// ─── Node types (defined outside component — stable reference, never recreate) ─

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  sendDm: SendDMNode,
  replyComment: ReplyCommentNode,
  aiStep: AIStepNode,
  condition: ConditionNode,
  smartDelay: SmartDelayNode,
  action: ActionNode,
}

// ─── Initial nodes ────────────────────────────────────────────────────────────

const initialNodes = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 150, y: 80 },
    data: {},
  },
]

// ─── Inner builder (needs ReactFlowProvider ancestor for useReactFlow) ─────────

function AutomationBuilderInner({
  found,
}: {
  found: ReturnType<typeof AUTOMATIONS.find>
}) {
  const { getNodes, getEdges } = useReactFlow()

  const [name, setName] = useState(found?.name ?? 'Untitled')
  const [status, setStatus] = useState(found?.status ?? 'draft')
  const [editingName, setEditingName] = useState(false)
  const [draftName, setDraftName] = useState(name)

  const [triggerModalOpen, setTriggerModalOpen] = useState(false)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [devToolsOpen, setDevToolsOpen] = useState(false)

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  )

  const openTriggerModal = useCallback(() => setTriggerModalOpen(true), [])

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === 'trigger-1'
          ? { ...n, data: { ...n.data, onOpen: openTriggerModal } }
          : n
      )
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTriggerModal])

  const nodeCounter = useRef(1)

  function addNode(nodeType: string, label: string) {
    // Use getNodes() for fresh state instead of stale closure `nodes`
    const currentNodes = getNodes()
    const maxY = currentNodes.reduce((acc, n) => Math.max(acc, n.position.y), 0)
    const newY = maxY + 180
    const newId = `${nodeType}-${++nodeCounter.current}`
    const lastNode = currentNodes[currentNodes.length - 1]

    const newNode: Node = {
      id: newId,
      type: nodeType,
      position: { x: 150, y: newY },
      data: {},
    }

    const newEdge = lastNode
      ? {
          id: `e-${lastNode.id}-${newId}`,
          source: lastNode.id,
          target: newId,
          animated: false,
          style: { stroke: '#94a3b8', strokeWidth: 2 },
        }
      : null

    setNodes((nds) => [...nds, newNode])
    if (newEdge) setEdges((eds) => [...eds, newEdge])
    toast.success(`${label} node added`)
  }

  function handleTriggerSelect(config: TriggerConfig) {
    // Build human-readable summary strings for the node card
    let postSummary = ''
    if (config.triggerType === 'post_comment') {
      if (config.postMode === 'all') postSummary = 'All posts & reels'
      else if (config.postMode === 'next') postSummary = 'Next published post'
      else postSummary = `${config.selectedMediaIds.length} specific post${config.selectedMediaIds.length !== 1 ? 's' : ''}`
    }

    let keywordSummary = ''
    if (config.triggerType === 'post_comment') {
      if (config.commentMode === 'all') keywordSummary = 'All comments'
      else if (config.keywords.length > 0) keywordSummary = `Keywords: ${config.keywords.join(', ')}`
    }

    setNodes((nds) =>
      nds.map((n) =>
        n.id === 'trigger-1'
          ? {
              ...n,
              data: {
                ...n.data,
                triggerLabel: config.triggerLabel,
                triggerType: config.triggerType,
                postSummary,
                keywordSummary,
                onOpen: openTriggerModal,
              },
            }
          : n
      )
    )
    toast.success(`Trigger set: ${config.triggerLabel}`)
  }

  function handleNodeClick(_event: React.MouseEvent, node: Node) {
    // Trigger nodes open the modal instead of the editor
    if (node.type === 'trigger') {
      if (!node.data?.triggerLabel) {
        setTriggerModalOpen(true)
      }
      return
    }
    setSelectedNode(node)
  }

  function handleNodeUpdate(nodeId: string, data: Record<string, unknown>) {
    setNodes((nds) =>
      nds.map((n) => (n.id === nodeId ? { ...n, data } : n))
    )
    // Keep selectedNode in sync so the editor reflects the update
    setSelectedNode((prev) => (prev?.id === nodeId ? { ...prev, data } : prev))
    toast.success('Step updated')
  }

  function handleEditorClose() {
    setSelectedNode(null)
  }

  function handleSave() {
    const flow = { nodes: getNodes(), edges: getEdges() }
    console.log('[CBNchat] Flow saved:', flow)
    toast.success('Flow saved!')
  }

  function handleNameCommit() {
    const trimmed = draftName.trim()
    if (trimmed) setName(trimmed)
    else setDraftName(name)
    setEditingName(false)
    toast.success('Automation renamed')
  }

  function handleToggleLive() {
    if (status === 'live') {
      setStatus('paused')
      toast.success('Automation paused')
    } else {
      const triggerNode = nodes.find((n) => n.id === 'trigger-1')
      const hasTrigger = !!(triggerNode?.data as Record<string, unknown>)?.triggerType
      if (!hasTrigger) {
        toast.error('Cannot go live: No trigger configured. Click the trigger node to set one.')
        return
      }
      setStatus('live')
      toast.success('Automation is now live')
    }
  }

  // Deselect when clicking canvas background
  function handlePaneClick() {
    setSelectedNode(null)
  }

  return (
    <>
      {devToolsOpen && (
        <SimulateCommentPanel
          onClose={() => setDevToolsOpen(false)}
          automationName={name}
          status={status}
          nodes={nodes}
          triggerData={
            (nodes.find((n) => n.id === 'trigger-1')?.data ?? {}) as Record<string, unknown>
          }
        />
      )}
      <TriggerModal
        open={triggerModalOpen}
        onClose={() => setTriggerModalOpen(false)}
        onSelect={(config) => handleTriggerSelect(config)}
      />
      <div className="flex flex-col absolute inset-0 overflow-hidden">

        {/* ── Top bar ── */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-10">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/app/automation"
              className="inline-flex items-center justify-center size-8 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
            >
              <ChevronLeft className="size-5" />
            </Link>

            <span className="text-sm text-slate-400 shrink-0">Automations /</span>

            {editingName ? (
              <input
                autoFocus
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onBlur={handleNameCommit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameCommit()
                  if (e.key === 'Escape') { setDraftName(name); setEditingName(false) }
                }}
                className="text-sm font-semibold text-slate-900 bg-white border border-teal-400 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-teal-500 w-56"
              />
            ) : (
              <button
                onClick={() => { setDraftName(name); setEditingName(true) }}
                className="flex items-center gap-1.5 group min-w-0"
              >
                <span className="text-sm font-semibold text-slate-900 truncate max-w-[240px]">{name}</span>
                <Pencil className="size-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>
            )}

            <StatusBadge status={status} />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleSave}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Save className="size-4" />
              Save
            </button>
            <button
              onClick={() => setDevToolsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
              title="Dev Tools: Simulate a comment"
            >
              <Bug className="size-4" />
              Dev Tools
            </button>
            <button
              onClick={() => toast.info('Preview mode coming in Phase 2')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Eye className="size-4" />
              Preview
            </button>
            {status === 'live' ? (
              <button
                onClick={handleToggleLive}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors"
              >
                <Pause className="size-4" />
                Pause
              </button>
            ) : (
              <button
                onClick={handleToggleLive}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
              >
                <Play className="size-4" />
                Set Live
              </button>
            )}
          </div>
        </header>

        {/* ── Canvas + Panel ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ReactFlow canvas */}
          <div className="flex-1 h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={handleNodeClick}
              onPaneClick={handlePaneClick}
              nodeTypes={nodeTypes}
              defaultEdgeOptions={{
                type: 'smoothstep',
                style: { stroke: '#94a3b8', strokeWidth: 2 },
              }}
              snapToGrid
              snapGrid={[16, 16]}
              fitView
              fitViewOptions={{ padding: 0.4 }}
              className="bg-slate-100"
              deleteKeyCode="Delete"
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={24}
                size={1.5}
                color="#cbd5e1"
              />
              <Controls
                className="!shadow-md !rounded-lg !border !border-slate-200 !bg-white"
                showInteractive={false}
              />
            </ReactFlow>
          </div>

          {/* ── Right panel: NodeEditor when a node is selected, palette otherwise ── */}
          {selectedNode ? (
            <NodeEditor
              node={selectedNode}
              onUpdate={handleNodeUpdate}
              onClose={handleEditorClose}
            />
          ) : (
            <aside className="w-80 bg-white border-l border-slate-200 flex flex-col overflow-y-auto shrink-0">
              <div className="px-4 pt-5 pb-3 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-800">Add a Step</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any step to append it to the canvas.
                </p>
              </div>

              <div className="flex-1 py-2">
                {STEP_SECTIONS.map((section) => (
                  <div key={section.label} className="mb-2">
                    <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                      {section.label}
                    </p>
                    {section.items.map((item) => (
                      <button
                        key={item.label}
                        disabled={item.disabled}
                        onClick={() => {
                          if (item.disabled || !item.nodeType) return
                          addNode(item.nodeType, item.label)
                        }}
                        title={item.disabled ? 'Coming Soon' : `Add ${item.label} step`}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left
                          ${item.disabled
                            ? 'opacity-40 cursor-not-allowed text-slate-500'
                            : 'hover:bg-teal-50 hover:text-teal-700 text-slate-700 cursor-pointer group'
                          }`}
                      >
                        <span className={`flex items-center justify-center size-8 rounded-lg shrink-0
                          ${item.disabled ? 'bg-slate-100' : 'bg-teal-50 group-hover:bg-teal-100 transition-colors'}`}>
                          <item.icon className={`size-4 ${item.disabled ? 'text-slate-400' : 'text-teal-600'}`} />
                        </span>
                        <span className="font-medium flex-1">{item.label}</span>
                        {item.disabled
                          ? (
                            <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              Soon
                            </span>
                          ) : (
                            <Plus className="size-3.5 text-slate-300 group-hover:text-teal-500 transition-colors opacity-0 group-hover:opacity-100" />
                          )
                        }
                      </button>
                    ))}
                  </div>
                ))}
              </div>

              <div className="px-4 py-4 border-t border-slate-100 bg-slate-50">
                <div className="flex items-start gap-2 text-xs text-slate-500">
                  <Info className="size-3.5 mt-0.5 shrink-0 text-teal-500" />
                  <p>Click a node to edit it. Click the canvas to deselect.</p>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  )
}

// ─── Page export — wraps inner with ReactFlowProvider ─────────────────────────

export default function AutomationBuilderPage() {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : (params.id?.[0] ?? '')
  const found = AUTOMATIONS.find((a) => a.id === id)

  return (
    <ReactFlowProvider>
      <AutomationBuilderInner found={found} />
    </ReactFlowProvider>
  )
}
