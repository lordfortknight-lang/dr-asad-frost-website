import type { MetadataRoute } from 'next'
import { clinicalSlugsQuery, sanityClient } from '@/lib/sanity'

const siteUrl = 'https://www.asadfrost.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/journal`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/books`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/magazine`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/achievements`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/milestones`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/recognition`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/contact`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${siteUrl}/clinical-world`, changeFrequency: 'weekly', priority: 0.8 },
  ]

  try {
    const content = await sanityClient.fetch<Array<{ _type: string; slug?: { current?: string }; publishedAt?: string }>>(`*[
      _type in ["article", "magazineIssue"] &&
      defined(slug.current) &&
      !(_id in path("drafts.**"))
    ] { _type, slug, publishedAt }`)
    const clinical = await sanityClient.fetch<Array<{ slug: string; updatedAt?: string }>>(clinicalSlugsQuery)

    return [
      ...staticRoutes,
      ...content.filter((item) => item.slug?.current).map((item) => ({
        url: `${siteUrl}/${item._type === 'article' ? 'articles' : 'magazine'}/${item.slug!.current}`,
        ...(item.publishedAt ? { lastModified: new Date(item.publishedAt) } : {}),
        changeFrequency: 'monthly' as const,
        priority: item._type === 'article' ? 0.7 : 0.6,
      })),
      ...clinical.map((item) => ({
        url: `${siteUrl}/clinical-world/${item.slug}`,
        lastModified: item.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    ]
  } catch {
    return staticRoutes
  }
}
