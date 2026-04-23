'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function NewAutomationPage() {
  const router = useRouter()

  useEffect(() => {
    // In Phase 4 this will POST to /api/automations to create a real record
    // and redirect to /app/automation/[newId]. For now redirect to mock ID.
    router.replace('/app/automation/auto-new')
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <Loader2 className="size-6 text-teal-600 animate-spin" />
      <p className="text-sm text-slate-500">Creating new automation...</p>
    </div>
  )
}
