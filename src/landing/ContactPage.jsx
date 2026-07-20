import { useRef } from 'react'
import { ArrowUpRight, Instagram, Mail, MapPin, Phone } from 'lucide-react'
import Navbar from './Navbar'
import { SmoothScroll } from './smoothScroll'
import { LandingFooter } from './LandingFooter'
import { APP_URL, assetUrl } from '../utils/landingLinks'
import { useLandingReveal } from './useLandingReveal'

const FAQ = [
  {
    q: 'Voor welke opleiding is Smartium bedoeld?',
    a: 'Smartium is gemaakt voor geneeskundestudenten die het nieuwe curriculum volgen. Het materiaal is per blok en per casus georganiseerd.',
  },
  {
    q: 'Kan ik Smartium gratis proberen?',
    a: 'Ja. Met een gratis account krijg je beperkte toegang tot samenvattingen, oefenvragen en tentamens, plus een beperkt aantal AI-tokens.',
  },
  {
    q: 'Hoe kan ik mijn abonnement opzeggen?',
    a: 'Het maandabonnement is maandelijks opzegbaar via je accountinstellingen in de app. Geen kleine lettertjes.',
  },
  {
    q: 'Hoe snel krijg ik antwoord op een vraag?',
    a: 'We reageren doorgaans binnen één à twee werkdagen op e-mails. Voor snelle vragen kun je ons ook via Instagram bereiken.',
  },
]

const CONTACT_ROWS = [
  {
    Icon: Mail,
    label: 'E-mail',
    value: 'SmartiumSupport@gmail.com',
    href: 'mailto:SmartiumSupport@gmail.com',
  },
  {
    Icon: Phone,
    label: 'Telefoon',
    value: '010 360 3123',
    href: 'tel:+31103603123',
  },
  {
    Icon: Instagram,
    label: 'Instagram',
    value: '@smartiumcasusjes',
    href: 'https://www.instagram.com/smartiumcasusjes',
  },
  {
    Icon: MapPin,
    label: 'Adres',
    value: 'Westerstraat 10, 3016 DH Rotterdam',
  },
]

export default function ContactPage() {
  const heroRef = useRef(null)
  const faqRef = useRef(null)

  useLandingReveal(heroRef)
  useLandingReveal(faqRef)

  return (
    <SmoothScroll>
      <div className="landing-page min-h-screen">
        <Navbar />
        <main className="relative z-10 pt-[68px]">
          {/* Hero + contactgegevens */}
          <section
            ref={heroRef}
            className="sm-grid-paper relative overflow-hidden border-b border-hairline bg-paper py-24 md:py-32"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -left-[15%] bottom-[0%] h-[min(55vw,28rem)] w-[min(55vw,28rem)] rounded-full bg-pulse/[0.06] blur-[90px]"
            />
            <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-start gap-14 px-6 lg:grid-cols-12 lg:gap-12 lg:px-10">
              <div className="lg:col-span-6">
                <p data-reveal-anno className="sm-anno text-pulsedeep">
                  Contact
                </p>
                <div className="relative mt-4">
                  <h1
                    data-reveal-headline
                    className="max-w-xl text-4xl font-black leading-[1.02] tracking-tighter text-ink md:text-6xl"
                  >
                    Neem contact op
                  </h1>
                  <span
                    data-reveal-rule
                    aria-hidden
                    className="absolute -bottom-4 left-0 h-px w-full max-w-[min(100%,24rem)] origin-left bg-pulse/70"
                  />
                </div>
                <p data-reveal-copy className="mt-8 max-w-md text-base leading-relaxed text-inkmuted">
                  Of het nu gaat om je account, het studiemateriaal of een suggestie voor
                  een nieuw blok — stuur ons een bericht en we komen er snel op terug.
                </p>

                <div data-reveal-group className="mt-12 space-y-0 border-t border-hairline">
                  {CONTACT_ROWS.map((row) => {
                    const inner = (
                      <>
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-hairline bg-panel text-pulsedeep">
                          <row.Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                        </span>
                        <div className="min-w-0">
                          <p className="sm-anno text-inkmuted/70">{row.label}</p>
                          <p className="mt-0.5 truncate text-[15px] font-semibold text-ink transition-colors duration-200 group-hover:text-pulsedeep">
                            {row.value}
                          </p>
                        </div>
                        {row.href ? (
                          <ArrowUpRight
                            className="ml-auto h-4 w-4 shrink-0 text-inkmuted/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-pulse"
                            strokeWidth={2}
                          />
                        ) : null}
                      </>
                    )
                    const rowClass =
                      'group flex w-full items-center gap-4 border-b border-hairline py-5 text-left'
                    return row.href ? (
                      <a
                        key={row.label}
                        data-reveal-item
                        href={row.href}
                        target={row.href.startsWith('http') ? '_blank' : undefined}
                        rel={row.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className={rowClass}
                      >
                        {inner}
                      </a>
                    ) : (
                      <div key={row.label} data-reveal-item className={rowClass}>
                        {inner}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="relative lg:col-span-5 lg:col-start-8">
                <div data-reveal-parallax>
                  <div
                    aria-hidden
                    className="absolute -right-3 -top-3 h-full w-full border border-hairline bg-panel/80 md:-right-4 md:-top-4"
                  />
                  <figure
                    data-reveal-figure
                    className="relative overflow-hidden border border-hairline bg-panel p-2 shadow-[0_24px_60px_-24px_rgba(11,34,48,0.14)] will-change-[clip-path,opacity] md:p-3"
                  >
                    <img
                      src={assetUrl('assets/contact-stethoscope.png')}
                      alt="Glazen stethoscoop met een lichtgevend cyaan borststuk"
                      className="h-auto w-full"
                      loading="lazy"
                    />
                    <figcaption className="mt-3 flex items-center justify-between border-t border-hairline pt-3">
                      <span className="sm-anno text-inkmuted/75">Fig. 03 · Bereikbaar</span>
                      <span className="sm-anno rounded border border-pulse/35 bg-pulse/[0.06] px-2 py-0.5 text-pulsedeep">
                        Support
                      </span>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section ref={faqRef} className="relative overflow-hidden bg-panel py-24 md:py-32">
            <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
              <p data-reveal-anno className="sm-anno text-pulsedeep">
                Veelgestelde vragen
              </p>
              <h2
                data-reveal-headline
                className="mt-4 max-w-2xl text-3xl font-black leading-[1.05] tracking-tighter text-ink md:text-5xl"
              >
                Snel antwoord
              </h2>

              <div data-reveal-group className="mt-14 grid grid-cols-1 gap-x-14 gap-y-0 lg:grid-cols-2">
                {FAQ.map((item, i) => (
                  <article key={item.q} data-reveal-item className="relative border-t border-hairline py-8">
                    <div className="flex items-start gap-5">
                      <span className="sm-anno mt-1 shrink-0 text-pulsedeep/70" aria-hidden>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-ink">{item.q}</h3>
                        <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-inkmuted">{item.a}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div data-reveal-group className="mt-16 border-t border-hairline pt-10 text-center">
                <p data-reveal-item className="text-inkmuted">
                  Antwoord niet gevonden?{' '}
                  <a
                    href="mailto:SmartiumSupport@gmail.com"
                    className="font-semibold text-pulsedeep underline decoration-pulse/40 underline-offset-4 transition-colors hover:text-pulse"
                  >
                    Mail ons
                  </a>{' '}
                  of ga direct{' '}
                  <a
                    href={APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-pulsedeep underline decoration-pulse/40 underline-offset-4 transition-colors hover:text-pulse"
                  >
                    naar de app
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>
        </main>
        <LandingFooter />
      </div>
    </SmoothScroll>
  )
}
