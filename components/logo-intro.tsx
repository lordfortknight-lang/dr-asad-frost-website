'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const INTRO_DURATION = 2900

export function LogoIntro() {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    const navigationType = navigation?.type ?? 'navigate'
    const seen = window.sessionStorage.getItem('af-logo-intro-seen') === 'true'

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (navigationType === 'navigate' && seen) return

    window.sessionStorage.setItem('af-logo-intro-seen', 'true')
    setVisible(true)
    document.documentElement.classList.add('logo-intro-active')

    const finish = window.setTimeout(() => setLeaving(true), INTRO_DURATION)
    const remove = window.setTimeout(() => {
      setVisible(false)
      document.documentElement.classList.remove('logo-intro-active')
    }, INTRO_DURATION + 700)

    return () => {
      window.clearTimeout(finish)
      window.clearTimeout(remove)
      document.documentElement.classList.remove('logo-intro-active')
    }
  }, [])

  if (!visible) return null

  const skip = () => {
    setLeaving(true)
    window.setTimeout(() => {
      setVisible(false)
      document.documentElement.classList.remove('logo-intro-active')
    }, 550)
  }

  return (
    <div className={`logo-intro${leaving ? ' is-leaving' : ''}`} role="presentation">
      <div className="logo-intro-sweep" aria-hidden="true" />
      <div className="logo-intro-brandmark">
        <Image
          src="/file_0000000074548208beb7e7894cc30a31.png"
          alt="Dr Asad Frost — Dentist, Writer, Stock Market Enthusiast"
          width={1800}
          height={600}
          priority
          className="logo-intro-image"
        />
      </div>
      <button type="button" className="logo-intro-skip" onClick={skip}>
        Skip intro
      </button>
    </div>
  )
}
