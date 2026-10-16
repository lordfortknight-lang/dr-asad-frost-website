
'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schema'

export default defineConfig({
  name: 'default',
  title: 'Dr Asad Frost',
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'n159dle8',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})
