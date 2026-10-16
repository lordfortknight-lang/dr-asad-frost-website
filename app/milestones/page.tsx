
import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteShell } from '@/components/site-shell'

export const metadata: Metadata = {
  title: 'Milestones | Dr Asad Frost',
  description:
    'Explore the personal, academic and professional milestones in the journey of Dr Asad Frost.',
}

export default function MilestonesPage() {
  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f8f4ed] px-5 py-16 text-[#402126] sm:px-10">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="text-sm text-[#8b5e3c] hover:underline"
          >
            ← Back to Home
          </Link>

          <header className="mb-12 mt-12">
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-[#a77b45]">
              A journey in progress
            </p>

            <h1 className="font-serif text-[clamp(2.2rem,9vw,4.5rem)] font-semibold leading-tight break-words">
              Milestones
              <br />
              <em>& moments.</em>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#715d58]">
              Every meaningful journey is shaped by moments of learning,
              growth and change. This page will document important
              milestones in the journey of Dr Asad Frost.
            </p>
          </header>

          <section className="border-t border-[#e6d9c9] py-10">
            <p className="text-sm uppercase tracking-[0.2em] text-[#a77b45]">
              The timeline
            </p>

            <h2 className="mt-4 font-serif text-3xl">
              The story continues.
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-[#715d58]">
              A chronological collection of meaningful moments,
              with dates and details, will be added here.
            </p>

            <p className="mt-6 text-sm text-[#8b5e3c]">
              Updates coming soon.
            </p>
          </section>
        </div>
      </main>
    </SiteShell>
  )
}
