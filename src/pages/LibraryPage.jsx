import { useState, useEffect } from 'react'
import axios from 'axios'
import BookCard from '../components/BookCard'
import BookModal from '../components/BookModal'
import LoadingSpinner from '../components/LoadingSpinner'
import Icon from '../components/Icon'

const API_URL = 'https://gutendex.com/books'

export default function LibraryPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [topic, setTopic] = useState('fiction')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasNext, setHasNext] = useState(false)

  const TOPICS = [
    { value: 'fiction', label: 'Fiction', icon: 'bookOpen' },
    { value: 'adventure', label: 'Adventure', icon: 'compass' },
    { value: 'mystery', label: 'Mystery', icon: 'search' },
    { value: 'romance', label: 'Romance', icon: 'heart' },
    { value: 'philosophy', label: 'Philosophy', icon: 'info' },
    { value: 'science', label: 'Science', icon: 'flask' },
    { value: 'history', label: 'History', icon: 'scroll' },
    { value: 'poetry', label: 'Poetry', icon: 'pen' },
  ]

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = {
          topic,
          page,
          languages: 'en',
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim()
        }

        const response = await axios.get(API_URL, { params })
        const data = response.data

        setBooks(data.results || [])
        setTotalCount(data.count || 0)
        setHasNext(!!data.next)
      } catch (err) {
        if (axios.isCancel(err)) return
        setError('Gagal mengambil data. Periksa koneksi internet kamu.')
        console.error('Axios error:', err)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(fetchBooks, 400)
    return () => clearTimeout(debounce)
  }, [topic, page, searchQuery])

  useEffect(() => {
    setPage(1)
  }, [topic, searchQuery])

  const mapBook = (b) => ({
    id: b.id,
    title: b.title,
    author: b.authors?.[0]?.name || 'Unknown',
    authors: b.authors,
    cover: b.formats?.['image/jpeg'] || null,
    subjects: b.subjects?.slice(0, 3) || [],
    genre: b.subjects?.[0]?.split(' -- ')[0] || 'Classic',
    first_publish_year: b.copyright ? null : null,
    download_count: b.download_count,
    description: b.summaries?.[0] || `${b.title} adalah karya klasik yang tersedia di Project Gutenberg dengan ${b.download_count?.toLocaleString()} unduhan.`,
  })

  return (
    <>
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="section-label mb-2 inline-flex items-center gap-2">
                <Icon name="cloud" className="w-4 h-4" />
                Data Langsung dari API
              </p>
              <h1 className="font-extrabold text-3xl lg:text-5xl leading-tight text-ink">
                Perpustakaan Digital
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Sumber: <span className="text-amber-600 font-semibold">Gutendex API</span>
                {' '}dan Project Gutenberg
                {totalCount > 0 && (
                  <span className="ml-2 text-sm text-slate-400">
                    ({totalCount.toLocaleString()} buku tersedia)
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Koneksi API aktif
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form
          onSubmit={e => e.preventDefault()}
          className="bg-white border border-slate-200 rounded-lg shadow-book p-5 mb-8"
          aria-label="Form pencarian API"
          noValidate
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari judul atau penulis..."
                className="input-field pl-9"
                aria-label="Pencarian buku API"
              />
            </div>

            <div className="flex gap-1.5 flex-wrap">
              {TOPICS.map(t => (
                <label key={t.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="topic"
                    value={t.value}
                    checked={topic === t.value}
                    onChange={() => setTopic(t.value)}
                    className="sr-only"
                  />
                  <span className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer
                    ${topic === t.value
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-amber-200 hover:text-amber-600'
                    }`}>
                    <Icon name={t.icon} className="w-3.5 h-3.5" />
                    {t.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </form>

        {loading && <LoadingSpinner message="Mengambil data dari Gutendex API..." />}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="font-semibold text-xl text-ink mb-2">Terjadi Kesalahan</h3>
            <p className="text-slate-500 mb-4 max-w-xs">{error}</p>
            <button
              onClick={() => { setPage(1); setSearchQuery(''); setTopic('fiction') }}
              className="btn-primary text-sm"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && books.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-5 gap-4">
              <div>
                <p className="section-label">Hasil API</p>
                <h2 className="font-semibold text-xl text-ink capitalize">
                  {searchQuery ? `Hasil: "${searchQuery}"` : `Topik: ${topic}`}
                  <span className="font-normal text-base text-slate-400 ml-2">
                    - Halaman {page}
                  </span>
                </h2>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                {books.length} buku dimuat
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {books.map((b, i) => (
                <BookCard
                  key={b.id}
                  book={mapBook(b)}
                  onClick={() => setSelectedBook(mapBook(b))}
                  index={i}
                />
              ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 mb-8 shadow-book">
              <p className="section-label mb-3">Top 5 Paling Banyak Diunduh</p>
              <div className="space-y-2">
                {[...books]
                  .sort((a, b) => b.download_count - a.download_count)
                  .slice(0, 5)
                  .map(b => (
                    <div key={b.id} className="flex items-center gap-3">
                      <span className="text-sm text-slate-600 flex-1 truncate">
                        {b.title}
                      </span>
                      <div className="flex-1 max-w-32 hidden sm:block">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-700"
                            style={{
                              width: `${Math.min(100, (b.download_count / (books[0]?.download_count || 1)) * 100)}%`
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {b.download_count?.toLocaleString()} unduhan
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary text-sm py-2 px-4 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <span className="font-semibold text-ink bg-white border border-slate-200 px-4 py-2 rounded-lg">
                {page}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!hasNext}
                className="btn-secondary text-sm py-2 px-4 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Berikutnya
              </button>
            </div>
          </>
        )}

        {!loading && !error && books.length === 0 && (
          <div className="text-center py-20">
            <p className="font-semibold text-xl text-ink mb-2">Tidak ada hasil</p>
            <p className="text-slate-500">Coba kata kunci atau topik yang berbeda.</p>
          </div>
        )}
      </main>

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </>
  )
}
