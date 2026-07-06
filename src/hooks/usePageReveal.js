import { useEffect, useRef } from 'react'
import { loadMotion } from '../lib/loadMotion'

/**
 * Smooth entrance reveal for app shell pages (login, chat, profile, …).
 * Respects prefers-reduced-motion.
 */
export function usePageReveal(deps = []) {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      root.style.opacity = '1'
      return undefined
    }

    let cancelled = false
    let cleanup

    void loadMotion().then(({ gsap }) => {
      if (cancelled) return

      const targets = root.querySelectorAll('[data-reveal]')
      gsap.set(root, { opacity: 1 })
      gsap.fromTo(
        targets.length ? targets : root,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: targets.length ? 0.08 : 0,
        },
      )

      cleanup = () => {
        gsap.killTweensOf(targets.length ? targets : root)
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return rootRef
}
