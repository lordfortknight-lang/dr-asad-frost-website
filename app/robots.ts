import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.asadfrost.in'
  return {
    rules: [
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: '*', allow: '/', disallow: ['/api/', '/studio/'] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
