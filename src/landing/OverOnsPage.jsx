import { useRef } from 'react'
import { ArrowUpRight, BookOpenCheck, GraduationCap, HeartPulse, Sparkles } from 'lucide-react'
import Navbar from './Navbar'
import { SmoothScroll } from './smoothScroll'
import { LandingFooter } from './LandingFooter'
import { APP_URL, assetUrl } from '../utils/landingLinks'
import { useLandingReveal } from './useLandingReveal'

const VALUES = [
  {
    Icon: GraduationCap,
    title: 'Door studenten, voor studenten',
    text: 'Smartium is gebouwd door geneeskundestudenten die zelf door het nieuwe curriculum gingen. We weten precies waar je tegenaan loopt.',
  },
  {
    Icon: BookOpenCheck,
    title: 'Kwaliteit boven kwantiteit',
    text: 'Geen eindeloze stapels documenten, maar zorgvuldig samengestelde kernstof die aansluit op jouw blok en casussen.',
  },
  {
    Icon: Sparkles,
    title: 'Slim studeren',
    text: 'Samenvattingen, oefenvragen, tentamens en AI-ondersteuning versterken elkaar. Minder zoeken, meer echt leren.',
  },
  {
    Icon: HeartPulse,
    title: 'Altijd up-to-date',
    text: 'Het curriculum verandert, wij veranderen mee. Materiaal wordt continu bijgewerkt op basis van feedback van medestudenten.',
  },
]

const STATS = [
  { value: '250+', label: 'Actieve studenten' },
  { value: '5', label: 'Blokken gedekt' },
  { value: '1000+', label: 'Oefenvragen' },
  { value: '24/7', label: 'AI-ondersteuning' },
]

export default function OverOnsPage() {
  const heroRef = useRef(null)
  const missionRef = useRef(null)
  const valuesRef = useRef(null)
  const ctaRef = useRef(null)

  useLandingReveal(heroRef)
  useLandingReveal(missionRef)
  useLandingReveal(valuesRef)
  useLandingReveal(ctaRef)

  return (
    <SmoothScroll>
      <div className="landing-page min-h-screen">
        <Navbar />
        <main className="relative z-10 pt-[68px]">
          {/* Hero */}
          <section
            ref={heroRef}
            className="sm-grid-paper relative overflow-hidden border-b border-hairline bg-paper py-24 md:py-32"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-[15%] top-[15%] h-[min(60vw,32rem)] w-[min(60vw,32rem)] rounded-full bg-pulse/[0.07] blur-[100px]"
            />
            <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
              <p data-reveal-anno className="sm-anno text-pulsedeep">
                Over ons
              </p>
              <div className="relative mt-4 max-w-3xl">
                <h1
                  data-reveal-headline
                  className="text-4xl font-black leading-[1.02] tracking-tighter text-ink md:text-7xl"
                >
                  Gemaakt voor geneeskunde
                </h1>
                <span
                  data-reveal-rule
                  aria-hidden
                  className="absolute -bottom-4 left-0 h-px w-full max-w-[min(100%,30rem)] origin-left bg-pulse/70"
                />
              </div>
              <p data-reveal-copy className="mt-8 max-w-xl text-base leading-relaxed text-inkmuted md:text-lg">
                Opgericht door geneeskundestudenten in Rotterdam. Wat begon als gedeelde
                aantekeningen groeide uit tot een compleet platform voor het nieuwe curriculum.
              </p>
            </div>
          </section>

          {/* Missie + beeld */}
          <section
            ref={missionRef}
            className="relative overflow-hidden border-b border-hairline bg-panel py-24 md:py-32"
          >
            <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 px-6 lg:grid-cols-12 lg:gap-12 lg:px-10">
              <div className="lg:col-span-6">
                <p data-reveal-anno className="sm-anno text-pulsedeep">
                  Onze missie
                </p>
                <h2
                  data-reveal-headline
                  className="mt-4 max-w-xl text-3xl font-black leading-[1.05] tracking-tighter text-ink md:text-5xl"
                >
                  Structuur in je curriculum
                </h2>
                <p data-reveal-copy className="mt-6 max-w-lg text-base leading-relaxed text-inkmuted">
                  Het vernieuwde geneeskundecurriculum vraagt veel zelfstandigheid van
                  studenten. Colleges, casussen, leerdoelen en literatuur — het aanbod is
                  enorm, maar de structuur ontbreekt vaak. Wij vertalen die berg informatie
                  naar heldere samenvattingen, gerichte oefenvragen en realistische
                  tentamens, zodat jij je energie kunt steken in begrijpen in plaats van
                  zoeken.
                </p>
                <div data-reveal-group className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                  {STATS.map((stat) => (
                    <div key={stat.label} data-reveal-item>
                      <p className="text-3xl font-black tracking-tighter text-ink md:text-4xl">{stat.value}</p>
                      <p className="sm-anno mt-2 text-inkmuted/80">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative lg:col-span-5 lg:col-start-8">
                <div data-reveal-parallax>
                  <div
                    aria-hidden
                    className="absolute -right-3 -top-3 h-full w-full border border-hairline bg-paper/80 md:-right-4 md:-top-4"
                  />
                  <figure
                    data-reveal-figure
                    className="relative overflow-hidden border border-hairline bg-paper p-2 shadow-[0_24px_60px_-24px_rgba(11,34,48,0.14)] will-change-[clip-path,opacity] md:p-3"
                  >
                    <img
                      src={assetUrl('assets/over-ons-brain.png')}
                      alt="Glazen anatomisch brein met een lichtgevende cyaan kern"
                      className="h-auto w-full"
                      loading="lazy"
                    />
                    <figcaption className="mt-3 flex items-center justify-between border-t border-hairline pt-3">
                      <span className="sm-anno text-inkmuted/75">Fig. 02 · Kennis</span>
                      <span className="sm-anno rounded border border-pulse/35 bg-pulse/[0.06] px-2 py-0.5 text-pulsedeep">
                        Helder
                      </span>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>
          </section>

          {/* Waarden */}
          <section
            ref={valuesRef}
            className="relative overflow-hidden bg-paper py-24 md:py-32"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 sm-grid-paper opacity-40"
            />
            <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
              <p data-reveal-anno className="sm-anno text-pulsedeep">
                Waar we voor staan
              </p>
              <h2
                data-reveal-headline
                className="mt-4 max-w-2xl text-3xl font-black leading-[1.05] tracking-tighter text-ink md:text-5xl"
              >
                Onze principes
              </h2>

              <div data-reveal-group className="mt-16 grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-2">
                {VALUES.map((value, i) => (
                  <article
                    key={value.title}
                    data-reveal-item
                    className="group relative bg-paper p-8 transition-colors duration-300 hover:bg-panel md:p-10"
                  >
                    <span className="sm-anno text-inkmuted/50" aria-hidden>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="mt-6 flex h-11 w-11 items-center justify-center rounded-xl border border-hairline bg-panel text-pulsedeep shadow-[0_1px_0_rgba(11,34,48,0.04)] transition-colors duration-300 group-hover:border-pulse/40">
                      <value.Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <h3 className="mt-5 text-xl font-bold tracking-tight text-ink">{value.title}</h3>
                    <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-inkmuted">{value.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section ref={ctaRef} className="relative border-t border-hairline bg-panel py-24 text-center md:py-32">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <h2
                data-reveal-headline
                className="mx-auto max-w-3xl text-3xl font-black leading-[1.05] tracking-tighter text-ink md:text-5xl"
              >
                Klaar om slimmer te studeren?
              </h2>
              <p data-reveal-copy className="mx-auto mt-5 max-w-md text-inkmuted">
                Maak gratis een account aan en ontdek wat Smartium voor jouw blok betekent.
              </p>
              <div data-reveal-group className="mt-10">
                <a
                  data-reveal-item
                  href={APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-sm border-2 border-ink px-8 py-4 font-bold text-ink transition-shadow duration-300 hover:shadow-[0_8px_24px_-8px_rgba(11,34,48,0.25)]"
                >
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-300 ease-out group-hover:scale-y-100" />
                  <span className="relative transition-colors duration-300 group-hover:text-paper">Naar de app</span>
                  <ArrowUpRight
                    className="relative h-4 w-4 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-paper"
                    strokeWidth={2.25}
                  />
                </a>
              </div>
            </div>
          </section>
        </main>
        <LandingFooter />
      </div>
    </SmoothScroll>
  )
}
