import type { Metadata } from 'next'
import { publishedArticlesQuery, sanityClient } from '@/lib/sanity'
import { Newsroom } from '@/components/newsroom/newsroom'

export const metadata: Metadata = {
  title: 'Newsroom | Dr Asad Frost',
  description: 'A considered editorial archive of essays, observations and ideas by Dr Asad Frost.',
  alternates: { canonical: '/newsroom' },
  openGraph: {
    type: 'website',
    url: 'https://www.asadfrost.in/newsroom',
    title: 'Newsroom | Dr Asad Frost',
    description: 'A considered editorial archive of essays, observations and ideas by Dr Asad Frost.',
  },
  twitter: {
    card: 'summary',
    title: 'Newsroom | Dr Asad Frost',
    description: 'A considered editorial archive of essays, observations and ideas by Dr Asad Frost.',
  },
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
  author?: string
  publishedAt?: string
  _updatedAt?: string
  image?: SanityImage
  body?: unknown[]
}

async function getArticles(): Promise<Article[]> {
  return sanityClient.fetch(publishedArticlesQuery)
}

export default async function NewsroomPage() {
  const articles = await getArticles()
  return <Newsroom articles={articles} />
}
