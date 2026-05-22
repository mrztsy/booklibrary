import Icon from './Icon'

export default function Footer() {
  const navItems = [
    { label: 'Beranda',      href: '#beranda',  icon: 'home' },
    { label: 'Koleksi Buku', href: '#koleksi',  icon: 'collection' },
    { label: 'Katalog API',  href: '#katalog',  icon: 'cloud' },
    { label: 'Tentang',      href: '#tentang',  icon: 'info' },
  ]

  const genres = [
    { label: 'Fiction',   icon: 'bookOpen' },
    { label: 'Fantasy',   icon: 'star' },
    { label: 'Sci-Fi',    icon: 'flask' },
    { label: 'Distopia',  icon: 'globe' },
    { label: 'Romance',   icon: 'heart' },
    { label: 'Filsafat',  icon: 'info' },
  ]

  return (

    <footer className="border-t border-slate-200 bg-ink text-parchment-100/70 font-crimson">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <Icon name="bookOpen" className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <span className="font-playfair font-bold text-lg text-white">Folio</span>
            </div>
            <p className="text-sm leading-relaxed">
              Platform perpustakaan digital untuk menemukan buku lokal
              dan katalog klasik dari API.
            </p>
          </div>

          <nav aria-label="Navigasi footer">
            <h4 className="font-playfair font-semibold text-white mb-4 text-sm">
              Navigasi
            </h4>
            <ul className="space-y-2 text-sm">
              {navItems.map(item => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="inline-flex items-center gap-2
                               hover:text-amber-400 transition-colors duration-200"
                  >
                    <Icon name={item.icon} className="w-3.5 h-3.5" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h4 className="font-playfair font-semibold text-white mb-4 text-sm">
              Genre Populer
            </h4>
            <ul className="space-y-2 text-sm">
              {genres.map(item => (
                <li key={item.label}>
                  <a
                    href="#koleksi"
                    className="inline-flex items-center gap-2
                               hover:text-amber-400 transition-colors duration-200"
                  >
                    <Icon name={item.icon} className="w-3.5 h-3.5" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-playfair font-semibold text-white mb-4 text-sm">
              Newsletter
            </h4>
            <p className="text-sm mb-4 leading-relaxed">
              Dapatkan rekomendasi buku terbaru langsung di email kamu.
            </p>

            <form
              action="#"
              method="post"
              aria-label="Form berlangganan newsletter"
              className="flex gap-2"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Alamat email
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                placeholder="Email kamu..."
                autoComplete="email"
                required
                className="flex-1 bg-ink-700 border border-ink-600 text-white text-sm
                           px-3 py-2 rounded-lg outline-none
                           focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30
                           placeholder:text-parchment-100/30 transition-colors duration-200"
              />
              <button
                type="submit"
                aria-label="Daftar newsletter"
                className="bg-amber-500 hover:bg-amber-400 text-white
                           px-3 py-2 rounded-lg transition-colors duration-200"
              >
                <Icon name="pen" className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6
                        flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-parchment-100/40">
            © 2024 Folio Book Library. Dibuat untuk para pembaca.
          </p>
          <div className="flex gap-6 text-xs">
            {['Privasi', 'Syarat', 'Kontak'].map(item => (
              <a
                key={item}
                href="#"
                className="text-parchment-100/40 hover:text-amber-400 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
