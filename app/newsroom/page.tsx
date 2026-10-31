import type { Metadata } from 'next'
import { sanityClient } from '@/lib/sanity'
import { Newsroom } from '@/components/newsroom/newsroom'

export const metadata: Metadata = {
  title: 'Newsroom | Dr Asad Frost',
  description: 'A considered editorial archive of essays, observations and ideas by Dr Asad Frost.',
  alternates: { canonical: '/newsroom' },
}

export const revalidate = 0

type SanityImage = {
  asset?: { url?: string }
  alt?: string
}

type Article = {
  _id: string
  title: string
  slug?: { current?: string }
  excerpt?: string
  category?: string
  tags?: string[]
  publishedAt?: string
  image?: SanityImage
  body?: unknown[]
}

async function getArticles(): Promise<Article[]> {
  try {
    return await sanityClient.fetch(`
      *[_type == "article" && defined(slug.current) && !(_id in path("drafts.**"))]
        | order(publishedAt desc, _createdAt desc) {
          _id, title, slug, excerpt, category, tags, publishedAt,
          "image": image { asset->{url}, alt }, body
        }
    `)
  } catch {
    return []
  }
}

export default async function NewsroomPage() {
  const articles = await getArticles()
  return <Newsroom articles={articles} />
}
