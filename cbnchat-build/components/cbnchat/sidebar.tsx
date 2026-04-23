'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Home, Zap, Bot, Inbox, Users, Radio, Settings,
  MessageCircle, ChevronLeft, ChevronRight, HelpCircle,
  LogOut, User, ChevronDown, Images,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { WorkspaceSwitcher } from './workspace-switcher'

const NAV_ITEMS = [
  { href: '/app/home', label: 'Home', icon: Home },
  { href: '/app/automation', label: 'Automations', icon: Zap },
  { href: '/app/ai', label: 'AI', icon: Bot },
  { href: '/app/inbox', label: 'Inbox', icon: Inbox, badge: 1 },
  { href: '/app/contacts', label: 'Contacts', icon: Users },
  { href: '/app/posts', label: 'Posts', icon: Images },
  { href: '/app/broadcasts', label: 'Broadcasts', icon: Radio },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const collapsed = useAppStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)
  const mobileSidebarOpen = useAppStore((s) => s.mobileSidebarOpen)
  const toggleMobileSidebar = useAppStore((s) => s.toggleMobileSidebar)
  const user = useAppStore((s) => s.user)
  const logout = useAppStore((s) => s.logout)

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <aside
      className={cn(
        'relative flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-200',
        collapsed ? 'w-[72px]' : 'w-[240px]'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-2 px-4 py-4 border-b border-slate-100', collapsed && 'justify-center px-2')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-700">
          <MessageCircle className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-base font-bold text-slate-900">CBNchat</span>
        )}
      </div>

      {/* Workspace switcher */}
      <div className={cn('px-2 pt-3 pb-2', collapsed && 'px-2')}>
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              onClick={() => { if (mobileSidebarOpen) toggleMobileSidebar() }}
              className={cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                collapsed && 'justify-center px-2'
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-teal-600" />
              )}
              <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-teal-600' : 'text-slate-500 group-hover:text-slate-700')} />
              {!collapsed && label}
              {!collapsed && badge != null && badge > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                  {badge}
                </span>
              )}
              {collapsed && badge != null && badge > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {badge}
                </span>
              )}
            </Link>
          )
        })}

        <div className="my-1 border-t border-slate-100" />

        <Link
          href="/app/settings/general"
          onClick={() => { if (mobileSidebarOpen) toggleMobileSidebar() }}
          className={cn(
            'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900',
            pathname.startsWith('/app/settings') && 'bg-teal-50 text-teal-700',
            collapsed && 'justify-center px-2'
          )}
        >
          <Settings className={cn('h-4 w-4 shrink-0', pathname.startsWith('/app/settings') ? 'text-teal-600' : 'text-slate-500 group-hover:text-slate-700')} />
          {!collapsed && 'Settings'}
        </Link>
      </nav>

      {/* Help card */}
      {!collapsed && (
        <div className="mx-3 mb-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
          <div className="flex items-center gap-2 mb-1">
            <HelpCircle className="h-4 w-4 text-teal-600" />
            <span className="text-xs font-semibold text-slate-700">Need Help?</span>
          </div>
          <p className="text-xs text-slate-500 mb-2">Check our docs or contact support.</p>
          <a
            href="#"
            className="block rounded-md bg-teal-600 py-1.5 text-center text-xs font-semibold text-white hover:bg-teal-700 transition-colors"
          >
            Open Docs
          </a>
        </div>
      )}

      {/* User profile */}
      <div className="border-t border-slate-100 p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors',
                collapsed && 'justify-center'
              )}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
                {user?.full_name?.charAt(0) ?? 'D'}
              </div>
              {!collapsed && (
                <>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-xs font-semibold text-slate-900">{user?.full_name}</p>
                    <p className="truncate text-xs text-slate-400">{user?.role}</p>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={4} className="w-48">
            <DropdownMenuItem className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="gap-2 text-red-600 focus:text-red-600">
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition-colors z-10"
      >
        {collapsed
          ? <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
          : <ChevronLeft className="h-3.5 w-3.5 text-slate-500" />
        }
      </button>
    </aside>
  )
}
