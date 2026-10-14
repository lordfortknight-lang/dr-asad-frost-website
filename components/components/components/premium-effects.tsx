
'use client'

import { useEffect } from 'react'

export function PremiumEffects() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (reducedMotion) return

    const desktopPointer = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches

    const images = document.querySelectorAll<HTMLElement>(
      '.feature-image img, .essay-photo img'
    )

    let observer: IntersectionObserver | undefined

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

      images.forEach((img) => observer?.observe(img))
    } else {
      images.forEach((img) => img.classList.add('image-revealed'))
    }

    const buttons = desktopPointer
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
        button.style.translate = '0px 0px'
      }

      button.addEventListener('pointermove', move)
      button.addEventListener('pointerleave', reset)
      button.addEventListener('pointercancel', reset)

      cleanups.push(() => {
        button.removeEventListener('pointermove', move)
        button.removeEventListener('pointerleave', reset)
        button.removeEventListener('pointercancel', reset)
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
