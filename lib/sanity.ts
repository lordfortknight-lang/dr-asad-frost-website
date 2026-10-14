export const contentQuery = `*[_type in ["article", "book", "photograph", "achievement"] && defined(slug.current)] | order(publishedAt desc) {
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
