<<<<<<< HEAD
import Icon from "./Icon";

export default function BookCard({
  book,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
}) {
  const gradients = [
    "from-primary to-secondary",
    "from-textMain to-primary",
    "from-accentHover to-primary",
    "from-primary to-accent",
  ];

  const title = book.title || "Judul tidak tersedia";
  const authors =
    book.author || book.author_name?.join(", ") || "Penulis tidak diketahui";
  const year = book.year || book.first_publish_year || "-";
  const rating = Number(book.rating) || 0;
  const coverUrl = book.cover;
  const tags = book.tags || book.subject?.slice(0, 3) || [];
  const displayGenres = [
    book.genre,
    ...(book.genres || []),
    ...tags,
  ].filter(Boolean);
  const uniqueGenres = [...new Set(displayGenres)];
  const gradient = gradients[title.charCodeAt(0) % gradients.length];

  return (
    <article
      className="book-card group mx-auto flex h-full w-full max-w-sm flex-col sm:max-w-none"
      aria-label={`Buku: ${title} oleh ${authors}`}
    >
      <figure className="relative aspect-[2/3] shrink-0 overflow-hidden border-b border-borderSoft bg-cream">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} p-5 flex items-center justify-center`}
          aria-hidden="true"
        >
          <p className="font-playfair text-white/85 text-center text-sm leading-relaxed">
            {title}
          </p>
        </div>

        {coverUrl && (
          <img
            src={coverUrl}
            alt={`Sampul buku ${title}`}
            loading="lazy"
            className="relative z-[1] h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        )}

        <figcaption className="sr-only">
          {title} - {authors}
        </figcaption>

        <span
          aria-label={book.available ? "Tersedia" : "Sedang dipinjam"}
          className={`absolute top-2 right-2 z-20 text-xs font-semibold font-crimson
                      px-2 py-0.5 rounded-full
            ${
              book.available
                ? "bg-cream text-primary"
                : "bg-accentHover text-white"
            }`}
        >
          {book.available ? "Tersedia" : "Dipinjam"}
        </span>

        {onToggleFavorite && (
          <button
            type="button"
            className={`absolute left-2 top-2 z-20 h-9 w-9 ${
              isFavorite ? "btn-favorite-icon-active" : "btn-favorite-icon"
            }`}
            aria-label={
              isFavorite
                ? `Hapus ${title} dari favorit`
                : `Simpan ${title} ke favorit`
            }
            aria-pressed={isFavorite}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite(book);
            }}
          >
            <Icon
              name="heart"
              className="h-4 w-4"
              strokeWidth={isFavorite ? 2.4 : 2}
            />
          </button>
        )}

        <div
          className="absolute inset-0 z-10 flex translate-y-2 items-center justify-center bg-primary/70
                     opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
        >
          {onSelect ? (
            <button
              type="button"
              className="btn-primary text-sm py-2 px-4"
              onClick={() => onSelect(book)}
            >
              Lihat Detail
            </button>
          ) : (
            <span className="btn-primary text-sm py-2 px-4">Lihat Detail</span>
          )}
        </div>
      </figure>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <p className="section-label mb-1 min-h-[1rem] truncate">
          {uniqueGenres.slice(0, 2).join(" / ") || "General"}
        </p>
        <h3
          className="mb-1 min-h-[2.75rem] font-playfair text-base font-semibold leading-snug
                     text-textMain line-clamp-2
                     group-hover:text-accentHover transition-colors duration-200"
        >
          {title}
        </h3>
        <p className="mb-3 font-crimson text-sm text-textSecondary line-clamp-1">
          {authors}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <div
            className="flex items-center gap-1"
            aria-label={rating ? `Rating ${rating}` : "Rating belum tersedia"}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                aria-hidden="true"
                className={`w-3 h-3 ${
                  star <= Math.round(rating) ? "text-accent" : "text-borderSoft"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-textSecondary ml-0.5 font-crimson">
              {rating || "-"}
            </span>
          </div>
          <span className="text-xs text-textSecondary font-crimson">
=======
import { useState } from 'react'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= Math.round(rating) ? 'text-amber-500' : 'text-slate-300'}`}
          fill="currentColor" viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-slate-500 ml-0.5">{rating}</span>
    </div>
  )
}

export default function BookCard({ book, onClick, index = 0, variant = 'grid' }) {
  const [imgError, setImgError] = useState(false)
  const staggerClass = `stagger-${Math.min(index + 1, 12)}`
  const isList = variant === 'list'

  // Fallback cover gradient based on title
  const gradients = [
    'from-ink to-ink-700',
    'from-ink-800 to-slate-600',
    'from-slate-800 to-amber-500',
    'from-amber-600 to-amber-500',
    'from-slate-700 to-ink',
    'from-ink-800 to-amber-600',
  ]
  const gradientClass = gradients[book.title.charCodeAt(0) % gradients.length]
  const authorName = book.authors
    ? book.authors.map(a => a.name).join(', ')
    : book.author
  const year = book.year || book.first_publish_year || '-'

  return (
    <article
      className={`book-card group fade-in-up ${staggerClass} ${isList ? 'flex min-h-36' : ''}`}
      onClick={() => onClick(book)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(book)}
      aria-label={`Lihat detail buku: ${book.title}`}
    >
      <div className={`relative overflow-hidden bg-slate-100 flex-shrink-0 ${isList ? 'w-24 sm:w-32' : 'aspect-[2/3]'}`}>
        {!imgError ? (
          <img
            src={book.cover}
            alt={`Cover buku ${book.title}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex flex-col items-center justify-center p-4`}>
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-white/40 mb-3" stroke="currentColor" strokeWidth="1.2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <p className="font-semibold text-white/80 text-center text-xs leading-relaxed line-clamp-3">
              {book.title}
            </p>
          </div>
        )}

        {/* Availability badge */}
        {'available' in book && (
          <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full
            ${book.available
              ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
              : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
            }`}>
            {book.available ? 'Tersedia' : 'Dipinjam'}
          </span>
        )}

        {/* Overlay on hover */}
        {!isList && (
          <div className="absolute inset-0 bg-ink/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="btn-primary text-sm py-2 px-4">
              Lihat Detail
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className={`p-4 ${isList ? 'flex min-w-0 flex-1 flex-col justify-center' : ''}`}>
        <p className="section-label mb-1 text-[10px]">{book.genre || book.subjects?.[0] || 'Classic'}</p>
        <h3 className={`font-semibold text-ink leading-snug line-clamp-2 mb-1 ${isList ? 'text-lg' : 'text-base'} group-hover:text-amber-600 transition-colors duration-200`}>
          {book.title}
        </h3>
        <p className="text-sm text-slate-500 mb-3 line-clamp-1">
          {authorName}
        </p>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            {'rating' in book && <StarRating rating={book.rating} />}
          </div>
          <span className="text-xs text-slate-400 ml-auto whitespace-nowrap">
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
            {year}
          </span>
        </div>

<<<<<<< HEAD
        {onToggleFavorite && (
          <button
            type="button"
            className={`mt-3 min-h-9 w-full px-3 py-2 text-xs ${
              isFavorite ? "btn-favorite-active" : "btn-favorite"
            }`}
            aria-pressed={isFavorite}
            onClick={() => onToggleFavorite(book)}
          >
            <Icon name="heart" className="h-3.5 w-3.5" strokeWidth={2} />
            {isFavorite ? "Hapus dari Favorit" : "Simpan ke Favorit"}
          </button>
        )}

        {uniqueGenres.length > 0 && (
          <div className="mt-3 flex min-h-[1.5rem] flex-wrap gap-1">
            {uniqueGenres.slice(0, 4).map((tag) => (
              <span key={tag} className="genre-chip">
                <span className="genre-chip-text">{tag}</span>
=======
        {book.tags && !isList && (
          <div className="flex flex-wrap gap-1 mt-3">
            {book.tags.slice(0, 2).map(tag => (
              <span key={tag}
                className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {tag}
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
}
