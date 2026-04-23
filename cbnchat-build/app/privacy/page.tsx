import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

const SECTIONS = [
  {
    title: 'Information We Collect',
    body: `We collect information you provide when connecting your Instagram account, including your Instagram username, profile photo, and follower count. We also collect usage data such as automation activity, contact interactions, and session logs to improve the service. We do not collect passwords or store your Instagram credentials directly.`,
  },
  {
    title: 'How We Use Your Information',
    body: `Your information is used solely to operate and improve CBNchat, including powering automation flows, building your contact CRM, and generating analytics on your dashboard. We do not sell, rent, or share your personal data with third parties for marketing purposes. Aggregated and anonymized data may be used to improve platform-wide features.`,
  },
  {
    title: 'Instagram Data',
    body: `CBNchat accesses your Instagram account through the official Meta Instagram Login API. We request only the minimum permissions needed to operate: reading comments, sending DMs, and accessing media metadata. You can revoke this access at any time through your Instagram account settings or from within the CBNchat dashboard under Settings &rsaquo; Connected Accounts.`,
  },
  {
    title: 'Data Storage & Security',
    body: `All data is stored on encrypted servers hosted in secure cloud environments. OAuth tokens used to connect Instagram are encrypted at rest using AES-256 and automatically rotated every 60 days. We employ industry-standard security practices including TLS encryption in transit, role-based access controls, and regular security audits.`,
  },
  {
    title: 'Your Rights',
    body: `You have the right to access, correct, export, or delete any personal data we hold about you. To exercise these rights, contact us at privacy@cbnchat.com with the subject line "Data Request." We will respond within 30 days. Users in the EU and EEA may also have additional rights under the General Data Protection Regulation (GDPR).`,
  },
  {
    title: 'Data Deletion',
    body: `You can request deletion of all your data at any time by disconnecting your account from the Settings page or by emailing privacy@cbnchat.com. Upon request, all contact records, automation data, and account information will be permanently deleted within 30 days. This action is irreversible. We also provide a data deletion callback endpoint as required by Meta for App Review compliance.`,
  },
  {
    title: 'Contact Us',
    body: `If you have any questions about this Privacy Policy or how we handle your data, please contact our privacy team at privacy@cbnchat.com. You may also reach us by mail at CBN Indonesia, Jakarta, Indonesia. We are committed to addressing your concerns promptly and transparently.`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-bold text-slate-900">CBNchat</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/terms" className="text-slate-500 hover:text-teal-700 transition-colors">
              Terms of Service
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-800 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400">Last updated: April 2026</p>
          <p className="mt-4 text-slate-600 leading-relaxed">
            CBNchat (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy. This policy describes how we collect, use, and safeguard your information when you use our platform.
          </p>
        </div>

        <div className="space-y-10 divide-y divide-slate-100">
          {SECTIONS.map(({ title, body }) => (
            <section key={title} className="pt-8 first:pt-0">
              <h2 className="text-xl font-bold text-slate-900 mb-3">{title}</h2>
              <p className="text-slate-600 leading-relaxed">{body}</p>
            </section>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 mt-20">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">CBNchat</span>
            <span className="text-sm text-slate-400 ml-1">&copy; 2026 CBN Indonesia. All rights reserved.</span>
          </div>
          <div className="flex gap-5 text-sm text-slate-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <a href="mailto:privacy@cbnchat.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
