
import type { Metadata } from 'next'
import Link from 'next/link'
import { magazinesQuery, sanityClient } from '@/lib/sanity'

export const metadata: Metadata = {
  title: 'Magazine | Dr Asad Frost',
  description: 'Magazine issues and editorial projects by Dr Asad Frost.',
  alternates: { canonical: '/magazine' },
  openGraph: {
    type: 'website',
    url: 'https://www.asadfrost.in/magazine',
    title: 'Magazine | Dr Asad Frost',
    description: 'Magazine issues and editorial projects by Dr Asad Frost.',
  },
  twitter: {
    card: 'summary',
    title: 'Magazine | Dr Asad Frost',
    description: 'Magazine issues and editorial projects by Dr Asad Frost.',
  },
}

export const revalidate = 0

type Magazine = {
  _id: string
  title: string
  issueNumber?: string
  publishedAt?: string
  tags?: string[]
  description?: string
  slug?: { current: string }
  image?: { asset?: { url?: string }; alt?: string }
  pdf?: { asset?: { url?: string } }
}

function formatDate(value?: string) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.valueOf())
    ? null
    : new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(date)
}

export default async function MagazinePage() {
  const magazines: Magazine[] = await sanityClient.fetch(magazinesQuery)

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px', color: '#38201f' }}>
      <Link href="/" style={{ color: '#815044' }}>← Home</Link>

      <p style={{ letterSpacing: 3, marginTop: 36 }}>THE JOURNAL</p>
      <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', margin: '12px 0' }}>
        Magazine
      </h1>
      <p style={{ lineHeight: 1.8, maxWidth: 650 }}>
        Read each issue online or download the PDF to explore it at your own pace.
      </p>

      {magazines.length === 0 ? (
        <p style={{ marginTop: 40 }}>
          The first magazine issue will appear here once published.
        </p>
      ) : (
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 28, marginTop: 40 }}>
          {magazines.map((magazine) => (
            <article key={magazine._id} style={{ border: '1px solid #e6d9ca', padding: 20, borderRadius: 8 }}>
              {magazine.image?.asset?.url && (
                <img
                  src={magazine.image.asset.url}
                  alt={magazine.image.alt || magazine.title}
                  style={{ width: '100%', height: 280, objectFit: 'cover', marginBottom: 20 }}
                />
              )}

              {(magazine.issueNumber || formatDate(magazine.publishedAt)) && (
                <p style={{ color: '#806d61' }}>
                  {[magazine.issueNumber, formatDate(magazine.publishedAt)].filter(Boolean).join(' · ')}
                </p>
              )}

              <h2 style={{ fontSize: 25 }}>{magazine.title}</h2>

              {magazine.description && (
                <p style={{ lineHeight: 1.7 }}>{magazine.description}</p>
              )}

              {magazine.tags?.length ? (
                <p style={{ fontSize: 14, color: '#806d61' }}>
                  {magazine.tags.join(' · ')}
                </p>
              ) : null}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 20 }}>
                {magazine.slug?.current && (
                  <Link href={`/magazine/${magazine.slug.current}`} style={{ color: '#815044' }}>
                    Read issue →
                  </Link>
                )}
                {magazine.pdf?.asset?.url && (
                  <a href={magazine.pdf.asset.url} target="_blank" rel="noreferrer" style={{ color: '#815044' }}>
                    Open PDF ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
