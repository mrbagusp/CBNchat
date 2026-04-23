'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <h1 className="text-6xl font-bold text-slate-200 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Page not found</h2>
      <p className="text-sm text-slate-500 mb-8 max-w-md leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        <Link
          href="/app/home"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-sm font-semibold text-white transition-colors"
        >
          <Home className="size-4" />
          Go Home
        </Link>
      </div>
    </div>
  )
}
