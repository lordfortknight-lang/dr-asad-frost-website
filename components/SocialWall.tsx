'use client'

import { Lora } from 'next/font/google'
import { useEffect, useMemo, useRef, useState } from 'react'

const lora = Lora({ subsets: ['latin'], display: 'swap' })

type Tweet = {
  name: string
  handle: string
  date: string
  text: string
}

type Quote = {
  text: string
  name: string
}

const TWEETS: Tweet[] = [
  { name: 'Dr Asad Frost', handle: '@asadfrost', date: '12 Jun 2024', text: 'A quiet observation can change the way an entire day feels.' },
  { name: 'Dr Asad Frost', handle: '@asadfrost', date: '04 May 2024', text: 'The best questions are often the ones we learn to keep asking.' },
  { name: 'Dr Asad Frost', handle: '@asadfrost', date: '19 Apr 2024', text: 'There is craft in paying attention to the ordinary.' },
  { name: 'Dr Asad Frost', handle: '@asadfrost', date: '02 Mar 2024', text: 'Medicine teaches precision. Writing teaches patience.' },
  { name: 'Dr Asad Frost', handle: '@asadfrost', date: '17 Feb 2024', text: 'A life is made of small details, noticed consistently.' },
  { name: 'Dr Asad Frost', handle: '@asadfrost', date: '28 Jan 2024', text: 'Curiosity is a generous way to move through the world.' },
]

const QUOTES: Quote[] = [
  { text: 'Placeholder testimonial quote goes here, ready for your own words.', name: 'Placeholder Name' },
  { text: 'Placeholder testimonial quote goes here, ready for your own words.', name: 'Placeholder Name' },
]

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

export default function SocialWall() {
  const sectionRef = useRef<HTMLElement>(null)
  const targetX = useRef([0, 0, 0])
  const currentX = useRef([0, 0, 0])
  const frame = useRef<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [offsets, setOffsets] = useState([0, 0, 0])
  const [quotesVisible, setQuotesVisible] = useState(false)
  const rows = useMemo(() => [TWEETS, [...TWEETS].reverse(), [...TWEETS].slice(2).concat(TWEETS.slice(0, 2))], [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { rootMargin: '12% 0px' })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const quoteObserver = new IntersectionObserver(([entry]) => setQuotesVisible(entry.isIntersecting), { threshold: 0.2 })
    const quotes = section.querySelector('[data-social-quotes]')
    if (quotes) quoteObserver.observe(quotes)
    return () => quoteObserver.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) {
      if (frame.current) cancelAnimationFrame(frame.current)
      frame.current = null
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const update = () => {
      const scroll = window.scrollY
      const speeds = [0.16, -0.11, 0.08]
      targetX.current = speeds.map((speed) => ((scroll * speed) % 260) - 130)
      if (reducedMotion) {
        currentX.current = targetX.current
      } else {
        currentX.current = currentX.current.map((value, index) => value + (targetX.current[index] - value) * 0.1)
      }
      setOffsets([...currentX.current])
      frame.current = requestAnimationFrame(update)
    }

    frame.current = requestAnimationFrame(update)
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
      frame.current = null
    }
  }, [isVisible])

  return (
    <section ref={sectionRef} className="social-wall" aria-labelledby="social-wall-title">
      <div className="social-wall-heading">
        <span className="social-wall-eyebrow">From the feed</span>
        <span className="social-wall-rule" />
        <h2 id="social-wall-title">Social <em>wall.</em></h2>
      </div>

      <div className="social-wall-viewport" aria-label="Selected posts">
        <div className="social-wall-rows">
          {rows.map((row, rowIndex) => (
            <div className="social-wall-row" key={rowIndex} style={{ transform: `translate3d(${offsets[rowIndex]}px, 0, 0)` }}>
              {[...row, ...row].map((tweet, index) => (
                <article className="social-card" key={`${rowIndex}-${index}-${tweet.date}`} style={{ transform: `rotate(${((index + rowIndex) % 3 - 1) * 0.8}deg) translateY(${((index * 7 + rowIndex * 5) % 13) - 6}px)` }}>
                  <header className="social-card-header">
                    <span className="social-avatar" aria-hidden="true">{initials(tweet.name)}</span>
                    <span>
                      <strong>{tweet.name}</strong>
                      <small>{tweet.handle}</small>
                    </span>
                    <span className="social-x" aria-label="X post">𝕏</span>
                  </header>
                  <p>{tweet.text}</p>
                  <time>{tweet.date}</time>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div data-social-quotes className={`social-quotes ${quotesVisible ? 'is-visible' : ''}`}>
        {QUOTES.map((quote, index) => (
          <figure key={`${quote.name}-${index}`}>
            <blockquote className={lora.className}>“{quote.text}”</blockquote>
            <figcaption>{quote.name}</figcaption>
          </figure>
        ))}
      </div>

      <style jsx>{`
        .social-wall { background: #f6f5ec; color: #241c1b; padding: clamp(70px, 10vw, 130px) 0 clamp(80px, 11vw, 145px); overflow: hidden; }
        .social-wall-heading { display: grid; grid-template-columns: auto 1fr; gap: 18px; align-items: center; margin: 0 4.5vw 42px; }
        .social-wall-heading h2 { grid-column: 1 / -1; color: #762b3b; font: 400 clamp(3.5rem, 8vw, 8rem)/.82 Georgia, serif; letter-spacing: -.07em; margin: 18px 0 0; }
        .social-wall-heading h2 em { color: #b79a61; }
        .social-wall-eyebrow { color: #762b3b; font: 700 10px Arial, sans-serif; letter-spacing: .18em; text-transform: uppercase; }
        .social-wall-rule { height: 1px; background: rgba(36,28,27,.18); }
        .social-wall-viewport { position: relative; width: 100%; mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent); -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent); }
        .social-wall-rows { display: grid; gap: 14px; width: max-content; padding: 10px 0 28px; }
        .social-wall-row { display: flex; gap: 16px; will-change: transform; }
        .social-card { width: clamp(230px, 25vw, 320px); min-height: 170px; padding: 19px; background: white; border: 1px solid rgba(36,28,27,.12); border-radius: 4px; box-shadow: 8px 10px 0 rgba(183,154,97,.08), 0 10px 26px rgba(36,28,27,.08); }
        .social-card:nth-child(3n) { box-shadow: 8px 10px 0 rgba(118,43,59,.08), 0 10px 26px rgba(36,28,27,.08); }
        .social-card:nth-child(3n + 1) { box-shadow: 8px 10px 0 rgba(159,187,196,.18), 0 10px 26px rgba(36,28,27,.08); }
        .social-card-header { display: flex; align-items: center; gap: 10px; }
        .social-avatar { display: grid; place-items: center; width: 34px; height: 34px; flex: 0 0 34px; border-radius: 50%; color: white; background: linear-gradient(135deg, #762b3b, #d5bca2); font: 700 10px Arial, sans-serif; letter-spacing: .04em; }
        .social-card:nth-child(3n + 1) .social-avatar { background: linear-gradient(135deg, #6d8f9a, #c9d9d5); }
        .social-card:nth-child(3n + 2) .social-avatar { background: linear-gradient(135deg, #b79a61, #e7c9b2); }
        .social-card strong, .social-card small { display: block; }
        .social-card strong { font: 700 12px Arial, sans-serif; }
        .social-card small, .social-card time { color: #806f6b; font: 11px Arial, sans-serif; }
        .social-x { margin-left: auto; color: #241c1b; font-size: 17px; }
        .social-card p { margin: 22px 0 18px; font: 14px/1.5 Arial, sans-serif; }
        .social-card time { display: block; }
        .social-quotes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(28px, 8vw, 120px); max-width: 920px; margin: 70px auto 0; padding: 0 4.5vw; }
        .social-quotes figure { margin: 0; opacity: 0; transform: translateY(22px); transition: opacity 700ms ease, transform 700ms ease; }
        .social-quotes figure:nth-child(2) { transition-delay: 120ms; }
        .social-quotes.is-visible figure { opacity: 1; transform: translateY(0); }
        .social-quotes blockquote { color: #762b3b; font-size: clamp(1.3rem, 2.5vw, 2rem); line-height: 1.25; letter-spacing: -.03em; margin: 0 0 20px; }
        .social-quotes figcaption { color: #241c1b; font: 700 10px Arial, sans-serif; letter-spacing: .2em; text-transform: uppercase; }
        @media (max-width: 700px) { .social-wall-heading { margin-left: 6vw; margin-right: 6vw; }.social-card { width: 220px; min-height: 155px; padding: 16px; }.social-card p { font-size: 13px; }.social-quotes { grid-template-columns: 1fr; margin-top: 54px; }.social-quotes figure { max-width: 330px; } }
        @media (prefers-reduced-motion: reduce) { .social-quotes figure { transition: none; } }
      `}</style>
    </section>
  )
}
