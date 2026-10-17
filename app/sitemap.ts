import type { MetadataRoute } from 'next'
import { clinicalSlugsQuery, sanityClient } from '@/lib/sanity'

const siteUrl = 'https://dr-asad-frost-website.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let clinical: Array<{ slug: string; updatedAt?: string }> = []
  try {
    clinical = await sanityClient.fetch(clinicalSlugsQuery)
  } catch {
    clinical = []
  }

  return [
    { url: siteUrl, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/clinical-world`, changeFrequency: 'weekly', priority: 0.8 },
    ...clinical.map((item) => ({
      url: `${siteUrl}/clinical-world/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
