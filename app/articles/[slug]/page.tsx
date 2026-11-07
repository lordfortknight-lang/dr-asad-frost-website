import Image from 'next/image'
import type { Metadata } from 'next'
import { sanityClient } from '@/lib/sanity'
import { notFound } from 'next/navigation'

const siteUrl = 'https://www.asadfrost.in'

export const revalidate = 0

type Article = {
  title: string
  excerpt?: string
  category?: string
  publishedAt?: string
  imageUrl?: string
  imageAlt?: string
}

type Props = {
  params: Promise<{ slug: string }>
}

async function getArticle(slug: string): Promise<Article | null> {
  return sanityClient.fetch(
    `*[_type == "article" && slug.current == $slug && defined(publishedAt) && !(_id in path("drafts.**"))][0] {
      title,
      excerpt,
      category,
      publishedAt,
      "imageUrl": image.asset->url,
      "imageAlt": image.alt
    }`,
    { slug },
  )
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

  const article = await sanityClient.fetch(
    `*[_type == "article" && slug.current == $slug && defined(publishedAt) && !(_id in path("drafts.**"))][0] {
      title,
      excerpt,
      category,
      "imageUrl": image.asset->url,
      "imageAlt": image.alt,
      body
    }`,
    { slug }
  )

  if (!article) notFound()

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
        author: { '@id': `${siteUrl}/#person` },
        image: article.imageUrl ? [article.imageUrl] : undefined,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Articles', item: `${siteUrl}/newsroom` },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <a href="/" style={{ color: 'inherit' }}>← Back to home</a>

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
        {article.body?.map((block: any, index: number) => {
          if (block._type !== 'block') return null

          const text = block.children
            ?.map((child: any) => child.text || '')
            .join('')

          if (block.style === 'h2') {
            return <h2 key={block._key || index}>{text}</h2>
          }

          return <p key={block._key || index}>{text}</p>
        })}
      </div>

      <p style={{ marginTop: 40 }}>— Dr Asad Frost</p>
    </main>
  )
}
