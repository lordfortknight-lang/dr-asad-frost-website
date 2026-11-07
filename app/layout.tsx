import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const siteUrl = 'https://www.asadfrost.in'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Dr Asad Frost: Dentist, Writer & Creator',
  description: 'Essays, observations and ideas at the intersection of literature, science, culture and everyday life. A personal journal by Dr Asad Frost, dentist and writer.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Dr Asad Frost',
    title: 'Dr Asad Frost: Dentist, Writer & Creator',
    description: 'Essays, observations and ideas at the intersection of literature, science, culture and everyday life.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr Asad Frost: Dentist, Writer & Creator',
    description: 'Essays, observations and ideas at the intersection of literature, science, culture and everyday life.',
  },
  generator: 'Next.js',
  icons: {
    icon: [
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: siteUrl, name: 'Dr Asad Frost', inLanguage: 'en', publisher: { '@id': `${siteUrl}/#person` }, about: { '@id': `${siteUrl}/#person` } },
            { '@type': 'Person', '@id': `${siteUrl}/#person`, name: 'Dr Asad Frost', url: siteUrl },
          ],
        }) }} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
