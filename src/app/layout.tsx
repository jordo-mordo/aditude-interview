import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'PublisherHub',
  description: 'Multi-tenant publisher management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans">
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center gap-2.5 px-4 py-3">
            <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-80">
              <span className="avatar h-8 w-8 text-sm from-indigo-500 to-violet-500" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </span>
              <span className="text-base font-bold tracking-tight text-slate-900">
                Publisher<span className="text-indigo-600">Hub</span>
              </span>
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">{children}</main>
      </body>
    </html>
  )
}
