import Link from 'next/link'
import { sanityClient, dentalCasesQuery } from '@/lib/sanity'
import DentalCaseCard from '@/components/dental-case-card'

export const revalidate = 60

type DentalCaseListItem = {
  _id: string
  title: string
  slug?: { current?: string }
  treatmentCategory?: string
  anonymizedSummary?: string
  publishedAt?: string
  image?: { asset?: { url?: string }; alt?: string }
}

export default async function DentalCasesPage() {
  const cases: DentalCaseListItem[] = await sanityClient.fetch(dentalCasesQuery)

  return (
    <main className="min-h-screen bg-[#f8f4ed] px-5 py-12 text-[#402126] sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm font-medium text-[#8b5e3c] hover:underline">← Back to Home</Link>

        <header className="mb-10 mt-8">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#a77b45]">Dental Casebook</p>
          <h1 className="text-4xl font-serif font-bold sm:text-5xl">Casebook — Clinical cases in restorative and aesthetic dentistry</h1>
          <p className="mt-4 max-w-2xl leading-7 text-[#715d58]">
            Cases presented with anonymised clinical summaries and before/after photographs. Only cases with documented consent are published.
          </p>
        </header>

        {cases.length === 0 ? (
          <section className="rounded-2xl border border-[#e6d9c9] bg-white/70 p-8">
            <h2 className="text-xl font-semibold">No published cases yet</h2>
            <p className="mt-3 leading-7 text-[#715d58]">Cases appear here once published in the site studio with documented patient consent.</p>
          </section>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((c) => (
              <DentalCaseCard
                key={c._id}
                id={c._id}
                title={c.title}
                slug={c.slug}
                treatmentCategory={c.treatmentCategory}
                excerpt={c.anonymizedSummary || ''}
                image={c.image}
              />
            ))}
          </div>
        )}

        <footer className="mt-16 border-t border-[#e6d9c9] pt-6 text-sm text-[#8b7770]">
          © {new Date().getFullYear()} · Dental Casebook
        </footer>
      </div>
    </main>
  )
}
