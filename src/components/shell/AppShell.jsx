import Navbar from '../Navbar'
import Footer from '../Footer'

/** Vaste pagina-layout: navbar + klinische paper-achtergrond + optionele footer. */
export function AppShell({
  children,
  footer = true,
  className = '',
  mainClassName = 'container-custom py-10 md:py-14',
}) {
  return (
    <div className={`shell-page min-h-screen ${className}`.trim()}>
      <Navbar />
      <div className="h-[68px]" aria-hidden />
      <main className={`relative z-10 ${mainClassName}`.trim()}>{children}</main>
      {footer ? <Footer /> : null}
    </div>
  )
}

export function ShellPageIntro({ label, title, description, className = '' }) {
  return (
    <div className={`text-center mb-10 md:mb-12 max-w-2xl mx-auto space-y-3 ${className}`.trim()}>
      {label ? <p className="sm-anno text-pulsedeep">{label}</p> : null}
      <h1 className="text-3xl md:text-4xl font-black tracking-tight text-ink">{title}</h1>
      {description ? (
        <p className="text-sm md:text-base text-inkmuted leading-relaxed">{description}</p>
      ) : null}
    </div>
  )
}

export function shellCardClass(active = false) {
  return [
    'group flex min-w-0 items-center gap-4 rounded-xl border bg-panel px-4 py-4 transition-all duration-200 sm:px-5',
    active
      ? 'border-pulse/50 ring-1 ring-pulse/20'
      : 'border-hairline hover:border-pulse/40 hover:translate-x-0.5',
  ].join(' ')
}
