import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ChevronDown,
  LogIn,
  LogOut,
  Settings,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAccess } from '../hooks/useAccess'
import { useReward } from '../context/RewardContext'
import { getSubscriptionRenewalState } from '../lib/subscriptionRenewal'
import { DEFAULT_PFP_URL } from '../constants/defaultPfps'
import { getRewardPfpById } from '../constants/rewardPfps'
import { assetUrl } from '../utils/landingLinks'

const navItems = [
  { name: 'Home', href: '/' },
  {
    name: 'Samenvattingen',
    href: '/summary',
    subGroups: [
      { label: 'Ba1', links: [
        { name: 'Blok 3', href: '/summary-blok3' },
        { name: 'Blok 4', href: '/summary-blok4' },
        { name: 'Blok 5', href: '/summary-blok5' },
      ]},
      { label: 'Ba2', links: [
        { name: 'Blok 9', href: '/summary-blok9' },
        { name: 'Blok 10', href: '/summary-blok10' },
      ]},
    ],
  },
  {
    name: 'Oefenvragen',
    href: '/oefenvragen',
    subGroups: [
      { label: 'Ba1', links: [
        { name: 'Blok 3', href: '/oefenvragen-blok3' },
        { name: 'Blok 4', href: '/oefenvragen-blok4' },
        { name: 'Blok 5', href: '/oefenvragen-blok5' },
      ]},
      { label: 'Ba2', links: [
        { name: 'Blok 9', href: '/oefenvragen-blok9' },
        { name: 'Blok 10', href: '/oefenvragen-blok10' },
      ]},
    ],
  },
  {
    name: 'Tentamens',
    href: '/tentamen',
    subGroups: [
      { label: 'Ba1', links: [
        { name: 'Blok 4', href: '/tentamen-blok4' },
        { name: 'Blok 5', href: '/tentamen-blok5' },
      ]},
      { label: 'Ba2', links: [
        { name: 'Blok 9', href: '/tentamen-blok9' },
        { name: 'Blok 10', href: '/tentamen-blok10' },
      ]},
    ],
  },
  {
    name: 'Flashcards',
    href: '/flashcards',
    subGroups: [
      { label: 'Ba1', links: [
        { name: 'Blok 4', href: '/flashcards-blok4' },
        { name: 'Blok 5', href: '/flashcards-blok5' },
      ]},
      { label: 'Ba2', links: [
        { name: 'Blok 9', href: '/flashcards-blok9' },
        { name: 'Blok 10', href: '/flashcards-blok10' },
      ]},
    ],
  },
  { name: 'AI Chat', href: '/chat' },
]

function isActivePath(href, pathname, search = '') {
  const full = pathname + search
  if (href === '/') return pathname === '/'
  return full === href || pathname === href.split('?')[0] || pathname.startsWith(href.split('?')[0] + '-')
}

function isActiveDropdown(item, pathname, search) {
  if (!item.subGroups) return false
  if (item.href && isActivePath(item.href, pathname, search)) return true
  return item.subGroups.some((g) =>
    g.links.some((l) => isActivePath(l.href, pathname, search)),
  )
}

function userDisplayLabel(user) {
  const n = user?.displayName?.trim()
  if (n) return n
  return user?.email ?? ''
}

function userDisplayTitle(user) {
  const n = user?.displayName?.trim()
  const e = user?.email ?? ''
  if (n && e) return `${n} · ${e}`
  return e || n || ''
}

function UserAvatar({ user, className = '' }) {
  const { selectedRewardPfp } = useReward()
  if (selectedRewardPfp) {
    const pfp = getRewardPfpById(selectedRewardPfp)
    if (pfp?.image) {
      return (
        <img
          src={pfp.image}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className={`rounded-full object-cover ${className}`}
        />
      )
    }
  }
  const photo = user?.photoURL?.trim() || DEFAULT_PFP_URL
  return (
    <img
      src={photo}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      className={`rounded-full object-cover ${className}`}
      onError={(e) => {
        e.currentTarget.onerror = null
        e.currentTarget.src = DEFAULT_PFP_URL
      }}
    />
  )
}

function ProfileMenuPanel({ user, onClose, onSignOut }) {
  return (
    <div
      role="menu"
      className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,16rem)] overflow-hidden rounded-2xl border border-hairline/80 bg-paper/95 p-2 shadow-[0_24px_60px_-24px_rgba(11,34,48,0.4)] backdrop-blur-xl ring-1 ring-white/70 dark:border-slate-600 dark:bg-slate-900/95 dark:ring-slate-700/80"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pulse/70 to-transparent" aria-hidden />
      <div className="relative mb-1 flex items-center gap-3 rounded-xl bg-panel px-3 py-3 ring-1 ring-hairline/70 dark:bg-slate-800 dark:ring-slate-600/60">
        <UserAvatar user={user} className="h-10 w-10 shrink-0 ring-2 ring-hairline dark:ring-slate-600" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink dark:text-slate-100" title={userDisplayLabel(user)}>
            {userDisplayLabel(user)}
          </p>
          {user.email ? (
            <p className="truncate text-xs font-medium text-navy-600 dark:text-slate-300" title={user.email}>
              {user.email}
            </p>
          ) : null}
        </div>
      </div>
      <Link
        to="/settings/profile"
        role="menuitem"
        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-panel hover:text-pulsedeep dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
        onClick={onClose}
      >
        <Settings className="h-4 w-4 shrink-0 text-navy-500 dark:text-slate-400" strokeWidth={2} />
        Profielinstellingen
      </Link>
      <div className="my-1 h-px bg-hairline/80 dark:bg-slate-700" aria-hidden />
      <button
        type="button"
        role="menuitem"
        onClick={onSignOut}
        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-700 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
      >
        <LogOut className="h-4 w-4 shrink-0" strokeWidth={2} />
        Uitloggen
      </button>
    </div>
  )
}

function NavTextLink({ to, children, active, className = '' }) {
  return (
    <Link
      to={to}
      className={`group relative pb-1 text-[13px] font-medium transition-colors ${
        active ? 'text-ink' : 'text-inkmuted hover:text-ink'
      } ${className}`.trim()}
    >
      {children}
      <span
        className={`absolute inset-x-0 bottom-0 h-px origin-left bg-pulse transition-transform duration-300 ${
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />
    </Link>
  )
}

function DesktopDropdown({ item, pathname, search }) {
  const active = isActiveDropdown(item, pathname, search)
  return (
    <div className="group relative">
      <NavTextLink to={item.href} active={active} className="inline-flex items-center gap-1">
        {item.name}
        <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-300 group-hover:rotate-180" strokeWidth={1.75} />
      </NavTextLink>
      <div className="pointer-events-none invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 translate-y-1 transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-hover:translate-y-0">
        <div className="relative min-w-[15.5rem] overflow-hidden rounded-2xl border border-hairline/80 bg-paper/95 shadow-[0_24px_60px_-24px_rgba(11,34,48,0.4)] backdrop-blur-xl ring-1 ring-white/70">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pulse/70 to-transparent" aria-hidden />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(11,34,48,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(11,34,48,0.03)_1px,transparent_1px)] bg-[size:12px_12px] opacity-40 pointer-events-none" aria-hidden />
          <div className="relative p-2">
            {item.subGroups.map((group, groupIdx) => (
              <div
                key={group.label}
                className={groupIdx > 0 ? 'mt-1 border-t border-hairline/70 pt-2' : ''}
              >
                <p className="sm-anno px-3 pb-1.5 pt-1 text-pulsedeep/80">
                  {group.label}
                </p>
                <div className="flex flex-col gap-0.5">
                  {group.links.map((link) => {
                    const linkActive = isActivePath(link.href, pathname, search)
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        className={`group/link flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-200 ${
                          linkActive
                            ? 'bg-panel text-pulsedeep shadow-sm ring-1 ring-pulse/15'
                            : 'text-ink/85 hover:bg-panel/90 hover:pl-3.5 hover:text-pulsedeep'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200 ${
                            linkActive ? 'bg-pulse scale-100' : 'bg-pulse/0 group-hover/link:bg-pulse/70'
                          }`}
                          aria-hidden
                        />
                        {link.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MobileNavGroup({ item, expanded, onToggle, onNavigate, pathname, search }) {
  if (!item.subGroups) {
    return (
      <Link
        to={item.href}
        onClick={onNavigate}
        className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink/90 transition-colors hover:bg-panel hover:text-ink"
      >
        {item.name}
      </Link>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-1">
        <Link
          to={item.href}
          onClick={onNavigate}
          className="min-w-0 flex-1 rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink/90 transition-colors hover:bg-panel hover:text-ink"
        >
          {item.name}
        </Link>
        <button
          type="button"
          aria-expanded={expanded}
          aria-label={expanded ? `${item.name} inklappen` : `${item.name} uitklappen`}
          onClick={onToggle}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink/70 transition-colors hover:bg-panel"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} strokeWidth={1.75} />
        </button>
      </div>
      {expanded ? (
        <div className="ml-3 border-l border-hairline pl-2 pb-1">
          {item.subGroups.map((group) => (
            <div key={group.label} className="mt-1">
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-inkmuted/70">
                {group.label}
              </p>
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={onNavigate}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-panel hover:text-pulsedeep"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

const Navbar = () => {
  const { user, loading: authLoading, signOut } = useAuth()
  const { hasAccess, plan, paidUntil, subscriptionStopped, loading: accessLoading } = useAccess()
  const { showRenewalReminder } = getSubscriptionRenewalState(plan, paidUntil, subscriptionStopped)
  const showBillingRenewalBadge = Boolean(user && !authLoading && !accessLoading && showRenewalReminder)

  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const location = useLocation()

  const hasFlashcardsTab = Boolean(user && !accessLoading)
  const visibleNavItems = hasFlashcardsTab ? navItems : navItems.filter((item) => item.name !== 'Flashcards')

  useEffect(() => {
    setMenuOpen(false)
    setMobileExpanded(null)
    setProfileOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    if (!profileOpen) return undefined
    const onPointerDown = (e) => {
      if (!profileRef.current?.contains(e.target)) setProfileOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setProfileOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [profileOpen])

  const closeMobile = () => {
    setMenuOpen(false)
    setMobileExpanded(null)
  }

  const loginHref = user ? '/summary' : '/login'

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline/70 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Smartium home">
          <img src={assetUrl('assets/smartium-logo.png')} alt="" className="h-8 w-8 object-contain" />
          <span className="text-lg font-black tracking-tight text-ink">Smartium</span>
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-5 xl:gap-7 lg:flex"
          aria-label="Hoofdnavigatie"
        >
          {visibleNavItems.map((item) =>
            item.subGroups ? (
              <DesktopDropdown
                key={item.name}
                item={item}
                pathname={location.pathname}
                search={location.search}
              />
            ) : (
              <NavTextLink
                key={item.name}
                to={item.href}
                active={isActivePath(item.href, location.pathname, location.search)}
              >
                {item.name}
              </NavTextLink>
            ),
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {!authLoading && user ? (
            <div ref={profileRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setProfileOpen((o) => !o)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-panel px-2 py-1.5 text-[13px] font-semibold text-ink shadow-sm transition hover:border-pulse/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-pulse/40 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              >
                <span className="relative">
                  <UserAvatar user={user} className="h-7 w-7" />
                  {showBillingRenewalBadge && (
                    <span
                      className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-panel dark:ring-slate-800"
                      title="Betalingsherinnering"
                      aria-label="Betalingsherinnering"
                    />
                  )}
                </span>
                <span className="hidden max-w-[9rem] truncate md:inline" title={userDisplayTitle(user)}>
                  {userDisplayLabel(user)}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 text-navy-500 transition-transform dark:text-slate-400 ${profileOpen ? 'rotate-180' : ''}`}
                  strokeWidth={1.75}
                />
              </button>
              {profileOpen ? (
                <ProfileMenuPanel
                  user={user}
                  onClose={() => setProfileOpen(false)}
                  onSignOut={() => { setProfileOpen(false); signOut() }}
                />
              ) : null}
            </div>
          ) : !authLoading ? (
            <Link to={loginHref} className="group relative hidden overflow-hidden pb-1 text-[13px] font-bold text-ink sm:inline-block">
              {user ? 'Naar app' : 'Inloggen'}
              <span className="absolute inset-x-0 bottom-0 h-px bg-ink/20" />
              <span className="absolute inset-x-0 bottom-0 h-px -translate-x-[105%] bg-pulse transition-transform duration-300 ease-out group-hover:translate-x-0" />
            </Link>
          ) : null}

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
              {visibleNavItems.map((item) => (
                <MobileNavGroup
                  key={item.name}
                  item={item}
                  expanded={mobileExpanded === item.name}
                  onToggle={() => setMobileExpanded((c) => (c === item.name ? null : item.name))}
                  onNavigate={closeMobile}
                  pathname={location.pathname}
                  search={location.search}
                />
              ))}
              {!authLoading && user ? (
                <>
                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-hairline bg-panel px-3 py-3 dark:border-slate-600 dark:bg-slate-800">
                    <UserAvatar user={user} className="h-9 w-9 shrink-0 ring-2 ring-hairline dark:ring-slate-600" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink dark:text-slate-100">{userDisplayLabel(user)}</p>
                      {user.email ? (
                        <p className="truncate text-xs font-medium text-navy-600 dark:text-slate-300">{user.email}</p>
                      ) : null}
                    </div>
                  </div>
                  <Link
                    to="/settings/profile"
                    onClick={closeMobile}
                    className="mt-2 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink hover:bg-panel dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    <Settings className="h-4 w-4 text-navy-500 dark:text-slate-400" strokeWidth={2} />
                    Profielinstellingen
                  </Link>
                  <button
                    type="button"
                    onClick={() => { signOut(); closeMobile() }}
                    className="block w-full rounded-lg px-3 py-2.5 text-left text-[15px] font-medium text-rose-700 hover:bg-rose-50"
                  >
                    Uitloggen
                  </button>
                </>
              ) : !authLoading ? (
                <Link
                  to={loginHref}
                  onClick={closeMobile}
                  className="mt-4 block rounded-lg border border-hairline bg-panel px-4 py-3 text-center text-sm font-bold text-ink transition-colors hover:border-pulse/50 hover:text-pulsedeep"
                >
                  <LogIn className="inline h-4 w-4 mr-1.5 -mt-0.5" strokeWidth={2} />
                  {user ? 'Naar app' : 'Inloggen'}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar
