'use client'

import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronUp, Grid2X2, Mail, Search, Smartphone, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import styles from './newsroom.module.css'

type Article = {
  _id: string
  title: string
  slug?: { current?: string }
  excerpt?: string
  category?: string
  tags?: string[]
  publishedAt?: string
  image?: { asset?: { url?: string }; alt?: string }
  body?: Array<{ _type?: string; _key?: string; style?: string; children?: Array<{ text?: string }> }>
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

function formatDate(value?: string) {
  if (!value) return 'Undated'
  const date = new Date(value)
  return Number.isNaN(date.valueOf()) ? 'Undated' : dateFormatter.format(date)
}

function BlockContent({ article }: { article: Article }) {
  return (
    <div className={styles.articleBody}>
      {article.body?.map((block, index) => {
        if (block._type !== 'block') return null
        const text = block.children?.map((child) => child.text || '').join('')
        if (!text) return null
        if (block.style === 'h2' || block.style === 'h3') {
          return <h2 key={block._key || index}>{text}</h2>
        }
        return <p key={block._key || index}>{text}</p>
      })}
      {!article.body?.length && article.excerpt ? <p>{article.excerpt}</p> : null}
    </div>
  )
}

function NewsroomHeader({ onClose, onBack }: { onClose?: () => void; onBack?: () => void }) {
  return (
    <header className={styles.windowHeader}>
      <button className={styles.iconButton} onClick={onClose || onBack} aria-label={onClose ? 'Close newsroom' : 'Back to newsroom'}>
        {onClose ? <X size={20} strokeWidth={1.5} /> : <ArrowLeft size={20} strokeWidth={1.5} />}
      </button>
      <button className={styles.newsletterButton} type="button" aria-label="Get the newsletter">
        <Mail size={17} strokeWidth={1.7} /> Get the newsletter
      </button>
      <div className={styles.windowTitle}>NEWSROOM</div>
    </header>
  )
}

function NewsroomDock() {
  return (
    <nav className={styles.dock} aria-label="Newsroom navigation">
      <Link href="/" className={styles.dockArrow} aria-label="Go home"><ArrowLeft size={18} /></Link>
      <Link href="/" className={styles.dockItem}><span className={styles.dockGlyph}>⌂</span><span>Home</span></Link>
      <Link href="/newsroom" className={`${styles.dockItem} ${styles.active}`}><span className={styles.dockGlyph}><Grid2X2 size={22} /></span><span>Newsroom</span></Link>
      <Link href="/journal" className={styles.dockItem}><span className={styles.dockGlyph}>✦</span><span>Journal</span></Link>
      <Link href="/#about" className={styles.dockItem}><span className={styles.dockGlyph}>◎</span><span>About</span></Link>
      <Link href="/contact" className={styles.dockItem}><span className={styles.dockGlyph}><Mail size={21} /></span><span>Contact</span></Link>
      <span className={styles.dockArrow} aria-hidden="true"><ChevronDown size={18} /></span>
    </nav>
  )
}

export function Newsroom({ articles }: { articles: Article[] }) {
  const [selected, setSelected] = useState<Article | null>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const categories = useMemo(() => ['All', ...Array.from(new Set(articles.map((article) => article.category).filter(Boolean) as string[]))], [articles])
  const filtered = useMemo(() => articles.filter((article) => {
    const haystack = `${article.title} ${article.excerpt || ''} ${article.category || ''} ${(article.tags || []).join(' ')}`.toLowerCase()
    return (category === 'All' || article.category === category) && haystack.includes(query.toLowerCase())
  }), [articles, category, query])

  return (
    <main className={styles.page}>
      <div className={styles.topControls}>
        <Link href="/contact" className={styles.retroButton}><span className={styles.palm}>✦</span> Become a member</Link>
        <Link href="/ai" className={styles.retroButton}><Smartphone size={18} strokeWidth={1.6} /> Get the app</Link>
      </div>
      <div className={styles.desktopStack} aria-hidden="true"><span /><span /></div>
      <section className={styles.window} aria-label="Dr Asad Frost Newsroom">
        {selected ? (
          <>
            <NewsroomHeader onBack={() => setSelected(null)} />
            <article className={styles.reader}>
              <div className={styles.readerInner}>
                <p className={styles.brandMark}>DR ASAD FROST / EDITORIAL</p>
                <p className={styles.category}>{selected.category || 'Journal'} · {formatDate(selected.publishedAt)}</p>
                <h1>{selected.title}</h1>
                {selected.image?.asset?.url ? <img src={selected.image.asset.url} alt={selected.image.alt || selected.title} className={styles.featureImage} /> : null}
                <BlockContent article={selected} />
                <Link href={`/articles/${selected.slug?.current || ''}`} className={styles.readLink}>Open full article ↗</Link>
              </div>
            </article>
          </>
        ) : (
          <>
            <NewsroomHeader onClose={() => window.history.back()} />
            <div className={styles.directoryTools}>
              <label className={styles.search}><Search size={16} /><span className="sr-only">Search articles</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the archive" /></label>
              <div className={styles.categories} aria-label="Filter by category">
                {categories.map((item) => <button key={item} className={category === item ? styles.categoryActive : ''} onClick={() => setCategory(item)}>{item}</button>)}
              </div>
            </div>
            <div className={styles.directory}>
              {filtered.map((article) => (
                <button className={styles.articleRow} key={article._id} onClick={() => setSelected(article)}>
                  {article.image?.asset?.url ? <img src={article.image.asset.url} alt={article.image.alt || article.title} /> : <span className={styles.imagePlaceholder}>AF</span>}
                  <span className={styles.articleMeta}><strong>{article.title}</strong><span>{formatDate(article.publishedAt)} <i>✦</i> {article.category || 'Essay'}</span><small>{article.excerpt || 'Read the latest from the archive.'}</small></span>
                </button>
              ))}
              {!filtered.length ? <div className={styles.empty}>No published articles match this view.</div> : null}
            </div>
            <footer className={styles.windowFooter}><span>{filtered.length} of {articles.length} published articles</span><span className={styles.scrollHint}><ChevronUp size={14} /><ChevronDown size={14} /></span></footer>
          </>
        )}
      </section>
      <NewsroomDock />
    </main>
  )
}
