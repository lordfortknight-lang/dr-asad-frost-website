
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { PremiumEffects } from './premium-effects'

const nav = [
  ['Work', '/#work'],
  ['Journal', '/journal'],
  ['About', '/#about'],
  ['Achievements', '/achievements'],
  ['Milestones', '/milestones'],
  ['Recognition', '/recognition'],
  ['Dental Casebook', '/dental-cases'],
  ['Contact', '/contact'],
]

function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const total =
        document.documentElement.scrollHeight - window.innerHeight

      setProgress(
        total > 0
          ? Math.min(100, Math.max(0, (window.scrollY / total) * 100))
          : 0
      )
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div className="reading-progress-track" aria-hidden="true">
      <div
        className="reading-progress-bar"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export function SiteShell({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setOpen(false)

    const hashIndex = href.indexOf('#')

    if (hashIndex === -1) return

    const targetId = href.slice(hashIndex + 1)

    if (window.location.pathname === '/') {
      const target = document.getElementById(targetId)

      if (target) {
        event.preventDefault()

        window.history.replaceState(
          null,
          '',
          `/#${targetId}`
        )

        window.requestAnimationFrame(() => {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        })
      }
    }
  }

  return (
    <div className="site-shell">
      <ReadingProgress />
      <PremiumEffects />

      <header className="site-header site-header-branded">
        <Link
          href="/"
          className="brand-logo-link"
          aria-label="Dr Asad Frost home"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/file_0000000074548208beb7e7894cc30a31.png"
            alt="Dr Asad Frost — Dentist, Writer, Stock Market Enthusiast"
            width={1800}
            height={600}
            priority
            className="brand-logo-image"
          />
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X size={25} /> : <Menu size={25} />}
        </button>

        <nav
          className={`main-nav ${open ? 'is-open' : ''}`}
          aria-label="Main navigation"
        >
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={(event) => handleNavClick(event, href)}
            >
              {label}
            </Link>
          ))}

          <Link
            className="studio-link"
            href="/contact"
            onClick={() => setOpen(false)}
          >
            Get in touch <ArrowUpRight size={15} />
          </Link>
        </nav>
      </header>

      {children}

      <footer className="site-footer">
        <div>
          <span className="footer-mark">AF</span>
          <p>Writer. Scholar. Dentist.</p>
        </div>
        <p>© {new Date().getFullYear()} Dr Asad Frost</p>
        <p>Made for the margins.</p>
      </footer>
    </div>
  )
}
