import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ClinicalDetailContent } from '@/components/clinical-detail-content'
import { clinicalBySlugQuery, sanityClient } from '@/lib/sanity'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const item = await sanityClient.fetch(clinicalBySlugQuery, { slug }); if (!item) return {}; return { title: `${item.title} — Clinical World`, description: item.excerpt || 'Clinical World by Dr Asad Frost', alternates: { canonical: `/clinical-world/${slug}` }, robots: { index: true, follow: true } } }
export default async function ClinicalDetailPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const item = await sanityClient.fetch(clinicalBySlugQuery, { slug }); if (!item) notFound(); return <ClinicalDetailContent slug={slug} /> }
