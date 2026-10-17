
'use client'

import { useEffect } from 'react'

export function PremiumEffects() {
  useEffect(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const canHover = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches

    const images = document.querySelectorAll<HTMLElement>(
      '.feature-image img, .essay-photo img'
    )

    let observer: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('image-revealed')
              observer?.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12 }
      )
    }

    images.forEach((img) => {
      if (observer) {
        observer.observe(img)
      } else {
        img.classList.add('image-revealed')
      }
    })

    const buttons = canHover
      ? document.querySelectorAll<HTMLElement>(
          '.text-link, .contact-button, .studio-link'
        )
      : []

    const cleanups: (() => void)[] = []

    buttons.forEach((button) => {
      const move = (event: PointerEvent) => {
        const rect = button.getBoundingClientRect()
        const x = event.clientX - rect.left - rect.width / 2
        const y = event.clientY - rect.top - rect.height / 2

        button.style.translate =
          `${Math.max(-5, Math.min(5, x * 0.12))}px ` +
          `${Math.max(-4, Math.min(4, y * 0.12))}px`
      }

      const reset = () => {
        button.style.translate = ''
      }

      button.addEventListener('pointermove', move)
      button.addEventListener('pointerleave', reset)

      cleanups.push(() => {
        button.removeEventListener('pointermove', move)
        button.removeEventListener('pointerleave', reset)
        button.style.translate = ''
      })
    })

    return () => {
      observer?.disconnect()
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [])

  return null
}
