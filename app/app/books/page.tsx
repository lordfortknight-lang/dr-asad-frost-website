
import Link from 'next/link'
import { sanityClient } from '@/lib/sanity'

export const revalidate = 60

type Book = {
  _id: string
  title: string
  subtitle?: string
  publisher?: string
  year?: number
  description?: string
  slug?: { current: string }
  image?: { asset?: { url?: string }; alt?: string }
  pdf?: { asset?: { url?: string } }
}

const booksQuery = `*[_type == "book" && defined(slug.current)] | order(title asc) {
  _id, title, subtitle, publisher, year, description, slug,
  "image": image { "asset": asset->{url}, alt },
  "pdf": pdf { "asset": asset->{url} }
}`

export default async function BooksPage() {
  const books: Book[] = await sanityClient.fetch(booksQuery)

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px', color: '#38201f' }}>
      <Link href="/" style={{ color: '#815044' }}>← Home</Link>
      <p style={{ letterSpacing: 3, marginTop: 36 }}>THE LIBRARY</p>
      <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', margin: '12px 0' }}>Books & Publications</h1>
      <p style={{ lineHeight: 1.8, maxWidth: 650 }}>
        Explore books and publications. Read available PDFs online or download them for free.
      </p>

      {books.length === 0 ? (
        <p style={{ marginTop: 40 }}>Books will appear here once published in the library.</p>
      ) : (
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 28, marginTop: 40 }}>
          {books.map((book) => (
            <article key={book._id} style={{ border: '1px solid #e6d9ca', padding: 20, borderRadius: 8 }}>
              {book.image?.asset?.url && (
                <img
                  src={book.image.asset.url}
                  alt={book.image.alt || book.title}
                  style={{ width: '100%', height: 240, objectFit: 'cover', marginBottom: 20 }}
                />
              )}
              <h2 style={{ fontSize: 24 }}>{book.title}</h2>
              {book.subtitle && <p>{book.subtitle}</p>}
              <p style={{ color: '#806d61' }}>{[book.publisher, book.year].filter(Boolean).join(' · ')}</p>
              {book.description && <p style={{ lineHeight: 1.7 }}>{book.description}</p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 20 }}>
                {book.slug?.current && (
                  <Link href={`/books/${book.slug.current}`} style={{ color: '#815044' }}>Read book →</Link>
                )}
                {book.pdf?.asset?.url && (
                  <a href={book.pdf.asset.url} target="_blank" rel="noreferrer" style={{ color: '#815044' }}>Download PDF ↓</a>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
