
export default function BookModal({ book }) {
  if (!book) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70"
      role="dialog"
      aria-modal="true"
      aria-label={`Detail buku: ${book.title}`}
    >
      <div className="bg-parchment-50 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row">

          <div className="sm:w-48 flex-shrink-0 bg-slate-200">
            <img
              src={book.cover}
              alt={`Sampul ${book.title}`}
              className="w-full sm:h-full object-cover max-h-56 sm:max-h-none"
            />
          </div>

          <div className="flex-1 p-6">
            <p className="section-label mb-2">{book.genre}</p>
            <h2 className="font-playfair font-bold text-2xl text-ink leading-tight mb-1">
              {book.title}
            </h2>
            <p className="font-crimson text-slate-500 mb-4">
              oleh <span className="font-semibold text-ink">{book.author}</span>
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'Tahun',   value: book.year },
                { label: 'Halaman', value: `${book.pages} hal` },
                { label: 'Status',  value: book.available ? 'Tersedia' : 'Dipinjam' },
                { label: 'Rating',  value: `${book.rating} / 5.0` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-parchment-100 rounded-lg px-3 py-2">
                  <p className="text-xs text-slate-400 font-crimson">{label}</p>
                  <p className="font-playfair font-semibold text-ink text-sm">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button type="button" className="btn-primary text-sm py-2.5">
                Pinjam Buku
              </button>
              <button type="button" className="btn-secondary text-sm py-2.5">
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
