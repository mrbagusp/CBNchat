import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CBNchat — Instagram Automation for Christian Media',
  description: 'Automate Instagram comments and DMs, capture CRM leads, and build multi-step flows.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white text-slate-900`}>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
