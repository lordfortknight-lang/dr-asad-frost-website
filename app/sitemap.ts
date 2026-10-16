
import type { MetadataRoute } from 'next'
import { sanityClient } from '@/lib/sanity'

const siteUrl = 'https://www.asadfrost.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/journal`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/books`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/magazine`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/achievements`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/milestones`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/recognition`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  try {
    const content = await sanityClient.fetch<
      Array<{
        _type: string
        slug?: { current?: string }
        publishedAt?: string
      }>
    >(
      `*[
        _type in ["article", "magazineIssue"] &&
        defined(slug.current) &&
        !(_id in path("drafts.**"))
      ] {
        _type,
        slug,
        publishedAt
      }`
    )

    const contentRoutes: MetadataRoute.Sitemap = content
      .filter((item) => item.slug?.current)
      .map((item) => ({
        url: `${siteUrl}/${item._type === 'article' ? 'articles' : 'magazine'}/${item.slug!.current}`,
        ...(item.publishedAt
          ? { lastModified: new Date(item.publishedAt) }
          : {}),
        changeFrequency: 'monthly',
        priority: item._type === 'article' ? 0.7 : 0.6,
      }))

    return [...staticRoutes, ...contentRoutes]
  } catch {
    return staticRoutes
  }
}
