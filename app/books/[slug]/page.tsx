import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { bookBySlugQuery, sanityClient } from '@/lib/sanity'

const siteUrl = 'https://www.asadfrost.in'

export const revalidate = 0

type Book = {
  title: string
  subtitle?: string
  author?: string
  description?: string
  slug?: { current: string }
  coverImage?: { asset?: { url?: string } }
  pdf?: { asset?: { url?: string; originalFilename?: string } }
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const book = await sanityClient.fetch<Book | null>(bookBySlugQuery, { slug })

  if (!book) return {}

  return {
    title: `${book.title} | Dr Asad Frost`,
    description: book.description || `Read ${book.title} by Dr Asad Frost.`,
    alternates: { canonical: `/books/${slug}` },
    openGraph: {
      type: 'article',
      url: `${siteUrl}/books/${slug}`,
      title: book.title,
      description: book.description || `Read ${book.title} by Dr Asad Frost.`,
      images: book.coverImage?.asset?.url ? [{ url: book.coverImage.asset.url, alt: book.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: book.title,
      description: book.description || `Read ${book.title} by Dr Asad Frost.`,
      images: book.coverImage?.asset?.url ? [book.coverImage.asset.url] : undefined,
    },
  }
}

export default async function BookDetailPage({ params }: Props) {
  const { slug } = await params
  const book = await sanityClient.fetch<Book | null>(bookBySlugQuery, { slug })

  if (!book) notFound()

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px', color: '#38201f' }}>
      <Link href="/books" style={{ color: '#815044' }}>
        ← Back to the library
      </Link>

      <div style={{ display: 'grid', gap: 28, marginTop: 32, alignItems: 'start' }}>
        {book.coverImage?.asset?.url && (
          <img
            src={book.coverImage.asset.url}
            alt={book.title}
            style={{ width: '100%', maxWidth: 420, borderRadius: 12, boxShadow: '0 18px 44px rgba(44, 28, 20, 0.12)' }}
          />
        )}

        <article>
          <p style={{ marginTop: 8, color: '#806d61', letterSpacing: 2, textTransform: 'uppercase' }}>
            Book
          </p>

          <h1 style={{ fontSize: 'clamp(34px, 6vw, 60px)', lineHeight: 1.08, margin: '12px 0 8px' }}>
            {book.title}
          </h1>

          {book.subtitle && (
            <p style={{ fontSize: 22, color: '#815044', marginBottom: 12 }}>{book.subtitle}</p>
          )}

          {book.author && <p style={{ color: '#5b433f', fontStyle: 'italic' }}>By {book.author}</p>}

          {book.description && (
            <p style={{ lineHeight: 1.9, marginTop: 20, fontSize: 18 }}>{book.description}</p>
          )}

          {book.pdf?.asset?.url && (
            <p style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <a href={book.pdf.asset.url} target="_blank" rel="noreferrer" style={{ color: '#815044' }}>
                Open PDF ↗
              </a>
              <a href={book.pdf.asset.url} download={book.pdf.asset.originalFilename || true} style={{ color: '#815044' }}>
                Download PDF ↓
              </a>
            </p>
          )}
        </article>
      </div>
    </main>
  )
}
