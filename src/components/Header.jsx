import { useState } from 'react'
import Icon from './Icon'

export default function Header({ activePage, setActivePage }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { id: 'home', label: 'Beranda', icon: 'home' },
    { id: 'library', label: 'Katalog API', icon: 'cloud' },
    { id: 'about', label: 'Tentang', icon: 'info' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <button
            onClick={() => { setActivePage('home'); setMenuOpen(false) }}
            className="flex items-center gap-3 rounded-lg text-left"
          >
            <div className="w-10 h-10 bg-ink-800 rounded-lg flex items-center justify-center text-white shadow-book">
              <Icon name="bookOpen" className="w-5 h-5" />
            </div>
            <div>
              <span className="font-playfair font-extrabold text-xl tracking-tight text-ink">Folio</span>
              <span className="hidden sm:block text-[10px] tracking-[0.16em] uppercase text-slate-400 -mt-0.5">
                Book Library
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1 rounded-lg bg-slate-100 p-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => setActivePage(link.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200
                  ${activePage === link.id
                    ? 'bg-white text-amber-600 shadow-sm'
                    : 'text-slate-500 hover:text-ink'
                  }`}
              >
                <Icon name={link.icon} className="w-4 h-4" />
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage('library')}
              className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-white
                         px-3 py-2 text-sm font-semibold text-slate-600
                         hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 transition-all duration-200"
            >
              <Icon name="search" className="w-3.5 h-3.5" strokeWidth={2} />
              <span>Cari Buku</span>
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-ink hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-5 flex flex-col gap-1.5">
                <span className={`block h-0.5 bg-ink transition-all duration-300
                  ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block h-0.5 bg-ink transition-all duration-300
                  ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 bg-ink transition-all duration-300
                  ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => { setActivePage(link.id); setMenuOpen(false) }}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-lg transition-colors flex items-center gap-3
                  ${activePage === link.id
                    ? 'text-amber-600 bg-amber-50'
                    : 'text-slate-600 hover:text-ink hover:bg-slate-100'
                  }`}
              >
                <Icon name={link.icon} className="w-4 h-4" />
                {link.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
