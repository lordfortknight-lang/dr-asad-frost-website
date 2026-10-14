import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export const sanityConfigured = Boolean(projectId && dataset)

export const sanityClient = createClient({
  projectId: projectId || 'n159dle8',
  dataset: dataset || 'production',
  apiVersion: '2026-10-14',
  useCdn: true,
  perspective: 'published',
})

const builder = imageUrlBuilder(sanityClient)
export const sanityImageUrl = (source: Image) => builder.image(source)

export const contentQuery = `*[_type in ["article", "book", "photograph", "achievement", "quotation"] && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc) {
  _id, _type, title, slug, excerpt, subtitle, description, publishedAt, category, tags, year, publisher,
  institution, location, takenAt, quote, image, body
}`

export async function getPublishedContent() {
  if (!sanityConfigured) return []
  return sanityClient.fetch(contentQuery, {}, { next: { revalidate: 60, tags: ['sanity-content'] } })
}

export async function getPublishedByType(type: string) {
  if (!sanityConfigured) return []
  return sanityClient.fetch(
    `*[_type == $type && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc) { _id, _type, title, slug, excerpt, subtitle, description, publishedAt, category, tags, year, publisher, institution, location, takenAt, quote, image, body }`,
    { type },
    { next: { revalidate: 60, tags: ['sanity-content'] } },
  )
}

export async function getPublishedBySlug(type: string, slug: string) {
  if (!sanityConfigured) return null
  return sanityClient.fetch(
    `*[_type == $type && slug.current == $slug][0] { _id, _type, title, slug, excerpt, subtitle, description, publishedAt, category, tags, year, publisher, institution, location, takenAt, quote, image, body }`,
    { type, slug },
    { next: { revalidate: 60, tags: ['sanity-content'] } },
  )
}
