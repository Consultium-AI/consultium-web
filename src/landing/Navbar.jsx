import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { APP_URL, assetUrl } from '../utils/landingLinks'
import { scrollToTarget } from './smoothScroll'

const SECTION_LINKS = [
  { name: 'Waarom', target: '#waarom' },
  { name: 'Platform', target: '#platform' },
  { name: 'Prijzen', target: '#prijzen' },
]

const PAGE_LINKS = [
  { name: 'Over ons', href: '/over-ons' },
  { name: 'Contact', href: '/contact' },
]

function useSectionNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (target) => {
    if (location.pathname === '/') {
      scrollToTarget(target)
      return
    }
    navigate('/', { state: { scrollTo: target } })
  }
}

/** Scrollt naar een sectie wanneer je vanaf een andere pagina op een sectielink klikte. */
export function ScrollToSectionOnArrive() {
  const location = useLocation()

  useEffect(() => {
    const target = location.state?.scrollTo
    if (!target) return
    const t = setTimeout(() => scrollToTarget(target), 120)
    return () => clearTimeout(t)
  }, [location.state])

  return null
}

function NavUnderline({ active = false }) {
  return (
    <span
      className={`absolute inset-x-0 bottom-0 h-px origin-left bg-pulse transition-transform duration-300 ${
        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
      }`}
    />
  )
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const goToSection = useSectionNav()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline/70 bg-paper/80 backdrop-blur-md">
      <ScrollToSectionOnArrive />
      <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Smartium home">
          <img src={assetUrl('assets/smartium-logo.png')} alt="" className="h-8 w-8 object-contain" />
          <span className="text-lg font-black tracking-tight text-ink">Smartium</span>
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-5 xl:gap-7 lg:flex"
          aria-label="Hoofdnavigatie"
        >
          {SECTION_LINKS.map((item) => (
            <button
              key={item.target}
              type="button"
              onClick={() => goToSection(item.target)}
              className="group relative pb-1 text-[13px] font-medium text-inkmuted transition-colors hover:text-ink"
            >
              {item.name}
              <NavUnderline />
            </button>
          ))}
          {PAGE_LINKS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`group relative pb-1 text-[13px] font-medium transition-colors ${
                location.pathname === item.href ? 'text-ink' : 'text-inkmuted hover:text-ink'
              }`}
            >
              {item.name}
              <NavUnderline active={location.pathname === item.href} />
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative hidden items-center gap-2 overflow-hidden rounded-sm border-[1.5px] border-ink px-4 py-2 text-[13px] font-bold text-ink transition-shadow duration-300 hover:shadow-[0_8px_24px_-8px_rgba(11,34,48,0.3)] sm:inline-flex"
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-300 ease-out group-hover:scale-y-100" />
            <span className="relative transition-colors duration-300 group-hover:text-paper">Naar de app</span>
            <ArrowUpRight
              className="relative h-3.5 w-3.5 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-paper"
              strokeWidth={2.25}
            />
          </a>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-hairline text-ink lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Menu sluiten' : 'Menu openen'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.75">
              {menuOpen ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <>
                  <path strokeLinecap="round" d="M4 7h16" />
                  <path strokeLinecap="round" d="M4 12h16" />
                  <path strokeLinecap="round" d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="mobile-nav"
          className="max-h-[min(75vh,28rem)] overflow-y-auto border-t border-hairline bg-paper/95 backdrop-blur-md lg:hidden"
        >
          <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-0.5">
              {SECTION_LINKS.map((item) => (
                <button
                  key={item.target}
                  type="button"
                  onClick={() => { setMenuOpen(false); goToSection(item.target) }}
                  className="block rounded-lg px-3 py-2.5 text-left text-[15px] font-medium text-ink/90 transition-colors hover:bg-panel hover:text-ink"
                >
                  {item.name}
                </button>
              ))}
              {PAGE_LINKS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink/90 transition-colors hover:bg-panel hover:text-ink"
                >
                  {item.name}
                </Link>
              ))}
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded-lg border-[1.5px] border-ink bg-panel px-4 py-3 text-center text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Naar de app ↗
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar
