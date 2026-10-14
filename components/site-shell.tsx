
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
      <header className="site-header">
        <Link
          href="/"
          className="wordmark"
          onClick={() => setOpen(false)}
          aria-label="Dr Asad Frost — Home"
        >
          <Image
            src="/file_0000000074548208beb7e7894cc30a31.png"
            alt="Dr Asad Frost logo"
            width={52}
            height={52}
            priority
            style={{
              width: 48,
              height: 48,
              objectFit: 'contain',
              borderRadius: '50%',
            }}
          />
          <span className="wordmark-name">Dr Asad Frost</span>
        </Link>

        <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
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

        <button
          type="button"
          className="menu-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
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
