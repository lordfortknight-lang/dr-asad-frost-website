import Link from 'next/link'
import { ArrowDown, ArrowUpRight, BookOpen, CircleArrowOutUpRight } from 'lucide-react'
import { getPublishedByType, sanityImageUrl } from '@/lib/sanity'

export async function HomeContent() {
  const essays = await getPublishedByType('article')
  return <>
    <main>
      <section className="hero section-pad">
        <div className="hero-kicker"><span className="eyebrow">Independent practice · 2024—25</span><span className="hero-index">01 / 07</span></div>
        <div className="hero-copy"><h1>Ideas for<br /><em>living</em> closely.</h1><p className="hero-intro">Writing at the intersection of culture, memory, and the everyday. A collection of essays, research, and photographs by Dr Asad Frost.</p></div>
        <div className="hero-bottom"><span className="scroll-label"><ArrowDown size={16} /> Scroll to explore</span><span className="hero-note">London · Lahore · Everywhere</span></div>
      </section>

      <section id="work" className="feature section-pad"><div className="section-heading"><span className="eyebrow">Selected work</span><span className="rule" /></div><div className="feature-grid"><div className="feature-image"><img src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1600&q=85" alt="Open book beside a window" /><span className="image-caption">Reading room, Bloomsbury · 2024</span></div><div className="feature-copy"><span className="eyebrow">Featured essay · 08 min read</span><h2>The world is<br /><em>still</em> legible.</h2><p>A field guide to paying attention when everything is asking to be looked at. On books, benches, and the radical act of noticing.</p><Link className="text-link" href="/#essays">Read the essay <ArrowUpRight size={16} /></Link></div></div></section>

      <section id="essays" className="essays section-pad"><div className="section-heading"><span className="eyebrow">Essays & observations</span><Link className="text-link" href="/#essays">View all <ArrowUpRight size={16} /></Link></div><div className="essay-list">{essays.length ? essays.map((essay, index) => <article className="essay-card" key={essay._id}><div className="essay-meta"><span>{String(index + 1).padStart(2, '0')}</span><span>{essay.category || 'Essay'}{essay.publishedAt ? ` / ${new Date(essay.publishedAt).getFullYear()}` : ''}</span></div><div className="essay-photo">{essay.image ? <img src={sanityImageUrl(essay.image).width(1200).url()} alt={essay.image.alt || essay.title} /> : null}</div><h3>{essay.title}</h3><p>{essay.excerpt || 'Read the latest published essay.'}</p><Link href={`/articles/${essay.slug.current}`} aria-label={`Read ${essay.title}`}><CircleArrowOutUpRight size={22} /></Link></article>) : <p className="empty-state">No published essays yet. Publish your first article in Sanity Studio to see it here.</p>}</div></section>

      <section className="statement section-pad"><div className="statement-mark">“</div><blockquote>Attention is the beginning<br />of devotion.</blockquote><p>— Mary Oliver</p></section>

      <section id="about" className="about section-pad"><div className="section-heading"><span className="eyebrow">A little context</span><span className="rule" /></div><div className="about-grid"><h2>Dr Asad<br /><em>Frost</em></h2><div><p className="large-copy">Writer, scholar, and observer working between the archive and the street. My practice asks how we make meaning from the ordinary.</p><p>My work has appeared in independent journals and academic publications across literature, visual culture, and the humanities. I am currently writing a book about the places we remember incorrectly.</p><Link className="text-link" href="/#contact">More about the practice <ArrowUpRight size={16} /></Link></div></div></section>

      <section id="contact" className="contact section-pad"><span className="eyebrow">Correspondence</span><h2>Have a thought<br />to <em>share?</em></h2><a className="contact-email" href="mailto:hello@as frost.com">hello@asadfrost.com <ArrowUpRight size={20} /></a></section>
    </main>
    <div className="mobile-bookmark"><BookOpen size={15} /> New writing, occasionally</div>
  </>
}
