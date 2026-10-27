
import Link from 'next/link'
import { Marquee } from '@/components/marquee'
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
} from 'lucide-react'
import {
  sanityClient,
  contentQuery,
  achievementsQuery,
  patientStoriesQuery,
} from '@/lib/sanity'

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

type Achievement = {
  _id: string
  title: string
  institution?: string
  year?: number | string
  description?: string
  image?: {
    asset?: { url?: string }
    alt?: string
  }
}

type PatientStory = {
  _id: string
  title: string
  caseType?: string
  summary?: string
  details?: string
  treatment?: string
  patientLabel?: string
  image?: {
    asset?: { url?: string }
    alt?: string
  }
}

function SocialIcon({
  type,
}: {
  type: 'whatsapp' | 'email' | 'instagram' | 'x'
}) {
  if (type === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M20.52 3.48A11.87 11.87 0 0 0 12.07 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.16 1.6 5.98L.05 24l6.25-1.64a11.9 11.9 0 0 0 5.76 1.47h.01C18.65 23.83 24 18.48 24 11.91a11.84 11.84 0 0 0-3.48-8.43ZM12.07 21.8a9.9 9.9 0 0 1-5.05-1.39l-.36-.21-3.71.97.99-3.62-.24-.37a9.88 9.88 0 1 1 8.37 4.62Zm5.42-7.4c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.2-.24-.57-.49-.49-.67-.5h-.57c-.2 0-.52.08-.8.38-.27.3-1.04 1.01-1.04 2.47s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.48.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
      </svg>
    )
  }

  if (type === 'email') {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    )
  }

  if (type === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.4L5.57 22H2.43l7.25-8.29L1.8 2h6.4l4.43 6.77L18.9 2Zm-1.1 18h1.73L7.27 3.88H5.42L17.8 20Z" />
    </svg>
  )
}

export async function HomeContent() {
  let essays: Article[] = []
  let achievements: Achievement[] = []
  let patientStories: PatientStory[] = []

  try {
    essays = await sanityClient.fetch(contentQuery)
  } catch (error) {
    console.error('Sanity content fetch failed:', error)
  }

  try {
    achievements = await sanityClient.fetch(achievementsQuery)
  } catch (error) {
    console.error('Sanity achievements fetch failed:', error)
  }

  try {
    patientStories = await sanityClient.fetch(patientStoriesQuery)
  } catch (error) {
    console.error('Sanity patient stories fetch failed:', error)
  }

  const articles = essays.filter(
    (item) => item._type === 'article' && item.slug?.current
  )

  const featuredArticle = articles[0]
  const otherArticles = articles.slice(1)

  return (
    <>
      <main className="site-shell">
        <section className="hero section-pad">
          <div className="hero-kicker">
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
              literature, science, culture and everyday life. A personal
              archive by Dr Asad Frost.
            </p>
            <Link className="text-link" href="/#essays">
              Explore the journal <ArrowDown size={16} />
            </Link>
          </div>

          <Marquee
            words={[
              'Dentistry',
              'Poetry',
              'Literature',
              'Essays',
              'Financial markets',
              'Clinical stories',
              'The art of observation',
              'Notes from a curious mind',
              'Read slowly',
              'Think deeply',
            ]}
          />
        </section>

        <section id="explore" className="explore section-pad">
          <div className="section-heading">
            <div>
              <span className="eyebrow">A considered archive</span>
              <h2 className="explore-title">Explore my <em>work.</em></h2>
            </div>
            <span className="eyebrow explore-supporting-label">Six ways in</span>
          </div>
          <div className="explore-grid">
            {[
              ['01', 'Journal', 'Essays, observations and notes.', '/journal'],
              ['02', 'Essays', 'Longer thoughts to sit with.', '/journal'],
              ['03', 'Books', 'A growing reading room.', '/books'],
              ['04', 'Magazine', 'Issues made for slow reading.', '/magazine'],
              ['05', 'Achievements', 'Milestones and recognition.', '/#achievements'],
              ['06', 'Patient work', 'Dental case histories and voices.', '/#patient-work'],
            ].map(([number, title, description, href]) => (
              <Link className="explore-card" href={href} key={title}>
                <span className="explore-number">{number}</span>
                <span className="explore-card-title">{title}</span>
                <span className="explore-description">{description}</span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        <section id="work" className="feature section-pad">
          <div className="section-heading">
            <span className="eyebrow">Featured writing</span>
            <span className="rule" />
          </div>

          <div className="feature-grid">
            <div className="feature-image">
              {featuredArticle?.image?.asset?.url ? (
                <img
                  src={featuredArticle.image.asset.url}
                  alt={featuredArticle.image.alt || featuredArticle.title}
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
                {featuredArticle
                  ? featuredArticle.category || 'Latest journal entry'
                  : 'The literary journal'}
              </span>

              <h2>
                {featuredArticle?.title || (
                  <>
                    Words for
                    <br />
                    the <em>in-between.</em>
                  </>
                )}
              </h2>

              <p>
                {featuredArticle?.excerpt ||
                  'A space for the questions that stay with us, the details we almost overlook, and the ideas that deserve more than a passing glance.'}
              </p>

              {featuredArticle && (
                <Link
                  className="text-link"
                  href={`/articles/${featuredArticle.slug.current}`}
                >
                  Read featured article <ArrowUpRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </section>

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
            <span className="eyebrow">{articles.length} published</span>
          </div>

          {otherArticles.length > 0 ? (
            <div className="essay-list">
              {otherArticles.map((article, index) => (
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
                {articles.length === 1
                  ? 'The latest article is featured above. More writing will appear here as you publish.'
                  : 'Every journal begins with a first page. New writing will appear here once an article is published in the studio.'}
              </p>
              {articles.length === 0 && (
                <Link className="text-link" href="/studio">
                  Open the writing studio <ArrowUpRight size={16} />
                </Link>
              )}
            </div>
          )}
        </section>

        {patientStories.length > 0 && (
          <section id="patient-work" className="patient-work section-pad">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Dental care, thoughtfully shared</span>
                <h2 className="patient-work-title">
                  Patient work,
                  <br />
                  <em>with permission.</em>
                </h2>
              </div>
              <span className="eyebrow">{patientStories.length} stories</span>
            </div>
            <p className="patient-work-intro">
              An anonymised record of dental care, treatment journeys and patient experiences. Every story is shared only with consent.
            </p>
            <div className="patient-story-list">
              {patientStories.map((story, index) => (
                <article className="patient-story" key={story._id}>
                  <div className="patient-story-meta">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span>{story.caseType || 'Dental case'}</span>
                  </div>
                  {story.image?.asset?.url && (
                    <div className="patient-story-image">
                      <img src={story.image.asset.url} alt={story.image.alt || story.title} loading="lazy" />
                    </div>
                  )}
                  <span className="patient-story-label">{story.patientLabel || 'Anonymised patient story'}</span>
                  <h3>{story.title}</h3>
                  {story.treatment && <p className="patient-story-treatment">{story.treatment}</p>}
                  <p>{story.summary || story.details}</p>
                  {story.details && story.summary && <p className="patient-story-details">{story.details}</p>}
                </article>
              ))}
            </div>
          </section>
        )}

        {achievements.length > 0 && (
          <section id="achievements" className="essays section-pad">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Milestones & Recognition</span>
                <h2
                  style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                    lineHeight: 1,
                    marginTop: 18,
                  }}
                >
                  Work worth
                  <br />
                  <em>remembering.</em>
                </h2>
              </div>
              <span className="eyebrow">
                {achievements.length} achievements
              </span>
            </div>

            <div className="essay-list">
              {achievements.map((item, index) => (
                <article className="essay-card" key={item._id}>
                  <div className="essay-meta">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span>
                      {item.year ? String(item.year) : 'Recognition'}
                    </span>
                  </div>

                  {item.image?.asset?.url && (
                    <div className="essay-photo">
                      <img
                        src={item.image.asset.url}
                        alt={item.image.alt || item.title}
                        loading="lazy"
                      />
                    </div>
                  )}

                  <h3>{item.title}</h3>

                  {item.institution && <p>{item.institution}</p>}

                  {item.description && <p>{item.description}</p>}
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="statement section-pad">
          <div className="statement-mark">“</div>
          <blockquote>
            The world reveals itself
            <br />
            to those who <em>notice.</em>
          </blockquote>
          <p>A thought to return to.</p>
        </section>

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

        <section id="contact" className="contact section-pad">
          <span className="eyebrow">
            Correspondence · Open to conversation
          </span>
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
              <SocialIcon type="whatsapp" />
              <span>WhatsApp</span>
              <ArrowUpRight size={17} />
            </a>

            <a
              className="contact-button email-button"
              href="mailto:myselfasadfrost@gmail.com"
            >
              <SocialIcon type="email" />
              <span>Email me</span>
              <ArrowUpRight size={17} />
            </a>

            <a
              className="contact-button instagram-button"
              href="https://www.instagram.com/asad_frost/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon type="instagram" />
              <span>Instagram</span>
              <ArrowUpRight size={17} />
            </a>

            <a
              className="contact-button twitter-button"
              href="https://x.com/AsadFrost"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon type="x" />
              <span>Twitter / X</span>
              <ArrowUpRight size={17} />
            </a>
          </div>

          <a className="contact-email" href="mailto:myselfasadfrost@gmail.com">
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
