import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, GraduationCap, Search, X } from 'lucide-react'

export function CourseProgressBadge({ progress, completedLabel = 'Af', resumeLabel = 'Hervat' }) {
  if (!progress?.started) return null
  const done = progress.doneCount ?? progress.revealedCount ?? progress.seenUnits ?? 0
  const total = progress.total ?? progress.totalQuestions ?? progress.totalUnits ?? 0
  if (progress.completed) {
    return (
      <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
        {completedLabel} · {done}/{total}
      </span>
    )
  }
  return (
    <span className="text-[11px] font-medium text-pulsedeep dark:text-pulse">
      {resumeLabel} · {done}/{total}
    </span>
  )
}

export function CourseBlockHeader({ backTo, backLabel = 'Alle blokken', title, subtitle, statsLine }) {
  return (
    <div className="mb-6">
      {backTo ? (
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-inkmuted hover:text-pulsedeep mb-4 transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          {backLabel}
        </Link>
      ) : null}
      <h1 className="text-3xl font-black tracking-tight text-ink">{title}</h1>
      {subtitle ? <p className="text-sm text-inkmuted mt-1">{subtitle}</p> : null}
      {statsLine ? <p className="text-sm text-inkmuted mt-2">{statsLine}</p> : null}
    </div>
  )
}

export function CourseBlockIndex({ pageTitle, pageSubtitle, sections, className = '' }) {
  return (
    <div className={`max-w-3xl mx-auto ${className}`.trim()}>
      <div className="text-center mb-10">
        <p className="sm-anno text-pulsedeep mb-3">Platform</p>
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-ink mb-3">{pageTitle}</h1>
        {pageSubtitle ? (
          <p className="text-base text-inkmuted max-w-2xl mx-auto">{pageSubtitle}</p>
        ) : null}
      </div>
      {sections.map((section) => (
        <section key={section.title} className="mb-10" aria-labelledby={section.headingId}>
          <div className="mb-4 px-1 border-b border-hairline pb-3">
            <h2 id={section.headingId} className="text-base font-bold text-ink">
              {section.title}
            </h2>
            {section.subtitle ? (
              <p className="text-xs text-inkmuted mt-1">{section.subtitle}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-3">
            {section.blocks.map((block) => (
              <Link
                key={block.to}
                to={block.to}
                className={`group rounded-xl border border-hairline bg-panel p-5 transition-all duration-200 hover:border-pulse/40 hover:translate-x-0.5${block.className ?? ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-paper border border-hairline shrink-0">
                    <GraduationCap className="w-5 h-5 text-pulsedeep" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-ink">{block.label}</h3>
                    {block.meta ? (
                      <p className="text-xs text-inkmuted mt-0.5">{block.meta}</p>
                    ) : null}
                    {block.extra ? <div className="mt-1">{block.extra}</div> : null}
                  </div>
                  <ChevronRight className="w-4 h-4 text-inkmuted group-hover:text-pulse shrink-0 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export function CourseModuleSearch({ query, onChange, placeholder = 'Zoek module…' }) {
  return (
    <div className="relative mb-5">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-inkmuted" />
      <input
        type="search"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-hairline bg-panel py-2.5 pl-10 pr-10 text-sm text-ink placeholder:text-inkmuted/70 focus:outline-none focus:ring-2 focus:ring-pulse/30 focus:border-pulse/50"
      />
      {query ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-inkmuted hover:text-ink"
          aria-label="Zoekopdracht wissen"
        >
          <X className="w-4 h-4" />
        </button>
      ) : null}
    </div>
  )
}

export function CourseWeekExpandControls({ onExpandAll, onCollapseAll }) {
  return (
    <div className="flex justify-end gap-2 mb-4">
      <button
        type="button"
        onClick={onExpandAll}
        className="text-xs font-medium text-inkmuted hover:text-pulsedeep transition-colors"
      >
        Alles open
      </button>
      <span className="text-hairline">·</span>
      <button
        type="button"
        onClick={onCollapseAll}
        className="text-xs font-medium text-inkmuted hover:text-pulsedeep transition-colors"
      >
        Alles dicht
      </button>
    </div>
  )
}

export function CourseWeekAccordionHeader({ weekName, moduleCount, isOpen, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-paper transition-colors"
    >
      <ChevronDown
        className={`w-4 h-4 text-inkmuted shrink-0 transition-transform ${isOpen ? '' : '-rotate-90'}`}
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-ink">{weekName}</p>
        <p className="text-xs text-inkmuted">
          {moduleCount} module{moduleCount === 1 ? '' : 's'}
        </p>
      </div>
    </button>
  )
}
