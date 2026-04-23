'use client'

import { type NodeProps } from 'reactflow'
import { Handle, Position } from 'reactflow'
import {
  MessageCircle,
  Reply,
  Sparkles,
  GitBranch,
  Clock,
  Zap,
  CheckCircle2,
} from 'lucide-react'

// ─── Shared node card wrapper ─────────────────────────────────────────────────

interface NodeCardProps {
  accent: string          // border + icon bg classes
  iconBg: string
  iconColor: string
  icon: React.ElementType
  label: string
  tag?: string
  tagColor?: string
  children: React.ReactNode
  selected?: boolean
  hasTarget?: boolean
  hasSource?: boolean | 'double'   // 'double' = ConditionNode
  sourceHandleIds?: [string, string]  // for double handles
}

function NodeCard({
  accent,
  iconBg,
  iconColor,
  icon: Icon,
  label,
  tag,
  tagColor = 'bg-slate-100 text-slate-500',
  children,
  selected,
  hasTarget = true,
  hasSource = true,
  sourceHandleIds,
}: NodeCardProps) {
  return (
    <div
      className={`w-64 bg-white rounded-xl border shadow-sm transition-shadow hover:shadow-md ${accent} ${
        selected ? 'ring-2 ring-offset-1 ring-teal-400' : ''
      }`}
    >
      {/* Top handle */}
      {hasTarget && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white hover:!bg-teal-400 transition-colors"
        />
      )}

      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 pt-3.5 pb-2">
        <span className={`flex items-center justify-center size-7 rounded-lg shrink-0 ${iconBg}`}>
          <Icon className={`size-3.5 ${iconColor}`} />
        </span>
        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">{label}</span>
        {tag && (
          <span className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${tagColor}`}>
            {tag}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-3.5 pb-3.5">
        {children}
      </div>

      {/* Single bottom source handle */}
      {hasSource === true && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white hover:!bg-teal-400 transition-colors"
        />
      )}

      {/* Double source handles for ConditionNode */}
      {hasSource === 'double' && sourceHandleIds && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id={sourceHandleIds[0]}
            style={{ left: '30%' }}
            className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-white"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id={sourceHandleIds[1]}
            style={{ left: '70%' }}
            className="!w-3 !h-3 !bg-rose-400 !border-2 !border-white"
          />
        </>
      )}
    </div>
  )
}

// ─── Placeholder text ─────────────────────────────────────────────────────────

function Placeholder({ text }: { text: string }) {
  return (
    <p className="text-xs text-slate-400 italic leading-relaxed">{text}</p>
  )
}

function Preview({ text }: { text: string }) {
  return (
    <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">{text}</p>
  )
}

// ─── SendDMNode ───────────────────────────────────────────────────────────────

export function SendDMNode({ selected, data }: NodeProps) {
  return (
    <NodeCard
      accent="border-blue-200 bg-blue-50/50"
      iconBg="bg-blue-100"
      iconColor="text-blue-600"
      icon={MessageCircle}
      label="Send DM"
      selected={selected}
    >
      {data?.message
        ? <Preview text={data.message} />
        : <Placeholder text="Click to configure" />
      }
    </NodeCard>
  )
}

// ─── ReplyCommentNode ─────────────────────────────────────────────────────────

export function ReplyCommentNode({ selected, data }: NodeProps) {
  return (
    <NodeCard
      accent="border-green-200 bg-green-50/50"
      iconBg="bg-green-100"
      iconColor="text-green-600"
      icon={Reply}
      label="Reply to Comment"
      selected={selected}
    >
      {data?.message
        ? <Preview text={data.message} />
        : <Placeholder text="Click to configure" />
      }
    </NodeCard>
  )
}

// ─── AIStepNode ───────────────────────────────────────────────────────────────

export function AIStepNode({ selected, data }: NodeProps) {
  return (
    <NodeCard
      accent="border-violet-200 bg-violet-50/50"
      iconBg="bg-violet-100"
      iconColor="text-violet-600"
      icon={Sparkles}
      label="AI Step"
      tag={data?.model ?? 'GPT-4o-mini'}
      tagColor="bg-violet-100 text-violet-600"
      selected={selected}
    >
      {data?.configured ? (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5">
          <CheckCircle2 className="size-3.5 shrink-0" />
          AI-powered reply configured
        </div>
      ) : (
        <p className="text-xs text-slate-500 leading-relaxed">
          Uses workspace knowledge base to generate a contextual reply.
        </p>
      )}
    </NodeCard>
  )
}

// ─── ConditionNode ────────────────────────────────────────────────────────────

export function ConditionNode({ selected, data }: NodeProps) {
  return (
    <NodeCard
      accent="border-amber-200 bg-amber-50/50"
      iconBg="bg-amber-100"
      iconColor="text-amber-600"
      icon={GitBranch}
      label="Condition"
      selected={selected}
      hasSource="double"
      sourceHandleIds={['yes', 'no']}
    >
      {data?.condition
        ? <Preview text={data.condition} />
        : <Placeholder text="If / else logic" />
      }
      {/* Branch labels */}
      <div className="flex justify-between mt-3 text-[10px] font-semibold">
        <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Yes</span>
        <span className="text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">No</span>
      </div>
    </NodeCard>
  )
}

// ─── SmartDelayNode ───────────────────────────────────────────────────────────

export function SmartDelayNode({ selected, data }: NodeProps) {
  return (
    <NodeCard
      accent="border-slate-200 bg-slate-50/50"
      iconBg="bg-slate-100"
      iconColor="text-slate-600"
      icon={Clock}
      label="Smart Delay"
      selected={selected}
    >
      {data?.delay
        ? <Preview text={data.delay} />
        : <Placeholder text="Click to configure" />
      }
    </NodeCard>
  )
}

// ─── ActionNode ───────────────────────────────────────────────────────────────

export function ActionNode({ selected, data }: NodeProps) {
  return (
    <NodeCard
      accent="border-teal-200 bg-teal-50/50"
      iconBg="bg-teal-100"
      iconColor="text-teal-600"
      icon={Zap}
      label="Action"
      selected={selected}
    >
      {data?.actionType
        ? <Preview text={data.actionType} />
        : <Placeholder text="Click to configure" />
      }
    </NodeCard>
  )
}
