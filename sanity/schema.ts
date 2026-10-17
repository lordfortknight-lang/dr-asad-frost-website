
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
    name: 'patientStory',
    title: 'Dental patient story',
    type: 'document',
    fields: [
      { name: 'title', type: 'string', title: 'Case title', validation: (Rule: any) => Rule.required() },
      { name: 'caseType', type: 'string', title: 'Case type', options: { list: ['Case history', 'Patient testimonial', 'Clinical work'] } },
      { name: 'summary', type: 'text', rows: 3, title: 'Short summary' },
      { name: 'details', type: 'text', rows: 6, title: 'Case history / patient words' },
      { name: 'treatment', type: 'string', title: 'Treatment area' },
      { name: 'patientLabel', type: 'string', title: 'Patient label', description: 'Use an anonymous label only, such as “Patient A” or “Adult patient”.' },
      image,
      { name: 'consentConfirmed', type: 'boolean', title: 'Consent confirmed', validation: (Rule: any) => Rule.required() },
      { name: 'publishedAt', type: 'date', title: 'Publication date' },
    ],
    orderings: [
      { title: 'Publication date, newest first', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
    ],
  },
  {
    name: 'clinicalContent',
    title: 'Clinical World content',
    type: 'document',
    fields: [
      { name: 'title', type: 'string', validation: (Rule: any) => Rule.required() },
      slug,
      { name: 'excerpt', type: 'text', rows: 3, title: 'Abstract / excerpt' },
      { name: 'category', type: 'string', title: 'Category', options: { list: ['Clinical article', 'Case history', 'Dental case study', 'Case report', 'Treatment outcome', 'Clinical research'] }, validation: (Rule: any) => Rule.required() },
      { name: 'specialty', type: 'string', title: 'Dental specialty' },
      { name: 'author', type: 'string', title: 'Author / contributor' },
      image,
      { name: 'publishedAt', type: 'datetime', title: 'Publication date' },
      { name: 'updatedAt', type: 'datetime', title: 'Last updated' },
      { name: 'featured', type: 'boolean', title: 'Feature on Clinical World' },
      tags,
      { name: 'body', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
      { name: 'caseIdentifier', type: 'string', title: 'Anonymous case identifier' },
      { name: 'chiefComplaint', type: 'text', rows: 4 },
      { name: 'history', type: 'text', rows: 5, title: 'History of presenting illness' },
      { name: 'medicalHistory', type: 'text', rows: 4, title: 'Relevant medical and dental history' },
      { name: 'examination', type: 'text', rows: 5, title: 'Clinical examination' },
      { name: 'investigations', type: 'text', rows: 5 },
      { name: 'differentialDiagnosis', type: 'text', rows: 4 },
      { name: 'diagnosis', type: 'text', rows: 4, title: 'Final diagnosis' },
      { name: 'treatmentObjectives', type: 'text', rows: 4 },
      { name: 'treatmentPlan', type: 'text', rows: 5 },
      { name: 'treatmentStages', type: 'text', rows: 6, title: 'Procedure / treatment stages' },
      { name: 'materials', type: 'text', rows: 3, title: 'Materials used' },
      { name: 'outcome', type: 'text', rows: 5 },
      { name: 'followUp', type: 'text', rows: 4 },
      { name: 'discussion', type: 'array', of: [{ type: 'block' }] },
      { name: 'learningPoints', type: 'array', of: [{ type: 'string' }] },
      { name: 'references', type: 'array', of: [{ type: 'string' }] },
      { name: 'consentConfirmed', type: 'boolean', title: 'Documented consent confirmed', description: 'Confirm documented consent and anonymisation before publishing clinical details or photographs.', validation: (Rule: any) => Rule.custom((value: any, context: any) => context.document?.category === 'Clinical article' || value === true ? true : 'Required before publishing a case.') },
    ],
    orderings: [{ title: 'Publication date, newest first', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
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
