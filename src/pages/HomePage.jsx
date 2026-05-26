<<<<<<< HEAD
import { useEffect, useMemo, useState } from "react";
import BookCard from "../components/BookCard";
import BookCardSkeleton from "../components/BookCardSkeleton";
import BookModal from "../components/BookModal";
import SearchFilter from "../components/SearchFilter";
import Icon from "../components/Icon";
import { GENRES } from "../data/books";

const getBookId = (book) => book?.key || book?.id || book?.workKey || book?.title;

const getNumericYear = (book) => {
  const year = Number(book?.year || book?.first_publish_year);
  return Number.isFinite(year) ? year : 0;
};

const getRecommendationGenres = (book) =>
  [book?.genre, ...(book?.genres || []), ...(book?.tags || [])].filter(Boolean);

const getRecommendedBooks = (books, limit = 5) => {
  if (books.length === 0) return [];

  const genreCounts = books.reduce((counts, book) => {
    getRecommendationGenres(book).forEach((genre) => {
      counts.set(genre, (counts.get(genre) || 0) + 1);
    });
    return counts;
  }, new Map());

  const years = books.map(getNumericYear).filter(Boolean);
  const newestYear = years.length > 0 ? Math.max(...years) : 0;
  const oldestYear = years.length > 0 ? Math.min(...years) : newestYear;
  const yearRange = Math.max(newestYear - oldestYear, 1);
  const maxGenreCount = Math.max(...genreCounts.values(), 1);

  return [...books]
    .map((book, index) => {
      const rating = Number(book.rating) || 0;
      const year = getNumericYear(book);
      const genres = getRecommendationGenres(book);
      const genrePopularity =
        genres.length > 0
          ? Math.max(...genres.map((genre) => genreCounts.get(genre) || 0))
          : 0;

      const score =
        (rating / 5) * 40 +
        (year ? ((year - oldestYear) / yearRange) * 25 : 0) +
        (genrePopularity / maxGenreCount) * 20 +
        (book.available ? 15 : 0);

      return { book, index, score, rating, year };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.rating !== a.rating) return b.rating - a.rating;
      if (b.year !== a.year) return b.year - a.year;
      if (a.book.available !== b.book.available) return a.book.available ? -1 : 1;
      return a.index - b.index;
    })
    .slice(0, limit)
    .map(({ book }) => book);
};

export default function HomePage({
  books = [],
  featuredSourceBooks = books,
  error,
  fetchData,
  isLoading = false,
  favoriteIds = new Set(),
  onToggleFavorite,
  onToast,
}) {
  const ITEMS_PER_PAGE = 12;
  const [filters, setFilters] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [collectionView, setCollectionView] = useState("grid");
  const [currentPageCollection, setCurrentPageCollection] = useState(1);
  const [filterResetSignal, setFilterResetSignal] = useState(0);
  const [filterExternalValues, setFilterExternalValues] = useState(null);

  const filtered = filters
    ? books
        .filter((book) => {
          if (
            filters.q &&
            !book.title.toLowerCase().includes(filters.q.toLowerCase())
          )
            return false;
          if (
            filters.author &&
            !book.author.toLowerCase().includes(filters.author.toLowerCase())
          )
            return false;
          if (
            filters.genre !== "Semua" &&
            ![book.genre, ...(book.genres || [])].includes(filters.genre)
          )
            return false;
          if (book.year !== "-" && book.year < filters.yearMin) return false;
          if (book.rating < filters.minRating) return false;
          if (filters.available && !book.available) return false;
          if (filters.featured && !book.featured) return false;
          return true;
        })
        .sort((a, b) => {
          if (filters.sort === "title-asc")
            return a.title.localeCompare(b.title);
          if (filters.sort === "title-desc")
            return b.title.localeCompare(a.title);
          if (filters.sort === "rating-desc") return b.rating - a.rating;
          if (filters.sort === "year-desc") return b.year - a.year;
          if (filters.sort === "year-asc") return a.year - b.year;
          return 0;
        })
    : books;

  // Pagination logic for collection
  const totalPagesCollection = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndexCollection = (currentPageCollection - 1) * ITEMS_PER_PAGE;
  const endIndexCollection = startIndexCollection + ITEMS_PER_PAGE;
  const paginatedFiltered = filtered.slice(
    startIndexCollection,
    endIndexCollection,
  );

  const featuredBooks = useMemo(
    () => getRecommendedBooks(featuredSourceBooks),
    [featuredSourceBooks],
  );
  const heroBook = featuredBooks[activeHeroIndex] || featuredBooks[0];
  const editorBook = heroBook;
  const totalAuthors = new Set(books.map((book) => book.author)).size;
  const totalGenres = GENRES.filter((genre) => genre !== "Semua").length;
  const isBookFavorite = (book) => favoriteIds.has(getBookId(book));

  const resetCollectionFilters = () => {
    setFilters(null);
    setFilterExternalValues(null);
    setFilterResetSignal((current) => current + 1);
    fetchData(null);
    onToast?.(
      "Filter direset",
      "Koleksi buku kembali ke tampilan awal.",
      "info",
    );
  };

  const searchPopularBooks = () => {
    const popularFilters = {
      q: "popular",
      author: "",
      genre: "Semua",
      yearMin: 1800,
      minRating: 0,
      available: false,
      featured: false,
      sort: "rating-desc",
    };

    setFilters(popularFilters);
    setFilterExternalValues({ ...popularFilters });
    fetchData(popularFilters);
    onToast?.(
      "Mencari buku populer",
      "Kami memuat rekomendasi populer dari katalog.",
      "info",
    );
  };

  useEffect(() => {
    setActiveHeroIndex(0);
    setCurrentPageCollection(1);
  }, [featuredBooks.length]);

  useEffect(() => {
    if (featuredBooks.length <= 1) return undefined;

    const timerId = setInterval(() => {
      setActiveHeroIndex((current) => (current + 1) % featuredBooks.length);
    }, 4500);

    return () => clearInterval(timerId);
  }, [featuredBooks.length]);

  if (!heroBook && isLoading) {
    return (
      <>
        <section
          id="beranda"
          aria-label="Memuat beranda"
          className="relative min-h-[calc(100vh-76px)] overflow-hidden border-b border-accent/60 bg-primary text-white"
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,26,24,0.9),rgba(10,26,24,0.62),rgba(20,18,16,0.35))]" />
          <div className="relative mx-auto flex min-h-[calc(100vh-140px)] max-w-7xl items-center px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] lg:gap-14">
              <div className="max-w-3xl animate-pulse">
                <div className="mb-4 h-4 w-44 rounded-full bg-accent/50" />
                <div className="mb-3 h-12 max-w-xl rounded-full bg-white/20 sm:h-14" />
                <div className="mb-6 h-12 max-w-lg rounded-full bg-white/15 sm:h-14" />
                <div className="mb-4 h-5 max-w-md rounded-full bg-white/15" />
                <div className="mb-8 h-4 max-w-2xl rounded-full bg-white/10" />
                <div className="flex gap-3">
                  <div className="h-11 w-32 rounded-lg bg-accent/60" />
                  <div className="h-11 w-32 rounded-lg bg-white/20" />
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="aspect-[2/3] w-44 animate-pulse rounded-lg border border-white/15 bg-white/20 shadow-2xl sm:w-52 lg:w-64" />
              </div>
            </div>
          </div>
        </section>

        <section
          id="koleksi"
          aria-label="Memuat koleksi buku"
          className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
        >
          <div className="mb-6">
            <p className="section-label">Koleksi Buku</p>
            <h2 className="font-playfair text-2xl font-bold text-textMain">
              Memuat Buku
            </h2>
          </div>
          <div className="book-grid">
            {Array.from({ length: 6 }, (_, index) => (
              <BookCardSkeleton key={index} />
            ))}
          </div>
        </section>
      </>
    );
  }

  if (!heroBook) {
    return (
      <section
        id="beranda"
        className="min-h-[60vh] flex items-center justify-center bg-cream px-4"
      >
        <div className="max-w-md rounded-lg border border-borderSoft bg-white p-6 text-center shadow-book">
          <p className="section-label mb-2">Koleksi Buku</p>
          <h1 className="font-playfair text-2xl font-bold text-textMain mb-2">
            Data buku belum tersedia
          </h1>
          <p className="font-crimson text-textSecondary">
            Tunggu sebentar sampai data dari API selesai dimuat.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id="beranda"
        aria-labelledby="hero-heading"
        className="relative min-h-[calc(100vh-76px)] overflow-hidden border-b border-accent/60 bg-transparent text-white"
      >
        <div
          key={`hero-bg-${heroBook.key || heroBook.id || activeHeroIndex}`}
          className="hero-bg-motion absolute inset-0 bg-cover bg-center opacity-85 blur-xl"
          style={{
            backgroundImage: heroBook.cover ? `url(${heroBook.cover})` : "none",
          }}
          aria-hidden="true"
        />
        <div
          key={`hero-bg-clear-${heroBook.key || heroBook.id || activeHeroIndex}`}
          className="hero-bg-clear absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage: heroBook.cover ? `url(${heroBook.cover})` : "none",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,rgba(255,255,255,0.16),transparent_30%),linear-gradient(90deg,rgba(10,26,24,0.78),rgba(10,26,24,0.52),rgba(20,18,16,0.28))]"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/20" />

        <div className="relative mx-auto flex min-h-[calc(100vh-140px)] max-w-7xl items-center px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] lg:gap-14">
            <div
              key={`hero-copy-${heroBook.key || heroBook.id || activeHeroIndex}`}
              className="hero-copy-motion max-w-3xl"
            >
              <p className="section-label mb-3 text-accent">
                Buku Pilihan Minggu Ini
              </p>
              <h1
                id="hero-heading"
                className="mb-5 max-w-2xl font-playfair text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl"
              >
                {heroBook.title}
              </h1>
              <p className="mb-6 max-w-xl border-l-2 border-accent pl-4 text-base text-white/82 sm:text-lg">
                oleh{" "}
                <span className="text-accent font-semibold">
                  {heroBook.author}
                </span>
                <span className="mx-2 text-white/30">-</span>
                <span>{heroBook.year}</span>
              </p>
              <p className="mb-6 max-w-2xl text-sm leading-relaxed text-white/70 line-clamp-3 sm:text-base">
                {heroBook.synopsis ||
                  heroBook.description ||
                  "Deskripsi buku belum tersedia dari katalog Open Library."}
              </p>
              <div className="mb-8 flex min-h-[2rem] flex-wrap gap-2">
                {(heroBook.genres || heroBook.tags || [heroBook.genre])
                  .filter(Boolean)
                  .slice(0, 4)
                  .map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-semibold text-white/75"
                    >
                      {genre}
                    </span>
                  ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="#/koleksi" className="btn-primary">
                  <Icon name="eye" className="w-4 h-4" strokeWidth={2} />
                  Lihat Koleksi
                </a>
                <a href="#/katalog" className="btn-secondary text-primary">
                  <Icon name="cloud" className="w-4 h-4" />
                  Katalog API
                </a>
                <button
                  type="button"
                  className={`px-5 py-2.5 font-crimson ${
                    isBookFavorite(heroBook)
                      ? "btn-favorite-active"
                      : "btn-favorite"
                  }`}
                  aria-pressed={isBookFavorite(heroBook)}
                  onClick={() => onToggleFavorite?.(heroBook)}
                >
                  <Icon name="heart" className="h-4 w-4" strokeWidth={2} />
                  {isBookFavorite(heroBook)
                    ? "Hapus dari Favorit"
                    : "Simpan ke Favorit"}
                </button>
              </div>
              {featuredBooks.length > 1 && (
                <div
                  className="mt-8 flex items-center gap-2"
                  aria-label="Pilih buku unggulan"
                >
                  {featuredBooks.map((book, index) => (
                    <button
                      key={book.key || book.id || index}
                      type="button"
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        index === activeHeroIndex
                          ? "w-9 bg-accent"
                          : "w-2.5 bg-white/30 hover:bg-white/60"
                      }`}
                      aria-label={`Tampilkan ${book.title}`}
                      aria-current={index === activeHeroIndex}
                      onClick={() => setActiveHeroIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center lg:justify-end">
              <figure
                key={`hero-cover-${heroBook.key || heroBook.id || activeHeroIndex}`}
                className="hero-cover-motion relative w-44 sm:w-52 lg:w-64"
              >
                {heroBook.cover ? (
                  <img
                    src={heroBook.cover}
                    alt={`Sampul buku ${heroBook.title}`}
                    className="aspect-[2/3] w-full rounded-lg border border-white/15 object-cover shadow-2xl transition-transform duration-700 ease-out hover:scale-[1.03]"
                  />
                ) : (
                  <div className="aspect-[2/3] w-full rounded-lg border border-white/10 bg-gradient-to-br from-primary to-secondary p-5 shadow-2xl flex items-center justify-center">
                    <p className="font-playfair text-white/80 text-center text-sm">
                      {heroBook.title}
                    </p>
                  </div>
                )}
                <figcaption className="absolute -bottom-4 -right-4 bg-white text-textMain px-3 py-1.5 rounded-lg shadow-book flex items-center gap-2">
                  <Icon name="star" className="w-4 h-4 text-accent" />
                  <span className="font-playfair font-bold text-lg">
                    {heroBook.rating}
                  </span>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-white/[0.06] backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-3">
              {[
                {
                  icon: "collection",
                  label: "Total Koleksi",
                  value: books.length,
                },
                { icon: "users", label: "Penulis", value: totalAuthors },
                { icon: "tag", label: "Genre", value: totalGenres },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 shadow-sm sm:py-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-accent sm:h-11 sm:w-11">
                    <Icon name={stat.icon} className="w-4 h-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-playfair text-2xl font-extrabold leading-none text-white sm:text-3xl">
                      {stat.value}
                    </span>
                    <span className="mt-1 block truncate font-crimson text-xs text-white/60 sm:text-sm">
                      {stat.label}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="featured-heading"
        className="border-b border-borderSoft bg-white py-12"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="section-label">Pilihan Editor</p>
            <h2
              id="featured-heading"
              className="font-playfair text-2xl font-bold text-textMain"
            >
              Buku Unggulan
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.85fr)]">
            <article className="book-card grid gap-5 p-4 sm:grid-cols-[12rem_minmax(0,1fr)] lg:p-5">
              <div className="relative overflow-hidden rounded-lg bg-cream">
                {editorBook.cover ? (
                  <img
                    src={editorBook.cover}
                    alt={`Sampul buku ${editorBook.title}`}
                    className="aspect-[2/3] h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex aspect-[2/3] h-full w-full items-center justify-center bg-gradient-to-br from-primary to-secondary p-5 text-center text-sm font-semibold text-white/80">
                    {editorBook.title}
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white shadow-book">
                  Paling Direkomendasikan
                </span>
              </div>

              <div className="flex min-w-0 flex-col">
                <div className="mb-3 flex flex-wrap gap-2">
                  {(editorBook.genres || editorBook.tags || [editorBook.genre])
                    .filter(Boolean)
                    .slice(0, 3)
                    .map((genre) => (
                      <span
                        key={genre}
                        className="rounded-full border border-borderSoft bg-cream px-3 py-1 text-xs font-semibold text-secondary"
                      >
                        {genre}
                      </span>
                    ))}
                </div>

                <h3 className="font-playfair text-2xl font-bold leading-tight text-textMain">
                  {editorBook.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-textSecondary">
                  {editorBook.author || "Penulis tidak diketahui"}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-textSecondary">
                  <span className="inline-flex items-center gap-1 font-semibold text-accentHover">
                    <Icon name="star" className="h-4 w-4 text-accent" />
                    {editorBook.rating || "-"}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-borderSoft" />
                  <span>{editorBook.year || "-"}</span>
                  <span className="h-1 w-1 rounded-full bg-borderSoft" />
                  <span>{editorBook.genre || "General"}</span>
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-textSecondary">
                  {editorBook.synopsis ||
                    editorBook.description ||
                    "Deskripsi pendek buku belum tersedia dari katalog Open Library."}
                </p>

                <div className="mt-auto pt-5">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setSelectedBook(editorBook)}
                  >
                    <Icon name="eye" className="h-4 w-4" strokeWidth={2} />
                    Lihat Detail
                  </button>
                </div>
              </div>
            </article>

            <div className="space-y-3">
              {featuredBooks.map((book, index) => (
                <button
                  key={book.key || book.id || index}
                  type="button"
                  className={`book-card grid w-full grid-cols-[4.5rem_minmax(0,1fr)] gap-3 p-2.5 text-left transition-all ${
                    index === activeHeroIndex
                      ? "border-accent"
                      : "hover:border-accent"
                  }`}
                  aria-label={`Tampilkan buku unggulan ${book.title}`}
                  aria-pressed={index === activeHeroIndex}
                  onClick={() => setActiveHeroIndex(index)}
                >
                  <div className="h-24 overflow-hidden rounded-md bg-cream">
                    {book.cover ? (
                      <img
                        src={book.cover}
                        alt={`Sampul buku ${book.title}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center p-2 text-center text-[10px] font-semibold text-textSecondary">
                        {book.title}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 self-center">
                    <h3 className="font-playfair text-sm font-bold leading-snug text-textMain line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="mt-1 text-xs text-textSecondary line-clamp-1">
                      {book.author || "Penulis tidak diketahui"}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-textSecondary">
                      <span className="inline-flex items-center gap-1 font-semibold text-accentHover">
                        <Icon name="star" className="h-3.5 w-3.5 text-accent" />
                        {book.rating || "-"}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 font-semibold ${
                          book.available
                            ? "bg-cream text-primary"
                            : "bg-accentHover text-white"
                        }`}
                      >
                        {book.available ? "Tersedia" : "Dipinjam"}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
=======
import { useState, useEffect } from 'react'
import BookCard from '../components/BookCard'
import BookModal from '../components/BookModal'
import SearchFilter from '../components/SearchFilter'
import Icon from '../components/Icon'
import { LOCAL_BOOKS, GENRES, SORT_OPTIONS } from '../data/books'

const DEFAULT_FILTERS = {
  query: '',
  genre: 'Semua Genre',
  sort: 'default',
  yearMin: 1800,
  minRating: 0,
  onlyAvailable: false,
  onlyFeatured: false,
}

function StatBadge({ icon, label, value, dark = false }) {
  return (
    <div className="px-4 py-4 flex items-center gap-3">
      <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${dark ? 'bg-white/10 text-amber-200' : 'bg-amber-50 text-amber-600'}`}>
        <Icon name={icon} className="w-4 h-4" />
      </span>
      <span>
        <span className={`block text-2xl font-extrabold leading-none ${dark ? 'text-white' : 'text-ink'}`}>{value}</span>
        <span className={`block text-xs font-medium mt-1 ${dark ? 'text-white/60' : 'text-slate-500'}`}>{label}</span>
      </span>
    </div>
  )
}

export default function HomePage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [selectedBook, setSelectedBook] = useState(null)
  const [filteredBooks, setFilteredBooks] = useState(LOCAL_BOOKS)
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    let result = [...LOCAL_BOOKS]

    if (filters.query.trim()) {
      const q = filters.query.toLowerCase()
      result = result.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.tags || []).some(t => t.toLowerCase().includes(q))
      )
    }

    if (filters.genre !== 'Semua Genre') {
      result = result.filter(b => b.genre === filters.genre)
    }

    result = result.filter(b => b.year >= filters.yearMin)
    result = result.filter(b => b.rating >= filters.minRating)

    if (filters.onlyAvailable) result = result.filter(b => b.available)
    if (filters.onlyFeatured) result = result.filter(b => b.featured)

    switch (filters.sort) {
      case 'title_asc': result.sort((a, b) => a.title.localeCompare(b.title)); break
      case 'title_desc': result.sort((a, b) => b.title.localeCompare(a.title)); break
      case 'year_asc': result.sort((a, b) => a.year - b.year); break
      case 'year_desc': result.sort((a, b) => b.year - a.year); break
      case 'rating_desc': result.sort((a, b) => b.rating - a.rating); break
      case 'pages_asc': result.sort((a, b) => a.pages - b.pages); break
      default: break
    }

    setFilteredBooks(result)
  }, [filters])

  const featuredBooks = LOCAL_BOOKS.filter(b => b.featured)
  const [heroIndex, setHeroIndex] = useState(0)
  const heroBook = featuredBooks[heroIndex]

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(i => (i + 1) % featuredBooks.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [featuredBooks.length])

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-800 bg-ink text-white" aria-label="Featured books">
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center opacity-45 blur-2xl"
          style={{ backgroundImage: `url(${heroBook.cover})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/60" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(245,158,11,0.22),transparent_34%)]" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
            <div>
              <p className="section-label mb-3 text-amber-300">Buku Pilihan Minggu Ini</p>
              <h1 className="font-playfair font-extrabold text-4xl lg:text-6xl text-white leading-tight mb-4 max-w-2xl">
                {heroBook.title}
              </h1>
              <p className="text-slate-200 text-lg mb-3">
                oleh <span className="text-amber-200 font-semibold">{heroBook.author}</span>
                <span className="mx-2 text-white/30">-</span>
                <span>{heroBook.year}</span>
              </p>
              <p className="text-slate-300 leading-relaxed mb-8 max-w-xl line-clamp-3">
                {heroBook.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => setSelectedBook(heroBook)} className="btn-primary">
                  <Icon name="eye" className="w-4 h-4" strokeWidth={2} />
                  Lihat Detail
                </button>
              </div>

              <div className="flex gap-2 mt-8">
                {featuredBooks.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300
                      ${i === heroIndex ? 'w-8 bg-amber-300' : 'w-2 bg-white/15 hover:bg-white/30'}`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative w-64">
                <img
                  key={heroBook.id}
                  src={heroBook.cover}
                  alt={heroBook.title}
                  className="w-full rounded-lg border border-white/10 shadow-2xl"
                  style={{ animation: 'fadeInUp 0.4s ease-out' }}
                  onError={e => { e.target.style.display = 'none' }}
                />
                <div className="absolute -bottom-4 -right-4 bg-white/95 text-ink border border-white/30 px-3 py-1.5 rounded-lg shadow-book backdrop-blur">
                  <span className="font-bold text-lg flex items-center gap-2">
                    <Icon name="star" className="w-4 h-4 text-amber-500" />
                    Rating {heroBook.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-white/[0.06] backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 divide-x divide-white/10">
              <StatBadge icon="collection" label="Total Koleksi" value="12+" dark />
              <StatBadge icon="users" label="Penulis" value="12" dark />
              <StatBadge icon="tag" label="Genre" value="8" dark />
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      <section
        id="koleksi"
        aria-labelledby="koleksi-heading"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside aria-label="Panel filter buku" className="lg:self-start">
            <SearchFilter
              onChange={(values) => {
                setFilters(values);
              }}
              onFilter={(values) => {
                setFilters(values);
                fetchData(values);
              }}
              onToast={onToast}
              resetSignal={filterResetSignal}
              externalValues={filterExternalValues}
            />
          </aside>

          {isLoading ? (
            <div className="min-w-0 flex-1" role="status" aria-live="polite">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="section-label">Koleksi Buku</p>
                  <h2
                    id="koleksi-heading"
                    className="font-playfair text-2xl font-bold text-textMain"
                  >
                    Memuat Buku
                  </h2>
                </div>
              </div>

              {collectionView === "grid" ? (
                <div className="book-grid">
                  {Array.from({ length: 6 }, (_, index) => (
                    <BookCardSkeleton key={index} />
                  ))}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {Array.from({ length: 6 }, (_, index) => (
                    <BookCardSkeleton key={index} variant="list" />
                  ))}
                </div>
              )}

              <span className="sr-only">Mengambil data buku...</span>
            </div>
          ) : filtered.length > 0 ? (
            <div className="min-w-0 flex-1">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="section-label">Koleksi Buku</p>
                  <h2
                    id="koleksi-heading"
                    className="font-playfair text-2xl font-bold text-textMain"
                  >
                    Semua Buku
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-crimson text-sm text-textSecondary">
                    Menampilkan{" "}
                    <span className="font-semibold text-accentHover">
                      {startIndexCollection + 1}-
                      {Math.min(endIndexCollection, filtered.length)}
                    </span>{" "}
                    dari{" "}
                    <span className="font-semibold">{filtered.length}</span>{" "}
                    buku
                  </p>
                  <div
                    className="inline-flex rounded-lg border border-borderSoft bg-white p-1 shadow-book"
                    aria-label="Ubah mode tampilan koleksi"
                  >
                    {[
                      { value: "grid", label: "Grid View", icon: "collection" },
                      { value: "list", label: "List View", icon: "bookOpen" },
                    ].map((view) => (
                      <button
                        key={view.value}
                        type="button"
                        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                          collectionView === view.value
                            ? "bg-primary text-white"
                            : "text-textSecondary hover:bg-cream hover:text-accentHover"
                        }`}
                        aria-pressed={collectionView === view.value}
                        onClick={() => setCollectionView(view.value)}
                      >
                        <Icon name={view.icon} className="h-3.5 w-3.5" />
                        {view.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {collectionView === "grid" ? (
                <div className="book-grid">
                  {paginatedFiltered.map((book, i) => (
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
                <div className="space-y-2.5">
                  {paginatedFiltered.map((book, i) => {
                    const bookGenres = [
                      book.genre,
                      ...(book.genres || []),
                      ...(book.tags || []),
                    ].filter(Boolean);
                    const uniqueBookGenres = [...new Set(bookGenres)];
                    const synopsis =
                      book.synopsis ||
                      book.description ||
                      "Deskripsi pendek buku belum tersedia.";

                    return (
                      <article
                        key={book.key || book.id || i}
                        className="book-card group grid grid-cols-[5rem_minmax(0,1fr)] gap-3 p-3 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:items-center"
                      >
                        <button
                          type="button"
                          className="relative h-28 overflow-hidden rounded-md bg-cream sm:h-36"
                          onClick={() => setSelectedBook(book)}
                        >
                          {book.cover ? (
                            <img
                              src={book.cover}
                              alt={`Sampul buku ${book.title}`}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                            />
                          ) : (
                            <span className="flex h-full items-center justify-center p-3 text-center text-xs font-semibold text-textSecondary">
                              {book.title}
                            </span>
                          )}
                        </button>

                        <div className="min-w-0 self-center">
                          <p className="section-label mb-1 truncate">
                            {uniqueBookGenres.slice(0, 2).join(" / ") ||
                              "General"}
                          </p>
                          <h3 className="font-playfair text-base font-bold leading-snug text-textMain line-clamp-2 group-hover:text-accentHover sm:text-lg">
                            {book.title}
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-textSecondary sm:text-sm">
                            <span className="line-clamp-1 font-semibold">
                              {book.author || "Penulis tidak diketahui"}
                            </span>
                            <span className="hidden text-borderSoft sm:inline">
                              /
                            </span>
                            <span className="font-semibold text-accent">
                              ★ {book.rating || "-"}
                            </span>
                            <span className="text-borderSoft">/</span>
                            <span>{book.year || "-"}</span>
                          </div>
                          <p className="book-list-description mt-2 text-sm leading-relaxed text-textSecondary">
                            {synopsis}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {uniqueBookGenres.slice(0, 4).map((genre) => (
                              <span key={genre} className="genre-chip">
                                <span className="genre-chip-text">
                                  {genre}
                                </span>
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

                        <div className="col-span-2 flex justify-end sm:col-span-1 sm:self-center">
                          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-end">
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
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="min-w-0 flex-1">
              <div className="rounded-lg border border-borderSoft bg-white p-8 text-center shadow-book">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-cream text-accentHover">
                  <Icon name="search" className="h-7 w-7" strokeWidth={2} />
                </div>
                <p className="font-playfair text-xl font-semibold text-textMain mb-2">
                  Buku tidak ditemukan
                </p>
                <p className="mx-auto max-w-md font-crimson text-sm text-textSecondary mb-5">
                  Coba gunakan kata kunci lain, ubah genre, atau reset filter.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={resetCollectionFilters}
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
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <nav
            aria-label="Paginasi koleksi buku"
            className="flex items-center justify-center gap-3 mt-10"
          >
            <button
              type="button"
              className="btn-secondary text-sm py-2 px-4"
              disabled={currentPageCollection === 1}
              onClick={() => {
                setCurrentPageCollection(currentPageCollection - 1);
                document
                  .getElementById("koleksi")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              ← Sebelumnya
            </button>
            <div className="flex items-center gap-2">
              {Array.from(
                { length: totalPagesCollection },
                (_, i) => i + 1,
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    page === currentPageCollection
                      ? "bg-primary text-white"
                      : "bg-white border border-borderSoft text-textSecondary hover:border-primary hover:text-primary"
                  }`}
                  onClick={() => {
                    setCurrentPageCollection(page);
                    document
                      .getElementById("koleksi")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn-secondary text-sm py-2 px-4"
              disabled={currentPageCollection === totalPagesCollection}
              onClick={() => {
                setCurrentPageCollection(currentPageCollection + 1);
                document
                  .getElementById("koleksi")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Berikutnya →
            </button>
          </nav>
        )}
      </section>

      <BookModal
        key={selectedBook?.key || selectedBook?.id || "home-book-modal"}
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        isFavorite={isBookFavorite(selectedBook)}
        onToggleFavorite={onToggleFavorite}
        onToast={onToast}
      />
    </>
  );
=======
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0" aria-label="Filter panel">
            <SearchFilter
              filters={filters}
              setFilters={setFilters}
              genres={GENRES}
              sortOptions={SORT_OPTIONS}
              onReset={() => setFilters(DEFAULT_FILTERS)}
              totalResults={filteredBooks.length}
            />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <p className="section-label">Koleksi Buku</p>
                <h2 className="font-bold text-2xl text-ink">
                  {filters.query
                    ? `Hasil untuk "${filters.query}"`
                    : filters.genre !== 'Semua Genre'
                      ? filters.genre
                      : 'Semua Buku'
                  }
                </h2>
              </div>

              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                {[
                  { mode: 'grid', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
                  { mode: 'list', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
                ].map(({ mode, icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`p-2 rounded-md transition-all duration-200
                      ${viewMode === mode ? 'bg-white shadow-sm text-amber-600' : 'text-slate-400 hover:text-ink'}`}
                    aria-label={`Tampilan ${mode}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {filteredBooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h3 className="font-semibold text-xl text-ink mb-2">Buku Tidak Ditemukan</h3>
                <p className="text-slate-500 mb-4 max-w-xs">
                  Coba ubah kata kunci atau filter yang kamu gunakan.
                </p>
                <button onClick={() => setFilters(DEFAULT_FILTERS)} className="btn-secondary text-sm">
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'flex flex-col gap-3'
              }>
                {filteredBooks.map((book, i) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onClick={setSelectedBook}
                    index={i}
                    variant={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </>
  )
>>>>>>> 33164533e4836ab043cef1baa93aaf3f007fcc38
}
