import { useEffect } from 'react'
import { loadMotion } from '../lib/loadMotion'

let lenisInstance = null

export function getLenis() {
  return lenisInstance
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
