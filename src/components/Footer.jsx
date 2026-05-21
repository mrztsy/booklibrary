import Icon from './Icon'

export default function Footer() {
  const navItems = [
    { label: 'Beranda', icon: 'home' },
    { label: 'Koleksi Buku', icon: 'collection' },
    { label: 'Katalog API', icon: 'cloud' },
    { label: 'Tentang', icon: 'info' },
  ]

  const genres = [
    { label: 'Fiction', icon: 'bookOpen' },
    { label: 'Fantasy', icon: 'star' },
    { label: 'Sci-Fi', icon: 'flask' },
    { label: 'Distopia', icon: 'globe' },
    { label: 'Romance', icon: 'heart' },
    { label: 'Filsafat', icon: 'info' },
  ]

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-ink-800 rounded-lg flex items-center justify-center">
                <Icon name="bookOpen" className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <span className="font-bold text-lg text-ink">Folio</span>
            </div>
            <p className="text-sm leading-relaxed">
              Platform perpustakaan digital untuk menemukan buku lokal dan katalog klasik dari API.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-ink mb-4 text-sm">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              {navItems.map(item => (
                <li key={item.label}>
                  <a href="#" className="inline-flex items-center gap-2 hover:text-amber-600 transition-colors duration-200">
                    <Icon name={item.icon} className="w-3.5 h-3.5" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-ink mb-4 text-sm">Genre Populer</h4>
            <ul className="space-y-2 text-sm">
              {genres.map(item => (
                <li key={item.label}>
                  <a href="#" className="inline-flex items-center gap-2 hover:text-amber-600 transition-colors duration-200">
                    <Icon name={item.icon} className="w-3.5 h-3.5" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-ink mb-4 text-sm">Newsletter</h4>
            <p className="text-sm mb-4 leading-relaxed">
              Dapatkan rekomendasi buku terbaru langsung di email kamu.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email kamu..."
                className="flex-1 bg-white border border-slate-200 text-ink text-sm px-3 py-2 rounded-lg outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 placeholder:text-slate-400 transition-colors duration-200"
              />
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm">
                <Icon name="pen" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">
            Copyright 2024 Folio Book Library. Dibuat untuk para pembaca.
          </p>
          <div className="flex gap-6 text-xs">
            {['Privasi', 'Syarat', 'Kontak'].map(item => (
              <a key={item} href="#" className="text-slate-400 hover:text-amber-600 transition-colors duration-200">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
