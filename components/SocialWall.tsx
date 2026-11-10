'use client'

import { Lora } from 'next/font/google'
import { useEffect, useMemo, useRef, useState } from 'react'

const lora = Lora({ subsets: ['latin'], display: 'swap' })

type Tweet = {
  name: string
  handle: string
  date: string
  text: string
  avatarUrl?: string
  verified?: boolean
}

type Quote = {
  text: string
  name: string
}

const TWEETS: Tweet[] = [
  { name: 'Dr Asad Frost', handle: '@asadfrost', date: '12 Jun 2024', text: 'A quiet observation can change the way an entire day feels. @asadfrost', verified: true },
  { name: 'Dr Asad Frost', handle: '@asadfrost', date: '04 May 2024', text: 'The best questions are often the ones we learn to keep asking. Read more at https://asadfrost.in', verified: true },
  { name: 'Dr Asad Frost', handle: '@asadfrost', date: '19 Apr 2024', text: 'There is craft in paying attention to the ordinary, especially when @writing meets care.' },
  { name: 'Dr Asad Frost', handle: '@asadfrost', date: '02 Mar 2024', text: 'Medicine teaches precision. Writing teaches patience. https://asadfrost.in' },
  { name: 'Dr Asad Frost', handle: '@asadfrost', date: '17 Feb 2024', text: 'A life is made of small details, noticed consistently. @clinicnotes' },
  { name: 'Dr Asad Frost', handle: '@asadfrost', date: '28 Jan 2024', text: 'Curiosity is a generous way to move through the world, one question at a time.' },
  { name: 'Dr Asad Frost', handle: '@asadfrost', date: '09 Dec 2023', text: 'A thoughtful pause can make room for a better answer. Visit asadfrost.in/journal' },
  { name: 'Dr Asad Frost', handle: '@asadfrost', date: '21 Nov 2023', text: 'The work is in noticing what others might pass by. @asadfrost' },
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

function TweetAvatar({ tweet }: { tweet: Tweet }) {
  const [imageFailed, setImageFailed] = useState(false)

  if (tweet.avatarUrl && !imageFailed) {
    return <img className="social-avatar" src={tweet.avatarUrl} alt="" onError={() => setImageFailed(true)} />
  }

  return <span className="social-avatar" aria-hidden="true">{initials(tweet.name)}</span>
}

function TweetText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(https?:\/\/\S+|@[a-zA-Z0-9_]+)/g).map((part, index) => {
        if (/^https?:\/\//.test(part)) {
          return <a href={part} key={`${part}-${index}`} target="_blank" rel="noreferrer">{part}</a>
        }
        if (/^@/.test(part)) {
          return <a href={`https://x.com/${part.slice(1)}`} key={`${part}-${index}`} target="_blank" rel="noreferrer">{part}</a>
        }
        return <span key={`${part}-${index}`}>{part}</span>
      })}
    </>
  )
}

function BirdIcon() {
  return (
    <svg className="social-bird" viewBox="0 0 24 24" aria-label="Twitter post" role="img" style={{ width: 18, height: 18, flex: '0 0 18px', marginLeft: 'auto', fill: '#1d9bf0' }}>
      <path d="M23 3.1c-.8.4-1.7.7-2.6.8a4.5 4.5 0 0 0-7.8 3.1v1A10.8 10.8 0 0 1 4.7 4.3S1.5 8.8 5.8 11a4.5 4.5 0 0 1-2-.6c0 2.2 1.5 4.2 3.7 4.6a4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 2 20.1a12.7 12.7 0 0 0 6.9 2c8.3 0 12.9-7 12.9-13v-.6c.9-.7 1.7-1.5 2.2-2.4Z" />
    </svg>
  )
}

export default function SocialWall() {
  const sectionRef = useRef<HTMLElement>(null)
  const targetX = useRef([0, 0, 0])
  const currentX = useRef([0, 0, 0])
  const frame = useRef<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [offsets, setOffsets] = useState([0, 0, 0])
  const [quotesVisible, setQuotesVisible] = useState(false)
  const rows = useMemo(() => [TWEETS.slice(0, 3), TWEETS.slice(3, 6), TWEETS.slice(6)], [])

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
              {row.map((tweet, index) => (
                <article className="social-card" key={`${rowIndex}-${index}-${tweet.date}`}>
                  <header className="social-card-header">
                    <TweetAvatar tweet={tweet} />
                    <span className="social-card-identity">
                      <strong>{tweet.name} {tweet.verified && <span className="social-verified" aria-label="Verified">✓</span>}</strong>
                      <small>{tweet.handle} · {tweet.date}</small>
                    </span>
                    <BirdIcon />
                  </header>
                  <p><TweetText text={tweet.text} /></p>
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
        .social-wall-rows { display: grid; gap: 8px; width: max-content; padding: 10px 0 28px; }
        .social-wall-row { display: flex; gap: 16px; will-change: transform; position: relative; }
        .social-wall-row:nth-child(2), .social-wall-row:nth-child(3) { margin-top: -4px; }
        .social-wall-row:nth-child(2) { z-index: 2; }
        .social-wall-row:nth-child(3) { z-index: 3; }
        .social-card { width: clamp(290px, 34vw, 390px); min-height: 132px; padding: 14px 16px; background: white; border: 0; border-radius: 10px; box-shadow: 0 12px 32px rgba(0,0,0,.10); }
        .social-card-header { display: flex; align-items: center; gap: 10px; }
        .social-avatar { display: grid; place-items: center; width: 36px; height: 36px; flex: 0 0 36px; border: 0; border-radius: 50%; object-fit: cover; color: white; background: linear-gradient(135deg, #762b3b, #d5bca2); font: 700 10px Arial, sans-serif; letter-spacing: .04em; }
        .social-card:nth-child(3n + 1) .social-avatar { background: linear-gradient(135deg, #6d8f9a, #c9d9d5); }
        .social-card:nth-child(3n + 2) .social-avatar { background: linear-gradient(135deg, #b79a61, #e7c9b2); }
        .social-card-identity { min-width: 0; }
        .social-card strong, .social-card small { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .social-card strong { font: 700 12px Arial, sans-serif; }
        .social-card small { color: #806f6b; font: 11px Arial, sans-serif; }
        .social-verified { color: #1d9bf0; font: 700 12px Arial, sans-serif; }
        .social-bird { width: 18px; height: 18px; flex: 0 0 18px; margin-left: auto; fill: #1d9bf0; }
        .social-card p { margin: 18px 0 0; font: 13px/1.35 Arial, sans-serif; }
        .social-card p a { color: #1d9bf0; text-decoration: none; }
        .social-quotes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(28px, 8vw, 120px); max-width: 920px; margin: 70px auto 0; padding: 0 4.5vw; }
        .social-quotes figure { margin: 0; opacity: 0; transform: translateY(22px); transition: opacity 700ms ease, transform 700ms ease; }
        .social-quotes figure:nth-child(2) { transition-delay: 120ms; }
        .social-quotes.is-visible figure { opacity: 1; transform: translateY(0); }
        .social-quotes blockquote { color: #762b3b; font-size: clamp(1.3rem, 2.5vw, 2rem); line-height: 1.25; letter-spacing: -.03em; margin: 0 0 20px; }
        .social-quotes figcaption { color: #241c1b; font: 700 10px Arial, sans-serif; letter-spacing: .2em; text-transform: uppercase; }
        @media (max-width: 700px) { .social-wall-heading { margin-left: 6vw; margin-right: 6vw; }.social-card { width: 330px; min-height: 0; padding: 14px 16px; }.social-quotes { grid-template-columns: 1fr; margin-top: 54px; }.social-quotes figure { max-width: 330px; } }
        @media (prefers-reduced-motion: reduce) { .social-quotes figure { transition: none; } }
      `}</style>
    </section>
  )
}
