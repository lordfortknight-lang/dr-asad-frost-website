
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  MessageCircle,
  Mail,
  ArrowUpRight,
} from 'lucide-react'
import { SiteShell } from '@/components/site-shell'

export const metadata: Metadata = {
  title: 'Contact | Dr Asad Frost',
  description:
    'Contact Dr Asad Frost for conversations, writing, collaborations and professional enquiries.',
}

const contactLinks = [
  {
    label: 'WhatsApp',
    href: 'https://wa.me/919548686051',
    icon: MessageCircle,
    external: true,
  },
  {
    label: 'Email me',
    href: 'mailto:myselfasadfrost@gmail.com',
    icon: Mail,
    external: false,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/asad_frost/',
    icon: null,
    external: true,
  },
  {
    label: 'Twitter / X',
    href: 'https://x.com/AsadFrost',
    icon: ArrowUpRight,
    external: true,
  },
]

export default function ContactPage() {
  return (
    <SiteShell>
      <main className="min-h-screen bg-[#b79a61] px-5 py-16 text-[#762b3b] sm:px-10 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="text-sm hover:underline">
            ← Back to Home
          </Link>

          <header className="mb-12 mt-12 sm:mb-16">
            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.18em]">
              Correspondence · Open to conversation
            </p>

            <h1 className="max-w-4xl font-serif text-[clamp(2.8rem,10vw,7rem)] font-medium leading-[0.95] tracking-[-0.05em] break-words">
              Have a thought
              <br />
              to <em>share?</em>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 sm:text-xl">
              For thoughtful conversations, writing,
              collaborations and ideas worth exploring.
            </p>
          </header>

          <section className="border-t border-[#762b3b]/25 py-10 sm:py-12">
            <p className="mb-8 text-xs uppercase tracking-[0.2em]">
              Get in touch
            </p>

            <div className="flex flex-col items-start gap-7">
              {contactLinks.map((item) => {
                const Icon = item.icon

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={
                      item.external
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="group inline-flex items-center gap-4 border-b border-transparent pb-2 text-lg transition hover:border-[#762b3b] sm:text-xl"
                  >
                    {Icon ? (
                      <Icon size={23} strokeWidth={1.7} />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="inline-flex h-[23px] w-[23px] items-center justify-center rounded-md border-2 border-current text-lg font-semibold leading-none"
                      >
                        ◎
                      </span>
                    )}

                    <span>{item.label}</span>

                    <ArrowUpRight
                      size={17}
                      className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </a>
                )
              })}
            </div>

            <a
              href="mailto:myselfasadfrost@gmail.com"
              className="mt-12 inline-flex max-w-full items-center gap-3 break-all border-b border-[#762b3b] pb-2 font-serif text-xl sm:text-3xl"
            >
              myselfasadfrost@gmail.com
              <ArrowUpRight size={21} className="shrink-0" />
            </a>
          </section>
        </div>
      </main>
    </SiteShell>
  )
}
