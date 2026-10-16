import Link from 'next/link'
import React from 'react'

export default function DentalCaseCard({
  id,
  title,
  slug,
  treatmentCategory,
  excerpt,
  image,
}: {
  id: string
  title: string
  slug?: { current?: string }
  treatmentCategory?: string
  excerpt?: string
  image?: { asset?: { url?: string }; alt?: string }
}) {
  const href = slug?.current ? `/dental-cases/${slug.current}` : '#'
  return (
    <article className="overflow-hidden rounded-2xl border border-[#e6d9c9] bg-white shadow-sm">
      {image?.asset?.url ? (
        <img src={image.asset.url} alt={image.alt || title} className="h-48 w-full object-cover" />
      ) : (
        <div className="flex h-48 items-center justify-center bg-[#eadfce] text-4xl">🦷</div>
      )}

      <div className="p-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        {treatmentCategory && <p className="mt-1 text-sm text-[#8b5e3c]">{treatmentCategory}</p>}
        {excerpt && <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#715d58]">{excerpt}</p>}

        <div className="mt-6 flex gap-3">
          <Link href={href} className="rounded-full border border-[#d9c4b1] px-5 py-3 text-sm hover:bg-[#f8f0e8]">
            View case
          </Link>
        </div>
      </div>
    </article>
  )
}
