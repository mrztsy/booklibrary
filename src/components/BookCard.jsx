import { useState } from 'react'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= Math.round(rating) ? 'text-teal-500' : 'text-slate-300'}`}
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
    'from-teal-700 to-cyan-600',
    'from-slate-800 to-slate-600',
    'from-emerald-700 to-teal-600',
    'from-indigo-700 to-sky-600',
    'from-rose-700 to-orange-500',
    'from-violet-700 to-fuchsia-600',
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
              ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200'
              : 'bg-red-100 text-red-800 ring-1 ring-red-200'
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
        <h3 className={`font-semibold text-ink leading-snug line-clamp-2 mb-1 ${isList ? 'text-lg' : 'text-base'} group-hover:text-teal-700 transition-colors duration-200`}>
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
            {year}
          </span>
        </div>

        {book.tags && !isList && (
          <div className="flex flex-wrap gap-1 mt-3">
            {book.tags.slice(0, 2).map(tag => (
              <span key={tag}
                className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
