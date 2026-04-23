import { create } from 'zustand'
import {
  DEMO_PROFILE, ORGANIZATION, WORKSPACES, DEFAULT_WORKSPACE_ID,
  type Profile, type Organization, type Workspace,
} from './mock-data'

interface AppState {
  user: Profile | null
  organization: Organization | null
  isAuthenticated: boolean
  login: (user: Profile) => void
  loginAsDemo: () => void
  logout: () => void
  activeWorkspaceId: string
  setActiveWorkspaceId: (id: string) => void
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  mobileSidebarOpen: boolean
  toggleMobileSidebar: () => void
  trialBannerDismissed: boolean
  dismissTrialBanner: () => void
}

// IMPORTANT: Always use atomic selectors when reading from this store.
// CORRECT: const user = useAppStore((s) => s.user)
// WRONG:   const { user, logout } = useAppStore((s) => ({ user: s.user, logout: s.logout }))
// WRONG:   const { user } = useAppStore()
// The wrong patterns create new references every render causing infinite loops.
export const useAppStore = create<AppState>()((set) => ({
  user: DEMO_PROFILE,
  organization: ORGANIZATION,
  isAuthenticated: true,
  login: (user) => set({ user, isAuthenticated: true, organization: ORGANIZATION }),
  loginAsDemo: () => set({ user: DEMO_PROFILE, organization: ORGANIZATION, isAuthenticated: true }),
  logout: () => set({ user: null, organization: null, isAuthenticated: false }),
  activeWorkspaceId: DEFAULT_WORKSPACE_ID,
  setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  mobileSidebarOpen: false,
  toggleMobileSidebar: () => set((s) => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),
  trialBannerDismissed: false,
  dismissTrialBanner: () => set({ trialBannerDismissed: true }),
}))

export function useActiveWorkspace(): Workspace | undefined {
  return useAppStore((s) => WORKSPACES.find((w) => w.id === s.activeWorkspaceId))
}
