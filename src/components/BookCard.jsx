export default function BookCard({ book, index = 0, onSelect }) {
  const gradients = [
    "from-primary to-secondary",
    "from-textMain to-primary",
    "from-accentHover to-primary",
    "from-primary to-accent",
  ];
  const title = book.title || "Judul tidak tersedia";
  const author = book.author || "Penulis tidak diketahui";
  const rating = Number(book.rating || 0);
  const gradient = gradients[title.charCodeAt(0) % gradients.length];

  return (
    <article
      className="book-card group"
      aria-label={`Buku: ${title} oleh ${author}`}
    >
      <figure className="relative aspect-[2/3] overflow-hidden border-b border-borderSoft bg-cream">
        <img
          src={book.cover}
          alt={`Sampul buku ${title}`}
          loading="lazy"
          className="w-full h-full object-cover
                     transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient}
                         flex items-center justify-center p-4 -z-0`}
        >
          <p className="font-playfair text-white/80 text-center text-xs leading-relaxed">
            {title}
          </p>
        </div>

        <figcaption className="sr-only">
          {book.title} — {book.author}
        </figcaption>
        <span
          aria-label={book.available ? "Tersedia" : "Sedang dipinjam"}
          className={`absolute top-2 right-2 text-xs font-semibold font-crimson
                      px-2 py-0.5 rounded-full
            ${
              book.available
                ? "bg-cream text-primary"
                : "bg-accentHover text-white"
            }`}
        >
          {book.available ? "Tersedia" : "Dipinjam"}
        </span>

        <div
          className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100
                        transition-opacity duration-300 flex items-center justify-center z-10"
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

      <div className="p-4">
        <p className="section-label mb-1">{book.genre}</p>
        <h3
          className="font-playfair font-semibold text-textMain leading-snug
                       line-clamp-2 mb-1 text-base
                       group-hover:text-accentHover transition-colors duration-200"
        >
          {title}
        </h3>
        <p className="font-crimson text-sm text-textSecondary mb-3 line-clamp-1">
          {author}
        </p>

        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-1"
            aria-label={`Rating ${rating}`}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                aria-hidden="true"
                className={`w-3 h-3 ${
                  star <= Math.round(rating)
                    ? "text-accent"
                    : "text-borderSoft"
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
            {book.year}
          </span>
        </div>

        {book.tags && (
          <div className="flex flex-wrap gap-1 mt-3">
            {book.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-crimson bg-cream
                           text-secondary px-2 py-0.5 rounded-full"
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
