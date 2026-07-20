import { useEffect } from 'react'
import { loadMotion } from '../lib/loadMotion'

/**
 * Gedeelde scroll-reveals voor subpagina's, met dezelfde motion-taal als de
 * homepage: char-reveals voor mono-annotaties, masked word slides voor koppen
 * en lopende tekst, clip-path reveals voor figuren en hairline rules die
 * zichzelf tekenen. Elementen worden via data-attributen gemarkeerd:
 *
 *   data-reveal-anno      — mono label, char stagger + letter-spacing easing
 *   data-reveal-headline  — kop, masked word slide
 *   data-reveal-copy      — paragraaf, masked word slide (lichter)
 *   data-reveal-rule      — horizontale hairline, scaleX 0 → 1
 *   data-reveal-figure    — figuur/kaart, clip-path wipe van links
 *   data-reveal-item      — generiek blok, fade + rise met stagger per groep
 *   data-reveal-parallax  — zachte verticale parallax over de sectiescroll
 */
export function useLandingReveal(sectionRef) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const section = sectionRef.current
    if (reduced || !section) return

    let cancelled = false
    let cleanup

    void Promise.all([loadMotion(), import('split-type')]).then(
      ([{ gsap, ScrollTrigger }, { default: SplitType }]) => {
        if (cancelled) return

        const splits = []
        const splitOpts = {
          types: 'lines,words',
          lineClass: 'sm-split-line',
          wordClass: 'sm-split-word',
          tagName: 'span',
        }

        const trigger = (el, start = 'top 86%') => ({
          trigger: el,
          start,
          toggleActions: 'play none none none',
        })

        const ctx = gsap.context(() => {
          section.querySelectorAll('[data-reveal-anno]').forEach((el) => {
            const split = new SplitType(el, { types: 'chars', charClass: 'sm-split-char' })
            splits.push(split)
            gsap.set(el, { letterSpacing: '0.28em', opacity: 0 })
            gsap.to(el, {
              letterSpacing: '0.14em',
              opacity: 1,
              duration: 0.95,
              ease: 'power3.out',
              scrollTrigger: trigger(el),
            })
            if (split.chars?.length) {
              gsap.set(split.chars, { opacity: 0, y: 10 })
              gsap.to(split.chars, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power3.out',
                stagger: 0.035,
                delay: 0.12,
                scrollTrigger: trigger(el),
              })
            }
          })

          section.querySelectorAll('[data-reveal-headline]').forEach((el) => {
            const split = new SplitType(el, splitOpts)
            splits.push(split)
            if (!split.words?.length) return
            gsap.set(split.words, { yPercent: 110, opacity: 0 })
            gsap.to(split.words, {
              yPercent: 0,
              opacity: 1,
              duration: 1.05,
              ease: 'power4.out',
              stagger: 0.04,
              delay: 0.15,
              scrollTrigger: trigger(el),
            })
          })

          section.querySelectorAll('[data-reveal-copy]').forEach((el) => {
            const split = new SplitType(el, splitOpts)
            splits.push(split)
            if (!split.words?.length) return
            gsap.set(split.words, { yPercent: 105, opacity: 0 })
            gsap.to(split.words, {
              yPercent: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power4.out',
              stagger: 0.02,
              delay: 0.2,
              scrollTrigger: trigger(el, 'top 90%'),
            })
          })

          section.querySelectorAll('[data-reveal-rule]').forEach((el) => {
            gsap.set(el, { scaleX: 0, transformOrigin: 'left center' })
            gsap.to(el, {
              scaleX: 1,
              duration: 1.1,
              ease: 'power2.inOut',
              delay: 0.15,
              scrollTrigger: trigger(el, 'top 92%'),
            })
          })

          section.querySelectorAll('[data-reveal-figure]').forEach((el) => {
            gsap.set(el, { clipPath: 'inset(0 100% 0 0)', opacity: 0.6 })
            gsap.to(el, {
              clipPath: 'inset(0 0% 0 0)',
              opacity: 1,
              duration: 1.35,
              ease: 'power3.inOut',
              scrollTrigger: trigger(el, 'top 85%'),
            })
          })

          const items = [...section.querySelectorAll('[data-reveal-item]')]
          const groups = new Map()
          items.forEach((el) => {
            const key = el.closest('[data-reveal-group]') ?? el.parentElement
            if (!groups.has(key)) groups.set(key, [])
            groups.get(key).push(el)
          })
          groups.forEach((els) => {
            gsap.set(els, { opacity: 0, y: 26 })
            gsap.to(els, {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: 'power3.out',
              stagger: 0.1,
              scrollTrigger: trigger(els[0], 'top 88%'),
            })
          })

          section.querySelectorAll('[data-reveal-parallax]').forEach((el) => {
            gsap.fromTo(
              el,
              { y: 42 },
              {
                y: -42,
                ease: 'none',
                scrollTrigger: {
                  trigger: section,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.9,
                },
              },
            )
          })
        }, section)

        cleanup = () => {
          ctx.revert()
          splits.forEach((s) => s.revert?.())
        }

        ScrollTrigger.refresh()
      },
    )

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [sectionRef])
}
