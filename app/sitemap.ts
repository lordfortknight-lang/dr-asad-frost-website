import type { MetadataRoute } from 'next'
import {
  clinicalSlugsQuery,
  sanityClient,
  sitemapContentQuery,
} from '@/lib/sanity'

const siteUrl = 'https://www.asadfrost.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/newsroom`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/journal`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/books`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/magazine`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/achievements`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/milestones`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/recognition`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/contact`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${siteUrl}/biography`, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${siteUrl}/gallery`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/clinical-world`, changeFrequency: 'weekly', priority: 0.8 },
  ]

  const content = await sanityClient.fetch<Array<{
    _type: 'article' | 'book' | 'magazineIssue'
    slug?: string
    lastModified?: string
  }>>(sitemapContentQuery)
  const clinical = await sanityClient.fetch<Array<{ slug: string; updatedAt?: string }>>(clinicalSlugsQuery)
  const contentPaths = {
    article: 'articles',
    book: 'books',
    magazineIssue: 'magazine',
  } as const

  return [
    ...staticRoutes,
    ...content.flatMap((item) => {
      if (!item.slug) return []
      return {
        url: `${siteUrl}/${contentPaths[item._type]}/${item.slug}`,
        ...(item.lastModified ? { lastModified: item.lastModified } : {}),
        changeFrequency: 'monthly' as const,
        priority: item._type === 'article' ? 0.7 : 0.6,
      }
    }),
    ...clinical.map((item) => ({
      url: `${siteUrl}/clinical-world/${item.slug}`,
      ...(item.updatedAt ? { lastModified: item.updatedAt } : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
