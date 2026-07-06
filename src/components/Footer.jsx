import { Link } from 'react-router-dom'
import { ArrowUpRight, Instagram, Mail, MapPin, Phone } from 'lucide-react'
import { assetUrl } from '../utils/landingLinks'

const navLinks = [
  { name: 'Samenvattingen', href: '/summary' },
  { name: 'Oefenvragen', href: '/oefenvragen' },
  { name: 'Tentamens', href: '/tentamen' },
  { name: 'Flashcards', href: '/flashcards' },
  { name: 'AI Chat', href: '/chat' },
  { name: 'Prijzen', href: '/billing' },
]

const legalDocs = [
  { label: 'Privacyverklaring', file: 'privacyverklaring-smartium.pdf' },
  { label: 'Cookiebeleid', file: 'cookiebeleid-smartium.pdf' },
  { label: 'Voorwaarden & regelgeving', file: 'smartium-regelgeving.pdf' },
]

const footerLinkClass =
  'text-sm text-white/60 transition-colors duration-200 hover:text-pulse dark:text-slate-400 dark:hover:text-cyan-400'

const Footer = () => (
  <footer className="relative z-10 overflow-hidden bg-ink text-paper dark:bg-[#060a10]">
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.04] [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px]"
      aria-hidden
    />
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pulse/50 to-transparent dark:via-cyan-500/40"
      aria-hidden
    />
    <div
      className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[min(90vw,36rem)] -translate-x-1/2 rounded-full bg-pulse/12 blur-[80px] dark:bg-cyan-500/8"
      aria-hidden
    />

    <div className="container-custom relative py-14 md:py-16">
      <div className="grid gap-12 md:grid-cols-12 md:gap-8 lg:gap-12">
        <div className="md:col-span-5">
          <Link to="/" className="group inline-flex items-center gap-3">
            <img
              src={assetUrl('assets/smartium-logo.png')}
              alt="Smartium"
              className="h-11 w-11 object-contain drop-shadow-[0_0_22px_rgba(6,182,212,0.35)] transition-transform duration-300 group-hover:scale-105 dark:drop-shadow-[0_0_22px_rgba(56,189,248,0.25)]"
            />
            <span className="font-display text-xl font-black tracking-tight text-white dark:text-slate-50">
              Smartium
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55 dark:text-slate-400">
            Studiemateriaal voor geneeskunde, afgestemd op het nieuwe curriculum.
          </p>
          <p className="mt-3 text-sm text-white/40 dark:text-slate-500">
            Een product van{' '}
            <span className="font-semibold text-white/65 dark:text-slate-300">Consultium</span>
          </p>
          <a
            href="https://www.instagram.com/smartiumcasusjes/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/75 backdrop-blur-sm transition-all duration-300 hover:border-pulse/35 hover:bg-pulse/10 hover:text-white dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:border-cyan-500/35 dark:hover:bg-cyan-500/10 dark:hover:text-slate-100"
          >
            <Instagram className="h-4 w-4 text-pulse dark:text-cyan-400" strokeWidth={1.75} />
            @smartiumcasusjes
            <ArrowUpRight className="h-3.5 w-3.5 opacity-40" strokeWidth={2} />
          </a>
        </div>

        <div className="md:col-span-3">
          <p className="sm-anno mb-5 text-pulse/75 dark:text-cyan-400/70">Navigatie</p>
          <nav className="flex flex-col gap-3" aria-label="Footer navigatie">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className={footerLinkClass}>
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="md:col-span-4">
          <p className="sm-anno mb-5 text-pulse/75 dark:text-cyan-400/70">Contact</p>
          <div className="space-y-4">
            <div className="flex gap-3">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-pulse/80 dark:text-cyan-400/70"
                strokeWidth={1.75}
              />
              <address className="not-italic text-sm leading-relaxed text-white/60 dark:text-slate-400">
                Westerstraat 10
                <br />
                3016 DH Rotterdam
                <br />
                Nederland
              </address>
            </div>
            <div className="flex items-center gap-3">
              <Phone
                className="h-4 w-4 shrink-0 text-pulse/80 dark:text-cyan-400/70"
                strokeWidth={1.75}
              />
              <a href="tel:0103603123" className={footerLinkClass}>
                010 360 3123
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail
                className="h-4 w-4 shrink-0 text-pulse/80 dark:text-cyan-400/70"
                strokeWidth={1.75}
              />
              <a href="mailto:SmartiumSupport@gmail.com" className={footerLinkClass}>
                SmartiumSupport@gmail.com
              </a>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/35 dark:text-slate-600">
            <span>KVK 96716606</span>
            <span aria-hidden className="text-white/20 dark:text-slate-700">
              ·
            </span>
            <span>BTW NL005227750B76</span>
          </div>
        </div>
      </div>

      <div className="relative mt-12 border-t border-white/[0.07] pt-8 dark:border-slate-800/80">
        <div className="flex flex-col flex-wrap items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-xs tracking-wide text-white/40 dark:text-slate-500">
            &copy; 2026 Smartium
          </p>
          <nav
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/40 dark:text-slate-500"
            aria-label="Privacy en juridische documenten"
          >
            {legalDocs.map((doc) => (
              <a
                key={doc.file}
                href={`${import.meta.env.BASE_URL}legal/${doc.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-pulse dark:hover:text-cyan-400"
              >
                {doc.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
