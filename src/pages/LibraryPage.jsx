import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import BookModal from "../components/BookModal";
import Icon from "../components/Icon";

const TOPICS = [
  { value: "fiction", label: "Fiction", icon: "bookOpen" },
  { value: "adventure", label: "Adventure", icon: "compass" },
  { value: "mystery", label: "Mystery", icon: "eye" },
  { value: "romance", label: "Romance", icon: "heart" },
  { value: "philosophy", label: "Philosophy", icon: "scroll" },
  { value: "science", label: "Science", icon: "flask" },
  { value: "history", label: "History", icon: "globe" },
  { value: "poetry", label: "Poetry", icon: "pen" },
];

// ✅ Terima prop books dari App
export default function LibraryPage({ books = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("fiction");
  const [selectedBook, setSelectedBook] = useState(null);

  const selectedTopicLabel =
    TOPICS.find((topic) => topic.value === selectedTopic)?.label || "Fiction";
  const activeKeyword = debouncedSearchTerm.trim().toLowerCase();
  const hasSearch = activeKeyword !== "";

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    setSelectedBook(null);
  }, [debouncedSearchTerm, selectedTopic]);

  const filteredBooks = books.filter((book) => {
    const searchableText = [
      book.title,
      book.author,
      book.genre,
      ...(book.tags || []),
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      activeKeyword === "" || searchableText.includes(activeKeyword);
    const matchesTopic =
      selectedTopic === "fiction" ||
      searchableText.includes(selectedTopic.toLowerCase());

    return matchesSearch && matchesTopic;
  });
  const hasFilteredBooks = filteredBooks.length > 0;

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <section
        id="katalog"
        aria-labelledby="library-heading"
        className="bg-gradient-to-br from-ink to-ink-700 text-white py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="section-label text-amber-300 mb-2">
                Data Langsung dari API
              </p>
              <h1
                id="library-heading"
                className="font-playfair font-bold text-3xl lg:text-4xl leading-tight"
              >
                Perpustakaan Digital
              </h1>
              <p className="font-crimson text-white/60 mt-2 text-lg">
                Sumber: <span className="text-amber-300">Open Library API</span>
              </p>
            </div>
            <div
              className="flex items-center gap-2 text-sm font-crimson text-white/50
                            bg-white/5 border border-white/10 px-4 py-2 rounded-lg"
            >
              <span
                className="w-2 h-2 rounded-full bg-emerald-400"
                aria-hidden="true"
              />
              {/* ✅ status aktif karena sudah fetch */}
              Fetch API aktif
            </div>
          </div>
        </div>
      </section>

      {/* Form pencarian (UI only) */}
      <section
        aria-label="Form pencarian katalog API"
        className="border-b border-slate-200 bg-white sticky top-[73px] z-30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form
            action="#"
            method="get"
            noValidate
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <label htmlFor="api-search" className="sr-only">
                Cari judul atau penulis
              </label>
              <input
                id="api-search"
                type="search"
                name="search"
                placeholder="Cari judul atau penulis..."
                autoComplete="off"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="input-field pl-9"
              />
            </div>

            <button type="submit" className="btn-primary whitespace-nowrap">
              <Icon name="search" className="w-4 h-4" strokeWidth={2} />
              Cari
            </button>
            {searchTerm && (
              <button
                type="button"
                className="btn-secondary whitespace-nowrap"
                onClick={() => setSearchTerm("")}
              >
                Reset
              </button>
            )}
          </form>
        </div>
      </section>

      <section
        aria-labelledby="results-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <p className="section-label">Hasil API</p>
            <h2
              id="results-heading"
              className="font-playfair font-semibold text-xl text-ink"
            >
              Topik:{" "}
              <span className="text-amber-700">{selectedTopicLabel}</span>
              <span className="font-crimson font-normal text-base text-slate-400 ml-2">
                · Halaman 1
              </span>
            </h2>
            {hasSearch && (
              <p className="font-crimson text-sm text-slate-500 mt-1">
                Hasil pencarian untuk "{debouncedSearchTerm}"
              </p>
            )}
          </div>
          <div
            className="flex items-center gap-2 text-sm font-crimson text-slate-500
                          bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg"
          >
            <Icon name="collection" className="w-4 h-4 text-amber-500" />
            {/* ✅ pakai books.length bukan PLACEHOLDER_BOOKS */}
            {filteredBooks.length} dari {books.length} buku
          </div>
        </div>

        {/* ✅ render dari prop books, bukan PLACEHOLDER_BOOKS */}
        {hasFilteredBooks ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mb-10">
            {filteredBooks.map((book, i) => (
              <BookCard
                key={book.key || book.id || i}
                book={book}
                index={i}
                onSelect={setSelectedBook}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center mb-10">
            <p className="font-playfair text-lg font-semibold text-ink">
              Buku tidak ditemukan
            </p>
            <p className="font-crimson text-sm text-slate-500 mt-1">
              Coba ubah kata kunci atau pilih topik lain.
            </p>
          </div>
        )}

        {/* Statistik rating — hanya muncul jika books punya field rating */}
        {filteredBooks.some((b) => b.rating) && (
          <section
            aria-labelledby="stats-heading"
            className="bg-parchment-100 border border-parchment-200 rounded-lg p-6 mb-8"
          >
            <p className="section-label mb-1">Statistik</p>
            <h3
              id="stats-heading"
              className="font-playfair font-semibold text-ink mb-5"
            >
              Top 5 Rating Tertinggi
            </h3>
            <div className="space-y-3">
              {[...filteredBooks]
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 5)
                .map((book, i) => (
                  <div key={book.key || i} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-bold text-slate-400 font-crimson">
                      {i + 1}
                    </span>
                    <span className="font-crimson text-sm text-slate-700 flex-1 truncate">
                      {book.title}
                    </span>
                    <span className="text-xs text-slate-400 font-crimson whitespace-nowrap">
                      ★ {book.rating}
                    </span>
                  </div>
                ))}
            </div>
          </section>
        )}
      </section>

      <BookModal
        key={selectedBook?.key || selectedBook?.id || "empty-book-modal"}
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}
