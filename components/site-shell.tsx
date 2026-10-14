'use client'

import Link from 'next/link'
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
        <Link href="/" className="wordmark" onClick={() => setOpen(false)}>
          <span>AF</span>
          <span className="wordmark-name">Dr Asad Frost</span>
        </Link>
        <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
          {nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <Link className="studio-link" href="/studio">Studio <ArrowUpRight size={14} /></Link>
        </nav>
        <button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </header>
      {children}
      <footer className="site-footer">
        <div><span className="footer-mark">AF</span><p>Writer. Scholar. Observer.</p></div>
        <p>© {new Date().getFullYear()} Dr Asad Frost</p>
        <p>Made for the margins.</p>
      </footer>
    </div>
  )
}
