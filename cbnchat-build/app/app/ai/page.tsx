'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Bot, Sparkles, Save, Play, Info,
  ChevronDown, Loader2,
} from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_SYSTEM_PROMPT = `You are a friendly assistant for Superyouth Generation, a Christian youth media community in Indonesia. Respond to Instagram comments in Bahasa Indonesia, warmly and concisely (max 2 sentences). Always invite the commenter to DM us for prayer requests or to join our WhatsApp community. Never discuss political or divisive topics.`

const DEFAULT_FALLBACK = `Terima kasih atas komentarnya! Tim kami akan segera merespons. 🙏`

const MOCK_AI_RESPONSE = `Halo! Terima kasih sudah bertanya 😊 Superyouth Generation adalah komunitas pemuda Kristen di Indonesia. Yuk DM kami untuk info lebih lanjut! 🙏`

const MODELS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o mini (Recommended)' },
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function CardSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        {description && (
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        )}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold text-slate-600 mb-1.5"
    >
      {children}
    </label>
  )
}

function StyledTextarea({
  id,
  value,
  onChange,
  rows = 4,
  placeholder,
  monospace,
}: {
  id?: string
  value: string
  onChange: (v: string) => void
  rows?: number
  placeholder?: string
  monospace?: boolean
}) {
  return (
    <textarea
      id={id}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none leading-relaxed ${monospace ? 'font-mono' : ''}`}
    />
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AIPage() {
  // Config state
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT)
  const [knowledgeBase, setKnowledgeBase] = useState('')
  const [model, setModel] = useState('gpt-4o-mini')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(300)
  const [fallback, setFallback] = useState(DEFAULT_FALLBACK)

  // Playground state
  const [testComment, setTestComment] = useState('')
  const [testResult, setTestResult] = useState<{
    response: string
    tokens: number
    ms: number
  } | null>(null)
  const [testLoading, setTestLoading] = useState(false)

  function handleSave() {
    toast.success('Configuration saved!')
  }

  async function handleTestReply() {
    if (!testComment.trim()) {
      toast.error('Please enter a comment to simulate.')
      return
    }
    setTestLoading(true)
    setTestResult(null)
    // Simulate latency
    await new Promise((r) => setTimeout(r, 1200))
    setTestResult({
      response: MOCK_AI_RESPONSE,
      tokens: 47,
      ms: 1200,
    })
    setTestLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center size-10 rounded-xl bg-violet-100 shrink-0">
          <Bot className="size-5 text-violet-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Configuration</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure the AI agent used in your automation flows.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 items-start">
        {/* ── LEFT: Config forms (col-span-3) ────────────────────────────── */}
        <div className="lg:col-span-3 space-y-4">
          {/* System prompt */}
          <CardSection
            title="System Prompt"
            description="Defines the AI's persona, language, and behavior rules."
          >
            <FieldLabel htmlFor="system-prompt">Prompt</FieldLabel>
            <StyledTextarea
              id="system-prompt"
              value={systemPrompt}
              onChange={setSystemPrompt}
              rows={6}
              placeholder="You are a helpful assistant…"
            />
            <p className="text-xs text-slate-400 mt-2">
              {systemPrompt.length} characters
            </p>
          </CardSection>

          {/* Knowledge base */}
          <CardSection
            title="Knowledge Base"
            description="Paste FAQ content, ministry info, or context in Markdown."
          >
            <FieldLabel htmlFor="knowledge-base">Content (Markdown)</FieldLabel>
            <StyledTextarea
              id="knowledge-base"
              value={knowledgeBase}
              onChange={setKnowledgeBase}
              rows={5}
              placeholder={`## About Superyouth Generation\nSuperyouth Generation is...\n\n## FAQ\n**Q: How to join?**\nA: Follow our Instagram and...`}
              monospace
            />
          </CardSection>

          {/* Model settings */}
          <CardSection
            title="Model Settings"
            description="Control which model is used and how creative responses can be."
          >
            <div className="space-y-4">
              {/* Model */}
              <div>
                <FieldLabel htmlFor="model-select">Model</FieldLabel>
                <div className="relative">
                  <select
                    id="model-select"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {MODELS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Temperature */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <FieldLabel htmlFor="temperature">Temperature</FieldLabel>
                  <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {temperature.toFixed(1)}
                  </span>
                </div>
                <input
                  id="temperature"
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-teal-600 h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Precise (0.0)</span>
                  <span>Creative (1.0)</span>
                </div>
              </div>

              {/* Max tokens */}
              <div>
                <FieldLabel htmlFor="max-tokens">Max Tokens</FieldLabel>
                <input
                  id="max-tokens"
                  type="number"
                  min={50}
                  max={2000}
                  step={50}
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
                  className="w-32 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </CardSection>

          {/* Fallback message */}
          <CardSection
            title="Fallback Message"
            description="Sent when the AI fails or confidence is too low."
          >
            <FieldLabel htmlFor="fallback">Message</FieldLabel>
            <StyledTextarea
              id="fallback"
              value={fallback}
              onChange={setFallback}
              rows={2}
              placeholder="Terima kasih atas komentarnya!"
            />
          </CardSection>

          {/* Save button */}
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <Save className="size-4" />
            Save Configuration
          </button>
        </div>

        {/* ── RIGHT: Playground (col-span-2, sticky) ──────────────────────── */}
        <div className="lg:col-span-2 sticky top-6 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Playground header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="size-4 text-violet-500" />
              <h2 className="text-sm font-semibold text-slate-800">Test Playground</h2>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Test comment input */}
              <div>
                <FieldLabel htmlFor="test-comment">Simulate a comment</FieldLabel>
                <StyledTextarea
                  id="test-comment"
                  value={testComment}
                  onChange={setTestComment}
                  rows={3}
                  placeholder="e.g. info please, mau ikut gimana caranya?"
                />
              </div>

              <button
                onClick={handleTestReply}
                disabled={testLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
              >
                {testLoading
                  ? <Loader2 className="size-4 animate-spin" />
                  : <Play className="size-4" />
                }
                {testLoading ? 'Generating…' : 'Test Reply'}
              </button>

              {/* Response area */}
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">AI Response</p>
                </div>
                <div className="px-3.5 py-3 min-h-[80px]">
                  {testLoading && (
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Loader2 className="size-4 animate-spin" />
                      <span>Generating response…</span>
                    </div>
                  )}
                  {!testLoading && testResult && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-800 leading-relaxed">{testResult.response}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                        <span>{testResult.tokens} tokens</span>
                        <span>{testResult.ms}ms</span>
                        <span className="ml-auto text-violet-600 font-medium">{model}</span>
                      </div>
                    </div>
                  )}
                  {!testLoading && !testResult && (
                    <p className="text-sm text-slate-400 italic">
                      Enter a comment above and click Test Reply to see the AI response.
                    </p>
                  )}
                </div>
              </div>

              {/* Phase note */}
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                <Info className="size-3.5 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Real AI responses require an <code className="font-mono bg-amber-100 px-1 rounded">OPENAI_API_KEY</code> (Phase 4)
                </p>
              </div>
            </div>
          </div>

          {/* Prompt preview card */}
          <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
            <div className="px-4 py-3 border-b border-slate-700">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">System Prompt Preview</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-xs text-slate-300 font-mono leading-relaxed line-clamp-6 whitespace-pre-wrap">
                {systemPrompt || 'No system prompt configured.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
