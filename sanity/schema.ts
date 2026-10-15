
import type { SchemaTypeDefinition } from 'sanity'

const slug = {
  name: 'slug',
  title: 'Slug',
  type: 'slug',
  options: { source: 'title', maxLength: 96 },
  validation: (Rule: any) => Rule.required(),
}

const image = {
  name: 'image',
  title: 'Image / Cover',
  type: 'image',
  options: { hotspot: true },
  fields: [
    { name: 'caption', type: 'string', title: 'Caption' },
    {
      name: 'alt',
      type: 'string',
      title: 'Alt text',
      validation: (Rule: any) => Rule.required(),
    },
  ],
}

const pdfFile = {
  name: 'pdf',
  title: 'PDF file',
  type: 'file',
  options: { accept: 'application/pdf' },
}

const tags = {
  name: 'tags',
  title: 'Tags',
  type: 'array',
  of: [{ type: 'string' }],
  options: { layout: 'tags' },
}

export const schemaTypes: SchemaTypeDefinition[] = [
  {
    name: 'article',
    title: 'Article / Essay',
    type: 'document',
    fields: [
      { name: 'title', type: 'string', validation: (Rule: any) => Rule.required() },
      slug,
      { name: 'excerpt', type: 'text', rows: 3 },
      { name: 'category', type: 'string' },
      tags,
      image,
      {
        name: 'body',
        type: 'array',
        of: [{ type: 'block' }, { type: 'image' }],
      },
      { name: 'publishedAt', type: 'datetime' },
    ],
  },
  {
    name: 'book',
    title: 'Book / Publication',
    type: 'document',
    fields: [
      { name: 'title', type: 'string', validation: (Rule: any) => Rule.required() },
      slug,
      { name: 'subtitle', type: 'string' },
      { name: 'publisher', type: 'string' },
      { name: 'year', type: 'number' },
      { name: 'description', type: 'text' },
      image,
      pdfFile,
      { name: 'isbn', type: 'string', title: 'ISBN (optional)' },
      tags,
    ],
  },
  {
    name: 'magazineIssue',
    title: 'Magazine Issue',
    type: 'document',
    fields: [
      { name: 'title', type: 'string', title: 'Issue title', validation: (Rule: any) => Rule.required() },
      slug,
      { name: 'issueNumber', type: 'string', title: 'Issue / Volume number' },
      { name: 'publishedAt', type: 'date', title: 'Publication date' },
      { name: 'description', type: 'text', title: 'Introduction / Description' },
      image,
      {
        ...pdfFile,
        validation: (Rule: any) => Rule.required(),
      },
      tags,
    ],
    orderings: [
      {
        title: 'Publication date, newest first',
        name: 'publishedAtDesc',
        by: [{ field: 'publishedAt', direction: 'desc' }],
      },
    ],
  },
  {
    name: 'photograph',
    title: 'Photograph',
    type: 'document',
    fields: [
      { name: 'title', type: 'string' },
      slug,
      image,
      { name: 'location', type: 'string' },
      { name: 'takenAt', type: 'date' },
      { name: 'quote', type: 'text' },
      tags,
    ],
  },
  {
    name: 'achievement',
    title: 'Academic achievement',
    type: 'document',
    fields: [
      { name: 'title', type: 'string', validation: (Rule: any) => Rule.required() },
      { name: 'institution', type: 'string' },
      { name: 'year', type: 'number' },
      { name: 'description', type: 'text' },
      image,
    ],
  },
]
