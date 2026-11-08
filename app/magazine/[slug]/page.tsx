import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { magazineBySlugQuery, sanityClient } from '@/lib/sanity'

const siteUrl = 'https://www.asadfrost.in'

export const revalidate = 0

type Magazine = {
  title: string
  slug?: { current?: string }
  issueNumber?: string
  publishedAt?: string
  _updatedAt?: string
  description?: string
  tags?: string[]
  image?: { asset?: { url?: string }; alt?: string; caption?: string }
  pdf?: { url?: string; originalFilename?: string }
}

type Props = {
  params: Promise<{ slug: string }>
}

const getMagazine = cache((slug: string) =>
  sanityClient.fetch<Magazine | null>(magazineBySlugQuery, { slug }),
)

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const magazine = await getMagazine(slug)
  if (!magazine) return {}

  const canonicalSlug = magazine.slug?.current || slug
  const description = magazine.description || `Read ${magazine.title} in the Dr Asad Frost magazine archive.`
  const imageUrl = magazine.image?.asset?.url

  return {
    title: `${magazine.title} | Dr Asad Frost`,
    description,
    alternates: { canonical: `/magazine/${canonicalSlug}` },
    openGraph: {
      type: 'article',
      url: `${siteUrl}/magazine/${canonicalSlug}`,
      title: magazine.title,
      description,
      ...(magazine.publishedAt ? { publishedTime: magazine.publishedAt } : {}),
      ...(magazine._updatedAt ? { modifiedTime: magazine._updatedAt } : {}),
      ...(imageUrl
        ? { images: [{ url: imageUrl, alt: magazine.image?.alt || magazine.title }] }
        : {}),
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title: magazine.title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  }
}

export default async function MagazineDetailPage({ params }: Props) {
  const { slug } = await params
  const magazine = await getMagazine(slug)
  if (!magazine) notFound()

  const canonicalSlug = magazine.slug?.current || slug
  const pageUrl = `${siteUrl}/magazine/${canonicalSlug}`
  const imageUrl = magazine.image?.asset?.url
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: magazine.title,
        ...(magazine.description ? { description: magazine.description } : {}),
        ...(magazine.publishedAt ? { datePublished: magazine.publishedAt } : {}),
        ...(magazine._updatedAt ? { dateModified: magazine._updatedAt } : {}),
        isPartOf: { '@id': `${siteUrl}/#website` },
        ...(imageUrl
          ? {
              primaryImageOfPage: {
                '@type': 'ImageObject',
                url: imageUrl,
                ...(magazine.image?.alt ? { description: magazine.image.alt } : {}),
                ...(magazine.image?.caption ? { caption: magazine.image.caption } : {}),
              },
            }
          : {}),
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Magazine', item: `${siteUrl}/magazine` },
          { '@type': 'ListItem', position: 3, name: magazine.title, item: pageUrl },
        ],
      },
    ],
  }

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px', color: '#38201f' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <nav aria-label="Breadcrumb">
        <Link href="/" style={{ color: '#815044' }}>Home</Link>
        {' / '}
        <Link href="/magazine" style={{ color: '#815044' }}>Magazine</Link>
        {' / '}
        <span aria-current="page">{magazine.title}</span>
      </nav>

      <Link href="/magazine" style={{ color: '#815044' }}>
        ← All Magazine Issues
      </Link>

      {(magazine.issueNumber || formatDate(magazine.publishedAt)) && (
        <p style={{ marginTop: 36, color: '#806d61' }}>
          {[magazine.issueNumber, formatDate(magazine.publishedAt)].filter(Boolean).join(' · ')}
        </p>
      )}

      <h1 style={{ fontSize: 'clamp(34px, 6vw, 60px)' }}>
        {magazine.title}
      </h1>

      {magazine.description && (
        <p style={{ lineHeight: 1.8 }}>{magazine.description}</p>
      )}

      {magazine.tags?.length ? (
        <p style={{ fontSize: 14, color: '#806d61' }}>
          {magazine.tags.join(' · ')}
        </p>
      ) : null}

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
