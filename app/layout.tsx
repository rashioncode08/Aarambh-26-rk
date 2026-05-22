import './globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: "AARAMBH'26",
  description: "AARAMBH'26 — The ultimate convergence of technology, culture, and innovation.",
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#FF9A00',
}

import ConditionalLayout from '../components/layout/ConditionalLayout'

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
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-dark text-brand-cloud font-sans selection:bg-brand-pink selection:text-brand-cloud">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}
