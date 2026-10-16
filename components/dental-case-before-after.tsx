'use client'

import React from 'react'

type Photo = { asset?: { url?: string }; caption?: string; alt?: string }

export function DentalCaseBeforeAfter({
  before = [],
  after = [],
}: {
  before?: Photo[]
  after?: Photo[]
}) {
  const pairs: { before?: Photo; after?: Photo }[] = []
  const maxLen = Math.max(before.length, after.length)
  for (let i = 0; i < maxLen; i++) {
    pairs.push({ before: before[i], after: after[i] })
  }

  return (
    <section className="dental-case-gallery">
      {pairs.map((pair, idx) => (
        <figure
          key={idx}
          className="grid gap-4 md:grid-cols-2 md:items-start md:gap-6 mb-8"
          aria-labelledby={`case-pair-${idx}-title`}
        >
          {pair.before && pair.before.asset?.url ? (
            <div>
              <img
                src={pair.before.asset.url}
                alt={pair.before.alt || `Before image ${idx + 1}`}
                className="w-full object-cover rounded-lg border"
                style={{ maxHeight: 520, width: '100%' }}
              />
              {pair.before.caption && (
                <figcaption className="mt-2 text-sm text-[#715d58]">
                  {pair.before.caption}
                </figcaption>
              )}
            </div>
          ) : (
            <div />
          )}

          {pair.after && pair.after.asset?.url ? (
            <div>
              <img
                src={pair.after.asset.url}
                alt={pair.after.alt || `After image ${idx + 1}`}
                className="w-full object-cover rounded-lg border"
                style={{ maxHeight: 520, width: '100%' }}
              />
              {pair.after.caption && (
                <figcaption className="mt-2 text-sm text-[#715d58]">
                  {pair.after.caption}
                </figcaption>
              )}
            </div>
          ) : (
            <div />
          )}
        </figure>
      ))}
    </section>
  )
}
