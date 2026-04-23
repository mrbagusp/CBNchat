'use client'

import { X, AlertTriangle, Menu } from 'lucide-react'
import { useState } from 'react'
import { Sidebar } from './sidebar'
import { useAppStore } from '@/lib/store'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [demoBannerDismissed, setDemoBannerDismissed] = useState(false)
  const mobileSidebarOpen = useAppStore((s) => s.mobileSidebarOpen)
  const toggleMobileSidebar = useAppStore((s) => s.toggleMobileSidebar)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      {/* Demo mode banner */}
      {!demoBannerDismissed && (
        <div className="flex shrink-0 items-center justify-center gap-2 bg-amber-500 px-4 py-1.5 text-sm font-medium text-white">
          <AlertTriangle className="h-4 w-4" />
          <span>DEMO MODE — Auth bypassed, using mock data.</span>
          <button
            onClick={() => setDemoBannerDismissed(true)}
            aria-label="Dismiss demo banner"
            className="ml-2 rounded p-0.5 hover:bg-amber-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Mobile backdrop */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={toggleMobileSidebar}
            aria-hidden="true"
          />
        )}

        {/* Sidebar — always rendered, position varies by breakpoint */}
        <div
          className={[
            // Mobile: fixed overlay, slides in/out
            'fixed inset-y-0 left-0 z-50 md:relative md:z-auto md:flex md:shrink-0',
            'transition-transform duration-200',
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          ].join(' ')}
        >
          <Sidebar />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          {/* Topbar */}
          <header className="flex h-14 shrink-0 items-center border-b border-slate-200 bg-white px-4 md:px-6 gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={toggleMobileSidebar}
              aria-label="Open sidebar"
              className="flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-slate-500">Live</span>
            </div>
          </header>

          {/* Page content */}
          <main className="relative flex-1 overflow-hidden min-h-0">
            <div className="h-full overflow-y-auto">
              <div className="mx-auto max-w-7xl p-4 md:p-6 min-h-full">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
