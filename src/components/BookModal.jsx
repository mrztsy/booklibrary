import { useEffect, useState } from 'react'

export default function BookModal({ book, onClose }) {
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!book) return null

  const authorName = book.authors
    ? book.authors.map(a => a.name).join(', ')
    : book.author

  const coverUrl = book.cover || book.formats?.['image/jpeg']

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop bg-ink/60"
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`Detail buku: ${book.title}`}
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-[fadeInUp_0.25s_ease-out]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          aria-label="Tutup modal"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col sm:flex-row gap-0">
          <div className="sm:w-52 flex-shrink-0 bg-slate-100">
            {coverUrl && !imgError ? (
              <img
                src={coverUrl}
                alt={`Cover ${book.title}`}
                className="w-full sm:h-full object-cover max-h-60 sm:max-h-none"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-52 sm:h-full bg-gradient-to-br from-teal-700 to-cyan-600 flex items-center justify-center p-6">
                <p className="font-semibold text-white/80 text-center leading-relaxed">{book.title}</p>
              </div>
            )}
          </div>

          <div className="flex-1 p-6">
            <p className="section-label mb-2">{book.genre || book.subjects?.[0] || 'Classic'}</p>
            <h2 className="font-bold text-2xl text-ink leading-tight mb-1">
              {book.title}
            </h2>
            <p className="text-slate-500 mb-4">oleh <span className="font-semibold text-ink">{authorName}</span></p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'Tahun', value: book.year || book.first_publish_year || '-' },
                { label: 'Halaman', value: book.pages ? `${book.pages} hal` : '-' },
                { label: 'Status', value: book.available === false ? 'Dipinjam' : 'Tersedia' },
                { label: 'Rating', value: book.rating ? `${book.rating} / 5.0` : '-' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="font-semibold text-ink text-sm">{value}</p>
                </div>
              ))}
            </div>

            {book.description && (
              <div className="mb-5">
                <h3 className="font-semibold text-sm mb-2 text-ink">Sinopsis</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {typeof book.description === 'object' ? book.description.value : book.description}
                </p>
              </div>
            )}

            {book.tags && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {book.tags.map(tag => (
                  <span key={tag}
                    className="text-xs font-medium bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full border border-teal-100">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              <button className="btn-primary text-sm py-2.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Pinjam Buku
              </button>
              <button className="btn-secondary text-sm py-2.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
