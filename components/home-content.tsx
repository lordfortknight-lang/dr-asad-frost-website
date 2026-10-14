
import Link from 'next/link'
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Feather,
} from 'lucide-react'
import { sanityClient, contentQuery } from '@/lib/sanity'

type Article = {
  _id: string
  _type: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt?: string
  category?: string
  tags?: string[]
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

  const articles = essays.filter(
    (item) => item._type === 'article' && item.slug?.current
  )

  const featuredArticle = articles[0]
  const otherArticles = articles.slice(1)

  return (
    <>
      <main className="site-shell">
        {/* HERO */}
        <section className="hero section-pad">
          <div className="hero-kicker">
            <span className="eyebrow">
              Writer · Scholar · Observer
            </span>
            <span className="hero-index">AN ONGOING JOURNAL</span>
          </div>

          <div className="hero-copy">
            <p className="eyebrow" style={{ marginBottom: 24 }}>
              Welcome to my corner of the world
            </p>

            <h1>
              A life of
              <br />
              <em>paying</em> attention.
            </h1>

            <p className="hero-intro">
              Essays, observations and ideas at the intersection of
              literature, science, culture and the everyday. A personal
              archive by Dr Asad Frost.
            </p>

            <Link className="text-link" href="/#essays">
              Explore the journal <ArrowDown size={16} />
            </Link>
          </div>

          <div className="hero-bottom">
            <span className="scroll-label">
              <Feather size={15} /> Notes from a curious mind
            </span>
            <span className="hero-note">Read slowly. Think deeply.</span>
          </div>
        </section>

        {/* FEATURED WRITING */}
        <section id="work" className="feature section-pad">
          <div className="section-heading">
            <span className="eyebrow">A note from the journal</span>
            <span className="rule" />
          </div>

          <div className="feature-grid">
            <div className="feature-image">
              {featuredArticle?.image?.asset?.url ? (
                <img
                  src={featuredArticle.image.asset.url}
                  alt={
                    featuredArticle.image.alt || featuredArticle.title
                  }
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=85"
                  alt="An open notebook and pen on a writing desk"
                />
              )}

              <span className="image-caption">
                Thoughts, notes & observations
              </span>
            </div>

            <div className="feature-copy">
              <span className="eyebrow">
                {featuredArticle ? 'Latest writing' : 'The journal'}
              </span>

              <h2>
                Words for
                <br />
                the <em>in-between.</em>
              </h2>

              <p>
                A space for the questions that stay with us, the details
                we almost overlook, and the ideas that deserve more than
                a passing glance.
              </p>

              {featuredArticle ? (
                <Link
                  className="text-link"
                  href={`/articles/${featuredArticle.slug.current}`}
                >
                  Read the latest: {featuredArticle.title}
                  <ArrowUpRight size={16} />
                </Link>
              ) : (
                <Link className="text-link" href="/#essays">
                  Discover the journal <ArrowUpRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* JOURNAL */}
        <section id="essays" className="essays section-pad">
          <div className="section-heading">
            <div>
              <span className="eyebrow">The literary journal</span>
              <h2
                style={{
                  fontSize: 'clamp(2.7rem, 6vw, 5.5rem)',
                  lineHeight: 0.95,
                  margin: '18px 0 0',
                }}
              >
                Ideas worth
                <br />
                <em>sitting with.</em>
              </h2>
            </div>

            <span className="eyebrow">
              {articles.length} published
            </span>
          </div>

          {articles.length > 0 ? (
            <div className="essay-list">
              {articles.map((article, index) => (
                <article className="essay-card" key={article._id}>
                  <div className="essay-meta">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span>{article.category || 'Journal'}</span>
                  </div>

                  {article.image?.asset?.url && (
                    <Link
                      className="essay-photo"
                      href={`/articles/${article.slug.current}`}
                      aria-label={`Read ${article.title}`}
                    >
                      <img
                        src={article.image.asset.url}
                        alt={article.image.alt || article.title}
                        loading="lazy"
                      />
                    </Link>
                  )}

                  <h3>
                    <Link href={`/articles/${article.slug.current}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p>
                    {article.excerpt ||
                      'An essay, an observation, a thought worth exploring.'}
                  </p>

                  <Link
                    className="text-link"
                    href={`/articles/${article.slug.current}`}
                    aria-label={`Read ${article.title}`}
                  >
                    Read essay <ArrowUpRight size={16} />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div style={{ padding: '28px 0', maxWidth: 520 }}>
              <p>
                Every journal begins with a first page. New writing will
                appear here once an article is published in the studio.
              </p>
              <Link className="text-link" href="/studio">
                Open the writing studio <ArrowUpRight size={16} />
              </Link>
            </div>
          )}
        </section>

        {/* PERSONAL PHILOSOPHY */}
        <section className="statement section-pad">
          <div className="statement-mark">“</div>

          <blockquote>
            The world reveals itself
            <br />
            to those who <em>notice.</em>
          </blockquote>

          <p>A thought to return to.</p>
        </section>

        {/* ABOUT THE AUTHOR */}
        <section id="about" className="about section-pad">
          <div className="section-heading">
            <span className="eyebrow">The person behind the pages</span>
            <span className="rule" />
          </div>

          <div className="about-grid">
            <div>
              <span className="eyebrow">A little about me</span>
              <h2 style={{ marginTop: 25 }}>
                Dr Asad
                <br />
                <em>Frost.</em>
              </h2>
            </div>

            <div>
              <p className="large-copy">
                A clinician by training, a writer by instinct, and a
                student of the world by choice.
              </p>

              <p>
                This is my personal space for exploring ideas, recording
                observations and connecting seemingly different worlds.
                From science and dentistry to literature, culture and
                everyday life, I believe curiosity makes room for better
                questions.
              </p>

              <Link className="text-link" href="/#essays">
                Explore my writing <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="contact section-pad">
          <span className="eyebrow">Correspondence · Open to conversation</span>

          <h2>
            Have a thought
            <br />
            to <em>share?</em>
          </h2>

          <p className="contact-intro">
            For thoughtful conversations, writing, collaborations and
            ideas worth exploring.
          </p>

          <div className="contact-links">
            <a
              className="contact-button whatsapp-button"
              href="https://wa.me/919548686051"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp <ArrowUpRight size={17} />
            </a>

            <a
              className="contact-button email-button"
              href="mailto:myselfasadfrost@gmail.com"
            >
              Email me <ArrowUpRight size={17} />
            </a>

            <a
              className="contact-button instagram-button"
              href="https://www.instagram.com/asad_frost/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram <ArrowUpRight size={17} />
            </a>
          </div>

          <a
            className="contact-email"
            href="mailto:myselfasadfrost@gmail.com"
          >
            myselfasadfrost@gmail.com <ArrowUpRight size={20} />
          </a>
        </section>
      </main>

      <div className="mobile-bookmark">
        <BookOpen size={15} /> New writing, occasionally
      </div>
    </>
  )
}
