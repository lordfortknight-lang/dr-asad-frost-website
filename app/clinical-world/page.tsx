import type { Metadata } from 'next'
import { ClinicalWorldContent } from '@/components/clinical-world-content'

export const metadata: Metadata = { title: 'Clinical World — Dr Asad Frost', description: 'Educational clinical articles, anonymised dental case histories, and evidence-informed discussions.', alternates: { canonical: '/clinical-world' }, openGraph: { type: 'website', url: 'https://www.asadfrost.in/clinical-world', title: 'Clinical World — Dr Asad Frost', description: 'Educational clinical articles, anonymised dental case histories, and evidence-informed discussions.' }, twitter: { card: 'summary', title: 'Clinical World — Dr Asad Frost', description: 'Educational clinical articles, anonymised dental case histories, and evidence-informed discussions.' } }
export default async function ClinicalWorldPage({ searchParams }: { searchParams: Promise<{ category?: string; specialty?: string; q?: string }> }) { return <ClinicalWorldContent searchParams={searchParams} /> }
