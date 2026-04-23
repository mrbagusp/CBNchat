'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number | string
  change: string
  sparkline: number[]
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
}

export function StatCard({
  label,
  value,
  change,
  sparkline,
  icon: Icon,
  iconColor = 'text-teal-600',
  iconBg = 'bg-teal-50',
}: StatCardProps) {
  const isPositive = change.startsWith('+')
  const chartData = sparkline.map((v, i) => ({ i, v }))

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </span>
          <span className="text-2xl font-bold text-slate-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          <div className={cn('flex items-center gap-1 text-xs font-semibold', isPositive ? 'text-emerald-600' : 'text-red-500')}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {change} this week
          </div>
        </div>
        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', iconBg)}>
          <Icon className={cn('h-5 w-5', iconColor)} />
        </div>
      </div>
      <div className="mt-3 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0F766E" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{ display: 'none' }}
              cursor={false}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke="#0F766E"
              strokeWidth={2}
              fill={`url(#grad-${label})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
