'use client'

import { useEffect, useRef } from 'react'

export function HeroOrb() {
  const orbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const orb = orbRef.current
    if (!orb || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const move = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2
      const y = (event.clientY / window.innerHeight - 0.5) * 2
      orb.style.setProperty('--orb-x', `${x * 12}px`)
      orb.style.setProperty('--orb-y', `${y * 12}px`)
    }

    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return (
    <div className="hero-orb-wrap">
      <div ref={orbRef} className="hero-orb" aria-hidden="true">
        <span className="hero-orb-core" />
        <span className="hero-orb-highlight" />
        <span className="hero-orbit hero-orbit-one" />
        <span className="hero-orbit hero-orbit-two" />
        <span className="hero-orb-dot hero-orb-dot-one" />
        <span className="hero-orb-dot hero-orb-dot-two" />
      </div>
      <span className="hero-orb-label">Curiosity / in motion</span>
    </div>
  )
}
