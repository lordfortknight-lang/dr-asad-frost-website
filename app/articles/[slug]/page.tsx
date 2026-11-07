import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'
import { publishedArticlesQuery, sanityClient } from '@/lib/sanity'
import { notFound } from 'next/navigation'

const siteUrl = 'https://www.asadfrost.in'

export const revalidate = 0

type Article = {
  title: string
  excerpt?: string
  category?: string
  tags?: string[]
  author: string
  publishedAt?: string
  _updatedAt?: string
  imageUrl?: string
  imageAlt?: string
  body?: Array<{ _key?: string; _type: string; style?: string; children?: Array<{ text?: string }> }>
}

type Props = {
  params: Promise<{ slug: string }>
}

async function getArticle(slug: string): Promise<Article | null> {
  return sanityClient.fetch(
    `*[_type == "article" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
      _id,
      title,
      excerpt,
      category,
      tags,
      "author": coalesce(author, "Dr Asad Frost"),
      publishedAt,
      _updatedAt,
      "imageUrl": image.asset->url,
      "imageAlt": image.alt,
      body
    }`,
    { slug },
  )
}

function formatDate(value?: string) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.valueOf())
    ? null
    : new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return {}

  return {
    title: `${article.title} | Dr Asad Frost`,
    description: article.excerpt || `Read ${article.title} in the Dr Asad Frost archive.`,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      type: 'article',
      url: `${siteUrl}/articles/${slug}`,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      modifiedTime: article._updatedAt || article.publishedAt,
      authors: [article.author],
      images: article.imageUrl ? [{ url: article.imageUrl, alt: article.imageAlt || article.title }] : undefined,
    },
    twitter: {
      card: article.imageUrl ? 'summary_large_image' : 'summary',
      title: article.title,
      description: article.excerpt,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const candidates = await sanityClient.fetch<Array<{
    title: string
    slug?: { current?: string }
    category?: string
    tags?: string[]
    publishedAt?: string
  }>>(
    `*[_type == "article" && slug.current != $slug && defined(slug.current) && !(_id in path("drafts.**"))] {
      title, slug, category, tags, publishedAt
    }`,
    { slug },
  )
  const relatedArticles = candidates
    .map((candidate) => {
      const sharedTags = (article.tags || []).filter((tag) => candidate.tags?.includes(tag)).length
      const sameCategory = Boolean(article.category && candidate.category === article.category)
      return { ...candidate, relevance: sharedTags + (sameCategory ? 1 : 0) }
    })
    .filter((candidate) => candidate.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance || (b.publishedAt || '').localeCompare(a.publishedAt || ''))
    .slice(0, 3)

  const datePublished = formatDate(article.publishedAt)
  const dateModified = formatDate(article._updatedAt) || datePublished
  const keywords = Array.from(new Set([article.category, ...(article.tags || [])].filter(Boolean)))
  const articleSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${siteUrl}/articles/${slug}#article`,
        mainEntityOfPage: `${siteUrl}/articles/${slug}`,
        headline: article.title,
        description: article.excerpt,
        datePublished: article.publishedAt,
        dateModified: article._updatedAt || article.publishedAt,
        articleSection: article.category,
        keywords,
        author: {
          '@type': 'Person',
          '@id': article.author === 'Dr Asad Frost' ? `${siteUrl}/#person` : undefined,
          name: article.author,
        },
        image: article.imageUrl ? [article.imageUrl] : undefined,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Newsroom', item: `${siteUrl}/newsroom` },
          { '@type': 'ListItem', position: 3, name: article.title, item: `${siteUrl}/articles/${slug}` },
        ],
      },
    ],
  }

  return (
    <main style={{
      maxWidth: 760,
      margin: '0 auto',
      padding: '48px 24px',
      color: '#75263d'
    }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c') }} />
      <nav aria-label="Breadcrumb" style={{ fontSize: 14 }}>
        <Link href="/" style={{ color: 'inherit' }}>Home</Link>
        {' / '}
        <Link href="/newsroom" style={{ color: 'inherit' }}>Newsroom</Link>
        {' / '}
        <span aria-current="page">{article.title}</span>
      </nav>

      <p style={{ marginTop: 36 }}>
        {article.category || 'Journal'}
      </p>

      <h1 style={{
        fontSize: 'clamp(2.5rem, 7vw, 4rem)',
        lineHeight: 1.1
      }}>
        {article.title}
      </h1>

      {article.excerpt && (
        <p style={{ fontSize: 20, lineHeight: 1.7 }}>
          {article.excerpt}
        </p>
      )}

      <p style={{ marginTop: 20, fontSize: 14, lineHeight: 1.7 }}>
        By {article.author}
        {datePublished ? ` · Published ${datePublished}` : ' · Publication date not provided'}
        {dateModified && datePublished && dateModified !== datePublished ? ` · Updated ${dateModified}` : ''}
      </p>

      {article.imageUrl && (
        <Image
          src={article.imageUrl}
          alt={article.imageAlt || article.title}
          width={1200}
          height={800}
          sizes="(max-width: 760px) 100vw, 760px"
          style={{ width: '100%', height: 'auto', margin: '28px 0' }}
        />
      )}

      <div style={{ lineHeight: 1.9, fontSize: 18 }}>
        {article.body?.map((block, index) => {
          if (block._type !== 'block') return null

          const text = block.children
            ?.map((child) => child.text || '')
            .join('')

          if (block.style === 'h2') {
            return <h2 key={block._key || index}>{text}</h2>
          }

          return <p key={block._key || index}>{text}</p>
        })}
      </div>

      <p style={{ marginTop: 40 }}>— {article.author}</p>

      {relatedArticles.length > 0 && (
        <section aria-labelledby="related-articles-heading" style={{ marginTop: 56, borderTop: '1px solid #e6d9c9', paddingTop: 24 }}>
          <h2 id="related-articles-heading" style={{ fontSize: 24 }}>Related articles</h2>
          <ul style={{ display: 'grid', gap: 12, marginTop: 16, paddingLeft: 20 }}>
            {relatedArticles.map((related) => (
              <li key={related.slug?.current}>
                <Link href={`/articles/${related.slug?.current}`} style={{ color: 'inherit', textDecoration: 'underline' }}>
                  {related.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
