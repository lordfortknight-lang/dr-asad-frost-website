import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import styles from './spatial-identity.module.css'

const destinations = [
  { index: '01', label: 'Journal', href: '/journal', detail: 'Essays, observations and notes in progress.' },
  { index: '02', label: 'Clinical World', href: '/clinical-world', detail: 'A living atlas of clinical knowledge.' },
  { index: '03', label: 'Archive', href: '/achievements', detail: 'Milestones, recognition and the long view.' },
]

export function SpatialIdentity() {
  return (
    <section className={styles.section} aria-labelledby="spatial-identity-title">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <span className="eyebrow">A spatial archive</span>
          <h2 id="spatial-identity-title">One mind. <em>Many worlds.</em></h2>
          <p>Explore the ideas, clinical knowledge and observations that shape the work of Dr Asad Frost.</p>
        </div>

        <div className={styles.stage}>
          <div className={`${styles.orbit} ${styles.orbitOne}`} aria-hidden="true" />
          <div className={`${styles.orbit} ${styles.orbitTwo}`} aria-hidden="true" />
          <div className={styles.brandmark}>
            <Image
              src="/file_0000000074548208beb7e7894cc30a31.png"
              alt="Dr Asad Frost — Dentist, Writer, Stock Market Enthusiast"
              width={1200}
              height={220}
              sizes="(max-width: 700px) 86vw, 620px"
              priority={false}
            />
          </div>
          <span className={styles.coordinate} aria-hidden="true">18° 31′ N / 73° 51′ E</span>
        </div>

        <nav className={styles.destinations} aria-label="Explore the archive">
          {destinations.map((destination) => (
            <Link className={styles.card} href={destination.href} key={destination.href}>
              <span className={styles.cardTopline}><span>{destination.index}</span><ArrowUpRight size={16} aria-hidden="true" /></span>
              <strong>{destination.label}</strong>
              <span>{destination.detail}</span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}
