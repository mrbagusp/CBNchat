import type { LucideIcon } from 'lucide-react'

interface StubPageProps {
  icon: LucideIcon
  title: string
  phase: string
  description?: string
}

export function StubPage({ icon: Icon, title, phase, description }: StubPageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h1 className="mb-2 text-xl font-bold text-slate-900">{title}</h1>
      {description && (
        <p className="mb-4 max-w-sm text-sm text-slate-500">{description}</p>
      )}
      <span className="rounded-full bg-teal-50 border border-teal-200 px-4 py-1.5 text-sm font-semibold text-teal-700">
        Coming in Phase {phase}
      </span>
    </div>
  )
}
