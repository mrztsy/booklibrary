import { useState } from "react";

export default function BookModal({ book, onClose = () => {} }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isBorrowed, setIsBorrowed] = useState(false);

  if (!book) return null;

  const title = book.title || "Judul tidak tersedia";
  const author = book.author || "Penulis tidak diketahui";
  const isAvailable = book.available && !isBorrowed;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70"
      role="dialog"
      aria-modal="true"
      aria-label={`Detail buku: ${title}`}
      onClick={onClose}
    >
      <div
        className="bg-parchment-50 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-48 flex-shrink-0 bg-slate-200">
            {book.cover ? (
              <img
                src={book.cover}
                alt={`Sampul ${title}`}
                className="w-full sm:h-full object-cover max-h-56 sm:max-h-none"
              />
            ) : (
              <div className="min-h-56 h-full flex items-center justify-center bg-gradient-to-br from-amber-800 to-stone-700 p-5">
                <p className="font-playfair text-white/80 text-center text-sm">
                  {title}
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 p-6">
            <div className="flex items-start justify-between gap-4 mb-2">
              <p className="section-label">{book.genre}</p>
              <button
                type="button"
                className="text-slate-400 hover:text-ink transition-colors"
                aria-label="Tutup detail buku"
                onClick={onClose}
              >
                x
              </button>
            </div>

            <h2 className="font-playfair font-bold text-2xl text-ink leading-tight mb-1">
              {title}
            </h2>
            <p className="font-crimson text-slate-500 mb-4">
              oleh <span className="font-semibold text-ink">{author}</span>
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: "Tahun", value: book.year },
                { label: "Halaman", value: `${book.pages} hal` },
                { label: "Status", value: isAvailable ? "Tersedia" : "Dipinjam" },
                { label: "Rating", value: `${book.rating} / 5.0` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-parchment-100 rounded-lg px-3 py-2">
                  <p className="text-xs text-slate-400 font-crimson">{label}</p>
                  <p className="font-playfair font-semibold text-ink text-sm">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="btn-primary text-sm py-2.5"
                disabled={!isAvailable}
                onClick={() => setIsBorrowed(true)}
              >
                {isBorrowed ? "Sudah Dipinjam" : "Pinjam Buku"}
              </button>
              <button
                type="button"
                className="btn-secondary text-sm py-2.5"
                onClick={() => setIsSaved((current) => !current)}
              >
                {isSaved ? "Tersimpan" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
