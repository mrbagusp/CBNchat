import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

const SECTIONS = [
  {
    title: 'Acceptance of Terms',
    body: `By accessing or using CBNchat, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use the service. These terms apply to all users, including individuals and organizations accessing the platform on behalf of a ministry or institution.`,
  },
  {
    title: 'Description of Service',
    body: `CBNchat is a social media automation platform designed to help Christian ministries and media organizations automate Instagram interactions, capture leads, and run AI-powered messaging workflows. The service includes automation builders, a contact CRM, webhook integrations, and analytics dashboards. Features are subject to change as the platform evolves.`,
  },
  {
    title: 'User Accounts',
    body: `You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify us immediately at legal@cbnchat.com if you suspect unauthorized access. Accounts may only be registered by humans — automated account creation is strictly prohibited.`,
  },
  {
    title: 'Instagram Integration',
    body: `CBNchat integrates with Instagram through the official Meta Instagram Login API. By connecting your Instagram account, you authorize us to access and act on your account in accordance with the permissions you grant. You are responsible for ensuring your use of automations complies with Instagram&apos;s Community Guidelines and Platform Policies. CBNchat is not affiliated with or endorsed by Meta Platforms, Inc.`,
  },
  {
    title: 'Acceptable Use',
    body: `You agree not to use CBNchat to send spam, harass users, spread misinformation, or violate any applicable laws. Automations must not be used to impersonate other individuals or organizations, scrape data without consent, or engage in any activity that violates Meta&apos;s terms. We reserve the right to suspend accounts that engage in abusive or fraudulent behavior without prior notice.`,
  },
  {
    title: 'Limitation of Liability',
    body: `CBNchat is provided on an "as is" and "as available" basis without warranties of any kind. We shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service, including loss of data, revenue, or ministry opportunity. Our maximum liability for any claim arising out of these terms is limited to the amount you paid us in the 12 months preceding the claim.`,
  },
  {
    title: 'Changes to Terms',
    body: `We may update these Terms of Service at any time. If we make material changes, we will notify you via email or a prominent notice on the platform at least 14 days before the changes take effect. Continued use of the service after the effective date constitutes acceptance of the revised terms.`,
  },
  {
    title: 'Contact',
    body: `If you have any questions about these Terms of Service, please contact our legal team at legal@cbnchat.com. You may also reach us by mail at CBN Indonesia, Jakarta, Indonesia. We aim to respond to all legal inquiries within 10 business days.`,
  },
]

export default function TermsPage() {
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
            <Link href="/privacy" className="text-slate-500 hover:text-teal-700 transition-colors">
              Privacy Policy
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
            Terms of Service
          </h1>
          <p className="text-sm text-slate-400">Last updated: April 2026</p>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Please read these Terms of Service carefully before using CBNchat. These terms govern your access to and use of our platform, services, and content.
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
            <a href="mailto:legal@cbnchat.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
