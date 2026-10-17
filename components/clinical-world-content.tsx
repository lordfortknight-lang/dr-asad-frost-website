import Link from 'next/link'
import { ArrowUpRight, BookOpen } from 'lucide-react'
import { clinicalWorldQuery, sanityClient } from '@/lib/sanity'

type ClinicalItem = { _id: string; title: string; slug?: { current: string }; excerpt?: string; category?: string; specialty?: string; author?: string; publishedAt?: string; image?: { asset?: { url?: string }; alt?: string } }

export async function ClinicalWorldContent({ searchParams }: { searchParams: Promise<{ category?: string; specialty?: string; q?: string }> }) {
  const params = await searchParams
  let items: ClinicalItem[] = []
  try { items = await sanityClient.fetch(clinicalWorldQuery, { category: params.category || null, specialty: params.specialty || null, search: params.q || '' }) } catch (error) { console.error('Clinical World fetch failed:', error) }
  const categories = ['Clinical article', 'Case history', 'Dental case study', 'Case report', 'Treatment outcome', 'Clinical research']
  return <main className="clinical-page section-pad">
    <header className="clinical-hero">
      <span className="eyebrow">Dental knowledge, carefully shared</span>
      <h1>Clinical <em>World.</em></h1>
      <p>Evidence-informed articles, anonymised case histories and reflections on dental care from the clinic.</p>
      <small>Educational material only. It does not replace an individual dental assessment or establish a dentist-patient relationship.</small>
    </header>
    <div className="clinical-toolbar">
      <div className="clinical-filters"><Link className={!params.category ? 'is-active' : ''} href="/clinical-world">All</Link>{categories.map((category) => <Link key={category} className={params.category === category ? 'is-active' : ''} href={`/clinical-world?category=${encodeURIComponent(category)}`}>{category}</Link>)}</div>
      <form className="clinical-search"><label htmlFor="clinical-search">Search</label><input id="clinical-search" name="q" defaultValue={params.q} placeholder="Search clinical work" /><button type="submit">Find</button></form>
    </div>
    {!items.length && <div className="clinical-empty"><BookOpen size={18} /><p>No published clinical work matches this view. New material will appear here after it is reviewed and published in Sanity Studio.</p></div>}
    {items.length > 0 && <div className="clinical-grid">{items.map((item) => <article className="clinical-card" key={`${item._id}-copy`}><div className="clinical-card-meta"><span>{item.category || 'Clinical work'}</span>{item.specialty && <span>{item.specialty}</span>}</div><h2><Link href={`/clinical-world/${item.slug?.current}`}>{item.title}</Link></h2>{item.excerpt && <p>{item.excerpt}</p>}<div className="clinical-card-footer"><span>{item.author || 'Dr Asad Frost'}</span><Link href={`/clinical-world/${item.slug?.current}`} aria-label={`Read ${item.title}`}>Read case <ArrowUpRight size={15} /></Link></div></article>)}</div>}
    <footer className="clinical-disclaimer">Clinical outcomes vary between patients. Case details and images should only be published with documented consent, anonymisation, and compliance with applicable privacy and professional regulations.</footer>
  </main>
}
