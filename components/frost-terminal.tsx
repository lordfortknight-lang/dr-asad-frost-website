'use client'

import Link from 'next/link'
import { ArrowUpRight, CornerDownLeft, Terminal } from 'lucide-react'

const entries = [
  {
    command: 'open journal',
    label: 'Journal',
    description: 'Essays, observations and notes from the archive.',
    href: '/journal',
    tone: 'terminal-entry-journal',
  },
  {
    command: 'enter clinical-world',
    label: 'Clinical World',
    description: 'Published dental cases shared with care and consent.',
    href: '/clinical-world',
    tone: 'terminal-entry-clinical',
  },
  {
    command: 'observe markets',
    label: 'Markets',
    description: 'A personal doorway into the market-minded archive.',
    href: '/#work',
    tone: 'terminal-entry-markets',
  },
  {
    command: 'browse archive',
    label: 'Archive',
    description: 'Books, magazine issues, milestones and recognition.',
    href: '/books',
    tone: 'terminal-entry-archive',
  },
]

export function FrostTerminal({
  journalCount,
  clinicalCount,
  archiveCount,
}: {
  journalCount: number
  clinicalCount: number
  archiveCount: number
}) {
  const counts = [journalCount, clinicalCount, undefined, archiveCount]

  return (
    <section className="frost-terminal section-pad" aria-labelledby="frost-terminal-title">
      <div className="frost-terminal-frame">
        <div className="frost-terminal-topline">
          <div className="frost-terminal-brand">
            <Terminal size={15} aria-hidden="true" />
            <span>FROST / TERMINAL</span>
          </div>
          <span className="frost-terminal-status"><i aria-hidden="true" /> published archive</span>
        </div>

        <div className="frost-terminal-intro">
          <span className="eyebrow frost-terminal-eyebrow">A living digital archive</span>
          <h2 id="frost-terminal-title">Enter the <em>terminal.</em></h2>
          <p>Four doors into the work. Choose a thread and follow it slowly.</p>
        </div>

        <div className="frost-terminal-console" aria-label="Frost Terminal entry points">
          <div className="frost-terminal-prompt" aria-hidden="true">
            <CornerDownLeft size={15} /> <span>select an entry point</span>
          </div>
          <div className="frost-terminal-grid">
            {entries.map((entry, index) => (
              <Link className={`frost-terminal-entry ${entry.tone}`} href={entry.href} key={entry.label}>
                <span className="frost-terminal-entry-topline">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {counts[index] !== undefined && <span>{counts[index]} published</span>}
                </span>
                <span className="frost-terminal-entry-command">$ {entry.command}</span>
                <strong>{entry.label}</strong>
                <span className="frost-terminal-entry-description">{entry.description}</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>

        <p className="frost-terminal-footnote">No live market feed. No noise. Just the record as it grows.</p>
      </div>
    </section>
  )
}
