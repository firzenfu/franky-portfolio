import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'

type Command = {
  label: string
  description: string
  href: string
  group: 'Navigate' | 'Projects' | 'Connect'
  external?: boolean
}

function homeHref(anchor: string) {
  return window.location.pathname === '/' ? anchor : `/${anchor}`
}

function commands(): Command[] {
  return [
    { label: 'Home', description: 'Return to the opening scene', href: homeHref('#top'), group: 'Navigate' },
    { label: 'About', description: 'Read the short introduction', href: homeHref('#about'), group: 'Navigate' },
    { label: 'Selected work', description: 'Jump to project chapters', href: homeHref('#work'), group: 'Navigate' },
    { label: 'Skills', description: 'Explore capabilities and tools', href: homeHref('#skills'), group: 'Navigate' },
    { label: 'AI Support case study', description: 'Open the full product story', href: '/projects/ai-support-assistant', group: 'Projects' },
    { label: 'Monica Everett film', description: 'Watch the cinematic motion edit', href: homeHref('#monica-everett'), group: 'Projects' },
    { label: 'GitHub', description: 'View repositories and current work', href: 'https://github.com/firzenfu', group: 'Connect', external: true },
    { label: 'Contact', description: 'Start a conversation with Franky', href: homeHref('#contact'), group: 'Connect' },
  ]
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const shortcutModifier = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl'

  const items = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return commands()
    return commands().filter((command) =>
      `${command.label} ${command.description} ${command.group}`.toLowerCase().includes(normalized),
    )
  }, [query])

  function closePalette() {
    setOpen(false)
    setQuery('')
    setActiveIndex(0)
    window.setTimeout(() => triggerRef.current?.focus(), 0)
  }

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((current) => !current)
      }
      if (event.key === 'Escape' && open) {
        setOpen(false)
        setQuery('')
        setActiveIndex(0)
        window.setTimeout(() => triggerRef.current?.focus(), 0)
      }
    }

    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [open])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (activeIndex >= items.length) setActiveIndex(0)
  }, [activeIndex, items.length])

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => items.length ? (current + 1) % items.length : 0)
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => items.length ? (current - 1 + items.length) % items.length : 0)
    }
    if (event.key === 'Enter' && items[activeIndex]) {
      event.preventDefault()
      panelRef.current?.querySelector<HTMLAnchorElement>(`[data-command-index="${activeIndex}"]`)?.click()
    }
  }

  function trapFocus(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Tab') return
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>('input, a[href], button:not([disabled])')
    if (!focusable?.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        className="command-trigger"
        type="button"
        aria-label="Open command menu"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <span aria-hidden="true">{shortcutModifier}</span>
        <span>K</span>
      </button>

      {open && (
        <div className="command-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closePalette()
        }}>
          <div
            ref={panelRef}
            className="command-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="command-title"
            onKeyDown={trapFocus}
          >
            <div className="command-heading">
              <div>
                <p id="command-title">Command menu</p>
                <span>Go anywhere without leaving the keyboard.</span>
              </div>
              <button type="button" onClick={closePalette} aria-label="Close command menu">Esc</button>
            </div>
            <label className="command-search">
              <span className="sr-only">Search commands</span>
              <input
                ref={inputRef}
                type="search"
                aria-label="Search commands"
                value={query}
                placeholder="Search pages, projects, or actions"
                autoComplete="off"
                onChange={(event) => {
                  setQuery(event.target.value)
                  setActiveIndex(0)
                }}
                onKeyDown={handleInputKeyDown}
              />
              <kbd>↑↓</kbd>
            </label>

            <div className="command-results" role="listbox" aria-label="Commands">
              {items.map((command, index) => (
                <a
                  key={command.label}
                  className={index === activeIndex ? 'is-active' : ''}
                  href={command.href}
                  target={command.external ? '_blank' : undefined}
                  rel={command.external ? 'noreferrer' : undefined}
                  role="option"
                  aria-selected={index === activeIndex}
                  data-command-index={index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={closePalette}
                >
                  <span>
                    <strong>{command.label}</strong>
                    <small>{command.description}</small>
                  </span>
                  <em>{command.group}</em>
                </a>
              ))}
              {items.length === 0 && (
                <p className="command-empty">No command matches that search.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
