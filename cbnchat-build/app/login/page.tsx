'use client'

import { useRouter } from 'next/navigation'
import { MessageCircle, Instagram, Facebook, Mail, Shield, Rocket } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()

  function handleComingSoon(phase: string) {
    toast.info(`Coming in Phase ${phase}`)
  }

  function handleDemo() {
    router.push('/app/home')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50 px-4 py-12">
      <div className="w-full max-w-[440px]">
        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-8 shadow-xl">
          {/* Logo */}
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-700 shadow-md">
              <MessageCircle className="h-7 w-7 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900">Welcome to CBNchat</h1>
              <p className="mt-1 text-sm text-slate-500">Login to your CBNchat account</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Instagram */}
            <button
              onClick={() => handleComingSoon('4')}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 py-3 font-semibold text-white shadow-sm hover:from-rose-600 hover:to-pink-600 hover:scale-[1.02] active:scale-[0.99] transition-all duration-150"
            >
              <Instagram className="h-5 w-5" />
              Continue with Instagram
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium text-slate-400">or</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Facebook — disabled */}
            <button
              disabled
              title="Coming in Phase 7"
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-blue-200 bg-blue-50 py-3 font-semibold text-blue-400 cursor-not-allowed opacity-60"
            >
              <Facebook className="h-5 w-5" />
              Continue with Facebook
              <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                Phase 7
              </span>
            </button>

            {/* Email */}
            <button
              onClick={() => handleComingSoon('4')}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-slate-200 bg-white py-3 font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <Mail className="h-5 w-5 text-slate-500" />
              Continue with Email
            </button>

            {/* Divider */}
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-slate-400">Try without an account</span>
              </div>
            </div>

            {/* Demo button — the only functional one */}
            <button
              onClick={handleDemo}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-amber-500 py-3 font-bold text-white shadow-sm hover:bg-amber-600 transition-colors"
            >
              <Rocket className="h-5 w-5" />
              Enter Demo Workspace
            </button>
          </div>

          {/* Trust text */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Shield className="h-3.5 w-3.5" />
            Secured via official Instagram Login API
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-5 flex items-center justify-center gap-4 text-xs text-slate-400">
          <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
          <span>&middot;</span>
          <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
          <span>&middot;</span>
          <Link href="/" className="hover:text-slate-600 transition-colors">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
