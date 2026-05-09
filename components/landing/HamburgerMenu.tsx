'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Logo } from './Logo'

const items = [
  { label: 'Home', href: '/' },
  // Multiplayer route placeholder — wired up when battle mode lands.
  { label: 'Practice', href: '/play' },
]

export function HamburgerMenu() {
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const panel = (
    <div
      className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Close menu"
        onClick={() => setOpen(false)}
        className={`absolute inset-0 h-full w-full cursor-default bg-ink/40 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        className={`absolute left-0 top-0 flex h-full w-72 max-w-[80%] flex-col bg-[var(--sticky)] transition-transform duration-200 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundImage: 'var(--fiber-lines), var(--paper-noise)',
          borderRight: '2px solid var(--ink)',
          boxShadow: '6px 0 18px rgba(74,51,24,0.18)',
        }}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <Logo size="sm" />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="paper-icon-button flex h-9 w-9 items-center justify-center text-ink transition-transform hover:-rotate-3"
          >
            <X className="doodle-icon h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-2 px-4 pb-6">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="paper-card-base font-label block px-3 py-3 text-xl text-ink transition-transform hover:-rotate-1"
              style={
                {
                  '--paper-card-color': '#fffdf7',
                  '--paper-card-rotate': '0.25deg',
                } as React.CSSProperties
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  )

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="paper-icon-button flex h-10 w-10 items-center justify-center text-ink transition-transform hover:-rotate-3"
      >
        <Menu className="doodle-icon h-5 w-5" />
      </button>
      {mounted && createPortal(panel, document.body)}
    </>
  )
}
