<<<<<<< HEAD
import { useEffect, useState } from "react";
import Icon from "./Icon";

const normalizeOpenLibraryDescription = (description) => {
  if (!description) return "";
  if (typeof description === "string") return description;
  if (typeof description.value === "string") return description.value;
  return "";
};

export default function BookModal({
  book,
  onClose = () => {},
  isFavorite = false,
  onToggleFavorite,
  onToast,
}) {
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [synopsis, setSynopsis] = useState("");
  const [isSynopsisLoading, setIsSynopsisLoading] = useState(false);
  const activeBookId = book?.key || book?.id || book?.workKey || book?.title;

  useEffect(() => {
    if (!book) return undefined;

    const fallbackSynopsis =
      book.synopsis ||
      book.description ||
      "Sinopsis buku belum tersedia dari katalog Open Library.";

    setSynopsis(fallbackSynopsis);

    if (!book.workKey?.startsWith("/works/")) return undefined;

    const controller = new AbortController();
    setIsSynopsisLoading(true);

    fetch(`https://openlibrary.org${book.workKey}.json`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Gagal mengambil sinopsis");
        return response.json();
      })
      .then((data) => {
        const apiSynopsis = normalizeOpenLibraryDescription(data.description);
        if (apiSynopsis) setSynopsis(apiSynopsis);
      })
      .catch((error) => {
        if (error.name !== "AbortError") setSynopsis(fallbackSynopsis);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsSynopsisLoading(false);
      });

    return () => controller.abort();
  }, [book]);

  useEffect(() => {
    setIsBorrowed(false);
  }, [activeBookId]);

  useEffect(() => {
    if (!book) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [book, onClose]);

  if (!book) return null;

  const title = book.title || "Judul tidak tersedia";
  const author = book.author || "Penulis tidak diketahui";
  const genres = [book.genre, ...(book.genres || [])].filter(Boolean);
  const uniqueGenres = [...new Set(genres)];
  const isBorrowable = book.available !== false;
  const isAvailable = isBorrowable && !isBorrowed;
  const statusLabel = isAvailable ? "Tersedia" : "Dipinjam";
  const borrowButtonLabel = !isBorrowable
    ? "Sedang Dipinjam"
    : isBorrowed
      ? "Kembalikan Buku"
      : "Pinjam Buku";
  const borrowButtonClass = !isBorrowable
    ? "btn-borrow-disabled"
    : isBorrowed
      ? "btn-return"
      : "btn-borrow";
  const bookInfo = [
    { label: "Penulis", value: author },
    { label: "Tahun Terbit", value: book.year || "-" },
    { label: "Jumlah Halaman", value: book.pages ? `${book.pages} hal` : "-" },
    {
      label: "Genre",
      value: uniqueGenres.length > 0 ? uniqueGenres.join(", ") : "General",
    },
    { label: "Rating", value: book.rating ? `${book.rating} / 5.0` : "-" },
  ];

  const handleBorrowToggle = () => {
    if (!isBorrowable && !isBorrowed) return;

    const nextBorrowed = !isBorrowed;
    setIsBorrowed(nextBorrowed);
    onToast?.(
      nextBorrowed ? "Buku dipinjam" : "Buku dikembalikan",
      title,
      "success",
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(24, 51, 47, 0.76)" }}
      role="dialog"
      aria-modal="true"
      aria-label={`Detail buku: ${title}`}
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-lg bg-cream text-textMain shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex max-h-[90vh] flex-col overflow-y-auto sm:flex-row">
          <div className="sm:w-52 flex-shrink-0 bg-borderSoft">
            {book.cover ? (
              <img
                src={book.cover}
                alt={`Sampul ${title}`}
                className="w-full sm:h-full object-cover max-h-56 sm:max-h-none"
              />
            ) : (
              <div className="min-h-56 h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-5">
                <p className="font-playfair text-white/80 text-center text-sm">
                  {title}
                </p>
=======
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
              <div className="w-full h-52 sm:h-full bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center p-6">
                <p className="font-semibold text-white/80 text-center leading-relaxed">{book.title}</p>
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
              </div>
            )}
          </div>

<<<<<<< HEAD
          <div className="flex-1 bg-cream p-6">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="section-label">
                  {uniqueGenres.slice(0, 2).join(" / ") || "General"}
                </p>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isAvailable
                      ? "bg-primary text-white"
                      : "bg-accentHover text-white"
                  }`}
                >
                  {statusLabel}
                </span>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-borderSoft bg-white px-3 py-1.5 text-sm font-semibold text-textSecondary transition-colors hover:border-accent hover:text-accentHover"
                aria-label="Tutup detail buku"
                onClick={onClose}
              >
                <Icon name="close" className="h-4 w-4" strokeWidth={2} />
                Tutup
              </button>
            </div>

            <h2 className="font-playfair font-bold text-2xl text-textMain leading-tight mb-1">
              {title}
            </h2>

            <div className="mb-5 mt-4">
              <p className="section-label mb-2">Informasi Buku</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {bookInfo.map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-lg border border-borderSoft bg-white px-3 py-2"
                  >
                    <p className="text-xs text-textSecondary font-crimson">
                      {label}
                    </p>
                    <p className="font-playfair font-semibold text-textMain text-sm">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-5 rounded-lg border border-borderSoft bg-white px-4 py-3">
              <p className="section-label mb-1">Sinopsis</p>
              <p className="text-sm leading-relaxed text-textSecondary">
                {isSynopsisLoading ? "Mengambil sinopsis buku..." : synopsis}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className={`${borrowButtonClass} px-5 py-2.5 text-sm`}
                disabled={!isBorrowable && !isBorrowed}
                onClick={handleBorrowToggle}
              >
                {borrowButtonLabel}
              </button>
              <button
                type="button"
                className={`px-5 py-2.5 text-sm ${
                  isFavorite ? "btn-favorite-active" : "btn-favorite"
                }`}
                onClick={() => onToggleFavorite?.(book)}
              >
                <Icon name="heart" className="h-4 w-4" strokeWidth={2} />
                {isFavorite ? "Hapus Favorit" : "Simpan Favorit"}
=======
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
                    className="text-xs font-medium bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full border border-amber-100">
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
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
}
