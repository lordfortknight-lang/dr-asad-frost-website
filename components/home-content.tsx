import Link from 'next/link'
import { ArrowDown, ArrowUpRight, BookOpen, CircleArrowOutUpRight } from 'lucide-react'
import { sanityClient, contentQuery } from '@/lib/sanity'

type Article = {
  _id: string
  _type: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt?: string
  category?: string
  image?: {
    asset?: { url?: string }
    alt?: string
  }
}

export async function HomeContent() {
  let essays: Article[] = []

  try {
    essays = await sanityClient.fetch(contentQuery)
  } catch (error) {
    console.error('Sanity content fetch failed:', error)
  }

  const articles = essays.filter((item) => item._type === 'article')

  return (
    <>
      <main>
        <section className="hero section-pad">
          <div className="hero-kicker">
            <span className="eyebrow">Independent practice · 2024—25</span>
            <span className="hero-index">01 / 07</span>
          </div>
          <div className="hero-copy">
            <h1>Ideas for<br /><em>living</em> closely.</h1>
            <p className="hero-intro">
              Writing at the intersection of culture, memory, and the everyday.
              A collection of essays, research, and photographs by Dr Asad Frost.
            </p>
          </div>
          <div className="hero-bottom">
            <span className="scroll-label"><ArrowDown size={16} /> Scroll to explore</span>
            <span className="hero-note">London · Lahore · Everywhere</span>
          </div>
        </section>

        <section id="work" className="feature section-pad">
          <div className="section-heading">
            <span className="eyebrow">Selected work</span><span className="rule" />
          </div>
          <div className="feature-grid">
            <div className="feature-image">
              <img src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1600&q=85" alt="Open book beside a window" />
              <span className="image-caption">Reading room, Bloomsbury · 2024</span>
            </div>
            <div className="feature-copy">
              <span className="eyebrow">Featured essay · 08 min read</span>
              <h2>The world is<br /><em>still</em> legible.</h2>
              <p>A field guide to paying attention when everything is asking to be looked at. On books, benches, and the radical act of noticing.</p>
              <Link className="text-link" href="/#essays">Read the essay <ArrowUpRight size={16} /></Link>
            </div>
          </div>
        </section>

        <section id="essays" className="essays section-pad">
          <div className="section-heading">
            <span className="eyebrow">Essays & observations</span>
            <span className="eyebrow">{articles.length} published article{articles.length === 1 ? '' : 's'}</span>
          </div>

          <div className="essay-list">
            {articles.map((article, index) => (
              <article className="essay-card" key={article._id}>
                <div className="essay-meta">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span>{article.category || 'Article'}</span>
                </div>

                {article.image?.asset?.url && (
                  <div className="essay-photo">
                    <img
                      src={article.image.asset.url}
                      alt={article.image.alt || article.title}
                    />
                  </div>
                )}

                <h3>{article.title}</h3>
                <p>{article.excerpt || 'A reflection from the journal of Dr Asad Frost.'}</p>

                <Link href={`/articles/${article.slug.current}`} aria-label={`Read ${article.title}`}>
                  <CircleArrowOutUpRight size={22} />
                </Link>
              </article>
            ))}

            {articles.length === 0 && (
              <p>No published articles found yet. Publish an article in Sanity Studio to see it here.</p>
            )}
          </div>
        </section>

        <section className="statement section-pad">
          <div className="statement-mark">“</div>
          <blockquote>Attention is the beginning<br />of devotion.</blockquote>
          <p>— Mary Oliver</p>
        </section>

        <section id="about" className="about section-pad">
          <div className="section-heading">
            <span className="eyebrow">A little context</span><span className="rule" />
          </div>
          <div className="about-grid">
            <h2>Dr Asad<br /><em>Frost</em></h2>
            <div>
              <p className="large-copy">Writer, scholar, and observer working between the archive and the street. My practice asks how we make meaning from the ordinary.</p>
              <p>My work has appeared in independent journals and academic publications across literature, visual culture, and the humanities. I am currently writing a book about the places we remember incorrectly.</p>
              <Link className="text-link" href="/#contact">More about the practice <ArrowUpRight size={16} /></Link>
            </div>
          </div>
        </section>

        <section id="contact" className="contact section-pad">
          <span className="eyebrow">Correspondence</span>
          <h2>Have a thought<br />to <em>share?</em></h2>
          <a className="contact-email" href="mailto:hello@asadfrost.com">hello@asadfrost.com <ArrowUpRight size={20} /></a>
        </section>
      </main>
      <div className="mobile-bookmark"><BookOpen size={15} /> New writing, occasionally</div>
    </>
  )
      }
