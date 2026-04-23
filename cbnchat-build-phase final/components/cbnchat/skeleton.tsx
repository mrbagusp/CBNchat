'use client'

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-1/3 mb-3" />
      <div className="h-8 bg-slate-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-slate-100 rounded w-2/3" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-10 bg-slate-100 border-b border-slate-200" />
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-5 py-3 border-b border-slate-50 last:border-0"
        >
          <div className="size-8 rounded-full bg-slate-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-slate-200 rounded w-1/3" />
            <div className="h-2 bg-slate-100 rounded w-1/2" />
          </div>
          <div className="h-3 bg-slate-100 rounded w-16" />
          <div className="h-6 bg-slate-100 rounded-full w-16" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 bg-slate-200 rounded w-48" />
        <div className="h-4 bg-slate-100 rounded w-72" />
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 h-64" />
        <div className="bg-white rounded-xl border border-slate-200 p-5 h-64" />
      </div>
      {/* Table */}
      <SkeletonTable rows={4} />
    </div>
  )
}
