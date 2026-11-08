import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { publishedArticlesQuery, sanityClient } from '@/lib/sanity'

export const metadata: Metadata = {
  title: 'Journal | Dr Asad Frost',
  description: 'Essays, observations and ideas by Dr Asad Frost.',
  alternates: { canonical: '/journal' },
  openGraph: {
    type: 'website',
    url: 'https://www.asadfrost.in/journal',
    title: 'Journal | Dr Asad Frost',
    description: 'Essays, observations and ideas by Dr Asad Frost.',
  },
  twitter: {
    card: 'summary',
    title: 'Journal | Dr Asad Frost',
    description: 'Essays, observations and ideas by Dr Asad Frost.',
  },
}

type Article = {
  _id: string
  title: string
  excerpt?: string
  category?: string
  tags?: string[]
  author?: string
  publishedAt?: string
  slug?: { current: string }
  imageUrl?: string
  imageAlt?: string
}

async function getArticles(): Promise<Article[]> {
  const articles = await sanityClient.fetch<Array<Article & { image?: { asset?: { url?: string }; alt?: string } }>>(publishedArticlesQuery)
  return articles.map((article) => ({
    ...article,
    imageUrl: article.image?.asset?.url,
    imageAlt: article.image?.alt,
  }))
}

export const revalidate = 0

function formatDate(value?: string) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.valueOf())
    ? null
    : new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(date)
}

export default async function JournalPage() {
  const articles = await getArticles()

  return (
    <main className="min-h-screen bg-[#f8f4ed] px-5 py-12 text-[#402126] sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm font-medium text-[#8b5e3c] hover:underline">
          ← Back to Home
        </Link>

        <header className="mb-10 mt-8">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#a77b45]">
            The literary journal
          </p>
          <h1 className="font-serif text-4xl font-bold sm:text-5xl">Journal</h1>
          <p className="mt-4 max-w-2xl leading-7 text-[#715d58]">
            Essays, observations and ideas at the intersection of literature, science, culture and everyday life.
          </p>
          <Link href="/newsroom" className="mt-5 inline-block text-sm font-medium text-[#8b5e3c] hover:underline">
            Browse the searchable Newsroom archive →
          </Link>
        </header>

        {articles.length === 0 ? (
          <section className="rounded-2xl border border-[#e6d9c9] bg-white/70 p-8">
            <h2 className="text-xl font-semibold">The journal is being prepared</h2>
            <p className="mt-3 leading-7 text-[#715d58]">
              New essays will appear here once they are published in the website studio.
            </p>
          </section>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article key={article._id} className="overflow-hidden rounded-2xl border border-[#e6d9c9] bg-white shadow-sm">
                {article.imageUrl ? (
                  <Image
                    src={article.imageUrl}
                    alt={article.imageAlt || article.title}
                    width={800}
                    height={560}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-56 w-full object-cover"
                  />
                ) : null}
                <div className="p-6">
                  {article.category && (
                    <p className="text-xs uppercase tracking-[0.2em] text-[#a77b45]">{article.category}</p>
                  )}
                  <h2 className="mt-3 font-serif text-2xl font-semibold">
                    <Link href={`/articles/${article.slug?.current}`} className="hover:underline">{article.title}</Link>
                  </h2>
                  <p className="mt-2 text-sm text-[#8b5e3c]">
                    By {article.author || 'Dr Asad Frost'}
                    {formatDate(article.publishedAt) ? ` · ${formatDate(article.publishedAt)}` : ''}
                  </p>
                  {article.excerpt && <p className="mt-4 line-clamp-3 leading-7 text-[#715d58]">{article.excerpt}</p>}
                  {article.tags?.length ? (
                    <p className="mt-3 text-xs text-[#8b5e3c]">
                      {article.tags.join(' · ')}
                    </p>
                  ) : null}
                  <Link href={`/articles/${article.slug?.current}`} className="mt-6 inline-block rounded-full bg-[#652d36] px-5 py-3 text-sm font-medium text-white hover:bg-[#4c2028]">
                    Read essay
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
