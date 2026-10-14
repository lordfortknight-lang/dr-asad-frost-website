
'use client'

import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight

      if (scrollableHeight <= 0) {
        setProgress(0)
        return
      }

      const currentProgress =
        (window.scrollY / scrollableHeight) * 100

      setProgress(Math.min(100, Math.max(0, currentProgress)))
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
    <div
      className="reading-progress-track"
      aria-hidden="true"
    >
      <div
        className="reading-progress-bar"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
