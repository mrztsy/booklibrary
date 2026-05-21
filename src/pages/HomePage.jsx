import { useState, useEffect } from 'react'
import BookCard from '../components/BookCard'
import BookModal from '../components/BookModal'
import SearchFilter from '../components/SearchFilter'
import Icon from '../components/Icon'
import { LOCAL_BOOKS, GENRES, SORT_OPTIONS } from '../data/books'

const DEFAULT_FILTERS = {
  query: '',
  genre: 'Semua Genre',
  sort: 'default',
  yearMin: 1800,
  minRating: 0,
  onlyAvailable: false,
  onlyFeatured: false,
}

function StatBadge({ icon, label, value, dark = false }) {
  return (
    <div className="px-4 py-4 flex items-center gap-3">
      <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${dark ? 'bg-white/10 text-amber-200' : 'bg-amber-50 text-amber-600'}`}>
        <Icon name={icon} className="w-4 h-4" />
      </span>
      <span>
        <span className={`block text-2xl font-extrabold leading-none ${dark ? 'text-white' : 'text-ink'}`}>{value}</span>
        <span className={`block text-xs font-medium mt-1 ${dark ? 'text-white/60' : 'text-slate-500'}`}>{label}</span>
      </span>
    </div>
  )
}

export default function HomePage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [selectedBook, setSelectedBook] = useState(null)
  const [filteredBooks, setFilteredBooks] = useState(LOCAL_BOOKS)
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    let result = [...LOCAL_BOOKS]

    if (filters.query.trim()) {
      const q = filters.query.toLowerCase()
      result = result.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.tags || []).some(t => t.toLowerCase().includes(q))
      )
    }

    if (filters.genre !== 'Semua Genre') {
      result = result.filter(b => b.genre === filters.genre)
    }

    result = result.filter(b => b.year >= filters.yearMin)
    result = result.filter(b => b.rating >= filters.minRating)

    if (filters.onlyAvailable) result = result.filter(b => b.available)
    if (filters.onlyFeatured) result = result.filter(b => b.featured)

    switch (filters.sort) {
      case 'title_asc': result.sort((a, b) => a.title.localeCompare(b.title)); break
      case 'title_desc': result.sort((a, b) => b.title.localeCompare(a.title)); break
      case 'year_asc': result.sort((a, b) => a.year - b.year); break
      case 'year_desc': result.sort((a, b) => b.year - a.year); break
      case 'rating_desc': result.sort((a, b) => b.rating - a.rating); break
      case 'pages_asc': result.sort((a, b) => a.pages - b.pages); break
      default: break
    }

    setFilteredBooks(result)
  }, [filters])

  const featuredBooks = LOCAL_BOOKS.filter(b => b.featured)
  const [heroIndex, setHeroIndex] = useState(0)
  const heroBook = featuredBooks[heroIndex]

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(i => (i + 1) % featuredBooks.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [featuredBooks.length])

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-800 bg-ink text-white" aria-label="Featured books">
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center opacity-45 blur-2xl"
          style={{ backgroundImage: `url(${heroBook.cover})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/60" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(245,158,11,0.22),transparent_34%)]" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
            <div>
              <p className="section-label mb-3 text-amber-300">Buku Pilihan Minggu Ini</p>
              <h1 className="font-playfair font-extrabold text-4xl lg:text-6xl text-white leading-tight mb-4 max-w-2xl">
                {heroBook.title}
              </h1>
              <p className="text-slate-200 text-lg mb-3">
                oleh <span className="text-amber-200 font-semibold">{heroBook.author}</span>
                <span className="mx-2 text-white/30">-</span>
                <span>{heroBook.year}</span>
              </p>
              <p className="text-slate-300 leading-relaxed mb-8 max-w-xl line-clamp-3">
                {heroBook.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => setSelectedBook(heroBook)} className="btn-primary">
                  <Icon name="eye" className="w-4 h-4" strokeWidth={2} />
                  Lihat Detail
                </button>
              </div>

              <div className="flex gap-2 mt-8">
                {featuredBooks.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300
                      ${i === heroIndex ? 'w-8 bg-amber-300' : 'w-2 bg-white/15 hover:bg-white/30'}`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative w-64">
                <img
                  key={heroBook.id}
                  src={heroBook.cover}
                  alt={heroBook.title}
                  className="w-full rounded-lg border border-white/10 shadow-2xl"
                  style={{ animation: 'fadeInUp 0.4s ease-out' }}
                  onError={e => { e.target.style.display = 'none' }}
                />
                <div className="absolute -bottom-4 -right-4 bg-white/95 text-ink border border-white/30 px-3 py-1.5 rounded-lg shadow-book backdrop-blur">
                  <span className="font-bold text-lg flex items-center gap-2">
                    <Icon name="star" className="w-4 h-4 text-amber-500" />
                    Rating {heroBook.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-white/[0.06] backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 divide-x divide-white/10">
              <StatBadge icon="collection" label="Total Koleksi" value="12+" dark />
              <StatBadge icon="users" label="Penulis" value="12" dark />
              <StatBadge icon="tag" label="Genre" value="8" dark />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0" aria-label="Filter panel">
            <SearchFilter
              filters={filters}
              setFilters={setFilters}
              genres={GENRES}
              sortOptions={SORT_OPTIONS}
              onReset={() => setFilters(DEFAULT_FILTERS)}
              totalResults={filteredBooks.length}
            />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <p className="section-label">Koleksi Buku</p>
                <h2 className="font-bold text-2xl text-ink">
                  {filters.query
                    ? `Hasil untuk "${filters.query}"`
                    : filters.genre !== 'Semua Genre'
                      ? filters.genre
                      : 'Semua Buku'
                  }
                </h2>
              </div>

              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                {[
                  { mode: 'grid', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
                  { mode: 'list', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
                ].map(({ mode, icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`p-2 rounded-md transition-all duration-200
                      ${viewMode === mode ? 'bg-white shadow-sm text-amber-600' : 'text-slate-400 hover:text-ink'}`}
                    aria-label={`Tampilan ${mode}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {filteredBooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h3 className="font-semibold text-xl text-ink mb-2">Buku Tidak Ditemukan</h3>
                <p className="text-slate-500 mb-4 max-w-xs">
                  Coba ubah kata kunci atau filter yang kamu gunakan.
                </p>
                <button onClick={() => setFilters(DEFAULT_FILTERS)} className="btn-secondary text-sm">
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'flex flex-col gap-3'
              }>
                {filteredBooks.map((book, i) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onClick={setSelectedBook}
                    index={i}
                    variant={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </>
  )
}
