import Link from 'next/link'
import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanity'

export const revalidate = 60

type Magazine = {
  title: string
  issueNumber?: string
  publishedAt?: string
  description?: string
  pdf?: { url?: string; originalFilename?: string }
}

const magazineQuery = `*[_type == "magazineIssue" && slug.current == $slug][0] {
  title, issueNumber, publishedAt, description,
  "pdf": pdf.asset->{url, originalFilename}
}`

export default async function MagazineDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const magazine: Magazine | null = await sanityClient.fetch(
    magazineQuery,
    { slug }
  )

  if (!magazine) notFound()

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px', color: '#38201f' }}>
      <Link href="/magazine" style={{ color: '#815044' }}>
        ← All Magazine Issues
      </Link>

      <p style={{ marginTop: 36, color: '#806d61' }}>
        {magazine.issueNumber || 'MAGAZINE'}
        {magazine.publishedAt && ` · ${magazine.publishedAt}`}
      </p>

      <h1 style={{ fontSize: 'clamp(34px, 6vw, 60px)' }}>
        {magazine.title}
      </h1>

      {magazine.description && (
        <p style={{ lineHeight: 1.8 }}>{magazine.description}</p>
      )}

      {magazine.pdf?.url ? (
        <>
          <p style={{ margin: '24px 0' }}>
            <a
              href={magazine.pdf.url}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#815044', marginRight: 20 }}
            >
              Open PDF ↗
            </a>

            <a
              href={magazine.pdf.url}
              download
              style={{ color: '#815044' }}
            >
              Download PDF ↓
            </a>
          </p>

          <iframe
            src={`${magazine.pdf.url}#toolbar=1`}
            title={magazine.title}
            style={{
              width: '100%',
              height: '75vh',
              border: '1px solid #e6d9ca',
              borderRadius: 8,
            }}
          />
        </>
      ) : (
        <p>Magazine PDF is not available yet.</p>
      )}
    </main>
  )
}
