import './globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: {
    default: "AARAMBH'26 | JK Lakshmipat University",
    template: "%s | AARAMBH'26"
  },
  description: "Aarambh '26 is the ultimate convergence of technology, culture, and innovation. The signature first-year induction and pop-art festival at JK Lakshmipat University.",
  manifest: '/manifest.json',
  openGraph: {
    title: "AARAMBH'26 | JK Lakshmipat University",
    description: "Aarambh '26 is the ultimate convergence of technology, culture, and innovation. The signature first-year induction and pop-art festival at JK Lakshmipat University.",
    url: 'https://aarambh.jklu.edu.in',
    siteName: "Aarambh '26 Portal",
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "AARAMBH'26 | JK Lakshmipat University",
    description: "The signature first-year induction and pop-art festival at JK Lakshmipat University.",
  },
  robots: {
    index: true,
    follow: true,
  }
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
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&family=Outfit:wght@100..900&family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const ignoreErrors = [
                  'metamask',
                  'failed to connect to metamask',
                  'metamask extension not found',
                  'nkbihfbeogaeaoehlefnkodbefgpgknn',
                  'inpage.js'
                ];
                
                function shouldIgnore(errorMsg, errorStack, filename) {
                  const checkString = (str) => {
                    if (!str) return false;
                    return ignoreErrors.some(term => str.toLowerCase().includes(term));
                  };
                  return checkString(errorMsg) || checkString(errorStack) || checkString(filename);
                }

                window.addEventListener('error', function(event) {
                  try {
                    const msg = event.message || '';
                    const filename = event.filename || '';
                    const stack = (event.error && event.error.stack) || '';
                    if (shouldIgnore(msg, stack, filename)) {
                      event.stopImmediatePropagation();
                      event.preventDefault();
                      console.warn('Antigravity: Suppressed browser extension error:', msg);
                    }
                  } catch (e) {}
                }, true);

                window.addEventListener('unhandledrejection', function(event) {
                  try {
                    const reason = event.reason || '';
                    const msg = typeof reason === 'string' ? reason : (reason.message || '');
                    const stack = reason.stack || '';
                    if (shouldIgnore(msg, stack)) {
                      event.stopImmediatePropagation();
                      event.preventDefault();
                      console.warn('Antigravity: Suppressed browser extension promise rejection:', msg);
                    }
                  } catch (e) {}
                }, true);
              })();
            `
          }}
        />
      </head>
      <body className="antialiased bg-brand-cloud text-brand-cloud font-sans selection:bg-brand-pink selection:text-brand-cloud">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}
