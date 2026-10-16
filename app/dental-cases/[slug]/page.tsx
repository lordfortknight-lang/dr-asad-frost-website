import { sanityClient, dentalCaseBySlugQuery } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DentalCaseBeforeAfter } from '@/components/dental-case-before-after'

export const revalidate = 60

export default async function DentalCasePage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const dentalCase = await sanityClient.fetch(dentalCaseBySlugQuery, { slug })

  if (!dentalCase) return notFound()

  return (
    <main className="min-h-screen bg-[#f8f4ed] px-5 py-12 text-[#402126] sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/dental-cases" className="text-sm font-medium text-[#8b5e3c] hover:underline">← Back to Cases</Link>

        <header className="mb-8 mt-6">
          <h1 className="text-4xl font-serif font-bold">{dentalCase.title}</h1>
          {dentalCase.treatmentCategory && <p className="mt-2 text-sm text-[#8b5e3c]">{dentalCase.treatmentCategory}</p>}
          {dentalCase.anonymizedSummary && <p className="mt-4 text-[#715d58]">{dentalCase.anonymizedSummary}</p>}
        </header>

        { (dentalCase.beforePhotos?.length || dentalCase.afterPhotos?.length) ? (
          <DentalCaseBeforeAfter before={dentalCase.beforePhotos} after={dentalCase.afterPhotos} />
        ) : null }

        <section className="mt-8 space-y-6">
          {dentalCase.findings && (
            <div>
              <h2 className="text-xl font-semibold">Findings</h2>
              <p className="mt-2 text-[#715d58]">{dentalCase.findings}</p>
            </div>
          )}

          {dentalCase.diagnosis && (
            <div>
              <h2 className="text-xl font-semibold">Diagnosis</h2>
              <p className="mt-2 text-[#715d58]">{dentalCase.diagnosis}</p>
            </div>
          )}

          {dentalCase.treatmentPlan && (
            <div>
              <h2 className="text-xl font-semibold">Treatment plan</h2>
              <p className="mt-2 text-[#715d58]">{dentalCase.treatmentPlan}</p>
            </div>
          )}

          {dentalCase.procedure && (
            <div>
              <h2 className="text-xl font-semibold">Procedure</h2>
              <pre className="mt-2 whitespace-pre-wrap text-[#715d58]">{JSON.stringify(dentalCase.procedure, null, 2)}</pre>
            </div>
          )}

          {dentalCase.outcome && (
            <div>
              <h2 className="text-xl font-semibold">Outcome</h2>
              <p className="mt-2 text-[#715d58]">{dentalCase.outcome}</p>
            </div>
          )}

          {dentalCase.followUp && (
            <div>
              <h2 className="text-xl font-semibold">Follow-up</h2>
              <p className="mt-2 text-[#715d58]">{dentalCase.followUp}</p>
            </div>
          )}
        </section>

        <footer className="mt-12 border-t border-[#e6d9c9] pt-6 text-sm text-[#8b7770]">
          Published: {dentalCase.publishedAt ? new Date(dentalCase.publishedAt).toLocaleDateString() : '—'}
        </footer>
      </div>
    </main>
  )
}
