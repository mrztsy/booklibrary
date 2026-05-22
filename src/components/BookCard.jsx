export default function BookCard({ book, index = 0, onSelect }) {
  const gradients = [
    "from-amber-800 to-amber-600",
    "from-stone-800 to-stone-600",
    "from-emerald-900 to-emerald-700",
    "from-blue-900 to-blue-700",
    "from-rose-900 to-rose-700",
    "from-violet-900 to-violet-700",
  ];

  const coverUrl = book.cover;

  console.log(book);

  const title = book.title || "Judul tidak tersedia";
  const authors = book.author_name?.join(", ") || "Penulis tidak diketahui";
  const year = book.first_publish_year || "—";
  const subjects = book.subject?.slice(0, 3).join(", ") || "—";

  const gradient = gradients[title.charCodeAt(0) % gradients.length];
  return (
    <article
      className="book-card group"
      aria-label={`Buku: ${title} oleh ${authors}`}
    >
      <figure className="relative aspect-[2/3] overflow-hidden bg-slate-100">
        <img
          src={coverUrl}
          alt={`Sampul buku ${title}`}
          loading="lazy"
          className="w-full h-full object-cover
                     transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        <div>
          <img src={coverUrl} alt="" />
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
          className="font-playfair font-semibold text-ink leading-snug
                       line-clamp-2 mb-1 text-base
                       group-hover:text-amber-700 transition-colors duration-200"
        >
          {title}
        </h3>
        <p className="font-crimson text-sm text-slate-500 mb-3 line-clamp-1">
          {authors}
        </p>

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
