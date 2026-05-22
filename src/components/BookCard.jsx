export default function BookCard({ book, index = 0 }) {
  const gradients = [
    "from-amber-800 to-amber-600",
    "from-stone-800 to-stone-600",
    "from-emerald-900 to-emerald-700",
    "from-blue-900 to-blue-700",
    "from-rose-900 to-rose-700",
    "from-violet-900 to-violet-700",
  ];

  const coverId = book.cover_i;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : null;

  const title = book.title || "Judul tidak tersedia";
  const authors = book.author_name?.join(", ") || "Penulis tidak diketahui";
  const year = book.first_publish_year || "—";
  const subjects = book.subject?.slice(0, 3).join(", ") || "—";

  const gradient = gradients[title.charCodeAt(0) % gradients.length];
  return (
    <article
      className="book-card group"
      aria-label={`Buku: ${book.title} oleh ${book.author}`}
    >
      <figure className="relative aspect-[2/3] overflow-hidden bg-slate-100">
        <div className="bg-gray-100 h-52 flex items-center justify-center overflow-hidden">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
              <span className="text-sm">No Cover</span>
            </div>
          )}
        </div>

        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient}
                         flex items-center justify-center p-4 -z-0`}
        >
          <p className="font-playfair text-white/80 text-center text-xs leading-relaxed">
            {title}
          </p>
        </div>

        <figcaption className="sr-only">
          {title} — {authors}
        </figcaption>
        <span
          aria-label={book.available ? "Tersedia" : "Sedang dipinjam"}
          className={`absolute top-2 right-2 text-xs font-semibold font-crimson
                      px-2 py-0.5 rounded-full
            ${
              book.available
                ? "bg-emerald-100 text-emerald-800"
                : "bg-red-100 text-red-800"
            }`}
        >
          {book.available ? "Tersedia" : "Dipinjam"}
        </span>

        <div
          className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100
                        transition-opacity duration-300 flex items-center justify-center z-10"
        >
          <span className="btn-primary text-sm py-2 px-4">Lihat Detail</span>
        </div>
      </figure>

      <div className="p-4">
        <p className="section-label mb-1">{book.genre}</p>
        <h3
          className="font-playfair font-semibold text-ink leading-snug
                       line-clamp-2 mb-1 text-base
                       group-hover:text-amber-700 transition-colors duration-200"
        >
          {title}
        </h3>
        <p className="font-crimson text-sm text-slate-500 mb-3 line-clamp-1">
          {authors}
        </p>

        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-1"
            aria-label={`Rating ${book.rating}`}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                aria-hidden="true"
                className={`w-3 h-3 ${
                  star <= Math.round(book.rating)
                    ? "text-amber-500"
                    : "text-slate-200"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-slate-500 ml-0.5 font-crimson">
              {book.rating}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-crimson">
            {book.year}
          </span>
        </div>

        {book.tags && (
          <div className="flex flex-wrap gap-1 mt-3">
            {book.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-crimson bg-parchment-100
                           text-ink-600 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
