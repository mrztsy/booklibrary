<<<<<<< HEAD
import { useEffect, useMemo, useState } from "react";
import BookCard from "../components/BookCard";
import BookCardSkeleton from "../components/BookCardSkeleton";
import BookModal from "../components/BookModal";
import Icon from "../components/Icon";
import { SORT_OPTIONS } from "../data/books";

const TOPICS = [
  { value: "Semua", label: "Semua", icon: "collection" },
  { value: "Fiction", label: "Fiction", icon: "bookOpen" },
  { value: "Fantasy", label: "Fantasy", icon: "star" },
  { value: "Adventure", label: "Adventure", icon: "compass" },
  { value: "Mystery", label: "Mystery", icon: "eye" },
  { value: "Romance", label: "Romance", icon: "heart" },
  { value: "Science", label: "Science", icon: "flask" },
  { value: "Chemistry", label: "Chemistry", icon: "flask" },
  { value: "Physics", label: "Physics", icon: "flask" },
  { value: "History", label: "History", icon: "globe" },
  { value: "Poetry", label: "Poetry", icon: "pen" },
];

const getBookId = (book) =>
  book?.key || book?.id || book?.workKey || book?.title;

// ✅ Terima prop books dari App
export default function LibraryPage({
  books = [],
  isLoading = false,
  fetchData,
  favoriteIds = new Set(),
  onToggleFavorite,
  onToast,
}) {
  const ITEMS_PER_PAGE = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [authorTerm, setAuthorTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Semua");
  const [submittedTopic, setSubmittedTopic] = useState("Semua");
  const [sortValue, setSortValue] = useState("default");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showLoading, setShowLoading] = useState(isLoading);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [searchMessage, setSearchMessage] = useState("");

  const activeKeyword = searchTerm.trim().toLowerCase();
  const activeAuthor = authorTerm.trim().toLowerCase();
  const searchSummary = [searchTerm.trim(), authorTerm.trim()]
    .filter(Boolean)
    .join(" / ");
  const hasSearch = searchSummary !== "";
  const selectedTopicLabel =
    TOPICS.find((topic) => topic.value === submittedTopic)?.label ||
    submittedTopic;
  const isBookFavorite = (book) => favoriteIds.has(getBookId(book));
  const getBookGenres = (book) =>
    [book.genre, ...(book.genres || []), ...(book.tags || [])].filter(Boolean);

  useEffect(() => {
    setSelectedBook(null);
    setCurrentPage(1);
    if (activeKeyword || activeAuthor || submittedTopic !== "Semua")
      setSearchMessage("");
  }, [activeKeyword, activeAuthor, submittedTopic]);

  useEffect(() => {
    let timerId;

    if (isLoading) {
      setShowLoading(true);
    } else {
      timerId = setTimeout(() => {
        setShowLoading(false);
      }, 900);
    }

    return () => clearTimeout(timerId);
  }, [isLoading]);

  const filteredBooks = books.filter((book) => {
    const searchableText = [
      book.title,
      book.genre,
      ...(book.genres || []),
      ...(book.tags || []),
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      activeKeyword === "" ||
      [book.title, book.author].join(" ").toLowerCase().includes(activeKeyword);
    const matchesAuthor =
      activeAuthor === "" ||
      (book.author || "").toLowerCase().includes(activeAuthor);
    const matchesTopic =
      submittedTopic === "Semua" ||
      searchableText.includes(submittedTopic.toLowerCase());

    return matchesSearch && matchesAuthor && matchesTopic;
  });
  const hasFilteredBooks = filteredBooks.length > 0;

  // Pagination logic
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
  const libraryStats = useMemo(() => {
    const genreCounts = filteredBooks.reduce((counts, book) => {
      getBookGenres(book).forEach((genre) => {
        counts.set(genre, (counts.get(genre) || 0) + 1);
      });
      return counts;
    }, new Map());
    const popularGenre = [...genreCounts.entries()].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    )[0];
    const topRatedBooks = [...filteredBooks]
      .filter((book) => Number(book.rating) > 0)
      .sort((a, b) => Number(b.rating) - Number(a.rating))
      .slice(0, 5);

    return {
      totalBooks: filteredBooks.length,
      availableBooks: filteredBooks.filter((book) => book.available).length,
      borrowedBooks: filteredBooks.filter((book) => !book.available).length,
      popularGenre,
      topRatedBooks,
    };
  }, [filteredBooks]);
  const statCards = [
    {
      label: "Total Buku",
      value: libraryStats.totalBooks,
      icon: "collection",
      className: "bg-[#173F3A] text-white",
    },
    {
      label: "Buku Tersedia",
      value: libraryStats.availableBooks,
      icon: "check",
      className: "bg-[#177E8E] text-white",
    },
    {
      label: "Buku Dipinjam",
      value: libraryStats.borrowedBooks,
      icon: "bookmark",
      className: "bg-[#A33B2F] text-white",
    },
    {
      label: "Genre Terpopuler",
      value: libraryStats.popularGenre?.[0] || "-",
      helper: libraryStats.popularGenre
        ? `${libraryStats.popularGenre[1]} buku`
        : "Belum ada data",
      icon: "tag",
      className: "bg-[#8B4F2F] text-white",
    },
  ];

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const hasKeyword = searchTerm.trim() !== "";
    const hasAuthor = authorTerm.trim() !== "";
    const hasTopic = selectedTopic !== "Semua";
    const hasSort = sortValue !== "default";

    if (!hasKeyword && !hasAuthor && !hasTopic && !hasSort) {
      resetLibraryFilters();
      return;
    }

    setSearchMessage("");
    setSubmittedTopic(selectedTopic);
    fetchData?.({
      q: searchTerm.trim(),
      author: authorTerm.trim(),
      genre: selectedTopic,
      yearMin: 1800,
      minRating: 0,
      available: false,
      featured: false,
      sort: sortValue,
    });
  };

  const resetLibraryFilters = () => {
    setSearchTerm("");
    setAuthorTerm("");
    setSelectedTopic("Semua");
    setSubmittedTopic("Semua");
    setSortValue("default");
    setCurrentPage(1);
    setSearchMessage("");
    fetchData?.(null);
    onToast?.(
      "Pencarian direset",
      "Katalog API kembali menampilkan semua hasil.",
      "info",
    );
  };

  const searchPopularBooks = () => {
    setSearchTerm("popular");
    setAuthorTerm("");
    setSelectedTopic("Semua");
    setSubmittedTopic("Semua");
    setSortValue("rating-desc");
    setCurrentPage(1);
    setSearchMessage("");
    fetchData?.({
      q: "popular",
      author: "",
      genre: "Semua",
      yearMin: 1800,
      minRating: 0,
      available: false,
      featured: false,
      sort: "rating-desc",
    });
    onToast?.(
      "Mencari buku populer",
      "Katalog menampilkan hasil dengan kata kunci populer.",
      "info",
    );
  };

  return (
    <>
      <section
        id="katalog"
        aria-labelledby="library-heading"
        className="border-y border-accent/70 bg-primary py-12 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="section-label text-accent mb-2">
                Data Langsung dari API
              </p>
              <h2
                id="library-heading"
                className="font-playfair font-bold text-3xl lg:text-4xl leading-tight"
              >
                Perpustakaan Digital
              </h2>
              <p className="font-crimson text-white/60 mt-2 text-lg">
                Sumber: <span className="text-accent">Open Library API</span>
              </p>
            </div>
            <div
              className="flex items-center gap-2 text-sm font-crimson text-white/50
                            bg-white/5 border border-white/10 px-4 py-2 rounded-lg"
            >
              {/* ✅ status aktif karena sudah fetch */}
              <span
                className={`w-2 h-2 rounded-full bg-accent ${
                  showLoading ? "animate-ping" : ""
                }`}
                aria-hidden="true"
              />
              {showLoading ? "Mengambil data..." : "Fetch API aktif"}
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Form pencarian katalog API"
        className="border-b border-borderSoft bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <form
            action="#"
            method="get"
            noValidate
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(260px,1fr)_auto] lg:items-start"
          >
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary"
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
                    Cari judul buku
                  </label>
                  <input
                    id="api-search"
                    type="search"
                    name="search"
                    placeholder="Cari judul buku..."
                    autoComplete="off"
                    aria-invalid={searchMessage ? "true" : undefined}
                    aria-describedby={
                      searchMessage ? "api-search-message" : undefined
                    }
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="input-field pl-9"
                  />
                </div>

                <div>
                  <label htmlFor="api-author" className="sr-only">
                    Cari nama penulis
                  </label>
                  <input
                    id="api-author"
                    type="text"
                    name="author"
                    placeholder="Cari penulis..."
                    autoComplete="off"
                    value={authorTerm}
                    onChange={(event) => setAuthorTerm(event.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="api-sort" className="sr-only">
                    Urutkan hasil
                  </label>
                  <select
                    id="api-sort"
                    name="sort"
                    className="select-field"
                    value={sortValue}
                    onChange={(event) => setSortValue(event.target.value)}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {searchMessage && (
                <p
                  id="api-search-message"
                  className="text-sm font-semibold text-accentHover"
                >
                  {searchMessage}
                </p>
              )}

              <fieldset className="flex flex-wrap items-center gap-2">
                <legend className="sr-only">Pilih topik buku</legend>
                {TOPICS.map((t) => (
                  <label key={t.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="topic"
                      value={t.value}
                      checked={selectedTopic === t.value}
                      onChange={(event) => setSelectedTopic(event.target.value)}
                      className="sr-only peer"
                    />
                    <span
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border
                                     border-borderSoft bg-white px-3 py-2 text-xs font-semibold
                                     font-crimson text-textSecondary transition-all duration-300
                                     hover:border-accent hover:text-accentHover
                                     peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white"
                    >
                      <Icon name={t.icon} className="w-3.5 h-3.5" />
                      {t.label}
                    </span>
                  </label>
                ))}
              </fieldset>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <button
                type="submit"
                className="btn-primary min-h-11 whitespace-nowrap"
              >
                <Icon name="search" className="w-4 h-4" strokeWidth={2} />
                Cari
              </button>
              {(searchTerm ||
                authorTerm ||
                selectedTopic !== "Semua" ||
                sortValue !== "default") && (
                <button
                  type="button"
                  className="btn-secondary min-h-11 whitespace-nowrap"
                  onClick={resetLibraryFilters}
                >
                  Reset
                </button>
              )}
            </div>
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
              className="font-playfair font-semibold text-xl text-textMain"
            >
              Topik:{" "}
              <span className="text-amber-700">{selectedTopicLabel}</span>
              <span className="font-crimson font-normal text-base text-slate-400 ml-2">
                · Halaman {currentPage}
              </span>
            </h2>
            {hasSearch && (
              <p className="font-crimson text-sm text-textSecondary mt-1">
                Hasil pencarian untuk "{searchSummary}"
              </p>
            )}
          </div>
          <div
            className="flex items-center gap-2 text-sm font-crimson text-textSecondary
                          bg-white border border-borderSoft px-3 py-1.5 rounded-lg"
          >
            <Icon name="collection" className="w-4 h-4 text-accent" />
            {/* ✅ pakai books.length bukan PLACEHOLDER_BOOKS */}
            {startIndex + 1}-{Math.min(endIndex, filteredBooks.length)} dari{" "}
            {filteredBooks.length} buku
          </div>
          <div
            className="inline-flex rounded-lg border border-borderSoft bg-white p-1 shadow-book"
            aria-label="Ubah mode tampilan katalog"
          >
            {[
              { value: "grid", label: "Grid View", icon: "collection" },
              { value: "list", label: "List View", icon: "bookOpen" },
            ].map((view) => (
              <button
                key={view.value}
                type="button"
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                  viewMode === view.value
                    ? "bg-primary text-white"
                    : "text-textSecondary hover:bg-cream hover:text-accentHover"
                }`}
                aria-pressed={viewMode === view.value}
                onClick={() => setViewMode(view.value)}
              >
                <Icon name={view.icon} className="h-3.5 w-3.5" />
                {view.label}
              </button>
            ))}
          </div>
        </div>

        {/* ✅ render dari prop books, bukan PLACEHOLDER_BOOKS */}
        {showLoading ? (
          <div className="mb-10" role="status" aria-live="polite">
            {viewMode === "grid" ? (
              <div className="book-grid">
                {Array.from({ length: 8 }, (_, index) => (
                  <BookCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {Array.from({ length: 8 }, (_, index) => (
                  <BookCardSkeleton key={index} variant="list" />
                ))}
              </div>
            )}
            <span className="sr-only">
              Mengambil data dari Open Library API...
            </span>
          </div>
        ) : hasFilteredBooks ? (
          viewMode === "grid" ? (
            <div className="book-grid mb-10">
              {paginatedBooks.map((book, i) => (
                <BookCard
                  key={book.key || book.id || i}
                  book={book}
                  index={i}
                  onSelect={setSelectedBook}
                  isFavorite={isBookFavorite(book)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="mb-10 space-y-3">
              {paginatedBooks.map((book, i) => {
                const bookGenres = [...new Set(getBookGenres(book))];
                const synopsis =
                  book.synopsis ||
                  book.description ||
                  "Deskripsi pendek buku belum tersedia.";

                return (
                  <article
                    key={book.key || book.id || i}
                    className="book-card grid grid-cols-[5rem_minmax(0,1fr)] gap-3 p-3 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:items-center"
                  >
                    <button
                      type="button"
                      className="h-28 overflow-hidden rounded-md bg-cream sm:h-36"
                      onClick={() => setSelectedBook(book)}
                    >
                      {book.cover ? (
                        <img
                          src={book.cover}
                          alt={`Sampul buku ${book.title}`}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center p-2 text-center text-xs font-semibold text-textSecondary">
                          {book.title}
                        </span>
                      )}
                    </button>

                    <div className="min-w-0 self-center">
                      <p className="section-label mb-1 truncate">
                        {bookGenres.slice(0, 2).join(" / ") || "General"}
                      </p>
                      <h3 className="font-playfair text-base font-bold leading-snug text-textMain line-clamp-2 sm:text-lg">
                        {book.title}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-textSecondary sm:text-sm">
                        <span className="line-clamp-1 font-semibold">
                          {book.author || "Penulis tidak diketahui"}
                        </span>
                        <span className="hidden text-borderSoft sm:inline">
                          /
                        </span>
                        <span>{book.year || "-"}</span>
                        <span className="text-borderSoft">/</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-accentHover">
                          <Icon
                            name="star"
                            className="h-3.5 w-3.5 text-accent"
                          />
                          {book.rating || "-"}
                        </span>
                      </div>
                      <p className="book-list-description mt-2 text-sm leading-relaxed text-textSecondary">
                        {synopsis}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {bookGenres.slice(0, 4).map((genre) => (
                          <span key={genre} className="genre-chip">
                            <span className="genre-chip-text">{genre}</span>
                          </span>
                        ))}
                        <span
                          className={`status-chip ${
                            book.available
                              ? ""
                              : "status-chip-borrowed"
                          }`}
                        >
                          {book.available ? "Tersedia" : "Dipinjam"}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-2 grid grid-cols-2 gap-2 sm:col-span-1 sm:flex sm:flex-wrap sm:justify-end">
                      <button
                        type="button"
                        className={`min-h-9 px-3 py-1.5 text-xs sm:text-sm ${
                          isBookFavorite(book)
                            ? "btn-favorite-active"
                            : "btn-favorite"
                        }`}
                        aria-pressed={isBookFavorite(book)}
                        onClick={() => onToggleFavorite?.(book)}
                      >
                        <Icon name="heart" className="h-3.5 w-3.5" />
                        {isBookFavorite(book) ? "Hapus" : "Favorit"}
                      </button>
                      <button
                        type="button"
                        className="btn-primary min-h-9 px-3 py-1.5 text-xs sm:text-sm"
                        onClick={() => setSelectedBook(book)}
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )
        ) : (
          <div className="rounded-lg border border-borderSoft bg-white p-8 text-center mb-10 shadow-book">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-cream text-accentHover">
              <Icon name="search" className="h-7 w-7" strokeWidth={2} />
            </div>
            <p className="font-playfair text-xl font-semibold text-textMain">
              Buku tidak ditemukan
            </p>
            <p className="mx-auto mt-2 max-w-md font-crimson text-sm text-textSecondary">
              Coba gunakan kata kunci lain, ubah genre, atau reset filter.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                className="btn-secondary"
                onClick={resetLibraryFilters}
              >
                Reset Filter
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={searchPopularBooks}
              >
                Cari Buku Populer
              </button>
            </div>
          </div>
        )}

        {/* Statistik rating — hanya muncul jika books punya field rating */}
        {hasFilteredBooks && (
          <section
            aria-labelledby="stats-heading"
            className="mb-8 overflow-hidden rounded-lg border border-borderSoft bg-white shadow-book"
          >
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
              <div className="border-b border-borderSoft p-5 sm:p-6 lg:border-b-0 lg:border-r">
                <p className="section-label mb-1">Statistik</p>
                <h3
                  id="stats-heading"
                  className="font-playfair text-2xl font-bold text-textMain"
                >
                  Ringkasan Koleksi
                </h3>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {statCards.map((stat) => (
                    <div
                      key={stat.label}
                      className={`rounded-lg p-4 shadow-sm ${stat.className}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
                            {stat.label}
                          </p>
                          <p className="mt-2 truncate font-playfair text-3xl font-extrabold leading-none">
                            {stat.value}
                          </p>
                          {stat.helper && (
                            <p className="mt-2 text-xs font-semibold text-white/70">
                              {stat.helper}
                            </p>
                          )}
                        </div>
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
                          <Icon name={stat.icon} className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <div className="mb-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="section-label mb-1">Top 5 Rating</p>
                    <h3 className="font-playfair text-xl font-bold text-textMain">
                      Rating Tertinggi
                    </h3>
                  </div>
                  <span className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-accentHover">
                    {libraryStats.topRatedBooks.length} buku
                  </span>
                </div>

                <div className="space-y-2.5">
                  {libraryStats.topRatedBooks.map((book, i) => (
                  <div
                    key={book.key || book.id || i}
                    className="top-rating-item"
                  >
                    <span className="top-rating-rank">
                      {i + 1}
                    </span>
                    <span className="top-rating-title">
                      {book.title}
                    </span>
                    <span className="top-rating-score">
                      <Icon name="star" className="h-3.5 w-3.5 text-accent" />
                      {book.rating}
                    </span>
                    <span className="sr-only">
                      ★ {book.rating}
                    </span>
                  </div>
                ))}
                  {libraryStats.topRatedBooks.length === 0 && (
                    <p className="rounded-lg border border-borderSoft bg-cream px-3 py-4 text-sm text-textSecondary">
                      Belum ada data rating untuk hasil ini.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {hasFilteredBooks && (
          <nav
            aria-label="Paginasi hasil buku"
            className="flex items-center justify-center gap-3 mt-10"
          >
            <button
              type="button"
              className="btn-secondary text-sm py-2 px-4"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(currentPage - 1);
                document
                  .getElementById("katalog")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              ← Sebelumnya
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      page === currentPage
                        ? "bg-primary text-white"
                        : "bg-white border border-borderSoft text-textSecondary hover:border-primary hover:text-primary"
                    }`}
                    onClick={() => {
                      setCurrentPage(page);
                      document
                        .getElementById("katalog")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>
            <button
              type="button"
              className="btn-secondary text-sm py-2 px-4"
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage(currentPage + 1);
                document
                  .getElementById("katalog")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Berikutnya →
            </button>
          </nav>
        )}
      </section>

      <BookModal
        key={selectedBook?.key || selectedBook?.id || "empty-book-modal"}
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        isFavorite={isBookFavorite(selectedBook)}
        onToggleFavorite={onToggleFavorite}
        onToast={onToast}
      />
    </>
  );
=======
import { useState, useEffect } from 'react'
import axios from 'axios'
import BookCard from '../components/BookCard'
import BookModal from '../components/BookModal'
import LoadingSpinner from '../components/LoadingSpinner'
import Icon from '../components/Icon'

const API_URL = 'https://gutendex.com/books'

export default function LibraryPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [topic, setTopic] = useState('fiction')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasNext, setHasNext] = useState(false)

  const TOPICS = [
    { value: 'fiction', label: 'Fiction', icon: 'bookOpen' },
    { value: 'adventure', label: 'Adventure', icon: 'compass' },
    { value: 'mystery', label: 'Mystery', icon: 'search' },
    { value: 'romance', label: 'Romance', icon: 'heart' },
    { value: 'philosophy', label: 'Philosophy', icon: 'info' },
    { value: 'science', label: 'Science', icon: 'flask' },
    { value: 'history', label: 'History', icon: 'scroll' },
    { value: 'poetry', label: 'Poetry', icon: 'pen' },
  ]

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = {
          topic,
          page,
          languages: 'en',
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim()
        }

        const response = await axios.get(API_URL, { params })
        const data = response.data

        setBooks(data.results || [])
        setTotalCount(data.count || 0)
        setHasNext(!!data.next)
      } catch (err) {
        if (axios.isCancel(err)) return
        setError('Gagal mengambil data. Periksa koneksi internet kamu.')
        console.error('Axios error:', err)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(fetchBooks, 400)
    return () => clearTimeout(debounce)
  }, [topic, page, searchQuery])

  useEffect(() => {
    setPage(1)
  }, [topic, searchQuery])

  const mapBook = (b) => ({
    id: b.id,
    title: b.title,
    author: b.authors?.[0]?.name || 'Unknown',
    authors: b.authors,
    cover: b.formats?.['image/jpeg'] || null,
    subjects: b.subjects?.slice(0, 3) || [],
    genre: b.subjects?.[0]?.split(' -- ')[0] || 'Classic',
    first_publish_year: b.copyright ? null : null,
    download_count: b.download_count,
    description: b.summaries?.[0] || `${b.title} adalah karya klasik yang tersedia di Project Gutenberg dengan ${b.download_count?.toLocaleString()} unduhan.`,
  })

  return (
    <>
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="section-label mb-2 inline-flex items-center gap-2">
                <Icon name="cloud" className="w-4 h-4" />
                Data Langsung dari API
              </p>
              <h1 className="font-extrabold text-3xl lg:text-5xl leading-tight text-ink">
                Perpustakaan Digital
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Sumber: <span className="text-amber-600 font-semibold">Gutendex API</span>
                {' '}dan Project Gutenberg
                {totalCount > 0 && (
                  <span className="ml-2 text-sm text-slate-400">
                    ({totalCount.toLocaleString()} buku tersedia)
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Koneksi API aktif
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form
          onSubmit={e => e.preventDefault()}
          className="bg-white border border-slate-200 rounded-lg shadow-book p-5 mb-8"
          aria-label="Form pencarian API"
          noValidate
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari judul atau penulis..."
                className="input-field pl-9"
                aria-label="Pencarian buku API"
              />
            </div>

            <div className="flex gap-1.5 flex-wrap">
              {TOPICS.map(t => (
                <label key={t.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="topic"
                    value={t.value}
                    checked={topic === t.value}
                    onChange={() => setTopic(t.value)}
                    className="sr-only"
                  />
                  <span className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer
                    ${topic === t.value
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-amber-200 hover:text-amber-600'
                    }`}>
                    <Icon name={t.icon} className="w-3.5 h-3.5" />
                    {t.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </form>

        {loading && <LoadingSpinner message="Mengambil data dari Gutendex API..." />}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="font-semibold text-xl text-ink mb-2">Terjadi Kesalahan</h3>
            <p className="text-slate-500 mb-4 max-w-xs">{error}</p>
            <button
              onClick={() => { setPage(1); setSearchQuery(''); setTopic('fiction') }}
              className="btn-primary text-sm"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && books.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-5 gap-4">
              <div>
                <p className="section-label">Hasil API</p>
                <h2 className="font-semibold text-xl text-ink capitalize">
                  {searchQuery ? `Hasil: "${searchQuery}"` : `Topik: ${topic}`}
                  <span className="font-normal text-base text-slate-400 ml-2">
                    - Halaman {page}
                  </span>
                </h2>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                {books.length} buku dimuat
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {books.map((b, i) => (
                <BookCard
                  key={b.id}
                  book={mapBook(b)}
                  onClick={() => setSelectedBook(mapBook(b))}
                  index={i}
                />
              ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 mb-8 shadow-book">
              <p className="section-label mb-3">Top 5 Paling Banyak Diunduh</p>
              <div className="space-y-2">
                {[...books]
                  .sort((a, b) => b.download_count - a.download_count)
                  .slice(0, 5)
                  .map(b => (
                    <div key={b.id} className="flex items-center gap-3">
                      <span className="text-sm text-slate-600 flex-1 truncate">
                        {b.title}
                      </span>
                      <div className="flex-1 max-w-32 hidden sm:block">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-700"
                            style={{
                              width: `${Math.min(100, (b.download_count / (books[0]?.download_count || 1)) * 100)}%`
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {b.download_count?.toLocaleString()} unduhan
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary text-sm py-2 px-4 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <span className="font-semibold text-ink bg-white border border-slate-200 px-4 py-2 rounded-lg">
                {page}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!hasNext}
                className="btn-secondary text-sm py-2 px-4 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Berikutnya
              </button>
            </div>
          </>
        )}

        {!loading && !error && books.length === 0 && (
          <div className="text-center py-20">
            <p className="font-semibold text-xl text-ink mb-2">Tidak ada hasil</p>
            <p className="text-slate-500">Coba kata kunci atau topik yang berbeda.</p>
          </div>
        )}
      </main>

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </>
  )
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
}
