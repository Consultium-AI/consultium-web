import { useEffect } from 'react'
import { loadMotion } from '../lib/loadMotion'

let lenisInstance = null

export function getLenis() {
  return lenisInstance
}

/** Altijd hard naar boven — ook met Lenis actief. */
export function scrollPageToTop() {
  if (lenisInstance) {
    try {
      lenisInstance.scrollTo(0, { immediate: true, force: true })
    } catch {
      /* ignore */
    }
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

export function scrollToTarget(target) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: -72 })
    return
  }
  document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}

export function SmoothScroll({ children }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    let cleanup

    void loadMotion().then(({ gsap, ScrollTrigger, Lenis }) => {
      if (cancelled) return
      const lenis = new Lenis({ autoRaf: false, lerp: 0.11 })
      lenisInstance = lenis
      try {
        lenis.scrollTo(0, { immediate: true, force: true })
      } catch {
        /* ignore */
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      // Nog eens na eerste frame — voorkomt dat je halfweg de pagina landt
      requestAnimationFrame(() => {
        try {
          lenis.scrollTo(0, { immediate: true, force: true })
        } catch {
          /* ignore */
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      })
      lenis.on('scroll', ScrollTrigger.update)
      const tick = (time) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      cleanup = () => {
        gsap.ticker.remove(tick)
        lenis.destroy()
        lenisInstance = null
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return children
}
