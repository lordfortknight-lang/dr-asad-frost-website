
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
  _type in ["article", "book", "photograph", "achievement", "magazineIssue"] &&
  defined(slug.current)
] | order(publishedAt desc) {
  _id,
  _type,
  title,
  slug,
  subtitle,
  publisher,
  year,
  issueNumber,
  description,
  excerpt,
  publishedAt,
  category,
  tags,
  "image": image {
    "asset": asset->{
      url
    },
    alt,
    caption
  },
  "pdf": pdf.asset->{
    url,
    originalFilename,
    size,
    mimeType
  },
  body
}`

export const booksQuery = `*[
  _type == "book" &&
  defined(title) &&
  defined(slug.current)
] | order(year desc, title asc) {
  _id,
  title,
  slug,
  subtitle,
  publisher,
  year,
  description,
  tags,
  "image": image {
    "asset": asset->{
      url
    },
    alt,
    caption
  },
  "pdf": pdf.asset->{
    url,
    originalFilename,
    size,
    mimeType
  }
}`

export const magazinesQuery = `*[
  _type == "magazineIssue" &&
  defined(title) &&
  defined(slug.current)
] | order(publishedAt desc) {
  _id,
  title,
  slug,
  issueNumber,
  publishedAt,
  description,
  tags,
  "image": image {
    "asset": asset->{
      url
    },
    alt,
    caption
  },
  "pdf": pdf.asset->{
    url,
    originalFilename,
    size,
    mimeType
  }
}`

export const bookBySlugQuery = `*[
  _type == "book" &&
  slug.current == $slug
][0] {
  _id,
  title,
  slug,
  subtitle,
  publisher,
  year,
  description,
  tags,
  "image": image {
    "asset": asset->{
      url
    },
    alt,
    caption
  },
  "pdf": pdf.asset->{
    url,
    originalFilename,
    size,
    mimeType
  }
}`

export const magazineBySlugQuery = `*[
  _type == "magazineIssue" &&
  slug.current == $slug
][0] {
  _id,
  title,
  slug,
  issueNumber,
  publishedAt,
  description,
  tags,
  "image": image {
    "asset": asset->{
      url
    },
    alt,
    caption
  },
  "pdf": pdf.asset->{
    url,
    originalFilename,
    size,
    mimeType
  }
}`
