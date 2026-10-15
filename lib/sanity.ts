
import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "n159dle8",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: true,
});

export const contentQuery = `*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  mainImage {
    asset->{url}
  }
}`;

export const booksQuery = `*[_type == "book"] | order(title asc) {
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

export const magazinesQuery = `*[_type == "magazineIssue"] | order(publishedAt desc) {
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
