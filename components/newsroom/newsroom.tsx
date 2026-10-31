'use client'

import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, ChevronDown, ChevronUp, Grid2X2, Search, X } from 'lucide-react'
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
  body?: unknown[]
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
function formatDate(value?: string) {
  if (!value) return 'Undated'
  const date = new Date(value)
  return Number.isNaN(date.valueOf()) ? 'Undated' : dateFormatter.format(date)
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  list: { bullet: ({ children }) => <ul>{children}</ul>, number: ({ children }) => <ol>{children}</ol> },
  marks: {
    link: ({ children, value }) => <a href={value?.href} target={value?.blank ? '_blank' : undefined} rel={value?.blank ? 'noreferrer' : undefined}>{children}</a>,
  },
  types: {
    image: ({ value }) => value?.asset?.url ? <Image src={value.asset.url} alt={value.alt || ''} width={1200} height={800} className={styles.bodyImage} /> : null,
  },
}

function NewsroomHeader({ reader, onClose }: { reader?: boolean; onClose: () => void }) {
  return (
    <header className={styles.windowHeader}>
      <button className={styles.iconButton} onClick={onClose} aria-label={reader ? 'Back to newsroom' : 'Close newsroom'}>
        {reader ? <ArrowLeft size={19} strokeWidth={1.5} /> : <X size={19} strokeWidth={1.5} />}
      </button>
      <div className={styles.windowTitle}>NEWSROOM</div>
    </header>
  )
}

function NewsroomDock() {
  return (
    <nav className={styles.dock} aria-label="Site navigation">
      <Link href="/" className={styles.dockItem}><span className={styles.dockGlyph}>⌂</span><span>Home</span></Link>
      <Link href="/newsroom" className={`${styles.dockItem} ${styles.active}`}><Grid2X2 size={19} /><span>Newsroom</span></Link>
      <Link href="/journal" className={styles.dockItem}><span className={styles.dockGlyph}>✦</span><span>Journal</span></Link>
      <Link href="/#about" className={styles.dockItem}><span className={styles.dockGlyph}>◎</span><span>About</span></Link>
      <Link href="/contact" className={styles.dockItem}><span className={styles.dockGlyph}>↗</span><span>Contact</span></Link>
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
    return (category === 'All' || article.category === category) && haystack.includes(query.trim().toLowerCase())
  }), [articles, category, query])

  return (
    <main className={styles.page}>
      <div className={styles.ambientLabel}>DR ASAD FROST <span>/</span> SELECTED WRITING</div>
      <section className={styles.window} aria-label="Dr Asad Frost Newsroom">
        {selected ? (
          <>
            <NewsroomHeader reader onClose={() => setSelected(null)} />
            <article className={styles.reader}>
              <div className={styles.readerInner}>
                <p className={styles.kicker}>{selected.category || 'Journal'} · {formatDate(selected.publishedAt)}</p>
                <h1>{selected.title}</h1>
                {selected.image?.asset?.url ? <Image src={selected.image.asset.url} alt={selected.image.alt || selected.title} width={1400} height={900} priority className={styles.featureImage} /> : null}
                {selected.body?.length ? <div className={styles.articleBody}><PortableText value={selected.body as never} components={portableTextComponents} /></div> : selected.excerpt ? <div className={styles.articleBody}><p>{selected.excerpt}</p></div> : null}
                {selected.slug?.current ? <Link href={`/articles/${selected.slug.current}`} className={styles.readLink}>Open full article <ArrowUpRight size={14} /></Link> : null}
              </div>
            </article>
          </>
        ) : (
          <>
            <NewsroomHeader onClose={() => setSelected(null)} />
            <div className={styles.directoryIntro}>
              <p>Ideas, field notes and observations from the practice.</p>
              <span>{articles.length.toString().padStart(2, '0')} published pieces</span>
            </div>
            <div className={styles.directoryTools}>
              <label className={styles.search}><Search size={16} aria-hidden="true" /><span className="sr-only">Search articles</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the archive" /></label>
              <div className={styles.categories} aria-label="Filter by category">
                {categories.map((item) => <button key={item} className={category === item ? styles.categoryActive : ''} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}
              </div>
            </div>
            <div className={styles.directory}>
              {filtered.map((article, index) => (
                <button className={styles.articleRow} key={article._id} onClick={() => setSelected(article)}>
                  <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
                  {article.image?.asset?.url ? <Image src={article.image.asset.url} alt={article.image.alt || article.title} width={420} height={300} sizes="(max-width: 600px) 34vw, 220px" /> : <span className={styles.imagePlaceholder}>AF</span>}
                  <span className={styles.articleMeta}><strong>{article.title}</strong><span>{formatDate(article.publishedAt)} <i>·</i> {article.category || 'Essay'}</span><small>{article.excerpt || 'Read the latest from the archive.'}</small></span>
                </button>
              ))}
              {!filtered.length ? <div className={styles.empty}><strong>No pieces found.</strong><span>Try another search or category.</span></div> : null}
            </div>
            <footer className={styles.windowFooter}><span>{filtered.length} of {articles.length} published articles</span><span className={styles.scrollHint}><ChevronUp size={14} /><ChevronDown size={14} /></span></footer>
          </>
        )}
      </section>
      <NewsroomDock />
    </main>
  )
}
