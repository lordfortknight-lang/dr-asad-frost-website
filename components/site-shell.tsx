
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const nav = [
  ['Work', '/#work'],
  ['Essays', '/#essays'],
  ['About', '/#about'],
  ['Contact', '/#contact'],
]

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="site-shell">
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
          onClick={() => setOpen(!open)}
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
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}

          <Link
            className="studio-link"
            href="/#contact"
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
