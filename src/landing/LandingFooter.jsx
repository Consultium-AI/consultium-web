import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowUpRight, Instagram, Mail, MapPin, Phone } from 'lucide-react'
import { APP_URL, assetUrl } from '../utils/landingLinks'
import { scrollToTarget } from './smoothScroll'

const NAV_ITEMS = [
  { label: 'Waarom Smartium', target: '#waarom' },
  { label: 'Platform', target: '#platform' },
  { label: 'Prijzen', target: '#prijzen' },
]

const PAGE_LINKS = [
  { label: 'Over ons', to: '/over-ons' },
  { label: 'Contact', to: '/contact' },
]

const legalDocs = [
  { label: 'Privacyverklaring', file: 'privacyverklaring-smartium.pdf' },
  { label: 'Cookiebeleid', file: 'cookiebeleid-smartium.pdf' },
  { label: 'Voorwaarden & regelgeving', file: 'smartium-regelgeving.pdf' },
]

const footerLinkClass =
  'group inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors duration-200 hover:text-pulse'

export function LandingFooter() {
  const location = useLocation()
  const navigate = useNavigate()

  const goToSection = (target) => {
    if (location.pathname === '/') {
      scrollToTarget(target)
      return
    }
    navigate('/', { state: { scrollTo: target } })
  }

  return (
    <footer className="relative z-10 overflow-hidden bg-ink text-paper">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pulse/50 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[min(90vw,36rem)] -translate-x-1/2 rounded-full bg-pulse/12 blur-[80px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1400px] px-6 py-16 md:py-20 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 lg:gap-16">
          <div className="md:col-span-5">
            <Link to="/" className="group inline-flex items-center gap-3">
              <img
                src={assetUrl('assets/smartium-logo.png')}
                alt="Smartium"
                className="h-11 w-11 object-contain drop-shadow-[0_0_22px_rgba(6,182,212,0.35)] transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <span className="font-display text-xl font-black tracking-tight text-white">Smartium</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
              Studiemateriaal voor geneeskunde, afgestemd op het nieuwe curriculum.
            </p>
            <p className="mt-3 text-sm text-white/40">
              Een product van{' '}
              <span className="font-semibold text-white/65">Consultium</span>
            </p>
            <a
              href="https://www.instagram.com/smartiumcasusjes"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/75 backdrop-blur-sm transition-all duration-300 hover:border-pulse/35 hover:bg-pulse/10 hover:text-white"
            >
              <Instagram className="h-4 w-4 text-pulse" strokeWidth={1.75} />
              @smartiumcasusjes
              <ArrowUpRight
                className="h-3.5 w-3.5 opacity-40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={2}
              />
            </a>
          </div>

          <div className="md:col-span-3">
            <p className="sm-anno mb-5 text-pulse/75">Navigatie</p>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.target}>
                  <button
                    type="button"
                    onClick={() => goToSection(item.target)}
                    className={footerLinkClass}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              {PAGE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLinkClass}
                >
                  Naar de app
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="sm-anno mb-5 text-pulse/75">Contact</p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pulse/80" strokeWidth={1.75} />
                <address className="not-italic text-sm leading-relaxed text-white/60">
                  Westerstraat 10
                  <br />
                  3016 DH Rotterdam
                  <br />
                  Nederland
                </address>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-pulse/80" strokeWidth={1.75} />
                <a href="tel:+31103603123" className={`${footerLinkClass} !text-white/60`}>
                  010 360 3123
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-pulse/80" strokeWidth={1.75} />
                <a
                  href="mailto:SmartiumSupport@gmail.com"
                  className={`${footerLinkClass} !text-white/60`}
                >
                  SmartiumSupport@gmail.com
                </a>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/35">
              <span>KVK 96716606</span>
              <span aria-hidden className="text-white/20">
                ·
              </span>
              <span>BTW NL005227750B76</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 px-6 py-6 md:flex-row md:items-center lg:px-10">
          <p className="text-xs tracking-wide text-white/40">&copy; 2026 Smartium</p>
          <nav
            className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/40"
            aria-label="Juridische documenten"
          >
            {legalDocs.map((doc) => (
              <a
                key={doc.file}
                href={`${import.meta.env.BASE_URL}legal/${doc.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-pulse"
              >
                {doc.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
