import { useState } from 'react'
import { site } from '../../content/site'
import SocialLinks from '../ui/SocialLinks'

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Software', href: '#software' },
]

export default function Nav({ activeHref }: { activeHref?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-navy-lightest/60 bg-navy/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#home" className="font-serif text-lg font-bold text-slate-lightest">
          {site.name}
        </a>

        <ul className="hidden items-center gap-8 text-sm text-slate-light md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`transition-colors hover:text-mint ${
                  activeHref === link.href ? 'text-mint' : ''
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <SocialLinks links={site.social} />
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-slate-lightest md:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-navy-lightest/60 bg-navy px-6 py-6 md:hidden">
          <ul className="flex flex-col gap-4 text-slate-light">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`hover:text-mint ${activeHref === link.href ? 'text-mint' : ''}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <SocialLinks links={site.social} className="mt-6" />
        </div>
      )}
    </header>
  )
}
