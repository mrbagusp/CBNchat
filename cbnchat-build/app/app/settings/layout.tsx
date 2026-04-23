'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const SETTINGS_NAV = [
  { href: '/app/settings/general', label: 'General' },
  { href: '/app/settings/team', label: 'Team' },
  { href: '/app/settings/workspaces', label: 'Workspaces' },
  { href: '/app/settings/integrations/webhooks', label: 'Integrations' },
  { href: '/app/settings/billing', label: 'Billing' },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your organization and workspace preferences.</p>
      </div>

      <div className="flex gap-1 border-b border-slate-200">
        {SETTINGS_NAV.map(({ href, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                isActive
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              )}
            >
              {label}
            </Link>
          )
        })}
      </div>

      <div>{children}</div>
    </div>
  )
}
