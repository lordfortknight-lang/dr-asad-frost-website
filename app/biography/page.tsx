import type { Metadata } from 'next'

const siteUrl = 'https://www.asadfrost.in'

export const metadata: Metadata = {
  title: 'Biography | Dr Asad Frost',
  description: 'The verified biography of Dr Asad Frost, with professional details available for confirmation.',
  alternates: { canonical: '/biography' },
  openGraph: {
    type: 'profile',
    url: `${siteUrl}/biography`,
    title: 'Biography | Dr Asad Frost',
    description: 'The verified biography of Dr Asad Frost, with professional details available for confirmation.',
  },
  twitter: {
    card: 'summary',
    title: 'Biography | Dr Asad Frost',
    description: 'The verified biography of Dr Asad Frost, with professional details available for confirmation.',
  },
}

export default function BiographyPage() {
  const profileSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${siteUrl}/biography#profilepage`,
        url: `${siteUrl}/biography`,
        name: 'Biography | Dr Asad Frost',
        mainEntity: { '@id': `${siteUrl}/#person` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Biography', item: `${siteUrl}/biography` },
        ],
      },
    ],
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f7f1e8', color: '#4b1727', padding: 'clamp(2rem, 6vw, 6rem) 1.25rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }} />
      <article style={{ maxWidth: 760, margin: '0 auto' }}>
        <a href="/" style={{ color: 'inherit', fontFamily: 'monospace', fontSize: 13 }}>← Back home</a>
        <p style={{ marginTop: '4rem', fontFamily: 'monospace', fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: '#9a6b3f' }}>Profile</p>
        <h1 style={{ margin: '1rem 0 2rem', fontFamily: 'Georgia, serif', fontSize: 'clamp(3rem, 9vw, 7rem)', fontWeight: 400, lineHeight: .95 }}>Dr Asad Frost</h1>
        <p style={{ maxWidth: 620, fontFamily: 'Georgia, serif', fontSize: 'clamp(1.25rem, 2.5vw, 1.7rem)', lineHeight: 1.55 }}>A clinician by training, a writer by instinct, and a curious observer of the world.</p>
        <section aria-labelledby="verified-details" style={{ marginTop: '4rem', borderTop: '1px solid #cbb9a7', paddingTop: '1.5rem' }}>
          <h2 id="verified-details" style={{ fontFamily: 'monospace', fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase' }}>Professional details</h2>
          <p style={{ lineHeight: 1.8 }}>Additional credentials, registration details, affiliations, awards, publications and experience will be added after they are verified directly by Dr Asad Frost.</p>
          <ul style={{ lineHeight: 2, paddingLeft: '1.25rem' }}>
            <li>[Verified degree and institution — pending confirmation]</li>
            <li>[Verified registration details — pending confirmation]</li>
            <li>[Verified affiliations and experience — pending confirmation]</li>
          </ul>
        </section>
        <section aria-labelledby="editorial-work" style={{ marginTop: '3rem', borderTop: '1px solid #cbb9a7', paddingTop: '1.5rem' }}>
          <h2 id="editorial-work" style={{ fontFamily: 'monospace', fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase' }}>Editorial work</h2>
          <p style={{ lineHeight: 1.8 }}>Explore the <a href="/journal" style={{ color: 'inherit' }}>Journal</a> and <a href="/newsroom" style={{ color: 'inherit' }}>Newsroom</a> for published writing and observations.</p>
        </section>
      </article>
    </main>
  )
}
