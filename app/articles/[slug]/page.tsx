import Image from 'next/image'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { notFound } from 'next/navigation'
import {
  articleBySlugQuery,
  relatedArticlesQuery,
  sanityClient,
} from '@/lib/sanity'

const siteUrl = 'https://www.asadfrost.in'

export const revalidate = 0

type Article = {
  title: string
  slug?: { current?: string }
  excerpt?: string
  category?: string
  tags?: string[]
  author: string
  publishedAt?: string
  _updatedAt?: string
  image?: {
    asset?: { url?: string }
    alt?: string
    caption?: string
  }
  body?: unknown[]
}

type RelatedArticle = {
  title: string
  slug?: { current?: string }
}

type Props = {
  params: Promise<{ slug: string }>
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

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => value?.asset?.url ? (
      <figure style={{ margin: '28px 0' }}>
        <Image
          src={value.asset.url}
          alt={value.alt || ''}
          width={1200}
          height={800}
          sizes="(max-width: 760px) 100vw, 760px"
          style={{ width: '100%', height: 'auto' }}
        />
        {value.caption && (
          <figcaption style={{ marginTop: 8, fontSize: 14 }}>
            {value.caption}
          </figcaption>
        )}
      </figure>
    ) : null,
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await sanityClient.fetch<Article | null>(articleBySlugQuery, { slug })
  if (!article) return {}

  const canonicalSlug = article.slug?.current || slug
  const articleUrl = `${siteUrl}/articles/${canonicalSlug}`
  const description = article.excerpt || `Read ${article.title} in the Dr Asad Frost archive.`
  const imageUrl = article.image?.asset?.url

  return {
    title: `${article.title} | Dr Asad Frost`,
    description,
    alternates: { canonical: `/articles/${canonicalSlug}` },
    openGraph: {
      type: 'article',
      url: articleUrl,
      title: article.title,
      description,
      ...(article.publishedAt ? { publishedTime: article.publishedAt } : {}),
      ...(article._updatedAt ? { modifiedTime: article._updatedAt } : {}),
      authors: [article.author],
      ...(imageUrl
        ? { images: [{ url: imageUrl, alt: article.image?.alt || article.title }] }
        : {}),
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title: article.title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await sanityClient.fetch<Article | null>(articleBySlugQuery, { slug })
  if (!article) notFound()

  const canonicalSlug = article.slug?.current || slug
  const articleUrl = `${siteUrl}/articles/${canonicalSlug}`
  const articleId = `${articleUrl}#article`
  const webpageId = `${articleUrl}#webpage`
  const breadcrumbId = `${articleUrl}#breadcrumb`
  const relatedArticles = article.category || article.tags?.length
    ? await sanityClient.fetch<RelatedArticle[]>(relatedArticlesQuery, {
        slug: canonicalSlug,
        category: article.category || null,
        tags: article.tags || [],
      })
    : []
  const datePublished = formatDate(article.publishedAt)
  const dateModified = formatDate(article._updatedAt)
  const keywords = Array.from(new Set([
    ...(article.category ? [article.category] : []),
    ...(article.tags || []),
  ]))
  const imageUrl = article.image?.asset?.url
  const articleSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': articleId,
        mainEntityOfPage: { '@id': webpageId },
        headline: article.title,
        ...(article.excerpt ? { description: article.excerpt } : {}),
        ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
        ...(article._updatedAt ? { dateModified: article._updatedAt } : {}),
        ...(article.category ? { articleSection: article.category } : {}),
        ...(keywords.length ? { keywords } : {}),
        author: article.author === 'Dr Asad Frost'
          ? { '@id': `${siteUrl}/#person` }
          : { '@type': 'Person', name: article.author },
        ...(imageUrl
          ? {
              image: [{
                '@type': 'ImageObject',
                url: imageUrl,
                ...(article.image?.alt ? { description: article.image.alt } : {}),
                ...(article.image?.caption ? { caption: article.image.caption } : {}),
              }],
            }
          : {}),
      },
      {
        '@type': 'WebPage',
        '@id': webpageId,
        url: articleUrl,
        name: article.title,
        ...(article.excerpt ? { description: article.excerpt } : {}),
        isPartOf: { '@id': `${siteUrl}/#website` },
        mainEntity: { '@id': articleId },
        breadcrumb: { '@id': breadcrumbId },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Journal', item: `${siteUrl}/journal` },
          { '@type': 'ListItem', position: 3, name: article.title, item: articleUrl },
        ],
      },
    ],
  }

  return (
    <main style={{
      maxWidth: 760,
      margin: '0 auto',
      padding: '48px 24px',
      color: '#75263d',
    }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c'),
        }}
      />
      <nav aria-label="Breadcrumb" style={{ fontSize: 14 }}>
        <Link href="/" style={{ color: 'inherit' }}>Home</Link>
        {' / '}
        <Link href="/journal" style={{ color: 'inherit' }}>Journal</Link>
        {' / '}
        <span aria-current="page">{article.title}</span>
      </nav>

      {article.category && (
        <p style={{ marginTop: 36 }}>{article.category}</p>
      )}

      <h1 style={{
        fontSize: 'clamp(2.5rem, 7vw, 4rem)',
        lineHeight: 1.1,
      }}>
        {article.title}
      </h1>

      {article.excerpt && (
        <p style={{ fontSize: 20, lineHeight: 1.7 }}>
          {article.excerpt}
        </p>
      )}

      <p style={{ marginTop: 20, fontSize: 14, lineHeight: 1.7 }}>
        {article.author === 'Dr Asad Frost'
          ? <Link href="/biography" style={{ color: 'inherit' }}>By {article.author}</Link>
          : `By ${article.author}`}
        {datePublished ? ` · Published ${datePublished}` : ''}
        {dateModified && datePublished && dateModified !== datePublished
          ? ` · Updated ${dateModified}`
          : ''}
      </p>

      {article.tags?.length ? (
        <ul aria-label="Article tags" style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px 16px',
          listStyle: 'none',
          margin: '16px 0 0',
          padding: 0,
          fontSize: 14,
        }}>
          {article.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      ) : null}

      {imageUrl && (
        <Image
          src={imageUrl}
          alt={article.image?.alt || article.title}
          width={1200}
          height={800}
          sizes="(max-width: 760px) 100vw, 760px"
          style={{ width: '100%', height: 'auto', margin: '28px 0' }}
        />
      )}

      {article.body?.length ? (
        <div style={{ lineHeight: 1.9, fontSize: 18 }}>
          <PortableText value={article.body as never} components={portableTextComponents} />
        </div>
      ) : null}

      <nav aria-label="Editorial archives" style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        marginTop: 40,
        fontSize: 14,
      }}>
        <Link href="/journal" style={{ color: 'inherit' }}>More from the Journal</Link>
        <Link href="/newsroom" style={{ color: 'inherit' }}>Browse the Newsroom</Link>
      </nav>

      {relatedArticles.length > 0 && (
        <section aria-labelledby="related-articles-heading" style={{
          marginTop: 40,
          borderTop: '1px solid #e6d9c9',
          paddingTop: 24,
        }}>
          <h2 id="related-articles-heading" style={{ fontSize: 24 }}>Related articles</h2>
          <ul style={{ display: 'grid', gap: 12, marginTop: 16, paddingLeft: 20 }}>
            {relatedArticles.map((related) => related.slug?.current ? (
              <li key={related.slug.current}>
                <Link
                  href={`/articles/${related.slug.current}`}
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                >
                  {related.title}
                </Link>
              </li>
            ) : null)}
          </ul>
        </section>
      )}
    </main>
  )
}
