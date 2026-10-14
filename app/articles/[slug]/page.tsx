import { sanityClient } from '@/lib/sanity'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params

  const article = await sanityClient.fetch(
    `*[_type == "article" && slug.current == $slug][0] {
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

  return (
    <main style={{
      maxWidth: 760,
      margin: '0 auto',
      padding: '48px 24px',
      color: '#75263d'
    }}>
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
        <img
          src={article.imageUrl}
          alt={article.imageAlt || article.title}
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
