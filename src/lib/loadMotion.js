let motionPromise = null

async function importGsap() {
  const [gsapMod, stMod, lenisMod] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('lenis'),
  ])
  const gsap = gsapMod.default
  const { ScrollTrigger } = stMod
  gsap.registerPlugin(ScrollTrigger)
  return { gsap, ScrollTrigger, Lenis: lenisMod.default }
}

/** Client-only GSAP/Lenis loader. */
export function loadMotion() {
  motionPromise ??= importGsap()
  return motionPromise
}
