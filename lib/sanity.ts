import { createClient } from '@sanity/client'

export const sanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_DATASET
)

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'demo-project',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-02-01',
  useCdn: false,
  perspective: 'published',
})

export const contentQuery = `*[
  _type in ["article", "book", "photograph", "achievement"] &&
  defined(slug.current)
] | order(publishedAt desc) {
  _id,
  _type,
  title,
  slug,
  excerpt,
  publishedAt,
  category,
  tags,
  "image": image {
    "asset": asset->{
      url
    },
    alt
  },
  body
}`
