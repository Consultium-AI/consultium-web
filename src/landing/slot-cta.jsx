import { Link } from 'react-router-dom'
import { assetUrl, useGetStartedPath } from '../utils/landingLinks'
import { useEffect, useRef } from 'react'
import { loadMotion } from '../lib/loadMotion'
import { scrollToTarget } from './smoothScroll'

const AVATAR_IDS = [1, 3, 7, 12, 19, 24, 31]

export function LandingSlotCta() {
  const pathRef = useRef(null)
  const getStarted = useGetStartedPath()

  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    let cleanup

    void loadMotion().then(({ gsap }) => {
      if (cancelled) return
      const len = path.getTotalLength()
      path.style.strokeDasharray = String(len)
      path.style.strokeDashoffset = String(len * 0.7)
      const tween = gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: path, start: 'top 90%', end: 'top 40%', scrub: 0.7 },
      })
      cleanup = () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return (
    <section className="relative z-10 border-t border-hairline bg-panel pt-24 md:pt-36">
      <div className="mx-auto max-w-[1400px] px-6 text-center lg:px-10">
        <h2 className="mx-auto max-w-4xl text-4xl font-black leading-[1.04] tracking-tighter text-ink md:text-6xl lg:text-7xl">
          Begin vandaag met slimmer studeren.
        </h2>
        <svg className="mx-auto mt-10 w-full max-w-3xl" viewBox="0 0 720 60" fill="none" aria-hidden>
          <path
            ref={pathRef}
            d="M0 34 H210 L226 34 L238 10 L252 52 L266 22 L278 34 H442 L456 34 L466 16 L476 46 L486 34 H720"
            stroke="#06b6d4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="mt-10 flex flex-col items-center gap-4 pb-20 md:pb-28">
          <div className="flex -space-x-3.5">
            {AVATAR_IDS.map((id, i) => (
              <img
                key={id}
                src={assetUrl(`pfp-assets/pfp_${id}.png`)}
                alt=""
                aria-hidden={i > 0}
                loading="lazy"
                className="h-12 w-12 rounded-full border-2 border-panel bg-paper object-cover"
              />
            ))}
          </div>
          <p className="sm-anno text-inkmuted/80">Sluit je aan bij meer dan 250 medestudenten</p>
        </div>
      </div>
      <Link
        to={getStarted}
        className="group block bg-pulse py-9 text-center transition-colors duration-300 hover:bg-pulsedeep md:py-11"
      >
        <span className="inline-flex items-center justify-center gap-4 text-2xl font-black tracking-tight text-white transition-transform duration-300 group-hover:-skew-x-3 md:text-4xl">
          Aan de slag
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-3">→</span>
        </span>
      </Link>
    </section>
  )
}
