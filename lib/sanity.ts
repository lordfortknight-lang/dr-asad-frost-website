
import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "n159dle8",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  // Read the published dataset directly so production reflects publishes without waiting for the CDN cache.
  useCdn: false,
  perspective: "published",
});

export const contentQuery = `*[
  _type in ["article", "achievement"] &&
  defined(slug.current) &&
  !(_id in path("drafts.**"))
] | order(publishedAt desc, _createdAt desc) {
  _id,
  _type,
  title,
  slug,
  excerpt,
  description,
  publishedAt,
  category,
  institution,
  year,
  tags,
  "image": coalesce(
    image {
      asset->{url},
      alt
    },
    mainImage {
      asset->{url},
      alt
    }
  )
}`;

export const booksQuery = `*[_type == "book" && !(_id in path("drafts.**"))] | order(title asc) {
  _id,
  title,
  subtitle,
  author,
  description,
  slug,
  coverImage {
    asset->{url}
  },
  pdf {
    asset->{url, originalFilename, size, mimeType}
  }
}`;

export const magazinesQuery = `*[_type == "magazineIssue" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
  _id,
  title,
  subtitle,
  description,
  publishedAt,
  slug,
  coverImage {
    asset->{url}
  },
  pdf {
    asset->{url, originalFilename, size, mimeType}
  }
}`;

export const bookBySlugQuery = `*[_type == "book" && slug.current == $slug][0] {
  _id,
  title,
  subtitle,
  author,
  description,
  slug,
  coverImage {
    asset->{url}
  },
  pdf {
    asset->{url, originalFilename, size, mimeType}
  }
}`;

export const magazineBySlugQuery = `*[_type == "magazineIssue" && slug.current == $slug][0] {
  _id,
  title,
  subtitle,
  description,
  publishedAt,
  slug,
  coverImage {
    asset->{url}
  },
  pdf {
    asset->{url, originalFilename, size, mimeType}
  }
}`;

export const patientStoriesQuery = `*[
  _type == "patientStory" &&
  consentConfirmed == true &&
  !(_id in path("drafts.**"))
] | order(publishedAt desc, _createdAt desc) {
  _id,
  title,
  caseType,
  summary,
  details,
  treatment,
  patientLabel,
  publishedAt,
  "image": image {
    asset->{url},
    alt
  }
}`;

export const clinicalWorldQuery = `*[_type == "clinicalContent" && !(_id in path("drafts.**")) && defined(slug.current) && (category == $category || !defined($category)) && (specialty == $specialty || !defined($specialty)) && consentConfirmed == true && (title match $search || excerpt match $search || tags[] match $search || $search == "")] | order(featured desc, publishedAt desc, _createdAt desc) {
  _id, title, slug, excerpt, category, specialty, author, publishedAt, updatedAt, featured, tags,
  "image": image { asset->{url}, alt, caption }
}`;

export const clinicalBySlugQuery = `*[_type == "clinicalContent" && slug.current == $slug && !(_id in path("drafts.**")) && consentConfirmed == true][0] {
  ..., "image": image { asset->{url}, alt, caption },
  "related": *[_type == "clinicalContent" && slug.current != $slug && category == ^.category && consentConfirmed == true && !(_id in path("drafts.**"))][0...3] { title, slug, category, excerpt }
}`;

export const clinicalSlugsQuery = `*[_type == "clinicalContent" && consentConfirmed == true && !(_id in path("drafts.**")) && defined(slug.current)] { "slug": slug.current, "updatedAt": coalesce(updatedAt, publishedAt, _updatedAt) }`

export const achievementsQuery = `*[
  _type == "achievement" &&
  !(_id in path("drafts.**"))
] | order(year desc, _createdAt desc) {
  _id,
  _type,
  title,
  institution,
  year,
  description,
  "image": image {
    asset->{url},
    alt
  }
}`;
