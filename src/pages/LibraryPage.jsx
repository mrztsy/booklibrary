import BookCard from '../components/BookCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Icon from '../components/Icon'
import { LOCAL_BOOKS } from '../data/books'

const PLACEHOLDER_BOOKS = LOCAL_BOOKS.slice(0, 10)

const TOPICS = [
  { value: 'fiction',    label: 'Fiction',    icon: 'bookOpen' },
  { value: 'adventure',  label: 'Adventure',  icon: 'compass' },
  { value: 'mystery',    label: 'Mystery',    icon: 'eye' },
  { value: 'romance',    label: 'Romance',    icon: 'heart' },
  { value: 'philosophy', label: 'Philosophy', icon: 'scroll' },
  { value: 'science',    label: 'Science',    icon: 'flask' },
  { value: 'history',    label: 'History',    icon: 'globe' },
  { value: 'poetry',     label: 'Poetry',     icon: 'pen' },
]

export default function LibraryPage() {
  return (
    <>

      <section
        id="katalog"
        aria-labelledby="library-heading"
        className="bg-gradient-to-br from-ink to-ink-700 text-white py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="section-label text-amber-300 mb-2">Data Langsung dari API</p>
              <h1
                id="library-heading"
                className="font-playfair font-bold text-3xl lg:text-4xl leading-tight"
              >
                Perpustakaan Digital
              </h1>
              <p className="font-crimson text-white/60 mt-2 text-lg">
                Sumber:{' '}
                <span className="text-amber-300">Gutendex API</span>
                {' '}· Project Gutenberg
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-crimson text-white/50
                            bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
              Fetch API aktif di fase berikutnya
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Form pencarian katalog API"
        className="border-b border-slate-200 bg-white sticky top-[73px] z-30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

          <form
            action="#"
            method="get"
            aria-label="Pencarian buku dari API"
            noValidate
            className="flex flex-col sm:flex-row gap-4"
          >

            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <label htmlFor="api-search" className="sr-only">
                Cari judul atau penulis
              </label>
              <input
                id="api-search"
                type="search"
                name="search"
                placeholder="Cari judul atau penulis..."
                autoComplete="off"
                className="input-field pl-9"
              />
            </div>

            <fieldset className="flex gap-1.5 flex-wrap items-center">
              <legend className="sr-only">Pilih topik buku</legend>
              {TOPICS.map(t => (
                <label key={t.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="topic"
                    value={t.value}
                    defaultChecked={t.value === 'fiction'}
                    className="sr-only peer"
                  />
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs
                               font-semibold font-crimson rounded-lg border cursor-pointer
                               border-slate-200 bg-white text-slate-600
                               peer-checked:bg-ink peer-checked:text-white peer-checked:border-ink
                               hover:border-amber-300 hover:text-amber-700
                               transition-all duration-200"
                  >
                    <Icon name={t.icon} className="w-3.5 h-3.5" />
                    {t.label}
                  </span>
                </label>
              ))}
            </fieldset>

            <button type="submit" className="btn-primary whitespace-nowrap">
              <Icon name="search" className="w-4 h-4" strokeWidth={2} />
              Cari
            </button>
          </form>
        </div>
      </section>

      <section
        aria-labelledby="results-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <p className="section-label">Hasil API</p>
            <h2
              id="results-heading"
              className="font-playfair font-semibold text-xl text-ink"
            >
              Topik: <span className="text-amber-700">Fiction</span>
              <span className="font-crimson font-normal text-base text-slate-400 ml-2">
                · Halaman 1
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 text-sm font-crimson text-slate-500
                          bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <Icon name="collection" className="w-4 h-4 text-amber-500" />
            {PLACEHOLDER_BOOKS.length} buku dimuat
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mb-10">
          {PLACEHOLDER_BOOKS.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </div>

        <div
          className="border border-dashed border-amber-300 bg-amber-50 rounded-lg p-5 mb-8"
          role="note"
          aria-label="Catatan loading indicator"
        >
          <div className="flex items-center gap-3 mb-3">
            <Icon name="info" className="w-5 h-5 text-amber-600" />
            <p className="font-playfair font-semibold text-amber-800">
              Loading Indicator — Preview
            </p>
          </div>
          <p className="font-crimson text-sm text-amber-700 mb-4">
            Komponen <code className="bg-amber-100 px-1 rounded">LoadingSpinner</code> di bawah
            akan aktif saat Axios sedang fetch data di fase berikutnya.
          </p>
          <div className="bg-white rounded-lg border border-amber-200 overflow-hidden">
            <LoadingSpinner message="Mengambil data dari Gutendex API..." />
          </div>
        </div>

        <section
          aria-labelledby="stats-heading"
          className="bg-parchment-100 border border-parchment-200 rounded-lg p-6"
        >
          <p className="section-label mb-1">Statistik</p>
          <h3
            id="stats-heading"
            className="font-playfair font-semibold text-ink mb-5"
          >
            Top 5 Rating Tertinggi
          </h3>
          <div className="space-y-3">
            {[...PLACEHOLDER_BOOKS]
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 5)
              .map((book, i) => (
                <div key={book.id} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-slate-400 font-crimson">{i + 1}</span>
                  <span className="font-crimson text-sm text-slate-700 flex-1 truncate">
                    {book.title}
                  </span>
                  <div className="hidden sm:block flex-1 max-w-28">
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${(book.rating / 5) * 100}%` }}
                        role="meter"
                        aria-valuenow={book.rating}
                        aria-valuemin={0}
                        aria-valuemax={5}
                        aria-label={`Rating ${book.rating}`}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-crimson whitespace-nowrap">
                    ★ {book.rating}
                  </span>
                </div>
              ))}
          </div>
        </section>

        <nav
          aria-label="Paginasi hasil buku"
          className="flex items-center justify-center gap-3 mt-10"
        >
          <button type="button" className="btn-secondary text-sm py-2 px-4" disabled>
            ← Sebelumnya
          </button>
          <span className="font-playfair font-bold text-ink
                           bg-parchment-100 border border-parchment-200
                           px-4 py-2 rounded-lg">
            1
          </span>
          <button type="button" className="btn-secondary text-sm py-2 px-4">
            Berikutnya →
          </button>
        </nav>
      </section>
    </>
  )
}
