'use client'

const gradientClasses = [
  'marquee-gradient-gold-coral',
  'marquee-gradient-coral-rose',
  'marquee-gradient-rose-violet',
  'marquee-gradient-violet-indigo',
  'marquee-gradient-indigo-teal',
  'marquee-gradient-teal-gold',
]

type MarqueeProps = {
  words: string[]
}

function Sparkle() {
  return (
    <span className="marquee-sparkle" aria-hidden="true">
      <span />
    </span>
  )
}

export function Marquee({ words }: MarqueeProps) {
  const items = words.map((word, index) => ({
    word,
    gradient: gradientClasses[index % gradientClasses.length],
    outlined: index % 2 === 1,
  }))

  return (
    <div className="marquee-band" aria-hidden="true">
      <div className="marquee-viewport">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div className="marquee-group" key={copy}>
              {items.map(({ word, gradient, outlined }, index) => (
                <span className="marquee-item" key={`${copy}-${word}`}>
                  <span
                    className={`marquee-word ${gradient}${outlined ? ' marquee-word-outlined' : ''}`}
                  >
                    {word}
                  </span>
                  {index < items.length - 1 && <Sparkle />}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
